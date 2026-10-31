"""階梯 0 與 1：隨機排序與可見標籤規則。

對應研究規格 7.1。這兩層不訓練，只產生分數供排序。
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from splitsense import config as cfg
from splitsense.features import visible_features
from splitsense.metrics import aggregate, ranking_metrics


def random_scores(n: int, rng: np.random.Generator) -> np.ndarray:
    """階梯 0：地板線。"""
    return rng.random(n)


def visible_entropy_scores(manifest: pd.DataFrame) -> np.ndarray:
    """階梯 1：可見標籤 entropy。

    r=2 時 entropy 只有兩個值（可見一致 0、可見不一致 1），所以這條規則等於
    「前兩人一不一致」。這正是研究規格 2.2 要挑戰的對照組。
    """
    return visible_features(manifest)["visible_entropy"].to_numpy()


def evaluate_random(
    y_true_by_seed: dict[int, np.ndarray], n_seeds: int = cfg.N_RANDOM_SEEDS
) -> pd.DataFrame:
    """階梯 0 的評估：每個 reveal seed 各跑 n_seeds 次隨機排序。

    分數本身與 reveal 無關，但**評估範圍**可能有關：hard 子集的成員就是由
    reveal 決定的。所以必須跟階梯 1 跑在同一批 reveal seed 上，否則兩者不在
    同一份資料上，比較無效。回報的標準差同時含 reveal 與排序兩種變異。
    """
    runs = []
    for reveal_seed, y_true in y_true_by_seed.items():
        for seed in range(n_seeds):
            rng = np.random.default_rng(10_000 + 1_000 * reveal_seed + seed)
            runs.append(ranking_metrics(y_true, random_scores(len(y_true), rng), rng))
    return aggregate(runs)


def evaluate_visible_entropy(
    y_true_by_seed: dict[int, np.ndarray], manifests: dict[int, pd.DataFrame]
) -> pd.DataFrame:
    """階梯 1 的評估，跨 reveal seeds。"""
    runs = []
    for seed, manifest in manifests.items():
        rng = np.random.default_rng(20_000 + seed)
        scores = visible_entropy_scores(manifest)
        runs.append(ranking_metrics(y_true_by_seed[seed], scores, rng))
    return aggregate(runs)
