# SplitSense（歧見預判）

機器學習實作課程期末專題：**在部分標註下預測標註分歧，協助安排人工複核的優先順序**。英文用公開的真實多標註資料（TID-8），繁中用自建 pilot，兩者共用多語 Embedding 管線。

命名：`SplitSense` 是顯示名，`splitsense` 是目錄、repo 與 Python 套件名，中文名「歧見預判」用於報告與論文。

---

## 來源與真相

研究設計的原始脈絡在 notecraft 筆記 `機器學習實作系列第16週-期末專案.mdx` 的「期末專案定案」一節（`~/mandy/project/notecraft/src/content/notes/`）。規格搬進本 repo 之後，**以本 repo 的文件為準**；與筆記有出入時在本 repo 文件記下變更理由。

## 現況

- 2026-10-13 建立 repo，處於設計階段：研究規格尚未定稿，尚無實驗程式碼。
- 文件骨架（是否沿用 TrendMile PRD 的 14 章、如何改成研究型專案）尚未拍板。
- Python 工具鏈（uv / pip、版本、目錄佈局）尚未拍板；等寫第一行實驗程式碼時再定，不預先猜。

## 已定案的研究決策

- 專題目標是**排序**較可能分歧的項目，不是分類哪個標籤正確。
- 主要設定為部分觀測 `r=2`：只揭露 2 份標註，其餘隱藏；隱藏標註不得出現在特徵、統計或圖 adjacency 中。
- split 一律 item-level，讓同一筆資料的標註不會同時出現在訓練與測試。
- 英文與繁中分開報告指標，不只報 pooled score，讓英文樣本量不會遮住繁中的弱點。
- 機器翻譯資料只能當跨語壓力測試，不得當作繁中主證據。
- 最低成功線：英文真實資料 ＋ 繁中 pilot ＋ 完整 baseline ＋ 一個多語 Embedding 模型 ＋ 雙語獨立評估。GraphSAGE 沒做完或沒改善都不影響結論成立。
- 交件：2026-12-21（第 16 週）。

## 資料治理（public repo）

- **任何資料檔都不進版控**：`data/`、`artifacts/`、`runs/`、`outputs/` 已在 `.gitignore`。commit 前確認沒有原始文字、個別 annotation、embedding 向量或模型權重。
- 繁中 pilot 的原始文字與 annotator 身分只存本機；文件與範例一律用假資料或代號。
- 繁中 pilot 的文字在確認資料治理之前，**不得送往外部 Embedding API**（Voyage、Mistral），只用本機 `bge-m3`。
- 公開資料依其原始授權使用，在 Dataset Card 記錄來源與授權。

## 工作慣例

- 文件用繁體中文書寫，技術名詞保留英文原文。
- Commit 訊息用繁體中文 Conventional Commits。
