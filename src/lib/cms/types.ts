/**
 * Shapes returned by the public API.
 *
 * These mirror the server's module registry (`src/modules/` in the backend)
 * field for field. Names are camelCase because the API converts every
 * snake_case column on the way out.
 *
 * Nullability is honest: a column that is nullable in Postgres is `| null`
 * here, so a template cannot forget to handle the empty case.
 */

/** Fields every published content record carries (PRD §4.3). */
interface BaseRecord {
  id: string;
  status: "draft" | "published";
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** The SEO group appended to any module with `hasSeo`. */
export interface SeoFields {
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  ogImageAlt: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
}

/* -------------------------------------------------------------------------- */
/* Module 13a–13d — Contact & presence                                        */
/* -------------------------------------------------------------------------- */

export interface Office extends BaseRecord {
  name: string;
  slug: string;
  addressLine1: string;
  addressLine2: string | null;
  locality: string | null;
  city: string;
  state: string;
  postalCode: string | null;
  country: string;
  /** Composed server-side from the parts above — one formatted line. */
  address: string;
  mapUrl: string;
  mapEmbedUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  hours: string | null;
  image: string | null;
  isHQ: boolean;
  /** Walk-in location — gets a "Visit our office" card on /contact. */
  visit: boolean;
}

export interface ContactPhone extends BaseRecord {
  label: string;
  phoneNumber: string;
  purpose: "general" | "sales" | "support" | "careers" | "expert";
  isWhatsapp: boolean;
  isPrimary: boolean;
  showInHeader: boolean;
  showInFooter: boolean;
  office: string | null;
}

export interface ContactEmail extends BaseRecord {
  label: string;
  emailAddress: string;
  purpose: "general" | "sales" | "careers" | "support" | "privacy";
  isPrimary: boolean;
  showInFooter: boolean;
}

export interface SocialLink extends BaseRecord {
  platform: string;
  label: string;
  href: string;
  icon: string;
  openInNewTab: boolean;
  showInHeader: boolean;
  showInFooter: boolean;
}

/* -------------------------------------------------------------------------- */
/* Module 13 — General Settings                                               */
/* -------------------------------------------------------------------------- */

export interface Metric {
  value: string;
  label: string;
}

export interface Settings {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  positioning: string;
  foundedYear: number;
  logo: string;
  favicon: string | null;
  expertLine: string | null;
  businessHours: string | null;
  metrics: Metric[];
  certifications: string[];
  cin: string | null;
  gstin: string | null;
  copyrightText: string | null;
  defaultOgImage: string | null;
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface Navigation {
  groups: NavGroup[];
  ctaLabel: string;
  ctaHref: string;
  footerColumns: NavGroup[];
}

/**
 * Everything the header and footer need, in one response.
 *
 * Company identity is not in here: it is static (`SITE_SETTINGS` in
 * `cms/index.ts`), so the API no longer sends it and nothing reads it.
 */
export interface SiteBundle {
  navigation: Navigation | null;
  offices: Office[];
  phones: ContactPhone[];
  emails: ContactEmail[];
  social: SocialLink[];
}

/* -------------------------------------------------------------------------- */
/* Module 4 — Blog                                                            */
/* -------------------------------------------------------------------------- */

export interface BlogPostRecord extends BaseRecord, SeoFields {
  title: string;
  slug: string;
  excerpt: string;
  /** Rich text. Paragraphs are separated by blank lines. */
  body: string;
  cover: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string | null;
  authorAvatar: string | null;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Set to hold the post back until this moment, even once published. */
  publishAt: string | null;
  readingTime: string | null;
  featured: boolean;
  viewCount: number;
}

/* -------------------------------------------------------------------------- */
/* Module 3 — Success Stories (Proof of Work)                                 */
/* -------------------------------------------------------------------------- */

export interface StoryResult {
  value: string;
  label: string;
}

export interface GalleryImage {
  url: string;
  alt: string;
}

export interface SuccessStoryRecord extends BaseRecord, SeoFields {
  title: string;
  slug: string;
  summary: string;
  client: string | null;
  /**
   * What kind of work it was — "Enterprise Software", "PropTech Platform".
   * `industry` answers a different question (whose sector it served) and is
   * constrained to the site's ten industries, so a platform serving five at once
   * has nowhere else honest to say what it is. Null on the older stories.
   */
  category: string | null;
  industry: string;
  /** Empty for work not tied to one place — the page omits it rather than guessing. */
  region: string;
  coverImage: string;
  gallery: GalleryImage[];
  background: string;
  challenge: string;
  solution: string;
  technologies: string[];
  impact: string;
  results: StoryResult[];
  roi: string | null;
  timeline: string | null;
  completedOn: string | null;
  featured: boolean;
  testimonial: string | null;
  relatedServices: string[];
}

/* -------------------------------------------------------------------------- */
/* Module 12 — Innovation                                                     */
/* -------------------------------------------------------------------------- */

export interface InnovationItem extends BaseRecord {
  title: string;
  description: string;
  /** lucide-react icon name. */
  icon: string;
  category: string | null;
  image: string | null;
  highlights: string[];
  linkUrl: string | null;
  linkLabel: string | null;
}

export interface InnovationOutcome extends BaseRecord {
  title: string;
  note: string;
  icon: string | null;
}

/* -------------------------------------------------------------------------- */
/* Module 1 — Services                                                        */
/* -------------------------------------------------------------------------- */

/** A reader the service is written for — "is this me?", answered in two lines. */
export interface WhoFor {
  title: string;
  description: string;
}

export interface ServiceRecord extends BaseRecord, SeoFields {
  name: string;
  slug: string;
  /** Icon *name*, resolved through `CMS_ICONS` — never a component. */
  icon: string;
  phase: "Consulting" | "Designing" | "Building" | "Marketing" | "Support";
  blurb: string;
  problem: string;
  summary: string;
  approach: string;
  deliverables: string[];
  outcomes: string[];
  technologies: string[];
  tools: string[];
  whoFor: WhoFor[];
  /** Slugs of success stories that genuinely involved this service. */
  stories: string[];
  featured: boolean;
  /**
   * Derived from `stories`, not a column — true only when a real, verified
   * story backs this service. Three of fifteen qualify, and the detail page
   * shows a `[REAL PROOF NEEDED]` flag outside production for the rest, so the
   * gap stays visible instead of being filled with invented outcomes.
   */
  hasProof: boolean;
}

/* -------------------------------------------------------------------------- */
/* Module 2 — Industries                                                      */
/* -------------------------------------------------------------------------- */

/** A friction the sector arrives with, or the thing built to answer it. */
export interface IndustryPointRecord {
  title: string;
  description: string;
}

/**
 * `challenges[i]`, `solutions[i]` and `outcomes[i]` are read in step: the
 * friction, what gets built for it, what changes. The detail template relies on
 * that pairing, so the three stay the same length and in the same order.
 */
export interface IndustryRecord extends BaseRecord, SeoFields {
  name: string;
  slug: string;
  icon: string;
  image: string;
  /**
   * Optional in the panel and nullable in the column, but never null here:
   * `normaliseIndustry` coerces it, so the index card renders an empty line
   * rather than the string "null" or a crash in a template that reasonably
   * expects text.
   */
  blurb: string;
  /** Superseded by `summary`; still populated on older rows. */
  intro: string | null;
  summary: string;
  problem: string;
  approach: string;
  challenges: IndustryPointRecord[];
  solutions: IndustryPointRecord[];
  outcomes: string[];
  /** Slugs from the service catalog. */
  services: string[];
  /** Slugs from the success-story catalog. */
  stories: string[];
}

/* -------------------------------------------------------------------------- */
/* Modules 5–8 — Proof & trust                                                */
/* -------------------------------------------------------------------------- */

export interface TestimonialRecord extends BaseRecord {
  quote: string;
  name: string;
  role: string;
  company: string | null;
  avatar: string | null;
  /** Avatar background when there is no photograph. */
  accent: string | null;
  rating: number;
  featured: boolean;
}

export type ClientSegment = "government" | "enterprise" | "growth";

export interface ClientRecord extends BaseRecord {
  name: string;
  /** Without one the site shows the name as text — never a broken image. */
  logo: string | null;
  /** The geography the admin panel filters and reports on. */
  type: "Government" | "Domestic" | "International";
  /** The constituency the About page's trust wall groups by. */
  segment: ClientSegment;
  website: string | null;
}

export interface LeaderRecord extends BaseRecord {
  name: string;
  role: string;
  photo: string;
  bio: string | null;
  quote: string | null;
  /**
   * Null unless a real profile URL is published. The committed value was "#",
   * and the Team page rendered nine LinkedIn icons that went nowhere — which
   * costs more trust than showing no icon, the same call the footer's social
   * links make. No URL, no icon.
   */
  linkedin: string | null;
  /** Empty for a founder; set for a function lead (e.g. "Technology"). */
  department: string | null;
  /** Short labels drawn as annotations around a function lead's portrait. */
  traits: string[];
}

export interface AwardRecord extends BaseRecord {
  title: string;
  /** For the compact badge treatment. */
  short: string;
  detail: string;
  /** A year, or "Certified" for a standing certification. */
  year: string;
  kind: "certification" | "award";
  /** Icon name for the seal or the timeline marker. */
  icon: string | null;
  image: string | null;
  /* The procurement read — see the note on the module in the API's registry. */
  tagline: string | null;
  org: string | null;
  scope: string | null;
  standing: string | null;
  recipient: string | null;
}

export interface MediaMentionRecord extends BaseRecord {
  outlet: string;
  title: string | null;
  url: string | null;
  date: string | null;
}

/* -------------------------------------------------------------------------- */
/* Module 9 — Process                                                         */
/* -------------------------------------------------------------------------- */

export interface ProcessStepRecord extends BaseRecord {
  title: string;
  description: string;
  icon: string;
  /** Matches a `ProcessPhaseRecord.name`. */
  phase: string;
}

export interface ProcessPhaseRecord extends BaseRecord {
  name: string;
  tagline: string | null;
}

/* -------------------------------------------------------------------------- */
/* Modules 10–11 — FAQs and culture                                           */
/* -------------------------------------------------------------------------- */

export interface FaqRecord extends BaseRecord {
  q: string;
  /** Rich text. Paragraphs are separated by blank lines. */
  a: string;
  category: string | null;
}

/** Culture values and growth opportunities share a shape. */
export interface IconItemRecord extends BaseRecord {
  icon: string;
  title: string;
  description: string;
}

export interface EventGalleryRecord extends BaseRecord {
  key: string;
  title: string;
  images: GalleryImage[];
}

/* -------------------------------------------------------------------------- */
/* Modules 15–16 — SEO metadata and legal pages                               */
/* -------------------------------------------------------------------------- */

/**
 * A per-page override, as served by `/api/public/seo` keyed on `page`.
 * A page absent from that map keeps whatever its own `metadata` export says.
 */
export interface SeoMetadataRecord {
  page: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string | null;
  noIndex: boolean;
}

export interface LegalPageRecord extends BaseRecord {
  title: string;
  slug: string;
  /** Rich text. Paragraphs are separated by blank lines. */
  body: string;
  lastUpdated: string;
}

/* -------------------------------------------------------------------------- */
/* Module 18 — Jobs (HR)                                                      */
/* -------------------------------------------------------------------------- */

export interface JobRecord {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  summary: string;
  /** The three sections of the job page, in the order they are read. */
  overview: string;
  responsibilities: string[];
  requirements: string[];
  openings: number;
  status: "draft" | "published" | "closed";
  closingDate: string | null;
  postedAt: string | null;
  isActive: boolean;
}
