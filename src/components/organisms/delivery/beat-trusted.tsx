import {
  BookOpen,
  Briefcase,
  Building2,
  Globe,
  Heart,
  Landmark,
  type LucideIcon,
} from "lucide-react";

import { Stat } from "@/components/molecules/stat";
import { clientMix, clientSegments } from "@/lib/content";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Landmark,
  Building2,
  Globe,
  BookOpen,
  Briefcase,
  Heart,
};

/** Strip the "+" so the three figures can be shown as shares of one whole. */
const counts = clientMix.map((mix) => Number(mix.value.replace(/\D/g, "")));
const total = counts.reduce((sum, n) => sum + n, 0);

const BAR_TONES = ["bg-brand", "bg-ink/75", "bg-brand/35"] as const;

/**
 * Beat 03 — the client base, as one big static moment.
 *
 * Not pinned, on purpose. Two scroll-hijacks is a device; three is a tax, and
 * this beat has one thing to say rather than a sequence to walk through. It
 * earns its scale from typography instead — the three figures set at display
 * size against near-black is the loudest the page gets, which is right for the
 * last argument before the ask.
 *
 * Figures come from COMPANY-PROFILE.md via `lib/content`: 50+ government, 500+
 * domestic, 60+ international. The source design showed 40+ and 50+ for two of
 * the three, which contradicts the profile — the profile wins.
 *
 * It also gave each figure a progress bar filled to an arbitrary fraction. A bar
 * asserts a denominator and there wasn't one — "40+ government clients" is not
 * 35% of anything stated. Replaced with a single stacked bar of the three
 * segments, which has a real denominator (the ~610 total) and therefore actually
 * says something: a predominantly domestic book with serious public-sector and
 * cross-border depth.
 */
export function BeatTrusted() {
  return (
    <section className="relative isolate overflow-hidden bg-stage-ember py-16 md:py-22">
      <div className="container-page relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-3xl">
            <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.22em] text-brand-ink">
              <span className="font-display text-base">03</span>
              <span aria-hidden className="h-px w-8 bg-brand/35" />
              Who trusts it
            </p>
            <h2 className="mt-4 text-balance font-bold tracking-tight text-ink text-[2rem]/[1.15] sm:text-4xl/[1.1] lg:text-5xl/[1.05]">
              Six hundred organisations{" "}
              <span className="text-metal-red">got here before you.</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-ink/60">
            Government departments that cannot switch vendors mid-programme. Banks that
            audit their suppliers. Manufacturers that lose money by the hour. Each of them
            pushed on something — and what they pushed on is now standard.
          </p>
        </div>

        {/* The loudest moment on the page. */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {clientMix.map((segment, i) => {
            const Icon = ICONS[segment.icon] ?? Building2;
            const share = Math.round((counts[i] / total) * 100);
            return (
              <div
                key={segment.key}
                data-aos="fade-up"
                data-aos-delay={i * 70}
                className="relative bg-paper p-7 sm:p-9"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-white">
                    <Icon size={20} strokeWidth={2} aria-hidden />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink/40">
                    ~{share}% of the book
                  </span>
                </div>
                <div className="mt-7">
                  <Stat value={segment.value} label={segment.label} tone="brand" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{segment.note}</p>
              </div>
            );
          })}
        </div>

        {/* One bar, one denominator — the mix as it actually splits. */}
        <div
          data-aos="fade-up"
          className="mt-6 rounded-2xl border border-line bg-paper p-6 sm:p-7"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-ink">
            The mix, in proportion
          </p>
          <div
            role="img"
            aria-label={clientMix
              .map(
                (segment, i) =>
                  `${segment.label}: ${segment.value}, about ${Math.round((counts[i] / total) * 100)} percent`,
              )
              .join("; ")}
            className="mt-4 flex h-4 gap-1 overflow-hidden rounded-full"
          >
            {clientMix.map((segment, i) => (
              <span
                key={segment.key}
                style={{ width: `${(counts[i] / total) * 100}%` }}
                className={cn("h-full rounded-full", BAR_TONES[i])}
              />
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {clientMix.map((segment, i) => (
              <li
                key={segment.key}
                className="flex items-center gap-2 text-sm text-ink/65"
              >
                <span
                  aria-hidden
                  className={cn("h-2.5 w-2.5 shrink-0 rounded-full", BAR_TONES[i])}
                />
                {segment.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Who they are. */}
        <div className="mt-14">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-ink">
            Who we serve
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {clientSegments.map((segment, i) => {
              const Icon = ICONS[segment.icon] ?? Briefcase;
              return (
                <div
                  key={segment.name}
                  data-aos="fade-up"
                  data-aos-delay={(i % 4) * 60}
                  className="card-hover flex h-full flex-col rounded-xl border border-line bg-paper p-5"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand">
                    <Icon size={18} strokeWidth={2} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold leading-snug text-ink">
                    {segment.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                    {segment.note}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
