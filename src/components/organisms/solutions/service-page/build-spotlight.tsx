"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BuildCard } from "@/lib/service-page";
import { cn } from "@/lib/utils";

/**
 * 04 · WHAT WE BUILD — the live catalogue.
 *
 * The nine-cell matrix this replaces was honest but exhausting: nine titles,
 * nine purposes, nine value lines and ~forty feature words all competing on one
 * screen. A buyer scanning it read *density*, not *range*.
 *
 * So the section keeps every item and shows one at a time. An index rail lists
 * what can be commissioned — that's the range, readable in three seconds — and a
 * single stage carries the detail for whichever row is live. The rail advances
 * itself on a five-second dwell with the progress line drawing under the active
 * row, so the section is visibly alive before it is touched; hovering, focusing
 * or choosing a row stops it and hands control back.
 *
 * WHY THIS EARNS ITS MOTION (docs/06): the auto-advance is the only thing that
 * tells a reader the rail is a rail and not a static list of headings — it
 * demonstrates range without asking for a click. It stops the moment the reader
 * engages, and never runs for `prefers-reduced-motion`, where the section is
 * simply a rail plus a stage that responds to clicks.
 *
 * The stage is min-height fixed so a taller item never reflows the page (CLS).
 */

/** Dwell per item, ms. Long enough to read a purpose line, short enough to
 *  show two or three items while a reader is still in the section. */
const DWELL = 5000;

/**
 * A build card with its icon already rendered. `BuildCard.icon` is a Lucide
 * *component*, which cannot cross the server→client boundary — so the section
 * renders the plate on the server and hands this component the element. It also
 * keeps the icon set out of the client bundle.
 */
export type SpotlightItem = Omit<BuildCard, "icon"> & {
  plate: React.ReactNode;
  /** The same glyph as an oversized, faint watermark that fills the stage's
   *  right flank — depth for a single-item view without a container. */
  watermark: React.ReactNode;
};

export function BuildSpotlight({ items }: { items: SpotlightItem[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* One timeout per dwell rather than an interval, so a manual pick restarts
     the clock instead of inheriting whatever was left of the last tick. */
  useEffect(() => {
    if (paused || reduced || items.length < 2) return;
    const t = window.setTimeout(
      () => setActive((a) => (a + 1) % items.length),
      DWELL,
    );
    return () => window.clearTimeout(t);
  }, [active, paused, reduced, items.length]);

  const select = useCallback((i: number, focus = false) => {
    setActive(i);
    if (focus) tabsRef.current[i]?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = items.length - 1;
    const go =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (active + 1) % items.length
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (active + last) % items.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (go === null) return;
    e.preventDefault();
    select(go, true);
  };

  const current = items[active];

  return (
    <div
      data-aos="fade-up"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative mt-14 overflow-hidden rounded-3xl border border-line bg-paper md:mt-18"
    >
      {/* Ambient brand glow — the only decoration, and the thing that keeps the
          frame from reading as a table. Drifts slowly behind the stage. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl motion-safe:animate-[blob-float_15s_ease-in-out_infinite]"
      />

      <div className="relative grid lg:grid-cols-12">
        {/* ── The index rail: the whole range, nothing but numbers and names ── */}
        <div
          role="tablist"
          aria-label="What we build"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto border-b border-line lg:col-span-4 lg:snap-none lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r"
        >
          {items.map((b, i) => {
            const on = i === active;
            return (
              <button
                key={b.title}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`build-tab-${i}`}
                aria-selected={on}
                aria-controls="build-stage"
                tabIndex={on ? 0 : -1}
                onClick={() => select(i)}
                className={cn(
                  "group relative flex shrink-0 snap-start items-center gap-3 px-5 py-4 text-left transition-colors duration-300 lg:shrink lg:px-7",
                  on ? "bg-mist/60 lg:bg-transparent" : "hover:bg-mist/40",
                )}
              >
                <span
                  className={cn(
                    "text-[0.6875rem] font-bold tabular-nums transition-colors duration-300",
                    on ? "text-brand" : "text-ink/30",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap text-[0.9375rem] font-semibold leading-snug transition-colors duration-300 lg:whitespace-normal",
                    on ? "text-ink" : "text-ink/50 group-hover:text-ink/80",
                  )}
                >
                  {b.title}
                </span>

                {/* The dwell, drawn: under the row on mobile, beside it on
                    desktop. Remounts with `active` so it restarts each item, and
                    freezes in place — rather than snapping full — while paused.
                    The inline duration is authoritative; the one in the class
                    name only satisfies the arbitrary-animation shorthand. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-line/70 lg:left-0 lg:right-auto lg:top-0 lg:h-auto lg:w-px"
                >
                  {on ? (
                    <span
                      key={active}
                      style={{ animationDuration: `${DWELL}ms` }}
                      className={cn(
                        "block h-full w-full origin-left bg-gradient-to-r from-brand to-brand/40 lg:origin-top lg:bg-gradient-to-b",
                        "motion-safe:animate-[build-dwell_5s_linear_forwards] lg:motion-safe:animate-[build-dwell-y_5s_linear_forwards]",
                        paused && "[animation-play-state:paused]",
                      )}
                    />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── The stage: one item, three lines, done ── */}
        <div
          id="build-stage"
          role="tabpanel"
          aria-labelledby={`build-tab-${active}`}
          tabIndex={0}
          className="relative flex min-h-[19rem] flex-col justify-center overflow-hidden p-7 md:p-10 lg:col-span-8"
        >
          {/* The live item, filling the right flank so the stage never reads as
              half-empty: a soft brand wash, then the icon oversized over it. Both
              re-key with `active` so they cross-fade and drift in as the row
              changes. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 top-1/2 hidden h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(215,52,56,0.10),transparent_62%)] lg:block"
          />
          <span
            key={`wm-${active}`}
            aria-hidden
            className="pointer-events-none absolute -right-12 top-1/2 hidden h-80 w-80 -translate-y-1/2 text-brand/[0.14] motion-safe:animate-[build-stage-in_650ms_var(--ease-entrance)_both] lg:block xl:h-[26rem] xl:w-[26rem]"
          >
            {current.watermark}
          </span>

          <div
            key={current.title}
            className="relative motion-safe:animate-[build-stage-in_450ms_var(--ease-entrance)_both]"
          >
            <div className="flex items-center gap-4">
              {current.plate}
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/40">
                {/* Live dot — pulses only while the rail is advancing itself. */}
                <span
                  aria-hidden
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    paused || reduced
                      ? "bg-ink/20"
                      : "bg-brand motion-safe:animate-[build-pulse_1.6s_ease-in-out_infinite]",
                  )}
                />
                <span className="tabular-nums">
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(items.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            <h3 className="mt-6 text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2rem]">
              {current.title}
            </h3>

            <p className="mt-4 max-w-xl text-base leading-[1.65] text-ink/60">
              {current.purpose}
            </p>

            {current.value ? (
              <p className="mt-6 max-w-xl border-l-2 border-brand pl-4 text-base font-semibold leading-[1.55] text-ink">
                {current.value}
              </p>
            ) : null}

            {current.features.length ? (
              <ul className="mt-7 flex flex-wrap gap-2">
                {current.features.map((f, i) => (
                  <li
                    key={f}
                    style={{ animationDelay: `${120 + i * 55}ms` }}
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink/55 motion-safe:animate-[build-stage-in_400ms_var(--ease-entrance)_both]"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
