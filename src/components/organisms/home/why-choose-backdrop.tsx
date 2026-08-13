"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Shared frame for the two map-space layers (coastlines and the delivery
 * graph). They must be positioned identically or the nodes drift off their
 * continents — the parallax rates differ between them on purpose, but the base
 * geometry cannot.
 *
 * Both fill `WhyChooseMap`'s own box rather than the section, because the map
 * is no longer a wash behind the type: it is its own band, between the headline
 * and the promise panel, with nothing set over it.
 *
 * `meet`, not `slice` — the viewBox is wider than it is tall, and `slice` on a
 * shorter box would crop to a magnified strip of the Atlantic instead of
 * showing the world.
 */
const MAP_FRAME =
  "pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_78%_86%_at_50%_50%,black_46%,transparent_88%)]";

/**
 * World coastlines, equirectangular, in a 1000×500 viewBox.
 *
 * Generated from lon/lat vertex lists — `x = (lon + 180) × 1000/360`,
 * `y = (90 − lat) × 500/180` — rather than drawn by eye, so the continents land
 * in the right places relative to one another. Deliberately low-vertex: this is
 * a watermark rendered as ~1.1px dots at low opacity, and extra coastline
 * detail would cost path data nobody can resolve. Antarctica is omitted, as it
 * is on every map of this kind — it would smear a solid band across the bottom.
 */
const CONTINENTS = [
  /* North America */
  "M33.3 69.4 L55.6 91.7 L111.1 83.3 L138.9 100 L155.6 138.9 L175 161.1 L208.3 188.9 L230.6 205.6 L244.4 208.3 L269.4 225 L275 180.6 L277.8 161.1 L305.6 133.3 L333.3 119.4 L347.2 105.6 L319.4 83.3 L283.3 55.6 L236.1 50 L152.8 55.6 L69.4 61.1 Z",
  /* Greenland */
  "M375 83.3 L347.2 61.1 L361.1 38.9 L416.7 22.2 L438.9 38.9 L430.6 61.1 L394.4 77.8 Z",
  /* South America */
  "M275 250 L291.7 263.9 L305.6 300 L305.6 333.3 L300 366.7 L294.4 397.2 L311.1 402.8 L327.8 361.1 L338.9 344.4 L366.7 319.4 L394.4 286.1 L402.8 272.2 L377.8 255.6 L361.1 238.9 L333.3 222.2 L300 216.7 L283.3 227.8 Z",
  /* Africa */
  "M452.8 208.3 L452.8 191.7 L472.2 172.2 L500 158.3 L530.6 147.2 L569.4 161.1 L597.2 163.9 L619.4 216.7 L641.7 216.7 L616.7 252.8 L611.1 291.7 L597.2 316.7 L588.9 330.6 L555.6 347.2 L550 341.7 L533.3 297.2 L525 252.8 L500 236.1 L477.8 238.9 L463.9 225 Z",
  /* Eurasia */
  "M472.2 150 L475 130.6 L494.4 116.7 L511.1 105.6 L522.2 88.9 L513.9 77.8 L533.3 61.1 L569.4 52.8 L611.1 61.1 L666.7 55.6 L708.3 47.2 L777.8 38.9 L861.1 47.2 L944.4 55.6 L972.2 66.7 L944.4 83.3 L930.6 105.6 L888.9 122.2 L861.1 133.3 L838.9 161.1 L805.6 194.4 L791.7 222.2 L777.8 236.1 L763.9 208.3 L744.4 191.7 L722.2 227.8 L700 194.4 L688.9 183.3 L666.7 180.6 L658.3 180.6 L633.3 166.7 L597.2 150 L577.8 136.1 L550 138.9 L533.3 125 L508.3 130.6 Z",
  /* Australia */
  "M813.9 311.1 L816.7 333.3 L827.8 347.2 L858.3 338.9 L883.3 347.2 L908.3 355.6 L925 327.8 L902.8 291.7 L880.6 283.3 L861.1 283.3 L847.2 288.9 Z",
  /* British Isles */
  "M486.1 111.1 L483.3 97.2 L491.7 88.9 L500 100 L502.8 108.3 Z",
  /* Japan */
  "M861.1 161.1 L875 155.6 L888.9 144.4 L902.8 127.8 L891.7 136.1 L877.8 152.8 Z",
  /* Madagascar */
  "M619.4 283.3 L638.9 294.4 L633.3 319.4 L622.2 305.6 Z",
  /* New Zealand */
  "M961.1 377.8 L975 372.2 L986.1 352.8 L991.7 358.3 L980.6 369.4 Z",
  /* Indonesia */
  "M763.9 236.1 L791.7 255.6 L819.4 272.2 L861.1 272.2 L888.9 258.3 L866.7 252.8 L827.8 258.3 L788.9 247.2 Z",
  /* Philippines */
  "M833.3 233.3 L850 222.2 L844.4 200 L833.3 211.1 Z",
];

/**
 * The delivery graph over the map — a hub at India wired out to the regions
 * Sumago's client base actually spans (Gulf, Europe, UK, North America, APAC,
 * East Africa). Coordinates share the map's 1000×500 space, so each node sits
 * where its region sits rather than at a decorative position.
 */
const HUB = { x: 700, y: 195 } as const;
const NODES = [
  { x: 660, y: 190, delay: "0s" }, // Gulf
  { x: 512, y: 118, delay: "1.1s" }, // Western Europe
  { x: 492, y: 100, delay: "2.3s" }, // United Kingdom
  { x: 278, y: 150, delay: "0.6s" }, // US east
  { x: 160, y: 140, delay: "3.0s" }, // US west
  { x: 875, y: 155, delay: "1.7s" }, // Japan
  { x: 860, y: 330, delay: "2.6s" }, // Australia
  { x: 560, y: 300, delay: "0.3s" }, // East Africa
  { x: 820, y: 250, delay: "3.4s" }, // South-East Asia
] as const;

/**
 * Deterministic particle field — fixed positions and delays, never
 * `Math.random()`. Random values differ between the server render and the
 * client hydration, which React reports as a mismatch and which would force the
 * whole band to re-render on mount.
 */
const PARTICLES = [
  { left: "8%", top: "22%", delay: "0s", size: 3 },
  { left: "17%", top: "68%", delay: "1.6s", size: 2 },
  { left: "27%", top: "12%", delay: "3.1s", size: 2 },
  { left: "36%", top: "82%", delay: "0.8s", size: 3 },
  { left: "44%", top: "38%", delay: "5.2s", size: 2 },
  { left: "48%", top: "30%", delay: "2.4s", size: 2 },
  { left: "58%", top: "74%", delay: "4.2s", size: 3 },
  { left: "67%", top: "18%", delay: "1.1s", size: 2 },
  { left: "72%", top: "44%", delay: "6.0s", size: 2 },
  { left: "76%", top: "58%", delay: "3.6s", size: 3 },
  { left: "85%", top: "28%", delay: "2.0s", size: 2 },
  { left: "93%", top: "70%", delay: "4.8s", size: 2 },
] as const;

type BackdropProps = {
  /**
   * Pointer offset from the band's centre, −0.5 → 0.5 on each axis. The section
   * owns these and simply never writes to them under reduced motion or on a
   * touch pointer, which is why nothing here is conditional — every hook below
   * runs on every render, and a pinned 0 produces a pinned layer.
   */
  px: MotionValue<number>;
  py: MotionValue<number>;
};

/**
 * The enterprise band's background stack — seven ambient layers, back to front.
 * The world map and the delivery graph are *not* here: they are `WhyChooseMap`,
 * an in-flow band of their own, so no type ever sits on top of them.
 *
 * **Every layer is compositor-only:** transforms and opacity, nothing that
 * triggers layout or paint while the page scrolls. The parallax springs are
 * bound straight to `motion.div` `style`, so pointer movement never enters
 * React's render path — sweeping the mouse across the band costs zero
 * re-renders, which is the difference between this being free and this being
 * the reason the page misses the docs/14 frame budget.
 *
 * **Depth is assigned, not sprinkled.** Layers move at different rates and two
 * move *against* the pointer. Parallax only reads as depth when the rates
 * differ and the signs disagree; shifting everything uniformly reads as the
 * background sliding around, which is worse than no parallax at all. Rates run
 * from 6px (grid, inverted — it is the layer the eye takes for "the surface")
 * to 30px (particles, frontmost).
 *
 * **Order matters.** Lighting sits behind everything so the map band is lit
 * rather than washed out. The heading glow keeps type on a clean field. Noise
 * and vignette come last, unifying everything beneath them.
 */
export function WhyChooseBackdrop({ px, py }: BackdropProps) {
  /* One spring, many rates. All unconditional — see `BackdropProps`. */
  const lightX = useTransform(px, (v) => v * -10);
  const lightY = useTransform(py, (v) => v * -8);
  const gridX = useTransform(px, (v) => v * -6);
  const gridY = useTransform(py, (v) => v * -4);
  const dustX = useTransform(px, (v) => v * 30);
  const dustY = useTransform(py, (v) => v * 22);

  return (
    <>
      {/* 1 — corner lighting: warm brand top-left, cool tech blue bottom-right.
             The two-temperature scheme is what stops a single-hue navy from
             reading flat. */}
      <motion.div
        aria-hidden
        style={{ x: lightX, y: lightY }}
        className="pointer-events-none absolute -inset-24"
      >
        <div className="absolute left-[-10%] top-[-18%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(closest-side,rgba(215,52,56,0.26),transparent)] blur-3xl" />
        <div className="absolute bottom-[-22%] right-[-12%] h-[40rem] w-[46rem] rounded-full bg-[radial-gradient(closest-side,rgba(30,131,240,0.22),transparent)] blur-3xl" />
        <div className="absolute bottom-[6%] left-[16%] h-[26rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(120,60,200,0.12),transparent)] blur-3xl" />
      </motion.div>

      {/* 2 — blueprint grid, moving against the pointer at the smallest rate. */}
      <motion.div
        aria-hidden
        style={{ x: gridX, y: gridY }}
        className="pointer-events-none absolute -inset-16 [background-image:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_80%_74%_at_50%_50%,black_30%,transparent_82%)]"
      />

      {/* 3 — travelling beams. They cross the full width, which the arc-bound
             network graph cannot. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-0 top-[24%] h-px w-[38%] bg-[linear-gradient(90deg,transparent,rgba(215,52,56,0.85),transparent)] opacity-0 motion-safe:animate-[wc-beam_15s_ease-in-out_infinite]" />
        <span className="absolute left-0 top-[73%] h-px w-[30%] bg-[linear-gradient(90deg,transparent,rgba(120,180,255,0.7),transparent)] opacity-0 motion-safe:animate-[wc-beam_19s_ease-in-out_infinite_5s]" />
      </div>

      {/* 4 — particles: frontmost layer, so the fastest-moving. */}
      <motion.div
        aria-hidden
        style={{ x: dustX, y: dustY }}
        className="pointer-events-none absolute inset-0"
      >
        {PARTICLES.map((p) => (
          <span
            key={`${p.left}-${p.top}`}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
            }}
            className="absolute rounded-full bg-white/70 opacity-30 shadow-[0_0_8px_rgba(255,255,255,0.6)] motion-safe:animate-[hero-particle_9s_ease-in-out_infinite]"
          />
        ))}
      </motion.div>

      {/* 5 — the pool of light the headline sits in. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[64rem] max-w-[130vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(146,178,235,0.16),rgba(146,178,235,0.05)_45%,transparent_72%)] blur-2xl"
      />

      {/* 6 — film grain at 3%. Breaks up the banding a wide navy gradient shows
             on 8-bit panels; below ~2% it stops working, above ~4% it reads as
             dirt on the screen. */}
      <div
        aria-hidden
        className="wc-noise pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
      />

      {/* 7 — vignette, sealing the edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_82%_at_50%_48%,transparent_42%,rgba(3,7,15,0.78)_100%)]"
      />
    </>
  );
}

/* ══ The map band ══════════════════════════════════════════════════════════ */

/**
 * The world map and its delivery graph, as a band of their own between the
 * headline and the promise panel.
 *
 * **Why it is in flow rather than behind the type.** As a backdrop the map was
 * doing two jobs badly: the continents were being read *through* a headline, so
 * neither the reach it claims nor the sentence it sat under landed cleanly.
 * Given its own strip with nothing over it, the map is simply the picture the
 * headline just made — reach shown once, immediately after it is stated.
 *
 * **Two layers, not one.** The dot matrix and the route graph move at different
 * parallax rates so the routes read as sitting *above* the continents; the base
 * geometry is identical (`MAP_FRAME`, same viewBox) so the nodes stay on their
 * regions while they separate in depth.
 *
 * `aria-hidden` throughout: this is atmosphere, and every claim it gestures at
 * is stated in text elsewhere on the page.
 */
export function WhyChooseMap({ px, py }: BackdropProps) {
  const mapX = useTransform(px, (v) => v * 18);
  const mapY = useTransform(py, (v) => v * 12);
  const netX = useTransform(px, (v) => v * 26);
  const netY = useTransform(py, (v) => v * 18);

  return (
    <div
      aria-hidden
      /* 5:2 matches the *cropped* viewBox (`0 15 1000 400`), which trims the
         empty ocean above Greenland and below South America — the full 1000×500
         equirectangular frame is a fifth dead space at the bottom, and that
         showed up as a gap between the map and the panel below. Matching the
         box to the geometry removes it without touching either margin. */
      className="relative mx-auto aspect-[5/2] max-h-[20rem] w-full max-w-5xl"
    >
      {/* Dot matrix. The dots are a `<pattern>` clipped to the coastlines by a
          `<mask>`, which is what produces the pixel-map look rather than a flat
          silhouette. Masked again at the edges so the map dissolves instead of
          ending on a hard rectangle. */}
      <motion.div
        style={{ x: mapX, y: mapY }}
        className={cn(MAP_FRAME, "opacity-70")}
      >
        <svg
          viewBox="0 15 1000 400"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
        >
          <defs>
            <pattern
              id="wc-map-dots"
              width="7"
              height="7"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.6" cy="1.6" r="1.15" fill="rgba(190,214,255,0.85)" />
            </pattern>
            <mask id="wc-map-land">
              <g fill="#fff">
                {CONTINENTS.map((d) => (
                  <path key={d.slice(0, 24)} d={d} />
                ))}
              </g>
            </mask>
          </defs>
          <rect
            width="1000"
            height="500"
            fill="url(#wc-map-dots)"
            mask="url(#wc-map-land)"
          />
        </svg>
      </motion.div>

      {/* Network routes. A long dash offset over a long duration reads as
          current flowing along the route; a short one reads as marching ants,
          which is the difference between calm and busy. */}
      <motion.div style={{ x: netX, y: netY }} className={MAP_FRAME}>
        <svg
          viewBox="0 15 1000 400"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="wc-route" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,90,93,0)" />
              <stop offset="45%" stopColor="rgba(255,90,93,0.7)" />
              <stop offset="100%" stopColor="rgba(120,180,255,0.5)" />
            </linearGradient>
          </defs>

          {/* Arcs bowed off the straight line, so the graph reads as flight
              paths rather than as a starburst. */}
          <g
            fill="none"
            stroke="url(#wc-route)"
            strokeWidth="1.1"
            strokeDasharray="7 13"
            className="motion-safe:animate-[wc-flow_34s_linear_infinite]"
          >
            {NODES.map((n) => {
              const mx = (HUB.x + n.x) / 2;
              const my = (HUB.y + n.y) / 2 - Math.abs(HUB.x - n.x) * 0.14;
              return (
                <path
                  key={`${n.x}-${n.y}`}
                  d={`M${HUB.x} ${HUB.y} Q${mx} ${my} ${n.x} ${n.y}`}
                />
              );
            })}
          </g>

          {/* Junctions, breathing out of phase via per-node delays. */}
          <g fill="rgba(255,120,122,0.9)">
            {NODES.map((n) => (
              <circle
                key={`n-${n.x}-${n.y}`}
                cx={n.x}
                cy={n.y}
                r="2"
                style={{ animationDelay: n.delay }}
                className="opacity-40 motion-safe:animate-[wc-node_6s_ease-in-out_infinite]"
              />
            ))}
            <circle cx={HUB.x} cy={HUB.y} r="3.4" fill="rgba(255,90,93,0.95)" />
            <circle
              cx={HUB.x}
              cy={HUB.y}
              r="8"
              fill="none"
              stroke="rgba(255,90,93,0.4)"
              strokeWidth="1"
            />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
