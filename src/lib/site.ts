/**
 * Central site configuration — company facts (real, from COMPANY-PROFILE.md),
 * navigation, and page metadata. Facts here are verified; do not invent.
 */
import { services } from "@/lib/services";
import { industryNames } from "@/lib/industries";
import { previewImages } from "@/lib/preview-assets";

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
 * Real flagship work. `summary` + `body` are SEED/SAMPLE copy (docs/17) — no
 * invented metrics; replace with verified case-study content before launch.
 */
export const impactStories = [
  {
    slug: "mahindra-rise-app-launch",
    title: "Mahindra Rise — App Launch",
    industry: "Manufacturing / Automotive",
    region: "India",
    summary:
      "Bringing a consumer-facing mobile experience to market for a leading automotive brand.",
    cover: previewImages.developers,
    body: [
      "[SAMPLE COPY] The goal was a consumer-facing mobile experience that matched the ambition of the brand behind it — fast, dependable, and simple enough that a first-time user never felt lost.",
      "Work began with the user, not the feature list. Mapping the journeys people actually needed to complete shaped an interface that stays out of the way, on an architecture built to stay responsive as usage grows.",
      "The result is an app engineered to feel native on every device, ship updates safely, and scale with the audience it was built for.",
    ],
  },
  {
    slug: "nasscom-indian-oil-ai-ml-workshop",
    title: "nasscom × Indian Oil — AI/ML Workshop",
    industry: "Energy / Public Sector",
    region: "New Delhi, India",
    summary:
      "Upskilling enterprise teams on applied AI and machine learning through a hands-on workshop.",
    cover: previewImages.aiml,
    body: [
      "[SAMPLE COPY] Enterprise teams don't need another lecture on AI — they need to see where it actually fits their work. This engagement was hands-on from the first hour.",
      "Through practical sessions, participants explored applied machine learning against real problems, building the intuition to tell a genuine use case from the hype.",
      "The outcome is a team better equipped to spot, scope, and sponsor AI initiatives that move the business — not just the conversation.",
    ],
  },
  {
    slug: "webespoke-ai",
    title: "WebespokeAI — Voice Automation",
    industry: "Cross-industry",
    region: "USA & international",
    summary:
      "Voice-driven automation that turns everyday conversation into completed work.",
    cover: previewImages.voiceAi,
    body: [
      "[SAMPLE COPY] Voice is the most natural interface there is — and the hardest to get right. WebespokeAI turns everyday spoken conversation into completed work, without the friction of forms and menus.",
      "The system listens, understands intent, and acts — grounded in the data that matters and guarded by the right controls, so automation stays accurate and safe.",
      "For teams buried in repetitive tasks, it's the difference between talking about automation and actually shipping it.",
    ],
  },
  {
    slug: "mamastops-logistics-platform",
    title: "MAMASTOPS — Cross-Border Logistics",
    industry: "Logistics & Transportation",
    region: "USA & international",
    summary:
      "A logistics platform connecting shippers and carriers across borders, in real time.",
    cover: previewImages.logistics,
    body: [
      "[SAMPLE COPY] Cross-border logistics runs on coordination — shippers, carriers, and everything in between, across time zones and regulations. MAMASTOPS brings that coordination into one platform.",
      "Real-time visibility replaces phone calls and spreadsheets, and reliable data flows keep every party working from the same picture.",
      "The result is a logistics operation that moves faster, with fewer surprises, at a scale spreadsheets could never carry.",
    ],
  },
] as const;
