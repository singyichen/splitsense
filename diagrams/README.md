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
| `module-pipeline.html` | 管線圖 | 技術棧文件第 2 節（非簡報用） |

## 重新匯出

改 `.html` 之後重跑，不要手改 `.svg`：

```bash
uv run python .claude/skills/diagram-design/scripts/self_check.py diagrams/<name>.html
uv run python .claude/skills/diagram-design/scripts/export_svg.py diagrams/<name>.html
cp diagrams/<name>.svg docs/assets/<name>.svg
```

**筆記引用 SVG，不是 PNG。** SVG 約 7 KB、PNG 約 90 KB，而且 SVG 在任何解析度都銳利、文字可選取。七張合計 60 KB。

只有要放進簡報軟體時才需要 PNG（`export_png.py`，需要 `playwright`）：

```bash
uv pip install playwright && uv run playwright install chromium
uv run python .claude/skills/diagram-design/scripts/export_png.py diagrams/<name>.svg /tmp/<name>.png 2
```

notecraftapp 只會把**筆記資料夾內**的相對圖片路徑改寫成 `/notes-assets/*`，所以產物放 `docs/assets/`；筆記裡要用 markdown 的 `![]()` 語法，raw `<img>` 不會被改寫。

## 排版慣例

參考 `~/project/fullstack-ai-sdd-workflow-scaffold/docs/assets/illustrations/` 的做法調整過，七張都照這套：

**字型：CJK 排第一。**

```css
text { font-family: 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
```

不要把 Geist 之類的拉丁字型排前面——它沒有中文字，結果會是同一行裡數字用 Geist、中文用 Noto，字重與字寬不協調。

**樣式用 class，不要逐個 `<text>` 寫屬性。** `<style>` 區塊放在 `<desc>` 之後、`<defs>` 之前，這樣 `export_svg.py` 抽出 `<svg>` 節點時會一起帶走。目前的 class：

| 排版 | | 顏色 | |
| --- | --- | --- | --- |
| `.h` | 12px 700 | `.ink` | `#262e3d` |
| `.h2` | 11px 700 | `.muted` | `#4f5b6e` |
| `.q` | 11px | `.navy` | `#1b4f9c` |
| `.n9` / `.sub` | 9px | `.acc` | `#a04f15` |
| `.lg` / `.val` | 8px | `.inv` | `#ffffff` |
| `.chip` | 7px | `.pale` | `#d6e4f5` |
| `.mono` | 等寬 | | |

**固定尺寸、2 倍 viewBox。** `viewBox="0 0 1000 540"` 配 `width="2000" height="1080"`，retina 螢幕上銳利。

**整張圖是一張白底卡片。** `<rect x="0.5" y="0.5" width="999" height="539" rx="10" fill="#ffffff" stroke="#e1e6ee"/>`，圖才有邊界、坐在頁面上。因為卡片是白的，所有防止線條穿透的遮罩也要是 `#ffffff`，不能用頁面底色。

**圖與表並列，不是二選一。** 圖給形狀，表給查找，服務的是不同的閱讀行為。

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
| `module-pipeline` | 由 `import` 反查，見下方指令 |

`baseline-paired` 用的是**逐 seed 實測值**（17.83／18.96／19.41／17.79／18.88 對 18.60／19.72／20.56／18.84／19.39），不是從平均反推。

## 製圖時踩到的三個規則

- **長條圖焦點色只能一根。** 多根會讓「什麼是重點」失效。`baseline-results` 的焦點給查表，因為那是最反直覺的發現。
- **斜線圖沒有「列序」。** 線的位置由資料決定，不要寫列序說明——那是 dumbbell 的規則。
- **零值就是沒有長條。** `annotation-count-leakage` 的「1 份」與 `neutral-only-flagging` 的三組送複核率都是 0，只標數字、不畫假高度。

## 重新反查模組相依

`module-pipeline` 的內容來自程式碼，不是手寫的。要確認有沒有漂移：

```bash
# 模組之間
for f in src/splitsense/*.py; do n=$(basename $f .py); [ "$n" = "__init__" ] && continue;
  printf "%-18s %s\n" "$n" "$(grep -oE 'from splitsense\.[a-z_]+ import' $f | sed -E 's/from splitsense\.([a-z_]+) import/\1/' | sort -u | tr '\n' ' ')"; done

# 誰被 import 最多次
grep -rhoE "from splitsense\.[a-z_]+ import" src/ scripts/ tests/ | sed -E 's/.*\.([a-z_]+) import/\1/' | sort | uniq -c | sort -rn
```
