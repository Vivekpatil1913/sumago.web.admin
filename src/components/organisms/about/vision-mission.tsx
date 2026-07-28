"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Vision & Mission — a diptych: the destination on the left, the daily practice
 * on the right, wired together by a dashed connector (same leader-line idiom as
 * the Core Values target, so the two sections read as one system).
 *
 * The compass needle settles north and the mission target locks on — each
 * animation states the idea the panel is making, and both go still under
 * `prefers-reduced-motion`.
 *
 * Statements are verbatim from COMPANY-PROFILE.md; the pillar chips only
 * restate words already in the statement above them — no new claims.
 */

const CYCLE_MS = 3400;

/** Both emblems use a 200×200 viewBox — everything rotates about its centre. */
const SPIN_ORIGIN: React.CSSProperties = {
  transformBox: "view-box",
  transformOrigin: "100px 100px",
};

type Panel = {
  key: "vision" | "mission";
  eyebrow: string;
  word: string;
  lead: string;
  body: string;
  pillars: string[];
};

const PANELS: Panel[] = [
  {
    key: "vision",
    eyebrow: "Where we're headed",
    word: "Vision",
    lead: "To become a globally trusted digital transformation partner",
    body: " that empowers businesses through innovation, intelligent technology, and long-term strategic partnerships.",
    pillars: ["Innovation", "Intelligent technology", "Long-term partnerships"],
  },
  {
    key: "mission",
    eyebrow: "How we earn our way there",
    word: "Mission",
    lead: "To deliver world-class digital solutions that solve real business problems",
    body: " by combining deep business understanding, modern technologies, exceptional user experiences, and continuous innovation.",
    pillars: [
      "Business understanding",
      "Modern technology",
      "Exceptional experience",
      "Continuous innovation",
    ],
  },
];

/* ── Emblems ─────────────────────────────────────────────────────────────── */

/** Compass — the needle drifts, then holds north. Decorative. */
function CompassEmblem({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="vm-face" cx="40%" cy="34%" r="76%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fdf0f0" />
        </radialGradient>
      </defs>

      {/* Halo — blooms when the panel is active */}
      <circle
        cx={100}
        cy={100}
        r={94}
        fill="#d73438"
        className="transition-opacity duration-700"
        opacity={active ? 0.1 : 0.04}
      />

      {/* Slow orbit ring */}
      <circle
        cx={100}
        cy={100}
        r={92}
        fill="none"
        stroke="#d73438"
        strokeOpacity={0.35}
        strokeWidth={1.5}
        strokeDasharray="2 10"
        strokeLinecap="round"
        className="motion-safe:animate-[vm-spin_30s_linear_infinite]"
        style={SPIN_ORIGIN}
      />

      {/* Bezel + face */}
      <circle cx={100} cy={100} r={76} fill="url(#vm-face)" />
      <circle
        cx={100}
        cy={100}
        r={76}
        fill="none"
        stroke="#d73438"
        strokeOpacity={active ? 0.35 : 0.16}
        strokeWidth={2}
        className="transition-[stroke-opacity] duration-500"
      />

      {/* Degree ticks — cardinals run long */}
      {Array.from({ length: 24 }, (_, i) => {
        const cardinal = i % 6 === 0;
        const a = (i * 15 * Math.PI) / 180;
        const r1 = cardinal ? 58 : 65;
        return (
          <line
            key={i}
            x1={100 + Math.sin(a) * r1}
            y1={100 - Math.cos(a) * r1}
            x2={100 + Math.sin(a) * 70}
            y2={100 - Math.cos(a) * 70}
            stroke={cardinal ? "#a81b22" : "#1a1a1a"}
            strokeOpacity={cardinal ? 0.55 : 0.18}
            strokeWidth={cardinal ? 2 : 1}
            strokeLinecap="round"
          />
        );
      })}

      <text
        x={100}
        y={44}
        textAnchor="middle"
        className="fill-[#a81b22] font-display font-bold"
        style={{ fontSize: 13, letterSpacing: 1 }}
      >
        N
      </text>

      {/* Needle — points north, with a gentle settle either side of it */}
      <g
        className="motion-safe:animate-[vm-needle_7s_ease-in-out_infinite]"
        style={SPIN_ORIGIN}
      >
        <path d="M100 34 L112 100 L100 112 L88 100 Z" fill="#d73438" />
        <path d="M100 166 L88 100 L100 88 L112 100 Z" fill="#1a1a1a" opacity={0.32} />
      </g>
      <circle cx={100} cy={100} r={7} fill="#ffffff" stroke="#a81b22" strokeWidth={2} />
    </svg>
  );
}

/** Target — rings, crosshair, and a sweep that locks onto centre. Decorative. */
function TargetEmblem({ active }: { active: boolean }) {
  const RINGS = [
    { r: 76, fill: "#fdecec" },
    { r: 58, fill: "#f7bfc0" },
    { r: 40, fill: "#e8686b" },
    { r: 20, fill: "#b3161b" },
  ];

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="vm-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d73438" stopOpacity="0" />
          <stop offset="100%" stopColor="#d73438" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      <circle
        cx={100}
        cy={100}
        r={94}
        fill="#d73438"
        className="transition-opacity duration-700"
        opacity={active ? 0.1 : 0.04}
      />
      <circle
        cx={100}
        cy={100}
        r={92}
        fill="none"
        stroke="#d73438"
        strokeOpacity={0.35}
        strokeWidth={1.5}
        strokeDasharray="2 10"
        strokeLinecap="round"
        className="motion-safe:animate-[vm-spin_30s_linear_infinite_reverse]"
        style={SPIN_ORIGIN}
      />

      {RINGS.map((ring) => (
        <circle key={ring.r} cx={100} cy={100} r={ring.r} fill={ring.fill} />
      ))}

      {/* Radar sweep — one arm rotating over the rings */}
      <line
        x1={100}
        y1={100}
        x2={100}
        y2={24}
        stroke="url(#vm-sweep)"
        strokeWidth={3}
        strokeLinecap="round"
        className="motion-safe:animate-[vm-spin_5s_linear_infinite]"
        style={SPIN_ORIGIN}
      />

      {/* Crosshair — breaks the rings so the centre reads as a locked target */}
      {[
        [100, 8, 100, 192],
        [8, 100, 192, 100],
      ].map(([x1, y1, x2, y2]) => (
        <line
          key={`${x1}-${y1}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#ffffff"
          strokeOpacity={0.9}
          strokeWidth={2}
        />
      ))}

      {/* Lock-on ring + bullseye */}
      <circle
        cx={100}
        cy={100}
        r={20}
        fill="none"
        stroke="#ffffff"
        strokeWidth={3}
        className="motion-safe:animate-[vm-lock_2.6s_ease-in-out_infinite]"
        style={SPIN_ORIGIN}
      />
      <circle cx={100} cy={100} r={7} fill="#ffffff" />
    </svg>
  );
}

/* ── Panel ───────────────────────────────────────────────────────────────── */

function StatementPanel({
  panel,
  index,
  active,
  onActivate,
  onHold,
  onRelease,
}: {
  panel: Panel;
  index: number;
  active: boolean;
  onActivate: () => void;
  onHold: () => void;
  onRelease: () => void;
}) {
  return (
    <article
      data-aos="fade-up"
      data-aos-delay={index * 120}
      onMouseEnter={() => {
        onHold();
        onActivate();
      }}
      onMouseLeave={onRelease}
      onFocus={() => {
        onHold();
        onActivate();
      }}
      onBlur={onRelease}
      tabIndex={0}
      className="group relative isolate overflow-hidden rounded-3xl border bg-paper p-7 outline-none transition-all duration-500 sm:p-9"
      style={{
        borderColor: active ? "rgba(215,52,56,0.28)" : "var(--color-line)",
        boxShadow: active
          ? "0 28px 60px -34px rgba(168,27,34,0.45)"
          : "0 10px 30px -24px rgba(0,0,0,0.35)",
        transform: active ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Corner wash — warms the panel while it holds attention */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle, rgba(215,52,56,0.16), rgba(215,52,56,0) 70%)",
          opacity: active ? 1 : 0.35,
        }}
      />
      {/* Fine dot grid — the same engineering texture as the proof band */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient(rgba(26,26,26,0.09) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 80% 0%, #000 10%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 80% 0%, #000 10%, transparent 72%)",
        }}
      />
      {/* Top hairline that draws across when the panel is active */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-brand via-brand/40 to-transparent transition-transform duration-700"
        style={{ transform: `scaleX(${active ? 1 : 0.18})` }}
      />

      <div className="flex items-center gap-5 sm:gap-7">
        <div className="h-24 w-24 shrink-0 sm:h-28 sm:w-28">
          {panel.key === "vision" ? (
            <CompassEmblem active={active} />
          ) : (
            <TargetEmblem active={active} />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-ink">
            {panel.eyebrow}
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold leading-none sm:text-4xl">
            <span className="text-ink/35">Our </span>
            <span className="text-metal-red">{panel.word}</span>
          </h3>
        </div>
      </div>

      <p className="mt-7 text-base leading-relaxed text-ink/70 sm:text-lg">
        <span className="font-semibold text-ink">{panel.lead}</span>
        {panel.body}
      </p>

      <ul className="mt-7 flex flex-wrap gap-2 border-t border-line pt-6">
        {panel.pillars.map((p) => (
          <li
            key={p}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-500"
            style={{
              borderColor: active ? "rgba(215,52,56,0.25)" : "var(--color-line)",
              background: active ? "rgba(215,52,56,0.06)" : "var(--color-mist)",
              color: active ? "var(--color-brand-ink)" : "rgba(26,26,26,0.65)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full transition-colors duration-500"
              style={{ background: active ? "var(--color-brand)" : "var(--color-line)" }}
            />
            {p}
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ── Section body ────────────────────────────────────────────────────────── */

export function VisionMission() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduce || hold) return;
    timer.current = setInterval(() => setActive((i) => (i + 1) % PANELS.length), CYCLE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduce, hold]);

  return (
    <div className="relative mt-14">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
        <StatementPanel
          panel={PANELS[0]}
          index={0}
          active={reduce || active === 0}
          onActivate={() => setActive(0)}
          onHold={() => setHold(true)}
          onRelease={() => setHold(false)}
        />

        {/* Bridge — vision is the destination, mission is the route to it.
            Vertical in the desktop gutter, horizontal between stacked panels. */}
        <div
          aria-hidden
          className="flex items-center justify-center gap-3 lg:w-24 lg:flex-col lg:gap-4"
        >
          <span className="h-px flex-1 bg-[linear-gradient(to_right,transparent,var(--color-line))] lg:h-auto lg:w-px lg:flex-1 lg:bg-[linear-gradient(to_bottom,transparent,var(--color-line))]" />
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-brand/25 bg-paper text-brand shadow-[0_8px_20px_-12px_rgba(168,27,34,0.6)]">
            {/* Points down between stacked panels, right in the desktop gutter */}
            <ArrowRight size={18} className="rotate-90 lg:rotate-0" />
          </span>
          <span className="h-px flex-1 bg-[linear-gradient(to_left,transparent,var(--color-line))] lg:h-auto lg:w-px lg:flex-1 lg:bg-[linear-gradient(to_top,transparent,var(--color-line))]" />
        </div>

        <StatementPanel
          panel={PANELS[1]}
          index={1}
          active={reduce || active === 1}
          onActivate={() => setActive(1)}
          onHold={() => setHold(true)}
          onRelease={() => setHold(false)}
        />
      </div>

      {/* Scoped keyframes — no global CSS needed. */}
      <style>{`
        @keyframes vm-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes vm-needle {
          0%, 100% { transform: rotate(-16deg); }
          18%, 62% { transform: rotate(0deg); }
          80% { transform: rotate(13deg); }
        }
        @keyframes vm-lock {
          0%, 100% { stroke-opacity: 0.95; transform: scale(1); }
          50% { stroke-opacity: 0.35; transform: scale(1.28); }
        }
      `}</style>
    </div>
  );
}
