"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BuildMock, type MockKind } from "./build-mocks";

/**
 * 04 · WHAT WE BUILD & CAPABILITIES — one item at a time.
 *
 * A slider: a mock of the thing runs live, and beside it the thing is named and
 * explained — mark, title, one-line brief, and the capability points it ships
 * with. Arrows and markers move between the items; untouched, it advances
 * itself, so the section is alive before it is touched.
 *
 * This folds the old Capabilities scroller in: the points that used to live in
 * their own pinned section now ride with the item they belong to.
 *
 * The slider is identical for all fifteen services. The single thing that
 * differs is `mock` — a handset for a phone service, a browser window for a web
 * platform, a pipeline for DevOps (see `build-mocks.tsx`). Every mock is pure
 * CSS/SVG from tokens — no image, no stock (CLAUDE.md). The item marks are
 * pre-rendered on the server (Lucide components can't cross the boundary as
 * props) and handed in; the slider owns its own arrow and check icons.
 */

export type SliderItem = {
  title: string;
  purpose: string;
  features: string[];
  /** Small mark for the mock's header. */
  glyph: React.ReactNode;
  /** Tilted-plate mark for the info panel. */
  plate: React.ReactNode;
};

const DWELL = 4200;

export function BuildSlider({
  items,
  mock,
}: {
  items: SliderItem[];
  /** Which mock this service's section 04 runs. */
  mock: MockKind;
}) {
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

  if (!n) return null;
  const go = (d: number) => setActive((a) => (a + d + n) % n);
  const current = items[active];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      data-aos="fade-up"
      className="mt-14 md:mt-18"
    >
      {/* `min-w-0` on both columns: a grid track is sized to its content's
          min-content by default, so the mock — which carries fixed inner
          widths — would hold the single mobile column wider than the viewport
          no matter how the mock itself is clipped. */}
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_auto] lg:gap-16">
        {/* Info panel — mark, title, brief, capability points, controls */}
        <div className="min-w-0">
          <div key={active} className="motion-safe:animate-[build-stage-in_450ms_var(--ease-entrance)_both]">
            <div className="flex items-center gap-4">
              <span className="group shrink-0">{current.plate}</span>
              <p className="text-sm font-bold tabular-nums text-brand">
                {String(active + 1).padStart(2, "0")}{" "}
                <span className="text-ink/30">/ {String(n).padStart(2, "0")}</span>
              </p>
            </div>

            <h3 className="mt-6 text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2.15rem]">
              {current.title}
            </h3>
            <p className="mt-4 max-w-lg text-base leading-[1.6] text-ink/60 md:text-lg">
              {current.purpose}
            </p>

            {/* Mock, mobile only — sits between the brief and the points.
                Desktop shows it in its own column instead.

                `overflow-hidden` clips the mock's brand halo, which is drawn
                8 units outside the frame and would otherwise push the document
                past the viewport on a narrow phone. The vertical padding keeps
                the float and the glow's top and bottom intact. */}
            <div className="-mx-1 my-9 flex justify-center overflow-hidden px-1 py-6 lg:hidden">
              <BuildMock
                kind={mock}
                title={current.title}
                glyph={current.glyph}
                active={active}
              />
            </div>

            {current.features.length ? (
              <>
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.14em] text-brand-ink">
                  Capabilities
                </p>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {current.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 rounded-xl border border-brand/15 bg-brand/[0.04] px-3 py-2.5 transition-colors duration-300 hover:border-brand/30 hover:bg-brand/[0.07]"
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-white">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span className="text-[0.9rem] font-medium leading-snug text-ink/85">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          {/* controls */}
          <div className="mt-10 flex items-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous item"
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink/70 transition-colors duration-300 hover:border-brand hover:text-brand"
            >
              <ArrowLeft size={18} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next item"
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink/70 transition-colors duration-300 hover:border-brand hover:text-brand"
            >
              <ArrowRight size={18} aria-hidden />
            </button>
          </div>
        </div>

        {/* Mock — desktop only; the mobile copy sits inside the panel above */}
        <div className="hidden min-w-0 justify-center lg:flex">
          <BuildMock
            kind={mock}
            title={current.title}
            glyph={current.glyph}
            active={active}
          />
        </div>
      </div>

      {/* Markers */}
      <div
        role="tablist"
        aria-label="What we build"
        className="mt-12 flex flex-wrap items-center justify-center gap-2.5"
      >
        {items.map((it, i) => {
          const on = i === active;
          return (
            /*
              The marker a visitor sees is the 8px bar; the target they hit is
              the button around it. Padding it to 24px square meets the WCAG 2.2
              minimum without changing the design — a bare 8px bar was a real
              target on a phone, and missing it is what makes a slider feel
              broken. `-my-2` keeps the padded row the same height as the bars.
            */
            <button
              key={it.title}
              type="button"
              role="tab"
              aria-selected={on}
              aria-label={it.title}
              onClick={() => setActive(i)}
              className="group -my-2 grid h-6 min-w-6 place-items-center px-1 py-2"
            >
              <span
                aria-hidden
                className={cn(
                  "block h-2 rounded-full transition-all duration-300",
                  on ? "w-8 bg-brand" : "w-2 bg-ink/20 group-hover:bg-ink/40",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
