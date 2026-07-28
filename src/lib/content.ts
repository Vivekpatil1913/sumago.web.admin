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

export type IndustryDetail = {
  challenges: string[];
  solutions: string[];
  outcomes: string[];
};

/** Keyed by slugify(industry name). */
export const industryDetails: Record<string, IndustryDetail> = {
  "logistics-and-transportation": {
    challenges: ["Poor cross-border visibility", "Manual coordination", "Rising operating costs"],
    solutions: ["Real-time tracking platforms", "Workflow automation", "Integrated dashboards"],
    outcomes: ["Faster operations", "Lower costs", "Scalable growth"],
  },
  manufacturing: {
    challenges: ["Legacy systems", "Disconnected shop-floor data", "Inefficient processes"],
    solutions: ["System modernization", "IoT & analytics", "Process automation"],
    outcomes: ["Higher efficiency", "Better visibility", "Reduced downtime"],
  },
  healthcare: {
    challenges: ["Fragmented systems", "Compliance pressure", "Patient experience gaps"],
    solutions: ["Secure integrations", "Patient-facing apps", "Data analytics"],
    outcomes: ["Better care coordination", "Compliance confidence", "Improved experience"],
  },
  "banking-and-financial-services": {
    challenges: ["Legacy modernization", "Security & compliance", "Customer expectations"],
    solutions: ["Secure platforms", "Process automation", "Digital experiences"],
    outcomes: ["Operational efficiency", "Stronger security posture", "Higher satisfaction"],
  },
  education: {
    challenges: ["Manual administration", "Engagement gaps", "Scaling delivery"],
    solutions: ["Learning platforms", "Automation", "Analytics"],
    outcomes: ["Scalable delivery", "Higher engagement", "Better outcomes"],
  },
  "retail-and-e-commerce": {
    challenges: ["Omnichannel complexity", "Conversion gaps", "Scaling demand"],
    solutions: ["E-commerce platforms", "Personalization", "Integrations"],
    outcomes: ["Higher conversion", "Unified channels", "Scalable growth"],
  },
  "government-and-public-sector": {
    challenges: ["Legacy systems", "Citizen experience", "Transparency & scale"],
    solutions: ["Digital services", "Secure integrations", "Data platforms"],
    outcomes: ["Better citizen services", "Operational efficiency", "Trusted delivery"],
  },
  "hospitality-and-tourism": {
    challenges: ["Disconnected booking systems", "Guest experience", "Seasonal scale"],
    solutions: ["Booking & CRM platforms", "Mobile experiences", "Automation"],
    outcomes: ["Better guest experience", "Higher efficiency", "Scalable operations"],
  },
  "real-estate": {
    challenges: ["Manual lead handling", "Fragmented data", "Slow response"],
    solutions: ["CRM & automation", "Voice/AI engagement", "Portals & dashboards"],
    outcomes: ["More qualified leads", "Faster response", "Better visibility"],
  },
  "professional-services": {
    challenges: ["Manual workflows", "Disconnected tools", "Scaling delivery"],
    solutions: ["Workflow platforms", "Integrations", "Automation"],
    outcomes: ["Higher productivity", "Streamlined delivery", "Scalable growth"],
  },
};

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
export const differentiators: { title: string; description: string }[] = [
  { title: "Business understanding first", description: "We understand the business before writing a line of code." },
  { title: "Strategic consulting", description: "A consultative partner, not just a development shop." },
  { title: "Multidisciplinary team", description: "Analysts, architects, designers, engineers, cloud & AI specialists, QA." },
  { title: "Transparency", description: "Clear communication in every engagement." },
  { title: "Engineering quality", description: "High standards, scalable and secure architecture." },
  { title: "Long-term partnership", description: "Support and improvement long after delivery." },
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
