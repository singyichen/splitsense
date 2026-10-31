# SplitSense（歧見預判）

機器學習實作課程期末專題：**在部分標註下預測標註分歧，協助安排人工複核的優先順序**。英文用公開的真實多標註資料（TID-8），繁中用自建 pilot，兩者共用多語 Embedding 管線。

命名：`SplitSense` 是顯示名，`splitsense` 是目錄、repo 與 Python 套件名，中文名「歧見預判」用於報告與論文。

---

## 來源與真相

研究設計的原始脈絡在 notecraft 筆記 `機器學習實作系列第16週-期末專案.mdx` 的「期末專案定案」一節（`~/mandy/project/notecraft/src/content/notes/`）。規格搬進本 repo 之後，**以本 repo 的文件為準**；與筆記有出入時在本 repo 文件記下變更理由。

## 現況（2026-10-31）

- 研究規格 v0.7.0。**課堂版最低成功線六項全部完成**（分析工作超前約四週），70 個測試通過。
- 下一步只剩簡報，沒有待寫的程式。進度看 `docs/20-progress.mdx`。
- 結果：hard 範圍 `R@10%`，隨機 9.5、entropy 規則 9.9、**同意標籤先驗（四列查表）18.5**、Logistic Regression 19.4、Gradient Boosting 19.4。
- **查表已拿到模型 95% 的效果。** entropy 在 hard 子集恆為常數、等於隨機，所以不能拿它當「不用 ML」的對照——那會高估 ML 貢獻。真正該比的是「前兩人同意了哪個標籤」。文字模型的優勢是真的（配對 5/5 全勝）但只有 0.85 個百分點。
- **評估範圍有一題待拍板（Q11）**：`Recall@10%` 在整個 test split 上已飽和（33.5% 的 item 可見已不一致、必然分歧，遠超過 K=474），entropy 規則就拿到 `P@10%` = 100%。真正可檢驗的範圍是「可見 2 份一致」的 hard 子集，entropy 在那裡恆為 0、退化成隨機。兩個範圍都要報，以哪個為主待定。
- 工具鏈已定案：**uv + `src/splitsense/` 佈局 + `pyproject.toml`**，Python `>=3.12`（本機釘 3.13），版本鎖在 `uv.lock`。所有實驗參數集中在 `src/splitsense/config.py`。

```bash
uv sync --extra dev
uv run python scripts/run_eda.py        # 重現 Dataset Card 第 3 節
uv run python scripts/build_dataset.py  # split 與 reveal manifest
uv run pytest                           # 洩漏檢查與重現性
uv run ruff check src/ scripts/ tests/
```

## 文件分工

每一項決策只有一份真相，內容不重疊：

| 位置 | 管什麼 |
| --- | --- |
| `docs/00-research-spec.mdx` | 研究決策：研究問題與假設、問題形式化、資料協議、評估方法、時程與停損、術語表（十四章，改自 TrendMile PRD 骨架） |
| `docs/10-dataset-card-goemotions.mdx` | 定案資料集的來源、授權、實測統計與已知限制 |
| `docs/20-progress.mdx` | **進度的單一真相**：做了沒、缺什麼。其他文件一律不帶狀態欄 |
| `docs/30-presentation.mdx` | 期末簡報內容。**衍生品**：數字來自研究規格，那邊改了這邊要跟著改，不在這裡訂新決策 |
| `docs/90-open-questions.mdx` | 待釐清事項與決議紀錄（`Qn` 編號，不重排、不回收） |
| `src/splitsense/config.py` | 實驗參數：路徑、split 比例與 seed、reveal 設定、預算與指標常數 |
| `tests/` | 實驗程式的不變量：洩漏檢查（研究規格 6.4）與重現性 |
| `openspec/specs/` | 暫停：課堂版期間不使用 |

**OpenSpec 於課堂版期間暫停使用（2026-10-31，Q6）**，`openspec/` 目錄保留，12/21 之後若接論文延伸再評估。期間不寫 change proposal，也不要用 `/opsx:*` 指令。課堂版的驅動方式是：研究規格 10.1 的時程當計畫，`tests/test_leakage.py` 與 `tests/test_reproducibility.py` 當不變量規格，`docs/90-open-questions.mdx` 當決策紀錄。

## 用 notecraftapp 檢視文件

- 固定 **port 4326**（4324 是 TrendMile、4325 是 trendlink-portal）；需要 Node ≥ 22，開 terminal 後先 `nvm use`。
- `npm run docs`（HMR，可從 UI 改檔）／`npm run docs:serve`（唯讀 + 自動 reload）／`npm run docs:build`。`.claude/launch.json` 有 `docs`、`docs-serve` 兩組設定。
- 新增或刪除 `docs/` 底下的文件時，同步改 `.notecraft/series.json`，它不會自動掃描。
- `@ai-visualize` 生成元件放專案根的 `.notecraft/components/`，跟著文件一起 commit；互動元件掛 `client:idle`，不要用 `client:visible`。
- `npm run skill:init` 會覆寫 `content-visualize`、`content-present` 與 `trendlink-design`，本地修改會被蓋掉。

## 已定案的研究決策

- 專題目標是**排序**較可能分歧的項目，不是分類哪個標籤正確。
- 主要設定為部分觀測 `r=2`：只揭露 2 份標註，其餘隱藏；隱藏標註不得出現在特徵、統計或圖 adjacency 中。
- split 一律 item-level，讓同一筆資料的標註不會同時出現在訓練與測試。
- 英文與繁中分開報告指標，不只報 pooled score，讓英文樣本量不會遮住繁中的弱點。
- 機器翻譯資料只能當跨語壓力測試，不得當作繁中主證據。
- **課堂版只做英文**（2026-10-19 定案）。繁中 pilot、annotator 歷史特徵與 GraphSAGE 都在論文延伸；繁中 pilot 於 2026-10-31 決議不與課堂版並行。
- 最低成功線（課堂版）：GoEmotions ＋ item-level split ＋ reveal protocol ＋ 隨機／entropy／Logistic Regression（含調參）＋ 5 seeds 評估 ＋ 錯誤分析。
- 最低成功線（論文延伸）：英文真實資料 ＋ 繁中 pilot ＋ 完整 baseline ＋ 一個多語 Embedding 模型 ＋ 雙語獨立評估。GraphSAGE 沒做完或沒改善都不影響結論成立。
- 只取恰好 3 份標註的 item，分母固定。**標註數本身洩漏答案**（4 份 88.1%、5 份 85.5% 分歧率），不得混入其他標註數的 item，也不得把標註數當特徵。
- 文字去重後保留 31,603 個 item；上游 TID-8 的 split 不可沿用（test 有 96.0% 也出現在 train）。
- 交件：2026-12-21（第 16 週），發表可能排在 12/14，簡報須在 12/13 前完成。

## 資料治理（public repo）

- **任何資料檔都不進版控**：`data/`、`artifacts/`、`runs/`、`outputs/` 已在 `.gitignore`。commit 前確認沒有原始文字、個別 annotation、embedding 向量或模型權重。
- 繁中 pilot 的原始文字與 annotator 身分只存本機；文件與範例一律用假資料或代號。
- 繁中 pilot 的文字在確認資料治理之前，**不得送往外部 Embedding API**（Voyage、Mistral），只用本機 `bge-m3`。
- 公開資料依其原始授權使用，在 Dataset Card 記錄來源與授權。

## 工作慣例

- 文件用繁體中文書寫，技術名詞保留英文原文。
- Commit 訊息用繁體中文 Conventional Commits。
- **`docs/` 的數學式一律用 fenced ` ```math ` 區塊，不要用 `$$`。** notecraftapp 1.13.0 沒有 `remark-math` / `rehype-katex`，`$$` 區塊裡的 `{` 會被當成 JSX expression——行首的 `{\log ...}` 直接讓 build 失敗，而剛好是合法 JS 的 `{C}` 會被靜默吞掉。改完 `docs/` 一律跑 `npm run docs:build` 確認。
- 任何影響進度的 commit 都要同步改 `docs/20-progress.mdx` 的狀態與頂部日期，與程式一起 commit。不要在其他文件新增狀態欄。
- 洩漏檢查（研究規格 6.4）的七條每條都要有測試。這類錯誤出錯時結果看起來更漂亮、而且不會報錯，整篇結論會直接失效卻不被發現。
- 排序分數同分一律隨機打散（`metrics.rank_with_random_tiebreak`）。可見 entropy 這類規則只有少數離散值，依資料順序排會讓分數變成資料載入順序的函數。
- 比較兩個方法時確認它們跑在**同一批 reveal seed** 上。hard 子集的成員由 reveal 決定，少了這點兩列就不在同一份資料上。
- 訓練集疊加 5 個 reveal seed，`GroupKFold` 的 group 必須是 `item_id`。不疊加的話每個 item 只出現一次，`GroupKFold` 會退化成一般 `KFold`。
- **比較兩個方法一律用配對比較**（`metrics.paired_comparison`），不要只比平均 ± 標準差。配對標準差通常小得多：LR 對查表是 +0.85 ± 0.26、5/5 全勝，但各自的標準差都是 ±0.8，只看後者會誤判成無差異。
- 分數全同分的方法（hard 子集上的 entropy）要跑多個排序 seed，否則報出來的只是一次抽樣。
- 比例要在跨 seed **相加之後**才算，不要先算比例再相加——百分比會被一起加總。
- 「某組在錯誤中被高估」這類判斷，基準必須取自同一群體。拿 FN 佔分歧的比例去對 Dataset Card 佔全體 item 的比例，分母不同。
