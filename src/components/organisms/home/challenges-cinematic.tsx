"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { SectionHeading } from "@/components/atoms/section-heading";
import { cn } from "@/lib/utils";

/** The ten problems we solve, phrased plainly. */
const problems: string[] = [
  "Software slowing you down",
  "Too much manual work",
  "Data that won't connect",
  "Customers find it hard to use",
  "An idea with no path to build",
  "Reports take days to pull",
  "Not sure where AI fits",
  "Bugs and downtime keep hitting",
  "Growth your systems can't handle",
  "Big tech calls, no one to guide you",
];

const CYCLE_COUNT = 5; // how many problems fly by one-at-a-time before the cluster

/** Height of the scroll track — how much scrolling the whole sequence takes.
 *  Bigger = slower scrub. ~800vh gives each problem roughly a full screen of
 *  scroll, so there's time to actually read it. */
const TRACK_VH = 800;

/* Scroll slices (fractions of the section's scroll range). The problems fly
   across the first stretch, then the cloud gathers, crushes, and the line rises. */
const CYCLE_END = 0.62;
const CLOUD_IN = 0.7;
const CLOUD_HOLD_END = 0.84;
const CLOUD_OUT = 0.91;
const OUTRO_IN = 0.91;
const OUTRO_DONE = 0.96;

// Word-cloud styling for the "all ten" reveal. Words flow (flex-wrap) so they
// can never overlap; varied sizes, tilts and two tones give the cloud look.
// Heroes stay untilted (rot 0). Indexed 0–9 to match `problems`.
type CloudItem = { size: string; tone: "red" | "ink" | "muted"; rot: number };
const CLOUD: CloudItem[] = [
  { size: "clamp(1.5rem, 4vw, 3rem)", tone: "red", rot: 0 }, // hero 1
  { size: "clamp(1rem, 2.2vw, 1.5rem)", tone: "ink", rot: -4 },
  { size: "clamp(0.95rem, 2vw, 1.4rem)", tone: "ink", rot: -3 },
  { size: "clamp(0.95rem, 2vw, 1.35rem)", tone: "muted", rot: 4 },
  { size: "clamp(0.95rem, 1.9vw, 1.3rem)", tone: "ink", rot: -3 },
  { size: "clamp(0.9rem, 1.8vw, 1.2rem)", tone: "muted", rot: -3 },
  { size: "clamp(1.3rem, 3.4vw, 2.4rem)", tone: "red", rot: 0 }, // hero 2
  { size: "clamp(0.9rem, 1.8vw, 1.15rem)", tone: "ink", rot: 3 },
  { size: "clamp(0.95rem, 1.9vw, 1.3rem)", tone: "muted", rot: 3 },
  { size: "clamp(0.9rem, 1.8vw, 1.15rem)", tone: "muted", rot: 2 },
];
const TONE: Record<CloudItem["tone"], string> = {
  red: "text-metal-red",
  ink: "text-ink",
  muted: "text-ink/40",
};

/**
 * One problem line, scrubbed by scroll: it emerges from depth, arrives sharp and
 * full-size, holds, then rushes past the viewer and off both screen edges.
 * Motion lives on the wrapper; the metallic clip stays on the inner element —
 * keeping filter/will-change off the clipped text stops Chrome dropping the
 * gradient and rendering it solid black.
 */
function FlyingProblem({
  text,
  progress,
  start,
  end,
}: {
  text: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const span = end - start;
  const at = (f: number) => start + span * f;

  // Arrive quickly, then HOLD sharp and still for most of the slice (28%→72%)
  // so the line is comfortably readable, and only then rush past.
  const z = useTransform(progress, [start, at(0.28), at(0.72), end], [-640, 0, 0, 700]);
  const scale = useTransform(progress, [start, at(0.28), at(0.72), end], [0.7, 1, 1, 1.9]);
  const opacity = useTransform(progress, [start, at(0.12), at(0.9), end], [0, 1, 1, 0]);
  const blurPx = useTransform(progress, [start, at(0.28), at(0.72), end], [12, 0, 0, 9]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.div
      style={{ z, scale, opacity, filter }}
      className="absolute inset-0 flex items-center justify-center px-4 will-change-transform"
    >
      <p className="text-center text-4xl font-bold leading-tight tracking-tight text-metal-red sm:text-5xl md:text-6xl">
        {text}
      </p>
    </motion.div>
  );
}

/**
 * Challenges we solve — a scroll-scrubbed cinematic on a stroke-textured stage.
 * The section pins while you scroll: each problem (metallic red) flies toward the
 * viewer and past the screen edges, then the full list gathers as a cloud, crushes
 * away, and a closing "…and many more" line rises. Driven entirely by scroll —
 * nothing auto-plays. Reduced-motion users get the full list + closing line,
 * static. Screen readers always get the full list via the sr-only region.
 */
export function ChallengesCinematic() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const cloudOpacity = useTransform(
    scrollYProgress,
    [CYCLE_END, CLOUD_IN, CLOUD_HOLD_END, CLOUD_OUT],
    [0, 1, 1, 0],
  );
  const cloudScale = useTransform(
    scrollYProgress,
    [CYCLE_END, CLOUD_IN, CLOUD_HOLD_END, CLOUD_OUT],
    [0.5, 1, 1, 0.86],
  );
  const outroOpacity = useTransform(scrollYProgress, [OUTRO_IN, OUTRO_DONE], [0, 1]);
  const outroY = useTransform(scrollYProgress, [OUTRO_IN, OUTRO_DONE], [24, 0]);

  // Reduced-motion / accessibility: the whole story, static.
  if (reduced) {
    return (
      <section className="relative overflow-hidden bg-mist py-16 md:py-22">
        <div aria-hidden className="bg-strokes-grey pointer-events-none absolute inset-0 -z-10" />
        <div className="container-page">
          <Heading />
          <ul className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-x-10 gap-y-3 text-center sm:grid-cols-2 sm:text-left">
            {problems.map((p) => (
              <li key={p} className="text-xl font-bold text-metal-red md:text-2xl">
                {p}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-12 max-w-2xl text-center text-2xl font-bold leading-snug text-ink md:text-3xl">
            The Sumago team solves all of these —{" "}
            <span className="text-metal-red">and many more.</span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-mist"
      style={{ height: `${TRACK_VH}vh` }}
    >
      {/* Pinned viewport — the sequence scrubs here while the track scrolls past. */}
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-16">
        {/* Texture lives inside the pin so its centre-fade stays on the viewport. */}
        <div aria-hidden className="bg-strokes-grey pointer-events-none absolute inset-0 -z-10" />
        <div className="container-page">
          <Heading />
        </div>

        {/* Cinematic stage — full-bleed so the fly-past runs the whole screen */}
        <div
          aria-hidden
          className="relative mt-10 flex flex-1 items-center justify-center [perspective:1200px] [transform-style:preserve-3d]"
        >
          {/* Layer A — problems flying toward the viewer, one per scroll slice */}
          {problems.slice(0, CYCLE_COUNT).map((text, i) => (
            <FlyingProblem
              key={text}
              text={text}
              progress={scrollYProgress}
              start={(i / CYCLE_COUNT) * CYCLE_END}
              end={((i + 1) / CYCLE_COUNT) * CYCLE_END}
            />
          ))}

          {/* Layer B — all ten gather as a word cloud, then crush away */}
          <motion.div
            style={{ opacity: cloudOpacity, scale: cloudScale }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-2"
          >
            <div className="flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-5 md:gap-x-10">
              {problems.map((p, i) => {
                const c = CLOUD[i];
                return (
                  <span
                    key={p}
                    style={{ fontSize: c.size, transform: `rotate(${c.rot}deg)` }}
                    className={cn(
                      "whitespace-nowrap font-bold uppercase leading-none tracking-tight",
                      TONE[c.tone],
                    )}
                  >
                    {p}
                  </span>
                );
              })}
            </div>
          </motion.div>

          {/* Layer C — closing line rises as the cloud vanishes */}
          <motion.div
            style={{ opacity: outroOpacity, y: outroY }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-4"
          >
            <p className="max-w-3xl text-center text-3xl font-bold leading-snug tracking-tight text-ink md:text-5xl">
              The Sumago team solves all of these —{" "}
              <span className="text-metal-red">and many more.</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Accessible, motion-free equivalent for screen readers */}
      <ul className="sr-only">
        {problems.map((p) => (
          <li key={p}>{p}</li>
        ))}
        <li>The Sumago team solves all of these — and many more.</li>
      </ul>
    </section>
  );
}

/** Shared section heading (light background). */
function Heading() {
  return (
    <SectionHeading
      eyebrow="Challenges we solve"
      title={
        <>
          We start with your business problem —{" "}
          <span className="text-metal-red">not the technology.</span>
        </>
      }
      description="Every engagement begins with understanding your goals, then designing the solution that moves the metrics that matter."
    />
  );
}
