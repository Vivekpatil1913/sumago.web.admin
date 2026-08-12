/**
 * Central site configuration — company facts (real, from COMPANY-PROFILE.md),
 * navigation, and page metadata. Facts here are verified; do not invent.
 */
import { services } from "@/lib/services";
import { industryNames } from "@/lib/industries";
import { caseStudyCovers } from "@/lib/real-assets";

export const company = {
  name: "Sumago Infotech Pvt. Ltd.",
  shortName: "Sumago",
  tagline: "Strive With Technology…!",
  positioning:
    "Technology consulting, digital transformation & product engineering partner.",
  foundedYear: 2013,
  // Verified proof points (see COMPANY-PROFILE.md)
  metrics: [
    { value: "13+", label: "Years" },
    { value: "700+", label: "Projects delivered" },
    { value: "70+", label: "Team members" },
    { value: "50+", label: "Government clients" },
    { value: "500+", label: "Domestic clients" },
    { value: "60+", label: "International clients" },
  ],
  certifications: ["ISO 9001:2015", "CMMI Maturity Level 5"],
  leadership: [
    { name: "Sudhir Gorade", role: "Founder" },
    { name: "Sonali Gorade", role: "Co-founder & CEO" },
  ],
  phones: ["+91 85303 88815", "+91 90213 31162"],
  /** Direct pre-sales line — the "Talk to an expert" CTA on /contact. */
  expertLine: "+91 80103 85237",
  emails: ["info@sumagoinfotech.com", "careers@sumagoinfotech.com"],
  /**
   * Offices. Those with `visit: true` are walk-in locations with their own
   * phone line and opening hours — the "Visit our office" cards on /contact
   * are driven off that flag. Entries without it are presence-only.
   */
  offices: [
    {
      city: "Nashik — Govind Nagar (HQ)",
      address:
        "The Avenue, 6th Floor, Behind Prakash Petrol Pump, Govind Nagar, Nashik, Maharashtra 422009",
      visit: true,
      hours: "9 am to 7 pm, Monday to Friday",
      phone: "+91 78874 57233",
      email: "info@sumagoinfotech.com",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=The+Avenue%2C+Govind+Nagar%2C+Nashik%2C+Maharashtra+422009",
    },
    {
      city: "Nashik — Satpur MIDC",
      address: "D-24, Near KIA Workshop, NICE Area, Satpur, Nashik, Maharashtra 422007",
      visit: true,
      hours: "9 am to 7 pm, Monday to Friday",
      phone: "+91 85303 88815",
      email: "info@sumagoinfotech.com",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=D-24%2C+NICE+Area%2C+Satpur%2C+Nashik%2C+Maharashtra+422007",
    },
    {
      city: "Pune — Shivajinagar",
      address:
        "3rd Floor, Kakade Center Port, University Rd, near E-Square, Premnagar, Shivajinagar, Pune, Maharashtra 411016",
      visit: true,
      hours: "9 am to 7 pm, Monday to Friday",
      phone: "+91 84080 84888",
      email: "info@sumagoinfotech.com",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Kakade+Center+Port%2C+University+Road%2C+Shivajinagar%2C+Pune+411016",
    },
  ],
  social: [
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "X", href: "#" },
  ],
} as const;

/** Walk-in offices — the ones with their own phone line and opening hours. */
export const visitableOffices = company.offices.filter(
  (o): o is Extract<(typeof company.offices)[number], { visit: true }> => "visit" in o,
);

/**
 * Primary navigation — three grouped dropdowns. Parents are toggles only
 * (no destination of their own); every page lives as an item inside a group.
 * "Let's Connect" is a standalone conversion link (see `navCta`).
 */
export const nav = [
  {
    label: "Who We Are",
    items: [
      {
        label: "About us",
        href: "/about",
        description: "Who we are, our values, and the trust we're built on.",
      },
      {
        label: "Our team",
        href: "/team",
        description: "The founders and 70+ specialists behind the work.",
      },
      {
        label: "Life at Sumago",
        href: "/life-at-sumago",
        description: "The culture, people, and everyday craft inside Sumago.",
      },
      {
        label: "Careers",
        href: "/careers",
        description: "Open roles for people who love solving real problems.",
      },
    ],
  },
  {
    label: "Our Services",
    items: [
      {
        label: "All Services",
        href: "/solutions",
        description: "The full suite of capabilities, end to end.",
      },
      {
        label: "Industries",
        href: "/industries",
        description: "Domain expertise across ten industries.",
      },
      /* Also linked under "Our Work" — buyers shopping for AI look under
         Services, not a showcase group, so the page is reachable from both. */
      {
        label: "AI & Automation",
        href: "/innovation",
        description: "Chatbots, voice, workflow automation, and applied analytics.",
      },
    ],
  },
  {
    label: "Our Work",
    items: [
      /* Opens the group: the evaluator asks how the work is run and where from
         before the proof of it means anything. */
      {
        label: "How we deliver",
        href: "/how-we-deliver",
        description: "The engagement model, delivery centres, and infrastructure behind it.",
      },
      {
        label: "Proof of Work",
        href: "/impact",
        description: "Real transformation, measured in business outcomes.",
      },
      {
        label: "Innovations",
        href: "/innovation",
        description: "Applied AI, R&D, and what's next.",
      },
      {
        label: "Blogs",
        href: "/blog",
        description: "Engineering notes, playbooks, and perspective.",
      },
    ],
  },
] as const;

/** Standalone conversion link shown at the right of the header (its own page). */
export const navCta = { label: "Let's Connect", href: "/contact" } as const;

/**
 * In-page conversion CTA used on the hero and section closers.
 * Points at the unified "Let's Connect" page (`/contact`), which now holds the
 * intake form previously at `/start`.
 */
export const primaryCta = { label: "Let's Connect", href: "/contact" } as const;

/** All service names, derived from the unified catalog (lib/services.ts).
 *  Order and copy are managed there; this stays a flat list of names for
 *  routing and grids. */
export const capabilities = services.map((s) => s.name);

/** The 10 industry names (real), derived from the unified catalog
 *  (lib/industries.ts). Order and copy are managed there; this stays a flat
 *  list of names for routing, menus, and the contact form. */
export const industries = industryNames;

/**
 * Real flagship work — the Proof of Work section.
 *
 * Two kinds of entry live here, and the difference matters:
 *
 *   · The four **named client engagements** (Mahindra, nasscom × Indian Oil,
 *     WebespokeAI, MAMASTOPS). The clients, sectors and regions are verified
 *     (COMPANY-PROFILE.md); their `summary` / `body` / `challenge` / `solution`
 *     / `impact` / `tech` copy is SEED/SAMPLE (docs/17) — it restates what is
 *     already written in `body` rather than adding a claim, carries no invented
 *     metrics, and is replaced with verified case-study content before launch.
 *
 *   · The six **platform case studies** below them. The copy is real, authored
 *     editorial describing the systems Sumago has built, written without naming
 *     the client — so they carry no `[SAMPLE COPY]` flag and no `region`, since
 *     none is stated and inventing one would be a claim. `results` is empty on
 *     every one: no figure is published that a client has not confirmed
 *     (CLAUDE.md).
 *
 * `category` says what kind of work it was; `industry` is constrained to the
 * site's ten industries, so it answers a different question — whose sector it
 * served. Both render, category first.
 *
 * Every `cover` is licensed stock under `public/images/stock/`, which is the
 * path `isStockAsset` reads to badge it and hold it at the launch gate.
 */
export const impactStories = [
  {
    slug: "mahindra-rise-app-launch",
    title: "Mahindra Rise — App Launch",
    category: "Mobile App Engineering",
    industry: "Manufacturing",
    region: "India",
    summary:
      "Bringing a consumer-facing mobile experience to market for a leading automotive brand.",
    cover: caseStudyCovers["mahindra-rise-app-launch"].src,
    challenge:
      "Taking a consumer-facing mobile experience to market that matched the ambition of the brand behind it — fast, dependable, and simple enough that a first-time user never felt lost.",
    solution:
      "Journey mapping before feature planning, then an interface built to stay out of the way, on an architecture designed to hold its response times as usage grows.",
    impact:
      "An app that feels native on every device, ships updates safely, and scales with the audience it was built for.",
    tech: ["React Native", "REST APIs", "App analytics"],
    body: [
      "[SAMPLE COPY] The goal was a consumer-facing mobile experience that matched the ambition of the brand behind it — fast, dependable, and simple enough that a first-time user never felt lost.",
      "Work began with the user, not the feature list. Mapping the journeys people actually needed to complete shaped an interface that stays out of the way, on an architecture built to stay responsive as usage grows.",
      "The result is an app engineered to feel native on every device, ship updates safely, and scale with the audience it was built for.",
    ],
  },
  {
    slug: "nasscom-indian-oil-ai-ml-workshop",
    title: "nasscom × Indian Oil — AI/ML Workshop",
    category: "Applied AI Enablement",
    industry: "Government & Public Sector",
    region: "New Delhi, India",
    summary:
      "Upskilling enterprise teams on applied AI and machine learning through a hands-on workshop.",
    cover: caseStudyCovers["nasscom-indian-oil-ai-ml-workshop"].src,
    challenge:
      "Enterprise teams didn't need another lecture on AI — they needed to see where it actually fits their own work, and to tell a genuine use case from the hype.",
    solution:
      "A hands-on workshop built around practical sessions against real problems, rather than slides — applied machine learning worked through by the people who would sponsor it.",
    impact:
      "A team better equipped to spot, scope and sponsor AI initiatives that move the business rather than the conversation.",
    tech: ["Python", "Machine learning", "Applied AI"],
    body: [
      "[SAMPLE COPY] Enterprise teams don't need another lecture on AI — they need to see where it actually fits their work. This engagement was hands-on from the first hour.",
      "Through practical sessions, participants explored applied machine learning against real problems, building the intuition to tell a genuine use case from the hype.",
      "The outcome is a team better equipped to spot, scope, and sponsor AI initiatives that move the business — not just the conversation.",
    ],
  },
  {
    slug: "webespoke-ai",
    title: "WebespokeAI — Voice Automation",
    category: "AI & Automation",
    industry: "Professional Services",
    region: "USA & international",
    summary:
      "Voice-driven automation that turns everyday conversation into completed work.",
    cover: caseStudyCovers["webespoke-ai"].src,
    challenge:
      "Teams buried in repetitive tasks, where the forms-and-menus friction of the tools meant to help was costing more time than the work itself.",
    solution:
      "Voice-driven automation that listens, understands intent and acts — grounded in the data that matters and guarded by the controls that keep it accurate and safe.",
    impact:
      "Everyday spoken conversation turned into completed work, moving automation from something discussed to something shipped.",
    tech: ["Conversational AI", "LLMs", "Workflow automation"],
    body: [
      "[SAMPLE COPY] Voice is the most natural interface there is — and the hardest to get right. WebespokeAI turns everyday spoken conversation into completed work, without the friction of forms and menus.",
      "The system listens, understands intent, and acts — grounded in the data that matters and guarded by the right controls, so automation stays accurate and safe.",
      "For teams buried in repetitive tasks, it's the difference between talking about automation and actually shipping it.",
    ],
  },
  {
    slug: "mamastops-logistics-platform",
    title: "MAMASTOPS — Cross-Border Logistics",
    category: "Logistics Platform",
    industry: "Logistics & Transportation",
    region: "USA & international",
    summary:
      "A logistics platform connecting shippers and carriers across borders, in real time.",
    cover: caseStudyCovers["mamastops-logistics-platform"].src,
    challenge:
      "Cross-border coordination between shippers and carriers running on phone calls and spreadsheets, across time zones and regulations, with no shared picture of where anything was.",
    solution:
      "One platform carrying real-time visibility and reliable data flows, so every party works from the same picture instead of reconciling four versions of it.",
    impact:
      "A logistics operation that moves faster, with fewer surprises, at a scale spreadsheets could never carry.",
    tech: ["Node.js", "PostgreSQL", "Real-time tracking"],
    body: [
      "[SAMPLE COPY] Cross-border logistics runs on coordination — shippers, carriers, and everything in between, across time zones and regulations. MAMASTOPS brings that coordination into one platform.",
      "Real-time visibility replaces phone calls and spreadsheets, and reliable data flows keep every party working from the same picture.",
      "The result is a logistics operation that moves faster, with fewer surprises, at a scale spreadsheets could never carry.",
    ],
  },
  {
    slug: "smart-manufacturing-erp",
    title: "One Operating System for the Entire Manufacturing Operation",
    category: "Enterprise Software",
    industry: "Manufacturing",
    region: "",
    summary:
      "A manufacturing ERP that unifies the entire procure-to-production lifecycle on a single real-time platform — turning a slow, paper-bound operation into a transparent, accountable, and scalable one.",
    cover: "/images/stock/impact/smart-manufacturing-erp.jpg",
    challenge:
      "Procurement ran on paper requisitions and disconnected spreadsheets — stock levels guessed at, vendor quotes buried in inboxes, and every handoff inviting delay, error, and lost accountability.",
    solution:
      "A single ERP carrying the whole procure-to-production lifecycle — material request, vendor sourcing, purchasing, receipt, quality assurance, and payment — with approvals moving automatically between departments.",
    impact:
      "Materials arrive on time, capital stops sitting idle in overstock, quality is assured before goods reach the line, and leadership sees the operation live rather than in month-end hindsight.",
    tech: [
      "Enterprise Resource Planning",
      "Workflow & Approval Automation",
      "Real-Time Inventory Intelligence",
      "Traceability",
      "Vendor Management",
      "Executive Reporting",
    ],
    metaTitle: "Manufacturing ERP — A Single Operating System for Production",
    metaDescription:
      "A manufacturing ERP unifying procurement, inventory, quality, and finance on one real-time platform — eliminating delays, freeing trapped capital, and giving leadership a single source of truth.",
    body: [
      "In manufacturing, margin is made or lost long before the product ships — in how efficiently materials are sourced, received, and put to work. An ERP (Enterprise Resource Planning) system takes command of exactly that: a single platform unifying a manufacturer's core operations, from raw-material procurement through to supplier payment, on one connected backbone.",
      "For many manufacturers, the operation that keeps production supplied still runs on paper and disconnected spreadsheets. A department's need for materials is written down, walked between desks, and delayed; stock levels are guessed at; vendor quotes live in inboxes; goods arrive with no one certain what was ordered; and finance pays against documents it has to hunt for. Every handoff invites delay, error, and lost accountability — and the cost surfaces as stalled production, capital trapped in excess inventory, and leaders making decisions on information that is already out of date.",
      "An enterprise resource planning platform that unifies the entire procure-to-production lifecycle on a single, real-time system. From the first signal of a material need, through vendor sourcing and competitive quoting, purchasing, receipt, quality assurance, and payment, every step flows through one connected pipeline — with approvals and alerts moving automatically between production, purchasing, stores, quality, and finance. Each team works from the same live source of truth, and every material and every rupee is traceable from request to reconciliation.\n\n### The platform\n\nOne responsive web platform on a single shared backend, with a tailored view for every team in the operation:\n\n- **Production teams** — *raise material needs digitally* instead of on paper requisitions that get lost. *How it helped:* removed the delays and hand-offs that stalled the shop floor.\n- **Purchasing** — *source vendors, run competitive quotes, and issue purchase orders* through a controlled flow. *How it helped:* made procurement faster, standardized, and accountable rather than ad-hoc.\n- **Stores & inventory** — *receive goods, track real-time stock, and manage warehouse locations.* *How it helped:* ended both stockouts and trapped capital in overstock through live inventory visibility.\n- **Quality** — *inspect and formally accept goods before they enter production.* *How it helped:* ensured only verified material reaches the line, protecting output quality.\n- **Finance** — *pay vendors against matched, verified documents.* *How it helped:* removed payment errors and disputes by tying money to proof.\n- **Leadership** — *see the entire operation live* across every department. *How it helped:* moved decisions from month-end hindsight to real time.\n\n### Architecture highlights\n\n- **Modular, domain-driven design** — procurement, inventory, quality, and finance are clean, independently evolvable modules over one shared data core.\n- **A single source of truth with transactional integrity** — every department reads and writes consistent, conflict-free records, so stock and status never disagree.\n- **Role-based access control (RBAC)** — granular permissions map each department to exactly the screens and actions it needs.\n- **Built-in audit trail** — every approval, material movement, and document is logged for end-to-end traceability and compliance.\n- **Workflow-and-approval engine** — business rules move work forward; authorization is enforced, not remembered.\n\n### Technology stack\n\nBuilt on the **MERN stack** (MongoDB · Express.js · React · Node.js), giving each department a real-time, role-based web experience over one unified data layer.",
      "When the whole operation shares one system, materials arrive on time, capital stops sitting idle in overstock, and quality is assured before goods ever reach the line. Nothing is ordered twice or lost on arrival, every approval is accountable, and leadership sees the entire operation live rather than in month-end hindsight. A slow, error-prone paper chain becomes a fast, transparent operation — one built to scale as production and product lines grow, without a rebuild.",
    ],
  },
  {
    slug: "healthcare-distribution-erp",
    title: "A Single Command Center for a Medical Equipment Business",
    category: "Enterprise Software",
    industry: "Healthcare",
    region: "",
    summary:
      "A centralized ERP that runs an entire medical-equipment sales-and-service business on one document-driven flow — from quotation to payment — unifying sales, service, inventory, and multiple companies under one roof.",
    cover: "/images/stock/impact/healthcare-distribution-erp.jpg",
    challenge:
      "Selling new and refurbished machines, distributing partner brands, and honoring years of maintenance commitments — each living in its own tools and ledgers, with the seams between them leaking value.",
    solution:
      "A centralized ERP running the business on one document-driven flow, from quotation through fulfillment to payment, with inventory, procurement, service contracts, and multiple companies under a single roof.",
    impact:
      "Revenue captured end to end rather than lost in the handoffs, stock that reflects reality, and service relationships managed deliberately instead of by memory.",
    tech: [
      "Enterprise Resource Planning",
      "Document-Driven Workflow",
      "Service Contract Management",
      "Inventory Control",
      "Multi-Company Operations",
      "Executive Dashboards",
    ],
    metaTitle: "Healthcare ERP — A Command Center for Medical Equipment",
    metaDescription:
      "A centralized healthcare ERP running a medical-equipment business end to end — sales, service contracts, inventory, and multi-company operations on one document-driven platform.",
    body: [
      "A business that both sells and services complex equipment is really running several businesses at once — and its profitability depends on how well they stay in sync. An ERP holds them together: a business-management system that unifies sales, inventory, servicing, and billing within one connected platform.",
      "A medical-equipment enterprise carried an unusually complex operation: selling new and refurbished machines, distributing partner brands, and honoring years of maintenance commitments — often across more than one company. Each of these lived in its own tools and ledgers, and the seams between them leaked value. Quotations went cold, stock counts drifted from reality, long-term service contracts lapsed unnoticed, and leadership worked from numbers that were always a step behind. Growth only widened the cracks.",
      "A centralized ERP that runs the entire business on one connected, document-driven flow. Every customer relationship moves cleanly from quotation through fulfillment to payment, with nothing falling between the stages — while inventory, procurement, service contracts, and multiple business lines are managed under a single roof. Leadership gains a live command center across the whole operation, and each function draws on the same current, trusted data instead of its own private version of the truth.\n\n### The platform\n\nOne responsive web platform, unified across one or many companies, with a role-based view for each team:\n\n- **Sales** — *manage customers and move every deal from quotation to order* on a single connected flow. *How it helped:* stopped quotes from going cold and tied every document back to its account.\n- **Service** — *track maintenance contracts (AMC/CMC) across their full life.* *How it helped:* turned lucrative service relationships into deliberately managed revenue instead of forgotten commitments.\n- **Inventory & procurement** — *keep a real-time view of stock and purchase to actual demand.* *How it helped:* kept the right products available without tying up cash in overstock.\n- **Finance** — *manage invoicing and payments in step with operations.* *How it helped:* kept the money side as current as the sales side, closing revenue leaks.\n- **Leadership** — *see sales, service, and stock live* across every company. *How it helped:* gave a single, trusted picture of a complex, multi-entity business.\n\n### Architecture highlights\n\n- **Multi-company data isolation** — several business entities run on one platform with strict separation of their data.\n- **Document-driven state machine** — the quotation-to-payment lifecycle is modeled as controlled state transitions, so no record can skip or corrupt a step.\n- **Transactional integrity** — financial and inventory operations are atomic and consistent, protecting the numbers leadership relies on.\n- **Compliance-grade audit trails** — every action is traceable, meeting the accountability a medical-equipment business demands.\n- **Role-based access with secure data handling** — sensitive data is protected and every action is scoped to a role.\n\n### Technology stack\n\nBuilt on the **MERN stack** (MongoDB · Express.js · React · Node.js) for a real-time, multi-company web platform.",
      "With the operation unified, revenue is captured end to end rather than lost in the handoffs, stock reflects reality, and lucrative service relationships are managed deliberately instead of by memory. Multiple companies and product lines run in concert rather than in silos, and leaders see the true state of sales, service, and inventory in real time. The business stops spending its energy reconciling systems that disagree — and starts compounding on a backbone built to scale.",
    ],
  },
  {
    slug: "multi-vendor-b2b2c-marketplace",
    title: "An Aggregator Platform for a Fragmented, High-Value Market",
    category: "Platform & Commerce",
    industry: "Retail & E-commerce",
    region: "",
    summary:
      "A B2B2C aggregator platform that organizes a fragmented, low-trust trade into a single trusted marketplace — connecting dealers and buyers, powered by a recurring-revenue subscription model and network effects.",
    cover: "/images/stock/impact/multi-vendor-b2b2c-marketplace.jpg",
    challenge:
      "A vast, high-value trade running without a home: buyers with no reliable way to discover genuine inventory, sellers with no efficient way to reach an audience, and no trusted intermediary in the middle.",
    solution:
      "A B2B2C aggregator bringing both sides onto one trusted marketplace — a buyer app, a seller app, and an operator platform that verifies participants and governs quality across the ecosystem.",
    impact:
      "A fragmented, informal trade converted into an organized, trust-driven market with its own gravity — monetized through a recurring-revenue subscription that grows with seller success.",
    tech: [
      "Marketplace Architecture",
      "Trust & Verification",
      "Discovery & Search",
      "Subscription Monetization",
      "Operator Governance",
    ],
    metaTitle: "B2B2C Aggregator Platform — Organizing a Fragmented Market",
    metaDescription:
      "A B2B2C aggregator platform that turns a fragmented, informal trade into a trusted marketplace connecting dealers and buyers, built on a recurring-revenue subscription model.",
    body: [
      "Some of the largest opportunities hide inside the messiest markets — trades where demand is huge but everything happens informally, offline, and on trust that is hard to verify. A B2B2C online marketplace brings order to that chaos: an aggregator platform uniting many independent sellers and buyers on a single, trusted commerce network.",
      "A vast, high-value trade was running without a home. Buyers had no reliable way to discover genuine inventory or compare it with confidence; sellers had no efficient way to reach a wider audience; and with no trusted intermediary in the middle, every transaction carried friction and risk. The value was undeniable — but it was scattered across countless disconnected sellers, invisible to the buyers who wanted it. The opportunity was not a better listing site; it was to organize an entire market.",
      "A B2B2C aggregator platform that brings both sides of the trade onto one trusted marketplace. Sellers gain reach and a professional storefront through a subscription that scales with their ambition; buyers gain effortless discovery, confident comparison, and a direct line to verified sellers; and the platform operator governs quality and trust across the whole ecosystem — verifying participants, curating what appears, and keeping the marketplace credible as it grows. Two purpose-built experiences, one connected network.\n\n### The platform\n\nA three-part ecosystem on one shared backend, each surface built for a different user:\n\n- **Buyer App (Android & iOS)** — *for the consumer.* A simple, mobile-first way to discover inventory, compare with confidence, and connect directly with verified sellers. *How it helped:* removed the friction and doubt that kept buyers away, drawing demand onto the platform and giving the marketplace its pull.\n- **Seller App (Android & iOS)** — *for the dealer.* A self-serve storefront to list inventory, manage listings, respond to interest, and track demand — all from a phone. *How it helped:* gave sellers real reach and control, attracting the supply that makes the marketplace worth visiting and driving the recurring subscription revenue.\n- **Web Operations Platform** — *for the operator.* The command layer to verify participants, curate listings, run the subscription model, and govern trust across the whole market. *How it helped:* kept the marketplace credible and commercially healthy as it scaled — the trust engine that lets both sides transact safely.\n\n### Architecture highlights\n\n- **API-first, shared-backend architecture** — two mobile apps and the operator platform are served by one consistent API, so every surface stays in sync.\n- **Discovery-optimized data layer** — catalog modeling and indexing tuned to keep search and comparison fast as listings scale into the thousands.\n- **Horizontally scalable and cache-backed** — stateless services plus caching and a CDN for media keep the experience fast under load.\n- **Decoupled monetization layer** — subscription and payment logic is isolated from the marketplace core, so commercial rules can evolve without risk.\n- **Secure, token-based auth** — frictionless OTP onboarding with JWT-secured sessions across every app.\n\n### Technology stack\n\nThe buyer and seller apps are built as **cross-platform React Native** mobile applications — one build that runs natively on **both Android and iOS** — while the operator platform and backend run on the **MERN stack** (MongoDB · Express.js · React · Node.js).",
      "The platform converts a fragmented, informal trade into an organized, trust-driven market with its own gravity: the more sellers list, the more buyers browse, and the more each side has a reason to stay. Monetization comes not from one-off fees but from a **recurring-revenue subscription model** that grows with seller success — a business that compounds as the network expands. For the operator, it turns market chaos into a defensible, scalable, and self-reinforcing asset.",
    ],
  },
  {
    slug: "proptech-property-portal",
    title: "A Lead-Generation Engine for Real Estate",
    category: "PropTech Platform",
    industry: "Real Estate",
    region: "",
    summary:
      "A proptech platform that connects property buyers with owners and agents and turns fragmented discovery into a disciplined pipeline of qualified enquiries — pairing a buyer-facing marketplace with a central operations layer.",
    cover: "/images/stock/impact/proptech-property-portal.jpg",
    challenge:
      "Property discovery was fragmented and slow — listings scattered and often stale, buyers unable to narrow options efficiently, and genuine enquiries slipping through the cracks for want of a disciplined way to capture them.",
    solution:
      "A proptech platform pairing a fast, mobile-first public marketplace with a central operations layer that gives the business control over its inventory, its enquiries, and the content buyers see.",
    impact:
      "Browsers become qualified enquiries, enquiries feed a pipeline the business can actually work, and no genuine interest is left to evaporate.",
    tech: [
      "Marketplace Architecture",
      "Intelligent Discovery",
      "Lead Capture & Pipeline",
      "Inventory Management",
      "Operations Console",
    ],
    metaTitle: "PropTech Platform — A Lead-Generation Engine for Real Estate",
    metaDescription:
      "A proptech platform connecting buyers with owners and agents, turning property discovery into qualified leads, backed by a central operations layer for inventory and pipeline control.",
    body: [
      "In real estate, the scarce resource is never property — it is the qualified buyer, found while their interest is still hot. A property portal is built to find and hold that buyer: a real-estate platform where people discover and enquire about homes, backed by a CRM (customer-relationship management) system that helps the business capture and convert every lead.",
      "Property discovery was fragmented and slow. Listings were scattered and often stale, buyers had no efficient way to narrow options to what genuinely fit, and sellers and agents struggled to reach the right buyer at the right moment. Interest evaporated in the gaps, and the enquiries that did surface too often slipped through the cracks because there was no disciplined way to capture and act on them. For a business whose lifeblood is lead flow, that was revenue leaking daily.",
      "A proptech platform that connects buyers directly with owners and agents and makes the journey from casual interest to serious enquiry as short as possible. Buyers explore a fast, intuitive marketplace and narrow options to exactly what fits; owners and agents list and reach a ready audience; and behind the public experience sits a central operations layer that gives the business disciplined control over its inventory, its enquiries, and the content buyers see. Discovery on the front end, a managed pipeline on the back end — one connected system built around generating and converting demand.\n\n### The platform\n\nTwo connected surfaces on one shared backend — a public marketplace out front, a managed pipeline behind it:\n\n- **Public Web Marketplace** — *for buyers, owners, and agents.* A fast, mobile-first experience to search and narrow properties, view rich listings, and enquire — while owners and agents list and reach a ready audience. *How it helped:* turned scattered, stale discovery into effortless search that converts interest into enquiries while it's still hot.\n- **Web Operations Platform** — *for the business.* The control layer to manage the property inventory, capture and work every lead, and govern the content buyers see. *How it helped:* gave the business a disciplined pipeline so no genuine enquiry evaporates — turning a reactive process into a predictable source of growth.\n\n### Architecture highlights\n\n- **Decoupled public/operations architecture** — the buyer-facing marketplace and the internal operations platform are cleanly separated but share one data core.\n- **SEO-optimized, mobile-first delivery** — fast, search-friendly rendering so listings are discoverable and rank where buyers look.\n- **Search-and-filter optimization** — indexing tuned for fast, relevant property discovery at scale.\n- **Structured lead-pipeline model** — every enquiry is captured into a workable pipeline rather than a disconnected form submission.\n- **Cache- and CDN-backed media** — property imagery loads fast at any traffic level.\n\n### Technology stack\n\nBuilt on the **MERN stack** (MongoDB · Express.js · React · Node.js) with a mobile-first, responsive React front end.",
      "By making discovery effortless and enquiry capture automatic, the platform keeps momentum alive where deals are usually won or lost. Browsers become qualified enquiries, enquiries feed a pipeline the business can actually work, and no genuine interest is left to evaporate. Leadership gains a clear view of demand and a disciplined engine for converting it — turning a scattered, reactive process into a predictable source of growth.",
    ],
  },
  {
    slug: "smart-society-management-platform",
    title: "A Digital Operating System for Residential Communities",
    category: "SaaS Platform",
    industry: "Real Estate",
    region: "",
    summary:
      "A community-living platform that digitizes the entire operation of a residential society — finances, security, and governance — with tailored experiences for every stakeholder and centralized oversight for operators managing communities at scale.",
    cover: "/images/stock/impact/smart-society-management-platform.jpg",
    challenge:
      "Societies run on manual processes that satisfied no one: maintenance collected by chasing, gate access recorded in unauditable registers, finances in books only one person could read, and residents with little visibility.",
    solution:
      "A community-living platform digitizing the whole operation, with a purpose-built surface for residents, security, finance, and committee — under a centralized oversight layer for multi-community operators.",
    impact:
      "Payments are trackable, access is secure and recorded, finances are transparent by default, and the operator gains a scalable, recurring-revenue platform that grows community by community.",
    tech: [
      "SaaS Platform",
      "Multi-Community Oversight",
      "Role-Based Experiences",
      "Digital Payments",
      "Real-Time Operations",
    ],
    metaTitle: "Community Management Platform — A Digital Operating System",
    metaDescription:
      "A SaaS community-living platform that digitizes society operations — payments, security, and finances — with role-based experiences and centralized oversight for multi-community operators.",
    body: [
      "A residential community is a small economy — collecting money, controlling access, keeping accounts, and answering to its members. Run it on paper, and every one of those functions becomes a source of friction. A society-management platform removes that friction: the digital backbone for how a community operates, unifying maintenance collection, gate security, and financial administration in one system.",
      "Residential societies were being run on manual processes that satisfied no one. Maintenance was collected by chasing; access at the gate was recorded in registers no one could audit; finances lived in books only one person could read; and residents had little visibility into where their money went or what their committee decided. The result was friction, disputes, and a heavy administrative burden. For the operators managing many such communities, the problem multiplied — with no standardized, scalable way to oversee a growing portfolio.",
      "A community-living platform that digitizes the entire operation of a residential society onto one connected system. Each stakeholder gets an experience built for their role — residents manage payments, approvals, and communication from their phone; on-ground security manages access and attendance in real time; finance manages billing, expenses, and reporting with full transparency; and community leadership governs the whole operation with every action traceable. Above them all sits a centralized oversight layer that lets an operator onboard, standardize, and manage an entire portfolio of communities from one place.\n\n### The platform\n\nA full suite on one shared backend, with a purpose-built surface for every stakeholder:\n\n- **Resident App (Android & iOS)** — *for the community member.* Pay maintenance, approve visitors, read notices, and raise concerns from the phone. *How it helped:* gave residents transparency and convenience, replacing chase-ups and disputes with confidence in how the community is run.\n- **Security App (Android & iOS)** — *for the on-ground guard.* Manage visitor and delivery access, capture approvals instantly, and log attendance. *How it helped:* turned an unauditable paper register into instant, recorded, verifiable gate security.\n- **Finance App (Android & iOS)** — *for the treasurer.* Manage billing, expenses, and clear financial reporting. *How it helped:* made the community's money transparent by default, ending the opacity that bred mistrust.\n- **Leadership Web Platform** — *for the committee.* Govern residents, billing, notices, complaints, and access — every action traceable. *How it helped:* cut the committee's administrative burden while making governance accountable.\n- **Operator Web Platform** — *for the managing operator.* Onboard, standardize, and oversee an entire portfolio of communities from one place. *How it helped:* turned society management into a scalable, recurring-revenue service that grows community by community.\n\n### Architecture highlights\n\n- **Multi-tenant SaaS with a tenant hierarchy** — federations group communities, each fully isolated, all governed from one platform.\n- **Strict per-tenant data isolation** — one community's data can never reach another's, enforced below the application layer.\n- **Real-time layer** — live visitor approvals and push notifications delivered over a real-time channel.\n- **Secure payments integration** — maintenance collection flows through an isolated, security-conscious payment layer.\n- **Role-based access across every stakeholder** — resident, security, finance, committee, and operator each see only what their role permits.\n\n### Technology stack\n\nThe resident, security, and finance apps are built as **cross-platform React Native** mobile applications — one build that runs natively on **both Android and iOS** — while the leadership and operator platforms and backend run on the **MERN stack** (MongoDB · Express.js · React · Node.js).",
      "With everyone working from the same real-time system, the friction that breeds disputes simply disappears: payments are trackable, access is secure and recorded, notices reach every resident, and the finances are transparent by default. Committees carry less administrative weight and residents gain genuine confidence in how their community is run. For the operator, it becomes a scalable, recurring-revenue platform — one that can grow community by community on a single, standardized foundation.",
    ],
  },
  {
    slug: "ai-voice-automation-platform",
    title: "An AI Voice Workforce That Never Misses a Customer",
    category: "AI & Automation",
    industry: "Professional Services",
    region: "",
    summary:
      "An AI-powered voice automation platform that acts as an always-on virtual agent — engaging every caller in natural conversation, qualifying interest, and booking meetings, so no revenue opportunity is ever lost to a missed call.",
    cover: "/images/stock/impact/ai-voice-automation-platform.jpg",
    challenge:
      "Calls arrive after hours, during a rush, or faster than the team can pick up — and each unanswered ring is a ready customer who simply moves on to whoever answered first.",
    solution:
      "An always-on AI voice agent holding natural conversations with every caller — understanding intent, qualifying interest, and scheduling meetings — with a web control platform for visibility and governance.",
    impact:
      "A front door that never closes: demand captured the moment it appears, a consistent on-brand experience on every call, and a team freed for the conversations that need a human.",
    tech: [
      "Conversational AI",
      "Natural Language Understanding",
      "Voice Synthesis",
      "CRM Orchestration",
      "Calendar Automation",
      "Performance Intelligence",
    ],
    metaTitle: "AI Voice Automation Platform — An Always-On Virtual Agent",
    metaDescription:
      "An AI voice automation platform that answers every call, qualifies leads, and books meetings around the clock — a virtual agent that turns missed calls into captured revenue.",
    body: [
      "The telephone is still where a remarkable amount of revenue is won or lost — and for most businesses, it is quietly leaking both. An AI-powered voice agent closes that gap: an automated system that answers every call, holds a natural conversation, qualifies the caller's interest, and schedules meetings — the work of a front-desk team, delivered autonomously and around the clock.",
      "Every business depends on conversations it cannot always be present for. Calls arrive after hours, during a rush, or faster than the team can pick up — and each unanswered ring is a ready customer who simply moves on to whoever answered first. The traditional fix is to hire, train, and roster more people, yet capacity always runs thinnest at the exact moments demand peaks. Leaders are left choosing between the cost of over-staffing and the cost of missed opportunity.",
      "An AI-powered voice automation platform that works as an always-on virtual agent for the business. It holds natural, human-like conversations with every caller — understanding what they want, answering their questions, qualifying their intent, and scheduling meetings while their interest is still high. It works around the clock, handles a surge of conversations at once without a queue, and captures every interaction directly into the systems the business already runs on, so a call ends not in a note to follow up later, but in a qualified opportunity in motion.\n\n### The platform\n\nTwo connected layers — the agent customers experience, and the platform the business controls it from:\n\n- **The AI Voice Agent** — *for the customer.* The always-on virtual agent every caller actually speaks to — understanding intent, answering questions, qualifying interest, and booking meetings in natural conversation. *How it helped:* ensured no caller ever hit a dead end, capturing round-the-clock demand that used to slip away to whoever answered first.\n- **The Web Control Platform** — *for the business.* The command center where leadership sees every conversation and lead, tracks performance, and steers how the agent behaves. *How it helped:* turned an automated channel from a black box into a managed, trusted part of operations — full visibility and control over an autonomous workforce.\n\n### Architecture highlights\n\n- **Event-driven, asynchronous core** — calls, transcriptions, and follow-up actions flow through an event pipeline, so nothing blocks and every step stays independently reliable.\n- **Horizontally scalable, stateless services** — capacity scales out on demand to absorb call surges without a queue or a dropped conversation.\n- **Resilient integration layer** — CRM, calendar, and telephony connect through an isolated, fault-tolerant layer, so a third-party hiccup never takes the agent down.\n- **Real-time streaming to the control platform** — live call data pushes to leadership's view over a streaming channel for instant visibility.\n- **Secure by design** — token-based access and encrypted handling of every customer interaction.\n\n### Technology stack\n\nBuilt on the **MERN stack** (MongoDB · Express.js · React · Node.js) for a fast, real-time web platform, integrated with conversational-AI, speech, and telephony services.",
      "The result is a front door that never closes. Genuine demand is captured the moment it appears instead of cooling overnight; every customer receives the same confident, on-brand experience; and the team is freed from repetitive call handling to focus on the high-value conversations that need a human touch. In a market where the business that responds first usually wins, always answering becomes a durable, compounding advantage.",
    ],
  },
] as const;
