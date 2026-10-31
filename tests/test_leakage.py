"""洩漏檢查：逐條對應研究規格 6.4 的七條禁止事項。

這類錯誤的特性是出錯時結果看起來更漂亮、而且不會報錯，整篇結論直接失效卻
不會被發現。所以每一條都要有測試。
"""

from __future__ import annotations

import pytest

from splitsense import config as cfg
from splitsense.reveal import build_reveal_manifest, hidden_slots

# --- 第 1 條：不得使用 test item 的隱藏標註 U_i ---


def test_reveal_manifest_只揭露_r_份(table):
    manifest = build_reveal_manifest(table, seed=0)
    sizes = manifest["visible_slots"].apply(len)
    assert (sizes == cfg.REVEAL_SIZE).all()


def test_隱藏標註非空且與可見互斥(table):
    manifest = build_reveal_manifest(table, seed=0)
    sample = manifest.head(2000)
    for _, row in sample.iterrows():
        hidden = hidden_slots(row)
        assert len(hidden) == cfg.ANNOTATIONS_PER_ITEM - cfg.REVEAL_SIZE
        assert not set(hidden) & set(row["visible_slots"])


def test_可見標籤取自正確的_slot(table):
    """visible_labels 必須真的是 visible_slots 指到的標籤，不能錯位。"""
    manifest = build_reveal_manifest(table, seed=0)
    merged = manifest.merge(table.items[["item_id", "labels"]], on="item_id")
    sample = merged.head(2000)
    for _, row in sample.iterrows():
        expected = tuple(row["labels"][s] for s in row["visible_slots"])
        assert row["visible_labels"] == expected


def test_reveal_size_必須小於每題標註數(table):
    with pytest.raises(ValueError, match="必須小於"):
        build_reveal_manifest(table, seed=0, reveal_size=cfg.ANNOTATIONS_PER_ITEM)


# --- 第 2 條：不得以完整 entropy 或 majority label 作特徵 ---

FORBIDDEN_FEATURE_NAMES = {
    "labels",
    "z",
    "n_distinct_labels",
    "H_i",
    "full_entropy",
    "majority_label",
    "n_annotations",
}


def test_manifest_不含可直接推出_target_的欄位(table):
    """manifest 可以帶 z（那是 target 本身），但不得帶完整標籤或 entropy。"""
    manifest = build_reveal_manifest(table, seed=0)
    leaked = (set(manifest.columns) & FORBIDDEN_FEATURE_NAMES) - {"z"}
    assert not leaked, f"manifest 帶了可推出 target 的欄位：{leaked}"


def test_可見資訊無法還原_target(table):
    """可見一致的 item 必須同時存在 z=0 與 z=1，否則可見資訊就等於答案。"""
    manifest = build_reveal_manifest(table, seed=0)
    agree = manifest[manifest["visible_agree"]]
    assert agree["z"].nunique() == 2
    # 可見已不一致者必然分歧，這是定義，不是洩漏
    disagree = manifest[~manifest["visible_agree"]]
    assert (disagree["z"] == 1).all()


# --- 第 7 條：標註數不得當特徵；只取恰好 3 份的子集 ---


def test_每個_item_恰好三份標註(table):
    counts = table.annotations.groupby("item_id").size()
    assert (counts == cfg.ANNOTATIONS_PER_ITEM).all()


def test_標註數本身洩漏答案_因此必須固定分母(annotations):
    """證明第 7 條的前提：分歧率隨標註數單調上升，5 份的高達 85% 以上。"""
    from splitsense.eda import leakage_by_annotation_count

    tbl = leakage_by_annotation_count(annotations)
    assert tbl.loc[cfg.ANNOTATIONS_PER_ITEM, "分歧率"] < 60.0
    assert tbl.loc[5, "分歧率"] > 80.0


# --- Item-level split：同一 item 不得跨 split（研究規格 6.2）---


def test_split_互斥且完整(table, split_manifest):
    assert len(split_manifest) == len(table.items)
    assert split_manifest["item_id"].is_unique
    assert set(split_manifest["item_id"]) == set(table.items["item_id"])


def test_同一_item_的所有_annotation_在同一_split(table, split_manifest):
    merged = table.annotations.merge(split_manifest, on="item_id", validate="many_to_one")
    per_item = merged.groupby("item_id")["split"].nunique()
    assert (per_item == 1).all()


def test_文字不跨_split(table, split_manifest):
    """去重之後，同一段文字不可能同時落在 train 與 test（研究規格 6.2）。"""
    merged = table.items.merge(split_manifest, on="item_id", validate="one_to_one")
    per_text = merged.groupby("text")["split"].nunique()
    assert (per_text == 1).all()


def test_上游_split_不可沿用(annotations):
    """Dataset Card 4.1：上游 test item 幾乎全部也出現在 train。"""
    from splitsense.eda import upstream_split_overlap

    overlap = upstream_split_overlap()
    assert overlap["test 重疊比例 (%)"] > 90.0


# --- 個資（研究規格 6.1、9.3）---


def test_author_欄位已丟棄(annotations):
    assert "author" not in annotations.columns
    assert "rater_id" not in annotations.columns


# --- 第 3 至 6 條：目前尚未實作的部分 ---


@pytest.mark.skip(reason="annotator 歷史特徵屬論文延伸，尚未實作（研究規格 4.1）")
def test_annotator_歷史只由_training_計算():
    """第 3 條。實作 Baseline 3 時啟用。"""


@pytest.mark.skip(reason="GraphSAGE 屬論文延伸選做，尚未實作（研究規格 7.5）")
def test_test_item_的_hidden_edge_不得進圖():
    """第 4、5 條。實作圖模型時啟用。"""


def test_不使用門檻版_target():
    """第 6 條：tau 只能由 training 決定；本專題固定用 z_i，不提供門檻版本。"""
    from splitsense import data

    assert not hasattr(data, "tau")
    source = (cfg.PROJECT_ROOT / "src" / "splitsense" / "data.py").read_text(encoding="utf-8")
    assert "tau" not in source
