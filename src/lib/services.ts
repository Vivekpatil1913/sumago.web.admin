/**
 * Single source of truth for every service Sumago offers (old + new, unified).
 *
 * All 15 services live here — name, icon, one-line blurb, and full detail
 * (problem, summary, approach, deliverables, outcomes, technologies). The legacy
 * `capabilities`, `capabilityMeta`, and `capabilityDetails` objects are DERIVED
 * from this list (see lib/site.ts and lib/content.ts) so routes and pages stay in
 * sync.
 *
 * Facts defer to COMPANY-PROFILE.md. Voice is outcome-first (see CLAUDE.md).
 * Copy is drafted pending review — no invented metrics.
 *
 * PROOF STATUS — read before adding claims:
 * Only 4 real stories exist (COMPANY-PROFILE.md), and they map to just 5
 * services via `stories` below. The other 10 services have NO verified proof:
 * no metrics, no ROI, no timelines, no attributed quotes. `hasProof` is derived
 * from `stories`. The service DETAIL pages surface a story where one exists and
 * a `[REAL PROOF NEEDED]` flag (outside production) where it doesn't, so the gap
 * stays actionable. The Solutions index deliberately shows neither — it hooks
 * with the problem and hands off to the detail page.
 * Do NOT fill those slots with invented outcomes. See docs/PROOF-GAPS.md.
 */
import { slugify } from "@/lib/utils";
import type { MockKind } from "@/components/organisms/solutions/service-page/build-mocks";

/**
 * Lifecycle phase — spans the verified "from consulting to long-term support"
 * framing (COMPANY-PROFILE.md) and groups the services into stages on the
 * Solutions page.
 */
export type Phase =
  | "Consulting"
  | "Designing"
  | "Building"
  | "Marketing"
  | "Support";

export const PHASES: { key: Phase; label: string; blurb: string }[] = [
  {
    key: "Consulting",
    label: "Consulting",
    blurb: "Understand the business before choosing any technology.",
  },
  {
    key: "Designing",
    label: "Designing",
    blurb: "Shape the architecture and the experience before anything gets built.",
  },
  {
    key: "Building",
    label: "Building",
    blurb: "Engineer it — typed, tested, and built to be maintained.",
  },
  {
    key: "Marketing",
    label: "Marketing",
    blurb: "Turn what's built into demand that can actually be measured.",
  },
  {
    key: "Support",
    label: "Resource Management & Outsourcing",
    blurb: "Stay on after launch — and add the people who keep it moving.",
  },
];

export type Service = {
  /** Display name (also the source of the URL slug). */
  name: string;
  /** lucide-react icon name — must exist in CAPABILITY_ICONS. */
  icon: string;
  /** Lifecycle phase this service sits in. */
  phase: Phase;
  /** One-line, outcome-first blurb for cards. */
  blurb: string;
  /**
   * The problem in the buyer's own words — the pain they arrive with, not a
   * description of the service. Leads every service view (docs/08: frame each
   * capability as a *problem solved*).
   */
  problem: string;
  /** 1–2 sentence summary for the detail hero. */
  summary: string;
  /** How Sumago approaches it. */
  approach: string;
  /**
   * Tangible artifacts an engagement produces. These describe Sumago's own
   * delivery output — NOT client results — so they carry no unverified metrics.
   */
  deliverables: string[];
  /** 3 outcomes a client can expect. */
  outcomes: string[];
  /** Representative technologies / methods. */
  technologies: string[];
  /**
   * The tools this service actually works in, resolved by `getToolIcons`
   * (lib/tool-icons.ts) — the same marks the home page "AI across the SDLC"
   * bands use, plus the engineering-stack brands in that file's `extraTools`
   * (Python, React, React Native, Flutter, Node.js, MongoDB, AWS, Azure).
   * An unknown title is silently dropped, so it must match a title exactly.
   */
  tools: string[];
  /**
   * Slugs from `impactStories` (lib/site.ts) that genuinely involved this
   * service. Only 3 services qualify — leave undefined rather than stretching a
   * story to fit. Drives the honest-proof slot on the detail page.
   */
  stories?: string[];
  /**
   * SEED CONTENT — who the service is for, in the decision-maker's own terms, so
   * an enterprise buyer (CEO/CTO/CIO/Founder) can self-identify within seconds.
   * Positioning copy only: no metrics, no unverified claims.
   *
   * Optional while the redesigned detail page is being rolled out service by
   * service — populated for `web-platform-engineering` first, then the rest.
   */
  whoFor?: { title: string; description: string }[];
  /**
   * SEED CONTENT — "what is this, actually?", answered in plain language for a
   * decision-maker who is not an engineer. The single biggest comprehension gap
   * on the old layout: it described *how it is approached* before ever saying
   * *what the thing is*.
   *
   * `notThis` matters as much as `what` — naming the thing it gets confused with
   * removes the misunderstanding that otherwise runs the whole rest of the page.
   */
  definition?: {
    /** 2–3 jargon-free sentences. No metrics, no claims. */
    what: string;
    /** Concrete "in practice this means…" lines — pictures, not categories. */
    inPractice: string[];
    /** The thing it is most often mistaken for, and why that isn't it. */
    notThis: string;
  };
  /**
   * SEED CONTENT — what Sumago actually does inside this service. Distinct from
   * `deliverables` (the artifacts handed over) and from `outcomes` (what changes
   * for the business): this is the scope of work itself, so a buyer can tell
   * whether the part they need is covered.
   */
  capabilities?: { title: string; description: string }[];
  /**
   * SEED CONTENT — the mechanism, as a before → after contrast. Drives section
   * 05, Business Outcomes, where it is set as a comparison table.
   */
  howItHelps?: { before: string; after: string }[];

  /* ---------------------------------------------------------------------- *
   *  SERVICE PAGE SECTIONS
   *
   *  Everything below is optional and drives one section of the standard
   *  service page. `lib/service-page.ts` derives an honest fallback for each
   *  from the fields above, so a service renders the identical twelve-section
   *  page whether or not any of this has been written yet — bespoke copy raises
   *  the density, never changes the structure.
   *
   *  The page is EDUCATE-FIRST: it never opens by naming the reader's problem.
   *  `understanding` explains; the problem appears in `valueDrivers` as the
   *  reason a gain matters. See docs/18.
   *
   *  Author in this order of value:
   *    heroStatement → understanding → valueDrivers → whatWeBuild → howItHelps
   *    → capabilityGroups → industries → process → whyUs
   * ---------------------------------------------------------------------- */

  /**
   * 01 · HERO — the one business-outcome line a non-technical visitor reads
   * before deciding whether to scroll. Not the service name, not a feature: the
   * change it makes. Falls back to `blurb`.
   */
  heroStatement?: string;
  /**
   * 01 · HERO ILLUSTRATION — which of the system's built illustrations the hero
   * carries. `orbit` (default) is the service glyph in concentric orbits;
   * `devices` is the floating phone-and-screen composition. Both are drawn in
   * CSS from the service's own icon — no stock art, ever (CLAUDE.md).
   */
  heroVisual?: "orbit" | "devices";
  /**
   * 01 · HERO — the second CTA's label. Most services send the reader down to
   * the primer with the same words; the few whose real first step is different
   * ("Find your first use case") say so. Falls back to "How this works".
   */
  heroCta?: string;
  /**
   * 04 · THE MOCK — which drawing section 04 runs beside the copy. This is the
   * ONLY thing that changes shape between two service pages: a handset for a
   * phone service, a browser window for a web platform, a ledger for a chain,
   * a pipeline for DevOps. See `service-page/build-mocks.tsx` for the set.
   *
   * Left out, a device service gets the handset and everything else gets the
   * browser window — never a phone for a service that doesn't build one.
   */
  buildMock?: MockKind;
  /**
   * 08 · WHY SUMAGO — the five short lines pinned around the globe. Company
   * claims phrased for this service, never metrics (COMPANY-PROFILE.md).
   * Exactly five; fewer are topped up from the company set.
   */
  standoutPoints?: string[];
  /**
   * 11 · CLOSE — the single line the page ends on, written as the reader's own
   * conclusion rather than a claim about Sumago.
   */
  closingLine?: string;
  /**
   * 02 · UNDERSTANDING — the educational primer. The page opens by teaching,
   * not by naming a problem: an enterprise reader who feels sold to in the
   * first screen stops reading, and one who learns something keeps going.
   *
   * `shifts` are the short "what changed" lines set as a strip above the cards;
   * `cards` are the three ways this service shows up in a business.
   * `narrative` falls back to `definition.what`, `cards` to `definition.inPractice`.
   */
  understanding?: {
    /**
     * The section headline. The blueprints open on the discipline itself
     * ("What a web platform really is"), which teaches faster than a title
     * assembled from the service's name — the derived one is the fallback.
     */
    title?: string;
    narrative: string[];
    shifts?: string[];
    cards: { title: string; description: string; icon?: string }[];
  };
  /**
   * 03 · WHY BUSINESSES INVEST — the value case, stated as gains rather than
   * pains. The problem still gets named here, but as the reason a value driver
   * matters, not as the page's opening move. Falls back to `whoFor`.
   */
  valueDrivers?: { title: string; description: string; icon?: string }[];
  /**
   * 04 · WHAT WE BUILD — the things a client can actually commission, as large
   * cards. Each answers three questions in the buyer's order: what it's for,
   * what it's worth, and what's typically in it. `icon` is a key into
   * CAPABILITY_GROUP_ICONS (lib/service-page.ts).
   *
   * Falls back to `capabilities`, then to `deliverables`.
   */
  whatWeBuild?: {
    title: string;
    purpose: string;
    value: string;
    features: string[];
    icon?: string;
  }[];
  /**
   * 06 · CAPABILITIES — the functional surface, grouped into categories the
   * business recognises. An item may be a bare name or a name with the reason
   * it matters; prefer the latter, since a capability list without a "why" is
   * a specification, and this page is not selling to engineers.
   *
   * `category` should match a key in CAPABILITY_GROUP_ICONS. Falls back to one
   * unlabelled group of `deliverables`.
   */
  capabilityGroups?: {
    category: string;
    items: (string | { name: string; why: string })[];
  }[];
  /**
   * 07 · INDUSTRIES — only where a service genuinely serves a narrower set than
   * the company does; otherwise every sector in COMPANY-PROFILE.md is shown.
   * A bare name uses the sector's own published description; the object form
   * adds the concrete use case for *this* service in *that* sector.
   */
  industries?: (string | { name: string; useCase: string })[];
  /**
   * 08 · OUR PROCESS — only where the engagement genuinely differs from the
   * default for its lifecycle phase (lib/service-page.ts). `icon` is a key into
   * PROCESS_ICONS.
   */
  process?: { title: string; description: string; icon?: string }[];
  /**
   * 09 · WHY CHOOSE US — only where a service can say something sharper than
   * the company-wide differentiators. Never generic; if it isn't sharper than
   * the default, leave it out.
   */
  whyUs?: { title: string; description: string }[];
};

/** The 15 services, in canonical order. Slugs are derived from `name`. */
const RAW: Service[] = [
  {
    name: "Web Platform Engineering",
    heroStatement: "Grow without your website becoming the bottleneck.",
    heroCta: "See how it works",
    buildMock: "browser",
    icon: "Globe",
    phase: "Building",
    blurb: "High-performance web platforms engineered to scale with the business.",
    problem:
      "Traffic and features grew, and the site that launched fine two years ago now buckles — pages crawl, visitors leave, and every change comes back quoted as a rebuild.",
    summary:
      "Building fast, secure, and scalable web platforms that hold up as traffic, teams, and features grow.",
    approach:
      "Performance-first front-end engineering on a clean, typed architecture — built to be maintained, not rebuilt.",
    deliverables: [
      "A performance budget and Core Web Vitals baseline",
      "A typed, component-driven codebase your team can extend",
      "A CMS your marketing team can actually run",
      "Deployment pipeline with a safe rollback path",
    ],
    outcomes: ["Faster load and better SEO", "Scales without re-platforming", "Lower maintenance cost"],
    technologies: ["Next.js / React", "TypeScript", "Headless CMS", "Edge / CDN"],
    tools: ["React", "Node.js", "Vercel", "GitHub", "Docker"],
    whoFor: [
      {
        title: "The platform is buckling under its own success",
        description:
          "Traffic and features outgrew the original build. Pages crawl, the codebase resists change, and every request comes back scoped as a rebuild.",
      },
      {
        title: "Performance is costing measurable revenue",
        description:
          "Slow pages are pushing visitors away and holding search rankings down — and nobody can point to which part of the stack is responsible.",
      },
      {
        title: "The team is blocked by the codebase",
        description:
          "Shipping is slow because the architecture makes every change risky. Marketing waits on engineering for edits that should never reach a developer.",
      },
      {
        title: "A rebuild has to be the last one",
        description:
          "You're prepared to re-platform once — provided what replaces it can be extended by your own team instead of re-bought in two years.",
      },
    ],
    definition: {
      what:
        "Web platform engineering is the work of building the website or web application a business actually runs on — the pages customers see, the systems behind them, and the codebase and deployment process a team will live with for years. It treats the site as a platform to be extended, not a project that gets delivered and then quietly decays.",
      inPractice: [
        "Pages that render fast on a mid-range phone on an ordinary connection — not only on the developer's laptop.",
        "A codebase organised into typed, reusable components, so the next feature is an addition rather than a negotiation.",
        "A CMS where marketing publishes a page on Tuesday without an engineer being involved.",
        "A deployment that ships a change in minutes and can put the previous version back just as fast.",
      ],
      notThis:
        "It isn't a redesign. New visuals on the same fragile foundation buy a quarter of goodwill and leave every underlying constraint exactly where it was.",
    },
    capabilities: [
      {
        title: "Front-end architecture",
        description:
          "A typed, component-driven front end where shared interface is built once and every page inherits it.",
      },
      {
        title: "Performance engineering",
        description:
          "Core Web Vitals treated as a budget with a number attached — enforced during the build, not measured after launch.",
      },
      {
        title: "Content management",
        description:
          "A headless CMS modelled around how the team actually writes, so publishing stops routing through engineering.",
      },
      {
        title: "Backend & integration",
        description:
          "The APIs, search, payments, and internal systems the platform depends on, connected deliberately rather than accumulated.",
      },
      {
        title: "Infrastructure & deployment",
        description:
          "Edge delivery, caching, CI/CD, and a rollback path — so shipping on a Friday isn't a risk anyone has to weigh.",
      },
      {
        title: "Accessibility & technical SEO",
        description:
          "Semantic, accessible markup and crawlable structure built into the components, instead of retrofitted later as a fix list.",
      },
    ],
    howItHelps: [
      {
        before: "Every change comes back quoted as a rebuild, because nobody can predict what it will break.",
        after: "Changes get scoped in days, because the architecture makes the blast radius obvious.",
      },
      {
        before: "Marketing files a ticket to change a headline, then waits for the next release.",
        after: "Marketing publishes it, and engineering never sees it.",
      },
      {
        before: "The site is slow, and the cause is somewhere between the images, the CDN, and the code.",
        after: "Performance has a budget, an owner, and a number that fails the build when it slips.",
      },
      {
        before: "The platform was already re-bought once, and it's the constraint again.",
        after: "The platform is one your own team extends — so the next three years are additions, not another migration.",
      },
    ],
    understanding: {
      title: "What a web platform really is.",
      narrative: [
        "A web platform is the system a business runs its public face on — the pages customers see, the services behind them, and the process by which anything on it changes. It is infrastructure, not a brochure.",
        "The distinction matters commercially. A brochure is finished when it launches. A platform is judged by how cheaply it can be changed for the next three years, because that is where almost all of its cost lives.",
      ],
      shifts: [
        "A website used to be a launch. It is now a system that changes weekly.",
        "Speed stopped being a technical metric and became a revenue one.",
        "Publishing moved from engineering to the teams who own the message.",
        "The real cost is not the build. It is every change after it.",
      ],
      cards: [
        {
          title: "Fast as a budget, not a hope",
          description:
            "Performance targets set as numbers and enforced while the site is being built, so speed doesn't decay the first time someone adds a script.",
          icon: "efficiency",
        },
        {
          title: "Editable without a ticket",
          description:
            "A content model shaped around how your team actually writes, so publishing stops routing through engineering.",
          icon: "productivity",
        },
        {
          title: "Built to be handed over",
          description:
            "Typed, component-driven architecture, documented and transferred — so your developers can take it forward without us.",
          icon: "engineering",
        },
      ],
    },
    capabilityGroups: [
      {
        category: "Experience & interface",
        items: [
          "Design system and component library",
          "Layouts designed per breakpoint, not scaled down",
          "Accessibility to WCAG standards",
          "Multi-language and regional variants",
        ],
      },
      {
        category: "Platform",
        items: [
          "Headless CMS modelling and setup",
          "Editor workflows with live preview",
          "Search, forms and lead capture",
          "Role-based publishing permissions",
        ],
      },
      {
        category: "Engineering",
        items: [
          "Typed component architecture",
          "API and third-party integrations",
          "Rendering strategy per page type",
          "Automated test coverage",
        ],
      },
      {
        category: "Infrastructure",
        items: [
          "Edge delivery and caching",
          "CI/CD with a rehearsed rollback",
          "Preview environments per change",
          "Uptime and error monitoring",
        ],
      },
      {
        category: "Analytics",
        items: [
          "Core Web Vitals monitoring",
          "Conversion and event tracking",
          "Technical SEO instrumentation",
          "Reporting non-technical teams can read",
        ],
      },
      {
        category: "Security & compliance",
        items: [
          "Dependency and vulnerability scanning",
          "Secure headers and access control",
          "Consent and privacy compliance",
          "Backup and recovery",
        ],
      },
    ],
    valueDrivers: [
      {
        title: "Speed that shows up in revenue",
        icon: "efficiency",
        description:
          "Faster pages hold visitors and lift search rankings, and the gain is measured rather than assumed — a budget with a number on it, not a hope.",
      },
      {
        title: "Change scoped in days, not rebuilds",
        icon: "engineering",
        description:
          "A clean architecture makes the blast radius of any change obvious, so a request comes back with a scope instead of a quote for starting again.",
      },
      {
        title: "Publishing without engineering",
        icon: "productivity",
        description:
          "Marketing ships a page on Tuesday and a developer never sees it, because the content model was shaped around how the team actually writes.",
      },
      {
        title: "One rebuild, not another migration",
        icon: "platform",
        description:
          "A platform your own team extends, so the next three years are additions to what exists rather than a second re-platforming project.",
      },
    ],
    whatWeBuild: [
      {
        title: "Front-end architecture",
        icon: "interface",
        purpose:
          "A typed, component-driven front end where shared interface is built once and every page inherits it — so the next feature is an addition rather than a negotiation with the last one.",
        value: "The next feature starts from proven parts instead of a blank page.",
        features: [
          "Design system",
          "Reusable components",
          "Typed codebase",
          "Per-breakpoint layouts",
          "Documented handover",
        ],
      },
      {
        title: "Performance engineering",
        icon: "efficiency",
        purpose:
          "Core Web Vitals treated as a budget with a number attached, enforced during the build rather than measured after launch — so speed holds up on a mid-range phone on an ordinary connection, not only on a developer's laptop.",
        value: "Speed becomes a gate the build has to pass, not a report after the fact.",
        features: [
          "Performance budget",
          "Core Web Vitals",
          "Image & asset strategy",
          "Rendering per page type",
          "Load monitoring",
        ],
      },
      {
        title: "Content management",
        icon: "platform",
        purpose:
          "A headless CMS modelled around how the team actually writes, with live preview and editor workflows — so publishing stops routing through engineering and the message stays owned by the people who write it.",
        value: "The team that owns the message owns the publish button.",
        features: [
          "Headless CMS",
          "Editor workflows",
          "Live preview",
          "Role-based publishing",
          "Structured content model",
        ],
      },
      {
        title: "Backend & integration",
        icon: "integrations",
        purpose:
          "The APIs, search, payments, and internal systems the platform depends on, connected deliberately rather than accumulated — one system of record, not several that disagree.",
        value: "One record the platform and the business both read the same way.",
        features: [
          "API engineering",
          "Search",
          "Payments",
          "System integrations",
          "Forms & lead capture",
        ],
      },
      {
        title: "Infrastructure & deployment",
        icon: "infrastructure",
        purpose:
          "Edge delivery, caching, CI/CD, and a rehearsed rollback path — so shipping on a Friday isn't a risk anyone has to weigh, and the previous version can be back in minutes.",
        value: "Releasing becomes a decision rather than an event.",
        features: [
          "Edge & CDN",
          "CI/CD",
          "Preview per change",
          "Rehearsed rollback",
          "Uptime & error monitoring",
        ],
      },
      {
        title: "Accessibility & technical SEO",
        icon: "compliance",
        purpose:
          "Semantic, accessible markup and crawlable structure built into the components, rather than retrofitted later as a fix list — so compliance and discoverability come with the build.",
        value: "Compliance and discoverability arrive with the build, not after it.",
        features: [
          "WCAG accessibility",
          "Semantic markup",
          "Technical SEO",
          "Structured data",
          "Multi-language variants",
        ],
      },
    ],
    industries: [
      {
        name: "Retail & E-commerce",
        useCase:
          "A storefront that stays fast through traffic spikes, with checkout and merchandising the marketing team can run.",
      },
      {
        name: "Professional Services",
        useCase:
          "High-volume content and publishing where editors work continuously and page speed drives the enquiries that follow.",
      },
      {
        name: "Banking & Financial Services",
        useCase:
          "Secure, accessible, compliant web platforms where uptime and audit trails are not optional.",
      },
      {
        name: "Healthcare",
        useCase:
          "Accessible, procurement-ready sites built to WCAG standards from the first component.",
      },
      {
        name: "Government & Public Sector",
        useCase:
          "Citizen-facing services built to accessibility and procurement standards, and published without a developer.",
      },
      {
        name: "Manufacturing",
        useCase:
          "Product catalogues, dealer portals, and lead capture connected to the systems of record behind them.",
      },
    ],
    process: [
      {
        title: "Discovery",
        description:
          "What the platform has to change commercially, and where the current one actually hurts.",
        icon: "discovery",
      },
      {
        title: "Architecture",
        description:
          "The rendering strategy, component model, and stack chosen for year three, not only launch.",
        icon: "engineering",
      },
      {
        title: "Content modelling",
        description:
          "The CMS shaped around how the team writes, so publishing never routes back through engineering.",
        icon: "platform",
      },
      {
        title: "Design system",
        description:
          "Shared interface built once, per breakpoint, and reviewed on real devices.",
        icon: "interface",
      },
      {
        title: "Build",
        description:
          "Short, reviewable increments against a performance budget that fails the build when it slips.",
        icon: "delivery",
      },
      {
        title: "Quality & accessibility",
        description:
          "Automated tests and WCAG checks run through delivery, not bolted on at the end.",
        icon: "quality",
      },
      {
        title: "Deployment",
        description:
          "Edge delivery, CI/CD, and a rollback path rehearsed before the first real release.",
        icon: "infrastructure",
      },
      {
        title: "Handover & iteration",
        description:
          "Documented, transferred to your team, and improved by the people who built it.",
        icon: "partnership",
      },
    ],
    standoutPoints: [
      "Performance as a gate",
      "Certified engineering",
      "Built to hand over",
      "Accessible by default",
      "Scales without re-platforming",
    ],
    closingLine:
      "A platform is not judged the day it launches. It is judged by how cheaply you can change it for the next three years.",
  },
  {
    name: "Mobile App Engineering",
    heroStatement: "An app your customers keep, on every phone they own.",
    /* The reference build for the whole system — the handset in section 04 is
       the mock every other service's was designed against. */
    buildMock: "phone",
    icon: "Smartphone",
    phase: "Building",
    blurb: "Native-quality mobile apps people actually keep on their home screen.",
    problem:
      "The app keeps slipping, feels second-rate next to the competition, and building it twice for iOS and Android doubles the cost of every single fix.",
    summary:
      "Crafting reliable, consumer-grade mobile apps across iOS and Android from a single, efficient codebase.",
    approach:
      "UX-led design paired with cross-platform engineering — reach without doubling the build.",
    deliverables: [
      "Store-ready iOS and Android builds from one codebase",
      "Release and versioning pipeline",
      "Crash reporting and engagement analytics wired in",
      "A design system the app can grow into",
    ],
    outcomes: ["Cross-platform reach", "Higher engagement & retention", "Faster time-to-market"],
    technologies: ["Cross-platform", "Native iOS", "Native Android", "Backend & APIs", "Cloud & hosting", "App analytics"],
    tools: [
      "Flutter",
      "React Native",
      "Swift",
      "Kotlin",
      "Node.js",
      ".NET",
      "Laravel",
      "Firebase",
      "AWS",
      "Azure",
      "Google Cloud",
      "Figma",
    ],
    stories: ["mahindra-rise-app-launch"],
    whoFor: [
      {
        title: "Every fix has to be built twice",
        description:
          "Separate iOS and Android teams means two backlogs, two release cycles, and a feature that lands on one platform months before the other.",
      },
      {
        title: "The app feels second-rate next to the competition",
        description:
          "It works, but it doesn't feel considered — and users compare it to the best app on their phone, not to your last release.",
      },
      {
        title: "The release date keeps moving",
        description:
          "Store submissions, device fragmentation, and manual QA turn every launch into an event nobody can schedule around with confidence.",
      },
      {
        title: "Nobody can say why users leave",
        description:
          "Installs look fine, retention doesn't — and with no crash reporting or analytics wired in, the reasons are guesswork.",
      },
    ],
    definition: {
      what:
        "Mobile app engineering is everything it takes to put a working application on a phone and keep it there — the screens people touch, the services running behind them, and the release process that gets each update onto iOS and Android safely. It covers the whole life of the app, not just the first build.",
      inPractice: [
        "One codebase compiled into two store-ready apps, so a fix written once reaches iPhone and Android in the same release.",
        "The interface people touch and the sign-in, data sync, and offline behaviour behind it, designed as one system rather than bolted together.",
        "A signed build in the testers' hands on a schedule, and a store submission that isn't a checklist someone has to remember.",
        "Crash reporting and product analytics wired in from the first release, so 'why are users leaving' has an answer instead of a theory.",
      ],
      notThis:
        "It isn't a mobile-friendly website. A page in a phone browser can't use the camera, work offline, send a push notification, or sit on someone's home screen — which is usually the entire reason an app is on the table.",
    },
    capabilities: [
      {
        title: "Cross-platform app development",
        description:
          "iOS and Android built from a single React Native or Flutter codebase, so one team ships both stores and one fix lands in both apps.",
      },
      {
        title: "Product & interface design",
        description:
          "Screens designed before they're built, as a reusable system rather than one-off layouts the next feature has to argue with.",
      },
      {
        title: "Backend & API engineering",
        description:
          "Authentication, data sync, notifications, and the services the app depends on — built alongside it rather than assumed.",
      },
      {
        title: "Release & store operations",
        description:
          "Signed builds, versioning, beta distribution, and store submission run as a pipeline, so a release becomes a decision rather than an event.",
      },
      {
        title: "Analytics & crash monitoring",
        description:
          "Instrumentation from the first release, so retention, crashes, and drop-off are observable instead of debated.",
      },
      {
        title: "Post-launch support & iteration",
        description:
          "OS updates, new devices, and the next set of features handled by a team that already knows the codebase.",
      },
    ],
    howItHelps: [
      { before: "A process that runs on paper forms and phone calls.", after: "A digital workflow that records itself as the work happens." },
      { before: "Customers calling to ask where their order is.", after: "Self-service in the app, and a support line that only handles exceptions." },
      { before: "Forms filled on site and re-keyed at a desk hours later.", after: "Captured once at the point of work, even with no signal." },
      { before: "Updates that reach the business a day late, by email.", after: "Real-time visibility for everyone who needs it." },
      { before: "Two platform teams, two backlogs, two release cycles.", after: "One codebase reaching both app stores in the same release." },
      { before: "No reliable answer to why users stop coming back.", after: "Retention and drop-off visible from the first release." },
    ],
    heroVisual: "devices",
    understanding: {
      narrative: [
        "A mobile app is a channel a business owns outright. It sits on a device people carry everywhere, it works whether or not they think to visit a website, and it is the only place a company can reach a customer or a colleague directly, with permission, in the moment that matters.",
        "For most organisations it stops being a product and becomes infrastructure \u2014 the way orders are placed, the way work is dispatched, the way a service is actually delivered. Which is why the decision is rarely about an app at all. It is about which part of the business is moving onto the device.",
      ],
      shifts: [
        "Apps stopped being products and became operating channels.",
        "Customers moved from calling to serving themselves.",
        "Field and frontline work moved off paper and onto devices.",
        "The phone became a revenue line, not a marketing cost.",
      ],
      cards: [
        {
          title: "Customer applications",
          icon: "customers",
          description:
            "The apps your market uses \u2014 ordering, booking, banking, tracking, support. They deepen a relationship you already have, through a channel no platform sits in the middle of.",
        },
        {
          title: "Business applications",
          icon: "business",
          description:
            "The apps your operation runs on \u2014 dispatch, inspection, approvals, stock. They replace paper and phone calls with a process that records itself as it happens.",
        },
        {
          title: "Enterprise mobility",
          icon: "mobility",
          description:
            "The apps your workforce carries \u2014 secure access to systems, data and approvals from wherever the work is, under the same controls IT applies to everything else.",
        },
      ],
    },
    valueDrivers: [
      {
        title: "Customer engagement",
        icon: "engagement",
        description:
          "A direct, permissioned channel to the people who buy from you \u2014 one that reaches them in the moment rather than waiting for them to remember your website exists.",
      },
      {
        title: "Operational efficiency",
        icon: "efficiency",
        description:
          "Work that travelled by phone call, paper form and re-keying becomes a single flow that records itself, so the cost of every transaction falls rather than the headcount rising.",
      },
      {
        title: "Employee productivity",
        icon: "productivity",
        description:
          "Frontline and field teams get what they need where the work happens, instead of returning to a desk to type up what they already did once.",
      },
      {
        title: "Business growth",
        icon: "growth",
        description:
          "New services, new territories and new revenue models become possible once distribution stops depending on physical presence or a browser session.",
      },
      {
        title: "Digital transformation",
        icon: "transformation",
        description:
          "Mobile is usually where transformation becomes visible \u2014 the first place a legacy process gets re-designed rather than digitised exactly as it was.",
      },
    ],
    whatWeBuild: [
      {
        title: "Customer apps",
        icon: "customers",
        purpose:
          "The app your market lives in to buy, book, track and get help \u2014 a channel you own outright, reaching people on the device they never put down instead of waiting for them to remember your website.",
        value: "A direct channel that lowers cost to serve while raising repeat business.",
        features: ["Accounts and profiles", "Ordering and booking", "Order tracking", "In-app support", "Ratings and reviews", "Loyalty and rewards"],
      },
      {
        title: "Enterprise apps",
        icon: "business",
        purpose:
          "Internal apps that move core processes \u2014 approvals, records, dispatch \u2014 out of the back office and into the hands of the people doing the work, so a task is finished where it happens instead of queued for a desk.",
        value: "Fewer handoffs, fewer errors, and a process that reports on itself.",
        features: ["Role-based access", "Approval workflows", "Offline capture", "Single sign-on", "Audit trail", "Real-time dashboards"],
      },
      {
        title: "E-commerce apps",
        icon: "retail",
        purpose:
          "A storefront built for the device from the ground up \u2014 fast browsing, a checkout tuned for thumbs, and merchandising that reaches shoppers through push rather than waiting for them to come back.",
        value: "A repeat-purchase channel you own outright, with no marketplace commission.",
        features: ["Catalogue and search", "Cart and checkout", "Payments and wallets", "Promotions", "Delivery tracking", "Wishlists and reorder"],
      },
      {
        title: "Healthcare apps",
        icon: "health",
        purpose:
          "Patient- and clinician-facing apps for appointments, records, adherence and remote care \u2014 built to keep sensitive data protected and to lift routine load off clinical staff rather than add to it.",
        value: "Fewer missed appointments, and less administrative load on clinical staff.",
        features: ["Appointment booking", "Secure messaging", "Records access", "Reminders", "Consent capture", "Teleconsultation"],
      },
      {
        title: "Banking and finance apps",
        icon: "banking",
        purpose:
          "Applications where money moves and trust is the product \u2014 self-service that takes pressure off branches and call centres while every action stays authenticated, auditable and inside regulatory control.",
        value: "Self-service that takes load off branches and call centres without weakening control.",
        features: ["Strong authentication", "Transactions and statements", "Payments", "Fraud controls", "Regulatory audit trail", "Card management"],
      },
      {
        title: "Logistics and fleet apps",
        icon: "logistics",
        purpose:
          "Apps for the people moving goods and the control rooms tracking them \u2014 turning phone-call updates into live visibility, so exceptions surface while there is still time to fix them.",
        value: "Real-time visibility replaces phone calls, and exceptions surface while they can still be fixed.",
        features: ["Live tracking", "Proof of delivery", "Job assignment", "Offline capture", "Exception alerts", "Route optimisation"],
      },
      {
        title: "Field service apps",
        icon: "field",
        purpose:
          "The app an engineer, inspector or agent carries to the site \u2014 capturing the job once, where it happens, so nothing is re-keyed at a desk hours later and the record is complete before they leave.",
        value: "Work gets recorded once, where it happens, instead of twice \u2014 on paper and again at a desk.",
        features: ["Job scheduling", "Checklists and inspections", "Photo and signature capture", "Offline sync", "Asset history", "Parts and inventory"],
      },
      {
        title: "IoT and connected-product apps",
        icon: "iot",
        purpose:
          "The app that pairs with a device, appliance or vehicle and turns it into a controllable, connected product \u2014 giving a physical thing a service relationship, and the customer a reason to stay engaged with it.",
        value: "A physical product gains a service relationship \u2014 and a reason to stay connected.",
        features: ["Device pairing", "Live telemetry", "Remote control", "Firmware updates", "Usage insights", "Alerts and automation"],
      },
      {
        title: "Companion apps",
        icon: "companion",
        purpose:
          "A focused app that extends an existing platform to the phone for the moments that genuinely need a device \u2014 deliberately not a second version of everything, so it stays fast, simple and worth opening.",
        value: "The moments that genuinely need a device get one; the rest stays where it already works.",
        features: ["Single-purpose flows", "Push notifications", "Biometric sign-in", "Deep links", "Shared identity", "Quick actions and widgets"],
      },
    ],
    capabilityGroups: [
      {
        category: "Customer experience",
        items: [
          { name: "Onboarding and sign-in", why: "Most abandonment happens before a user reaches any value, which makes the first two screens the highest-leverage part of the product." },
          { name: "Accessibility to WCAG standards", why: "Public-sector procurement frequently requires it, and it widens the addressable audience at almost no cost when built in rather than retrofitted." },
        ],
      },
      {
        category: "Automation",
        items: [
          { name: "Approval and task workflows", why: "Approvals are where processes stall; moving them to the device removes the waiting without removing the control." },
          { name: "Digital forms and checklists", why: "Capturing once, at the point of work, removes the re-keying step most data errors originate from." },
        ],
      },
      {
        category: "Security",
        items: [
          { name: "Authentication and session control", why: "An app on a lost phone must not become an open door into the business." },
          { name: "Encrypted storage and transport", why: "Data on a device sits outside your network, so it has to be protected as though the device is already compromised." },
        ],
      },
      {
        category: "Payments",
        items: [
          { name: "In-app payments and wallets", why: "Every extra step at checkout costs conversion, and native payment sheets remove most of them." },
          { name: "Subscriptions and store billing", why: "Recurring revenue carries platform rules, and getting them wrong risks the listing itself, not just the revenue." },
        ],
      },
      {
        category: "Location",
        items: [
          { name: "Live tracking and geofencing", why: "Knowing where something is turns a support call into a notification nobody has to make." },
          { name: "Maps and route optimisation", why: "In field and delivery work the route is the cost, and small improvements compound across a fleet." },
        ],
      },
      {
        category: "Notifications",
        items: [
          { name: "Push and in-app messaging", why: "It is the only channel that reaches a customer without them choosing to come to you \u2014 which is exactly why it has to be used sparingly." },
          { name: "Preference and consent management", why: "Permission is an asset, and losing it to over-messaging is usually permanent." },
        ],
      },
      {
        category: "Offline",
        items: [
          { name: "Offline-first data capture", why: "Basements, warehouses and rural routes have no signal, and the work still has to be recorded." },
          { name: "Conflict-safe synchronisation", why: "Two people editing the same record offline must not silently overwrite one another." },
        ],
      },
      {
        category: "Analytics",
        items: [
          { name: "Funnel and retention tracking", why: "Without it, why users leave gets answered with opinion \u2014 which is how roadmaps end up spent on the wrong thing." },
          { name: "Crash and release-health monitoring", why: "A crash you learn about from a store review has already cost you the user who reported it, and the ones who did not." },
        ],
      },
      {
        category: "Integrations",
        items: [
          { name: "ERP, CRM and core-system connections", why: "An app disconnected from the systems of record just creates one more place for the data to disagree." },
          { name: "Third-party service connections", why: "Payments, maps, identity and messaging are rarely worth building \u2014 but they are always worth integrating carefully." },
        ],
      },
    ],
    industries: [
      { name: "Healthcare", useCase: "Patient appointment booking, secure record access and reminders that reduce missed visits." },
      { name: "Logistics & Transportation", useCase: "Driver apps with proof of delivery, live tracking and exception alerts for the control room." },
      { name: "Retail & E-commerce", useCase: "A storefront and loyalty app with checkout, tracking and offers that do not depend on a marketplace." },
      { name: "Manufacturing", useCase: "Inspection, maintenance and downtime reporting captured at the machine rather than back at a desk." },
      { name: "Banking & Financial Services", useCase: "Self-service banking with strong authentication, payments and a complete audit trail." },
      { name: "Education", useCase: "Learning, attendance and parent-communication apps that work on low-cost devices and patchy networks." },
      { name: "Government & Public Sector", useCase: "Citizen-facing services and field inspection apps built to accessibility and procurement standards." },
      { name: "Real Estate", useCase: "Listing, site-visit and tenant-service apps that keep agents productive away from the office." },
      { name: "Hospitality & Tourism", useCase: "Booking, check-in and on-property service apps that take queues off the front desk." },
    ],
    process: [
      { title: "Business discovery", description: "Understanding what the app has to change commercially, before anyone discusses features." },
      { title: "Product strategy", description: "Scope, sequence and success measures agreed \u2014 including what deliberately is not in version one." },
      { title: "UX research", description: "The journeys people actually need to complete, mapped with the people who will use them." },
      { title: "UI design", description: "Interfaces designed as a reusable system and reviewed on real devices, not in a slide." },
      { title: "Development", description: "Built in short, reviewable increments, so progress is something you can hold rather than read about." },
      { title: "Quality engineering", description: "Automated and on-device testing through delivery, across the handsets your users actually own." },
      { title: "Deployment", description: "Store submission, phased rollout and monitoring, with a rollback path that has been rehearsed." },
      { title: "Continuous improvement", description: "Release health, retention and feedback feeding the next iteration, by a team that already knows the code." },
    ],
    whyUs: [
      { title: "Business-first thinking", description: "Every engagement starts from the commercial outcome, not the feature list. If an app is not the right answer, that gets said early." },
      { title: "Enterprise-grade engineering", description: "Typed, tested and documented delivery under independently certified process \u2014 ISO 9001:2015 and CMMI Level 5." },
      { title: "Scalable architecture", description: "Built for the load expected in year three, not only the load present at launch." },
      { title: "Human-centred design", description: "Research before screens, and interfaces designed for the conditions people genuinely use them in." },
      { title: "Security by design", description: "Authentication, storage and data handling treated as part of the build rather than a review before launch." },
      { title: "Agile delivery", description: "Short increments, visible progress, and a point in every cycle where direction can change without penalty." },
      { title: "Cross-industry experience", description: "Thirteen years across logistics, manufacturing, healthcare, public sector and financial services." },
      { title: "Long-term partnership", description: "Support and improvement long after delivery, from the team that built it." },
    ],
  },
  {
    name: "Digital Growth & Marketing",
    heroStatement: "Find out which half of the marketing budget is working.",
    heroCta: "See how it works",
    buildMock: "analytics",
    icon: "Megaphone",
    phase: "Marketing",
    blurb: "Technology-led growth — turning digital presence into measurable pipeline.",
    problem:
      "Spend goes out, traffic comes in, and nobody can say which half worked — the reporting explains last quarter instead of guiding the next decision.",
    summary:
      "Technology-led growth that ties every rupee of spend to pipeline — analytics and SEO built on a fast, well-instrumented platform, so the reporting guides the next decision instead of explaining the last quarter.",
    approach:
      "Analytics-driven campaigns and SEO built on a fast, well-instrumented platform.",
    deliverables: [
      "Analytics and conversion tracking, properly instrumented",
      "Technical SEO audit with a prioritized fix plan",
      "A channel and campaign roadmap",
      "Reporting tied to pipeline, not vanity metrics",
    ],
    outcomes: ["Higher qualified traffic", "Better conversion", "Measurable ROI"],
    technologies: ["SEO", "Analytics", "Marketing automation", "Performance tracking"],
    tools: ["Google Analytics", "Google Ads", "HubSpot", "Semrush", "MailChimp", "Meta"],
    understanding: {
      title: "What digital growth means when it's built on evidence.",
      narrative: [
        "Marketing works when the plumbing underneath it does. Traffic arrives, forms submit, and events fire into an analytics layer that stitches a visitor's path from first click to closed deal. Without that instrumentation, spend goes out and numbers come back, but nobody can trace which channel, campaign, or page actually moved the business.",
        "Growth is an engineering problem before it is a creative one. A slow page loses the visitor a good ad paid for; a broken tracking tag loses the data a good decision depends on. Getting the platform, the measurement, and the channels working as one system is what turns a marketing budget into a forecastable pipeline.",
      ],
      shifts: [
        "Reporting moves from explaining last quarter to guiding the next decision.",
        "Spend is judged on pipeline, not on clicks and impressions.",
        "Channels stop being separate silos and share one measurement model.",
        "SEO becomes a platform property — speed and structure — not a monthly add-on.",
      ],
      cards: [
        {
          title: "Get found",
          icon: "growth",
          description:
            "Technical SEO and content that earn qualified organic traffic — reach that keeps arriving without a media budget behind it.",
        },
        {
          title: "Convert what you have",
          icon: "efficiency",
          description:
            "Instrumentation and testing that lift the traffic already arriving, so a gain comes from the visitors you've already paid for.",
        },
        {
          title: "Grow paid deliberately",
          icon: "analytics",
          description:
            "Campaigns run against return rather than a spend target, scaled on what the data proves and cut where it doesn't.",
        },
      ],
    },
    valueDrivers: [
      {
        title: "Every rupee is accountable",
        icon: "analytics",
        description:
          "Spend traced to the pipeline it produced rather than to vanity metrics, so the budget conversation starts from evidence.",
      },
      {
        title: "Qualified traffic, not just traffic",
        icon: "customers",
        description:
          "Audiences that convert, found on purpose — the people already looking for what the business sells, reached where they look.",
      },
      {
        title: "Compounding organic reach",
        icon: "growth",
        description:
          "SEO that keeps returning long after a campaign ends, because it was built into a fast, well-structured platform rather than rented monthly.",
      },
      {
        title: "Decisions on evidence",
        icon: "discovery",
        description:
          "Reporting that tells you what to do next instead of only what happened, because the measurement model was designed before the spend.",
      },
    ],
    whatWeBuild: [
      {
        title: "Analytics & conversion tracking",
        icon: "analytics",
        purpose:
          "Every meaningful action — a visit, a form, a signup, a sale — captured, attributed, and stitched into one path from first touch to revenue. The dashboard stops guessing where results come from and starts showing it.",
        value: "The path from first click to closed deal, traceable end to end.",
        features: [
          "Event tracking",
          "Attribution model",
          "Goal & funnel setup",
          "Consent-safe tagging",
          "Pipeline reporting",
        ],
      },
      {
        title: "Technical SEO",
        icon: "engineering",
        purpose:
          "The structural work search engines reward — fast pages, clean markup, crawlable architecture, and fixed errors — delivered as a prioritised plan rather than a checklist. Organic visibility built into the platform, not bolted on monthly.",
        value: "Visibility that comes from how the platform is built.",
        features: [
          "Site audit",
          "Core Web Vitals",
          "Structured data",
          "Indexing & sitemaps",
          "Prioritised fix plan",
        ],
      },
      {
        title: "Content & organic growth",
        icon: "growth",
        purpose:
          "Content mapped to what your buyers actually search, structured so it ranks and answers the question at the same time. Reach that compounds — traffic that keeps arriving without a media budget behind it.",
        value: "Reach that keeps returning after the campaign stops.",
        features: [
          "Keyword strategy",
          "Content mapping",
          "On-page optimisation",
          "Internal linking",
          "Topic authority",
        ],
      },
      {
        title: "Paid campaigns",
        icon: "management",
        purpose:
          "Search, social, and display run against a target return, not a spend target — budgets moved toward what converts and away from what doesn't, with the reasoning visible in the numbers.",
        value: "Budget follows what the numbers prove, not what was planned in advance.",
        features: [
          "Campaign structure",
          "Audience targeting",
          "Bid & budget control",
          "Creative testing",
          "ROI tracking",
        ],
      },
      {
        title: "Conversion rate optimisation",
        icon: "efficiency",
        purpose:
          "The traffic already arriving, converted harder. Landing pages, journeys, and forms tested against real behaviour, so a lift comes from the visitors you've paid for rather than more of them.",
        value: "More result from the same traffic, proven by test rather than opinion.",
        features: [
          "A/B testing",
          "Landing pages",
          "Funnel analysis",
          "Heatmaps",
          "Form optimisation",
        ],
      },
      {
        title: "Marketing automation",
        icon: "automation",
        purpose:
          "The follow-up that used to depend on someone remembering — nurture sequences, lifecycle emails, and lead scoring that run themselves, so an interested visitor is worked without manual effort.",
        value: "Interest gets worked whether or not anyone remembers to.",
        features: [
          "Email nurture",
          "Lead scoring",
          "Lifecycle journeys",
          "CRM sync",
          "Segmentation",
        ],
      },
    ],
    howItHelps: [
      {
        before: "Spend goes out and nobody can say which half worked",
        after: "Every channel traced to the pipeline it produced",
      },
      {
        before: "Reporting that explains last quarter",
        after: "A dashboard that guides the next decision",
      },
      {
        before: "Traffic that arrives but doesn't convert",
        after: "Journeys tested and tuned to turn visits into leads",
      },
      {
        before: "SEO treated as a monthly line item",
        after: "Organic reach built into a fast, well-structured platform",
      },
      {
        before: "Follow-up that depends on someone remembering",
        after: "Nurture and scoring that run on their own",
      },
    ],
    industries: [
      {
        name: "Professional Services",
        useCase:
          "Local and organic visibility that brings in qualified enquiries rather than general traffic.",
      },
      {
        name: "Retail & E-commerce",
        useCase:
          "Paid and organic tuned to return on ad spend, not to traffic volume.",
      },
      {
        name: "Education",
        useCase:
          "Content and instrumentation that turn long consideration cycles into a measurable enquiry pipeline.",
      },
      {
        name: "Real Estate",
        useCase:
          "Listing visibility and lead capture measured through to the enquiries that actually convert.",
      },
      {
        name: "Hospitality & Tourism",
        useCase:
          "Direct booking demand grown deliberately, so margin stops leaking to intermediaries.",
      },
      {
        name: "Manufacturing",
        useCase:
          "Long B2B buying cycles instrumented end to end, so marketing is accountable to pipeline.",
      },
    ],
    process: [
      {
        title: "Audit",
        description:
          "The current platform, tracking, and channels measured against where the gaps actually are.",
        icon: "discovery",
      },
      {
        title: "Instrument",
        description:
          "Analytics, events, and conversion tracking set up so the data is trustworthy first.",
        icon: "analytics",
      },
      {
        title: "Fix the foundation",
        description:
          "Technical SEO and page speed addressed, since every channel rides on them.",
        icon: "engineering",
      },
      {
        title: "Plan the channels",
        description:
          "A campaign and content roadmap sequenced by expected return.",
        icon: "management",
      },
      {
        title: "Launch",
        description:
          "Campaigns and content go live against defined targets, not hopes.",
        icon: "delivery",
      },
      {
        title: "Measure",
        description:
          "Results read against pipeline, with a reporting cadence you set.",
        icon: "quality",
      },
      {
        title: "Optimise",
        description:
          "Budget and effort moved toward what the numbers prove is working.",
        icon: "efficiency",
      },
      {
        title: "Scale",
        description:
          "The channels that return are grown; the ones that don't are cut.",
        icon: "growth",
      },
    ],
    standoutPoints: [
      "Evidence over guesswork",
      "Engineering-grade tracking",
      "Pipeline, not vanity metrics",
      "Certified process",
      "Growth that compounds",
    ],
    closingLine:
      "Stop paying for marketing you can't measure — and start scaling the half that works.",
  },
  {
    name: "Technology Advisory",
    heroCta: "See how it works",
    buildMock: "blueprint",
    heroStatement: "Make the expensive technology decision once, and make it right.",
    icon: "Lightbulb",
    phase: "Consulting",
    blurb: "Independent guidance on the choices that shape your business.",
    problem:
      "A decision worth years and crores is on the table, every vendor is selling their own answer, and there's no neutral read on which one survives contact with your reality.",
    summary:
      "Independent, vendor-neutral guidance on the choices that shape your business — grounded in your goals, risks, and constraints, not in what any vendor is trying to sell you.",
    approach: "Vendor-neutral assessments grounded in your goals, risks, and constraints.",
    deliverables: [
      "A vendor-neutral architecture and systems assessment",
      "Risk register with mitigation options",
      "A costed, sequenced technology roadmap",
      "A clear build-vs-buy recommendation",
    ],
    outcomes: ["Confident decisions", "Reduced risk", "Aligned tech & business"],
    technologies: ["Architecture review", "Tech due diligence", "Roadmapping"],
    tools: ["Miro", "Notion", "AWS", "Azure", "Zoom"],
    understanding: {
      title: "What technology advisory actually gives you.",
      narrative: [
        "A high-stakes decision — a platform to standardise on, a system to replace, a build-versus-buy call worth years and crores — usually arrives with every vendor selling their own answer and no neutral read on which one survives contact with your reality. Advisory work exists to give you that neutral read: an assessment of where you are, an honest view of the options, and a recommendation you can defend to your board.",
        "The value is in being independent. Because the recommendation isn't tied to selling you an implementation, it can say “don't build that,” “the platform you're on is fine,” or “this vendor is the wrong fit” — the answers a party with something to sell rarely gives.",
      ],
      shifts: [
        "A decision made on evidence and trade-offs, not on the loudest vendor pitch.",
        "Risk named and costed up front, instead of discovered mid-project.",
        "A roadmap sequenced by dependency and value, not by whoever asked last.",
        "Build-versus-buy settled with a clear recommendation, not left to drift.",
      ],
      cards: [
        {
          title: "Architecture assessment",
          icon: "discovery",
          description:
            "An independent read on your current systems, their risks, and what genuinely needs to change — written so the board and the engineers can both act on it.",
        },
        {
          title: "Technology roadmap",
          icon: "management",
          description:
            "A costed, sequenced plan that ties every technology move to a business outcome rather than to fashion.",
        },
        {
          title: "Decision support",
          icon: "advisory",
          description:
            "A vendor-neutral recommendation on a specific choice, in a form that is ready to take to the board.",
        },
      ],
    },
    valueDrivers: [
      {
        title: "Confident decisions",
        icon: "advisory",
        description:
          "A defensible recommendation, backed by evidence and the trade-offs it was weighed against — so the call can be explained, not just made.",
      },
      {
        title: "Reduced risk",
        icon: "security",
        description:
          "The failure modes named and mitigated before they cost you, rather than discovered once the project is already underway.",
      },
      {
        title: "Technology aligned to the business",
        icon: "transformation",
        description:
          "Every move justified by an outcome the business recognises, which is what makes a roadmap fundable rather than aspirational.",
      },
      {
        title: "Genuinely neutral",
        icon: "partnership",
        description:
          "Advice with nothing to sell you at the end of it — including the freedom to recommend that you build nothing at all.",
      },
    ],
    whatWeBuild: [
      {
        title: "Architecture & systems assessment",
        icon: "discovery",
        purpose:
          "An independent review of the systems you run today — how they fit together, where they strain, and which parts carry the most risk — written up so both the board and the engineering team can act on it.",
        value: "One honest picture of the estate, readable by both audiences.",
        features: [
          "System mapping",
          "Bottleneck & risk analysis",
          "Scalability review",
          "Integration audit",
          "Plain-language findings",
        ],
      },
      {
        title: "Technology due diligence",
        icon: "quality",
        purpose:
          "A structured evaluation of a platform, vendor, codebase, or acquisition target — its real health, its hidden liabilities, and whether it delivers what it claims — before you commit money or reputation to it.",
        value: "What you are buying, assessed before you have bought it.",
        features: [
          "Vendor evaluation",
          "Code & tech health review",
          "Security posture check",
          "Cost-of-ownership analysis",
          "Red-flag register",
        ],
      },
      {
        title: "Risk register with mitigations",
        icon: "security",
        purpose:
          "The things that could derail the plan — technical, operational, and delivery risks — named, ranked by impact, and paired with a concrete mitigation option for each, so nothing important stays unspoken.",
        value: "Nothing important left unspoken until it is expensive.",
        features: [
          "Risk identification",
          "Impact & likelihood ranking",
          "Mitigation options",
          "Dependency mapping",
          "Ongoing review",
        ],
      },
      {
        title: "Costed technology roadmap",
        icon: "management",
        purpose:
          "A sequenced plan — Now, Next, Later — that ties each technology move to a business outcome, orders the work by dependency and value, and carries an indicative cost so it can be budgeted, not just admired.",
        value: "A plan the business can budget against rather than admire.",
        features: [
          "Phased sequencing",
          "Outcome mapping",
          "Indicative costing",
          "Dependency ordering",
          "Board-ready format",
        ],
      },
      {
        title: "Build-versus-buy recommendation",
        icon: "advisory",
        purpose:
          "A clear, reasoned call on whether to build, buy, or adapt — with the trade-offs of each option laid out and a single recommended path, so the decision gets made instead of deferred.",
        value: "A decision taken, with the reasoning attached to it.",
        features: [
          "Option analysis",
          "Total-cost comparison",
          "Fit assessment",
          "Trade-off summary",
          "Single clear recommendation",
        ],
      },
    ],
    howItHelps: [
      {
        before: "Every vendor recommends the option that happens to be theirs",
        after: "One neutral recommendation with nothing to sell you",
      },
      {
        before: "A crores-scale decision resting on instinct and a demo",
        after: "A decision backed by evidence and named trade-offs",
      },
      {
        before: "Risks that only surface once the project is underway",
        after: "Risks identified and mitigated before commitment",
      },
      {
        before: "A wish-list of projects with no order or cost",
        after: "A sequenced, costed roadmap the business can budget",
      },
      {
        before: "Build-versus-buy argued in circles for months",
        after: "A clear call, ready to take to the board",
      },
    ],
    industries: [
      {
        name: "Enterprises modernising legacy systems",
        useCase:
          "A neutral read on what to replace, keep, or rebuild — and in what order.",
      },
      {
        name: "Growing companies scaling their platform",
        useCase:
          "Architecture guidance before scale turns small cracks into outages.",
      },
      {
        name: "Boards and investors doing due diligence",
        useCase:
          "An independent view of a target's real technical health and liabilities.",
      },
      {
        name: "Founders facing a build-vs-buy call",
        useCase:
          "A costed recommendation before the first line of code or the first contract.",
      },
      {
        name: "Government & Public Sector",
        useCase:
          "Vendor-neutral advice that stands up to procurement scrutiny and audit.",
      },
    ],
    process: [
      {
        title: "Understand the goal",
        description:
          "The business outcome the decision has to serve, agreed before anything technical.",
        icon: "discovery",
      },
      {
        title: "Assess what exists",
        description:
          "Systems, constraints, risks, and the real state of the ground.",
        icon: "quality",
      },
      {
        title: "Map the options",
        description:
          "The credible paths, each with its trade-offs made explicit.",
        icon: "management",
      },
      {
        title: "Weigh the trade-offs",
        description: "Cost, risk, fit, and timeline compared side by side.",
        icon: "analytics",
      },
      {
        title: "Recommend",
        description:
          "A single, defensible direction, with the reasoning behind it.",
        icon: "advisory",
      },
      {
        title: "Sequence the roadmap",
        description:
          "The recommendation turned into a phased, costed plan.",
        icon: "delivery",
      },
      {
        title: "Hand over",
        description:
          "Findings documented so your team can act with or without us.",
        icon: "support",
      },
      {
        title: "Stay available",
        description:
          "On hand as the plan meets reality and choices need revisiting.",
        icon: "partnership",
      },
    ],
    standoutPoints: [
      "Independent by design",
      "Certified process",
      "Cross-industry experience",
      "Board-ready clarity",
      "Trusted partner",
    ],
    closingLine:
      "The right recommendation costs a fraction of the wrong decision — and it comes from a partner with nothing to sell you at the end of it.",
  },
  {
    name: "Program & Delivery Management",
    heroStatement: "Delivery dates the business can actually plan around.",
    heroCta: "See how it works",
    buildMock: "board",
    icon: "ClipboardList",
    phase: "Consulting",
    blurb: "Disciplined delivery that keeps complex programs on scope and on time.",
    problem:
      "Several teams, moving scope, and a date nobody quite believes — the status stays green right up until the week it goes red.",
    summary:
      "Disciplined program and delivery management that keeps complex, multi-team technology work on scope and on time — with the transparency and rigor that turns “we think we're on track” into a status you can trust.",
    approach:
      "Agile delivery with clear milestones, risk management, and communication in every engagement.",
    deliverables: [
      "A milestone plan and delivery cadence",
      "Risk register with a real escalation path",
      "One reporting line the business can read",
      "Scope and change-control process",
    ],
    outcomes: ["Predictable delivery", "Fewer surprises", "Clear accountability"],
    technologies: ["Agile / Scrum", "Roadmapping", "Risk management", "Reporting"],
    tools: ["Jira", "Linear", "Asana", "ClickUp", "Slack", "Notion"],
    understanding: {
      title: "What disciplined delivery management changes.",
      narrative: [
        "Several teams, moving scope, and a date nobody quite believes — the status stays green right up until the week it goes red. Delivery management exists to close that gap: to turn a program that feels under control into one that demonstrably is, with a plan people work to, risks tracked before they bite, and one honest reporting line the business can read.",
        "The work is coordination and accountability, not more meetings. Milestones are defined, dependencies made visible, scope changes controlled rather than absorbed silently, and problems escalated early enough to do something about them — so the date the business planned around is the date it gets.",
      ],
      shifts: [
        "Status reflects reality, not optimism — you see risk while there's still time to act.",
        "Scope changes go through a decision, not a quiet absorption into the timeline.",
        "Dependencies across teams are surfaced and managed, not discovered at the join.",
        "One reporting line the whole business reads, instead of five conflicting updates.",
      ],
      cards: [
        {
          title: "Program management",
          icon: "management",
          description:
            "Coordination across several teams and workstreams pulling toward one outcome, with a single owner of the plan.",
        },
        {
          title: "Delivery oversight",
          icon: "quality",
          description:
            "An independent hand on the cadence, risks, and reporting of a single delivery — accountability without another layer of meetings.",
        },
        {
          title: "Recovery & turnaround",
          icon: "support",
          description:
            "Steadying a program that has slipped, and rebuilding a date that holds because it was set on evidence.",
        },
      ],
    },
    valueDrivers: [
      {
        title: "Predictable delivery",
        icon: "delivery",
        description:
          "A date set on evidence and dependency rather than optimism — which is what makes it something the business can plan around.",
      },
      {
        title: "Fewer surprises",
        icon: "security",
        description:
          "Risks named and escalated early, so a problem reaches a decision-maker while it is still small enough to fix.",
      },
      {
        title: "Clear accountability",
        icon: "management",
        description:
          "One owner of the plan, the cadence, and the reporting line — so nothing important falls into the space between teams.",
      },
      {
        title: "Transparency throughout",
        icon: "analytics",
        description:
          "A status you can trust because you can see what it is built on, not a colour someone chose before the meeting.",
      },
    ],
    whatWeBuild: [
      {
        title: "Milestone plan & delivery cadence",
        icon: "management",
        purpose:
          "A plan built from real dependencies and capacity — milestones the teams can actually hit — and a working rhythm of sprints, reviews, and checkpoints that keeps progress visible and moving between them.",
        value: "A date the teams can hit, and a rhythm that keeps them moving toward it.",
        features: [
          "Dependency-based planning",
          "Milestone definition",
          "Sprint cadence",
          "Capacity mapping",
          "Checkpoint reviews",
        ],
      },
      {
        title: "Risk register with an escalation path",
        icon: "security",
        purpose:
          "The risks that could move the date — technical, resourcing, and third-party — logged, ranked by impact, and each tied to an owner and a real escalation path, so a problem reaches a decision-maker while it's still small.",
        value: "Problems reach a decision-maker while they are still small.",
        features: [
          "Risk logging",
          "Impact ranking",
          "Named owners",
          "Escalation path",
          "Early-warning triggers",
        ],
      },
      {
        title: "One reporting line the business can read",
        icon: "analytics",
        purpose:
          "A single, honest status — progress, risks, decisions needed — written for the people funding the work, not for the delivery team's own comfort. No conflicting updates, no green that hides red.",
        value: "One status, written for the people funding the work.",
        features: [
          "Unified status reporting",
          "RAG that reflects reality",
          "Decision & blocker log",
          "Stakeholder-ready format",
          "Agreed reporting cadence",
        ],
      },
      {
        title: "Scope & change control",
        icon: "compliance",
        purpose:
          "A defined process for handling change — every new request assessed for its cost to time, budget, and scope, then accepted or declined as a decision, so the timeline moves on purpose rather than by accident.",
        value: "The timeline moves on purpose, or it doesn't move.",
        features: [
          "Change-request process",
          "Impact assessment",
          "Baseline protection",
          "Decision log",
          "Traceable approvals",
        ],
      },
      {
        title: "Governance & communication",
        icon: "partnership",
        purpose:
          "The structure that keeps a program coordinated — clear roles, decision rights, and the right cadence of communication across teams and stakeholders — so the program runs on a rhythm instead of on firefighting.",
        value: "A program that runs on a rhythm instead of on firefighting.",
        features: [
          "Governance structure",
          "Defined roles & rights",
          "Stakeholder communication",
          "Cross-team coordination",
          "Regular steering reviews",
        ],
      },
    ],
    howItHelps: [
      {
        before: "A status that stays green until the week it goes red",
        after: "A status that reflects reality while there's still time to act",
      },
      {
        before: "A delivery date nobody quite believes",
        after: "A date set on evidence and dependency, that the business can plan around",
      },
      {
        before: "Scope quietly absorbed until the timeline slips",
        after: "Every change assessed and decided, not silently absorbed",
      },
      {
        before: "Five teams reporting five different pictures",
        after: "One reporting line the whole business reads",
      },
      {
        before: "Risks discovered at go-live",
        after: "Risks named and escalated early enough to fix",
      },
    ],
    industries: [
      {
        name: "Enterprises running multi-team programs",
        useCase:
          "One hand coordinating workstreams that would otherwise drift apart.",
      },
      {
        name: "Companies mid-transformation",
        useCase:
          "Delivery rigor across a change program touching many systems at once.",
      },
      {
        name: "Organisations recovering a slipped project",
        useCase:
          "An independent lead to steady it and rebuild a date that holds.",
      },
      {
        name: "Businesses without a delivery function",
        useCase:
          "Program discipline without carrying the permanent headcount for it.",
      },
      {
        name: "Government & Public Sector",
        useCase:
          "Transparent governance and reporting that stands up to scrutiny.",
      },
    ],
    process: [
      {
        title: "Assess the program",
        description:
          "Scope, teams, dependencies, and the real state of the date.",
        icon: "discovery",
      },
      {
        title: "Set the plan",
        description: "Milestones, cadence, and governance agreed up front.",
        icon: "management",
      },
      {
        title: "Establish reporting",
        description:
          "One status line and cadence the business can rely on.",
        icon: "analytics",
      },
      {
        title: "Track delivery",
        description:
          "Progress, risks, and blockers recorded as they happen.",
        icon: "delivery",
      },
      {
        title: "Manage risk & change",
        description:
          "Issues escalated and scope decisions taken on time.",
        icon: "security",
      },
      {
        title: "Report & steer",
        description:
          "A regular checkpoint keeps stakeholders informed and in control.",
        icon: "quality",
      },
      {
        title: "Adjust",
        description:
          "The plan flexes to reality without losing the outcome.",
        icon: "efficiency",
      },
      {
        title: "Close out",
        description:
          "Delivery confirmed, lessons captured, and handover completed.",
        icon: "partnership",
      },
    ],
    standoutPoints: [
      "Predictable delivery",
      "Certified process",
      "Transparent reporting",
      "Cross-industry experience",
      "Trusted partner",
    ],
    closingLine:
      "A program the business can plan around isn't luck — it's a plan people work to, risks caught early, and one status you can actually trust.",
  },
  {
    name: "Data Analytics & Insights",
    heroStatement: "Run the business on evidence, not on whose spreadsheet won.",
    heroCta: "See how it works",
    buildMock: "bi",
    icon: "BarChart3",
    phase: "Consulting",
    blurb: "Turn scattered data into decisions leaders can act on.",
    problem:
      "The numbers live in five systems and disagree with each other, so every leadership meeting starts by arguing about whose spreadsheet is right.",
    summary:
      "Scattered data unified into one trusted model, reliable pipelines feeding it, and dashboards built around the decisions you actually make — so leadership meetings start from agreed numbers instead of arguing about them.",
    approach:
      "Model the data, build reliable pipelines, and deliver dashboards people actually use.",
    deliverables: [
      "A unified data model and reliable pipelines",
      "Dashboards built around the decisions you actually make",
      "Data quality and refresh monitoring",
      "Metric definitions everyone agrees on",
    ],
    outcomes: ["Faster, data-driven decisions", "Single source of truth", "Uncovered opportunities"],
    technologies: ["Data pipelines / ETL", "Dashboards & BI", "Data warehousing", "Visualization"],
    tools: ["Python", "MongoDB", "Google Analytics", "Google", "Zapier"],
    understanding: {
      title: "What it takes to make data a decision, not a debate.",
      narrative: [
        "Most organisations don't lack data — they lack agreement about it. The numbers live in five systems, each with its own definition of a customer, an order, or revenue, so the same question returns five answers. The work is joining those sources into one model where a metric means one thing, everywhere, to everyone.",
        "A dashboard is only the last inch. Behind it sits the harder engineering — pipelines that pull from every source on a schedule, transformations that clean and reconcile the data, and monitoring that catches a broken feed before it reaches a leadership deck. Get that right and the insight is trustworthy; skip it and the chart just launders a guess.",
      ],
      shifts: [
        "Numbers move from five disagreeing spreadsheets to one source of truth.",
        "Metrics get a single agreed definition instead of one per department.",
        "Reporting shifts from manual assembly to pipelines that refresh themselves.",
        "Decisions get made on evidence rather than on instinct and seniority.",
      ],
      cards: [
        {
          title: "Unify",
          icon: "integrations",
          description:
            "Scattered sources joined into one reliable, governed model where each entity means exactly one thing.",
        },
        {
          title: "See",
          icon: "analytics",
          description:
            "Dashboards built around the decisions leaders actually make, rather than every chart the data could produce.",
        },
        {
          title: "Trust",
          icon: "quality",
          description:
            "Quality and refresh monitoring, so the numbers hold up when someone challenges them in the room.",
        },
      ],
    },
    valueDrivers: [
      {
        title: "One source of truth",
        icon: "platform",
        description:
          "The same number, whoever asks and wherever they look — which is what ends the argument about whose export is right.",
      },
      {
        title: "Faster decisions",
        icon: "efficiency",
        description:
          "Answers ready on a dashboard rather than assembled by hand overnight, so the meeting starts where it used to finish.",
      },
      {
        title: "Opportunities you can't see now",
        icon: "discovery",
        description:
          "Patterns that stay hidden while data sits siloed, surfaced where a decision can actually act on them.",
      },
      {
        title: "Confidence in the numbers",
        icon: "quality",
        description:
          "Metrics defined, monitored, and defensible — so a challenged figure has an answer rather than a re-export.",
      },
    ],
    whatWeBuild: [
      {
        title: "A unified data model",
        icon: "platform",
        purpose:
          "Every source — CRM, finance, product, operations — joined into one structure where a customer, an order, and revenue each mean one thing. The foundation every reliable number is built on.",
        value: "One structure the whole business reads the same way.",
        features: [
          "Source mapping",
          "Entity modelling",
          "Warehouse design",
          "Historical loads",
          "Governed schema",
        ],
      },
      {
        title: "Reliable data pipelines",
        icon: "automation",
        purpose:
          "Automated ETL that pulls from each system on a schedule, cleans and reconciles it, and lands it ready to query — so the data is current and consistent without anyone exporting a spreadsheet.",
        value: "Current data without anyone exporting anything.",
        features: [
          "Scheduled ingestion",
          "Transformation logic",
          "Deduplication",
          "Incremental refresh",
          "Failure alerts",
        ],
      },
      {
        title: "Dashboards & BI",
        icon: "analytics",
        purpose:
          "Views built around real decisions, not every chart that could be drawn. KPI tiles, trends, and breakdowns that answer the question a leader is actually asking, on a screen they'll actually open.",
        value: "A screen leaders open because it answers their question.",
        features: [
          "KPI tiles",
          "Interactive filters",
          "Drill-down",
          "Scheduled reports",
          "Role-based access",
        ],
      },
      {
        title: "Metric definitions",
        icon: "compliance",
        purpose:
          "The single most argued-over thing — what a metric means — pinned down and documented, so “active customer” or “net revenue” carries one agreed definition across every report and team.",
        value: "One definition per metric, across every report and team.",
        features: [
          "Metric catalogue",
          "Business logic",
          "Shared definitions",
          "Version history",
          "Documentation",
        ],
      },
      {
        title: "Data quality & monitoring",
        icon: "quality",
        purpose:
          "Freshness, completeness, and accuracy watched continuously, so a broken feed or a stale table surfaces as an alert before it surfaces as a wrong number in a board deck.",
        value: "A broken feed becomes an alert, not a wrong board number.",
        features: [
          "Freshness checks",
          "Anomaly detection",
          "Completeness rules",
          "Refresh monitoring",
          "Data alerts",
        ],
      },
      {
        title: "Advanced analytics",
        icon: "growth",
        purpose:
          "Beyond what happened, toward what's likely — cohorts, segmentation, and forecasting that turn the unified data into a lead on where the business is heading, not just a record of where it's been.",
        value: "A lead on where the business is heading, not only where it's been.",
        features: [
          "Cohort analysis",
          "Segmentation",
          "Forecasting",
          "Trend modelling",
          "Custom analysis",
        ],
      },
    ],
    howItHelps: [
      {
        before: "Five systems that disagree with each other",
        after: "One unified model where a number means one thing",
      },
      {
        before: "Meetings that start by arguing whose spreadsheet is right",
        after: "Meetings that start from numbers everyone already trusts",
      },
      {
        before: "Reports assembled by hand, overnight, every time",
        after: "Dashboards that refresh themselves on schedule",
      },
      {
        before: "“Active customer” means something different per team",
        after: "One agreed definition for every metric that matters",
      },
      {
        before: "Opportunities buried in siloed, unqueried data",
        after: "Patterns surfaced where a decision can act on them",
      },
    ],
    industries: [
      {
        name: "Retail & E-commerce",
        useCase:
          "Sales, inventory, and customer data joined into one view of demand.",
      },
      {
        name: "Banking & Financial Services",
        useCase:
          "Reporting and risk metrics defined once and defensible under audit.",
      },
      {
        name: "Manufacturing",
        useCase:
          "Production, quality, and downtime data surfaced where operations can act on it.",
      },
      {
        name: "Healthcare",
        useCase:
          "Operational and outcome metrics unified without compromising sensitive data.",
      },
      {
        name: "Logistics & Transportation",
        useCase:
          "Movement, cost, and exception data read from one consistent model rather than four.",
      },
      {
        name: "Education",
        useCase:
          "Enrolment, attendance, and outcome data governed as a single source of truth across departments.",
      },
    ],
    process: [
      {
        title: "Discover",
        description:
          "The decisions the data has to serve, mapped before any table is touched.",
        icon: "discovery",
      },
      {
        title: "Audit the sources",
        description:
          "Every system, its definitions, and where they disagree, catalogued.",
        icon: "quality",
      },
      {
        title: "Model",
        description:
          "A unified data model designed so each entity and metric means one thing.",
        icon: "platform",
      },
      {
        title: "Build the pipelines",
        description:
          "Automated ingestion, cleaning, and reconciliation into the warehouse.",
        icon: "automation",
      },
      {
        title: "Define the metrics",
        description:
          "Business logic agreed and documented, so numbers stop being contested.",
        icon: "compliance",
      },
      {
        title: "Build the dashboards",
        description:
          "Views shaped around the decisions, reviewed with the people making them.",
        icon: "analytics",
      },
      {
        title: "Monitor",
        description:
          "Quality and refresh checks put in place so the data stays trustworthy.",
        icon: "security",
      },
      {
        title: "Iterate",
        description:
          "New questions, sources, and metrics folded in as the business asks more of the data.",
        icon: "partnership",
      },
    ],
    standoutPoints: [
      "One source of truth",
      "Certified process",
      "Pipelines you can trust",
      "Decisions on evidence",
      "Insight that scales",
    ],
    closingLine:
      "When everyone trusts the same numbers, the meeting stops being about the data and starts being about the decision.",
  },
  {
    name: "Blockchain Solutions",
    heroStatement: "A shared record several parties can trust without reconciling it.",
    heroCta: "See where it fits",
    buildMock: "ledger",
    icon: "Blocks",
    phase: "Building",
    blurb: "Secure, transparent systems built on distributed ledger technology.",
    problem:
      "Several parties need to trust the same record, and reconciliation, disputes, and audit trails are quietly eating the margin on every transaction.",
    summary:
      "When more than one organisation depends on the same record, reconciliation, disputes, and audit trails quietly erode the margin on every transaction. A distributed ledger gives everyone one tamper-evident copy — so the record is agreed once and never argued over again.",
    approach:
      "Start from the business case, not the hype — then engineer secure, auditable on-chain solutions.",
    deliverables: [
      "An honest business case for — or against — using a chain",
      "Audited smart contracts",
      "On-chain and off-chain architecture",
      "Integration with the systems you already run",
    ],
    outcomes: ["Verifiable trust", "Reduced fraud risk", "Transparent transactions"],
    technologies: ["Smart contracts", "Ethereum / EVM", "Distributed ledger", "Web3"],
    tools: ["Node.js", "React", "GitHub", "Docker", "Postman"],
    understanding: {
      title: "What a blockchain actually changes for your business.",
      narrative: [
        "A blockchain is a shared record that no single party owns and no single party can quietly alter. Every participant holds the same copy, every entry is signed and time-ordered, and changing history means changing every copy at once — which is what makes the record trustworthy without a middleman sitting between the parties to enforce it.",
        "That property only earns its keep in a narrow set of situations — where several organisations that do not fully trust each other need to act on the same data. Used there, it removes the reconciliation, the disputes, and the audit overhead. Used anywhere else, a normal database is faster, cheaper, and the honest answer.",
      ],
      shifts: [
        "Reconciliation between parties becomes a single agreed record.",
        "Trust moves from a central intermediary to verifiable math.",
        "Audit trails stop being assembled after the fact — they are the record.",
        "Agreements that ran on paper and email execute as code.",
      ],
      cards: [
        {
          title: "Shared ledgers",
          icon: "integrations",
          description:
            "One authoritative record across organisations, so there is nothing left to reconcile at the end of the month.",
        },
        {
          title: "Smart contracts",
          icon: "automation",
          description:
            "Agreed rules that execute automatically, exactly as written, identically for every party to them.",
        },
        {
          title: "Digital assets & tokens",
          icon: "payments",
          description:
            "Ownership and value represented on-chain — transferable, and provable against a record anyone can check.",
        },
      ],
    },
    valueDrivers: [
      {
        title: "Trust without an intermediary",
        icon: "security",
        description:
          "Parties act on one record instead of reconciling several, which removes both the delay and the party in the middle charging for it.",
      },
      {
        title: "Tamper-evident by design",
        icon: "compliance",
        description:
          "History can be verified rather than claimed, which is what cuts fraud exposure and the cost of settling a dispute.",
      },
      {
        title: "Audit built in",
        icon: "quality",
        description:
          "Every transaction is signed and time-ordered, so compliance stops being a reconstruction from email and spreadsheets.",
      },
      {
        title: "Automation of agreements",
        icon: "automation",
        description:
          "Smart contracts execute the terms as written, removing the manual handoffs and the delay that came with them.",
      },
    ],
    whatWeBuild: [
      {
        title: "The business case, first",
        icon: "advisory",
        purpose:
          "The most valuable deliverable is often an honest answer on whether a chain belongs here at all. The fit, the alternatives, and the cost are assessed before a line of contract code is written — so the decision rests on evidence, not on the hype.",
        value: "An answer you can act on, including when the answer is “not this”.",
        features: [
          "Use-case fit assessment",
          "Chain-vs-database analysis",
          "Cost & effort model",
          "Regulatory review",
          "Go / no-go recommendation",
        ],
      },
      {
        title: "Smart contracts, audited",
        icon: "security",
        purpose:
          "The rules that move value on-chain are written to execute exactly as agreed — then reviewed and tested against the failure modes that have drained real contracts, because on-chain code is public and irreversible once deployed.",
        value: "Code that is public and irreversible, treated accordingly.",
        features: [
          "Solidity / EVM contracts",
          "Security audit & review",
          "Test coverage",
          "Gas optimisation",
          "Upgrade & pause controls",
        ],
      },
      {
        title: "On-chain and off-chain architecture",
        icon: "engineering",
        purpose:
          "A working system is rarely all on-chain. Sensitive data, heavy computation, and user experience stay off-chain; only what needs shared trust goes on it — designed as one coherent system rather than two that disagree.",
        value: "One coherent system, not two halves that disagree.",
        features: [
          "On/off-chain split",
          "Data privacy design",
          "Oracles & external data",
          "Indexing & querying",
          "Scalability planning",
        ],
      },
      {
        title: "Wallets and key management",
        icon: "payments",
        purpose:
          "Where value lives, keys are the whole game. Custody, signing, and recovery are engineered so users can transact safely without a lost phone becoming a lost asset — and so the business is never holding a liability it did not intend to.",
        value: "A lost phone stops being a lost asset.",
        features: [
          "Wallet integration",
          "Custodial & non-custodial models",
          "Multi-signature approval",
          "Key recovery",
          "Transaction signing",
        ],
      },
      {
        title: "Tokens and digital assets",
        icon: "growth",
        purpose:
          "Ownership, membership, or value represented on-chain — issued, transferred, and verified against a public record, with the standards and controls that keep the issuance compliant rather than a future problem.",
        value: "Issuance that stays compliant instead of becoming a future problem.",
        features: [
          "Token standards (ERC-20 / 721 / 1155)",
          "Minting & issuance",
          "Transfer controls",
          "Ownership provenance",
          "Marketplace integration",
        ],
      },
      {
        title: "Integration with systems you already run",
        icon: "integrations",
        purpose:
          "A ledger that no one can reach is not an asset. The chain is connected to the ERP, the payment rail, and the applications the business already runs, so the shared record flows into daily operations instead of sitting to one side of them.",
        value: "The shared record reaches daily operations instead of sitting beside them.",
        features: [
          "ERP & core-system connectors",
          "Payment integration",
          "API & webhook layer",
          "Event monitoring",
          "Existing-database sync",
        ],
      },
    ],
    howItHelps: [
      {
        before: "Two organisations reconciling the same transactions every month",
        after: "One shared record with nothing left to reconcile",
      },
      {
        before: "Disputes that turn into who-has-the-right-copy arguments",
        after: "A tamper-evident record every party can verify independently",
      },
      {
        before: "Audit trails reassembled from email and spreadsheets",
        after: "A signed, time-ordered history that is the audit trail",
      },
      {
        before: "Agreements executed manually, with the delay and error that brings",
        after: "Smart contracts that run the terms automatically",
      },
      {
        before: "A blockchain pilot that never found a real reason to exist",
        after: "A clear-eyed business case — including when the answer is “not this”",
      },
    ],
    industries: [
      {
        name: "Logistics & Transportation",
        useCase:
          "Provenance and custody tracked across every party, so a claim about where goods have been can be proven rather than asserted.",
      },
      {
        name: "Banking & Financial Services",
        useCase:
          "Settlement, trade finance, and asset records shared across counterparties without a central reconciliation desk.",
      },
      {
        name: "Government & Public Sector",
        useCase:
          "Land, licence, and certificate registries citizens and departments can verify without trusting a single office.",
      },
      {
        name: "Healthcare",
        useCase:
          "Drug provenance and consent records that resist tampering across manufacturers, distributors, and providers.",
      },
      {
        name: "Real Estate",
        useCase:
          "Title and transaction history held as one provable record instead of scattered across intermediaries.",
      },
      {
        name: "Manufacturing",
        useCase:
          "Component and warranty provenance shared across suppliers, so counterfeits and disputes surface early.",
      },
    ],
    process: [
      {
        title: "Assess the case",
        description:
          "Whether a chain genuinely adds trust here, judged before anything is built.",
        icon: "advisory",
      },
      {
        title: "Design the architecture",
        description:
          "What belongs on-chain, what stays off, and how the two connect.",
        icon: "engineering",
      },
      {
        title: "Model the contracts",
        description:
          "The rules that move value, specified and agreed before they are written.",
        icon: "compliance",
      },
      {
        title: "Build",
        description:
          "Contracts, wallets, and services delivered in reviewable increments.",
        icon: "delivery",
      },
      {
        title: "Audit",
        description:
          "Security review and testing against known on-chain failure modes.",
        icon: "security",
      },
      {
        title: "Integrate",
        description:
          "The chain wired into the systems and payment rails already in use.",
        icon: "integrations",
      },
      {
        title: "Deploy",
        description:
          "To testnet, then mainnet, with monitoring and a rehearsed response plan.",
        icon: "infrastructure",
      },
      {
        title: "Operate",
        description:
          "Event monitoring, upgrades, and support by the team that built it.",
        icon: "partnership",
      },
    ],
    standoutPoints: [
      "Business case first",
      "Audited & secure",
      "Certified process",
      "Integrated with your systems",
      "Long-term partner",
    ],
    closingLine:
      "Used in the right place, a blockchain replaces the reconciling, the disputing, and the auditing with a single record everyone already trusts.",
  },
  {
    name: "AI & Intelligent Automation",
    heroStatement: "Put your people back on the work only people can do.",
    heroCta: "Find your first use case",
    buildMock: "assistant",
    icon: "Sparkles",
    phase: "Building",
    blurb: "AI, ML & automation that remove manual work and unlock decisions.",
    problem:
      "Skilled people spend their days on repetitive manual work, and the AI pilots keep stalling somewhere between the demo and production.",
    summary:
      "Skilled people spend their days on repetitive manual work, and the AI pilots keep stalling between the demo and production. Automation removes the repetition, and AI turns the data already in the business into decisions — deployed with the guardrails that get it past the pilot and into daily use.",
    approach:
      "Identify high-value use cases, prove them quickly, then operationalize with the right guardrails.",
    deliverables: [
      "A use-case shortlist ranked by value and feasibility",
      "A working proof-of-concept on your data",
      "Production deployment with guardrails",
      "Monitoring and a human-in-the-loop path",
    ],
    outcomes: ["Automated workflows", "Faster, data-driven decisions", "Scalable operations"],
    technologies: ["Machine Learning", "LLMs / SLMs", "Conversational AI", "MLOps"],
    tools: ["Python", "ChatGPT", "Claude", "Google Gemini", "GitHub Copilot", "Cursor"],
    stories: ["webespoke-ai", "nasscom-indian-oil-ai-ml-workshop"],
    understanding: {
      title: "What AI and automation actually do for the business.",
      narrative: [
        "Two different things travel under one banner. Automation takes a rules-based task that a person does the same way every time — moving data, checking a form, routing a request — and lets software do it reliably, all day, without tiring. AI takes a judgement that used to need a person — reading a document, predicting demand, answering a question — and makes a useful call on it from patterns in your data.",
        "The value is rarely in the model itself. It is in choosing the handful of tasks where this genuinely pays, proving it quickly on real data, and then wiring it into the way work already flows — with a person kept in the loop wherever a wrong call would be costly. That last mile, from demo to dependable, is where most projects stall and where the return actually lives.",
      ],
      shifts: [
        "Repetitive manual work moves from people to reliable software.",
        "Decisions shift from instinct and spreadsheets to evidence in the data.",
        "Support and answers become available the moment they are needed, not the next working day.",
        "AI moves from a stalled pilot to an operating part of the process.",
      ],
      cards: [
        {
          title: "Intelligent automation",
          icon: "automation",
          description:
            "Rules-based work runs itself, with AI handling the judgement steps a pure rules engine cannot.",
        },
        {
          title: "Applied AI & ML",
          icon: "analytics",
          description:
            "Prediction, classification, and extraction trained on your own data, embedded where the decision is actually made.",
        },
        {
          title: "Conversational AI",
          icon: "support",
          description:
            "Assistants that answer from your knowledge — grounded in your content and cited, rather than making it up.",
        },
      ],
    },
    valueDrivers: [
      {
        title: "Capacity without headcount",
        icon: "efficiency",
        description:
          "Repetitive work runs itself, so the people you already have move to the work that genuinely needs them.",
      },
      {
        title: "Faster, evidenced decisions",
        icon: "analytics",
        description:
          "The data already in the business becomes a prediction or a recommendation rather than a hunch defended in a meeting.",
      },
      {
        title: "Answers on demand",
        icon: "support",
        description:
          "Customers and staff get a grounded response in the moment instead of waiting in a queue until the next working day.",
      },
      {
        title: "Pilots that reach production",
        icon: "delivery",
        description:
          "Use cases proven on real data and deployed with guardrails — the last mile most AI projects never cross.",
      },
    ],
    whatWeBuild: [
      {
        title: "A use-case shortlist, ranked",
        icon: "discovery",
        purpose:
          "Before anything is built, the candidate tasks are ranked by value and feasibility — so effort goes to the two or three that pay, and the fashionable-but-pointless ones are set aside early rather than after the budget is spent.",
        value: "Effort lands on the two or three tasks that actually pay.",
        features: [
          "Opportunity assessment",
          "Value-vs-feasibility scoring",
          "Data-readiness check",
          "ROI estimate",
          "Prioritised roadmap",
        ],
      },
      {
        title: "A proof-of-concept on your data",
        icon: "quality",
        purpose:
          "An idea proven against your own data, quickly, so the decision to scale rests on a working result rather than a vendor demo. If the data does not support it yet, that surfaces now — while it is cheap to know.",
        value: "A working result to decide on, not a vendor demo.",
        features: [
          "Rapid prototyping",
          "Model evaluation",
          "Accuracy & baseline testing",
          "Data-gap analysis",
          "Clear go / no-go",
        ],
      },
      {
        title: "Intelligent process automation",
        icon: "automation",
        purpose:
          "The repetitive, rules-based work — moving data between systems, checking and routing, generating the routine document — runs on a schedule or a trigger, with AI handling the judgement steps a pure rules engine cannot.",
        value: "The routine runs itself, including the steps that need a judgement.",
        features: [
          "Workflow orchestration",
          "System-to-system integration",
          "Document processing",
          "Human-in-the-loop steps",
          "Exception handling",
        ],
      },
      {
        title: "Conversational AI & assistants",
        icon: "support",
        purpose:
          "Assistants that answer from the business's own knowledge — support articles, policies, records — grounded in retrieved content and cited, so the answer is trustworthy and the reason for it can be checked.",
        value: "Answers that can be checked, because the source comes with them.",
        features: [
          "Retrieval-grounded answers (RAG)",
          "Knowledge-base integration",
          "Source citation",
          "Multi-channel deployment",
          "Guardrails & fallback",
        ],
      },
      {
        title: "Applied ML & predictive models",
        icon: "growth",
        purpose:
          "Forecasting, classification, and extraction trained on your history — demand, risk, churn, document contents — embedded where the decision is actually made rather than left in a notebook a data scientist owns.",
        value: "The prediction reaches the decision instead of staying in a notebook.",
        features: [
          "Forecasting & prediction",
          "Classification & scoring",
          "Document & image extraction",
          "Feature engineering",
          "In-workflow deployment",
        ],
      },
      {
        title: "MLOps, monitoring & guardrails",
        icon: "security",
        purpose:
          "What keeps a model useful after launch: monitoring for drift, a path for a person to review or override, and the controls that keep an AI decision auditable — so it stays dependable instead of quietly degrading.",
        value: "A model that stays dependable rather than quietly degrading.",
        features: [
          "Model monitoring & drift detection",
          "Retraining pipeline",
          "Human-in-the-loop review",
          "Access & audit controls",
          "Cost & usage tracking",
        ],
      },
    ],
    howItHelps: [
      {
        before: "Skilled staff spending hours on repetitive manual tasks",
        after: "Routine work automated, people on the work that needs judgement",
      },
      {
        before: "Decisions made on instinct because the data is too slow to reach",
        after: "Predictions and recommendations from the data you already hold",
      },
      {
        before: "A support queue that only moves in working hours",
        after: "Grounded, cited answers available the moment they are needed",
      },
      {
        before: "An AI pilot that impressed everyone and shipped nothing",
        after: "A use case in production, with guardrails and monitoring",
      },
      {
        before: "No way to tell whether a model is still making good calls",
        after: "Drift, accuracy, and cost monitored, with a human override in place",
      },
    ],
    industries: [
      {
        name: "Banking & Financial Services",
        useCase:
          "Document processing, fraud and risk scoring, and assistants that answer policy questions without a call.",
      },
      {
        name: "Healthcare",
        useCase:
          "Extraction from clinical documents, appointment and triage assistants, and load lifted off administrative staff.",
      },
      {
        name: "Retail & E-commerce",
        useCase:
          "Demand forecasting, personalised recommendation, and support assistants that deflect routine queries.",
      },
      {
        name: "Manufacturing",
        useCase:
          "Predictive maintenance and quality inspection from sensor and image data, catching faults before they stop a line.",
      },
      {
        name: "Logistics & Transportation",
        useCase:
          "Demand and route prediction, document automation, and exception handling across the movement of goods.",
      },
      {
        name: "Professional Services",
        useCase:
          "Contract and document review, knowledge assistants, and the automation of repetitive back-office work.",
      },
    ],
    process: [
      {
        title: "Find the use cases",
        description:
          "Candidate tasks ranked by value and feasibility before anything is built.",
        icon: "discovery",
      },
      {
        title: "Check the data",
        description:
          "Whether what you hold can actually support the use case, assessed honestly.",
        icon: "quality",
      },
      {
        title: "Prove it",
        description:
          "A proof-of-concept on your data, fast, with a clear go / no-go at the end.",
        icon: "analytics",
      },
      {
        title: "Design the guardrails",
        description:
          "Where a human stays in the loop, and what a wrong call must never be allowed to do.",
        icon: "security",
      },
      {
        title: "Build & integrate",
        description:
          "The model or automation wired into the way work already flows.",
        icon: "integrations",
      },
      {
        title: "Deploy",
        description:
          "Into production with monitoring, access controls, and a fallback path.",
        icon: "infrastructure",
      },
      {
        title: "Monitor",
        description:
          "Accuracy, drift, and cost watched, with retraining when the data moves.",
        icon: "management",
      },
      {
        title: "Improve",
        description:
          "The next use case, informed by what the first one proved.",
        icon: "partnership",
      },
    ],
    standoutPoints: [
      "Value before hype",
      "Proven on your data",
      "Guardrails built in",
      "Production, not pilots",
      "Certified process",
    ],
    closingLine:
      "The point is not the model — it is the hours it hands back and the decisions it sharpens, running dependably inside the work you already do.",
  },
  {
    name: "Managed Outsourcing",
    heroStatement:
      "Extend your technology capabilities without expanding operational complexity.",
    heroCta: "See how it works",
    buildMock: "team",
    icon: "Handshake",
    phase: "Support",
    blurb:
      "Skilled technology professionals, dedicated teams, and managed delivery aligned to your business requirements.",
    problem:
      "Lengthy recruitment cycles, hard-to-find specialist skills, and fluctuating project demand make it difficult to build the technology capacity your business needs.",
    summary:
      "Access skilled technology professionals, dedicated teams, and managed delivery capabilities while Sumago manages the people, infrastructure, supervision, and delivery operations behind them.",
    approach:
      "Engagement models are structured around your requirements, giving you the capacity and expertise you need while you retain control over priorities, product direction, and intellectual property.",
    deliverables: [
      "Qualified technology professionals without lengthy recruitment cycles",
      "Capacity that scales with project and business requirements",
      "Structured delivery processes and technical oversight",
      "Team-level support and knowledge continuity",
      "Clear reporting and delivery governance",
    ],
    outcomes: [
      "Faster time to capacity",
      "Predictable costs",
      "Greater flexibility",
      "Reduced delivery risk",
      "Focus on core business",
    ],
    technologies: [
      "Software engineering",
      "Quality engineering & QA",
      "UI/UX design",
      "Business analysis",
      "Cloud & DevOps",
      "AI & automation",
      "Technical leadership",
    ],
    tools: ["Slack", "Zoom", "Jira", "Notion", "Dropbox"],
    /* Mahindra is a resourcing engagement as well as a build one — the client
       testimonial on record speaks to the resources provided, not the app — so
       the story belongs on this page as much as on Mobile App Engineering. */
    stories: ["mahindra-rise-app-launch"],
    understanding: {
      title: "Build capacity without building the entire operation.",
      narrative: [
        "Resource management and outsourcing provide a flexible way to expand technology capabilities while maintaining control over cost, quality, and delivery.",
        "Whether you need a specialist for a specific role, a dedicated engineering team, or an end-to-end managed delivery function, the engagement can be aligned to your business requirements.",
      ],
      shifts: [
        "Access talent faster without extended hiring cycles.",
        "Turn multiple operational costs into a structured engagement.",
        "Scale capacity as your roadmap and business demand change.",
        "Build continuity beyond individual resources.",
      ],
      cards: [
        {
          title: "Resource augmentation",
          icon: "customers",
          description:
            "Add individual technology professionals to address skill gaps, increase delivery capacity, or support specific project requirements.",
        },
        {
          title: "Dedicated team",
          icon: "partnership",
          description:
            "A team of engineers, QA specialists, designers, analysts, and technical leads works around your product roadmap and delivery objectives.",
        },
        {
          title: "Managed outsourcing",
          icon: "management",
          description:
            "Sumago takes broader responsibility for team management, delivery governance, quality, reporting, and operational execution against agreed objectives.",
        },
      ],
    },
    valueDrivers: [
      {
        title: "Access talent faster",
        icon: "efficiency",
        description:
          "Access vetted technology professionals and delivery teams based on technical skills, experience, and project requirements.",
      },
      {
        title: "Improve cost predictability",
        icon: "payments",
        description:
          "Reduce the overhead associated with recruitment, infrastructure, workspace, employee administration, supervision, and resource management.",
      },
      {
        title: "Scale with business demand",
        icon: "compliance",
        description:
          "Adapt team size, roles, and technical expertise based on project phases, delivery requirements, and business priorities.",
      },
      {
        title: "Reduce delivery risk",
        icon: "support",
        description:
          "Dedicated resources are supported by a wider technical ecosystem, helping address complex challenges, resource availability, and knowledge continuity.",
      },
    ],
    whatWeBuild: [
      {
        title: "Software engineering",
        icon: "engineering",
        purpose:
          "Develop, enhance, and maintain applications across modern technology stacks with dedicated engineering capacity.",
        value: "Engineering capability aligned to your product and delivery requirements.",
        features: [
          "Application development",
          "Modern technology stacks",
          "Product enhancement",
          "Ongoing maintenance",
          "Dedicated capacity",
        ],
      },
      {
        title: "Quality engineering & QA",
        icon: "quality",
        purpose:
          "Strengthen software quality through functional testing, automation, regression testing, performance validation, and structured QA processes.",
        value: "Quality support that helps delivery remain reliable as it scales.",
        features: [
          "Functional testing",
          "Test automation",
          "Regression testing",
          "Performance validation",
          "Structured QA processes",
        ],
      },
      {
        title: "UI/UX design",
        icon: "interface",
        purpose:
          "Design intuitive digital experiences aligned with your product requirements, user needs, and business objectives.",
        value: "Experiences that connect user needs with clear business objectives.",
        features: [
          "Product requirements",
          "User needs",
          "Experience design",
          "Business objectives",
          "Design collaboration",
        ],
      },
      {
        title: "Business analysis",
        icon: "advisory",
        purpose:
          "Translate business requirements into structured functional specifications, workflows, documentation, and actionable development requirements.",
        value: "A clearer path from business requirement to technology delivery.",
        features: [
          "Functional specifications",
          "Workflow definition",
          "Documentation",
          "Development requirements",
          "Business alignment",
        ],
      },
      {
        title: "Cloud & DevOps",
        icon: "infrastructure",
        purpose:
          "Support cloud infrastructure, CI/CD, deployment automation, monitoring, scalability, and operational reliability.",
        value: "Infrastructure and delivery practices that support reliable operations.",
        features: [
          "Cloud infrastructure",
          "CI/CD",
          "Deployment automation",
          "Monitoring",
          "Scalability & reliability",
        ],
      },
    ],
    howItHelps: [
      {
        before: "Long recruitment and hiring cycles",
        after: "Faster access to qualified technology professionals",
      },
      {
        before: "Difficulty finding specialised skills",
        after: "Access to a broader multidisciplinary talent pool",
      },
      {
        before: "Fluctuating project requirements",
        after: "Flexible capacity that can scale with demand",
      },
      {
        before: "Increasing operational overhead",
        after: "A structured and predictable engagement model",
      },
      {
        before: "Dependency on individual contributors",
        after: "Team-level support and knowledge continuity",
      },
      {
        before: "Limited internal technology capacity",
        after: "Additional engineering capability without expanding the entire organization",
      },
      {
        before: "Need for faster project execution",
        after: "Dedicated resources aligned to defined priorities",
      },
    ],
    industries: [
      {
        name: "Software & Product Companies",
        useCase:
          "Extend engineering capacity, accelerate product development, or access specialised expertise without disrupting the existing technology organization.",
      },
      {
        name: "Startups & Scale-ups",
        useCase:
          "Build technology capabilities quickly while maintaining flexibility and avoiding the fixed operational burden of a large internal engineering organization.",
      },
      {
        name: "Enterprises",
        useCase:
          "Support transformation programs, technology modernization, application development, and non-core technology functions under structured governance.",
      },
      {
        name: "Agencies & Consultancies",
        useCase:
          "Expand delivery capacity based on project demand without maintaining a large permanent workforce between engagements.",
      },
      {
        name: "Financial Services",
        useCase:
          "Access technology and engineering capabilities for digital platforms, application modernization, integrations, automation, and technology operations.",
      },
      {
        name: "Healthcare & Other Regulated Industries",
        useCase:
          "Extend technology teams while maintaining structured processes, documentation, governance, and delivery oversight.",
      },
    ],
    process: [
      {
        title: "Understand requirements",
        description:
          "Define the business objective, project scope, required skills, technology stack, seniority, responsibilities, and expected outcomes.",
        icon: "discovery",
      },
      {
        title: "Define the engagement",
        description:
          "Determine the most appropriate model — resource augmentation, dedicated resource, dedicated team, or managed outsourcing.",
        icon: "management",
      },
      {
        title: "Identify the right talent",
        description:
          "Evaluate professionals based on technical capability, relevant experience, domain knowledge, and project fit.",
        icon: "customers",
      },
      {
        title: "Evaluate & onboard",
        description:
          "Complete technical evaluation and integrate selected resources into your tools, processes, technology environment, and delivery workflows.",
        icon: "integrations",
      },
      {
        title: "Deliver & monitor",
        description:
          "Execute against agreed priorities with transparent progress tracking, communication, reporting, and quality processes.",
        icon: "delivery",
      },
      {
        title: "Review & optimise",
        description:
          "Regularly review performance, delivery progress, resource requirements, and emerging risks to ensure continued alignment.",
        icon: "analytics",
      },
      {
        title: "Scale as required",
        description:
          "Increase, reduce, or restructure the team as project requirements, business priorities, and delivery needs evolve.",
        icon: "growth",
      },
    ],
    whyUs: [
      {
        title: "Proven technology expertise",
        description:
          "Access professionals across engineering, design, QA, cloud, AI, business analysis, and technical leadership.",
      },
      {
        title: "Structured resource management",
        description:
          "Defined processes for resource selection, onboarding, performance management, knowledge sharing, and continuity.",
      },
      {
        title: "Multidisciplinary support",
        description:
          "Dedicated resources are backed by architects, engineers, QA specialists, designers, analysts, and technology experts.",
      },
      {
        title: "Transparent reporting",
        description:
          "Clear communication, progress visibility, performance tracking, and regular reporting throughout the engagement.",
      },
      {
        title: "Flexible engagement models",
        description:
          "Choose the level of support that matches your requirements — from individual resources to fully managed delivery teams.",
      },
      {
        title: "Business-first approach",
        description:
          "Business objectives and operational requirements shape the right technology and engagement model.",
      },
      {
        title: "Engineering quality",
        description:
          "Structured development, QA, documentation, code review, and delivery practices support reliable, scalable outcomes.",
      },
      {
        title: "Long-term partnership",
        description:
          "Support immediate capacity requirements as well as long-term technology growth.",
      },
    ],
    standoutPoints: [
      "Proven technology expertise",
      "Structured resource management",
      "Multidisciplinary support",
      "Transparent reporting",
      "Flexible engagement models",
    ],
    closingLine:
      "Build and scale the technology capabilities your business needs with greater predictability, flexibility, and delivery confidence.",
  },
  {
    name: "IoT & Connected Products",
    heroStatement: "Know what your equipment is doing before a customer tells you.",
    heroCta: "See how it connects",
    buildMock: "telemetry",
    icon: "Cpu",
    phase: "Building",
    blurb: "Connect devices, data, and software into products that sense and respond.",
    problem:
      "Assets in the field go dark between check-ins, so problems reach you as customer complaints instead of alerts you could have acted on.",
    summary:
      "Assets in the field go dark between check-ins, so problems reach you as complaints instead of alerts you could have acted on. A connected product closes that gap — device to dashboard — turning silent equipment into a live signal you can see, respond to, and improve on.",
    approach:
      "Engineer the full stack — devices, connectivity, cloud, and analytics — with security throughout.",
    deliverables: [
      "Device-to-dashboard architecture",
      "Secure connectivity and provisioning",
      "Real-time telemetry and alerting",
      "Fleet management and an over-the-air update path",
    ],
    outcomes: ["Real-time visibility", "Smarter operations", "New product capabilities"],
    technologies: ["IoT platforms", "Edge devices", "MQTT / protocols", "Cloud & analytics"],
    tools: ["Python", "Node.js", "AWS", "Docker", "Kubernetes"],
    understanding: {
      title: "What a connected product changes for your business.",
      narrative: [
        "A connected product is a physical thing that reports what it is doing and can be acted on from a distance. A sensor reads the world, a device sends that reading over a network, the cloud stores and makes sense of it, and a dashboard or an automated rule responds. The whole point is to close the loop between something happening in the field and someone — or something — knowing about it in time to matter.",
        "Built well, it changes the relationship with the product itself. A machine that used to be sold and forgotten becomes a source of live data, a service you can keep improving, and a warning system that surfaces a fault before it becomes a failure. The hard part is not any single layer — it is engineering the whole stack, device to dashboard, so it stays secure and reliable across thousands of units in places you do not control.",
      ],
      shifts: [
        "Equipment moves from silent between visits to reporting continuously.",
        "Problems arrive as alerts to act on, not complaints to apologise for.",
        "Maintenance shifts from fixed schedules to what the data says is needed.",
        "A one-time sale becomes an ongoing, data-backed service relationship.",
      ],
      cards: [
        {
          title: "Connected products",
          icon: "devices",
          description:
            "Consumer or commercial devices that pair, report, and can be controlled remotely from an app or a dashboard.",
        },
        {
          title: "Industrial & operational IoT",
          icon: "business",
          description:
            "Machines, vehicles, and infrastructure monitored for uptime and efficiency where downtime is the real cost.",
        },
        {
          title: "Remote monitoring & control",
          icon: "iot",
          description:
            "Assets in the field watched and acted on from a single dashboard, without sending anyone to site to find out.",
        },
      ],
    },
    valueDrivers: [
      {
        title: "Visibility into the field",
        icon: "analytics",
        description:
          "The state of every asset, live, instead of a guess between check-ins — which is what turns an estate into something you can manage.",
      },
      {
        title: "Problems surface as alerts",
        icon: "notifications",
        description:
          "A fault is flagged while there is still time to act, rather than after it has already failed in front of a customer.",
      },
      {
        title: "Maintenance when it's needed",
        icon: "efficiency",
        description:
          "Condition data replaces the fixed calendar, cutting both unplanned downtime and the service visits that weren't needed.",
      },
      {
        title: "A new service relationship",
        icon: "growth",
        description:
          "A physical product gains ongoing data, upgrades, and a reason for the customer to stay connected to it.",
      },
    ],
    whatWeBuild: [
      {
        title: "Device-to-dashboard architecture",
        icon: "engineering",
        purpose:
          "The full path a reading travels — sensor, device, network, cloud, dashboard — designed as one system, so the number that reaches the screen is the number the sensor measured, on time and every time, across every unit in the field.",
        value: "The number on the screen is the number the sensor measured.",
        features: [
          "Full-stack design",
          "Edge & device layer",
          "Cloud ingestion",
          "Data pipeline",
          "Dashboard & API",
        ],
      },
      {
        title: "Secure connectivity & provisioning",
        icon: "security",
        purpose:
          "How a device gets onto the network and proves it is the device it claims to be. Identity, encryption, and onboarding are engineered so a unit in the field cannot become a way into the business — because it sits outside your walls by design.",
        value: "A unit in the field never becomes a way into the business.",
        features: [
          "Device identity & certificates",
          "Encrypted transport (TLS)",
          "Zero-touch provisioning",
          "Access control",
          "Secure boot",
        ],
      },
      {
        title: "Real-time telemetry & alerting",
        icon: "notifications",
        purpose:
          "The live signal — readings streamed in, made sense of, and turned into an alert the moment a value crosses a threshold — so a rising temperature or a stalled machine reaches someone while it can still be acted on.",
        value: "A threshold crossed reaches a person while it still matters.",
        features: [
          "Live telemetry streaming",
          "Threshold & anomaly alerts",
          "Time-series storage",
          "Dashboards & visualisation",
          "Event notifications",
        ],
      },
      {
        title: "Remote control & automation",
        icon: "automation",
        purpose:
          "Acting on a device from a distance, safely — a setting changed, a valve closed, a rule that responds without a person — with the confirmation and safeguards that keep a remote command from causing a problem it was meant to prevent.",
        value: "A remote command that can't cause the problem it was meant to prevent.",
        features: [
          "Remote commands",
          "Rule-based automation",
          "Command confirmation",
          "Safe-state fallback",
          "Scheduling",
        ],
      },
      {
        title: "Fleet management & OTA updates",
        icon: "management",
        purpose:
          "Running thousands of units as one estate — knowing each one's health, and pushing new firmware over the air without a technician visiting every site, so a fix or a feature reaches the whole fleet in a controlled rollout.",
        value: "A fix reaches the whole fleet without a technician per site.",
        features: [
          "Fleet dashboard",
          "Over-the-air updates",
          "Staged rollout",
          "Device grouping",
          "Health & battery monitoring",
        ],
      },
      {
        title: "Analytics on device data",
        icon: "analytics",
        purpose:
          "The value that emerges once the readings accumulate — usage patterns, failure prediction, and efficiency insight — turning a stream of numbers into decisions about maintenance, design, and how the product is actually used.",
        value: "A stream of numbers becomes decisions about the product itself.",
        features: [
          "Usage analytics",
          "Predictive maintenance",
          "Efficiency insights",
          "Historical reporting",
          "Data export & integration",
        ],
      },
    ],
    howItHelps: [
      {
        before: "Assets that go dark between site visits",
        after: "A live view of every unit's state, continuously",
      },
      {
        before: "Faults you hear about as customer complaints",
        after: "Alerts the moment a reading crosses a threshold",
      },
      {
        before: "Maintenance on a fixed calendar, needed or not",
        after: "Service driven by what the condition data says",
      },
      {
        before: "A technician sent to every site for a firmware fix",
        after: "Updates pushed over the air, across the fleet, in a controlled rollout",
      },
      {
        before: "A product sold once and never heard from again",
        after: "An ongoing, data-backed service relationship",
      },
    ],
    industries: [
      {
        name: "Manufacturing",
        useCase:
          "Machines reporting condition and output, so downtime is predicted and lines keep running.",
      },
      {
        name: "Logistics & Transportation",
        useCase:
          "Vehicles and cargo tracked live, with temperature, location, and exception alerts from the road.",
      },
      {
        name: "Healthcare",
        useCase:
          "Connected equipment reporting status and usage under the controls sensitive data demands.",
      },
      {
        name: "Real Estate",
        useCase:
          "Building systems, meters, and access monitored remotely across a portfolio rather than site by site.",
      },
      {
        name: "Hospitality & Tourism",
        useCase:
          "Property equipment and energy use monitored centrally, so faults reach maintenance before guests do.",
      },
      {
        name: "Government & Public Sector",
        useCase:
          "Utilities and public infrastructure monitored remotely for consumption, faults, and demand.",
      },
    ],
    process: [
      {
        title: "Define the signal",
        description:
          "What the product needs to sense, control, and report, and why it matters commercially.",
        icon: "discovery",
      },
      {
        title: "Design the stack",
        description:
          "Device, connectivity, cloud, and dashboard architected as one system.",
        icon: "engineering",
      },
      {
        title: "Prototype",
        description:
          "A working device-to-dashboard path proven on real hardware, early.",
        icon: "devices",
      },
      {
        title: "Secure it",
        description:
          "Identity, encryption, and provisioning engineered before scale, not after.",
        icon: "security",
      },
      {
        title: "Build the platform",
        description:
          "Telemetry, alerting, control, and the fleet dashboard.",
        icon: "platform",
      },
      {
        title: "Pilot in the field",
        description:
          "A small deployment tested in the conditions the product will actually live in.",
        icon: "quality",
      },
      {
        title: "Roll out",
        description:
          "Provisioning at scale, with over-the-air updates and monitoring in place.",
        icon: "delivery",
      },
      {
        title: "Operate & improve",
        description:
          "Fleet health, predictive maintenance, and the next capability, from the team that built it.",
        icon: "partnership",
      },
    ],
    standoutPoints: [
      "Full-stack engineering",
      "Secure by design",
      "Reliable at fleet scale",
      "Real-time visibility",
      "Long-term partner",
    ],
    closingLine:
      "When your equipment reports for itself, a problem becomes an alert you act on instead of a complaint you answer.",
  },
  {
    name: "Enterprise Software Engineering",
    heroStatement: "Replace the system the business runs on, without stopping the business.",
    heroCta: "See how it works",
    buildMock: "console",
    icon: "Server",
    phase: "Building",
    blurb: "Robust, scalable systems that run core operations reliably.",
    problem:
      "The system the business runs on is old, fragile, and understood by two people — so every change is a risk, and standing still is starting to cost more than moving.",
    summary:
      "Robust, scalable systems for core operations — architecture-first, strongly typed, secure from day one, and migrated in stages so the work never has to pause for the upgrade.",
    approach:
      "Architecture-first delivery with strong typing, clean code, and security built in from day one.",
    deliverables: [
      "Architecture and a staged migration plan",
      "A typed, tested, documented codebase",
      "Security and access model",
      "Runbook and full handover",
    ],
    outcomes: ["Scalable, maintainable systems", "Lower total cost of ownership", "Faster, safer releases"],
    technologies: ["Node.js / NestJS", "React / Next.js", "PostgreSQL", "Cloud-native"],
    tools: ["Node.js", "Python", "MongoDB", "AWS", "Docker", "Kubernetes"],
    stories: ["mamastops-logistics-platform"],
    understanding: {
      title: "What enterprise software really carries.",
      narrative: [
        "Enterprise software is the system a business actually runs on — the place orders, records, approvals, and money move. It is rarely the newest thing a company owns and almost always the most load-bearing, which is exactly why replacing it feels dangerous.",
        "The risk is never the new system on its own. It is the cutover — moving live operations from something fragile and half-understood onto something new without losing a day of work or a row of data. Handled in stages, that stops being a leap and becomes a sequence.",
      ],
      shifts: [
        "Core systems moved from “keep it running” to “it decides how fast we can move.”",
        "Standing still on old software became more expensive than replacing it.",
        "Migration stopped being one risky launch and became a staged, reversible sequence.",
        "The system of record became the thing every other tool has to agree with.",
      ],
      cards: [
        {
          title: "Legacy modernisation",
          icon: "transformation",
          description:
            "An old, fragile platform re-architected and migrated in stages, without a big-bang cutover.",
        },
        {
          title: "Custom business systems",
          icon: "business",
          description:
            "ERP, workflow, and internal tooling built to how the business actually runs, not to a package's assumptions.",
        },
        {
          title: "Integration & consolidation",
          icon: "integrations",
          description:
            "The systems that don't talk connected into one source of truth, so the data stops disagreeing.",
        },
      ],
    },
    valueDrivers: [
      {
        title: "Fragility replaced with maintainable code",
        icon: "engineering",
        description:
          "Typed, tested, and documented, so a change stops being a risk that only two people in the building can carry.",
      },
      {
        title: "Lower total cost of ownership",
        icon: "payments",
        description:
          "One system your team can extend, instead of a licence and a specialist billed for every modification.",
      },
      {
        title: "Faster, safer releases",
        icon: "delivery",
        description:
          "A pipeline and a rehearsed rollback turn deployment into a decision rather than an event the business schedules around.",
      },
      {
        title: "Scale you won't outgrow next year",
        icon: "infrastructure",
        description:
          "Architecture built for the load expected in year three, not only for the load present on the day it launches.",
      },
    ],
    whatWeBuild: [
      {
        title: "Legacy modernisation",
        icon: "transformation",
        purpose:
          "An old, fragile platform re-architected into a typed, tested codebase and migrated in stages — so the system stops being understood by two people and the business never pauses for the upgrade.",
        value: "The upgrade stops requiring the business to stop.",
        features: [
          "Architecture review",
          "Staged migration",
          "Data migration",
          "Zero-downtime cutover",
          "Full documentation",
        ],
      },
      {
        title: "Custom ERP & business systems",
        icon: "business",
        purpose:
          "The system core operations run on — orders, inventory, finance, HR, workflow — built to how the business actually works rather than bent around a package's assumptions.",
        value: "The system fits the operation instead of the operation fitting the package.",
        features: [
          "Workflow engines",
          "Records & reporting",
          "Roles & permissions",
          "Approvals",
          "Audit trail",
        ],
      },
      {
        title: "Systems integration",
        icon: "integrations",
        purpose:
          "The tools that don't talk connected into one source of truth, so a record entered once is the same record everywhere and the data stops disagreeing.",
        value: "Entered once, the same everywhere.",
        features: [
          "API design",
          "ERP/CRM connectors",
          "Message queues",
          "Data sync",
          "Legacy adapters",
        ],
      },
      {
        title: "Data platform & migration",
        icon: "platform",
        purpose:
          "Moving live operational data onto the new system safely — cleaned, validated, and reconciled — with a rehearsed path back if a step doesn't hold.",
        value: "Every step has a way back that has already been rehearsed.",
        features: [
          "Schema design",
          "ETL pipelines",
          "Data validation",
          "Reconciliation",
          "Reversible cutover",
        ],
      },
      {
        title: "Security & access model",
        icon: "security",
        purpose:
          "Authentication, authorisation, and audit built in from day one rather than reviewed before launch — treated as part of the system, because the system holds the business's most sensitive records.",
        value: "Security as part of the build, not a review before launch.",
        features: [
          "Single sign-on",
          "Role-based access",
          "Encryption",
          "Audit logging",
          "Compliance controls",
        ],
      },
      {
        title: "Reporting & operations console",
        icon: "analytics",
        purpose:
          "The admin surface the business is actually run from — records, status, and the numbers leadership checks — with a runbook and monitoring so operating it doesn't depend on the people who built it.",
        value: "Running it doesn't depend on the people who built it.",
        features: [
          "Admin dashboards",
          "Operational reporting",
          "Alerting",
          "Runbooks",
          "Observability",
        ],
      },
    ],
    howItHelps: [
      {
        before: "A core system only two people fully understand",
        after: "A typed, tested, documented codebase any engineer can maintain",
      },
      {
        before: "Every change to the platform is a risk nobody wants to take",
        after: "Changes shipped in small, reversible increments",
      },
      {
        before: "A licence and a specialist billed for every modification",
        after: "One system your own team extends, at a lower total cost",
      },
      {
        before: "Data that disagrees between disconnected tools",
        after: "One source of truth every system reconciles against",
      },
      {
        before: "A replacement that means stopping the business to switch over",
        after: "A staged migration that keeps operations running throughout",
      },
    ],
    industries: [
      {
        name: "Manufacturing",
        useCase:
          "Production, inventory, and procurement systems that replace spreadsheets and disconnected tools with one operational record.",
      },
      {
        name: "Logistics & Transportation",
        useCase:
          "Order, dispatch, and tracking platforms built to handle scale and surface exceptions in time to act.",
      },
      {
        name: "Banking & Financial Services",
        useCase:
          "Core systems where every transaction is authenticated, auditable, and inside regulatory control.",
      },
      {
        name: "Healthcare",
        useCase:
          "Records, scheduling, and administration systems built to protect sensitive data and lift load off clinical staff.",
      },
      {
        name: "Retail & E-commerce",
        useCase:
          "ERP and point-of-sale systems that keep stock, pricing, and fulfilment consistent across every channel.",
      },
      {
        name: "Government & Public Sector",
        useCase:
          "Case-management and administrative systems built to accessibility, audit, and procurement standards.",
      },
    ],
    process: [
      {
        title: "Discovery",
        description:
          "How the business actually runs today, and where the current system is genuinely the constraint.",
        icon: "discovery",
      },
      {
        title: "Architecture",
        description:
          "The target design, data model, and integration boundaries, chosen for year-three load.",
        icon: "engineering",
      },
      {
        title: "Migration plan",
        description:
          "The sequence of stages, each independently shippable, each with a way back.",
        icon: "management",
      },
      {
        title: "Build",
        description:
          "Typed, tested increments delivered against clear acceptance, not a single distant milestone.",
        icon: "delivery",
      },
      {
        title: "Data migration",
        description:
          "Cleaned, validated, and reconciled so the numbers match on both sides of the move.",
        icon: "platform",
      },
      {
        title: "Security & quality",
        description:
          "Access model, encryption, and automated testing verified before anything goes live.",
        icon: "security",
      },
      {
        title: "Cutover",
        description:
          "A phased, rehearsed switch, with the old system on standby until the new one is proven.",
        icon: "infrastructure",
      },
      {
        title: "Handover & support",
        description:
          "Runbook, documentation, and a team that keeps improving the system it built.",
        icon: "partnership",
      },
    ],
    standoutPoints: [
      "Architecture-first",
      "Certified engineering",
      "Staged, reversible migration",
      "Secure by design",
      "Built to hand over",
    ],
    closingLine:
      "The risk was never the new system. It was the switch — so one dangerous launch becomes a sequence of safe, reversible steps.",
  },
  {
    name: "Product Engineering",
    heroStatement: "Find out whether the idea works before you fund the whole build.",
    heroCta: "See how it works",
    buildMock: "multi",
    icon: "Boxes",
    phase: "Designing",
    blurb: "From idea to shipped product — and evolving with you.",
    problem:
      "There's an idea and a budget, but no proof anyone wants it — and a full build is the most expensive possible way to find out.",
    summary:
      "From concept to shipped product and beyond — a lean MVP aimed at the riskiest assumption, instrumented from day one, then iterated on real usage toward product-market fit.",
    approach:
      "Lean MVP-first delivery, then iterate on real usage data toward product-market fit.",
    deliverables: [
      "An MVP scoped to the riskiest assumption",
      "A shipped product with usage instrumentation",
      "An iteration roadmap driven by real data",
      "Design system and component library",
    ],
    outcomes: ["Validated products", "Reduced build risk", "Continuous improvement"],
    technologies: ["Product strategy", "Agile delivery", "Design systems", "Analytics"],
    tools: ["Figma", "React", "Node.js", "Linear", "Miro", "GitHub"],
    understanding: {
      title: "What product engineering actually de-risks.",
      narrative: [
        "Most product ideas fail not because they're built badly but because nobody wanted them — and a full build is the most expensive possible way to discover that. Product engineering flips the order: it finds the answer to “does anyone want this” before the whole budget is committed.",
        "That means treating the first version as an instrument, not a monument. Scope it to the one assumption most likely to be wrong, ship it to real users, and let their behaviour — not a meeting — decide what gets built next.",
      ],
      shifts: [
        "Product decisions moved from opinion in a room to evidence from real usage.",
        "The first release stopped being the finish line and became the first measurement.",
        "Risk moved earlier — proven cheaply up front instead of discovered after launch.",
        "Design, engineering, and data stopped being phases and became one loop.",
      ],
      cards: [
        {
          title: "MVP & validation",
          icon: "discovery",
          description:
            "The smallest thing that tests the riskiest assumption with real users — not a survey about what they might do.",
        },
        {
          title: "Full product build",
          icon: "engineering",
          description:
            "Once the idea holds, the same team builds it out across web, mobile, and the services behind them.",
        },
        {
          title: "Product evolution",
          icon: "growth",
          description:
            "Instrumentation, feedback, and iteration keeping the product moving toward fit after launch.",
        },
      ],
    },
    valueDrivers: [
      {
        title: "Proof before the full spend",
        icon: "discovery",
        description:
          "An MVP answers the market question while the budget is still mostly unspent, which is the cheapest moment to be wrong.",
      },
      {
        title: "Reduced build risk",
        icon: "security",
        description:
          "The assumption most likely to sink the idea gets tested first, deliberately, instead of surfacing after launch.",
      },
      {
        title: "Decisions from data, not debate",
        icon: "analytics",
        description:
          "Usage instrumentation replaces opinion in the room, so the roadmap argument has an answer rather than a winner.",
      },
      {
        title: "A product that keeps improving",
        icon: "partnership",
        description:
          "One team from concept through iteration, rather than a handoff at launch to people learning the code from scratch.",
      },
    ],
    whatWeBuild: [
      {
        title: "MVP & rapid prototyping",
        icon: "discovery",
        purpose:
          "The smallest buildable version of the idea, scoped to the one assumption most likely to be wrong and shipped to real users — so the market answers the question before the full budget is committed.",
        value: "The market answers before the budget is committed.",
        features: [
          "Assumption mapping",
          "Rapid prototyping",
          "Scoped MVP",
          "Usable release",
          "Early user testing",
        ],
      },
      {
        title: "Product strategy & discovery",
        icon: "advisory",
        purpose:
          "The commercial thinking before the build — who it's for, what success looks like, and what deliberately stays out of version one — so effort lands where it changes the outcome.",
        value: "What stays out of version one, decided on purpose.",
        features: [
          "Market & user research",
          "Success metrics",
          "Roadmap",
          "Scope definition",
          "Risk prioritisation",
        ],
      },
      {
        title: "Experience & product design",
        icon: "experience",
        purpose:
          "Screens and flows designed as a reusable system before they're built, and validated on real users — so the product feels considered and the next feature has something to inherit.",
        value: "The next feature inherits something instead of starting over.",
        features: [
          "UX research",
          "Design system",
          "Interaction design",
          "Prototypes",
          "Usability testing",
        ],
      },
      {
        title: "Full-stack product build",
        icon: "engineering",
        purpose:
          "Once the idea holds, the same team builds it out across the surfaces it needs — web, mobile, and the services and APIs behind them — as one product on one data layer, not three that drift apart.",
        value: "One product on one data layer, not three that drift apart.",
        features: [
          "Web app",
          "Mobile app",
          "API & services",
          "Shared data layer",
          "Cloud delivery",
        ],
      },
      {
        title: "Analytics & product instrumentation",
        icon: "analytics",
        purpose:
          "Usage, funnels, and retention wired in from the first release — so “what do we build next” has an answer from behaviour instead of a theory from a meeting.",
        value: "“What next” answered by behaviour rather than by theory.",
        features: [
          "Event tracking",
          "Funnels & retention",
          "Feature flags",
          "A/B testing",
          "Product dashboards",
        ],
      },
      {
        title: "Iteration & product evolution",
        icon: "growth",
        purpose:
          "The loop after launch — release, measure, learn, repeat — run by a team that already knows the code, moving the product toward fit rather than parking it at version one.",
        value: "The product keeps moving instead of parking at version one.",
        features: [
          "Release cadence",
          "Feedback loops",
          "Data-driven roadmap",
          "Continuous delivery",
          "Ongoing support",
        ],
      },
    ],
    howItHelps: [
      {
        before: "An idea and a budget, but no proof anyone wants it",
        after: "An MVP that tests the riskiest assumption before the full spend",
      },
      {
        before: "A full build funded on a hunch",
        after: "Risk retired early, cheaply, with real users",
      },
      {
        before: "Roadmap decided by whoever argues hardest in the room",
        after: "A roadmap driven by what usage data actually shows",
      },
      {
        before: "A product handed over and left to stall at launch",
        after: "One team iterating it toward product-market fit",
      },
      {
        before: "Features shipped with no way to tell if they landed",
        after: "Instrumentation that shows what's used and what isn't",
      },
    ],
    industries: [
      {
        name: "Startups & founders",
        useCase:
          "Validate the idea and reach a shippable MVP before raising or committing the full build.",
      },
      {
        name: "Enterprises & innovation teams",
        useCase:
          "Test a new product line at the edge of the business without betting the core on it.",
      },
      {
        name: "SaaS companies",
        useCase:
          "Take a feature or product from concept to instrumented release and iterate on real usage.",
      },
      {
        name: "Funded ventures",
        useCase:
          "Turn an investment thesis into a working product with the evidence to back the next round.",
      },
      {
        name: "Marketplaces & platforms",
        useCase:
          "Validate two-sided demand with a focused MVP before building the full network.",
      },
    ],
    process: [
      {
        title: "Discovery",
        description:
          "The commercial goal, the target user, and the assumptions the idea depends on.",
        icon: "discovery",
      },
      {
        title: "Prioritise the risk",
        description:
          "The one thing most likely to be wrong, chosen as what version one must test.",
        icon: "security",
      },
      {
        title: "Design",
        description:
          "Flows and interface designed as a system and validated with real users before the build.",
        icon: "experience",
      },
      {
        title: "Build the MVP",
        description:
          "The smallest usable version, instrumented from the first release.",
        icon: "delivery",
      },
      {
        title: "Ship & measure",
        description:
          "Into real users' hands, with usage, funnels, and retention observable from day one.",
        icon: "analytics",
      },
      {
        title: "Learn",
        description:
          "Behaviour, not opinion, deciding what holds and what changes.",
        icon: "quality",
      },
      {
        title: "Iterate",
        description:
          "Build out what worked, cut what didn't, and move toward product-market fit.",
        icon: "growth",
      },
      {
        title: "Scale",
        description:
          "The validated product built out across the surfaces and load it now has to carry.",
        icon: "infrastructure",
      },
    ],
    standoutPoints: [
      "Risk retired early",
      "Evidence over opinion",
      "One team, concept to scale",
      "Instrumented from day one",
      "Built to keep evolving",
    ],
    closingLine:
      "A full build is the most expensive way to find out an idea doesn't work — so the answer comes first, for a fraction of it.",
  },
  {
    name: "Cloud & DevOps Engineering",
    heroStatement: "Release faster, stay up, and stop the cloud bill climbing.",
    heroCta: "See how it works",
    buildMock: "pipeline",
    icon: "Cloud",
    phase: "Building",
    blurb: "Modern infrastructure for reliability, scale, and speed.",
    problem:
      "Releases are slow and nerve-wracking, the cloud bill climbs every month, and outages are reported by customers before monitoring catches them.",
    summary:
      "Cloud-native infrastructure that ships changes in minutes, recovers from failure on its own, and reports what it costs — so releasing stops being an event and staying online stops being luck.",
    approach: "Cloud-native architecture with CI/CD, observability, and cost discipline.",
    deliverables: [
      "Infrastructure as code",
      "CI/CD pipeline with a safe rollback path",
      "Observability, alerting, and an on-call runbook",
      "Cloud cost baseline and optimization plan",
    ],
    outcomes: ["Higher uptime", "Faster deployments", "Optimized cloud spend"],
    technologies: ["AWS / Azure / GCP", "Docker", "CI/CD", "Infrastructure as Code"],
    tools: ["AWS", "Azure", "Docker", "Kubernetes", "GitLab", "GitHub"],
    understanding: {
      title: "What cloud and DevOps engineering means for your business.",
      narrative: [
        "Cloud and DevOps is the machinery that gets code from a developer's laptop into customers' hands safely, and keeps it running once it's there. It covers how software is built, tested, and released, how the servers behind it scale and heal, and how you find out something is wrong — ideally before a customer does.",
        "Done well, it disappears into the background: releases become routine, capacity follows demand, and the monthly bill maps to what the business actually uses. Done badly, it becomes the reason every launch slips, every outage is a surprise, and the cloud invoice climbs with no one able to say why.",
      ],
      shifts: [
        "Releases moved from scheduled events to something that happens many times a day.",
        "Infrastructure moved from hand-configured servers to code you can review and rebuild.",
        "Outages moved from customer reports to alerts that fire before impact.",
        "Cloud spend moved from a fixed line item to something engineering can measure and control.",
      ],
      cards: [
        {
          title: "Cloud infrastructure",
          icon: "infrastructure",
          description:
            "The environments your software runs on, defined as code so they're consistent, repeatable, and rebuildable.",
        },
        {
          title: "Delivery pipelines",
          icon: "automation",
          description:
            "The automated path from commit to production, with testing and rollback built in so a bad release is caught, not shipped.",
        },
        {
          title: "Observability & reliability",
          icon: "quality",
          description:
            "The monitoring, alerting, and on-call practice that keeps the system up and tells you the moment it isn't.",
        },
      ],
    },
    valueDrivers: [
      {
        title: "Ship more, break less",
        icon: "delivery",
        description:
          "An automated pipeline lets teams release often and safely, so features reach users without a launch-day gamble.",
      },
      {
        title: "Uptime you can stand behind",
        icon: "security",
        description:
          "Self-healing infrastructure and real monitoring keep the service available and shorten every outage that does happen.",
      },
      {
        title: "A cloud bill you can explain",
        icon: "payments",
        description:
          "Spend is measured against usage, and waste gets found and removed instead of quietly accruing month after month.",
      },
      {
        title: "Scale without a rebuild",
        icon: "infrastructure",
        description:
          "Capacity follows demand automatically, so a good day for the business isn't a bad day for the system.",
      },
    ],
    whatWeBuild: [
      {
        title: "Cloud architecture & migration",
        icon: "infrastructure",
        purpose:
          "Environments designed for the workload — right-sized, secure, and built to grow — whether that means a new cloud-native setup or moving an existing system off ageing infrastructure without a risky big-bang cutover.",
        value: "The environment fits the workload, and the move happens in phases.",
        features: [
          "AWS",
          "Azure",
          "Google Cloud",
          "Well-architected reviews",
          "Phased migration",
        ],
      },
      {
        title: "Infrastructure as code",
        icon: "engineering",
        purpose:
          "Every server, network, and service defined in code and version-controlled, so environments are consistent, reviewable, and rebuildable from scratch — no more configuration that lives only in one person's memory.",
        value: "No configuration that lives only in one person's memory.",
        features: [
          "Terraform",
          "Reproducible environments",
          "Change review",
          "Drift detection",
          "Fast recovery",
        ],
      },
      {
        title: "CI/CD pipelines",
        icon: "automation",
        purpose:
          "The automated path from commit to production — build, test, and deploy running on every change, with a rehearsed rollback so a bad release is reversed in minutes rather than debugged in front of customers.",
        value: "A bad release is reversed in minutes, not debugged in public.",
        features: [
          "Automated builds",
          "Test gates",
          "Progressive rollout",
          "One-click rollback",
          "Release visibility",
        ],
      },
      {
        title: "Containers & orchestration",
        icon: "platform",
        purpose:
          "Applications packaged to run the same everywhere and scheduled across a cluster that scales them up under load and heals failed instances on its own, so demand spikes and dead nodes stop being outages.",
        value: "Demand spikes and dead nodes stop being outages.",
        features: [
          "Docker",
          "Kubernetes",
          "Auto-scaling",
          "Self-healing",
          "Zero-downtime deploys",
        ],
      },
      {
        title: "Observability & monitoring",
        icon: "analytics",
        purpose:
          "Metrics, logs, and traces wired in from the start, with alerts tuned to fire on real problems — so the team learns about an issue from a dashboard, not a support ticket, and can see where it started.",
        value: "The team hears it from a dashboard, not from a customer.",
        features: [
          "Metrics & logs",
          "Distributed tracing",
          "Alerting",
          "Dashboards",
          "On-call runbooks",
        ],
      },
      {
        title: "Cloud cost & security",
        icon: "security",
        purpose:
          "A baseline of what the cloud actually costs and where it's wasted, alongside hardening — access control, secrets management, and network security — so the environment stays both affordable and defensible.",
        value: "An environment that stays both affordable and defensible.",
        features: [
          "Cost baseline",
          "Waste removal",
          "Right-sizing",
          "Secrets management",
          "Access & network security",
        ],
      },
    ],
    howItHelps: [
      {
        before: "Releases are slow, manual, and scheduled around fear",
        after: "Deploys run in minutes, many times a day, with a rollback ready",
      },
      {
        before: "Customers report outages before your team notices",
        after: "Monitoring alerts you before most issues reach a user",
      },
      {
        before: "The cloud bill climbs and no one can explain it",
        after: "Spend mapped to usage, with waste found and cut",
      },
      {
        before: "A traffic spike takes the service down",
        after: "Capacity scales automatically and the system stays up",
      },
      {
        before: "One outage means hours of manual firefighting",
        after: "Self-healing infrastructure and runbooks shorten every incident",
      },
    ],
    industries: [
      {
        name: "Software & SaaS companies",
        useCase:
          "Ship features faster and keep uptime commitments without growing an ops team to match.",
      },
      {
        name: "Retail & E-commerce",
        useCase:
          "Handle seasonal and campaign traffic spikes without the site falling over at the worst moment.",
      },
      {
        name: "Banking & Financial Services",
        useCase:
          "Release under strict controls, with the audit trail and security posture the sector demands.",
      },
      {
        name: "Scaling startups",
        useCase:
          "Build the delivery and infrastructure foundation once, so growth doesn't force a rebuild later.",
      },
      {
        name: "Enterprises modernising legacy systems",
        useCase:
          "Move off ageing infrastructure in phases, without a high-risk single cutover.",
      },
    ],
    process: [
      {
        title: "Assess",
        description:
          "The current infrastructure, delivery process, and cost baseline reviewed before anything changes.",
        icon: "discovery",
      },
      {
        title: "Design",
        description:
          "A target architecture and delivery pipeline agreed, sized for the load expected, not just today's.",
        icon: "engineering",
      },
      {
        title: "Codify",
        description:
          "Environments captured as infrastructure code, so they're reproducible from the start.",
        icon: "platform",
      },
      {
        title: "Automate",
        description:
          "Build, test, and deploy wired into a pipeline with a rehearsed rollback path.",
        icon: "automation",
      },
      {
        title: "Instrument",
        description:
          "Monitoring, logging, and alerting added, with runbooks for the failures that matter.",
        icon: "analytics",
      },
      {
        title: "Migrate",
        description:
          "Workloads moved over in phases, each verified before the next.",
        icon: "delivery",
      },
      {
        title: "Optimise",
        description:
          "Cost, performance, and reliability tuned against real usage once live.",
        icon: "efficiency",
      },
      {
        title: "Operate",
        description:
          "Ongoing support, incident practice, and improvement by a team that knows the setup.",
        icon: "partnership",
      },
    ],
    standoutPoints: [
      "Automated & reliable",
      "Certified process",
      "Cost-disciplined",
      "Secure by design",
      "Built to scale",
    ],
    closingLine:
      "When shipping is routine and staying up is the default, the infrastructure stops being a worry and starts being an advantage.",
  },
  {
    name: "Experience Design (UI/UX)",
    heroStatement: "Look like the company you are asking them to trust.",
    heroCta: "See how it works",
    buildMock: "canvas",
    icon: "PenTool",
    phase: "Designing",
    blurb: "Clear, premium experiences that build trust and drive action.",
    problem:
      "People arrive, get confused, and leave. The product works — it just doesn't look like something worth trusting with a credit card or a contract.",
    summary:
      "Research-led design that makes a product clear to use and worth trusting — so people understand it in seconds, act with confidence, and stop leaving before they reach the value you built.",
    approach:
      "Research-led design with accessible, reusable systems — function and feeling together.",
    deliverables: [
      "Research findings and mapped user journeys",
      "An accessible design system (WCAG)",
      "Interactive prototypes to test before building",
      "A design-to-development handoff spec",
    ],
    outcomes: ["Higher conversion", "Stronger brand perception", "Consistent experiences"],
    technologies: ["Design systems", "Figma", "Accessibility (WCAG)", "Prototyping"],
    tools: ["Figma", "Sketch", "Framer", "Miro", "Canva", "Webflow"],
    understanding: {
      title: "What experience design means for your business.",
      narrative: [
        "Experience design is the work of making a product understandable and worth acting on — how a screen is laid out, how a journey flows, and how the whole thing feels to the person using it. It decides whether someone gets to the value you built or gives up on the way, and whether they trust you enough to enter a card number or sign a contract.",
        "It isn't decoration applied at the end. The same product can convert or repel depending on how the experience is designed, because people judge credibility in seconds and abandon anything that makes them think too hard. Design is where that judgement is won or lost — usually before a single feature is even tried.",
      ],
      shifts: [
        "Design moved from making things look nice to deciding whether people act at all.",
        "Trust became something the interface earns in seconds, before the product is tried.",
        "One-off screens gave way to reusable design systems that keep experiences consistent.",
        "Accessibility moved from a compliance box to a requirement that widens the audience.",
      ],
      cards: [
        {
          title: "User research & strategy",
          icon: "discovery",
          description:
            "Understanding who uses the product and what they're trying to do, so design solves the real problem rather than an assumed one.",
        },
        {
          title: "Interface & interaction design",
          icon: "interface",
          description:
            "The screens, flows, and behaviour people touch — designed to be clear, credible, and quick to act on.",
        },
        {
          title: "Design systems",
          icon: "platform",
          description:
            "A reusable library of components and tokens that keeps every screen consistent and every future feature faster to build.",
        },
      ],
    },
    valueDrivers: [
      {
        title: "Turn more visitors into customers",
        icon: "growth",
        description:
          "A clear, credible experience removes the confusion and friction that make people leave before they ever convert.",
      },
      {
        title: "Look worth trusting",
        icon: "engagement",
        description:
          "A product that feels considered earns the confidence people need before they hand over money or data.",
      },
      {
        title: "Ship consistently and faster",
        icon: "efficiency",
        description:
          "A design system means every screen matches and every new feature starts from proven parts rather than a blank page.",
      },
      {
        title: "Reach more people",
        icon: "compliance",
        description:
          "Accessible design widens the audience and meets the WCAG standards procurement increasingly requires.",
      },
    ],
    whatWeBuild: [
      {
        title: "UX research & discovery",
        icon: "discovery",
        purpose:
          "The work before the pixels — understanding the people who'll use the product and the tasks they need to finish, so design decisions rest on evidence rather than opinion and the team builds the right thing once.",
        value: "The right thing built once, rather than the wrong thing twice.",
        features: [
          "User interviews",
          "Usability testing",
          "Journey mapping",
          "Competitive review",
          "Research findings",
        ],
      },
      {
        title: "Information architecture & flows",
        icon: "management",
        purpose:
          "The structure underneath the screens — how content is organised and how a journey moves from start to done — mapped so people never get lost and never have to think harder than the task deserves.",
        value: "Nobody has to think harder than the task deserves.",
        features: [
          "Site & app structure",
          "User flows",
          "Navigation models",
          "Task analysis",
          "Content hierarchy",
        ],
      },
      {
        title: "UI & interaction design",
        icon: "interface",
        purpose:
          "The interface people actually touch — layout, type, colour, and motion designed to be clear, credible, and quick to act on, with every state considered rather than left to chance.",
        value: "Every state designed, not just the happy one.",
        features: [
          "Visual design",
          "Interaction states",
          "Responsive layouts",
          "Micro-interactions",
          "Brand-aligned UI",
        ],
      },
      {
        title: "Prototyping & validation",
        icon: "quality",
        purpose:
          "Interactive prototypes that let a flow be tested with real users before a line of code is written, so the expensive mistakes are caught in design where they're cheap to fix.",
        value: "Mistakes caught in design, where they are still cheap.",
        features: [
          "Interactive prototypes",
          "Clickable flows",
          "Concept testing",
          "Rapid iteration",
          "Pre-build validation",
        ],
      },
      {
        title: "Design systems & tokens",
        icon: "platform",
        purpose:
          "A reusable library of components, patterns, and design tokens — the type, colour, and spacing rules that keep every screen consistent and give engineering a single, dependable source to build from.",
        value: "One dependable source for engineering to build from.",
        features: [
          "Component library",
          "Design tokens",
          "Pattern documentation",
          "Theming",
          "Versioned system",
        ],
      },
      {
        title: "Accessibility & handoff",
        icon: "compliance",
        purpose:
          "Design built to WCAG standards and packaged for engineering — specs, states, and assets in one place — so the accessible, considered design survives the move from canvas to code intact.",
        value: "The design survives the move from canvas to code intact.",
        features: [
          "WCAG compliance",
          "Contrast & keyboard access",
          "Specs & redlines",
          "Developer handoff",
          "Design QA",
        ],
      },
    ],
    howItHelps: [
      {
        before: "People arrive, get confused, and leave before converting",
        after: "A clear journey that guides users to the action, and holds them",
      },
      {
        before: "The product works but doesn't look worth trusting",
        after: "An interface that earns confidence at first glance",
      },
      {
        before: "Every screen is designed from scratch and looks different",
        after: "A design system that keeps the whole product consistent",
      },
      {
        before: "Design changes turn into expensive rebuilds late in development",
        after: "Flows tested as prototypes before code, so mistakes stay cheap",
      },
      {
        before: "Parts of the audience can't use the product at all",
        after: "Accessible design that meets WCAG and widens who can buy",
      },
    ],
    industries: [
      {
        name: "SaaS & software products",
        useCase:
          "Turn trials into paying users by making the product obvious to learn and satisfying to use.",
      },
      {
        name: "Retail & E-commerce",
        useCase:
          "Reduce checkout drop-off and make browsing a reason to come back, not a chore.",
      },
      {
        name: "Banking & Financial Services",
        useCase:
          "Earn the trust and clarity that moving money demands, without burying it in complexity.",
      },
      {
        name: "Healthcare",
        useCase:
          "Patient- and clinician-facing tools that are usable under pressure and accessible to everyone.",
      },
      {
        name: "Enterprises with complex internal tools",
        useCase:
          "Redesign the systems staff use all day so work gets faster instead of fought.",
      },
    ],
    process: [
      {
        title: "Discover",
        description:
          "The business goal and the people it serves understood before any design begins.",
        icon: "discovery",
      },
      {
        title: "Research",
        description:
          "Real users and their tasks studied, so the problem is defined by evidence.",
        icon: "customers",
      },
      {
        title: "Structure",
        description:
          "Information architecture and flows mapped so the journey holds together.",
        icon: "management",
      },
      {
        title: "Design",
        description:
          "Interfaces designed as a reusable system, not a set of one-off screens.",
        icon: "interface",
      },
      {
        title: "Prototype",
        description:
          "Flows made interactive and tested with users before code.",
        icon: "experience",
      },
      {
        title: "Systemise",
        description:
          "Components and tokens documented into a design system.",
        icon: "platform",
      },
      {
        title: "Hand off",
        description:
          "Specs, states, and assets packaged for engineering to build accurately.",
        icon: "delivery",
      },
      {
        title: "Refine",
        description:
          "Design QA and post-launch feedback feeding the next iteration.",
        icon: "partnership",
      },
    ],
    standoutPoints: [
      "Research-led",
      "Certified process",
      "Accessible by default",
      "Systemised & consistent",
      "Built to convert",
    ],
    closingLine:
      "When a product is clear to use and looks worth trusting, people stop leaving and start acting — and design has done its job.",
  },
  {
    name: "Quality Engineering",
    heroStatement: "Stop hearing about your defects from your customers.",
    heroCta: "See how it works",
    buildMock: "testboard",
    icon: "ShieldCheck",
    phase: "Support",
    blurb: "Ship with confidence — reliable, secure, and performant.",
    problem:
      "Every release is a gamble. Bugs reach customers first, and the team spends more time firefighting than building the thing they were hired to build.",
    summary:
      "Testing woven through delivery, not bolted on at the end — so bugs are caught before release, every launch is a decision rather than a gamble, and the team builds instead of firefighting.",
    approach:
      "Automated and manual testing woven through delivery, not bolted on at the end.",
    deliverables: [
      "A test strategy and automation suite",
      "A CI-integrated regression gate",
      "Performance and security test results",
      "Defect triage and clear release criteria",
    ],
    outcomes: ["Fewer defects", "Confident releases", "Better user trust"],
    technologies: ["Automated testing", "E2E (Playwright)", "Performance testing", "Security testing"],
    tools: ["Postman", "Python", "GitHub", "GitLab", "Jira"],
    /* The Mahindra engagement shipped a consumer-facing app for a brand that
       could not afford a bad release — quality engineering carried it, so the
       story is proof of this service as well as of the build. */
    stories: ["mahindra-rise-app-launch"],
    understanding: {
      title: "What quality engineering means for your business.",
      narrative: [
        "Quality engineering is the practice of proving software works before it reaches a customer — and keeping it that way as it changes. It covers how features are tested, how those tests run automatically on every change, and how defects are found, triaged, and stopped from shipping. It's built into delivery, not tacked on at the end.",
        "The difference it makes is who finds the bug. Without it, the customer does — in production, at the worst moment, damaging trust you spent years earning. With it, the test suite does — in minutes, before release, when the fix is cheap and invisible. Quality isn't the step before launch; it's what makes launching a decision instead of a gamble.",
      ],
      shifts: [
        "Testing moved from a phase at the end to a practice running through delivery.",
        "Manual, repeated checks gave way to automated suites that run on every change.",
        "Bugs moved from customer reports to test failures caught before release.",
        "Quality moved from one team's job to a shared, measurable release standard.",
      ],
      cards: [
        {
          title: "Test automation",
          icon: "automation",
          description:
            "Suites that run on every change and catch regressions in minutes, so nothing that worked yesterday quietly breaks today.",
        },
        {
          title: "Continuous quality gates",
          icon: "compliance",
          description:
            "Testing wired into CI so a failing build can't reach production — release criteria that are objective, not a judgement call.",
        },
        {
          title: "Specialised testing",
          icon: "security",
          description:
            "Performance, security, and accessibility checks that prove the software holds up under load, attack, and real-world use.",
        },
      ],
    },
    valueDrivers: [
      {
        title: "Bugs caught before customers see them",
        icon: "quality",
        description:
          "Defects fail a test in minutes rather than arriving as a support ticket in production, which is what protects both trust and revenue.",
      },
      {
        title: "Releases you can make with confidence",
        icon: "delivery",
        description:
          "Objective quality gates mean shipping is a decision backed by evidence rather than a nervous gamble taken under pressure.",
      },
      {
        title: "Less firefighting, more building",
        icon: "efficiency",
        description:
          "When regressions are caught automatically, the team spends its time on features instead of emergencies.",
      },
      {
        title: "Proof it holds up",
        icon: "security",
        description:
          "Performance, security, and accessibility tested — so the software stands up under load, scrutiny, and real use.",
      },
    ],
    whatWeBuild: [
      {
        title: "Test strategy & planning",
        icon: "management",
        purpose:
          "A clear picture of what to test, how, and to what standard — risk-based so effort goes where a failure would hurt most, and agreed as release criteria everyone can hold a build against.",
        value: "Release criteria everyone can hold a build against.",
        features: [
          "Risk-based planning",
          "Test coverage strategy",
          "Release criteria",
          "Traceability",
          "QA metrics",
        ],
      },
      {
        title: "Test automation",
        icon: "automation",
        purpose:
          "Automated suites that run on every change and catch regressions before they spread, so the app that worked yesterday keeps working — checked in minutes instead of re-tested by hand each release.",
        value: "Yesterday's working app, re-proven in minutes.",
        features: [
          "UI automation",
          "API testing",
          "Regression suites",
          "Playwright",
          "Cross-browser & device",
        ],
      },
      {
        title: "Manual & exploratory testing",
        icon: "discovery",
        purpose:
          "The judgement automation can't replace — skilled testers probing new features, edge cases, and real user journeys to find the problems a script would never think to look for.",
        value: "The problems a script would never think to look for.",
        features: [
          "Exploratory testing",
          "Usability checks",
          "Edge-case hunting",
          "New-feature verification",
          "Real-device testing",
        ],
      },
      {
        title: "CI-integrated quality gates",
        icon: "compliance",
        purpose:
          "Testing built into the delivery pipeline so a failing check blocks the release automatically — making “is this ready to ship” an objective answer the build gives, not a call someone makes under pressure.",
        value: "“Ready to ship” answered by the build, not by a person under pressure.",
        features: [
          "CI/CD integration",
          "Automated gates",
          "Build-blocking on failure",
          "Fast feedback",
          "Release sign-off",
        ],
      },
      {
        title: "Performance & security testing",
        icon: "security",
        purpose:
          "Proof the software holds up when it matters — load and stress tests that show where it breaks and when, and security testing that finds the weaknesses before an attacker or an auditor does.",
        value: "The limits are known before someone else finds them.",
        features: [
          "Load & stress testing",
          "Bottleneck analysis",
          "Vulnerability testing",
          "Security review",
          "Scalability checks",
        ],
      },
      {
        title: "Defect management & reporting",
        icon: "analytics",
        purpose:
          "Every bug logged, triaged, and tracked to closed on a shared board — so nothing slips through the cracks and everyone can see, at any moment, exactly what stands between the build and release.",
        value: "What stands between the build and release, visible at any moment.",
        features: [
          "Defect triage",
          "Bug tracking",
          "Severity & priority",
          "Clear reproduction steps",
          "Release-readiness reporting",
        ],
      },
    ],
    howItHelps: [
      {
        before: "Customers find the bugs before your team does",
        after: "Tests catch defects in minutes, before release",
      },
      {
        before: "Every release is a nervous gamble",
        after: "Objective quality gates make shipping a confident decision",
      },
      {
        before: "The team spends its days firefighting instead of building",
        after: "Regressions caught automatically free the team to build",
      },
      {
        before: "The same checks are run by hand every single release",
        after: "Automated suites run them in minutes, every time",
      },
      {
        before: "No one knows if the software will hold up under load",
        after: "Performance and security tested, with the limits known",
      },
    ],
    industries: [
      {
        name: "Software & SaaS companies",
        useCase:
          "Release often without shipping regressions, and keep quality steady as the product grows.",
      },
      {
        name: "Retail & E-commerce",
        useCase:
          "Make sure checkout, payments, and peak-traffic days work before customers prove they don't.",
      },
      {
        name: "Banking & Financial Services",
        useCase:
          "Meet the reliability, security, and audit standards that moving money demands.",
      },
      {
        name: "Healthcare",
        useCase:
          "Verify systems people depend on work correctly and protect sensitive data under real conditions.",
      },
      {
        name: "Enterprises with complex systems",
        useCase:
          "Test across integrated platforms so a change in one place doesn't break another.",
      },
    ],
    process: [
      {
        title: "Assess",
        description:
          "The current product, risks, and quality gaps understood before testing begins.",
        icon: "discovery",
      },
      {
        title: "Strategise",
        description:
          "A risk-based test plan and clear release criteria agreed up front.",
        icon: "management",
      },
      {
        title: "Automate",
        description:
          "Regression and API suites built to run on every change.",
        icon: "automation",
      },
      {
        title: "Integrate",
        description:
          "Tests wired into CI as gates that block a failing build.",
        icon: "compliance",
      },
      {
        title: "Test deep",
        description:
          "Exploratory, performance, and security testing where automation can't reach.",
        icon: "security",
      },
      {
        title: "Triage",
        description:
          "Defects logged, prioritised, and tracked to closed on a shared board.",
        icon: "quality",
      },
      {
        title: "Report",
        description:
          "Release readiness made visible, so shipping is an evidenced decision.",
        icon: "analytics",
      },
      {
        title: "Sustain",
        description:
          "The suite maintained and extended as the product evolves.",
        icon: "partnership",
      },
    ],
    standoutPoints: [
      "Testing built in, not bolted on",
      "Certified process",
      "Automated & repeatable",
      "Evidence-based releases",
      "Trusted quality",
    ],
    closingLine:
      "When the test suite finds the defect instead of the customer, every release stops being a gamble and starts being a decision.",
  },
];

/** All 15 services with derived `slug` and `hasProof`. */
export const services = RAW.map((s) => ({
  ...s,
  slug: slugify(s.name),
  /** True only when a real, verified story backs this service. */
  hasProof: Boolean(s.stories?.length),
}));

export type ServiceWithSlug = (typeof services)[number];

/** Services grouped by lifecycle phase, in `PHASES` order — drives the Solutions stages. */
export const servicesByPhase = PHASES.map((p) => ({
  ...p,
  services: services.filter((s) => s.phase === p.key),
}));

/** The 6 flagship services featured on the home page, in display order. */
const FEATURED_SLUGS = [
  "web-platform-engineering",
  "ai-and-intelligent-automation",
  "mobile-app-engineering",
  "cloud-and-devops-engineering",
  "product-engineering",
  "data-analytics-and-insights",
];

export const featuredServices = FEATURED_SLUGS.map(
  (slug) => services.find((s) => s.slug === slug)!,
).filter(Boolean);
