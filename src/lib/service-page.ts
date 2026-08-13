/**
 * THE SERVICE PAGE CONTENT CONTRACT
 * =================================
 *
 * Every service page renders the same twelve sections in the same order, with
 * the same spacing, the same components and the same motion. Only the content
 * changes. This file is what makes that guarantee enforceable in code:
 * `resolveServicePage()` takes a `Service` and returns a fully-populated object
 * with one entry per section. The page component reads that object and nothing
 * else — it never branches on which service it is rendering.
 *
 * THE ORDER IS EDUCATE-FIRST, and that is a deliberate reversal. The page does
 * not open by naming the reader's problem: an enterprise buyer who feels sold
 * to in the first screen stops reading, while one who learns something in the
 * first screen keeps going. So the argument runs
 *
 *   understand it → why it's worth money → what we build → what changes
 *   → what's covered → where it applies → how we work → why us → the stack
 *   → proof
 *
 * The problem still gets named. It is named in section 03, as the reason a
 * value driver matters — not as the opening move.
 *
 * Two rules follow from all of this, and they are the whole system:
 *
 *   1. A section can never be missing. Where a service has not had its bespoke
 *      copy written yet, the resolver derives an honest fallback from content
 *      that already exists (`definition`, `problem`, `whoFor`, `deliverables`,
 *      `outcomes`). A half-written service degrades in *density*, never in
 *      structure.
 *
 *   2. Nothing is invented here. Every fallback re-presents copy that already
 *      passed review in `lib/services.ts`. No metrics, no claims, no filler.
 *      Where real proof does not exist, the proof section says so outside
 *      production and hides inside it (docs/17, docs/PROOF-GAPS.md).
 *
 * Authoring a service page is therefore never a design task. See docs/18 for
 * the field-by-field guide.
 */
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Banknote,
  BarChart3,
  Blocks,
  Boxes,
  Building2,
  ClipboardList,
  Cloud,
  Code2,
  Compass,
  Cpu,
  CreditCard,
  Gauge,
  Handshake,
  HeartPulse,
  Layers,
  LifeBuoy,
  Lightbulb,
  MapPin,
  PenTool,
  Rocket,
  Route,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TestTube2,
  TrendingUp,
  Truck,
  Users,
  WifiOff,
  Workflow,
} from "lucide-react";
import { PHASES, type Phase, type ServiceWithSlug } from "@/lib/services";
import { differentiators } from "@/lib/content";
import { industryBySlug } from "@/lib/industries";
import type { MockKind } from "@/components/organisms/solutions/service-page/build-mocks";
import { industries as ALL_INDUSTRIES } from "@/lib/site";
import { slugify } from "@/lib/utils";

/**
 * A case study, in the shape the Proof section reads it.
 *
 * Structural rather than `(typeof impactStories)[number]` so the page can be
 * fed from either source: the committed stories in `lib/site.ts`, or a story
 * the admin panel published (`SuccessStoryRecord` — the same fields, with
 * `coverImage` mapped to `cover`). The literal-typed tuple would have accepted
 * only the committed ones, which would have taken service pages off the CMS.
 */
export type Story = {
  slug: string;
  title: string;
  industry: string;
  cover: string;
  challenge: string;
  solution: string;
  impact: string;
  /** What it was built with — the line under the proof card's result rows. */
  tech: readonly string[];
};

/* -------------------------------------------------------------------------- */
/*  Section shapes                                                             */
/* -------------------------------------------------------------------------- */

export type IconCard = { title: string; description: string; icon: LucideIcon };
export type OutcomeRow = { before: string; after: string };
export type ProcessStep = { title: string; description: string; icon: LucideIcon };
export type CapabilityItem = { name: string; why?: string };
export type CapabilityGroup = {
  category: string;
  icon: LucideIcon;
  items: CapabilityItem[];
};
export type BuildCard = {
  title: string;
  purpose: string;
  value: string;
  features: string[];
  icon: LucideIcon;
};

export type ServicePageContent = {
  hero: {
    eyebrow: string;
    statement: string;
    subtitle: string;
    visual: "orbit" | "devices";
    cta: string;
  };
  /** Which mock section 04 runs — the one thing that changes shape per service. */
  buildMock: MockKind;
  /** The five lines pinned around the globe in section 08. */
  standoutPoints: string[];
  /** The line section 11 closes on, where the service has one written. */
  closingLine?: string;
  understanding: {
    title?: string;
    narrative: string[];
    shifts: string[];
    cards: IconCard[];
  };
  valueDrivers: IconCard[];
  whatWeBuild: BuildCard[];
  outcomes: { rows: OutcomeRow[]; statements: string[] };
  capabilities: CapabilityGroup[];
  industries: { name: string; description: string; useCase?: string }[];
  process: ProcessStep[];
  whyUs: IconCard[];
  tech: { technologies: string[]; tools: readonly string[] };
  proof: Story[];
};

/* -------------------------------------------------------------------------- */
/*  Icon registries                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Icons available to authored content, keyed by the string a service uses in
 * `lib/services.ts`. Keeping this a name→icon map rather than importing icons
 * into the content file is what stops `services.ts` from becoming a component
 * file — it stays pure data, which is what a CMS will eventually replace.
 */
export const CONTENT_ICONS: Record<string, LucideIcon> = {
  /* Audiences and surfaces */
  customers: Users,
  business: Building2,
  mobility: Smartphone,
  experience: Sparkles,
  interface: PenTool,
  /* Value drivers */
  engagement: Sparkles,
  efficiency: Workflow,
  productivity: Gauge,
  growth: TrendingUp,
  transformation: Route,
  /* Functional groups */
  automation: Workflow,
  security: ShieldCheck,
  compliance: BadgeCheck,
  payments: CreditCard,
  location: MapPin,
  notifications: Sparkles,
  offline: WifiOff,
  analytics: BarChart3,
  integrations: Layers,
  platform: Cloud,
  infrastructure: Cloud,
  engineering: Blocks,
  devices: Cpu,
  delivery: Rocket,
  discovery: Search,
  quality: TestTube2,
  support: LifeBuoy,
  management: ClipboardList,
  advisory: Lightbulb,
  partnership: Handshake,
  /* Sector-shaped cards in "What we build" */
  health: HeartPulse,
  retail: ShoppingBag,
  logistics: Truck,
  banking: Banknote,
  field: ClipboardList,
  companion: Smartphone,
  iot: Cpu,
};

const FALLBACK_ICON = Boxes;

/** Resolve an authored icon key, falling back rather than throwing. */
function icon(key: string | undefined, fallback: LucideIcon = FALLBACK_ICON) {
  return (key && CONTENT_ICONS[key.toLowerCase()]) || fallback;
}

/** Process step icons, keyed by step title so defaults and overrides agree. */
const PROCESS_ICONS: Record<string, LucideIcon> = {
  "Business discovery": Search,
  Discovery: Search,
  "Product strategy": Compass,
  Assessment: Gauge,
  Audit: Search,
  Options: Layers,
  Recommendation: Lightbulb,
  Roadmap: Route,
  Definition: ClipboardList,
  "UX research": Users,
  "UI design": PenTool,
  Design: PenTool,
  Architecture: Blocks,
  Prototype: Boxes,
  Development: Code2,
  Execution: Rocket,
  "Quality engineering": TestTube2,
  Testing: TestTube2,
  Validation: TestTube2,
  Deployment: Rocket,
  Handover: Handshake,
  Measurement: BarChart3,
  Reporting: BarChart3,
  "Continuous improvement": TrendingUp,
  Improvement: TrendingUp,
  Optimisation: TrendingUp,
  Strategy: Compass,
  Onboarding: Users,
  Stabilisation: ShieldCheck,
  Operations: Workflow,
  Support: LifeBuoy,
};

/* -------------------------------------------------------------------------- */
/*  Defaults — the parts that are genuinely the same for every service         */
/* -------------------------------------------------------------------------- */

/**
 * The shape every authored card in `services.ts` shares: a title, a body, and
 * an optional icon key. Declaring it once is what lets a resolver line fall
 * back from bespoke content to derived content without the two shapes fighting.
 */
type Authored = { title: string; description: string; icon?: string };

type RawStep = { title: string; description: string; icon?: string };

/**
 * Delivery process by lifecycle phase. A consulting engagement and a build
 * engagement genuinely do not run the same way, so the default is chosen by the
 * service's phase rather than one generic ribbon pretending to fit everything.
 * A service can still override it with its own `process`.
 */
const PROCESS_BY_PHASE: Record<Phase, RawStep[]> = {
  Consulting: [
    { title: "Discovery", description: "Understanding the business, the constraints, and what the decision actually hinges on." },
    { title: "Assessment", description: "Reviewing current systems, costs and risks against where the business is heading." },
    { title: "Options", description: "The realistic routes, with the trade-offs of each stated plainly." },
    { title: "Recommendation", description: "A costed, sequenced direction — and the reasoning, so it can be challenged." },
    { title: "Roadmap", description: "The direction turned into a plan with owners, milestones and a first move." },
    { title: "Support", description: "Staying available through the decision and into delivery, so momentum isn't lost." },
  ],
  Designing: [
    { title: "Discovery", description: "Learning the business, the users and the problem before proposing anything." },
    { title: "Definition", description: "Agreeing what success looks like, and what is deliberately out of scope." },
    { title: "Design", description: "The experience and the structure behind it, reviewed with you as it forms." },
    { title: "Prototype", description: "Something clickable and testable early — decisions get cheaper when visible." },
    { title: "Validation", description: "Tested with real users, and adjusted before production code is written." },
    { title: "Handover", description: "A documented system your engineers can build from without guessing." },
  ],
  Building: [
    { title: "Business discovery", description: "Understanding the outcome the build has to produce, and what it must not break." },
    { title: "Product strategy", description: "Scope, sequence and success measures agreed before anything is designed." },
    { title: "UX research", description: "The journeys people actually need to complete, mapped before screens exist." },
    { title: "UI design", description: "Interfaces designed as a reusable system rather than screen by screen." },
    { title: "Development", description: "Built in short, reviewable increments, so progress is visible rather than reported." },
    { title: "Quality engineering", description: "Automated and manual testing through delivery, not a phase before launch." },
    { title: "Deployment", description: "A controlled release, monitored, with a rollback path that has been rehearsed." },
    { title: "Continuous improvement", description: "Staying on after launch — a team that already knows the system." },
  ],
  Marketing: [
    { title: "Discovery", description: "Understanding the buyer, the sales motion, and what a qualified lead is worth." },
    { title: "Audit", description: "Reviewing current presence, tracking and spend for what works and what doesn't." },
    { title: "Strategy", description: "A channel and message plan tied to pipeline rather than to impressions." },
    { title: "Execution", description: "Campaigns, content and technical fixes shipped in measurable increments." },
    { title: "Measurement", description: "Reporting built around decisions — what to keep funding, and what to stop." },
    { title: "Optimisation", description: "Continuous iteration against real performance, not a fixed annual plan." },
  ],
  Support: [
    { title: "Onboarding", description: "Learning the systems, the risks and the people — before taking anything over." },
    { title: "Stabilisation", description: "Clearing the immediate pain: recurring failures and undocumented steps." },
    { title: "Operations", description: "Run to an agreed standard, with a named team and a clear escalation path." },
    { title: "Improvement", description: "Reducing the cost and the risk of the thing being run, quarter over quarter." },
    { title: "Reporting", description: "One reporting line the business can read without a translation layer." },
  ],
};

/** Icons for the default "Why choose us" cards, keyed by differentiator title. */
const WHY_US_ICONS: Record<string, LucideIcon> = {
  "Business understanding first": Compass,
  "Strategic consulting": Lightbulb,
  "Multidisciplinary team": Users,
  Transparency: Gauge,
  "Engineering quality": ShieldCheck,
  "Long-term partnership": Handshake,
};

/** Rotation for cards whose content hasn't specified an icon. */
const ICON_CYCLE: LucideIcon[] = [
  Rocket,
  Layers,
  Workflow,
  ShieldCheck,
  BarChart3,
  Cloud,
  Users,
  Sparkles,
];

/* -------------------------------------------------------------------------- */
/*  Resolver                                                                   */
/* -------------------------------------------------------------------------- */

function toNarrative(...parts: (string | undefined)[]): string[] {
  return parts.filter((p): p is string => Boolean(p && p.trim()));
}

/**
 * The three "how this shows up in a business" cards. Where they haven't been
 * written, the plain-language `inPractice` lines stand in — each one's opening
 * clause becomes the card title, which is exactly how they were written.
 */
function understandingCards(service: ServiceWithSlug): Authored[] {
  if (service.understanding?.cards?.length) return service.understanding.cards;
  return (service.definition?.inPractice ?? []).slice(0, 3).map((p) => ({
    title: p.split(/[,—]/)[0].trim(),
    description: p,
  }));
}

/**
 * Builds the twelve sections for one service. Everything optional on `Service`
 * has a derivation here, so all fifteen services render the identical page the
 * day they are added — bespoke copy raises the quality, never the structure.
 */
export function resolveServicePage(
  service: ServiceWithSlug,
  stories: Story[],
): ServicePageContent {
  const phase = PHASES.find((p) => p.key === service.phase);

  /* 01 — Hero. The statement is the one line a non-technical visitor reads
     before deciding whether to scroll. */
  const hero = {
    eyebrow: phase?.label ?? "Services",
    statement: service.heroStatement ?? service.blurb,
    subtitle: service.summary,
    visual: service.heroVisual ?? ("orbit" as const),
    /* The second CTA. Most services send the reader to the primer with the
       same words; the few whose first step is genuinely different (find a use
       case, see where it fits) say so instead. */
    cta: service.heroCta ?? "How this works",
  };

  /* 02 — Understanding. The educational primer: what this is, before any
     mention of what's wrong. Falls back to the plain-language definition. */
  const understanding = {
    /* The authored headline where the blueprint wrote one ("What a web
       platform really is"), the derived one otherwise, so a service with no
       authored copy still gets a headline rather than an empty slot. */
    title: service.understanding?.title,
    narrative: service.understanding?.narrative?.length
      ? service.understanding.narrative
      : toNarrative(service.definition?.what, service.approach),
    shifts: service.understanding?.shifts ?? [],
    cards: understandingCards(service).map((c, i) => ({
      title: c.title,
      description: c.description,
      icon: icon(c.icon, ICON_CYCLE[i % ICON_CYCLE.length]),
    })),
  };

  /* 03 — Why businesses invest. The value case, stated as gains. Where it
     hasn't been written, the `whoFor` situations carry it — those are already
     framed as the reader's own circumstances rather than as a sales pitch. */
  /* Fallback chain, in descending order of quality: bespoke drivers, then the
     `whoFor` situations (already written as the reader's own circumstances),
     then the verified outcome statements as title-only cards. The last rung
     exists so the section can never vanish — a page that silently loses a
     chapter is not a design system. Where it is reached, section 05 drops its
     statement strip so the same three lines don't appear twice. */
  const valueSource: Authored[] =
    service.valueDrivers ??
    service.whoFor ??
    service.outcomes.map((o) => ({ title: o, description: "" }));
  const valueDrivers: IconCard[] = valueSource.map((v, i) => ({
    title: v.title,
    description: v.description,
    icon: icon(v.icon, ICON_CYCLE[i % ICON_CYCLE.length]),
  }));

  /* 04 — What we build. Large cards: purpose, value, typical features. */
  const whatWeBuild: BuildCard[] = service.whatWeBuild
    ? service.whatWeBuild.map((b, i) => ({
        title: b.title,
        purpose: b.purpose,
        value: b.value,
        features: b.features,
        icon: icon(b.icon, ICON_CYCLE[i % ICON_CYCLE.length]),
      }))
    : (service.capabilities ??
        service.deliverables.map((d) => ({ title: d, description: "" }))
      ).map((c, i) => ({
        title: c.title,
        purpose: c.description,
        value: "",
        features: [],
        icon: ICON_CYCLE[i % ICON_CYCLE.length],
      }));

  /* 05 — Business outcomes. The before → after table where pairs have been
     written; the verified outcome statements otherwise. */
  const derivedDrivers = !service.valueDrivers && !service.whoFor;
  const outcomes = {
    rows: service.howItHelps ?? [],
    statements: derivedDrivers ? [] : service.outcomes,
  };

  /* 06 — Capabilities, grouped, each item carrying the reason it matters where
     that has been written. */
  const capabilities: CapabilityGroup[] = (
    service.capabilityGroups ?? [
      { category: "What's included", items: service.deliverables },
    ]
  ).map((g) => ({
    category: g.category,
    icon: icon(g.category.split(/[ &]/)[0], FALLBACK_ICON),
    items: g.items.map((it) =>
      typeof it === "string" ? { name: it } : { name: it.name, why: it.why },
    ),
  }));

  /* 07 — Industries. The sector description comes from the industry catalog —
     the same copy the industry pages run on, so the two can never disagree —
     and the use case is the service's own, where it has been written.

     Only the `title` of each solution is used: the catalog carries a sentence
     of substance under it, and two full sentences would bury the use case that
     is the actual point of the card. */
  const industries = (service.industries ?? ALL_INDUSTRIES).map((entry) => {
    const name = typeof entry === "string" ? entry : entry.name;
    const detail = industryBySlug.get(slugify(name));
    return {
      name,
      description: detail
        ? detail.solutions
            .slice(0, 2)
            .map((solution) => solution.title)
            .join(" · ")
        : "",
      useCase: typeof entry === "string" ? undefined : entry.useCase,
    };
  });

  /* 08 — Process. Phase-appropriate by default. */
  const processSource: Authored[] =
    service.process ?? PROCESS_BY_PHASE[service.phase];
  const process: ProcessStep[] = processSource.map((step) => ({
    title: step.title,
    description: step.description,
    icon: icon(step.icon, PROCESS_ICONS[step.title] ?? Compass),
  }));

  /* 09 — Why choose us. The verified differentiators, business-first. */
  const whyUs: IconCard[] = (service.whyUs ?? differentiators).map((d, i) => ({
    title: d.title,
    description: d.description,
    icon: WHY_US_ICONS[d.title] ?? ICON_CYCLE[i % ICON_CYCLE.length],
  }));

  /* 10 — Technology ecosystem. The only section where technology leads. */
  const tech = {
    technologies: service.technologies,
    tools: service.tools,
  };

  return {
    hero,
    /* The mock the showcase runs. A device service gets the handset; anything
       else gets its own window mock, and a service that has not chosen one
       falls back to the browser window rather than a phone it doesn't build. */
    buildMock:
      service.buildMock ?? (service.heroVisual === "devices" ? "phone" : "browser"),
    closingLine: service.closingLine,
    /* Section 08 is company-level and shared. The only service-specific part is
       these five words — where a service has none, the scene falls back to the
       company set inside the component. */
    standoutPoints: service.standoutPoints ?? [],
    understanding,
    valueDrivers,
    whatWeBuild,
    outcomes,
    capabilities,
    industries,
    process,
    whyUs,
    tech,
    proof: stories,
  };
}
