import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CmsIcon } from "@/lib/icon-registry";
import { getIndustries, type IndustryRecord } from "@/lib/cms";
import { INDUSTRY_ICON_NAMES } from "@/lib/industry-meta";

/**
 * Every published industry, as cards — the whole list visible and comparable in one
 * view, which is what a visitor arrives on this page to do: find their own
 * sector fast.
 *
 * Two columns from `md` up, so all ten fill evenly (five rows) and each card is
 * wide enough to carry a real line of substance plus what typically gets built.
 * The old page listed bare names with an arrow; the cards keep the same instant
 * scannability but answer "and what does that mean for me?" without a click.
 *
 * Server component: every effect is CSS, so this ships zero JS — which keeps the
 * Lighthouse ≥95 gate (CLAUDE.md) intact.
 */

/* -------------------------------------------------------------------------- */

function IndustryCard({
  industry,
  index,
}: {
  industry: IndustryRecord;
  index: number;
}) {
  // The record's own icon wins; the committed map answers for a row with none.
  const iconName = industry.icon || INDUSTRY_ICON_NAMES[industry.slug];

  return (
    <Link
      href={`/industries/${industry.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_28px_56px_-28px_rgba(215,52,56,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:p-7"
    >
      {/* Hover corner glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />
      {/* Top sheen line on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {/* Outline watermark of the sector icon, bleeding off the bottom-right */}
      <CmsIcon
        name={iconName}
        aria-hidden
        strokeWidth={1}
        className="pointer-events-none absolute -bottom-7 -right-7 z-0 h-40 w-40 text-ink/[0.05] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* Identity line — icon on a tilted brand plate, with the running index. */}
        <div className="flex items-start gap-4">
          <span className="relative inline-grid h-12 w-12 shrink-0 place-items-center">
            <span
              aria-hidden
              className="absolute inset-0 -rotate-3 rounded-xl bg-[linear-gradient(135deg,#d73438,#7a1519)] transition-transform duration-500 group-hover:rotate-3"
            />
            <CmsIcon name={iconName} size={22} className="relative text-white" aria-hidden />
          </span>

          <h3 className="min-w-0 flex-1 pt-1 text-xl font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-brand-ink md:text-[1.375rem]">
            {industry.name}
          </h3>

          <span
            aria-hidden
            className="font-display text-sm font-bold tabular-nums leading-none text-ink/15 transition-colors group-hover:text-brand/40"
          >
            {String(index).padStart(2, "0")}
          </span>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-ink/65">{industry.blurb}</p>

        {/* What typically gets built — the proof the sector is actually understood. */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
          {industry.solutions.map((s) => (
            <span
              key={s.title}
              className="rounded-full border border-line bg-paper px-2.5 py-1 text-[0.7rem] font-medium text-ink/60 transition-colors group-hover:border-brand/25 group-hover:text-ink/75"
            >
              {s.title}
            </span>
          ))}
        </div>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-brand-ink">
          Explore {industry.name}
          <ArrowRight
            size={15}
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}

/**
 * The full industry list, as a card grid.
 *
 * Reads the published industries, so adding, reordering or unpublishing one in
 * the admin panel changes this page. Still a server component shipping zero
 * client JS — every effect here is CSS, which is what keeps the Lighthouse gate
 * intact (CLAUDE.md).
 */
export async function IndustryGrid() {
  const industries = await getIndustries();

  return (
    <div className="mt-14 grid gap-5 md:grid-cols-2">
      {industries.map((industry, i) => (
        <div
          key={industry.slug}
          data-aos="fade-up"
          data-aos-delay={(i % 2) * 60}
          className="h-full"
        >
          <IndustryCard industry={industry} index={i + 1} />
        </div>
      ))}
    </div>
  );
}
