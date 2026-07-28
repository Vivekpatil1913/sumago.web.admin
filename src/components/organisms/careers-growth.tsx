"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Flag } from "lucide-react";
import { growthOpportunities } from "@/lib/careers-content";

/**
 * Growth opportunities — "where a career here can take you", drawn as a climb.
 *
 * A six-step staircase on the left rises as you move down the list on the
 * right: each opportunity is one step up, with the last one capped by a flag.
 * The list auto-advances and hands control to hover/focus — the same
 * auto-cycle-then-yield interaction as the Core Values target, so the two read
 * as one system. Every title and description stays visible at all times; the
 * staircase is decorative.
 */

const CYCLE_MS = 3400;

/* Staircase geometry (viewBox units) — six steps, each one taller than the last. */
const VB_W = 340;
const VB_H = 240;
const BASE_Y = 214;
const STEP_W = 46;
const STEP_GAP = 6;
const STEP_X = (i: number) => 14 + i * (STEP_W + STEP_GAP);
const STEP_H = (i: number) => 26 + i * 29;
const STEP_Y = (i: number) => BASE_Y - STEP_H(i);

/** Step fills run pale (first) → deep brand (last), echoing the values target. */
const STEP_FILL = ["#fdecec", "#f9d2d3", "#f2acad", "#e8686b", "#d0272b", "#a81b22"];

function Staircase({ active }: { active: number }) {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-full w-full overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient id="cg-riser" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#d73438" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#d73438" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Ascending guide line along the step corners */}
      <path
        d={`M ${STEP_X(0)} ${STEP_Y(0)} ${growthOpportunities
          .map((_, i) => `L ${STEP_X(i) + STEP_W} ${STEP_Y(i)}`)
          .join(" ")}`}
        fill="none"
        stroke="url(#cg-riser)"
        strokeWidth={2}
        strokeDasharray="2 8"
        strokeLinecap="round"
      />

      {growthOpportunities.map((_, i) => {
        const reached = i <= active;
        const isActive = i === active;
        return (
          <g key={i}>
            {/* Glow under the step you're standing on */}
            {isActive && (
              <rect
                x={STEP_X(i) - 5}
                y={STEP_Y(i) - 5}
                width={STEP_W + 10}
                height={STEP_H(i) + 5}
                rx={14}
                fill="#d73438"
                opacity={0.14}
              />
            )}
            <rect
              x={STEP_X(i)}
              y={STEP_Y(i)}
              width={STEP_W}
              height={STEP_H(i)}
              rx={9}
              fill={reached ? STEP_FILL[i] : "#f1f1f3"}
              stroke={isActive ? "#a81b22" : reached ? "transparent" : "#e6e6e8"}
              strokeWidth={2}
              className="transition-all duration-500"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center bottom",
                transform: isActive ? "scaleY(1.03)" : "scaleY(1)",
              }}
            />
            {/* Step index on the tread */}
            <text
              x={STEP_X(i) + STEP_W / 2}
              y={STEP_Y(i) + 19}
              textAnchor="middle"
              className="font-display font-bold"
              fill={i >= 4 && reached ? "#ffffff" : "#a81b22"}
              opacity={reached ? 0.95 : 0.35}
              style={{ fontSize: 13 }}
            >
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* Ground line */}
      <line
        x1={4}
        y1={BASE_Y}
        x2={VB_W - 4}
        y2={BASE_Y}
        stroke="#e6e6e8"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CareersGrowth() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduce || hold) return;
    timer.current = setInterval(
      () => setActive((i) => (i + 1) % growthOpportunities.length),
      CYCLE_MS,
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduce, hold]);

  const item = growthOpportunities[active];
  const ActiveIcon = item.icon;

  /* Medallion sits on the tread of the active step, in container percentages. */
  const medallionLeft = ((STEP_X(active) + STEP_W / 2) / VB_W) * 100;
  const medallionTop = ((STEP_Y(active) - 24) / VB_H) * 100;

  return (
    <div
      className="mt-14 grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14"
      onMouseLeave={() => setHold(false)}
    >
      {/* The climb */}
      <div
        data-aos="fade-up"
        className="relative overflow-hidden rounded-3xl border border-line bg-paper p-6 shadow-[0_24px_50px_-34px_rgba(0,0,0,0.4)] sm:p-8 lg:sticky lg:top-28"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_0%,rgba(215,52,56,0.10),transparent_70%)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(26,26,26,0.08) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 100%, #000 10%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 100%, #000 10%, transparent 75%)",
          }}
        />

        <div className="relative">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-ink">
              Step {active + 1} of {growthOpportunities.length}
            </p>
            <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink/45">
              <Flag size={13} className="text-brand" aria-hidden />
              Leadership
            </span>
          </div>

          {/* Staircase + the medallion standing on the active step */}
          <div className="relative mt-4 aspect-[340/240] w-full">
            <Staircase active={active} />
            <span
              className="absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl bg-gradient-to-br from-brand to-[#7a1519] text-white shadow-lg shadow-brand/30 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ left: `${medallionLeft}%`, top: `${medallionTop}%` }}
            >
              <ActiveIcon size={20} aria-hidden />
            </span>
          </div>

          <h3
            key={item.title}
            className="mt-2 text-xl font-bold text-ink motion-safe:animate-[cg-rise_450ms_ease-out]"
          >
            {item.title}
          </h3>
        </div>
      </div>

      {/* The list — every step readable without interacting */}
      <ul className="flex flex-col gap-2.5">
        {growthOpportunities.map((g, i) => {
          const isActive = i === active;
          const Icon = g.icon;
          return (
            <li key={g.title}>
              <button
                type="button"
                aria-pressed={isActive}
                data-aos="fade-up"
                data-aos-delay={i * 50}
                onMouseEnter={() => {
                  setHold(true);
                  setActive(i);
                }}
                onFocus={() => {
                  setHold(true);
                  setActive(i);
                }}
                onBlur={() => setHold(false)}
                onClick={() => setActive(i)}
                className="group relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:px-5"
                style={{
                  borderColor: isActive ? "rgba(215,52,56,0.3)" : "var(--color-line)",
                  background: isActive ? "rgba(215,52,56,0.04)" : "var(--color-paper)",
                  transform: isActive ? "translateX(6px)" : "translateX(0)",
                  boxShadow: isActive
                    ? "0 18px 36px -26px rgba(168,27,34,0.55)"
                    : "none",
                }}
              >
                {/* Spine — fills to full height on the active step */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-[3px] origin-center bg-gradient-to-b from-brand to-brand/25 transition-transform duration-500"
                  style={{ transform: `scaleY(${isActive ? 1 : 0.2})` }}
                />

                <span
                  className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-all duration-300"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, #d73438, #7a1519)"
                      : "rgba(215,52,56,0.08)",
                    color: isActive ? "#ffffff" : "var(--color-brand)",
                  }}
                >
                  <Icon size={19} aria-hidden />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span
                      className="font-display text-xs font-bold tabular-nums transition-colors duration-300"
                      style={{
                        color: isActive ? "var(--color-brand-ink)" : "rgba(26,26,26,0.3)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="text-base font-bold leading-snug transition-colors duration-300"
                      style={{ color: isActive ? "var(--color-brand-ink)" : "var(--color-ink)" }}
                    >
                      {g.title}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink/60">
                    {g.description}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <style>{`
        @keyframes cg-rise {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
