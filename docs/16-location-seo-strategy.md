# 16 — Location & Geo-Targeting Strategy

**Decision (client):** optimize for broad geographic reach — India-wide + international — **without building a dedicated page per location.** Maximize SEO reach through site-wide optimization, real-office local SEO, and geo signals in existing content. Dedicated location pages remain an *optional future lever*, not part of the current build.

## What this means
- **No per-city landing pages** by default. This also sidesteps the doorway-page risk entirely (thin, near-duplicate city pages that Google penalizes).
- Geo reach comes from: strong technical/content SEO across all pages + local SEO for the 3 real offices + naturally-placed geo signals + off-site presence (Google Business Profiles, directories, backlinks).

## How we achieve geo reach without location pages

### 1. Real-office local SEO (highest-value, do fully)
- Per-office `LocalBusiness` schema with **real** NAP (Nashik Govind Nagar HQ + Satpur, Pune), geo coordinates, hours `[VERIFY]`.
- Aligned **Google Business Profiles** for each office (the biggest driver of local-pack visibility).
- A single **global-footprint section on `/contact` (Let's Connect)** listing all offices + the footprint — for credibility and as a NAP anchor. (One place, not per-city. The former standalone `/locations` page was merged into `/contact` and 301-redirects there.)

### 2. Site-wide SEO so the whole site ranks broadly ("the mass")
- Excellent Core Web Vitals / performance budget ([14](14-testing.md)) — ranking factor + crawl quality.
- Server-rendered content (RSC/ISR) so crawlers get full HTML (the current SPA does not — a key win).
- Clean IA, internal linking, descriptive metadata on every page ([12](12-seo.md)).
- Authoritative content (Innovation Lab / blog / case studies) earns links and broad query coverage.

### 3. Geo signals woven into existing content (no new pages)
- **Industries** and **Solutions** pages: mention the regions/markets served where natural ("…for businesses across India and international markets").
- **Proof of Impact:** real case studies already carry geography (e.g. USA via WebespokeAI/MAMASTOPS; pan-India clients) — surface client locations.
- **Footer + Let's Talk:** all offices, areas served, consistent NAP.
- **Organization schema:** `areaServed` listing target regions; `sameAs` to social/listings.

### 4. International targeting (light-touch)
- Single English site. Set `hreflang` `x-default` (and `en-IN`/`en-US` only if/when copy genuinely differs — not needed for one shared English site).
- Localize the *signals that matter* in shared content: time-zone/global delivery, 60+ international clients, USA-based project delivery (WebespokeAI, MAMASTOPS). **Never imply a USA office — there isn't one** (see COMPANY-PROFILE.md). International *reach* is the claim; international *premises* is not.

### 5. Off-site (where geo ranking is really won without pages)
- Google Business Profiles (per office), Bing Places.
- Consistent NAP across reputable directories (Clutch, GoodFirms, LinkedIn, etc.).
- PR / backlinks from regional & industry sources.

## When to revisit dedicated pages
Add a single, **content-rich** location page only if a specific market becomes a real priority **and** you have unique local proof (clients, case studies, testimonials) for it. At that point follow the office/service-area rules: real offices get `LocalBusiness` schema; markets without an office use service-area framing and **never a fake address**. Until then — no per-city pages.

## Definition of done (geo SEO, current scope)
Offices fully marked up with real `LocalBusiness` schema + live GBPs · footprint section on `/contact` live · `areaServed` in Organization schema · geo signals present in Industries/Solutions/Impact/footer · site-wide SEO + performance budget met · `hreflang x-default` set. No thin location pages shipped.
