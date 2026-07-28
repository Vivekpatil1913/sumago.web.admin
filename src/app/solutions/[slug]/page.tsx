import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/organisms/solutions/service-detail";
import { impactStories } from "@/lib/site";
import { services } from "@/lib/services";

/**
 * Service detail route — one template for all 15 services.
 *
 * Everything on the page resolves from `services` (lib/services.ts), the single
 * source of truth; the legacy sidebar layout and the editorial/visual A-B map
 * are gone. When the CMS lands, this route swaps its lookup for a Sanity fetch
 * and the template is untouched (CLAUDE.md — content is CMS-driven).
 */

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  return { title: service?.name ?? "Solution", description: service?.summary };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  /* Real stories that genuinely involved this service — only 3 of 15 have any.
     Where none exist, a flagged gap renders outside production (docs/17). */
  const stories = (service.stories ?? [])
    .map((s) => impactStories.find((st) => st.slug === s))
    .filter((s): s is (typeof impactStories)[number] => Boolean(s));

  /* Prefer siblings from the same lifecycle phase — the services a visitor is
     most likely weighing at the same time — then top up from the rest. */
  const related = services
    .filter((s) => s.slug !== slug && s.phase === service.phase)
    .concat(services.filter((s) => s.slug !== slug && s.phase !== service.phase))
    .slice(0, 3);

  return (
    <ServiceDetail
      service={service}
      related={related}
      stories={stories}
      isProd={process.env.NODE_ENV === "production"}
    />
  );
}
