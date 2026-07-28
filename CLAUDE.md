# CLAUDE.md — Instructions for AI Agents

This file governs how AI agents (and developers) work in the Sumago website repository. Read it before making changes.

## What this project is
A greenfield rebuild of **Sumago Infotech Pvt. Ltd.**'s website as an immersive "digital headquarters." Sumago (tagline *"Strive With Technology…!"*) is a technology consulting, digital transformation & product engineering company — since 2013, 13+ years, 700+ projects, 70+ team, ISO 9001:2015 + CMMI Level 5 certified, HQ in Nashik (Govind Nagar) with further offices in Nashik (Satpur) and Pune — **three offices, all in Maharashtra; there is no California/USA office (see COMPANY-PROFILE.md)**. Evolving from a software developer into a strategic technology partner. **Leadership:** Sudhir Gorade (Founder), Sonali Gorade (Co-founder & CEO). **SCOPE (training arm) and SCOPIO AI (interview-practice platform) are separate businesses on their own domains. The single exception is the first-visit brand gateway** (`src/components/organisms/brand-gateway.tsx`, data in `src/lib/brands.ts`), which routes visitors out to them and is the *only* place either may appear. **Never mix their content, branding, metrics, or links into the site itself.**

## The one objective
Everything serves one question: **"Why should I trust Sumago with my business?"** Sell confidence, not services. If an element doesn't build trust, demonstrate competence, or advance the journey (Curiosity → Interest → Understanding → Trust → Confidence → Conversation), cut it.

## Sources of truth (read in this order)
1. [`COMPANY-PROFILE.md`](COMPANY-PROFILE.md) — **all factual claims defer to this.** Never publish a `[VERIFY]` item as fact.
2. [`MASTER-PROMPT.md`](MASTER-PROMPT.md) — condensed operational brief.
3. [`docs/`](docs/README.md) — full specifications (design system, IA, standards, etc.).

## Non-negotiables
- **Voice:** never "we provide / we offer / we are." Always outcome-first ("helping businesses…", "solving…", "transforming…"). See [docs/08](docs/08-content-strategy.md).
- **No stock photography in production, ever.** Real assets only at launch; mark gaps `[REAL ASSET NEEDED]`. *Preview/dev builds may use flagged stock media + sample copy, swapped before launch and blocked from production by a build gate — see [docs/17](docs/17-placeholder-and-seed-content.md).* See [docs/02](docs/02-brand-guidelines.md).
- **Performance is a release gate:** Lighthouse Perf ≥95; A11y/SEO/Best-Practices 100; LCP <2s; CLS <0.1; 60fps. Never trade these for visual effect. See [docs/14](docs/14-testing.md).
- **Accessibility is a build requirement,** not a pass. See [docs/13](docs/13-accessibility.md).
- **Every animation must earn its place** (guide attention, build trust, explain, or aid navigation). Respect `prefers-reduced-motion`. See [docs/06](docs/06-motion-principles.md).
- **Mobile is redesigned, not shrunk.**
- **Content is CMS-driven (Sanity),** not hardcoded.

## Tech stack (baseline — do not substitute without updating docs/10)
Next.js (App Router) + React + TypeScript · Tailwind + shadcn/ui · GSAP + Framer Motion + AOS (native browser scroll — Lenis smooth-scroll was removed for scroll performance) · Three.js + React Three Fiber · Sanity CMS · NestJS · PostgreSQL · Cloudinary + Cloudflare Stream · Vercel.

## Engineering conventions
- Atomic Design component hierarchy; reusable, documented components.
- Prefer React Server Components; lazy-load heavy/3D/media.
- Strong typing — no `any` without justification. SOLID, clean architecture.
- Follow [docs/11 — Coding Standards](docs/11-coding-standards.md) for naming, structure, and PR rules.

## Definition of Done (per feature)
Advances the trust objective · matches the design/motion language · uses the stack & standards · clears the performance budget · fully accessible · CMS-driven · works as a *redesigned* mobile experience.

## When in doubt
Optimize for trust and the enterprise decision-maker (CEO/CTO/CIO/Founder). Ask before publishing unverified facts.
