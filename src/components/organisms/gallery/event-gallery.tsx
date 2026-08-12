"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { MosaicGallery, type GalleryImage } from "./mosaic-gallery";

export type EventCategory = { key: string; title: string; images: GalleryImage[] };

/** Reserved key for the generated "everything" tab (see `withAllTab`). */
const ALL_KEY = "__all";

/**
 * The default seconds-per-loop `MosaicGallery` runs at.
 *
 * Named here because the "All" tab has to reason about it: the marquee moves
 * the track by a fixed 50% in `speed` seconds, so pixel velocity rises with the
 * number of images. Left at the default, a strip holding every photo would race
 * past at several times the pace of the category tabs beside it.
 */
const BASE_SPEED = 60;

/**
 * Every category's photos in one list, taken round-robin.
 *
 * Concatenating would put a dozen festival photos in a row and then ten from
 * the office opening — at marquee speed that reads as several galleries
 * stitched end to end rather than one. Taking one from each category in turn
 * keeps the mix varied wherever a visitor happens to be looking.
 *
 * Deduplicated by src: nothing stops an editor filing the same photograph under
 * two categories, and the same frame twice in one collage is the one repeat the
 * layout cannot disguise.
 */
function interleave(categories: EventCategory[]): GalleryImage[] {
  const longest = Math.max(0, ...categories.map((c) => c.images.length));
  const seen = new Set<string>();
  const all: GalleryImage[] = [];
  for (let i = 0; i < longest; i++) {
    for (const category of categories) {
      const image = category.images[i];
      if (!image || seen.has(image.src)) continue;
      seen.add(image.src);
      all.push(image);
    }
  }
  return all;
}

/**
 * The tab strip: "All" first, then the categories as published.
 *
 * Skipped for a single category, where an "All" tab would be the same set of
 * photos under a second name.
 */
function withAllTab(categories: EventCategory[]): EventCategory[] {
  if (categories.length < 2) return categories;
  return [{ key: ALL_KEY, title: "All", images: interleave(categories) }, ...categories];
}

type EventGalleryProps = {
  categories: EventCategory[];
  /** Number of collage rows. */
  rows?: 2 | 3;
  /** `dark` restyles the filter chips for a dark section background. */
  tone?: "light" | "dark";
};

/**
 * Selectable event gallery. Category chips (mirroring the careers job-filter
 * pattern) switch which set of photos is shown, rendered in the same
 * auto-scrolling collage layout as the "Our culture" section. Remounting the
 * MosaicGallery on change (via key) restarts the marquee cleanly.
 *
 * "All" leads and opens selected. A visitor who has not yet decided which of
 * six events interests them should see the whole archive first rather than
 * whichever category happens to sort first — the categories are then there to
 * narrow it down, which is the order the filter pattern reads best in.
 */
export function EventGallery({ categories, rows = 2, tone = "light" }: EventGalleryProps) {
  const tabs = useMemo(() => withAllTab(categories), [categories]);
  const [active, setActive] = useState(ALL_KEY);
  const current = tabs.find((c) => c.key === active) ?? tabs[0];
  if (!current) return null;
  const dark = tone === "dark";

  /* Hold the scroll pace steady across tabs. The track is roughly as wide as
     the photo count, and the animation always covers it in `speed` seconds, so
     "All" needs proportionally longer to drift at the same speed as the biggest
     category tab — the one it most resembles. */
  const largest = Math.max(1, ...categories.map((c) => c.images.length));
  const speed =
    current.key === ALL_KEY
      ? Math.round((BASE_SPEED * current.images.length) / largest)
      : BASE_SPEED;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter photos by event"
        className="flex flex-wrap items-center gap-2"
        data-aos="fade-up"
      >
        {tabs.map((c) => {
          const isActive = c.key === current.key;
          return (
            <button
              key={c.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(c.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                isActive
                  ? "border-brand bg-brand text-white"
                  : dark
                    ? "border-white/15 bg-white/[0.06] text-white/75 hover:border-brand/50 hover:text-white"
                    : "border-line bg-white text-ink/70 hover:border-brand/40 hover:text-brand-ink",
              )}
            >
              {c.title}
              <span
                className={cn(
                  "grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs",
                  isActive
                    ? "bg-white/20 text-white"
                    : dark
                      ? "bg-white/10 text-white/60"
                      : "bg-mist text-ink/60",
                )}
              >
                {c.images.length}
              </span>
            </button>
          );
        })}
      </div>

      <MosaicGallery
        key={current.key}
        images={current.images}
        rows={rows}
        speed={speed}
        label={
          current.key === ALL_KEY
            ? "All event photos"
            : `${current.title} photo gallery`
        }
        className="mt-10"
      />
    </div>
  );
}
