"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * 04 · WHAT WE BUILD — the phone, and one app at a time.
 *
 * A single handset runs whichever app is live; a card at its lower corner names
 * that app — its mark, its title and a one-line brief — and the pair cycle
 * through everything that can be commissioned, one at a time, on a short dwell.
 * A row of markers below lets a reader jump to any app and shows how many there
 * are. Untouched, it advances itself, so the section is visibly alive before
 * anyone reaches it.
 *
 * WHY IT EARNS ITS MOTION (docs/06): the auto-advance is what tells a reader the
 * one card is a rotating set, not a static label — it demonstrates range without
 * a click. It stops the moment a reader engages a marker, and never runs under
 * `prefers-reduced-motion`, where the section is a still phone, one card, and
 * markers that still respond to input.
 *
 * The icon marks are rendered on the server (Lucide components can't cross the
 * client boundary) and handed in per item.
 */

export type OrbitItem = {
  title: string;
  purpose: string;
  value?: string;
  features: string[];
  /** Small mark for the phone header. */
  glyph: React.ReactNode;
  /** Larger tilted-plate mark for the app card. */
  plate: React.ReactNode;
};

/** Dwell per app, ms. */
const DWELL = 3600;

export function BuildOrbit({ items }: { items: OrbitItem[] }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reduced || n < 2) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % n), DWELL);
    return () => window.clearTimeout(t);
  }, [active, paused, reduced, n]);

  const current = items[active];

  /* The handset, showing the live app. Decorative — the markers are the
     interface — so it's aria-hidden; its content echoes the active app. */
  const phone = (
    <div aria-hidden className="relative h-[30rem] w-[15rem] shrink-0">
      <span className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(215,52,56,0.2),transparent_66%)]" />
      <div className="relative h-full w-full rounded-[2.25rem] border border-white/15 bg-[linear-gradient(160deg,#161113,#0b0809)] p-2.5 shadow-[0_46px_90px_-38px_rgba(0,0,0,0.9)] motion-safe:animate-[tile-float_7s_ease-in-out_infinite]">
        <div className="relative h-full w-full overflow-hidden rounded-[1.85rem] bg-[#0f0b0d]">
          <span className="absolute left-1/2 top-2.5 z-20 h-1.5 w-14 -translate-x-1/2 rounded-full bg-white/15" />

          <div
            key={active}
            className="flex h-full flex-col motion-safe:animate-[build-stage-in_420ms_var(--ease-entrance)_both]"
          >
            <div className="flex items-center gap-2.5 px-4 pt-8">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#d73438,#7a1519)]">
                {current.glyph}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.8rem] font-bold leading-tight text-white">
                  {current.title}
                </span>
                <span className="mt-1 block h-1 w-12 rounded-full bg-white/15" />
              </span>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand shadow-[0_0_8px_rgba(215,52,56,0.9)] motion-safe:animate-[build-pulse_1.6s_ease-in-out_infinite]" />
            </div>

            <ul className="mt-4 space-y-2 px-4">
              {current.features.slice(0, 5).map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-2"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
                  <span className="text-[0.66rem] leading-tight text-white/70">
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex items-center justify-around border-t border-white/10 bg-white/[0.05] px-4 py-3.5">
              <span className="h-1.5 w-6 rounded-full bg-brand" />
              {[0, 1, 2].map((t) => (
                <span key={t} className="h-1.5 w-6 rounded-full bg-white/15" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* The single app card — icon, title, one-line brief — that re-keys and
     cross-fades as the active app changes. */
  const card = (
    <div
      key={active}
      className="w-[19rem] max-w-full rounded-2xl border border-line bg-paper/95 p-4 shadow-[0_30px_70px_-28px_rgba(0,0,0,0.4)] backdrop-blur motion-safe:animate-[build-stage-in_450ms_var(--ease-entrance)_both]"
    >
      <div className="flex items-center gap-3">
        <span className="group shrink-0">{current.plate}</span>
        <div className="min-w-0">
          <p className="text-[0.7rem] font-bold tabular-nums text-brand">
            {String(active + 1).padStart(2, "0")}{" "}
            <span className="text-ink/30">/ {String(n).padStart(2, "0")}</span>
          </p>
          <h4 className="text-[1rem] font-bold leading-tight tracking-[-0.01em] text-ink">
            {current.title}
          </h4>
        </div>
      </div>
      <p className="mt-3 text-sm leading-[1.5] text-ink/60">{current.purpose}</p>
    </div>
  );

  /* Markers — the accessible interface, and the count of apps. */
  const markers = (
    <div
      role="tablist"
      aria-label="Apps we build"
      className="mt-12 flex flex-wrap items-center justify-center gap-2.5"
    >
      {items.map((it, i) => {
        const on = i === active;
        return (
          <button
            key={it.title}
            type="button"
            role="tab"
            aria-selected={on}
            aria-label={it.title}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              on ? "w-8 bg-brand" : "w-2 bg-ink/20 hover:bg-ink/40",
            )}
          />
        );
      })}
    </div>
  );

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      data-aos="fade-up"
      className="mt-14 md:mt-18"
    >
      {/* Desktop — phone centred, the app card popping from its lower-left corner */}
      <div className="relative mx-auto hidden h-[34rem] w-full max-w-[44rem] lg:block">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {phone}
        </div>
        <div className="absolute bottom-[7%] left-[5%] z-20">{card}</div>
      </div>

      {/* Mobile / tablet — phone, then the card, then markers */}
      <div className="flex flex-col items-center lg:hidden">
        {phone}
        <div className="mt-8 w-full max-w-[20rem]">{card}</div>
      </div>

      {markers}
    </div>
  );
}
