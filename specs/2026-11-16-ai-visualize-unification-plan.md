# 三張靜態圖轉 @ai-visualize 元件 — 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `model-ladder`、`dataset-funnel`、`module-pipeline` 三張靜態 SVG 轉成 `@ai-visualize` 元件並嵌進各自文件，讓數字只有一份正本。

**Architecture:** 每個元件是 `.notecraft/components/<id>.tsx` 的 default export、無 props 的 React 元件，在 MDX 以 `{/* @ai-visualize */}` 標記 ＋ `<GeneratedFrame>` 包裹嵌入。兩個敘事型做成互動（`client:idle`），一個架構型維持靜態（不掛 directive）。`diagrams/` 與 `docs/assets/` 全部保留。

**Tech Stack:** React 18.3.1、lucide-react 0.469.0、recharts 2.15.4（僅在需要時）、Tailwind class、Astro MDX

**Spec:** `specs/2026-11-16-ai-visualize-unification-design.md`

## Global Constraints

- 互動元件一律 `client:idle`，**禁用 `client:visible`**（`.claude/rules/notecraft-writing.md:39`）。`content-visualize/SKILL.md:131,137` 的範本寫的是 `client:visible`，走管線時這一處必須手動覆寫
- 靜態元件不掛 `client:*`，但仍包在 `GeneratedFrame` 內（先例：`docs/40-tech-stack.mdx:77-79`）
- 配色只用既有的 navy `#1b4f9c` ＋ 金 `#ed9b26` ＋ 中性階，取自 `metric-saturation.tsx`／`tech-stack-architecture.tsx`。不混用 diagram-design 的黑白格線
- 禁用 emoji，圖示一律 `lucide-react`
- 本 repo 無 `tsconfig.json`，**不跑 `tsc`／`astro build` 驗元件**（`content-visualize/SKILL.md:112-117`），驗證一律走 `npm run docs:build`
- 繁體中文書寫，中文語境冒號用全形「：」
- `docs/assets/`、`diagrams/`、`docs/30-presentation.mdx` **一個檔案都不刪、一條決策都不改**
- 每個 task 結尾 commit，訊息用繁體中文 Conventional Commits

## Review Focus

本專案沒有 JS 測試框架，元件無法單元測試；以下五項是 build 不會抓、但會咬到人的，各自掛在擁有它的 task：

1. **數字再次脫鉤** —— 元件改了數字但 `diagrams/*.html` 沒改。Task 4 補同步規則，Task 1-3 各自核對
2. **`client:visible` 被管線寫回** —— 違反規則且 build 不會報錯。Task 1-3 各自 grep 驗證
3. **`GeneratedFrame` 重複 import** —— 同一篇文件 import 兩次會讓 MDX build 失敗。Task 2、3 的文件原本沒有這個 import，Task 3 的技術棧**已經有**，不可再加
4. **窄螢幕破版** —— 筆記頁要能在手機讀，互動元件的按鈕列與多欄版面需能收合。Task 1、2 驗收
5. **`prefers-reduced-motion` 未尊重** —— 加了 `motion` 轉場才會踩到。Task 1 驗收

---

### Task 1: `dataset-funnel` 互動元件

**Files:**
- Create: `.notecraft/components/dataset-funnel.tsx`
- Modify: `docs/10-dataset-card-goemotions.mdx:164`（整行替換）

**Interfaces:**
- Produces: `export default function DatasetFunnel()` — 無 props
- 資料來源：`diagrams/dataset-funnel.svg` 的字串逐字搬；淘汰理由另見 `docs/10-dataset-card-goemotions.mdx` §5.2

- [ ] **Step 1: 讀取資料來源**

讀 `diagrams/dataset-funnel.html` 與 `docs/10-dataset-card-goemotions.mdx` §5、§5.2，抄出四階段的判準、剩餘候選數、淘汰者與理由。

- [ ] **Step 2: 寫 `.notecraft/components/dataset-funnel.tsx`**

`export default function DatasetFunnel()`。內部常數 `STAGES`，四筆，每筆欄位：
`{ n: string; title: string; criterion: string; remaining: number; eliminated: { name: string; reason: string }[] }`。

必含數字（逐字核對，不得改寫）：
- 階段 1「保留逐人標註的子資料集」：TID-8 八個子資料集 → **4** 候選
- 階段 2「授權篩選」：剩 **3**；md-agreement 出局（上無開源授權、限非商業研究、須填表單申請）
- 階段 3「資料品質篩選」：剩 **1**；sentiment 出局（93.7% 分歧、圖碎成 305 塊）、CommitmentBank 出局（僅 1,200 題、97.9% 分歧）
- 階段 4「GoEmotions 子集篩選」：**57,703 → 31,766 → 31,603**

互動：`useState` 的目前階段 index，「下一步」按鈕 ＋ 四個階段按鈕可直接跳。已走過的階段淡化**留在畫面上**，不是切換式分頁。

固定摘要列（不靠點擊，永遠顯示）：`8 個子資料集 → 4 候選 → 1 定案 → 31,603 題`。

無障礙：外層 `role="img"` ＋ 描述性 `aria-label`；階段切換區 `aria-live="polite"`。若用 `motion`，以 `useReducedMotion()` 關閉動畫。

- [ ] **Step 3: 替換 `docs/10-dataset-card-goemotions.mdx:164`**

把 `![四階段篩選：…](./assets/dataset-funnel.svg)` 整行換成 `@ai-visualize` 標記 ＋ import ＋ `<GeneratedFrame>`，格式比照 `docs/40-tech-stack.mdx:53-79`。該檔**原本沒有** `GeneratedFrame` import，要新增。

`id: dataset-funnel`、`type: chart`、`status: generated`，`caption` 一句說明四階段怎麼收斂。

- [ ] **Step 4: build 驗證**

Run: `npm run docs:build`
Expected: `Complete!`、仍是 **8 篇筆記**、無錯誤

- [ ] **Step 5: 契約驗證**

```bash
grep -n 'client:idle' docs/10-dataset-card-goemotions.mdx          # 要有
grep -c 'client:visible' docs/10-dataset-card-goemotions.mdx       # 要 0
grep -c "import GeneratedFrame" docs/10-dataset-card-goemotions.mdx # 要 1
grep -oE '57,703|31,766|31,603|93\.7|97\.9|1,200|305' .notecraft/components/dataset-funnel.tsx | sort -u
```
Expected: 最後一行列出全部七個數字

- [ ] **Step 6: 窄螢幕與 reduced-motion 檢查**

用 `npm run docs` 開 port 4326，視窗縮到 375px 寬確認按鈕列不溢出；系統開「減少動態」確認無動畫。

- [ ] **Step 7: Commit**

```bash
git add .notecraft/components/dataset-funnel.tsx docs/10-dataset-card-goemotions.mdx
git commit -m "feat: 資料篩選漏斗改成 @ai-visualize 互動元件"
```

---

### Task 2: `model-ladder` 互動元件（含修正過期 alt 文字）

**Files:**
- Create: `.notecraft/components/model-ladder.tsx`
- Modify: `docs/00-research-spec.mdx:418`（整行替換）、`:420`（改寫「箭頭」那句）、frontmatter 與 §1.1 版號、§14 Change Log

**Interfaces:**
- Produces: `export default function ModelLadder()` — 無 props
- 資料來源：`diagrams/model-ladder.svg` 已含全部字串

- [ ] **Step 1: 寫 `.notecraft/components/model-ladder.tsx`**

`export default function ModelLadder()`。內部常數 `RUNGS`，欄位：
`{ n: string; title: string; subtitle: string; hyper: string; scores: { label: string; value: number }[]; transition: string; dashed?: boolean }`。

**六列實線 ＋ 一列虛線**：

| n | 標題 | `Recall@10%` |
| --- | --- | --- |
| 0 | 隨機排序 | 9.5 |
| 1 | 可見標籤 entropy | 9.9 |
| 1.5 | **同意標籤先驗**（副標「四列查表，不用訓練」） | 18.5 |
| 2 | Logistic Regression | TF-IDF **19.3** ／ BGE-M3 **21.8** |
| 3 | Gradient Boosting | 19.4 |
| — | 零樣本大語言模型 | `dashed: true`，課堂版不做 |

階梯 1.5 標題用「同意標籤先驗」（非 SVG 的「查表」），理由見設計。
階梯 2 一列兩個數字，視覺上強調是同一個分類器換文字表示。
另含：`C（最佳 0.003）；BGE-M3 另加 PCA 64`、理論上限 **40.5%**、難題組 **3,153** 題、換文字表示 **+2.45** 個百分點。

互動：點一列展開該列的 `hyper` 與 `transition`。無障礙與 reduced-motion 同 Task 1。

- [ ] **Step 2: 替換 `docs/00-research-spec.mdx:418`**

換成 `@ai-visualize` 標記 ＋ import ＋ `<GeneratedFrame>`（`id: model-ladder`、`type: diagram`）。該檔**原本沒有** `GeneratedFrame` import，要新增。

**alt 文字的錯誤數字不得沿用到 caption**：舊文字寫 TF-IDF 19.4、BGE-M3 21.3，正確是 **19.3 ／ 21.8**。

- [ ] **Step 3: 改寫 `docs/00-research-spec.mdx:420`**

原句「圖上**箭頭**寫的是前一層答不了的問題」——改成互動後沒有箭頭，改述為點開該層即可看到。

- [ ] **Step 4: 版號與 Change Log**

frontmatter `updatedAt`、`文件版本`、`更新日期`，與 §1.1 表格一起改成 **v0.14.2** ／ **2026-11-16**。§14 加一條 `### [0.14.2] - 2026-11-16`，寫明：模型階梯改元件、**修正 §7.1 圖的替代文字把 19.4／21.3 寫成了正確的 19.3／21.8**（v0.13.0 更新五張圖時漏掉）。

- [ ] **Step 5: build 驗證**

Run: `npm run docs:build`
Expected: `Complete!`、8 篇筆記、無錯誤

- [ ] **Step 6: 契約與數字驗證**

```bash
grep -c '19\.4.*21\.3\|21\.3' docs/00-research-spec.mdx    # 舊的錯數字要 0
grep -c 'client:visible' docs/00-research-spec.mdx          # 要 0
grep -c "import GeneratedFrame" docs/00-research-spec.mdx   # 要 1
grep -oE '9\.5|9\.9|18\.5|19\.3|19\.4|21\.8|40\.5|3,153|2\.45' .notecraft/components/model-ladder.tsx | sort -u
```
Expected: 第一行 0；最後一行列出全部九個數字

- [ ] **Step 7: 窄螢幕檢查**（同 Task 1 Step 6）

- [ ] **Step 8: Commit**

```bash
git add .notecraft/components/model-ladder.tsx docs/00-research-spec.mdx
git commit -m "feat: 模型階梯改成 @ai-visualize 互動元件，並修正過期的替代文字"
```

---

### Task 3: `module-pipeline` 靜態元件

**Files:**
- Create: `.notecraft/components/module-pipeline.tsx`
- Modify: `docs/40-tech-stack.mdx:85`（整行替換）、`:186` 標題與其下表格

**Interfaces:**
- Produces: `export default function ModulePipeline()` — 無 props，**不掛 `client:*`**
- 視覺語言與同篇的 `tech-stack-architecture.tsx` 一致：深色膠囊壓在容器上緣標層級、圓角容器框住每層、虛線＝選配或非主線

- [ ] **Step 1: 寫 `.notecraft/components/module-pipeline.tsx`**

`export default function ModulePipeline()`。四層，每層 `{ n, title, modules, script, invariant }`：

| n | 層 | 模組 | 腳本 | 不變量 |
| --- | --- | --- | --- | --- |
| 1 | 取得資料 | `data.py · eda.py` | `run_eda.py` | 切 split 前先文字去重，同一段文字不得同時落在 train 與 test |
| 2 | 資料協議 | `split.py · reveal.py` | `build_dataset.py` | 只用可見的 2 份建特徵；隱藏標註不得進入特徵或統計 |
| 3 | 特徵 | `features.py · embeddings.py` | `embed_texts.py` | 兩者都只由 training 決定；PCA 在 Pipeline 裡逐折 fit |
| 4 | 模型與分析 | `baselines.py · models.py · error_analysis.py` | `run_models.py` 等 3 支 | 只取恰好 3 份標註的 item，分母固定 |

外部來源：HuggingFace `MichiganNLP/TID-8` goemotions-atr。
右側儲存層以虛線對應：`data/raw/`、`artifacts/eda/`、`artifacts/manifests/`、`artifacts/embeddings/`、`artifacts/{baselines,models,error_analysis}`。
底部：六支腳本執行順序、共用的 `config.py` 與 `metrics.py`。
數字：TF-IDF **31,451** 維、PCA **64**、split **70/15/15**、揭露 **2** 份。

無障礙：`role="img"` ＋ 描述性 `aria-label`（可沿用現有 SVG 的 `<desc>`）。

- [ ] **Step 2: 替換 `docs/40-tech-stack.mdx:85`**

換成 `@ai-visualize` 標記 ＋ `<GeneratedFrame>`（`id: module-pipeline`、`type: diagram`）。
**該檔已有 `import GeneratedFrame`（:74），不可再 import 一次**，只加 `import ModulePipeline`。
`<ModulePipeline />` **不掛 `client:*`**。

- [ ] **Step 3: 更新元件盤點表**

`:186` 標題「`@ai-visualize` 生成的元件（7 個）」→「（**11 個**）」。
表格補 **四** 列（`course-stage-techniques` 目前漏列）：

| 元件 | 方式 | 互動 |
| --- | --- | --- |
| `course-stage-techniques` | HTML ＋ 分頁 | 有（七站分頁） |
| `dataset-funnel` | 手寫 SVG | 有（逐步揭露） |
| `model-ladder` | 手寫 SVG | 有（點列展開） |
| `module-pipeline` | HTML ＋ lucide 圖示 | **無**，純靜態 |

其下那段「它與 `module-pipeline.svg` 共用視覺語言」要改寫——現在兩者都是元件了。

- [ ] **Step 4: build 驗證**

Run: `npm run docs:build`
Expected: `Complete!`、8 篇筆記、無錯誤

- [ ] **Step 5: 契約驗證**

```bash
grep -c "import GeneratedFrame" docs/40-tech-stack.mdx        # 要 1，不是 2
grep -A2 '<ModulePipeline' docs/40-tech-stack.mdx             # 不可出現 client:
grep -oE '31,451|70/15/15|PCA 64' .notecraft/components/module-pipeline.tsx | sort -u
```

- [ ] **Step 6: Commit**

```bash
git add .notecraft/components/module-pipeline.tsx docs/40-tech-stack.mdx
git commit -m "feat: 管線圖改成 @ai-visualize 靜態元件，元件盤點表補四列"
```

---

### Task 4: 進度同步與數字同步規則

**Files:**
- Modify: `docs/20-progress.mdx:29-36`（計數表）、`:38`（那句說明）、頂部日期與狀態
- Modify: `.claude/rules/diagrams.md`

**Interfaces:**
- Consumes: Task 1-3 完成後的元件數（11）與各篇的靜態圖／元件分布

- [ ] **Step 1: 改 `docs/20-progress.mdx` 的計數表**

表格兩欄是「靜態圖 ｜ 互動元件」，計的是**該篇實際顯示什麼**。
轉換後這三篇都不再引用 SVG（檔案仍留在 `docs/assets/`，但筆記不顯示它），
所以靜態圖欄改 `—`。三列的確切新值：

| 文件 | 靜態圖 | 互動元件 |
| --- | --- | --- |
| [研究規格](./00-research-spec.mdx) | `—` | `1（模型階梯）` |
| [Dataset Card](./10-dataset-card-goemotions.mdx) | `—` | `1（資料篩選漏斗）` |
| [技術棧](./40-tech-stack.mdx) | `—` | `2（技術架構、管線圖，皆靜態）` |

其餘五列不動。表格下方若有「七張靜態圖」之類的總計敘述，一併核對。

- [ ] **Step 2: 擴充 `:38` 那句**

原句只提「技術架構」一個靜態元件，現在有兩個（加 `module-pipeline`），改寫成兩個都列。

- [ ] **Step 3: 更新頂部日期與狀態**

依 `.claude/rules/notecraft-writing.md:16`，頂部日期改 **2026-11-16**。

- [ ] **Step 4: `.claude/rules/diagrams.md` 補數字同步規則**

加一條：**圖的數字以 `.notecraft/components/` 的元件為正本；`diagrams/*.html` 改了要在同一個 commit 重跑匯出**。比照 `docs/20-progress.mdx:38` 既有的 `course-stage-techniques` 同步句寫法。

- [ ] **Step 5: build 與全域一致性驗證**

```bash
npm run docs:build                                    # Complete!、8 篇筆記
ls .notecraft/components/*.tsx | wc -l                # 要 11
grep -c 'client:visible' docs/*.mdx | grep -v ':0'    # 要無輸出
git status --short -- docs/assets diagrams            # 要無輸出（一個檔都沒動）
```

- [ ] **Step 6: Commit**

```bash
git add docs/20-progress.mdx .claude/rules/diagrams.md
git commit -m "docs: 進度計數表跟上三個新元件，規則補圖表數字同步"
```
