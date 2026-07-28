import { getToolIcons, type ToolIcon } from "@/lib/tool-icons";
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
}: {
  icon: ToolIcon;
  tone?: "light" | "dark";
}) {
  return (
    <li
      role="img"
      aria-label={icon.title}
      title={icon.title}
      className={cn(
        "grid h-14 w-14 shrink-0 place-items-center rounded-[24%] transition-transform duration-300 hover:-translate-y-0.5 hover:scale-105",
        tone === "light"
          ? "border border-line bg-gradient-to-br from-white to-white/85 shadow-[0_12px_28px_-14px_rgba(0,0,0,0.45)] ring-1 ring-black/[0.04]"
          : "border border-white/10 bg-white/[0.06] shadow-[0_12px_28px_-14px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.06] backdrop-blur",
      )}
    >
      {icon.path ? (
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill={`#${icon.hex}`} aria-hidden>
          <path d={icon.path} />
        </svg>
      ) : (
        <span
          className="text-[0.62rem] font-bold leading-none tracking-tight"
          style={{ color: `#${icon.hex}` }}
          aria-hidden
        >
          {icon.text}
        </span>
      )}
    </li>
  );
}

/** The tools a service works in, as a row of brand marks. Renders nothing when
 *  no title resolves to a known mark. */
export function ToolStrip({
  tools,
  label,
  tone = "light",
  className,
}: {
  tools: readonly string[];
  /** Describes the set for screen readers, e.g. "Tools used for Web Platform Engineering". */
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const icons = getToolIcons(tools);
  if (!icons.length) return null;

  return (
    <ul
      aria-label={label}
      className={cn("flex flex-wrap items-center gap-2.5", className)}
    >
      {icons.map((icon) => (
        <ToolTile key={icon.title} icon={icon} tone={tone} />
      ))}
    </ul>
  );
}
