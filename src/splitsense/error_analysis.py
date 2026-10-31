"""錯誤分析：模型抓不到什麼，以及錯誤有什麼共同特徵。

對應研究規格 8.6。課堂版至少要挑出模型判斷錯誤的案例並分析原因。

研究規格 8.6 列的錯誤類型多半需要人讀文字才能判斷，無法自動歸類。本模組
分兩層：

1. **可自動量化的訊號**（文字長度、否定詞、模糊詞、問號、多句、標註者同意
   了哪個標籤），按 TP／FP／FN／TN 分組比較。這層的彙總統計可以進文件。
2. **供人工閱讀的抽樣**，寫到 `artifacts/`（已在 .gitignore）。**原始文字
   不進版控也不進文件**（研究規格 9.3）。
"""

from __future__ import annotations

import numpy as np
import pandas as pd

# 研究規格 8.6 的錯誤類型中，可以用詞表近似的幾類
NEGATION = (
    r"\b(?:not|no|never|none|nothing|neither|nor|cannot|can't|won't|don't"
    r"|doesn't|didn't|isn't|aren't|wasn't)\b|n't\b"
)
HEDGE = (
    r"\b(?:maybe|perhaps|might|may|could|seems|seem|probably|possibly|somewhat"
    r"|guess|think|sort of|kind of|apparently|supposedly)\b"
)
INTENSIFIER = r"\b(?:very|really|so|extremely|absolutely|totally|completely|literally)\b"
SARCASM = r"(?:/s\b|\blol\b|\blmao\b|\byeah right\b|\.\.\.)"
CONDITIONAL = r"\b(?:if|unless|would|should|although|though|but|however)\b"


def text_signals(texts: pd.Series) -> pd.DataFrame:
    """每筆文字的表面訊號。全部可自動計算，不需要人判斷。"""
    lower = texts.str.lower()
    return pd.DataFrame(
        {
            "字元數": texts.str.len(),
            "詞數": texts.str.split().str.len(),
            "有否定詞": lower.str.contains(NEGATION, regex=True, na=False).astype(int),
            "有模糊詞": lower.str.contains(HEDGE, regex=True, na=False).astype(int),
            "有程度詞": lower.str.contains(INTENSIFIER, regex=True, na=False).astype(int),
            "有反諷標記": lower.str.contains(SARCASM, regex=True, na=False).astype(int),
            "有條件或轉折": lower.str.contains(CONDITIONAL, regex=True, na=False).astype(int),
            "有問號": texts.str.contains(r"\?", regex=True, na=False).astype(int),
            "有引號": texts.str.contains(r'["“”]', regex=True, na=False).astype(int),
            "多句": (texts.str.count(r"[.!?]") > 1).astype(int),
        },
        index=texts.index,
    )


def signal_profile(signals: pd.DataFrame, outcomes: pd.Series) -> pd.DataFrame:
    """按 TP／FP／FN／TN 分組的訊號平均值。

    字元數與詞數報平均，其餘是 0/1 指示值，平均即為出現比例（%）。
    """
    df = signals.copy()
    df["outcome"] = outcomes.to_numpy()
    grouped = df.groupby("outcome").mean(numeric_only=True)
    counts = df.groupby("outcome").size().rename("n")

    ratio_cols = [c for c in grouped.columns if c not in ("字元數", "詞數")]
    grouped[ratio_cols] = (grouped[ratio_cols] * 100).round(1)
    grouped[["字元數", "詞數"]] = grouped[["字元數", "詞數"]].round(1)
    return pd.concat([counts, grouped], axis=1).reindex(["TP", "FN", "FP", "TN"]).dropna(how="all")


def agreed_label_profile(manifest: pd.DataFrame, outcomes: pd.Series) -> pd.DataFrame:
    """前兩人同意了哪個標籤，按 outcome 分組。

    hard 子集上唯一會變動的可見特徵就是這個，所以它是判讀係數的直接對照。
    """
    agreed = manifest["visible_labels"].apply(lambda ls: ls[0])
    df = pd.DataFrame({"同意的標籤": agreed.to_numpy(), "outcome": outcomes.to_numpy()})
    # 只回傳計數。比率必須在跨 seed 相加之後才算，否則百分比會被一起加總。
    return pd.crosstab(df["同意的標籤"], df["outcome"])


def add_rates(counts: pd.DataFrame) -> pd.DataFrame:
    """在計數表上補分歧率與模型送複核率。"""
    out = counts.copy()
    total = out.sum(axis=1)
    positives = out.get("TP", 0) + out.get("FN", 0)
    flagged = out.get("TP", 0) + out.get("FP", 0)
    out["分歧率 (%)"] = (positives / total * 100).round(1)
    out["送複核率 (%)"] = (flagged / total * 100).round(1)
    # 沒被送複核的標籤沒有精確率可言，留 NaN 而不是 0
    precision = np.where(flagged > 0, out.get("TP", 0) / flagged.where(flagged > 0), np.nan)
    out["送複核的精確率 (%)"] = np.round(precision * 100, 1)
    return out


def boundary_pairs(
    items: pd.DataFrame,
    manifest: pd.DataFrame,
    outcomes: pd.Series,
    include: tuple[str, ...] = ("FN",),
) -> pd.DataFrame:
    """「同意的標籤 → 第三人的標籤」的組合分布。

    用來檢驗研究規格 8.6 的假設：模型抓不到的應該多半是相鄰類別的邊界題，
    而不是極性顛倒。

    `include` 決定看哪些 outcome。要判斷某一組是否「在漏掉的案例中被高估」，
    必須拿 `("FN",)` 與同一群體的全部分歧 `("TP", "FN")` 相比——不能拿去對
    Dataset Card 3.1 的數字，那是佔全體 item 的比例，分母不同。
    """
    labels_by_id = items.set_index("item_id")["labels"]
    rows = manifest.reset_index(drop=True).copy()
    rows["outcome"] = outcomes.to_numpy()
    selected = rows[rows["outcome"].isin(include)]

    pairs = []
    for _, row in selected.iterrows():
        full = labels_by_id.loc[row["item_id"]]
        agreed = row["visible_labels"][0]
        hidden = [full[i] for i in range(len(full)) if i not in set(row["visible_slots"])]
        for label in hidden:
            if label != agreed:
                pairs.append(f"{agreed} → {label}")
    if not pairs:
        return pd.DataFrame(columns=["數量", "佔比 (%)"])
    counts = pd.Series(pairs).value_counts()
    out = counts.to_frame("數量")
    out["佔比 (%)"] = (counts / counts.sum() * 100).round(1)
    return out


POLARITY_FLIP = {"positive → negative", "negative → positive"}


def polarity_flip_share(pairs: pd.DataFrame) -> float:
    """「極性顛倒」在給定組合分布中的比例。"""
    if pairs.empty:
        return 0.0
    flipped = pairs.index.intersection(POLARITY_FLIP)
    return float(pairs.loc[flipped, "佔比 (%)"].sum())


def sample_cases(
    texts: pd.Series,
    scores: np.ndarray,
    outcomes: pd.Series,
    manifest: pd.DataFrame,
    n_errors: int = 30,
    n_correct: int = 20,
    seed: int = 0,
) -> pd.DataFrame:
    """抽樣供人工閱讀。研究規格 8.6：30 FP、30 FN、20 個高信心正確案例。

    **回傳含原始文字，只能寫到 `artifacts/`，不得進版控或文件。**
    """
    rng = np.random.default_rng(seed)
    df = pd.DataFrame(
        {
            "item_id": manifest["item_id"].to_numpy(),
            "outcome": outcomes.to_numpy(),
            "score": np.asarray(scores, dtype=float),
            "同意的標籤": manifest["visible_labels"].apply(lambda ls: ls[0]).to_numpy(),
            "text": texts.to_numpy(),
        }
    )

    picks = []
    for outcome, size in (("FP", n_errors), ("FN", n_errors)):
        subset = df[df["outcome"] == outcome]
        take = min(size, len(subset))
        if take:
            picks.append(subset.iloc[rng.choice(len(subset), take, replace=False)])
    # 高信心正確：TP 取分數最高、TN 取分數最低
    tp = df[df["outcome"] == "TP"].nlargest(n_correct // 2, "score")
    tn = df[df["outcome"] == "TN"].nsmallest(n_correct - n_correct // 2, "score")
    picks.extend([tp, tn])

    return pd.concat(picks, ignore_index=True).sort_values(["outcome", "score"])
