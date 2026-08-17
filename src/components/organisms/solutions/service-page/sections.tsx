import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Media, isStockAsset } from "@/components/molecules/media-placeholder";
import { ToolStrip } from "@/components/molecules/tool-strip";
import { INDUSTRY_ICONS, FALLBACK_INDUSTRY_ICON } from "@/lib/industry-meta";
import { getToolIcons, toolIcons } from "@/lib/tool-icons";
import type { ServiceWithSlug } from "@/lib/services";
import type { ServicePageContent } from "@/lib/service-page";
import { cn, slugify } from "@/lib/utils";
import { BuildSlider } from "./build-slider";
import { CapabilitiesScroller } from "./capabilities-scroller";
import { UnderstandingVisual } from "./understanding-visual";
import { WhyStandout } from "./why-standout";
import {
  GhostNumeral,
  IconTile,
  MicroLabel,
  Plate,
  Rule,
  SectionIntro,
  SectionShell,
  stagger,
} from "./primitives";

/**
 * SERVICE PAGE — SECTIONS 02 → 12
 *
 * Every section takes the same two props and reads only from the resolved
 * content object, never from the service directly. The composition (index.tsx)
 * renders all of them, in this order, for every one of the fifteen services.
 *
 * THE ARGUMENT IS EDUCATE-FIRST. Section 02 teaches; section 03 makes the value
 * case; the reader's problem appears inside 03 as the reason a value driver
 * matters, never as the page's opening move.
 *
 * VISUAL RHYTHM — the rewrite that matters. Every section now owns a *different
 * device*, drawn from the language the rest of this site already speaks (the
 * team page, the Solutions index, the About story, the home process road):
 *
 *   02  sticky editorial split · ghost-numeral ledger · three plate columns
 *   03  a stacked bar diagram beside a numbered ledger      (About core values)
 *   04  a self-advancing index rail beside a single stage   (the only autoplay)
 *   05  a card-free comparison, arrows down the centre
 *   06  a pinned vertical scroller, one group per screen    (About journey)
 *   07  a horizontal snap rail of border-left columns       (home impact rail)
 *   08  a road timeline, labels alternating above and below (home process)
 *   09  oversized ghost numerals carrying the type          (team page)
 *   10  two tool marquees running in opposite directions    (home AI/SDLC)
 *   11  full-bleed image beside the story, no card
 *
 * Card chrome survives in exactly one place — nowhere. What was forty-odd
 * bordered tiles is now hairlines, plates and type, which is both how this site
 * is designed elsewhere and what stops a twelve-section page reading as a
 * documentation template.
 *
 * Surface rhythm, fixed: hero ink · understanding paper · value mist ·
 * build paper · outcomes mist · capabilities paper · industries mist ·
 * process paper · why-us mist · technology paper · proof mist · close ink.
 */

type SectionProps = { service: ServiceWithSlug; content: ServicePageContent };

/* ========================================================================== */
/*  02 · UNDERSTANDING                                                         */
/* ========================================================================== */

/**
 * The primer, as an editorial split: the headline holds the left column and
 * stays with the reader while the explanation scrolls past it — the sticky-header
 * device the Solutions index uses for its stages.
 *
 * Then the shifts as a ghost-numeral ledger, and the three ways the service
 * shows up as open columns divided by hairlines. No card in the section.
 */
export function Understanding({ service, content }: SectionProps) {
  const { understanding } = content;

  /* The authored headline where the service wrote one — the blueprints open on
     the discipline itself ("What a web platform really is"), which teaches
     faster than a title assembled from the service name. The derived one is the
     fallback, so the section always has a headline. */
  const titleNode = understanding.title ? (
    <>{understanding.title}</>
  ) : (
    <>
      What {service.name.toLowerCase()} means for{" "}
      <span className="text-brand-ink">modern business</span>.
    </>
  );

  const narrative = understanding.narrative.map((p, i) => (
    <p
      key={p}
      data-aos="fade-up"
      data-aos-delay={stagger(i)}
      className={
        i === 0
          ? "text-xl leading-[1.55] tracking-[-0.01em] text-ink md:text-2xl"
          : "text-lg leading-[1.7] text-ink/60"
      }
    >
      {p}
    </p>
  ));

  /* The subject, floating on the paper — a handset where the service builds
     one, its own drawing everywhere else (`understanding-visual.tsx`). Each
     carries its own dark surface and brand halo, so it needs no plate behind it,
     and each occupies the same art box, so this column is the same height on all
     fifteen pages. */
  const showcase = (
    <figure data-aos="fade-up" data-aos-delay="120">
      <UnderstandingVisual service={service} content={content} />
    </figure>
  );

  return (
    <SectionShell id="understanding" surface="paper">
      {/* The primer and the thing it explains, as a balanced, vertically-centred
          split, so neither column leaves the other with dead space. The visual
          follows the copy in source order, so a phone reads the discipline
          first and meets the drawing under it rather than above it. */}
      <div className="grid grid-cols-12 items-center gap-y-12 md:gap-8">
        <div className="col-span-12 lg:col-span-6">
          <SectionIntro
            align="left"
            eyebrow="Understanding the discipline"
            title={titleNode}
          />
          <div className="mt-8 space-y-6">{narrative}</div>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          {showcase}
        </div>
      </div>

      {/* What changed — a ledger, numerals behind the type.

          `md:gap-x-8`, not `gap-x-8`: eleven 2rem gaps give a twelve-column grid
          a 352px minimum width, which overflows a 320px viewport before any
          content is in it. Below md every item spans all twelve columns, so the
          horizontal gap has nothing to space anyway. */}
      {understanding.shifts.length ? (
        <ul className="mt-20 grid grid-cols-12 border-t border-line md:mt-24 md:gap-x-8">
          {understanding.shifts.map((s, i) => (
            <li
              key={s}
              data-aos="fade-up"
              data-aos-delay={stagger(i)}
              className="group relative col-span-12 border-b border-line py-7 sm:col-span-6 lg:col-span-3 lg:border-b-0 lg:py-9"
            >
              <GhostNumeral
                n={i + 1}
                className="absolute -top-3 left-0 text-[4.5rem]"
              />
              <p className="relative pt-6 text-[0.95rem] font-medium leading-[1.55] text-ink/75">
                {s}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      {/* The three ways it shows up — open columns, hairline-divided. */}
      {understanding.cards.length ? (
        <div className="mt-16 grid grid-cols-12 gap-y-12 border-t border-line pt-14 md:gap-8">
          {understanding.cards.map((c, i) => (
            <div
              key={c.title}
              data-aos="fade-up"
              data-aos-delay={stagger(i)}
              className="group col-span-12 md:col-span-6 lg:col-span-4 lg:border-l lg:border-line lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
            >
              <Plate icon={c.icon} size="lg" />
              <h3 className="mt-7 text-xl font-bold leading-snug tracking-[-0.01em] text-ink">
                {c.title}
              </h3>
              <Rule className="mt-4" />
              <p className="mt-4 text-[0.95rem] leading-[1.7] text-ink/60">
                {c.description}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </SectionShell>
  );
}

/* ========================================================================== */
/*  03 · WHY BUSINESSES INVEST                                                 */
/* ========================================================================== */

/**
 * The value case: a stacked bar diagram beside a numbered ledger — the same
 * shape the About page's core values use, where one diagram anchors a list
 * rather than every item getting its own tile.
 *
 * The bars step up in width and brand intensity, so the section reads as
 * compounding return before a word of it is read. The diagram sticks while the
 * ledger scrolls, which pairs each row with its own bar.
 */
export function ValueDrivers({ service, content }: SectionProps) {
  const { valueDrivers } = content;
  if (!valueDrivers.length) return null;

  return (
    <SectionShell id="why-invest" surface="mist">
      <div className="grid grid-cols-12 gap-y-12 md:gap-8">
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionIntro
              align="left"
              eyebrow="The business case"
              title={
                <>
                  Why businesses invest in{" "}
                  <span className="text-brand-ink">
                    {service.name.toLowerCase()}
                  </span>
                  .
                </>
              }
              lead="Returns that show up on the business, not on the engineering backlog."
            />

            {/* The diagram: one bar per driver, stepping up. */}
            <ul data-aos="fade-up" className="mt-12 hidden space-y-3 lg:block">
              {valueDrivers.map((v, i) => {
                const pct = 34 + (i * 66) / Math.max(valueDrivers.length - 1, 1);
                return (
                  <li key={v.title} className="flex items-center gap-4">
                    <span className="w-6 shrink-0 text-xs font-bold tabular-nums text-ink/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="h-2.5 rounded-full bg-[linear-gradient(90deg,#7a1519,#d73438)]"
                      style={{ width: `${pct}%`, opacity: 0.35 + i * 0.16 }}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <ul className="col-span-12 border-t border-line lg:col-span-6 lg:col-start-7">
          {valueDrivers.map((v, i) => (
            <li
              key={v.title}
              data-aos="fade-up"
              data-aos-delay={stagger(i)}
              className="group relative border-b border-line py-8"
            >
              <div className="flex items-start gap-5">
                <span className="mt-1 text-xs font-bold tabular-nums text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold leading-snug tracking-[-0.01em] text-ink md:text-2xl">
                    {v.title}
                  </h3>
                  {v.description ? (
                    <p className="mt-3 text-[0.95rem] leading-[1.7] text-ink/60">
                      {v.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}

/* ========================================================================== */
/*  04 · WHAT WE BUILD                                                         */
/* ========================================================================== */

/**
 * The catalogue, as a self-advancing spotlight: an index rail carrying the whole
 * range as numbered names, and one stage carrying the detail of whichever row is
 * live. The nine-cell matrix this replaces showed everything at once and read as
 * density rather than range — nine purposes, nine value lines and forty feature
 * words competing on a single screen.
 *
 * The rail moves itself, which is what tells a reader it *is* a rail; it stops
 * on hover, focus or a click. See build-spotlight.tsx for the motion rationale.
 */
export function WhatWeBuild({ content }: SectionProps) {
  const { whatWeBuild } = content;
  if (!whatWeBuild.length) return null;

  return (
    <SectionShell id="what-we-build" surface="paper">
      <SectionIntro
        eyebrow="What we build & capabilities"
        title={
          <>
            The things you can commission — and{" "}
            <span className="text-brand-ink">what each one ships with</span>.
          </>
        }
        lead="Defined engagements, one at a time: the thing itself on screen, and the capabilities that come with it."
      />

      {/* One item at a time. The marks are rendered here, on the server:
          BuildCard.icon is a Lucide component and components don't cross into a
          client boundary. `glyph` is the small header mark on the mock; `plate`
          the larger mark on the info panel. */}
      <BuildSlider
        mock={content.buildMock}
        items={whatWeBuild.map(({ icon: Icon, ...b }) => ({
          ...b,
          glyph: <Icon size={15} strokeWidth={2} className="text-white" />,
          plate: <Plate icon={Icon} size="lg" />,
        }))}
      />
    </SectionShell>
  );
}

/* ========================================================================== */
/*  05 · BUSINESS OUTCOMES                                                     */
/* ========================================================================== */

/**
 * The ROI section, as a card-free comparison: two columns of type with the
 * arrows running down the centre. The boxed table this replaces was credible
 * but inert — hairlines and a red arrow column carry the same authority while
 * matching the rest of the page.
 *
 * No percentages appear here. None are verified (docs/PROOF-GAPS.md), and an
 * invented figure would undo the trust the page is built to earn.
 */
export function Outcomes({ content }: SectionProps) {
  const { outcomes } = content;

  return (
    <SectionShell id="outcomes" surface="mist">
      <SectionIntro
        eyebrow="Business outcomes"
        title={
          <>
            Where the business is today, and{" "}
            <span className="text-brand-ink">what changes</span>.
          </>
        }
        lead="The operational difference, in the terms the business already measures itself in."
      />

      {outcomes.rows.length ? (
        <div className="mx-auto mt-14 max-w-5xl md:mt-18">
          {/* Column titles — desktop only; on mobile the cards stack and the
              red/green dots carry the before/after. */}
          <div className="mb-3 hidden grid-cols-2 gap-4 md:grid">
            <p className="px-2 text-xs font-bold uppercase tracking-[0.14em] text-brand">
              Today
            </p>
            <p className="px-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">
              Business outcome
            </p>
          </div>

          {/* Capped at five: the pattern is clear by the fifth row. Each row is
              the problem (red) beside the outcome (green) — the before/after read
              left to right, and stacks on mobile. */}
          <div className="space-y-4">
            {outcomes.rows.slice(0, 5).map((r, i) => (
            <div
              key={r.before}
              data-aos="fade-up"
              data-aos-delay={stagger(i)}
              className="grid gap-4 md:grid-cols-2"
            >
              {/* the problem — red */}
              <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/70 px-5 py-4">
                <span aria-hidden className="mt-[0.4rem] h-2 w-2 shrink-0 rounded-full bg-brand" />
                <span className="text-[0.95rem] leading-[1.5] text-ink/55">
                  {r.before}
                </span>
              </div>
              {/* the outcome — green */}
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-4">
                <span aria-hidden className="mt-[0.4rem] h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="text-[0.95rem] font-semibold leading-[1.5] text-ink">
                  {r.after}
                </span>
              </div>
            </div>
            ))}
          </div>
        </div>
      ) : null}

      {outcomes.statements.length ? (
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-12 gap-y-8 md:gap-8">
          {outcomes.statements.map((s, i) => (
            <div
              key={s}
              data-aos="fade-up"
              data-aos-delay={stagger(i)}
              className="group col-span-12 md:col-span-4"
            >
              <Rule />
              <p className="mt-4 text-lg font-semibold leading-snug text-ink">
                {s}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </SectionShell>
  );
}

/* ========================================================================== */
/*  06 · CAPABILITIES                                                          */
/* ========================================================================== */

/**
 * A pinned vertical scroller (capabilities-scroller.tsx): the section holds
 * while each group rises through the viewport, one per screen — the About
 * journey's instrument, turned bottom-to-top. Each panel is the Solutions
 * index's service card rebuilt for a group: ghost watermark, tilted plate,
 * running index, category in metallic red, red rule, then the items with the
 * reason each one matters.
 *
 * The scroller owns the section heading and the `capabilities` anchor.
 */
export function Capabilities({ content }: SectionProps) {
  const { capabilities } = content;
  if (!capabilities.length) return null;

  return (
    <CapabilitiesScroller
      /* The plate and the watermark are rendered here, on the server: a Lucide
         icon is a component, and components don't cross a client boundary. */
      groups={capabilities.map(({ icon: Icon, ...g }) => ({
        ...g,
        plate: <Plate icon={Icon} size="lg" />,
        watermark: <Icon aria-hidden strokeWidth={0.5} className="h-full w-full" />,
      }))}
    />
  );
}

/* ========================================================================== */
/*  07 · INDUSTRIES WE SERVE                                                   */
/* ========================================================================== */

/**
 * A horizontal snap rail — the device the home page uses for flagship work.
 * Sectors are a list you browse, not a grid you audit, and a rail says that
 * while keeping a nine-sector section to one screen instead of three rows of
 * tiles.
 *
 * Each entry is a column with a hairline down its left edge rather than a card,
 * so the rail reads as one continuous strip of type.
 */
export function Industries({ content }: SectionProps) {
  const { industries } = content;
  if (!industries.length) return null;

  return (
    <SectionShell id="industries" surface="mist">
      <SectionIntro
        eyebrow="Industries we serve"
        title={
          <>
            The same discipline,{" "}
            <span className="text-brand-ink">shaped to your sector</span>.
          </>
        }
        lead="Regulation, procurement and legacy estate differ by industry — and the engagement is shaped around them, not in spite of them."
      />

      <div
        data-aos="fade-up"
        className="no-scrollbar -mx-5 mt-14 overflow-x-auto md:-mx-8 md:mt-18"
      >
        <ul className="flex snap-x snap-mandatory gap-8 px-5 md:px-8">
          {industries.map((ind) => {
            const slug = slugify(ind.name);
            const Icon = INDUSTRY_ICONS[slug] ?? FALLBACK_INDUSTRY_ICON;

            /* Only the ten catalog industries have a page behind them. Some
               services serve an audience rather than a sector — "boards doing
               due diligence", "startups scaling up" — and linking those would
               point at a route that does not exist, so they render as the same
               card without the link. */
            const hasPage = slug in INDUSTRY_ICONS;

            const body = (
              <>
                <Plate icon={Icon} />
                <h3 className="mt-6 flex items-start gap-1.5 text-lg font-bold leading-snug text-ink">
                  {ind.name}
                  {hasPage ? (
                    <ArrowUpRight
                      size={15}
                      aria-hidden
                      className="mt-1 shrink-0 text-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  ) : null}
                </h3>
                {ind.description ? (
                  <p className="mt-2.5 text-[0.9rem] leading-[1.65] text-ink/55">
                    {ind.description}
                  </p>
                ) : null}
                {ind.useCase ? (
                  <div className="mt-auto pt-6">
                    <MicroLabel className="text-ink/35">
                      Typical use case
                    </MicroLabel>
                    <p className="mt-2 text-[0.9rem] leading-[1.65] text-ink/70">
                      {ind.useCase}
                    </p>
                  </div>
                ) : null}
              </>
            );

            const cardCls =
              "group flex h-full flex-col border-l border-line pl-6 transition-colors duration-300";

            return (
              <li key={ind.name} className="w-[17.5rem] shrink-0 snap-start">
                {hasPage ? (
                  <Link href={`/industries/${slug}`} className={`${cardCls} hover:border-brand/50`}>
                    {body}
                  </Link>
                ) : (
                  <div className={cardCls}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </SectionShell>
  );
}

/* ========================================================================== */
/*  08 · OUR ENGINEERING PROCESS                                               */
/* ========================================================================== */

/**
 * The road timeline, borrowed from the home page's process section: nodes on a
 * single line, with labels alternating above and below it.
 *
 * The alternation is what solves the eight-step problem. Eight columns on a
 * 1280px grid gives each label 145px, which is unreadable — but staggering them
 * lets every label occupy the width of two columns, because its neighbours sit
 * on the other side of the line. On mobile the road stands up into a spine.
 *
 * Pure CSS, unlike the home page's scrubbed version: this page already carries
 * a 3D hero, and a second animation loop would cost the frame budget nothing
 * useful (docs/06).
 */
export function Process({ content }: SectionProps) {
  const { process } = content;
  if (!process.length) return null;

  return (
    <SectionShell id="process" surface="paper">
      <SectionIntro
        eyebrow="Our engineering process"
        title={
          <>
            How the engagement{" "}
            <span className="text-brand-ink">actually runs</span>.
          </>
        }
        lead="Every stage has an owner, an output, and a point where you can change direction."
      />

      {/* Desktop — the road.

          `xl:`, not `lg:`. Each step's card is a fixed 13.5rem centred over its
          column, so it overhangs by half the difference between the card and
          the column. At 1024 with seven or eight steps that overhang runs past
          the container and puts a horizontal scrollbar on the page; by 1280 it
          sits inside the gutter. Between the two, the stood-up road below is
          the better layout anyway. */}
      <ol
        data-aos="fade-up"
        className="relative mt-20 hidden xl:grid"
        style={{
          gridTemplateColumns: `repeat(${process.length}, minmax(0,1fr))`,
        }}
      >
        <span
          aria-hidden
          className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(90deg,rgba(215,52,56,0.55),rgba(215,52,56,0.12))]"
        />
        {process.map((step, i) => {
          const above = i % 2 === 0;
          return (
            <li
              key={step.title}
              className="group relative flex h-[21rem] items-center justify-center"
            >
              <div
                className={`absolute w-[13.5rem] px-1 text-center ${
                  above ? "bottom-1/2 mb-10" : "top-1/2 mt-10"
                }`}
              >
                <p className="text-xs font-bold tabular-nums text-brand">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-base font-bold leading-snug text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.8125rem] leading-[1.6] text-ink/55">
                  {step.description}
                </p>
              </div>

              {/* Stem from the node out to its label. */}
              <span
                aria-hidden
                className={`absolute left-1/2 h-8 w-px -translate-x-1/2 bg-line ${
                  above ? "bottom-1/2 mb-6" : "top-1/2 mt-6"
                }`}
              />
              <IconTile icon={step.icon} className="relative z-10 shadow-[0_0_0_6px_#fff]" />
            </li>
          );
        })}
      </ol>

      {/* Mobile and tablet — the road stood up. */}
      <ol className="mt-14 xl:hidden">
        {process.map((step, i) => (
          <li
            key={step.title}
            data-aos="fade-up"
            data-aos-delay={stagger(i)}
            className="group relative flex gap-5 pb-9 last:pb-0"
          >
            {i < process.length - 1 ? (
              <span
                aria-hidden
                className="absolute left-[21px] top-12 h-[calc(100%-3rem)] w-px bg-line"
              />
            ) : null}
            <IconTile icon={step.icon} className="relative z-10" />
            <div className="min-w-0">
              <p className="text-xs font-bold tabular-nums text-brand">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1.5 text-base font-bold leading-snug text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[0.875rem] leading-[1.6] text-ink/60">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

/* ========================================================================== */
/*  09 · WHY SUMAGO                                                            */
/* ========================================================================== */

/**
 * The trust close, carried entirely by type over oversized ghost numerals —
 * the team page's treatment. Eight reasons in four columns, no chrome, so the
 * section reads as a summary rather than as eight more things to evaluate.
 */
export function WhyUs({ content }: SectionProps) {
  const { whyUs } = content;
  if (!whyUs.length) return null;

  return (
    <SectionShell id="why-us" surface="mist">
      {/* The trust close, at the standard intro scale — the standout scene below
          carries the emphasis. No icons on the reasons; the type carries them. */}
      <SectionIntro
        eyebrow="Why Sumago"
        title={
          <>
            Why teams <span className="text-brand-ink">choose Sumago</span>.
          </>
        }
        lead="The technology partner serious businesses build with — and stay with."
      />

      {/* The standout — one brand chosen over the alternatives. */}
      <WhyStandout points={content.standoutPoints} />

      {/* `md:gap-x-8` for the same reason as the shifts ledger above: eleven
          2rem gaps alone exceed a 320px viewport.

          The row gap has to clear the ghost numeral, not just the text. Each
          numeral is lifted above its own card (`-top-8`), so it eats into the
          gap above it — at `gap-y-14` that left ~16px between one card's last
          line and the next card's numeral, which read as a single unbroken
          column on a phone where every card stacks. `gap-y-24` restores a
          clear break; from `md` the cards sit two and four to a row, so there
          are fewer seams and less gap is needed. */}
      <div className="mt-20 grid grid-cols-12 gap-y-24 md:mt-24 md:gap-x-8 md:gap-y-16">
        {whyUs.map((d, i) => (
          <div
            key={d.title}
            data-aos="fade-up"
            data-aos-delay={stagger(i)}
            className="group relative col-span-12 sm:col-span-6 lg:col-span-3"
          >
            {/* Smaller and less lifted on a phone: at 5rem the numeral reached
                back into the card above it. */}
            <GhostNumeral
              n={i + 1}
              className="absolute -left-1 -top-8 text-[4rem] md:-top-10 md:text-[5rem]"
            />
            <div className="relative">
              <Rule />
              <h3 className="mt-5 text-lg font-bold leading-snug text-ink">
                {d.title}
              </h3>
              <p className="mt-2.5 text-[0.9rem] leading-[1.65] text-ink/60">
                {d.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ========================================================================== */
/*  10 · TECHNOLOGY ECOSYSTEM                                                  */
/* ========================================================================== */

/**
 * Two marquees running in opposite directions — the home page's "AI across the
 * SDLC" device, which is the site's most recognisable moment and belongs here
 * for the same reason it works there: a stack is atmosphere, not a checklist.
 * Nobody audits it; they register the range and move on.
 *
 * It also arrives on screen ten, after the business case has been made, which
 * is the whole point of holding technology back.
 */
export function Technology({ service, content }: SectionProps) {
  /* The home page's full thirty-mark set, so the bands here read exactly like
     the "AI across the SDLC" moment rather than as a thin, service-only strip.
     Anything a service works in that ISN'T in that set (AWS, Flutter, …) is
     appended, so the service's own stack is still represented. */
  const serviceMarks = getToolIcons(content.tech.tools);
  const marks = [
    ...toolIcons,
    ...serviceMarks.filter((m) => !toolIcons.some((t) => t.title === m.title)),
  ];
  if (!marks.length && !content.tech.technologies.length) return null;

  /* Split in half into two bands running opposite ways at different speeds —
     the same device, and the same halving, as the home page. */
  const mid = Math.ceil(marks.length / 2);
  const rowA = marks.slice(0, mid).map((m) => m.title);
  const rowB = marks.slice(mid).map((m) => m.title);

  return (
    <SectionShell id="technology" surface="ink">
      {/* Ambient brand glow — an ink band with no light in it reads as a hole in
          the page rather than as a deliberate change of register. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(75%_45%_at_50%_0%,rgba(215,52,56,0.16),transparent_70%)]"
      />

      <SectionIntro
        surface="ink"
        eyebrow="Technology ecosystem"
        title={
          <>
            Mainstream technology, chosen so you can{" "}
            <span className="text-brand-bright">hire for it later</span>.
          </>
        }
        lead="The stack is a means, not a position. It gets chosen against your constraints — and it stays maintainable by people who aren't us."
      />

      {content.tech.technologies.length ? (
        <div
          data-aos="fade-up"
          className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-3"
        >
          {content.tech.technologies.map((t) => (
            <span
              key={t}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {marks.length ? (
        <div data-aos="fade-up" className="mt-12 space-y-2">
          {/* `tone="light"` — the white brand tiles of the home page bands, which
              are what these marks were colour-picked for. */}
          <ToolStrip
            tools={rowA}
            label={`Technologies used for ${service.name}`}
            tone="light"
            size="lg"
            variant="marquee"
            speed={42}
          />
          {/* The second band is the rest of the set — announced once by the
              first band is enough, so this one is hidden from assistive tech
              rather than repeating the whole list. */}
          <div aria-hidden>
            <ToolStrip
              tools={rowB}
              label={`More technologies used for ${service.name}`}
              tone="light"
              size="lg"
              variant="marquee"
              speed={48}
              reverse
            />
          </div>
        </div>
      ) : null}
    </SectionShell>
  );
}

/* ========================================================================== */
/*  11 · PROOF OF WORK                                                         */
/* ========================================================================== */

/**
 * Projects, not testimonials — set as full-bleed image beside the story rather
 * than as a card, so a single real engagement reads as substantial instead of
 * as one lonely tile in a grid built for six.
 *
 * There are no metric tiles here, and that is not an oversight: no per-project
 * figure has been verified with a client (docs/PROOF-GAPS.md). A fabricated
 * "40% faster" would cost more trust than an empty slot saves.
 */
export function Proof({
  service,
  content,
  isProd,
}: SectionProps & { isProd: boolean }) {
  const stories = content.proof;
  if (!stories.length && isProd) return null;

  return (
    /* Tighter than the page's `py-24 md:py-32` rhythm, and only here: every
       other section frames several blocks, while this one now frames a single
       compact card — at full height the frame was taller than its contents. */
    <SectionShell
      id="proof"
      surface="mist"
      className="pb-16 pt-10 md:pb-20 md:pt-12"
    >
      <SectionIntro
        eyebrow="Proof of work"
        title={
          <>
            Work that has already{" "}
            <span className="text-brand-ink">shipped</span>.
          </>
        }
        lead="Real engagements, named clients, and what changed for the business behind them."
      />

      {stories.length ? (
        <div className="mt-8 border-t border-line md:mt-10">
          {stories.map((s) => (
            <Link
              key={s.slug}
              href={`/impact/${s.slug}`}
              data-aos="fade-up"
              /* Centred rather than top-aligned: the image is a fixed 4:3 and
                 the copy beside it is clamped to a fixed number of lines, so
                 the two columns are close in height and any remainder reads as
                 a misalignment at whichever edge it lands on. */
              className="group grid grid-cols-12 items-center gap-y-8 border-b border-line py-10 md:gap-8"
            >
              {/* Four columns, not five. At 40vw the cover was the tallest
                  thing in the section and pushed the copy into a narrow
                  measure; a third of the row is enough to carry the work. */}
              <div className="col-span-12 lg:col-span-4">
                <div className="overflow-hidden rounded-2xl">
                  <Media
                    src={s.cover}
                    alt={s.title}
                    ratio="4/3"
                    bare
                    sizes="(max-width: 1024px) 100vw, 32vw"
                    imageClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                    stock={isStockAsset(s.cover)}
                  />
                </div>
              </div>

              <div className="col-span-12 lg:col-span-7 lg:col-start-6">
                {/* Sector only. The story's `region` used to sit beside it, but
                    the panel leaves it blank for work not tied to one place,
                    which rendered as a sector followed by a dangling slash. */}
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">
                  {s.industry}
                </span>

                <h3 className="mt-3 flex items-start gap-2 text-xl font-bold leading-snug tracking-[-0.02em] text-ink md:text-2xl">
                  {s.title}
                  <ArrowUpRight
                    size={20}
                    aria-hidden
                    className="mt-1.5 shrink-0 text-brand transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </h3>
                <Rule className="mt-4" />

                {/* Clamped, not truncated in the data: a story's challenge and
                    solution are written for its own page and run to a full
                    paragraph each, which turned this card into the longest
                    block on a page that already has eleven sections. Three
                    lines is enough to know whether the engagement is worth
                    opening, and the whole text still ships in the markup — so
                    the clamp costs nothing at read time and nothing in SEO.
                    Impact gets two, since it sits full-width and so carries
                    roughly twice the words per line. */}
                <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                  {[
                    { label: "Client challenge", value: s.challenge, clamp: "line-clamp-3" },
                    { label: "Our solution", value: s.solution, clamp: "line-clamp-3" },
                    { label: "Business impact", value: s.impact, clamp: "line-clamp-2" },
                  ].map((row) => (
                    <div key={row.label} className="last:sm:col-span-2">
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/40">
                        {row.label}
                      </dt>
                      <dd
                        className={cn(
                          "mt-2 text-[0.95rem] leading-[1.7] text-ink/70",
                          row.clamp,
                        )}
                      >
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* One line. A story can carry a dozen technologies and the
                    full list wrapped to three lines of tracked uppercase,
                    which out-weighed the copy above it on a card whose job is
                    to get the reader to the story itself. */}
                <p className="mt-6 line-clamp-1 text-[0.8125rem] uppercase tracking-[0.12em] text-ink/40">
                  {s.tech.join("  ·  ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div
          data-placeholder="proof"
          data-aos="fade-up"
          className="mx-auto mt-12 max-w-3xl border-l-2 border-amber-400/70 bg-amber-50 p-6 text-sm leading-relaxed text-amber-900"
        >
          <span className="font-bold">[REAL PROOF NEEDED]</span> — no verified
          case study, metric, or attributed quote exists for {service.name}.
          Needed from the client: one project with a named sector, the challenge,
          what shipped, and one business outcome with consent to publish. Hidden
          in production; see docs/PROOF-GAPS.md.
        </div>
      )}
    </SectionShell>
  );
}

/* ========================================================================== */
/*  12 · CLOSE                                                                 */
/* ========================================================================== */

/**
 * The way to start, on the hero's surface — the page closes where it opened.
 */
export function Close({ service, content }: SectionProps) {
  return (
    <SectionShell id="next" surface="ink">
      <div className="mx-auto max-w-3xl text-center">
        <SectionIntro
          surface="ink"
          eyebrow="What happens next"
          title={
            <>
              Start with the problem,{" "}
              <span className="text-brand-bright">not a proposal</span>.
            </>
          }
          lead={`A first conversation is about what you're trying to build, what it's worth, and whether ${service.name.toLowerCase()} is the right route — before anyone scopes anything.`}
        />

        {/* The line the service closes on. Set as the reader's own conclusion
            rather than a claim about Sumago, which is why it carries the
            section rather than sitting under the CTAs as a footnote. */}
        {content.closingLine ? (
          <p
            data-aos="fade-up"
            data-aos-delay="80"
            className="mx-auto mt-10 max-w-2xl border-l-2 border-brand pl-6 text-left text-lg font-medium leading-[1.6] text-white/80 md:text-xl"
          >
            {content.closingLine}
          </p>
        ) : null}

        <div
          data-aos="fade-up"
          className="mt-11 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href="/contact" size="lg">
            Book a consultation
          </Button>
          <Button
            href="/solutions"
            variant="outline"
            size="lg"
            className="border-white/25 text-white hover:bg-white/10"
          >
            Explore all services
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}
