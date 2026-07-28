# 12 — SEO

Target: **Lighthouse SEO = 100**, strong organic discoverability for an enterprise/B2B audience and local Nashik presence.

## Technical SEO
- Next.js **Metadata API** per route: unique `title`, `description`, canonical URL.
- Open Graph + Twitter cards (real branded imagery — no stock).
- `sitemap.xml` (dynamic, includes CMS routes) + `robots.txt`.
- Clean, human-readable, stable URLs (see [04](04-information-architecture.md)).
- Semantic HTML, one `<h1>` per page, logical heading order.
- Fast: Core Web Vitals are ranking factors — meet the [performance budget](14-testing.md) (LCP <2s, CLS <0.1).
- Server-render content (RSC/ISR) so crawlers get full HTML — critical, since the current site is a JS SPA that fetchers can't read.

## Structured data (JSON-LD)
- `Organization` (Sumago Infotech: name, logo, Nashik address, contact, sameAs social).
- `WebSite` + `SearchAction` (if site search added).
- `BreadcrumbList` on detail pages.
- `Article` on Innovation/blog posts.
- `Service` for capabilities where appropriate.
- Review/`Case study` markup for Success Stories where valid.

## Content SEO
- Map target queries to Capabilities & Industries pages (problem-led phrasing).
- Innovation & Knowledge hub drives authority + long-tail traffic (thought leadership).
- Descriptive alt text on all real imagery (accessibility + SEO).
- Internal linking between capabilities ↔ industries ↔ success stories.

## Local & geo SEO
Full strategy: [16 — Location & Geo-Targeting](16-location-seo-strategy.md). Key points:
- **Offices (real NAP):** Nashik (Govind Nagar HQ + Satpur), Pune — phones +91 85303 88815 / +91 90213 31162. Per-office `LocalBusiness` schema (geo + hours `[VERIFY]`), aligned Google Business Profiles, Nashik Govind Nagar = primary HQ.
- **Broad geo reach (India + international) — no per-city pages:** achieved via site-wide SEO + office local SEO + geo signals woven into Industries/Solutions/Impact/footer + `areaServed` in `Organization` schema + off-site (Google Business Profiles, directories, backlinks). **Never fake a local address** for a market without an office.
- **International:** single English site; `hreflang x-default` (region variants only if copy ever diverges).
- Dedicated location pages = optional future lever only, with unique local proof (see [16](16-location-seo-strategy.md)).
- Highlight **ISO 9001:2015 + CMMI Level 5** in Organization schema/credentials where supported.

## Measurement
- Google Search Console + analytics (privacy-respecting).
- Track Core Web Vitals in the field (Vercel Analytics / web-vitals).
- Monitor indexation of all CMS routes after launch.
