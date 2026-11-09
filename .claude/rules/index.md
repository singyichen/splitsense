# Rules Index

本檔不帶 `paths:`，永遠載入，作為規劃與討論階段的目錄；各規則檔帶 `paths:` frontmatter，只有動到符合 glob 的檔案時才自動載入。

| 規則 | 重點 | paths |
| --- | --- | --- |
| [experiments.md](./experiments.md) | 洩漏檢查、同分隨機打散、同一批 reveal seed、`GroupKFold` 用 `item_id`、配對比較、先加總再算比例 | `src/**`、`scripts/**`、`tests/**` |
| [notecraft-writing.md](./notecraft-writing.md) | 數學式用 ` ```math `、改完跑 `docs:build`、`series.json`、術語用 `:ref`、進度同步、port 4326 | `docs/**`、`.notecraft/**` |
| [diagrams.md](./diagrams.md) | diagram-design 不直接改、配色擇一、筆記引用 SVG、排版慣例 | `diagrams/**`、`docs/assets/**`、`.claude/skills/diagram-design/**` |

## 新增規則

1. 建立 `.claude/rules/<name>.md`，開頭寫 `paths:` frontmatter
2. 在本檔表格加一列（檔名、一句重點、paths）
3. `CLAUDE.md` 不動

規則檔只寫怎麼做、不能怎麼做；理由與背景放 `docs/`。
