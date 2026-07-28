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
 * Only 4 real stories exist (COMPANY-PROFILE.md), and they map to just 3
 * services via `stories` below. The other 12 services have NO verified proof:
 * no metrics, no ROI, no timelines, no attributed quotes. `hasProof` is derived
 * from `stories`. The service DETAIL pages surface a story where one exists and
 * a `[REAL PROOF NEEDED]` flag (outside production) where it doesn't, so the gap
 * stays actionable. The Solutions index deliberately shows neither — it hooks
 * with the problem and hands off to the detail page.
 * Do NOT fill those slots with invented outcomes. See docs/PROOF-GAPS.md.
 */
import { slugify } from "@/lib/utils";

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
    label: "Support & Resourcing",
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
};

/** The 15 services, in canonical order. Slugs are derived from `name`. */
const RAW: Service[] = [
  {
    name: "Web Platform Engineering",
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
  },
  {
    name: "Mobile App Engineering",
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
    technologies: ["React Native", "iOS / Android", "REST / GraphQL", "App analytics"],
    tools: ["React Native", "Flutter", "Figma", "GitHub", "Postman"],
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
  },
  {
    name: "Digital Growth & Marketing",
    icon: "Megaphone",
    phase: "Marketing",
    blurb: "Technology-led growth — turning digital presence into measurable pipeline.",
    problem:
      "Spend goes out, traffic comes in, and nobody can say which half worked — the reporting explains last quarter instead of guiding the next decision.",
    summary:
      "Connecting product, data, and channels so digital spend turns into measurable growth, not guesswork.",
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
  },
  {
    name: "Technology Advisory",
    icon: "Lightbulb",
    phase: "Consulting",
    blurb: "Independent guidance on the choices that shape your business.",
    problem:
      "A decision worth years and crores is on the table, every vendor is selling their own answer, and there's no neutral read on which one survives contact with your reality.",
    summary: "Independent guidance on the technology choices that shape your business.",
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
  },
  {
    name: "Program & Delivery Management",
    icon: "ClipboardList",
    phase: "Consulting",
    blurb: "Disciplined delivery that keeps complex programs on scope and on time.",
    problem:
      "Several teams, moving scope, and a date nobody quite believes — the status stays green right up until the week it goes red.",
    summary:
      "Running complex technology programs with the transparency and rigor that keeps delivery predictable.",
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
  },
  {
    name: "Data Analytics & Insights",
    icon: "BarChart3",
    phase: "Consulting",
    blurb: "Turn scattered data into decisions leaders can act on.",
    problem:
      "The numbers live in five systems and disagree with each other, so every leadership meeting starts by arguing about whose spreadsheet is right.",
    summary:
      "Unifying data and surfacing insight so decisions are driven by evidence, not instinct.",
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
  },
  {
    name: "Blockchain Solutions",
    icon: "Blocks",
    phase: "Building",
    blurb: "Secure, transparent systems built on distributed ledger technology.",
    problem:
      "Several parties need to trust the same record, and reconciliation, disputes, and audit trails are quietly eating the margin on every transaction.",
    summary:
      "Applying blockchain where it genuinely adds trust — secure, transparent, tamper-evident systems.",
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
  },
  {
    name: "AI & Intelligent Automation",
    icon: "Sparkles",
    phase: "Building",
    blurb: "AI, ML & automation that remove manual work and unlock decisions.",
    problem:
      "Skilled people spend their days on repetitive manual work, and the AI pilots keep stalling somewhere between the demo and production.",
    summary:
      "Applying AI, ML, and automation to remove manual work and unlock smarter decisions.",
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
  },
  {
    name: "Managed Outsourcing",
    icon: "Handshake",
    phase: "Support",
    blurb: "Hand off delivery with confidence — outcomes owned end to end.",
    problem:
      "Delivery capacity is the bottleneck, hiring takes months you don't have, and the last vendor who promised to fix it left you with code nobody can maintain.",
    summary:
      "Taking full ownership of software delivery so your team can focus on the core business.",
    approach:
      "Clear scope, governance, and transparent communication — a partner accountable for outcomes, not hours.",
    deliverables: [
      "A named, accountable delivery team",
      "Defined scope and governance model",
      "A transparent reporting cadence",
      "Documentation and knowledge transfer, always",
    ],
    outcomes: ["Reduced delivery risk", "Predictable costs", "Focus on core business"],
    technologies: ["Dedicated delivery", "Governance", "Agile", "Quality assurance"],
    tools: ["Slack", "Zoom", "Jira", "Notion", "Dropbox"],
  },
  {
    name: "IoT & Connected Products",
    icon: "Cpu",
    phase: "Building",
    blurb: "Connect devices, data, and software into products that sense and respond.",
    problem:
      "Assets in the field go dark between check-ins, so problems reach you as customer complaints instead of alerts you could have acted on.",
    summary:
      "Building connected products that bring the physical and digital together — from device to dashboard.",
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
  },
  {
    name: "Enterprise Software Engineering",
    icon: "Server",
    phase: "Building",
    blurb: "Robust, scalable systems that run core operations reliably.",
    problem:
      "The system the business runs on is old, fragile, and understood by two people — so every change is a risk, and standing still is starting to cost more than moving.",
    summary:
      "Building robust, scalable systems that run core business operations reliably at enterprise scale.",
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
  },
  {
    name: "Product Engineering",
    icon: "Boxes",
    phase: "Designing",
    blurb: "From idea to shipped product — and evolving with you.",
    problem:
      "There's an idea and a budget, but no proof anyone wants it — and a full build is the most expensive possible way to find out.",
    summary:
      "Taking ideas from concept to shipped product — and evolving them with the business.",
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
  },
  {
    name: "Cloud & DevOps Engineering",
    icon: "Cloud",
    phase: "Building",
    blurb: "Modern infrastructure for reliability, scale, and speed.",
    problem:
      "Releases are slow and nerve-wracking, the cloud bill climbs every month, and outages are reported by customers before monitoring catches them.",
    summary: "Modernizing infrastructure for reliability, scale, and faster delivery.",
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
  },
  {
    name: "Experience Design (UI/UX)",
    icon: "PenTool",
    phase: "Designing",
    blurb: "Clear, premium experiences that build trust and drive action.",
    problem:
      "People arrive, get confused, and leave. The product works — it just doesn't look like something worth trusting with a credit card or a contract.",
    summary: "Designing clear, premium experiences that build trust and drive action.",
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
  },
  {
    name: "Quality Engineering",
    icon: "ShieldCheck",
    phase: "Support",
    blurb: "Ship with confidence — reliable, secure, and performant.",
    problem:
      "Every release is a gamble. Bugs reach customers first, and the team spends more time firefighting than building the thing they were hired to build.",
    summary: "Ensuring what we ship works — reliably, securely, and at speed.",
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
