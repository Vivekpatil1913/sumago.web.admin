"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { testimonials, clientNames } from "@/lib/content";
import { company } from "@/lib/site";

/**
 * Trust wall — a scroll-driven transition between two full-screen states.
 *
 * State one: a white wall of proof (client quotes, client names, verified
 * metrics). The tiles are completely static — they never animate individually.
 * The whole canvas translates upward as one layer while the headline stays
 * pinned in the middle of the viewport, so it reads as scrolling past a wall of
 * evidence rather than as a carousel or a marquee.
 *
 * State two: the wall fades, white gives way to near-black, the headline
 * separates word by word and digit by digit until it's gone, and a single
 * glowing particle grows into the Sumago lockup with the closing line beneath.
 *
 * Every value is a pure function of scroll progress — nothing auto-plays, so
 * scrolling back up reverses the whole sequence exactly. Under
 * `prefers-reduced-motion` the section renders as two ordinary static blocks.
 */

/* ── Scroll choreography ──────────────────────────────────────────────────
   Fractions of the section's scroll range. Windows deliberately overlap so
   each stage hands over mid-motion — nothing ever sits frozen waiting. */
const TRACK_VH = 460; // total scroll length of the pinned sequence

const WALL_TRAVEL_END = 0.62; // the wall keeps moving while it fades out
const FADE_START = 0.44; // wall opacity 1 → 0, white → near-black
const FADE_END = 0.6;
const GROUND_OUT = 0.5; // the white ground behind the headline starts clearing
const SWAP_START = 0.52; // headline hands over from its ink copy to its white one
const SWAP_END = 0.6;
const SPLIT_START = 0.62; // headline words/digits drift apart
const SPLIT_END = 0.8;
const SPARK_IN = 0.78; // particle appears
const ORB_FULL = 0.88; // orb at full size, glow at full spread
const LOGO_IN = 0.86; // lockup fades in as the orb dissolves into a halo
const LOGO_SET = 0.94;
const CTA_IN = 0.92;
const CTA_DONE = 1;

/** Headline layers. Words drift as words; the count drifts digit by digit.
 *  610+ = the verified 50+ government, 500+ domestic and 60+ international
 *  clients in COMPANY-PROFILE.md — no new claim. */
const HEAD_LEAD = ["Trusted", "by"];
const HEAD_COUNT = "610+";
const HEAD_TAIL = ["organizations", "and", "counting"];

/* ── Wall content ────────────────────────────────────────────────────────
   Proof already published elsewhere on this page: the sample quotes (flagged
   in lib/content), the client roster, and verified metrics/certifications. */

type Tile =
  | { kind: "quote"; id: string; quote: string; role: string; rating: number; accent: string }
  | { kind: "client"; id: string; name: string }
  | { kind: "metric"; id: string; value: string; label: string }
  | { kind: "badge"; id: string; text: string };

const QUOTE_TILES: Tile[] = testimonials.map((t) => ({
  kind: "quote",
  id: `q-${t.role}`,
  quote: t.quote,
  role: t.role,
  rating: t.rating,
  accent: t.accent,
}));

const CLIENT_TILES: Tile[] = clientNames.map((n) => ({
  kind: "client",
  id: `c-${n}`,
  name: n,
}));

const METRIC_TILES: Tile[] = company.metrics.map((m) => ({
  kind: "metric",
  id: `m-${m.label}`,
  value: m.value,
  label: m.label,
}));

const BADGE_TILES: Tile[] = company.certifications.map((c) => ({
  kind: "badge",
  id: `b-${c}`,
  text: `${c} certified`,
}));

/** Interleaves the four tile kinds so no two of a kind sit together — the
 *  varied heights are what give the wall its natural, un-gridded rhythm. */
function buildWall(): Tile[] {
  const queues = [QUOTE_TILES, CLIENT_TILES, METRIC_TILES, BADGE_TILES].map((q) => [...q]);
  const cadence = [0, 1, 2, 1, 0, 1, 3, 1, 0, 1, 2, 1]; // quote, client, metric, client…
  const out: Tile[] = [];
  let step = 0;
  while (queues.some((q) => q.length)) {
    const queue = queues[cadence[step % cadence.length]];
    step += 1;
    const tile = queue.shift();
    if (tile) out.push(tile);
  }
  return out;
}

const WALL_TILES = buildWall();

const TILE_BASE = "mb-6 break-inside-avoid rounded-2xl border border-line bg-paper shadow-sm";

function WallTile({ tile }: { tile: Tile }) {
  if (tile.kind === "quote") {
    return (
      <figure className={`${TILE_BASE} relative p-6`}>
        <span
          aria-hidden
          className="absolute left-0 top-6 h-9 w-1 rounded-r-full"
          style={{ backgroundColor: tile.accent }}
        />
        <div className="flex items-center justify-between">
          <Quote className="text-ink/15" size={24} aria-hidden />
          <div className="flex gap-0.5" aria-hidden>
            {Array.from({ length: 5 }).map((_, s) => (
              <Star
                key={s}
                size={12}
                className={s < tile.rating ? "text-brand" : "text-ink/20"}
                fill={s < tile.rating ? "currentColor" : "none"}
              />
            ))}
          </div>
        </div>
        <blockquote className="mt-3 text-sm leading-relaxed text-ink/80">{tile.quote}</blockquote>
        <figcaption className="mt-4 border-t border-line pt-3 text-xs font-medium text-ink/55">
          {tile.role}
        </figcaption>
      </figure>
    );
  }

  if (tile.kind === "client") {
    return (
      <div className={`${TILE_BASE} px-6 py-5 text-center`}>
        <p className="text-base font-semibold text-ink/70">{tile.name}</p>
      </div>
    );
  }

  if (tile.kind === "metric") {
    return (
      <div className={`${TILE_BASE} px-6 py-6 text-center`}>
        <p className="font-display text-3xl font-bold text-metal-red">{tile.value}</p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink/55">
          {tile.label}
        </p>
      </div>
    );
  }

  return (
    <div className={`${TILE_BASE} bg-mist px-6 py-5 text-center`}>
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-ink/60">{tile.text}</p>
    </div>
  );
}

/** The static wall canvas — shared by the animated and reduced-motion renders,
 *  so the layout has a single source of truth. */
function Wall({ className }: { className?: string }) {
  return (
    <div
      className={`mx-auto max-w-6xl columns-1 gap-6 px-4 sm:columns-2 lg:columns-3 ${
        className ?? ""
      }`}
    >
      {WALL_TILES.map((tile) => (
        <WallTile key={tile.id} tile={tile} />
      ))}
    </div>
  );
}
/** One headline layer — a whole word, or a single digit of the count.
 *  `spread` runs 0 → 1 across the separation window; every layer drifts
 *  outward from the centre in proportion to its distance from it, and fades on
 *  its own beat. Translate + opacity only: nothing rotates, scales or bounces. */
function HeadToken({
  text,
  index,
  count,
  spread,
}: {
  text: string;
  index: number;
  count: number;
  spread: MotionValue<number>;
}) {
  const x = useTransform(spread, [0, 1], [0, (index - (count - 1) / 2) * 26]);
  const y = useTransform(spread, [0, 1], [0, (index % 2 ? 1 : -1) * 10]);
  const opacity = useTransform(spread, [0.2 + (index / count) * 0.3, 1], [1, 0]);
  // Words (and the count's trailing "+") need their own gap — a trailing space
  // collapses inside inline-block. Digits stay tight against each other.
  const isWord = /[a-z+]/i.test(text);
  return (
    <motion.span
      style={{ x, y, marginRight: isWord ? "0.28em" : undefined }}
      className="inline-block will-change-transform"
    >
      <motion.span style={{ opacity }} className="inline-block">
        {text}
      </motion.span>
    </motion.span>
  );
}

/** The Sumago lockup on its plate — the wordmark carries charcoal type, so it
 *  needs a light ground to stay legible on near-black; the reveal resolves
 *  into a glowing white plate rather than a bare logo. */
function Lockup() {
  return (
    <div className="rounded-[2rem] bg-white px-8 py-6 shadow-[0_0_60px_rgba(215,52,56,0.35)] sm:px-12 sm:py-8">
      <div className="w-[15rem] sm:w-[22rem]">
        <Image
          src="/sumago-logo.png"
          alt="Sumago Infotech Pvt. Ltd."
          width={4768}
          height={542}
          sizes="(max-width: 640px) 70vw, 420px"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}

/** Closing panel copy — shared by both renders. */
function ClosingCopy() {
  return (
    <div className="text-center">
      <p className="text-balance text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl md:text-4xl">
        No guesswork, no black boxes.
        <br />
        <span className="text-brand-bright">Just Sumago.</span>
      </p>
      <div className="mt-8 flex justify-center">
        <Button href="/contact" variant="primary" size="lg">
          Start a conversation <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}

export function TrustWall() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);

  /* How far the wall canvas travels: its own height minus one viewport.
     Measured rather than assumed, so the travel is exact at every breakpoint. */
  const [travel, setTravel] = useState(0);
  /* The CTA only becomes clickable once the closing panel is actually on
     screen — an invisible button must never intercept a click. */
  const [ctaLive, setCtaLive] = useState(false);

  const measure = useCallback(() => {
    const el = wallRef.current;
    if (!el) return;
    const vh = window.innerHeight;
    /* Capped at the scroll actually available before the fade, so a very tall
       wall (one column on phones) never has to race past faster than the page
       scrolls — it just doesn't reach its last tile, which is fine for a wall. */
    const trackScroll = (TRACK_VH / 100 - 1) * vh;
    setTravel(Math.max(0, Math.min(el.offsetHeight - vh, trackScroll * WALL_TRAVEL_END)));
  }, []);

  useEffect(() => {
    if (reduced) return;
    measure();
    const observed = wallRef.current;
    const ro = new ResizeObserver(measure);
    if (observed) ro.observe(observed);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, reduced]);

  /* The offsets below are `["start start", "end end"]` written as numeric
     edge pairs — deliberately NOT in framer's preset shorthand. The shorthand
     makes useScroll hand accelerable properties (opacity) to a native
     ViewTimeline, whose `contain` range is degenerate for a target taller than
     the viewport: past ~70% of the track every fade runs *backwards* while the
     JS-driven transforms keep going. The 0.9999 end point misses the preset by
     a fraction of a pixel and keeps the whole sequence on one scroll source. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: [
      [0, 0],
      [1, 0.9999],
    ],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const live = p >= LOGO_SET;
    setCtaLive((was) => (was === live ? was : live));
  });

  /* Wall — one transform on one element; the tiles themselves never animate. */
  const wallY = useTransform(scrollYProgress, [0, WALL_TRAVEL_END], [0, -travel]);
  /* The wall clears a little ahead of the black filling in — otherwise white
     cards keep showing through at 25% and the screen reads grey, not black. */
  const wallOpacity = useTransform(scrollYProgress, [FADE_START, FADE_END - 0.04], [1, 0]);

  /* White → near-black. The overlay sits above the wall, below the headline. */
  const blackOpacity = useTransform(scrollYProgress, [FADE_START + 0.02, FADE_END], [0, 1]);

  /* Headline — spacing opens up, then the line fades out entirely. */
  const spread = useTransform(scrollYProgress, [SPLIT_START, SPLIT_END], [0, 1]);
  const headOpacity = useTransform(
    scrollYProgress,
    [SPLIT_START, SPLIT_START + 0.06, SPLIT_END],
    [1, 0.96, 0],
  );
  /* The headline is drawn twice — ink on the white ground, white on the black.
     Recolouring a single copy would strand the text mid-grey on a mid-grey
     background exactly while the section changes colour; crossfading the two
     keeps each copy on the ground it was styled for. */
  const swap = useTransform(scrollYProgress, [SWAP_START, SWAP_END], [0, 1]);
  const inkOpacity = useTransform(() => headOpacity.get() * (1 - swap.get()));
  const whiteOpacity = useTransform(() => headOpacity.get() * swap.get());
  /* The white ground clears ahead of the swap — it exists to hold the ink copy
     legible over the wall, and lingering would keep the screen bright while
     the section is already going black. */
  const groundOpacity = useTransform(scrollYProgress, [GROUND_OUT, SWAP_END - 0.04], [1, 0]);

  /* Particle → orb → expanding glow. */
  const sparkScale = useTransform(scrollYProgress, [SPARK_IN, ORB_FULL], [0.04, 1]);
  const sparkOpacity = useTransform(
    scrollYProgress,
    [SPARK_IN, SPARK_IN + 0.04, LOGO_IN, LOGO_SET],
    [0, 1, 1, 0],
  );
  const haloScale = useTransform(scrollYProgress, [SPARK_IN, ORB_FULL, LOGO_SET], [0.1, 1, 2.4]);
  const haloOpacity = useTransform(
    scrollYProgress,
    [SPARK_IN, ORB_FULL, LOGO_SET],
    [0, 0.75, 0.45],
  );

  /* Lockup locks in; the closing line and CTA rise after it. */
  const logoOpacity = useTransform(scrollYProgress, [LOGO_IN, LOGO_SET], [0, 1]);
  const logoScale = useTransform(scrollYProgress, [LOGO_IN, LOGO_SET], [0.86, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [CTA_IN, CTA_DONE], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [CTA_IN, CTA_DONE], [40, 0]);

  const tokens: { text: string; key: string }[] = [
    ...HEAD_LEAD.map((w) => ({ text: w, key: `l-${w}` })),
    ...HEAD_COUNT.split("").map((c, i) => ({ text: c, key: `n-${i}` })),
    ...HEAD_TAIL.map((w) => ({ text: w, key: `t-${w}` })),
  ];
  const headingText = `${HEAD_LEAD.join(" ")} ${HEAD_COUNT} ${HEAD_TAIL.join(" ")}`;

  // Reduced motion — the same content, no pinning and no transition.
  if (reduced) {
    return (
      <section aria-labelledby="trust-wall-heading">
        <div className="bg-paper py-16 md:py-22">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Eyebrow>In their words</Eyebrow>
            <h2
              id="trust-wall-heading"
              className="text-balance text-[2rem] font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl lg:text-5xl"
            >
              {headingText}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink/65">
              The enterprises, founders, and institutions we build for — in their own words.
            </p>
          </div>
          <Wall className="mt-12" />
        </div>
        <div className="flex flex-col items-center bg-[#050505] px-4 py-20">
          <Lockup />
          <div className="mt-10">
            <ClosingCopy />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="trust-wall-heading"
      className="relative bg-paper"
      style={{ height: `${TRACK_VH}vh` }}
    >
      {/* Pinned viewport — everything inside scrubs against scroll progress. */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Layer 1 — the static wall, moved as a single canvas */}
        <motion.div
          aria-hidden
          style={{ y: wallY, opacity: wallOpacity }}
          className="absolute inset-x-0 top-0 will-change-transform"
        >
          <div ref={wallRef} className="py-16">
            <Wall />
          </div>
        </motion.div>

        {/* Layer 2 — white gives way to near-black */}
        <motion.div
          aria-hidden
          style={{ opacity: blackOpacity }}
          className="pointer-events-none absolute inset-0 bg-[#050505]"
        />

        {/* Layer 3 — the headline, held centred while the wall passes behind */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
          {/* Soft ground so the headline stays readable over the wall */}
          <motion.div
            aria-hidden
            style={{ opacity: groundOpacity }}
            className="absolute h-[58vh] w-[min(96vw,64rem)] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.95)_46%,rgba(255,255,255,0.7)_66%,rgba(255,255,255,0)_82%)]"
          />
          {/* Ink copy (over the wall) and white copy (over the black) — same
              layout, same drift, crossfaded as the section changes colour. */}
          {[
            { key: "ink", opacity: inkOpacity, tone: "text-ink" },
            { key: "white", opacity: whiteOpacity, tone: "text-white" },
          ].map((copy) => (
            <motion.p
              key={copy.key}
              aria-hidden
              style={{ opacity: copy.opacity }}
              className={`absolute max-w-5xl px-4 text-center text-[2rem] font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl ${copy.tone}`}
            >
              {tokens.map((tok, i) => (
                <HeadToken
                  key={tok.key}
                  text={tok.text}
                  index={i}
                  count={tokens.length}
                  spread={spread}
                />
              ))}
            </motion.p>
          ))}
        </div>

        {/* Layer 4 — particle → orb → glow → lockup → closing line.
            The particle grows exactly where the lockup lands, so the two
            cross-dissolve in place; the closing copy hangs below without
            shifting the lockup off centre. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <motion.div
              aria-hidden
              style={{ scale: haloScale, opacity: haloOpacity }}
              className="absolute h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(215,52,56,0.55),rgba(215,52,56,0.14)_55%,rgba(215,52,56,0)_100%)] blur-2xl will-change-transform"
            />
            <motion.div
              aria-hidden
              style={{ scale: sparkScale, opacity: sparkOpacity }}
              className="absolute h-24 w-24 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,#ff8a8c_38%,#d73438_72%,#8f1418_100%)] shadow-[0_0_50px_rgba(215,52,56,0.75)] will-change-transform"
            />
            <motion.div
              style={{ opacity: logoOpacity, scale: logoScale }}
              className="relative will-change-transform"
              aria-hidden={!ctaLive}
            >
              <Lockup />
            </motion.div>

            <motion.div
              style={{ opacity: ctaOpacity, y: ctaY }}
              className={`absolute left-1/2 top-full w-max max-w-[92vw] -translate-x-1/2 pt-10 will-change-transform ${
                ctaLive ? "pointer-events-auto" : "pointer-events-none"
              }`}
              aria-hidden={!ctaLive}
            >
              <ClosingCopy />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Motion-free equivalent for assistive tech */}
      <div className="sr-only">
        <h2 id="trust-wall-heading">{headingText}</h2>
        <ul>
          {testimonials.map((t) => (
            <li key={t.role}>
              <blockquote>{t.quote}</blockquote>
              <p>{t.role}</p>
            </li>
          ))}
        </ul>
        <p>
          Clients include {clientNames.join(", ")}. {company.certifications.join(" and ")}{" "}
          certified.
        </p>
      </div>
    </section>
  );
}
