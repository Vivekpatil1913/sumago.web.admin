/**
 * Decorative dark backdrops for inner-page heroes — one distinct animated
 * effect per page, echoing the immersive language of the homepage hero.
 *
 * **Colour.** Every layer here is neutral: white/grey geometry over the
 * homepage's near-black `#0a0708`, lit by the same soft white centre glow the
 * home hero uses. Brand red belongs to the content — headlines, CTAs, the
 * eyebrow pulse — not to the backdrop, so no hero tints the whole viewport red
 * behind the words a visitor is trying to read. Variants differ by *geometry*,
 * never by hue.
 *
 * **No grids.** The square-grid layers (scrolling grid, blueprint grid,
 * perspective floor) are gone: on a full-screen hero they read as a spreadsheet
 * behind the headline rather than as depth. Variants that used them now carry
 * their glow alone. `.fx-grid-static` / `.fx-streaks` remain in globals.css —
 * `brand-gateway.tsx` still uses them, and that surface is intentionally its
 * own visual language.
 *
 * Every layer is aria-hidden and built from GPU-cheap CSS (transform / opacity /
 * background-position). Reduced-motion is neutralized globally (globals.css base
 * layer), so all variants degrade to a calm static state automatically.
 */

export type HeroVariant =
  | "aurora"
  | "blueprint"
  | "grid"
  | "floor"
  | "dots"
  | "streaks"
  | "mesh"
  | "starfield"
  | "spotlight"
  | "orbit"
  | "rings"
  | "constellation"
  | "circuit";

/** A soft light blob, positioned + animated via classes. */
function Blob({ className }: { className: string }) {
  return <div aria-hidden className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />;
}

/* Ambient drifting specks — a subtle always-on layer of live motion shared by
   every variant. Positions/durations are fixed (deterministic, no hydration
   mismatch); reduced-motion neutralizes the drift globally. */
const PARTICLES = [
  { left: "12%", top: "28%", size: 5, dur: 9, color: "rgba(255,255,255,0.85)" },
  { left: "26%", top: "66%", size: 4, dur: 11, color: "rgba(255,255,255,0.8)" },
  { left: "44%", top: "20%", size: 6, dur: 10, color: "rgba(255,255,255,0.7)" },
  { left: "60%", top: "74%", size: 4, dur: 12, color: "rgba(255,255,255,0.7)" },
  { left: "75%", top: "32%", size: 5, dur: 9.5, color: "rgba(255,255,255,0.8)" },
  { left: "88%", top: "56%", size: 4, dur: 11.5, color: "rgba(255,255,255,0.7)" },
  { left: "9%", top: "78%", size: 4, dur: 13, color: "rgba(255,255,255,0.65)" },
  { left: "52%", top: "50%", size: 3, dur: 10.5, color: "rgba(255,255,255,0.6)" },
];

function Particles() {
  return (
    <div aria-hidden className="absolute inset-0">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-[hero-particle_var(--d)_ease-in-out_infinite]"
          style={
            {
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 12px 2px ${p.color}`,
              animationDelay: `${(i % 4) * 0.6}s`,
              ["--d" as string]: `${p.dur}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function HeroEffect({
  variant,
  particles = true,
}: {
  variant: HeroVariant;
  /** Ambient drifting specks. Set false for a clean, dot-free backdrop. */
  particles?: boolean;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Neutral depth glow — the homepage hero's exact centre light, so an
          inner page reads as the same room rather than a different site. */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_35%,rgba(255,255,255,0.05),transparent_70%)]" />
      {renderVariant(variant)}
      {/* Ambient drifting specks — always-on live motion for every page. */}
      {particles ? <Particles /> : null}
      {/* Bottom vignette so the hero melts into the light content below. */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0708] to-transparent" />
    </div>
  );
}

function renderVariant(variant: HeroVariant) {
  switch (variant) {
    /* Drifting light blobs — about. */
    case "aurora":
      return (
        <>
          <Blob className="-left-24 top-0 h-80 w-80 animate-[blob-float_11s_ease-in-out_infinite] bg-white/[0.06]" />
          <Blob className="right-0 top-10 h-72 w-72 animate-[blob-float_14s_ease-in-out_infinite_reverse] bg-white/[0.05]" />
          <Blob className="left-1/3 -bottom-16 h-72 w-72 animate-[blob-float_17s_ease-in-out_infinite] bg-white/[0.04]" />
        </>
      );

    /* Wide overhead wash — solutions. */
    case "blueprint":
      return (
        <>
          <Blob className="left-1/2 -top-24 h-80 w-[36rem] -translate-x-1/2 animate-[blob-float_13s_ease-in-out_infinite] bg-white/[0.06]" />
          <Blob className="-right-20 bottom-0 h-64 w-64 animate-[blob-float_16s_ease-in-out_infinite_reverse] bg-white/[0.04]" />
        </>
      );

    /* Single high glow — careers. */
    case "grid":
      return (
        <Blob className="left-1/4 top-0 h-72 w-72 animate-[blob-float_12s_ease-in-out_infinite] bg-white/[0.06]" />
      );

    /* Low horizon glow — industries detail. */
    case "floor":
      return (
        <Blob className="left-1/2 top-6 h-72 w-[34rem] -translate-x-1/2 animate-[blob-float_13s_ease-in-out_infinite] bg-white/[0.06]" />
      );

    /* Dot matrix drift — blog. */
    case "dots":
      return (
        <>
          <div className="fx-dots absolute inset-0" />
          <Blob className="right-1/4 top-0 h-72 w-72 animate-[blob-float_14s_ease-in-out_infinite_reverse] bg-white/[0.05]" />
        </>
      );

    /* Diagonal light streaks — life at Sumago. */
    case "streaks":
      return (
        <>
          <div className="fx-streaks-mono absolute inset-0" />
          <Blob className="-left-16 top-4 h-72 w-72 animate-[blob-float_15s_ease-in-out_infinite] bg-white/[0.05]" />
          <Blob className="right-0 bottom-0 h-64 w-64 animate-[blob-float_18s_ease-in-out_infinite_reverse] bg-white/[0.04]" />
        </>
      );

    /* Living mesh gradient — industries. */
    case "mesh":
      return <div className="fx-mesh absolute inset-0" />;

    /* Twinkling starfield — impact detail (a nod to the home hero). */
    case "starfield":
      return (
        <>
          <div className="fx-starfield absolute inset-0" />
          <Blob className="left-1/2 -top-20 h-72 w-[32rem] -translate-x-1/2 animate-[blob-float_15s_ease-in-out_infinite] bg-white/[0.05]" />
        </>
      );

    /* Blurred spotlight sweeping side to side — impact. */
    case "spotlight":
      return (
        <div className="absolute left-1/2 top-[40%] -ml-[20rem] -mt-[20rem] h-[40rem] w-[40rem] animate-[hero-sweep_9s_ease-in-out_infinite] rounded-full bg-white/[0.07] blur-[130px]" />
      );

    /* Orbiting nodes — innovation. */
    case "orbit":
      return (
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative h-[34rem] w-[34rem]">
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-[18%] rounded-full border border-white/10" />
            <div className="absolute inset-[36%] rounded-full border border-white/[0.08]" />
            {/* rotating node rings */}
            <div className="absolute inset-0 animate-[hero-spin_26s_linear_infinite]">
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white/90 shadow-[0_0_16px_4px_rgba(255,255,255,0.35)]" />
            </div>
            <div className="absolute inset-[18%] animate-[hero-spin-rev_20s_linear_infinite]">
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-white/80 shadow-[0_0_14px_3px_rgba(255,255,255,0.3)]" />
            </div>
            <div className="absolute inset-[36%] animate-[hero-spin_32s_linear_infinite]">
              <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/80" />
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <div className="h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            </div>
          </div>
        </div>
      );

    /* Radar rings expanding outward — contact. */
    case "rings":
      return (
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative grid h-96 w-96 place-items-center">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="absolute h-96 w-96 rounded-full border border-white/25 animate-[hero-ring_4s_ease-out_infinite]"
                style={{ animationDelay: `${i}s` }}
              />
            ))}
            <span className="h-2.5 w-2.5 rounded-full bg-white/90 shadow-[0_0_18px_5px_rgba(255,255,255,0.35)]" />
          </div>
        </div>
      );

    /* Static constellation with twinkle — team. */
    case "constellation":
      return (
        <>
          <svg
            className="absolute inset-0 h-full w-full animate-[star-twinkle_7s_ease-in-out_infinite]"
            viewBox="0 0 1200 600"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <g stroke="rgba(255,255,255,0.14)" strokeWidth="1">
              <path d="M150 120 L360 220 L520 140 L700 260 L900 180 L1080 300" />
              <path d="M240 420 L430 360 L610 460 L820 380 L1010 470" />
              <path d="M360 220 L430 360 M700 260 L820 380 M520 140 L610 460" />
            </g>
            <g fill="#fff">
              {[
                [150, 120], [360, 220], [520, 140], [700, 260], [900, 180], [1080, 300],
                [240, 420], [430, 360], [610, 460], [820, 380], [1010, 470],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 3 : 2} opacity={0.85} />
              ))}
            </g>
            {/* The two "hub" stars stay brighter and larger, so the graph still
                has a focal point now that colour no longer provides one. */}
            <g fill="#fff">
              <circle cx="700" cy="260" r="3.5" />
              <circle cx="430" cy="360" r="3" />
            </g>
          </svg>
          <Blob className="left-1/2 -top-16 h-64 w-[30rem] -translate-x-1/2 animate-[blob-float_14s_ease-in-out_infinite] bg-white/[0.05]" />
        </>
      );

    /* Flowing circuit traces — service detail. */
    case "circuit":
      return (
        <>
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1200 600"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <g stroke="rgba(255,255,255,0.10)" strokeWidth="1.5">
              <path d="M0 140 H320 V300 H560 V180 H860 V420 H1200" />
              <path d="M0 460 H220 V320 H480 V440 H760 V260 H1040 V400 H1200" />
            </g>
            {/* The travelling pulse — brighter than the trace it runs along, so
                the motion still reads without a colour change. */}
            <g
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2"
              strokeDasharray="16 220"
              className="animate-[hero-dash_5s_linear_infinite]"
            >
              <path d="M0 140 H320 V300 H560 V180 H860 V420 H1200" />
              <path d="M0 460 H220 V320 H480 V440 H760 V260 H1040 V400 H1200" />
            </g>
            <g fill="rgba(255,255,255,0.75)">
              {[[320, 300], [560, 180], [860, 420], [480, 440], [760, 260], [1040, 400]].map(
                ([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="3.5" />
                ),
              )}
            </g>
          </svg>
          <Blob className="-right-16 top-0 h-72 w-72 animate-[blob-float_15s_ease-in-out_infinite_reverse] bg-white/[0.05]" />
        </>
      );
  }
}
