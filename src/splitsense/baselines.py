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


def agreed_label_prior(train_manifests: dict[int, pd.DataFrame], train_ids: set[str]) -> dict:
    """從 training 算出「前兩人同意某標籤時的分歧率」。

    只用 training item，不碰 val／test（研究規格 6.4 第 3、6 條）。
    """
    rows = []
    for manifest in train_manifests.values():
        subset = manifest[manifest["item_id"].isin(train_ids) & manifest["visible_agree"]]
        rows.append(
            pd.DataFrame(
                {
                    "agreed": subset["visible_labels"].apply(lambda ls: ls[0]).to_numpy(),
                    "z": subset["z"].to_numpy(),
                }
            )
        )
    df = pd.concat(rows, ignore_index=True)
    return df.groupby("agreed")["z"].mean().to_dict()


def agreed_label_scores(manifest: pd.DataFrame, prior: dict) -> np.ndarray:
    """階梯 1.5：只看「前兩人同意了哪個標籤」的透明規則。

    這條規則不需要文字模型，也不需要訓練——只要一張四列的查表。它存在的理由
    是把「ML 的增益有多少來自文字」這個問題問清楚：如果它已經接近 Logistic
    Regression，那文字特徵的貢獻就很有限。
    """
    agreed = manifest["visible_labels"].apply(lambda ls: ls[0])
    default = float(np.mean(list(prior.values()))) if prior else 0.0
    return agreed.map(prior).fillna(default).to_numpy(dtype=float)


def evaluate_agreed_label_prior(
    y_true_by_seed: dict[int, np.ndarray], manifests: dict[int, pd.DataFrame], prior: dict
) -> pd.DataFrame:
    runs = []
    for seed, manifest in manifests.items():
        rng = np.random.default_rng(25_000 + seed)
        scores = agreed_label_scores(manifest, prior)
        runs.append(ranking_metrics(y_true_by_seed[seed], scores, rng))
    return aggregate(runs)


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
