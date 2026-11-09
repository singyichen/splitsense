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

摘要（2026-11-09）：**課堂版最低成功線六項全部完成**，唯一的選做項目（BGE-M3 + PCA 比較）也已完成，91 個測試通過。剩下的是**簡報**（含把 BGE 那一列補進圖表），加上一張**尚未送出的登記表單**（截止 11/30）。

## 目前的結果

**hard 範圍**（可見 2 份一致的子集，test 3,153 筆、盛行率 24.67%、`R@10%` 上限 40.5%）：

| 模型 | PR-AUC | `R@10%` | 對查表的配對差 | 勝的 seed |
| --- | ---: | ---: | ---: | ---: |
| Random | 24.5 ± 0.5 | 9.5 ± 0.6 | −9.05 ± 1.27 | 0/5 |
| Visible entropy | 24.7 ± 0.3 | 9.9 ± 0.9 | −8.33 ± 0.86 | 0/5 |
| Agreed-label prior（四列查表） | 39.5 ± 0.8 | 18.5 ± 0.8 | ±0.00 | — |
| Logistic Regression（TF-IDF） | 42.7 ± 1.4 | **19.3 ± 0.7** | **+0.77 ± 0.38** | **5/5** |
| Gradient Boosting（TF-IDF） | 44.6 ± 1.3 | 19.4 ± 0.6 | +0.83 ± 0.55 | 5/5 |
| Logistic Regression（BGE-M3 + PCA 64） | **44.7 ± 0.7** | **21.8 ± 0.5** | **+3.22 ± 0.86** | **5/5** |

四個主要發現：

1. **主要指標在整個 test split 上已飽和。** 33.5% 的 item 可見標註已不一致、必然分歧，遠超過 10% 預算的名額，所以 entropy 規則就拿到 `P@10%` = 100%；六個方法的 `R@10%` 全是 20.1 ± 0.0，一個都分不開。真正可檢驗的範圍是「可見 2 份一致」的子集，那裡 entropy 恆為 0、退化成隨機。評估範圍的決定見 [Q11](docs/90-open-questions.mdx)、full 範圍的排序方式見 [Q12](docs/90-open-questions.mdx)。
2. **文字表示是比模型族更有效的槓桿。** 同一個 Logistic Regression、同一批可見標註特徵，只把 TF-IDF 換成 `BAAI/bge-m3` 的向量：配對差 **+2.45 ± 0.72、5/5 全勝**。把 LR 換成 Gradient Boosting：+0.05 ± 0.27、2/5，與 0 無法區分。
3. **「一張四列查表已拿到模型 95% 的效果」要加限定詞。** 「前兩人同意了哪個標籤」的 training 分歧率（neutral 43.8%、ambiguous 34.7%、negative 22.0%、positive 12.1%）不需訓練、不需文字處理就拿到 `R@10%` 18.5%——那是 TF-IDF 模型的 95.9%，但只是 BGE-M3 模型的 84.9%。說「簡單方法就夠了」之前，要先確認拿來比的複雜方法已經盡力。
4. **模型在操作點上幾乎只做一件事。** 10% 預算下送複核的項目全部來自「兩人同意 neutral」，而該組內的精確率 48.1% 只比基礎分歧率 46.5% 高 1.6 個百分點。（這項錯誤分析的對象是 TF-IDF 模型。）

## 開發

需要 [uv](https://docs.astral.sh/uv/)、Python >= 3.12。

```bash
uv sync --extra dev                     # 課堂版主線
uv run python scripts/run_eda.py        # 重現 Dataset Card 第 3 節的統計
uv run python scripts/build_dataset.py  # 產生 split 與 reveal manifest
uv run python scripts/run_models.py     # 模型階梯，full／hard 兩個範圍
uv run pytest                           # 洩漏檢查與重現性
```

BGE-M3 那一列需要額外的 optional extra（會帶進 torch，環境多約 2 GB）：

```bash
uv sync --extra dev --extra embed
uv run python scripts/embed_texts.py    # 31,603 筆向量，MPS 上約 248 秒，寫快取
uv run python scripts/run_models.py
```

沒裝 `embed` extra 時 `run_models.py` 會跳過那一列，其餘照跑。

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
