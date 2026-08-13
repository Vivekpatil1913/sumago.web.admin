import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/organisms/solutions/service-page";
import type { Story } from "@/lib/service-page";
import { canonicalFor, getService, getSuccessStories } from "@/lib/cms";
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
 *
 * ## Why this route is not statically generated
 *
 * The proof section shows one success story picked at random *per page load*,
 * which is a request-time decision by definition — a prerendered page would
 * bake one story in until the next build. So the route renders on demand and
 * `generateStaticParams` is gone: it would have had nothing to prerender.
 *
 * The cost is bounded. Every CMS read still goes through the tagged fetch cache
 * (`CONTENT_REVALIDATE_SECONDS`, purged on publish), so a request re-renders
 * the page from cached data rather than re-querying the API.
 */
export const dynamic = "force-dynamic";

/**
 * One item at random, or `undefined` from an empty list.
 *
 * Deliberately a module-level helper rather than an inline `Math.random()` in
 * the component: the render must stay pure, and this is the one place the page
 * is allowed to be non-deterministic. It runs once per request, on the server,
 * and its result is baked into that request's HTML — so there is no client
 * re-render for it to disagree with, and no hydration mismatch.
 */
function pickOne<T>(items: readonly T[]): T | undefined {
  if (!items.length) return undefined;
  return items[Math.floor(Math.random() * items.length)];
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

  /* One success story, drawn at random from whatever is currently active.

     The service's own `stories` link list no longer selects it. That list is
     still merged below (other surfaces read it), but the proof section is now
     independent of it: services that were never linked to a story show one, and
     a story deactivated in the admin panel drops out of the pool the moment it
     is deactivated rather than leaving a hole on the pages that linked it.

     `getSuccessStories` returns published records only — the public API filters
     on status and `isActive` — so "the pool" is exactly the active stories, and
     no deactivation check is needed here.

     Chosen per request, which is why the route is `force-dynamic` above. */
  const chosen = pickOne(published);

  const stories: Story[] = chosen
    ? [
        {
          slug: chosen.slug,
          title: chosen.title,
          industry: chosen.industry,
          cover: chosen.coverImage,
          challenge: chosen.challenge,
          solution: chosen.solution,
          impact: chosen.impact,
          tech: chosen.technologies,
        },
      ]
    : [];

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
    // Derived from the story that actually renders, so it cannot claim proof
    // the page is not showing.
    hasProof: stories.length > 0,
  };

  return (
    <ServicePage
      service={service}
      stories={stories}
      isProd={process.env.NODE_ENV === "production"}
    />
  );
}
