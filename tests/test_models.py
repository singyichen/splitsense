"""階梯 2 與 3 的調參設定與無洩漏（研究規格 7.1、7.3）。"""

from __future__ import annotations

import numpy as np
import pytest
from sklearn.model_selection import GroupKFold

from splitsense import config as cfg
from splitsense.features import VISIBLE_FEATURE_NAMES, visible_features
from splitsense.models import (
    EMBED_LOGREG_GRID,
    GB_GRID,
    LOGREG_GRID,
    N_CV_SPLITS,
    build_vectorizer,
    recall_at_budget,
    stack_reveal_seeds,
    stack_reveal_seeds_embed,
)
from splitsense.reveal import build_reveal_manifest
from splitsense.split import build_split_manifest


def test_recall_at_budget_與手算一致():
    y = np.array([1] * 10 + [0] * 90)  # 100 筆、10 正例，K=10
    scores = np.concatenate([np.ones(10), np.zeros(90)])
    assert recall_at_budget(y, scores) == pytest.approx(1.0)
    assert recall_at_budget(y, 1 - scores) == pytest.approx(0.0)


def test_recall_at_budget_接受_predict_proba_兩欄():
    y = np.array([1, 1, 0, 0] * 25)
    proba = np.column_stack([1 - np.linspace(0, 1, 100), np.linspace(0, 1, 100)])
    assert 0.0 <= recall_at_budget(y, proba) <= 1.0


def test_無正例時回傳零():
    assert recall_at_budget(np.zeros(100, dtype=int), np.random.rand(100)) == 0.0


def test_調參格線涵蓋規格要求的超參數():
    """研究規格 7.1：LR 調 C；GB 調 learning_rate 與 max_depth。"""
    assert "clf__C" in LOGREG_GRID
    assert "clf__learning_rate" in GB_GRID
    assert "clf__max_depth" in GB_GRID


def test_embedding_格線涵蓋_PCA_維度與前處理():
    """研究規格 7.2 把「1024 維是否需要 PCA」與 normalization 列為待調研項目，
    所以兩者都要由 CV 選，不能先猜一個寫死。"""
    assert "pre__text__pca__n_components" in EMBED_LOGREG_GRID
    assert len(EMBED_LOGREG_GRID["pre__text__pca__n_components"]) >= 3
    assert "pre__text__scale" in EMBED_LOGREG_GRID
    assert "clf__C" in EMBED_LOGREG_GRID
    assert "clf__class_weight" in EMBED_LOGREG_GRID


# --- 疊加 reveal seeds 與 GroupKFold ---


@pytest.fixture(scope="module")
def stacked(table):
    split = build_split_manifest(table)
    train_ids = set(split.loc[split["split"] == "train", "item_id"])
    manifests = {s: build_reveal_manifest(table, seed=s) for s in cfg.REVEAL_SEEDS}
    vectorizer = build_vectorizer(table.items, train_ids)
    data = stack_reveal_seeds(table.items, manifests, train_ids, vectorizer, hard_only=True)
    return data, train_ids


def test_疊加後同一_item_出現多次(stacked):
    """這是 GroupKFold 有意義的前提；否則它會退化成一般 KFold。"""
    data, _ = stacked
    unique_items = len(set(data.groups))
    assert data.X.shape[0] > unique_items


def test_疊加只含_training_item(stacked):
    data, train_ids = stacked
    assert set(data.groups) <= train_ids


def test_hard_only_的_row_全是可見一致(table):
    split = build_split_manifest(table)
    train_ids = set(split.loc[split["split"] == "train", "item_id"])
    manifest = build_reveal_manifest(table, seed=0)
    rows = manifest[manifest["item_id"].isin(train_ids) & manifest["visible_agree"]]
    assert rows["visible_agree"].all()
    # hard 子集的陽性率應接近 24%，不是全體的 50%
    assert 0.20 < rows["z"].mean() < 0.30


def test_groupkfold_不讓同一_item_跨折(stacked):
    """研究規格 7.3：group 必須是 item_id，否則同一題的不同 reveal seed 會
    同時落在訓練折與驗證折，調參分數會偏高。"""
    data, _ = stacked
    cv = GroupKFold(n_splits=N_CV_SPLITS)
    for train_idx, val_idx in cv.split(data.X, data.y, groups=data.groups):
        assert not set(data.groups[train_idx]) & set(data.groups[val_idx])


def test_特徵名稱數量與矩陣欄數一致(stacked):
    data, _ = stacked
    assert len(data.feature_names) == data.X.shape[1]
    assert data.feature_names[-len(VISIBLE_FEATURE_NAMES) :] == list(VISIBLE_FEATURE_NAMES)


def test_hard_子集上四個可見特徵是常數(table):
    """只有 visible_count_* 會變動。判讀係數時必須知道這件事。"""
    manifest = build_reveal_manifest(table, seed=0)
    hard = manifest[manifest["visible_agree"]].reset_index(drop=True)
    features = visible_features(hard)
    for name in ("visible_disagree", "visible_entropy", "visible_distinct",
                 "visible_vote_margin"):
        assert features[name].nunique() == 1, name
    assert features["visible_count_neutral"].nunique() > 1


# --- 兩個階梯必須跑在同一批 row 上 ---


def test_embedding_與_tfidf_選到同一批_row(table):
    """少了這點，BGE 與 TF-IDF LR 的配對比較就不在同一份資料上。"""
    from splitsense.embeddings import EmbeddingStore

    split = build_split_manifest(table)
    train_ids = set(split.loc[split["split"] == "train", "item_id"])
    manifests = {s: build_reveal_manifest(table, seed=s) for s in cfg.REVEAL_SEEDS}
    vectorizer = build_vectorizer(table.items, train_ids)

    item_ids = [str(i) for i in table.items["item_id"]]
    store = EmbeddingStore(
        matrix=np.arange(len(item_ids) * 4, dtype=np.float32).reshape(len(item_ids), 4),
        item_ids=item_ids,
        metadata={},
    )

    tfidf = stack_reveal_seeds(table.items, manifests, train_ids, vectorizer, hard_only=True)
    embed = stack_reveal_seeds_embed(manifests, train_ids, store, hard_only=True)

    assert np.array_equal(tfidf.y, embed.y)
    assert np.array_equal(tfidf.groups, embed.groups)
    assert len(embed.feature_names) == embed.X.shape[1]
