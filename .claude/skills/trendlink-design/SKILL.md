---
name: trendlink-design
description: Use this skill to generate well-branded interfaces and assets for 聯和趨動 TrendLink (Taiwan labor-relations & management consultancy, stock code 7645), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out
and create static HTML files for the user to view. If working on production code, you can
copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to
build or design, ask some questions, and act as an expert designer who outputs HTML
artifacts _or_ production code, depending on the need.

## Quick map
- `styles.css` — link this one file to get all tokens + webfonts.
- `tokens/` — colors (navy blue `--blue-700` + golden `--orange-400`), typography (Noto Sans TC),
  spacing/radius/shadow/motion. Buttons & tags use the signature `--radius-pill`.
- `components/` — React primitives (Button, IconButton, Input, Select, Checkbox, Switch,
  Card, Badge, Tag, Avatar, Stat, Tabs, Alert). See each `.prompt.md` for usage.
- `ui_kits/website/` — marketing site recreation. `ui_kits/countsalary/` — 一鍵發薪 HR app.
- `guidelines/` — foundation specimen cards.
- `assets/logo/` — TrendLink logo.

## Brand in one breath
Professional, trustworthy, stable, with digital-tech polish and warmth toward SME owners.
Navy structure + golden CTAs on clean white/pale-blue surfaces. zh-TW copy that addresses
the owner as 「您」; no emoji; benefit-led headlines; trust via numbers (近800家, 7645).
