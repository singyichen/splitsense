"""把全部 item 的文字編成 bge-m3 dense 向量並快取（研究規格 7.2）。

    uv run python scripts/embed_texts.py            # 有快取就直接讀
    uv run python scripts/embed_texts.py --force     # 無視快取重算

需要 `embed` extra：`uv sync --extra dev --extra embed`。

embedding 只跟文字有關、跟 reveal 無關，所以 31,603 個 item 編一次就能給 5 個
reveal seed 共用。向量寫到 `artifacts/embeddings/`（已在 .gitignore——研究規格
9.3 禁止把向量進版控）。
"""

from __future__ import annotations

import argparse
import sys

import numpy as np

from splitsense import config as cfg
from splitsense.data import build_items, load_annotations
from splitsense.embeddings import load_or_build, resolve_device, resolve_revision


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="編碼並快取 bge-m3 dense 向量")
    parser.add_argument("--force", action="store_true", help="無視快取重新編碼")
    args = parser.parse_args(argv)

    table = build_items(load_annotations())
    items = table.items
    print(f"[embed] item {len(items):,}、模型 {cfg.EMBED_MODEL_NAME}、device {resolve_device()}")

    revision = cfg.EMBED_MODEL_REVISION or resolve_revision()
    print(f"[embed] revision {revision or '未知（離線或查不到）'}")

    store, seconds = load_or_build(
        items["item_id"],
        items["text"],
        revision=revision,
        force=args.force,
    )
    if seconds:
        print(f"[embed] 編碼 {len(items):,} 筆耗時 {seconds:.0f}s")
    else:
        print("[embed] 讀到快取，未重新編碼")

    print(f"[embed] 向量 {store.matrix.shape}、dtype {store.matrix.dtype}")
    norms = np.linalg.norm(store.matrix, axis=1)
    # 研究規格 7.2 列為待調研項目：不同語言的向量 norm 是否偏移。先記英文的基準
    print(f"[embed] 向量 norm 平均 {norms.mean():.3f}、標準差 {norms.std():.3f}")
    print(f"[embed] 快取目錄 {cfg.EMBEDDINGS_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
