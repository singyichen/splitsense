"""下載、載入與正規化 GoEmotions（TID-8）。

對應研究規格 6.1，以及 Dataset Card 第 2 節的子集定義。
"""

from __future__ import annotations

import shutil
import ssl
import urllib.request
from dataclasses import dataclass
from pathlib import Path

import certifi
import pandas as pd

from splitsense import config as cfg


def download_raw(force: bool = False) -> dict[str, Path]:
    """把 parquet 下載到 `data/raw/`（已在 .gitignore）。

    明確用 certifi 的憑證庫：macOS 的 python.org 版 Python 不使用系統鑰匙串，
    預設的 urllib 會以 CERTIFICATE_VERIFY_FAILED 失敗。
    """
    cfg.RAW_DIR.mkdir(parents=True, exist_ok=True)
    context = ssl.create_default_context(cafile=certifi.where())
    paths = {}
    for split, filename in cfg.HF_FILES.items():
        dest = cfg.RAW_DIR / f"{cfg.HF_CONFIG}-{split}.parquet"
        if force or not dest.exists():
            url = cfg.HF_URL_TEMPLATE.format(
                repo=cfg.HF_REPO, config=cfg.HF_CONFIG, filename=filename
            )
            print(f"[data] 下載 {split} ← {url}")
            tmp = dest.with_suffix(".parquet.part")
            request = urllib.request.Request(url, headers={"User-Agent": "splitsense"})
            with urllib.request.urlopen(request, context=context) as response:  # noqa: S310
                with tmp.open("wb") as fh:
                    shutil.copyfileobj(response, fh)
            # 下載完才 rename，中斷不會留下半個檔被當成完整資料
            tmp.replace(dest)
        paths[split] = dest
    return paths


def load_annotations() -> pd.DataFrame:
    """載入全部 annotation，合併上游 train/test 並正規化欄位。

    上游的 split 不可沿用（Dataset Card 4.1：test item 有 96.0% 也出現在 train），
    所以一律合併後自行以 item_id 重切。
    """
    paths = download_raw()
    frames = [pd.read_parquet(p) for p in paths.values()]
    df = pd.concat(frames, ignore_index=True)

    df = df.drop(columns=[c for c in cfg.DROP_COLUMNS if c in df.columns])

    out = pd.DataFrame(
        {
            "item_id": df[cfg.COL_ITEM_ID].astype(str),
            "text": df[cfg.COL_TEXT].astype(str),
            "annotator_id": df[cfg.COL_ANNOTATOR_ID].astype(str),
            "label": df[cfg.COL_LABEL].astype(str),
            "subreddit": df["subreddit"].astype(str),
        }
    )
    out["language"] = "en"
    out["source_dataset"] = f"{cfg.HF_REPO}/{cfg.HF_CONFIG}"

    unknown = set(out["label"].unique()) - set(cfg.LABELS)
    if unknown:
        raise ValueError(f"未預期的標籤：{sorted(unknown)}")
    return out


@dataclass(frozen=True)
class ItemTable:
    """item 層級的表，一列一個 item。"""

    items: pd.DataFrame
    annotations: pd.DataFrame

    def __len__(self) -> int:
        return len(self.items)


def _disagreement_target(labels: list[str]) -> int:
    """z_i = 1(|{y_ia}| > 1)，研究規格第 5 章。"""
    return int(len(set(labels)) > 1)


def build_items(annotations: pd.DataFrame, dedup_text: bool = True) -> ItemTable:
    """篩出恰好 3 份標註的 item，計算 target，並處理重複文字。

    `dedup_text` 對應 Q5：同一段文字只保留一個 item。選擇「丟棄重複」而非
    「合併標註」，因為合併會讓該 item 的標註數不等於 3，與固定分母的前提衝突。
    """
    counts = annotations.groupby("item_id").size()
    keep = counts[counts == cfg.ANNOTATIONS_PER_ITEM].index
    ann = annotations[annotations["item_id"].isin(keep)].copy()

    # 固定 annotation 在 item 內的順序，讓 reveal 可以重現
    ann = ann.sort_values(["item_id", "annotator_id"], kind="stable").reset_index(drop=True)
    ann["slot"] = ann.groupby("item_id").cumcount()

    grouped = ann.groupby("item_id", sort=True)
    items = pd.DataFrame(
        {
            "text": grouped["text"].first(),
            "subreddit": grouped["subreddit"].first(),
            "labels": grouped["label"].apply(list),
        }
    ).reset_index()
    items["z"] = items["labels"].apply(_disagreement_target)
    items["n_distinct_labels"] = items["labels"].apply(lambda ls: len(set(ls)))

    if dedup_text:
        before = len(items)
        items = items.drop_duplicates(subset="text", keep="first").reset_index(drop=True)
        dropped = before - len(items)
        if dropped:
            print(f"[data] 文字去重：丟棄 {dropped} 個重複文字的 item（Q5）")
        ann = ann[ann["item_id"].isin(set(items["item_id"]))].reset_index(drop=True)

    return ItemTable(items=items, annotations=ann)
