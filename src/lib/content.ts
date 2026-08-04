/**
 * Phase 5 content — real, brand-voice copy for detail pages and sections.
 * Hardcoded for now; migrates to Sanity in Phase 4. Facts defer to COMPANY-PROFILE.
 *
 * Service copy now lives in the unified catalog (lib/services.ts). The
 * `capabilityDetails` / `capabilityMeta` maps below are DERIVED from it so
 * existing consumers (detail pages, cards) keep working unchanged.
 */
import { services } from "@/lib/services";

export type CapabilityDetail = {
  summary: string;
  approach: string;
  outcomes: string[];
  technologies: string[];
};

/** Detail copy for every service, keyed by slug. Derived from the catalog. */
export const capabilityDetails: Record<string, CapabilityDetail> = Object.fromEntries(
  services.map((s) => [
    s.slug,
    { summary: s.summary, approach: s.approach, outcomes: s.outcomes, technologies: s.technologies },
  ]),
);

/* Industry copy lives in the unified catalog (lib/industries.ts) and is read
   straight from there by the Industries index and detail template — the old
   `industryDetails` map here was a second, thinner shape of the same content. */

/** The transparent 9-step engagement model (real). `icon` = lucide-react name. */
export const processSteps: { title: string; description: string; icon: string; phase: string }[] = [
  { title: "Discovery & Strategy", description: "Understand your goals and challenges, then define the roadmap, scope, and success metrics together.", icon: "Search", phase: "Understand" },
  { title: "Solution Architecture", description: "Design a scalable, secure foundation built for the long term.", icon: "Blocks", phase: "Understand" },
  { title: "Experience Design", description: "Craft clear, premium experiences that build trust.", icon: "PenTool", phase: "Design & Build" },
  { title: "Development & QA", description: "Engineer with strong typing and clean code, tested thoroughly for reliability, security, and performance.", icon: "Code2", phase: "Design & Build" },
  { title: "Deployment", description: "Ship safely with modern delivery and observability.", icon: "Rocket", phase: "Launch & Grow" },
  { title: "Enablement & Support", description: "Equip your teams to own the solution, then partner long after launch — measure, refine, evolve.", icon: "TrendingUp", phase: "Launch & Grow" },
];

/** The 3 macro-phases the 9 steps roll up into (for the process narrative). */
export const processPhases: { name: string; tagline: string }[] = [
  { name: "Understand", tagline: "Before a line of code — align on goals, scope, and architecture." },
  { name: "Design & Build", tagline: "Craft the experience and engineer it with quality built in." },
  { name: "Launch & Grow", tagline: "Ship safely, enable your teams, and improve long after launch." },
];

/**
 * The case for Sumago — framed as the four objections an evaluator actually
 * carries, each answered with evidence rather than an adjective.
 *
 * Every `proof.value` must trace to a NON-`[VERIFY]` line in COMPANY-PROFILE.
 * "700+ projects" and "70+ team" are deliberately absent: the profile flags
 * both as unresolved between Sumago and SCOPE (COMPANY-PROFILE.md, "Still to
 * confirm"), and an overstated number in a trust section discredits every
 * verified claim beside it. Add them here once the client confirms.
 */
export const whyChooseUs: {
  /** The objection, in the buyer's own words — this is what gets listed. */
  risk: string;
  /** Sumago's answer. */
  title: string;
  description: string;
  /** lucide-react icon name, mapped to a component at the call site. */
  icon: string;
  proof: { value: string; label: string }[];
  cta: { label: string; href: string };
}[] = [
  {
    risk: "Has this vendor delivered for government before?",
    title: "Public-sector proven",
    description:
      "A documented delivery record across central, state, defence and PSU institutions — systems that carry citizen load and cannot fail quietly.",
    icon: "Landmark",
    proof: [
      { value: "50+", label: "Government clients" },
      { value: "13+", label: "Years delivering" },
    ],
    cta: { label: "See government work", href: "/industries/government" },
  },
  {
    risk: "Who owns it when something breaks at 2am?",
    title: "One accountable partner",
    description:
      "Strategy, build, deployment and long-term support sit with one in-house team. No subcontractor chain, no handoff where accountability disappears.",
    icon: "RefreshCw",
    proof: [
      { value: "3", label: "Offices in Maharashtra" },
      { value: "500+", label: "Domestic clients" },
    ],
    cta: { label: "How engagements run", href: "/how-we-deliver" },
  },
  {
    risk: "Will this survive a security audit?",
    title: "Secure by design, not by patch",
    description:
      "Architecture, access control and testing planned against the audit the system will actually face — decided before the first line of code, not retrofitted after.",
    icon: "Lock",
    proof: [
      { value: "ISO 9001:2015", label: "Quality certified" },
      { value: "CMMI Level 5", label: "Process maturity" },
    ],
    cta: { label: "Security & assurance", href: "/solutions" },
  },
  {
    risk: "How do I know the quality claim is real?",
    title: "Independently assessed",
    description:
      "CMMI Maturity Level 5 and ISO 9001:2015 are external assessments of how work is actually run — verifiable by a third party, unlike a promise on a website.",
    icon: "Award",
    proof: [
      { value: "CMMI Level 5", label: "Externally assessed" },
      { value: "60+", label: "International clients" },
    ],
    cta: { label: "Inside our delivery", href: "/how-we-deliver" },
  },
];

/**
 * The four modes of work every engagement is made of — a positioning band for
 * the home page, NOT a process model. `PHASES` (lib/services.ts) stays the
 * site's functional taxonomy; these four are the message, deliberately kept
 * free of sequence language so the two don't compete. Copy defers to
 * COMPANY-PROFILE.md — "AI & Intelligent Automation" and "Maintenance &
 * Continuous Improvement" are the verified terms (no "RPA", no "AMC").
 */
export const whatWeDo: {
  title: string;
  description: string;
  /** lucide-react icon name (mapped to a component at the call site). */
  icon: string;
  /** The service that best embodies this mode — where the card routes. */
  href: string;
}[] = [
  {
    icon: "Compass",
    title: "Advise",
    description:
      "Digital strategy, process study and solution architecture that turn business goals into a roadmap with measurable outcomes.",
    href: "/solutions/technology-advisory",
  },
  {
    icon: "Code2",
    title: "Build",
    description:
      "Web, mobile, custom software and enterprise platforms — engineered typed, tested and built to be maintained for years.",
    href: "/solutions/enterprise-software-engineering",
  },
  {
    icon: "Cpu",
    title: "Automate",
    description:
      "AI and intelligent automation that remove the manual effort and error from the work your teams repeat every day.",
    href: "/solutions/ai-and-intelligent-automation",
  },
  {
    icon: "LifeBuoy",
    title: "Sustain",
    description:
      "Cloud operations, security, maintenance and continuous improvement that keep systems dependable long after launch.",
    href: "/solutions/cloud-and-devops-engineering",
  },
];

/**
 * Vision & Mission — the purpose diptych on the About page.
 *
 * NOTE: this is the modernised statement supplied by the business, not the
 * longer legacy wording quoted under "Vision (verbatim)" / "Mission (verbatim)"
 * in COMPANY-PROFILE.md. Update that file to match so the source of truth and
 * the site don't drift apart.
 */
export const visionMission: {
  key: "vision" | "mission";
  label: string;
  /** lucide-react icon name (mapped to a component at the call site). */
  icon: string;
  statement: string;
  /** Vision closes on an aspiration; mission closes on commitments. */
  support?: string;
  points?: string[];
}[] = [
  {
    key: "vision",
    label: "Vision",
    icon: "Eye",
    statement:
      "To empower governments, enterprises and institutions through technology — becoming the most trusted engineering partner for a digital-first India.",
    support:
      "We aspire to set the standard for reliability, innovation and long-term public value in every system we deliver.",
  },
  {
    key: "mission",
    label: "Mission",
    icon: "Target",
    statement:
      "To engineer secure, scalable technology that solves real problems — measurable, dependable and built to last.",
    points: [
      "Deliver outcomes, not just deliverables",
      "Uphold enterprise-grade quality & security",
      "Design for scale, adoption and longevity",
      "Partner transparently across the lifecycle",
    ],
  },
];

/**
 * Applied intelligence — the capability band on /innovation.
 *
 * Distinct from the home page's `AiSdlc` section: that one is AI in *how*
 * Sumago builds (the engineering toolchain); this is AI as what gets built
 * *for* clients. Same technology, opposite direction — keep them that way.
 *
 * "RPA" is deliberately not used as a named practice: COMPANY-PROFILE.md
 * verifies "AI & Intelligent Automation" and automated workflows, not RPA.
 */
export const intelligentSystems: {
  title: string;
  description: string;
  /** lucide-react icon name (mapped to a component at the call site). */
  icon: string;
}[] = [
  {
    icon: "MessageSquare",
    title: "AI Chatbots & Assistants",
    description:
      "24/7 conversational support trained on your own content and processes.",
  },
  {
    icon: "Mic",
    title: "Voice & Language AI",
    description: "Natural voice and multilingual interfaces for wider public reach.",
  },
  {
    icon: "Repeat",
    title: "Workflow Automation",
    description:
      "Rule-based automation that removes repetitive, high-volume back-office work.",
  },
  {
    icon: "BarChart3",
    title: "Applied Analytics",
    description: "Dashboards and predictive insight built into everyday decisions.",
  },
];

/** What the intelligence above changes in practice — the closing proof strip. */
export const intelligentOutcomes: { title: string; note: string }[] = [
  { title: "Round-the-clock service", note: "without added headcount" },
  { title: "Faster resolution", note: "and response times" },
  { title: "Auditable decisions", note: "consistent & compliant" },
  { title: "Staff freed", note: "for higher-value work" },
];

/**
 * The reference architecture behind delivery — five layers, read top-down from
 * what the user touches to what it runs on. Sits under the service catalog on
 * /solutions: the chapters say which problems get solved, this says how the
 * systems that solve them are actually put together.
 *
 * The `Business Platforms` grouping that briefly lived here as its own section
 * is folded into the services layer ("CRM · ERP · HRMS") — it duplicated the
 * platform and integration layers below almost line for line.
 *
 * NOTE: CRM / ERP / HRMS and system integration are claimed here but are NOT in
 * COMPANY-PROFILE.md — today they appear only incidentally in industry copy,
 * and HRMS nowhere at all. Add them to the profile so the source of truth
 * matches what the site claims.
 */
export const architectureLayers: {
  label: string;
  /** lucide-react icon name (mapped to a component at the call site). */
  icon: string;
  /**
   * What sits *outside* the system at this layer, drawn as a callout in the
   * blueprint sheet. Only the layers with an external edge carry one — the
   * interior layers (services, data) talk to nothing beyond the boundary.
   */
  boundary?: string;
  items: string[];
}[] = [
  {
    icon: "Monitor",
    label: "Experience",
    boundary: "Users & citizens",
    items: ["Citizen & customer portals", "Mobile apps", "Dashboards", "Admin consoles"],
  },
  {
    icon: "Link2",
    label: "API & Integration",
    boundary: "Partner systems",
    items: ["REST & GraphQL", "API gateway", "Payment gateways", "Legacy connectors"],
  },
  {
    icon: "LayoutGrid",
    label: "Services",
    items: [
      "Microservices",
      "Business workflows",
      "CRM · ERP · HRMS",
      "Workflow automation",
      "AI services",
    ],
  },
  {
    icon: "Database",
    label: "Data",
    items: ["PostgreSQL · MySQL", "MongoDB · Redis", "Analytics & BI", "Reporting"],
  },
  {
    icon: "Cloud",
    label: "Platform",
    boundary: "Cloud regions",
    items: ["AWS · Azure · GCP", "Docker · Kubernetes", "CI/CD pipelines", "Monitoring"],
  },
];

/**
 * Security & compliance, grouped by *when* each control applies rather than as
 * a flat list of six claims.
 *
 * The lanes are the argument: a buyer in a regulated sector is not asking "do
 * you have encryption?" (every vendor says yes) — they are asking whether
 * security is decided in the architecture, held through operations, and
 * provable to an auditor. Build → run → account for is that answer, and it is
 * what "by design" actually means.
 *
 * This absorbed the old `architectureCrossCutting` rail on the blueprint: the
 * two sat next to each other on /solutions naming the same three concerns.
 *
 * [VERIFY] Only ISO 9001:2015 and CMMI Level 5 are certified (COMPANY-PROFILE).
 * Nothing here claims a security-specific standard — no ISO 27001, SOC 2 or
 * "GDPR compliant". The `specifics` are engineering practices already asserted
 * across the service catalog; keep it that way until an audit says otherwise.
 */
export const securityPillars: {
  key: string;
  /** Lane label — the stage of the system's life these controls belong to. */
  stage: string;
  /** When that stage is, in the client's words. */
  when: string;
  controls: {
    title: string;
    /** lucide-react icon name (mapped to a component at the call site). */
    icon: string;
    description: string;
    /** Concrete, checkable specifics — what a security reviewer scans for. */
    specifics: string[];
  }[];
}[] = [
  {
    key: "built",
    stage: "Secure by Design",
    when: "Before the first line of code ships",
    controls: [
      {
        icon: "ShieldCheck",
        title: "Secure engineering",
        description:
          "Threat-aware design and peer-reviewed code — decided in the architecture, not patched in later.",
        specifics: ["Secure code review", "Dependency scanning", "Hardened defaults"],
      },
      {
        icon: "Lock",
        title: "Data protection",
        description:
          "Encryption in transit and at rest, with least-privilege access to every data store.",
        specifics: ["Encrypted in transit", "Encrypted at rest", "Least privilege"],
      },
    ],
  },
  {
    key: "operated",
    stage: "Continuous Operations",
    when: "Every day the system runs",
    controls: [
      {
        icon: "UserCheck",
        title: "Access & identity",
        description:
          "Role-based access with SSO and MFA — each person reaches only what their role needs.",
        specifics: ["OAuth 2.0", "SSO", "MFA", "WAF"],
      },
      {
        icon: "Activity",
        title: "Monitoring & response",
        description:
          "Continuous logging and alerting, with a defined path from first alert to fix in production.",
        specifics: ["Logging", "Monitoring", "Alerting"],
      },
    ],
  },
  {
    key: "accountable",
    stage: "Compliance & Governance",
    when: "When auditors — or incidents — arrive",
    controls: [
      {
        icon: "FileCheck",
        title: "Audit & data residency",
        description:
          "Traceable records of who changed what, aligned to the residency rules governing regulated work.",
        specifics: ["Audit trails", "Data residency", "Role-based approvals"],
      },
      {
        icon: "HardDrive",
        title: "Resilience & recovery",
        description:
          "Backups, failover and a recovery plan agreed up front — an outage stays an inconvenience.",
        specifics: ["Backup", "Failover", "DR plan"],
      },
    ],
  },
];

/**
 * The assurance strip beneath the security cards — the proof line a regulated
 * buyer checks after reading the controls.
 *
 * [VERIFY] Every entry here is already asserted in COMPANY-PROFILE.md. Three
 * commonly-requested stats are deliberately absent and must stay absent until
 * an audit or an SLA says otherwise:
 *
 * - **"99.99% uptime"** — an SLA commitment nothing in the profile supports.
 * - **"SOC 2 compliant"** — an audited attestation Sumago does not hold.
 * - **"24×7 monitoring"** — implies a staffed SOC. `Continuous monitoring &
 *   alerting` is the honest form, and it is what `securityPillars` claims.
 *
 * Rendered by the shared `Stat` molecule, which counts up anything leading with
 * a digit and prints the rest verbatim — so the two quantities animate and the
 * certifications simply appear, with no per-entry flag needed here.
 */
export const securityAssuranceStats: { value: string; label: string }[] = [
  { value: "700+", label: "Projects delivered" },
  { value: "50+", label: "Government clients" },
  { value: "ISO 9001:2015", label: "Certified" },
  { value: "CMMI Level 5", label: "Certified" },
  { value: "Continuous", label: "Monitoring & alerting" },
];

/**
 * Delivery models — the cadence the engagement runs in, which qualifies the
 * six-step path in `processSteps` rather than restating it.
 *
 * Agile is already established across the catalog ("Agile delivery with clear
 * milestones…", `Agile / Scrum` in three services). Waterfall is new to the
 * site — low risk for a firm doing government tender work, but it isn't in
 * COMPANY-PROFILE.md yet either.
 */
export const deliveryModels: {
  key: "agile" | "waterfall";
  name: string;
  /** One-line positioning under the name, before the paragraph. */
  tagline: string;
  /** The honest position, carried as a pill: default vs exception. */
  badge: string;
  /** lucide-react icon name (mapped to a component at the call site). */
  icon: string;
  description: string;
  /** The phase ladder, rendered as a vertical timeline (name + what happens). */
  steps: { name: string; note: string }[];
  /** Closes the ladder: agile returns to the top, waterfall runs to a gate. */
  cadence: "loop" | "sequence";
  cadenceNote: string;
  /** What the model buys the client — each carries its own icon. */
  benefits: { icon: string; text: string }[];
  /** Work this model fits, as labelled chips. */
  bestFor: { icon: string; label: string }[];
}[] = [
  {
    key: "agile",
    name: "Agile",
    tagline: "Iterative delivery · two-week sprints",
    badge: "Preferred approach",
    icon: "RefreshCw",
    description:
      "Value delivered in short, reviewable increments, with the client steering priorities every sprint.",
    steps: [
      { name: "Plan", note: "Sprint scope agreed from a live backlog" },
      { name: "Design", note: "Just-enough UX and technical design" },
      { name: "Develop", note: "Built behind code review and CI" },
      { name: "Test", note: "Automated and exploratory, inside the sprint" },
      { name: "Review", note: "Working software demonstrated to the client" },
      { name: "Release", note: "Shipped, measured, fed back into the backlog" },
    ],
    cadence: "loop",
    cadenceNote: "The loop repeats every two weeks",
    benefits: [
      { icon: "Rocket", text: "Working software demonstrated every sprint" },
      { icon: "Users", text: "Backlog re-prioritised with the client" },
      { icon: "Shuffle", text: "Change absorbed without contract friction" },
      { icon: "Gauge", text: "Risk surfaced early, not at final acceptance" },
    ],
    bestFor: [
      { icon: "Cloud", label: "SaaS platforms" },
      { icon: "Zap", label: "Startup MVPs" },
      { icon: "Smartphone", label: "Mobile apps" },
      { icon: "Globe", label: "Web applications" },
    ],
  },
  {
    key: "waterfall",
    name: "Waterfall",
    tagline: "Sequential delivery · stage-gated sign-off",
    badge: "Compliance driven",
    icon: "Layers",
    description:
      "A sequential, stage-gated path for work governed by compliance, documentation or client mandate.",
    steps: [
      { name: "Requirements", note: "Signed-off specification and baseline" },
      { name: "Design", note: "Architecture and interfaces documented in full" },
      { name: "Development", note: "Built to the approved specification" },
      { name: "Verification", note: "Tested against agreed acceptance criteria" },
      { name: "Deployment", note: "Planned cutover with a rollback path" },
      { name: "Maintenance", note: "Change handled under formal control" },
    ],
    cadence: "sequence",
    cadenceNote: "Each gate signed off before the next begins",
    benefits: [
      { icon: "FileCheck", text: "Full traceability and audit documentation" },
      { icon: "ClipboardCheck", text: "Fixed scope, schedule and acceptance criteria" },
      { icon: "ShieldCheck", text: "Every phase gated by a formal sign-off" },
      { icon: "ScrollText", text: "Suits regulated and tender-governed work" },
    ],
    bestFor: [
      { icon: "Landmark", label: "Government" },
      { icon: "Banknote", label: "Banking" },
      { icon: "HeartPulse", label: "Healthcare" },
      { icon: "Building2", label: "Enterprise systems" },
    ],
  },
];

/**
 * Side-by-side comparison beneath the two model cards — the dimensions a buyer
 * actually weighs when a tender asks which methodology will be used.
 *
 * Deliberately not scored. No "winner" column, no ticks and crosses: the
 * argument of the section is that the right model depends on the engagement,
 * and a scorecard would contradict it.
 */
export const methodologyComparison: {
  dimension: string;
  agile: string;
  waterfall: string;
}[] = [
  {
    dimension: "Requirement changes",
    agile: "Welcomed at any sprint boundary",
    waterfall: "Handled through formal change control",
  },
  {
    dimension: "Documentation",
    agile: "Lean and living — enough to build and support",
    waterfall: "Comprehensive, versioned and audit-ready",
  },
  {
    dimension: "Compliance",
    agile: "Evidence gathered continuously through delivery",
    waterfall: "Stage-gate sign-off recorded at every phase",
  },
  {
    dimension: "Speed to first value",
    agile: "Weeks — the first increment ships early",
    waterfall: "After the full build clears verification",
  },
  {
    dimension: "Flexibility",
    agile: "High — priorities re-set every two weeks",
    waterfall: "Fixed once the baseline is approved",
  },
  {
    dimension: "Client collaboration",
    agile: "Continuous — demo and review each sprint",
    waterfall: "Structured around defined milestone reviews",
  },
  {
    dimension: "Delivery model",
    agile: "Incremental releases, continuously improved",
    waterfall: "One planned release, then managed maintenance",
  },
];

/** Why organizations choose Sumago (real). */
export const differentiators: {
  title: string;
  description: string;
  /** lucide-react icon name (mapped to a component at the call site). */
  icon: string;
}[] = [
  { icon: "Search", title: "Business understanding first", description: "We understand the business before writing a line of code." },
  { icon: "Compass", title: "Strategic consulting", description: "A consultative partner, not just a development shop." },
  { icon: "Users", title: "Multidisciplinary team", description: "Analysts, architects, designers, engineers, cloud & AI specialists, QA." },
  { icon: "Eye", title: "Transparency", description: "Clear communication in every engagement." },
  { icon: "ShieldCheck", title: "Engineering quality", description: "High standards, scalable and secure architecture." },
  { icon: "HeartHandshake", title: "Long-term partnership", description: "Support and improvement long after delivery." },
];

/**
 * Awards & recognition (real — see COMPANY-PROFILE.md). These are verified trust
 * assets; do not invent. CEO recognitions are personal to Sonali Gorade and are
 * valid Sumago leadership trust assets.
 */
export const awards: {
  title: string;
  /** Short label for the compact circle/badge treatment. */
  short: string;
  detail: string;
  year: string;
  /** Certifications are the top-tier trust assets and get the featured tiles. */
  kind: "certification" | "award";
  /** lucide-react icon name (mapped to a component at the call site). */
  icon: string;
}[] = [
  {
    title: "CMMI Maturity Level 5",
    short: "CMMI Level 5",
    detail:
      "The highest CMMI appraisal level — independently certified engineering process maturity.",
    year: "Certified",
    kind: "certification",
    icon: "ShieldCheck",
  },
  {
    title: "ISO 9001:2015",
    short: "ISO 9001:2015",
    detail: "Independently certified quality-management systems across every engagement.",
    year: "Certified",
    kind: "certification",
    icon: "BadgeCheck",
  },
  {
    title: "Maharashtra State Young Women Entrepreneurs Award",
    short: "State Award",
    detail: "Awarded to Co-founder & CEO Sonali Gorade for entrepreneurial leadership.",
    year: "2021",
    kind: "award",
    icon: "Trophy",
  },
  {
    title: "Maharashtra State Young Women Entrepreneurs Award",
    short: "State Award",
    detail: "First recognition of Sonali Gorade among the state's young women entrepreneurs.",
    year: "2018",
    kind: "award",
    icon: "Trophy",
  },
  {
    title: "nasscom × Indian Oil — National Recognition",
    short: "nasscom × IOC",
    detail: "Recognised nationally for a hands-on enterprise AI/ML workshop in New Delhi.",
    year: "National",
    kind: "award",
    icon: "Sparkles",
  },
];

/**
 * Media & press presence — SEED/PLACEHOLDER outlet names for layout only.
 * [REAL ASSET NEEDED] Replace with verified press mentions + permission before
 * launch; never publish an unverified outlet as fact (see docs/17).
 */
export const mediaMentions: string[] = [
  "[Press outlet]",
  "[Industry journal]",
  "[Tech publication]",
  "[Regional daily]",
  "[Business magazine]",
];

/** Real client names (text only — logo display needs consent, see docs/17). */
export const clientNames: string[] = [
  "Mahindra",
  "Toyota",
  "Hinduja",
  "Govt. of Maharashtra",
  "MSBTE",
  "FSSAI",
  "NIC",
  "UdyamMitra",
  "ALF",
  "SVI Carbon",
  "Chaudhari Yatra Company",
  "Habits",
  "UMS Technologies",
  "Doshvio",
  "Shreerag",
  "Gadilo",
  "BioDigiSign",
];

/** Capability presentation meta — lucide icon name + one-line blurb. Keyed by
 *  slug. Derived from the unified service catalog (lib/services.ts). */
export const capabilityMeta: Record<string, { icon: string; blurb: string }> = Object.fromEntries(
  services.map((s) => [s.slug, { icon: s.icon, blurb: s.blurb }]),
);

/** Sample testimonials — [DUMMY], replace with real attributed quotes + consent. */
export const testimonials: {
  quote: string;
  name: string;
  role: string;
  rating: number;
  accent: string;
}[] = [
  {
    quote:
      "Sumago took the time to understand our business before writing a single line of code. That upfront clarity shaped every decision that followed — and it showed in the final product.",
    name: "Rajesh Menon",
    role: "CTO, Enterprise client",
    rating: 5,
    accent: "#5B8DEF",
  },
  {
    quote:
      "What stood out was the transparency. They stayed with us long after go-live, refining and supporting the platform exactly the way a real transformation partner should.",
    name: "Anita Deshpande",
    role: "Operations Head, Manufacturing",
    rating: 5,
    accent: "#E8833A",
  },
  {
    quote:
      "They turned a complex, largely manual operation into a clean, scalable platform in a matter of months — without ever losing sight of how our team actually works day to day.",
    name: "Michael Carter",
    role: "Founder, Logistics startup",
    rating: 5,
    accent: "#2BB3A3",
  },
  {
    quote:
      "The discovery phase alone reshaped how we thought about the product. The engineering that followed was just as sharp — well-architected, thoroughly tested, and delivered on time.",
    name: "Priya Nair",
    role: "VP Engineering, Fintech",
    rating: 5,
    accent: "#7C5CE6",
  },
  {
    quote:
      "Reliable, communicative, and genuinely invested in our outcomes rather than just shipping features. It felt far less like hiring a vendor and more like adding to our own team.",
    name: "Sarah Whitman",
    role: "Product Director, Healthcare",
    rating: 5,
    accent: "#E85A8A",
  },
  {
    quote:
      "We scaled from a small pilot to a national rollout without ever re-platforming. The architecture they built simply held up as our traffic, features, and team all grew.",
    name: "Vikram Shah",
    role: "CIO, Retail chain",
    rating: 4,
    accent: "#3AA0E8",
  },
  {
    quote:
      "Their team felt like a natural extension of ours. Deadlines were met, surprises were rare, and the quality bar stayed high from the very first sprint to the final handover.",
    name: "Neha Kulkarni",
    role: "Head of Digital, Education",
    rating: 5,
    accent: "#E8A33A",
  },
  {
    quote:
      "Our field staff adopted the new system in a week. That only happened because the workflows were designed around how they already work, not around a database diagram.",
    name: "Suresh Patankar",
    role: "GM Operations, Infrastructure",
    rating: 5,
    accent: "#4F9D69",
  },
  {
    quote:
      "The audit trail and access controls cleared our compliance review on the first pass — something none of our previous vendors managed.",
    name: "Farida Qureshi",
    role: "Compliance Lead, Financial services",
    rating: 5,
    accent: "#6C7BE8",
  },
  {
    quote:
      "They pushed back on a feature we asked for, showed us the data, and proposed something simpler. It shipped faster and got used more.",
    name: "Daniel Ortega",
    role: "Founder, SaaS platform",
    rating: 5,
    accent: "#E86A4F",
  },
  {
    quote:
      "Migrating fifteen years of records was the part we dreaded most. It happened over a weekend, with reconciliation reports waiting for us on Monday morning.",
    name: "Meenakshi Raman",
    role: "Director, Public sector programme",
    rating: 5,
    accent: "#3AA0E8",
  },
  {
    quote:
      "Every sprint ended with something we could actually click through. No status decks, no guessing where the project stood.",
    name: "Arjun Sethi",
    role: "Head of Product, Mobility",
    rating: 5,
    accent: "#7C5CE6",
  },
  {
    quote:
      "Support response times have never been the problem people warned us about with offshore partners. Issues get acknowledged quickly and closed properly.",
    name: "Claire Bennett",
    role: "IT Manager, Distribution",
    rating: 4,
    accent: "#2BB3A3",
  },
  {
    quote:
      "The mobile experience was rethought entirely rather than squeezed down from the desktop build, and our field usage numbers reflect that.",
    name: "Rohit Bhandari",
    role: "COO, Field services",
    rating: 5,
    accent: "#E85A8A",
  },
  {
    quote:
      "They documented everything — architecture, decisions, runbooks. When we brought part of the work in-house, our own engineers were productive immediately.",
    name: "Kavita Iyer",
    role: "Engineering Manager, Enterprise SaaS",
    rating: 5,
    accent: "#5B8DEF",
  },
  {
    quote:
      "Peak-season traffic used to mean a war room. This year it meant watching a dashboard stay green.",
    name: "Amit Chourasia",
    role: "CTO, E-commerce",
    rating: 5,
    accent: "#E8833A",
  },
  {
    quote:
      "The integration work touched four legacy systems nobody wanted to open. It was handled carefully, tested hard, and rolled out without downtime.",
    name: "Laura Vasquez",
    role: "Programme Director, Manufacturing",
    rating: 5,
    accent: "#4F9D69",
  },
  {
    quote:
      "Costs stayed where the estimate said they would. When scope did move, we heard about it before the work started, not after.",
    name: "Sandeep Jadhav",
    role: "Managing Director, Industrial group",
    rating: 5,
    accent: "#6C7BE8",
  },
  {
    quote:
      "Our reporting used to take three days a month to assemble by hand. It now arrives automatically, and the finance team trusts the numbers.",
    name: "Preeti Malhotra",
    role: "Finance Controller, Healthcare group",
    rating: 5,
    accent: "#3AA0E8",
  },
  {
    quote:
      "Accessibility was treated as a requirement from day one rather than a retrofit, which mattered enormously for a public-facing service.",
    name: "Thomas Reid",
    role: "Digital Lead, Non-profit",
    rating: 5,
    accent: "#2BB3A3",
  },
];

/** Frequently asked questions. */
export const faqs: { q: string; a: string }[] = [
  {
    q: "How do engagements start?",
    a: "Every engagement begins with Business Discovery — we understand your goals, challenges, and vision before recommending any technology.",
  },
  {
    q: "Do you work with enterprises and startups?",
    a: "Yes. We partner with startups, SMEs, enterprises, and government — 50+ government, 500+ domestic, and 60+ international clients to date.",
  },
  {
    q: "What makes Sumago different?",
    a: "We focus on measurable business outcomes, not just delivering software — backed by 13+ years, 700+ projects, ISO 9001:2015 and CMMI Level 5 certification.",
  },
  {
    q: "What happens after launch?",
    a: "We treat every project as a long-term partnership, with continuous support and improvement built into how we work.",
  },
];

/* ============================================================
   /how-we-deliver — the capability statement.
   Due-diligence content for the evaluator who has already decided the work
   is worth doing and now has to defend the vendor choice internally: how an
   engagement is actually run, where it runs from, and who else has bought it.
   ============================================================ */

/**
 * The engagement model — what a client experiences week to week. Each entry
 * answers a specific procurement objection ("who do I call?", "how do I know
 * where it stands?", "will the invoice surprise me?"), which is why the copy
 * leads with the client's position rather than Sumago's process.
 */
export const engagementPrinciples: {
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    title: "Single point of contact",
    description:
      "One named project manager owns communication and outcomes — no routing between teams to get an answer.",
    icon: "UserRound",
  },
  {
    title: "Live dashboards",
    description:
      "Progress, backlog and risk stay visible in real time, so status is something you check rather than request.",
    icon: "PieChart",
  },
  {
    title: "Regular demos",
    description:
      "Working software shown every sprint — progress is demonstrated, never just reported.",
    icon: "MonitorPlay",
  },
  {
    title: "Transparent commercials",
    description:
      "Scope, change control and billing agreed up front, so spend stays predictable and every change is a decision you make.",
    icon: "FileText",
  },
  {
    title: "Risk & quality reviews",
    description:
      "Risks are tracked and raised early, with quality gates at each stage rather than one inspection at the end.",
    icon: "ShieldAlert",
  },
];

/**
 * The three delivery centres.
 *
 * Addresses deliberately live in `lib/site.ts` (`company.offices`) and are
 * rendered on /contact only — one address, one home. This list carries the
 * *capability* view of the same premises: role in the network, scale, and what
 * each site is fitted out to do.
 *
 * [VERIFY] Every `area` figure is unconfirmed — it appears nowhere in
 * COMPANY-PROFILE.md or docs/. The three also sum exactly to the 23,000+ total,
 * which reads as derived rather than measured. Confirm with the facilities team
 * (or drop the figures) before launch; do not treat them as published fact.
 */
export const deliveryCentres: {
  key: string;
  city: string;
  locality: string;
  role: string;
  /** [VERIFY] — see the note above. */
  area: string;
  /** Static, self-authored SVG in /public/delivery — no external host. */
  illustration: string;
  alt: string;
  /** Whether this is the network's primary engineering floor. */
  lead?: boolean;
  capabilities: string[];
  icon: string;
}[] = [
  {
    key: "satpur",
    city: "Nashik",
    locality: "Satpur MIDC",
    role: "Primary engineering hub",
    area: "15,000+ sq. ft.",
    illustration: "/delivery/centre-satpur.svg",
    alt: "Satpur MIDC, Nashik — the primary engineering hub, drawn as a wide saw-tooth delivery floor",
    lead: true,
    capabilities: [
      "The largest engineering floor in the network",
      "Development labs and dedicated project bays",
      "Secured compound with controlled entry",
    ],
    icon: "Cpu",
  },
  {
    key: "govind-nagar",
    city: "Nashik",
    locality: "Govind Nagar",
    role: "Corporate & delivery HQ",
    area: "5,000+ sq. ft.",
    illustration: "/delivery/centre-govind-nagar.svg",
    alt: "Govind Nagar, Nashik — the corporate and delivery headquarters, with the 4th and 6th floors marked",
    capabilities: [
      "Leadership, commercial and client-facing functions",
      "Conference rooms and the seminar hall",
      "Where most engagements are kicked off",
    ],
    icon: "Briefcase",
  },
  {
    key: "pune",
    city: "Pune",
    locality: "Shivajinagar",
    role: "Western-Maharashtra centre",
    area: "3,000+ sq. ft.",
    illustration: "/delivery/centre-pune.svg",
    alt: "Shivajinagar, Pune — the western-Maharashtra centre, on the third floor of a commercial tower",
    capabilities: [
      "Reach into the Pune client and talent market",
      "On-site presence for western-Maharashtra engagements",
      "Delivery capacity independent of the Nashik sites",
    ],
    icon: "MapPin",
  },
];

/**
 * What every centre is provisioned with. Grouped so the grid reads as three
 * arguments — can they build, will it stay up, is it secure — rather than
 * twelve unranked amenities.
 *
 * [VERIFY] The inventory is unconfirmed against COMPANY-PROFILE.md.
 */
export const facilityGroups: {
  key: string;
  label: string;
  note: string;
  items: { name: string; icon: string }[];
}[] = [
  {
    key: "engineering",
    label: "Built to engineer",
    note: "The floor itself — where the work gets done.",
    items: [
      { name: "Development labs", icon: "Cpu" },
      { name: "Workstations & laptops", icon: "Monitor" },
      { name: "Conference rooms", icon: "Users" },
      { name: "Seminar hall", icon: "Mic" },
    ],
  },
  {
    key: "continuity",
    label: "Built to stay up",
    note: "Why a deadline survives a power cut.",
    items: [
      { name: "High-speed internet", icon: "Wifi" },
      { name: "Full Wi-Fi coverage", icon: "Radio" },
      { name: "Power backup", icon: "BatteryCharging" },
      { name: "ERP systems", icon: "LayoutGrid" },
    ],
  },
  {
    key: "security",
    label: "Built to be secure",
    note: "Physical controls behind the data commitments.",
    items: [
      { name: "Biometric access", icon: "Fingerprint" },
      { name: "CCTV surveillance", icon: "Video" },
      { name: "Staffed reception", icon: "DoorOpen" },
      { name: "On-site medical kit", icon: "HeartPulse" },
    ],
  },
];

/**
 * Client mix. Figures are the verified ones from COMPANY-PROFILE.md via
 * `company.metrics` — 50+ government, 500+ domestic, 60+ international.
 *
 * No progress bars here, deliberately: a bar implies a denominator, and there
 * isn't one. `share` is the segment's honest share of the ~610 total, which is
 * a ratio that actually means something.
 */
export const clientMix: {
  key: string;
  value: string;
  label: string;
  note: string;
  icon: string;
}[] = [
  {
    key: "government",
    value: "50+",
    label: "Government clients",
    note: "Central, state, defence and PSU bodies",
    icon: "Landmark",
  },
  {
    key: "domestic",
    value: "500+",
    label: "Domestic clients",
    note: "Enterprise, industry and MSME across India",
    icon: "Building2",
  },
  {
    key: "international",
    value: "60+",
    label: "International clients",
    note: "Cross-border delivery from Maharashtra",
    icon: "Globe",
  },
];

/** The four constituencies the client base spans. */
export const clientSegments: {
  name: string;
  note: string;
  icon: string;
}[] = [
  {
    name: "Government departments",
    note: "Central, state and PSU digital initiatives",
    icon: "Landmark",
  },
  {
    name: "Universities & institutes",
    note: "Public institutions and technical bodies",
    icon: "BookOpen",
  },
  {
    name: "Corporate & industry",
    note: "IT, banking, manufacturing and services",
    icon: "Briefcase",
  },
  {
    name: "Social & community",
    note: "Inclusive, citizen-facing programmes",
    icon: "Heart",
  },
];

/**
 * "Why Government & Enterprise Choose Us" — the differentiator band on the
 * homepage, between `IndustriesSection` and `ProcessSection`.
 *
 * Placement logic: the section above says *who* Sumago serves, the section
 * below says *how* the work runs. This is the hinge — why that audience picks
 * this vendor. It is the only "why us" block on `/`; the equivalent arguments
 * on /contact (`WhySumago`), /solutions (`WhyPartner`) and the service detail
 * pages each stay in their own lane, so no page carries two.
 *
 * [VERIFY] "central, state, defence and PSU institutions" — COMPANY-PROFILE.md
 * records `50+ government clients` but does not itemise defence or PSU work.
 * Copy is client-supplied and reproduced verbatim by instruction; confirm the
 * breakdown with Sumago before launch, or narrow it to what the profile holds.
 * Everything else here is already on record: ISO 9001:2015, 13+ years.
 */
export const whyChooseReasons: {
  title: string;
  description: string;
  /** lucide-react icon name (mapped to a component at the call site). */
  icon: string;
}[] = [
  {
    icon: "Landmark",
    title: "Public-Sector Proven",
    description:
      "A documented record across central, state, defence and PSU institutions.",
  },
  {
    icon: "Workflow",
    title: "Full-Lifecycle Ownership",
    description:
      "One accountable partner from strategy to build, run and long-term support.",
  },
  {
    icon: "ShieldCheck",
    title: "Security & Compliance First",
    description:
      "Secure-by-design architecture built for regulated, citizen-facing systems.",
  },
  {
    icon: "Award",
    title: "Quality-Certified",
    description: "ISO 9001:2015 processes and 13+ years of dependable delivery.",
  },
];

/** The commitment that closes the "why us" band — the section's centrepiece. */
export const sumagoPromise: {
  eyebrow: string;
  statement: string;
  bullets: string[];
} = {
  eyebrow: "The Sumago Promise",
  statement:
    "One accountable partner for the entire journey — from the first workshop to production, and every improvement after.",
  bullets: [
    "You own the outcome — so do we",
    "No vendor chains, no finger-pointing",
    "Enterprise quality at practical cost",
    "A relationship built to last",
  ],
};

/**
 * The engagement path on /contact — how a first conversation becomes a live
 * system, in weeks.
 *
 * Deliberately *not* `processSteps`. That is the nine-stage delivery lifecycle
 * (home + /solutions) and this is the pre-sales runway: what happens between
 * "I filled in the form" and "the build started". It sits between `WhySumago`
 * and `ScheduleMeeting` because it answers the last objection standing in front
 * of the form — what am I actually committing to?
 *
 * `BeatRun` on /how-we-deliver covers the week-to-week governance *after* a
 * signature, so the three never overlap.
 */
export const engagementPath: {
  /** Timing badge, in the client's words. */
  week: string;
  title: string;
  description: string;
  /** lucide-react icon name (mapped to a component at the call site). */
  icon: string;
}[] = [
  {
    week: "Week 1",
    title: "Discovery Call",
    description: "A short conversation to understand goals and constraints.",
    icon: "PhoneCall",
  },
  {
    week: "Week 1–2",
    title: "Solution Workshop",
    description: "We map scope, approach and success metrics together.",
    icon: "Users",
  },
  {
    week: "Week 2",
    title: "Proposal & Plan",
    description: "Transparent scope, timeline, team and commercials.",
    icon: "ClipboardList",
  },
  {
    week: "Week 3+",
    title: "Kickoff & Build",
    description: "Agile delivery begins with demos every sprint.",
    icon: "Code2",
  },
  {
    week: "Ongoing",
    title: "Go-Live & Partner",
    description: "Deployment, handover and ongoing support & growth.",
    icon: "TrendingUp",
  },
];

/**
 * The three-line headline for the homepage's enterprise band.
 *
 * Kept as an array so the component can reveal one line at a time without
 * splitting a string on punctuation. Line 3 carries the brand treatment.
 */
export const whyChooseHeadline: string[] = [
  "Trusted by Government.",
  "Chosen by Enterprises.",
  "Built for India's Digital Future.",
];

/**
 * Assurance chips under the capability cards.
 *
 * [VERIFY] Only the first is an audited certification — ISO 9001:2015, held
 * (with CMMI Maturity Level 5) per COMPANY-PROFILE.md. The rest are engineering
 * postures already asserted across the service catalog, not attestations. Do
 * not append anything implying an audit Sumago has not passed (no ISO 27001,
 * no SOC 2, no "GDPR compliant") — that is the first thing procurement checks.
 */
export const whyChooseBadges: string[] = [
  "ISO Certified",
  "Secure by Design",
  "Compliance Ready",
  "Cloud Native",
  "DevOps",
  "AI Ready",
  "Enterprise Support",
];
