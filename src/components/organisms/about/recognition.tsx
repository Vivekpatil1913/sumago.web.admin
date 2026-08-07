import {
  Award,
  BadgeCheck,
  Building2,
  Landmark,
  Rocket,
  Sparkles,
  ShieldCheck,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Stat } from "@/components/molecules/stat";
import { awards, trustedBy } from "@/lib/content";
import { getMetrics } from "@/lib/cms";
import { metricValue } from "@/lib/cms/format";
import type { Metric } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/**
 * Recognition — the independent-proof band on /about.
 *
 * The audience is the evaluator, not the browser: a procurement head, a
 * government officer, a CTO shortlisting vendors. That reader is not looking
 * for decoration, they are looking for *verifiable standing* — who certified
 * it, what it covers, how long it has held, and whether a document can be
 * produced on request. Four beats, in the order that question gets answered:
 *
 *   1. Counters    — the scale the recognition sits on
 *   2. Certificates — the two top-tier assets, as floating seals
 *   3. Timeline    — awards on a dated rail: a record over time, not a badge bag
 *   4. Trusted by  — the roster grouped by segment, so an officer finds their own
 *
 * Every figure traces to COMPANY-PROFILE.md via `lib/site` and `lib/content`;
 * nothing here re-types a number that lives there. No auditor, appraiser or
 * outlet is named until it is verified — the credential lines say what the
 * standard *is* ("Level 5 of 5"), never who issued it.
 *
 * Motion is CSS + AOS only (no client bundle beyond the existing count-up
 * Stat): reveals fade up on scroll, seals float and their rings rotate, cards
 * lift and take a light sweep on hover *and* keyboard focus. All of it is
 * `motion-safe` and collapses under the global reduced-motion rules.
 */

const ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  BadgeCheck,
  Trophy,
  Sparkles,
  Award,
  Landmark,
  Building2,
  Rocket,
};

const certifications = awards.filter((a) => a.kind === "certification");
/** Chronological rail: dated recognitions first, any undated one last. */
const recognitions = awards
  .filter((a) => a.kind === "award")
  .sort((a, b) => (Number(a.year) || Infinity) - (Number(b.year) || Infinity));

/* ── Counters ──────────────────────────────────────────────────────────────
   Read off General Settings rather than re-typed, so these can never drift
   from the proof band earlier on the page. "Clients" is the sum of the
   verified client figures (50+ government, 500+ domestic, 60+ international) —
   the same 610+ the trust wall closes on, and it re-totals itself if a figure
   is corrected in the admin panel. */
function buildCounters(metrics: Metric[]): { value: string; label: string }[] {
  const clientTotal = metrics
    .filter((m) => m.label.toLowerCase().includes("clients"))
    .reduce((sum, m) => sum + (Number(m.value.replace(/\D/g, "")) || 0), 0);

  return [
    { value: metricValue(metrics, "Years", "13+"), label: "Years in operation" },
    // Drop the tile rather than print "0+" if no client metrics survive.
    ...(clientTotal > 0 ? [{ value: `${clientTotal}+`, label: "Clients served" }] : []),
    { value: metricValue(metrics, "Projects delivered", "700+"), label: "Projects delivered" },
  ];
}

/** Hairline block label used above each beat inside the section. */
function BlockLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      data-aos="fade-up"
      className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.22em] text-brand-ink"
    >
      {children}
      <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-brand/25 to-transparent" />
    </p>
  );
}

/**
 * Light sweep — a soft highlight crossing a card on hover or keyboard focus.
 * Transform + opacity only, so it costs the compositor nothing.
 */
function LightSweep() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      <span className="absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition-[left,opacity] duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-safe:group-hover:left-[120%] motion-safe:group-hover:opacity-100 motion-safe:group-focus-within:left-[120%] motion-safe:group-focus-within:opacity-100" />
    </span>
  );
}

/** Concentric guilloche rings — the watermark behind a certificate seal. */
function SealWatermark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 text-brand opacity-[0.06]"
    >
      {[92, 74, 56, 38].map((r) => (
        <circle
          key={r}
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      ))}
      <circle cx="100" cy="100" r="83" fill="none" stroke="currentColor" strokeDasharray="3 7" />
    </svg>
  );
}

export async function Recognition() {
  const counters = buildCounters(await getMetrics());

  return (
    /* Tighter than the site's default `py-16 md:py-22`: this section carries
       four stacked blocks, so the standard section padding on top of the
       block rhythm left the opening reading as a gap rather than a frame. */
    <Section
      id="recognition"
      className="relative isolate overflow-hidden bg-drafting py-12 md:py-16"
    >
      {/* Ambient brand bloom — one soft light source, top-centre. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-80 w-[52rem] -translate-x-1/2 rounded-full bg-brand/[0.07] blur-3xl"
      />

      <div className="relative z-10">
        <SectionHeading
          eyebrow="Our credibility"
          title={
            <>
              Recognition that <span className="text-metal-red">speaks before we do</span>.
            </>
          }
          description="Trusted by government, enterprises, and industry leaders — with certifications, awards, and recognition that back the work independently."
        />

        {/* ── 1 · Counters ─────────────────────────────────────────────────
            Three figures on a glass plate, hairline-separated. The count-up
            is the section's opening kinetic moment — it pulls the eye to the
            numbers an evaluator scans first. */}
        <ul
          data-aos="fade-up"
          className="mx-auto mt-9 grid max-w-4xl grid-cols-1 gap-y-6 rounded-2xl border border-line bg-paper/70 px-4 py-6 shadow-[0_1px_2px_rgba(26,26,26,0.04)] backdrop-blur-sm sm:grid-cols-3 sm:px-8"
        >
          {counters.map((item, i) => (
            <li
              key={item.label}
              className={cn(
                "px-2 sm:px-4 lg:px-6",
                i > 0 && "border-t border-line/80 pt-6 sm:border-l sm:border-t-0 sm:pt-0",
              )}
            >
              <Stat value={item.value} label={item.label} tone="metal" />
            </li>
          ))}
        </ul>

        {/* ── 2 · Featured certifications ──────────────────────────────────
            The two assets that decide a vendor shortlist, given the largest
            cards on the page. Each seal floats over its own ground shadow;
            scope and standing are spelled out because "ISO certified" alone
            answers nothing on a procurement checklist. */}
        <div className="mt-12">
          <BlockLabel>Featured certifications</BlockLabel>

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            {certifications.map((cert, i) => {
              const Icon = ICONS[cert.icon] ?? Award;
              return (
                <article
                  key={cert.title}
                  data-aos="fade-up"
                  data-aos-delay={i * 90}
                  className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-line bg-paper px-6 pb-7 pt-9 text-center shadow-[0_1px_2px_rgba(26,26,26,0.04)] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-brand/25 hover:shadow-[0_28px_64px_-32px_rgba(215,52,56,0.45)] motion-safe:hover:-translate-y-1 sm:px-9"
                >
                  <SealWatermark />
                  <LightSweep />

                  {/* Floating seal — the medallion bobs over a soft ground
                      shadow, so it reads as lifted off the card rather than
                      printed on it. */}
                  <div className="relative">
                    <span
                      aria-hidden
                      className="absolute -bottom-2 left-1/2 h-3 w-16 -translate-x-1/2 rounded-[100%] bg-ink/15 blur-md"
                    />
                    <span className="relative grid h-[5.5rem] w-[5.5rem] place-items-center motion-safe:animate-[tile-float_6s_ease-in-out_infinite]">
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-full border border-dashed border-brand/30 motion-safe:animate-[spin_26s_linear_infinite]"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-[0.45rem] rounded-full bg-brand/[0.07]"
                      />
                      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-strong text-white shadow-[0_10px_24px_-8px_rgba(215,52,56,0.9)] transition-transform duration-300 motion-safe:group-hover:scale-105">
                        <Icon size={26} strokeWidth={2} aria-hidden />
                      </span>
                    </span>
                  </div>

                  {/* Set uppercase, so tracking opens up rather than tightens —
                      a display negative letter-spacing closes caps into a block. */}
                  <h3 className="relative mt-6 font-display text-2xl font-bold uppercase leading-tight tracking-[0.02em] text-ink sm:text-[1.75rem]">
                    {cert.title}
                  </h3>
                  <p className="relative mt-1.5 text-base font-semibold text-ink/80">
                    {cert.tagline}
                  </p>
                  <p className="relative mt-2.5 max-w-md text-sm leading-relaxed text-ink/65">
                    {cert.detail}
                  </p>

                  <span className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-success">
                    <BadgeCheck size={13} aria-hidden />
                    {cert.org} · verified standard
                  </span>

                  {/* The procurement read: what it covers, where it stands. */}
                  <dl className="relative mt-5 grid w-full gap-px overflow-hidden rounded-xl border border-line bg-line text-left sm:grid-cols-2">
                    {[
                      { term: "Scope", value: cert.scope },
                      { term: "Standing", value: cert.standing },
                    ].map((row) => (
                      <div key={row.term} className="bg-mist/70 px-4 py-3.5">
                        {/* Micro-labels stay at ≥60% ink: below that, 11px
                            uppercase drops under 4.5:1 on this ground. */}
                        <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/60">
                          {row.term}
                        </dt>
                        <dd className="mt-1 text-sm font-medium leading-snug text-ink/80">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                </article>
              );
            })}
          </div>
        </div>

        {/* ── 3 · Recognition timeline ─────────────────────────────────────
            A dated rail rather than a tile grid: recognition earned across
            years reads as a track record, which three loose cards can't say.
            Horizontal on desktop, vertical on mobile. */}
        <div className="mt-12">
          <BlockLabel>Awards & national recognition</BlockLabel>

          <ol className="relative mt-8 grid gap-9 md:grid-cols-3 md:gap-8">
            {/* Desktop rail — runs through the centre of every marker row. */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-[0.5625rem] hidden h-px bg-gradient-to-r from-transparent via-line to-transparent md:block"
            />

            {recognitions.map((item, i) => {
              const Icon = ICONS[item.icon] ?? Trophy;
              const dated = Number.isFinite(Number(item.year));
              return (
                <li
                  key={`${item.title}-${item.year}`}
                  data-aos="fade-up"
                  data-aos-delay={i * 110}
                  className="relative"
                >
                  {/* Mobile connector — links this node to the next one. */}
                  {i < recognitions.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute -bottom-9 left-[0.3125rem] top-5 w-px bg-gradient-to-b from-line via-line to-transparent md:hidden"
                    />
                  ) : null}

                  {/* Marker row — dot on the rail, then the date. */}
                  <div className="relative flex h-[1.125rem] items-center gap-3">
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand shadow-[0_0_0_4px_rgba(245,245,246,1),0_0_0_5px_rgba(215,52,56,0.18)]"
                    />
                    <span
                      className={cn(
                        "font-display text-base font-bold tracking-tight",
                        dated ? "text-ink" : "uppercase text-brand-ink",
                      )}
                    >
                      {item.year}
                    </span>
                  </div>

                  <article className="group relative mt-4 h-full overflow-hidden rounded-2xl border border-line bg-paper p-6 shadow-[0_1px_2px_rgba(26,26,26,0.04)] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-brand/25 hover:shadow-[0_20px_48px_-26px_rgba(215,52,56,0.4)] motion-safe:hover:-translate-y-1">
                    <LightSweep />
                    <div className="relative flex items-center justify-between gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                        <Icon size={19} strokeWidth={2} aria-hidden />
                      </span>
                      <span className="text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/60">
                        {item.org}
                      </span>
                    </div>
                    <h3 className="relative mt-5 font-display text-base font-bold leading-snug text-ink">
                      {item.title}
                    </h3>
                    {item.recipient ? (
                      <p className="relative mt-2 text-xs font-medium text-brand-ink">
                        {item.recipient}
                      </p>
                    ) : null}
                    <p className="relative mt-2.5 text-sm leading-relaxed text-ink/65">
                      {item.detail}
                    </p>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ── 4 · Trusted by ───────────────────────────────────────────────
            Grouped by segment, so a government officer finds their own kind
            first instead of sorting 17 names in their head. Marks rest muted
            and resolve to full contrast on hover/focus — the greyscale-to-colour
            behaviour, done in a way that also works before real logos exist.
            [REAL ASSET NEEDED] Swap the text plates for <Image> marks (with
            `grayscale hover:grayscale-0`) once display consent is confirmed. */}
        <div className="mt-12">
          <BlockLabel>Trusted by</BlockLabel>

          <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3">
            {trustedBy.map((group, i) => {
              const Icon = ICONS[group.icon] ?? Building2;
              return (
                <div
                  key={group.segment}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  className="bg-paper/80 p-6 backdrop-blur-sm sm:p-7"
                >
                  <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-ink/60">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand/10 text-brand">
                      <Icon size={14} strokeWidth={2} aria-hidden />
                    </span>
                    {group.segment}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.names.map((name) => (
                      <li key={name}>
                        <span className="inline-flex rounded-lg border border-line bg-mist/60 px-3 py-2 text-sm font-semibold text-ink/60 transition-[color,border-color,background-color,transform] duration-200 hover:border-brand/30 hover:bg-paper hover:text-ink motion-safe:hover:-translate-y-0.5">
                          {name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </Section>
  );
}
