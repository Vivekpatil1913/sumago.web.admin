"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MosaicGallery, type GalleryImage } from "./mosaic-gallery";

export type EventCategory = { key: string; title: string; images: GalleryImage[] };

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
 */
export function EventGallery({ categories, rows = 2, tone = "light" }: EventGalleryProps) {
  const [active, setActive] = useState(categories[0]?.key);
  const current = categories.find((c) => c.key === active) ?? categories[0];
  if (!current) return null;
  const dark = tone === "dark";

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter photos by event"
        className="flex flex-wrap items-center gap-2"
        data-aos="fade-up"
      >
        {categories.map((c) => {
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
        label={`${current.title} photo gallery`}
        className="mt-10"
      />
    </div>
  );
}
