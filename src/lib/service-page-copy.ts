/**
 * Page chrome for the service detail template — every heading, eyebrow, and
 * standfirst that is NOT service-specific, in one typed object.
 *
 * WHY THIS FILE EXISTS (read before editing the template):
 * The service detail page is one layout rendered 15 times. Two kinds of copy
 * live on it — the service's own content (`Service` in lib/services.ts) and the
 * editorial chrome around it. Keeping the chrome here means the template holds
 * no literal strings, so when the page moves to Sanity (CLAUDE.md — content is
 * CMS-driven) the migration is a fetch, not a rewrite:
 *
 *   Sanity `servicePage` singleton  →  ServicePageCopy   (this shape)
 *   Sanity `service` documents      →  Service[]         (lib/services.ts)
 *
 * Two conventions keep this shape portable to a CMS, where a field is a plain
 * string and can never carry JSX:
 *   `{service}` / `{count}` — tokens filled at render time (lib/rich-text.tsx)
 *   `*emphasis*`            — becomes the brushed-metal red accent span
 *
 * Any editor changing wording here changes all 15 pages. Voice rules from
 * CLAUDE.md still apply: outcome-first, never "we provide / we offer".
 */

/** Eyebrow + title + optional standfirst — matches the SectionHeading atom. */
export type SectionCopy = {
  eyebrow: string;
  /** Supports `*emphasis*` and `{service}` / `{count}` tokens. */
  title: string;
  /** Supports the same tokens. */
  description?: string;
  /** Short label for the sticky chapter nav. */
  navLabel: string;
};

export type ServicePageCopy = {
  hero: {
    backLabel: string;
    primaryCta: string;
    secondaryCta: string;
  };
  problem: {
    eyebrow: string;
    /** Plate label above the problem, in the shift diagram. */
    todayLabel: string;
    approachHeading: string;
    navLabel: string;
  };
  whoFor: SectionCopy;
  /** The manifest diagram adds a document header and a closing line. */
  deliverables: SectionCopy & { manifestTitle: string; footnote: string };
  /** The outcomes section frames the steps as a journey; these label its ends. */
  outcomes: SectionCopy & { journeyStart: string; journeyEnd: string };
  stack: SectionCopy;
  proof: SectionCopy;
  whySumago: SectionCopy;
  related: SectionCopy;
  /** Trailing link under the related list. */
  relatedCta: string;
};

export const servicePageCopy: ServicePageCopy = {
  hero: {
    backLabel: "All services",
    primaryCta: "Start a conversation",
    secondaryCta: "See how it works",
  },
  problem: {
    eyebrow: "The problem",
    todayLabel: "Where the business is today",
    approachHeading: "How Sumago approaches it",
    navLabel: "The problem",
  },
  whoFor: {
    navLabel: "Who it's for",
    eyebrow: "Who this is for",
    title: "If any of this sounds like *your quarter*.",
    description:
      "{service} is usually the answer to one of these {count} conversations — not to a feature list.",
  },
  deliverables: {
    navLabel: "What you get",
    eyebrow: "What you get",
    title: "The artifacts an engagement *leaves behind*.",
    description:
      "Tangible things your team owns at the end — not a slide deck describing them.",
    manifestTitle: "Handover manifest",
    footnote: "Everything listed above belongs to your team at the end of the engagement.",
  },
  outcomes: {
    navLabel: "What changes",
    eyebrow: "What changes",
    title: "The difference this makes to *the business*.",
    description: "Not what gets built — what it's worth once it's running.",
    journeyStart: "Where the business starts",
    journeyEnd: "Where this lands it",
  },
  stack: {
    navLabel: "The stack",
    eyebrow: "The stack",
    title: "Built on what your team can *actually hire for*.",
    description:
      "Mainstream, well-supported technology — chosen so the platform stays maintainable long after launch, by people who aren't us.",
  },
  proof: {
    navLabel: "Proof",
    eyebrow: "Proof of work",
    title: "The *real work* behind it.",
  },
  whySumago: {
    navLabel: "Why Sumago",
    eyebrow: "Why Sumago",
    title: "Chosen for *judgment*, not just delivery.",
  },
  related: {
    navLabel: "Keep exploring",
    eyebrow: "Keep exploring",
    title: "Problems that usually *travel with this one*.",
  },
  relatedCta: "All services →",
};
