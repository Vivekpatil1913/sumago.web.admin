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
