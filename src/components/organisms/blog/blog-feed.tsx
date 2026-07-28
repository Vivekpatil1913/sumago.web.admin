"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MediaPlaceholder } from "@/components/molecules/media-placeholder";
import { FilterChips, type FilterOption } from "@/components/molecules/filter-chips";
import { formatDate, type BlogPost } from "@/lib/blog";

const ALL = "All";

/**
 * The article feed — topic chips over the same cards the page always had.
 * Filtering re-picks the featured slot from the narrowed set rather than
 * pinning it, so "Engineering" leads with the newest engineering piece instead
 * of a story that isn't in the filter at all.
 *
 * Posts arrive as a prop so the page stays a server component and only this
 * subtree ships to the client.
 */
export function BlogFeed({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState(ALL);

  const options = useMemo<FilterOption[]>(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    }
    return [
      { label: ALL, count: posts.length },
      ...[...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([label, count]) => ({ label, count })),
    ];
  }, [posts]);

  const filtered = useMemo(
    () => (active === ALL ? posts : posts.filter((p) => p.category === active)),
    [posts, active],
  );

  // Cards mounted by a filter change are revealed by AOS's own MutationObserver
  // (it watches [data-aos]) — no manual refreshHard needed. Under reduced motion
  // AOS never starts that observer, so globals.css force-shows [data-aos] there.
  const [featured, ...rest] = filtered;

  return (
    <div>
      <FilterChips
        options={options}
        active={active}
        onChange={setActive}
        ariaLabel="Filter articles by topic"
      />

      <p className="sr-only" aria-live="polite">
        Showing {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        {active !== ALL ? ` in ${active}` : ""}.
      </p>

      {/* Featured post */}
      {featured ? (
        <Link
          key={featured.slug}
          href={`/blog/${featured.slug}`}
          data-aos="fade-up"
          className="group mt-10 grid overflow-hidden rounded-2xl border border-line transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_28px_56px_-28px_rgba(215,52,56,0.35)] lg:grid-cols-2"
        >
          <div className="overflow-hidden">
            <MediaPlaceholder
              src={featured.cover}
              alt={featured.title}
              ratio="16/9"
              className="h-full rounded-none ring-0 transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-10">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-brand-ink/80">
              <span>{featured.category}</span>
              <span className="text-ink/30">·</span>
              <span className="text-ink/50">{formatDate(featured.date)}</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold leading-snug text-ink transition-colors group-hover:text-brand-ink md:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">{featured.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink">
              Read article
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </Link>
      ) : null}

      {/* The rest */}
      {rest.length ? (
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 60}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-[0_28px_56px_-28px_rgba(215,52,56,0.35)]"
            >
              <div className="overflow-hidden">
                <MediaPlaceholder
                  src={post.cover}
                  alt={post.title}
                  ratio="16/9"
                  className="rounded-none ring-0 transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-ink/80">
                  <span>{post.category}</span>
                  <span className="text-ink/30">·</span>
                  <span className="text-ink/50">{post.readingTime}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-brand-ink">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/60">
                  {post.excerpt}
                </p>
                <span className="mt-auto pt-4 text-xs font-medium text-ink/45">
                  {formatDate(post.date)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
