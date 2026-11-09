"""訓練並評估模型階梯：Logistic Regression、Gradient Boosting、BGE-M3 + PCA + LR。

    uv run python scripts/run_models.py

兩個評估範圍都報，**以 hard 為主要範圍**（Q11、研究規格 8.2.1）：

- **hard**（可見 2 份一致）：模型真正被使用的時機，也是唯一有區分力的範圍。
- **full**（整個 test split）：`Recall@10%` 已飽和，列出來是為了說明它為什麼
  飽和——那本身是結論。full 範圍的模型分數採部署式排序（可見已不一致者排最
  前，其餘用模型細排），否則會低估只在 hard 上訓練的模型。

Embedding 階梯需要 `artifacts/embeddings/` 的快取或 `embed` extra；兩者都沒有
時會跳過那一列，主線仍然跑完。
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
    disagree_first_scores,
    visible_entropy_scores,
)
from splitsense.data import build_items, load_annotations
from splitsense.embeddings import build_embed_matrix, load_or_build, resolve_revision
from splitsense.features import build_matrix
from splitsense.metrics import aggregate, paired_comparison, per_seed_metric, ranking_metrics
from splitsense.models import (
    EMBED_LOGREG_GRID,
    GB_GRID,
    LOGREG_GRID,
    build_vectorizer,
    embed_logreg_pipeline,
    gb_pipeline,
    logreg_pipeline,
    stack_reveal_seeds,
    stack_reveal_seeds_embed,
    tune,
    visible_feature_coefficients,
)
from splitsense.reveal import build_reveal_manifest
from splitsense.split import build_split_manifest

REPORT_KEYS = ["PR-AUC", "P@5%", "R@5%", "P@10%", "R@10%", "Lift@10%"]

# Random 與 hard 範圍的 Visible entropy 的排序完全由同分打散決定（entropy 在
# hard 子集恆為常數），所以它們要跑多個排序 seed，否則報出來的只是一次抽樣。
TIEBREAK_RUNS = {"Random": cfg.N_RANDOM_SEEDS, "Visible entropy": cfg.N_RANDOM_SEEDS}

# BGE 的 grid 有 48 組候選、資料是 73,596 × 1,032 的 dense 矩陣。8 核心上開滿
# n_jobs 會讓每個 worker 各留一份 PCA 輸出，16 GB 不夠；留 4 個。
EMBED_N_JOBS = 4


def build_scope(manifests: dict[int, pd.DataFrame], test_ids: set[str], hard_only: bool):
    """取出某個評估範圍在每個 reveal seed 下的 row 與 target。"""
    rows_by_seed, y_by_seed = {}, {}
    for seed, manifest in manifests.items():
        rows = manifest[manifest["item_id"].isin(test_ids)]
        if hard_only:
            rows = rows[rows["visible_agree"]]
        rows = rows.reset_index(drop=True)
        rows_by_seed[seed] = rows
        y_by_seed[seed] = rows["z"].to_numpy()
    return rows_by_seed, y_by_seed


def predict_by_seed(estimator, rows_by_seed: dict[int, pd.DataFrame], matrix_fn):
    return {
        seed: estimator.predict_proba(matrix_fn(rows))[:, 1]
        for seed, rows in rows_by_seed.items()
    }


def scope_report(y_by_seed: dict[int, np.ndarray], scores_by_model: dict) -> pd.DataFrame:
    rows = []
    for name, by_seed in scores_by_model.items():
        runs = []
        for seed, scores in by_seed.items():
            for draw in range(TIEBREAK_RUNS.get(name, 1)):
                rng = np.random.default_rng(30_000 + 1_000 * seed + draw)
                runs.append(ranking_metrics(y_by_seed[seed], scores, rng))
        summary = aggregate(runs)
        row = {"model": name, "runs": int(summary["n_runs"].iloc[0])}
        for key in REPORT_KEYS:
            mean, std = summary.loc[key, "mean"], summary.loc[key, "std"]
            row[key] = f"{mean * 100:.1f} ± {std * 100:.1f}"
        rows.append(row)
    return pd.DataFrame(rows).set_index("model")


def scope_header(name: str, y_by_seed: dict[int, np.ndarray]) -> None:
    any_seed = next(iter(y_by_seed))
    n = len(y_by_seed[any_seed])
    prevalence = float(np.mean([y.mean() for y in y_by_seed.values()]))
    k = int(np.floor(cfg.PRIMARY_BUDGET * n))
    print(f"\n=== 範圍 {name}：test item {n:,}、盛行率 {prevalence * 100:.2f}%、K={k} ===")
    print(f"R@10% 的理論上限 {min(1.0, k / (prevalence * n)) * 100:.1f}%")


def load_embeddings(items: pd.DataFrame):
    """讀快取或現場編碼。沒裝 `embed` extra 又沒有快取時回傳 None。"""
    try:
        store, seconds = load_or_build(
            items["item_id"],
            items["text"],
            revision=cfg.EMBED_MODEL_REVISION or resolve_revision(),
        )
    except ImportError:
        print("[models] 沒有 embedding 快取、也沒裝 embed extra，跳過 Embedding 階梯")
        print("[models] 要跑的話：uv sync --extra dev --extra embed"
              " && uv run python scripts/embed_texts.py")
        return None, 0.0
    if seconds:
        print(f"[models] 現場編碼 {len(items):,} 筆，耗時 {seconds:.0f}s")
    else:
        print(f"[models] 讀到 embedding 快取 {store.matrix.shape}")
    return store, seconds


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

    store, encode_seconds = load_embeddings(table.items)
    embed_train = None
    if store is not None:
        embed_train = stack_reveal_seeds_embed(
            manifests, train_ids, store, hard_only=True
        )
        print(
            f"[models] Embedding 訓練 row {embed_train.X.shape[0]:,}、"
            f"特徵 {embed_train.X.shape[1]:,}"
        )

    hard_m, hard_y = build_scope(manifests, test_ids, hard_only=True)
    full_m, full_y = build_scope(manifests, test_ids, hard_only=False)

    prior = agreed_label_prior(manifests, train_ids)
    print("\n[models] 同意標籤先驗（由 training 算出的分歧率）：")
    for label, rate in sorted(prior.items(), key=lambda kv: -kv[1]):
        print(f"  同意 {label}: {rate * 100:.1f}%")

    # 先把每個方法在每個 seed 的分數算出來，再從同一批分數算所有指標。
    # 這樣聚合表與配對比較必定一致，不會各算一次而對不起來。
    hard_scores: dict[str, dict[int, np.ndarray]] = {
        "Random": {
            seed: np.random.default_rng(10_000 + seed).random(len(hard_m[seed]))
            for seed in hard_m
        },
        "Visible entropy": {seed: visible_entropy_scores(hard_m[seed]) for seed in hard_m},
        "Agreed-label prior": {
            seed: agreed_label_scores(hard_m[seed], prior) for seed in hard_m
        },
    }
    full_scores: dict[str, dict[int, np.ndarray]] = {
        "Random": {
            seed: np.random.default_rng(10_000 + seed).random(len(full_m[seed]))
            for seed in full_m
        },
        "Visible entropy": {seed: visible_entropy_scores(full_m[seed]) for seed in full_m},
        "Agreed-label prior": {
            seed: disagree_first_scores(
                full_m[seed], agreed_label_scores(full_m[seed], prior)
            )
            for seed in full_m
        },
    }

    text_by_id = table.items.set_index("item_id")["text"]

    def tfidf_matrix(rows: pd.DataFrame):
        texts = text_by_id.loc[rows["item_id"]].reset_index(drop=True)
        return build_matrix(texts, rows, vectorizer)

    def embed_matrix(rows: pd.DataFrame):
        return build_embed_matrix(rows, store)

    ladder = {
        "Logistic Regression": (logreg_pipeline(), LOGREG_GRID, train_data, tfidf_matrix, -1),
        "Gradient Boosting": (gb_pipeline(), GB_GRID, train_data, tfidf_matrix, -1),
    }
    if embed_train is not None:
        ladder["BGE-M3 + LR"] = (
            embed_logreg_pipeline(store.dimension),
            EMBED_LOGREG_GRID,
            embed_train,
            embed_matrix,
            EMBED_N_JOBS,
        )

    searches, tune_seconds = {}, {}
    for name, (pipeline, grid, data, matrix_fn, n_jobs) in ladder.items():
        print(f"\n[models] 調參 {name}…")
        started = time.time()
        search = tune(pipeline, grid, data, n_jobs=n_jobs)
        elapsed = time.time() - started
        print(f"[models] {name} 最佳參數 {search.best_params_}")
        print(f"[models] CV Recall@10% {search.best_score_ * 100:.2f}%，耗時 {elapsed:.0f}s")
        searches[name] = search
        tune_seconds[name] = elapsed
        hard_scores[name] = predict_by_seed(search.best_estimator_, hard_m, matrix_fn)
        full_raw = predict_by_seed(search.best_estimator_, full_m, matrix_fn)
        full_scores[name] = {
            seed: disagree_first_scores(full_m[seed], scores)
            for seed, scores in full_raw.items()
        }

    # hard 放後面印：它是主要範圍（Q11），讓它留在終端機最後一屏
    for scope, label, y_by_seed, scores in (
        ("full", "full（整個 test split）", full_y, full_scores),
        ("hard", "hard（可見 2 份一致）", hard_y, hard_scores),
    ):
        scope_header(label, y_by_seed)
        report = scope_report(y_by_seed, scores)
        print(report.to_string())
        report.to_csv(out_dir / f"summary_{scope}.csv")

    # 逐 seed 的實測值。斜線圖要用它畫，不可以從平均反推
    for scope, y_by_seed, scores in (
        ("full", full_y, full_scores),
        ("hard", hard_y, hard_scores),
    ):
        per_seed = per_seed_metric(y_by_seed, scores)
        per_seed.to_csv(out_dir / f"per_seed_r10_{scope}.csv")
    print("\n=== 逐 reveal seed 的 R@10%（hard）===")
    print((per_seed_metric(hard_y, hard_scores) * 100).round(2).to_string())

    for reference in ("Agreed-label prior", "Logistic Regression"):
        paired = paired_comparison(hard_y, hard_scores, reference=reference)
        print(f"\n=== 配對比較（hard）：以「{reference}」為參考（研究規格 8.5）===")
        print(paired.to_string())
        slug = reference.lower().replace(" ", "_").replace("-", "_")
        paired.to_csv(out_dir / f"paired_hard_vs_{slug}.csv")

    paired_full = paired_comparison(full_y, full_scores, reference="Agreed-label prior")
    print("\n=== 配對比較（full）：以「同意標籤先驗」為參考 ===")
    print(paired_full.to_string())
    paired_full.to_csv(out_dir / "paired_full_vs_agreed_label_prior.csv")

    for name in ("Logistic Regression", "BGE-M3 + LR"):
        if name not in searches:
            continue
        data = train_data if name == "Logistic Regression" else embed_train
        coefficients = visible_feature_coefficients(searches[name], data)
        if coefficients is None:
            continue
        print(f"\n=== {name} 的可見標註特徵係數 ===")
        print(coefficients.to_string())
        slug = "logreg" if name == "Logistic Regression" else "bge_logreg"
        coefficients.to_csv(out_dir / f"{slug}_visible_coefficients.csv")

    (out_dir / "best_params.json").write_text(
        json.dumps(
            {
                "encode_seconds": round(encode_seconds, 1),
                "embedding_metadata": (
                    {k: v for k, v in store.metadata.items() if k != "item_ids"}
                    if store is not None
                    else None
                ),
                "models": {
                    name: {
                        "best_params": {k: str(v) for k, v in s.best_params_.items()},
                        "cv_recall_at_10": s.best_score_,
                        "tune_seconds": round(tune_seconds[name], 1),
                    }
                    for name, s in searches.items()
                },
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
