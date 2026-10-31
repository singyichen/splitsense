"""路徑與全域常數。

所有實驗參數集中在此，讓 split 與 reveal 可以重現。
對應研究規格第 5、6 章。
"""

from __future__ import annotations

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_DIR = PROJECT_ROOT / "data"
RAW_DIR = DATA_DIR / "raw"
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts"

# --- 資料來源（研究規格 9.1、Dataset Card 1）---
HF_REPO = "MichiganNLP/TID-8"
HF_CONFIG = "goemotions-atr"
HF_FILES = {
    "train": "train-00000-of-00001-d1eecebcda8f63fc.parquet",
    "test": "test-00000-of-00001-01143ce8071fdccd.parquet",
}
HF_URL_TEMPLATE = "https://huggingface.co/datasets/{repo}/resolve/main/{config}/{filename}"

# --- 欄位對應（Dataset Card 2）---
# TID-8 的欄位名稱與語意不一致：`question` 是留言文字，`uid` 才是 item 識別碼，
# `id` 是每筆 annotation 的 row id。標準化成研究規格 6.1 的 schema。
COL_ITEM_ID = "uid"
COL_TEXT = "question"
COL_ANNOTATOR_ID = "annotator_id"
COL_LABEL = "answer"

# 載入後立刻丟棄：`author` 是 Reddit 使用者名稱，屬個資（研究規格 6.1、9.3）
DROP_COLUMNS = ("author",)

LABELS = ("positive", "negative", "ambiguous", "neutral")

# --- 子集定義（Dataset Card 2）---
# 只取恰好 3 份標註的 item，讓 entropy 的分母固定，且避免「標註數本身洩漏答案」
# （研究規格 6.4 第 7 條）。
ANNOTATIONS_PER_ITEM = 3

# --- 資料協議（研究規格 6.2、6.3）---
SPLIT_RATIOS = (0.70, 0.15, 0.15)
SPLIT_SEED = 20261031
REVEAL_SIZE = 2  # r = 2
N_REVEAL_SEEDS = 5
REVEAL_SEEDS = tuple(range(N_REVEAL_SEEDS))

# --- 評估（研究規格 8.1、8.2）---
BUDGETS = (0.05, 0.10, 0.20)
PRIMARY_BUDGET = 0.10
N_RANDOM_SEEDS = 30  # Baseline 0 至少 30 個 seed
