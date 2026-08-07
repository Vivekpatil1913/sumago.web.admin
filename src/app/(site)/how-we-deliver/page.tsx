import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, MessageSquare } from "lucide-react";

import { PageHero } from "@/components/organisms/page-hero";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Button } from "@/components/atoms/button";
import { Stat } from "@/components/molecules/stat";
import { BeatRun } from "@/components/organisms/delivery/beat-run";
import { BeatBuilt } from "@/components/organisms/delivery/beat-built";
import { InfrastructureBand } from "@/components/organisms/delivery/infrastructure-band";
import { BeatTrusted } from "@/components/organisms/delivery/beat-trusted";
import { getCertifications, getMetrics } from "@/lib/cms";

export const metadata: Metadata = {
  title: "How We Deliver",
  description:
    "How a Sumago engagement is actually run, the three delivery centres across Nashik and Pune it runs from, the infrastructure behind them, and the 600+ clients who shaped all of it.",
};

/**
 * /how-we-deliver — Sumago's capability statement, staged as a cinematic run.
 *
 * The audience is the reader who has already decided the work is worth doing and
 * now has to defend the vendor internally: a procurement evaluator scoring a
 * tender, an enterprise vendor-onboarding team, a CTO writing the build-vs-buy
 * note. That sequence — governance, premises, infrastructure, references —
 * would derail the narrative on /about and would smother the form on /contact,
 * which is why it earns its own indexable route.
 *
 * Three beats, not a stack of sections. This is the least glamorous content on
 * the site — engagement governance, floor plans, biometric readers — and as a
 * grid of equal cards it reads as a spec sheet nobody finishes. Giving each
 * idea the whole screen for the length of a scroll is what turns the same facts
 * into an argument.
 *
 * The page runs light on paper, like every other page on the site: dark hero,
 * light body, one dark band to close. The three stage tints (`bg-stage-warm`,
 * `-cool`, `-ember`) alternate temperature so consecutive full-height sections
 * never read as the same blank canvas, which is the light-mode version of the
 * same problem an unvaried dark run has.
 *
 * Pacing is deliberate: two pinned beats and one static one. The pin is the
 * page's strongest device and it stops working if it never lets go — beat 03 is
 * the loudest moment and earns it through type, not scroll capture. The
 * infrastructure band between beats 02 and 03 is unpinned for the same reason.
 *
 * Everything degrades honestly: below `lg`, and for anyone on reduced motion,
 * both pinned beats render as stacked cards with identical content (see
 * `PinnedSequence`). Mobile gets a redesign, not a broken scroll-hijack.
 *
 * Nothing here duplicates another page: the *capability* view of the premises
 * lives here, the *visit* view (address, phone, map) stays on /contact, and the
 * client roster stays on /about. Each fact keeps exactly one home.
 *
 * Hero uses `variant="floor"` with no star formation — the ten formations are
 * allocated one per page, and skipping the extra Three.js scene keeps headroom
 * in the performance budget for the two pinned sequences.
 */
export default async function HowWeDeliverPage() {
  const [metrics, certifications] = await Promise.all([getMetrics(), getCertifications()]);

  return (
    <>
      <PageHero
        variant="floor"
        redOpacity={0.55}
        eyebrow="How we deliver"
        titleClassName="max-w-4xl"
        title={
          <>
            What happens after{" "}
            <span className="text-metal-red-shine">you say yes.</span>
          </>
        }
        description="Every proposal reads well on paper. This is the part that isn't on paper — how the work is run, where it gets built, and who has already tested both."
      />

      {/* 01 — how an engagement is governed, week to week. */}
      <BeatRun />

      {/* 02 — the three centres, then what holds them up. */}
      <BeatBuilt />
      <InfrastructureBand />

      {/* 03 — the client base that shaped all of it. */}
      <BeatTrusted />

      {/* Epilogue — the verifiable proof, then the ask. */}
      {/* The one dark band on the page — the same closing device /about uses.
          It marks the CTA as the end of the argument rather than another
          section, and gives a run of light sections somewhere to land. */}
      <section className="relative isolate overflow-hidden bg-blueprint py-16 md:py-22">
        <div className="container-page relative z-10">
          <SectionHeading
            tone="dark"
            eyebrow="Before you decide"
            title={
              <>
                All of it is{" "}
                <span className="text-metal-red-shine">checkable.</span>
              </>
            }
            description="The certifications are independently audited, the numbers are on record, and the three floors are real rooms you are welcome to walk through before you sign anything."
          />

          <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-10 backdrop-blur-sm sm:px-8">
            <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
              {metrics.slice(0, 4).map((metric, i) => (
                <div
                  key={metric.label}
                  data-aos="fade-up"
                  data-aos-delay={i * 60}
                  className="md:border-l md:border-white/10 md:first:border-l-0"
                >
                  <Stat value={metric.value} label={metric.label} tone="silver" dark />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {certifications.map((certification) => (
              <span
                key={certification}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur"
              >
                <BadgeCheck size={16} className="text-success-bright" aria-hidden />
                {certification}
              </span>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg" className="w-full sm:w-auto">
              <MessageSquare size={17} strokeWidth={2.5} aria-hidden />
              Start the conversation
            </Button>
            <Button
              href="/impact"
              variant="outline"
              size="lg"
              className="w-full border-white/25 text-white backdrop-blur-sm hover:bg-white/10 sm:w-auto"
            >
              See what it produced <ArrowRight size={16} aria-hidden />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
