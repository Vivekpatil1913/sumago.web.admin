"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

import { cn } from "@/lib/utils";

export type SequenceEntry = { key: string; label: string; sublabel?: string };

type PinnedSequenceProps = {
  /** Two-digit beat number, e.g. "01". */
  number: string;
  kicker: string;
  title: React.ReactNode;
  standfirst: string;
  /** Index rail entries — one per stage, same order. */
  entries: SequenceEntry[];
  /** One node per entry. Cross-faded on scroll; all rendered on the fallback. */
  stages: React.ReactNode[];
  /** Ambient artwork bled behind the stage. Decorative only. */
  backdrop?: React.ReactNode;
  /** Scroll distance per stage, in vh. Lower = faster scrub. */
  vhPerStage?: number;
  /** Stage tone. Consecutive beats alternate so the dark run keeps varying. */
  tone?: "warm" | "cool";
};

const TONES = {
  warm: "bg-stage-warm",
  cool: "bg-stage-cool",
} as const;

/**
 * A pinned, scroll-scrubbed beat on the cinematic dark run.
 *
 * The section is a tall track; the stage inside it sticks to the viewport and
 * the page "holds" while the stages cross-fade one at a time, then releases.
 * It's the same device as the About page's pinned timeline, which is why this
 * page reads as part of the same site rather than a bolt-on.
 *
 * Three deliberate constraints:
 *
 * - **State, not per-frame transforms.** Scroll progress is sampled and mapped
 *   to an integer index, so React re-renders at most N times across the whole
 *   track instead of every frame. The cross-fade itself runs on `opacity` and
 *   `transform` only — both GPU-composited, so the pin holds 60fps.
 * - **Pinning is a large-screen affordance.** Below `lg` the track collapses and
 *   the stages render stacked. Hijacking scroll on a phone, where the gesture is
 *   the primary means of navigation and the viewport can't hold a two-column
 *   stage, is worse than no effect at all — this is the "redesigned, not shrunk"
 *   rule applied to motion.
 * - **Reduced motion gets the stacked layout at every width**, not a
 *   still-pinned version with the animation disabled — a pin is itself motion.
 *
 * Both layouts render the same `stages`, so there is one source of content and
 * no chance of the two versions drifting apart.
 */
export function PinnedSequence({
  number,
  kicker,
  title,
  standfirst,
  entries,
  stages,
  backdrop,
  vhPerStage = 85,
  tone = "warm",
}: PinnedSequenceProps) {
  const toneClass = TONES[tone];
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = entries.length;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(value * count)));
    setActive((current) => (current === next ? current : next));
  });

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="max-w-3xl">
        <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.22em] text-brand-ink">
          <span className="font-display text-base">{number}</span>
          <span aria-hidden className="h-px w-8 bg-brand/35" />
          {kicker}
        </p>
        <h2 className="mt-4 text-balance font-bold tracking-tight text-ink text-[2rem]/[1.15] sm:text-4xl/[1.1] lg:text-5xl/[1.05]">
          {title}
        </h2>
      </div>
      <p className="max-w-md text-base leading-relaxed text-ink/60">{standfirst}</p>
    </div>
  );

  /* Stacked fallback — phones, and anyone who asked for less motion. */
  const stacked = (
    <section
      className={cn("relative isolate overflow-hidden py-16 md:py-22", toneClass)}
    >
      <div className="container-page relative z-10">
        {header}
        <div className="mt-12 space-y-6">
          {stages.map((stage, i) => (
            <div
              key={entries[i]?.key ?? i}
              data-aos="fade-up"
              className="rounded-2xl border border-line bg-paper p-6 sm:p-8"
            >
              {stage}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (reduce) return stacked;

  return (
    <>
      <div className="lg:hidden">{stacked}</div>

      <section
        ref={trackRef}
        style={{ height: `${count * vhPerStage + 40}vh` }}
        className="relative hidden lg:block"
      >
        <div
          className={cn(
            "sticky top-0 isolate flex h-[100svh] flex-col overflow-hidden",
            toneClass,
          )}
        >
          {/* Backdrop is clipped to the page container, not the viewport, so the
              artwork lands on the same right-hand edge as the content grid
              instead of hanging off the frame at an arbitrary width. */}
          {backdrop ? (
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <div className="container-page relative h-full">{backdrop}</div>
            </div>
          ) : null}

          <div className="container-page relative z-10 pt-[clamp(5.5rem,11vh,7.5rem)]">
            {header}
          </div>

          {/* Stages are absolutely stacked so the pinned stage never resizes
              between them — a height change here would jitter the whole pin. */}
          <div className="container-page relative z-10 min-h-0 flex-1">
            <div className="relative h-full">
              {stages.map((stage, i) => (
                <motion.div
                  key={entries[i]?.key ?? i}
                  aria-hidden={i !== active}
                  initial={false}
                  animate={{
                    opacity: i === active ? 1 : 0,
                    y: i === active ? 0 : 28,
                    filter: i === active ? "blur(0px)" : "blur(6px)",
                  }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "absolute inset-0 flex items-center",
                    i === active ? "pointer-events-auto" : "pointer-events-none",
                  )}
                >
                  <div className="w-full">{stage}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Index rail — where you are, and how much beat is left. */}
          <div className="container-page relative z-10 pb-[clamp(2rem,5vh,3.5rem)]">
            <ol className="flex items-stretch gap-px overflow-hidden rounded-xl border border-line bg-line">
              {entries.map((entry, i) => {
                const isActive = i === active;
                const isDone = i < active;
                return (
                  <li key={entry.key} className="relative min-w-0 flex-1">
                    <div
                      className={cn(
                        "flex h-full flex-col justify-center px-4 py-3 transition-colors duration-300",
                        isActive ? "bg-paper" : "bg-mist",
                      )}
                    >
                      <span
                        className={cn(
                          "font-display text-[0.625rem] font-bold tracking-[0.16em] transition-colors duration-300",
                          isActive
                            ? "text-brand-ink"
                            : isDone
                              ? "text-ink/45"
                              : "text-ink/30",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "mt-1 truncate text-sm font-semibold transition-colors duration-300",
                          isActive ? "text-ink" : "text-ink/45",
                        )}
                      >
                        {entry.label}
                      </span>
                      {entry.sublabel ? (
                        <span
                          className={cn(
                            "truncate text-xs transition-colors duration-300",
                            isActive ? "text-ink/60" : "text-ink/30",
                          )}
                        >
                          {entry.sublabel}
                        </span>
                      ) : null}
                    </div>
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-0 bottom-0 h-0.5 origin-left transition-transform duration-500",
                        isActive || isDone
                          ? "scale-x-100 bg-brand"
                          : "scale-x-0 bg-brand",
                      )}
                    />
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
