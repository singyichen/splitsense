---
paths:
  - "diagrams/**"
  - "docs/assets/**"
  - ".claude/skills/diagram-design/**"
---

# 靜態圖（diagram-design）

`.claude/skills/diagram-design/` 是從 [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) 複製進來的（MIT，v2.6.136），版本釘在 repo 裡，細節見該目錄的 `VENDOR.md`。**不要直接改那個目錄**，要更新就照 `VENDOR.md` 的步驟重新複製。

**注意**：`~/.claude/skills/diagram-design` 另有一份較舊的（39 種圖型）。實測用 Skill 工具叫起來時載入的是**使用者層級**那份；`scripts/` 用絕對路徑呼叫才會走本目錄的新版。要統一就刪掉或同步使用者層級那份（見 `VENDOR.md`）。

## 鐵律

- **首次產圖前要先設定 style guide**（`references/style-guide.md`）。預設色票是 paper `#f5f5f5`、ink `#2d3142`、accent `#bf4520`，不要就這樣出圖——SplitSense 的視覺基準是 `trendlink-design` 的 navy `#1b4f9c` ＋ 金 `#ed9b26`，`.notecraft/components/` 的元件都照這套，**兩者擇一、不要混用**。
- 筆記引用 **SVG 不是 PNG**（7 KB 對 90 KB，且任何解析度都銳利）。PNG 只在要放進簡報軟體時才產。
- 圖的排版慣例（CJK 字型排第一、用 class 不用逐個屬性、白底卡片、2 倍 viewBox）見 `diagrams/README.md`。

## 工具

- 產出自包含 `.html` ＋ inline SVG，可再輸出 SVG／PNG。
- 只有 `scripts/export_png.py` 需要 `playwright`（會啟動 chromium）；HTML 與 SVG 只用 Python 標準庫。沒裝就改用瀏覽器開 HTML 截圖。
- `npm run skill:init` 不會動到這個目錄（它只覆寫 `content-visualize`、`content-present`、`trendlink-design`）。

## 分工以用途切，不以位置切

| 用途 | 工具 |
| --- | --- |
| 要讓讀者操作才懂的概念（拖動、逐步揭露、分頁對照） | `content-visualize` → `.notecraft/components/*.tsx` |
| 投影片用圖 | `diagram-design` → `diagrams/*.html` |
| 參考圖（架構、相依、流程，看一眼就走） | `diagram-design` |
