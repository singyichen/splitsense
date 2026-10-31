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

## 狀態

資料協議完成：split 與 reveal manifest 已可重現，洩漏檢查與重現性測試通過。下一步是 TF-IDF 特徵與隨機／entropy 兩個基準。

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
| [`docs/90-open-questions.mdx`](docs/90-open-questions.mdx) | 待釐清事項與決議紀錄（`Qn`） |

## 資料

本 repo 不收錄任何資料檔。英文資料由 `scripts/run_eda.py` 依原始授權自動下載到 `data/`（Apache-2.0）；繁中 pilot 的原始文字與個別 annotation 不公開。
