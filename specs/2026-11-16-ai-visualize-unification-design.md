# 設計：三張靜態圖轉成 @ai-visualize 元件

日期：2026-11-16
狀態：待核可
相關：`.claude/skills/content-visualize/SKILL.md`、`.claude/rules/diagrams.md`、`diagrams/README.md`

## 意圖與理由

**起點是個誤判，先說清楚。** 本設計原本寫的理由是「讓 content-present 能把這三張圖嵌成投影片」。
查證後不成立：`content-present` 是**一篇筆記一份簡報**，只掃該篇的
`import ... from '@notes/components/'`（SKILL.md:364）。期末簡報來自
`30-presentation.mdx`，而這三張圖在 `diagrams/README.md` 被明確標為**「非簡報用」**，
`30-presentation.mdx:85` 更白紙黑字寫著「刻意沒有做的：四個候選資料集比較（表格就夠）」
與「模型階梯……不要獨立一頁」。

作者已決定（2026-11-16）：**簡報只從 `30-presentation.mdx` 生成，這三張圖不進簡報。**
那兩條 2026-10-31 的判斷維持不變。

所以真正的理由換成兩個，與簡報無關：

1. **數字只剩一份真相。** 現在同一張圖的數字散在 `diagrams/*.html`、匯出的 `.svg`、
   以及 MDX 的 alt 文字三處。已經出事了：`00-research-spec.mdx:418` 的 alt 文字寫
   TF-IDF **19.4**、BGE-M3 **21.3**，但 SVG 與 `CLAUDE.md` 都是 **19.3 ／ 21.8**——
   v0.13.0 更新了五張圖的數字卻漏掉替代文字，螢幕報讀者拿到的是錯的
2. **文件內可互動。** 模型階梯「前一層答不了什麼」那句轉折、資料漏斗的四階段收斂，
   靜態圖只能擠成小字；元件可以點開

## 目標

1. `model-ladder`、`dataset-funnel`、`module-pipeline` 三張圖各有對應元件，並在其所屬文件嵌入
2. 數字的正本在元件；`diagrams/*.html` 退為 PNG 匯出與投影後備
3. 修正 `00-research-spec.mdx:418` 的過期 alt 文字

## 非目標

- **不碰 `30-presentation.mdx` 的內容決策**（:85「刻意沒有做的」原樣保留）
- 不動 `diagrams/README.md` 的「非簡報用」標記——那個分類依然正確
- 不動 8 個 ` ```text ` 區塊。經查全是欄位清單、指令列表、套件列表與目錄樹，不是視覺化
- 不新增文件層級的視覺化（總覽、術語表、待釐清事項刻意不畫圖，理由見 `20-progress.mdx`）
- 不改任何實驗數字或研究結論

## 反目標（做到了但算失敗）

- 為了統一而讓 `module-pipeline` 硬加互動，變成「為動而動」
- 刪掉 `diagrams/` 靜態圖產生鏈，連帶丟失無障礙 SVG 契約與 PNG 匯出
- 讓同一個數字在元件與 SVG 之間再次脫鉤

## 限制

- `diagrams/` 與 `docs/assets/` **全部保留**，不刪任何檔案（作者決定）
- 元件只能用白名單套件：`react`、`recharts`、`d3`、`lucide-react`、`motion`、`clsx` 等
- 互動元件掛 `client:idle`，**不用 `client:visible`**（`.claude/rules/notecraft-writing.md:39`）。
  注意 `content-visualize/SKILL.md:131,137` 的寫回範本用的是 `client:visible`，
  規則優先，這一處要手動覆寫
- 靜態元件不掛 `client:*`，但仍包在 `GeneratedFrame` 裡（`40-tech-stack.mdx:77-79` 的先例）
- 配色沿用 `metric-saturation.tsx` 與 `tech-stack-architecture.tsx` 已在用的 navy `#1b4f9c` ＋
  金 `#ed9b26` 與中性階，不另外讀 `trendlink-design`
- 本 repo 沒有 `tsconfig.json`，不跑 `tsc`／`astro build` 驗證元件
  （`content-visualize/SKILL.md:112-117`），驗證走 `npm run docs:build` 與實際檢視
- 生成走 `content-visualize` skill 既有管線，不手寫

## 採行方案

考慮過三種做法：

**A. 三個都 1:1 移植成靜態 React。** 零設計風險。
否決：那只是換個檔案格式，第 2 個理由（文件內可互動）完全沒達成。

**B. 三個都重新設計成互動。**
否決：`module-pipeline` 有四層 × 模組／腳本／不變量 ＋ 右側儲存層，
硬加互動容易變成「為動而動」。

**C. 依每張圖的性質決定。** ← **作者選定（2026-11-16）**
代價是三個元件不同調。但專案本來就有這個分野（`tech-stack-architecture` 已是刻意靜態），
C 只是把它講清楚。

## 各元件設計

資料來源：三張 `diagrams/*.svg` 已含所有字串，逐字搬即可；
`dataset-funnel` 的淘汰理由另見 `10-dataset-card-goemotions.mdx` §5.2。

### `dataset-funnel` — 互動：四階段逐步揭露

本來就是 57,703 → 31,603 的順序敘事。

- 四個階段按鈕 ／「下一步」推進
- 每階段顯示：剩餘候選數（4 → 3 → 1）、判準、被淘汰者與理由
- 第 4 階段顯示 57,703 → 31,766 → 31,603
- 已走過的階段淡化留在畫面上，不是切換式分頁——漏斗要看得出收斂
- **[我的決定]** 固定顯示一行結論摘要（「8 個子資料集 → 4 候選 → 1 定案 → 31,603 題」），
  不靠點擊才看得到終點。理由：Dataset Card 的讀者多半只掃過去，
  原本的 SVG 是一次全部攤開的，改成互動不該讓結論變得要互動才看得到

### `model-ladder` — 互動：點一列展開「前一層答不了什麼」

階梯的重點是層與層之間那句話，靜態圖只能擠在箭頭旁。

- **[我的決定]** **六列實線 ＋ 一列虛線**（0 隨機、1 entropy、1.5 先驗、2 LR、3 GB，
  加課堂版不做的「零樣本大語言模型」畫虛線）。依據是 `diagrams/model-ladder.svg` 的實際內容；
  alt 文字寫「五層」、`30-presentation.mdx:283` 寫「四層」，兩處都要跟著改口徑
- 每列顯示名稱與 `Recall@10%`；點開顯示超參數與那句轉折
- 階梯 2 一列兩個數字（TF-IDF 19.3 ／ BGE-M3 21.8），視覺上強調是同一個分類器換文字表示
- **[我的決定]** 階梯 1.5 的標題用 **「同意標籤先驗」**，副標註明「四列查表」。
  理由：研究規格 8.4 表與 `CLAUDE.md` 都用「先驗」當正式名稱，SVG 的「查表」是機制描述

### `module-pipeline` — 靜態，比照 `tech-stack-architecture`

兩張共用視覺語言、在技術棧同一篇前後腳出現，一動一靜會突兀。
它是查閱用的架構圖，不是敘事。

**坦白說這張的理由最弱**：不進簡報、不互動，只剩「數字單一真相」與
「同一篇文件裡兩張同語言的圖別一個是元件一個是 SVG」。若要縮範圍，先砍它。

- 四層（取得資料／資料協議／特徵／模型與分析），每層：模組、腳本、不變量
- 右側儲存層以虛線對應各層寫出的目錄
- 底部：六支腳本執行順序、共用的 `config.py` 與 `metrics.py`
- 不掛 `client:*` directive

## 連帶要改的

1. `00-research-spec.mdx:418` 的 alt 文字（19.4／21.3 → 19.3／21.8）隨換成元件一併修正
2. `00-research-spec.mdx:420` 的「圖上**箭頭**寫的是前一層答不了的問題」要改寫——
   改成點開展開後就沒有箭頭了
3. `40-tech-stack.mdx:186` 標題「（7 個）」→「（11 個）」，
   **表格補四列不是三列**——`course-stage-techniques` 現在就漏列了
4. `20-progress.mdx` 第 29-36 行的計數表：研究規格、Dataset Card、技術棧三列的
   靜態圖／互動元件欄全部要改；第 38 行那句「技術架構是元件但不互動」擴充為兩個靜態元件；
   依 `.claude/rules/notecraft-writing.md:16`，頂部日期與狀態同一個 commit 一起改
5. `.claude/rules/diagrams.md` 補**數字同步規則**：
   「圖的數字以元件為正本；`diagrams/*.html` 改了要在同一個 commit 重跑匯出」。
   比照 `20-progress.mdx:38` 既有的 `course-stage-techniques` 同步句
6. **[我的決定]** `00-research-spec.mdx` 文件版本 v0.14.1 → **v0.14.2**，加 Change Log 一條。
   理由：這次修掉一個事實錯誤（alt 文字）並改寫 §7.1 的圖，符合既有的版號慣例

## 留給實作者決定

- 三個元件的確切版面與色票層級（沿用既有元件的視覺語言）
- `model-ladder` 展開是手風琴或可多列同時展開
- `dataset-funnel` 的推進是否加 `motion` 轉場
- **[我的決定]** 無障礙契約比照 `metric-saturation.tsx`：`role="img"` ＋ 描述性 `aria-label`；
  兩個互動元件的狀態變更加 `aria-live="polite"`；有動畫就尊重 `prefers-reduced-motion`
- **[我的決定]** `@ai-visualize` 標記的 `prompt` 與 `caption` 由我依上述各點草擬。
  這段文字會透過元件外框的複製鈕給讀者看到，核可後若措辭要調整再說

## 驗收

- **[我的決定]** `npm run docs:build` 通過、**仍是 8 篇筆記**、無 `:ref`／`define` 錯誤。
  （原本寫「頁數不變（15）」無法驗證：build 報的是「8 篇筆記」，dist 有 17 個 html）
- 三篇文件各自 `import` 了對應元件
- 兩個互動元件掛 `client:idle`，`module-pipeline` 不掛
- **[我的決定]** 元件內數字與研究規格 8.4／Dataset Card §5 逐項核對，不只驗收那六個：
  階梯另有 40.5%、3,153 題、+2.45；漏斗另有 8→4→3→1、57,703／31,766／31,603
- `docs/assets/`、`diagrams/`、`30-presentation.mdx` 一個檔案都沒刪、沒改決策
