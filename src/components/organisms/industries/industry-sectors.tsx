import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INDUSTRY_ICONS, FALLBACK_INDUSTRY_ICON } from "@/lib/industry-meta";
import { industriesBySector, type IndustryWithSlug } from "@/lib/industries";
import { cn } from "@/lib/utils";

/**
 * Industry sectors — the full industry catalog as four editorial bands (one per
 * sector family), each with a sticky header panel and its industries set open on
 * the page.
 *
 * Deliberately the same language as the services catalog
 * (`solutions/service-chapters.tsx`): full-bleed bands, tilted brand-gradient
 * plates, oversized ghost glyphs, pull-quoted problems, alternating light → mist
 * tones. What changes is the axis — services group by lifecycle *phase*,
 * industries group by the operating reality a sector family shares. A visitor
 * who has read one page can read the other without relearning anything.
 *
 * The old page was a grid of ten bordered name-and-arrow tiles: it named the
 * sectors but proved nothing about understanding them. Each block now opens
 * with the operator's own week, which is what the trust objective actually asks
 * for (CLAUDE.md).
 *
 * Server component: every effect here is CSS, so this ships zero JS.
 */

type Tone = "light" | "mist";

/* -------------------------------------------------------------------------- */
/*  Industry                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * One industry, open on the page. The problem is set as a pull-quote — it's the
 * operator's own voice, so it carries the block exactly as the service problems
 * do on the services page.
 */
function IndustryBlock({
  industry,
  index,
}: {
  industry: IndustryWithSlug;
  index: number;
}) {
  const Icon = INDUSTRY_ICONS[industry.slug] ?? FALLBACK_INDUSTRY_ICON;

  return (
    // `data-aos` must NOT sit on the anchor target: AOS translates the element
    // before reveal, so the browser would resolve the jump against the shifted
    // position and the block would land under the sticky header once AOS clears
    // the transform. Keeping the article untransformed keeps `scroll-mt-28` honest.
    <article
      id={industry.slug}
      className="group relative scroll-mt-28 border-t border-line py-12 first:border-t-0 first:pt-0 md:py-14"
    >
      {/* Ghost watermark of the sector icon — depth without a container. */}
      <Icon
        aria-hidden
        strokeWidth={0.5}
        className="pointer-events-none absolute -top-4 right-2 z-0 hidden h-56 w-56 text-brand/[0.07] transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-105 lg:block"
      />

      <div data-aos="fade-up" className="relative z-10">
        {/* Identity line — icon on a tilted brand plate. */}
        <div className="flex items-center gap-4">
          <span className="relative inline-grid h-12 w-12 shrink-0 place-items-center">
            <span
              aria-hidden
              className="absolute inset-0 -rotate-3 rounded-xl bg-[linear-gradient(135deg,#d73438,#7a1519)] transition-transform duration-500 group-hover:rotate-3"
            />
            <Icon size={22} className="relative text-white" aria-hidden />
          </span>
          <div className="min-w-0">
            <span className="font-display text-xs font-bold tracking-[0.2em] text-ink/25">
              {String(index).padStart(2, "0")}
            </span>
            {/* h4: nested under the sector's h3, which sits under the section h2. */}
            <h4 className="text-2xl font-bold leading-tight tracking-tight text-ink md:text-[1.75rem]">
              {industry.name}
            </h4>
          </div>
        </div>

        {/* The hook — the operator's week, as a pull-quote. */}
        <div className="relative mt-7 pl-1">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-2 -top-11 select-none font-display text-[6rem] leading-none text-brand/[0.09]"
          >
            &ldquo;
          </span>
          <p className="relative text-lg leading-[1.55] tracking-tight text-ink md:text-[1.35rem]">
            {industry.problem}
          </p>
        </div>

        {/* Red gradient rule → the answer. */}
        <div className="mt-7 h-px w-20 bg-gradient-to-r from-brand to-transparent" />

        <p className="mt-5 max-w-2xl leading-relaxed text-ink/70">
          {industry.approach}
        </p>

        {/* What typically gets built, set quietly as running text — chips would
            read as UI, not editorial. Challenges and outcomes deliberately live
            on the detail page: this page hooks with the problem, that page
            answers it in full. */}
        <p className="mt-6 text-xs font-medium uppercase tracking-[0.1em] text-ink/40">
          {industry.solutions.join("  ·  ")}
        </p>

        <Link
          href={`/industries/${industry.slug}`}
          className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-ink transition-colors hover:text-brand"
        >
          Explore {industry.name}
          <ArrowRight
            size={15}
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sector                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * One sector family, as its own full-bleed band. The header sticks while its
 * industries scroll past — and lists them, so the sector doubles as a contents
 * page you can jump from.
 */
function SectorBand({
  sector,
  order,
  startIndex,
  tone,
}: {
  sector: (typeof industriesBySector)[number];
  order: number;
  startIndex: number;
  tone: Tone;
}) {
  return (
    <section className={cn("relative py-16 md:py-24", tone === "mist" && "bg-mist")}>
      {/* Ambient brand glow so a band never reads as a flat document. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_35%_at_85%_0%,rgba(215,52,56,0.05),transparent_70%)]"
      />

      <div className="container-page">
        <div className="lg:grid lg:grid-cols-[minmax(0,17rem)_1fr] lg:items-start lg:gap-16">
          {/* Sticky sector panel — dark, so the sector reads as a fixed marker
              against the light industry column on either band tone. */}
          <header className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-blueprint p-7 text-white shadow-[0_28px_60px_-30px_rgba(0,0,0,0.65)]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_55%_at_50%_0%,rgba(215,52,56,0.28),transparent_70%)]"
              />
              {/* Oversized ghost numeral, clipped by the panel's rounded edge. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-3 -top-7 select-none font-display text-[7rem] font-bold leading-none text-white/[0.06]"
              >
                {String(order).padStart(2, "0")}
              </span>

              {/* Content scrolls inside the panel rather than the panel growing
                  past the fold, so the contents list stays reachable on a short
                  viewport. The ghost numeral stays on the outer clip so its
                  bleed doesn't create a phantom scroll area. */}
              <div className="no-scrollbar relative lg:max-h-[calc(100svh-13rem)] lg:overflow-y-auto">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                  Sector {String(order).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                  <span className="text-metal-red-shine">{sector.label}</span>
                </h3>

                <div className="mt-5 h-px w-16 bg-gradient-to-r from-brand to-transparent" />

                <p className="mt-5 text-base leading-relaxed text-white/60">
                  {sector.blurb}
                </p>

                {/* Contents — the sector's industries, jumpable. */}
                <ul className="mt-6 space-y-2 border-t border-white/10 pt-5">
                  {sector.industries.map((i, n) => (
                    <li key={i.slug}>
                      <a
                        href={`#${i.slug}`}
                        className="group/link flex items-baseline gap-2.5 text-sm text-white/60 transition-colors hover:text-white"
                      >
                        <span className="font-display text-[0.65rem] font-bold tabular-nums text-white/30 transition-colors group-hover/link:text-brand-bright">
                          {String(startIndex + n).padStart(2, "0")}
                        </span>
                        <span className="leading-snug">{i.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </header>

          {/* The sector's industries */}
          <div className="mt-10 lg:mt-0">
            {sector.industries.map((i, n) => (
              <IndustryBlock key={i.slug} industry={i} index={startIndex + n} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Band rhythm across the four sectors. */
const TONES: Tone[] = ["light", "mist", "light", "mist"];

/**
 * Industries numbered 01…10 continuously across sectors, so the running offset
 * is precomputed here rather than mutated during render (`industriesBySector`
 * is static module data, so this only ever runs once).
 */
const BANDS = industriesBySector.map((sector, i) => ({
  sector,
  order: i + 1,
  tone: TONES[i] ?? "light",
  startIndex:
    industriesBySector.slice(0, i).reduce((n, s) => n + s.industries.length, 0) + 1,
}));

/** The full industry catalog, as four editorial sector bands. */
export function IndustrySectors() {
  return (
    <div id="industry-sectors">
      {BANDS.map(({ sector, order, tone, startIndex }) => (
        <SectorBand
          key={sector.key}
          sector={sector}
          order={order}
          startIndex={startIndex}
          tone={tone}
        />
      ))}
    </div>
  );
}
