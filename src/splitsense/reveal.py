"""部分標註 reveal protocol：只揭露 r 份標註，其餘隱藏。

對應研究規格 6.3。隱藏標註 U_i 絕對不得出現在特徵、統計或圖 adjacency 中
（研究規格 6.4 第 1 條）。
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from splitsense import config as cfg
from splitsense.data import ItemTable


def build_reveal_manifest(
    table: ItemTable, seed: int, reveal_size: int = cfg.REVEAL_SIZE
) -> pd.DataFrame:
    """為每個 item 抽出 r 個可見 slot，回傳 manifest。

    manifest 一列一個 item，欄位：
      - `item_id`
      - `visible_slots`：可見 annotation 的 slot（長度 r，已排序）
      - `visible_labels`：可見標籤
      - `visible_agree`：可見標籤是否完全一致
      - `z`：target，由完整 A_i 計算（研究規格第 5 章）

    同一個 seed 一定產生同一份 manifest：rng 由 (seed, item 在表中的順序) 決定，
    而 item 順序在 `build_items` 已以 item_id 排序固定。
    """
    items = table.items
    n_per_item = cfg.ANNOTATIONS_PER_ITEM
    if reveal_size >= n_per_item:
        raise ValueError(
            f"reveal_size={reveal_size} 必須小於每題標註數 {n_per_item}，否則沒有隱藏標註"
        )

    rng = np.random.default_rng(seed)
    # 一次抽完所有 item，避免逐列呼叫 rng 造成的效能問題；
    # argsort 每列獨立隨機排列，取前 reveal_size 個即為可見 slot。
    order = rng.random((len(items), n_per_item)).argsort(axis=1)
    visible = np.sort(order[:, :reveal_size], axis=1)

    labels = np.array(items["labels"].tolist())  # (n_items, n_per_item)
    visible_labels = np.take_along_axis(labels, visible, axis=1)
    visible_agree = (visible_labels == visible_labels[:, [0]]).all(axis=1)

    return pd.DataFrame(
        {
            "item_id": items["item_id"].to_numpy(),
            "visible_slots": [tuple(row) for row in visible],
            "visible_labels": [tuple(row) for row in visible_labels],
            "visible_agree": visible_agree,
            "z": items["z"].to_numpy(),
            "reveal_seed": seed,
        }
    )


def hidden_slots(manifest_row: pd.Series, n_per_item: int = cfg.ANNOTATIONS_PER_ITEM) -> tuple:
    """U_i 的 slot。僅供洩漏檢查測試使用，不得用於建立特徵。"""
    return tuple(sorted(set(range(n_per_item)) - set(manifest_row["visible_slots"])))
