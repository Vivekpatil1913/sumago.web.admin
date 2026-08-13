import Image from "next/image";
import { cn } from "@/lib/utils";

type MediaProps = {
  /** Image URL — a real asset from `lib/real-assets`, or a CMS URL. */
  src: string;
  /** What the photograph shows. Never decorative here; every slot is content. */
  alt: string;
  /** Aspect ratio, e.g. "16/9", "4/3", "1/1". */
  ratio?: string;
  priority?: boolean;
  className?: string;
  /** Responsive sizes hint for next/image (defaults to a half-width slot). */
  sizes?: string;
  /** Serve the source file directly, without Next.js re-encoding it. */
  unoptimized?: boolean;
  /** Drop the light frame (ring + mist bg) — for image tiles that fully cover,
   *  e.g. collage tiles on dark backgrounds where the light ring looks harsh. */
  bare?: boolean;
  /**
   * Stretch to the parent instead of holding `ratio`. For imagery that merges
   * into a backdrop (masked/scrimmed bands) where the parent owns the box and a
   * fixed aspect ratio would fight it. Implies `bare`.
   */
  fill?: boolean;
  /** Classes on the <Image> itself — grayscale, blend modes, object-position. */
  imageClassName?: string;
  /**
   * Mark this asset as licensed stock standing in for a photograph that does
   * not exist yet: shows the badge outside production and sets
   * `data-placeholder` for the launch gate (docs/17).
   *
   * Pass it as a value, not a constant, wherever the source can be either —
   * a CMS portrait an editor uploaded is real, and its seed fallback is not.
   */
  stock?: boolean;
};

/**
 * Whether a URL is licensed stock rather than owned photography.
 *
 * Owned assets are always served from this origin — `/images/**` for what is
 * committed, `/uploads/**` for what an editor uploaded — and everything still
 * standing in comes from `preview-assets.ts` as an absolute Unsplash URL. So
 * the origin is the whole test, and a CMS-fed slot can flag itself correctly
 * without the page having to know which of the two it was handed.
 *
 * Use it wherever the source can be either: a story cover is real once the
 * panel (or the seed) points it at a photograph, and passing a constant `stock`
 * there would either badge a real image or hide a stock one from the gate.
 */
export function isStockAsset(src: string): boolean {
  return /^https?:\/\//i.test(src) || src.startsWith(STOCK_PREFIX);
}

/**
 * Where downloaded stock lives when it is served from this origin.
 *
 * The origin test above assumes anything same-origin is owned, which held while
 * every stand-in was hotlinked. Blog and case-study covers are now committed
 * files — same-origin, one request, no third-party host against the LCP budget
 * — and without this prefix they would read as Sumago photography and slip past
 * the launch gate (docs/17).
 *
 * So the path carries the claim: `/images/**` is owned, `/images/stock/**` is
 * licensed stock standing in for a photograph that does not exist yet. Moving a
 * file out of this folder is what graduates it.
 */
const STOCK_PREFIX = "/images/stock/";

/**
 * An image slot: the box, the frame, and the cover behaviour every media
 * surface on the site shares.
 *
 * Use this for real, owned photography. For stock still standing in for a
 * photograph that has not been taken, use `MediaPlaceholder` below — the two
 * differ only in whether the asset is flagged, and keeping the box identical
 * is what lets a slot graduate from one to the other without a layout change.
 */
export function Media({
  src,
  alt,
  ratio = "16/9",
  priority,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  unoptimized = false,
  bare = false,
  fill = false,
  imageClassName,
  stock = false,
}: MediaProps) {
  const isProd = process.env.NODE_ENV === "production";
  const framed = !bare && !fill;
  return (
    <div
      data-placeholder={stock ? "stock" : undefined}
      className={cn(
        "relative overflow-hidden",
        fill ? "h-full w-full" : "rounded-xl",
        framed ? "bg-mist ring-1 ring-line" : "bg-black/20",
        className,
      )}
      style={fill ? undefined : { aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={cn("object-cover", imageClassName)}
      />
      {stock && !isProd ? (
        <span className="absolute left-2 top-2 rounded bg-ink/80 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-white">
          Preview · stock
        </span>
      ) : null}
    </div>
  );
}

/**
 * Preview media slot. Renders a stock image now and shows a "PREVIEW" badge
 * outside production. Flagged via data-placeholder so the launch gate can
 * detect any stock asset still present. See docs/17.
 *
 * Identical geometry to `Media` — it wraps it — so replacing a stock URL with
 * a real photograph is a one-word component swap and nothing shifts.
 */
export function MediaPlaceholder(props: MediaProps) {
  return <Media {...props} stock />;
}
