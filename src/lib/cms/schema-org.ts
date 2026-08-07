/**
 * Schema.org builders, one per record type the CMS drives.
 *
 * Kept apart from the components that render them so each is a pure function of
 * a CMS record and can be reasoned about (and corrected) without touching a
 * template. Every builder returns a plain object for `<JsonLd data={…} />`.
 *
 * Rule throughout: only claim what the record actually contains. A half-filled
 * structured-data block is worse than none — Google treats markup that
 * disagrees with the visible page as a quality signal against the site, so
 * `compact()` strips anything empty rather than emitting a null.
 */
import { compact } from "@/components/atoms/json-ld";
import type {
  BlogPostRecord,
  ContactEmail,
  ContactPhone,
  JobRecord,
  Office,
  Settings,
  SocialLink,
  SuccessStoryRecord,
} from "./types";

/** Canonical site origin. Structured data needs absolute URLs. */
export const SITE_URL = "https://www.sumagoinfotech.com";

export function absolute(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * The Organization block — the site's identity, emitted once on the home page.
 *
 * `sameAs` is what links the site to its social profiles in a knowledge panel,
 * which is exactly what the Social Media Links module now supplies. Only
 * published links appear, so an unconfirmed profile is never claimed.
 */
export function organizationSchema(input: {
  settings: Settings;
  offices: Office[];
  phones: ContactPhone[];
  emails: ContactEmail[];
  social: SocialLink[];
}): Record<string, unknown> {
  const { settings, offices, phones, emails, social } = input;
  const headOffice = offices.find((office) => office.isHQ) ?? offices[0];

  return compact({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: settings.name,
    alternateName: settings.shortName,
    url: SITE_URL,
    logo: settings.logo ? absolute(settings.logo) : undefined,
    description: settings.positioning,
    foundingDate: String(settings.foundedYear),
    slogan: settings.tagline,
    sameAs: social.map((link) => link.href),
    address: headOffice ? postalAddress(headOffice) : undefined,
    contactPoint: contactPoints(phones, emails),
    // Every office, so a "near me" query can match a branch rather than only HQ.
    location: offices.map((office) => localBusinessSchema(office, settings)),
  });
}

function postalAddress(office: Office): Record<string, unknown> {
  return compact({
    "@type": "PostalAddress",
    streetAddress: [office.addressLine1, office.addressLine2, office.locality]
      .filter(Boolean)
      .join(", "),
    addressLocality: office.city,
    addressRegion: office.state,
    postalCode: office.postalCode,
    addressCountry: office.country,
  });
}

/**
 * One contact point per purpose. `contactType` uses schema.org's vocabulary,
 * which is what lets a result surface "Sales" rather than a bare number.
 */
function contactPoints(
  phones: ContactPhone[],
  emails: ContactEmail[],
): Record<string, unknown>[] {
  const PURPOSE_TO_TYPE: Record<string, string> = {
    general: "customer service",
    sales: "sales",
    support: "technical support",
    careers: "human resources",
    expert: "sales",
    privacy: "customer service",
  };

  const points = phones.map((phone) =>
    compact({
      "@type": "ContactPoint",
      telephone: phone.phoneNumber,
      contactType: PURPOSE_TO_TYPE[phone.purpose] ?? "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi", "mr"],
    }),
  );

  for (const email of emails) {
    points.push(
      compact({
        "@type": "ContactPoint",
        email: email.emailAddress,
        contactType: PURPOSE_TO_TYPE[email.purpose] ?? "customer service",
      }),
    );
  }

  return points;
}

/** One office as a LocalBusiness — what powers a map/branch result. */
export function localBusinessSchema(
  office: Office,
  settings: Settings,
): Record<string, unknown> {
  return compact({
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/contact#${office.slug}`,
    name: `${settings.shortName} — ${office.city}`,
    address: postalAddress(office),
    telephone: office.phone,
    email: office.email,
    image: office.image ? absolute(office.image) : undefined,
    hasMap: office.mapUrl,
    geo:
      office.latitude !== null && office.longitude !== null
        ? {
            "@type": "GeoCoordinates",
            latitude: office.latitude,
            longitude: office.longitude,
          }
        : undefined,
    // Free text in the CMS ("9 am to 7 pm, Monday to Friday"), which is not the
    // machine-readable format schema.org wants — so it goes in the human field
    // rather than being guessed at as openingHoursSpecification.
    description: office.hours ?? undefined,
  });
}

/** A blog post as an Article. */
export function articleSchema(post: BlogPostRecord): Record<string, unknown> {
  return compact({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription ?? post.excerpt,
    image: post.cover ? absolute(post.cover) : undefined,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: absolute(`/blog/${post.slug}`),
    keywords: post.tags.length > 0 ? post.tags.join(", ") : undefined,
    articleSection: post.category,
  });
}

/** A success story as a CreativeWork — the honest type for a case study. */
export function caseStudySchema(story: SuccessStoryRecord): Record<string, unknown> {
  return compact({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.metaDescription ?? story.summary,
    image: story.coverImage ? absolute(story.coverImage) : undefined,
    datePublished: story.completedOn ?? story.createdAt,
    dateModified: story.updatedAt,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: absolute(`/impact/${story.slug}`),
    about: story.industry,
    keywords: story.technologies.length > 0 ? story.technologies.join(", ") : undefined,
  });
}

/**
 * A job as a JobPosting — the markup that puts a role into Google Jobs.
 *
 * `validThrough` matters more than it looks: without it Google keeps showing a
 * role indefinitely, and candidates apply for something that closed months ago.
 * Where HR has set a closing date, it is stated.
 */
export function jobPostingSchema(
  job: JobRecord,
  input: { settings: Settings; offices: Office[] },
): Record<string, unknown> {
  const { settings, offices } = input;

  // Job locations are free text ("Nashik (HQ)", "Remote"); match them to a real
  // office where possible so the posting carries a full address.
  const haystack = job.location.toLowerCase();
  const office =
    offices.find((entry) => haystack.includes(entry.city.toLowerCase())) ??
    offices.find((entry) => entry.isHQ);
  const isRemote = /remote/i.test(job.location);

  const EMPLOYMENT_TYPES: Record<string, string> = {
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    Contract: "CONTRACTOR",
    Internship: "INTERN",
  };

  return compact({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.overview || job.summary,
    datePosted: job.postedAt ?? undefined,
    validThrough: job.closingDate ?? undefined,
    employmentType: EMPLOYMENT_TYPES[job.type] ?? undefined,
    hiringOrganization: {
      "@type": "Organization",
      name: settings.name,
      sameAs: SITE_URL,
      logo: settings.logo ? absolute(settings.logo) : undefined,
    },
    jobLocation: office
      ? { "@type": "Place", address: postalAddress(office) }
      : undefined,
    jobLocationType: isRemote ? "TELECOMMUTE" : undefined,
    employmentUnit: job.department ? { "@type": "Organization", name: job.department } : undefined,
    experienceRequirements: job.experience,
    totalJobOpenings: job.openings > 0 ? job.openings : undefined,
    // Salary is deliberately not emitted: the CMS stores it as free text
    // ("competitive", "12–18 LPA") and guessing a currency and period from that
    // would put a number in Google that Sumago never stated.
    directApply: true,
    url: absolute(`/careers/${job.slug}`),
  });
}

/** Breadcrumbs for a detail page. */
export function breadcrumbSchema(
  trail: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}
