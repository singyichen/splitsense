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

## 排序與比較

- 排序分數同分一律隨機打散（`metrics.rank_with_random_tiebreak`）。可見 entropy 這類規則只有少數離散值，依資料順序排會讓分數變成資料載入順序的函數。
- 比較兩個方法時確認它們跑在**同一批 reveal seed** 上。hard 子集的成員由 reveal 決定，少了這點兩列就不在同一份資料上。
- 訓練集疊加 5 個 reveal seed，`GroupKFold` 的 group 必須是 `item_id`。不疊加的話每個 item 只出現一次，`GroupKFold` 會退化成一般 `KFold`。
- **比較兩個方法一律用配對比較**（`metrics.paired_comparison`），不要只比平均 ± 標準差。配對標準差通常小得多：LR 對查表是 +0.85 ± 0.26、5/5 全勝，但各自的標準差都是 ±0.8，只看後者會誤判成無差異。
- 分數全同分的方法（hard 子集上的 entropy）要跑多個排序 seed，否則報出來的只是一次抽樣。

## 統計與錯誤分析

- 比例要在跨 seed **相加之後**才算，不要先算比例再相加——百分比會被一起加總。
- 「某組在錯誤中被高估」這類判斷，基準必須取自同一群體。拿 FN 佔分歧的比例去對 Dataset Card 佔全體 item 的比例，分母不同。

## 驗證

```bash
uv run pytest
uv run ruff check src/ scripts/ tests/
```

`uv` 若不在 PATH，用 `~/.local/bin/uv`。
