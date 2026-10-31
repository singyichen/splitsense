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
