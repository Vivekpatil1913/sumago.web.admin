# Sumago — Master Build Prompt

> **What this is:** A dense, operational brief for AI-assisted design and build sessions. Feed this (whole or by section) to a coding/design agent. It encodes *what to build, how it should feel, and the bar it must clear* — not a re-narration of the vision. When in doubt, optimize for the one objective in §0.

---

## 0. The One Objective

Every screen, sentence, and animation must move the visitor toward answering **one question**:

> **"Why should I trust Sumago with my business?"**

If an element does not build trust, demonstrate competence, or advance the journey *Curiosity → Interest → Understanding → Trust → Confidence → Conversation*, cut it. **Sell confidence, not services.**

---

## 1. Positioning (use this voice everywhere)

> **Company facts live in [`COMPANY-PROFILE.md`](COMPANY-PROFILE.md) — defer to it for anything factual. Never publish a `[VERIFY]` item as fact.**

**Sumago Infotech Pvt. Ltd.** — tagline *"Strive With Technology…!"* — is a **technology consulting, digital transformation & product engineering company** ("global solution provider and system integrator"), evolved from a software developer into a **strategic technology partner** for startups, SMEs, enterprises, and government.

Hard proof points to lead with (real, from the company profile — use these, not generic claims):
- **Track record:** Since 2013 (**13+ years**) · **700+ projects** · **70+ team members** · **50+ government, 500+ domestic, 60+ international clients**.
- **Certifications (top trust signals — feature prominently):** **ISO 9001:2015** · **CMMI Maturity Level 5**.
- **Marquee clients:** Mahindra, Toyota, Hinduja, MSBTE, FSSAI, NIC, Government of Maharashtra, and more.
- **Real success stories (seed the case studies):** nasscom × Indian Oil AI/ML workshop (incl. SLMs, New Delhi) · Mahindra Rise app launch · WebespokeAI (voice automation, USA) · MAMASTOPS (cross-border logistics, USA).
- **Footprint:** 3 offices — Nashik (Govind Nagar HQ + Satpur) and Pune. No California/USA office.
- **Brand acronym SUMAGO:** Solutions · Unity · Modernization · Agility · Growth · Ownership.
- **5 principles** — *Business First, Technology Second · Innovation with Purpose · Transparency · Long-Term Partnerships · Continuous Learning.*
- **9-step engagement** — Discovery → Strategy → Architecture → UX → Development → QA → Deployment → Enablement → Continuous Support. (The "transparent delivery process" trust asset.)

> **Leadership:** Sudhir Gorade (Founder) · Sonali Gorade (Co-founder & CEO, a Maharashtra Young Women Entrepreneur awardee) — the Founder's Desk features both. **SCOPE (training arm) is a separate business — exclude it entirely from this site.** See [`COMPANY-PROFILE.md`](COMPANY-PROFILE.md).

- **Never say:** "We provide / We offer / We are / We develop software."
- **Always say:** "Helping businesses… / Transforming operations… / Solving complex problems… / Accelerating innovation… / Building scalable digital products…"
- Lead with **business outcomes and the client's problem**, then technology as the means.
- Tone: confident, calm, transparent, human. Enterprise-grade but not corporate-sterile.

**Audience priority (design for #1):** CEOs, CTOs, CIOs, Founders, MDs, Product/Ops Heads, enterprise buyers. Secondary: HR, developers, students, partners, investors, media.

---

## 2. Information Architecture (build exactly these)

Header = **3 toggle-only dropdown groups + Let's Connect CTA + Home logo**. Format — **Page name** *(nav label, `url`)*:

**Who We Are ▾**
1. **Inside Sumago** — who we are, philosophy, leadership, trust & differentiators *(About us, `/about`)*
2. **Our Team** — leadership + 70+ team, founder welcome *(Our team, `/team`)*
3. **Life at Sumago** — culture + photography *(Life at Sumago, `/life-at-sumago`)*
4. **Life at Sumago (jobs)** — open roles *(Careers, `/careers`)*

**Our Services ▾**
5. **What We Solve** — capabilities framed as problems solved, not service lists *(All Services, `/solutions`)*
6. **Industries We Power** *(Industries, `/industries`)*

**Our Work ▾**
7. **Proof of Impact** — transformation stories, not a portfolio gallery *(Proof of Work, `/impact`)*
8. **Innovation Lab** — AI Lab, R&D, applied innovation *(Innovations, `/innovation`)*
9. **Insights** — articles, engineering notes, playbooks *(Blogs, `/blog`)*

**CTA**
10. **Let's Connect** — primary conversion (intake form + offices) *(Let's Connect, `/contact`)* · Home *(logo, `/`)*

**Consolidated (301-redirect):** `/why-sumago`→`/about` · `/about/founders-desk`→`/team` · `/locations`→`/contact` · `/start`→`/contact`.

Persistent global conversion link: **"Let's Connect."** Parents are toggle-only; nav labels stay short/clear for usability, SEO & a11y; page names are the expressive on-page identity.

---

## 3. Homepage Flow (cinematic, top to bottom)

`Hero` → `3D Logo Reveal` → `Founder Welcome Video` → `Business Positioning` → `Challenges We Solve` → `Core Capabilities` → `Industries` → `Success Stories` → `Innovation Highlights` → `Trust Indicators` → `Start Your Journey`

The homepage **tells a story**; it does not list information. Scroll = narrative progression.

---

## 4. Signature Differentiators (build these deliberately)

- **The Founder's Desk** — not a generic "About the Founder." A personal, recurring video space: why Sumago exists, philosophy, client expectations, future vision. The founder speaks *directly* to the visitor. Design it as a returnable destination (video series), not a static bio.
- **Trust, demonstrated not claimed** — weave throughout: founder videos, leadership/expert profiles, *real* office & team photos, real client stories, transparent delivery process, security practices, support model, metrics, certifications, awards.
- **Success Stories as transformation case studies** — each: Client background → Business challenge → Solution → Technology → Business impact → ROI → Timeline → Testimonial. Outcomes over screenshots.
- **Innovation & Knowledge as thought leadership** — AI Lab, R&D, emerging tech, playbooks, CEO insights. Educate to earn authority.

---

## 5. Visual & Motion Language

**Design feel:** premium · minimal · elegant · sophisticated · futuristic · enterprise-grade. Generous whitespace.
**Banned:** generic templates, overused cards, cheap gradients, stock illustrations, **stock photography of any kind**.

**Imagery — authentic only:** real office, real employees, real meetings/workshops/events, real products, real clients. If a real asset doesn't exist yet, use a tasteful placeholder slot clearly marked `[REAL ASSET NEEDED]` — never a stock photo.

**Video:** founder welcome, client stories, office walkthrough, innovation lab, dev process, behind-the-scenes, employee stories. Conversational, not promotional.

**Color** (from the logo, restrained):
- Primary: **Brand Red**
- Neutrals: White, Black, Dark Gray, Light Gray
- Accent (sparingly): Technology Blue

**Typography:** large confident headings, short paragraphs, strong hierarchy, high readability.

**Animation — every motion must earn its place** by doing one of: guide attention, build trust, explain a concept, or aid navigation. No decorative motion. Respect `prefers-reduced-motion`.

**3D — immersion without performance cost:** interactive globe, digital city, AI network, particle systems, interactive lighting, camera movement, scroll storytelling. Use 3D only where it deepens the experience; lazy-load and degrade gracefully.

---

## 6. Technology Stack (non-negotiable baseline)

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + React + **TypeScript** |
| Styling | Tailwind CSS + shadcn/ui |
| Motion | GSAP + Framer Motion + AOS (scroll reveals) · native browser scroll (Lenis removed for performance) |
| 3D | Three.js + React Three Fiber |
| CMS | Sanity |
| Backend | NestJS |
| Database | PostgreSQL |
| Media | Cloudinary (images) + Cloudflare Stream (video) |
| Deploy | Vercel |

---

## 7. Engineering Standards (enforce in every PR)

- **Atomic Design** component hierarchy; reusable, documented components.
- **SOLID**, clean architecture, strong typing (no `any` without justification).
- Prefer **React Server Components**; lazy-load heavy/3D/media.
- All content authored in **Sanity**, not hardcoded (except structural copy).
- Accessibility is a build requirement, not a pass: keyboard nav, ARIA labels, semantic HTML, screen-reader support, reduced motion, high contrast.
- **Mobile is redesigned, not shrunk** — reimagine layouts for small screens while preserving the intended experience.

---

## 8. Performance Budget (gate every release)

- Lighthouse: **Performance ≥ 95**, Accessibility **100**, SEO **100**, Best Practices **100**
- **LCP < 2s** · **CLS < 0.1** · animations hold **60 FPS**
- **Performance is never sacrificed for visual effect.** If a 3D/motion feature can't hit budget, simplify or defer it.

---

## 9. Content Rules (quick reference for any copy you generate)

- Outcome-first. Name the business problem before the solution.
- No filler corporate verbs ("provide/offer/are"). Use active, client-centered phrasing.
- Short paragraphs. Strong headings. Specific numbers over adjectives.
- Every section should reduce the visitor's uncertainty about trusting Sumago.

---

## 10. Definition of Done (per feature)

A feature is done when it: advances §0's trust objective · matches §5's visual/motion language · uses the §6 stack and §7 standards · clears the §8 budget · is fully accessible · is content-driven via Sanity · and works as a *redesigned* mobile experience.

---

## 11. Future-Proofing

Architect for evolution into a **Digital Experience Platform**: client portal, AI assistant, business assessments, proposal generator, support center, knowledge base, partner portal. Build modular and scalable now; don't paint these into a corner.

---

## Final Bar

The Sumago site must not read as "a good IT company website." It must feel like **walking into Sumago's digital headquarters** — combining business strategy, storytelling, human connection, premium design, purposeful motion, and modern engineering so that visitors *already know, trust, and want to work with Sumago before the first meeting.*
