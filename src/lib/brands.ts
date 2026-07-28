/**
 * The Sumago group's three public-facing businesses — the data behind the
 * first-visit brand gateway (components/organisms/brand-gateway.tsx).
 *
 * Sumago Infotech is *this* site. SCOPE and SCOPIO AI are separate businesses on
 * their own domains: the gateway routes visitors out to them and nothing else on
 * this site references them. That boundary is deliberate — see COMPANY-PROFILE.md
 * ("SCOPE — separate business") and CLAUDE.md. The gateway is the single, explicit
 * exception to the "no SCOPE content on this site" rule.
 */

import { featuredServices } from "@/lib/services";

/** localStorage flag — set once a visitor has made (or dismissed) their choice. */
export const GATEWAY_STORAGE_KEY = "sumago:brand-gateway-seen";

/** Destinations for the two external businesses. Both confirmed by the client. */
export const brandUrls = {
  scope: "https://scope.org.in",
  scopio: "https://scopioai.com",
} as const;

export type Brand = {
  key: "infotech" | "scope" | "scopio";
  /** Full name — carries the accessible label for the whole panel. */
  name: string;
  /** Compact name for inline lists (the footer's group strip). */
  short: string;
  /** Typographic wordmark. `accent` takes the brand red-gradient treatment.
   *  [REAL ASSET NEEDED] Real SCOPE / SCOPIO logo files would replace these. */
  wordmark: { lead: string; accent: string };
  /** What the business *is* — sits above the wordmark. */
  descriptor: string;
  /** The outcome it delivers, in one line (voice rules: docs/08). */
  promise: string;
  /** The list revealed as the panel takes focus. Infotech shows what it *does*
   *  (its flagship services); the other two show what they're for. */
  points: readonly string[];
  cta: string;
  href: string;
  /** External businesses navigate away; Infotech just dismisses the gateway. */
  external: boolean;
  /** Panel accent — every value is an existing design token (docs/03). */
  accent: string;
  /** Signature backdrop, so the three panels never read as the same card ×3. */
  effect: "blueprint" | "streaks" | "orbit";
};

export const brands: readonly Brand[] = [
  {
    key: "infotech",
    name: "Sumago Infotech Pvt. Ltd.",
    short: "Sumago Infotech",
    wordmark: { lead: "Sumago", accent: "Infotech" },
    descriptor: "Technology consulting & product engineering",
    promise:
      "Helping businesses solve complex problems through technology — and stay solved.",
    // The same six flagship services the homepage features, from the one
    // catalog (lib/services.ts) — so the gateway can never drift from the site.
    points: featuredServices.map((s) => s.name),
    cta: "Enter Infotech",
    href: "/",
    external: false,
    accent: "#d73438", // --color-brand
    effect: "blueprint",
  },
  {
    key: "scope",
    name: "SCOPE — Sumago Center of Practical Excellence",
    short: "SCOPE",
    wordmark: { lead: "SC", accent: "OPE" },
    // "Sumago Center of Practical Excellence" is verified (COMPANY-PROFILE.md).
    descriptor: "Sumago Center of Practical Excellence",
    promise: "Turning what's taught in classrooms into craft the industry hires.",
    // [VERIFY] Track list read off the current live site, not yet confirmed by the
    // client. Confirm before launch — see docs/17.
    points: [
      "Full Stack · Data Science · Python",
      "Practical, industry-led curriculum",
    ],
    cta: "Visit SCOPE",
    href: brandUrls.scope,
    external: true,
    accent: "#ff6b4a", // established orange accent (hero-effect.tsx)
    effect: "streaks",
  },
  {
    key: "scopio",
    name: "SCOPIO AI — Sumago AI Interview Practice Platform",
    short: "SCOPIO AI",
    wordmark: { lead: "SCOPIO", accent: "AI" },
    // [VERIFY] SCOPIO AI is absent from COMPANY-PROFILE.md entirely. Descriptor and
    // proof points below are read off the current live site — confirm all three.
    descriptor: "AI interview practice platform",
    promise: "Turning interview practice into offers, one honest rep at a time.",
    points: [
      "AI-powered mock interviews",
      "Real-time feedback, personalised plans",
    ],
    cta: "Visit SCOPIO AI",
    href: brandUrls.scopio,
    external: true,
    accent: "#1e83f0", // --color-tech
    effect: "orbit",
  },
] as const;
