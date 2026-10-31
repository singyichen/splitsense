"""評估階梯 0（隨機排序）與階梯 1（可見標籤 entropy）。

    uv run python scripts/run_baselines.py

在 test split 上評估，跨 5 個 reveal seed，輸出研究規格 8.4 的結果表。

兩個評估範圍，分開報告：

- **full**：整個 test split。回答「固定預算下實務上能涵蓋多少分歧」。
- **hard**：可見 2 份一致的子集。回答「模型能不能找出前兩人暫時一致、
  但其實有爭議的題目」——研究規格 2.2 真正要解的問題。

可見已不一致的 item 必然分歧（規則不用學就全對），在 full 範圍會把低預算的
名額全部填滿，使 `Recall@10%` 達到理論上限而無法區分模型。hard 範圍把這批
確定陽性移除，才看得出文字特徵有沒有額外訊號。
"""

from __future__ import annotations

import sys

import numpy as np
import pandas as pd

from splitsense import config as cfg
from splitsense.baselines import evaluate_random, evaluate_visible_entropy
from splitsense.data import build_items, load_annotations
from splitsense.reveal import build_reveal_manifest
from splitsense.split import build_split_manifest

REPORT_KEYS = ["PR-AUC", "P@5%", "R@5%", "P@10%", "R@10%", "Lift@10%"]


def scope_report(name: str, manifests: dict, y_by_seed: dict) -> pd.DataFrame:
    any_seed = next(iter(manifests))
    n = len(manifests[any_seed])
    prevalence = float(np.mean([y.mean() for y in y_by_seed.values()]))
    k = int(np.floor(cfg.PRIMARY_BUDGET * n))
    ceiling = min(1.0, k / (prevalence * n))

    print(f"\n### 範圍 {name}")
    print(f"item 數 {n:,}、分歧盛行率 {prevalence * 100:.2f}%")
    print(f"預算 {cfg.PRIMARY_BUDGET:.0%} → K={k}，R@10% 的理論上限 {ceiling * 100:.1f}%")

    results = {
        "Random": evaluate_random(y_by_seed),
        "Visible entropy": evaluate_visible_entropy(y_by_seed, manifests),
    }
    rows = []
    for model, summary in results.items():
        row = {"model": model, "n_runs": int(summary["n_runs"].iloc[0])}
        for key in REPORT_KEYS:
            mean, std = summary.loc[key, "mean"], summary.loc[key, "std"]
            row[key] = f"{mean * 100:.1f} ± {std * 100:.1f}"
        rows.append(row)
    report = pd.DataFrame(rows).set_index("model")
    print(report.to_string())
    return report


def main() -> int:
    out_dir = cfg.ARTIFACTS_DIR / "baselines"
    out_dir.mkdir(parents=True, exist_ok=True)

    table = build_items(load_annotations())
    split = build_split_manifest(table)
    test_ids = set(split.loc[split["split"] == "test", "item_id"])

    full_m, full_y, hard_m, hard_y = {}, {}, {}, {}
    for seed in cfg.REVEAL_SEEDS:
        manifest = build_reveal_manifest(table, seed=seed)
        manifest = manifest[manifest["item_id"].isin(test_ids)].reset_index(drop=True)
        full_m[seed] = manifest
        full_y[seed] = manifest["z"].to_numpy()
        hard = manifest[manifest["visible_agree"]].reset_index(drop=True)
        hard_m[seed] = hard
        hard_y[seed] = hard["z"].to_numpy()

    print("=== 研究規格 8.4 結果表（平均 ± 標準差，單位 %）===")
    reports = {
        "full": scope_report("full（整個 test split）", full_m, full_y),
        "hard": scope_report("hard（可見 2 份一致的子集）", hard_m, hard_y),
    }
    for name, report in reports.items():
        report.to_csv(out_dir / f"summary_{name}.csv")
    print(f"\n[baselines] 產物寫入 {out_dir}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
