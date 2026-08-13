import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/organisms/solutions/service-page";
import type { Story } from "@/lib/service-page";
import { canonicalFor, getService, getServices, getSuccessStories } from "@/lib/cms";
import { services as authoredServices, type ServiceWithSlug } from "@/lib/services";

/**
 * Service detail — one route, one layout, fifteen services.
 *
 * Every service renders the same eleven-section page
 * (`components/organisms/solutions/service-page`). There is no per-service
 * branching here and there must never be: a service differs only in the content
 * it supplies and `lib/service-page.ts` resolves.
 *
 * ## Where the content comes from
 *
 * Two sources, merged. The admin panel owns the fields it can edit — name,
 * blurb, problem, summary, approach, deliverables, outcomes, technologies,
 * tools, linked stories, and the whole SEO group — so publishing an edit still
 * changes this page. The authored entry in `lib/services.ts` supplies the
 * page-shaped copy the panel has no columns for yet (`understanding`,
 * `whatWeBuild`, `valueDrivers`, `howItHelps`, `capabilityGroups`, `process`,
 * `whyUs`), which is what gives a fully authored service like Mobile App
 * Engineering its density.
 *
 * Nothing here is conditional on either source being present:
 * `resolveServicePage` derives an honest fallback for every optional field, so
 * a service published in the panel with no authored counterpart renders the
 * identical eleven sections — thinner, never broken.
 */

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Solution" };

  return {
    // The panel's SEO fields win where they are filled in; the name and summary
    // stand in where they are not, so a service published without touching the
    // SEO group still gets a sensible title rather than an empty one.
    title: service.metaTitle || service.name,
    description: service.metaDescription || service.summary,
    alternates: canonicalFor(`/solutions/${slug}`, service.canonicalUrl),
    ...(service.noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: service.metaTitle || service.name,
      description: service.metaDescription || service.summary,
      ...(service.ogImage ? { images: [{ url: service.ogImage, alt: service.ogImageAlt ?? "" }] } : {}),
    },
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [record, published] = await Promise.all([getService(slug), getSuccessStories()]);
  if (!record) notFound();

  /* The panel record over the authored one: every field the panel owns is taken
     from the database, and everything the panel has no column for survives from
     `services.ts`.

     "Owns" means *filled in*. `normaliseService` coerces an unset column to an
     empty array, and an unwritten one to an empty string — neither is an
     instruction to blank the section. Spreading them straight over the authored
     entry would erase written copy, and `??` would not catch it: `[] ?? x` is
     `[]`. So each field falls back when the panel's is empty. */
  const authored = authoredServices.find((service) => service.slug === slug);
  const text = (value: string, fallback: string | undefined) =>
    value.trim() ? value : (fallback ?? "");
  const list = <T,>(value: T[], fallback: readonly T[] | undefined): T[] =>
    value.length ? value : [...(fallback ?? [])];

  const service: ServiceWithSlug = {
    ...authored,
    name: text(record.name, authored?.name),
    slug: record.slug,
    icon: text(record.icon, authored?.icon),
    phase: record.phase,
    blurb: text(record.blurb, authored?.blurb),
    problem: text(record.problem, authored?.problem),
    summary: text(record.summary, authored?.summary),
    approach: text(record.approach, authored?.approach),
    deliverables: list(record.deliverables, authored?.deliverables),
    outcomes: list(record.outcomes, authored?.outcomes),
    technologies: list(record.technologies, authored?.technologies),
    tools: list(record.tools, authored?.tools),
    /* Left undefined rather than empty, so `resolveServicePage` can move down
       its fallback chain instead of rendering section 03 with nothing in it. */
    whoFor: record.whoFor.length ? record.whoFor : authored?.whoFor,
    stories: list(record.stories, authored?.stories),
    // Derived from the merged list, so it cannot disagree with what renders.
    hasProof: list(record.stories, authored?.stories).length > 0,
  };

  /* Real stories that genuinely involved this service — only 5 of 15 have any.
     Where none exist, a flagged gap renders outside production (docs/17).

     The link is a slug list on the service record; the story itself is its own
     record, so a story that is unpublished or deleted simply drops out here.

     Reads the merged `service.stories`, not `record.stories`: a panel record
     whose column has never been filled in returns `[]`, and taking that
     literally would hide a link authored in `services.ts` — the same "empty is
     not an instruction to blank it" rule the merge above follows. */
  const stories: Story[] = (service.stories ?? [])
    .map((wanted) => published.find((story) => story.slug === wanted))
    .filter((story) => story !== undefined)
    .map((story) => ({
      slug: story.slug,
      title: story.title,
      industry: story.industry,
      region: story.region,
      cover: story.coverImage,
      challenge: story.challenge,
      solution: story.solution,
      impact: story.impact,
      tech: story.technologies,
    }));

  return (
    <ServicePage
      service={service}
      stories={stories}
      isProd={process.env.NODE_ENV === "production"}
    />
  );
}
