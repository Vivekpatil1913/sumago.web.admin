import {
  Cloud,
  Database,
  LayoutGrid,
  Link2,
  Monitor,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/atoms/section-heading";
import { architectureLayers } from "@/lib/content";

const ICONS: Record<string, LucideIcon> = {
  Monitor,
  Link2,
  LayoutGrid,
  Database,
  Cloud,
};

/**
 * The reference architecture — the one section on /solutions that answers "are
 * these actually engineers?" rather than "what do they sell?".
 *
 * **On drafting paper, and turned on its side.** Two things changed together
 * here, and they depend on each other:
 *
 * 1. **Light band (`bg-drafting`).** The dark `bg-blueprint` treatment made
 *    every version of this section a black wall of chips: the components — the
 *    actual evidence — were low-contrast white-on-near-black, and the diagram
 *    fought the backdrop instead of sitting on it. Drawn on paper, with a fine
 *    engineering grid and one brand bloom, the ink is `--color-ink` on white and
 *    the components read at a glance. It also matches the literal reference:
 *    architecture drawings are dark on light, not the reverse.
 * 2. **Columns, not rows.** Every previous pass stacked five full-width bands,
 *    which is a list wearing a diagram's clothes. Rotating the stack onto a
 *    left-to-right axis turns it into a board of five bays, each with its
 *    components enumerated down its length — a shape you read *across*, and the
 *    only one of these layouts where all five layers are visible as peers in a
 *    single glance.
 *
 * The axis rail above the board carries the meaning the vertical stack used to:
 * user-facing at the left end, infrastructure at the right, with the layer's
 * external boundary called out beneath the rail where one exists. Depth is a
 * single ramp — each bay's top rule is one step quieter in brand red than the
 * bay before it — because the palette is red, charcoal and white, and the source
 * design's five pastel hues would be the most off-brand element on the site.
 */
export function ArchitectureBlueprint() {
  const count = architectureLayers.length;

  return (
    <section className="relative isolate overflow-hidden border-y border-line bg-drafting py-16 md:py-22">
      <div className="container-page relative z-10">
        <SectionHeading
          align="left"
          wide
          eyebrow="Engineering blueprint"
          title={
            <>
              How We Architect{" "}
              <span className="text-metal-red">Enterprise Systems</span>
            </>
          }
          description="An API-first, service-oriented reference architecture — the pattern behind every portal, platform and enterprise system Sumago builds."
        />

        {/* Axis rail — names the two ends of the board so the left-to-right
            order is stated rather than inferred. Hidden below lg, where the
            bays stack and the vertical order says it on its own. */}
        <div
          aria-hidden
          className="mt-12 hidden items-center gap-4 lg:flex"
        >
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink/65">
            User-facing
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-brand/45 via-line to-ink/15" />
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink/65">
            Infrastructure
          </span>
        </div>

        {/* The board. <ol> because the order is the meaning. */}
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:mt-4 lg:grid-cols-5 lg:gap-5">
          {architectureLayers.map((layer, i) => {
            const Icon = ICONS[layer.icon] ?? LayoutGrid;
            return (
              <li
                key={layer.label}
                data-aos="fade-up"
                data-aos-delay={i * 70}
                className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_1px_2px_rgba(26,26,26,0.04)]"
              >
                {/* Top rule — one step quieter per bay, so the ramp reads as
                    depth into the system without a second colour. */}
                <span
                  aria-hidden
                  className="h-[3px] w-full bg-brand"
                  style={{ opacity: 1 - i * (0.55 / (count - 1)) }}
                />

                <div className="border-b border-line px-5 pb-5 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand-ink">
                      <Icon size={19} strokeWidth={2} aria-hidden />
                    </span>
                    <span
                      aria-hidden
                      className="font-display text-2xl font-black leading-none text-ink/10"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold leading-tight text-ink">
                    {layer.label}
                  </h3>
                  {/* Boundary, where the layer has an external edge. Interior
                      bays get a spacer so the component lists stay aligned. */}
                  {layer.boundary ? (
                    <p className="mt-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-brand-ink/70">
                      ↔ {layer.boundary}
                    </p>
                  ) : (
                    <p aria-hidden className="mt-1.5 text-[0.6875rem] leading-none text-transparent">
                      —
                    </p>
                  )}
                </div>

                {/* Components, enumerated down the bay. */}
                <ul className="flex flex-1 flex-col">
                  {layer.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 border-b border-line/70 px-5 py-3 text-[0.8125rem] font-semibold leading-snug text-ink/75 last:border-b-0"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.4rem] h-1 w-1 shrink-0 rounded-full bg-brand/60"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
