# 18 — Homepage Conversion Architecture & Section Redesign

**Status:** Design specification, ready for implementation
**Scope:** Homepage section order, "Why Government & Enterprise Choose Us", the delivery-process section, trust surface area, motion, CRO, and palette extension
**Defers to:** [`COMPANY-PROFILE.md`](../COMPANY-PROFILE.md) for every factual claim · [`docs/03`](03-design-system.md) tokens · [`docs/06`](06-motion-principles.md) motion · [`docs/13`](13-accessibility.md) a11y · [`docs/14`](14-testing.md) perf gate

---

## 0. Audit findings — read this first

Three things are true of the codebase right now, and they reframe the brief.

### 0.1 The two reviewed sections are not in this repository

A full-text search of `src/` returns nothing for `Why Government & Enterprise Choose Us`, `Public-Sector Proven`, `Full-Lifecycle Ownership`, `THE SUMAGO PROMISE`, `no vendor chains`, `Discovery Call`, or `Solution Workshop`. Those screenshots are from the legacy site or a parallel build.

What *does* exist on the homepage is `ProcessSection` in
[process-trust.tsx:374](../src/components/organisms/home/process-trust.tsx#L374) — an animated progress road with two purpose-built layouts (a horizontal track ≥`lg`, a vertical rail below it), a single shared `requestAnimationFrame` loop, a brushed-metal node fill, and reduced-motion handling.

**It is materially better than the screenshotted timeline.** The correct action is not "redesign the timeline." It is: do not port the week-labelled timeline into this repo at all, and upgrade the road that already exists. Section 3 below specifies that upgrade.

### 0.2 Five finished components are built and never rendered

| Component | File | Rendered? |
|---|---|---|
| `TrustBar` | [sections.tsx:18](../src/components/organisms/home/sections.tsx#L18) | ❌ |
| `StartYourJourneyCta` | [sections.tsx:263](../src/components/organisms/home/sections.tsx#L263) | ❌ |
| `FaqSection` | [more-sections.tsx:292](../src/components/organisms/home/more-sections.tsx#L292) | ❌ |
| `LeadershipBand` | [more-sections.tsx:259](../src/components/organisms/home/more-sections.tsx#L259) | ❌ |
| `InnovationHighlight` | [more-sections.tsx:212](../src/components/organisms/home/more-sections.tsx#L212) | ❌ |

The homepage currently terminates on `BlogAndCareers`. **There is no closing conversion moment on the homepage.** A CTO who reads the entire page — the most qualified visitor you will ever get — arrives at a blog grid and leaves.

This is a larger revenue leak than the visual quality of either section under review, it is already built, and it is a four-line diff. Ship it before anything else in this document.

### 0.3 `Reveal` has a 3-second default duration

[reveal.tsx:22](../src/components/motion/reveal.tsx#L22) — `duration = 3`. Every wrapped block fades over three seconds. At normal scroll speed, content is still fading in as it leaves the viewport, which reads as sluggishness rather than polish. Framer's own default is 0.3s; the enterprise-appropriate range is 0.4–0.6s. Change the default to `0.5`. This single value change will make the whole site feel faster than any amount of added animation will.

---

## 1. Complete homepage flow

### 1.1 Should the two sections stay where they are?

**Their relative order is right. Their position in the page is wrong, and both are missing the thing that makes them work.**

Claim-then-method is correct sequencing — *why us* immediately followed by *how it runs* is exactly how a procurement evaluator reads. Keep them adjacent. Three things must change:

1. **They sit too early, and land before evidence.** "Why Choose Us" is a *claim* section. Every line in it is an assertion the buyer has no reason to accept yet. A claim placed before proof is marketing; a claim placed beside proof is an argument. Move the pair below Industries, so that by the time the buyer reads "Public-Sector Proven" they have already seen the service scope and the sectors served.
2. **Nothing converts after them.** Both sections end and the page continues into more content. The process section's final state — "Go-Live & Partner" — is the highest-intent moment on the page and it dead-ends.
3. **The process section duplicates a model that already exists.** `content.ts` carries a canonical six-step `processSteps` array plus three `processPhases`, with an explicit comment that the two taxonomies are "deliberately kept free of sequence language so the two don't compete." Introducing a third, eight-step, week-labelled model breaks the single source of truth and will drift within one content cycle.

### 1.2 The recommended sequence

Your example flow lists thirteen sections. I am recommending **fifteen**, in a different order, because the enterprise/government buyer and the startup buyer need different things and the order has to serve both without forcing either to scroll past irrelevance.

```
 1  Hero                     ← Curiosity
 2  TrustBar                 ← Legitimacy (≤1 screen, pre-scroll)
─────────────────────────────────────────── ABOVE / AT FIRST SCROLL
 3  WhatWeDo                 ← Scope: "what is this company"
 4  ChallengesWeSolve        ← Relevance: "they understand my problem"
 5  CapabilitiesSection      ← Understanding: services
 6  IndustriesSection        ← Self-identification: "clients like me"
─────────────────────────────────────────── ORIENTATION COMPLETE
 7  ★ WhyChooseUs            ← Differentiation (REDESIGNED — §2)
 8  ★ DeliveryProcess        ← De-risking (REDESIGNED — §3)
 9  AiSdlc                   ← Modernity / capability edge
─────────────────────────────────────────── THE ARGUMENT
10  ImpactPreview            ← Proof: outcomes
11  TrustIndicators          ← Proof: certifications + client roster
12  Testimonials             ← Proof: third-party voice
13  LeadershipBand           ← Proof: accountable humans
─────────────────────────────────────────── THE EVIDENCE
14  FaqSection               ← Objection handling
15  StartYourJourneyCta      ← Conversation
─────────────────────────────────────────── THE CLOSE
16  BlogAndCareers           ← Secondary audiences, post-close
    Footer
```

`CultureGallery` and `InnovationHighlight` move **off** the homepage — to `/life-at-sumago` and `/innovation`, which already exist. Rationale in 1.3.

### 1.3 Why each section sits where it does

**1 · Hero — Curiosity.**
Nothing precedes it. Its only job is to make the next scroll feel worthwhile.

**2 · TrustBar — Legitimacy, before the buyer decides whether to keep reading.**
The single highest-leverage change in this document after the missing CTA. An enterprise buyer decides whether you are a *real company* in under five seconds, and they decide it with peripheral vision — certification marks, client count, years. Placing this before any narrative content buys you the scroll depth that everything else in the page depends on. This is the Accenture/Cognizant/Infosys pattern and it is not an accident: they all establish institutional scale before they say a word about services.

**3 · WhatWeDo — Scope, immediately.**
Already correctly placed, and the existing code comment explains why: `ChallengesWeSolve` is an 800vh pinned track, so without `WhatWeDo` first, a scanner reaches "what Sumago actually does" around screen ten. Keep it. Do not move the cinematic above it.

**4 · ChallengesWeSolve — Relevance before capability.**
Problem-framing outperforms capability-listing because the buyer recognises themself in a problem, not in a service name. It earns its 800vh only because it precedes the service list, not because it is impressive.

**5 · CapabilitiesSection — Understanding.**
Now the buyer has a problem in mind, so the service list reads as *answers*, not as a catalogue.

**6 · IndustriesSection — Self-identification, and the routing fork.**
This is where a Government buyer, a manufacturer, and a startup diverge into different pages. Placing it before the argument sections means self-selecting visitors leave *for a relevant page*, and the ones who stay are the ones the argument is written for.

**7 · WhyChooseUs — Differentiation, at the point of maximum comprehension.**
This section answers "why you and not TCS, not Infosys, not the cheaper local vendor." That question is unanswerable until the buyer knows what you do and who you serve — which is exactly why it is section 7 and not section 2. Placed here, "Public-Sector Proven" is read against an industries grid the visitor just scrolled. Placed at section 2, it is read against nothing.

**8 · DeliveryProcess — De-risking, immediately after differentiation.**
The predictable objection to any differentiation claim is *"fine, but how will this actually run, and what happens when it goes wrong?"* Process answers it. Claim → method is the right adjacency; keep the pair welded together.

**9 · AiSdlc — The capability edge.**
Sits after process deliberately: it reads as "and our process is more modern than the incumbent's," which is an argument. Before process, it is a disconnected boast.

**10–13 · The evidence block.**
Proof must be contiguous. Four proof sections in sequence compound into a wall of credibility; the same four scattered between narrative sections each get discounted individually. Order runs from hardest to softest evidence: outcomes → certifications → client voice → named humans. `LeadershipBand` closes it because founder-led-since-2013 is the emotional resolution of an otherwise institutional argument, and it sets up the FAQ's more personal register.

**14 · FaqSection — Objection handling immediately before the ask.**
The last unresolved doubt is what kills the conversion. Answer it in the final three seconds before the CTA. Prioritise the objections that actually block: engagement models, contracting, IP ownership, support terms after go-live, and how a government tender is handled.

**15 · StartYourJourneyCta — The close.**
Highest-intent moment on the page. It is already built and currently unused.

**16 · BlogAndCareers — After the close, not before it.**
These serve candidates and researchers, not buyers. They must never sit between the evidence and the ask.

**Moved off the homepage:**
- `CultureGallery` → `/life-at-sumago`. Culture photography is a *hiring* asset. It does not advance a CIO toward a procurement decision, and on the homepage it costs image weight against the LCP budget.
- `InnovationHighlight` → `/innovation`. Real value, wrong page — the homepage argument is already long, and this is the section a buyer is least likely to reach.

### 1.4 Where I disagree with your example flow

| Your flow | My change | Reason |
|---|---|---|
| Trusted By at #2 | Keep — this one is right | Correct instinct, and it's your biggest current gap |
| Company Statistics as its own section | **Fold into TrustBar and ImpactPreview** | A standalone number strip is a section that asks for scroll and returns no argument. Numbers are ammunition for a claim, not a claim. |
| Why Choose Us at #6, after Industries | Agreed, keep | Same conclusion |
| Technology as its own section | **Demote to a strip inside the process section** | A tech-logo wall reassures developers. CIOs read it as commoditised — every competitor lists the same stack. It cannot carry a full section. |
| Security as its own section | **Split** — a card in WhyChooseUs, full treatment on `/solutions` | You already have `security-assurance.tsx` under `solutions/`. Homepage gets the claim; the solutions page gets the substance. |
| Case Studies at #10 | Move to #10 in the evidence block | Agreed, but it must be *contiguous* with the other proof, not isolated |
| FAQ at #12, before Contact | Agreed | Correct — objection handling immediately pre-CTA |

---

## 2. Section 1 redesign — "Why Government & Enterprise Choose Us"

### 2.1 Diagnosis

Your stated problems are real, but they are symptoms. The root cause is structural:

**The section is four adjectives next to a promise, and it contains zero verifiable information.**

"Public-Sector Proven." "Full-Lifecycle Ownership." "Security & Compliance First." Every competitor in every tender says all three. A procurement evaluator reads them as noise, because they are indistinguishable from noise. The right-hand card then compounds it — "One accountable partner for the entire journey" is a promise about a promise.

The specific failures behind your list:

- **Static** — because there is nothing to interact *with*. Adding motion to a list of adjectives produces animated adjectives.
- **Empty space** — the left column runs ~48% width with ~55% of it unused. That isn't whitespace; whitespace is *deliberate*. This is an unfilled grid cell.
- **Weak hierarchy** — four items at identical visual weight means the buyer must read all four to find the one they care about. A government buyer cares about compliance; a startup cares about lifecycle cost. Neither is served by equal weighting.
- **Right card disconnected** — because it is a *different content type* (a manifesto) in a *different colour treatment* (pink fill) with no relationship to the four items beside it. Nothing on the left points at it.
- **The logo lockup inside the card** violates [docs/02](02-brand-guidelines.md) — the mark is an identity element for header and footer, not card decoration. It also makes the card read as an advertisement embedded in your own site.
- **The card cites ISO 9001:2015 and omits CMMI Level 5.** CMMI Level 5 is the strongest credential Sumago has for government and large-enterprise procurement — very few Indian mid-market firms hold it, and it is a scored line item in tender evaluation. Leaving it out of the trust section is the single most expensive omission on the page.

### 2.2 Concept — "The Evidence Console"

**Reframe: stop asserting, start answering.**

The buyer arrives with four unspoken objections. Put the objections on screen *in their words*, and answer each with a verifiable fact. Objection → answer → proof. This is how the section stops being a brochure and becomes the argument it is pretending to be.

Left column: four selectable **risk statements**, written as the buyer thinks them.
Right column: a single panel that swaps to the corresponding answer, carrying a hard proof chip and a real link.

```
Buyer's objection                          Sumago's answer               Verifiable proof
────────────────────────────────────────────────────────────────────────────────────────
"Has this vendor delivered            Public-sector delivery         50+ government clients
 for government before?"              across central, state,         · 13+ years · link to
                                      defence and PSU bodies         government case studies

"Who owns it when                     One accountable partner        700+ projects delivered
 something breaks at 2am?"            from strategy through          · in-house team of 70+
                                      support — no subcontractors    · link to support model

"Will it survive a                    Secure-by-design               ISO 9001:2015 ·
 security audit?"                     architecture for regulated,    CMMI Level 5 ·
                                      citizen-facing systems         link to security page

"How do I know the                    Certified, audited process     CMMI Level 5 ·
 quality is real?"                    — not a promise, an            ISO 9001:2015 ·
                                      external assessment            link to how-we-deliver
```

Every right-hand panel ends in a link. The section stops being a terminus and becomes a router into depth — which is what a serious evaluator wants and what a casual visitor can ignore.

**Why this beats a prettier version of the current design:**

- It is **self-segmenting**. The government buyer clicks objection 1, the startup clicks objection 2. Same section, three audiences, no compromise.
- The interaction is **the content**, so motion is justified under [docs/06](06-motion-principles.md) — it explains, rather than decorating.
- It **fills the layout honestly**: the right panel has real content to hold, so the empty region disappears without inventing filler.
- Every claim is **falsifiable**, which is precisely what makes it believable.

### 2.3 On glassmorphism — I'd push back

You asked for glassmorphism, gradient borders, and animated counters. I'd take one of the three, and here is the reasoning, because you asked me to challenge decisions rather than execute them.

**Glassmorphism: no.** Four problems, in order of severity.

1. **Accessibility.** Frosted panels put text on a variable, content-dependent backdrop. You cannot guarantee a contrast ratio against a background you don't control, and [docs/13](13-accessibility.md) makes accessibility a build requirement. This is not a tuning issue; it is structurally unverifiable.
2. **Performance.** `backdrop-filter: blur()` forces a separate compositing layer and re-rasterises on every scroll frame. On the mid-range Android hardware a government employee actually uses, several glass panels will cost you the 60fps line and put the ≥95 Lighthouse gate at risk. [docs/14](14-testing.md) makes that a release gate, and the CLAUDE.md rule is explicit: never trade performance for visual effect.
3. **It needs a busy background to read as glass.** Over your `#ffffff` / `bg-mist` sections it renders as a slightly grey rectangle. To make it work you would have to add visual noise behind it — spending the section's calm to buy an effect that then fights the copy.
4. **It signals the wrong category.** Check your own reference list. Stripe, Vercel, Linear, and Clerk use **flat surfaces, hairline borders, and precise typography**. Glassmorphism peaked in 2021 consumer SaaS and in 2026 reads as dated rather than premium. On a page whose one job is convincing a CIO you are a serious institution, it works against you.

**What produces "premium" instead** — the actual mechanics behind the sites you listed:

| Instead of | Use | Why |
|---|---|---|
| Frosted blur | `bg-paper` on `bg-mist`, `border border-line` | Elevation by contrast and hairline, not by blur. Zero compositing cost. |
| Gradient borders | A **2px brand-red left edge** on the active card only | Directs attention to one element instead of decorating four. |
| Heavy shadows | `shadow-[0_1px_2px_rgba(0,0,0,0.04)]` at rest → `0_12px_32px_-12px_rgba(0,0,0,0.18)` on hover (your existing `.card-hover`) | Restraint at rest is what reads as expensive. Your token is already correct. |
| Animated counters here | Counters in `TrustBar` and `ImpactPreview` only | A counter on a qualitative reassurance section is decoration. In a stat band it is information. `Stat` already does this properly ([stat.tsx](../src/components/molecules/stat.tsx)). |
| Large icons | 20px icons, 44px container, generous type | Oversized icons are a symptom of insufficient copy. Fix the copy. |

**Gradient borders: yes, but once.** A single animated gradient hairline along the **top edge of the active panel** is a genuinely premium detail (Vercel and Linear both do exactly this). Four gradient-bordered cards is a casino.

**Animated counters: yes, but in the proof chips.** Each right-hand panel carries one number — `50+`, `700+`, `13+`. Count those up when the panel becomes active. That's a counter doing informational work.

### 2.4 Desktop wireframe (≥1024px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                              bg-mist · py-24 │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  THE CASE FOR SUMAGO                            ← Eyebrow, brand-ink   │  │
│  │                                                                        │  │
│  │  Four questions every evaluator asks.                                  │  │
│  │  Four answers you can verify.        ← h2, text-5xl, "verify" gradient │  │
│  │                                                                        │  │
│  │  Selecting a concern shows how it is handled — and the evidence.       │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                    max-w-3xl · left-aligned                  │
│                                                                              │
│  ┌───────────────────────────────┐ ┌───────────────────────────────────────┐ │
│  │  RISK LIST     col-span-5     │ │  ANSWER PANEL        col-span-7       │ │
│  │                               │ │  bg-paper · rounded-2xl · p-10        │ │
│  │ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │ │ ╔═══ animated gradient hairline ════╗ │ │
│  │ ┃▌ ✓  "Has this vendor      ┃ │ │                                       │ │
│  │ ┃▌     delivered for gov    ┃ │ │   ┌────┐                              │ │
│  │ ┃▌     before?"     ACTIVE  ┃ │ │   │ 🛡 │  brand-red 56px rounded-xl   │ │
│  │ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │ │   └────┘                              │ │
│  │   ▲ 2px brand left edge       │ │                                       │ │
│  │                               │ │   Public-Sector Proven                │ │
│  │ ┌───────────────────────────┐ │ │   text-3xl font-bold text-ink         │ │
│  │ │  ○  "Who owns it when     │ │ │                                       │ │
│  │ │      something breaks?"   │ │ │   A documented delivery record        │ │
│  │ └───────────────────────────┘ │ │   across central, state, defence      │ │
│  │                               │ │   and PSU institutions — systems      │ │
│  │ ┌───────────────────────────┐ │ │   that must not fail in public.       │ │
│  │ │  ○  "Will it survive a    │ │ │   text-lg text-ink/65 max-w-lg        │ │
│  │ │      security audit?"     │ │ │                                       │ │
│  │ └───────────────────────────┘ │ │  ─────────────────────────────────    │ │
│  │                               │ │                                       │ │
│  │ ┌───────────────────────────┐ │ │   ┌────────┐ ┌────────┐ ┌─────────┐   │ │
│  │ │  ○  "How do I know the    │ │ │   │  50+   │ │  13+   │ │  700+   │   │ │
│  │ │      quality is real?"    │ │ │   │  gov   │ │ years  │ │projects │   │ │
│  │ └───────────────────────────┘ │ │   └────────┘ └────────┘ └─────────┘   │ │
│  │                               │ │   count-up on panel activation        │ │
│  │ ┌───────────────────────────┐ │ │                                       │ │
│  │ │ ISO 9001:2015 ·           │ │ │   See government case studies →       │ │
│  │ │ CMMI Level 5              │ │ │   Button variant="link"               │ │
│  │ │ Independently assessed →  │ │ │                                       │ │
│  │ └───────────────────────────┘ │ │  ╚═══════════════════════════════════╝│ │
│  │  ↑ certification anchor       │ │                                       │ │
│  └───────────────────────────────┘ └───────────────────────────────────────┘ │
│                            gap-8 · items-start                               │
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐     │
│   │  Bring the problem. A 30-minute call, no commitment.               │     │
│   │  [ Book a discovery call ]   [ Download capability deck ]          │     │
│   └────────────────────────────────────────────────────────────────────┘     │
│                       mt-16 · bg-ink · rounded-2xl · px-10 py-8              │
└──────────────────────────────────────────────────────────────────────────────┘
```

Note the CTA band: this section now **closes**, instead of leaking into the next one.

### 2.5 Tablet (768–1023px)

Do not shrink the two-column layout — 5/7 columns at 768px gives the answer panel ~420px, which forces the proof chips to wrap into two rows and breaks the visual rhythm.

**Restructure:** risk list becomes a **horizontal scroll-snap chip row** above the panel.

```
┌──────────────────────────────────────────────────────────┐
│  THE CASE FOR SUMAGO                                     │
│  Four questions every evaluator asks.                    │
│                                                          │
│  ┌──────────┐┌──────────┐┌──────────┐┌──────────┐        │
│  │ ▌Gov     ││ Owner-   ││ Security ││ Quality  │ →      │
│  │  record  ││ ship     ││ audit    ││ proof    │        │
│  └──────────┘└──────────┘└──────────┘└──────────┘        │
│  overflow-x-auto · snap-x · .no-scrollbar (exists)       │
│  edge mask-image fade signals more content               │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🛡  Public-Sector Proven                           │  │
│  │                                                    │  │
│  │ A documented delivery record across central,       │  │
│  │ state, defence and PSU institutions.               │  │
│  │ ───────────────────────────────────────────────    │  │
│  │ ┌──────┐┌──────┐┌──────┐                           │  │
│  │ │ 50+  ││ 13+  ││ 700+ │                           │  │
│  │ └──────┘└──────┘└──────┘                           │  │
│  │ See government case studies →                      │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ISO 9001:2015 · CMMI Level 5 — independently assessed   │
│                                                          │
│  [ Book a discovery call ]  [ Capability deck ]          │
└──────────────────────────────────────────────────────────┘
```

### 2.6 Mobile (<768px) — redesigned, not shrunk

The chip row fails on mobile: a horizontal scroller hides three of four objections, and on a page this long the buyer will not discover them.

**Restructure again — accordion.** All four objections visible as headers; one expanded at a time.

```
┌──────────────────────────────────┐
│ THE CASE FOR SUMAGO              │
│                                  │
│ Four questions                   │
│ every evaluator asks.            │
│ text-[2rem]/[1.2]                │
│                                  │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│ ┃▌ 🛡 Has this vendor       ⌃ ┃  │
│ ┃▌    delivered for gov?      ┃  │
│ ┃                             ┃  │
│ ┃  Public-Sector Proven       ┃  │
│ ┃  A documented record        ┃  │
│ ┃  across central, state,     ┃  │
│ ┃  defence and PSU bodies.    ┃  │
│ ┃                             ┃  │
│ ┃  ┌─────┐┌─────┐┌─────┐      ┃  │
│ ┃  │ 50+ ││ 13+ ││700+ │      ┃  │
│ ┃  └─────┘└─────┘└─────┘      ┃  │
│ ┃  Government case studies →  ┃  │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ 🔄 Who owns it when it     ⌄ │ │
│ │    breaks?                   │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ 🔒 Will it survive an      ⌄ │ │
│ │    audit?                    │ │
│ └──────────────────────────────┘ │
│ ┌──────────────────────────────┐ │
│ │ 🏅 How do I know the       ⌄ │ │
│ │    quality is real?          │ │
│ └──────────────────────────────┘ │
│                                  │
│ ISO 9001:2015 · CMMI Level 5     │
│                                  │
│ ┌──────────────────────────────┐ │
│ │  Book a discovery call       │ │
│ └──────────────────────────────┘ │
│ full-width, h-13, min 44px touch │
└──────────────────────────────────┘
```

First item expanded by default so the section never reads as a wall of closed rows. No auto-advance on mobile — an accordion that moves under a reading thumb is hostile.

### 2.7 Component hierarchy

```
organisms/home/why-choose-us.tsx          "use client" (state)
│
├── atoms/section.tsx                     [exists] muted
├── atoms/section-heading.tsx             [exists] align="left" wide
│
├── molecules/risk-selector.tsx           NEW
│   └── molecules/risk-item.tsx           NEW — button, aria-selected
│
├── molecules/evidence-panel.tsx          NEW
│   ├── molecules/stat.tsx                [exists] size="sm" — proof chips
│   └── atoms/button.tsx                  [exists] variant="link"
│
├── molecules/certification-anchor.tsx    NEW — ISO + CMMI, links to /about
└── molecules/section-cta-band.tsx        NEW — reusable across sections
```

Content lives in `src/lib/content.ts` as `whyChooseUs`, CMS-ready per the CLAUDE.md content rule:

```ts
export const whyChooseUs: {
  /** The objection, in the buyer's own words. */
  risk: string;
  /** Sumago's answer — the claim being made. */
  title: string;
  description: string;
  /** lucide-react icon name, mapped at the call site. */
  icon: string;
  /** Verifiable proof. Each value must trace to COMPANY-PROFILE.md. */
  proof: { value: string; label: string }[];
  cta: { label: string; href: string };
}[] = [ /* … */ ];
```

**Every `proof.value` must trace to a verified line in `COMPANY-PROFILE.md`. Any `[VERIFY]` item is omitted, not softened.** A trust section built on an unverified number is worse than one built on nothing.

### 2.8 Implementation

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, RefreshCw, Lock, Award, type LucideIcon } from "lucide-react";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Button } from "@/components/atoms/button";
import { Stat } from "@/components/molecules/stat";
import { whyChooseUs } from "@/lib/content";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { ShieldCheck, RefreshCw, Lock, Award };

export function WhyChooseUs() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const item = whyChooseUs[active];
  const Icon = ICONS[item.icon] ?? ShieldCheck;

  return (
    <Section muted>
      <SectionHeading
        align="left"
        wide
        eyebrow="The case for Sumago"
        title={<>Four questions every evaluator asks.{" "}
          <span className="text-metal-red-shine">Four answers you can verify.</span></>}
        description="Selecting a concern shows how it is handled — and the evidence behind it."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Risk list — radio-group semantics, not a tablist: these select
            content, and arrow-key roving focus is the expected model. */}
        <div role="radiogroup" aria-label="Evaluation concerns" className="lg:col-span-5">
          {whyChooseUs.map((r, i) => (
            <button
              key={r.risk}
              role="radio"
              aria-checked={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "group relative mb-3 w-full rounded-xl border p-5 text-left transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                i === active
                  ? "border-line bg-paper shadow-[0_12px_32px_-12px_rgba(0,0,0,0.14)]"
                  : "border-transparent bg-transparent hover:bg-paper/60",
              )}
            >
              {/* Active edge — scaleY avoids animating layout. */}
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-brand",
                  "origin-center transition-transform duration-300",
                  i === active ? "scale-y-100" : "scale-y-0",
                )}
              />
              <span className="text-base font-semibold leading-snug text-ink">
                {r.risk}
              </span>
            </button>
          ))}

          <div className="mt-6 rounded-xl border border-line bg-paper p-5">
            <p className="text-sm font-semibold text-ink">ISO 9001:2015 · CMMI Level 5</p>
            <p className="mt-1 text-sm text-ink/60">
              Independently assessed — not self-declared.
            </p>
          </div>
        </div>

        {/* Answer panel */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-paper p-8 md:p-10">
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-brand),transparent)]"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={item.title}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
              >
                <span className="inline-grid h-14 w-14 place-items-center rounded-xl bg-brand text-white">
                  <Icon size={24} strokeWidth={2} aria-hidden />
                </span>
                <h3 className="mt-6 text-2xl font-bold text-ink md:text-3xl">{item.title}</h3>
                <p className="mt-3 max-w-lg text-lg leading-relaxed text-ink/65">
                  {item.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-8">
                  {item.proof.map((p) => (
                    <div key={p.label} className="rounded-xl bg-mist px-5 py-4">
                      {/* Stat re-runs its count-up because `key` changes with
                          the panel, remounting it. */}
                      <Stat value={p.value} label={p.label} size="sm" tone="brand" />
                    </div>
                  ))}
                </div>

                <Button href={item.cta.href} variant="link" className="mt-6">
                  {item.cta.label} →
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* The section closes rather than leaking into the next. */}
      <div className="mt-16 rounded-2xl bg-ink px-8 py-8 text-white md:px-10 md:flex md:items-center md:justify-between md:gap-8">
        <p className="text-lg font-semibold md:text-xl">
          Bring the problem. A 30-minute call, no commitment.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
          <Button href="/contact" variant="primary" size="lg">Book a discovery call</Button>
          <Button href="/company-profile.pdf" size="lg"
            className="border border-white/25 bg-transparent text-white hover:bg-white/10">
            Capability deck
          </Button>
        </div>
      </div>
    </Section>
  );
}
```

**Accessibility contract**
- `role="radiogroup"` / `role="radio"` / `aria-checked` — selection semantics, and arrow keys work by default.
- Panel is not `aria-live`: a live region would announce on every click, which is noise. Selection change is already announced by the radio.
- All four objections reach the accessibility tree on mobile via the accordion; no content is hidden behind horizontal scroll.
- Focus ring reuses the existing `ring-brand ring-offset-2` from `buttonVariants`.
- `prefers-reduced-motion` disables the crossfade and the `Stat` count-up (already handled inside `Stat`).

---

## 3. Section 2 redesign — the delivery process

### 3.1 Kill the week labels

`Week 1 · Week 1–2 · Week 2 · Week 3+ · Ongoing` must not ship. Five reasons, in order of consequence:

1. **It is a commitment you cannot honour and did not intend to make.** Published on a public site, opposite a procurement officer, a stated timeline is quotable in a tender dispute. "Your website says Week 2" is a conversation you never want to have.
2. **Government timelines are not yours to set.** Tender cycles, committee approvals, and security clearances run on the department's calendar. Publishing a two-week proposal timeline tells an experienced government buyer you have not worked at their scale — the exact opposite of the intended signal.
3. **It anchors on speed, which is the wrong axis.** Speed is the *startup* buying criterion. Enterprise and government buy on predictability and accountability. You are competing against TCS and Infosys on the one dimension where a cheap freelancer beats all of you.
4. **It advertises small engagements.** A three-week path to build implies projects that finish in weeks. That prices you out of the ₹-crore programmes you actually want.
5. **It goes stale silently.** Nobody updates a week label. In eighteen months it is quietly wrong.

**Replace week labels with deliverables.** What an evaluator actually wants to know at each stage is *what artefact do I receive, and what decision does it let me make*. That is also what makes the process feel real rather than generic.

| Stage | Wrong (current) | Right (replacement) |
|---|---|---|
| Discovery | `Week 1` | `→ Scope & success-metrics brief` |
| Workshop | `Week 1–2` | `→ Solution options with trade-offs` |
| Planning | `Week 2` | `→ Fixed scope, timeline, team, commercials` |
| Architecture | — | `→ System design & security model` |
| Development | `Week 3+` | `→ Working software, demoed every sprint` |
| QA | — | `→ Test, security & performance reports` |
| Deployment | — | `→ Live system + runbook` |
| Support | `Ongoing` | `→ SLA, monitoring, improvement roadmap` |

### 3.2 On the eight steps — a caution

You asked for eight: Discovery → Workshop → Planning → Architecture → Development → QA → Deployment → Support. Two problems:

1. **`content.ts` defines six canonical `processSteps` and three `processPhases`,** with an explicit warning against competing taxonomies. Adding an eight-step model creates a third. Within one content cycle, `/how-we-deliver`, `/solutions`, and the homepage will each describe a different process, and a buyer who reads two of them will notice.
2. **Eight equal-weight steps is not a process; it is a list.** Every software firm on earth does discovery-through-support. The differentiator is not *that* you have eight steps — it is what happens inside them and what you hand over.

**Recommendation:** keep the canonical **three phases** as the homepage structure, with the eight steps nested inside them. The buyer perceives three commitments (not eight items), and the detail is available on demand.

```
UNDERSTAND ──────────── DESIGN & BUILD ──────────── LAUNCH & GROW
  Discovery               Architecture                Deployment
  Workshop                Development                 Support
  Planning                QA
```

If you want all eight visible with equal weight, put that on `/how-we-deliver` — the page already exists in your working tree. Homepage argues; the delivery page documents.

**If you proceed with eight flat steps anyway**, then update `processSteps` in `content.ts` to be the eight, and propagate to every consumer. One source of truth, whichever shape you pick.

### 3.3 Concept — scroll-scrubbed phase rail

**Keep the road metaphor. It is genuinely good and already built.** Change three things:

1. **Drive progress from scroll position, not a timer.** The current `useRoadProgress` runs an autonomous rAF loop that dwells and advances on its own schedule. That means the animation is often mid-cycle when the user arrives, and it runs `setState` at 60fps *even when off-screen* — a real, measurable main-thread cost against your ≥95 Lighthouse gate.

   Scroll-driven is better on every axis: the user controls it (agency), progress maps to reading position (comprehension), it stops when off-screen (performance), and it costs less code.

2. **Add a detail panel.** The current road shows titles only. A title without a deliverable is decoration. As the front reaches each stage, a panel below shows that stage's description and deliverable.

3. **Group into the three phases** with phase labels above the track.

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  HOW WE WORK                                                     bg-journey    │
│  A transparent, structured delivery process —                                  │
│  from planning to production.                                                  │
│                                                                                │
│   UNDERSTAND              DESIGN & BUILD               LAUNCH & GROW           │
│   ═══════════             ══════════════               ═════════════           │
│   phase labels, text-xs uppercase tracking-[0.22em], span their stage range    │
│                                                                                │
│    ①────────②────────③────────④────────⑤────────⑥────────⑦────────⑧          │
│    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░           │
│    ↑ travelled (ink gradient)  ↑ head        ↑ upcoming (#c9cdd6)             │
│                                                                                │
│   Disco    Work    Plan    Arch    Build     QA      Deploy   Support          │
│   very     shop                                                                │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  ┌────┐  04 · ARCHITECTURE                          DESIGN & BUILD       │ │
│  │  │ ▣  │                                                                  │ │
│  │  └────┘  A scalable, secure foundation built for the long term —         │ │
│  │          data model, integration boundaries, and the security            │ │
│  │          posture the system will be audited against.                     │ │
│  │                                                                          │ │
│  │          YOU RECEIVE →  System design document & security model          │ │
│  │          ─────────────────────────────────────────────────────────       │ │
│  │          See how we deliver →                                            │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│    detail panel · bg-paper · min-h fixed to tallest entry (no CLS)            │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │   Every engagement starts with one 30-minute conversation.               │ │
│  │   [ Start with a discovery call ]      [ Download delivery playbook ]    │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────┘
```

**Critical:** the detail panel must have a **fixed `min-h`** sized to the longest entry. A panel that resizes as stages change causes cumulative layout shift on every scroll tick, and CLS < 0.1 is a release gate.

### 3.4 Mobile — the vertical rail, upgraded

The existing `VerticalRoad` is the right structure. Add the deliverable to each row, and drive the fill from scroll.

```
┌──────────────────────────────────┐
│ HOW WE WORK                      │
│ A transparent, structured        │
│ delivery process.                │
│                                  │
│ ── UNDERSTAND ──────────────     │
│                                  │
│ ┏━┓  Discovery                   │
│ ┃🔍┃  Goals, constraints and      │
│ ┗━┛  success metrics, agreed.    │
│  ┃                               │
│  ┃   → Scope & metrics brief     │
│  ┃      text-brand-ink font-med  │
│  ┃                               │
│ ┏━┓  Workshop                    │
│ ┃👥┃  Options mapped with         │
│ ┗━┛  honest trade-offs.          │
│  ┃   → Solution options doc      │
│  ┃                               │
│ ┏━┓  Planning                    │
│ ┃📄┃  Fixed scope and team.       │
│ ┗━┛  → Timeline & commercials    │
│  ┃                               │
│ ── DESIGN & BUILD ───────────    │
│  ┃                               │
│ ┌─┐  Architecture                │
│ │▣│  grey until scrolled past    │
│ └─┘  → System design & security  │
│  ┋                               │
│  ⋮   (remaining stages)          │
│                                  │
│ ┌──────────────────────────────┐ │
│ │  Start with a discovery call │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

Rail fill is driven by each row's own intersection, so it tracks the reading position exactly. No detail panel on mobile — every row carries its own detail, because a sticky panel on a 375px screen steals half the viewport.

### 3.5 Scroll-driven progress

Replace `useRoadProgress` entirely:

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

export function ProcessRail({ steps }: { steps: ProcessStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Progress across the section's own pass through the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });

  // Spring smooths the raw value so the head glides rather than snapping to
  // scroll jitter. Framer drives this off rAF on the compositor where it can —
  // no React re-render per frame, unlike the setState loop it replaces.
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });
  const width = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref}>
      <div className="relative h-3.5 overflow-hidden rounded-full bg-[#c9cdd6]">
        <motion.div
          className="absolute inset-y-0 left-0 bg-[linear-gradient(90deg,#0a0a0c,#17171a)]"
          style={{ width: reduce ? "100%" : width }}
        />
      </div>
      {/* nodes positioned at i/(N-1), each lighting when p crosses its stop */}
    </div>
  );
}
```

**Why this is strictly better than the current implementation:**

| | Current (timer) | Scroll-driven |
|---|---|---|
| Runs off-screen | Yes — 60fps `setState` regardless of visibility | No — `useScroll` is inert when out of range |
| React re-renders | One per frame | Zero — `MotionValue` writes to the DOM directly |
| User control | None; may be mid-cycle on arrival | Full; maps to reading position |
| Reduced motion | Jumps to 1 | Renders complete, static |
| Lines of code | ~50 | ~12 |

Guard with `will-change: transform` on the fill only, and never on more than a handful of elements at once.

---

## 4. Additional trust sections

Ranked by conversion impact per unit of build effort, for **this** buyer set.

### Tier 1 — build now

**1 · Government empanelment & tender credentials.**
The single highest-value addition for your primary audience, and completely absent. Government buyers filter on this before they read anything else: department empanelments, GeM registration, tender categories, MSME/NSIC/Startup-India registration, GST and CIN. It is not marketing — it is qualification. Put it on `/about` and link from `WhyChooseUs`. **Verify every entry against `COMPANY-PROFILE.md` before publishing; do not publish a `[VERIFY]` credential.**

**2 · Client logo wall (with permission).**
[process-trust.tsx:414](../src/components/organisms/home/process-trust.tsx#L414) already anticipates this — text chips today, with a note that logos await display consent. Chase the consent. A named-logo wall outperforms a text marquee by a wide margin, because logos are recognised pre-attentively and text must be read. Prioritise: government departments → recognisable enterprises → international clients.

**3 · A single deep case study, not a card grid.**
Problem → constraint → approach → measured outcome, on one page, with a number. One real case study with a verified metric converts better than nine teaser cards, because the evaluator's question is "have you solved something as hard as mine," and a card cannot answer it.

**4 · Security & compliance page.**
`security-assurance.tsx` already exists under `solutions/`. Give it a URL, and link from `WhyChooseUs` risk 3. Content: data residency, access control, SDLC security gates, vulnerability handling, and audit support. This is a hard blocker for banking, healthcare, and government — a missing answer here loses the deal silently.

### Tier 2 — high value, more effort

**5 · Engagement & commercial models.** Fixed-bid vs T&M vs dedicated team vs managed service. Buyers self-qualify on commercial fit before they contact you, and a page that answers it privately removes a friction point from the first call.

**6 · Leadership with substance.** `LeadershipBand` is built and unused. Founder-led-since-2013 is a genuine differentiator against a faceless mid-market vendor. Names and real bios — not stock headshots ([docs/02](02-brand-guidelines.md)).

**7 · Support & SLA model.** "What happens after go-live" is the question every government buyer asks and almost no vendor site answers. Answering it publicly is a differentiator by default.

**8 · Company timeline, 2013→now.** Longevity is trust. Milestones, certifications earned, offices opened. Cheap to build, disproportionately reassuring.

### Tier 3 — worthwhile, lower priority

**9 · Technology stack** — as a strip inside the process section, never a standalone section. Every competitor lists the same stack; it reassures developers and bores CIOs.
**10 · Awards & recognition** — only if genuinely notable. A thin awards row reads as padding.
**11 · Partner & platform certifications** (AWS, Azure, Google Cloud tiers) — real procurement weight if held. Verify tier before publishing.
**12 · CSR / community** — matters in government tenders more than most vendors realise, and belongs on `/about`, not the homepage.

### Explicitly do not build

- **A homepage newsletter block.** It competes with the discovery-call CTA at the exact moment of highest intent, and trades a ₹-crore lead for an email address. Footer only.
- **A "Why Choose Us" section that duplicates `TrustIndicators`.** After the redesign in §2, audit both; overlapping proof dilutes rather than compounds.
- **Stock-photo team or office imagery.** Absolute rule, CLAUDE.md and [docs/02](02-brand-guidelines.md). Mark gaps `[REAL ASSET NEEDED]`.

---

## 5. Animation plan

The governing rule from [docs/06](06-motion-principles.md): every animation must guide attention, build trust, explain, or aid navigation. Applied strictly, most of the effects on your list get cut. Here is what survives and where.

### 5.1 Fix first

| Issue | Fix | Why |
|---|---|---|
| `Reveal` default `duration = 3` | → `0.5` | Three seconds reads as lag, not luxury. Highest-impact single change on the site. |
| `useRoadProgress` 60fps `setState` off-screen | Scroll-driven `MotionValue` (§3.5) | Removes a per-frame React render from the main thread |
| AOS **and** Framer Motion **and** GSAP concurrently | Consolidate to Framer for component motion; keep GSAP for pinned tracks only | Three motion systems is three bundles and three inconsistent timing curves |

### 5.2 The animation inventory

| # | Animation | Where | Implementation | Justification |
|---|---|---|---|---|
| 1 | Staggered reveal | Section headings, card grids | `staggerChildren: 0.06`, `y: 16 → 0`, `0.5s` | Establishes reading order. Cap the stagger at 6 children — beyond that the last item is late. |
| 2 | Panel crossfade | `WhyChooseUs` answer panel | `AnimatePresence mode="wait"`, `0.35s` | Signals *replacement*, not addition. `mode="wait"` prevents overlap flash. |
| 3 | Active-edge scale | `WhyChooseUs` risk items | `scaleY 0 → 1`, `0.3s`, `origin-center` | Transform-only; no layout, no paint. |
| 4 | Count-up | Proof chips, `TrustBar`, `ImpactPreview` | `Stat` [exists] — 1200ms, cubic ease-out | Draws the eye to the number, which is the message. **Only where the number is the message.** |
| 5 | Scroll-scrubbed rail | Process section | `useScroll` + `useSpring` (§3.5) | User controls it; progress maps to reading position. |
| 6 | Card lift | Capability / industry cards | `.card-hover` [exists] — `translateY(-3px)` | Affordance. 3px is correct — larger reads as toy-like. |
| 7 | Icon micro-motion | Card hover | `scale: 1.06`, `0.2s` — **no rotation** | Rotation on a shield or lock icon is meaningless motion. Scale confirms hover; rotation performs. |
| 8 | Gradient hairline | Active panel top edge only | Static gradient; animate only on panel change | One accent. Four is a casino. |
| 9 | Marquee | Client roster | `animate-[marquee-x_45s]` [exists] | Signals "more than fits", and slow enough to read. Add `pause-on-hover`. |
| 10 | Button arrow nudge | All CTAs | `x: 0 → 3` on hover, `0.2s` | Reinforces forward direction. Cheap, universally understood. |
| 11 | Sticky CTA entrance | Mobile bottom bar | Slide up after 40% scroll depth, `0.3s` | Appears once intent is demonstrated. |
| 12 | Accordion height | Mobile `WhyChooseUs` | `height: auto` via Framer layout, `0.3s` | The one place animating height is worth it — it shows *where* the content came from. |

### 5.3 Explicitly rejected

| Requested | Verdict | Reason |
|---|---|---|
| Mouse-follow / cursor effects | ✗ | Zero touch support, costs a `mousemove` listener, reads as portfolio-site rather than enterprise. |
| Animated gradient backgrounds | ✗ | Continuous repaint of a large area. Directly threatens the 60fps and ≥95 gates for pure decoration. |
| Parallax on multiple layers | ✗ | Multiple scroll-linked transforms compound into jank on mid-range Android. |
| Icon rotation on hover | ✗ | See #7 — meaningless motion, and the rule is that animation must *earn* its place. |
| Glassmorphism blur | ✗ | §2.3 — accessibility, performance, and category signal all point the same way. |
| Text scramble / typewriter | ✗ | Delays comprehension of the exact content the buyer came for. |
| 3D tilt on cards | ✗ | `perspective` + `rotate3d` per card, and it fights the flat, precise register the reference sites use. |

### 5.4 Performance discipline

- Animate **`transform` and `opacity` only.** Anything else triggers layout or paint.
- `will-change` on at most 3–4 concurrently animating elements, removed when idle.
- Every `whileInView` uses `viewport={{ once: true }}` — re-triggering on scroll-back is both annoying and expensive.
- Framer Motion via dynamic import in any component below the fold.
- Reduced-motion is not a fallback, it is a parallel design: content renders complete and static, never invisible. The existing `[data-aos] { opacity: 1 !important }` guard is exactly right — mirror it for any new system.

---

## 6. CRO and CTA strategy

### 6.1 The gaps, in priority order

**Gap 1 — no closing CTA on the homepage.** `StartYourJourneyCta` is built and unrendered (§0.2). This is a four-line diff and it is the highest-ROI change in this entire document. Do it today.

**Gap 2 — no in-section CTAs.** A visitor who is convinced at section 7 must scroll to the end to act. Every point of conviction is a point of potential conversion, and conviction decays with scroll.

**Gap 3 — no mobile persistent CTA.** Mobile visitors who lose interest mid-page have no path to contact without scrolling to the footer.

**Gap 4 — one conversion offer for three very different buyers.** A government evaluator will not "book a call" on a first visit; they want a capability document they can circulate internally. A startup founder will book immediately. Same button serves neither well.

### 6.2 The CTA ladder

Three commitment levels, deployed by context:

| Level | Offer | For | Placement |
|---|---|---|---|
| **Low** | Download capability deck / delivery playbook (PDF) | Government, enterprise research phase | `WhyChooseUs`, process section, footer |
| **Medium** | Book a 30-minute discovery call | Enterprise, MSME, manufacturing | Hero, section CTAs, final CTA, sticky bar |
| **High** | Request a proposal / RFP response | Active buyers, tender responses | Final CTA, `/contact`, `/solutions` |

Every page offers **at least one low-commitment option**. The document download is the underrated one: it converts researchers who will never fill a contact form, and it gives you an email plus an intent signal.

### 6.3 Placement map

```
Hero              → Primary: "Book a discovery call"
                    Secondary: "See our work"

TrustBar          → none (credibility only — a CTA here interrupts)

WhatWeDo          → per-card link into the service (exists)

Capabilities      → per-card link (exists)

Industries        → per-card link (exists)

★ WhyChooseUs     → CTA band: "Book a discovery call" + "Capability deck"
                    ↑ first hard conversion moment, at peak conviction

★ Process         → CTA band: "Start with a discovery call" + "Delivery playbook"

ImpactPreview     → "See all case studies"

Testimonials      → none (social proof; a CTA here cheapens it)

FAQ               → "Still have questions? Talk to us" — low-friction, in register

★ FinalCta        → "Start your journey" (primary) + "Call +91-XXXX" (direct)
                    ↑ include the phone number: government buyers still call

Footer            → newsletter + all three offices + phone + email

MOBILE STICKY     → appears at 40% scroll: [ Talk to us ] [ WhatsApp ]
```

### 6.4 Sticky mobile CTA

```tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/atoms/button";

/**
 * Mobile-only bottom bar. Appears once the visitor has demonstrated intent
 * (40% depth) so it never greets a first-time visitor mid-hero.
 */
export function StickyContactBar() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    // Sentinel + IntersectionObserver rather than a scroll listener: no
    // per-frame work on the main thread while the user scrolls.
    const el = document.getElementById("cta-sentinel");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(e.boundingClientRect.top < 0), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={reduce ? false : { y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 p-3
                     pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden"
        >
          <div className="flex gap-2">
            <Button href="/contact" className="h-12 flex-1">Talk to us</Button>
            <Button
              href="https://wa.me/91XXXXXXXXXX"
              variant="outline"
              className="h-12 w-12 shrink-0 px-0"
              aria-label="Chat on WhatsApp"
            >
              {/* icon */}
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
```

Place `<div id="cta-sentinel" />` after `IndustriesSection`. `env(safe-area-inset-bottom)` keeps it clear of the iOS home indicator. Add `pb-20 md:pb-0` to the footer so the bar never covers footer links.

### 6.5 Channels

**WhatsApp — yes, and it is not optional in this market.** MSME and manufacturing buyers in Maharashtra will WhatsApp before they email. Use a plain `wa.me` link with a prefilled message — **not** the WhatsApp Business widget script, which is ~40KB of third-party JavaScript against your LCP budget for a link you can write yourself.

```
https://wa.me/91XXXXXXXXXX?text=Hi%20Sumago%2C%20I%27d%20like%20to%20discuss%20a%20project
```

**Calendly — yes, but never embedded on the homepage.** The embed is a heavy third-party iframe that loads third-party cookies. Link to it from `/contact`, or embed it on `/contact` behind a click-to-load facade. A government buyer on a locked-down network may not be able to load it at all — always offer email and phone alongside.

**Contact form — reduce it.** Every field costs conversion. For a first-touch enquiry: name, work email, company, and one message field. Ask "organisation type" (Government / Enterprise / Startup / MSME) as a chip row rather than a select — it is one tap, it routes the lead, and it lets you personalise the reply. Everything else belongs in the call.

**Phone, prominently.** Government and manufacturing buyers still call. It belongs in the header on desktop, in the final CTA, and in the footer.

**Newsletter — footer only.** §4 explains why it must not appear near a conversion moment.

---

## 7. SEO

| Area | Action | Reason |
|---|---|---|
| **H1 discipline** | Exactly one `<h1>` per page, in the hero. Every section uses `<h2>`. | `SectionHeading` renders `<h2>` correctly. Audit hand-rolled headings — [more-sections.tsx:150](../src/components/organisms/home/more-sections.tsx#L150) uses an `<h2>` inside a card, which competes with the section heading. |
| **Structured data** | `Organization` + `LocalBusiness` (×3 offices) + `BreadcrumbList` + `FAQPage` on the FAQ | `FAQPage` can win a rich result; `LocalBusiness` per office feeds the local strategy in [docs/16](16-location-seo-strategy.md). Three offices — Nashik Govind Nagar, Nashik Satpur, Pune. **No US entity** (CLAUDE.md). |
| **FAQ = ranked content** | Write FAQ answers as standalone answers, not as conversational fragments | The FAQ is the highest-value SEO surface on the homepage; each answer can rank independently. |
| **Section anchors** | `id` on each homepage section (`#why-sumago`, `#process`) | Enables jump links and can earn sitelink-style deep links. |
| **Government keyword surface** | The `WhyChooseUs` risk copy is naturally keyword-dense ("government software development", "public-sector systems") | Buyer-language questions match search-language queries. This is the SEO benefit of the objection framing — it is not a separate optimisation. |
| **Image discipline** | `next/image` everywhere, explicit `width`/`height`, descriptive `alt`, hero `priority` | LCP < 2s is a gate. `CultureGallery` moving off the homepage helps materially here. |
| **Case-study depth** | One deep case study outranks nine teasers | Word count and specificity both matter; a card grid has neither. |
| **Internal linking** | Every `WhyChooseUs` panel and every process stage links onward | Distributes authority to service and industry pages, and the links are genuinely useful — which is the same thing. |

---

## 8. Palette extension

Your existing tokens in [globals.css](../src/app/globals.css) are well-constructed — the `brand` / `brand-ink` / `brand-bright` split (fill colour vs AA-safe text on light vs AA-safe text on dark) is exactly the right model, and the code comments show the reasoning was deliberate. **Do not replace this palette. Extend it.**

The gap is not colour. It is **surface hierarchy**: you have `paper` and `mist` and nothing between or beyond, so every card is the same elevation and the eye has no depth cues. That is a significant part of why the reviewed sections read flat.

```css
@theme {
  /* ---- EXISTING — unchanged ------------------------------------------ */
  --color-brand: #d73438;
  --color-brand-strong: #b82a2e;
  --color-brand-ink: #a81b22;      /* AA-safe red text on light */
  --color-brand-bright: #ff5a5d;   /* AA-safe red text on dark  */
  --color-tech: #1e83f0;           /* fill only, never text     */
  --color-tech-ink: #1257a8;       /* AA/AAA-safe blue text     */
  --color-success: #16a34a;
  --color-success-bright: #4ade80;
  --color-ink: #1a1a1a;
  --color-paper: #ffffff;
  --color-mist: #f5f5f6;
  --color-line: #e6e6e8;

  /* ---- NEW: surface ladder ------------------------------------------- */
  /* Four steps of elevation on light. Cards sit on `paper` above `mist`,
     which is what produces depth without a shadow. */
  --color-surface-sunken:   #efeff1;  /* wells, inset panels, code blocks */
  --color-surface:          #f5f5f6;  /* = mist; alias for intent clarity */
  --color-surface-raised:   #ffffff;  /* = paper; cards on mist           */
  --color-surface-overlay:  #ffffff;  /* modals, popovers (+ shadow)      */

  /* ---- NEW: dark surfaces -------------------------------------------- */
  /* `ink` is a text colour and too flat as a large background. These give
     the dark bands a ladder of their own. */
  --color-ink-raised:  #232326;  /* cards on ink       */
  --color-ink-sunken:  #101012;  /* wells on ink       */

  /* ---- NEW: border ladder -------------------------------------------- */
  --color-line-subtle: #f0f0f2;  /* internal dividers, table rules   */
  --color-line-strong: #d4d4d8;  /* input borders, active card edges */
  --color-line-dark:   rgba(255, 255, 255, 0.12);  /* hairlines on ink */

  /* ---- NEW: interaction states --------------------------------------- */
  --color-hover-tint:    rgba(215, 52, 56, 0.06);  /* brand-tinted hover  */
  --color-selected-tint: rgba(215, 52, 56, 0.10);  /* selected row/card   */
  --color-focus-ring:    #d73438;                   /* = brand            */

  /* ---- NEW: semantic status ------------------------------------------ */
  /* `warning` must not be red — it would collide with the brand. Amber.  */
  --color-warning:        #b45309;  /* amber, text-safe on light          */
  --color-warning-bright: #fbbf24;  /* on dark                            */
  --color-warning-tint:   #fffbeb;  /* background fill                    */
  --color-info:           #1257a8;  /* = tech-ink                         */
  --color-info-tint:      #eff6ff;
  --color-success-tint:   #f0fdf4;
}
```

**Rules of use**

1. **`brand` is a fill, never body text.** `#d73438` on white is roughly 4.0:1 — below AA for normal text. Use `brand-ink` for red text on light, `brand-bright` on dark. Your existing comments already say this; enforce it in review.
2. **Red is punctuation.** In a trust section, red should appear on **one CTA, one active indicator, and the icon fills** — nowhere else. The reviewed screenshot uses red on four icons, a heading accent, four bullets, and a card tint; at that density it stops signalling importance because nothing is left to contrast against. Red reads as *urgency*, and urgency is not the emotion you want in a government trust section — **calm competence** is. Give the trust content ink and neutrals, and spend the red on the action.
3. **`tech` blue is a deliberate second voice** for technical/architecture content (`AiSdlc`, architecture diagrams). It gives engineering material a distinct register without a second brand colour.
4. **Never use `success` green and `brand` red for anything a colour-blind user must distinguish.** Deuteranopia collapses that pair. Always pair with an icon or a text label — the existing `BadgeCheck` pattern in `TrustIndicators` is the right precedent.
5. **Verify every new pairing** with an automated contrast check in CI before it ships. The values above are chosen conservatively, but "chosen conservatively" is not the same as "measured." [docs/13](13-accessibility.md) requires the measurement.

**Suggested type scale refinement** — the current `body { font-size: 0.875rem }` (14px) is small for long-form enterprise reading, particularly for the older decision-makers common in government. Consider 15px (`0.9375rem`) as the body default while keeping 14px for chips, labels, and dense UI. Small change, meaningful for the actual audience.

---

## 9. Implementation order

Sequenced by value delivered per unit of effort. Ship top-down.

| # | Change | Effort | Impact |
|---|---|---|---|
| 1 | Render `StartYourJourneyCta` and `FaqSection` on the homepage | 10 min | **Critical** — closes the conversion hole |
| 2 | `Reveal` default `duration: 3 → 0.5` | 1 min | High — whole site feels faster |
| 3 | Render `TrustBar` above the fold | 15 min | High — legitimacy before the scroll decision |
| 4 | Reorder homepage per §1.2; move `CultureGallery` off | 30 min | High — buyer-journey alignment, LCP relief |
| 5 | Add CMMI Level 5 wherever ISO 9001:2015 appears | 20 min | High — your strongest tender credential |
| 6 | Build `WhyChooseUs` (§2) | 1–2 days | High |
| 7 | Sticky mobile CTA + WhatsApp link | 3 hrs | High — mobile conversion path |
| 8 | Scroll-driven process rail + detail panel (§3) | 1–2 days | Medium–High |
| 9 | Add surface/border/state tokens (§8) | 2 hrs | Medium — unlocks depth everywhere |
| 10 | `FAQPage` + `LocalBusiness` ×3 structured data | 3 hrs | Medium |
| 11 | Government credentials block (verify first) | 1 day | **High for primary audience** |
| 12 | Client logo wall (pending consent) | ongoing | High |
| 13 | Body type 14px → 15px | 30 min | Medium |

**Do not ship any of this without re-running the [docs/14](14-testing.md) gate:** Lighthouse Performance ≥95, Accessibility / SEO / Best Practices 100, LCP < 2s, CLS < 0.1, 60fps. Items 6 and 8 are the ones that can move those numbers.

---

## 10. Open questions

These need answers before the corresponding work can ship. Each blocks only its own item.

1. **CMMI Level 5** — current and verifiable? Certificate number and assessment date, for the credentials block.
2. **Client logo consent** — which clients have granted display permission? Item 12 is blocked on this.
3. **Government empanelments** — which departments, and is GeM registration current? Item 11 must not publish an unverified list.
4. **Capability deck** — does a current PDF exist? The entire low-commitment CTA rung depends on it.
5. **WhatsApp Business number** — which of the three offices routes it, and who monitors it?
6. **Case study clearance** — which engagements can be named, and which metrics are cleared for publication?
7. **`processSteps` — six or eight?** §3.2. Pick one and propagate; the site cannot carry two.

Anything still `[VERIFY]` in `COMPANY-PROFILE.md` when the work is ready stays off the site. A trust section that overstates one credential invalidates every other claim beside it — which is the precise opposite of what this document is trying to build.
