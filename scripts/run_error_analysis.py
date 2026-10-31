"""混淆矩陣與錯誤分析（研究規格 8.2、8.6）。

    uv run python scripts/run_error_analysis.py

門檻由 **validation** 的分數在預算 10% 處取得，再套用到 test——研究規格 6.4
第 6 條要求門檻不得由測試資料決定。這也是 val split 的用途。

產物寫到 `artifacts/error_analysis/`。供人工閱讀的抽樣含原始文字，**只留在
該目錄（已在 .gitignore），不進版控也不進文件**（研究規格 9.3）。
"""

from __future__ import annotations

import sys

import numpy as np
import pandas as pd

from splitsense import config as cfg
from splitsense.data import build_items, load_annotations
from splitsense.error_analysis import (
    add_rates,
    agreed_label_profile,
    boundary_pairs,
    polarity_flip_share,
    sample_cases,
    signal_profile,
    text_signals,
)
from splitsense.features import build_matrix
from splitsense.metrics import (
    confusion_at_threshold,
    confusion_rates,
    outcome_labels,
    threshold_at_budget,
)
from splitsense.models import (
    LOGREG_GRID,
    build_vectorizer,
    logreg_pipeline,
    stack_reveal_seeds,
    tune,
)
from splitsense.reveal import build_reveal_manifest
from splitsense.split import build_split_manifest


def hard_rows(manifest: pd.DataFrame, ids: set[str]) -> pd.DataFrame:
    rows = manifest[manifest["item_id"].isin(ids) & manifest["visible_agree"]]
    return rows.reset_index(drop=True)


def main() -> int:
    out_dir = cfg.ARTIFACTS_DIR / "error_analysis"
    out_dir.mkdir(parents=True, exist_ok=True)

    table = build_items(load_annotations())
    split = build_split_manifest(table)
    ids = {
        name: set(split.loc[split["split"] == name, "item_id"])
        for name in ("train", "val", "test")
    }
    manifests = {s: build_reveal_manifest(table, seed=s) for s in cfg.REVEAL_SEEDS}
    text_by_id = table.items.set_index("item_id")["text"]

    print("[error] 訓練 Logistic Regression（結論採用的模型）…")
    vectorizer = build_vectorizer(table.items, ids["train"])
    train_data = stack_reveal_seeds(
        table.items, manifests, ids["train"], vectorizer, hard_only=True
    )
    search = tune(logreg_pipeline(), LOGREG_GRID, train_data)
    model = search.best_estimator_
    print(f"[error] 最佳參數 {search.best_params_}")

    def score(rows: pd.DataFrame) -> np.ndarray:
        texts = text_by_id.loc[rows["item_id"]].reset_index(drop=True)
        return model.predict_proba(build_matrix(texts, rows, vectorizer))[:, 1]

    # --- 門檻由 validation 決定（研究規格 6.4 第 6 條）---
    val_rows = hard_rows(manifests[0], ids["val"])
    threshold = threshold_at_budget(score(val_rows), cfg.PRIMARY_BUDGET)
    print(f"\n[error] 門檻由 val（{len(val_rows):,} 筆）在預算 10% 處取得：{threshold:.4f}")

    # --- 混淆矩陣：跨 5 個 reveal seed 相加 ---
    confusions, rates, profiles, agreed = [], [], [], []
    pairs_fn, pairs_all_pos = [], []
    for seed, manifest in manifests.items():
        rows = hard_rows(manifest, ids["test"])
        scores = score(rows)
        y = rows["z"].to_numpy()
        outcomes = outcome_labels(y, scores, threshold)
        confusion = confusion_at_threshold(y, scores, threshold)
        confusions.append(confusion)
        rates.append(confusion_rates(confusion))
        signals = text_signals(text_by_id.loc[rows["item_id"]].reset_index(drop=True))
        profiles.append(signal_profile(signals, outcomes))
        agreed.append(agreed_label_profile(rows, outcomes))
        pairs_fn.append(boundary_pairs(table.items, rows, outcomes, include=("FN",)))
        pairs_all_pos.append(
            boundary_pairs(table.items, rows, outcomes, include=("TP", "FN"))
        )
        if seed == 0:
            samples = sample_cases(
                text_by_id.loc[rows["item_id"]].reset_index(drop=True),
                scores,
                outcomes,
                rows,
            )

    total = sum(confusions)
    print(f"\n=== 混淆矩陣（研究規格 8.2）：5 個 reveal seed 相加，門檻 {threshold:.4f} ===")
    print(total.to_string())
    rate_summary = pd.DataFrame(rates).mean().round(3)
    print("\n每個 seed 的平均比率：")
    print(rate_summary.to_string())

    profile = sum(profiles) / len(profiles)
    print("\n=== 文字訊號（按 outcome 分組，5 seed 平均；指示值欄為出現比例 %）===")
    print(profile.round(1).to_string())

    agreed_total = add_rates(sum(agreed))
    print("\n=== 前兩人同意了哪個標籤（5 seed 相加）===")
    print(agreed_total.to_string())

    def merge(frames):
        counts = pd.concat(frames).groupby(level=0)["數量"].sum().sort_values(ascending=False)
        out = counts.to_frame("數量")
        out["佔比 (%)"] = (out["數量"] / out["數量"].sum() * 100).round(1)
        return out

    fn_pairs = merge(pairs_fn)
    all_pairs = merge(pairs_all_pos)
    comparison = all_pairs[["佔比 (%)"]].rename(columns={"佔比 (%)": "全部分歧 (%)"}).join(
        fn_pairs[["佔比 (%)"]].rename(columns={"佔比 (%)": "漏掉的 FN (%)"})
    )
    comparison["FN 相對倍數"] = (
        comparison["漏掉的 FN (%)"] / comparison["全部分歧 (%)"]
    ).round(2)
    print("\n=== 「同意的標籤 → 第三人的標籤」：全部分歧 vs 漏掉的 FN ===")
    print(comparison.to_string())

    flip_all = polarity_flip_share(all_pairs)
    flip_fn = polarity_flip_share(fn_pairs)
    print(
        f"\n極性顛倒（positive↔negative）佔全部分歧 {flip_all:.1f}%、"
        f"佔漏掉的 FN {flip_fn:.1f}%，相對倍數 {flip_fn / flip_all:.2f}"
    )

    total.to_csv(out_dir / "confusion_matrix.csv")
    rate_summary.to_csv(out_dir / "confusion_rates.csv")
    profile.round(1).to_csv(out_dir / "signal_profile.csv")
    agreed_total.to_csv(out_dir / "agreed_label_profile.csv")
    comparison.to_csv(out_dir / "boundary_pairs.csv")
    samples.to_csv(out_dir / "samples_for_reading.csv", index=False)
    print(f"\n[error] 產物寫入 {out_dir}")
    print("[error] samples_for_reading.csv 含原始文字，不得進版控或文件")
    return 0


if __name__ == "__main__":
    sys.exit(main())
