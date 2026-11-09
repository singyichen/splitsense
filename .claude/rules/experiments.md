---
paths:
  - "src/**"
  - "scripts/**"
  - "tests/**"
---

# 實驗程式慣例

所有實驗參數集中在 `src/splitsense/config.py`，不在程式裡寫死 seed、比例或預算。

## 洩漏

- 洩漏檢查（研究規格 6.4）的七條每條都要有測試。這類錯誤出錯時結果看起來更漂亮、而且不會報錯，整篇結論會直接失效卻不被發現。
- 隱藏標註不得出現在特徵、統計或圖 adjacency 中；`reveal.hidden_slots` 只供測試使用。
- 不得把標註數當特徵，也不得混入非 3 份標註的 item（標註數本身洩漏答案）。
- 門檻、詞彙表、先驗表只能由 train 或 val 決定，再套到 test 上。
- **PCA 必須放在 Pipeline 裡**，不可以先對全部資料算一次再切折。主成分是由資料的共變異數結構算出來的統計量，先算好等於把 test 的結構放進特徵——分數會變好而且不會報錯。可見標註特徵不經過 PCA，才能直接讀係數。

## 排序與比較

- 排序分數同分一律隨機打散（`metrics.rank_with_random_tiebreak`）。可見 entropy 這類規則只有少數離散值，依資料順序排會讓分數變成資料載入順序的函數。
- 比較兩個方法時確認它們跑在**同一批 reveal seed** 上。hard 子集的成員由 reveal 決定，少了這點兩列就不在同一份資料上。
- 訓練集疊加 5 個 reveal seed，`GroupKFold` 的 group 必須是 `item_id`。不疊加的話每個 item 只出現一次，`GroupKFold` 會退化成一般 `KFold`。
- **比較兩個方法一律用配對比較**（`metrics.paired_comparison`），不要只比平均 ± 標準差。配對標準差通常小得多：BGE-M3 LR 對 TF-IDF LR 是 +2.45 ± 0.72、5/5 全勝，但各自的標準差是 ±0.5 與 ±0.7，只看後者會誤判成無差異。
- 逐 seed 的指標值由 `metrics.per_seed_metric` 產出（`artifacts/models/per_seed_r10_hard.csv`）。斜線圖之類要用逐 seed 數字的地方一律從那裡取，不要從平均反推、也不要寫死在圖裡。
- 分數全同分的方法（hard 子集上的 entropy）要跑多個排序 seed，否則報出來的只是一次抽樣。

## Embedding

- `bge-m3` 的 dense 輸出**恆為單位長度**（SentenceTransformer 組態自帶 `Normalize` 模組），所以「要不要先 L2 normalize」不是可選項；可選的是 PCA 前要不要逐維標準化。
- Embedding 快取一定要附 metadata（模型名稱、commit sha、`normalize_embeddings`、`max_length`、維度、item_id 順序），讀取時逐項比對，任一項不同就重算。沿用錯誤的向量不會報錯，只會讓分數「跟上次差不多」。
- 編碼只跟文字有關、跟 reveal 無關，所以全部 item 編一次就給所有 reveal seed 共用。只用本機模型，不送往外部 Embedding API。

## 統計與錯誤分析

- 比例要在跨 seed **相加之後**才算，不要先算比例再相加——百分比會被一起加總。
- 「某組在錯誤中被高估」這類判斷，基準必須取自同一群體。拿 FN 佔分歧的比例去對 Dataset Card 佔全體 item 的比例，分母不同。

## 驗證

```bash
uv run pytest
uv run ruff check src/ scripts/ tests/
```

`uv` 若不在 PATH，用 `~/.local/bin/uv`。
