"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MediaPlaceholder } from "@/components/molecules/media-placeholder";
import { FilterChips, type FilterOption } from "@/components/molecules/filter-chips";
import { formatDate } from "@/lib/cms/format";
import type { BlogPostRecord } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

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
export function BlogFeed({ posts }: { posts: BlogPostRecord[] }) {
  const [active, setActive] = useState(ALL);
  const [tag, setTag] = useState<string | null>(null);

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

  const filtered = useMemo(() => {
    const byCategory = active === ALL ? posts : posts.filter((p) => p.category === active);
    return tag ? byCategory.filter((p) => p.tags.includes(tag)) : byCategory;
  }, [posts, active, tag]);

  /*
   * Tags are drawn from the posts still visible after the category filter, so
   * the two controls can never combine into an empty result. Selecting
   * "Engineering" then a tag that only exists on a Strategy post would leave
   * the reader staring at nothing with no clue which control to undo.
   */
  const tags = useMemo(() => {
    const inScope = active === ALL ? posts : posts.filter((p) => p.category === active);
    const found = [...new Set(inScope.flatMap((p) => p.tags))].sort();
    // Keep the active tag listed even if it has just fallen out of scope, so
    // the chip the reader clicked does not vanish from under them.
    return tag && !found.includes(tag) ? [tag, ...found] : found;
  }, [posts, active, tag]);

  // Cards mounted by a filter change are revealed by AOS's own MutationObserver
  // (it watches [data-aos]) — no manual refreshHard needed. Under reduced motion
  // AOS never starts that observer, so globals.css force-shows [data-aos] there.
  const [featured, ...rest] = filtered;

  return (
    <div>
      <FilterChips
        options={options}
        active={active}
        onChange={(next) => {
          setActive(next);
          // A tag from the previous category rarely applies to the new one.
          setTag(null);
        }}
        ariaLabel="Filter articles by topic"
      />

      {tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-ink/65">Tags</span>
          {tags.map((entry) => {
            const selected = entry === tag;
            return (
              <button
                key={entry}
                type="button"
                aria-pressed={selected}
                onClick={() => setTag(selected ? null : entry)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                  selected
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-paper text-ink/65 hover:border-brand/40 hover:text-brand-ink",
                )}
              >
                {entry}
              </button>
            );
          })}
          {tag ? (
            <button
              type="button"
              onClick={() => setTag(null)}
              className="text-xs font-semibold text-brand-ink underline-offset-4 hover:underline"
            >
              Clear
            </button>
          ) : null}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        Showing {filtered.length} {filtered.length === 1 ? "article" : "articles"}
        {active !== ALL ? ` in ${active}` : ""}
        {tag ? ` tagged ${tag}` : ""}.
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-xl border border-line bg-mist p-8 text-center text-sm text-ink/60">
          No articles match that combination yet.
        </p>
      ) : null}

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
              <span className="text-ink/65">·</span>
              <span className="text-ink/65">{formatDate(featured.date)}</span>
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
                  {post.readingTime && (
                    <>
                      <span className="text-ink/65">·</span>
                      <span className="text-ink/65">{post.readingTime}</span>
                    </>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-brand-ink">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/60">
                  {post.excerpt}
                </p>
                <span className="mt-auto pt-4 text-xs font-medium text-ink/65">
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
