"""重跑 Dataset Card 第 3 節的全部統計，並輸出報告與圖（Q10）。

    uv run python scripts/run_eda.py

產物寫到 `artifacts/eda/`（已在 .gitignore）。報告只含彙總統計，不含原始文字。
"""

from __future__ import annotations

import json
import sys

from splitsense import config as cfg
from splitsense import eda
from splitsense.data import build_items, load_annotations


def main() -> int:
    out_dir = cfg.ARTIFACTS_DIR / "eda"
    out_dir.mkdir(parents=True, exist_ok=True)

    annotations = load_annotations()
    table = build_items(annotations)

    stats = eda.basic_stats(annotations, table)
    tables = {
        "每題標註數分布": eda.annotation_count_distribution(annotations),
        "標註數洩漏證據": eda.leakage_by_annotation_count(annotations),
        "分歧型態": eda.disagreement_patterns(table.items),
        "揭露 2 份後的難度": eda.reveal_difficulty(table),
        "前五大 subreddit 分歧率": eda.subreddit_robustness(table.items),
    }
    overlap = eda.upstream_split_overlap()

    print("\n=== 基本統計（Dataset Card 3）===")
    for k, v in stats.items():
        print(f"{k}: {v}")
    for name, tbl in tables.items():
        print(f"\n=== {name} ===")
        print(tbl.to_string())
    print("\n=== 上游 split 重疊（Dataset Card 4.1）===")
    for k, v in overlap.items():
        print(f"{k}: {v}")

    (out_dir / "basic_stats.json").write_text(
        json.dumps({**stats, "上游 split 重疊": overlap}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    for name, tbl in tables.items():
        tbl.to_csv(out_dir / f"{name}.csv", encoding="utf-8")
    eda.text_length_histogram(table.items, out_dir / "text_length.png")

    print(f"\n[eda] 產物寫入 {out_dir}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
