import Image from "next/image";
import {
  FileText,
  MonitorPlay,
  PieChart,
  ShieldAlert,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { PinnedSequence } from "@/components/organisms/delivery/pinned-sequence";
import { engagementPrinciples } from "@/lib/content";

const ICONS: Record<string, LucideIcon> = {
  UserRound,
  PieChart,
  MonitorPlay,
  FileText,
  ShieldAlert,
};

/**
 * Beat 01 — how an engagement is governed, one principle per stage.
 *
 * Governance is the least visual content on the site and the easiest to skim
 * past as boilerplate. Giving each principle the whole screen for the length of
 * a scroll forces it to be read as a commitment rather than a bullet, and the
 * index rail underneath keeps all five visible so nobody loses the shape of the
 * argument while looking at one part of it.
 *
 * The dashboard artwork sits behind the stages rather than beside them: it is
 * atmosphere, not a fifth column of information, and bleeding it off the right
 * edge is what keeps the stage feeling like a frame rather than a slide.
 */
export function BeatRun() {
  return (
    <PinnedSequence
      number="01"
      kicker="How it runs"
      title={
        <>
          One name, one number,{" "}
          <span className="text-metal-red">every single week.</span>
        </>
      }
      standfirst="Five things become true in the first week of an engagement, and stay true until the last release ships."
      entries={engagementPrinciples.map((principle) => ({
        key: principle.title,
        label: principle.title,
      }))}
      backdrop={
        /* Sits on the container's right edge, sized to fill the stage band
           between the header and the index rail.
           The band is carved out with vh padding and the artwork is fitted into
           it with `object-contain`, so it renders as large as the space allows
           and can never grow into the header or the rail — including on short
           laptop viewports, where a fixed width would have overflowed both.
           (The first version bled 8% past the *viewport* at 54% width, which is
           why it read as a mis-cropped screenshot and collided with the rail.)
           The left edge is dissolved so the headline column keeps clean
           background behind it. */
        <div className="absolute inset-y-0 right-0 flex w-[54%] items-center justify-end pb-[15vh] pt-[17vh]">
          <Image
            src="/delivery/engagement-cadence.svg"
            alt=""
            width={800}
            height={600}
            unoptimized
            sizes="(max-width: 1536px) 54vw, 44rem"
            className="h-full w-full max-w-[44rem] object-contain object-right opacity-70 [mask-image:radial-gradient(118%_104%_at_76%_48%,#000_38%,transparent_78%)]"
          />
        </div>
      }
      stages={engagementPrinciples.map((principle, i) => {
        const Icon = ICONS[principle.icon] ?? UserRound;
        return (
          <div key={principle.title} className="max-w-xl">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand text-white">
                <Icon size={22} strokeWidth={2} aria-hidden />
              </span>
              <span
                aria-hidden
                className="font-display text-5xl font-bold leading-none text-ink/[0.1]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-6 text-balance font-display font-bold tracking-tight text-ink text-3xl/[1.12] lg:text-[2.75rem]/[1.06]">
              {principle.title}
            </h3>
            <p className="mt-5 text-lg leading-relaxed text-ink/70 lg:text-xl lg:leading-relaxed">
              {principle.description}
            </p>
          </div>
        );
      })}
    />
  );
}
