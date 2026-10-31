"""特徵的正確性與無洩漏（研究規格 6.4 第 1、6 條、7.2）。"""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

from splitsense import config as cfg
from splitsense.features import TFIDF_PARAMS, build_matrix, fit_tfidf, visible_features
from splitsense.reveal import build_reveal_manifest


def _manifest(visible_labels: list[tuple[str, ...]]) -> pd.DataFrame:
    return pd.DataFrame({"visible_labels": visible_labels})


def test_可見一致時_entropy_為零():
    out = visible_features(_manifest([("positive", "positive"), ("neutral", "neutral")]))
    assert np.allclose(out["visible_entropy"], 0.0)
    assert (out["visible_disagree"] == 0).all()


def test_可見不一致時_entropy_為_log2_除以_log4():
    out = visible_features(_manifest([("positive", "neutral")]))
    assert out["visible_entropy"].iloc[0] == pytest.approx(np.log(2) / np.log(4))
    assert out["visible_disagree"].iloc[0] == 1


def test_票數差距與標籤計數():
    out = visible_features(_manifest([("positive", "positive"), ("positive", "negative")]))
    assert out["visible_vote_margin"].tolist() == [1.0, 0.0]
    assert out["visible_count_positive"].tolist() == [2, 1]
    assert out["visible_count_negative"].tolist() == [0, 1]


def test_特徵不受隱藏標註影響(table):
    """第 1 條最直接的測試：只改隱藏標註，特徵向量必須完全不變。"""
    manifest = build_reveal_manifest(table, seed=0).head(500)
    before = visible_features(manifest)

    # 把隱藏的那一份標註改掉——visible_labels 不動，特徵就不該動
    tampered = manifest.copy()
    tampered["z"] = 1 - tampered["z"]
    after = visible_features(tampered)
    pd.testing.assert_frame_equal(before, after)


def test_特徵欄位不含完整標註資訊(table):
    manifest = build_reveal_manifest(table, seed=0).head(100)
    out = visible_features(manifest)
    forbidden = {"z", "labels", "n_distinct_labels", "n_annotations", "H_i", "majority_label"}
    assert not set(out.columns) & forbidden


def test_tfidf_只在_training_文字上_fit():
    """第 6 條：特徵不得由完整資料決定。test 專屬的詞不能進詞彙表。"""
    train = pd.Series(["alpha beta", "beta gamma", "alpha gamma"])
    test = pd.Series(["delta epsilon"])
    vectorizer = fit_tfidf(train, params={**TFIDF_PARAMS, "min_df": 1})
    vocab = set(vectorizer.vocabulary_)
    assert "delta" not in vocab
    assert "epsilon" not in vocab
    # test 文字仍可 transform，只是全部落在未知詞 → 全零列
    assert vectorizer.transform(test).nnz == 0


def test_特徵矩陣維度等於詞彙數加可見特徵數():
    train = pd.Series(["alpha beta", "beta gamma", "alpha gamma"])
    vectorizer = fit_tfidf(train, params={**TFIDF_PARAMS, "min_df": 1})
    manifest = _manifest([("positive", "positive")] * 3)
    matrix = build_matrix(train, manifest, vectorizer)
    from splitsense.features import VISIBLE_FEATURE_NAMES

    assert matrix.shape == (3, len(vectorizer.vocabulary_) + len(VISIBLE_FEATURE_NAMES))


def test_tfidf_參數是_Q4_的定案():
    assert TFIDF_PARAMS["ngram_range"] == (1, 2)
    assert TFIDF_PARAMS["min_df"] == 2
    assert TFIDF_PARAMS["max_features"] == 50_000
    assert TFIDF_PARAMS["sublinear_tf"] is True
    # 不移除 stopwords：否定詞與程度詞本身是分歧訊號
    assert TFIDF_PARAMS["stop_words"] is None
    assert len(cfg.LABELS) == 4
