"use client";

import { useState } from "react";
import { Expand } from "lucide-react";
import { Media } from "@/components/molecules/media-placeholder";
import { Lightbox } from "./lightbox";
import { cn } from "@/lib/utils";

export type GalleryImage = { src: string; alt: string };

type MosaicGalleryProps = {
  images: GalleryImage[];
  /** Seconds for one full loop. Lower = faster. */
  speed?: number;
  /** Number of stacked rows in the collage. */
  rows?: 2 | 3;
  /** Accessible label for the gallery region. */
  label?: string;
  /** Set false to render a plain, non-clickable strip. */
  lightbox?: boolean;
  className?: string;
};

/** Height of a single mosaic row, in px. */
const ROW_H = 208;
const GAP = 16;

/**
 * Column shapes per row-count. Each shape is a list of tile heights in
 * row-units that sum to the total rows — mixing full-height tiles with stacked
 * pairs/trios gives the organic collage look.
 */
const SHAPES_BY_ROWS: Record<number, number[][]> = {
  2: [[2], [1, 1], [1, 1], [2]],
  3: [[3], [1, 2], [1, 1, 1], [2, 1]],
};
/** Varied column widths, cycled for an irregular, editorial rhythm. */
const WIDTHS = [248, 300, 288, 264, 320, 232];

type Tile = { img: GalleryImage; span: number; index: number };
type Column = { w: number; tiles: Tile[] };

function buildColumns(images: GalleryImage[], rows: number): Column[] {
  const shapes = SHAPES_BY_ROWS[rows] ?? SHAPES_BY_ROWS[2];
  const cols: Column[] = [];
  let idx = 0;
  let s = 0;
  while (idx < images.length) {
    const shape = shapes[s % shapes.length];
    // Wrap the image list so every column is fully filled (a few images may
    // repeat at the tail — invisible on a looping decorative strip). The
    // wrapped index travels with the tile so a click opens the viewer on the
    // photograph that was actually clicked, tail repeats included.
    const tiles = shape.map((span, k) => {
      const index = (idx + k) % images.length;
      return { img: images[index], span, index };
    });
    cols.push({ w: WIDTHS[s % WIDTHS.length], tiles });
    idx += shape.length;
    s++;
  }
  return cols;
}

/** Pixel height of a tile spanning `span` rows. */
function tileHeight(span: number): number {
  return span * ROW_H + (span - 1) * GAP;
}

/**
 * Auto-scrolling collage. Images sit in a multi-row mosaic of varied shapes and
 * sizes and drift horizontally on a seamless loop (duplicated track), pausing on
 * hover. Reduced-motion is neutralized globally (globals.css), so the strip is
 * simply static for those users.
 *
 * Every tile opens the full-screen `Lightbox` — zoom, pan, slideshow, native
 * fullscreen, arrows, and a thumbnail rail — over the complete image list, so
 * the strip is an entry point to the gallery rather than the whole of it. The
 * viewer always receives `images` in publication order, not the collage's
 * wrapped order, so arrowing through it matches the sequence an editor set.
 *
 * Tiles render through `Media`, not `MediaPlaceholder`: every strip on the site
 * now carries Sumago's own photography, and anything arriving from the panel is
 * an editor's upload tracked by `media_assets.is_stock` there. Flagging these as
 * stock would put a "Preview" badge on 20 real photographs and make the launch
 * gate cry wolf.
 */
export function MosaicGallery({
  images,
  speed = 60,
  rows = 2,
  label = "Photo gallery",
  lightbox = true,
  className,
}: MosaicGalleryProps) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  if (images.length === 0) return null;
  const columns = buildColumns(images, rows);
  const track = [...columns, ...columns];
  const fullHeight = rows * ROW_H + (rows - 1) * GAP;

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,#000_3rem,#000_calc(100%-3rem),transparent)]",
        className,
      )}
      role="region"
      aria-label={label}
    >
      <div
        className="flex w-max will-change-transform hover:[animation-play-state:paused] motion-safe:animate-[marquee-x_var(--dur)_linear_infinite]"
        style={{ height: fullHeight, gap: GAP, ["--dur" as string]: `${speed}s` }}
      >
        {track.map((col, i) => {
          // Second half of the track is the seamless-loop clone: hidden from
          // assistive tech, and kept out of the tab order with it — a focusable
          // control inside aria-hidden is a trap with no accessible name.
          const clone = i >= columns.length;
          return (
            <div
              key={i}
              className="flex shrink-0 flex-col"
              style={{ width: col.w, gap: GAP }}
              aria-hidden={clone}
            >
              {col.tiles.map((t, j) => {
                const tile = (
                  <Media
                    src={t.img.src}
                    alt={t.img.alt}
                    sizes="(max-width: 768px) 60vw, 320px"
                    unoptimized
                    bare
                    className="h-full w-full"
                  />
                );
                return (
                  <div key={`${i}-${j}`} style={{ height: tileHeight(t.span) }}>
                    {lightbox ? (
                      <button
                        type="button"
                        tabIndex={clone ? -1 : 0}
                        onClick={() => setOpenAt(t.index)}
                        aria-label={`View photo: ${t.img.alt}`}
                        className="group relative block h-full w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                      >
                        {tile}
                        {/* Hover affordance: the collage is decorative enough
                            that nothing else says these open. */}
                        <span
                          aria-hidden
                          className="absolute inset-0 grid place-items-center bg-ink/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                        >
                          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur">
                            <Expand className="h-5 w-5" />
                          </span>
                        </span>
                      </button>
                    ) : (
                      tile
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {openAt !== null ? (
        <Lightbox images={images} startIndex={openAt} onClose={() => setOpenAt(null)} />
      ) : null}
    </div>
  );
}
