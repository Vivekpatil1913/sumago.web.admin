"use client";

import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn, svgNum } from "@/lib/utils";
import { toolIcons, type ToolIcon } from "@/lib/tool-icons";

/** Split the 30 tools into two bands that scroll in opposite directions. */
const HALF = Math.ceil(toolIcons.length / 2);
const TOP_ROW = toolIcons.slice(0, HALF);
const BOTTOM_ROW = toolIcons.slice(HALF);

function Tile({ icon, hidden }: { icon: ToolIcon; hidden?: boolean }) {
  return (
    /*
      `role="img"` used to sit on this `<li>`, which replaced its listitem role
      — and a `<ul>` whose children are not list items stops being a list to a
      screen reader, which is what axe was reporting across the whole strip. The
      element stays a list item; the accessible name moves onto the mark itself
      below, where the picture actually is.
    */
    <li
      aria-hidden={hidden || undefined}
      title={icon.title}
      className="grid h-[clamp(56px,6.2vw,84px)] w-[clamp(56px,6.2vw,84px)] shrink-0 place-items-center rounded-[24%] border border-white/12 bg-gradient-to-br from-white to-white/85 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.7)] ring-1 ring-black/5 transition-transform duration-300 hover:scale-105"
    >
      {icon.path ? (
        <svg
          viewBox="0 0 24 24"
          className="h-1/2 w-1/2"
          fill={`#${icon.hex}`}
          role={hidden ? undefined : "img"}
          aria-label={hidden ? undefined : icon.title}
          aria-hidden={hidden || undefined}
        >
          <path d={icon.path} />
        </svg>
      ) : (
        <span
          className="text-xs sm:text-sm font-bold leading-none tracking-tight"
          style={{ color: `#${icon.hex}` }}
          role={hidden ? undefined : "img"}
          aria-label={hidden ? undefined : icon.title}
          aria-hidden={hidden || undefined}
        >
          {icon.text}
        </span>
      )}
    </li>
  );
}

/** One seamless, infinitely-scrolling band of tiles. */
function Marquee({
  items,
  reverse,
  duration,
}: {
  items: ToolIcon[];
  reverse?: boolean;
  duration: number;
}) {
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
      <ul
        className={cn(
          "flex w-max items-center gap-5 py-4 will-change-transform md:gap-8",
          "animate-[marquee-x_var(--dur)_linear_infinite]",
          "group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ ["--dur" as string]: `${duration}s` }}
      >
        {items.map((icon) => (
          <Tile key={icon.title} icon={icon} />
        ))}
        {/* duplicate copy makes the -50% loop seamless */}
        {items.map((icon) => (
          <Tile key={`${icon.title}-dup`} icon={icon} hidden />
        ))}
      </ul>
    </div>
  );
}

/** Deterministic fan of light streaks radiating from the lower-left corner. */
const STREAKS = (() => {
  const n = 26;
  const Ox = -60;
  const Oy = 1000;
  const L = 2500;
  const a1 = (6 * Math.PI) / 180;
  const a2 = (78 * Math.PI) / 180;
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const ang = a1 + (a2 - a1) * t;
    const dx = Math.cos(ang);
    const dy = -Math.sin(ang);
    const px = Math.sin(ang);
    const py = Math.cos(ang);
    const bow = (t - 0.5) * 440 + 110; // gentle, varying curvature across the fan
    const c1x = Ox + L * 0.33 * dx + px * bow * 0.5;
    const c1y = Oy + L * 0.33 * dy + py * bow * 0.5;
    const c2x = Ox + L * 0.7 * dx + px * bow;
    const c2y = Oy + L * 0.7 * dy + py * bow;
    const ex = Ox + L * dx;
    const ey = Oy + L * dy;
    const d = `M${Ox} ${Oy} C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
    // brighter/thicker through the middle — rounded so the trig result
    // serialises identically on the server and in the browser (see `svgNum`)
    const depth = svgNum(0.45 + 0.55 * Math.sin(t * Math.PI));
    return { d, depth };
  });
})();

/** Deterministic bokeh dots scattered across the field. */
const DOTS = Array.from({ length: 16 }, (_, i) => ({
  x: 120 + ((i * 173) % 1440),
  y: 90 + ((i * 101) % 720),
  r: 1.4 + (i % 3) * 0.9,
  o: 0.12 + (((i * 53) % 100) / 100) * 0.28,
}));

/** Flowing red light-streaks backdrop, rebuilt in SVG (no stock imagery). */
function RedStreaks() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full origin-center animate-[streak-drift_30s_ease-in-out_infinite] will-change-transform"
    >
      <defs>
        <linearGradient
          id="streak-grad"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="1000"
          x2="1560"
          y2="-40"
        >
          <stop offset="0%" stopColor="#7a1519" stopOpacity="0" />
          <stop offset="16%" stopColor="#7a1519" stopOpacity="0.4" />
          <stop offset="42%" stopColor="#e23a3e" stopOpacity="1" />
          <stop offset="55%" stopColor="#ff9294" stopOpacity="1" />
          <stop offset="74%" stopColor="#d73438" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#d73438" stopOpacity="0" />
        </linearGradient>
        <filter id="streak-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="streak-bloom" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <rect width="1600" height="900" fill="#080506" />

      {/* wide, soft bloom for atmosphere */}
      <g filter="url(#streak-bloom)" opacity="0.55">
        {STREAKS.map((s, i) => (
          <path
            key={`b-${i}`}
            d={s.d}
            fill="none"
            stroke="url(#streak-grad)"
            strokeWidth={s.depth * 5.5}
            opacity={s.depth * 0.6}
          />
        ))}
      </g>

      {/* soft glow pass */}
      <g filter="url(#streak-glow)" opacity="0.9">
        {STREAKS.map((s, i) => (
          <path
            key={`g-${i}`}
            d={s.d}
            fill="none"
            stroke="url(#streak-grad)"
            strokeWidth={s.depth * 3.6}
            opacity={s.depth * 0.7}
          />
        ))}
      </g>

      {/* crisp lines on top */}
      <g>
        {STREAKS.map((s, i) => (
          <path
            key={`c-${i}`}
            d={s.d}
            fill="none"
            stroke="url(#streak-grad)"
            strokeWidth={s.depth * 1.1}
            opacity={s.depth * 0.9}
          />
        ))}
      </g>

      {/* floating dust */}
      <g fill="#ff8d8f">
        {DOTS.map((p, i) => (
          <circle key={`d-${i}`} cx={p.x} cy={p.y} r={p.r} opacity={p.o} />
        ))}
      </g>
    </svg>
  );
}

/**
 * "AI across the Software Development Lifecycle" — two counter-scrolling bands of
 * the AI and engineering tools we work with, cradling the headline. Demonstrates
 * end-to-end AI competence and a modern toolchain (trust).
 */
export function AiSdlc() {
  return (
    <section className="relative overflow-hidden bg-[#080506] text-white">
      {/* flowing red light streaks */}
      <RedStreaks />
      {/* darken the center so the headline + tiles stay legible over the streaks */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(115%_85%_at_50%_50%,rgba(8,5,6,0.7)_0%,rgba(8,5,6,0.32)_36%,transparent_68%)]"
      />

      <div className="relative z-10 py-16 md:py-22">
        {/* Top band — scrolls left */}
        <Marquee items={TOP_ROW} duration={42} />

        {/* Headline nested between the bands */}
        <div className="container-page py-12 text-center md:py-16">
          <Centerpiece />
        </div>

        {/* Bottom band — scrolls the opposite way */}
        <Marquee items={BOTTOM_ROW} duration={48} reverse />
      </div>
    </section>
  );
}

function Centerpiece() {
  return (
    <Reveal className="mx-auto max-w-4xl">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-4 text-sm font-semibold backdrop-blur-sm">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-brand to-[#7a1519] shadow-sm shadow-brand/30">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </span>
        AI Engineering
      </span>
      <h2 className="mt-6 text-3xl leading-tight md:text-4xl lg:text-5xl">
        Applied AI, integrated across the{" "}
        <span className="text-metal-red-shine">Software Development Lifecycle.</span>
      </h2>
      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/65 md:text-lg">
        A modern AI and engineering toolchain applied across the full lifecycle — lifting
        predictability, speed, and quality from the first line of planning to production.
      </p>
    </Reveal>
  );
}
