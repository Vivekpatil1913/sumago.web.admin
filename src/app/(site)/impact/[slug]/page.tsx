import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/atoms/section";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Button } from "@/components/atoms/button";
import { MediaPlaceholder } from "@/components/molecules/media-placeholder";
import { getSuccessStories, getSuccessStory } from "@/lib/cms";
import { toParagraphs } from "@/lib/cms/format";
import { breadcrumbSchema, caseStudySchema } from "@/lib/cms/schema-org";
import { JsonLd } from "@/components/atoms/json-ld";

export async function generateStaticParams() {
  return (await getSuccessStories()).map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getSuccessStory(slug);
  if (!story) return { title: "Success Story" };

  return {
    title: story.metaTitle ?? story.title,
    description: story.metaDescription ?? story.summary,
    ...(story.canonicalUrl ? { alternates: { canonical: story.canonicalUrl } } : {}),
    ...(story.noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "article",
      title: story.metaTitle ?? story.title,
      description: story.metaDescription ?? story.summary,
      images: story.ogImage
        ? [{ url: story.ogImage, alt: story.ogImageAlt ?? story.title }]
        : story.coverImage
          ? [{ url: story.coverImage, alt: story.title }]
          : undefined,
    },
  };
}

export default async function ImpactDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getSuccessStory(slug);
  if (!story) notFound();

  /*
   * The four narrative fields are separate columns so an editor fills in a
   * structured brief rather than one long text area. The page reassembles them
   * as titled sections, which is also what makes them skimmable.
   */
  const sections = [
    { heading: "Background", body: story.background },
    { heading: "The challenge", body: story.challenge },
    { heading: "What was built", body: story.solution },
    { heading: "Impact", body: story.impact },
  ].filter((section) => section.body?.trim());

  const more = (await getSuccessStories()).filter((s) => s.slug !== story.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={caseStudySchema(story)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Proof of Work", path: "/impact" },
          { name: story.title, path: `/impact/${story.slug}` },
        ])}
      />

      {/* Story header — compact dark band (matches the site's hero language). */}
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0a0708] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_0%,rgba(215,52,56,0.18),transparent_70%)]" />
          <div className="fx-red-aurora absolute inset-0" />
          <div className="fx-dots absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0708] to-transparent" />
        </div>
        <div className="container-page pb-16 pt-[clamp(6.5rem,15vh,9.5rem)]">
          <Link
            href="/impact"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} />
            All stories
          </Link>
          <div className="mt-8 max-w-3xl">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-brand-bright">
              <span>{story.industry}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/50">{story.region}</span>
            </div>
            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-[-0.02em] md:text-5xl">
              {story.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/70">{story.summary}</p>
          </div>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <MediaPlaceholder src={story.coverImage} alt={story.title} ratio="16/9" />

          {/* Measured results — the reason an evaluator opened this page. */}
          {story.results.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line lg:grid-cols-4">
              {story.results.map((result) => (
                <div key={result.label} className="bg-paper p-6 text-center">
                  <dt className="sr-only">{result.label}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-bold text-brand-ink">
                      {result.value}
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-ink/60">
                      {result.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-display text-xl font-bold text-ink">{section.heading}</h2>
                <div className="mt-3 space-y-5">
                  {toParagraphs(section.body).map((para, i) => (
                    <p key={i} className="text-lg leading-relaxed text-ink/80">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Gallery — screenshots and photography the editor attached. Stored
              since the first release but never rendered until now, so anything
              uploaded here was invisible on the site. Each image carries its
              own alt text, which the admin panel makes mandatory. */}
          {story.gallery.length > 0 && (
            <figure className="mt-12">
              <ul className="grid gap-4 sm:grid-cols-2">
                {story.gallery.map((image) => (
                  <li key={image.url} className="overflow-hidden rounded-xl border border-line">
                    <MediaPlaceholder src={image.url} alt={image.alt} ratio="4/3" />
                  </li>
                ))}
              </ul>
              <figcaption className="mt-3 text-center text-xs text-ink/45">
                From the {story.title} engagement
              </figcaption>
            </figure>
          )}

          {(story.technologies.length > 0 || story.timeline || story.roi) && (
            <dl className="mt-10 grid gap-5 rounded-2xl border border-line bg-mist p-6 sm:grid-cols-3">
              {story.technologies.length > 0 && (
                <div className="sm:col-span-3">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    Technologies
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {story.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-ink/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {story.timeline && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                    Timeline
                  </dt>
                  <dd className="mt-1 text-sm text-ink/75">{story.timeline}</dd>
                </div>
              )}
              {story.roi && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-ink/50">ROI</dt>
                  <dd className="mt-1 text-sm text-ink/75">{story.roi}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-12 rounded-2xl border border-line bg-mist p-8 text-center">
            <h2 className="text-xl font-semibold text-ink">
              Have a project like this in mind?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink/65">
              Let&apos;s talk about where your business wants to go.
            </p>
            <div className="mt-5 flex justify-center">
              <Button href="/contact">Start a similar project</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* More work */}
      {more.length ? (
        <Section muted>
          <div className="flex items-end justify-between gap-4">
            <div>
              <Eyebrow>More work</Eyebrow>
              <h2 className="text-3xl leading-tight md:text-4xl">More success stories</h2>
            </div>
            <Button href="/impact" variant="link">
              All stories →
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((s, i) => (
              <Link
                key={s.slug}
                href={`/impact/${s.slug}`}
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 60}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-[0_28px_56px_-28px_rgba(215,52,56,0.35)]"
              >
                <div className="overflow-hidden">
                  <MediaPlaceholder
                    src={s.coverImage}
                    alt={s.title}
                    ratio="16/9"
                    className="rounded-none ring-0 transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-brand-ink/80">
                    {s.industry}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-brand-ink">
                    {s.title}
                  </h3>
                  <span className="mt-auto pt-4 text-xs font-medium text-ink/45">
                    {s.region}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
