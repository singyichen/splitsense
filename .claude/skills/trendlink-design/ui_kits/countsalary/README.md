# UI Kit — 一鍵發薪 雲端人資管理系統 (Cloud HR / Payroll App)

A high-fidelity recreation of TrendLink's flagship SaaS, 一鍵發薪
(https://countsalary.trendlink.com.tw/), built from this design system's components.

## Screens
- **AppShell** — left sidebar (logo, module nav: 總覽 / 出勤 / 休假 / 排班 / 薪資計算 /
  管理報告, consultant CTA card) + top bar (search, 法遵 badge, notifications, user).
- **HRDashboard** — "早安" greeting, four KPI tiles, today's attendance table, and a
  法遵提醒 (compliance reminders) panel.
- **HRPayroll** — module Tabs + payroll table with 本薪/加班費/勞健保/實發金額 columns,
  totals footer, 匯出報表 / 一鍵發薪 actions.

The sidebar nav is interactive: 總覽 → dashboard, all other modules → the payroll table
demo (the modules without a bespoke screen are intentionally routed there as a stand-in).

## Files
- `index.html` — interactive app (also a Starting Point).
- `AppShell.jsx` — `AppIcons`, `AppShell`.
- `HRViews.jsx` — `HRDashboard`, `HRPayroll`, `KPI`, `SectionHead`.

## Notes
- Layout/feature set inferred from the public site's module list (出勤/休假/排班/薪資/報告)
  and marketing copy; we did not have the product's source. Tables use sample data.
- Icons are inline line SVGs (`AppIcons`); logo is `assets/logo/trendlink-logo.jpeg`.
