"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  GraduationCap,
  Lightbulb,
  TrendingUp,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";

/** Icon components live client-side — only the string key crosses the RSC boundary. */
const VALUE_ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Lightbulb,
  TrendingUp,
  HeartHandshake,
};

export type CoreValue = { name: string; description: string; icon: string };

/**
 * Each value owns a concentric band in the bullseye and a card beside it. `r` is
 * the band's outer radius in the 360×360 SVG (drawn largest→smallest so bands
 * stack into rings). Colours run dark (outer / Commitment) → light (inner /
 * Continuous Learning), echoing the original "Core Values" target.
 */
const BANDS: { r: number; fill: string; glow: string }[] = [
  { r: 70, fill: "#f2acac", glow: "#f8caca" }, // 0 · Continuous Learning (inner, lightest)
  { r: 106, fill: "#ec6b6e", glow: "#f59a9c" }, // 1 · Innovation
  { r: 142, fill: "#dc3f43", glow: "#f06d70" }, // 2 · Constant Improvement
  { r: 178, fill: "#b3161b", glow: "#e2494d" }, // 3 · Commitment (outer, darkest)
];

const CENTER = 180;
const CORE_R = 52;
const CYCLE_MS = 2600; // dwell on each value before auto-advancing

const LINE_IDLE = "#d3d3d8";
const LINE_ACTIVE = "#b3161b";

/**
 * Where each value's leader line exits, in viewBox units. Two values sit left
 * (0,1) and two right (2,3); endpoints land just past the circle in the grid
 * gutter, pointing at the adjacent card. y ≈ 24% / 76% lines up with the two
 * stacked cards in each column.
 */
const CONNECTORS: { to: [number, number] }[] = [
  { to: [-52, 86] }, // 0 → top-left card
  { to: [-52, 274] }, // 1 → bottom-left card
  { to: [412, 86] }, // 2 → top-right card
  { to: [412, 274] }, // 3 → bottom-right card
];

/** Quadrant each value's line exits toward: h = left/right, v = up/down. */
const QUADRANTS: { h: -1 | 1; v: -1 | 1 }[] = [
  { h: -1, v: -1 }, // 0 → top-left
  { h: -1, v: 1 }, // 1 → bottom-left
  { h: 1, v: -1 }, // 2 → top-right
  { h: 1, v: 1 }, // 3 → bottom-right
];

/**
 * Elbow leader line: leaves the band edge on a 45° diagonal, then turns
 * horizontal and runs into the card — so every connector is made of angled
 * segments rather than one slanted line.
 */
function connectorGeometry(i: number) {
  const [tx, ty] = CONNECTORS[i].to;
  const { h, v } = QUADRANTS[i];
  const r = BANDS[i].r;

  // Exit point sits on the band edge, on the 45° diagonal of its quadrant.
  const sx = CENTER + h * r * Math.SQRT1_2;
  const sy = CENTER + v * r * Math.SQRT1_2;

  // Travel at 45° until level with the card, then straight across to it.
  const bx = sx + h * Math.abs(ty - sy);

  return { sx, sy, d: `M ${sx} ${sy} L ${bx} ${ty} L ${tx} ${ty}` };
}

/** Animated concentric target with leader lines out to each value. Decorative. */
function Bullseye({ active }: { active: number }) {
  const reduce = useReducedMotion();
  const band = BANDS[active];

  return (
    <svg viewBox="0 0 360 360" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="cv-core" cx="42%" cy="38%" r="72%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fdecec" />
        </radialGradient>
        <filter id="cv-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        {(
          [
            ["cv-arrow-idle", LINE_IDLE],
            ["cv-arrow-active", LINE_ACTIVE],
          ] as const
        ).map(([id, color]) => (
          <marker
            key={id}
            id={id}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 z" fill={color} />
          </marker>
        ))}
      </defs>

      {/* Soft halo that tints toward the active band */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={196}
        fill={band.glow}
        opacity={0.16}
        filter="url(#cv-soft)"
        className="transition-[fill] duration-500"
      />

      {/* Rotating dashed guide ring — continuous, gentle */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={196}
        fill="none"
        stroke="#d73438"
        strokeOpacity={0.35}
        strokeWidth={2}
        strokeDasharray="2 12"
        strokeLinecap="round"
        className="motion-safe:animate-[spin_26s_linear_infinite]"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />

      {/* Concentric bands — drawn outer → inner so they stack into rings */}
      {[...BANDS].reverse().map((b, ri) => {
        const idx = BANDS.length - 1 - ri;
        const isActive = idx === active;
        return (
          <circle
            key={b.r}
            cx={CENTER}
            cy={CENTER}
            r={b.r}
            fill={isActive ? b.glow : b.fill}
            className="transition-[fill,transform] duration-500"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              transform: isActive && !reduce ? "scale(1.03)" : "scale(1)",
            }}
          />
        );
      })}

      {/* Active-band emphasis ring — pulses to draw the eye */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={band.r}
        fill="none"
        stroke="#ffffff"
        strokeWidth={3}
        strokeOpacity={0.9}
        className="origin-center transition-[r] duration-500 motion-safe:animate-[cv-pulse_2.6s_ease-in-out_infinite]"
      />

      {/* Core */}
      <circle cx={CENTER} cy={CENTER} r={CORE_R} fill="url(#cv-core)" />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={CORE_R}
        fill="none"
        stroke="#b3161b"
        strokeOpacity={0.15}
        strokeWidth={1.5}
      />
      <text
        x={CENTER}
        y={CENTER - 7}
        textAnchor="middle"
        className="fill-ink font-display font-extrabold"
        style={{ fontSize: 20, letterSpacing: 1 }}
      >
        CORE
      </text>
      <text
        x={CENTER}
        y={CENTER + 16}
        textAnchor="middle"
        className="fill-[#b3161b] font-display font-extrabold"
        style={{ fontSize: 20, letterSpacing: 1 }}
      >
        VALUES
      </text>

      {/* Leader lines — each band wired out to its card. Only meaningful in the
          three-column desktop layout, so they're hidden on stacked viewports.
          A white casing keeps the line legible where it crosses the red rings. */}
      <g className="hidden lg:inline">
        {BANDS.map((_, i) => {
          const { sx, sy, d } = connectorGeometry(i);
          const isActive = i === active;
          return (
            <g key={i}>
              {/* White casing — halos each dot where the line crosses the rings. */}
              <path
                d={d}
                fill="none"
                stroke="#ffffff"
                strokeWidth={isActive ? 5 : 4}
                strokeLinecap="round"
                strokeDasharray="0.5 7"
                opacity={0.95}
              />
              <path
                d={d}
                fill="none"
                stroke={isActive ? LINE_ACTIVE : LINE_IDLE}
                strokeWidth={isActive ? 2.5 : 2}
                strokeLinecap="round"
                strokeDasharray="0.5 7"
                markerEnd={`url(#${isActive ? "cv-arrow-active" : "cv-arrow-idle"})`}
                className="transition-[stroke,stroke-width] duration-300"
              />
              {/* Origin dot on the band edge */}
              <circle
                cx={sx}
                cy={sy}
                r={isActive ? 4 : 3}
                fill="#ffffff"
                stroke={isActive ? LINE_ACTIVE : LINE_IDLE}
                strokeWidth={1.5}
                className="transition-all duration-300"
              />
            </g>
          );
        })}
      </g>

      {/* Local keyframes for the emphasis pulse (scoped, no global CSS needed) */}
      <style>{`
        @keyframes cv-pulse {
          0%, 100% { stroke-opacity: 0.9; }
          50% { stroke-opacity: 0.25; }
        }
      `}</style>
    </svg>
  );
}

/** One value card. `side` mirrors the layout so content faces the circle. */
function ValueCard({
  v,
  i,
  side,
  isActive,
  onActivate,
  onHold,
  onRelease,
}: {
  v: CoreValue;
  i: number;
  side: "left" | "right";
  isActive: boolean;
  onActivate: () => void;
  onHold: () => void;
  onRelease: () => void;
}) {
  const band = BANDS[i];
  const Icon = VALUE_ICONS[v.icon] ?? GraduationCap;
  const facingLeft = side === "left"; // card sits left of the circle → face right

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onMouseEnter={onActivate}
      onFocus={() => {
        onHold();
        onActivate();
      }}
      onBlur={onRelease}
      onClick={onActivate}
      className={`group flex w-full items-start gap-4 rounded-2xl border bg-paper p-5 text-left transition-all duration-300 ${
        facingLeft ? "lg:flex-row-reverse lg:text-right" : ""
      }`}
      style={{
        borderColor: isActive ? band.fill : "var(--color-line)",
        boxShadow: isActive
          ? `0 14px 34px -18px ${band.fill}, inset ${facingLeft ? "-4px" : "4px"} 0 0 ${band.fill}`
          : "none",
        transform: isActive
          ? `translateX(${facingLeft ? "-6px" : "6px"})`
          : "translateX(0)",
      }}
    >
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors duration-300"
        style={{
          background: isActive
            ? band.fill
            : "color-mix(in srgb, var(--color-brand) 10%, white)",
          color: isActive ? "#ffffff" : "var(--color-brand)",
        }}
      >
        <Icon size={22} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`flex items-center gap-2 ${facingLeft ? "lg:flex-row-reverse" : ""}`}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full transition-colors duration-300"
            style={{ background: isActive ? band.fill : "var(--color-line)" }}
          />
          <span className="text-base font-semibold text-ink">{v.name}</span>
        </span>
        {/* Description reveals for the active value; collapses otherwise */}
        <span
          className="grid transition-all duration-300"
          style={{
            gridTemplateRows: isActive ? "1fr" : "0fr",
            opacity: isActive ? 1 : 0,
          }}
        >
          <span className="overflow-hidden">
            <span
              className={`mt-1 block text-sm leading-relaxed text-ink/70 ${
                facingLeft ? "pr-4 lg:pl-0" : "pl-4"
              }`}
            >
              {v.description}
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}

/**
 * Interactive Core Values — the concentric target sits at the centre with two
 * values either side, each wired to its own ring by an arrowed leader line.
 * Auto-cycles through the values; hover or focus a card to take manual control.
 * Fully static under reduced-motion.
 */
export function CoreValuesRadial({ values }: { values: CoreValue[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduce || hold) return;
    timer.current = setInterval(() => {
      setActive((i) => (i + 1) % values.length);
    }, CYCLE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduce, hold, values.length]);

  const cardProps = (i: number) => ({
    i,
    isActive: i === active,
    onActivate: () => setActive(i),
    onHold: () => setHold(true),
    onRelease: () => setHold(false),
  });

  return (
    <div
      className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_minmax(300px,420px)_1fr] lg:gap-14"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
    >
      {/* Left column — values 0 & 1 */}
      <div className="flex flex-col gap-6 lg:gap-24">
        {values.slice(0, 2).map((v, i) => (
          <ValueCard key={v.name} v={v} side="left" {...cardProps(i)} />
        ))}
      </div>

      {/* Centre — the target (first on stacked viewports) */}
      <div className="relative order-first mx-auto aspect-square w-full max-w-[420px] lg:order-none">
        <Bullseye active={active} />
      </div>

      {/* Right column — values 2 & 3 */}
      <div className="flex flex-col gap-6 lg:gap-24">
        {values.slice(2, 4).map((v, i) => (
          <ValueCard key={v.name} v={v} side="right" {...cardProps(i + 2)} />
        ))}
      </div>
    </div>
  );
}
