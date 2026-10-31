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

`~/.claude/skills/diagram-design` 另有一份**較舊**的打包版（39 種圖型；本目錄是 45 種）。

**實測結果：用 Skill 工具叫起來時載入的是使用者層級那份，不是本目錄。** 2026-10-31 驗證，skill 回報的 base directory 是 `~/.claude/skills/diagram-design`。所以本目錄目前的作用是：

- 把版本與來源釘在 repo 裡，換機器或他人 clone 時有據可查
- `scripts/` 可以直接用絕對路徑呼叫（`uv run python .claude/skills/diagram-design/scripts/...`），這條路徑確實走本目錄的新版

要讓 Skill 工具也載入本目錄的版本，得把使用者層級那份移除或同步更新：

```bash
rm -rf ~/.claude/skills/diagram-design
# 或同步成相同版本
cp -R .claude/skills/diagram-design ~/.claude/skills/diagram-design
```

`npm run skill:init` 只會覆寫 `content-visualize`、`content-present` 與 `trendlink-design`，不會動到本目錄。
