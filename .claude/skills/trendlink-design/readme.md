# 聯和趨動 TrendLink — Design System

A brand & UI design system for **聯和趨動股份有限公司 (TrendLink Co., Ltd.)**, Taiwan's
first labor-relations / management consultancy to obtain a stock code (**股票代號 7645**).
Founded 2018 in Kaohsiung, TrendLink fuses **科技 × 法務 × 人資** (technology × legal ×
HR) to serve small & medium enterprises (SMEs).

This system encodes that brand into reusable tokens, components, foundation specimens,
and full-screen UI-kit recreations so any agent can design *on-brand* TrendLink material.

---

## Sources

Everything here was reconstructed from public brand materials (no codebase / Figma was
provided). Store these in case the reader has access:

- **Official site:** https://www.trendlink.com.tw/ (home, `/about`, `/solution`)
- **Products:** 一鍵發薪 雲端人資系統 → https://countsalary.trendlink.com.tw/ ·
  日日考核 績效系統 → `/service/value2up` · 勞資風險檢測 → https://risk-radar.trendlink.com.tw/
- **Uploaded assets:** `uploads/trendlink official site snapshot.png`,
  `uploads/trendlink logo.jpeg` (copied to `assets/logo/`)

> ⚠ **Reconstructed, not extracted.** Colors were sampled from the logo + site
> screenshot; type is a best-match (Noto Sans TC). See *Caveats* at the bottom and
> the substitution notes in `tokens/fonts.css`.

---

## Company & product context

**What TrendLink does** — helps SMEs build stable, harmonious labor relations through a
"system + consultant" (軟硬整合) model:

| Product / Service | zh-TW | What it is |
|---|---|---|
| **一鍵發薪** | 雲端人資管理系統 | Cloud HR/payroll: 計薪、排班、休假、出勤、管理報表、法遵自動查核 |
| **日日考核** | 績效管理系統 | Performance mgmt; first 行為積分制 (behavior-points) appraisal |
| **顧問服務** | 勞資 / 企管顧問 | Labor-law & HR advisory, 薪資委外, 商模股權 |
| **企業培訓 / 課程** | 教育訓練・講座 | Corporate training, HR certification, AI 商務人才培訓 |

**Brand spirit (聯和趨動 acrostic):** 聯結夥伴 · 和睦溝通 · 趨動前進 · 動見成長.
**Positioning:** "中小企業最佳的勞資顧問" — the SME owner's trusted, tech-forward partner.
**Tagline seen on site:** 運用科技力量，提供全方位的勞資法務、人力資源解決方案。

---

## CONTENT FUNDAMENTALS — how TrendLink writes

- **Language:** Traditional Chinese (zh-TW), professional but warm. Occasional English
  product/format terms (AI, ESG, TTQS). Numerals in Arabic figures.
- **Voice / person:** Speaks to the owner as **「您」** (respectful "you"); refers to itself
  as **「我們」**. Consultative and reassuring — *"讓我們成為您的專業顧問"*, *"為您分析潛藏風險"*.
- **Tone:** Authoritative + empathetic. Leads with the SME's pain ("身兼多職，無所不能？")
  then offers a calm, concrete solution. Never alarmist; "穩健"、"和諧"、"信賴" recur.
- **Casing:** English wordmark set as **TREND LINK** (spaced, uppercase) or *Trend Link Co., Ltd.*
- **Headlines:** short, benefit-led, often 4–8 characters or a balanced couplet
  (*"聚焦人才管理 提供企業成長動能"*). Body runs longer, explanatory, relaxed line-height.
- **Eyebrows / labels:** short English overlines (SOLUTIONS, SERVICE) above zh-TW headings.
- **Proof points:** trust through numbers & credentials — *近800家中小企業*, *股票代號 7645*,
  government grants, TTQS, awards. Use the `Stat` component for these.
- **CTAs:** verb-first, polite imperative — **了解更多**, **立即諮詢**, **聯絡我們**, **訂閱**.
- **Emoji:** **none.** Not part of the brand. Use icons instead.

### Vocabulary cheat-sheet
勞資 (labor-management) · 法遵 (compliance) · 人資 (HR) · 職能 (competency) · 績效考核
(performance appraisal) · 輔導 (advisory/coaching) · 中小企業 (SME) · 數位轉型 ·
勞動法令 · 工作規則 · 薪資結構.

---

## VISUAL FOUNDATIONS

**Overall feel:** clean, corporate, trustworthy, with a tech-startup lightness. White /
pale-blue surfaces, confident navy structure, warm golden accents for action and energy.

- **Color:** A two-pole brand —
  - **Brand blue** (`--blue-700 #1b4f9c` → `--blue-500 #2c6ebb`), the navy→azure of the
    site header & logo mark. Carries authority, structure, headings, links.
  - **Brand orange/gold** (`--orange-400 #ed9b26`, deep `--orange-500 #e37b24`), the logo
    swoosh & every CTA. Warmth + approachability. Used sparingly for *action*.
  - Cool, blue-tinted **neutrals** for text/surfaces. Semantic success/warning/danger/info.
- **Type:** One humanist sans (Noto Sans TC + Noto Sans for Latin). Black 900 for hero
  display, Bold 700 headings (often in brand blue), Regular 400 body. **Relaxed CJK
  leading (1.8)**; headings tight (1.25). Eyebrows tracked wide & uppercase.
- **Backgrounds:** predominantly **white / `--neutral-50`**. Hero & section dividers use the
  **navy→azure gradient** (`--gradient-header`, ~105°). Soft full-bleed photography on
  contact/CTA bands. **No** noisy textures, no purple gradients, no heavy patterns.
- **Imagery:** flat, friendly **line/spot illustrations** (people, devices, documents) in
  blue+orange; photography is bright, warm, real (SME owners, consultants). Cool-clean, not moody.
- **Corner radii:** gently rounded. Cards `--radius-lg (16px)`; inputs `--radius-md (10px)`;
  **buttons & tags are full pills** `--radius-pill` — a signature from the site CTAs.
- **Cards:** white, 1px subtle border + **soft shallow shadow** (`--shadow-sm`), often a
  4px **top accent stripe** (blue or orange) and a rounded icon medallion. Lift + deepen
  shadow on hover.
- **Shadows:** soft, **cool blue-tinted**, shallow (low spread). Orange CTAs get a warm
  glow on hover (`--shadow-accent`). No hard/black drop shadows.
- **Borders:** hairline `--neutral-200/300`; 2px brand-blue on focus/active fields.
- **Buttons:** golden pill = primary CTA; navy pill = secondary. Hover = darker shade +
  glow; **press = slight scale-down (0.97)**. Bold label, slight tracking.
- **Animation:** restrained & professional — fades and short rises (`--ease-out`),
  ~140–360ms. Hover lifts on cards, sliding underline on tabs. No bounce, no looping decor.
- **Hover states:** buttons darken; cards lift + shadow; links shift to deeper blue;
  soft-tint controls go one step darker.
- **Transparency / blur:** sparing. A translucent navy scrim over hero photos for legibility;
  no glassmorphism elsewhere.
- **Layout:** centered max-width `1200px`, generous section rhythm (`--section-pad-y`),
  4px spacing grid. Sticky top header (`--header-height 76px`) on the navy gradient.

---

## ICONOGRAPHY

- The live site mixes **flat 2-tone spot illustrations** (blue + orange, for service
  cards) with **simple line icons** (for nav, search, social). It does **not** use emoji
  and only rarely uses unicode glyphs.
- **This system standardizes on line icons** at ~2px stroke, rounded caps/joins — the
  closest match to the site's UI iconography. We did not have access to the site's own
  icon assets, so component cards and UI kits draw inline `<svg>` line icons in the
  **Lucide** visual style (≈2px stroke, 24px grid). **Substitution flagged** — swap for the
  brand's own icon set if provided.
  - To use Lucide directly in a build: `<script src="https://unpkg.com/lucide@latest"></script>`
    then `lucide.createIcons()`, or copy individual SVGs.
- **Illustrations:** the brand's spot illustrations live on the marketing site
  (`/data/adv/...png`). They were not re-bundled here (we don't recreate or generate
  imagery). Use `image-slot` placeholders or request the originals for production.
- **Logo:** `assets/logo/trendlink-logo.jpeg` — the round blue/orange mark. On dark
  backgrounds pair with the white zh-TW wordmark (see `guidelines/brand-logo.html`).

---

## Index — what's in this system

**Root**
- `styles.css` — the single entry point consumers link (`@import` manifest only).
- `readme.md` — this guide. · `SKILL.md` — Agent-Skill wrapper.

**`tokens/`** — `fonts.css` (webfonts), `colors.css`, `typography.css`, `spacing.css`
(radius/shadow/layout/motion), `base.css` (element resets + `.tl-eyebrow`, `.tl-title-accent`).

**`guidelines/`** — foundation specimen cards (Design System tab):
Colors (brand blue, brand orange, neutrals, semantic, gradients) · Type (headings, body,
scale) · Spacing (scale, radius, elevation) · Brand (logo, brand spirit).

**`components/`** — reusable React primitives (namespace `window.TrendLinkDesignSystem_b2a0d6`):
- `core/` — **Button**, **IconButton**
- `forms/` — **Input**, **Select**, **Checkbox**, **Switch**
- `display/` — **Card** + **CardIcon**, **Badge**, **Tag**, **Avatar**, **Stat**
- `navigation/` — **Tabs**
- `feedback/` — **Alert**

**`ui_kits/`**
- `website/` — marketing site recreation (home hero, services, solutions, testimonials, footer)
- `countsalary/` — 一鍵發薪 cloud HR/payroll app (dashboard, attendance, payroll, reports)

**`assets/`** — `logo/trendlink-logo.jpeg`.

---

## Caveats
- **No codebase or Figma** was provided; all visuals are reconstructed from the public site
  + uploaded logo/screenshot. Colors sampled directly; spacing/type are best-judgment.
- **Font is a substitution** (Noto Sans TC via Google Fonts CDN) — the site ships its own
  bundled CJK face. Provide the real font files to swap in.
- **Icons are a substitution** (inline Lucide-style line SVGs). Provide brand icon assets
  for exact fidelity.
- **Spot illustrations** from the site are not re-bundled (we don't recreate imagery).
