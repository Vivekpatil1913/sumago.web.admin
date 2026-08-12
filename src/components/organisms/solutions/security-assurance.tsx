"use client";

import {
  Activity,
  ArrowRight,
  FileCheck,
  HardDrive,
  Lock,
  RefreshCw,
  Scale,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { Button } from "@/components/atoms/button";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Stat } from "@/components/molecules/stat";
import { securityAssuranceStats, securityPillars } from "@/lib/content";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  Lock,
  UserCheck,
  Activity,
  FileCheck,
  HardDrive,
};

/** Stage markers on the timeline — deliberately distinct from the control icons
 *  below, so the rail reads as three phases rather than a preview of the grid. */
const STAGE_ICONS: LucideIcon[] = [ShieldCheck, RefreshCw, Scale];

/** Standard entrance curve (docs/06) — decelerating, no overshoot. */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
/** A single, small overshoot reserved for the three timeline nodes landing. */
const EASE_POP = [0.34, 1.36, 0.64, 1] as const;

/**
 * Enterprise security & compliance — the disqualifier check.
 *
 * This is rarely why an enterprise picks a vendor, but it is routinely why one
 * gets dropped, so it sits immediately after `ArchitectureBlueprint`: the stack
 * provokes the question ("good architecture — is it safe?") and this answers it
 * before the reader moves on to `WhyPartner`.
 *
 * **The shape: say the sequence once, then show the evidence as peers.**
 * Earlier passes nested the six controls inside three stage containers, which
 * made every control a third-level element — you had to decode a hierarchy
 * before you could read a single fact. The animated timeline now carries the
 * whole "security spans the lifecycle" argument on its own, and the grid below
 * is six equal cards, three across, each sitting in the column its stage owns.
 *
 * **Choreography (docs/06 — every animation earns its place).** The rail fills
 * left to right, the three nodes pop in behind it, and only then do the cards
 * stagger up. That order is the argument in motion: the lifecycle exists first,
 * the controls hang off it. One parent orchestrates all of it via variant
 * propagation, so the sequence holds no matter where the section is entered
 * from, and `useReducedMotion` collapses every stage to a plain fade.
 *
 * **[VERIFY] — the claims that are *not* here are deliberate.** No "99.99%
 * uptime" (an SLA nothing supports), no "SOC 2" (an audited attestation Sumago
 * does not hold), no "24×7 monitoring" (implies a staffed SOC). See
 * `securityAssuranceStats`. On a page read by regulated buyers, an unverifiable
 * badge is worse than a missing one — it is the thing procurement checks.
 */
export function SecurityAssurance() {
  const reduce = useReducedMotion();

  /**
   * Flattened row-major, so row 1 is each stage's first control and row 2 its
   * second — that is what keeps every card in the column its stage owns on the
   * timeline above. `flatMap` over a possibly-absent control rather than an
   * index guard, so an uneven stage would drop a cell instead of crashing.
   */
  const rowCount = Math.max(...securityPillars.map((p) => p.controls.length));
  const cells = Array.from({ length: rowCount }).flatMap((_, row) =>
    securityPillars.flatMap((pillar) => {
      const control = pillar.controls[row];
      return control ? [{ control, stage: pillar.stage }] : [];
    }),
  );

  /* Reduced motion keeps the reveal (content must never stay invisible) but
     drops every transform and collapses the timing to a single quick fade. */
  const rail: Variants = {
    hidden: { scaleX: reduce ? 1 : 0, opacity: reduce ? 0 : 1 },
    show: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: reduce ? 0.2 : 1.1, ease: EASE_OUT },
    },
  };

  const node: Variants = {
    hidden: { scale: reduce ? 1 : 0.35, opacity: 0 },
    show: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: reduce ? 0 : 0.3 + i * 0.3,
        duration: reduce ? 0.2 : 0.55,
        ease: reduce ? EASE_OUT : EASE_POP,
      },
    }),
  };

  const grid: Variants = {
    hidden: {},
    show: {
      transition: {
        /* The rail (1.1s) plus the last node landing — cards start after the
           lifecycle has finished drawing itself, never during. */
        delayChildren: reduce ? 0 : 1.15,
        staggerChildren: reduce ? 0 : 0.08,
      },
    },
  };

  const card: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.2 : 0.5, ease: EASE_OUT },
    },
  };

  const tail: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.2 : 0.55, ease: EASE_OUT },
    },
  };

  return (
    <section className="relative isolate overflow-hidden border-t border-line bg-[linear-gradient(180deg,#fafafa_0%,#ffffff_55%,#fafafa_100%)] py-16 md:py-24">
      {/* Faint engineering grid. Held at ~2% ink and masked to fade at the top
          and bottom edges, so it never competes with the drafting-paper grid on
          `ArchitectureBlueprint` directly above — texture, not a second board. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(26,26,26,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.045)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]"
      />
      {/* One soft brand bloom behind the timeline, so the rail has something to
          sit on and the band reads as lit rather than flat. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-[26rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(215,52,56,0.07),transparent)] blur-2xl"
      />

      <div className="container-page relative z-10">
        {/* One orchestrator for header → timeline → cards, so the rail always
            draws before the cards stagger regardless of scroll speed. The strip
            and CTA below are deliberately *outside* it: inheriting this trigger
            would fade them in while they were still off-screen. */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <motion.div variants={tail} className="mx-auto max-w-3xl text-center">
            <Eyebrow>Enterprise security &amp; compliance</Eyebrow>
            <h2 className="text-balance font-bold tracking-tight text-ink text-[2rem]/[1.15] sm:text-[2.75rem]/[1.1] lg:text-5xl/[1.08]">
              Security built in —{" "}
              <span className="text-metal-red">not bolted on at the end.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink/65">
              Security is engineered through every phase of the development
              lifecycle — decided in the architecture, held through daily
              operations, and evidenced when an auditor asks. Not a hardening
              pass bolted on after UAT.
            </p>
          </motion.div>

          {/* ── Timeline ───────────────────────────────────────────────────── */}
          <div className="relative mx-auto mt-14 max-w-4xl lg:mt-16">
            {/* Track and fill are inset by exactly one sixth at each end: three
              equal columns put the outer node centres at 1/6 and 5/6. */}
            <span
              aria-hidden
              className="absolute left-[16.6667%] right-[16.6667%] top-6 h-[2px] rounded-full bg-line sm:top-7"
            />
            <motion.span
              aria-hidden
              variants={rail}
              style={{ transformOrigin: "left center" }}
              className="absolute left-[16.6667%] right-[16.6667%] top-6 h-[2px] rounded-full bg-gradient-to-r from-brand via-brand to-brand/45 sm:top-7"
            />

            <ol className="relative grid grid-cols-3 gap-x-2 sm:gap-x-6">
              {securityPillars.map((pillar, i) => {
                const StageIcon = STAGE_ICONS[i] ?? ShieldCheck;
                return (
                  <li
                    key={pillar.key}
                    className="flex flex-col items-center text-center"
                  >
                    <motion.span
                      variants={node}
                      custom={i}
                      aria-hidden
                      className="grid h-12 w-12 place-items-center rounded-full border border-brand/25 bg-white/80 text-brand shadow-[0_6px_20px_-8px_rgba(215,52,56,0.45)] backdrop-blur-sm sm:h-14 sm:w-14"
                    >
                      <StageIcon size={22} strokeWidth={2} />
                    </motion.span>
                    <motion.div variants={node} custom={i}>
                      <p className="mt-4 text-[0.625rem] font-bold uppercase leading-none tracking-[0.18em] text-brand">
                        Stage {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 text-balance font-display text-sm font-bold leading-tight text-ink sm:text-lg">
                        {pillar.stage}
                      </h3>
                      <p className="mx-auto mt-1.5 hidden max-w-[15rem] text-sm leading-snug text-ink/65 sm:block">
                        {pillar.when}
                      </p>
                    </motion.div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* ── Controls ───────────────────────────────────────────────────── */}
          <motion.ul
            variants={grid}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6"
          >
            {cells.map(({ control, stage }) => {
              const Icon = ICONS[control.icon] ?? ShieldCheck;
              return (
                <motion.li
                  key={control.title}
                  variants={card}
                  className="group relative flex flex-col rounded-[20px] border border-white/70 bg-white/70 p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_10px_30px_-16px_rgba(16,24,40,0.16)] backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-[350ms] ease-standard hover:-translate-y-1.5 hover:border-brand/35 hover:shadow-[0_2px_4px_rgba(16,24,40,0.04),0_28px_50px_-20px_rgba(215,52,56,0.28)] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      aria-hidden
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(140deg,rgba(215,52,56,0.14),rgba(215,52,56,0.05))] text-brand-ink ring-1 ring-inset ring-brand/12 transition-transform duration-[350ms] ease-standard group-hover:-rotate-6 group-hover:scale-110"
                    >
                      <Icon size={26} strokeWidth={1.9} />
                    </span>
                    {/* Stage tag — what keeps a card in row two, or a stacked
                      card on a phone, attached to its stage on the timeline.
                      Name only, no numeral: the six cards are two controls per
                      stage, so a repeated "01 / 02 / 03" down the second row
                      read as a broken six-step sequence rather than as two
                      cards sharing one stage. The stage name repeats happily —
                      it is a category label, which is what this is. */}
                    <span className="mt-1.5 text-right text-[0.625rem] font-bold uppercase leading-tight tracking-[0.16em] text-ink/65">
                      {stage}
                    </span>
                  </div>

                  <h4 className="mt-5 font-display text-lg font-bold leading-snug text-ink">
                    {control.title}
                  </h4>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink/65">
                    {control.description}
                  </p>

                  {/* The checkable part — what a security reviewer scans for,
                      and now the card's closing element. `mt-auto` pins it to
                      the card floor so the badge blocks line up across a row
                      however long each description runs. */}
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
                    {control.specifics.map((spec) => (
                      <li
                        key={spec}
                        className="rounded-md border border-line bg-white/70 px-2.5 py-1 text-xs font-semibold leading-none text-ink/70 transition-[transform,color,border-color] duration-200 ease-standard hover:-translate-y-0.5 hover:border-brand/35 hover:text-brand-ink"
                      >
                        {spec}
                      </li>
                    ))}
                  </ul>
                </motion.li>
              );
            })}
          </motion.ul>
        </motion.div>

        {/* ── Assurance strip ────────────────────────────────────────────── */}
        <motion.div
          variants={tail}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="mt-12 rounded-[20px] border border-white/70 bg-white/65 px-4 py-8 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_10px_30px_-18px_rgba(16,24,40,0.18)] backdrop-blur-xl sm:px-8 lg:mt-16"
        >
          <ul className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {securityAssuranceStats.map((s, i) => (
              /* Hairline separators only between items sharing a row, so the
                 strip never trails a dangling rule at a wrap point — the rule
                 has to be recomputed per breakpoint because the column count
                 changes (2 → 3 → 5). */
              <li
                key={s.value + s.label}
                className={cn(
                  "px-2 sm:px-4",
                  i % 2 !== 0 && "border-l border-line",
                  i % 3 === 0 ? "sm:border-l-0" : "sm:border-l sm:border-line",
                  i % 5 === 0 ? "lg:border-l-0" : "lg:border-l lg:border-line",
                )}
              >
                <Stat size="sm" value={s.value} label={s.label} />
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <motion.div
          variants={tail}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="mx-auto mt-14 max-w-2xl text-center lg:mt-16"
        >
          <h3 className="text-balance font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Ready to build secure enterprise software?
          </h3>
          <p className="mx-auto mt-3.5 max-w-xl text-base leading-relaxed text-ink/65">
            Bring the security and compliance requirements your sector imposes —
            the architecture conversation starts there, not after the build.
          </p>
          <Button href="/contact" size="lg" className="mt-7">
            Schedule a consultation
            <ArrowRight size={17} strokeWidth={2.5} aria-hidden />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
