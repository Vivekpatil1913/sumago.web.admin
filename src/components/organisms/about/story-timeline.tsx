"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Milestone copy for the journey timeline.
 * [REAL ASSET NEEDED] SAMPLE/seed except where marked `verified` — 2019
 * (incorporated as Pvt. Ltd., per CIN) and 2021 (CEO award) are from
 * COMPANY-PROFILE.md. Confirm the others with the client before launch (docs/17).
 */
type Milestone = { year: string; body: string; verified?: boolean };

const MILESTONES: Milestone[] = [
  {
    year: "2015",
    body: "With the first cohort of clients came proof the model worked. Sumago grew its delivery bench and deepened its craft — investing in the disciplines that let a small team ship software far larger than its size.",
  },
  {
    year: "2017",
    body: "As word spread, the work grew more ambitious. New industries — from manufacturing to public services — brought harder problems, and with them the consulting muscle to scope, plan, and de-risk enterprise engagements end to end.",
  },
  {
    year: "2019",
    verified: true,
    body: "Sumago Infotech was formally incorporated as a Private Limited company — a milestone that matched the way it already worked: accountable, structured, and built for the long term.",
  },
  {
    year: "2021",
    verified: true,
    body: "Co-founder & CEO Sonali Gorade was honoured at the Maharashtra State Young Women Entrepreneurs Awards — recognition of a founder-led company scaling on values, not shortcuts.",
  },
  {
    year: "2023",
    body: "The applied-AI practice took shape — machine learning, automation, and cloud-native engineering moving from experiments to production, helping clients turn emerging technology into dependable advantage.",
  },
  {
    year: "2025",
    body: "Today, 700+ projects delivered and a 70+ specialist team across Nashik and Pune — a strategic technology partner enterprises, startups, and governments return to, project after project.",
  },
];

const N = MILESTONES.length;

/** Left-aligned year title + description used by both the pinned and stacked layouts. */
function Panel({ m, index }: { m: Milestone; index: number }) {
  return (
    <div className="container-page grid w-full items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="max-w-xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-ink">
          {String(index + 1).padStart(2, "0")} <span className="text-ink/30">/ {String(N).padStart(2, "0")}</span>
        </p>
        <h3 className="mt-3 font-display text-6xl font-bold leading-none text-metal-red sm:text-7xl">
          {m.year}
        </h3>
        <p className="mt-6 text-lg leading-relaxed text-ink/75">{m.body}</p>
      </div>
      {/* Decorative oversized year — depth on the right. */}
      <div aria-hidden className="hidden justify-end lg:flex">
        <span className="font-display text-[13rem] font-bold leading-none text-ink/[0.04]">
          {m.year}
        </span>
      </div>
    </div>
  );
}

/**
 * Pinned horizontal journey. The tall outer wrapper provides scroll distance;
 * the inner viewport sticks and the year panels translate left as you scroll —
 * so the page "holds" until the timeline finishes, then releases. Under
 * reduced-motion (or no JS hydration), it degrades to a simple vertical stack.
 */
export function StoryTimeline() {
  const reduce = useReducedMotion();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Slide the track from the first panel to the last (n panels × 100vw).
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(N - 1) * 100}vw`]);

  if (reduce) {
    return (
      <section className="py-16 md:py-22">
        <div className="container-page">
          <p className="text-center text-sm font-bold uppercase tracking-[0.22em] text-brand-ink">
            The journey so far
          </p>
          <ol className="mx-auto mt-12 max-w-2xl space-y-14 border-l border-line pl-8">
            {MILESTONES.map((m) => (
              <li key={m.year} className="relative">
                <span className="absolute -left-[35px] top-2 h-3 w-3 rounded-full bg-brand ring-4 ring-paper" />
                <h3 className="font-display text-4xl font-bold text-metal-red">{m.year}</h3>
                <p className="mt-3 text-lg leading-relaxed text-ink/75">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section ref={targetRef} style={{ height: `${N * 90}vh` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* Pinned header */}
        <div className="container-page pt-[clamp(5rem,12vh,8rem)]">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-ink">
            The journey so far
          </p>
          <p className="mt-1 text-sm text-ink/50">
            Keep scrolling — a decade of milestones, side to side.
          </p>
        </div>

        {/* Horizontal track */}
        <motion.div style={{ x }} className="flex flex-1 items-center will-change-transform">
          {MILESTONES.map((m, i) => (
            <article key={m.year} className="flex h-full w-screen shrink-0 items-center">
              <Panel m={m} index={i} />
            </article>
          ))}
        </motion.div>

        {/* Progress rail */}
        <div className="container-page pb-[clamp(2rem,6vh,4rem)]">
          <div className="h-1 overflow-hidden rounded-full bg-line">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-full origin-left rounded-full bg-brand"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
