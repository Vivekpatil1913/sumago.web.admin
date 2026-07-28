/**
 * The unified industry catalog — the industries counterpart to `lib/services.ts`.
 *
 * The Industries page is the mirror of the Services page: services are grouped
 * by lifecycle phase, industries are grouped by *sector family* — the shared
 * operating reality that makes two sectors need the same kind of engineering.
 *
 * Facts defer to COMPANY-PROFILE.md. `challenges` / `solutions` / `outcomes` are
 * the existing verified copy (previously inline in lib/content.ts, which now
 * derives from here). `problem` and `approach` are POSITIONING copy in the same
 * spirit as `Service.problem` / `Service.whoFor` — the sector's pain in the
 * buyer's own words and how the work is run, carrying no metrics and no claims
 * about named clients.
 */
import { slugify } from "@/lib/utils";

export type SectorKey = "operations" | "regulated" | "commerce" | "knowledge";

/** The four sector families, in page order. */
export const SECTORS: { key: SectorKey; label: string; blurb: string }[] = [
  {
    key: "operations",
    label: "Operations & Industry",
    blurb:
      "Businesses measured on physical throughput, where a delay anywhere shows up on the P&L.",
  },
  {
    key: "regulated",
    label: "Regulated & Public Trust",
    blurb:
      "Sectors where security, compliance, and an audit trail are preconditions — not features added late.",
  },
  {
    key: "commerce",
    label: "Commerce & Experience",
    blurb:
      "Businesses judged on the experience they deliver, at whatever scale demand arrives in.",
  },
  {
    key: "knowledge",
    label: "Knowledge & Service Delivery",
    blurb:
      "Organizations whose product is expertise — and whose growth is capped by the manual work around it.",
  },
];

export type Industry = {
  /** Display name (also the source of the URL slug). */
  name: string;
  /** Sector family this industry sits in. */
  sector: SectorKey;
  /**
   * The problem in the operator's own words — the week they arrive with, not a
   * description of the sector. Leads every industry view (docs/08).
   */
  problem: string;
  /** How the work is run in this sector — outcome-first, one sentence. */
  approach: string;
  /** Typical challenges (detail page). */
  challenges: string[];
  /** What gets built (detail page + the running line on the index). */
  solutions: string[];
  /** Outcomes a client can expect (detail page). */
  outcomes: string[];
};

/**
 * The 10 industries, in canonical order (this order drives the header menu,
 * footer, home marquee, and the contact form). Slugs are derived from `name`
 * and must keep matching `INDUSTRY_ICONS` in lib/industry-meta.ts.
 */
const RAW: Industry[] = [
  {
    name: "Logistics & Transportation",
    sector: "operations",
    problem:
      "A shipment leaves the yard and effectively disappears — status comes from phone calls and spreadsheets, and by the time a delay surfaces, the customer has already noticed.",
    approach:
      "Bringing tracking, coordination, and cost into a single operating picture — so a delay is visible while it can still be fixed, not after the invoice.",
    challenges: [
      "Poor cross-border visibility",
      "Manual coordination",
      "Rising operating costs",
    ],
    solutions: [
      "Real-time tracking platforms",
      "Workflow automation",
      "Integrated dashboards",
    ],
    outcomes: ["Faster operations", "Lower costs", "Scalable growth"],
  },
  {
    name: "Manufacturing",
    sector: "operations",
    problem:
      "The shop floor knows what happened hours before the office does — the machines log one story, the ERP another, and reconciling the two is somebody's full-time job.",
    approach:
      "Connecting shop-floor data to the systems that plan against it, and modernizing the legacy pieces in place — without stopping a line to do it.",
    challenges: [
      "Legacy systems",
      "Disconnected shop-floor data",
      "Inefficient processes",
    ],
    solutions: ["System modernization", "IoT & analytics", "Process automation"],
    outcomes: ["Higher efficiency", "Better visibility", "Reduced downtime"],
  },
  {
    name: "Healthcare",
    sector: "regulated",
    problem:
      "Patient information sits in systems that don't speak to each other, every integration raises a compliance question, and the people who need the record fastest are the ones waiting on it.",
    approach:
      "Integrating clinical and administrative systems securely so the record follows the patient — with compliance designed into the architecture rather than audited in afterwards.",
    challenges: [
      "Fragmented systems",
      "Compliance pressure",
      "Patient experience gaps",
    ],
    solutions: ["Secure integrations", "Patient-facing apps", "Data analytics"],
    outcomes: [
      "Better care coordination",
      "Compliance confidence",
      "Improved experience",
    ],
  },
  {
    name: "Banking & Financial Services",
    sector: "regulated",
    problem:
      "The core platform still works, but it can't be changed quickly — and customers are comparing you to apps that ship every week, while every release has to clear security and audit.",
    approach:
      "Modernizing the core in increments the business can absorb while the customer-facing experience moves at its own pace — security and auditability treated as architecture, not paperwork.",
    challenges: [
      "Legacy modernization",
      "Security & compliance",
      "Customer expectations",
    ],
    solutions: ["Secure platforms", "Process automation", "Digital experiences"],
    outcomes: [
      "Operational efficiency",
      "Stronger security posture",
      "Higher satisfaction",
    ],
  },
  {
    name: "Education",
    sector: "knowledge",
    problem:
      "Admissions, attendance, and fees run on spreadsheets and follow-up calls. Enrolment keeps growing, and so far the only way to keep up has been hiring more people.",
    approach:
      "Replacing manual administration with platforms staff can run themselves, so delivery scales with enrolment instead of headcount.",
    challenges: ["Manual administration", "Engagement gaps", "Scaling delivery"],
    solutions: ["Learning platforms", "Automation", "Analytics"],
    outcomes: ["Scalable delivery", "Higher engagement", "Better outcomes"],
  },
  {
    name: "Retail & E-commerce",
    sector: "commerce",
    problem:
      "Store, marketplace, and website each hold their own version of inventory and the customer — traffic arrives, carts don't convert, and peak season is a stress test nobody enjoys.",
    approach:
      "Unifying inventory, orders, and customer data behind every channel, then engineering the storefront to hold up when demand spikes.",
    challenges: ["Omnichannel complexity", "Conversion gaps", "Scaling demand"],
    solutions: ["E-commerce platforms", "Personalization", "Integrations"],
    outcomes: ["Higher conversion", "Unified channels", "Scalable growth"],
  },
  {
    name: "Government & Public Sector",
    sector: "regulated",
    problem:
      "Services still depend on a counter visit and a paper trail, the systems behind them predate the mandate they now carry, and checking the status of anything becomes a phone call.",
    approach:
      "Turning counter-based services into digital ones citizens can complete themselves — built for scale, transparency, and the audit trail the mandate requires.",
    challenges: ["Legacy systems", "Citizen experience", "Transparency & scale"],
    solutions: ["Digital services", "Secure integrations", "Data platforms"],
    outcomes: [
      "Better citizen services",
      "Operational efficiency",
      "Trusted delivery",
    ],
  },
  {
    name: "Hospitality & Tourism",
    sector: "commerce",
    problem:
      "Bookings arrive from a dozen channels into systems that never quite reconcile — the front desk improvises, and the guest experience depends on who happens to be on shift.",
    approach:
      "Reconciling every booking channel into one view of the guest, so service stays consistent whoever is on shift and the seasonal peak is planned for, not survived.",
    challenges: [
      "Disconnected booking systems",
      "Guest experience",
      "Seasonal scale",
    ],
    solutions: ["Booking & CRM platforms", "Mobile experiences", "Automation"],
    outcomes: [
      "Better guest experience",
      "Higher efficiency",
      "Scalable operations",
    ],
  },
  {
    name: "Real Estate",
    sector: "commerce",
    problem:
      "Enquiries come in across portals, calls, and campaigns, and the ones answered late are simply lost — with nobody able to say which source is actually producing buyers.",
    approach:
      "Capturing every enquiry into one pipeline with an automated first response — so speed stops depending on who happens to be free.",
    challenges: ["Manual lead handling", "Fragmented data", "Slow response"],
    solutions: [
      "CRM & automation",
      "Voice/AI engagement",
      "Portals & dashboards",
    ],
    outcomes: ["More qualified leads", "Faster response", "Better visibility"],
  },
  {
    name: "Professional Services",
    sector: "knowledge",
    problem:
      "Delivery runs on documents, email threads, and a few people who remember how everything works — so growth means more billable hours and more hours nobody can bill.",
    approach:
      "Putting delivery on a platform instead of in inboxes — so taking on more work doesn't mean proportionally more administration.",
    challenges: ["Manual workflows", "Disconnected tools", "Scaling delivery"],
    solutions: ["Workflow platforms", "Integrations", "Automation"],
    outcomes: [
      "Higher productivity",
      "Streamlined delivery",
      "Scalable growth",
    ],
  },
];

export type IndustryWithSlug = Industry & { slug: string };

/** Every industry, with its derived slug, in canonical order. */
export const industryCatalog: IndustryWithSlug[] = RAW.map((i) => ({
  ...i,
  slug: slugify(i.name),
}));

/** Flat list of names — kept for routing, grids, and the contact form. */
export const industryNames = industryCatalog.map((i) => i.name);

/** Industries grouped by sector family, in `SECTORS` order — drives the page. */
export const industriesBySector = SECTORS.map((s) => ({
  ...s,
  industries: industryCatalog.filter((i) => i.sector === s.key),
}));

/** Lookup by slug — used by the detail page. */
export const industryBySlug = new Map(industryCatalog.map((i) => [i.slug, i]));

/**
 * Why sector depth matters — a ledger for the Industries page, mirroring the
 * "Why Sumago" ledger on the Services page but speaking to domain work rather
 * than delivery. POSITIONING copy: how engagements are run, no metrics.
 */
export const sectorPrinciples: { title: string; description: string }[] = [
  {
    title: "Domain before technology",
    description:
      "Every engagement starts with how the operation actually runs — the exceptions, the workarounds, and the person everyone calls when something breaks.",
  },
  {
    title: "Regulation as architecture",
    description:
      "In regulated sectors, compliance and auditability are designed into the system, not bolted on in the weeks before go-live.",
  },
  {
    title: "Legacy modernized, not abandoned",
    description:
      "Systems that still carry the business get modernized in increments the operation can absorb, rather than replaced in one risky cut-over.",
  },
  {
    title: "Integration over replacement",
    description:
      "Most sector problems are data trapped in systems that don't talk to each other. Connecting them usually beats buying a replacement for all of them.",
  },
  {
    title: "Built for the busiest week",
    description:
      "Capacity is planned around the seasonal peak or the audit deadline — the moment the system has to hold — not the quiet average.",
  },
  {
    title: "Owned by your team",
    description:
      "Platforms are handed over with documentation and enablement, so the people running the operation aren't dependent on the vendor who built it.",
  },
];
