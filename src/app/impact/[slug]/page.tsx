import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/atoms/section";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Button } from "@/components/atoms/button";
import { MediaPlaceholder } from "@/components/molecules/media-placeholder";
import { impactStories } from "@/lib/site";

export function generateStaticParams() {
  return impactStories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = impactStories.find((s) => s.slug === slug);
  return { title: story?.title ?? "Success Story", description: story?.summary };
}

export default async function ImpactDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = impactStories.find((s) => s.slug === slug);
  if (!story) notFound();

  const more = impactStories.filter((s) => s.slug !== story.slug).slice(0, 3);

  return (
    <>
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
          <MediaPlaceholder src={story.cover} alt={story.title} ratio="16/9" />
          <div className="mt-10 space-y-6">
            {story.body.map((para, i) => (
              <p key={i} className="text-lg leading-relaxed text-ink/80">
                {para}
              </p>
            ))}
          </div>

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
                    src={s.cover}
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
