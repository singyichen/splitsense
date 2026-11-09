"""混淆矩陣與錯誤分析（研究規格 8.2、8.6）。

    uv run python scripts/run_error_analysis.py                 # TF-IDF LR
    uv run python scripts/run_error_analysis.py --model bge     # BGE-M3 LR

兩種文字表示都要能跑：8.4 的結論採 BGE-M3，但 8.6.1「模型只送 neutral 組」
這類判讀是對**某一個模型**成立的，不能從 TF-IDF 的結果推到 BGE。

門檻由 **validation** 的分數在預算 10% 處取得，再套用到 test——研究規格 6.4
第 6 條要求門檻不得由測試資料決定。這也是 val split 的用途。

產物寫到 `artifacts/error_analysis/<model>/`。供人工閱讀的抽樣含原始文字，
**只留在該目錄（已在 .gitignore），不進版控也不進文件**（研究規格 9.3）。
"""

from __future__ import annotations

import argparse
import sys

import numpy as np
import pandas as pd

from splitsense import config as cfg
from splitsense.data import build_items, load_annotations
from splitsense.embeddings import build_embed_matrix, load_or_build, resolve_revision
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
    EMBED_LOGREG_GRID,
    LOGREG_GRID,
    build_vectorizer,
    embed_logreg_pipeline,
    logreg_pipeline,
    stack_reveal_seeds,
    stack_reveal_seeds_embed,
    tune,
)
from splitsense.reveal import build_reveal_manifest
from splitsense.split import build_split_manifest

MODEL_LABELS = {"tfidf": "TF-IDF Logistic Regression", "bge": "BGE-M3 Logistic Regression"}
# BGE 的格線是 72 組候選、資料是 dense 矩陣，8 核開滿會吃光記憶體（同 run_models.py）
EMBED_N_JOBS = 4


def hard_rows(manifest: pd.DataFrame, ids: set[str]) -> pd.DataFrame:
    rows = manifest[manifest["item_id"].isin(ids) & manifest["visible_agree"]]
    return rows.reset_index(drop=True)


def build_scorer(name: str, table, manifests, train_ids: set[str]):
    """訓練指定的文字表示，回傳 `(score_fn, search)`。

    兩者的分類器、可見標註特徵、訓練 row 都相同，只差在文字表示——這樣比出來
    的錯誤分析差異才能歸因到表示本身。
    """
    if name == "tfidf":
        vectorizer = build_vectorizer(table.items, train_ids)
        data = stack_reveal_seeds(
            table.items, manifests, train_ids, vectorizer, hard_only=True
        )
        search = tune(logreg_pipeline(), LOGREG_GRID, data)
        text_by_id = table.items.set_index("item_id")["text"]

        def score(rows: pd.DataFrame) -> np.ndarray:
            texts = text_by_id.loc[rows["item_id"]].reset_index(drop=True)
            matrix = build_matrix(texts, rows, vectorizer)
            return search.best_estimator_.predict_proba(matrix)[:, 1]

        return score, search

    store, _ = load_or_build(
        table.items["item_id"],
        table.items["text"],
        revision=cfg.EMBED_MODEL_REVISION or resolve_revision(),
    )
    data = stack_reveal_seeds_embed(manifests, train_ids, store, hard_only=True)
    search = tune(
        embed_logreg_pipeline(store.dimension),
        EMBED_LOGREG_GRID,
        data,
        n_jobs=EMBED_N_JOBS,
    )

    def score(rows: pd.DataFrame) -> np.ndarray:
        return search.best_estimator_.predict_proba(build_embed_matrix(rows, store))[:, 1]

    return score, search


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="混淆矩陣與錯誤分析")
    parser.add_argument("--model", choices=sorted(MODEL_LABELS), default="tfidf")
    args = parser.parse_args(argv)

    out_dir = cfg.ARTIFACTS_DIR / "error_analysis" / args.model
    out_dir.mkdir(parents=True, exist_ok=True)

    table = build_items(load_annotations())
    split = build_split_manifest(table)
    ids = {
        name: set(split.loc[split["split"] == name, "item_id"])
        for name in ("train", "val", "test")
    }
    manifests = {s: build_reveal_manifest(table, seed=s) for s in cfg.REVEAL_SEEDS}
    text_by_id = table.items.set_index("item_id")["text"]

    print(f"[error] 訓練 {MODEL_LABELS[args.model]}…")
    score, search = build_scorer(args.model, table, manifests, ids["train"])
    print(f"[error] 最佳參數 {search.best_params_}")
    print(f"[error] CV Recall@10% {search.best_score_ * 100:.2f}%")

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
    print(f"\n[error] 模型 {MODEL_LABELS[args.model]}，產物寫入 {out_dir}")
    print("[error] samples_for_reading.csv 含原始文字，不得進版控或文件")
    return 0


if __name__ == "__main__":
    sys.exit(main())
