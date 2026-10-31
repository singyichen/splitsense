"""建立固定的 split manifest 與 reveal seed manifest（研究規格 6.7）。

    uv run python scripts/build_dataset.py

產物寫到 `artifacts/manifests/`（已在 .gitignore）。manifest 只含 item_id、
split 名稱、可見 slot 與 target，不含原始文字。
"""

from __future__ import annotations

import sys

from splitsense import config as cfg
from splitsense.data import build_items, load_annotations
from splitsense.reveal import build_reveal_manifest
from splitsense.split import build_split_manifest, split_summary


def main() -> int:
    out_dir = cfg.ARTIFACTS_DIR / "manifests"
    out_dir.mkdir(parents=True, exist_ok=True)

    table = build_items(load_annotations())

    split_manifest = build_split_manifest(table)
    split_manifest.to_parquet(out_dir / "split.parquet", index=False)
    print("\n=== Split manifest（研究規格 6.2）===")
    print(split_summary(table.items, split_manifest).to_string())

    print("\n=== Reveal manifest（研究規格 6.3）===")
    for seed in cfg.REVEAL_SEEDS:
        manifest = build_reveal_manifest(table, seed=seed)
        manifest.to_parquet(out_dir / f"reveal_seed{seed}.parquet", index=False)
        n_agree = int(manifest["visible_agree"].sum())
        hard = int((manifest["visible_agree"] & (manifest["z"] == 1)).sum())
        print(
            f"seed {seed}: 可見一致 {n_agree:,}（{n_agree / len(manifest) * 100:.1f}%）、"
            f"其中第三位偏離 {hard:,}（{hard / n_agree * 100:.1f}%）"
        )

    print(f"\n[dataset] 產物寫入 {out_dir}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
