/**
 * Page chrome for the industry detail template — every heading, eyebrow, and
 * standfirst that is NOT industry-specific, in one typed object.
 *
 * Same contract as lib/service-page-copy.ts: the industry's own content lives in
 * `Industry` (lib/industries.ts) and the editorial chrome lives here, so the
 * template holds no literal strings and the move to Sanity is a fetch, not a
 * rewrite:
 *
 *   Sanity `industryPage` singleton →  IndustryPageCopy  (this shape)
 *   Sanity `industry` documents     →  Industry[]        (lib/industries.ts)
 *
 * Two conventions keep this portable to a CMS, where a field is a plain string
 * and can never carry JSX (lib/rich-text.tsx):
 *   `{industry}` / `{count}` — tokens filled at render time
 *   `*emphasis*`             — becomes the brushed-metal red accent span
 *
 * An editor changing wording here changes all ten pages. Voice rules from
 * CLAUDE.md still apply: outcome-first, never "we provide / we offer".
 */
import type { SectionCopy } from "@/lib/service-page-copy";

export type IndustryPageCopy = {
  hero: {
    backLabel: string;
    eyebrow: string;
    primaryCta: string;
    secondaryCta: string;
    /** Label above the verified proof strip under the hero copy. */
    proofLabel: string;
  };
  reality: {
    eyebrow: string;
    /** Plate label above the operator's quote. */
    todayLabel: string;
    approachHeading: string;
    navLabel: string;
  };
  challenges: SectionCopy;
  build: SectionCopy;
  /**
   * The transformation band (organisms/industries/transformation.tsx): the two
   * states either side of the core, plus the instrument's own labels.
   */
  outcomes: SectionCopy & {
    /** Column label for the state the sector arrives in. */
    beforeLabel: string;
    beforeCaption: string;
    /** Column label for the state the work lands it in. */
    afterLabel: string;
    afterCaption: string;
    /** Header label on the core panel. */
    coreLabel: string;
    /** Credit line under the core — precedes the build that produces it. */
    viaLabel: string;
    /** Accessible name for the outcome selector driving the core. */
    selectorLabel: string;
  };
  services: SectionCopy & { cta: string };
  proof: SectionCopy;
  siblings: SectionCopy & { cta: string };
};

export const industryPageCopy: IndustryPageCopy = {
  hero: {
    backLabel: "All industries",
    eyebrow: "Industries we power",
    primaryCta: "Let's Connect",
    secondaryCta: "See what changes",
    proofLabel: "Independently certified · since 2013",
  },
  reality: {
    eyebrow: "The week it usually starts with",
    todayLabel: "Today",
    approachHeading: "How the work is run",
    navLabel: "The reality",
  },
  challenges: {
    eyebrow: "Where it hurts",
    title: "The friction that *slows this sector down.*",
    description:
      "Not a list of features missing — the three problems {industry} teams keep describing in the first conversation.",
    navLabel: "Friction",
  },
  build: {
    eyebrow: "What gets built",
    title: "Engineered for how {industry} *actually operates.*",
    description:
      "Each build answers the friction above it — same order, so nothing is proposed without a reason to exist.",
    navLabel: "What gets built",
  },
  outcomes: {
    eyebrow: "What changes",
    title: "See what changes when *technology gets it right.*",
    description:
      "Better visibility. Less friction. Smarter operations — built into the way a {industry} team already works, with no invented numbers attached.",
    navLabel: "What changes",
    beforeLabel: "Before",
    beforeCaption: "Where it stands today",
    afterLabel: "After",
    afterCaption: "Where the work lands it",
    coreLabel: "Transformation core",
    viaLabel: "Delivered by",
    selectorLabel: "Choose an outcome to see how it is delivered",
  },
  services: {
    eyebrow: "The work behind it",
    title: "The services doing the *heavy lifting here.*",
    description:
      "The capabilities most {industry} engagements draw on — each one explained in full on its own page.",
    navLabel: "Services",
    cta: "Explore all 15 services",
  },
  proof: {
    eyebrow: "Proof of work",
    title: "Real work in *this sector.*",
    navLabel: "Proof",
  },
  siblings: {
    eyebrow: "Other industries",
    title: "Domain depth *across every sector served.*",
    navLabel: "Other industries",
    cta: "See all ten industries",
  },
};
