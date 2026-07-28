import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CAPABILITY_ICONS, FALLBACK_CAPABILITY_ICON } from "@/lib/capability-icons";
import { capabilityMeta } from "@/lib/content";
import { cn, slugify } from "@/lib/utils";

/**
 * A single capability card — name, blurb, "Learn more", and a large outline
 * watermark of the service's icon bleeding off the top-right corner.
 * Shared by the home capabilities grid and the Solutions index so both stay
 * visually identical and in sync. Copy comes from `capabilityMeta` (real).
 * `tone="dark"` adapts it for dark sections (silver title, translucent surface).
 */
export function CapabilityCard({
  name,
  tone = "light",
}: {
  name: string;
  tone?: "light" | "dark";
}) {
  const slug = slugify(name);
  const meta = capabilityMeta[slug];
  const Icon = CAPABILITY_ICONS[meta?.icon ?? ""] ?? FALLBACK_CAPABILITY_ICON;
  const dark = tone === "dark";

  return (
    <Link
      href={`/solutions/${slug}`}
      className={cn(
        "group relative flex h-full min-h-[17rem] flex-col overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_28px_56px_-28px_rgba(215,52,56,0.35)]",
        dark ? "border-white/10 bg-white/[0.04]" : "border-line bg-white/70",
      )}
    >
      {/* hover corner glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />
      {/* top sheen line on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Outline watermark of the service's icon, bleeding off the right corner */}
      <Icon
        aria-hidden
        strokeWidth={1}
        className={cn(
          "pointer-events-none absolute -bottom-6 -right-6 z-0 h-40 w-40 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110",
          dark ? "text-white/[0.08]" : "text-ink/[0.06]",
        )}
      />

      <div className="relative z-10 flex h-full flex-col">
        <h3
          className={cn(
            "text-xl font-bold leading-snug",
            dark
              ? "text-silver"
              : "text-ink transition-colors group-hover:text-brand-ink",
          )}
        >
          {name}
        </h3>
        <p
          className={cn(
            "mt-4 max-w-[85%] text-sm leading-relaxed",
            dark ? "text-white/60" : "text-ink/60",
          )}
        >
          {meta?.blurb}
        </p>
        <span
          className={cn(
            "mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold",
            dark ? "text-brand-bright" : "text-brand-ink",
          )}
        >
          Learn more
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
