import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/atoms/section";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Button } from "@/components/atoms/button";
import { MediaPlaceholder } from "@/components/molecules/media-placeholder";
import { canonicalFor, getBlogPost, getBlogPosts } from "@/lib/cms";
import { formatDate } from "@/lib/cms/format";
import { MarkdownBody } from "@/lib/markdown";
import { articleSchema, breadcrumbSchema } from "@/lib/cms/schema-org";
import { JsonLd } from "@/components/atoms/json-ld";

export async function generateStaticParams() {
  return (await getBlogPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Article" };

  // Every SEO field is an override with a sensible fallback, which is the
  // contract the admin panel's help text promises the editor.
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    alternates: canonicalFor(`/blog/${slug}`, post.canonicalUrl),
    ...(post.noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "article",
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.ogImage
        ? [{ url: post.ogImage, alt: post.ogImageAlt ?? post.title }]
        : post.cover
          ? [{ url: post.cover, alt: post.title }]
          : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  /*
   * "Keep reading" prefers posts sharing a tag, then falls back to the newest.
   * Related-by-topic beats related-by-recency for someone who has just read to
   * the bottom of an article.
   */
  const others = (await getBlogPosts()).filter((p) => p.slug !== post.slug);
  const tags = new Set(post.tags);
  const sameTopic = others.filter((p) => p.tags.some((tag) => tags.has(tag)));
  const more = [...sameTopic, ...others.filter((p) => !sameTopic.includes(p))].slice(0, 3);

  return (
    <>
      <JsonLd data={articleSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Insights", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      {/* Article header — compact dark band (matches the site's hero language). */}
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0a0708] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_35%,rgba(255,255,255,0.05),transparent_70%)]" />
          <div className="fx-hero-aurora absolute inset-0" />
          <div className="fx-dots absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0708] to-transparent" />
        </div>
        <div className="container-page pb-16 pt-[clamp(6.5rem,15vh,9.5rem)]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} />
            All insights
          </Link>
          <div className="mt-8 max-w-3xl">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-brand-bright">
              <span>{post.category}</span>
              <span className="text-white/70">·</span>
              <span className="text-white/50">{formatDate(post.date)}</span>
              {post.readingTime && (
                <>
                  <span className="text-white/70">·</span>
                  <span className="text-white/50">{post.readingTime}</span>
                </>
              )}
            </div>
            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-[-0.02em] md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/70">{post.excerpt}</p>
            <p className="mt-6 text-sm font-medium text-white/60">
              By {post.author}
              {post.authorRole ? <span className="text-white/40"> · {post.authorRole}</span> : null}
            </p>

            {post.tags.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/60"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <MediaPlaceholder src={post.cover} alt={post.title} ratio="16/9" priority />
          <div className="mt-10">
            <MarkdownBody body={post.body} />
          </div>

          <div className="mt-12 rounded-2xl border border-line bg-mist p-8 text-center">
            <h2 className="text-xl font-semibold text-ink">
              Have a problem worth solving?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink/65">
              Let&apos;s talk about where your business wants to go.
            </p>
            <div className="mt-5 flex justify-center">
              <Button href="/contact">Let&apos;s connect</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Keep reading */}
      {more.length ? (
        <Section muted>
          <div className="flex items-end justify-between gap-4">
            <div>
              <Eyebrow>Keep reading</Eyebrow>
              <h2 className="text-3xl leading-tight md:text-4xl">More insights</h2>
            </div>
            <Button href="/blog" variant="link">
              All insights →
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p, i) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 60}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-[0_28px_56px_-28px_rgba(215,52,56,0.35)]"
              >
                <div className="overflow-hidden">
                  <MediaPlaceholder
                    src={p.cover}
                    alt={p.title}
                    ratio="16/9"
                    className="rounded-none ring-0 transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-brand-ink/80">
                    {p.category}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-brand-ink">
                    {p.title}
                  </h3>
                  <span className="mt-auto pt-4 text-xs font-medium text-ink/65">
                    {formatDate(p.date)}
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
