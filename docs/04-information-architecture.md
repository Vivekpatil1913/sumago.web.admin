# 04 — Information Architecture

## Top-level structure — 3 grouped dropdowns + standalone CTA
Framed around **problems solved**, not service lists. The header collapses to **three toggle-only dropdown groups** (parents don't navigate — every destination lives inside), plus the **Let's Connect** conversion link and the Home logo. **Page name** = the expressive on-page identity (hero/H1); **Nav label** = the short header link.

**Header:** `Logo(Home)` · **Who We Are ▾** · **Our Services ▾** · **Our Work ▾** · **[ Let's Connect ]**

| Group | Nav label | Page name | URL | Purpose |
|---|---|---|---|---|
| — | Home (logo) | Home | `/` | Cinematic introduction; the story |
| **Who We Are** | About us | Inside Sumago | `/about` | Who we are, philosophy, leadership, **+ trust/differentiators (merged from Why Sumago)** |
| **Who We Are** | Our team | Our Team | `/team` | Leadership + 70+ team, **+ founder welcome (merged from Founder's Desk)** |
| **Who We Are** | Life at Sumago | Life at Sumago | `/life-at-sumago` | Culture + photography; employer branding |
| **Who We Are** | Careers | Life at Sumago (jobs) | `/careers` | Open roles / job listings |
| **Our Services** | All Services | What We Solve | `/solutions` | The capabilities, framed as problems solved |
| **Our Services** | Industries | Industries We Power | `/industries` | The industries served |
| **Our Work** | Proof of Work | Proof of Impact | `/impact` | Transformation case studies |
| **Our Work** | Innovations | Innovation Lab | `/innovation` | AI Lab, R&D, applied innovation |
| **Our Work** | Blogs | Insights | `/blog` | Articles, engineering notes, playbooks |
| **CTA** | Let's Connect | Let's Connect | `/contact` | Primary conversion — intake form **+ offices (merged from Locations & Start)** |

### Detail / dynamic routes
- `/solutions/[slug]` — individual capability deep-dives
- `/industries/[slug]` — per-industry solution pages
- `/impact/[slug]` — individual case study
- `/blog/[slug]` — individual article / insight *(seed content today; CMS-driven at launch — see [17](17-placeholder-and-seed-content.md))*

### Consolidations & 301 redirects
Four pages were merged into richer destinations during the nav restructure; their old URLs **301-redirect** (wired in `next.config.ts`):

| Retired URL | Redirects to | Content now lives on |
|---|---|---|
| `/why-sumago` | `/about` | Trust, differentiators, proof section on About |
| `/about/founders-desk` | `/team` | Founder welcome + leadership on Our Team |
| `/locations` | `/contact` | Offices + areas-served on Let's Connect |
| `/start` | `/contact` | Intake form unified on Let's Connect |

Geo/NAP note: the **global-footprint content** (4 offices, areas served) now anchors the **Let's Connect (`/contact`)** page rather than a standalone `/locations` route. **No per-city pages** by default — geo reach comes from site-wide SEO + office local SEO. Full strategy in [16 — Location & Geo-Targeting](16-location-seo-strategy.md).

## Global navigation
- **Header:** Logo · **Who We Are ▾** (About us · Our team · Life at Sumago · Careers) · **Our Services ▾** (All Services · Industries) · **Our Work ▾** (Proof of Work · Innovations · Blogs) · **"Let's Connect"** CTA (brand red). Parents are toggle-only; accessible dropdowns on desktop, accordion on mobile.
- **Footer:** company blurb + **3 office addresses** (Nashik Govind Nagar HQ, Nashik Satpur, Pune) + contact (+91 85303 88815, +91 90213 31162; info@/careers@sumagoinfotech.com) + certifications (ISO 9001:2015, CMMI L5) + social (Facebook, Instagram, LinkedIn, YouTube, X) + sitemap columns (Who We Are · Explore) + legal.
- Persistent global conversion link everywhere: **"Let's Connect"** (`/contact`).

## Homepage section order (cinematic flow)
1. Hero
2. 3D Logo Reveal
3. Founder Welcome Video (entry to Our Team)
4. Business Positioning
5. Challenges We Solve
6. Core Capabilities
7. Industries
8. Success Stories
9. Innovation Highlights
10. Trust Indicators
11. Start Your Journey

The homepage **tells a story**; scroll = narrative progression (see [05](05-user-journeys.md) & [06](06-motion-principles.md)).

## Out of scope — SCOPE (separate business)
**SCOPE (Sumago Center of Practical Excellence)** is a **separate business with its own website** (built later). Per client direction, **no SCOPE content, branding, metrics, navigation, or links** appear on the Sumago Infotech site. Do not reserve a `/scope` route here.

## Navigation principles
- Three grouped dropdowns keep the header to 3 primary toggles + one CTA — low cognitive load for executive visitors.
- Every page offers a clear next step toward conversation/partnership.
- Breadcrumbs on detail pages.
- Mobile: redesigned nav (full-screen sheet), thumb-reachable CTA, simplified hero.

## URL & content rules
- Lowercase, hyphenated slugs.
- Stable, human-readable URLs (good for SEO — see [12](12-seo.md)).
- All page content authored in Sanity (see [10](10-technical-architecture.md)).
