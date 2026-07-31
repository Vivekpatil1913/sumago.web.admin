import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryDetail } from "@/components/organisms/industries/industry-detail";
import { industryCatalog, industryBySlug } from "@/lib/industries";
import { services } from "@/lib/services";
import { impactStories } from "@/lib/site";

/**
 * Industry detail route — one template for all 10 industries.
 *
 * Everything on the page resolves from `industryCatalog` (lib/industries.ts), the
 * single source of truth. When the CMS lands, this route swaps its lookup for a
 * Sanity fetch and the template is untouched (CLAUDE.md — content is CMS-driven).
 */

export function generateStaticParams() {
  return industryCatalog.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = industryBySlug.get(slug);
  return { title: industry?.name ?? "Industry", description: industry?.summary };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = industryBySlug.get(slug);
  if (!industry) notFound();

  /* The services that do most of the work in this sector, in the authored order. */
  const mapped = industry.services
    .map((s) => services.find((svc) => svc.slug === s))
    .filter((s): s is (typeof services)[number] => Boolean(s));

  /* Real stories that genuinely involved this industry — only 3 of 10 have any.
     Where none exist, a flagged gap renders outside production (docs/17). */
  const stories = (industry.stories ?? [])
    .map((s) => impactStories.find((st) => st.slug === s))
    .filter((s): s is (typeof impactStories)[number] => Boolean(s));

  const siblings = industryCatalog.filter((i) => i.slug !== slug);

  return (
    <IndustryDetail
      industry={industry}
      services={mapped}
      stories={stories}
      siblings={siblings}
      isProd={process.env.NODE_ENV === "production"}
    />
  );
}
