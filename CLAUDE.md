# SplitSense（歧見預判）

機器學習實作課程期末專題：**在部分標註下預測標註分歧，協助安排人工複核的優先順序**。英文用公開的真實多標註資料（TID-8），繁中用自建 pilot，兩者共用多語 Embedding 管線。

命名：`SplitSense` 是顯示名，`splitsense` 是目錄、repo 與 Python 套件名，中文名「歧見預判」用於報告與論文。

---

## 來源與真相

研究設計的原始脈絡在 notecraft 筆記 `機器學習實作系列第16週-期末專案.mdx` 的「期末專案定案」一節（`~/mandy/project/notecraft/src/content/notes/`）。規格搬進本 repo 之後，**以本 repo 的文件為準**；與筆記有出入時在本 repo 文件記下變更理由。

## 現況（2026-11-09）

- 研究規格 v0.13.0。**課堂版最低成功線六項全部完成**，唯一的選做項目（BGE-M3 + PCA 比較）也在 11/09 完成，91 個測試通過。下一步只剩簡報，沒有待寫的程式，進度看 `docs/20-progress.mdx`。
- 結果：hard 範圍 `R@10%`，隨機 9.5、entropy 規則 9.9、**同意標籤先驗（四列查表）18.5**、TF-IDF Logistic Regression 19.3、Gradient Boosting 19.4、**BGE-M3 + PCA(64) + LR 21.8**。
- **文字表示是比模型族更有效的槓桿。** 同一個 LR 只把 TF-IDF 換成 `bge-m3`：配對差 **+2.45 ± 0.72、5/5 全勝**；把 LR 換成 Gradient Boosting：+0.05 ± 0.27、2/5（與 0 無法區分）。
- **「查表拿到模型 95% 效果」這句話要加限定詞。** 查表佔 TF-IDF LR 的 95.9%，但只佔 BGE-M3 + LR 的 **84.9%**。那個 95% 量的是 TF-IDF 的天花板，不是這個任務的天花板。機制見研究規格 8.6.1：兩個模型都只送 neutral 組，差別在組內精確率（48.2% 對 52.7%）。
- entropy 在 hard 子集恆為常數、等於隨機，不能拿它當「不用 ML」的對照——那會高估 ML 貢獻。真正該比的是「前兩人同意了哪個標籤」。
- 評估範圍（Q11）已於 2026-10-31 決議：full 與 hard **兩者並列、以 hard 為主**。full 範圍已飽和——六個方法的 `P@10%` 全是 100.0 ± 0.0、`R@10%` 全是 20.1 ± 0.0，連 `bge-m3` 也一樣；該範圍的模型分數採部署式排序（Q12，2026-11-09）。
- 工具鏈：**uv + `src/splitsense/` 佈局 + `pyproject.toml`**，Python `>=3.12`（本機釘 3.13），版本鎖在 `uv.lock`。

```bash
uv sync --extra dev                     # 課堂版主線
uv sync --extra dev --extra embed       # 另加 BGE-M3（torch 約 2 GB）
uv run python scripts/run_eda.py        # 重現 Dataset Card 第 3 節
uv run python scripts/build_dataset.py  # split 與 reveal manifest
uv run python scripts/embed_texts.py    # bge-m3 向量，寫 artifacts/embeddings/ 快取
uv run python scripts/run_models.py     # 階梯 0–3 與 BGE，full／hard 兩個範圍
uv run pytest                           # 洩漏檢查與重現性
uv run ruff check src/ scripts/ tests/
```

## 文件分工

每一項決策只有一份真相，內容不重疊：

| 位置 | 管什麼 |
| --- | --- |
| `docs/index.mdx` | 總覽入口：一句話說明、核心結果、閱讀順序。不放新內容，結果用 `::include` 從研究規格嵌入 |
| `docs/00-research-spec.mdx` | 研究決策：研究問題與假設、問題形式化、資料協議、評估方法、時程與停損（十四章，改自 TrendMile PRD 骨架；第 12、13 章只指路） |
| `docs/10-dataset-card-goemotions.mdx` | 定案資料集的來源、授權、實測統計與已知限制 |
| `docs/20-progress.mdx` | **進度的單一真相**：做了沒、缺什麼。其他文件一律不帶狀態欄 |
| `docs/30-presentation.mdx` | 期末簡報內容。**衍生品**：數字來自研究規格，那邊改了這邊要跟著改，不在這裡訂新決策 |
| `docs/40-tech-stack.mdx` | **技術棧實況**：裝了什麼、版本、指令、程式與測試盤點。研究規格第 11 章只留「為什麼選」 |
| `docs/80-glossary.mdx` | 術語定義：每個名詞一個 `:::define{id="term.xxx"}`，其他文件用 `:ref[名詞]{id="term.xxx"}` 引用 |
| `docs/90-open-questions.mdx` | 待釐清事項與決議紀錄（`Qn` 編號，不重排、不回收） |
| `src/splitsense/config.py` | 實驗參數：路徑、split 比例與 seed、reveal 設定、預算與指標常數 |
| `tests/` | 實驗程式的不變量：洩漏檢查（研究規格 6.4）與重現性 |
| `openspec/specs/` | 暫停：課堂版期間不使用 |

**OpenSpec 於課堂版期間暫停使用（2026-10-31，Q6）**，`openspec/` 目錄保留，12/21 之後若接論文延伸再評估。期間不寫 change proposal，也不要用 `/opsx:*` 指令。課堂版的驅動方式是：研究規格 10.1 的時程當計畫，`tests/test_leakage.py` 與 `tests/test_reproducibility.py` 當不變量規格，`docs/90-open-questions.mdx` 當決策紀錄。

## 已定案的研究決策

- 專題目標是**排序**較可能分歧的項目，不是分類哪個標籤正確。
- 主要設定為部分觀測 `r=2`：只揭露 2 份標註，其餘隱藏；隱藏標註不得出現在特徵、統計或圖 adjacency 中。
- split 一律 item-level，讓同一筆資料的標註不會同時出現在訓練與測試。
- 英文與繁中分開報告指標，不只報 pooled score，讓英文樣本量不會遮住繁中的弱點。
- 機器翻譯資料只能當跨語壓力測試，不得當作繁中主證據。
- **課堂版只做英文**（2026-10-19 定案）。繁中 pilot、annotator 歷史特徵與 GraphSAGE 都在論文延伸；繁中 pilot 於 2026-10-31 決議不與課堂版並行。
- **BGE-M3 的 dense 輸出恆為單位長度**（SentenceTransformer 組態自帶 `Normalize` 模組），所以「要不要先 L2 normalize」不是可選項；可選的是 PCA 前要不要逐維標準化（CV 選「不做」）。PCA 維度由 CV 從 64／128／256 選出 **64**，**而且一定要放在 Pipeline 裡**——主成分是由資料算出的統計量，先對全部資料算一次就是洩漏（6.4 第 6 條）。
- Embedding 快取附 metadata（模型名稱、commit sha、`normalize_embeddings`、`max_length`、維度、item_id 順序），讀取時比對，任一項不同就重算。沿用錯誤的向量不會報錯，只會讓分數「跟上次差不多」。
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
- 分領域的規則在 `.claude/rules/`，動到對應檔案時自動載入，目錄見 [`.claude/rules/index.md`](.claude/rules/index.md)：
  - 實驗程式（洩漏、同分打散、配對比較）→ `experiments.md`
  - 文件撰寫（math fence、`docs:build`、術語 `:ref`、進度同步、notecraft 預覽）→ `notecraft-writing.md`
  - 靜態圖（diagram-design、配色、SVG）→ `diagrams.md`
