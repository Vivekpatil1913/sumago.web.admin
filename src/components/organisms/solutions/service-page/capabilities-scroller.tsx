"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import type { CapabilityItem } from "@/lib/service-page";
import { cn } from "@/lib/utils";
import { SectionIntro } from "./primitives";

/**
 * 06 · CAPABILITIES — a pinned showcase that cross-fades one group at a time.
 *
 * The first build translated nine full-screen panels past a sticky viewport.
 * It read every capability one-per-screen, but a full-height panel carrying a
 * short group left the frame mostly empty, and the slide exposed a tall band of
 * paper between one panel leaving and the next arriving — the section read as
 * white space with content in it.
 *
 * This keeps the pin and the one-group-at-a-time reading, but swaps the moving
 * track for a single showcase card that stays put in the centre of the screen
 * while the groups DISSOLVE through it — scroll drives which group is lit, each
 * fades and drifts in place, and no two are ever separated by empty paper. The
 * card is sized to the reading, not the viewport, so it sits in comfortable
 * margins rather than a void.
 *
 * WHY IT EARNS ITS MOTION (docs/06): nine groups in a grid are audited; one
 * group given the reader's whole attention is read. The pin trades a little page
 * length for exactly that, at the reader's own pace, and the cross-fade is the
 * quietest transition that still signals "next".
 *
 * `prefers-reduced-motion` (and any non-hydrated render) degrades to the same
 * panels stacked in normal flow — no pin, no transform, identical content.
 */

/** Scroll distance granted to each group, in vh. Lower than the old 85 — the
 *  cross-fade needs less travel than a full-panel slide to feel deliberate. */
const VH_PER_GROUP = 70;

export type ScrollerGroup = {
  category: string;
  items: CapabilityItem[];
  /** Rendered server-side — Lucide icons are components and can't cross into a
   *  client boundary. `plate` is the tilted brand square, `watermark` the same
   *  glyph as the oversized ghost behind the panel. */
  plate: React.ReactNode;
  watermark: React.ReactNode;
};

/** The group's content — identity column beside the items. Shared by the pinned
 *  cross-fade and the stacked reduced-motion fallback, so both are identical. */
function PanelInner({
  group,
  index,
  total,
}: {
  group: ScrollerGroup;
  index: number;
  total: number;
}) {
  return (
    <div className="grid w-full items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      {/* Identity — plate, index, category, rule, contents line. */}
      <div className="group">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-ink">
          {String(index + 1).padStart(2, "0")}{" "}
          <span className="text-ink/30">/ {String(total).padStart(2, "0")}</span>
        </p>

        <div className="mt-6">{group.plate}</div>

        <h3 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          <span className="text-metal-red">{group.category}</span>
        </h3>

        <div className="mt-6 h-px w-20 bg-gradient-to-r from-brand to-transparent" />

        <p className="mt-6 text-xs font-medium uppercase tracking-[0.1em] text-ink/40">
          {group.items.map((i) => i.name).join("  ·  ")}
        </p>
      </div>

      {/* The items, each with the reason it matters. */}
      <ul className="space-y-6 lg:space-y-8">
        {group.items.map((item) => (
          <li key={item.name}>
            <p className="text-lg leading-[1.45] tracking-tight text-ink md:text-[1.35rem]">
              {item.name}
            </p>
            {item.why ? (
              <p className="mt-3 max-w-xl leading-relaxed text-ink/60">
                {item.why}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The group's icon as an oversized watermark — depth without a container. */
function Watermark({ node }: { node: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -top-8 right-0 hidden h-64 w-64 text-brand/[0.07] lg:block"
    >
      {node}
    </span>
  );
}

/** Every group stacked in normal flow — the reduced-motion path, and the
 *  mobile path, where a fixed-height pinned card would clip a tall group. */
function StackedGroups({ groups }: { groups: ScrollerGroup[] }) {
  const n = groups.length;
  return (
    <div className="mt-16 space-y-20 md:space-y-24">
      {groups.map((g, i) => (
        <div key={g.category} className="group/panel relative w-full">
          <div className="container-page relative">
            <Watermark node={g.watermark} />
            <PanelInner group={g} index={i} total={n} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Eyebrow + headline, above the card. */
function Intro() {
  return (
    <SectionIntro
      eyebrow="Capabilities"
      title={
        <>
          Everything this covers — and{" "}
          <span className="text-brand-ink">why each part matters</span>.
        </>
      }
    />
  );
}

export function CapabilitiesScroller({ groups }: { groups: ScrollerGroup[] }) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const n = groups.length;
  const [active, setActive] = useState(0);

  /* Scroll decides which group is lit; the cross-fade itself is a CSS opacity
     transition. Nothing on `style` is a motion value — framer's WAAPI handoff
     for a transform bound to `style` rejects multi-stop scroll ranges with
     "offsets must be monotonically non-decreasing", which blanked the page. The
     event fires per frame but only commits state when the index actually
     changes, so there is no per-frame React render. */
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setActive((prev) => (prev === i ? prev : i));
  });

  /* Reduced motion — or a single group, where a pin has nothing to scroll
     through — degrades to the stacked flow. */
  if (reduce || n <= 1) {
    return (
      <section id="capabilities" className="scroll-mt-28 bg-paper py-24 md:py-32">
        <div className="container-page">
          <Intro />
        </div>
        <StackedGroups groups={groups} />
      </section>
    );
  }

  return (
    <section id="capabilities" className="scroll-mt-28 bg-paper py-24 md:py-32 lg:py-0">
      <div className="container-page lg:pt-24 xl:pt-32">
        <Intro />
      </div>

      {/* Mobile keeps the stacked flow: a fixed-height pinned card would clip a
          tall group once everything collapses to a single column. */}
      <div className="lg:hidden">
        <StackedGroups groups={groups} />
      </div>

      {/* Desktop pins the showcase card and dissolves the groups through it. */}
      <div className="hidden lg:block">
        {/* Tall wrapper = the scroll distance the pin consumes. */}
        <div
          ref={trackRef}
          style={{ height: `${n * VH_PER_GROUP}vh` }}
          className="relative mt-14 md:mt-18"
        >
          {/* Pinned, centred in the viewport — the card sits in comfortable
              margin rather than filling the screen, so a short group never
              leaves a void. */}
          <div className="sticky top-0 flex h-[100svh] items-center">
            <div className="container-page w-full">
              <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-line bg-paper shadow-[0_40px_100px_-60px_rgba(0,0,0,0.35)]">
                {/* Ambient brand glow — the frame's only decoration, drifting. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand/10 blur-3xl motion-safe:animate-[blob-float_15s_ease-in-out_infinite]"
                />

                {/* Stage — every group stacked, cross-faded one at a time. */}
                <div className="relative h-[62vh] min-h-[32rem]">
                  {groups.map((g, i) => {
                    const on = i === active;
                    return (
                      <div
                        key={g.category}
                        aria-hidden={!on}
                        className={cn(
                          "pointer-events-none absolute inset-0 flex items-center px-6 py-6 transition-all duration-500 ease-out md:px-14",
                          on
                            ? "opacity-100 blur-0 translate-y-0"
                            : "translate-y-5 opacity-0 blur-[2px]",
                        )}
                      >
                        <Watermark node={g.watermark} />
                        <PanelInner group={g} index={i} total={n} />
                      </div>
                    );
                  })}
                </div>

                {/* Progress rail — so the pin never feels open-ended. */}
                <div className="relative px-6 pb-6 md:px-14 md:pb-8">
                  <div className="h-1 overflow-hidden rounded-full bg-line">
                    <motion.div
                      style={{ scaleX: scrollYProgress }}
                      className="h-full origin-left rounded-full bg-brand"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
