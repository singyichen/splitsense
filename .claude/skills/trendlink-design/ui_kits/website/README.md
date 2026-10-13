# UI Kit — 聯和趨動 行銷官網 (Marketing Website)

A high-fidelity recreation of the TrendLink marketing site (https://www.trendlink.com.tw/),
composed from this design system's components.

## Screens / sections
- **WebHeader** — sticky navy-gradient header, zh-TW nav, golden search circle.
- **WebHero** — gradient hero with stock-code badge, headline, CTAs, stat row, and a
  floating "一鍵發薪 本月薪資" product preview card.
- **WebServices** — the four-up service grid (一鍵發薪 / 日日考核 / 顧問服務 / 企業培訓)
  using accent `Card` + `CardIcon`.
- **WebFeatures** — numbered "持續進步" why-us columns.
- **WebTestimonials** — 客戶真心話 quote cards with avatars.
- **WebCTA** — gradient "立即諮詢" contact band.
- **WebFooter** — navy footer with address, link columns, legal row.

## Files
- `index.html` — composes the full page (also a Starting Point).
- `WebChrome.jsx` — `TLIcons`, `Logo`, `WebHeader`, `WebFooter`.
- `WebSections.jsx` — `WebHero`, `WebServices`, `WebFeatures`, `WebTestimonials`, `WebCTA`.

## Notes
- Spot illustrations from the live site are represented with line-icon medallions
  (`CardIcon`) — substitute the brand's own illustrations for production.
- Icons are inline Lucide-style SVGs (`TLIcons`). Logo is `assets/logo/trendlink-logo.jpeg`.
