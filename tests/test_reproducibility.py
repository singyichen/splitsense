"""重現性：固定 seed 重跑必須得到相同的 split 與 reveal（研究規格 8.4）。"""

from __future__ import annotations

import pandas as pd

from splitsense import config as cfg
from splitsense.reveal import build_reveal_manifest
from splitsense.split import build_split_manifest


def test_split_同_seed_重跑一致(table, split_manifest):
    again = build_split_manifest(table)
    pd.testing.assert_frame_equal(split_manifest, again)


def test_split_不同_seed_會變(table, split_manifest):
    other = build_split_manifest(table, seed=cfg.SPLIT_SEED + 1)
    assert not split_manifest["split"].equals(other["split"])


def test_split_比例符合設定(table, split_manifest):
    frac = split_manifest["split"].value_counts(normalize=True)
    for name, expected in zip(("train", "val", "test"), cfg.SPLIT_RATIOS, strict=True):
        assert abs(frac[name] - expected) < 0.005


def test_split_分歧盛行率三邊一致(table, split_manifest):
    merged = table.items.merge(split_manifest, on="item_id", validate="one_to_one")
    prev = merged.groupby("split", observed=True)["z"].mean()
    assert prev.max() - prev.min() < 0.01


def test_reveal_同_seed_重跑一致(table):
    a = build_reveal_manifest(table, seed=3)
    b = build_reveal_manifest(table, seed=3)
    pd.testing.assert_frame_equal(a, b)


def test_reveal_不同_seed_產生不同可見集合(table):
    a = build_reveal_manifest(table, seed=0)
    b = build_reveal_manifest(table, seed=1)
    assert not a["visible_slots"].equals(b["visible_slots"])
    # 但 target 不隨 seed 改變：z 由完整 A_i 決定
    assert a["z"].equals(b["z"])


def test_所有_reveal_seed_的難題陽性率穩定(table):
    rates = []
    for seed in cfg.REVEAL_SEEDS:
        m = build_reveal_manifest(table, seed=seed)
        agree = m[m["visible_agree"]]
        rates.append(agree["z"].mean())
    assert max(rates) - min(rates) < 0.02
