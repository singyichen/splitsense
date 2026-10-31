# SplitSense（歧見預判）

> 以文字特徵與標註歷史預測標註分歧：英文與繁體中文複核排序之比較研究

在一筆資料只取得部分標註時，預測完整標註結果是否會出現分歧，讓固定的人工複核預算優先落在較可能分歧的項目上。

本專案是機器學習實作課程的期末專題，也是 Label Suite 的技術調研與離線原型；**不**取代標註者、**不**裁定哪一個標籤正確，也不把分歧直接等同於標註錯誤。

## 範圍

兩個版本，範圍不同（詳見 [研究規格 1.3](docs/00-research-spec.mdx)）：

| 層級 | 課堂版（12/21 前） | 論文延伸 | 內容 |
| --- | --- | --- | --- |
| 英文真實資料 | 必做 | 必做 | TID-8 `goemotions-atr`，只取恰好 3 份標註的 item |
| 隨機與規則基準 | 必做 | 必做 | 隨機排序、可見標籤熵、票數差距 |
| 傳統分類模型 | 必做 | 必做 | Logistic Regression、Random Forest 或 Gradient Boosting |
| 超參數調整 | 必做 | 必做 | `GridSearchCV` + `GroupKFold`（group 為 `item_id`） |
| 繁體中文 pilot | 不做 | 必做 | 150 至 300 筆，每筆至少 3 位標註者獨立標註 |
| Annotator 歷史特徵 | 不做 | 必做 | 只從 training items 計算 |
| 多語 Embedding | 選做 | 必做 | `BAAI/bge-m3` 本機產生，英文與繁中共用 |
| GraphSAGE | 不做 | 選做 | item–annotator 異質二分圖 |

繁中 pilot 於 2026-10-31 決議不與課堂版並行，整段在 12/21 之後才啟動。

## 進度

逐項進度在 [`docs/20-progress.mdx`](docs/20-progress.mdx)——那是進度的單一真相。

摘要（2026-10-31）：課堂版四層模型階梯全部跑通，原訂 11/15、提前於 10/31 完成，53 個測試通過。最低成功線六項完成五項，唯一缺口是**錯誤分析**。另外**登記表單尚未送出**，截止 11/30。

## 目前的結果

**hard 範圍**（可見 2 份一致的子集，test 3,153 筆、盛行率 24.67%、`R@10%` 上限 40.5%）：

| 模型 | PR-AUC | `R@10%` | `Lift@10%` |
| --- | ---: | ---: | ---: |
| Random | 24.9 ± 0.8 | 10.1 ± 0.9 | 1.02 |
| Visible entropy | 24.7 ± 0.3 | 10.6 ± 0.6 | 1.06 |
| Logistic Regression | 42.8 ± 1.4 | **19.4 ± 0.8** | 1.95 |
| Gradient Boosting | 44.6 ± 1.3 | **19.4 ± 0.6** | 1.94 |

兩個主要發現：

1. **主要指標在整個 test split 上已飽和。** 33.5% 的 item 可見標註已不一致、必然分歧，遠超過 10% 預算的名額，所以 entropy 規則就拿到 `P@10%` = 100%。真正可檢驗的範圍是「可見 2 份一致」的子集，那裡 entropy 恆為 0、退化成隨機。評估範圍的決定見 [Q11](docs/90-open-questions.mdx)。
2. **在那個子集上機器學習勝過規則，幅度接近兩倍**，而非線性模型沒有實質增益——Gradient Boosting 的 PR-AUC 高 1.8 個百分點，但主要指標完全相同、調參耗時 11 倍。

## 開發

需要 [uv](https://docs.astral.sh/uv/)、Python >= 3.12。

```bash
uv sync --extra dev
uv run python scripts/run_eda.py        # 重現 Dataset Card 第 3 節的統計
uv run python scripts/build_dataset.py  # 產生 split 與 reveal manifest
uv run pytest                           # 洩漏檢查與重現性
```

文件以 [notecraftapp](https://www.npmjs.com/package/notecraftapp) 檢視（需 Node >= 22）：

```bash
nvm use && npm install && npm run docs
```

## 文件

| 文件 | 內容 |
| --- | --- |
| [`docs/00-research-spec.mdx`](docs/00-research-spec.mdx) | 研究決策：問題、形式化、資料協議、方法、評估、時程與停損 |
| [`docs/10-dataset-card-goemotions.mdx`](docs/10-dataset-card-goemotions.mdx) | 定案資料集的來源、授權、統計與已知限制 |
| [`docs/20-progress.mdx`](docs/20-progress.mdx) | 進度的單一真相：做了沒、缺什麼 |
| [`docs/90-open-questions.mdx`](docs/90-open-questions.mdx) | 待釐清事項與決議紀錄（`Qn`） |

## 資料

本 repo 不收錄任何資料檔。英文資料由 `scripts/run_eda.py` 依原始授權自動下載到 `data/`（Apache-2.0）；繁中 pilot 的原始文字與個別 annotation 不公開。
