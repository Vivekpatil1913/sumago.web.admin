"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { industryPageCopy as copy } from "@/lib/industry-page-copy";
import { renderCopy } from "@/lib/rich-text";
import type { IndustryPointRecord, IndustryRecord } from "@/lib/cms";
import { cn } from "@/lib/utils";

/**
 * "See what changes" — the transformation band on every industry page.
 *
 * THE IDEA
 * The page has already named the friction and named what gets built for it.
 * This band is where a visitor *sees* the two connected: the sector's state
 * today on one side, where it lands on the other, and between them a working
 * instrument that reconfigures itself into whichever outcome is selected.
 *
 *   where it stands today  →  [ the core ]  →  where it lands
 *
 * Selecting an outcome does three things at once — it lights the friction it
 * came from, lights the outcome it produces, and rebuilds the core into the
 * shape of the work that gets it there. That pairing is the page's signature
 * device (`challenges[i]` / `solutions[i]` / `outcomes[i]` are authored in step
 * in lib/industries.ts); here it becomes something operated rather than read.
 *
 * THE CORE
 * Three scenes, and in each one the animation *is* the meaning — the same rule
 * the infrastructure motifs are built on. A scene that could be swapped for
 * another without anyone noticing would be the wrong scene:
 *
 *   signal    a route with live pings travelling it            → tracking
 *   flow      work descending one spine while the manual       → automation
 *             steps beside it are removed
 *   network   a graph drawing itself outward onto a single     → scale
 *             reporting surface
 *
 * The scene follows the outcome's index (`i % 3`), not its wording: all ten
 * industries author the three arrays in step and in the same order — what gets
 * faster or clearer first, what gets cheaper or safer next, what scales last.
 * So nothing here is written per industry: a new sector stays a data edit
 * (lib/industries.ts) and the chrome stays one object (industry-page-copy.ts).
 *
 * BUDGET (CLAUDE.md — performance is a release gate)
 * Every scene is inline SVG animating compositor-only properties (transform,
 * opacity, stroke-dashoffset), declared through the `[data-tx-anim]` system in
 * globals.css. That system is gated on `.tx-live`, which an IntersectionObserver
 * adds only while the band is on screen — an unseen core animates nothing. One
 * instrument is rendered, not one per breakpoint, and the only per-frame JS is
 * a rAF-throttled pointer write of two custom properties (no React state).
 *
 * REDUCED MOTION
 * Every scene is authored to read complete standing still — route drawn, stages
 * labelled, network fully expanded — so removing the animation removes no
 * content. Self-cycling and the pointer parallax switch off with it.
 */

/** How long an outcome holds before the core moves itself on. */
const CYCLE_MS = 5600;

type SceneMode = "signal" | "flow" | "network";

const SCENES: readonly SceneMode[] = ["signal", "flow", "network"] as const;

/** The core's readout — what the instrument reports it is doing. */
const READOUT: Record<SceneMode, readonly [string, string, string]> = {
  signal: ["Live", "Tracking", "Monitoring"],
  flow: ["Input", "Automating", "Output"],
  network: ["Nodes", "Connected", "Scaling"],
};

/** Mode name in the core's header — and the description assistive tech gets. */
const SCENE_NAME: Record<SceneMode, string> = {
  signal: "Real-time signal",
  flow: "Automated workflow",
  network: "Connected system",
};

/* -------------------------------------------------------------------------- */
/*  Animation declaration                                                      */
/* -------------------------------------------------------------------------- */

type AnimOpts = {
  ease?: string;
  delay?: string;
  /** Defaults to `infinite` — these are ambient loops, not entrances. */
  iter?: string;
  /** Extra custom properties a primitive reads (`--travel`, `--lo`). */
  extra?: Record<string, string>;
};

/** Names a `[data-tx-anim]` primitive and its timing. See globals.css. */
function av(name: string, dur: string, o: AnimOpts = {}): React.CSSProperties {
  return {
    "--anim": name,
    "--dur": dur,
    "--ease": o.ease ?? "linear",
    "--delay": o.delay ?? "0s",
    "--iter": o.iter ?? "infinite",
    ...o.extra,
  } as React.CSSProperties;
}

/* -------------------------------------------------------------------------- */
/*  Scenes                                                                     */
/* -------------------------------------------------------------------------- */

/** One coordinate system for all three scenes, so the core never shifts. */
const BOX = 240;

/** A technical label inside a scene. Kept short — the box is 240 units wide. */
function Tag({
  x,
  y,
  children,
  lit = false,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: string;
  lit?: boolean;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill="#fff"
      fillOpacity={lit ? 0.95 : 0.6}
      className="font-display text-[7px] font-bold uppercase tracking-[0.16em]"
    >
      {children}
    </text>
  );
}

/**
 * Scene 01 — live tracking. A real route with waypoints, a pulse running it end
 * to end, and each waypoint reporting in on its own beat. The sweep behind it
 * is the monitor rather than decoration: it is what makes "nothing moves
 * unobserved" legible even in a still frame.
 */
function SignalScene() {
  const route = "M26 190 L78 142 L126 164 L174 96 L214 54";
  const waypoints: ReadonlyArray<readonly [number, number]> = [
    [26, 190],
    [78, 142],
    [126, 164],
    [174, 96],
    [214, 54],
  ];

  return (
    <>
      <path
        d="M22 206 H220 M26 202 V44"
        stroke="#fff"
        strokeOpacity="0.1"
        strokeWidth="1"
      />
      {[62, 106, 150, 194].map((y) => (
        <path
          key={y}
          d={`M22 ${y} H30`}
          stroke="#fff"
          strokeOpacity="0.14"
          strokeWidth="1"
        />
      ))}

      {/* The monitor sweep. */}
      <rect
        x="26"
        y="40"
        width="194"
        height="1.2"
        fill="url(#txSweep)"
        data-tx-anim
        style={av("tx-scan", "5.2s", { extra: { "--travel": "166px" } })}
      />

      {/* The route, and the live pulse running it. */}
      <path
        d={route}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.18"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={route}
        pathLength={1}
        fill="none"
        stroke="#ff5a5d"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="0.09 1"
        data-tx-anim
        style={av("tx-run", "3.6s", { ease: "cubic-bezier(0.45,0,0.55,1)" })}
      />

      {waypoints.map(([x, y], i) => (
        <g key={`${x}-${y}`}>
          <circle
            cx={x}
            cy={y}
            r="7"
            fill="none"
            stroke="#d73438"
            strokeWidth="1"
            className="tx-fb"
            data-tx-anim
            style={av("tx-ring", "3.6s", {
              delay: `${(i * 0.68).toFixed(2)}s`,
            })}
          />
          <circle
            cx={x}
            cy={y}
            r="3.4"
            fill="#0d0c0d"
            stroke="#fff"
            strokeOpacity="0.45"
            strokeWidth="1.2"
          />
          <circle
            cx={x}
            cy={y}
            r="1.5"
            fill="#ff5a5d"
            data-tx-anim
            style={av("tx-lit", "3.6s", {
              delay: `${(i * 0.68).toFixed(2)}s`,
              extra: { "--lo": "0.3" },
            })}
          />
        </g>
      ))}

      <Tag x={26} y={32}>
        Live route
      </Tag>
      <Tag x={214} y={32} anchor="end" lit>
        Tracked
      </Tag>
      <Tag x={26} y={224}>
        Nothing moves unobserved
      </Tag>
    </>
  );
}

/**
 * Scene 02 — workflow automation. Work descends one spine through the stages,
 * and the two manual steps beside it are removed on a loop. The disappearance
 * is the point: automation shown as work leaving the picture, not as one more
 * box added to it.
 */
function FlowScene() {
  const stages = [
    { y: 30, label: "Input", lit: false },
    { y: 90, label: "Automation", lit: true },
    { y: 150, label: "Process", lit: false },
    { y: 202, label: "Output", lit: false },
  ];
  const H = 28;
  const X = 62;
  const W = 116;

  return (
    <>
      {/* Connectors, drawn before the stages that sit on them. */}
      {stages.slice(0, -1).map((s, i) => {
        const next = stages[i + 1].y;
        return (
          <g key={s.label}>
            <path
              d={`M120 ${s.y + H} V ${next - 5}`}
              stroke="#fff"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
            <path
              d={`M116.5 ${next - 6} L120 ${next - 1} L123.5 ${next - 6}`}
              fill="none"
              stroke="#fff"
              strokeOpacity="0.32"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })}

      {stages.map((s, i) => (
        <g key={s.label}>
          <rect
            x={X}
            y={s.y}
            width={W}
            height={H}
            rx="6"
            fill={s.lit ? "rgba(215,52,56,0.12)" : "rgba(255,255,255,0.035)"}
            stroke={s.lit ? "#d73438" : "#fff"}
            strokeOpacity={s.lit ? 0.75 : 0.14}
            strokeWidth="1"
          />
          {/* The stage lighting as the work reaches it. */}
          <rect
            x={X}
            y={s.y}
            width="2.5"
            height={H}
            rx="1.25"
            fill="#ff5a5d"
            data-tx-anim
            style={av("tx-lit", "4.4s", {
              delay: `${(i * 0.5).toFixed(2)}s`,
              extra: { "--lo": "0.15" },
            })}
          />
          <Tag x={120} y={s.y + 18} anchor="middle" lit={s.lit}>
            {s.label}
          </Tag>
        </g>
      ))}

      {/* The work itself, descending. */}
      {[0, 1].map((i) => (
        <rect
          key={i}
          x="117"
          y="60"
          width="6"
          height="9"
          rx="3"
          fill="#ff5a5d"
          data-tx-anim
          style={av("tx-travel-y", "4.4s", {
            delay: `${(i * 2.2).toFixed(2)}s`,
            ease: "cubic-bezier(0.5,0,0.5,1)",
            extra: { "--travel": "146px" },
          })}
        />
      ))}

      {/* The manual steps, being automated out. */}
      {[
        { x: 6, y: 98, label: "Manual" },
        { x: 186, y: 156, label: "Rework" },
      ].map((m, i) => (
        <g
          key={m.label}
          className="tx-fb"
          data-tx-anim
          style={av("tx-vanish", "4.4s", {
            delay: `${(1 + i * 2.2).toFixed(2)}s`,
          })}
        >
          <rect
            x={m.x}
            y={m.y}
            width="48"
            height="22"
            rx="5"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.28"
            strokeDasharray="3 3"
          />
          <Tag x={m.x + 24} y={m.y + 14} anchor="middle">
            {m.label}
          </Tag>
        </g>
      ))}

      <Tag x={120} y={18} anchor="middle">
        One path, no hand-offs
      </Tag>
    </>
  );
}

/**
 * Scene 03 — the connected system. A graph that draws itself outward tier by
 * tier and lands on a single reporting surface. Growth shown as reach arriving
 * and then joining up, which is what "scalable" has to mean if it is not going
 * to stay an adjective.
 */
function NetworkScene() {
  const root = { x: 120, y: 44 } as const;
  const tier2 = [
    { x: 68, y: 110 },
    { x: 172, y: 110 },
  ] as const;
  const tier3 = [
    { x: 30, y: 166 },
    { x: 86, y: 166 },
    { x: 154, y: 166 },
    { x: 210, y: 166 },
  ] as const;
  const surface = { x: 62, y: 202, w: 116, h: 26 } as const;

  /** Edges by tier — the tier index is also its beat in the expansion. */
  const edges: ReadonlyArray<{ d: string; tier: number }> = [
    ...tier2.map((n) => ({
      d: `M${root.x} ${root.y + 8} L${n.x} ${n.y - 7}`,
      tier: 0,
    })),
    ...tier3.map((n, i) => {
      const parent = tier2[i < 2 ? 0 : 1];
      return { d: `M${parent.x} ${parent.y + 7} L${n.x} ${n.y - 6}`, tier: 1 };
    }),
    ...tier3.map((n) => ({
      d: `M${n.x} ${n.y + 6} L${n.x < 120 ? 96 : 144} ${surface.y - 1}`,
      tier: 2,
    })),
  ];

  const beat = (tier: number) => `${(tier * 0.55).toFixed(2)}s`;
  const EASE = "cubic-bezier(0.33,1,0.68,1)";

  return (
    <>
      {edges.map((e) => (
        <path
          key={e.d}
          d={e.d}
          pathLength={1}
          fill="none"
          stroke="#d73438"
          strokeOpacity="0.55"
          strokeWidth="1"
          strokeDasharray="1"
          data-tx-anim
          style={av("tx-draw", "5.4s", { delay: beat(e.tier), ease: EASE })}
        />
      ))}

      {/* Root — always present. The system starts from something already running. */}
      <circle
        cx={root.x}
        cy={root.y}
        r="8"
        fill="#0d0c0d"
        stroke="#ff5a5d"
        strokeWidth="1.4"
      />
      <circle cx={root.x} cy={root.y} r="3" fill="#ff5a5d" />

      {(
        [
          { nodes: tier2, r: 6.5, tier: 1 },
          { nodes: tier3, r: 5.5, tier: 2 },
        ] as const
      ).map(({ nodes, r, tier }) =>
        nodes.map((n) => (
          <g
            key={`${n.x}-${n.y}`}
            className="tx-fb"
            data-tx-anim
            style={av("tx-grow", "5.4s", { delay: beat(tier), ease: EASE })}
          >
            <circle
              cx={n.x}
              cy={n.y}
              r={r}
              fill="#0d0c0d"
              stroke="#fff"
              strokeOpacity="0.45"
              strokeWidth="1.2"
            />
            <circle cx={n.x} cy={n.y} r="2" fill="#fff" fillOpacity="0.7" />
          </g>
        )),
      )}

      {/* The reporting surface everything lands on. */}
      <g
        className="tx-fb"
        data-tx-anim
        style={av("tx-grow", "5.4s", { delay: beat(3), ease: EASE })}
      >
        <rect
          x={surface.x}
          y={surface.y}
          width={surface.w}
          height={surface.h}
          rx="6"
          fill="rgba(215,52,56,0.12)"
          stroke="#d73438"
          strokeOpacity="0.75"
          strokeWidth="1"
        />
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={surface.x + 12 + i * 32}
            y={surface.y + 8}
            width="22"
            height="10"
            rx="2"
            fill="#ff5a5d"
            data-tx-anim
            style={av("tx-lit", "3.2s", {
              delay: `${(i * 0.35).toFixed(2)}s`,
              extra: { "--lo": "0.25" },
            })}
          />
        ))}
      </g>

      <Tag x={120} y={22} anchor="middle">
        Extended, not replaced
      </Tag>
    </>
  );
}

const SCENE_BODY: Record<SceneMode, () => React.JSX.Element> = {
  signal: SignalScene,
  flow: FlowScene,
  network: NetworkScene,
};

/* -------------------------------------------------------------------------- */
/*  Chrome                                                                     */
/* -------------------------------------------------------------------------- */

/** The band's system labels — one type treatment, used everywhere in it. */
function SysLabel({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-display text-[0.62rem] font-bold uppercase tracking-[0.2em]",
        className,
      )}
      {...props}
    />
  );
}

/** Corner bracket — the instrument's frame, four to a panel. */
function Bracket({ at }: { at: "tl" | "tr" | "bl" | "br" }) {
  const pos = {
    tl: "left-3 top-3 border-l border-t",
    tr: "right-3 top-3 border-r border-t",
    bl: "bottom-3 left-3 border-b border-l",
    br: "bottom-3 right-3 border-b border-r",
  }[at];
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute h-3 w-3 border-white/20",
        pos,
      )}
    />
  );
}

/** Data crossing the gap — into the core below `lg`, across it above. */
function Conduit({ side }: { side: "in" | "out" }) {
  const into = side === "in";
  return (
    <>
      {/* Stacked layout: down the page. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 h-10 w-px -translate-x-1/2 lg:hidden",
          into
            ? "bottom-full bg-gradient-to-b from-white/10 to-brand/60"
            : "top-full bg-gradient-to-b from-brand/60 to-brand/20",
        )}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute -left-px top-0 h-1 w-1 rounded-full bg-brand-bright"
            data-tx-anim
            style={av("tx-travel-y", "2.4s", {
              delay: `${(i * 0.8).toFixed(1)}s`,
              extra: { "--travel": "40px" },
            })}
          />
        ))}
      </span>

      {/* Wide layout: across the gap. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 hidden h-px w-6 -translate-y-1/2 lg:block",
          into
            ? "right-full bg-gradient-to-r from-white/10 to-brand/60"
            : "left-full bg-gradient-to-r from-brand/60 to-brand/20",
        )}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute -top-px left-0 h-1 w-1 rounded-full bg-brand-bright"
            data-tx-anim
            style={av("tx-travel-x", "2.4s", {
              delay: `${(i * 0.8).toFixed(1)}s`,
              extra: { "--travel": "24px" },
            })}
          />
        ))}
      </span>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Core                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The instrument. Header reports the mode, the scene carries the meaning, the
 * readout names what the mode is doing — the three parts a piece of operational
 * software has, which is the register this band is reaching for rather than
 * "a diagram on a dark background".
 */
function Core({
  mode,
  sceneKey,
  via,
  reduce,
}: {
  mode: SceneMode;
  sceneKey: number;
  via?: IndustryPointRecord;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const Scene = SCENE_BODY[mode];

  /* Pointer parallax: two custom properties, written from a rAF and read by
     the layers below in CSS. A re-render per pointer move would cost far more
     than the effect is worth, so React state is deliberately not involved. */
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduce || e.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.setProperty("--tx-x", x.toFixed(3));
        el.style.setProperty("--tx-y", y.toFixed(3));
      });
    },
    [reduce],
  );

  const onPointerLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tx-x", "0");
    el.style.setProperty("--tx-y", "0");
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate overflow-hidden rounded-2xl border border-white/12 bg-[#0d0c0d] shadow-[0_40px_90px_-50px_rgba(215,52,56,0.6)]"
    >
      {/* Ambient bloom — the deepest parallax layer. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_44%,rgba(215,52,56,0.2),transparent_72%)] transition-transform duration-500 ease-out"
        style={{
          transform:
            "translate3d(calc(var(--tx-x, 0) * 10px), calc(var(--tx-y, 0) * 10px), 0)",
        }}
      />
      {/* Slow counter-rotating geometry, well under the scene. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid place-items-center transition-transform duration-500 ease-out"
        style={{
          transform:
            "translate3d(calc(var(--tx-x, 0) * 4px), calc(var(--tx-y, 0) * 4px), 0)",
        }}
      >
        <span
          className="block aspect-square w-[74%] rounded-full border border-dashed border-white/[0.07]"
          data-tx-anim
          style={av("tx-orbit", "64s")}
        />
        <span
          className="absolute block aspect-square w-[48%] rotate-45 border border-white/[0.06]"
          data-tx-anim
          style={av("tx-orbit-rev", "88s")}
        />
      </span>

      <Bracket at="tl" />
      <Bracket at="tr" />
      <Bracket at="bl" />
      <Bracket at="br" />

      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-3.5">
        <SysLabel className="text-white/55">{copy.outcomes.coreLabel}</SysLabel>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-brand-bright"
            data-tx-anim
            style={av("tx-blink", "1.8s", { ease: "steps(1, end)" })}
          />
          <SysLabel className="text-brand-bright">{SCENE_NAME[mode]}</SysLabel>
        </span>
      </div>

      {/* The scene. Keyed on the active outcome, so the instrument visibly
          reconfigures rather than cross-fading in place. */}
      <div
        className="relative aspect-square w-full transition-transform duration-500 ease-out"
        style={{
          transform:
            "translate3d(calc(var(--tx-x, 0) * -6px), calc(var(--tx-y, 0) * -6px), 0)",
        }}
      >
        <svg
          key={sceneKey}
          viewBox={`0 0 ${BOX} ${BOX}`}
          aria-hidden
          focusable="false"
          className="tx-scene absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="txSweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d73438" stopOpacity="0" />
              <stop offset="50%" stopColor="#d73438" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#d73438" stopOpacity="0" />
            </linearGradient>
          </defs>
          <Scene />
        </svg>
      </div>

      <div className="border-t border-white/[0.08] px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {READOUT[mode].map((chip, i) => (
            <span key={chip} className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className={cn(
                  "h-1 w-1 rounded-full",
                  i === 0 ? "bg-brand-bright" : "bg-white/30",
                )}
                data-tx-anim={i === 0 ? "" : undefined}
                style={
                  i === 0
                    ? av("tx-blink", "1.4s", { ease: "steps(1, end)" })
                    : undefined
                }
              />
              <SysLabel className={i === 0 ? "text-white/80" : "text-white/55"}>
                {chip}
              </SysLabel>
            </span>
          ))}
        </div>
        {via ? (
          <p className="mt-3 border-t border-white/[0.06] pt-3 text-sm leading-snug text-white/60">
            <span className="font-display text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/55">
              {copy.outcomes.viaLabel}
            </span>{" "}
            <span className="font-medium text-white">{via.title}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Before / after                                                             */
/* -------------------------------------------------------------------------- */

/**
 * One side of the change. Both sides render every row at all times — selecting
 * an outcome changes emphasis, never presence — so nothing a visitor is reading
 * can vanish from under them and the two columns stay comparable.
 */
function StateColumn({
  label,
  caption,
  rows,
  active,
  tone,
}: {
  label: string;
  caption: string;
  rows: string[];
  active: number;
  tone: "before" | "after";
}) {
  const after = tone === "after";

  return (
    <div className={cn("flex flex-col", after && "lg:text-right")}>
      <div className={cn("flex items-center gap-2", after && "lg:justify-end")}>
        <span
          aria-hidden
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            after ? "bg-brand" : "bg-white/25",
          )}
        />
        <SysLabel className={after ? "text-brand-bright" : "text-white/55"}>
          {label}
        </SysLabel>
      </div>
      <p className="mt-2 text-sm leading-snug text-white/55">{caption}</p>

      <ul className="mt-6 space-y-2.5">
        {rows.map((row, i) => {
          const on = i === active;
          return (
            <li
              key={row}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-500",
                after && "lg:flex-row-reverse",
                on
                  ? after
                    ? "border-brand/45 bg-brand/[0.1] shadow-[0_20px_44px_-30px_rgba(215,52,56,0.9)]"
                    : "border-white/20 bg-white/[0.06]"
                  : "border-white/[0.07] bg-white/[0.02]",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "shrink-0 transition-colors duration-500",
                  after
                    ? cn(
                        "h-1.5 w-1.5 rounded-full",
                        on ? "bg-brand-bright" : "bg-white/25",
                      )
                    : cn(
                        "h-2.5 w-2.5 rotate-45 border",
                        on ? "border-white/55" : "border-white/20",
                      ),
                )}
              />
              <span
                className={cn(
                  "min-w-0 flex-1 text-[0.9rem] font-medium leading-snug transition-colors duration-500",
                  /* De-emphasis is carried by colour alone, never by an
                     `opacity` on the row: stacking the two put the friction
                     titles — real content — under the AA floor on this
                     background (docs/13). Nothing here goes below white/55. */
                  after
                    ? on
                      ? "text-white"
                      : "text-white/70"
                    : on
                      ? "text-white/90"
                      : "text-white/55",
                )}
              >
                {row}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Band                                                                       */
/* -------------------------------------------------------------------------- */

export function Transformation({
  industry,
  id,
  className,
}: {
  industry: IndustryRecord;
  id?: string;
  className?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  /* Once a visitor drives the core, it stops driving itself — for good. */
  const [pinned, setPinned] = useState(false);
  const [live, setLive] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const outcomes = industry.outcomes;
  const count = outcomes.length;
  const frictions = industry.challenges.map((c) => c.title);

  /* Nothing animates until the band is on screen (see globals.css). */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      {
        rootMargin: "10% 0px",
        threshold: 0,
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* The outcomes come forward one at a time while the band is being looked at,
     which is what makes the core read as running rather than as waiting to be
     clicked. It hands over the moment anyone touches it. */
  useEffect(() => {
    if (!live || pinned || reduce || count < 2) return;
    const t = setInterval(() => setActive((i) => (i + 1) % count), CYCLE_MS);
    return () => clearInterval(t);
  }, [live, pinned, reduce, count]);

  const select = useCallback((i: number) => {
    setActive(i);
    setPinned(true);
  }, []);

  /* Tabs pattern: arrows move and activate, focus follows selection. */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
      const next: Record<string, number> = {
        ArrowRight: (i + 1) % count,
        ArrowDown: (i + 1) % count,
        ArrowLeft: (i - 1 + count) % count,
        ArrowUp: (i - 1 + count) % count,
        Home: 0,
        End: count - 1,
      };
      const to = next[e.key];
      if (to === undefined) return;
      e.preventDefault();
      select(to);
      tabsRef.current[to]?.focus();
    },
    [count, select],
  );

  if (!count) return null;

  const mode = SCENES[active % SCENES.length];
  const via = industry.solutions[active];
  const cycling = live && !pinned && !reduce && count > 1;

  return (
    <Section
      ref={sectionRef}
      dark
      id={id}
      className={cn(
        "relative isolate scroll-mt-32 overflow-hidden bg-[#111112]",
        live && "tx-live",
        className,
      )}
    >
      {/* The drafting surface, arriving with the band. */}
      <span
        aria-hidden
        className={cn(
          "tx-grid pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-1000 ease-out",
          live && "opacity-100",
        )}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(52%_42%_at_50%_0%,rgba(215,52,56,0.16),transparent_70%)]"
      />

      <SectionHeading
        tone="dark"
        eyebrow={copy.outcomes.eyebrow}
        title={renderCopy(copy.outcomes.title, {}, "dark")}
        description={
          copy.outcomes.description
            ? renderCopy(copy.outcomes.description, { industry: industry.name })
            : undefined
        }
      />

      {/* DOM order is tablist → panel, per the tabs pattern; `order` puts the
          instrument above its controls on screen, where it belongs. */}
      <div className="mt-14 flex flex-col md:mt-16">
        {/* ---- The outcomes, as the core's controls ---- */}
        <div
          role="tablist"
          aria-label={copy.outcomes.selectorLabel}
          className="order-2 mx-auto mt-12 grid w-full max-w-xl gap-3 lg:max-w-none lg:grid-cols-3"
        >
          {outcomes.map((outcome, i) => {
            const on = i === active;
            const built = industry.solutions[i];
            return (
              <button
                key={outcome}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tx-tab-${i}`}
                aria-selected={on}
                aria-controls="tx-core-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "group relative overflow-hidden rounded-xl border px-5 py-4 text-left transition-all duration-300",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-bright",
                  on
                    ? "border-brand/50 bg-brand/[0.09] shadow-[0_24px_50px_-34px_rgba(215,52,56,0.95)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]",
                )}
              >
                <span className="flex items-baseline gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      "font-display text-xs font-bold tabular-nums transition-colors duration-300",
                      on ? "text-brand-bright" : "text-white/55",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-base font-bold leading-snug tracking-tight transition-colors duration-300",
                      on
                        ? "text-white"
                        : "text-white/65 group-hover:text-white/85",
                    )}
                  >
                    {outcome}
                  </span>
                </span>
                {built ? (
                  <span
                    className={cn(
                      "mt-1.5 block pl-[1.9rem] text-xs leading-snug transition-colors duration-300",
                      on ? "text-white/70" : "text-white/55",
                    )}
                  >
                    {built.title}
                  </span>
                ) : null}

                {/* Dwell bar — shows the core is about to move itself on, and
                    goes the moment a visitor takes over. */}
                {on && cycling ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-px origin-left bg-brand-bright/70"
                    data-tx-anim
                    style={av("tx-dwell", `${CYCLE_MS}ms`, { iter: "1" })}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* ---- The interface: one instrument, laid out two ways ---- */}
        <div
          className={cn(
            /* Stacked, and held to a readable column, until there is room to
               set the three beats across — `max-w-xl` is what keeps the tablet
               layout from reading as three stretched bands. */
            "order-1 mx-auto grid w-full max-w-xl items-center gap-10 lg:max-w-none lg:gap-6",
            frictions.length
              ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)_minmax(0,1fr)]"
              : "lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]",
          )}
        >
          {frictions.length ? (
            <div data-aos="fade-up">
              <StateColumn
                label={copy.outcomes.beforeLabel}
                caption={copy.outcomes.beforeCaption}
                rows={frictions}
                active={active}
                tone="before"
              />
            </div>
          ) : null}

          <div
            id="tx-core-panel"
            role="tabpanel"
            aria-labelledby={`tx-tab-${active}`}
            /* The panel holds no focusable child, so it takes the tab stop
               itself — otherwise its description is unreachable by keyboard. */
            tabIndex={0}
            data-aos="fade-up"
            data-aos-delay={90}
            className="relative mx-auto w-full max-w-md rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-bright lg:max-w-none"
          >
            {frictions.length ? <Conduit side="in" /> : null}
            <Conduit side="out" />
            <Core mode={mode} sceneKey={active} via={via} reduce={reduce} />
            <p className="sr-only">
              {outcomes[active]}
              {via
                ? ` — ${copy.outcomes.viaLabel.toLowerCase()} ${via.title}.`
                : "."}{" "}
              {SCENE_NAME[mode]}.
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay={180}>
            <StateColumn
              label={copy.outcomes.afterLabel}
              caption={copy.outcomes.afterCaption}
              rows={outcomes}
              active={active}
              tone="after"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
