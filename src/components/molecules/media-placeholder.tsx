import Image from "next/image";
import { cn } from "@/lib/utils";

type MediaPlaceholderProps = {
  /** Preview stock URL (from lib/preview-assets). Replace with real asset before launch. */
  src: string;
  /** Describe what the REAL asset should be, e.g. "Sumago Nashik office". */
  alt: string;
  /** Aspect ratio, e.g. "16/9", "4/3", "1/1". */
  ratio?: string;
  priority?: boolean;
  className?: string;
  /** Responsive sizes hint for next/image (defaults to a half-width slot). */
  sizes?: string;
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
};

/**
 * Preview media slot. Renders a stock image now and shows a "PREVIEW" badge
 * outside production. Flagged via data-placeholder so the launch gate can
 * detect any stock asset still present. See docs/17.
 */
export function MediaPlaceholder({
  src,
  alt,
  ratio = "16/9",
  priority,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  bare = false,
  fill = false,
  imageClassName,
}: MediaPlaceholderProps) {
  const isProd = process.env.NODE_ENV === "production";
  const framed = !bare && !fill;
  return (
    <div
      data-placeholder="stock"
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
        className={cn("object-cover", imageClassName)}
      />
      {!isProd ? (
        <span className="absolute left-2 top-2 rounded bg-ink/80 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-white">
          Preview · stock
        </span>
      ) : null}
    </div>
  );
}
