"""訓練並評估階梯 2（Logistic Regression）與階梯 3（Gradient Boosting）。

    uv run python scripts/run_models.py

評估範圍為 hard（可見 2 份一致的子集），即研究規格 8.2.1 建議的主要範圍：
full 範圍的 `Recall@10%` 已飽和，無法區分模型（Q11）。
"""

from __future__ import annotations

import json
import sys
import time

import numpy as np
import pandas as pd

from splitsense import config as cfg
from splitsense.baselines import evaluate_random, evaluate_visible_entropy
from splitsense.data import build_items, load_annotations
from splitsense.features import build_matrix
from splitsense.metrics import aggregate, ranking_metrics
from splitsense.models import (
    GB_GRID,
    LOGREG_GRID,
    build_vectorizer,
    gb_pipeline,
    logreg_pipeline,
    stack_reveal_seeds,
    tune,
    visible_feature_coefficients,
)
from splitsense.reveal import build_reveal_manifest
from splitsense.split import build_split_manifest

REPORT_KEYS = ["PR-AUC", "P@5%", "R@5%", "P@10%", "R@10%", "Lift@10%"]


def evaluate_model(estimator, items, manifests, test_ids, vectorizer) -> pd.DataFrame:
    """在每個 reveal seed 的 hard test 子集上評估。"""
    text_by_id = items.set_index("item_id")["text"]
    runs = []
    for seed, manifest in manifests.items():
        rows = manifest[manifest["item_id"].isin(test_ids) & manifest["visible_agree"]]
        rows = rows.reset_index(drop=True)
        texts = text_by_id.loc[rows["item_id"]].reset_index(drop=True)
        X = build_matrix(texts, rows, vectorizer)
        scores = estimator.predict_proba(X)[:, 1]
        rng = np.random.default_rng(30_000 + seed)
        runs.append(ranking_metrics(rows["z"].to_numpy(), scores, rng))
    return aggregate(runs)


def main() -> int:
    out_dir = cfg.ARTIFACTS_DIR / "models"
    out_dir.mkdir(parents=True, exist_ok=True)

    table = build_items(load_annotations())
    split = build_split_manifest(table)
    train_ids = set(split.loc[split["split"] == "train", "item_id"])
    test_ids = set(split.loc[split["split"] == "test", "item_id"])

    manifests = {s: build_reveal_manifest(table, seed=s) for s in cfg.REVEAL_SEEDS}

    print("[models] fit TF-IDF（只用 training 文字）…")
    vectorizer = build_vectorizer(table.items, train_ids)
    print(f"[models] 詞彙數 {len(vectorizer.vocabulary_):,}")

    print("[models] 疊加 reveal seeds 建訓練資料（hard only）…")
    train_data = stack_reveal_seeds(
        table.items, manifests, train_ids, vectorizer, hard_only=True
    )
    print(
        f"[models] 訓練 row {train_data.X.shape[0]:,}、特徵 {train_data.X.shape[1]:,}、"
        f"unique item {len(set(train_data.groups)):,}、陽性率 {train_data.y.mean() * 100:.2f}%"
    )

    # --- 基準（hard 範圍），與模型跑在同一批 reveal seed 上 ---
    hard_m, hard_y = {}, {}
    for seed, manifest in manifests.items():
        rows = manifest[manifest["item_id"].isin(test_ids) & manifest["visible_agree"]]
        rows = rows.reset_index(drop=True)
        hard_m[seed] = rows
        hard_y[seed] = rows["z"].to_numpy()

    results = {
        "Random": evaluate_random(hard_y),
        "Visible entropy": evaluate_visible_entropy(hard_y, hard_m),
    }

    searches = {}
    for name, (pipeline, grid) in {
        "Logistic Regression": (logreg_pipeline(), LOGREG_GRID),
        "Gradient Boosting": (gb_pipeline(), GB_GRID),
    }.items():
        print(f"\n[models] 調參 {name}…")
        started = time.time()
        search = tune(pipeline, grid, train_data)
        elapsed = time.time() - started
        print(f"[models] {name} 最佳參數 {search.best_params_}")
        print(f"[models] CV Recall@10% {search.best_score_ * 100:.2f}%，耗時 {elapsed:.0f}s")
        searches[name] = search
        results[name] = evaluate_model(
            search.best_estimator_, table.items, manifests, test_ids, vectorizer
        )

    rows = []
    for name, summary in results.items():
        row = {"model": name, "runs": int(summary["n_runs"].iloc[0])}
        for key in REPORT_KEYS:
            mean, std = summary.loc[key, "mean"], summary.loc[key, "std"]
            row[key] = f"{mean * 100:.1f} ± {std * 100:.1f}"
        rows.append(row)
    report = pd.DataFrame(rows).set_index("model")

    any_seed = next(iter(hard_y))
    n = len(hard_y[any_seed])
    prevalence = float(np.mean([y.mean() for y in hard_y.values()]))
    k = int(np.floor(cfg.PRIMARY_BUDGET * n))
    print(f"\n=== 範圍 hard：test item {n:,}、盛行率 {prevalence * 100:.2f}%、K={k} ===")
    print(f"R@10% 的理論上限 {min(1.0, k / (prevalence * n)) * 100:.1f}%")
    print(report.to_string())

    coefficients = visible_feature_coefficients(searches["Logistic Regression"], train_data)
    if coefficients is not None:
        print("\n=== Logistic Regression 的可見標註特徵係數 ===")
        print(coefficients.to_string())
        coefficients.to_csv(out_dir / "logreg_visible_coefficients.csv")

    report.to_csv(out_dir / "summary_hard.csv")
    (out_dir / "best_params.json").write_text(
        json.dumps(
            {
                name: {
                    "best_params": {k: str(v) for k, v in s.best_params_.items()},
                    "cv_recall_at_10": s.best_score_,
                }
                for name, s in searches.items()
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"\n[models] 產物寫入 {out_dir}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
