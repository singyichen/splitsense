"""特徵建立：TF-IDF 文字特徵與可見標註特徵。

對應研究規格 7.2。只能使用可見集合 O_i——隱藏標註 U_i 不得進入任何特徵
（研究規格 6.4 第 1 條）。
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from scipy import sparse
from sklearn.feature_extraction.text import TfidfVectorizer

from splitsense import config as cfg

# Q4 定案（2026-10-31）
TFIDF_PARAMS = {
    "ngram_range": (1, 2),
    "min_df": 2,
    "max_features": 50_000,
    "sublinear_tf": True,
    "strip_accents": "unicode",
    "lowercase": True,
    # 不移除 stopwords：文字中位數只有 60 字元，否定詞與程度詞本身就是分歧
    # 訊號（研究規格 8.6），拿掉等於丟資訊。
    "stop_words": None,
}

VISIBLE_FEATURE_NAMES = (
    "visible_disagree",
    "visible_entropy",
    "visible_distinct",
    "visible_vote_margin",
    *(f"visible_count_{label}" for label in cfg.LABELS),
)


def visible_features(manifest: pd.DataFrame) -> pd.DataFrame:
    """從 O_i 算出的結構化特徵。

    每一欄都只看 `visible_labels`，不碰完整的 `labels`。
    """
    labels = list(cfg.LABELS)
    visible = manifest["visible_labels"]

    counts = np.zeros((len(manifest), len(labels)), dtype=np.int16)
    for j, label in enumerate(labels):
        counts[:, j] = visible.apply(lambda ls, lbl=label: sum(1 for x in ls if x == lbl))

    r = counts.sum(axis=1, keepdims=True)
    proportions = counts / r
    # 0 * log(0) 定義為 0：只對正值取 log，其餘留 0
    logs = np.zeros_like(proportions)
    positive = proportions > 0
    logs[positive] = np.log(proportions[positive])
    entropy = -(proportions * logs).sum(axis=1) / np.log(len(labels))

    distinct = (counts > 0).sum(axis=1)
    sorted_counts = np.sort(counts, axis=1)[:, ::-1]
    vote_margin = (sorted_counts[:, 0] - sorted_counts[:, 1]) / r.ravel()

    out = pd.DataFrame(
        {
            "visible_disagree": (distinct > 1).astype(np.int8),
            "visible_entropy": entropy,
            "visible_distinct": distinct.astype(np.int8),
            "visible_vote_margin": vote_margin,
        },
        index=manifest.index,
    )
    for j, label in enumerate(labels):
        out[f"visible_count_{label}"] = counts[:, j]
    return out[list(VISIBLE_FEATURE_NAMES)]


def fit_tfidf(train_texts: pd.Series, params: dict | None = None) -> TfidfVectorizer:
    """只在 training 文字上 fit（研究規格 6.4 第 6 條：特徵不得由完整資料決定）。"""
    vectorizer = TfidfVectorizer(**(params or TFIDF_PARAMS))
    vectorizer.fit(train_texts)
    return vectorizer


def build_matrix(
    texts: pd.Series, manifest: pd.DataFrame, vectorizer: TfidfVectorizer
) -> sparse.csr_matrix:
    """串接 TF-IDF 與可見標註特徵。"""
    text_block = vectorizer.transform(texts)
    visible_block = sparse.csr_matrix(visible_features(manifest).to_numpy(dtype=np.float64))
    return sparse.hstack([text_block, visible_block], format="csr")
