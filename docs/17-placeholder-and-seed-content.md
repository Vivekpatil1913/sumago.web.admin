# 17 — Preview Content Policy (Stock — Swap Before Launch)

To make the site look real and alive during the build, **preview builds use placeholder stock images/videos and sample text.** This is a **development-only** convenience. The brand rule **"no stock, ever" still governs production** ([02](02-brand-guidelines.md)) — every stock/sample asset is flagged and must be replaced with real assets before launch, enforced by a build gate.

## How it works
1. **Preview = stock OK, flagged.** Dev/preview environments may use stock media + sample copy so layouts, motion, and 3D can be evaluated against realistic content.
2. **Production = real only.** No stock asset or sample text may ship live. The launch checklist ([14](14-testing.md), [15](15-deployment.md)) **fails the build if any `isPlaceholder` asset/text reaches production.**
3. **Everything preview is flagged** `isPlaceholder: true` (CMS) / `data-placeholder` (markup), with a `[PREVIEW — STOCK]` / `[SAMPLE COPY]` label visible outside production.
4. **Swappable by design.** All content is CMS-driven, so replacing a stock asset or sample text with the real thing is a content edit — no code change.

## Stock media sources (free-license, dev only)
- **Images:** Unsplash, Pexels, Pixabay (free commercial license). Pick neutral, premium, enterprise-appropriate visuals (offices, teams, technology, abstract) that match the brand mood — avoid clichéd/cheesy stock.
- **Video:** Pexels Video / Coverr / Mixkit (free license), or Cloudflare Stream sample assets.
- **Convention:** prefer referencing via the CMS media field so swap = re-upload. Where hardcoded in preview, centralize URLs in one `lib/preview-assets.ts` so they're easy to find and purge.
- Keep an attributions note if a source's license requests it.

## Sample text
- Use realistic **brand-voice** sample copy (outcome-first per [08](08-content-strategy.md)) rather than raw lorem ipsum where feasible — it reads better in review — but mark it `[SAMPLE COPY]`.
- **Never present sample numbers/metrics/quotes as real.** Metrics, ROI, testimonials, and bios stay clearly flagged until verified, and **real verified facts** from [COMPANY-PROFILE](../COMPANY-PROFILE.md) (name, certifications, addresses, capabilities, project & leadership names) are used as-is.

## Client logos / case studies — consent still required
Stock visuals are fine for *generic* imagery, but **real client logos and detailed case studies still need explicit permission**. Until confirmed, use a neutral text chip for client names and keep case-study specifics flagged. `[VERIFY]` consent per client before publishing.

## Pre-launch swap checklist (blocks release)
- [ ] Every stock image/video replaced with a real, owned asset
- [ ] All `[SAMPLE COPY]` replaced with real, verified content
- [ ] Founder's Desk real video in place
- [ ] Case studies: real data + client consent, or section removed
- [ ] Client logos: real + consent, or kept as text
- [ ] Remove `lib/preview-assets.ts` / purge any hardcoded stock URLs
- [ ] Build gate confirms **zero** `isPlaceholder` content in production
