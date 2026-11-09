"""階梯 2（Logistic Regression）、階梯 3（Gradient Boosting）與 Embedding 階梯。

對應研究規格 7.1、7.2、7.3。調參一律 `GridSearchCV` + `GroupKFold`，group 為
`item_id`，評分用主要指標 `Recall@10%`。
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd
from scipy import sparse
from sklearn.compose import ColumnTransformer
from sklearn.decomposition import PCA, TruncatedSVD
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import make_scorer
from sklearn.model_selection import GridSearchCV, GroupKFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from splitsense import config as cfg
from splitsense.embeddings import EmbeddingStore, build_embed_matrix, embed_feature_names
from splitsense.features import VISIBLE_FEATURE_NAMES, build_matrix, fit_tfidf, visible_features
from splitsense.metrics import precision_recall_at_k, rank_with_random_tiebreak

N_CV_SPLITS = 5


def recall_at_budget(y_true, y_score, budget: float = cfg.PRIMARY_BUDGET) -> float:
    """主要指標，供 GridSearchCV 評分使用。"""
    y_true = np.asarray(y_true).astype(int)
    y_score = np.asarray(y_score, dtype=float)
    if y_score.ndim == 2:  # make_scorer 在某些版本會傳整個 predict_proba
        y_score = y_score[:, 1]
    if y_true.sum() == 0:
        return 0.0
    k = max(1, int(np.floor(budget * len(y_true))))
    rng = np.random.default_rng(0)  # CV 內部評分固定 rng，讓調參可重現
    order = rank_with_random_tiebreak(y_score, rng)
    _, recall = precision_recall_at_k(y_true, order, k)
    return recall


RECALL_SCORER = make_scorer(
    recall_at_budget, response_method="predict_proba", greater_is_better=True
)

# 兩個 Logistic Regression 原本都選到格線最小值 0.01（研究規格 8.4.1），所以
# 格線往下延伸——不延伸就不知道那是最佳值還是被格線擋住。
C_GRID = [0.001, 0.003, 0.01, 0.1, 1.0, 10.0]

LOGREG_GRID = {
    "clf__C": C_GRID,
    "clf__class_weight": [None, "balanced"],
}

GB_GRID = {
    "clf__learning_rate": [0.05, 0.1],
    "clf__max_depth": [3, None],
}

SVD_COMPONENTS = 200

# Embedding 階梯的格線。PCA 維度與「PCA 前要不要逐維標準化」都交給 CV 選，
# 不先猜（研究規格 7.2 列為待調研項目：「pooling 與 normalization 是否固定、
# 1024 維是否直接輸入或需 PCA」）。
#
# L2 normalize 沒有列進格線：bge-m3 的 SentenceTransformer 組態自帶 Normalize
# 模組，向量恆為單位長度，再 normalize 一次是 no-op。可選的是 StandardScaler
# ——PCA 吃的是共變異數，逐維標準化會改變它看到的結構。
EMBED_LOGREG_GRID = {
    "pre__text__scale": ["passthrough", StandardScaler()],
    "pre__text__pca__n_components": list(cfg.PCA_COMPONENTS),
    "clf__C": C_GRID,
    "clf__class_weight": [None, "balanced"],
}


def logreg_pipeline() -> Pipeline:
    return Pipeline(
        [
            (
                "clf",
                # penalty 參數在 sklearn 1.8 已 deprecated，l2 是預設值，不再明寫
                LogisticRegression(
                    solver="liblinear", max_iter=2000, random_state=cfg.SPLIT_SEED
                ),
            )
        ]
    )


def gb_pipeline() -> Pipeline:
    """樹模型吃不下 50,000 維稀疏矩陣，先以 TruncatedSVD 降維。

    這讓它與 Logistic Regression 的輸入維度不同，判讀時要說明；研究規格 7.2
    對 Embedding 也採同樣做法（先降維再接分類器）。
    """
    return Pipeline(
        [
            ("svd", TruncatedSVD(n_components=SVD_COMPONENTS, random_state=cfg.SPLIT_SEED)),
            (
                "clf",
                HistGradientBoostingClassifier(
                    max_iter=300, early_stopping=True, random_state=cfg.SPLIT_SEED
                ),
            ),
        ]
    )


def embed_logreg_pipeline(dimension: int = cfg.EMBED_DIM) -> Pipeline:
    """Embedding → PCA → 與可見標註特徵串接 → Logistic Regression。

    結構刻意對齊 `logreg_pipeline`，讓兩者只差在文字表示（TF-IDF 對 bge-m3）。

    **PCA 必須放在 Pipeline 裡**，這樣 `GridSearchCV` 的每一折都只用訓練折
    fit 它。先把全部資料做一次 PCA 再切折，會讓 test 的共變異數結構進到特徵
    裡——那是研究規格 6.4 第 6 條禁止的，而且不會報錯。

    可見標註特徵不經過 PCA：只有 8 欄，而且每一欄都要能直接讀係數（8.4.2）。
    """
    text_branch = Pipeline(
        [
            ("scale", "passthrough"),
            (
                "pca",
                PCA(
                    n_components=cfg.PCA_COMPONENTS_DEFAULT,
                    svd_solver="randomized",
                    random_state=cfg.SPLIT_SEED,
                ),
            ),
        ]
    )
    n_visible = len(VISIBLE_FEATURE_NAMES)
    pre = ColumnTransformer(
        [
            ("text", text_branch, list(range(dimension))),
            ("visible", "passthrough", list(range(dimension, dimension + n_visible))),
        ]
    )
    return Pipeline(
        [
            ("pre", pre),
            (
                "clf",
                LogisticRegression(
                    solver="liblinear", max_iter=2000, random_state=cfg.SPLIT_SEED
                ),
            ),
        ]
    )


@dataclass
class TrainingData:
    """疊加多個 reveal seed 的訓練資料。

    研究規格 7.3 警告「同一題被揭露的不同 reveal seed 可能同時落在訓練折與
    驗證折」——那句話的前提就是訓練集疊了多個 seed。否則每個 item 只出現一
    次，`GroupKFold` 會退化成一般 `KFold`。
    """

    X: sparse.csr_matrix | np.ndarray
    y: np.ndarray
    groups: np.ndarray
    feature_names: list[str]


def iter_reveal_rows(
    manifests: dict[int, pd.DataFrame], item_ids: set[str], hard_only: bool
):
    """逐 reveal seed 取出要用的 manifest row。

    `hard_only=True` 只留可見 2 份一致的 row——那是模型真正被使用的時機。
    可見已不一致時該 item 必然分歧，不需要模型。
    """
    for manifest in manifests.values():
        rows = manifest[manifest["item_id"].isin(item_ids)]
        if hard_only:
            rows = rows[rows["visible_agree"]]
        yield rows.reset_index(drop=True)


def stack_reveal_seeds(
    items: pd.DataFrame,
    manifests: dict[int, pd.DataFrame],
    item_ids: set[str],
    vectorizer,
    hard_only: bool,
) -> TrainingData:
    """TF-IDF 版：把各 reveal seed 的資料疊成一張表。"""
    text_by_id = items.set_index("item_id")["text"]
    blocks, ys, groups = [], [], []
    for rows in iter_reveal_rows(manifests, item_ids, hard_only):
        texts = text_by_id.loc[rows["item_id"]].reset_index(drop=True)
        blocks.append(build_matrix(texts, rows, vectorizer))
        ys.append(rows["z"].to_numpy())
        groups.append(rows["item_id"].to_numpy())

    names = list(vectorizer.get_feature_names_out()) + list(VISIBLE_FEATURE_NAMES)
    return TrainingData(
        X=sparse.vstack(blocks, format="csr"),
        y=np.concatenate(ys),
        groups=np.concatenate(groups),
        feature_names=names,
    )


def stack_reveal_seeds_embed(
    manifests: dict[int, pd.DataFrame],
    item_ids: set[str],
    store: EmbeddingStore,
    hard_only: bool,
) -> TrainingData:
    """Embedding 版：同樣的 row 選法，只換文字表示。

    不需要 `items`：文字已經在編碼階段用掉了，這裡只依 item_id 取向量。
    """
    blocks, ys, groups = [], [], []
    for rows in iter_reveal_rows(manifests, item_ids, hard_only):
        blocks.append(build_embed_matrix(rows, store))
        ys.append(rows["z"].to_numpy())
        groups.append(rows["item_id"].to_numpy())

    return TrainingData(
        X=np.vstack(blocks),
        y=np.concatenate(ys),
        groups=np.concatenate(groups),
        feature_names=embed_feature_names(store.dimension),
    )


def tune(pipeline: Pipeline, grid: dict, data: TrainingData, n_jobs: int = -1) -> GridSearchCV:
    """只在訓練集內以 GroupKFold 交叉驗證，測試集最後才評估一次。"""
    search = GridSearchCV(
        pipeline,
        grid,
        scoring=RECALL_SCORER,
        cv=GroupKFold(n_splits=N_CV_SPLITS),
        n_jobs=n_jobs,
        refit=True,
        verbose=1,
    )
    search.fit(data.X, data.y, groups=data.groups)
    return search


def build_vectorizer(items: pd.DataFrame, train_ids: set[str]):
    """只在 training item 的文字上 fit（研究規格 6.4 第 6 條）。"""
    train_texts = items.loc[items["item_id"].isin(train_ids), "text"]
    return fit_tfidf(train_texts)


def visible_feature_coefficients(search: GridSearchCV, data: TrainingData) -> pd.Series | None:
    """Logistic Regression 的可見標註特徵係數，供判讀使用。"""
    clf = search.best_estimator_.named_steps.get("clf")
    if not hasattr(clf, "coef_"):
        return None
    coef = clf.coef_.ravel()
    n_visible = len(VISIBLE_FEATURE_NAMES)
    return pd.Series(coef[-n_visible:], index=list(VISIBLE_FEATURE_NAMES)).sort_values()


__all__ = [
    "C_GRID",
    "EMBED_LOGREG_GRID",
    "GB_GRID",
    "LOGREG_GRID",
    "RECALL_SCORER",
    "TrainingData",
    "build_vectorizer",
    "embed_logreg_pipeline",
    "gb_pipeline",
    "iter_reveal_rows",
    "logreg_pipeline",
    "recall_at_budget",
    "stack_reveal_seeds",
    "stack_reveal_seeds_embed",
    "tune",
    "visible_feature_coefficients",
    "visible_features",
]
