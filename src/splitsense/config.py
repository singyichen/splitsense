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

# --- Embedding（研究規格 7.2，課堂版選做）---
EMBEDDINGS_DIR = ARTIFACTS_DIR / "embeddings"
EMBED_MODEL_NAME = "BAAI/bge-m3"
# 釘住 commit sha（2026-11-09 解析自 HF main）。不釘的話模型在 HF 上被改了，
# 快取仍然會被當成有效，分數就跟不上實際用的權重。
EMBED_MODEL_REVISION: str | None = "5617a9f61b028005a4858fdac845db406aefb181"
EMBED_DIM = 1024
EMBED_BATCH_SIZE = 32
# 文字中位數只有 60 字元（Dataset Card 3），512 已遠超需求，不必付 8192 的代價
EMBED_MAX_LENGTH = 512
# bge-m3 的 SentenceTransformer 組態第三個模組就是 Normalize，輸出恆為單位長度
# ——「要不要 L2 normalize」在這一層不是可選項。這裡設 True 只是讓 metadata
# 誠實記錄實際拿到的向量；PCA 前真正可選的是逐維標準化，那個列進 grid。
EMBED_NORMALIZE = True
# PCA 維度列進 grid，由 CV 選（研究規格 7.3）
PCA_COMPONENTS = (64, 128, 256)
# CV 選出的定案值（研究規格 7.2.1）。只當 Pipeline 的預設，grid 會覆寫它
PCA_COMPONENTS_DEFAULT = 64
