"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardList,
  Code2,
  Phone,
  PhoneCall,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";

import { Button } from "@/components/atoms/button";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { engagementPath } from "@/lib/content";
import { company } from "@/lib/site";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  PhoneCall,
  Users,
  ClipboardList,
  Code2,
  TrendingUp,
};

/** Standard entrance curve (docs/06) — decelerating, no overshoot. */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * "A Clear Path From First Conversation to Live System" — the engagement runway
 * on /contact, between `WhySumago` and `ScheduleMeeting`.
 *
 * **Why here.** `WhySumago` above establishes that Sumago can do the work;
 * `ScheduleMeeting` below asks for the reader's details. The objection standing
 * between the two is procedural, not emotional — *what am I actually committing
 * to if I fill this in?* Five dated milestones ending in a 30-minute call is
 * the answer, and it turns the form from a leap into a first step.
 *
 * **Why a vertical journey, not another horizontal timeline.** Three reasons.
 * (1) The site already spends its horizontal-timeline budget: `ProcessSection`
 * runs the nine-stage lifecycle as a road on both `/` and `/solutions`, and a
 * second one here would read as the same component with different words. (2) A
 * horizontal track caps every step at a column's width, so five descriptions
 * become five fragments; the vertical rail gives each milestone a full-width
 * card and lets the copy breathe. (3) Vertical maps onto the scroll, which is
 * what makes the progress fill possible — and the fill is the whole idea.
 *
 * **The fill is the argument.** The rail draws itself as the reader descends,
 * and the milestone they are level with lights up. Scrolling the section *is*
 * walking the engagement: the reader experiences a process that advances
 * predictably and never stalls, which is precisely the claim the copy makes.
 * That is an animation earning its place (docs/06) rather than decorating a
 * list.
 *
 * **Degradation.** `useReducedMotion` drops the spring (the fill tracks scroll
 * directly, with no trailing easing), stops the active node's pulse, and
 * collapses the card entrances to fades. Content is never held invisible. Below
 * `sm` the rail stays — a vertical timeline is already the mobile-native shape,
 * so the phone layout is the same idea at a tighter gauge, not a broken desktop
 * one.
 */
export function EngagementPath() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  /* The rail fills across the reader's descent through the list. The offsets
     start the fill once the first milestone is comfortably in view and finish
     it as the last one settles — so the line is never already full on arrival,
     and never still short after the final card has been read. */
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 72%", "end 62%"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    mass: 0.35,
  });
  /* Both hooks always run (rules of hooks); reduced motion just takes the raw
     value, so the rail still reflects position without the smoothing. */
  const fill = reduce ? scrollYProgress : smooth;

  /* Rounded, not floored, and scaled over the gaps rather than the nodes: with
     five nodes there are four gaps, so progress 0 lands on node 1 and progress
     1 on node 5. Flooring by node count would leave the last node unreachable
     until the very end of the range. */
  useMotionValueEvent(fill, "change", (value) => {
    const segments = Math.max(1, engagementPath.length - 1);
    const index = Math.min(segments, Math.max(0, Math.round(value * segments)));
    setActive(index);
  });

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
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.2 : 0.55, ease: EASE_OUT },
    },
  };

  /* Milestones reveal individually rather than as one staggered block: at five
     items the list is taller than the viewport, so a single trigger would fire
     the last two while they were still below the fold. */
  const milestone: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : 22 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: reduce ? 0.2 : 0.5, ease: EASE_OUT },
    },
  };

  return (
    <section
      aria-labelledby="engagement-path-heading"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7f7f9_50%,#ffffff_100%)] py-16 md:py-24"
    >
      {/* Decoration. Light on purpose — this band sits between two dark
          sections (`WhySumago` above, `ScheduleMeeting` below), so its job is
          to be the clear, unhurried breath between them. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(26,26,26,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.04)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(115%_70%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 h-[24rem] w-[50rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(215,52,56,0.08),transparent)] blur-2xl"
      />

      <div className="container-page relative z-10">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <motion.div
          variants={stage}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={item}>
            <Eyebrow>Getting started</Eyebrow>
          </motion.div>
          <motion.h2
            variants={item}
            id="engagement-path-heading"
            className="text-balance font-bold tracking-tight text-ink text-[2rem]/[1.15] sm:text-[2.75rem]/[1.1] lg:text-5xl/[1.08]"
          >
            A Clear Path From First Conversation to{" "}
            <span className="text-metal-red">Live System</span>
          </motion.h2>
          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink/65"
          >
            A low-commitment start — most engagements move from first discussion
            to a working plan within weeks.
          </motion.p>
        </motion.div>

        {/* ── The journey ──────────────────────────────────────────────────── */}
        <ol ref={trackRef} className="relative mx-auto mt-14 max-w-4xl lg:mt-16">
          {engagementPath.map((step, i) => (
            <Milestone
              key={step.title}
              step={step}
              index={i}
              total={engagementPath.length}
              progress={fill}
              active={active}
              reduce={!!reduce}
              variants={milestone}
            />
          ))}
        </ol>

        {/* ── Closing callout ──────────────────────────────────────────────── */}
        <motion.div
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="mx-auto mt-12 max-w-4xl lg:mt-14"
        >
          <div className="relative overflow-hidden rounded-[28px] border border-line bg-[linear-gradient(120deg,#fff6f6_0%,rgba(255,255,255,0.85)_45%,#fff5f5_100%)] shadow-[0_12px_40px_rgba(26,26,26,0.08)] backdrop-blur-xl">
            {/* The accent edge that replaced the original solid dark bar. Same
                emphasis, a fraction of the ink — and it keeps the reader's
                contrast budget for the form directly below. */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-1.5 bg-[linear-gradient(180deg,#e0474b,#b82a2e)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(215,52,56,0.14),transparent)] blur-2xl"
            />

            <div className="relative flex flex-col gap-8 px-6 py-8 pl-8 sm:px-10 sm:py-10 sm:pl-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="flex items-start gap-4 sm:gap-5">
                <span
                  aria-hidden
                  className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(140deg,#e0474b,#b82a2e)] text-white shadow-[0_10px_26px_-12px_rgba(215,52,56,0.85)] sm:grid"
                >
                  <ArrowUpRight size={24} strokeWidth={2.2} />
                </span>
                <p className="max-w-xl text-base leading-[1.7] text-ink/70 sm:text-lg">
                  <span className="font-bold text-brand-ink">Next step:</span>{" "}
                  a 30-minute discovery call — no commitment, no cost. Bring the
                  problem; we will bring the approach.
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
                <Button href="#schedule" size="lg" className="whitespace-nowrap">
                  Book the discovery call
                  <ArrowRight size={17} strokeWidth={2.5} aria-hidden />
                </Button>
                <a
                  href={`tel:${company.expertLine.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-2 py-2 text-sm font-semibold text-ink/70 underline-offset-4 transition-colors duration-200 hover:text-brand-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  <Phone size={16} strokeWidth={2.4} aria-hidden />
                  Talk with an expert
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type MilestoneProps = {
  step: (typeof engagementPath)[number];
  index: number;
  total: number;
  /** Whole-journey scroll progress, 0 → 1 across the list. */
  progress: MotionValue<number>;
  /** Index of the milestone the reader is currently level with. */
  active: number;
  reduce: boolean;
  variants: Variants;
};

/**
 * One milestone: node, ordinal, card — and the rail segment running from this
 * node down to the next.
 *
 * **Why the rail is per-segment rather than one span over the whole list.** A
 * single absolutely-positioned rail has to be inset from the bottom by the last
 * card's height to stop at the last node's centre, and that height is not known
 * at author time — it moves with the copy, the breakpoint and the font. Any
 * fixed inset either leaves a stub hanging past the final node or stops short
 * of it. A segment per item is exact by construction: it starts at this node's
 * bottom edge and ends at `bottom-0`, which is the padding-box floor and so
 * precisely the next node's top, at every width and any card height. The last
 * item renders no segment, so the rail terminates on the final node by
 * definition.
 *
 * Each segment owns its slice of the journey's progress (`useTransform`, with
 * `clamp` so it holds at full once passed), which is why this is a component
 * and not an inline map — hooks in a loop are not legal, and the alternative
 * (one `scaleY` over a single rail) is the geometry problem above.
 */
function Milestone({
  step,
  index,
  total,
  progress,
  active,
  reduce,
  variants,
}: MilestoneProps) {
  const Icon = ICONS[step.icon] ?? PhoneCall;
  const isActive = index === active;
  const isPast = index < active;
  const isLast = index === total - 1;

  /* `total - 1` gaps between `total` nodes; guarded so a one-item journey can
     never divide by zero. */
  const segments = Math.max(1, total - 1);
  const segFill = useTransform(
    progress,
    [index / segments, (index + 1) / segments],
    [0, 1],
    { clamp: true },
  );

  return (
    <motion.li
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className={cn(
        "relative grid grid-cols-[3.5rem_1fr] gap-x-5 sm:grid-cols-[4rem_1fr] sm:gap-x-8",
        !isLast && "pb-6 sm:pb-8",
      )}
    >
      {/* ── Rail segment ─────────────────────────────────────────────────────
          `left` = the node's centre (half of 3.5rem / 4rem) minus half the 2px
          rule. `top` = the node's full height, so the rule begins where the
          circle ends and never draws behind it. */}
      {!isLast ? (
        <>
          <span
            aria-hidden
            className="absolute bottom-0 left-[1.6875rem] top-14 w-[2px] rounded-full bg-line sm:left-[1.9375rem] sm:top-16"
          />
          <motion.span
            aria-hidden
            style={{ scaleY: segFill }}
            className="absolute bottom-0 left-[1.6875rem] top-14 w-[2px] origin-top rounded-full bg-[linear-gradient(180deg,#d73438,rgba(215,52,56,0.55))] sm:left-[1.9375rem] sm:top-16"
          />
        </>
      ) : null}

      {/* ── Node ─────────────────────────────────────────────────────────── */}
      <div className="relative">
        <span
          aria-hidden
          className={cn(
            "relative grid h-14 w-14 place-items-center rounded-full border-2 transition-[background-color,border-color,color,box-shadow] duration-500 ease-standard sm:h-16 sm:w-16",
            isActive &&
              "border-brand bg-[linear-gradient(140deg,#e0474b,#b82a2e)] text-white shadow-[0_12px_32px_-10px_rgba(215,52,56,0.8)]",
            isPast && "border-brand/35 bg-brand/10 text-brand-ink",
            !isActive && !isPast && "border-line bg-white text-ink/35",
          )}
        >
          {/* Pulse — only on the milestone the reader is level with, and never
              under reduced motion. One at a time, so it reads as a position
              marker rather than as noise. */}
          {isActive && !reduce ? (
            <motion.span
              className="absolute inset-0 rounded-full bg-brand/35"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeOut" }}
            />
          ) : null}
          <Icon
            size={24}
            strokeWidth={1.9}
            className="relative z-10 sm:h-[26px] sm:w-[26px]"
          />
        </span>

        {/* Step number — the ordinal, in ink so it never competes with the red
            state colour on the node itself. */}
        <span
          aria-hidden
          className="absolute -bottom-0.5 -right-0.5 grid h-6 w-6 place-items-center rounded-full bg-ink text-[0.6875rem] font-bold leading-none text-white ring-2 ring-white sm:h-7 sm:w-7 sm:text-xs"
        >
          {index + 1}
        </span>
      </div>

      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "group relative -mt-1 overflow-hidden rounded-3xl border bg-white p-5 shadow-[0_1px_2px_rgba(26,26,26,0.03),0_12px_40px_-26px_rgba(26,26,26,0.2)] transition-[transform,box-shadow,border-color] duration-[400ms] ease-standard hover:-translate-y-2 hover:border-brand/35 hover:shadow-[0_2px_4px_rgba(26,26,26,0.04),0_28px_56px_-24px_rgba(215,52,56,0.3)] sm:p-7",
          isActive ? "border-brand/30" : "border-line",
        )}
      >
        {/* Left edge lights up on the active milestone — the card's half of the
            rail, so node and card read as one unit. */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 left-0 w-1 bg-[linear-gradient(180deg,#d73438,rgba(215,52,56,0.25))] transition-opacity duration-500 ease-standard",
            isActive ? "opacity-100" : "opacity-0",
          )}
        />

        <span
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-[0.6875rem] font-bold uppercase leading-none tracking-[0.14em] transition-colors duration-500 ease-standard",
            isActive
              ? "border-brand/30 bg-brand/[0.07] text-brand-ink"
              : "border-line bg-mist text-ink/55",
          )}
        >
          {step.week}
        </span>

        <h3 className="mt-4 font-display text-xl font-bold leading-snug tracking-tight text-ink sm:text-[1.375rem]">
          {step.title}
        </h3>
        <p className="mt-2.5 max-w-xl text-base leading-[1.7] text-ink/65">
          {step.description}
        </p>
      </div>
    </motion.li>
  );
}
