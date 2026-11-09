---
paths:
  - "docs/**"
  - ".notecraft/**"
---

# NoteCraft 文件撰寫

文件由 notecraftapp 1.13.0 呈現：notesDir 是 `docs/`，生成元件與 `series.json` 在專案根的 `.notecraft/`。

## 鐵律

- **數學式一律用 fenced ` ```math ` 區塊，不要用 `$$`。** notecraftapp 1.13.0 沒有 `remark-math` / `rehype-katex`，`$$` 區塊裡的 `{` 會被當成 JSX expression——行首的 `{\log ...}` 直接讓 build 失敗，而剛好是合法 JS 的 `{C}` 會被靜默吞掉。
- **改完 `docs/` 一律跑 `npm run docs:build`** 確認。數學式、`:ref` 找不到 id、`define` 重複都只有 build 會抓到。
- 新增或刪除 `docs/` 底下的文件時，同步改 `.notecraft/series.json`，它不會自動掃描。
- 任何影響進度的 commit 都要同步改 `docs/20-progress.mdx` 的狀態與頂部日期，與程式一起 commit。不要在其他文件新增狀態欄。
- 文件分工見 `CLAUDE.md`：每一項決策只有一份真相，其他文件引用、不抄寫。

## 術語與引用

- 名詞定義只寫在 `docs/80-glossary.mdx`，每個一個 `:::define{id="term.xxx" label="名詞"}`；id 用英文 kebab-case，改名只改 label、不改 id。
- 其他文件第一次提到時用 `:ref[名詞]{id="term.xxx"}` 連過去，不重寫定義。
- 要整段嵌入時，在來源包 `:::define{id="..."}`，引用處用 `::include{id="..."}`。

## 書寫

- 繁體中文書寫，技術名詞保留英文原文。
- frontmatter 至少 `title`、`description`、`tags`、`createdAt`、`updatedAt`；改內容時更新 `updatedAt`。
- 中文語境的冒號用全形「：」：半形 `:` 緊接文字可能被 remark-directive 當成指令。
- 狀態只用 `:badge[]`，不用 emoji。

## 預覽

- 固定 **port 4326**（4324 是 TrendMile、4325 是 trendlink-portal）；需要 Node ≥ 22，開 terminal 後先 `nvm use`。
- `npm run docs`（HMR，可從 UI 改檔）／`npm run docs:serve`（唯讀 + 自動 reload）／`npm run docs:build`。`.claude/launch.json` 有 `docs`、`docs-serve` 兩組設定。

## 互動元件

- `@ai-visualize` 生成元件放專案根的 `.notecraft/components/`，跟著文件一起 commit；互動元件掛 `client:idle`，不要用 `client:visible`。
- `npm run skill:init` 會覆寫 `content-visualize`、`content-present` 與 `trendlink-design`，本地修改會被蓋掉。
