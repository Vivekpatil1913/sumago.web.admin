import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryDetail } from "@/components/organisms/industries/industry-detail";
import { canonicalFor, getIndustries, getIndustry, getServices, getSuccessStories } from "@/lib/cms";

/**
 * Industry detail route — one template for every published industry.
 *
 * Everything on the page resolves from the Industries module in the admin
 * panel. `lib/industries.ts` remains the *authored* source — the API's seed is
 * generated from it (`scripts/export-catalog.ts`) and `@/lib/cms` falls back to
 * it when the API is unreachable — but the page reads the database, so editing
 * an industry in the panel changes this page.
 */

export async function generateStaticParams() {
  const industries = await getIndustries();
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustry(slug);
  if (!industry) return { title: "Industry" };

  const title = industry.metaTitle || industry.name;
  const description = industry.metaDescription || industry.summary;

  return {
    title,
    description,
    alternates: canonicalFor(`/industries/${slug}`, industry.canonicalUrl),
    ...(industry.noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      // The card image is the honest default: it is the picture the index
      // already shows for this sector, so a share card is never blank just
      // because nobody filled in the social-image field.
      images: [{ url: industry.ogImage || industry.image, alt: industry.ogImageAlt ?? industry.name }],
    },
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [industry, industries, services, published] = await Promise.all([
    getIndustry(slug),
    getIndustries(),
    getServices(),
    getSuccessStories(),
  ]);
  if (!industry) notFound();

  /* The services that do most of the work in this sector, in the authored
     order. A service moved to draft drops out rather than linking to a 404. */
  const mapped = industry.services
    .map((wanted) => services.find((service) => service.slug === wanted))
    .filter((service) => service !== undefined);

  /* Real stories that genuinely involved this industry — only 3 of 10 have any.
     Where none exist, a flagged gap renders outside production (docs/17).

     Unpublishing a story in the admin panel removes it from here too, so a
     withdrawn case study cannot linger on an industry page. */
  const stories = industry.stories
    .map((wanted) => published.find((story) => story.slug === wanted))
    .filter((story) => story !== undefined);

  const siblings = industries.filter((other) => other.slug !== slug);

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
