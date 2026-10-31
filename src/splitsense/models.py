"""階梯 2（Logistic Regression）與階梯 3（Gradient Boosting）。

對應研究規格 7.1、7.3。調參一律 `GridSearchCV` + `GroupKFold`，group 為
`item_id`，評分用主要指標 `Recall@10%`。
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd
from scipy import sparse
from sklearn.decomposition import TruncatedSVD
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import make_scorer
from sklearn.model_selection import GridSearchCV, GroupKFold
from sklearn.pipeline import Pipeline

from splitsense import config as cfg
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

LOGREG_GRID = {
    "clf__C": [0.01, 0.1, 1.0, 10.0],
    "clf__class_weight": [None, "balanced"],
}

GB_GRID = {
    "clf__learning_rate": [0.05, 0.1],
    "clf__max_depth": [3, None],
}

SVD_COMPONENTS = 200


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


@dataclass
class TrainingData:
    """疊加多個 reveal seed 的訓練資料。

    研究規格 7.3 警告「同一題被揭露的不同 reveal seed 可能同時落在訓練折與
    驗證折」——那句話的前提就是訓練集疊了多個 seed。否則每個 item 只出現一
    次，`GroupKFold` 會退化成一般 `KFold`。
    """

    X: sparse.csr_matrix
    y: np.ndarray
    groups: np.ndarray
    feature_names: list[str]


def stack_reveal_seeds(
    items: pd.DataFrame,
    manifests: dict[int, pd.DataFrame],
    item_ids: set[str],
    vectorizer,
    hard_only: bool,
) -> TrainingData:
    """把各 reveal seed 的資料疊成一張表。

    `hard_only=True` 只留可見 2 份一致的 row——那是模型真正被使用的時機。
    可見已不一致時該 item 必然分歧，不需要模型。
    """
    text_by_id = items.set_index("item_id")["text"]
    blocks, ys, groups = [], [], []
    for manifest in manifests.values():
        rows = manifest[manifest["item_id"].isin(item_ids)]
        if hard_only:
            rows = rows[rows["visible_agree"]]
        rows = rows.reset_index(drop=True)
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
    "GB_GRID",
    "LOGREG_GRID",
    "RECALL_SCORER",
    "TrainingData",
    "build_vectorizer",
    "gb_pipeline",
    "logreg_pipeline",
    "recall_at_budget",
    "stack_reveal_seeds",
    "tune",
    "visible_feature_coefficients",
    "visible_features",
]
