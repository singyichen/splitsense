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
from splitsense.baselines import (
    agreed_label_prior,
    agreed_label_scores,
    visible_entropy_scores,
)
from splitsense.data import build_items, load_annotations
from splitsense.features import build_matrix
from splitsense.metrics import aggregate, paired_comparison, ranking_metrics
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


def model_scores(estimator, items, manifests, vectorizer) -> dict[int, np.ndarray]:
    """每個 reveal seed 的 hard test 子集上的預測機率。"""
    text_by_id = items.set_index("item_id")["text"]
    out = {}
    for seed, rows in manifests.items():
        texts = text_by_id.loc[rows["item_id"]].reset_index(drop=True)
        out[seed] = estimator.predict_proba(build_matrix(texts, rows, vectorizer))[:, 1]
    return out


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

    prior = agreed_label_prior(manifests, train_ids)
    print("\n[models] 同意標籤先驗（由 training 算出的分歧率）：")
    for label, rate in sorted(prior.items(), key=lambda kv: -kv[1]):
        print(f"  同意 {label}: {rate * 100:.1f}%")

    prior = agreed_label_prior(manifests, train_ids)
    print("\n[models] 同意標籤先驗（由 training 算出的分歧率）：")
    for label, rate in sorted(prior.items(), key=lambda kv: -kv[1]):
        print(f"  同意 {label}: {rate * 100:.1f}%")

    # 先把每個方法在每個 seed 的分數算出來，再從同一批分數算所有指標。
    # 這樣聚合表與配對比較必定一致，不會各算一次而對不起來。
    scores_by_model: dict[str, dict[int, np.ndarray]] = {
        "Random": {
            seed: np.random.default_rng(10_000 + seed).random(len(hard_m[seed]))
            for seed in hard_m
        },
        "Visible entropy": {
            seed: visible_entropy_scores(hard_m[seed]) for seed in hard_m
        },
        "Agreed-label prior": {
            seed: agreed_label_scores(hard_m[seed], prior) for seed in hard_m
        },
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
        scores_by_model[name] = model_scores(
            search.best_estimator_, table.items, hard_m, vectorizer
        )

    # Random 與 Visible entropy 的排序完全由同分打散決定（entropy 在 hard 子集
    # 恆為常數），所以它們要跑多個排序 seed，否則報出來的數字只是一次抽樣。
    TIEBREAK_RUNS = {"Random": cfg.N_RANDOM_SEEDS, "Visible entropy": cfg.N_RANDOM_SEEDS}

    results = {}
    for name, by_seed in scores_by_model.items():
        runs = []
        for seed, scores in by_seed.items():
            for draw in range(TIEBREAK_RUNS.get(name, 1)):
                rng = np.random.default_rng(30_000 + 1_000 * seed + draw)
                runs.append(ranking_metrics(hard_y[seed], scores, rng))
        results[name] = aggregate(runs)

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

    paired = paired_comparison(hard_y, scores_by_model, reference="Agreed-label prior")
    print("\n=== 配對比較：以「同意標籤先驗」為參考（研究規格 8.5）===")
    print(paired.to_string())
    paired.to_csv(out_dir / "paired_vs_agreed_label_prior.csv")

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
