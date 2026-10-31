# 圖表原始檔

簡報與文件用的靜態圖。**原始檔是本目錄的 `.html`**，用 [`diagram-design`](../.claude/skills/diagram-design/) skill 產生。

| 檔案 | 用途 |
| --- | --- |
| `review-routing-flow.html` | 複核分流流程圖，簡報第 5 段 |

## 重新匯出

改 `.html` 之後重跑，不要手改 `.svg` 或 `.png`：

```bash
uv run python .claude/skills/diagram-design/scripts/self_check.py diagrams/<name>.html
uv run python .claude/skills/diagram-design/scripts/export_svg.py diagrams/<name>.html
uv run python .claude/skills/diagram-design/scripts/export_png.py diagrams/<name>.svg docs/assets/<name>.png 2
```

PNG 輸出到 `docs/assets/`，因為 notecraftapp 只會把**筆記資料夾內**的相對圖片路徑改寫成 `/notes-assets/*`。筆記裡要用 markdown 的 `![]()` 語法引用，raw `<img>` 不會被改寫。

PNG 匯出需要 `playwright`：

```bash
uv pip install playwright && uv run playwright install chromium
```

## 色票

沿用 `trendlink-design` 的 navy `#1b4f9c` ＋ 金，與 `.notecraft/components/` 的互動元件一致。

**但品牌金 `#ed9b26` 不能當線條色**——對 paper `#f6f8fb` 只有 2.12:1，連非文字元素的 3:1 都不到。實際用：

| 用途 | 色值 | 對比 |
| --- | --- | --- |
| 線條、邊框 | `#c7641a` | 3.75:1 |
| 文字 | `#a04f15` | 5.47:1 |
| 填色 | `rgba(237,155,38,0.12)` | 僅裝飾，無門檻 |
| 次要色（模型路徑） | `#1b4f9c` | 7.49:1 |
