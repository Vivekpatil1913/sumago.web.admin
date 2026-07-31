import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CornerDownRight, Quote, ShieldCheck } from "lucide-react";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Button } from "@/components/atoms/button";
import { CapabilityCard } from "@/components/molecules/capability-card";
import { ChapterNav, type Chapter } from "@/components/molecules/chapter-nav";
import { HeroEffect } from "@/components/organisms/hero-effect";
import { HeroStars } from "@/components/three/hero-stars";
import { INDUSTRY_ICONS, FALLBACK_INDUSTRY_ICON } from "@/lib/industry-meta";
import { type IndustryPoint, type IndustryWithSlug } from "@/lib/industries";
import { industryPageCopy as copy } from "@/lib/industry-page-copy";
import { renderCopy } from "@/lib/rich-text";
import { company, type impactStories } from "@/lib/site";
import type { ServiceWithSlug } from "@/lib/services";
import { cn } from "@/lib/utils";

/**
 * The industry detail template — one layout, rendered for all 10 industries.
 *
 * DESIGN
 * The site's editorial language (tilted brand-gradient plates, oversized ghost
 * numerals, red gradient rules, light → mist → dark band rhythm) carrying a
 * narrative that belongs to industries rather than to services:
 *
 *   the week it starts with → where it hurts → what gets built for that exact
 *   friction → what changes → the services behind it → proof → other sectors
 *
 * The signature device is the pairing: `challenges[i]`, `solutions[i]`, and
 * `outcomes[i]` are authored in step (lib/industries.ts), so every build is
 * presented as the answer to a named friction, and every outcome names the build
 * that produces it. Nothing is proposed without a reason to exist on screen —
 * which is what makes the page read as understanding rather than as a brochure.
 *
 * DYNAMIC BY CONSTRUCTION — nothing here is written per industry:
 *   industry content ← `Industry` (lib/industries.ts)  → Sanity `industry` docs
 *   page chrome      ← `industryPageCopy`              → Sanity `industryPage`
 *   proof strip      ← `company` (lib/site.ts)         → Sanity `company`
 * There is not one literal industry name or heading in this file.
 *
 * Every section renders only when its data exists, so a sparse industry degrades
 * to a shorter page rather than an empty heading — and the chapter rail is built
 * from the sections that actually rendered.
 *
 * Server component: every effect is CSS. The only JS shipped is the hero's lazy
 * 3D starfield and the chapter rail's scroll-spy, which keeps the Lighthouse ≥95
 * gate (CLAUDE.md) intact.
 */

type Story = (typeof impactStories)[number];

/** Stable ids — shared by the sections and the chapter rail. */
const IDS = {
  reality: "reality",
  challenges: "friction",
  build: "what-gets-built",
  outcomes: "what-changes",
  services: "services",
  proof: "proof",
  siblings: "other-industries",
} as const;

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Dark cinematic hero. Keeps the industries backdrop (living mesh + the wave
 * star formation) so a visitor arriving from the index stays in the same world,
 * and closes on verified company proof — the fastest trust signal available
 * above the fold, and the only claim on this page carrying numbers.
 */
function IndustryHero({ industry }: { industry: IndustryWithSlug }) {
  const Icon = INDUSTRY_ICONS[industry.slug] ?? FALLBACK_INDUSTRY_ICON;
  /* Verified proof points only (COMPANY-PROFILE.md via lib/site.ts). */
  const proof = company.metrics.slice(0, 3);

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0a0708] text-white">
      <HeroEffect variant="mesh" redOpacity={0.5} particles={false} />
      <HeroStars formation="wave" />

      {/* Ghost watermark of the sector icon — depth without a container. */}
      <Icon
        aria-hidden
        strokeWidth={0.4}
        className="pointer-events-none absolute -right-16 top-1/2 z-0 hidden h-[34rem] w-[34rem] -translate-y-1/2 text-white/[0.03] lg:block"
      />

      <div className="container-page relative z-10 flex min-h-[100svh] flex-col justify-center py-24 pt-[clamp(6rem,12vh,9rem)]">
        <Link
          href="/industries"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft size={15} aria-hidden />
          {copy.hero.backLabel}
        </Link>

        {/* Identity line — icon on a tilted brand plate. */}
        <div className="group mt-10 flex items-center gap-4">
          <span className="relative inline-grid h-14 w-14 shrink-0 place-items-center md:h-16 md:w-16">
            <span
              aria-hidden
              className="absolute inset-0 -rotate-3 rounded-2xl bg-[linear-gradient(135deg,#d73438,#7a1519)] shadow-lg shadow-brand/30 transition-transform duration-500 group-hover:rotate-3"
            />
            <Icon size={28} className="relative text-white" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-white/40">
              {copy.hero.eyebrow}
            </p>
            <p className="mt-1 text-sm font-medium text-white/55">{industry.blurb}</p>
          </div>
        </div>

        <h1 className="mt-8 max-w-4xl text-balance text-4xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
          <span className="text-metal-red-shine">{industry.name}</span>
        </h1>

        <div className="mt-8 h-px w-24 bg-gradient-to-r from-brand to-transparent" />

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
          {industry.summary}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/contact">{copy.hero.primaryCta}</Button>
          <a
            href={`#${IDS.outcomes}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-white/70 transition-colors hover:text-white"
          >
            {copy.hero.secondaryCta}
            <ArrowRight size={15} aria-hidden />
          </a>
        </div>

        {/* Verified proof strip — certifications and real metrics, nothing else. */}
        <div className="mt-12 border-t border-white/10 pt-7">
          <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/35">
            {copy.hero.proofLabel}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
            {proof.map((m) => (
              <span key={m.label} className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold leading-none text-metal-red-shine">
                  {m.value}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-white/45">
                  {m.label}
                </span>
              </span>
            ))}
            {company.certifications.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm"
              >
                <ShieldCheck size={13} aria-hidden className="text-brand-bright" />
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  The reality                                                                */
/* -------------------------------------------------------------------------- */

/**
 * The hook. The operator's week is set as a pull-quote on a dark plate — their
 * own voice, so it carries the block — and the reply sits beside it on light
 * ground, so the two halves read as question and answer rather than two
 * paragraphs of the same essay.
 */
function Reality({ industry }: { industry: IndustryWithSlug }) {
  const Icon = INDUSTRY_ICONS[industry.slug] ?? FALLBACK_INDUSTRY_ICON;

  return (
    <Section id={IDS.reality} className="scroll-mt-32">
      <p
        data-aos="fade-up"
        className="mb-10 text-center text-sm font-bold uppercase tracking-[0.22em] text-brand-ink"
      >
        {copy.reality.eyebrow}
      </p>

      <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
        {/* Today — the quote, on the dark plate. */}
        <blockquote
          data-aos="fade-up"
          className="relative isolate overflow-hidden rounded-2xl bg-blueprint p-8 text-white shadow-[0_28px_60px_-30px_rgba(0,0,0,0.65)] md:p-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(75%_50%_at_15%_0%,rgba(215,52,56,0.24),transparent_70%)]"
          />
          <Icon
            aria-hidden
            strokeWidth={0.5}
            className="pointer-events-none absolute -bottom-10 -right-8 h-52 w-52 text-white/[0.05]"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/60">
              {copy.reality.todayLabel}
            </span>
            <Quote
              aria-hidden
              size={34}
              className="mt-7 text-brand/50"
              strokeWidth={1.5}
            />
            <p className="mt-4 text-xl leading-[1.5] tracking-tight text-white/90 md:text-2xl">
              {industry.problem}
            </p>
          </div>
        </blockquote>

        {/* The reply. */}
        <div
          data-aos="fade-up"
          data-aos-delay={80}
          className="relative flex flex-col justify-center rounded-2xl border border-brand/15 bg-brand/[0.04] p-8 md:p-10"
        >
          <h2 className="font-display text-xs font-bold uppercase tracking-[0.22em] text-brand-ink">
            {copy.reality.approachHeading}
          </h2>
          <div className="mt-5 h-px w-20 bg-gradient-to-r from-brand to-transparent" />
          <p className="mt-6 text-lg leading-relaxed tracking-tight text-ink md:text-xl">
            {industry.approach}
          </p>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Friction                                                                   */
/* -------------------------------------------------------------------------- */

/** Where it hurts today — the three frictions, as cards with ghost numerals. */
function Friction({ industry }: { industry: IndustryWithSlug }) {
  if (!industry.challenges.length) return null;

  return (
    <Section muted id={IDS.challenges} className="scroll-mt-32">
      <SectionHeading
        eyebrow={copy.challenges.eyebrow}
        title={renderCopy(copy.challenges.title)}
        description={
          copy.challenges.description
            ? renderCopy(copy.challenges.description, { industry: industry.name })
            : undefined
        }
      />
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {industry.challenges.map((c, i) => (
          <article
            key={c.title}
            data-aos="fade-up"
            data-aos-delay={(i % 3) * 70}
            className="group relative overflow-hidden rounded-2xl border border-line bg-paper p-7 transition-colors duration-300 hover:border-brand/30"
          >
            {/* Oversized ghost numeral, clipped by the card's rounded edge. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[5.5rem] font-bold leading-none text-ink/[0.05] transition-colors duration-500 group-hover:text-brand/[0.12]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="relative">
              <h3 className="max-w-[12rem] text-lg font-bold leading-snug text-ink">
                {c.title}
              </h3>
              <div className="mt-4 h-px w-10 bg-gradient-to-r from-brand to-transparent transition-[width] duration-500 group-hover:w-20" />
              <p className="mt-4 text-sm leading-relaxed text-ink/65">{c.description}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  What gets built                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The answer, paired. Each build names the friction it resolves — the same index
 * from the section above — so the page never proposes a platform without the
 * problem still on screen. A red rail runs down the column to tie the three
 * together as one programme rather than three unrelated products.
 */
function WhatGetsBuilt({ industry }: { industry: IndustryWithSlug }) {
  if (!industry.solutions.length) return null;

  return (
    <Section id={IDS.build} className="scroll-mt-32">
      <SectionHeading
        eyebrow={copy.build.eyebrow}
        title={renderCopy(copy.build.title, { industry: industry.name })}
        description={
          copy.build.description ? renderCopy(copy.build.description) : undefined
        }
      />

      <div className="relative mx-auto mt-14 max-w-4xl">
        {/* The rail tying the builds together. */}
        <div
          aria-hidden
          className="absolute left-[1.4rem] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand/50 via-brand/20 to-transparent sm:block"
        />

        {industry.solutions.map((s, i) => {
          const answers = industry.challenges[i];
          return (
            <div
              key={s.title}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 70}
              className="group relative flex gap-5 pb-10 last:pb-0 sm:gap-7"
            >
              {/* Node on the rail. */}
              <span className="relative z-10 mt-1 hidden h-11 w-11 shrink-0 place-items-center sm:grid">
                <span
                  aria-hidden
                  className="absolute inset-0 -rotate-3 rounded-xl bg-[linear-gradient(135deg,#d73438,#7a1519)] transition-transform duration-500 group-hover:rotate-3"
                />
                <span className="relative font-display text-xs font-bold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>

              <div className="min-w-0 flex-1 rounded-2xl border border-line bg-paper p-6 transition-all duration-300 group-hover:border-brand/30 group-hover:shadow-[0_24px_48px_-28px_rgba(215,52,56,0.3)] md:p-7">
                {/* The friction this answers — kept on screen with the answer. */}
                {answers ? (
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-ink/40">
                    <CornerDownRight size={13} aria-hidden className="text-brand/60" />
                    {answers.title}
                  </p>
                ) : null}
                <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-ink md:text-[1.375rem]">
                  {s.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink/70">{s.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  What changes                                                               */
/* -------------------------------------------------------------------------- */

/**
 * One outcome, set as type — no card chrome, so this band can never read as a
 * dark recolour of the friction cards above it.
 */
function OutcomeBody({ outcome, via }: { outcome: string; via?: IndustryPoint }) {
  return (
    <div>
      <h3 className="text-2xl font-bold leading-tight tracking-tight text-white lg:text-[1.75rem]">
        {outcome}
      </h3>
      {via ? (
        <p className="mt-4 text-sm leading-relaxed text-white/50">
          <span className="font-display text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/30">
            Delivered by
          </span>
          <br />
          {via.title}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Rail colour at position `t` along the journey (0 = where you are, 1 = where it
 * lands): a faint white hairline warming into full brand red. Computed rather
 * than hard-coded so the track reads continuously for any number of stations.
 */
function railColor(t: number) {
  const mix = (from: number, to: number) => Math.round(from + (to - from) * t);
  const alpha = (0.12 + 0.88 * t).toFixed(2);
  return `rgba(${mix(255, 215)},${mix(255, 52)},${mix(255, 56)},${alpha})`;
}

/** A station on the track — the rail passes behind it, the ink disc masks it. */
function OutcomeNode({ index }: { index: number }) {
  return (
    <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 bg-ink transition-colors duration-500 group-hover:border-brand/70">
      <span
        aria-hidden
        className="absolute inset-[0.3rem] rounded-full bg-[linear-gradient(135deg,#d73438,#7a1519)] opacity-25 transition-opacity duration-500 group-hover:opacity-100"
      />
      <span className="relative font-display text-xs font-bold tabular-nums text-white/70 transition-colors duration-500 group-hover:text-white">
        {String(index).padStart(2, "0")}
      </span>
    </span>
  );
}

/**
 * The dark, cinematic beat — what the operation feels once it's live, drawn as a
 * journey rather than a set of panels: one rail running from where you are to
 * where it lands, with the three outcomes as stations alternating above and
 * below it. Each credits the build that produces it (same index again), which is
 * what keeps this from reading as three adjectives on a dark background.
 *
 * Two markups by breakpoint — a horizontal track from `md` up, a vertical one
 * below it — because a three-station track can't shrink into a phone without
 * becoming unreadable, and mobile is redesigned rather than scaled (CLAUDE.md).
 */
function WhatChanges({ industry }: { industry: IndustryWithSlug }) {
  if (!industry.outcomes.length) return null;

  const stations = industry.outcomes.map((outcome, i) => ({
    outcome,
    via: industry.solutions[i],
    index: i + 1,
  }));

  return (
    <Section dark id={IDS.outcomes} className="relative overflow-hidden scroll-mt-32">
      {/* Ambient brand glow so the dark band feels lit, not flat. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_45%_at_50%_0%,rgba(215,52,56,0.18),transparent_70%)]"
      />
      <SectionHeading
        tone="dark"
        eyebrow={copy.outcomes.eyebrow}
        title={renderCopy(copy.outcomes.title, {}, "dark")}
        description={
          copy.outcomes.description
            ? renderCopy(copy.outcomes.description, { industry: industry.name })
            : undefined
        }
      />

      {/* ---- Horizontal track (md and up) ----
           Three shared grid rows (above / stations / below) with each station a
           `grid-rows-subgrid` column, so the rail sits on the station row's
           centre line no matter how long an outcome runs — no fixed heights to
           overflow. The rail is drawn as one segment per cell; the cells abut,
           so the segments read as a single continuous line. */}
      <div data-aos="fade-up" className="mx-auto mt-16 hidden max-w-5xl md:block">
        <div className="flex items-center justify-between font-display text-[0.7rem] font-bold uppercase tracking-[0.2em]">
          <span className="text-white/35">{copy.outcomes.journeyStart}</span>
          <span className="text-brand-bright">{copy.outcomes.journeyEnd}</span>
        </div>

        <ol
          className="mt-6 grid grid-rows-[1fr_auto_1fr]"
          style={{
            gridTemplateColumns: `repeat(${stations.length}, minmax(0, 1fr))`,
          }}
        >
          {stations.map(({ outcome, via, index }, i) => {
            const above = i % 2 === 0;
            const body = (
              <div
                className={cn(
                  "flex flex-col items-center px-3 lg:px-5",
                  above ? "self-end" : "self-start",
                )}
              >
                {above ? null : (
                  <span
                    aria-hidden
                    className="mb-6 h-7 w-px bg-gradient-to-t from-transparent to-brand/70"
                  />
                )}
                <OutcomeBody outcome={outcome} via={via} />
                {above ? (
                  <span
                    aria-hidden
                    className="mt-6 h-7 w-px bg-gradient-to-b from-transparent to-brand/70"
                  />
                ) : null}
              </div>
            );

            return (
              <li
                key={outcome}
                className="group row-span-3 grid grid-rows-subgrid text-center"
              >
                {above ? body : <span aria-hidden />}

                {/* Station row — carries this cell's slice of the rail. */}
                <div className="relative flex w-full items-center justify-center">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${railColor(
                        i / stations.length,
                      )}, ${railColor((i + 1) / stations.length)})`,
                    }}
                  />
                  <OutcomeNode index={index} />
                </div>

                {above ? <span aria-hidden /> : body}
              </li>
            );
          })}
        </ol>
      </div>

      {/* ---- Vertical track (below md) ---- */}
      <div className="relative mt-12 md:hidden">
        <span
          aria-hidden
          className="absolute bottom-6 left-6 top-6 w-px bg-gradient-to-b from-white/12 via-brand/45 to-brand"
        />
        <p className="mb-7 pl-[4.25rem] font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/35">
          {copy.outcomes.journeyStart}
        </p>
        <ol className="relative space-y-9">
          {stations.map(({ outcome, via, index }) => (
            <li key={outcome} data-aos="fade-up" className="group flex gap-5">
              <OutcomeNode index={index} />
              <div className="min-w-0 flex-1 pt-1">
                <OutcomeBody outcome={outcome} via={via} />
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-7 pl-[4.25rem] font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-bright">
          {copy.outcomes.journeyEnd}
        </p>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Services behind it                                                         */
/* -------------------------------------------------------------------------- */

/**
 * The capabilities most engagements in this sector draw on — the cross-link that
 * turns an industry visitor into a services reader, using the same card the home
 * page and services index use so nothing has to be maintained twice.
 */
function ServicesBehind({
  industry,
  services,
}: {
  industry: IndustryWithSlug;
  services: ServiceWithSlug[];
}) {
  if (!services.length) return null;

  return (
    <Section muted id={IDS.services} className="scroll-mt-32">
      <SectionHeading
        eyebrow={copy.services.eyebrow}
        title={renderCopy(copy.services.title)}
        description={
          copy.services.description
            ? renderCopy(copy.services.description, { industry: industry.name })
            : undefined
        }
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <div key={s.slug} data-aos="fade-up" data-aos-delay={(i % 4) * 60}>
            <CapabilityCard name={s.name} />
          </div>
        ))}
      </div>
      <div data-aos="fade-up" className="mt-10 text-center">
        <Button href="/solutions" variant="link">
          {copy.services.cta}
        </Button>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Proof                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Real work in this sector — only where it genuinely exists. Three industries
 * have a verified story; the rest render a flagged gap outside production
 * (docs/17) rather than a story stretched to fit.
 */
function Proof({
  industry,
  stories,
  isProd,
}: {
  industry: IndustryWithSlug;
  stories: Story[];
  isProd: boolean;
}) {
  if (!stories.length && isProd) return null;

  return (
    <Section id={IDS.proof} className="scroll-mt-32">
      <SectionHeading
        eyebrow={copy.proof.eyebrow}
        title={renderCopy(copy.proof.title)}
      />
      <div className="mx-auto mt-12 max-w-5xl">
        {stories.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {stories.map((s, i) => (
              <Link
                key={s.slug}
                href={`/impact/${s.slug}`}
                data-aos="fade-up"
                data-aos-delay={(i % 2) * 70}
                data-placeholder="stock"
                className="group relative flex min-h-[19rem] flex-col justify-end overflow-hidden rounded-2xl ring-1 ring-line transition-all duration-300 hover:-translate-y-1.5 hover:ring-brand/40 md:min-h-[21rem]"
              >
                <Image
                  src={s.cover}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent"
                />
                <span className="relative p-7">
                  <span className="font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-bright">
                    {s.industry} · {s.region}
                  </span>
                  <span className="mt-3 block text-xl font-bold leading-snug text-white md:text-2xl">
                    {s.title}
                  </span>
                  <span className="mt-3 block text-sm leading-relaxed text-white/70">
                    {s.summary}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-white">
                    Read the story
                    <ArrowRight
                      size={15}
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div
            data-placeholder="proof"
            className="rounded-xl border border-dashed border-amber-400/60 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900"
          >
            <span className="font-bold">[REAL PROOF NEEDED]</span> — no verified
            case study, metric, or attributed quote exists for {industry.name}.
            Needed from the client: one numbered outcome + one quote with consent.
            Hidden in production; see docs/PROOF-GAPS.md.
          </div>
        )}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Other industries                                                           */
/* -------------------------------------------------------------------------- */

/** Where next — the other sectors, as a compact icon rail. */
function Siblings({ siblings }: { siblings: IndustryWithSlug[] }) {
  if (!siblings.length) return null;

  return (
    <Section muted id={IDS.siblings} className="scroll-mt-32">
      <SectionHeading
        eyebrow={copy.siblings.eyebrow}
        title={renderCopy(copy.siblings.title)}
      />
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {siblings.map((s, i) => {
          const Icon = INDUSTRY_ICONS[s.slug] ?? FALLBACK_INDUSTRY_ICON;
          return (
            <Link
              key={s.slug}
              href={`/industries/${s.slug}`}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 50}
              className="group flex items-center gap-3.5 rounded-xl border border-line bg-paper px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-[0_18px_36px_-24px_rgba(215,52,56,0.35)]"
            >
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand/15 bg-brand/[0.06] text-brand transition-colors duration-300 group-hover:border-transparent group-hover:bg-[linear-gradient(135deg,#d73438,#7a1519)] group-hover:text-white">
                <Icon size={18} aria-hidden />
              </span>
              <span className="min-w-0 flex-1 font-medium leading-snug text-ink transition-colors group-hover:text-brand-ink">
                {s.name}
              </span>
              <ArrowRight
                size={16}
                aria-hidden
                className="shrink-0 text-brand/60 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          );
        })}
      </div>
      <div data-aos="fade-up" className="mt-10 text-center">
        <Button href="/industries" variant="link">
          {copy.siblings.cta}
        </Button>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export function IndustryDetail({
  industry,
  services,
  stories,
  siblings,
  isProd,
}: {
  industry: IndustryWithSlug;
  services: ServiceWithSlug[];
  stories: Story[];
  siblings: IndustryWithSlug[];
  isProd: boolean;
}) {
  /* The rail lists only the chapters this industry actually renders, in page
     order — so it can never point at a section that isn't there. */
  const chapters: Chapter[] = [
    { id: IDS.reality, label: copy.reality.navLabel, show: true },
    {
      id: IDS.challenges,
      label: copy.challenges.navLabel,
      show: industry.challenges.length > 0,
    },
    { id: IDS.build, label: copy.build.navLabel, show: industry.solutions.length > 0 },
    {
      id: IDS.outcomes,
      label: copy.outcomes.navLabel,
      show: industry.outcomes.length > 0,
    },
    { id: IDS.services, label: copy.services.navLabel, show: services.length > 0 },
    { id: IDS.proof, label: copy.proof.navLabel, show: stories.length > 0 },
    { id: IDS.siblings, label: copy.siblings.navLabel, show: siblings.length > 0 },
  ]
    .filter((c) => c.show)
    .map(({ id, label }) => ({ id, label }));

  return (
    <>
      <IndustryHero industry={industry} />
      <ChapterNav chapters={chapters} />
      <Reality industry={industry} />
      <Friction industry={industry} />
      <WhatGetsBuilt industry={industry} />
      <WhatChanges industry={industry} />
      <ServicesBehind industry={industry} services={services} />
      <Proof industry={industry} stories={stories} isProd={isProd} />
      <Siblings siblings={siblings} />
      {/* No CTA band here — the site footer already closes every page with the
          same "Let's build what your business needs next" call to action. */}
    </>
  );
}
