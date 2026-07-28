# 03 — Design System

The implementation-level token system. Values map to Tailwind theme + CSS variables. **Brand colors are extracted from the official logo** (`/logo/Sumago logo.png`): brand red `#D73438`, wordmark charcoal `~#373435`. A vector (SVG/AI) logo is still ideal for crisp web use — `[VERIFY]` request from client.

## Color tokens
Defined as CSS variables (HSL) consumed by Tailwind.

```css
:root {
  /* Brand — sampled from official logo */
  --brand-red:        358 67% 52%;  /* #D73438 — primary brand red */
  --brand-red-hover:  358 67% 44%;  /* darker for hover/active */
  --brand-red-ink:    358 70% 42%;  /* for red text on light bg (AA-safe) */
  /* Accent */
  --tech-blue:        214 90% 52%;  /* use sparingly */
  /* Neutrals — wordmark charcoal anchors the dark end */
  --ink:              0 0% 13%;     /* ~#212121 near-black text (warm charcoal in logo ~#373435) */
  --black:            0 0% 7%;
  --dark-gray:        0 0% 20%;
  --gray:             0 0% 45%;
  --light-gray:       0 0% 90%;
  --off-white:        0 0% 98%;
  --white:            0 0% 100%;
  /* Semantic */
  --background:       var(--white);
  --foreground:       var(--ink);
  --primary:          var(--brand-red);
  --muted:            var(--light-gray);
  --accent:           var(--tech-blue);
}
```
**Contrast note:** `#D73438` on white ≈ 4.0:1 — passes AA for **large text/UI** but *not* small body text. For red body text use `--brand-red-ink`; otherwise use red for headings, accents, and the logo, with body text in `--ink`.
Dark mode: invert background/foreground; keep brand red vivid; reduce pure-white text to `--off-white` to avoid glare.

**Contrast:** all text must meet WCAG AA (4.5:1 normal, 3:1 large). Brand red on white passes for large text; verify for body. See [13 — Accessibility](13-accessibility.md).

## Typography scale
Fixed **Tailwind step scale** (no fluid `clamp()` for type). Headings step responsively across breakpoints (e.g. `text-4xl sm:text-5xl md:text-6xl`); they do not scale continuously. Body default is **`text-sm` (14px)** — set on `<body>` in `globals.css`.

| Class | rem | px | Line-height | Typical use |
|---|---|---|---|---|
| `text-xs` | 0.75rem | 12px | 16px | Captions, badges, footnotes, table cells, meta labels |
| `text-sm` | 0.875rem | 14px | 20px | Body text, buttons, nav links, form fields (**default / most-used**) |
| `text-base` | 1rem | 16px | 24px | Standard paragraph / card body |
| `text-lg` | 1.125rem | 18px | 28px | Section sub-headings, lead paragraphs |
| `text-xl` | 1.25rem | 20px | 28px | Card titles, feature headings |
| `text-2xl` | 1.5rem | 24px | 32px | Stat numbers, modal titles, sub-section headings |
| `text-3xl` | 1.875rem | 30px | 36px | Section headings (mobile), pricing |
| `text-4xl` | 2.25rem | 36px | 40px | Section headings (tablet/desktop) |
| `text-5xl` | 3rem | 48px | 1 | Large section / page headings |
| `text-6xl` | 3.75rem | 60px | 1 | Hero headline (largest breakpoint); also the `display-1` utility |

Headings weight 700 (H3 600). Body line-height ~1.5–1.7 via Tailwind leading utilities where longer copy needs it.

### Role → responsive classes (canonical)
Breakpoints: `sm` ≥640 · `md` ≥768 · `lg` ≥1024 · `xl` ≥1280.

| Role | Classes used | Base | sm | md | lg | xl |
|---|---|---|---|---|---|---|
| H1 — Hero headline | `text-3xl sm:text-4xl lg:text-5xl xl:text-6xl` | 30 | 36 | 36 | 48 | 60 |
| H2 — Section title (most) | `text-3xl sm:text-4xl lg:text-5xl` | 30 | 36 | 36 | 48 | 48 |
| H2 — Section title (Benefits) | `text-3xl md:text-4xl lg:text-5xl` | 30 | 30 | 36 | 48 | 48 |
| H2 — Section title (compact) | `text-3xl md:text-4xl` | 30 | 30 | 36 | 36 | 36 |
| Eyebrow / chip badge | `.chip` / `Eyebrow` → 0.875rem | 14 | 14 | 14 | 14 | 14 |
| Section subheading / lead | `text-lg` | 18 | 18 | 18 | 18 | 18 |
| Hero description | `text-base sm:text-lg` | 16 | 18 | 18 | 18 | 18 |
| H3 — Card title (large) | `text-xl` | 20 | 20 | 20 | 20 | 20 |
| H3 — Card title (small) | `text-base` | 16 | 16 | 16 | 16 | 16 |
| Stat / metric number | `text-4xl md:text-5xl` | 36 | 36 | 48 | 48 | 48 |
| Modal / dialog title | `text-xl` / `text-2xl` | 20–24 | — | — | — | — |
| Body / paragraph | `text-base` | 16 | 16 | 16 | 16 | 16 |
| Body / UI text (default) | `text-sm` (on `<body>`) | 14 | 14 | 14 | 14 | 14 |
| Buttons | `text-sm` (lg variant `text-base`) | 14 | 14 | 14 | 14 | 14 |
| Nav links | `text-sm` | 14 | 14 | 14 | 14 | 14 |
| Footer headings | `text-sm md:text-base` | 14 | 14 | 16 | 16 | 16 |
| Footer links | `text-sm` | 14 | 14 | 14 | 14 | 14 |
| Caption / meta / badge label | `text-xs` | 12 | 12 | 12 | 12 | 12 |

The home **cinematic** section ([challenges-cinematic.tsx](../src/components/organisms/home/challenges-cinematic.tsx)) uses bespoke animated type (word-cloud `clamp()` + metal-red statements) that intentionally sits outside this scale.

Font family: `[DECIDE]` — recommend a confident geometric/grotesque sans for headings (e.g. a self-hosted variable font) + a highly readable sans for body. Self-host via `next/font` for performance & no layout shift.

## Spacing scale (4px base)
`0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192` px. Sections use generous vertical rhythm (≥96px desktop section padding). Whitespace is a feature.

## Radius
`sm 4px · md 8px · lg 16px · xl 24px · full 9999px`. Default to restrained, slightly rounded; avoid heavy rounding (un-premium).

## Elevation / shadow
Use sparingly — premium design favors flat surfaces + whitespace over heavy shadows.
- `shadow-sm`: subtle hover lift.
- `shadow-md`: floating panels / modals only.
Avoid drop-shadow stacks and glows (reads cheap).

## Layout & grid
- Max content width: 1280–1440px; generous gutters.
- 12-column grid, 24px gutter desktop.
- Breakpoints (Tailwind default): sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536.
- Mobile is **redesigned**, not scaled (see [04](04-information-architecture.md)).

## Motion tokens
- Durations: `fast 150ms · base 250ms · slow 400ms · cinematic 800ms`.
- Easing: `standard cubic-bezier(0.4,0,0.2,1)`, `entrance cubic-bezier(0,0,0.2,1)`, `emphasis cubic-bezier(0.2,0,0,1)`.
- Always honor `prefers-reduced-motion`. Full rules in [06](06-motion-principles.md).

## Component primitives (shadcn/ui baseline)
Button, Input, Textarea, Select, Dialog, Sheet, Tabs, Accordion, Tooltip, Card (used sparingly), Badge, Avatar, Navigation Menu. Themed via the tokens above. See [09 — Component Library](09-component-library.md).
