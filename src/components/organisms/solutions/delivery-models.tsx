"use client";

import {
  Banknote,
  Building2,
  ClipboardCheck,
  Cloud,
  FileCheck,
  Flag,
  Gauge,
  Globe,
  HeartPulse,
  Landmark,
  Layers,
  RefreshCw,
  Rocket,
  RotateCcw,
  ScrollText,
  ShieldCheck,
  Shuffle,
  Smartphone,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { Eyebrow } from "@/components/atoms/eyebrow";
import { deliveryModels, methodologyComparison } from "@/lib/content";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  RefreshCw,
  Layers,
  Rocket,
  Users,
  Shuffle,
  Gauge,
  FileCheck,
  ClipboardCheck,
  ShieldCheck,
  ScrollText,
  Cloud,
  Zap,
  Smartphone,
  Globe,
  Landmark,
  Banknote,
  HeartPulse,
  Building2,
};

/** Standard entrance curve (docs/06) — decelerating, no overshoot. */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
/** One small overshoot, reserved for the badges and the VS mark landing. */
const EASE_POP = [0.34, 1.36, 0.64, 1] as const;

/**
 * Per-model palette, written out as literal class strings.
 *
 * Two reasons it is a lookup rather than interpolation: Tailwind only sees
 * classes that appear literally in the source, and keeping both themes side by
 * side makes it obvious when one gains a state the other is missing.
 *
 * Red is the brand default. Blue is `--color-tech` — the single sanctioned
 * secondary in docs/03, used *sparingly*, and this is exactly the case it
 * exists for: separating the exception path from the default one at a glance.
 * Every blue that carries text is `tech-ink` (7.1:1 on white), never `tech`
 * itself, which is a fill colour only.
 */
const THEME = {
  agile: {
    accentBar: "bg-[linear-gradient(90deg,#a81b22,#d73438_45%,rgba(215,52,56,0.25))]",
    glow: "bg-[radial-gradient(closest-side,rgba(215,52,56,0.16),transparent)]",
    hoverRing: "hover:border-brand/35",
    hoverShadow:
      "hover:shadow-[0_2px_4px_rgba(16,24,40,0.04),0_32px_60px_-24px_rgba(215,52,56,0.32)]",
    iconWrap:
      "bg-[linear-gradient(140deg,rgba(215,52,56,0.18),rgba(215,52,56,0.06))] text-brand-ink ring-brand/15",
    badge: "bg-brand/10 text-brand-ink ring-brand/20",
    rail: "bg-[linear-gradient(180deg,#d73438,rgba(215,52,56,0.25))]",
    node: "border-brand/30 bg-white text-brand-ink",
    nodeShadow: "shadow-[0_4px_14px_-6px_rgba(215,52,56,0.55)]",
    benefitIcon: "text-brand",
    chip: "border-brand/20 bg-brand/[0.06] text-brand-ink hover:border-brand/40",
    cadence: "text-brand",
    tableHead: "text-brand-ink",
  },
  waterfall: {
    accentBar: "bg-[linear-gradient(90deg,#0f4685,#1e83f0_45%,rgba(30,131,240,0.25))]",
    glow: "bg-[radial-gradient(closest-side,rgba(30,131,240,0.16),transparent)]",
    hoverRing: "hover:border-tech/35",
    hoverShadow:
      "hover:shadow-[0_2px_4px_rgba(16,24,40,0.04),0_32px_60px_-24px_rgba(30,131,240,0.30)]",
    iconWrap:
      "bg-[linear-gradient(140deg,rgba(30,131,240,0.18),rgba(30,131,240,0.06))] text-tech-ink ring-tech/15",
    badge: "bg-tech/10 text-tech-ink ring-tech/20",
    rail: "bg-[linear-gradient(180deg,#1e83f0,rgba(30,131,240,0.25))]",
    node: "border-tech/30 bg-white text-tech-ink",
    nodeShadow: "shadow-[0_4px_14px_-6px_rgba(30,131,240,0.55)]",
    benefitIcon: "text-tech",
    chip: "border-tech/20 bg-tech/[0.06] text-tech-ink hover:border-tech/40",
    cadence: "text-tech",
    tableHead: "text-tech-ink",
  },
} as const;

/**
 * Development methodology — Agile against Waterfall, as a decision the buyer is
 * being walked through rather than a preference being defended.
 *
 * **Why this section exists.** "State your development methodology" is a line in
 * effectively every enterprise tender, and the honest answer is conditional:
 * iterative where value compounds, sequential where compliance and documentation
 * govern. Sitting last on /solutions, it is the most operational detail on the
 * page, for the reader who has already cleared the architecture and security
 * sections above.
 *
 * **The shape: two peers, then the evidence.** The cards are deliberately
 * symmetrical — same anatomy, same weight, opposite palettes — because a
 * lopsided pair would read as a sales preference rather than a fit assessment.
 * The comparison table below carries no ticks, crosses or scores for the same
 * reason: it lists how each model behaves on seven dimensions and lets the
 * reader match them to their own constraints.
 *
 * **Choreography (docs/06 — every animation earns its place).** The header
 * fades up, the two cards slide in from opposite sides (the split *is* the
 * argument), and inside each card the rail draws top-to-bottom while the phase
 * nodes land against it — a sequence rendered as a sequence. Table rows reveal
 * on their own trigger, so they animate when read rather than while off-screen.
 * `useReducedMotion` collapses every stage to a plain fade; nothing ever stays
 * invisible.
 *
 * **The section ends on the comparison.** No stat strip, no closing CTA: the
 * page already carries a consultation ask in `SecurityAssurance`, and the site
 * footer closes every page with one. The table is the payoff — the reader
 * leaves with the fit criteria, not with a third button.
 */
export function DeliveryModels() {
  const reduce = useReducedMotion();
  const d = (v: number) => (reduce ? 0 : v);

  const fade: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.2 : 0.55, ease: EASE_OUT },
    },
  };

  /** Cards enter from opposite edges: -1 = from the left, 1 = from the right. */
  const card: Variants = {
    hidden: (dir: number) => ({
      opacity: 0,
      x: reduce ? 0 : dir * 56,
      y: reduce ? 0 : 18,
    }),
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: reduce ? 0.2 : 0.7, ease: EASE_OUT },
    },
  };

  const vsMark: Variants = {
    hidden: { opacity: 0, scale: reduce ? 1 : 0.4 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: d(0.45),
        duration: reduce ? 0.2 : 0.5,
        ease: reduce ? EASE_OUT : EASE_POP,
      },
    },
  };

  const badge: Variants = {
    hidden: { opacity: 0, scale: reduce ? 1 : 0.55 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: d(0.35),
        duration: reduce ? 0.2 : 0.45,
        ease: reduce ? EASE_OUT : EASE_POP,
      },
    },
  };

  /** The rail draws downward, so the ladder reads as a direction of travel. */
  const rail: Variants = {
    hidden: { scaleY: reduce ? 1 : 0, opacity: reduce ? 0 : 1 },
    show: {
      scaleY: 1,
      opacity: 1,
      transition: { delay: d(0.3), duration: reduce ? 0.2 : 0.9, ease: EASE_OUT },
    },
  };

  /** Phase nodes land against the rail as it passes them. */
  const step: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : -12 },
    show: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: d(0.4 + i * 0.09),
        duration: reduce ? 0.2 : 0.45,
        ease: EASE_OUT,
      },
    }),
  };

  const tableBody: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.07 } },
  };

  const tableRow: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.2 : 0.45, ease: EASE_OUT },
    },
  };

  return (
    <section className="relative isolate overflow-hidden border-t border-line bg-[linear-gradient(180deg,#fbfbfc_0%,#ffffff_42%,#f7f8fa_100%)] py-16 md:py-24">
      {/* Faint engineering grid, edge-masked so it never draws a hard rectangle
          where the mask stops. Held at ~4% ink — texture, not a second board. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(26,26,26,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.04)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]"
      />
      {/* Two floating accent blooms, one per model, drifting slowly on opposite
          sides — the palette split stated as ambient light before the cards
          state it as content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-32 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(215,52,56,0.10),transparent)] blur-3xl motion-safe:animate-[blob-float_19s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-[46rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(30,131,240,0.09),transparent)] blur-3xl motion-safe:animate-[blob-float_23s_ease-in-out_infinite_reverse]"
      />

      <div className="container-page relative z-10">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Eyebrow>Development methodology</Eyebrow>
          <h2 className="text-balance font-bold tracking-tight text-ink text-[2rem]/[1.15] sm:text-[2.75rem]/[1.1] lg:text-5xl/[1.08]">
            Agile by Default.{" "}
            <span className="text-metal-red">
              Enterprise Governance When Required.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink/65">
            The methodology is chosen per engagement, not applied by habit —
            weighed against project complexity, business goals, the compliance
            regime the sector imposes, and how far the system has to scale.
          </p>
        </motion.div>

        {/* ── The two models ─────────────────────────────────────────────── */}
        {/* `[1fr_auto_1fr]` puts the VS mark in the flow rather than floating it
            over the gap: it becomes a horizontal divider when the cards stack,
            with no overlap to unwind at any breakpoint. */}
        <div className="mt-14 grid gap-6 lg:mt-16 lg:grid-cols-[1fr_auto_1fr] lg:gap-8 xl:gap-10">
          {deliveryModels.map((model, index) => {
            const t = THEME[model.key];
            const Icon = ICONS[model.icon] ?? RefreshCw;
            const CadenceIcon = model.cadence === "loop" ? RotateCcw : Flag;
            /* Card 0 arrives from the left, card 1 from the right. */
            const dir = index === 0 ? -1 : 1;

            return (
              <motion.article
                key={model.key}
                variants={card}
                custom={dir}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
                /* The lift is a gesture prop, not a `hover:-translate-y-*`
                   class. Framer writes `transform: none` inline once the
                   entrance settles at x/y 0, and an inline transform beats a
                   class — so a Tailwind hover-translate on a motion element is
                   dead on arrival. Colour and shadow stay as classes; only the
                   transform has to move here. */
                whileHover={reduce ? undefined : { y: -6 }}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-[20px] border border-white/70 bg-white/70 p-7 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_40px_-20px_rgba(16,24,40,0.18)] backdrop-blur-xl transition-[box-shadow,border-color] duration-[350ms] ease-standard sm:p-9",
                  /* Explicit order at every breakpoint — the VS mark is last in
                     DOM order, so without this it would fall below both cards
                     when they stack rather than sitting between them. */
                  index === 0 ? "order-1" : "order-3",
                  t.hoverRing,
                  t.hoverShadow,
                )}
              >
                {/* Gradient hairline along the top edge — the card's theme,
                    stated once, without tinting the whole surface. */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 top-0 h-1 rounded-b-full",
                    t.accentBar,
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -top-24 right-[-6rem] h-64 w-64 rounded-full blur-2xl",
                    t.glow,
                  )}
                />

                {/* Header — icon, name, badge */}
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <span
                      aria-hidden
                      className={cn(
                        "grid h-16 w-16 shrink-0 place-items-center rounded-2xl ring-1 ring-inset transition-transform duration-[450ms] ease-standard group-hover:-rotate-6 group-hover:scale-110",
                        t.iconWrap,
                      )}
                    >
                      <Icon size={30} strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-bold leading-tight text-ink sm:text-[1.75rem]">
                        {model.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold leading-snug text-ink/65">
                        {model.tagline}
                      </p>
                    </div>
                  </div>
                  <motion.span
                    variants={badge}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1.5 text-[0.625rem] font-bold uppercase leading-none tracking-[0.12em] ring-1 ring-inset",
                      t.badge,
                    )}
                  >
                    {model.badge}
                  </motion.span>
                </div>

                <p className="relative mt-6 text-[0.9375rem] leading-relaxed text-ink/65">
                  {model.description}
                </p>

                {/* Phase ladder — the rail draws down past the nodes as they
                    land, so the order is carried by motion as well as numerals.
                    `top-4 bottom-4` insets it by half a node, so it runs
                    between the first and last node centres, never past them. */}
                <ol className="relative mt-7">
                  <span
                    aria-hidden
                    className="absolute bottom-4 left-4 top-4 -ml-px w-0.5 rounded-full bg-line"
                  />
                  <motion.span
                    aria-hidden
                    variants={rail}
                    style={{ transformOrigin: "top center" }}
                    className={cn(
                      "absolute bottom-4 left-4 top-4 -ml-px w-0.5 rounded-full",
                      t.rail,
                    )}
                  />
                  {model.steps.map((phase, i) => (
                    <motion.li
                      key={phase.name}
                      variants={step}
                      custom={i}
                      className="relative flex gap-4 pb-5 last:pb-0"
                    >
                      <span
                        className={cn(
                          "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border font-display text-[0.625rem] font-bold",
                          t.node,
                          t.nodeShadow,
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="font-display text-sm font-bold leading-snug text-ink">
                          {phase.name}
                        </p>
                        <p className="mt-0.5 text-xs leading-snug text-ink/65">
                          {phase.note}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ol>

                <p className="mt-5 flex items-center gap-2 text-xs font-semibold leading-snug text-ink/65">
                  <CadenceIcon
                    size={13}
                    strokeWidth={2.5}
                    aria-hidden
                    className={cn("shrink-0", t.cadence)}
                  />
                  {model.cadenceNote}
                </p>

                {/* Benefits */}
                <ul className="mt-7 space-y-3 border-t border-line/80 pt-6">
                  {model.benefits.map((benefit) => {
                    const BenefitIcon = ICONS[benefit.icon] ?? ShieldCheck;
                    return (
                      <li
                        key={benefit.text}
                        className="flex items-start gap-3 text-[0.875rem] leading-relaxed text-ink/70"
                      >
                        <BenefitIcon
                          size={16}
                          strokeWidth={2}
                          aria-hidden
                          className={cn("mt-0.5 shrink-0", t.benefitIcon)}
                        />
                        {benefit.text}
                      </li>
                    );
                  })}
                </ul>

                {/* Best suited to — the fit test, in the reader's own terms */}
                <div className="mt-7 border-t border-line/80 pt-6">
                  <p className="text-[0.625rem] font-bold uppercase leading-none tracking-[0.16em] text-ink/65">
                    Best suited to
                  </p>
                  <ul className="mt-3.5 flex flex-wrap gap-2">
                    {model.bestFor.map((fit) => {
                      const FitIcon = ICONS[fit.icon] ?? Globe;
                      return (
                        <li
                          key={fit.label}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold leading-none transition-[transform,border-color] duration-200 ease-standard hover:-translate-y-0.5",
                            t.chip,
                          )}
                        >
                          <FitIcon size={13} strokeWidth={2.2} aria-hidden />
                          {fit.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.article>
            );
          })}

          {/* VS — rendered after the loop but placed between the cards by the
              `order-1 / order-2 / order-3` triplet, which holds at every
              breakpoint. On lg it is the middle grid column; when the cards
              stack it becomes a horizontal divider between them. */}
          <motion.div
            variants={vsMark}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            aria-hidden
            className="order-2 flex items-center justify-center gap-4 lg:flex-col"
          >
            <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,var(--color-line))] lg:h-auto lg:w-px lg:bg-[linear-gradient(180deg,transparent,var(--color-line))]" />
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line bg-white/80 font-display text-[0.6875rem] font-bold tracking-[0.1em] text-ink/65 shadow-[0_6px_18px_-10px_rgba(16,24,40,0.4)] backdrop-blur-sm">
              VS
            </span>
            <span className="h-px flex-1 bg-[linear-gradient(270deg,transparent,var(--color-line))] lg:h-auto lg:w-px lg:bg-[linear-gradient(0deg,transparent,var(--color-line))]" />
          </motion.div>
        </div>

        {/* ── Comparison ─────────────────────────────────────────────────── */}
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 lg:mt-20"
        >
          <h3 className="text-balance text-center font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            How the two compare, dimension by dimension
          </h3>
          <p className="mx-auto mt-3.5 max-w-2xl text-center text-base leading-relaxed text-ink/60">
            No scorecard and no winner — the fit depends on the constraints the
            engagement arrives with.
          </p>

          <div className="mt-9 overflow-hidden rounded-[20px] border border-white/70 bg-white/70 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_40px_-22px_rgba(16,24,40,0.18)] backdrop-blur-xl">
            {/* The table keeps its own horizontal scroll, so seven prose rows at
                a readable size never widen the page (globals.css: html is
                overflow-x: clip, but a section should not depend on that). */}
            {/* Focusable and named: a scroll container a mouse can drag but a
                keyboard cannot reach is unusable without a pointer. */}
            <div
              className="table-scroll overflow-x-auto"
              tabIndex={0}
              role="region"
              aria-label="Agile compared with Waterfall"
            >
              <table className="w-full min-w-[44rem] border-collapse text-left">
                <caption className="sr-only">
                  Agile compared with Waterfall across seven delivery dimensions
                </caption>
                <thead>
                  <tr className="bg-mist/60">
                    <th
                      scope="col"
                      className="w-[22%] px-6 py-4 text-[0.625rem] font-bold uppercase leading-none tracking-[0.16em] text-ink/65"
                    >
                      Dimension
                    </th>
                    <th
                      scope="col"
                      className={cn(
                        "w-[39%] px-6 py-4 font-display text-sm font-bold",
                        THEME.agile.tableHead,
                      )}
                    >
                      <span className="inline-flex items-center gap-2">
                        <RefreshCw size={15} strokeWidth={2.2} aria-hidden />
                        Agile
                      </span>
                    </th>
                    <th
                      scope="col"
                      className={cn(
                        "w-[39%] px-6 py-4 font-display text-sm font-bold",
                        THEME.waterfall.tableHead,
                      )}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Layers size={15} strokeWidth={2.2} aria-hidden />
                        Waterfall
                      </span>
                    </th>
                  </tr>
                </thead>
                {/* Rows reveal on their own trigger rather than inheriting the
                    header's, so a long table animates as it is read instead of
                    finishing while its lower half is still below the fold. */}
                <motion.tbody
                  variants={tableBody}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  {methodologyComparison.map((row) => (
                    <motion.tr
                      key={row.dimension}
                      variants={tableRow}
                      className="border-t border-line/70 transition-colors duration-200 ease-standard hover:bg-mist/50"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 align-top font-display text-sm font-bold leading-snug text-ink"
                      >
                        {row.dimension}
                      </th>
                      <td className="px-6 py-4 align-top text-sm leading-relaxed text-ink/70">
                        {row.agile}
                      </td>
                      <td className="px-6 py-4 align-top text-sm leading-relaxed text-ink/70">
                        {row.waterfall}
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* No proof strip and no CTA band here. The site footer already closes
            every page with "Let's build what your business needs next", and
            `SecurityAssurance` carries the page's consultation CTA mid-page —
            a third ask below the comparison table was one too many. */}
      </div>
    </section>
  );
}
