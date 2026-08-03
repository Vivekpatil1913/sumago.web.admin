"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Search,
  Route,
  Blocks,
  PenTool,
  Code2,
  ShieldCheck,
  Rocket,
  GraduationCap,
  TrendingUp,
  Circle,
  Flag,
  Sparkles,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { company } from "@/lib/site";
import { processSteps, clientNames } from "@/lib/content";

const PROCESS_ICONS: Record<string, LucideIcon> = {
  Search, Route, Blocks, PenTool, Code2, ShieldCheck, Rocket, GraduationCap, TrendingUp,
};

/* ---- Straight road geometry — the ≥lg layout (single, static frame) ------ */
const H = 300; // frame height (px)
const MID = 150; // road centre (y)
const NODE = 46; // node diameter
const CONN = 26; // connector length from node out to the title
const PAD = 4; // horizontal inset (%) so edge nodes aren't clipped
const LABEL_W = 156; // title label width (px)

/* ---- Vertical rail geometry — the <lg layout ----------------------------- */
const V_NODE = 44; // node diameter (px)
const V_RAIL = 3; // rail thickness (px)
const V_GAP = 30; // vertical space between one node and the next (px)

/* Progress-loop timing — advance, pause at each stage, advance again. */
const PAUSE_MS = 1500; // dwell on each stage
const TRAVEL_MS = 950; // travel time between stages (larger = slower)

/* Inactive (not-yet-reached) look. */
const GREY_NODE = "#c4c9d4";
const GREY_LINE = "rgba(148, 163, 184, 0.5)";
const GREY_LABEL = "#9aa2b1";

/* Colour groups — 2 stops per group; node fills go light shade → mid primary. */
const GROUP_COLORS: { light: string; mid: string }[] = [
  // Sumago red nodes — rounded-square with a white icon.
  { light: "#ff7a7c", mid: "#d73438" },
  { light: "#ff7a7c", mid: "#d73438" },
  { light: "#ff7a7c", mid: "#d73438" },
  { light: "#ff7a7c", mid: "#d73438" },
];
const groupOf = (i: number) => GROUP_COLORS[Math.floor(i / 2) % GROUP_COLORS.length];

/** hex → rgba string, for tints/glows derived from a stage colour. */
function rgba(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

type Stop =
  | { kind: "start" | "end"; label: string; Icon: LucideIcon }
  | { kind: "step"; step: (typeof processSteps)[number]; num: number };

/** Fill of a lit node — the brushed metallic red, shared by both layouts. */
const NODE_FILL =
  "linear-gradient(177deg,#ffb3b4 0%,#ef4a4e 20%,#d73438 40%,#8f1418 52%,#c1282c 66%,#ff8f91 100%)";
/** Fill of the travelled road/rail. */
const ROAD_FILL = "linear-gradient(90deg, #0a0a0c, #17171a)";

/** Icon, title and React key for a stop, whichever kind it is. */
function stopParts(s: Stop) {
  return s.kind === "step"
    ? { Icon: PROCESS_ICONS[s.step.icon] ?? Circle, title: s.step.title, key: s.step.title }
    : { Icon: s.Icon, title: s.label, key: s.kind };
}

/**
 * The progress front, 0 → 1: dwell on each stage, travel to the next, and loop.
 * Shared by both layouts so only one rAF loop ever runs.
 */
function useRoadProgress(N: number) {
  const reduce = useReducedMotion();
  const [p, setP] = useState(reduce ? 1 : 0);

  // Stepped schedule: dwell at each stage, then travel to the next, and loop.
  const { phases, total } = useMemo(() => {
    const seg = 1 / (N - 1);
    const phases: { t0: number; t1: number; p0: number; p1: number }[] = [];
    let t = 0;
    for (let k = 0; k < N; k++) {
      const pk = k * seg;
      phases.push({ t0: t, t1: t + PAUSE_MS, p0: pk, p1: pk }); // pause on stage k
      t += PAUSE_MS;
      if (k < N - 1) {
        phases.push({ t0: t, t1: t + TRAVEL_MS, p0: pk, p1: (k + 1) * seg }); // travel
        t += TRAVEL_MS;
      }
    }
    return { phases, total: t };
  }, [N]);

  useEffect(() => {
    if (reduce) {
      const r = requestAnimationFrame(() => setP(1));
      return () => cancelAnimationFrame(r);
    }
    const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
    let raf = 0;
    let start: number | null = null;
    const loop = (t: number) => {
      if (start === null) start = t;
      const e = (t - start) % total;
      let val = 1;
      for (const ph of phases) {
        if (e < ph.t1) {
          const f = ph.t1 === ph.t0 ? 1 : (e - ph.t0) / (ph.t1 - ph.t0);
          val = ph.p0 + (ph.p1 - ph.p0) * ease(f);
          break;
        }
      }
      setP(val);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce, phases, total]);

  return p;
}

/**
 * The road, laid out horizontally — ≥lg only. Eleven 156px labels need roughly
 * 1000px of track before same-side neighbours start colliding, so narrower
 * viewports get `VerticalRoad` instead.
 */
function HorizontalRoad({ stops, p }: { stops: Stop[]; p: number }) {
  const N = stops.length;
  return (
    <div className="relative mx-auto" style={{ height: H }}>
      {/* Road: grey asphalt track + colour progress fill + dashed centre line */}
      <div
        aria-hidden
        className="absolute"
        style={{ left: `${PAD}%`, right: `${PAD}%`, top: MID, transform: "translateY(-50%)" }}
      >
        <div className="relative h-3.5 overflow-hidden rounded-full shadow-[0_9px_18px_-6px_rgba(0,0,0,0.25)]">
          {/* upcoming road — soft, light, blurred */}
          <div aria-hidden className="absolute inset-0 bg-[#c9cdd6] blur-[1.5px]" />
          {/* completed road — turns black, clipped from the right to reveal progress */}
          <div
            className="absolute inset-0"
            style={{ background: ROAD_FILL, clipPath: `inset(0 ${(100 - p * 100).toFixed(2)}% 0 0)` }}
          />
          {/* dashed centre line */}
          <div className="absolute inset-x-4 top-1/2 h-[3px] -translate-y-1/2 opacity-80 [background:repeating-linear-gradient(90deg,#ffffff_0_14px,transparent_14px_40px)]" />
          {/* glowing progress head */}
          <div
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-[3px]"
            style={{ left: `${(p * 100).toFixed(2)}%`, opacity: p > 0.001 && p < 0.999 ? 0.85 : 0 }}
          />
        </div>
      </div>

      {/* Stops */}
      {stops.map((s, i) => {
        const pct = PAD + (i / (N - 1)) * (100 - 2 * PAD);
        const above = i % 2 === 1;
        const g = groupOf(i);
        const color = g.mid;
        const active = p >= i / (N - 1) - 1e-4;
        const { Icon, title, key } = stopParts(s);
        /* The label is centred on its node, but clamped to the frame so the
           first and last never hang off the edge — that overhang was pushing
           the whole document sideways and giving every page an x-scrollbar. */
        const labelLeft = `clamp(0px, calc(${pct}% - ${LABEL_W / 2}px), calc(100% - ${LABEL_W}px))`;

        return (
          <div key={key}>
            {/* connector */}
            <div
              className="absolute z-0 w-0.5 -translate-x-1/2 transition-colors duration-500"
              style={{
                left: `${pct}%`,
                top: above ? MID - NODE / 2 - CONN : MID + NODE / 2,
                height: CONN,
                backgroundColor: active ? rgba(color, 0.5) : GREY_LINE,
              }}
            />
            {/* node */}
            <div
              className="absolute z-10 flex items-center justify-center rounded-[26%] border-2 text-white transition-all duration-500"
              style={{
                left: `${pct}%`,
                top: MID,
                width: NODE,
                height: NODE,
                transform: `translate(-50%,-50%) scale(${active ? 1 : 0.9})`,
                background: active ? NODE_FILL : GREY_NODE,
                borderColor: active ? g.mid : GREY_NODE,
                opacity: active ? 1 : 0.9,
                filter: active ? "none" : "blur(1.6px) saturate(0.6)",
                boxShadow: active
                  ? `0 8px 22px -6px ${rgba(color, 0.8)}`
                  : "0 6px 14px -8px rgba(0,0,0,0.3)",
              }}
            >
              <Icon size={s.kind === "step" ? 20 : 18} strokeWidth={2} aria-hidden />
            </div>
            {/* title label (only) */}
            <div
              className="absolute z-10 flex justify-center px-1 text-center transition-all duration-500"
              style={
                above
                  ? {
                      left: labelLeft,
                      bottom: H - (MID - NODE / 2 - CONN),
                      width: LABEL_W,
                      alignItems: "flex-end",
                      filter: active ? "none" : "blur(1px)",
                    }
                  : {
                      left: labelLeft,
                      top: MID + NODE / 2 + CONN,
                      width: LABEL_W,
                      filter: active ? "none" : "blur(1px)",
                    }
              }
            >
              <span
                className="text-base font-bold leading-snug transition-all duration-500 md:text-lg"
                style={{
                  color: active ? "#1a1a1a" : GREY_LABEL,
                  transform: active ? "scale(1)" : "scale(0.95)",
                }}
              >
                {title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The same journey, laid out as a vertical rail — the <lg layout. Not the
 * horizontal road shrunk: read top-to-bottom, every title gets the full column
 * width, and each stop carries its own connector segment so the geometry needs
 * no measurement and rows are free to grow when a title wraps.
 */
function VerticalRoad({ stops, p }: { stops: Stop[]; p: number }) {
  const N = stops.length;
  const seg = 1 / (N - 1);

  return (
    <ol className="relative mx-auto max-w-md sm:max-w-lg">
      {stops.map((s, i) => {
        const g = groupOf(i);
        const active = p >= i * seg - 1e-4;
        // Share of the connector below this stop that the front has travelled.
        const travelled = Math.min(Math.max((p - i * seg) / seg, 0), 1);
        const { Icon, title, key } = stopParts(s);
        const last = i === N - 1;

        return (
          <li
            key={key}
            className="relative flex items-start gap-4"
            style={{ paddingBottom: last ? 0 : V_GAP }}
          >
            {/* Rail down to the next node — grey base with the travelled fill
                clipped in from the bottom. */}
            {last ? null : (
              <span
                aria-hidden
                className="absolute overflow-hidden rounded-full"
                style={{
                  left: V_NODE / 2,
                  top: V_NODE,
                  bottom: 0,
                  width: V_RAIL,
                  transform: "translateX(-50%)",
                }}
              >
                <span className="absolute inset-0" style={{ background: GREY_LINE }} />
                <span
                  className="absolute inset-0"
                  style={{
                    background: ROAD_FILL,
                    clipPath: `inset(0 0 ${((1 - travelled) * 100).toFixed(2)}% 0)`,
                  }}
                />
              </span>
            )}

            {/* Node */}
            <span
              className="relative z-10 grid shrink-0 place-items-center rounded-[26%] border-2 text-white transition-all duration-500"
              style={{
                width: V_NODE,
                height: V_NODE,
                transform: `scale(${active ? 1 : 0.9})`,
                background: active ? NODE_FILL : GREY_NODE,
                borderColor: active ? g.mid : GREY_NODE,
                filter: active ? "none" : "blur(1.6px) saturate(0.6)",
                boxShadow: active
                  ? `0 8px 22px -6px ${rgba(g.mid, 0.8)}`
                  : "0 6px 14px -8px rgba(0,0,0,0.3)",
              }}
            >
              <Icon size={s.kind === "step" ? 20 : 18} strokeWidth={2} aria-hidden />
            </span>

            {/* Title — `min-h` of one node keeps a single line optically centred
                against it, while a wrapped title simply grows downward. */}
            <span
              className="flex min-w-0 flex-1 items-center text-base font-bold leading-snug transition-all duration-500 sm:text-lg"
              style={{
                minHeight: V_NODE,
                color: active ? "#1a1a1a" : GREY_LABEL,
                filter: active ? "none" : "blur(1px)",
              }}
            >
              {title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Animated progress road: stops begin grey + blurred; a colour front travels
 * from the start and lights each stage one-by-one, then holds and loops.
 *
 * Two layouts, one progress value — the horizontal road needs ~1000px of track
 * for eleven labels, so below `lg` the journey reads as a vertical rail instead.
 * Both trees render and CSS picks one: `display:none` keeps the hidden layout
 * out of the accessibility tree, and a single `useRoadProgress` means one rAF
 * loop rather than one per layout.
 */
function RoadTimeline({ stops }: { stops: Stop[] }) {
  const p = useRoadProgress(stops.length);
  return (
    <>
      <div className="lg:hidden">
        <VerticalRoad stops={stops} p={p} />
      </div>
      <div className="hidden lg:block">
        <HorizontalRoad stops={stops} p={p} />
      </div>
    </>
  );
}

/**
 * The transparent engagement path — every stop on one straight road, in a
 * single static frame. A progress front lights the stages one-by-one, on loop.
 */
export function ProcessSection() {
  const stops: Stop[] = [
    { kind: "start", label: "Your journey starts here", Icon: Flag },
    ...processSteps.map((step, i) => ({ kind: "step" as const, step, num: i + 1 })),
    { kind: "end", label: "Live, supported & evolving", Icon: Sparkles },
  ];

  return (
    <Section className="bg-journey">
      <SectionHeading
        wide
        eyebrow="How we work"
        title={
          <>
            A transparent, structured delivery process —{" "}
            <span className="text-metal-red-shine">from planning to production.</span>
          </>
        }
        description="From the first conversation to long after launch, every engagement follows one visible path — clear milestones, honest updates, and a team accountable at every single step."
      />

      <Reveal className="mt-12">
        <RoadTimeline stops={stops} />
      </Reveal>
    </Section>
  );
}

/** Edge-fade + overflow clip shared by both client marquee strips. */
const CLIENT_STRIP_MASK =
  "relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]";

/** Split the roster into two strips so they can scroll in opposite directions. */
const clientRowA = clientNames.filter((_, i) => i % 2 === 0);
const clientRowB = clientNames.filter((_, i) => i % 2 === 1);

/**
 * One client on the marquee. Text chip today; drop a logo image in
 * `public/clients/` and render it here once display consent is confirmed.
 */
function ClientChip({ name }: { name: string }) {
  return (
    <span className="mx-2 inline-flex shrink-0 items-center rounded-lg border border-white/12 bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm">
      {name}
    </span>
  );
}

/** Certifications + clients — demonstrated trust, centered on a dark band. */
export function TrustIndicators() {
  return (
    <section className="relative overflow-hidden bg-blueprint text-white">
      <div className="container-page py-16 md:py-22">
        {/* Heading */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-bright">
            Trusted &amp; certified
          </p>
          <h2 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
            Credibility you can <span className="text-metal-red-shine">independently verify.</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/65">
            ISO 9001:2015 and CMMI Level 5 certified, and trusted by governments, enterprises,
            and startups worldwide — proof that stands on its own.
          </p>
        </Reveal>

        {/* Certifications */}
        <Reveal className="mt-8 flex flex-wrap justify-center gap-3">
          {company.certifications.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-2 rounded-full border border-brand-bright/30 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm"
            >
              <BadgeCheck size={16} className="text-brand-bright" />
              {c}
            </span>
          ))}
        </Reveal>

        {/* Client roster — two strips scrolling in opposite directions */}
        <Reveal className="mt-14 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-white/45">
            Trusted by 50+ government, 500+ domestic &amp; 60+ international clients
          </p>
          <div className="mt-8 flex flex-col gap-4">
            {/* Row 1 → scrolls left */}
            <div className={CLIENT_STRIP_MASK}>
              <div className="flex w-max animate-[marquee-x_45s_linear_infinite]">
                {[...clientRowA, ...clientRowA].map((name, i) => (
                  <ClientChip key={`a-${name}-${i}`} name={name} />
                ))}
              </div>
            </div>
            {/* Row 2 → scrolls right */}
            <div className={CLIENT_STRIP_MASK}>
              <div className="flex w-max animate-[marquee-x_45s_linear_infinite_reverse]">
                {[...clientRowB, ...clientRowB].map((name, i) => (
                  <ClientChip key={`b-${name}-${i}`} name={name} />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-6 text-xs text-white/35">
            Client names shown as text — logos displayed with permission.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
