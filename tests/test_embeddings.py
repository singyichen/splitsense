"""Embedding 快取與欄序的不變量（研究規格 7.2）。

快取沿用錯誤的向量不會報錯、分數也不會變得離譜——只會變得「和上次差不多」，
所以 metadata 比對一定要有測試守著。

大部分測試注入假的 encoder，不載 2.3 GB 的模型；真的要碰模型的那一支在沒裝
`embed` extra 時用 `importorskip` 跳過。
"""

from __future__ import annotations

import json

import numpy as np
import pandas as pd
import pytest

from splitsense import config as cfg
from splitsense.embeddings import (
    SIGNATURE_KEYS,
    EmbeddingStore,
    build_embed_matrix,
    embed_feature_names,
    load_or_build,
    resolve_device,
)
from splitsense.features import VISIBLE_FEATURE_NAMES

DIM = 4
ITEM_IDS = ["a1", "b2", "c3", "d4"]
TEXTS = ["alpha", "bravo", "charlie", "delta"]


def make_encoder(log: list | None = None):
    """由文字第一個字元決定向量，方便驗證「哪一列對應哪一筆文字」。"""

    def encode(texts):
        if log is not None:
            log.append(list(texts))
        return np.array(
            [[float(ord(t[0])) + j for j in range(DIM)] for t in texts], dtype=np.float32
        )

    return encode


def build(tmp_path, log=None, item_ids=None, texts=None, **kwargs):
    params = {
        "encoder": make_encoder(log),
        "cache_dir": tmp_path,
        "model_name": "test/fake-model",
        "revision": "deadbeef",
        "dimension": DIM,
    }
    params.update(kwargs)
    return load_or_build(item_ids or ITEM_IDS, texts or TEXTS, **params)


# --- 快取 metadata 比對 ---


def test_第一次編碼會寫出向量與_metadata(tmp_path):
    log: list = []
    store, seconds = build(tmp_path, log)
    assert log == [TEXTS]
    assert seconds >= 0.0
    assert store.matrix.shape == (len(ITEM_IDS), DIM)
    assert (tmp_path / "test__fake-model.npy").exists()
    meta = json.loads((tmp_path / "test__fake-model.meta.json").read_text(encoding="utf-8"))
    for key in SIGNATURE_KEYS:
        assert key in meta, key
    # 研究規格 7.2 要求 cache 至少記下這些欄位
    for key in ("model_name", "model_revision", "dimension", "created_at", "item_ids"):
        assert key in meta
    assert meta["item_ids"] == ITEM_IDS


def test_metadata_一致時讀快取不重算(tmp_path):
    build(tmp_path)
    log: list = []
    store, seconds = build(tmp_path, log)
    assert log == [], "metadata 一致卻又編碼一次"
    assert seconds == 0.0
    assert store.matrix.shape == (len(ITEM_IDS), DIM)


@pytest.mark.parametrize(
    "override",
    [
        {"max_length": cfg.EMBED_MAX_LENGTH + 1},
        {"normalize": not cfg.EMBED_NORMALIZE},
        {"revision": "0ddba11"},
    ],
    ids=["max_length", "normalize", "revision"],
)
def test_metadata_不一致時重算(tmp_path, override):
    build(tmp_path)
    log: list = []
    build(tmp_path, log, **override)
    assert log == [TEXTS], f"{override} 改了卻沿用舊快取"


def test_item_id_順序變了也要重算(tmp_path):
    """沿用舊向量等於把向量接到錯的 item 上，而且不會報錯。"""
    build(tmp_path)
    log: list = []
    build(tmp_path, log, item_ids=ITEM_IDS[::-1], texts=TEXTS[::-1])
    assert log == [TEXTS[::-1]]


def test_force_無視快取(tmp_path):
    build(tmp_path)
    log: list = []
    build(tmp_path, log, force=True)
    assert log == [TEXTS]


def test_編碼結果形狀不符就報錯(tmp_path):
    with pytest.raises(ValueError, match="形狀"):
        load_or_build(
            ITEM_IDS,
            TEXTS,
            encoder=lambda texts: np.zeros((len(texts), DIM + 1), dtype=np.float32),
            cache_dir=tmp_path,
            model_name="test/fake-model",
            revision="deadbeef",
            dimension=DIM,
        )


def test_item_id_與文字數不一致就報錯(tmp_path):
    with pytest.raises(ValueError, match="不一致"):
        load_or_build(
            ITEM_IDS,
            TEXTS[:2],
            encoder=make_encoder(),
            cache_dir=tmp_path,
            dimension=DIM,
        )


# --- 列順序與 item_id 對齊 ---


def test_向量列順序與_item_id_對齊(tmp_path):
    store, _ = build(tmp_path)
    for item_id, text in zip(ITEM_IDS, TEXTS, strict=True):
        assert store.lookup([item_id])[0, 0] == pytest.approx(float(ord(text[0])))


def test_lookup_依給定順序取列_不是快取順序(tmp_path):
    store, _ = build(tmp_path)
    picked = store.lookup(["d4", "a1", "c3"])
    assert [v[0] for v in picked] == [float(ord("d")), float(ord("a")), float(ord("c"))]


def test_lookup_遇到未知_item_id_直接報錯(tmp_path):
    store, _ = build(tmp_path)
    with pytest.raises(KeyError, match="重建 embedding"):
        store.lookup(["不存在"])


def test_列數與_item_id_數不符就建不起來():
    with pytest.raises(ValueError, match="不一致"):
        EmbeddingStore(matrix=np.zeros((2, DIM)), item_ids=["a", "b", "c"], metadata={})


# --- 與可見標註特徵串接 ---


def fake_manifest() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "item_id": ITEM_IDS,
            "visible_labels": [
                ("neutral", "neutral"),
                ("positive", "positive"),
                ("neutral", "positive"),
                ("negative", "negative"),
            ],
            "visible_agree": [True, True, False, True],
            "z": [0, 1, 1, 0],
        }
    )


def test_串接後文字在前_可見標註在後(tmp_path):
    store, _ = build(tmp_path)
    manifest = fake_manifest()
    matrix = build_embed_matrix(manifest, store)
    assert matrix.shape == (len(ITEM_IDS), DIM + len(VISIBLE_FEATURE_NAMES))
    assert np.allclose(matrix[:, :DIM], store.lookup(manifest["item_id"]))
    assert embed_feature_names(DIM)[DIM:] == list(VISIBLE_FEATURE_NAMES)


def test_串接的列序跟著_manifest_不是快取(tmp_path):
    store, _ = build(tmp_path)
    manifest = fake_manifest().iloc[::-1].reset_index(drop=True)
    matrix = build_embed_matrix(manifest, store)
    assert matrix[0, 0] == pytest.approx(float(ord("d")))


# --- 需要真實模型 ---


def test_真實模型編碼出_1024_維且可重現():
    pytest.importorskip("sentence_transformers", reason="沒裝 embed extra")
    from splitsense.embeddings import build_encoder

    encode = build_encoder()
    first = encode(["a short comment", "another one"])
    assert first.shape == (2, cfg.EMBED_DIM)
    assert first.dtype == np.float32
    second = encode(["a short comment", "another one"])
    assert np.allclose(first, second, atol=1e-4)


def test_device_是_mps_或_cpu():
    assert resolve_device() in {"mps", "cpu", "cuda"}
