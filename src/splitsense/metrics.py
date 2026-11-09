"""固定預算下的排序指標。

對應研究規格 8.1、8.2。主要指標為 `Recall@10%`。
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.metrics import average_precision_score

from splitsense import config as cfg


def rank_with_random_tiebreak(scores: np.ndarray, rng: np.random.Generator) -> np.ndarray:
    """由高分到低分排序，同分隨機打散，回傳 item 的索引順序。

    同分一定要隨機打散。可見標籤 entropy 這類規則只有少數幾個離散分數，
    若依 DataFrame 原始順序排，分數會變成「資料載入順序」的函數——那是
    評估上的假訊號，不是模型能力。
    """
    noise = rng.random(len(scores))
    # lexsort 以最後一個 key 為主：先比 -scores，同分再比 noise
    return np.lexsort((noise, -scores))


def precision_recall_at_k(y_true: np.ndarray, order: np.ndarray, k: int) -> tuple[float, float]:
    top = y_true[order[:k]]
    hits = int(top.sum())
    total_positive = int(y_true.sum())
    return hits / k, hits / total_positive


def ranking_metrics(
    y_true: np.ndarray,
    scores: np.ndarray,
    rng: np.random.Generator,
    budgets: tuple[float, ...] = cfg.BUDGETS,
) -> dict[str, float]:
    """單次排序的全部指標。"""
    y_true = np.asarray(y_true).astype(int)
    scores = np.asarray(scores, dtype=float)
    n = len(y_true)
    prevalence = float(y_true.mean())
    order = rank_with_random_tiebreak(scores, rng)

    out: dict[str, float] = {"prevalence": prevalence}
    for b in budgets:
        k = int(np.floor(b * n))
        if k < 1:
            raise ValueError(f"預算 {b} 在 N={n} 下的 K 小於 1")
        precision, recall = precision_recall_at_k(y_true, order, k)
        tag = f"{int(round(b * 100))}%"
        out[f"P@{tag}"] = precision
        out[f"R@{tag}"] = recall
        out[f"Lift@{tag}"] = precision / prevalence
        # 預算 b 下 Recall 的理論上限：即使 TopK 全中，也只能涵蓋 K/|P|
        out[f"R@{tag}_ceiling"] = min(1.0, k / float(y_true.sum()))
    out["PR-AUC"] = float(average_precision_score(y_true, scores))
    return out


def threshold_at_budget(scores: np.ndarray, budget: float = cfg.PRIMARY_BUDGET) -> float:
    """預算 b 下的操作點：取第 K 高分作為門檻。

    研究規格 6.4 第 6 條要求門檻只能由非測試資料決定，所以這個函式應該餵
    validation 的分數，再把結果套到 test 上。
    """
    scores = np.asarray(scores, dtype=float)
    k = max(1, int(np.floor(budget * len(scores))))
    # 第 k 高分（1-indexed），即剛好讓 k 筆被選中的門檻
    return float(np.sort(scores)[::-1][k - 1])


def confusion_at_threshold(
    y_true: np.ndarray, scores: np.ndarray, threshold: float
) -> pd.DataFrame:
    """混淆矩陣（研究規格 8.2：課堂版另報）。

    列為實際、欄為預測；「預測送複核」表示分數 >= 門檻。
    """
    y_true = np.asarray(y_true).astype(int)
    flagged = np.asarray(scores, dtype=float) >= threshold
    return pd.DataFrame(
        [
            [int((~flagged & (y_true == 0)).sum()), int((flagged & (y_true == 0)).sum())],
            [int((~flagged & (y_true == 1)).sum()), int((flagged & (y_true == 1)).sum())],
        ],
        index=pd.Index(["實際一致 (z=0)", "實際分歧 (z=1)"], name="實際"),
        columns=pd.Index(["預測安全", "預測送複核"], name="預測"),
    )


def confusion_rates(confusion: pd.DataFrame) -> dict[str, float]:
    """從混淆矩陣導出 precision、recall、specificity 與 flag rate。"""
    tn, fp = int(confusion.iloc[0, 0]), int(confusion.iloc[0, 1])
    fn, tp = int(confusion.iloc[1, 0]), int(confusion.iloc[1, 1])
    total = tn + fp + fn + tp
    return {
        "precision": tp / (tp + fp) if tp + fp else 0.0,
        "recall": tp / (tp + fn) if tp + fn else 0.0,
        "specificity": tn / (tn + fp) if tn + fp else 0.0,
        "flag_rate": (tp + fp) / total if total else 0.0,
    }


def outcome_labels(y_true: np.ndarray, scores: np.ndarray, threshold: float) -> pd.Series:
    """把每一筆標成 TP / FP / FN / TN，供錯誤分析分組。"""
    y_true = np.asarray(y_true).astype(int)
    flagged = np.asarray(scores, dtype=float) >= threshold
    out = np.where(
        y_true == 1,
        np.where(flagged, "TP", "FN"),
        np.where(flagged, "FP", "TN"),
    )
    return pd.Series(out, name="outcome")


def aggregate(runs: list[dict[str, float]]) -> pd.DataFrame:
    """多個 seed 的平均、標準差與 95% confidence interval（研究規格 8.3）。"""
    df = pd.DataFrame(runs)
    n = len(df)
    summary = pd.DataFrame(
        {
            "mean": df.mean(),
            "std": df.std(ddof=1) if n > 1 else 0.0,
            "n_runs": n,
        }
    )
    # 常態近似的 95% CI；seed 數少時只當粗略區間
    half = 1.96 * summary["std"] / np.sqrt(n) if n > 1 else 0.0
    summary["ci95_low"] = summary["mean"] - half
    summary["ci95_high"] = summary["mean"] + half
    return summary


def per_seed_metric(
    y_by_seed: dict[int, np.ndarray],
    scores_by_model: dict[str, dict[int, np.ndarray]],
    key: str = "R@10%",
) -> pd.DataFrame:
    """每個模型在每個 reveal seed 上的指標值，一列一個模型。

    配對比較與斜線圖都要用同一份逐 seed 數字——從平均反推畫出來的線不是實測
    結果。排序 seed 固定為 `40_000 + reveal_seed`，所以兩邊必定一致。
    """
    per_seed: dict[str, dict[int, float]] = {}
    for name, by_seed in scores_by_model.items():
        per_seed[name] = {}
        for seed, scores in by_seed.items():
            rng = np.random.default_rng(40_000 + seed)
            per_seed[name][seed] = ranking_metrics(y_by_seed[seed], scores, rng)[key]

    table = pd.DataFrame({name: pd.Series(vals) for name, vals in per_seed.items()}).T
    table.index.name = "model"
    table.columns.name = "reveal_seed"
    return table


def paired_comparison(
    y_by_seed: dict[int, np.ndarray],
    scores_by_model: dict[str, dict[int, np.ndarray]],
    reference: str,
    key: str = "R@10%",
) -> pd.DataFrame:
    """以 reveal seed 配對比較各模型與參考模型的差距。

    所有模型跑在同一批 seed、同一份資料上，所以可以逐 seed 相減。配對差的
    標準差通常遠小於各自分數的標準差——用後者比較會低估差異的可信度，也會
    高估（研究規格 8.5 要求 paired bootstrap，這是其單機版）。
    """
    per_seed = per_seed_metric(y_by_seed, scores_by_model, key)

    seeds = sorted(y_by_seed)
    ref = np.array([per_seed.loc[reference, s] for s in seeds])
    rows = []
    for name in scores_by_model:
        values = np.array([per_seed.loc[name, s] for s in seeds])
        diff = values - ref
        diff_text = f"{diff.mean() * 100:+.2f} ± {diff.std(ddof=1) * 100:.2f}"
        rows.append(
            {
                "model": name,
                key: f"{values.mean() * 100:.1f} ± {values.std(ddof=1) * 100:.1f}",
                "配對差": diff_text,
                "勝的 seed 數": f"{int((diff > 0).sum())}/{len(seeds)}",
            }
        )
    return pd.DataFrame(rows).set_index("model")


def format_summary(summary: pd.DataFrame, keys: list[str] | None = None) -> str:
    """把 aggregate 的結果印成「平均 ± 標準差」。"""
    keys = keys or list(summary.index)
    parts = []
    for key in keys:
        if key not in summary.index:
            continue
        row = summary.loc[key]
        parts.append(f"{key} {row['mean'] * 100:.1f} ± {row['std'] * 100:.1f}")
    return "  ".join(parts)
