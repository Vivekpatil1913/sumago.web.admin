import { Eye, Target, type LucideIcon } from "lucide-react";

import { visionMission } from "@/lib/content";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { Eye, Target };

/**
 * Vision & Mission — a two-card purpose diptych: the destination on the left,
 * the daily practice on the right.
 *
 * The tinted vision card and the outlined mission card carry the distinction on
 * their own, so this replaced the previous auto-cycling animated version. That
 * one shipped SVG emblems, scoped keyframes and a `useReducedMotion` client
 * boundary for a section that only ever states two sentences — motion that
 * didn't earn its place (CLAUDE.md), on a page where the timeline and trust
 * wall already carry the movement. Now a server component: no client JS.
 *
 * Copy lives in lib/content.ts (`visionMission`), CMS-ready.
 */
export function VisionMission() {
  return (
    <ul className="mt-11 grid items-stretch gap-6 md:grid-cols-2 lg:mt-12 lg:gap-8">
      {visionMission.map((panel, i) => {
        const Icon = ICONS[panel.icon] ?? Eye;
        const tinted = panel.key === "vision";
        return (
          <li
            key={panel.key}
            data-aos="fade-up"
            data-aos-delay={i * 80}
            className={cn(
              "flex h-full flex-col rounded-2xl p-7 sm:p-9",
              tinted ? "bg-brand/5" : "bg-paper ring-1 ring-line",
            )}
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-sm shadow-brand/30 sm:h-16 sm:w-16">
              <Icon size={26} strokeWidth={2} aria-hidden />
            </span>

            <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-brand-ink sm:mt-7">
              {panel.label}
            </h3>

            <p className="mt-4 font-display text-lg font-bold leading-snug text-ink sm:text-xl">
              {panel.statement}
            </p>

            {panel.support ? (
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink/55">
                {panel.support}
              </p>
            ) : null}

            {panel.points ? (
              <ul className="mt-5 space-y-3">
                {panel.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink/70"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.45rem] h-2 w-2 shrink-0 rounded-full bg-brand"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
