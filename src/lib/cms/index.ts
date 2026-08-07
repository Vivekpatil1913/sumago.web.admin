/**
 * The website's content accessors.
 *
 * One function per thing a page needs. Each reads the admin API and falls back
 * to the committed content in `src/lib/*` when the API has nothing to give —
 * see the note in `client.ts` for why that fallback is deliberate rather than
 * defensive clutter.
 *
 * Pages import from here and nowhere else, so moving a section from hardcoded
 * to CMS-driven is a change in this file, not in the page.
 */
import { cache } from "react";

import { getContent, getContentBySlug, getJson } from "./client";
import type {
  BlogPostRecord,
  ContactEmail,
  ContactPhone,
  InnovationItem,
  InnovationOutcome,
  JobRecord,
  Metric,
  NavGroup,
  Navigation,
  Office,
  Settings,
  SiteBundle,
  SocialLink,
  SuccessStoryRecord,
} from "./types";

import { company } from "@/lib/site";
import { blogPosts as staticPosts } from "@/lib/blog";
import { impactStories as staticStories } from "@/lib/site";
import { intelligentOutcomes, intelligentSystems } from "@/lib/content";
import { previewImages } from "@/lib/preview-assets";

/* -------------------------------------------------------------------------- */
/* Fallbacks                                                                  */
/*                                                                            */
/* Built once from the committed content so the shapes match the API exactly. */
/* Anything the static data has no equivalent for is null, never invented.    */
/* -------------------------------------------------------------------------- */

const RECORD_DEFAULTS = {
  id: "",
  status: "published" as const,
  isActive: true,
  order: 0,
  createdAt: "",
  updatedAt: "",
};

const SEO_DEFAULTS = {
  metaTitle: null,
  metaDescription: null,
  ogImage: null,
  ogImageAlt: null,
  canonicalUrl: null,
  noIndex: false,
};

function slugifyOffice(city: string): string {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const FALLBACK_OFFICES: Office[] = company.offices.map((office, index) => ({
  ...RECORD_DEFAULTS,
  id: `static-office-${index}`,
  order: index,
  name: office.city,
  slug: slugifyOffice(office.city),
  addressLine1: office.address,
  addressLine2: null,
  locality: null,
  city: office.city.split("—")[0]?.trim() ?? office.city,
  state: "Maharashtra",
  postalCode: null,
  country: "India",
  address: office.address,
  mapUrl: office.mapUrl,
  mapEmbedUrl: null,
  latitude: null,
  longitude: null,
  phone: office.phone,
  email: office.email,
  hours: office.hours,
  image: null,
  isHQ: index === 0,
  visit: office.visit === true,
}));

const FALLBACK_PHONES: ContactPhone[] = company.phones.map((number, index) => ({
  ...RECORD_DEFAULTS,
  id: `static-phone-${index}`,
  order: index,
  label: "General",
  phoneNumber: number,
  purpose: "general",
  isWhatsapp: false,
  isPrimary: index === 0,
  showInHeader: false,
  showInFooter: true,
  office: null,
}));

const FALLBACK_EMAILS: ContactEmail[] = company.emails.map((address, index) => ({
  ...RECORD_DEFAULTS,
  id: `static-email-${index}`,
  order: index,
  label: address.startsWith("careers@") ? "Careers" : "General",
  emailAddress: address,
  purpose: address.startsWith("careers@") ? "careers" : "general",
  isPrimary: index === 0,
  showInFooter: true,
}));

/*
 * No social fallback on purpose. The committed list is five "#" placeholders,
 * and rendering an icon that goes nowhere is worse for trust than rendering no
 * icons at all — which is exactly why the database refuses to store one. Until
 * a real profile URL is published in the admin panel, the footer shows none.
 */
const FALLBACK_SOCIAL: SocialLink[] = [];

const FALLBACK_SETTINGS: Settings = {
  id: "static-settings",
  name: company.name,
  shortName: company.shortName,
  tagline: company.tagline,
  positioning: company.positioning,
  foundedYear: company.foundedYear,
  logo: "/logo/sumago-logo.svg",
  favicon: null,
  expertLine: company.expertLine,
  businessHours: "9 am to 7 pm, Monday to Friday",
  metrics: company.metrics.map((metric) => ({ ...metric })),
  certifications: [...company.certifications],
  cin: null,
  gstin: null,
  copyrightText: null,
  defaultOgImage: null,
};

const FALLBACK_POSTS: BlogPostRecord[] = staticPosts.map((post, index) => ({
  ...RECORD_DEFAULTS,
  ...SEO_DEFAULTS,
  id: `static-post-${index}`,
  order: index,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  body: post.body.join("\n\n"),
  cover: post.cover,
  category: post.category,
  tags: [],
  author: post.author,
  authorRole: null,
  authorAvatar: null,
  date: post.date,
  publishAt: null,
  readingTime: post.readingTime,
  featured: false,
  viewCount: 0,
}));

const FALLBACK_STORIES: SuccessStoryRecord[] = staticStories.map((story, index) => ({
  ...RECORD_DEFAULTS,
  ...SEO_DEFAULTS,
  id: `static-story-${index}`,
  order: index,
  title: story.title,
  slug: story.slug,
  summary: story.summary,
  client: null,
  industry: story.industry,
  region: story.region,
  coverImage: story.cover,
  gallery: [],
  background: story.body[0] ?? "",
  challenge: story.body[1] ?? "",
  solution: story.body[2] ?? "",
  technologies: [],
  impact: story.body[story.body.length - 1] ?? "",
  results: [],
  roi: null,
  timeline: null,
  completedOn: null,
  featured: false,
  testimonial: null,
  relatedServices: [],
  publishConsent: false,
}));

const FALLBACK_INNOVATION: InnovationItem[] = intelligentSystems.map((item, index) => ({
  ...RECORD_DEFAULTS,
  id: `static-innovation-${index}`,
  order: index,
  title: item.title,
  description: item.description,
  icon: item.icon,
  category: null,
  image: null,
  highlights: [],
  linkUrl: null,
  linkLabel: null,
}));

const FALLBACK_OUTCOMES: InnovationOutcome[] = intelligentOutcomes.map((outcome, index) => ({
  ...RECORD_DEFAULTS,
  id: `static-outcome-${index}`,
  order: index,
  title: outcome.title,
  note: outcome.note,
  icon: null,
}));

/**
 * Use the API's answer when it gave one, otherwise the committed content.
 *
 * An empty array counts as "no answer" for content the site cannot sensibly
 * render nothing for. That is a judgement per call site, not a global rule:
 * social links legitimately come back empty (see above), so they pass
 * `allowEmpty`.
 */
function orFallback<T>(rows: T[] | null, fallback: T[], allowEmpty = false): T[] {
  if (rows === null) return fallback;
  if (rows.length === 0 && !allowEmpty) return fallback;
  return rows;
}

/* -------------------------------------------------------------------------- */
/* Normalising what the API actually sent                                      */
/*                                                                             */
/* The types in `./types` describe what the API is *supposed* to return. They  */
/* are a compile-time claim about a separate service that deploys on its own   */
/* schedule — so at runtime they are a hope, not a guarantee.                  */
/*                                                                             */
/* This is not hypothetical. A production API running a build from before      */
/* `blog_posts.tags` existed returns posts with no `tags` key at all; the type */
/* still says `string[]`, so `post.tags.some(…)` compiles and then throws      */
/* "Cannot read properties of undefined" during prerender, failing the whole   */
/* build on one page.                                                          */
/*                                                                             */
/* Every record is therefore coerced here, at the one boundary it crosses,     */
/* rather than guarded at each of the thirty-odd places a template reads a     */
/* list. A field the API has never heard of arrives as an empty array and the  */
/* section that renders it quietly disappears — which is the correct behaviour */
/* for a site whose CMS is mid-upgrade.                                        */
/* -------------------------------------------------------------------------- */

/** Anything that is not an array becomes one. Never returns undefined. */
function arr<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

/** Coerce to a finite number, or fall back — guards arithmetic and `toString`. */
function num(value: unknown, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normaliseBlogPost(post: BlogPostRecord): BlogPostRecord {
  return { ...post, tags: arr<string>(post.tags), viewCount: num(post.viewCount, 0) };
}

function normaliseStory(story: SuccessStoryRecord): SuccessStoryRecord {
  return {
    ...story,
    gallery: arr(story.gallery),
    technologies: arr<string>(story.technologies),
    results: arr(story.results),
    relatedServices: arr<string>(story.relatedServices),
  };
}

function normaliseInnovation(item: InnovationItem): InnovationItem {
  return { ...item, highlights: arr<string>(item.highlights) };
}

function normaliseJob(job: JobRecord): JobRecord {
  return {
    ...job,
    tags: arr<string>(job.tags),
    responsibilities: arr<string>(job.responsibilities),
    requirements: arr<string>(job.requirements),
    niceToHave: arr<string>(job.niceToHave),
    openings: num(job.openings, 1),
  };
}

function normaliseSettings(settings: Settings): Settings {
  return {
    ...settings,
    metrics: arr(settings.metrics),
    certifications: arr<string>(settings.certifications),
    foundedYear: num(settings.foundedYear, FALLBACK_SETTINGS.foundedYear),
  };
}

function normaliseNavigation(navigation: Navigation | null): Navigation | null {
  if (!navigation) return null;
  return {
    ...navigation,
    groups: arr<NavGroup>(navigation.groups).map((group) => ({
      ...group,
      items: arr(group.items),
    })),
    footerColumns: arr<NavGroup>(navigation.footerColumns).map((column) => ({
      ...column,
      items: arr(column.items),
    })),
  };
}

/* -------------------------------------------------------------------------- */
/* Site-wide: settings, offices, phones, emails, social, navigation           */
/* -------------------------------------------------------------------------- */

/**
 * `cache()` dedupes this within a single render pass: the header, the footer
 * and the page body all ask for it, and it is fetched once.
 */
export const getSite = cache(async (): Promise<SiteBundle> => {
  // One tag for the whole bundle: settings, navigation, offices, phones,
  // emails and social links arrive together, so changing any of them has to
  // purge this single response (see app/api/revalidate).
  const bundle = await getJson<SiteBundle>("/settings", {
    revalidate: 120,
    tags: ["cms:site"],
  });

  return {
    settings: normaliseSettings(bundle?.settings ?? FALLBACK_SETTINGS),
    navigation: normaliseNavigation(bundle?.navigation ?? null),
    // `arr()` before `orFallback`: an older API may omit these keys entirely,
    // and `undefined` must read as "no answer" rather than reach a `.map()`.
    offices: orFallback(bundle ? arr<Office>(bundle.offices) : null, FALLBACK_OFFICES),
    phones: orFallback(bundle ? arr<ContactPhone>(bundle.phones) : null, FALLBACK_PHONES),
    emails: orFallback(bundle ? arr<ContactEmail>(bundle.emails) : null, FALLBACK_EMAILS),
    social: orFallback(bundle ? arr<SocialLink>(bundle.social) : null, FALLBACK_SOCIAL, true),
  };
});

export async function getSettings(): Promise<Settings> {
  const { settings } = await getSite();
  return settings ?? FALLBACK_SETTINGS;
}

/** The verified proof points — "700+ projects delivered" and friends. */
export async function getMetrics(): Promise<Metric[]> {
  return (await getSettings()).metrics;
}

export async function getCertifications(): Promise<string[]> {
  return (await getSettings()).certifications;
}

export async function getOffices(): Promise<Office[]> {
  return (await getSite()).offices;
}

/** Walk-in offices — the ones with a phone line and opening hours. */
export async function getVisitableOffices(): Promise<Office[]> {
  return (await getOffices()).filter((office) => office.visit);
}

export async function getHeadOffice(): Promise<Office | undefined> {
  const offices = await getOffices();
  return offices.find((office) => office.isHQ) ?? offices[0];
}

export async function getPhones(): Promise<ContactPhone[]> {
  return (await getSite()).phones;
}

export async function getEmails(): Promise<ContactEmail[]> {
  return (await getSite()).emails;
}

/** Social links flagged for the footer. Empty until real URLs are published. */
export async function getFooterSocialLinks(): Promise<SocialLink[]> {
  return (await getSite()).social.filter((link) => link.showInFooter);
}

/**
 * The number behind the "Talk with an expert" CTA. Prefers a phone row marked
 * `expert`, then the settings-level expert line, then the primary number —
 * so the button always has somewhere to dial.
 */
export async function getExpertLine(): Promise<string | null> {
  const { phones, settings } = await getSite();
  return (
    phones.find((phone) => phone.purpose === "expert")?.phoneNumber ??
    settings?.expertLine ??
    phones.find((phone) => phone.isPrimary)?.phoneNumber ??
    phones[0]?.phoneNumber ??
    null
  );
}

/** The address for a `mailto:` on a given purpose, e.g. careers. */
export async function getEmailFor(purpose: ContactEmail["purpose"]): Promise<string | null> {
  const emails = await getEmails();
  return (
    emails.find((email) => email.purpose === purpose)?.emailAddress ??
    emails.find((email) => email.isPrimary)?.emailAddress ??
    emails[0]?.emailAddress ??
    null
  );
}

/* -------------------------------------------------------------------------- */
/* Module 4 — Blog                                                            */
/* -------------------------------------------------------------------------- */

export const getBlogPosts = cache(async (): Promise<BlogPostRecord[]> => {
  const rows = await getContent<BlogPostRecord>("blog");
  return orFallback(rows?.map(normaliseBlogPost) ?? null, FALLBACK_POSTS);
});

export async function getBlogPost(slug: string): Promise<BlogPostRecord | undefined> {
  const record = await getContentBySlug<BlogPostRecord>("blog", slug);
  if (record) return normaliseBlogPost(record);
  // Falling back by slug rather than returning undefined keeps the committed
  // posts reachable when the API is down; a genuinely unknown slug still 404s.
  return (await getBlogPosts()).find((post) => post.slug === slug);
}

/** Distinct tags across published posts, for the /blog filter row. */
export async function getBlogTags(): Promise<string[]> {
  const posts = await getBlogPosts();
  return [...new Set(posts.flatMap((post) => post.tags))].sort();
}

/* -------------------------------------------------------------------------- */
/* Module 3 — Success Stories (Proof of Work)                                 */
/* -------------------------------------------------------------------------- */

export const getSuccessStories = cache(async (): Promise<SuccessStoryRecord[]> => {
  const rows = await getContent<SuccessStoryRecord>("success-stories");
  return orFallback(rows?.map(normaliseStory) ?? null, FALLBACK_STORIES);
});

export async function getSuccessStory(slug: string): Promise<SuccessStoryRecord | undefined> {
  const record = await getContentBySlug<SuccessStoryRecord>("success-stories", slug);
  if (record) return normaliseStory(record);
  return (await getSuccessStories()).find((story) => story.slug === slug);
}

/* -------------------------------------------------------------------------- */
/* Module 12 — Innovation                                                     */
/* -------------------------------------------------------------------------- */

export const getInnovationItems = cache(async (): Promise<InnovationItem[]> => {
  const rows = await getContent<InnovationItem>("innovation");
  return orFallback(rows?.map(normaliseInnovation) ?? null, FALLBACK_INNOVATION);
});

export const getInnovationOutcomes = cache(async (): Promise<InnovationOutcome[]> => {
  const rows = await getContent<InnovationOutcome>("innovation-outcomes");
  return orFallback(rows, FALLBACK_OUTCOMES);
});

/* -------------------------------------------------------------------------- */
/* Module 18 — Jobs (HR)                                                      */
/* -------------------------------------------------------------------------- */

/**
 * No fallback: an expired vacancy shown because the API was briefly down means
 * someone spends an evening on an application for a role that closed. An empty
 * careers page is the honest answer.
 */
export const getJobs = cache(async (): Promise<JobRecord[]> => {
  const rows = await getJson<JobRecord[]>("/jobs");
  return arr<JobRecord>(rows).map(normaliseJob);
});

export async function getJob(slug: string): Promise<JobRecord | undefined> {
  const job = await getJson<JobRecord>(`/jobs/${encodeURIComponent(slug)}`);
  return job ? normaliseJob(job) : undefined;
}

export { previewImages };
export type * from "./types";
