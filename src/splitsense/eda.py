"""重現 Dataset Card 第 3 節的全部統計（Q10）。

2026-10-19 的 EDA 只留下散文數字、沒有腳本。本模組讓那些數字可以重跑、
可以畫圖，也成為簡報第 3 段的素材來源。
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from splitsense import config as cfg
from splitsense.data import ItemTable


def _quantiles(s: pd.Series) -> dict[str, float]:
    return {
        "min": float(s.min()),
        "q1": float(s.quantile(0.25)),
        "median": float(s.median()),
        "mean": round(float(s.mean()), 1),
        "q3": float(s.quantile(0.75)),
        "p95": float(s.quantile(0.95)),
        "max": float(s.max()),
    }


def basic_stats(annotations: pd.DataFrame, table: ItemTable) -> dict:
    """對應 Dataset Card 3 的統計表。"""
    items, ann = table.items, table.annotations
    per_annotator = ann.groupby("annotator_id").size()
    text_len = items["text"].str.len()
    return {
        "全體 annotation 數（未篩選）": int(len(annotations)),
        "全體 item 數（未篩選）": int(annotations["item_id"].nunique()),
        "item 數（恰好 3 份、已去重）": int(len(items)),
        "annotation 數": int(len(ann)),
        "annotator 數": int(ann["annotator_id"].nunique()),
        "每位 annotator 的題數": _quantiles(per_annotator),
        "每題標註數": sorted(ann.groupby("item_id").size().unique().tolist()),
        "類別分布（標註層級）": (
            ann["label"].value_counts(normalize=True).mul(100).round(1).to_dict()
        ),
        "有任何分歧的 item (%)": round(float(items["z"].mean() * 100), 1),
        "三人三種標籤 (%)": round(
            float((items["n_distinct_labels"] == 3).mean() * 100), 1
        ),
        "文字長度（字元）": _quantiles(text_len),
        "subreddit 數": int(items["subreddit"].nunique()),
    }


def annotation_count_distribution(annotations: pd.DataFrame) -> pd.Series:
    """每題標註數的分布。用於說明為什麼只取恰好 3 份（研究規格 6.4 第 7 條）。"""
    counts = annotations.groupby("item_id").size()
    return counts.value_counts().sort_index().rename("item 數")


def leakage_by_annotation_count(annotations: pd.DataFrame) -> pd.DataFrame:
    """各「標註數」分組的分歧率，證明標註數本身洩漏答案。"""
    counts = annotations.groupby("item_id").size().rename("n_ann")
    labels = annotations.groupby("item_id")["label"].nunique().rename("n_distinct")
    df = pd.concat([counts, labels], axis=1)
    df["z"] = (df["n_distinct"] > 1).astype(int)
    out = df.groupby("n_ann").agg(item_數=("z", "size"), 分歧率=("z", "mean"))
    out["分歧率"] = (out["分歧率"] * 100).round(1)
    return out


def disagreement_patterns(items: pd.DataFrame, top: int = 8) -> pd.DataFrame:
    """對應 Dataset Card 3.1：三人標籤組合的分布。"""
    def pattern(labels: list[str]) -> str:
        uniq = sorted(set(labels))
        return uniq[0] + "（全一致）" if len(uniq) == 1 else "＋".join(uniq)

    pat = items["labels"].apply(pattern).value_counts()
    out = pat.head(top).to_frame("item 數")
    out["佔比"] = (pat.head(top) / len(items) * 100).round(1)
    return out


def reveal_difficulty(table: ItemTable, seeds=cfg.REVEAL_SEEDS) -> pd.DataFrame:
    """對應 Dataset Card 3.2：揭露 2 份之後的難題子集大小與陽性率。

    難題子集 = 可見的 r 份標註一致、但完整標註出現分歧的 item。可見已不一致的
    item 必然分歧，規則不用學就全對，沒有研究價值。
    """
    from splitsense.reveal import build_reveal_manifest

    rows = []
    n = len(table.items)
    for seed in seeds:
        manifest = build_reveal_manifest(table, seed=seed)
        visible_agree = manifest["visible_agree"]
        hard = int((visible_agree & (manifest["z"] == 1)).sum())
        n_agree = int(visible_agree.sum())
        rows.append(
            {
                "seed": seed,
                "可見一致的 item": n_agree,
                "可見一致佔比 (%)": round(n_agree / n * 100, 1),
                "其中第三位偏離": hard,
                "難題陽性率 (%)": round(hard / n_agree * 100, 1),
            }
        )
    return pd.DataFrame(rows)


def subreddit_robustness(items: pd.DataFrame, top: int = 5) -> pd.DataFrame:
    """前 N 大 subreddit 的分歧率，作為穩健性分析的分組軸（研究規格 8.5）。"""
    top_subs = items["subreddit"].value_counts().head(top).index
    sub = items[items["subreddit"].isin(top_subs)]
    out = sub.groupby("subreddit").agg(item_數=("z", "size"), 分歧率=("z", "mean"))
    out["分歧率"] = (out["分歧率"] * 100).round(1)
    return out.sort_values("item_數", ascending=False)


def upstream_split_overlap() -> dict:
    """驗證上游 split 不能用（Dataset Card 4.1）。"""
    import pyarrow.parquet as pq

    from splitsense.data import download_raw

    paths = download_raw()
    sets = {}
    for split, path in paths.items():
        tbl = pq.read_table(path, columns=[cfg.COL_ITEM_ID])
        sets[split] = set(tbl.column(cfg.COL_ITEM_ID).to_pylist())
    overlap = sets["test"] & sets["train"]
    return {
        "上游 train item 數": len(sets["train"]),
        "上游 test item 數": len(sets["test"]),
        "test 也出現在 train 的 item 數": len(overlap),
        "test 重疊比例 (%)": round(len(overlap) / len(sets["test"]) * 100, 1),
    }


def text_length_histogram(items: pd.DataFrame, out_path) -> None:
    """文字長度直方圖，供簡報使用。"""
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    lengths = items["text"].str.len()
    fig, ax = plt.subplots(figsize=(7, 3.5))
    ax.hist(np.clip(lengths, 0, 300), bins=60, color="#2b4c7e")
    ax.set_xlabel("留言長度（字元，截至 300）")
    ax.set_ylabel("item 數")
    ax.set_title(f"GoEmotions 文字長度分布（中位數 {int(lengths.median())} 字元）")
    fig.tight_layout()
    fig.savefig(out_path, dpi=150)
    plt.close(fig)
