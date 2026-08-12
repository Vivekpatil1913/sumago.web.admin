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
import type { Metadata } from "next";
import { cache } from "react";

import { getContent, getContentBySlug, getJson } from "./client";
import { SITE_URL } from "./schema-org";
import type {
  AwardRecord,
  BlogPostRecord,
  ClientRecord,
  ClientSegment,
  ContactEmail,
  ContactPhone,
  EventGalleryRecord,
  FaqRecord,
  GalleryImage,
  IconItemRecord,
  IndustryRecord,
  InnovationItem,
  InnovationOutcome,
  JobRecord,
  LeaderRecord,
  LegalPageRecord,
  MediaMentionRecord,
  Metric,
  NavGroup,
  Navigation,
  Office,
  ProcessPhaseRecord,
  ProcessStepRecord,
  SeoMetadataRecord,
  ServiceRecord,
  Settings,
  SiteBundle,
  SocialLink,
  SuccessStoryRecord,
  TestimonialRecord,
  WhoFor,
} from "./types";

import { company } from "@/lib/site";
import { blogPosts as staticPosts } from "@/lib/blog";
import { impactStories as staticStories } from "@/lib/site";
import {
  awards as staticAwards,
  clients as staticClients,
  faqs as staticFaqs,
  intelligentOutcomes,
  intelligentSystems,
  processPhases as staticProcessPhases,
  processSteps as staticProcessSteps,
  testimonials as staticTestimonials,
} from "@/lib/content";
import {
  cultureValues as staticCultureValues,
  growthOpportunities as staticGrowthOpportunities,
} from "@/lib/careers-content";
import { PHASES, type Phase, services as staticServices } from "@/lib/services";
import { industryCatalog as staticIndustries } from "@/lib/industries";
import { INDUSTRY_ICON_NAMES } from "@/lib/industry-meta";
import { industryImages, previewImages } from "@/lib/preview-assets";
import { founderPortraits, officePhotos, realEventGalleries } from "@/lib/real-assets";

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

/*
 * Company identity — static, not CMS-driven.
 *
 * These are the facts that do not move: the registered name, the tagline, the
 * founding year, the verified metrics and the certifications. They were an
 * editable General Settings screen; that screen was removed at the client's
 * request, so they now come from `src/lib/site.ts`, which defers to
 * COMPANY-PROFILE.md — one source, changed in the repository with a review,
 * rather than a form where "700+ projects" could be edited to any number.
 *
 * What stayed CMS-driven is everything that genuinely changes: offices, phone
 * numbers, email addresses, social links and navigation, each with its own
 * admin screen.
 */
const SITE_SETTINGS: Settings = {
  id: "static-settings",
  name: company.name,
  shortName: company.shortName,
  tagline: company.tagline,
  positioning: company.positioning,
  foundedYear: company.foundedYear,
  // The committed mark, which is what <Logo> and the JSON-LD both point at.
  // This read `/logo/sumago-logo.svg` — a path that has never existed in
  // `public/` — so `Organization.logo` published a 404 to every crawler that
  // asked for it. Nothing on screen showed it, because the header renders
  // `/sumago-logo.png` directly rather than going through settings.
  logo: "/sumago-logo.png",
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
  /* Blocks back to the single Markdown field the API column holds, so the
     fallback and the record reach the article renderer in the same shape. */
  body: post.body.join("\n\n"),
  cover: post.cover,
  category: post.category,
  /* The committed posts carry their own tags and SEO. Dropping them here (as
     this did) made the fallback quietly worse than the record: /blog's filter
     row went empty and every <title> fell back to the headline. */
  tags: post.tags,
  metaTitle: post.metaTitle,
  metaDescription: post.metaDescription,
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
  category: story.category,
  industry: story.industry,
  region: story.region,
  /* Only the platform case studies were written with their own SEO title and
     description; the older four fall back to the title and summary, which is
     the same contract the panel's SEO group promises an editor. */
  metaTitle: "metaTitle" in story ? story.metaTitle : null,
  metaDescription: "metaDescription" in story ? story.metaDescription : null,
  coverImage: story.cover,
  gallery: [],
  /* The committed body is an ordered list of sections in the order the page
     renders them: background, challenge, what was built, impact. The platform
     case studies carry Markdown in the third — the build, the architecture and
     the stack — which is why the page renders these through `MarkdownBody`. */
  background: story.body[0] ?? "",
  challenge: story.body[1] ?? "",
  solution: story.body[2] ?? "",
  technologies: [...story.tech],
  impact: story.body[story.body.length - 1] ?? "",
  /* No measured result is published that a client has not confirmed
     (CLAUDE.md), and none of the committed stories carries one. */
  results: [],
  roi: null,
  timeline: null,
  completedOn: null,
  featured: false,
  testimonial: null,
  relatedServices: [],
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

/* -------------------------------------------------------------------------- */
/* Fallbacks for the modules wired after the first pass                       */
/*                                                                            */
/* Each one is the committed content in the API's shape. The database is now   */
/* seeded from the same catalogs (the API's seed reads `catalog.json`, which   */
/* the website generates from `lib/services.ts` and `lib/industries.ts` — see  */
/* `scripts/export-catalog.ts`), so a visitor sees the same page whether the   */
/* API answered or not. That is the point: the fallback is a copy of the truth,*/
/* not a lesser version of it.                                                */
/* -------------------------------------------------------------------------- */

const FALLBACK_SERVICES: ServiceRecord[] = staticServices.map((service, index) => ({
  ...RECORD_DEFAULTS,
  ...SEO_DEFAULTS,
  id: `static-service-${index}`,
  order: index,
  name: service.name,
  slug: service.slug,
  icon: service.icon,
  phase: service.phase,
  blurb: service.blurb,
  problem: service.problem,
  summary: service.summary,
  approach: service.approach,
  deliverables: [...service.deliverables],
  outcomes: [...service.outcomes],
  technologies: [...service.technologies],
  tools: [...service.tools],
  whoFor: service.whoFor ? service.whoFor.map((entry) => ({ ...entry })) : [],
  stories: service.stories ? [...service.stories] : [],
  // Mirrors the seed, which features the first six (the registry caps it there).
  featured: index < 6,
  hasProof: Boolean(service.stories?.length),
}));

const FALLBACK_INDUSTRIES: IndustryRecord[] = staticIndustries.map((industry, index) => ({
  ...RECORD_DEFAULTS,
  ...SEO_DEFAULTS,
  id: `static-industry-${index}`,
  order: index,
  name: industry.name,
  slug: industry.slug,
  icon: INDUSTRY_ICON_NAMES[industry.slug] ?? "Boxes",
  // Industry tiles are still preview stock (no owned photography of a client's
  // factory floor or hospital exists). The fallback for a slug with no tile is
  // Sumago's own floor — a real asset beats a generic abstract still.
  image: industryImages[industry.slug] ?? officePhotos.openPlan.src,
  blurb: industry.blurb,
  intro: null,
  summary: industry.summary,
  problem: industry.problem,
  approach: industry.approach,
  challenges: industry.challenges.map((point) => ({ ...point })),
  solutions: industry.solutions.map((point) => ({ ...point })),
  outcomes: [...industry.outcomes],
  services: [...industry.services],
  stories: industry.stories ? [...industry.stories] : [],
}));

const FALLBACK_TESTIMONIALS: TestimonialRecord[] = staticTestimonials.map((testimonial, index) => ({
  ...RECORD_DEFAULTS,
  id: `static-testimonial-${index}`,
  order: index,
  quote: testimonial.quote,
  name: testimonial.name,
  role: testimonial.role,
  company: null,
  avatar: null,
  accent: testimonial.accent,
  rating: testimonial.rating,
  // The committed list has no featured flag; the home page shows the first
  // few, so the first three stand in for it rather than inventing a field.
  featured: index < 3,
}));

/**
 * The committed list carries a business segment; the panel also asks for a
 * geography. Only "government" maps cleanly between them — "enterprise" and
 * "growth" are both Domestic — which is exactly why the record carries both.
 */
const CLIENT_TYPE_BY_SEGMENT: Record<string, ClientRecord["type"]> = {
  government: "Government",
  enterprise: "Domestic",
  growth: "Domestic",
};

const FALLBACK_CLIENTS: ClientRecord[] = staticClients.map((client, index) => ({
  ...RECORD_DEFAULTS,
  id: `static-client-${index}`,
  order: index,
  name: client.name,
  logo: client.logo ?? null,
  type: CLIENT_TYPE_BY_SEGMENT[client.segment] ?? "Domestic",
  segment: client.segment,
  website: null,
}));

/**
 * The two founders, with their own portraits — Sudhir Gorade first, then
 * Sonali Gorade, the order `company.leadership` is written in.
 * `company.leadership` carries the verified name and role; the quote is the
 * seed message the page has always shown beside it.
 *
 * These are real photographs, so nothing downstream may flag them as stock.
 * Note this record is what every consumer sees — the fallback carries a photo,
 * so a page's own `leader.photo || …` default never fires for the founders.
 */
const FALLBACK_LEADERSHIP: LeaderRecord[] = company.leadership.map((leader, index) => ({
  ...RECORD_DEFAULTS,
  id: `static-leader-${index}`,
  order: index,
  name: leader.name,
  role: leader.role,
  photo:
    index === 0
      ? founderPortraits.sudhirGorade.src
      : founderPortraits.sonaliGorade.src,
  bio: null,
  quote: null,
  // No fallback LinkedIn: the committed value was "#", and a profile link that
  // goes nowhere costs more trust than no link — the same call the footer's
  // social icons make.
  linkedin: null,
  department: null,
  traits: [],
}));

const FALLBACK_AWARDS: AwardRecord[] = staticAwards.map((award, index) => ({
  ...RECORD_DEFAULTS,
  id: `static-award-${index}`,
  order: index,
  title: award.title,
  short: award.short,
  detail: award.detail,
  year: award.year,
  kind: award.kind,
  icon: award.icon,
  image: null,
  tagline: award.tagline ?? null,
  org: award.org ?? null,
  scope: award.scope ?? null,
  standing: award.standing ?? null,
  recipient: award.recipient ?? null,
}));

const FALLBACK_PROCESS_STEPS: ProcessStepRecord[] = staticProcessSteps.map((step, index) => ({
  ...RECORD_DEFAULTS,
  id: `static-step-${index}`,
  order: index,
  title: step.title,
  description: step.description,
  icon: step.icon,
  phase: step.phase,
}));

const FALLBACK_PROCESS_PHASES: ProcessPhaseRecord[] = staticProcessPhases.map((phase, index) => ({
  ...RECORD_DEFAULTS,
  id: `static-phase-${index}`,
  order: index,
  name: phase.name,
  tagline: phase.tagline,
}));

const FALLBACK_FAQS: FaqRecord[] = staticFaqs.map((faq, index) => ({
  ...RECORD_DEFAULTS,
  id: `static-faq-${index}`,
  order: index,
  q: faq.q,
  a: faq.a,
  category: null,
}));

function iconItemFallback(
  items: { icon: string; title: string; description: string }[],
  prefix: string,
): IconItemRecord[] {
  return items.map((item, index) => ({
    ...RECORD_DEFAULTS,
    id: `static-${prefix}-${index}`,
    order: index,
    icon: item.icon,
    title: item.title,
    description: item.description,
  }));
}

const FALLBACK_CULTURE_VALUES = iconItemFallback(staticCultureValues, "culture-value");
const FALLBACK_GROWTH_OPPORTUNITIES = iconItemFallback(staticGrowthOpportunities, "growth");

const FALLBACK_EVENT_GALLERIES: EventGalleryRecord[] = realEventGalleries.map(
  (gallery, index) => ({
    ...RECORD_DEFAULTS,
    id: `static-gallery-${index}`,
    order: index,
    key: gallery.key,
    title: gallery.title,
    // Each photograph carries the alt written against it in the image manifest
    // — these are real, identifiable events, so a per-category caption would
    // be a downgrade rather than a safe default.
    images: gallery.images.map((image) => ({ url: image.src, alt: image.alt })),
  }),
);

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
    responsibilities: arr<string>(job.responsibilities),
    requirements: arr<string>(job.requirements),
    openings: num(job.openings, 1),
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
    navigation: normaliseNavigation(bundle?.navigation ?? null),
    // `arr()` before `orFallback`: an older API may omit these keys entirely,
    // and `undefined` must read as "no answer" rather than reach a `.map()`.
    offices: orFallback(bundle ? arr<Office>(bundle.offices) : null, FALLBACK_OFFICES),
    phones: orFallback(bundle ? arr<ContactPhone>(bundle.phones) : null, FALLBACK_PHONES),
    emails: orFallback(bundle ? arr<ContactEmail>(bundle.emails) : null, FALLBACK_EMAILS),
    social: orFallback(bundle ? arr<SocialLink>(bundle.social) : null, FALLBACK_SOCIAL, true),
  };
});

/**
 * Company identity. Static — no request, no cache tag, nothing to purge. Kept
 * async so every caller (and the JSON-LD builders) reads the same as before.
 */
export async function getSettings(): Promise<Settings> {
  return SITE_SETTINGS;
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
  const { phones } = await getSite();
  return (
    phones.find((phone) => phone.purpose === "expert")?.phoneNumber ??
    SITE_SETTINGS.expertLine ??
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

/* -------------------------------------------------------------------------- */
/* Module 1 — Services                                                        */
/* -------------------------------------------------------------------------- */

function normaliseService(service: ServiceRecord): ServiceRecord {
  const stories = arr<string>(service.stories);
  return {
    ...service,
    deliverables: arr<string>(service.deliverables),
    outcomes: arr<string>(service.outcomes),
    technologies: arr<string>(service.technologies),
    tools: arr<string>(service.tools),
    whoFor: arr<WhoFor>(service.whoFor),
    stories,
    // Derived, never stored: linking a story is what gives a service proof, so
    // the flag cannot drift from the list it describes.
    hasProof: stories.length > 0,
  };
}

/**
 * Every published service, in the panel's order.
 *
 * `cache()` matters more here than anywhere else: the header mega-menu, the
 * footer column and the page body all ask for this on every single render, and
 * without it that is three requests per page instead of one.
 */
export const getServices = cache(async (): Promise<ServiceRecord[]> => {
  const rows = await getContent<ServiceRecord>("services");
  return orFallback(rows?.map(normaliseService) ?? null, FALLBACK_SERVICES);
});

export async function getService(slug: string): Promise<ServiceRecord | undefined> {
  const record = await getContentBySlug<ServiceRecord>("services", slug);
  if (record) return normaliseService(record);
  return (await getServices()).find((service) => service.slug === slug);
}

/** The services pinned to the home page. Capped at 6 by the admin (PRD M1). */
export async function getFeaturedServices(): Promise<ServiceRecord[]> {
  const services = await getServices();
  const featured = services.filter((service) => service.featured);
  // An editor who has un-featured everything should not empty the home page's
  // capability band — fall back to the running order rather than to nothing.
  return featured.length > 0 ? featured.slice(0, 6) : services.slice(0, 6);
}

/**
 * Services grouped by lifecycle phase, in `PHASES` order — the shape the
 * Solutions chapters and the header mega-menu both read.
 *
 * The phases themselves stay committed. They are the site's information
 * architecture, not content: five fixed stages with a label and a standfirst,
 * matching the `phase` options the admin form offers. A record names one; it
 * does not get to invent one.
 *
 * A phase with nothing published in it is dropped rather than rendered as an
 * empty chapter with a heading and no services under it.
 */
export async function getServicesByPhase(): Promise<
  { key: Phase; label: string; blurb: string; services: ServiceRecord[] }[]
> {
  const services = await getServices();
  return PHASES.map((phase) => ({
    ...phase,
    services: services.filter((service) => service.phase === phase.key),
  })).filter((group) => group.services.length > 0);
}

/* -------------------------------------------------------------------------- */
/* Module 2 — Industries                                                      */
/* -------------------------------------------------------------------------- */

function normaliseIndustry(industry: IndustryRecord): IndustryRecord {
  return {
    ...industry,
    challenges: arr(industry.challenges),
    solutions: arr(industry.solutions),
    outcomes: arr<string>(industry.outcomes),
    services: arr<string>(industry.services),
    stories: arr<string>(industry.stories),
    // Older rows wrote the standfirst into `intro`; the template reads
    // `summary`. Prefer the new column and fall back rather than rendering a
    // detail hero with nothing under the title.
    summary: industry.summary || industry.intro || "",
    blurb: industry.blurb ?? "",
  };
}

export const getIndustries = cache(async (): Promise<IndustryRecord[]> => {
  const rows = await getContent<IndustryRecord>("industries");
  return orFallback(rows?.map(normaliseIndustry) ?? null, FALLBACK_INDUSTRIES);
});

export async function getIndustry(slug: string): Promise<IndustryRecord | undefined> {
  const record = await getContentBySlug<IndustryRecord>("industries", slug);
  if (record) return normaliseIndustry(record);
  return (await getIndustries()).find((industry) => industry.slug === slug);
}

/* -------------------------------------------------------------------------- */
/* Modules 5–8 — Proof & trust                                                */
/* -------------------------------------------------------------------------- */

/**
 * A testimonial as the website is allowed to see it — everything except who
 * said it.
 *
 * The client's name is stored (consent is personal; the record has to say who
 * gave it) and is never published. Hiding it in the components that render it
 * is not enough: the About page's trust wall is a Client Component, so whatever
 * it is handed is serialised into the RSC payload and ships in the page source
 * whether or not a single pixel of it is drawn. The name was readable in
 * view-source on /about before this type existed.
 *
 * Dropping the field at the accessor is the only version of this that holds.
 * `Omit` makes it a compile error rather than a review note: a component that
 * reaches for `t.name` no longer type-checks, so the guarantee cannot be
 * undone by someone adding a line in good faith.
 */
export type PublicTestimonial = Omit<TestimonialRecord, "name">;

export const getTestimonials = cache(async (): Promise<PublicTestimonial[]> => {
  const rows = await getContent<TestimonialRecord>("testimonials");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- `name` is dropped on purpose
  return orFallback(rows, FALLBACK_TESTIMONIALS).map(({ name, ...rest }) => rest);
});

/** The ones pinned to the home page, with a sensible floor if none are. */
export async function getFeaturedTestimonials(limit = 3): Promise<PublicTestimonial[]> {
  const testimonials = await getTestimonials();
  const featured = testimonials.filter((testimonial) => testimonial.featured);
  return (featured.length > 0 ? featured : testimonials).slice(0, limit);
}

export const getClients = cache(async (): Promise<ClientRecord[]> => {
  const rows = await getContent<ClientRecord>("clients");
  return orFallback(rows, FALLBACK_CLIENTS);
});

/**
 * Only the clients with a logo to show. Without one the site prints the name as
 * text instead — the rule the Clients module is built around — so a marquee
 * asking for logos must not be handed a record that has none.
 */
export async function getClientLogos(): Promise<ClientRecord[]> {
  return (await getClients()).filter((client) => Boolean(client.logo));
}

export const getLeadership = cache(async (): Promise<LeaderRecord[]> => {
  const rows = await getContent<LeaderRecord>("leadership");
  const normalised = rows?.map((leader) => ({
    ...leader,
    traits: arr<string>(leader.traits),
    // "#" was the committed placeholder and the database rejects it for social
    // links; treat it the same here so an old row cannot resurrect a dead link.
    linkedin: leader.linkedin && leader.linkedin !== "#" ? leader.linkedin : null,
  })) ?? null;
  return orFallback(normalised, FALLBACK_LEADERSHIP);
});

/** The founders — leadership records with no department against them. */
export async function getFounders(): Promise<LeaderRecord[]> {
  return (await getLeadership()).filter((leader) => !leader.department);
}

/** The function leads — one per department, in the panel's order. */
export async function getDepartmentLeaders(): Promise<LeaderRecord[]> {
  return (await getLeadership()).filter((leader) => Boolean(leader.department));
}

/**
 * How the About page groups the client roster, and the order the groups run in.
 * The labels and icons are the page's own presentation — the record supplies
 * which group it belongs to, not what that group is called.
 */
const CLIENT_SEGMENTS: { key: ClientSegment; label: string; icon: string }[] = [
  { key: "government", label: "Government & public sector", icon: "Landmark" },
  { key: "enterprise", label: "Enterprise & industry", icon: "Building2" },
  { key: "growth", label: "Platforms & growth businesses", icon: "Rocket" },
];

/**
 * The roster grouped by constituency, for the trust wall. A group with nobody
 * published in it is dropped rather than rendered as a heading over nothing.
 */
export async function getClientsBySegment(): Promise<
  { key: ClientSegment; label: string; icon: string; clients: ClientRecord[] }[]
> {
  const clients = await getClients();
  return CLIENT_SEGMENTS.map((segment) => ({
    ...segment,
    clients: clients.filter((client) => client.segment === segment.key),
  })).filter((group) => group.clients.length > 0);
}

export const getAwards = cache(async (): Promise<AwardRecord[]> => {
  const rows = await getContent<AwardRecord>("awards");
  return orFallback(rows, FALLBACK_AWARDS);
});

/** The two top-tier trust assets, which get the featured seal treatment. */
export async function getAwardCertifications(): Promise<AwardRecord[]> {
  return (await getAwards()).filter((award) => award.kind === "certification");
}

/**
 * Awards on a dated rail — oldest first, so it reads as a track record.
 * Anything without a numeric year sorts last rather than to the front.
 */
export async function getRecognitions(): Promise<AwardRecord[]> {
  return (await getAwards())
    .filter((award) => award.kind === "award")
    .sort((a, b) => (Number(a.year) || Infinity) - (Number(b.year) || Infinity));
}

/**
 * Press coverage. Genuinely empty today, and `allowEmpty` says so: an empty
 * list here means "nothing has been published", and the section that renders it
 * disappears rather than falling back to content that does not exist.
 */
export const getMediaMentions = cache(async (): Promise<MediaMentionRecord[]> => {
  const rows = await getContent<MediaMentionRecord>("media-mentions");
  return orFallback(rows, [], true);
});

/* -------------------------------------------------------------------------- */
/* Module 9 — Process                                                         */
/* -------------------------------------------------------------------------- */

export const getProcessSteps = cache(async (): Promise<ProcessStepRecord[]> => {
  const rows = await getContent<ProcessStepRecord>("process-steps");
  return orFallback(rows, FALLBACK_PROCESS_STEPS);
});

export const getProcessPhases = cache(async (): Promise<ProcessPhaseRecord[]> => {
  const rows = await getContent<ProcessPhaseRecord>("process-phases");
  return orFallback(rows, FALLBACK_PROCESS_PHASES);
});

/*
 * Process Phases is reference data, not a rendered list.
 *
 * It exists so the Process Steps form can offer a phase picker, the same way
 * Departments and Locations serve the Jobs form — the API resolves it through
 * `optionsSource: "processPhases"`. The engagement road on the home page and
 * /solutions renders the steps as one continuous sequence rather than grouped
 * bands, so nothing on the site reads a phase directly. `getProcessPhases`
 * above stays because the module is published and a page may yet want it;
 * there is deliberately no grouping accessor until something needs one.
 */

/* -------------------------------------------------------------------------- */
/* Modules 10–11 — FAQs and culture                                           */
/* -------------------------------------------------------------------------- */

export const getFaqs = cache(async (): Promise<FaqRecord[]> => {
  const rows = await getContent<FaqRecord>("faqs");
  return orFallback(rows, FALLBACK_FAQS);
});

/** FAQs for one page's category, falling back to the whole list when unset. */
export async function getFaqsFor(category: string): Promise<FaqRecord[]> {
  const faqs = await getFaqs();
  const matching = faqs.filter((faq) => faq.category === category);
  return matching.length > 0 ? matching : faqs;
}

export const getCultureValues = cache(async (): Promise<IconItemRecord[]> => {
  const rows = await getContent<IconItemRecord>("culture-values");
  return orFallback(rows, FALLBACK_CULTURE_VALUES);
});

export const getGrowthOpportunities = cache(async (): Promise<IconItemRecord[]> => {
  const rows = await getContent<IconItemRecord>("growth-opportunities");
  return orFallback(rows, FALLBACK_GROWTH_OPPORTUNITIES);
});

export const getEventGalleries = cache(async (): Promise<EventGalleryRecord[]> => {
  const rows = await getContent<EventGalleryRecord>("event-galleries");
  const normalised =
    rows?.map((gallery) => ({ ...gallery, images: arr<GalleryImage>(gallery.images) })) ?? null;
  // A gallery row with no images would render an empty tab, so drop those
  // before deciding whether the API gave a usable answer at all.
  const usable = normalised?.filter((gallery) => gallery.images.length > 0) ?? null;
  return orFallback(usable, FALLBACK_EVENT_GALLERIES);
});

/* -------------------------------------------------------------------------- */
/* Module 16 — Legal pages                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A legal page by slug (`privacy`, `terms`).
 *
 * No fallback, deliberately, and the only accessor here without one. /privacy
 * and /terms carry their own committed copy as the page body; if the CMS has a
 * newer version it wins, and if it has nothing the page keeps what it shipped
 * with. Inventing a fallback record would mean choosing which of the two is the
 * privacy policy — and publishing the wrong answer to that question is worse
 * than publishing the older one.
 */
export async function getLegalPage(slug: string): Promise<LegalPageRecord | undefined> {
  const record = await getContentBySlug<LegalPageRecord>("legal-pages", slug);
  return record ?? undefined;
}

/* -------------------------------------------------------------------------- */
/* Module 15 — SEO metadata                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Per-page metadata overrides, keyed by path.
 *
 * Fetched as one map rather than one request per page: `generateMetadata` runs
 * for every route, and `cache()` collapses the whole render down to a single
 * call. A page with no row is simply absent, and its own `metadata` export
 * stands — the panel overrides the page, it does not replace it.
 */
const getSeoMap = cache(async (): Promise<Record<string, SeoMetadataRecord>> => {
  const map = await getJson<Record<string, SeoMetadataRecord>>("/seo", {
    revalidate: 120,
    tags: ["cms:seo-metadata"],
  });
  return map && typeof map === "object" ? map : {};
});

export async function getSeoMetadata(page: string): Promise<SeoMetadataRecord | undefined> {
  return (await getSeoMap())[page];
}

/**
 * The canonical URL for a detail page.
 *
 * Every route needs one, and a detail page needs it most: `/blog/x` is the URL
 * most likely to be reached with a tracking parameter or a trailing slash, and
 * without a canonical each variant is a separate document to a crawler. The
 * record's own `canonicalUrl` wins when an editor has set one — that field
 * exists for the case where a piece was syndicated and the original lives
 * elsewhere.
 */
export function canonicalFor(path: string, override?: string | null): { canonical: string } {
  return { canonical: override || `${SITE_URL}${path}` };
}

/**
 * Merge a page's own metadata with whatever the panel has published for it.
 *
 * Every field is overridden only when the panel actually has a value, so an
 * editor filling in a title does not blank the description the page ships with,
 * and a page with no record at all keeps exactly the metadata it was written
 * with. A missing record is the normal case, not a failure: `getSeoMap` returns
 * `{}` when the endpoint is unreachable, so this can never fail a build or
 * leave a page with an empty `<title>`.
 *
 * Canonical is derived from the path rather than stored. A canonical URL that
 * disagrees with the route it is served on is worse than none, and deriving it
 * makes that impossible.
 */
export async function withSeoOverrides(
  page: string,
  base: { title?: string; description?: string; image?: string },
): Promise<Metadata> {
  const override = await getSeoMetadata(page);

  const description = override?.metaDescription || base.description;
  const image = override?.ogImage || base.image;
  const canonical = `${SITE_URL}${page === "/" ? "" : page}`;

  const images = image ? [{ url: image }] : undefined;

  /*
   * A panel-authored meta title is the *whole* title, so it bypasses the root
   * layout's `%s — Sumago` template. Editors write the full string into a field
   * capped at 60 characters — appending the brand to "Blog — Sumago Infotech"
   * produced "Blog — Sumago Infotech — Sumago", over the limit and duplicated.
   *
   * A page's own base title still goes through the template: that is the site's
   * convention and the reason the template exists.
   */
  const title = override?.metaTitle
    ? { absolute: override.metaTitle }
    : base.title;

  /*
   * The plain string, for the social cards. Open Graph and Twitter take a bare
   * title with no template behind them, so they need the text rather than the
   * `{ absolute }` wrapper the document title uses.
   */
  const titleText = override?.metaTitle || base.title;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical },
    openGraph: {
      ...(titleText ? { title: titleText } : {}),
      ...(description ? { description } : {}),
      url: canonical,
      type: "website",
      ...(images ? { images } : {}),
    },
    twitter: {
      // `summary_large_image` only pays off with an image; without one the
      // large card renders as a wide empty box, so the plain summary is right.
      card: images ? "summary_large_image" : "summary",
      ...(titleText ? { title: titleText } : {}),
      ...(description ? { description } : {}),
      ...(images ? { images: images.map((entry) => entry.url) } : {}),
    },
    // Only ever set to *hide* a page. Leaving it unset lets the root layout's
    // default stand, which is what an indexable page wants.
    ...(override?.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export { previewImages };
export type * from "./types";
