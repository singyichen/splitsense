"""階梯 0 與 1 的行為（研究規格 7.1）。

這裡守住一個關鍵事實：可見標籤 entropy 在「可見一致」的子集上恆為常數，
因此在那個子集上完全沒有排序資訊。研究規格 2.2 要解的問題就在這個子集。
"""

from __future__ import annotations

import numpy as np

from splitsense import config as cfg
from splitsense.baselines import evaluate_random, visible_entropy_scores
from splitsense.reveal import build_reveal_manifest
from splitsense.split import build_split_manifest


def _test_manifest(table, seed: int):
    split = build_split_manifest(table)
    test_ids = set(split.loc[split["split"] == "test", "item_id"])
    manifest = build_reveal_manifest(table, seed=seed)
    return manifest[manifest["item_id"].isin(test_ids)].reset_index(drop=True)


def test_可見不一致的_item_必然分歧(table):
    """這是定義，不是模型能力：規則在這批上不用學就全對。"""
    manifest = _test_manifest(table, seed=0)
    visible_disagree = manifest[~manifest["visible_agree"]]
    assert len(visible_disagree) > 0
    assert (visible_disagree["z"] == 1).all()


def test_entropy_在_hard_子集恆為常數(table):
    manifest = _test_manifest(table, seed=0)
    hard = manifest[manifest["visible_agree"]].reset_index(drop=True)
    scores = visible_entropy_scores(hard)
    assert np.allclose(scores, scores[0])


def test_entropy_在_full_範圍只有兩個值(table):
    """r=2、4 類時，可見 entropy 只能是 0 或 log2/log4。"""
    manifest = _test_manifest(table, seed=0)
    values = np.unique(np.round(visible_entropy_scores(manifest), 10))
    assert len(values) == 2
    assert np.allclose(sorted(values), [0.0, np.log(2) / np.log(4)])


def test_full_範圍的低預算指標已飽和(table):
    """確定陽性的數量超過 K，所以 P@10% 必為 1，任何模型都無法超越。

    這是把主要指標改在 hard 子集上評估的理由（Q11）。
    """
    manifest = _test_manifest(table, seed=0)
    n = len(manifest)
    k = int(np.floor(cfg.PRIMARY_BUDGET * n))
    certain_positive = int((~manifest["visible_agree"]).sum())
    assert certain_positive > k


def test_隨機排序的_precision_約等於盛行率(table):
    manifest = _test_manifest(table, seed=0)
    y = manifest["z"].to_numpy()
    summary = evaluate_random({0: y}, n_seeds=cfg.N_RANDOM_SEEDS)
    prevalence = float(y.mean())
    assert abs(summary.loc["P@10%", "mean"] - prevalence) < 0.02
    assert abs(summary.loc["Lift@10%", "mean"] - 1.0) < 0.05


def test_隨機排序跨_reveal_seed_共用評估範圍(table):
    """hard 子集的成員由 reveal 決定，所以 Random 必須跑在同一批 reveal seed 上。"""
    y_by_seed = {}
    for seed in cfg.REVEAL_SEEDS:
        manifest = _test_manifest(table, seed=seed)
        hard = manifest[manifest["visible_agree"]]
        y_by_seed[seed] = hard["z"].to_numpy()
    summary = evaluate_random(y_by_seed, n_seeds=5)
    assert summary.loc["P@10%", "n_runs"] == len(cfg.REVEAL_SEEDS) * 5
