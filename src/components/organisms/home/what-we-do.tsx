import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Compass,
  Cpu,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { whatWeDo } from "@/lib/content";

const ICONS: Record<string, LucideIcon> = { Compass, Code2, Cpu, LifeBuoy };

/**
 * What we do — the four modes of work, placed between the company story and the
 * cinematic problem sequence. `ChallengesWeSolve` runs an 800vh pinned track, so
 * anything after it lands around screen 10; a first-time visitor scanning the
 * page needs the scope of the engagement well before that.
 *
 * Deliberately NOT a process model: no arrows, no connectors, no "phase"
 * language. The numerals are list indices, not a sequence — `PHASES` in
 * lib/services.ts remains the site's functional taxonomy, and this band is the
 * message that sits above it.
 *
 * No divider and a trimmed top pad: this reads as a continuation of the company
 * story above it rather than a separate slab, and `AboutSection`'s own bottom
 * padding is left to do the separating.
 */
export function WhatWeDo() {
  return (
    <Section className="pt-0 md:pt-2">
      <SectionHeading
        align="left"
        wide
        eyebrow="What we do"
        title={
          <>
            One team owns{" "}
            <span className="text-metal-red">the entire journey.</span>
          </>
        }
        description="From strategy and architecture through engineering, deployment and long-term support — one accountable team, so nothing is lost in the handoff between vendors."
      />

      <ul className="mt-11 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-14 lg:grid-cols-4">
        {whatWeDo.map((mode, i) => {
          const Icon = ICONS[mode.icon] ?? Compass;
          return (
            <li key={mode.title} data-aos="fade-up" data-aos-delay={(i % 4) * 60}>
              <Link
                href={mode.href}
                className="group flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-brand/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand motion-reduce:transform-none motion-reduce:transition-none lg:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-sm shadow-brand/30 transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none sm:h-14 sm:w-14">
                    <Icon size={24} strokeWidth={2} aria-hidden />
                  </span>
                  <span
                    aria-hidden
                    className="font-display text-3xl font-bold leading-none text-ink/10 transition-colors duration-300 group-hover:text-brand/25 sm:text-4xl lg:text-[2.5rem]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-6 flex items-center gap-1.5 font-display text-xl font-bold leading-snug text-ink transition-colors duration-300 group-hover:text-brand sm:text-2xl">
                  {mode.title}
                  <ArrowUpRight
                    size={18}
                    aria-hidden
                    className="shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transform-none"
                  />
                </h3>

                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/65">
                  {mode.description}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
