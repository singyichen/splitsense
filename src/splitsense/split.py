"""Item-level split：同一個 item 的所有 annotation 留在同一 split。

對應研究規格 6.2。不得沿用上游 split（Dataset Card 4.1）。
"""

from __future__ import annotations

import pandas as pd
from sklearn.model_selection import train_test_split

from splitsense import config as cfg
from splitsense.data import ItemTable

SPLIT_NAMES = ("train", "val", "test")


def build_split_manifest(
    table: ItemTable,
    ratios: tuple[float, float, float] = cfg.SPLIT_RATIOS,
    seed: int = cfg.SPLIT_SEED,
) -> pd.DataFrame:
    """以 item 為單位切 70/15/15，回傳 `item_id` → split 的 manifest。

    以 `z` 分層，讓三個 split 的分歧盛行率一致——否則 `Recall@K` 的分母會隨
    split 浮動，模型之間的比較失去意義。分層只用 target 的邊際分布，不洩漏
    任何個別 item 的資訊。
    """
    if abs(sum(ratios) - 1.0) > 1e-9:
        raise ValueError(f"ratios 必須加總為 1，得到 {sum(ratios)}")

    items = table.items
    train_ratio, val_ratio, test_ratio = ratios

    train_ids, rest_ids = train_test_split(
        items["item_id"],
        train_size=train_ratio,
        random_state=seed,
        shuffle=True,
        stratify=items["z"],
    )
    rest = items[items["item_id"].isin(set(rest_ids))]
    val_ids, test_ids = train_test_split(
        rest["item_id"],
        train_size=val_ratio / (val_ratio + test_ratio),
        random_state=seed,
        shuffle=True,
        stratify=rest["z"],
    )

    manifest = pd.DataFrame(
        {
            "item_id": list(train_ids) + list(val_ids) + list(test_ids),
            "split": (
                ["train"] * len(train_ids) + ["val"] * len(val_ids) + ["test"] * len(test_ids)
            ),
        }
    )
    manifest["split"] = pd.Categorical(manifest["split"], categories=SPLIT_NAMES, ordered=True)
    return manifest.sort_values("item_id", kind="stable").reset_index(drop=True)


def split_summary(items: pd.DataFrame, manifest: pd.DataFrame) -> pd.DataFrame:
    """各 split 的 item 數與分歧盛行率。"""
    merged = items.merge(manifest, on="item_id", validate="one_to_one")
    out = merged.groupby("split", observed=True).agg(
        item_數=("z", "size"), 分歧盛行率=("z", "mean")
    )
    out["佔比 (%)"] = (out["item_數"] / len(merged) * 100).round(1)
    out["分歧盛行率"] = (out["分歧盛行率"] * 100).round(2)
    return out
