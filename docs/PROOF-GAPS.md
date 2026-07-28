# Proof gaps — what the services pages still need from the client

**Status:** open · **Blocks:** launch (per [docs/08](08-content-strategy.md) and [docs/17](17-placeholder-and-seed-content.md))

The services pages are built and honest: every claim on them traces to
[`COMPANY-PROFILE.md`](../COMPANY-PROFILE.md). The design is done. What's missing
is **evidence**, and no amount of copywriting can substitute for it.

`docs/08` mandates *"specific numbers beat adjectives"* and a *"related success
story"* per capability. **That content model is not satisfiable today for 12 of
the 15 services.** This file is the ask-list that closes the gap.

---

## 1 · The blocker: metric attribution (highest priority)

`COMPANY-PROFILE.md` contradicts itself. **700+ projects** and **70+ team
members** appear in the verified "Scale & proof" section *and* in the `[VERIFY]`
list, because the source slide co-brands **SCOPE** (the training arm, which is
out of scope for this site entirely).

> **Question for the client:** Of `700+ projects` and `70+ team members`, which
> are Sumago Infotech's alone, excluding SCOPE? Give the Sumago-only figure for
> each.

Until answered, these two numbers must not anchor any headline. They are
currently used in `src/app/about/page.tsx` body copy — **audit that on answer.**

**Safe today** (not flagged anywhere): 13+ years · 50+ Government / 500+ Domestic
/ 60+ International clients · ISO 9001:2015 · CMMI Maturity Level 5 · 4 offices ·
the 9-step delivery process.

---

## 2 · Per-service proof

Only **3 of 15** services have any real work attached. On the service **detail**
pages, the rest render a `[REAL PROOF NEEDED]` flag outside production (hidden
from live visitors via `NODE_ENV`, same convention as `MediaPlaceholder`). The
Solutions index shows no proof either way — it hooks with the problem and hands
off to the detail page.

### Has proof (wired up, live)

| Service | Story |
|---|---|
| Mobile App Engineering | Mahindra Rise — App Launch |
| AI & Intelligent Automation | WebespokeAI · nasscom × Indian Oil |
| Enterprise Software Engineering | MAMASTOPS — Cross-Border Logistics |

⚠️ Even these four stories have **no metric, no timeline, and no quote** — their
`body` copy in `src/lib/site.ts` is marked `[SAMPLE COPY]`.

### No proof of any kind (12)

Web Platform Engineering · Digital Growth & Marketing · Technology Advisory ·
Program & Delivery Management · Data Analytics & Insights · Blockchain Solutions ·
Managed Outsourcing · IoT & Connected Products · Product Engineering ·
Cloud & DevOps Engineering · Experience Design (UI/UX) · Quality Engineering

> **Ask:** For the **top 3–5 services by revenue**, supply for each:
> 1. **One numbered outcome** — e.g. "cut order processing from 6 days to 4 hours",
>    "reduced cloud spend 38%". A real number, with the client's permission to print it.
> 2. **One attributed quote** — name, role, company, and consent to publish.
> 3. **A timeline** — "12 weeks, 4 engineers" tells a CTO more than any adjective.

---

## 3 · Testimonials — all currently fake

`src/lib/content.ts:212` — *"Sample testimonials — [DUMMY]"*. The names
(Rajesh Menon, Anita Deshpande, Michael Carter) are invented seed copy. **Zero
real testimonials exist in the repo.** They render on the home page today.

> **Ask:** 3–5 real attributed quotes with written consent, or the testimonials
> section gets cut before launch. Fabricated quotes from a CMMI-L5 company is the
> single worst trust failure available to us.

---

## 4 · Client names & logos

~17 real client names exist (Mahindra, Toyota, Hinduja, MSBTE, FSSAI, NIC, Govt
of Maharashtra…), currently rendered as **neutral text chips** — correct per
`docs/17` until consent lands.

> **Ask:** Confirm the current client list, and **written logo-display permission
> per client.** Text chips stay until then.

---

## 5 · Engagement model — entirely absent

No pricing, rate cards, timelines, team composition, SLAs, support tiers, or
guarantees exist anywhere. `docs/08` lists "support model" and "security
practices" as trust content *to be created*. ISO 9001 + CMMI L5 are currently
carrying that weight alone.

> **Ask:** Even indicative bands help — typical engagement length, pod shape
> ("2 engineers + 1 designer + QA"), support response expectations. A CTO scanning
> for "can I afford this and when do I see something" finds nothing today.

---

## How the flags work

- Gap markers render **only outside production** (`process.env.NODE_ENV`).
- They carry `data-placeholder="proof"` so the launch gate can detect them —
  consistent with `data-placeholder="stock"` on media (`docs/17`, `docs/14`).
- Proof data lives in `src/lib/services.ts` (`stories`, derived `hasProof`).
  Attaching a story to a service removes its flag automatically.

**Do not fill these slots with invented outcomes.** An unproven service showing
verified company credentials is honest. An unproven service showing a
manufactured metric is the one mistake this site cannot recover from.
