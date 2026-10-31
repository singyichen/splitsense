# 圖表原始檔

簡報與文件用的靜態圖。**原始檔是本目錄的 `.html`**，用 [`diagram-design`](../.claude/skills/diagram-design/) skill 產生。

| 檔案 | 類型 | 簡報位置 |
| --- | --- | --- |
| `annotation-reveal-setup.html` | 示意圖 | 第 1 段 問題描述 |
| `annotation-count-leakage.html` | 長條圖 | 第 3 段 資料前處理 |
| `metric-saturation.html` | 堆疊比例圖 | 第 5 段 指標飽和 |
| `review-routing-flow.html` | 流程圖 | 第 5 段 評估範圍 |
| `baseline-results.html` | 長條圖 | 第 5 段 主結果 |
| `baseline-paired.html` | 斜線圖 | 第 5 段 配對證據 |
| `neutral-only-flagging.html` | 分組長條圖 | 第 5 段 錯誤分析 |

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

## 資料來源

所有數字取自 `artifacts/` 的實測產物，對應研究規格第 8 章與 Dataset Card：

| 圖 | 來源 |
| --- | --- |
| `annotation-count-leakage` | `artifacts/eda/標註數洩漏證據.csv` |
| `metric-saturation`、`review-routing-flow` | `scripts/run_baselines.py` 的範圍統計 |
| `baseline-results`、`baseline-paired` | `artifacts/models/summary_hard.csv`、`paired_vs_agreed_label_prior.csv` |
| `neutral-only-flagging` | `artifacts/error_analysis/agreed_label_profile.csv` |

`baseline-paired` 用的是**逐 seed 實測值**（17.83／18.96／19.41／17.79／18.88 對 18.60／19.72／20.56／18.84／19.39），不是從平均反推。

## 製圖時踩到的三個規則

- **長條圖焦點色只能一根。** 多根會讓「什麼是重點」失效。`baseline-results` 的焦點給查表，因為那是最反直覺的發現。
- **斜線圖沒有「列序」。** 線的位置由資料決定，不要寫列序說明——那是 dumbbell 的規則。
- **零值就是沒有長條。** `annotation-count-leakage` 的「1 份」與 `neutral-only-flagging` 的三組送複核率都是 0，只標數字、不畫假高度。
