# 09 — Component Library (Atomic Design)

Components follow **Atomic Design**. Reusable, documented, strongly typed. Built on shadcn/ui primitives + the [Design System](03-design-system.md) tokens. Catalogue in Storybook (see [14](14-testing.md)).

## Atoms
Button (primary/secondary/ghost/link) · IconButton · Input · Textarea · Select · Checkbox/Radio/Switch · Label · Badge/Tag · Avatar · Logo · Icon · Link · Divider · Spinner · Eyebrow/Label text · VisuallyHidden (a11y).

## Molecules
- **FormField** (label + control + error + hint)
- **NavLink / DropdownMenuItem**
- **StatCounter** (animated metric — trust indicator)
- **TestimonialQuote**
- **TagList** (capabilities/industries)
- **MediaFrame** (image/video with Cloudinary/Cloudflare loader; enforces no-stock rule via real-asset slots)
- **MediaPlaceholder / VideoPlaceholder / LogoPlaceholder** (branded dummy slots for pre-asset builds — labeled `[REAL ASSET NEEDED]` outside production, aspect-ratio matched, flagged `isPlaceholder`; never stock. See [17](17-placeholder-and-seed-content.md))
- **Breadcrumbs**
- **CTAButton** ("Start Your Journey" variants)

## Organisms
- **Header / Navigation** (+ mega-menu, mobile sheet)
- **Footer**
- **Hero** (with optional 3D layer slot)
- **FounderWelcome / FoundersDesk** (signature video module)
- **CapabilityCard / CapabilityShowcase**
- **IndustryGrid / IndustryShowcase**
- **SuccessStoryCard / SuccessStoryDetail** (challenge→solution→impact→ROI→testimonial)
- **ChallengesWeSolve**
- **TrustIndicators** (metrics, certifications, awards, clients)
- **InnovationHighlights / ArticleCard**
- **WhySumago** (differentiators)
- **ProcessTimeline** (the 9-step engagement — scroll-driven, see [06](06-motion-principles.md))
- **StartYourJourneyForm / ContactForm**
- **VideoPlayer** (Cloudflare Stream wrapper, accessible controls, captions)
- **Scene3D** (lazy-loaded R3F wrapper with fallback — see [07](07-3d-experience.md))

## Templates
PageShell (header/footer/seo) · HomeTemplate · ContentPageTemplate · DetailTemplate (capability/industry/story/article) · FormPageTemplate.

## Pages
The 10 routes from [04](04-information-architecture.md), composed from templates + organisms, fed by Sanity content.

## Component standards
- One component per file; co-locate styles/tests/stories.
- Props strongly typed; document with JSDoc/TSDoc + a Storybook story.
- Server Components by default; `"use client"` only when interactivity/motion requires it.
- Accessible by construction: semantic elements, ARIA only when needed, keyboard + focus states, `prefers-reduced-motion` aware.
- No business/data-fetching logic inside presentational components — pass data in.
- Heavy/3D/media components are lazy-loaded with fallbacks.
