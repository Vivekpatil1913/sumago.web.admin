/**
 * The unified industry catalog — one entry per industry, and the single source
 * the Industries index, the ten detail pages, the header menu, footer, home
 * marquee, and the contact form all read from.
 *
 * WHY EVERYTHING LIVES HERE
 * `/industries/[slug]` is one template rendered ten times (mirroring how
 * lib/services.ts drives `/solutions/[slug]`). Nothing on that page is written
 * per industry in the component — a new industry is a data edit, and the move to
 * Sanity (CLAUDE.md — content is CMS-driven) is a fetch swap.
 *
 * Facts defer to COMPANY-PROFILE.md. `outcomes` and the `challenges` /
 * `solutions` titles are the existing verified copy; the descriptions, `blurb`,
 * `summary`, `problem`, and `approach` are POSITIONING copy in the same spirit as
 * `Service.problem` / `Service.whoFor` — the sector's reality in the operator's
 * own words and how the work is run. No metrics, no claims about named clients,
 * nothing invented about a client's results.
 *
 * PAIRING: `challenges[i]`, `solutions[i]`, and `outcomes[i]` are written to line
 * up — friction, what gets built for it, what changes. The detail template relies
 * on that order, so keep the three arrays the same length and in step.
 */
import { slugify } from "@/lib/utils";

/** A friction the sector arrives with, or the thing built to answer it. */
export type IndustryPoint = {
  /** Short label — the verified phrase. */
  title: string;
  /** One sentence of substance. Positioning copy; no metrics. */
  description: string;
};

export type Industry = {
  /** Display name (also the source of the URL slug). */
  name: string;
  /** One-line, outcome-first blurb for the index card. */
  blurb: string;
  /** 1–2 sentence standfirst for the detail hero. */
  summary: string;
  /**
   * The problem in the operator's own words — the week they arrive with, not a
   * description of the sector. Leads the detail page (docs/08).
   */
  problem: string;
  /** How the work is run in this sector — outcome-first, the reply to `problem`. */
  approach: string;
  /** Where it hurts today. Paired with `solutions` / `outcomes` by index. */
  challenges: IndustryPoint[];
  /** What typically gets built. Paired with `challenges` / `outcomes` by index. */
  solutions: IndustryPoint[];
  /** What changes for the business. Paired with the two arrays above by index. */
  outcomes: string[];
  /**
   * Slugs from the service catalog (lib/services.ts) that do most of the work in
   * this sector, in relevance order. Drives the cross-links on the detail page.
   */
  services: string[];
  /**
   * Slugs from `impactStories` (lib/site.ts) that genuinely involved this
   * industry. Only three industries qualify — leave undefined rather than
   * stretching a story to fit, exactly as `Service.stories` does.
   */
  stories?: string[];
};

/**
 * The 10 industries, in canonical order (this order drives the index cards, the
 * header menu, the footer, the home marquee, and the contact form). Slugs are
 * derived from `name` and must keep matching `INDUSTRY_ICONS` in
 * lib/industry-meta.ts.
 */
const RAW: Industry[] = [
  {
    name: "Logistics & Transportation",
    blurb:
      "Tracking, coordination, and cost brought into one operating picture — so a delay is visible while it can still be fixed.",
    summary:
      "Helping logistics operators replace phone calls and spreadsheets with live visibility — so coordination, cost, and the promise made to the customer all run off the same picture.",
    problem:
      "A shipment leaves the yard and effectively disappears — status comes from phone calls and spreadsheets, and by the time a delay surfaces, the customer has already noticed.",
    approach:
      "Bringing tracking, coordination, and cost into a single operating picture — so a delay is visible while it can still be fixed, not after the invoice.",
    challenges: [
      {
        title: "Poor cross-border visibility",
        description:
          "Once freight crosses a handover, status depends on whoever answers the phone — and nobody can prove where a consignment actually is.",
      },
      {
        title: "Manual coordination",
        description:
          "Bookings, allocations, and exceptions are reconciled by hand across email, calls, and spreadsheets that never quite agree.",
      },
      {
        title: "Rising operating costs",
        description:
          "Empty runs, idle assets, and detention charges accumulate quietly, because the data that would expose them sits in separate systems.",
      },
    ],
    solutions: [
      {
        title: "Real-time tracking platforms",
        description:
          "One live view of every consignment, shared with everyone who needs it — including the customer asking for an update.",
      },
      {
        title: "Workflow automation",
        description:
          "Booking, allocation, documentation, and exception handling automated, so coordination stops depending on who remembers what.",
      },
      {
        title: "Integrated dashboards",
        description:
          "Operations, fleet, and finance data joined up, so cost per movement is a number you can act on rather than reconstruct.",
      },
    ],
    outcomes: ["Faster operations", "Lower costs", "Scalable growth"],
    services: [
      "web-platform-engineering",
      "data-analytics-and-insights",
      "iot-and-connected-products",
      "cloud-and-devops-engineering",
    ],
    stories: ["mamastops-logistics-platform"],
  },
  {
    name: "Manufacturing",
    blurb:
      "Shop-floor data connected to the systems that plan against it, and legacy platforms modernized in place — without stopping a line.",
    summary:
      "Helping manufacturers connect the shop floor to the systems that plan against it — modernizing what already runs production instead of halting it to start again.",
    problem:
      "The shop floor knows what happened hours before the office does — the machines log one story, the ERP another, and reconciling the two is somebody's full-time job.",
    approach:
      "Connecting shop-floor data to the systems that plan against it, and modernizing the legacy pieces in place — without stopping a line to do it.",
    challenges: [
      {
        title: "Legacy systems",
        description:
          "Platforms that still run production can't be switched off, so every change to them gets quoted as a risk rather than an improvement.",
      },
      {
        title: "Disconnected shop-floor data",
        description:
          "Machines, quality checks, and stores each keep their own record, so planning works from numbers that are already out of date.",
      },
      {
        title: "Inefficient processes",
        description:
          "Downtime, rework, and manual paperwork get absorbed as normal, because nothing measures what they actually cost.",
      },
    ],
    solutions: [
      {
        title: "System modernization",
        description:
          "Legacy platforms modernized in increments the plant can absorb, with the line running throughout.",
      },
      {
        title: "IoT & analytics",
        description:
          "Machine and sensor data captured and turned into the live picture planning, quality, and maintenance all work from.",
      },
      {
        title: "Process automation",
        description:
          "Paperwork, approvals, and hand-offs automated, so the floor spends its time on output rather than on reporting.",
      },
    ],
    outcomes: ["Higher efficiency", "Better visibility", "Reduced downtime"],
    services: [
      "iot-and-connected-products",
      "enterprise-software-engineering",
      "data-analytics-and-insights",
      "ai-and-intelligent-automation",
    ],
    stories: ["mahindra-rise-app-launch"],
  },
  {
    name: "Healthcare",
    blurb:
      "Securely integrated systems so the record follows the patient — with compliance designed into the architecture, not audited in afterwards.",
    summary:
      "Helping healthcare providers integrate the systems care depends on — securely, and with compliance and auditability designed in rather than added at the end.",
    problem:
      "Patient information sits in systems that don't speak to each other, every integration raises a compliance question, and the people who need the record fastest are the ones waiting on it.",
    approach:
      "Integrating clinical and administrative systems securely so the record follows the patient — with compliance and auditability designed into the architecture rather than audited in afterwards.",
    challenges: [
      {
        title: "Fragmented systems",
        description:
          "Records, scheduling, diagnostics, and billing each hold part of the picture, and clinicians stitch the rest together by hand.",
      },
      {
        title: "Compliance pressure",
        description:
          "Every integration and every new app raises questions about consent, access, and audit that nobody wants to answer late.",
      },
      {
        title: "Patient experience gaps",
        description:
          "Appointments, reports, and follow-ups still run on calls and paper, at exactly the moment a patient has least patience for it.",
      },
    ],
    solutions: [
      {
        title: "Secure integrations",
        description:
          "Clinical and administrative systems connected with access control and audit trails settled at the first design review.",
      },
      {
        title: "Patient-facing apps",
        description:
          "Appointments, records, and follow-up in the patient's hands, in an experience a first-time user can complete unaided.",
      },
      {
        title: "Data analytics",
        description:
          "Operational and clinical data brought together, so capacity, outcomes, and cost can be seen rather than estimated.",
      },
    ],
    outcomes: [
      "Better care coordination",
      "Compliance confidence",
      "Improved experience",
    ],
    services: [
      "enterprise-software-engineering",
      "mobile-app-engineering",
      "data-analytics-and-insights",
      "quality-engineering",
    ],
  },
  {
    name: "Banking & Financial Services",
    blurb:
      "Core modernization in increments the business can absorb, while the customer-facing experience moves at its own pace.",
    summary:
      "Helping banks and financial institutions modernize the core in safe increments, while the customer-facing experience moves at the pace the market now expects.",
    problem:
      "The core platform still works, but it can't be changed quickly — and customers are comparing you to apps that ship every week, while every release has to clear security and audit.",
    approach:
      "Modernizing the core in increments the business can absorb while the customer-facing experience moves at its own pace — security and auditability treated as architecture, not paperwork.",
    challenges: [
      {
        title: "Legacy modernization",
        description:
          "The systems of record are dependable and immovable, so anything new has to work with them rather than wait for their replacement.",
      },
      {
        title: "Security & compliance",
        description:
          "Every release carries regulatory weight, so speed is only useful when it arrives with evidence and control.",
      },
      {
        title: "Customer expectations",
        description:
          "Customers judge the experience against consumer apps rather than against other banks — and they leave quietly.",
      },
    ],
    solutions: [
      {
        title: "Secure platforms",
        description:
          "Architecture where access control, encryption, and auditability are structural, so a review confirms the design instead of repairing it.",
      },
      {
        title: "Process automation",
        description:
          "Onboarding, verification, and reconciliation automated end to end, with a trail an auditor can actually follow.",
      },
      {
        title: "Digital experiences",
        description:
          "Customer journeys rebuilt to be quick, clear, and dependable on the devices they actually happen on.",
      },
    ],
    outcomes: [
      "Operational efficiency",
      "Stronger security posture",
      "Higher satisfaction",
    ],
    services: [
      "enterprise-software-engineering",
      "cloud-and-devops-engineering",
      "quality-engineering",
      "experience-design-ui-ux",
    ],
  },
  {
    name: "Education",
    blurb:
      "Manual administration replaced by platforms staff can run themselves — so delivery scales with enrolment instead of headcount.",
    summary:
      "Helping institutions replace manual administration with platforms their own staff can run — so a growing intake stops meaning a growing back office.",
    problem:
      "Admissions, attendance, and fees run on spreadsheets and follow-up calls. Enrolment keeps growing, and so far the only way to keep up has been hiring more people.",
    approach:
      "Replacing manual administration with platforms staff can run themselves, so delivery scales with enrolment instead of headcount.",
    challenges: [
      {
        title: "Manual administration",
        description:
          "Admissions, attendance, fees, and records are maintained by hand, and the workload climbs with every new intake.",
      },
      {
        title: "Engagement gaps",
        description:
          "Students and parents hear things late, through whichever channel somebody had time to use that day.",
      },
      {
        title: "Scaling delivery",
        description:
          "A programme that works for one campus or one cohort rarely survives being multiplied across several.",
      },
    ],
    solutions: [
      {
        title: "Learning platforms",
        description:
          "Course delivery, assessment, and records in one place, usable by staff and students without a training week.",
      },
      {
        title: "Automation",
        description:
          "Admissions, fee reminders, attendance, and reporting automated, so administration stops being a headcount question.",
      },
      {
        title: "Analytics",
        description:
          "Attendance, progress, and outcome data surfaced early enough for somebody to actually intervene.",
      },
    ],
    outcomes: ["Scalable delivery", "Higher engagement", "Better outcomes"],
    services: [
      "web-platform-engineering",
      "mobile-app-engineering",
      "ai-and-intelligent-automation",
      "experience-design-ui-ux",
    ],
  },
  {
    name: "Retail & E-commerce",
    blurb:
      "Inventory, orders, and customer data unified behind every channel, with storefronts engineered to hold up when demand spikes.",
    summary:
      "Helping retailers unify inventory, orders, and customer data behind every channel — and engineering storefronts that hold up when demand arrives all at once.",
    problem:
      "Store, marketplace, and website each hold their own version of inventory and the customer — traffic arrives, carts don't convert, and peak season is a stress test nobody enjoys.",
    approach:
      "Unifying inventory, orders, and customer data behind every channel, then engineering the storefront to hold up when demand spikes.",
    challenges: [
      {
        title: "Omnichannel complexity",
        description:
          "Each channel keeps its own truth about stock, price, and the customer, and the gaps surface as cancelled orders.",
      },
      {
        title: "Conversion gaps",
        description:
          "Traffic arrives and leaves — slow pages, an awkward checkout, and irrelevant merchandising each take their share.",
      },
      {
        title: "Scaling demand",
        description:
          "The platform is sized for an average day, so the campaign that finally works is the one that breaks it.",
      },
    ],
    solutions: [
      {
        title: "E-commerce platforms",
        description:
          "Storefronts engineered for speed and Core Web Vitals first, with a checkout that survives the traffic a good campaign brings.",
      },
      {
        title: "Personalization",
        description:
          "Merchandising and recommendations driven by behaviour, rather than one fixed layout that everybody sees.",
      },
      {
        title: "Integrations",
        description:
          "Inventory, orders, payments, and logistics connected, so one channel's promise is never another channel's surprise.",
      },
    ],
    outcomes: ["Higher conversion", "Unified channels", "Scalable growth"],
    services: [
      "web-platform-engineering",
      "experience-design-ui-ux",
      "digital-growth-and-marketing",
      "cloud-and-devops-engineering",
    ],
  },
  {
    name: "Government & Public Sector",
    blurb:
      "Counter-based services turned into digital ones citizens can complete themselves — built for scale, transparency, and the audit trail.",
    summary:
      "Helping public bodies turn counter-based services into digital ones citizens can complete themselves — built for scale, transparency, and the audit trail the mandate requires.",
    problem:
      "Services still depend on a counter visit and a paper trail, the systems behind them predate the mandate they now carry, and checking the status of anything becomes a phone call.",
    approach:
      "Turning counter-based services into digital ones citizens can complete themselves — built for scale, transparency, and the audit trail the mandate requires.",
    challenges: [
      {
        title: "Legacy systems",
        description:
          "Systems built for a smaller mandate now carry a much larger one, and the institutional knowledge behind them is thinning.",
      },
      {
        title: "Citizen experience",
        description:
          "A service that needs a visit, a form, and a follow-up call is measured by the citizen as a day lost.",
      },
      {
        title: "Transparency & scale",
        description:
          "Every process has to stay explainable and auditable at a volume no manual check can keep up with.",
      },
    ],
    solutions: [
      {
        title: "Digital services",
        description:
          "Applications, approvals, and status tracking citizens can complete themselves — designed for first-time and low-bandwidth users.",
      },
      {
        title: "Secure integrations",
        description:
          "Departmental systems connected with authentication, access control, and a complete audit trail.",
      },
      {
        title: "Data platforms",
        description:
          "Service data consolidated so load, backlog, and outcomes can be reported without a manual collation exercise.",
      },
    ],
    outcomes: [
      "Better citizen services",
      "Operational efficiency",
      "Trusted delivery",
    ],
    services: [
      "enterprise-software-engineering",
      "web-platform-engineering",
      "data-analytics-and-insights",
      "program-and-delivery-management",
    ],
    stories: ["nasscom-indian-oil-ai-ml-workshop"],
  },
  {
    name: "Hospitality & Tourism",
    blurb:
      "Every booking channel reconciled into one view of the guest, so service stays consistent whoever is on shift.",
    summary:
      "Helping hospitality operators reconcile every booking channel into one view of the guest — so service holds up through the busiest week of the season.",
    problem:
      "Bookings arrive from a dozen channels into systems that never quite reconcile — the front desk improvises, and the guest experience depends on who happens to be on shift.",
    approach:
      "Reconciling every booking channel into one view of the guest, so service stays consistent whoever is on shift and the seasonal peak is planned for, not survived.",
    challenges: [
      {
        title: "Disconnected booking systems",
        description:
          "Travel portals, direct bookings, and walk-ins land in different places, and reconciling them is a nightly manual job.",
      },
      {
        title: "Guest experience",
        description:
          "The guest repeats themselves at every touchpoint, because nothing carries forward what the last one already knew.",
      },
      {
        title: "Seasonal scale",
        description:
          "Capacity, staffing, and systems are sized for the quiet months and then tested in the loudest week of the year.",
      },
    ],
    solutions: [
      {
        title: "Booking & CRM platforms",
        description:
          "Every channel reconciled into one guest record, so availability, rates, and history finally agree.",
      },
      {
        title: "Mobile experiences",
        description:
          "Booking, check-in, and service requests in the guest's hand, without an app they resent installing.",
      },
      {
        title: "Automation",
        description:
          "Confirmations, reminders, upsells, and feedback handled automatically, so staff time goes to the guest in front of them.",
      },
    ],
    outcomes: [
      "Better guest experience",
      "Higher efficiency",
      "Scalable operations",
    ],
    services: [
      "web-platform-engineering",
      "mobile-app-engineering",
      "experience-design-ui-ux",
      "digital-growth-and-marketing",
    ],
  },
  {
    name: "Real Estate",
    blurb:
      "Every enquiry captured into one pipeline with an automated first response — so speed stops depending on who happens to be free.",
    summary:
      "Helping developers and brokerages capture every enquiry in one pipeline with an automated first response — so no lead is lost to a slow reply.",
    problem:
      "Enquiries come in across portals, calls, and campaigns, and the ones answered late are simply lost — with nobody able to say which source is actually producing buyers.",
    approach:
      "Capturing every enquiry into one pipeline with an automated first response — so speed stops depending on who happens to be free.",
    challenges: [
      {
        title: "Manual lead handling",
        description:
          "Enquiries are logged in whichever sheet or inbox is nearest, so follow-up depends on somebody remembering.",
      },
      {
        title: "Fragmented data",
        description:
          "Portals, campaigns, and site visits are counted separately, so nobody can say which spend actually produced a buyer.",
      },
      {
        title: "Slow response",
        description:
          "The first credible reply usually wins the buyer, and reply time depends on the hour the enquiry happened to arrive.",
      },
    ],
    solutions: [
      {
        title: "CRM & automation",
        description:
          "Every enquiry captured, routed, and followed up on a schedule that doesn't depend on who is available.",
      },
      {
        title: "Voice/AI engagement",
        description:
          "First response handled the moment an enquiry lands — qualified and logged, at any hour of the day.",
      },
      {
        title: "Portals & dashboards",
        description:
          "Inventory, pricing, and pipeline in one view for sales, channel partners, and management alike.",
      },
    ],
    outcomes: ["More qualified leads", "Faster response", "Better visibility"],
    services: [
      "ai-and-intelligent-automation",
      "web-platform-engineering",
      "digital-growth-and-marketing",
      "data-analytics-and-insights",
    ],
  },
  {
    name: "Professional Services",
    blurb:
      "Delivery put on a platform instead of in inboxes — so taking on more work doesn't mean proportionally more administration.",
    summary:
      "Helping professional firms put delivery on a platform instead of in inboxes — so winning more work stops adding proportionally more administration.",
    problem:
      "Delivery runs on documents, email threads, and a few people who remember how everything works — so growth means more billable hours and more hours nobody can bill.",
    approach:
      "Putting delivery on a platform instead of in inboxes — so taking on more work doesn't mean proportionally more administration.",
    challenges: [
      {
        title: "Manual workflows",
        description:
          "Delivery lives in documents and email threads, so quality depends on which person happened to run the engagement.",
      },
      {
        title: "Disconnected tools",
        description:
          "Time, billing, projects, and CRM each hold part of the story, and month-end is where that becomes obvious.",
      },
      {
        title: "Scaling delivery",
        description:
          "Growth adds administration faster than it adds capacity, and the senior people quietly absorb the difference.",
      },
    ],
    solutions: [
      {
        title: "Workflow platforms",
        description:
          "Engagements run on a defined workflow, so delivery is repeatable rather than remembered.",
      },
      {
        title: "Integrations",
        description:
          "Projects, time, billing, and CRM connected, so reporting becomes a query rather than a reconciliation.",
      },
      {
        title: "Automation",
        description:
          "Proposals, approvals, timesheets, and invoicing automated, so admin stops scaling with the client list.",
      },
    ],
    outcomes: ["Higher productivity", "Streamlined delivery", "Scalable growth"],
    services: [
      "program-and-delivery-management",
      "web-platform-engineering",
      "ai-and-intelligent-automation",
      "technology-advisory",
    ],
  },
];

export type IndustryWithSlug = Industry & { slug: string };

/** Every industry, with its derived slug, in canonical order. */
export const industryCatalog: IndustryWithSlug[] = RAW.map((i) => ({
  ...i,
  slug: slugify(i.name),
}));

/** Flat list of names — kept for routing, menus, and the contact form. */
export const industryNames = industryCatalog.map((i) => i.name);

/** Lookup by slug — used by the detail route. */
export const industryBySlug = new Map(industryCatalog.map((i) => [i.slug, i]));
