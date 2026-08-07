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
  handle: string | null;
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

/** Everything the header and footer need, in one response. */
export interface SiteBundle {
  settings: Settings | null;
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
  industry: string;
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
  publishConsent: boolean;
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
  tags: string[];
  overview: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  openings: number;
  salaryRange: string | null;
  status: "draft" | "published" | "closed";
  closingDate: string | null;
  postedAt: string | null;
  isActive: boolean;
}
