"use client";

import { useEffect, useRef, useState } from "react";

/**
 * WHY SUMAGO — the standout.
 *
 * The Sumago globe (the company's own mark, cropped to a circle) floating over a
 * glowing ring, with five short marketing lines that reveal one by one as the
 * section scrolls into view. The globe lands first, then each point in turn.
 *
 * Ring, callouts and reveal are original SVG/CSS from tokens (no stock —
 * CLAUDE.md). The points are marketing lines, not metrics. An Intersection
 * Observer gates the stagger to when the scene is actually on screen; reduced
 * motion collapses the transitions to instant (globals.css), so everything
 * simply appears. Decorative structure, labelled for assistive tech.
 */

/**
 * The Sumago globe's circle inside public/sumago-globe.png, in source pixels.
 * The isolated mark fills a transparent square; nudge cx/cy/r if it drifts.
 */
const LOGO = { w: 1254, h: 1254, cx: 627, cy: 578, r: 588 };

/* Where the five lines sit around the globe. The geometry is fixed — only the
   words change per service. */
type Slot = {
  tx: number;
  ty: number;
  anchor: "start" | "middle" | "end";
  lx: number;
  ly: number;
  dx: number;
  dy: number;
};

type Point = Slot & { lead: string; rest: string };

const SLOTS: Slot[] = [
  { tx: 410, ty: 58, anchor: "middle", lx: 410, ly: 72, dx: 410, dy: 198 },
  { tx: 60, ty: 152, anchor: "start", lx: 205, ly: 146, dx: 340, dy: 232 },
  { tx: 760, ty: 152, anchor: "end", lx: 600, ly: 146, dx: 480, dy: 232 },
  { tx: 60, ty: 406, anchor: "start", lx: 190, ly: 400, dx: 340, dy: 368 },
  { tx: 760, ty: 406, anchor: "end", lx: 600, ly: 400, dx: 480, dy: 368 },
];

/* The company-level default. A service overrides these with its own five, which
   is the only part of this scene that is ever service-specific. */
const DEFAULT_POINTS = [
  "Future-ready",
  "Proven at scale",
  "Certified quality",
  "Built to last",
  "Trusted partner",
];

/**
 * The first word carries the brand colour, the rest stays ink — so five lines
 * of different lengths still read as one set. "Future-ready" splits on the
 * hyphen; everything else on the first space.
 */
function split(point: string) {
  const hyphen = point.indexOf("-");
  const space = point.indexOf(" ");
  const at = space === -1 ? hyphen : hyphen === -1 ? space : Math.min(hyphen, space);
  if (at === -1) return { lead: point, rest: "" };
  return { lead: point.slice(0, at), rest: point.slice(at) };
}

export function WhyStandout({ points }: { points?: string[] }) {
  /* Exactly five, always: the geometry has five anchored slots, and a shorter
     list would leave the scene visibly lopsided. A service that writes fewer
     tops up from the company set. */
  const lines = [...(points ?? []), ...DEFAULT_POINTS].slice(0, SLOTS.length);
  const POINTS: Point[] = SLOTS.map((slot, i) => ({ ...slot, ...split(lines[i]) }));
  const label = `Why Sumago is chosen over the alternatives — ${lines
    .join(", ")
    .toLowerCase()}.`;

  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const gx = 410;
  const gy = 300;
  const r = 98;
  const s = r / LOGO.r;

  return (
    <div ref={ref} className="relative mx-auto mt-16 w-full max-w-4xl md:mt-20">
      <svg
        viewBox="0 0 820 520"
        className="h-auto w-full"
        role="img"
        aria-label={label}
      >
        <defs>
          <filter id="ws-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <radialGradient id="ws-floor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(215,52,56,0.10)" />
            <stop offset="100%" stopColor="rgba(215,52,56,0)" />
          </radialGradient>
          <clipPath id="ws-globe">
            <circle cx={gx} cy={gy} r={r} />
          </clipPath>
        </defs>

        {/* soft brand floor */}
        <ellipse cx={gx} cy="430" rx="360" ry="120" fill="url(#ws-floor)" />

        {/* the standout — fades in first, then floats */}
        <g style={{ opacity: shown ? 1 : 0, transition: "opacity 700ms ease" }}>
          <ellipse cx={gx} cy="452" rx="132" ry="34" fill="#d73438" opacity="0.5" filter="url(#ws-glow)" />
          <ellipse cx={gx} cy="452" rx="120" ry="30" fill="none" stroke="#ff6b6e" strokeWidth="3" />
          <ellipse cx={gx} cy="452" rx="152" ry="40" fill="none" stroke="#ff6b6e" strokeWidth="1.5" opacity="0.4" />
          <g
            className="motion-safe:animate-[tile-float_6s_ease-in-out_infinite]"
            style={{ filter: "drop-shadow(0 20px 34px rgba(215,52,56,0.4))" }}
          >
            <circle cx={gx} cy={gy} r={r + 14} fill="#d73438" opacity="0.26" filter="url(#ws-glow)" />
            <image
              href="/sumago-globe.png"
              x={gx - LOGO.cx * s}
              y={gy - LOGO.cy * s}
              width={LOGO.w * s}
              height={LOGO.h * s}
              preserveAspectRatio="none"
              clipPath="url(#ws-globe)"
            />
          </g>
        </g>

        {/* the five marketing lines, revealed one by one */}
        {POINTS.map((c, i) => {
          const delay = 350 + i * 200;
          return (
            <g
              key={c.lead}
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 550ms ease ${delay}ms, transform 550ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
              }}
            >
              <line x1={c.lx} y1={c.ly} x2={c.dx} y2={c.dy} stroke="rgba(10,7,8,0.26)" strokeWidth={1.5} />
              <circle cx={c.dx} cy={c.dy} r={4.5} fill="#d73438" />
              <text
                x={c.tx}
                y={c.ty}
                textAnchor={c.anchor}
                fill="#0a0708"
                /* A service's own points run longer than the company's two-word
                   defaults ("Testing built in, not bolted on"). Stepping the
                   size down past ~22 characters keeps the longest line inside
                   the viewBox instead of clipping at the edge. */
                fontSize={(c.lead + c.rest).length > 22 ? 17 : 21}
                fontWeight={700}
                letterSpacing="-0.01em"
              >
                <tspan fill="#d73438">{c.lead}</tspan>
                {c.rest}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
