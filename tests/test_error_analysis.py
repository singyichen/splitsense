"""混淆矩陣與錯誤分析（研究規格 8.2、8.6）。"""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

from splitsense import config as cfg
from splitsense.baselines import agreed_label_prior, agreed_label_scores
from splitsense.error_analysis import (
    add_rates,
    agreed_label_profile,
    boundary_pairs,
    polarity_flip_share,
    sample_cases,
    signal_profile,
    text_signals,
)
from splitsense.metrics import (
    confusion_at_threshold,
    confusion_rates,
    outcome_labels,
    paired_comparison,
    threshold_at_budget,
)
from splitsense.reveal import build_reveal_manifest
from splitsense.split import build_split_manifest

# --- 門檻與混淆矩陣 ---


def test_門檻在預算處剛好選中_k_筆():
    scores = np.linspace(0, 1, 100)
    threshold = threshold_at_budget(scores, 0.10)
    assert (scores >= threshold).sum() == 10


def test_混淆矩陣各格與手算一致():
    y = np.array([1, 1, 0, 0])
    scores = np.array([0.9, 0.1, 0.8, 0.2])
    confusion = confusion_at_threshold(y, scores, threshold=0.5)
    assert confusion.iloc[1, 1] == 1  # TP：z=1 且被送複核
    assert confusion.iloc[1, 0] == 1  # FN
    assert confusion.iloc[0, 1] == 1  # FP
    assert confusion.iloc[0, 0] == 1  # TN


def test_混淆矩陣導出的比率():
    confusion = confusion_at_threshold(
        np.array([1, 1, 1, 0, 0, 0]), np.array([1.0, 1.0, 0.0, 1.0, 0.0, 0.0]), 0.5
    )
    rates = confusion_rates(confusion)
    assert rates["precision"] == pytest.approx(2 / 3)
    assert rates["recall"] == pytest.approx(2 / 3)
    assert rates["specificity"] == pytest.approx(2 / 3)
    assert rates["flag_rate"] == pytest.approx(3 / 6)


def test_outcome_標記四類():
    y = np.array([1, 1, 0, 0])
    scores = np.array([0.9, 0.1, 0.8, 0.2])
    assert outcome_labels(y, scores, 0.5).tolist() == ["TP", "FN", "FP", "TN"]


# --- 文字訊號 ---


def test_否定詞與模糊詞被抓到():
    texts = pd.Series(["I don't think so", "maybe it is fine", "plain text"])
    signals = text_signals(texts)
    assert signals["有否定詞"].tolist() == [1, 0, 0]
    assert signals["有模糊詞"].tolist() == [1, 1, 0]


def test_問號與多句():
    texts = pd.Series(["Really? Yes.", "one sentence"])
    signals = text_signals(texts)
    assert signals["有問號"].tolist() == [1, 0]
    assert signals["多句"].tolist() == [1, 0]


def test_signal_profile_按_outcome_分組():
    texts = pd.Series(["not good", "fine", "not bad", "ok"])
    outcomes = pd.Series(["TP", "TN", "TP", "TN"])
    profile = signal_profile(text_signals(texts), outcomes)
    assert profile.loc["TP", "有否定詞"] == pytest.approx(100.0)
    assert profile.loc["TN", "有否定詞"] == pytest.approx(0.0)
    assert profile.loc["TP", "n"] == 2


# --- 同意標籤 ---


def test_add_rates_在相加後才算比率():
    """原本的 bug：比率欄被跨 seed 相加，導致出現 232% 這種數字。"""
    counts = pd.DataFrame(
        {"TP": [1, 0], "FN": [1, 1], "FP": [1, 0], "TN": [1, 3]},
        index=pd.Index(["neutral", "positive"], name="同意的標籤"),
    )
    out = add_rates(counts)
    assert out.loc["neutral", "分歧率 (%)"] == pytest.approx(50.0)
    assert out.loc["positive", "分歧率 (%)"] == pytest.approx(25.0)
    assert out["分歧率 (%)"].max() <= 100.0
    # 沒被送複核的標籤不該有精確率
    assert np.isnan(out.loc["positive", "送複核的精確率 (%)"])


def test_agreed_label_profile_只回傳計數():
    manifest = pd.DataFrame({"visible_labels": [("neutral", "neutral"), ("positive", "positive")]})
    table = agreed_label_profile(manifest, pd.Series(["TP", "TN"]))
    assert "分歧率 (%)" not in table.columns


# --- 邊界組合 ---


def test_邊界組合用同一群體當基準(table):
    """FN 的組合分布必須跟「全部分歧」比，不能跟佔全體 item 的比例比。"""
    split = build_split_manifest(table)
    test_ids = set(split.loc[split["split"] == "test", "item_id"])
    manifest = build_reveal_manifest(table, seed=0)
    rows = manifest[manifest["item_id"].isin(test_ids) & manifest["visible_agree"]]
    rows = rows.reset_index(drop=True)

    rng = np.random.default_rng(0)
    scores = rng.random(len(rows))
    outcomes = outcome_labels(rows["z"].to_numpy(), scores, 0.9)

    fn = boundary_pairs(table.items, rows, outcomes, include=("FN",))
    allpos = boundary_pairs(table.items, rows, outcomes, include=("TP", "FN"))
    assert allpos["數量"].sum() >= fn["數量"].sum()
    assert fn["佔比 (%)"].sum() == pytest.approx(100.0, abs=0.5)
    assert allpos["佔比 (%)"].sum() == pytest.approx(100.0, abs=0.5)


def test_極性顛倒比例():
    pairs = pd.DataFrame(
        {"數量": [10, 5, 85], "佔比 (%)": [10.0, 5.0, 85.0]},
        index=["positive → negative", "negative → positive", "neutral → positive"],
    )
    assert polarity_flip_share(pairs) == pytest.approx(15.0)


# --- 同意標籤先驗基準 ---


def test_先驗只由_training_算出(table):
    split = build_split_manifest(table)
    train_ids = set(split.loc[split["split"] == "train", "item_id"])
    manifests = {s: build_reveal_manifest(table, seed=s) for s in cfg.REVEAL_SEEDS}
    prior = agreed_label_prior(manifests, train_ids)

    assert set(prior) <= set(cfg.LABELS)
    assert all(0.0 < v < 1.0 for v in prior.values())
    # 同意 neutral 的分歧率應明顯高於同意 positive
    assert prior["neutral"] > prior["positive"]


def test_先驗分數只依同意的標籤():
    prior = {"neutral": 0.44, "positive": 0.12}
    manifest = pd.DataFrame(
        {"visible_labels": [("neutral", "neutral"), ("positive", "positive")]}
    )
    assert agreed_label_scores(manifest, prior).tolist() == [0.44, 0.12]


def test_未見過的標籤用平均值填補():
    prior = {"neutral": 0.4, "positive": 0.2}
    manifest = pd.DataFrame({"visible_labels": [("ambiguous", "ambiguous")]})
    assert agreed_label_scores(manifest, prior)[0] == pytest.approx(0.3)


# --- 配對比較 ---


def test_配對比較的參考模型配對差為零():
    y = {0: np.array([1, 0] * 50), 1: np.array([0, 1] * 50)}
    scores = {
        "A": {0: np.linspace(0, 1, 100), 1: np.linspace(0, 1, 100)},
        "B": {0: np.linspace(1, 0, 100), 1: np.linspace(1, 0, 100)},
    }
    out = paired_comparison(y, scores, reference="A")
    assert out.loc["A", "配對差"].startswith("+0.00")
    assert out.loc["A", "勝的 seed 數"] == "0/2"


def test_配對比較報出勝的_seed_數():
    y = {0: np.array([1] * 10 + [0] * 90), 1: np.array([1] * 10 + [0] * 90)}
    good = np.concatenate([np.ones(10), np.zeros(90)])
    scores = {"weak": {0: 1 - good, 1: 1 - good}, "strong": {0: good, 1: good}}
    out = paired_comparison(y, scores, reference="weak")
    assert out.loc["strong", "勝的 seed 數"] == "2/2"


# --- 抽樣（含原始文字，只能寫 artifacts） ---


def test_抽樣含四類且不超過要求數量():
    n = 200
    rng = np.random.default_rng(0)
    texts = pd.Series([f"text {i}" for i in range(n)])
    scores = rng.random(n)
    y = (rng.random(n) < 0.3).astype(int)
    outcomes = outcome_labels(y, scores, 0.5)
    manifest = pd.DataFrame(
        {
            "item_id": [f"id{i}" for i in range(n)],
            "visible_labels": [("neutral", "neutral")] * n,
        }
    )
    samples = sample_cases(texts, scores, outcomes, manifest, n_errors=5, n_correct=4)
    assert set(samples["outcome"]) <= {"TP", "FP", "FN", "TN"}
    assert (samples["outcome"] == "FP").sum() <= 5
    assert (samples["outcome"] == "FN").sum() <= 5
    assert "text" in samples.columns
