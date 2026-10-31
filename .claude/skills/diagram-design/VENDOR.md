# Vendored skill

本目錄是從上游複製進來的，**不要直接改**；要更新就重新複製一次並更新本檔。

| 項目 | 內容 |
| --- | --- |
| 來源 | https://github.com/cathrynlavery/diagram-design |
| 路徑 | `skills/diagram-design/` |
| 版本 | 2.6.136 |
| Commit | `0cf73c3fcc56667ad91a9a04c439ac6ccfabc9d1` |
| 取得日期 | 2026-10-31 |
| 授權 | MIT（見 `LICENSE`、`THIRD_PARTY_LICENSES.md`） |

## 更新方式

```bash
git clone --depth 1 https://github.com/cathrynlavery/diagram-design.git /tmp/dd
rm -rf .claude/skills/diagram-design
cp -R /tmp/dd/skills/diagram-design .claude/skills/diagram-design
cp /tmp/dd/LICENSE /tmp/dd/THIRD_PARTY_LICENSES.md .claude/skills/diagram-design/
# 然後更新本檔的版本、commit 與日期
```

## 相依

HTML 與 SVG 的產生只用 Python 標準庫。**只有 `scripts/export_png.py` 需要 `playwright`**（會啟動 chromium）：

```bash
uv pip install playwright && uv run playwright install chromium
```

沒裝 playwright 不影響出圖，只是不能直接匯出 PNG——可以改用瀏覽器開 HTML 後截圖。

## 與使用者層級那份的關係

`~/.claude/skills/diagram-design` 另有一份較舊的打包版。專案層級優先，所以本目錄會蓋過它。這樣做的理由是把版本釘在 repo 裡，換機器或他人 clone 時產出的圖才會一致。

`npm run skill:init` 只會覆寫 `content-visualize`、`content-present` 與 `trendlink-design`，不會動到本目錄。
