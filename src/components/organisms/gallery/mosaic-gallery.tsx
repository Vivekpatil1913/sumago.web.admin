"use client";

import { Media } from "@/components/molecules/media-placeholder";
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

type Tile = { img: GalleryImage; span: number };
type Column = { w: number; tiles: Tile[] };

function buildColumns(images: GalleryImage[], rows: number): Column[] {
  const shapes = SHAPES_BY_ROWS[rows] ?? SHAPES_BY_ROWS[2];
  const cols: Column[] = [];
  let idx = 0;
  let s = 0;
  while (idx < images.length) {
    const shape = shapes[s % shapes.length];
    // Wrap the image list so every column is fully filled (a few images may
    // repeat at the tail — invisible on a looping decorative strip).
    const tiles = shape.map((span, k) => ({ img: images[(idx + k) % images.length], span }));
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
  className,
}: MosaicGalleryProps) {
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
        {track.map((col, i) => (
          <div
            key={i}
            className="flex shrink-0 flex-col"
            style={{ width: col.w, gap: GAP }}
            aria-hidden={i >= columns.length}
          >
            {col.tiles.map((t, j) => (
              <div key={`${i}-${j}`} style={{ height: tileHeight(t.span) }}>
                <Media
                  src={t.img.src}
                  alt={t.img.alt}
                  sizes="(max-width: 768px) 60vw, 320px"
                  bare
                  className="h-full w-full"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
