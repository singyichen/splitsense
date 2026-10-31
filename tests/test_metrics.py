"""排序指標的正確性（研究規格 8.1）。"""

from __future__ import annotations

import numpy as np
import pytest

from splitsense.metrics import (
    aggregate,
    precision_recall_at_k,
    rank_with_random_tiebreak,
    ranking_metrics,
)


def test_precision_recall_手算對照():
    # 10 筆、4 個正例；排序前 5 筆命中 3 個
    y = np.array([1, 1, 1, 0, 0, 0, 0, 0, 0, 1])
    order = np.array([0, 1, 3, 4, 2, 5, 6, 7, 8, 9])
    precision, recall = precision_recall_at_k(y, order, k=5)
    assert precision == pytest.approx(3 / 5)
    assert recall == pytest.approx(3 / 4)


def test_完美排序的_precision_為一():
    y = np.array([1] * 3 + [0] * 7)
    order = np.arange(10)
    precision, recall = precision_recall_at_k(y, order, k=3)
    assert precision == pytest.approx(1.0)
    assert recall == pytest.approx(1.0)


def test_lift_等於_precision_除以盛行率():
    rng = np.random.default_rng(0)
    y = np.array([1] * 20 + [0] * 80)
    scores = np.concatenate([np.ones(20), np.zeros(80)])
    m = ranking_metrics(y, scores, rng, budgets=(0.10,))
    assert m["Lift@10%"] == pytest.approx(m["P@10%"] / m["prevalence"])


def test_recall_上限為_k_除以正例數():
    """預算 b 下即使 TopK 全中，Recall 也只能到 K/|P|。"""
    rng = np.random.default_rng(0)
    y = np.array([1] * 40 + [0] * 60)  # 100 筆、40 正例
    scores = np.concatenate([np.ones(40), np.zeros(60)])
    m = ranking_metrics(y, scores, rng, budgets=(0.10,))
    assert m["R@10%_ceiling"] == pytest.approx(10 / 40)
    assert m["R@10%"] == pytest.approx(m["R@10%_ceiling"])


def test_同分會被隨機打散():
    """全部同分時，不同 rng 必須給出不同順序，否則排序變成資料順序的函數。"""
    scores = np.zeros(200)
    a = rank_with_random_tiebreak(scores, np.random.default_rng(1))
    b = rank_with_random_tiebreak(scores, np.random.default_rng(2))
    assert not np.array_equal(a, b)


def test_同分打散不影響高分優先():
    scores = np.array([1.0, 0.0, 0.0, 1.0, 0.0])
    order = rank_with_random_tiebreak(scores, np.random.default_rng(0))
    assert set(order[:2].tolist()) == {0, 3}


def test_aggregate_統計正確():
    runs = [{"x": 0.1}, {"x": 0.2}, {"x": 0.3}]
    summary = aggregate(runs)
    assert summary.loc["x", "mean"] == pytest.approx(0.2)
    assert summary.loc["x", "std"] == pytest.approx(0.1)
    assert summary.loc["x", "n_runs"] == 3
    assert summary.loc["x", "ci95_low"] < 0.2 < summary.loc["x", "ci95_high"]


def test_預算太小會報錯():
    rng = np.random.default_rng(0)
    y = np.array([1, 0, 1, 0])
    with pytest.raises(ValueError, match="小於 1"):
        ranking_metrics(y, np.zeros(4), rng, budgets=(0.01,))
