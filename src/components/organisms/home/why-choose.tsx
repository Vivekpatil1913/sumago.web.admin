"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";

import { Eyebrow } from "@/components/atoms/eyebrow";
import { WhyChooseBackdrop } from "@/components/organisms/home/why-choose-backdrop";
import { sumagoPromise, whyChooseHeadline } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Standard entrance curve (docs/06) — decelerating, no overshoot. */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * "Trusted by Government. Chosen by Enterprises. Built for India's Digital
 * Future." — the homepage's enterprise band, between `IndustriesSection` and
 * `ProcessSection`.
 *
 * **Why it is dark, and why navy.** The band sits between two light sections,
 * so going dark is what gives it the weight the argument needs — it reads as a
 * deliberate stop rather than one more scroll. Navy specifically, because the
 * site's other dark surface (`bg-blueprint`, on `CapabilitiesSection` two
 * sections above) is a warm near-black lit red. Two dark bands in the same
 * viewport-run must not read as the same band scrolled twice; the cooler navy
 * and the blue accent at the lower right separate them at a glance.
 *
 * **What is deliberately absent, and where it already lives.** The brief asked
 * for a delivery timeline, an industry ribbon and a KPI/trust block. Three of
 * those already exist within one screen of here and would have read as the same
 * component twice:
 *
 * | Asked for            | Already on this page                              |
 * | -------------------- | ------------------------------------------------- |
 * | Discovery → AMC path | `ProcessSection` — the very next section           |
 * | Industry ribbon      | `IndustriesSection` — the section directly above   |
 * | Client-logo proof    | `TrustIndicators` — further down `/`               |
 * | KPI figures          | `TrustIndicators` — same General Settings metrics  |
 *
 * The band is now headline → promise: the argument stated, then signed. The
 * numbers it used to repeat are printed once, further down the page.
 *
 * **Motion budget (docs/06 + the docs/14 release gate).** This page already
 * carries a Three.js hero and an 800vh pinned track, so the band buys nothing
 * that costs layout or paint. Every looping animation is transform/opacity
 * only: two light beams, a drifting dot field, ten particles. Scroll-triggered
 * work is one-shot (`once: true`). `useReducedMotion` drops the entrance
 * transforms and `motion-safe:` gates every ambient loop at the class level.
 *
 * **Assets.** Nothing here is a stock image (docs/02). The world map is drawn
 * from generated coastline geometry and the network graphic is SVG — see
 * `WhyChooseBackdrop`, which owns the whole nine-layer canvas so this file can
 * stay about the argument rather than the atmosphere.
 */
export function WhyChoose() {
  const reduce = useReducedMotion();

  /* Pointer parallax. Raw values are written only from `trackPointer` below,
     which no-ops under reduced motion and for non-mouse pointers — so the
     backdrop needs no conditionals of its own, and a touch device simply gets a
     still background rather than one that lurches on tap. */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  /* Heavily damped and deliberately slow: parallax that tracks the cursor
     exactly feels twitchy, and this is a band that has to read as composed. */
  const px = useSpring(rawX, { stiffness: 42, damping: 22, mass: 0.7 });
  const py = useSpring(rawY, { stiffness: 42, damping: 22, mass: 0.7 });

  function trackPointer(event: React.PointerEvent<HTMLElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    rawX.set((event.clientX - box.left) / box.width - 0.5);
    rawY.set((event.clientY - box.top) / box.height - 0.5);
  }

  /* Ease back to centre when the cursor leaves, so the band never sits frozen
     at whatever offset the pointer happened to exit on. */
  function releasePointer() {
    rawX.set(0);
    rawY.set(0);
  }

  const stage: Variants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: reduce ? 0 : 0.08,
        staggerChildren: reduce ? 0 : 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.2 : 0.6, ease: EASE_OUT },
    },
  };

  /* Headline lines clip up from behind their own baseline — the one place in
     the band where motion is allowed to be theatrical, because it is the
     first thing read and it only ever plays once. */
  const line: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : "0.6em" },
    show: {
      opacity: 1,
      y: "0em",
      transition: { duration: reduce ? 0.2 : 0.7, ease: EASE_OUT },
    },
  };

  return (
    <section
      aria-labelledby="why-choose-heading"
      onPointerMove={trackPointer}
      onPointerLeave={releasePointer}
      /* Deep navy → slate → deep navy. The mid-stop being *lighter* than both
         ends is what makes the band read as lit from within rather than as a
         flat panel; the two radial washes at the top and lower-right are the
         base coat under the backdrop's own corner lighting. */
      className="relative isolate overflow-hidden bg-[radial-gradient(58%_46%_at_50%_-8%,rgba(215,52,56,0.16),transparent_62%),radial-gradient(46%_44%_at_100%_104%,rgba(30,131,240,0.12),transparent_60%),linear-gradient(180deg,#071326_0%,#101828_50%,#071326_100%)] py-20 text-white md:py-28"
    >
      <WhyChooseBackdrop px={px} py={py} />

      <motion.div
        variants={stage}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="container-page relative z-10"
      >
        {/* ── Headline ─────────────────────────────────────────────────────── */}
        <motion.div variants={item} className="mx-auto max-w-4xl text-center">
          <Eyebrow className="text-brand-bright">The case for Sumago</Eyebrow>
        </motion.div>

        <h2
          id="why-choose-heading"
          className="mx-auto mt-1 max-w-4xl text-center font-bold tracking-tight text-[2rem]/[1.2] sm:text-[2.75rem]/[1.14] lg:text-[3.5rem]/[1.08]"
        >
          {whyChooseHeadline.map((text, i) => (
            /* Each line is clipped by its own block so the reveal reads as type
               rising off a baseline rather than a box sliding in. */
            <span key={text} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                variants={line}
                className={cn(
                  "block",
                  i === whyChooseHeadline.length - 1
                    ? "text-metal-red-shine"
                    : "text-white",
                )}
              >
                {text}
              </motion.span>
            </span>
          ))}
        </h2>

        {/* ── Why clients stay ─────────────────────────────────────────────── */}
        <motion.div variants={item} className="mt-12 lg:mt-16">
          <StayPanel reduce={!!reduce} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ══ Why clients stay ══════════════════════════════════════════════════════ */

/**
 * The closing panel — the promise, signed, with the commitments as a checklist
 * whose ticks draw themselves in.
 *
 * This is one panel rather than the two the brief described (a promise card
 * *and* a separate "why clients stay" section). Both were carrying the same
 * four commitments; splitting them would have put the identical argument on
 * screen twice, twenty pixels apart. The heading is the brief's, the content is
 * the promise, and the shield graphic gives it the anchor the brief wanted from
 * an illustration — drawn in SVG, since the site ships no stock artwork.
 */
function StayPanel({ reduce }: { reduce: boolean }) {
  const list: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
  };

  const row: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : -14 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: reduce ? 0.2 : 0.45, ease: EASE_OUT },
    },
  };

  /* The tick draws itself. Under reduced motion it is simply present. */
  const tick: Variants = {
    hidden: { pathLength: reduce ? 1 : 0 },
    show: {
      pathLength: 1,
      transition: { duration: reduce ? 0 : 0.45, ease: EASE_OUT },
    },
  };

  return (
    <div className="rounded-[29px] bg-[linear-gradient(135deg,rgba(255,90,93,0.5),rgba(255,255,255,0.06)_38%,rgba(30,131,240,0.25))] p-px shadow-[0_30px_80px_-36px_rgba(0,0,0,0.95)]">
      <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(155deg,rgba(18,26,44,0.92),rgba(10,15,28,0.96))] px-6 py-10 backdrop-blur-xl sm:px-10 sm:py-12 lg:px-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(215,52,56,0.22),transparent)] blur-2xl"
        />

        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Left — the claim, signed. */}
          <div>
            <h3 className="text-balance font-display text-[1.75rem]/[1.2] font-bold tracking-tight text-white sm:text-[2.25rem]/[1.14]">
              Why Clients{" "}
              <span className="text-metal-red-shine">Stay With Us</span>
            </h3>

            <Eyebrow className="mb-0 mt-7 text-brand-bright">
              {sumagoPromise.eyebrow}
            </Eyebrow>
            <p className="mt-4 max-w-xl text-lg leading-[1.6] text-white/80 sm:text-xl">
              {sumagoPromise.statement}
            </p>

            {/* The wordmark on a raised chip — it signs the promise rather than
                decorating it. */}
            <span className="mt-8 inline-flex items-center rounded-2xl border border-white/12 bg-white px-4 py-3 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.9)]">
              <Image
                src="/sumago-logo.png"
                alt="Sumago Infotech Pvt. Ltd."
                width={185}
                height={21}
                className="h-[21px] w-auto"
              />
            </span>
          </div>

          {/* Right — shield over a network, then the checklist. */}
          <div>
            <div className="relative mx-auto mb-8 hidden h-32 w-full max-w-sm lg:block">
              <svg
                aria-hidden
                viewBox="0 0 320 128"
                className="h-full w-full"
                fill="none"
              >
                {/* Network: nodes wired back to a central shield. */}
                <g stroke="rgba(255,255,255,0.18)" strokeWidth="1">
                  <path d="M160 64 L64 28M160 64 L48 92M160 64 L256 28M160 64 L272 96M160 64 L96 64M160 64 L232 64" />
                </g>
                <g fill="rgba(255,90,93,0.75)">
                  <circle cx="64" cy="28" r="3" />
                  <circle cx="48" cy="92" r="3" />
                  <circle cx="256" cy="28" r="3" />
                  <circle cx="272" cy="96" r="3" />
                </g>
                <g fill="rgba(120,180,255,0.7)">
                  <circle cx="96" cy="64" r="2.5" />
                  <circle cx="232" cy="64" r="2.5" />
                </g>
                <path
                  d="M160 34 L186 44 V68 C186 84 174 94 160 100 C146 94 134 84 134 68 V44 Z"
                  fill="rgba(215,52,56,0.16)"
                  stroke="rgba(255,90,93,0.85)"
                  strokeWidth="1.5"
                />
                <path
                  d="M150 66 l7 8 14 -16"
                  stroke="#ff5a5d"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <motion.ul
              variants={list}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="space-y-4"
            >
              {sumagoPromise.bullets.map((bullet) => (
                <motion.li
                  key={bullet}
                  variants={row}
                  className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3.5 transition-colors duration-300 ease-standard hover:border-brand-bright/35 hover:bg-white/[0.07]"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/20 ring-1 ring-inset ring-brand-bright/40"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
                      <motion.path
                        d="M5 12.5 L10 17.5 L19 7"
                        stroke="#ff5a5d"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={tick}
                      />
                    </svg>
                  </span>
                  <span className="text-base leading-[1.6] text-white/80">
                    {bullet}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </div>
  );
}
