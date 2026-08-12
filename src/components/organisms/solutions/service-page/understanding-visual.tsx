import type { LucideIcon } from "lucide-react";
import { CAPABILITY_ICONS, FALLBACK_CAPABILITY_ICON } from "@/lib/capability-icons";
import type { ServiceWithSlug } from "@/lib/services";
import type { ServicePageContent } from "@/lib/service-page";
import type { MockKind } from "./build-mocks";
import { DeviceReel } from "./device-reel";

/**
 * 02 · THE UNDERSTANDING VISUAL — one per service, and never interchangeable.
 *
 * Section 02 teaches the discipline, and every service now argues it in the same
 * shape the Mobile App Engineering page established: the primer holds the left
 * column, and the thing being explained runs beside it on the right. Before this,
 * only the one service with `heroVisual: "devices"` got a visual and the other
 * fourteen ran a headline-and-column split, so the page's most explanatory
 * section was the one with nothing to look at.
 *
 * ## The rule the set is held to
 *
 * **The animation is the meaning** (the same rule the infrastructure motifs are
 * built on). A request descends the platform's layers, a funnel narrows, a block
 * is appended to a chain, a pipeline promotes a build, a suite goes green. If a
 * visual could be moved to another service without anyone noticing, it is the
 * wrong visual — which is why this is fifteen compositions and not one component
 * with a swapped icon.
 *
 * ## What makes them one family anyway
 *
 * Every visual occupies the identical art box — a 36rem stage, a brand halo, and
 * one floating dark surface with the service's glyph and a live dot in its header
 * — so the section's rhythm, alignment and vertical spacing are the same on all
 * fifteen pages, and only the composition inside the surface changes. Mobile App
 * Engineering keeps its handset (`DeviceReel`), which is the reference this set
 * was drawn to match.
 *
 * ## Distinct from section 04
 *
 * The build mocks in `build-mocks.tsx` are *product screens* — the thing the
 * service ships, in a window or a handset. These are *diagrams* — how the
 * discipline works. Two sections showing the same dashboard twice would read as
 * padding, so no visual here is a screen.
 *
 * ## Cost
 *
 * Server components. No JS, no image, no stock (CLAUDE.md) — every visual is
 * built from tokens already in the system, and every animated node opts into the
 * shared `[data-anim]` primitives declared in globals.css (`sys-*`, plus the two
 * `sv-*` additions this set needed). That layer is compositor-only and is
 * switched off wholesale under `prefers-reduced-motion`, which each composition
 * is authored for: the rest state is the complete, readable state — bars full,
 * traces drawn, blocks placed — so a reader who has asked for stillness loses the
 * motion and none of the meaning.
 *
 * All of it is decorative; the primer beside it carries the argument in text, so
 * every stage is `aria-hidden`.
 */

/* -------------------------------------------------------------------------- */
/*  Motion helper                                                              */
/* -------------------------------------------------------------------------- */

type AnimOpts = {
  ease?: string;
  delay?: string;
  /** Defaults to `infinite` here — these are ambient loops, not hover replies. */
  iter?: string;
  /** A primitive's own variable: `--travel`, `--scan`, `--len`, or an origin. */
  extra?: Record<string, string>;
};

/** Declares an `[data-anim]` node's primitive and timing. See globals.css. */
function av(name: string, dur: string, o: AnimOpts = {}): React.CSSProperties {
  return {
    "--anim": name,
    "--dur": dur,
    "--ease": o.ease ?? "ease-in-out",
    "--delay": o.delay ?? "0s",
    "--iter": o.iter ?? "infinite",
    ...o.extra,
  } as React.CSSProperties;
}

/** `sv-grow-x` scales from the left, so every bar using it must say so. */
const fromLeft = { transformOrigin: "left center" };
/** `sv-grow-y` scales from the floor — columns rise, they don't inflate. */
const fromFloor = { transformOrigin: "bottom center" };

/* -------------------------------------------------------------------------- */
/*  Shared vocabulary                                                          */
/* -------------------------------------------------------------------------- */

const panel = "rounded-xl border border-white/[0.08] bg-white/[0.03] p-3";
const soft = "rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5";

/** A line of "text". Width is a literal Tailwind class, as in the build mocks. */
function Bar({
  w = "w-full",
  tone = "mid",
}: {
  w?: string;
  tone?: "strong" | "mid" | "faint" | "brand";
}) {
  const bg =
    tone === "strong"
      ? "bg-white/45"
      : tone === "faint"
        ? "bg-white/10"
        : tone === "brand"
          ? "bg-brand"
          : "bg-white/22";
  return <span className={`block h-1.5 rounded-full ${w} ${bg}`} />;
}

/** The heading of a sub-block inside a surface — a label, not a sentence. */
function Cap({ w = "w-12" }: { w?: string }) {
  return <span className={`block h-1.5 rounded-full ${w} bg-white/30`} />;
}

/** A meter track whose fill draws itself in. */
function Track({
  pct,
  delay = "0s",
  tone = "brand",
}: {
  pct: number;
  delay?: string;
  tone?: "brand" | "good" | "mute";
}) {
  const bg =
    tone === "good" ? "bg-emerald-400/80" : tone === "mute" ? "bg-white/25" : "bg-brand";
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <span
        data-anim
        data-run="always"
        style={{ width: `${pct}%`, ...av("sv-grow-x", "5.2s", { delay, extra: fromLeft }) }}
        className={`block h-full rounded-full ${bg}`}
      />
    </span>
  );
}

/** A node on a diagram — the dot that is a service, a device, a person. */
function Node({
  delay = "0s",
  tone = "brand",
  size = "h-2.5 w-2.5",
}: {
  delay?: string;
  tone?: "brand" | "mute";
  size?: string;
}) {
  return (
    <span
      data-anim
      data-run="always"
      style={av("sys-blink", "2.4s", { delay })}
      className={`block shrink-0 rounded-full ${size} ${
        tone === "brand"
          ? "bg-brand shadow-[0_0_10px_rgba(215,52,56,0.85)]"
          : "bg-white/30"
      }`}
    />
  );
}

/** A small state marker. */
function Chip({
  w = "w-10",
  tone = "mute",
  delay,
}: {
  w?: string;
  tone?: "brand" | "good" | "warn" | "mute";
  delay?: string;
}) {
  const bg =
    tone === "brand"
      ? "bg-brand/25 border-brand/40"
      : tone === "good"
        ? "bg-emerald-400/15 border-emerald-400/30"
        : tone === "warn"
          ? "bg-amber-400/15 border-amber-400/30"
          : "bg-white/[0.05] border-white/10";
  return (
    <span
      {...(delay ? { "data-anim": "", "data-run": "always", style: av("sys-blink", "3s", { delay }) } : {})}
      className={`block h-4 rounded-full border ${w} ${bg}`}
    />
  );
}

/** The tick that means "confirmed" — used by the chain, the suite, the plan. */
function Tick({ delay = "0s", tone = "good" }: { delay?: string; tone?: "good" | "brand" }) {
  return (
    <span
      data-anim
      data-run="always"
      style={av("sys-pop", "2.8s", { delay })}
      className={`grid h-4 w-4 shrink-0 place-items-center rounded-full ${
        tone === "good" ? "bg-emerald-400/85" : "bg-brand"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="#0f0b0d" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7" />
      </svg>
    </span>
  );
}

/** A packet running down a vertical rail — the request, the build, the record. */
function Descent({
  travel,
  dur = "3.2s",
  delay = "0s",
  className = "",
}: {
  travel: string;
  dur?: string;
  delay?: string;
  className?: string;
}) {
  return (
    <span className={`pointer-events-none absolute ${className}`}>
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.16),rgba(255,255,255,0.03))]" />
      <span
        data-anim
        data-run="always"
        style={av("sv-travel-y", dur, { ease: "cubic-bezier(0.4,0,0.2,1)", delay, extra: { "--travel": travel } })}
        className="absolute left-1/2 top-0 block h-2 w-2 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_12px_rgba(215,52,56,0.95)]"
      />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  The stage                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The art box every visual shares with the handset: same height, same halo, same
 * float. This is the part that must not vary — it is what keeps fifteen
 * different drawings from changing the section's layout fifteen times.
 */
function Stage({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div aria-hidden className="relative mx-auto h-[36rem] w-full max-w-[30rem]">
      <span className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(215,52,56,0.2),transparent_65%)]" />

      {/* The centring wrapper holds the static transform so the float, which is
          also a transform, can live on the surface without fighting it. */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-[34rem] w-[21rem] flex-col rounded-[2rem] border border-white/15 bg-[linear-gradient(160deg,#161113,#0b0809)] p-5 shadow-[0_50px_90px_-40px_rgba(0,0,0,0.9)] motion-safe:animate-[tile-float_7s_ease-in-out_infinite]">
          {/* The header the handset also carries: glyph, title lines, live dot. */}
          <header className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#d73438,#7a1519)]">
              <Icon size={15} strokeWidth={2} className="text-white" />
            </span>
            <span className="flex-1 space-y-1.5">
              <Bar w="w-16" tone="strong" />
              <Bar w="w-10" tone="faint" />
            </span>
            <span
              data-anim
              data-run="always"
              style={av("sys-blink", "1.8s")}
              className="h-2 w-2 shrink-0 rounded-full bg-brand shadow-[0_0_10px_rgba(215,52,56,0.9)]"
            />
          </header>

          <div className="mt-5 min-h-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/*  THE FIFTEEN                                                                */
/* ========================================================================== */

/**
 * Web Platform Engineering — a page request falling through the platform.
 *
 * The argument section 02 makes for this service is that a website is
 * infrastructure rather than a brochure, so the drawing is the stack under the
 * page: the page paints, the request descends edge → application → data, and the
 * performance budget is a gauge with a line on it rather than a hope.
 */
function PlatformStack() {
  const layers = ["Edge / CDN", "Application", "Data"];
  return (
    <div className="flex h-full flex-col gap-3">
      {/* the page, painting in */}
      <div className={panel}>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((d) => (
            <span key={d} className="h-1.5 w-1.5 rounded-full bg-white/20" />
          ))}
          <span className="ml-1.5 h-3 flex-1 rounded-full bg-white/[0.06]" />
        </div>
        <div className="mt-3 overflow-hidden rounded-lg bg-white/[0.05] p-2.5">
          <span
            data-anim
            data-run="always"
            style={av("sv-grow-x", "5.2s", { extra: fromLeft })}
            className="block h-7 w-3/4 rounded bg-[linear-gradient(90deg,rgba(215,52,56,0.55),rgba(215,52,56,0.08))]"
          />
          <div className="mt-2.5 space-y-1.5">
            {["w-full", "w-5/6", "w-2/3"].map((w, i) => (
              <span
                key={w}
                data-anim
                data-run="always"
                style={av("sv-grow-x", "5.2s", { delay: `${0.25 + i * 0.18}s`, extra: fromLeft })}
                className={`block h-1.5 rounded-full bg-white/20 ${w}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* the stack the page actually runs on, with the request descending it */}
      <div className="relative min-h-0 flex-1 space-y-2">
        <Descent travel="150px" className="inset-y-3 left-6 w-2" />
        {layers.map((layer, i) => (
          <div key={layer} className={`flex items-center gap-3 ${soft}`}>
            {/* The layer stays legible; what lights is the tile the request is
                passing through. A whole row cycling its opacity reads as a
                rendering fault rather than as traffic. */}
            <span
              data-anim
              data-run="always"
              style={av("sys-blink", "3.2s", { delay: `${i * 0.55}s` })}
              className="ml-1 h-6 w-6 shrink-0 rounded-md border border-brand/50 bg-brand/20"
            />
            <span className="flex-1 space-y-1.5">
              <Cap w={i === 0 ? "w-16" : i === 1 ? "w-20" : "w-12"} />
              <Bar w="w-2/3" tone="faint" />
            </span>
            <Node delay={`${i * 0.55}s`} size="h-1.5 w-1.5" />
          </div>
        ))}
      </div>

      {/* the budget, with a number attached */}
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Cap w="w-16" />
          <Chip w="w-9" tone="good" />
        </div>
        <div className="mt-2.5 space-y-2">
          {[92, 78, 96].map((pct, i) => (
            <div key={pct} className="flex items-center gap-2">
              <Bar w="w-6" tone="faint" />
              <Track pct={pct} delay={`${i * 0.22}s`} tone={i === 1 ? "mute" : "good"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Digital Growth & Marketing — channels narrowing into customers.
 *
 * The discipline's whole shape is the funnel: many channels at the top, a
 * qualified few at the bottom, and a measurable number at the end. Each channel
 * fires its own packet, the tiers light as volume passes through them, and the
 * conversions rise as columns.
 */
function GrowthFunnel() {
  const tiers = [
    { w: "w-full", label: "w-16" },
    { w: "w-3/4", label: "w-12" },
    { w: "w-1/2", label: "w-10" },
  ];
  return (
    <div className="flex h-full flex-col gap-3">
      {/* the channels */}
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((c) => (
          <div key={c} className={`${soft} flex flex-col items-center gap-2`}>
            <Node delay={`${c * 0.4}s`} size="h-2 w-2" />
            <Bar w="w-8" tone="faint" />
          </div>
        ))}
      </div>

      {/* the descent into the funnel — one packet per channel */}
      <div className="relative h-8">
        {["left-[16%]", "left-1/2", "left-[84%]"].map((pos, i) => (
          <Descent
            key={pos}
            travel="28px"
            dur="2.6s"
            delay={`${i * 0.45}s`}
            className={`inset-y-0 w-2 -translate-x-1/2 ${pos}`}
          />
        ))}
      </div>

      {/* the funnel itself */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2">
        {tiers.map((tier, i) => (
          <div
            key={tier.w}
            className={`flex items-center gap-3 rounded-lg border border-brand/30 bg-[linear-gradient(90deg,rgba(215,52,56,0.3),rgba(215,52,56,0.07))] px-3 py-3 ${tier.w}`}
          >
            <Node delay={`${i * 0.5}s`} size="h-2.5 w-2.5" />
            <span className="flex-1 space-y-1.5">
              <Cap w={tier.label} />
              <Bar w="w-1/2" tone="faint" />
            </span>
          </div>
        ))}
      </div>

      {/* what came out of it */}
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Cap w="w-14" />
          <span className="relative grid h-5 w-5 place-items-center">
            <span
              data-anim
              data-run="always"
              style={av("sys-wave", "2.4s", { ease: "ease-out" })}
              className="absolute inset-0 rounded-full border border-brand/60"
            />
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
        </div>
        <div className="mt-3 flex h-14 items-end gap-1.5">
          {[38, 52, 46, 68, 82, 100].map((h, i) => (
            <span
              key={h}
              data-anim
              data-run="always"
              style={{ height: `${h}%`, ...av("sv-grow-y", "3s", { delay: `${i * 0.14}s`, extra: fromFloor }) }}
              className={`flex-1 rounded-t ${i === 5 ? "bg-brand" : "bg-white/18"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Technology Advisory — the decision, not the build.
 *
 * Three routes leave where the business is today; the advisory work is which one
 * gets drawn all the way to the target and why. So one path completes in brand
 * and carries traffic, the alternatives stay dashed and grey, and the tradeoffs
 * that decided it sit underneath as a scored comparison.
 */
function AdvisoryMap() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className={`${panel} min-h-0 flex-1`}>
        <svg viewBox="0 0 260 200" className="h-full w-full" fill="none">
          {/* where the business is today */}
          <circle cx="26" cy="100" r="9" fill="#d73438" fillOpacity="0.9" />
          <circle
            cx="26"
            cy="100"
            r="16"
            stroke="#d73438"
            strokeOpacity="0.35"
            className="tx-fb"
            data-anim
            data-run="always"
            style={av("sys-wave", "2.8s", { ease: "ease-out" })}
          />

          {/* the routes not taken */}
          {[
            "M40 100 C 110 100, 130 34, 214 40",
            "M40 100 C 110 100, 130 166, 214 160",
          ].map((d, i) => (
            <path
              key={d}
              d={d}
              stroke="#ffffff"
              strokeOpacity="0.16"
              strokeWidth="1.5"
              strokeDasharray="5 6"
              data-anim
              data-run="always"
              style={av("sys-blink", "4s", { delay: `${i * 0.8}s` })}
            />
          ))}
          {[
            { cx: 214, cy: 40 },
            { cx: 214, cy: 160 },
          ].map((c) => (
            <circle key={c.cy} cx={c.cx} cy={c.cy} r="6" fill="#ffffff" fillOpacity="0.14" />
          ))}

          {/* the recommendation — drawn, then carrying traffic */}
          <path
            d="M40 100 C 120 100, 140 100, 208 100"
            stroke="#d73438"
            strokeOpacity="0.85"
            strokeWidth="2.5"
            pathLength={1}
            strokeDasharray={1}
            data-anim
            data-run="always"
            style={av("sys-draw", "3.4s", { ease: "ease-in-out", extra: { "--len": "1" } })}
          />
          <path
            d="M40 100 C 120 100, 140 100, 208 100"
            stroke="#ff5a5d"
            strokeWidth="2.5"
            strokeDasharray="6 26"
            strokeLinecap="round"
            data-anim
            data-run="always"
            style={av("sys-flow", "2.4s", { ease: "linear" })}
          />
          <circle cx="216" cy="100" r="10" fill="#d73438" fillOpacity="0.22" stroke="#d73438" strokeOpacity="0.6" />
          <circle cx="216" cy="100" r="3.5" fill="#ff5a5d" />

          {/* the horizon the whole map is measured against */}
          <path d="M232 24 V 176" stroke="#ffffff" strokeOpacity="0.1" strokeDasharray="3 5" />
        </svg>
      </div>

      {/* why that one — the tradeoffs, scored */}
      <div className={panel}>
        <Cap w="w-20" />
        <div className="mt-3 space-y-2.5">
          {[
            { pct: 88, chosen: true },
            { pct: 54, chosen: false },
            { pct: 37, chosen: false },
          ].map((row, i) => (
            <div key={row.pct} className="flex items-center gap-2.5">
              {row.chosen ? <Tick delay="1.4s" /> : <span className="h-4 w-4 shrink-0 rounded-full border border-white/12" />}
              <span className="flex-1 space-y-1.5">
                <Bar w={row.chosen ? "w-24" : "w-16"} tone={row.chosen ? "strong" : "faint"} />
                <Track pct={row.pct} delay={`${i * 0.25}s`} tone={row.chosen ? "brand" : "mute"} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Program & Delivery Management — the plan, and where it actually is.
 *
 * The discipline is visible work: swimlanes with real dates, milestones that
 * either landed or didn't, and a today-line that keeps moving whether or not the
 * plan does. The bars fill at different rates on purpose — a board where every
 * lane is at the same percentage is a board nobody is reading.
 */
function DeliveryBoard() {
  const lanes = [
    { indent: "ml-0", w: "w-11/12", pct: 100, tone: "good" as const },
    { indent: "ml-4", w: "w-3/4", pct: 100, tone: "good" as const },
    { indent: "ml-8", w: "w-2/3", pct: 72, tone: "brand" as const },
    { indent: "ml-12", w: "w-1/2", pct: 38, tone: "brand" as const },
    { indent: "ml-16", w: "w-1/3", pct: 12, tone: "mute" as const },
  ];
  return (
    <div className="flex h-full flex-col gap-3">
      {/* the board */}
      <div className={`${panel} relative min-h-0 flex-1`}>
        {/* today, moving whether the plan does or not */}
        <span
          data-anim
          data-run="always"
          style={av("sys-packet", "9s", { ease: "linear", extra: { "--travel": "190px" } })}
          className="pointer-events-none absolute inset-y-3 left-16 w-px bg-[linear-gradient(to_bottom,transparent,rgba(215,52,56,0.75),transparent)]"
        />
        <div className="flex h-full flex-col justify-between">
          {lanes.map((lane, i) => (
            <div key={lane.indent} className="flex items-center gap-2.5">
              <span className="w-10 shrink-0">
                <Bar w={i % 2 ? "w-6" : "w-8"} tone="faint" />
              </span>
              <span className={`relative flex-1 ${lane.indent}`}>
                <span
                  data-anim
                  data-run="always"
                  style={av("sv-grow-x", "5.6s", { delay: `${i * 0.18}s`, extra: fromLeft })}
                  className={`block h-4 rounded-md ${lane.w} ${
                    lane.tone === "good"
                      ? "bg-emerald-400/35"
                      : lane.tone === "brand"
                        ? "bg-[linear-gradient(90deg,rgba(215,52,56,0.75),rgba(215,52,56,0.25))]"
                        : "bg-white/12"
                  }`}
                />
              </span>
              <span
                data-anim
                data-run="always"
                style={av("sys-pop", "3.4s", { delay: `${i * 0.3}s` })}
                className={`h-2 w-2 shrink-0 rotate-45 ${
                  lane.pct === 100 ? "bg-emerald-400/80" : "bg-white/20"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* the standing report */}
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Cap w="w-16" />
          <Bar w="w-8" tone="faint" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(["good", "warn", "brand"] as const).map((tone, i) => (
            <div key={tone} className="space-y-2">
              <Chip w="w-full" tone={tone} delay={`${i * 0.5}s`} />
              <Bar w="w-2/3" tone="faint" />
            </div>
          ))}
        </div>
      </div>

      {/* the risk log — the part of the discipline nobody volunteers for */}
      <div className={soft}>
        <div className="flex items-center gap-2.5">
          <Node size="h-1.5 w-1.5" delay="0.6s" />
          <Bar w="flex-1" tone="faint" />
          <Bar w="w-5" tone="faint" />
        </div>
      </div>
    </div>
  );
}

/**
 * Data Analytics & Insights — the distance between having data and knowing.
 *
 * Rows arrive raw and unevenly, pass through one modelling step, and leave as a
 * shape somebody can decide on. The chart is the last third of the drawing, not
 * the whole of it, because the section's argument is that the dashboard is the
 * cheap part.
 */
function InsightPipeline() {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* raw, and not tidy */}
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Cap w="w-10" />
          <Bar w="w-6" tone="faint" />
        </div>
        <div className="mt-2.5 space-y-1.5">
          {["w-full", "w-4/5", "w-11/12", "w-2/3"].map((w, i) => (
            <div
              key={w}
              data-anim
              data-run="always"
              style={av("sys-pop", "2.6s", { delay: `${i * 0.2}s` })}
              className="flex items-center gap-2"
            >
              <span className="h-3 w-3 shrink-0 rounded-sm bg-white/[0.08]" />
              <span className={`block h-1.5 rounded-full bg-white/15 ${w}`} />
            </div>
          ))}
        </div>
      </div>

      {/* the step that costs the money */}
      <div className="relative h-10">
        <Descent travel="34px" dur="2.4s" className="inset-y-0 left-1/2 w-2 -translate-x-1/2" />
      </div>
      <div className={`${soft} flex items-center gap-3`}>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-brand/35 bg-brand/12">
          <span
            data-anim
            data-run="always"
            style={av("hero-spin", "6s", { ease: "linear" })}
            className="block h-4 w-4 rounded-sm border border-brand/70 border-dashed"
          />
        </span>
        <span className="flex-1 space-y-1.5">
          <Cap w="w-20" />
          <Bar w="w-1/2" tone="faint" />
        </span>
      </div>

      {/* what a decision actually looks like */}
      <div className={`${panel} min-h-0 flex-1`}>
        <div className="flex items-center justify-between">
          <span className="space-y-1.5">
            <Cap w="w-12" />
            <span className="block h-3.5 w-16 rounded bg-white/70" />
          </span>
          <Chip w="w-10" tone="good" delay="0.4s" />
        </div>
        <div className="relative mt-3 flex h-24 items-end gap-1.5">
          {[30, 44, 36, 58, 50, 72, 88].map((h, i) => (
            <span
              key={h}
              data-anim
              data-run="always"
              style={{ height: `${h}%`, ...av("sv-grow-y", "3.2s", { delay: `${i * 0.12}s`, extra: fromFloor }) }}
              className={`flex-1 rounded-t ${i === 6 ? "bg-brand" : "bg-white/15"}`}
            />
          ))}
          <svg viewBox="0 0 100 40" className="absolute inset-x-0 bottom-2 h-16 w-full" fill="none" preserveAspectRatio="none">
            <polyline
              points="4,32 20,26 36,29 52,18 68,21 84,10 96,3"
              stroke="#ff5a5d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              data-anim
              data-run="always"
              style={av("sys-draw", "3.6s", { extra: { "--len": "1" } })}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/**
 * Blockchain Solutions — a record nobody can quietly edit.
 *
 * The block is appended, the hash links it to the one before, the network
 * confirms it. That sequence *is* the technology's business case, so it runs as
 * the drawing's spine rather than being illustrated with a generic cube.
 */
function LedgerChain() {
  const blocks = [0, 1, 2, 3];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="relative min-h-0 flex-1 space-y-2.5">
        {/* the hash travelling from each block to the next */}
        <Descent travel="212px" dur="4.2s" className="inset-y-6 left-5 w-2" />

        {/* A block, once written, is exactly what does not move again — so the
            blocks are static and the sequence is carried by the hash running
            down the chain and the confirmations landing behind it. */}
        {blocks.map((b) => (
          <div key={b} className={`${soft} flex items-center gap-3`}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-brand/35 bg-brand/10">
              <span
                data-anim
                data-run="always"
                style={av("sys-blink", "4.4s", { delay: `${b * 0.55}s` })}
                className="h-3 w-3 rounded-sm border border-brand"
              />
            </span>
            <span className="flex-1 space-y-1.5">
              <Bar w="w-2/3" tone="strong" />
              {/* the hash — deliberately the widest thing on the row */}
              <Bar w="w-full" tone="faint" />
            </span>
            <Tick delay={`${0.6 + b * 0.55}s`} />
          </div>
        ))}
      </div>

      {/* the network that has to agree */}
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Cap w="w-16" />
          <Chip w="w-9" tone="good" delay="0.3s" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          {[0, 1, 2, 3, 4].map((n) => (
            <Node key={n} delay={`${n * 0.22}s`} tone={n === 2 ? "brand" : "mute"} size="h-2 w-2" />
          ))}
        </div>
        <div className="mt-3">
          <Track pct={100} tone="good" delay="0.4s" />
        </div>
      </div>

      {/* the contract that runs itself */}
      <div className={soft}>
        <div className="flex items-center gap-2.5">
          <Node size="h-1.5 w-1.5" />
          <Bar w="flex-1" tone="faint" />
          <span
            data-anim
            data-run="always"
            style={av("sys-caret", "1.1s", { ease: "step-end" })}
            className="block h-3 w-0.5 bg-white/60"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * AI & Intelligent Automation — the judgement layer.
 *
 * A mesh carrying signal, and underneath it the thing that makes it commercial:
 * a step that used to be somebody's afternoon now resolving itself while a
 * confidence score is attached to the answer. Automation without the score is
 * the version enterprises won't sign off.
 */
function ModelMesh() {
  const inputs = [30, 66, 102, 138, 174];
  const hidden = [46, 86, 126, 166];
  const outputs = [86, 126];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className={`${panel} min-h-0 flex-1`}>
        <svg viewBox="0 0 240 210" className="h-full w-full" fill="none">
          {/* every edge, quietly carrying */}
          {inputs.map((y1) =>
            hidden.map((y2) => (
              <path
                key={`a${y1}-${y2}`}
                d={`M40 ${y1} L 120 ${y2}`}
                stroke="#ffffff"
                strokeOpacity="0.09"
                strokeWidth="1"
              />
            )),
          )}
          {hidden.map((y1) =>
            outputs.map((y2) => (
              <path
                key={`b${y1}-${y2}`}
                d={`M120 ${y1} L 200 ${y2}`}
                stroke="#ffffff"
                strokeOpacity="0.09"
                strokeWidth="1"
              />
            )),
          )}

          {/* the paths that fired on this pass */}
          {[
            "M40 66 L 120 86 L 200 86",
            "M40 138 L 120 126 L 200 126",
          ].map((d, i) => (
            <path
              key={d}
              d={d}
              stroke="#ff5a5d"
              strokeWidth="1.75"
              strokeDasharray="5 22"
              strokeLinecap="round"
              data-anim
              data-run="always"
              style={av("sys-flow", "2.6s", { ease: "linear", delay: `${i * 0.5}s` })}
            />
          ))}

          {inputs.map((y, i) => (
            <circle
              key={`i${y}`}
              cx="40"
              cy={y}
              r="5"
              fill="#ffffff"
              fillOpacity="0.35"
              className="tx-fb"
              data-anim
              data-run="always"
              style={av("sys-blink", "2.8s", { delay: `${i * 0.15}s` })}
            />
          ))}
          {hidden.map((y, i) => (
            <circle
              key={`h${y}`}
              cx="120"
              cy={y}
              r="6"
              fill="#d73438"
              fillOpacity="0.55"
              className="tx-fb"
              data-anim
              data-run="always"
              style={av("sys-blink", "2.8s", { delay: `${0.3 + i * 0.15}s` })}
            />
          ))}
          {outputs.map((y, i) => (
            <circle
              key={`o${y}`}
              cx="200"
              cy={y}
              r="7"
              fill="#ff5a5d"
              className="tx-fb"
              data-anim
              data-run="always"
              style={av("sys-blink", "2.8s", { delay: `${0.6 + i * 0.15}s` })}
            />
          ))}
        </svg>
      </div>

      {/* the step that used to be somebody's afternoon */}
      <div className={panel}>
        <div className="flex items-center gap-2.5">
          <span className="h-4 w-4 shrink-0 rounded border border-white/12" />
          <Bar w="flex-1" tone="faint" />
        </div>
        <div className="mt-2.5 flex items-center gap-2.5">
          <Tick delay="0.9s" tone="brand" />
          <span
            data-anim
            data-run="always"
            style={av("sv-grow-x", "5.2s", { delay: "0.9s", extra: fromLeft })}
            className="block h-1.5 flex-1 rounded-full bg-white/35"
          />
          <span
            data-anim
            data-run="always"
            style={av("sys-caret", "1.1s", { ease: "step-end" })}
            className="block h-3 w-0.5 shrink-0 bg-brand"
          />
        </div>
      </div>

      {/* the score that makes it signable */}
      <div className={soft}>
        <div className="flex items-center justify-between">
          <Bar w="w-12" tone="faint" />
          <Bar w="w-7" tone="strong" />
        </div>
        <div className="mt-2">
          <Track pct={94} tone="good" delay="0.5s" />
        </div>
      </div>
    </div>
  );
}

/**
 * Managed Outsourcing — capacity that behaves like your own team.
 *
 * A hub with engineers attached to it, each with real availability, sitting
 * inside a coverage band that moves across the working day. The drawing is about
 * continuity, which is why the timezone strip is a first-class element rather
 * than decoration.
 */
function TeamMesh() {
  const members = [
    { pct: 100, tone: "good" as const },
    { pct: 100, tone: "good" as const },
    { pct: 60, tone: "brand" as const },
    { pct: 100, tone: "good" as const },
  ];
  return (
    <div className="flex h-full flex-col gap-3">
      {/* your side, and the spokes out of it */}
      <div className={panel}>
        <div className="flex items-center gap-3">
          <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-brand/40 bg-brand/12">
            <span
              data-anim
              data-run="always"
              style={av("sys-wave", "3s", { ease: "ease-out" })}
              className="absolute inset-0 rounded-full border border-brand/45"
            />
            <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          </span>
          <span className="flex-1 space-y-1.5">
            <Cap w="w-20" />
            <Bar w="w-1/2" tone="faint" />
          </span>
        </div>
      </div>

      {/* the people, and how much of them you have */}
      <div className="min-h-0 flex-1 space-y-2">
        {members.map((m, i) => (
          <div key={i} className={`${soft} flex items-center gap-3`}>
            <span className="relative h-7 w-7 shrink-0 rounded-full bg-white/[0.08]">
              <span className="absolute -right-0.5 -top-0.5">
                <Node delay={`${i * 0.3}s`} tone={m.pct === 100 ? "mute" : "brand"} size="h-2 w-2" />
              </span>
            </span>
            <span className="flex-1 space-y-1.5">
              <Bar w={i % 2 ? "w-20" : "w-16"} tone="strong" />
              <Track pct={m.pct} delay={`${i * 0.2}s`} tone={m.tone} />
            </span>
            <Bar w="w-5" tone="faint" />
          </div>
        ))}
      </div>

      {/* the working day, covered */}
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Cap w="w-14" />
          <Chip w="w-8" tone="good" />
        </div>
        <div className="relative mt-3 h-6 overflow-hidden rounded-md bg-white/[0.05]">
          <div className="absolute inset-0 flex items-center justify-between px-1">
            {Array.from({ length: 12 }, (_, t) => (
              <span key={t} className="h-2 w-px bg-white/12" />
            ))}
          </div>
          <span
            data-anim
            data-run="always"
            style={av("sys-packet", "8s", { ease: "linear", extra: { "--travel": "150px" } })}
            className="absolute inset-y-0 left-0 w-24 rounded-md bg-[linear-gradient(90deg,transparent,rgba(215,52,56,0.35),transparent)]"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * IoT & Connected Products — the product that keeps reporting after it ships.
 *
 * Devices in the field, a gateway, and the thing that separates a connected
 * product from a networked one: a threshold that trips and reaches somebody. The
 * pings are staggered because real estates never report in unison.
 */
function FieldTelemetry() {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* the estate */}
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((d) => (
          <div key={d} className={`${soft} flex flex-col items-center gap-2 py-3`}>
            <span className="relative grid h-8 w-8 place-items-center">
              <span
                data-anim
                data-run="always"
                style={av("sys-wave", "2.8s", { ease: "ease-out", delay: `${d * 0.55}s` })}
                className="absolute inset-0 rounded-full border border-brand/55"
              />
              <span className="h-4 w-4 rounded-md border border-brand/45 bg-brand/15" />
            </span>
            <Bar w="w-7" tone="faint" />
          </div>
        ))}
      </div>

      {/* everything converging on one gateway */}
      <div className="relative h-12">
        {["left-[16%]", "left-1/2", "left-[84%]"].map((pos, i) => (
          <Descent
            key={pos}
            travel="42px"
            dur="2.8s"
            delay={`${i * 0.5}s`}
            className={`inset-y-0 w-2 -translate-x-1/2 ${pos}`}
          />
        ))}
      </div>
      <div className={`${soft} flex items-center gap-3`}>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/12 bg-white/[0.05]">
          <span className="h-3 w-3 rounded-sm bg-brand/70" />
        </span>
        <span className="flex-1 space-y-1.5">
          <Cap w="w-16" />
          <Bar w="w-1/2" tone="faint" />
        </span>
        <Node size="h-2 w-2" delay="0.2s" />
      </div>

      {/* what it is actually saying */}
      <div className={`${panel} min-h-0 flex-1`}>
        <div className="flex items-center justify-between">
          <Cap w="w-12" />
          <Chip w="w-9" tone="warn" delay="0.6s" />
        </div>
        <svg viewBox="0 0 200 90" className="mt-2 h-24 w-full" fill="none" preserveAspectRatio="none">
          {/* the threshold — the line that has to mean something */}
          <path d="M0 26 H200" stroke="#ffb020" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 6" />
          <polyline
            points="2,72 24,64 46,68 68,52 90,58 112,38 134,44 156,20 178,30 198,16"
            stroke="#ff5a5d"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            data-anim
            data-run="always"
            style={av("sys-draw", "4s", { extra: { "--len": "1" } })}
          />
        </svg>
        <div className="mt-1 flex items-center gap-2">
          <Node size="h-1.5 w-1.5" delay="0.8s" />
          <Bar w="flex-1" tone="faint" />
        </div>
      </div>
    </div>
  );
}

/**
 * Enterprise Software Engineering — the system the business runs on.
 *
 * Channels on top, the services that hold the rules in the middle, the systems
 * of record underneath, and traffic crossing all of it. The point of the drawing
 * is that the work is integration and load, not screens — so nothing here is a
 * screen.
 */
function SystemFabric() {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* what talks to it */}
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Cap w="w-14" />
          <Bar w="w-6" tone="faint" />
        </div>
        <div className="relative mt-3 grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((c) => (
            <span key={c} className="h-7 rounded-md border border-white/10 bg-white/[0.04]" />
          ))}
          <span
            data-anim
            data-run="always"
            style={av("sys-packet", "3.6s", { ease: "linear", extra: { "--travel": "196px" } })}
            className="absolute -bottom-1.5 left-0 h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_10px_rgba(215,52,56,0.9)]"
          />
        </div>
      </div>

      {/* where the rules live */}
      <div className="min-h-0 flex-1 space-y-2">
        {[0, 1, 2].map((s) => (
          <div key={s} className={`${soft} flex items-center gap-3`}>
            <span
              data-anim
              data-run="always"
              style={av("sys-blink", "3.6s", { delay: `${s * 0.6}s` })}
              className="h-7 w-1 shrink-0 rounded-full bg-brand"
            />
            <span className="flex-1 space-y-1.5">
              <Bar w={s === 1 ? "w-24" : "w-16"} tone="strong" />
              <Bar w="w-1/2" tone="faint" />
            </span>
            <span className="w-12 shrink-0">
              <Track pct={[86, 64, 92][s]} delay={`${s * 0.25}s`} tone="mute" />
            </span>
          </div>
        ))}
      </div>

      {/* what it is never allowed to lose */}
      <div className={panel}>
        <div className="flex items-center gap-2.5">
          {[0, 1].map((d) => (
            <span key={d} className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] p-2">
              <span className="block h-1 w-8 rounded-full bg-white/25" />
              <span className="mt-2 block h-5 rounded bg-white/[0.07]" />
              <span className="mt-1.5 block h-5 rounded bg-white/[0.05]" />
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2.5">
          <Bar w="w-10" tone="faint" />
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <span
              data-anim
              data-run="always"
              style={av("sys-meter", "3.4s", { extra: fromLeft })}
              className="block h-full w-full rounded-full bg-brand"
            />
          </span>
          <Node size="h-1.5 w-1.5" delay="0.4s" />
        </div>
      </div>
    </div>
  );
}

/**
 * Product Engineering — the version after the first one.
 *
 * A product is a sequence of releases against evidence, so the drawing is the
 * spine: ship, learn, ship again, with adoption drawn underneath. A single
 * launch moment would illustrate the opposite of what this service sells.
 */
function ProductRoadmap() {
  const releases = [
    { done: true, w: "w-20" },
    { done: true, w: "w-16" },
    { done: false, w: "w-24" },
    { done: false, w: "w-14" },
  ];
  return (
    <div className="flex h-full flex-col gap-3">
      {/* the releases */}
      <div className={`${panel} relative min-h-0 flex-1`}>
        <span className="pointer-events-none absolute inset-y-4 left-[1.55rem] w-px bg-[linear-gradient(to_bottom,rgba(215,52,56,0.5),rgba(255,255,255,0.06))]" />
        <div className="relative flex h-full flex-col justify-between">
          {releases.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              {r.done ? (
                <Tick delay={`${i * 0.5}s`} tone="brand" />
              ) : (
                <span
                  data-anim
                  data-run="always"
                  style={av("sys-pop", "3.6s", { delay: `${i * 0.5}s` })}
                  className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-white/20 bg-[#0f0b0d]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                </span>
              )}
              <span className="flex-1 space-y-1.5">
                <Bar w={r.w} tone={r.done ? "strong" : "mid"} />
                <Bar w="w-1/3" tone="faint" />
              </span>
              <Chip w="w-8" tone={r.done ? "brand" : "mute"} />
            </div>
          ))}
        </div>
      </div>

      {/* what each release is actually made of */}
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((m) => (
          <span
            key={m}
            data-anim
            data-run="always"
            style={av("sys-pop", "3s", { delay: `${m * 0.25}s` })}
            className="block h-10 rounded-lg border border-white/10 bg-white/[0.04]"
          />
        ))}
      </div>

      {/* and whether anyone used it */}
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Cap w="w-16" />
          <span className="block h-3.5 w-12 rounded bg-white/70" />
        </div>
        <svg viewBox="0 0 200 60" className="mt-2 h-14 w-full" fill="none" preserveAspectRatio="none">
          <path
            d="M2 54 C 50 52, 74 40, 104 30 C 138 19, 166 12, 198 6"
            stroke="#ff5a5d"
            strokeWidth="2.25"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            data-anim
            data-run="always"
            style={av("sys-draw", "3.8s", { extra: { "--len": "1" } })}
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * Cloud & DevOps Engineering — the path from commit to production.
 *
 * Four gates, a build moving through them, and the two things that make it an
 * engineering discipline rather than a script: capacity that follows demand, and
 * a way back. The rollback arc is drawn deliberately — it is the promise that
 * makes shipping on a Friday a non-event.
 */
function DeployPipeline() {
  const stages = ["Commit", "Build", "Test", "Deploy"];
  return (
    <div className="flex h-full flex-col gap-3">
      {/* the gates */}
      <div className="relative min-h-0 flex-1 space-y-2">
        <Descent travel="188px" dur="4s" className="inset-y-4 left-5 w-2" />
        {stages.map((stage, i) => (
          <div key={stage} className={`${soft} flex items-center gap-3`}>
            {/* The gate is always there; what moves is which one the build is
                currently sitting in. */}
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-brand/35 bg-brand/10">
              <Node delay={`${i * 0.6}s`} size="h-2 w-2" />
            </span>
            <span className="flex-1 space-y-1.5">
              <Bar w={i === 3 ? "w-16" : "w-20"} tone="strong" />
              <Bar w="w-1/2" tone="faint" />
            </span>
            <Tick delay={`${0.4 + i * 0.6}s`} />
          </div>
        ))}
      </div>

      {/* capacity following demand */}
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Cap w="w-16" />
          <Bar w="w-6" tone="faint" />
        </div>
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {[0, 1, 2, 3, 4].map((n) => (
            <span
              key={n}
              {...(n > 2
                ? { "data-anim": "", "data-run": "always", style: av("sys-pop", "3.2s", { delay: `${(n - 3) * 0.4}s` }) }
                : {})}
              className={`block h-8 rounded-md border ${
                n > 2 ? "border-brand/40 bg-brand/12" : "border-white/10 bg-white/[0.05]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* the way back */}
      <div className={soft}>
        <svg viewBox="0 0 200 26" className="h-6 w-full" fill="none">
          <path
            d="M186 6 C 140 26, 60 26, 14 8"
            stroke="#ffffff"
            strokeOpacity="0.35"
            strokeWidth="1.75"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            data-anim
            data-run="always"
            style={av("sys-draw", "3.4s", { extra: { "--len": "1" } })}
          />
          <path d="M14 8 L 20 4 M14 8 L 20 13" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Experience Design (UI/UX) — the resolve from structure to interface.
 *
 * The wireframe is drawn first and stays visible underneath, because the
 * argument of the section is that design is decided at the structure and only
 * finished at the surface. A cursor works across it; the system beneath it is a
 * set of tokens, not a picture.
 */
function DesignCanvas() {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* The artboard, alternating between the two states of the same screen.
          Both layers have to be fully legible on their own: the fade is a
          resolve from structure to surface, and a wireframe too faint to read is
          just an empty box for half the cycle. */}
      <div className={`${panel} relative min-h-0 flex-1`}>
        {/* the structure — boxes, an alignment guide, a measure */}
        <div className="absolute inset-3 space-y-2">
          <span className="flex h-10 items-center justify-center rounded-lg border border-dashed border-white/30">
            <span className="block h-px w-2/3 bg-white/20" />
          </span>
          <span className="block h-16 rounded-lg border border-dashed border-white/30" />
          <span className="block h-8 w-2/3 rounded-lg border border-dashed border-white/30" />
          <span className="absolute -top-1 left-1/3 bottom-0 w-px bg-brand/35" />
        </div>

        {/* the surface it becomes */}
        <div
          data-anim
          data-run="always"
          style={av("sys-blink", "6s")}
          className="relative space-y-2"
        >
          <span className="block h-10 rounded-lg bg-[linear-gradient(120deg,rgba(215,52,56,0.75),rgba(215,52,56,0.2))]" />
          <span className="block h-16 rounded-lg bg-white/[0.16]" />
          <span className="block h-8 w-2/3 rounded-lg bg-white/[0.12]" />
        </div>

        {/* somebody deciding — the pointer, and the thing it is over */}
        <span
          data-anim
          data-run="always"
          style={av("sys-cursor", "6s", { ease: "cubic-bezier(0.4,0,0.2,1)" })}
          className="absolute left-10 top-12 z-10 block"
        >
          <span className="absolute -left-2.5 -top-2.5 block h-7 w-7 rounded-full border border-brand/70 bg-brand/15" />
          <svg viewBox="0 0 24 24" className="relative h-4 w-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" fill="#fff">
            <path d="M5 2 L 19 12 L 12.5 13 L 16 20 L 13 21.5 L 9.5 14.5 L 5 18 Z" />
          </svg>
        </span>
      </div>

      {/* the system it is all drawn from — a palette reads as a palette only if
          it is actually there, so the swatches are fixed and the selection is
          what moves across them */}
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Cap w="w-14" />
          <Bar w="w-6" tone="faint" />
        </div>
        <div className="relative mt-3 flex items-center gap-1.5">
          {["bg-brand", "bg-white/75", "bg-white/40", "bg-white/20", "bg-white/10"].map((c) => (
            <span key={c} className={`h-6 flex-1 rounded ${c}`} />
          ))}
          <span
            data-anim
            data-run="always"
            style={av("sys-packet", "6s", { ease: "steps(5, jump-none)", extra: { "--travel": "232px" } })}
            className="pointer-events-none absolute -inset-y-1 left-0 w-[3.25rem] rounded-md border-2 border-brand"
          />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((c) => (
            <span key={c} className="block h-7 rounded-md border border-white/10 bg-white/[0.04]" />
          ))}
        </div>
      </div>

      {/* what it was tested against */}
      <div className={soft}>
        <div className="flex items-center gap-2.5">
          <Tick delay="0.8s" />
          <Bar w="flex-1" tone="faint" />
          <Bar w="w-6" tone="strong" />
        </div>
      </div>
    </div>
  );
}

/**
 * Quality Engineering — the gate, and what stands behind it.
 *
 * A suite running, one failure held in brand rather than hidden, coverage as a
 * number, and a release gate that is either open or it isn't. The failing row is
 * the honest part of the drawing: a suite that is always green is a suite nobody
 * trusts.
 */
function QualityGate() {
  const rows = [0, 1, 2, 3, 4, 5];
  const failing = 3;
  return (
    <div className="flex h-full flex-col gap-3">
      {/* the run */}
      <div className={`${panel} min-h-0 flex-1`}>
        <div className="flex items-center justify-between">
          <Cap w="w-14" />
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <Bar w="w-6" tone="faint" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <Bar w="w-4" tone="faint" />
          </span>
        </div>
        <div className="mt-3 space-y-2.5">
          {rows.map((r) => (
            <div key={r} className="flex items-center gap-2.5">
              {r === failing ? (
                <span
                  data-anim
                  data-run="always"
                  style={av("sys-blink", "1.6s")}
                  className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand"
                >
                  <span className="block h-0.5 w-2 rounded-full bg-white" />
                </span>
              ) : (
                <Tick delay={`${r * 0.22}s`} />
              )}
              <Bar w="flex-1" tone={r === failing ? "strong" : "faint"} />
              <Bar w="w-5" tone="faint" />
            </div>
          ))}
        </div>
      </div>

      {/* coverage, as a number somebody owns */}
      <div className={panel}>
        <div className="flex items-center justify-between">
          <Cap w="w-16" />
          <span className="block h-3.5 w-10 rounded bg-white/70" />
        </div>
        <div className="mt-2.5">
          <Track pct={86} tone="good" delay="0.3s" />
        </div>
      </div>

      {/* the gate */}
      <div className={`${soft} flex items-center gap-3`}>
        <span className="relative grid h-9 w-9 shrink-0 place-items-center">
          <svg viewBox="0 0 32 36" className="absolute inset-0 h-full w-full" fill="none">
            <path
              d="M16 2 L 29 7 V 18 C 29 27, 22 32, 16 34 C 10 32, 3 27, 3 18 V 7 Z"
              stroke="#d73438"
              strokeOpacity="0.75"
              strokeWidth="2"
              pathLength={1}
              strokeDasharray={1}
              data-anim
              data-run="always"
              style={av("sys-draw", "3.6s", { extra: { "--len": "1" } })}
            />
          </svg>
          <span className="relative">
            <Tick delay="1.2s" tone="brand" />
          </span>
        </span>
        <span className="flex-1 space-y-1.5">
          <Bar w="w-20" tone="strong" />
          <Bar w="w-1/2" tone="faint" />
        </span>
        <Chip w="w-9" tone="good" delay="1.2s" />
      </div>
    </div>
  );
}

/* ========================================================================== */
/*  The switch                                                                 */
/* ========================================================================== */

/**
 * Which visual a service gets.
 *
 * Keyed on the resolved `buildMock` rather than the slug: it is already one
 * distinct value per service, `resolveServicePage` derives it for a service that
 * only exists in the admin panel, and it means a new service picks up a visual
 * by describing what it produces instead of by being added to a second list.
 */
function bodyFor(kind: MockKind) {
  switch (kind) {
    case "browser": return <PlatformStack />;
    case "analytics": return <GrowthFunnel />;
    case "blueprint": return <AdvisoryMap />;
    case "board": return <DeliveryBoard />;
    case "bi": return <InsightPipeline />;
    case "ledger": return <LedgerChain />;
    case "assistant": return <ModelMesh />;
    case "team": return <TeamMesh />;
    case "telemetry": return <FieldTelemetry />;
    case "console": return <SystemFabric />;
    case "multi": return <ProductRoadmap />;
    case "pipeline": return <DeployPipeline />;
    case "canvas": return <DesignCanvas />;
    case "testboard": return <QualityGate />;
    /* "phone" never reaches here — it is the handset, handled below — and an
       unrecognised kind gets the system drawing rather than nothing. */
    default: return <SystemFabric />;
  }
}

/** Section 02's right-hand column, for any service. */
export function UnderstandingVisual({
  service,
  content,
}: {
  service: ServiceWithSlug;
  content: ServicePageContent;
}) {
  /* The reference: a service whose product *is* the device shows the device. */
  if (content.buildMock === "phone" || content.hero.visual === "devices") {
    return <DeviceReel service={service} />;
  }

  const Icon = CAPABILITY_ICONS[service.icon] ?? FALLBACK_CAPABILITY_ICON;
  return <Stage icon={Icon}>{bodyFor(content.buildMock)}</Stage>;
}
