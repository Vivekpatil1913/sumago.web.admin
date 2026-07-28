# 10 — Technical Architecture

## Stack
| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) + React + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Motion | GSAP + Framer Motion + AOS · native browser scroll (Lenis removed for scroll performance) |
| 3D | Three.js + React Three Fiber + drei |
| CMS | Sanity |
| Backend (custom APIs) | NestJS |
| Database | PostgreSQL |
| Media | Cloudinary (images) · Cloudflare Stream (video) |
| Hosting | Vercel (frontend) |

## High-level architecture
```
Visitor ──► Next.js (Vercel, App Router, RSC)
               │  ├─ content ──► Sanity (GROQ, CDN-cached)
               │  ├─ media   ──► Cloudinary / Cloudflare Stream
               │  └─ forms/dynamic ──► NestJS API ──► PostgreSQL
```
- **Content** (pages, capabilities, industries, stories, articles, team) lives in **Sanity**, fetched via GROQ in Server Components, cached/ISR-revalidated.
- **Dynamic/transactional** features (form submissions for "Start Your Journey"/Contact, future portal/assessments) go through the **NestJS** API backed by **PostgreSQL**.
- **Media** never served from the app bundle — Cloudinary (responsive images, AVIF/WebP) and Cloudflare Stream (adaptive video).

## Rendering strategy
- **RSC-first.** Static + ISR for content pages; revalidate on Sanity webhook.
- Client Components only for interactivity, motion, 3D, forms.
- 3D and heavy media: `next/dynamic` with `ssr: false` + fallback.
- Edge-friendly where it helps TTFB; keep critical path lean for LCP <2s.

## Data layer
- **Sanity schemas:** `page`, `capability`, `industry`, `successStory`, `article`, `teamMember`, `founderDeskVideo`, `testimonial`, `certification`, `client` (logo + consent flag), `officeLocation` (real offices: address, geo, hours → `LocalBusiness` schema + the single `/locations` footprint page), `areaServed` (regions/markets targeted via `Organization` schema — no per-city pages, see [16](16-location-seo-strategy.md)), `metric` (700+ projects, 70+ team, etc.), `siteSettings`, `navigation`. *(SCOPE is a separate business — no SCOPE schemas/content here.)*
- `successStory` fields: client, background, challenge, solution, technologies[], impact, roi, timeline, testimonial → ref, media[].
- Typed GROQ results (e.g. `sanity-codegen` / `@sanity/types`) — no untyped `any` from queries.
- **NestJS modules:** `leads` (form submissions + notifications), future `portal`, `assessments`, `proposals`.

## Folder structure (frontend)
```
/app                 # routes (App Router)
/components
  /atoms /molecules /organisms /templates
/lib                 # sanity client, api client, utils, motion helpers
/hooks
/styles              # globals, tokens
/three               # R3F scenes (lazy)
/content (sanity)    # studio + schemas
/types
```

## Security & integrity
- Validate all form input server-side (NestJS, zod/class-validator); rate-limit; spam protection on public forms.
- Secrets in environment variables only; never in the client bundle.
- HTTPS everywhere; secure headers (CSP compatible with R3F/Cloudflare/Cloudinary).
- Document security practices publicly (trust asset) — see [08](08-content-strategy.md).

## Future platform hooks
Architect `leads` → CRM, plus stubs/modules for **client portal, AI assistant, business assessments, proposal generator, support center, knowledge base, partner portal**. Keep auth, API, and data boundaries clean so these add without rework.

## Environments
`local → preview (per-PR on Vercel) → production`. See [15](15-deployment.md).
