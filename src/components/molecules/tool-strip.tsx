import { getToolIcons, markColor, type ToolIcon } from "@/lib/tool-icons";
import { cn } from "@/lib/utils";

/**
 * The brand marks for the tools a service actually works in — the same mark set
 * AND tile size as the home page "AI across the SDLC" bands.
 *
 * Shared by the Solutions index stages and the service detail page so a service's
 * stack reads identically wherever it appears. Unlabelled by design: the marks
 * speak for themselves, and the list keeps an aria-label for non-visual users.
 *
 * Server component — pure CSS, ships zero JS (keeps the Lighthouse ≥95 gate).
 */

/** One brand tile. Glyph sits at half the tile so every brand reads at the same
 *  optical weight. `tone` reframes the tile for a light or dark surface. */
export function ToolTile({
  icon,
  tone = "light",
  decorative = false,
  size = "md",
}: {
  icon: ToolIcon;
  tone?: "light" | "dark";
  /** A repeated tile in a marquee track — visible, but not announced again. */
  decorative?: boolean;
  /** `lg` matches the home page's SDLC bands, which scale with the viewport. */
  size?: "md" | "lg";
}) {
  /* Brand hexes assume the brand's own background: on the ink tile GitHub
     (#181717) and Vercel (#000000) painted black-on-black, so those tiles read
     as empty boxes. `markColor` keeps the brand colour wherever it is already
     legible and only adjusts the ones that aren't (see lib/tool-icons). */
  const color = markColor(icon.hex, tone);

  return (
    /*
      The picture role sits on the mark inside, not on the `<li>`. Putting it
      here replaced the listitem role, which left every `<ul>` of tool marks
      reported as a list containing no list items.

      A marquee repeat is hidden at the `<li>` instead: the tile leaves the
      accessibility tree whole, so the same brand isn't read out three times,
      and the first pass through the set still supplies the list its items.
    */
    <li
      aria-hidden={decorative || undefined}
      title={icon.title}
      className={cn(
        "grid shrink-0 place-items-center rounded-[24%] transition-transform duration-300 hover:-translate-y-0.5 hover:scale-105",
        size === "lg"
          ? "h-[clamp(56px,6.2vw,84px)] w-[clamp(56px,6.2vw,84px)]"
          : "h-14 w-14",
        tone === "light"
          ? "border border-line bg-gradient-to-br from-white to-white/85 shadow-[0_12px_28px_-14px_rgba(0,0,0,0.45)] ring-1 ring-black/[0.04]"
          : "border border-white/10 bg-white/[0.06] shadow-[0_12px_28px_-14px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.06] backdrop-blur",
      )}
    >
      {icon.path ? (
        <svg
          viewBox="0 0 24 24"
          className="h-1/2 w-1/2"
          fill={color}
          role="img"
          aria-label={icon.title}
        >
          <path d={icon.path} />
        </svg>
      ) : (
        <span
          className="text-[0.62rem] font-bold leading-none tracking-tight"
          style={{ color }}
          role="img"
          aria-label={icon.title}
        >
          {icon.text}
        </span>
      )}
    </li>
  );
}

/**
 * Approximate width of one tile plus its gutter, in px. Only used to decide how
 * many times a short set has to repeat before the track can scroll seamlessly —
 * it never needs to be exact, only generous.
 */
const TILE_PITCH = { md: 66, lg: 100 } as const;

/** The widest viewport a track has to outrun before the loop can look seamless. */
const MAX_TRACK = 2200;

/** The tools a service works in, as a row of brand marks. Renders nothing when
 *  no title resolves to a known mark. */
export function ToolStrip({
  tools,
  label,
  tone = "light",
  variant = "wrap",
  reverse = false,
  speed = 42,
  size = "md",
  className,
}: {
  tools: readonly string[];
  /** Describes the set for screen readers, e.g. "Tools used for Web Platform Engineering". */
  label: string;
  tone?: "light" | "dark";
  /**
   * `wrap` — a static wrapping row (the default, used wherever the set must be
   * read in full at a glance). `marquee` — one continuous drifting band that
   * pauses on hover, for the places where the stack is atmosphere rather than a
   * checklist. Reduced-motion users get a still track (globals.css neutralises
   * every animation), so nothing is lost when the drift is off.
   */
  variant?: "wrap" | "marquee";
  /** Marquee only — run right-to-left, for the second band of a pair. */
  reverse?: boolean;
  /** Marquee only — seconds per full cycle. Pair two bands at different speeds. */
  speed?: number;
  size?: "md" | "lg";
  className?: string;
}) {
  const icons = getToolIcons(tools);
  if (!icons.length) return null;

  if (variant === "marquee") {
    /**
     * The `marquee-x` keyframe travels exactly -50%, so the track must be two
     * identical halves. It must ALSO be wider than the viewport, or the band
     * runs out of tiles and leaves a visible gap mid-cycle — which is what a
     * short set (a dozen marks) does on a wide screen. So the set repeats until
     * one half clears the widest viewport we support, and that half is rendered
     * twice.
     */
    const perHalf = Math.max(
      1,
      Math.ceil(MAX_TRACK / (icons.length * TILE_PITCH[size])),
    );
    const half = Array.from({ length: perHalf }, () => icons).flat();

    return (
      <div
        className={cn(
          "group relative overflow-hidden",
          /* Feather both ends so the loop has no visible seam or hard edge. */
          "[mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]",
          className,
        )}
      >
        <ul
          aria-label={label}
          className={cn(
            "flex w-max items-center gap-5 py-4 will-change-transform md:gap-8",
            "animate-[marquee-x_var(--dur)_linear_infinite]",
            "group-hover:[animation-play-state:paused] motion-reduce:animate-none",
            reverse && "[animation-direction:reverse]",
          )}
          style={{ ["--dur" as string]: `${speed}s` }}
        >
          {half.map((icon, i) => (
            <ToolTile
              key={`a-${i}-${icon.title}`}
              icon={icon}
              tone={tone}
              size={size}
              /* Only the first pass through the set is announced; the repeats
                 are the same marks again and would triple the screen reader's
                 output for no added meaning. */
              decorative={i >= icons.length}
            />
          ))}
          {half.map((icon, i) => (
            <ToolTile
              key={`b-${i}-${icon.title}`}
              icon={icon}
              tone={tone}
              size={size}
              decorative
            />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <ul
      aria-label={label}
      className={cn("flex flex-wrap items-center gap-2.5", className)}
    >
      {icons.map((icon) => (
        <ToolTile key={icon.title} icon={icon} tone={tone} size={size} />
      ))}
    </ul>
  );
}
