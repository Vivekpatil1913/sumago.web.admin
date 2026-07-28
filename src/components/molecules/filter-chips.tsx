"use client";

import { cn } from "@/lib/utils";

export type FilterOption = { label: string; count: number };

type FilterChipsProps = {
  options: readonly FilterOption[];
  /** The active option's `label`. */
  active: string;
  onChange: (label: string) => void;
  /** Describes what's being filtered, e.g. "Filter articles by topic". */
  ariaLabel: string;
  /** `dark` restyles the chips for a dark section background. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Rounded filter chips with live counts — the site's one filter affordance,
 * shared by the article feed and the event gallery. The count is the point:
 * it tells you what's behind a chip before you spend a click on it.
 */
export function FilterChips({
  options,
  active,
  onChange,
  ariaLabel,
  tone = "light",
  className,
}: FilterChipsProps) {
  const dark = tone === "dark";

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap items-center gap-2", className)}
      data-aos="fade-up"
    >
      {options.map((option) => {
        const isActive = option.label === active;
        return (
          <button
            key={option.label}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.label)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
              isActive
                ? "border-brand bg-brand text-white"
                : dark
                  ? "border-white/15 bg-white/[0.06] text-white/75 hover:border-brand/50 hover:text-white"
                  : "border-line bg-white text-ink/70 hover:border-brand/40 hover:text-brand-ink",
            )}
          >
            {option.label}
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
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
