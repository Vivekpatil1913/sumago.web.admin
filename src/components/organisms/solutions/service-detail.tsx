import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Eye,
  FlaskConical,
  HeartHandshake,
  Search,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Button } from "@/components/atoms/button";
import { HeroEffect } from "@/components/organisms/hero-effect";
import { HeroStars } from "@/components/three/hero-stars";
import { ChapterNav, type Chapter } from "@/components/molecules/chapter-nav";
import {
  ShiftDiagram,
  QuadrantDiagram,
  ManifestDiagram,
  OutcomeSteps,
  OrbitDiagram,
  RelatedMap,
} from "@/components/organisms/solutions/service-diagrams";
import { CAPABILITY_ICONS, FALLBACK_CAPABILITY_ICON } from "@/lib/capability-icons";
import { PHASES, type ServiceWithSlug } from "@/lib/services";
import { servicePageCopy as copy } from "@/lib/service-page-copy";
import { renderCopy } from "@/lib/rich-text";
import { differentiators } from "@/lib/content";
import type { impactStories } from "@/lib/site";

/**
 * The service detail template — one layout, rendered for all 15 services.
 *
 * DESIGN
 * Editorial and card-free: the type carries each block, not card chrome. Tilted
 * brand-gradient plates, oversized ghost numerals, red gradient rules, ambient
 * glows, and a light → mist → dark band rhythm, matching the team page and the
 * Solutions index. Written for the enterprise decision-maker (CEO/CTO/CIO).
 *
 * The narrative mirrors how the decision actually gets made (docs/08 — problem
 * first, capability second):
 *   hook (their problem) → do I qualify → the answer → what lands → what changes
 *   → what it's built in → proof → why Sumago → where next
 *
 * DYNAMIC BY CONSTRUCTION — nothing here is written per service:
 *   service content  ← `Service` (lib/services.ts)      → Sanity `service` docs
 *   page chrome      ← `servicePageCopy`                → Sanity `servicePage`
 *   lifecycle rail   ← `PHASES`                         → Sanity `phase` docs
 *   trust triplet    ← `differentiators` (lib/content)  → Sanity `differentiator`
 * There is not one literal service name, heading, or standfirst in this file.
 * Adding a service is a data edit; moving to the CMS is a fetch swap.
 *
 * Every section renders only when its data exists, so a sparse service degrades
 * to a shorter page rather than an empty heading — and the chapter rail is built
 * from the sections that actually rendered.
 *
 * Server component: every effect is CSS. The only JS shipped is the hero's lazy
 * 3D starfield and the chapter rail's scroll-spy, which keeps the Lighthouse ≥95
 * gate (CLAUDE.md) intact.
 */

type Story = (typeof impactStories)[number];

/**
 * Icons for the trust triplet. The `differentiators` data carries a lucide name
 * (never a component — a Sanity field could only ever hold the string), and it
 * resolves to a component here, the same way capability icons do.
 */
const TRUST_ICONS: Record<string, LucideIcon> = {
  Search,
  Compass,
  Users,
  Eye,
  ShieldCheck,
  HeartHandshake,
};

/** Stable ids — shared by the sections and the chapter rail. */
const IDS = {
  problem: "approach",
  whoFor: "who-for",
  deliverables: "deliverables",
  outcomes: "outcomes",
  stack: "stack",
  proof: "proof",
  why: "why-sumago",
  related: "related",
} as const;

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The lifecycle rail — where this service sits in Consulting → Designing →
 * Building → Marketing → Support. It answers "what else does this come with?"
 * before the visitor has to ask, and it's the one piece of cross-sell that
 * belongs above the fold.
 */
function PhaseRail({ current }: { current: string }) {
  const activeIndex = PHASES.findIndex((p) => p.key === current);

  return (
    <ol className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-3 sm:gap-x-3">
      {PHASES.map((p, i) => {
        const isActive = i === activeIndex;
        const isPast = i < activeIndex;
        return (
          <li key={p.key} className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/solutions"
              aria-current={isActive ? "step" : undefined}
              className="group inline-flex items-center gap-2"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
                style={{
                  background: isActive
                    ? "var(--color-brand)"
                    : isPast
                      ? "rgba(255,255,255,0.4)"
                      : "rgba(255,255,255,0.18)",
                }}
              />
              <span
                className="font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] transition-colors duration-300"
                style={{
                  color: isActive
                    ? "var(--color-brand-bright)"
                    : isPast
                      ? "rgba(255,255,255,0.45)"
                      : "rgba(255,255,255,0.28)",
                }}
              >
                {p.label}
              </span>
            </Link>
            {i < PHASES.length - 1 ? (
              <span
                aria-hidden
                className="hidden h-px w-5 bg-white/15 sm:inline-block"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Dark cinematic hero. Echoes the main-page heroes (circuit backdrop + a 3D star
 * formation) while carrying the service's own identity: the stage it belongs to,
 * an icon on a tilted brand plate, and the outcome-first summary.
 */
function ServiceHero({ service }: { service: ServiceWithSlug }) {
  const Icon = CAPABILITY_ICONS[service.icon] ?? FALLBACK_CAPABILITY_ICON;
  const stage = PHASES.findIndex((p) => p.key === service.phase) + 1;
  const phase = PHASES.find((p) => p.key === service.phase);

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0a0708] text-white">
      <HeroEffect variant="circuit" redOpacity={0.5} particles={false} />
      <HeroStars formation="torus" />

      {/* Ghost watermark of the service icon — depth without a container. */}
      <Icon
        aria-hidden
        strokeWidth={0.4}
        className="pointer-events-none absolute -right-16 top-1/2 z-0 hidden h-[34rem] w-[34rem] -translate-y-1/2 text-white/[0.03] lg:block"
      />

      <div className="container-page relative z-10 flex min-h-[100svh] flex-col justify-center py-24 pt-[clamp(6rem,12vh,9rem)]">
        <Link
          href="/solutions"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft size={15} aria-hidden />
          {copy.hero.backLabel}
        </Link>

        {/* Identity line — icon on a tilted brand plate, echoing the team portraits. */}
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
              Stage {String(stage).padStart(2, "0")} · {phase?.label}
            </p>
            <p className="mt-1 text-sm font-medium text-white/55">{service.blurb}</p>
          </div>
        </div>

        <h1 className="mt-8 max-w-4xl text-balance text-4xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
          <span className="text-metal-red-shine">{service.name}</span>
        </h1>

        <div className="mt-8 h-px w-24 bg-gradient-to-r from-brand to-transparent" />

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
          {service.summary}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/contact">{copy.hero.primaryCta}</Button>
          <a
            href={`#${IDS.problem}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-white/70 transition-colors hover:text-white"
          >
            {copy.hero.secondaryCta}
            <ArrowRight size={15} aria-hidden />
          </a>
        </div>

        {/* Where this sits in the lifecycle. */}
        <PhaseRail current={service.phase} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Problem → approach                                                         */
/* -------------------------------------------------------------------------- */

/**
 * The hook. The visitor's problem set as a pull-quote — their own voice carries
 * the block, exactly as the leadership quotes do on the team page — then the red
 * rule turns it into Sumago's answer, which sits on a tinted plate so the two
 * halves read as question and reply rather than two paragraphs.
 */
function ProblemApproach({ service }: { service: ServiceWithSlug }) {
  const Icon = CAPABILITY_ICONS[service.icon] ?? FALLBACK_CAPABILITY_ICON;

  return (
    <Section id={IDS.problem} className="scroll-mt-32">
      <p
        data-aos="fade-up"
        className="mb-10 text-center text-sm font-bold uppercase tracking-[0.22em] text-brand-ink"
      >
        {copy.problem.eyebrow}
      </p>
      <ShiftDiagram
        problem={service.problem}
        approach={service.approach}
        approachHeading={copy.problem.approachHeading}
        problemLabel={copy.problem.todayLabel}
        Icon={Icon}
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Who this is for                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Qualification, up front. An enterprise buyer decides whether to keep reading
 * in seconds — these are the situations they arrive in, in their own terms.
 * Set as a numbered ledger: substance over marketing tiles.
 *
 * Where the copy hasn't been written yet, a flagged gap renders outside
 * production (docs/17) rather than an invented set of situations.
 */
function WhoFor({ service, isProd }: { service: ServiceWithSlug; isProd: boolean }) {
  const items = service.whoFor ?? [];

  if (!items.length) {
    if (isProd) return null;
    return (
      <Section muted id={IDS.whoFor} className="scroll-mt-32">
        <div
          data-placeholder="who-for"
          className="mx-auto max-w-3xl rounded-xl border border-dashed border-amber-400/60 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900"
        >
          <span className="font-bold">[SEED COPY NEEDED]</span> — &ldquo;Who this
          is for&rdquo; is unwritten for {service.name}. Needed: four situations a
          buyer arrives in, in their own words (title + one sentence), added as{" "}
          <code>whoFor</code> in lib/services.ts. Positioning only — no metrics.
          Hidden in production.
        </div>
      </Section>
    );
  }

  return (
    <Section muted id={IDS.whoFor} className="scroll-mt-32">
      <SectionHeading
        eyebrow={copy.whoFor.eyebrow}
        title={renderCopy(copy.whoFor.title)}
        description={
          copy.whoFor.description
            ? renderCopy(copy.whoFor.description, {
                service: service.name,
                count: String(items.length),
              })
            : undefined
        }
      />
      <QuadrantDiagram
        items={items}
        Icon={CAPABILITY_ICONS[service.icon] ?? FALLBACK_CAPABILITY_ICON}
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Deliverables                                                               */
/* -------------------------------------------------------------------------- */

/**
 * What actually lands. These are Sumago's delivery artifacts — not client
 * results — so they carry no metrics. Each is set as a numbered row whose rule
 * fills red on hover: a manifest being ticked off, not a grid of tick-boxes.
 */
function Deliverables({ service }: { service: ServiceWithSlug }) {
  if (!service.deliverables?.length) return null;

  return (
    <Section id={IDS.deliverables} className="scroll-mt-32">
      <SectionHeading
        eyebrow={copy.deliverables.eyebrow}
        title={renderCopy(copy.deliverables.title)}
        description={
          copy.deliverables.description
            ? renderCopy(copy.deliverables.description)
            : undefined
        }
      />
      <ManifestDiagram
        items={service.deliverables}
        title={copy.deliverables.manifestTitle}
        footnote={copy.deliverables.footnote}
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Outcomes                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * What changes for the business — the dark, cinematic beat of the page, so the
 * outcomes never read as a twin of the deliverables list above them (which is
 * precisely how the old layout failed: two identical tile grids in a row).
 */
function Outcomes({ service }: { service: ServiceWithSlug }) {
  if (!service.outcomes?.length) return null;

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
          copy.outcomes.description ? renderCopy(copy.outcomes.description) : undefined
        }
      />
      <OutcomeSteps
        items={service.outcomes}
        startLabel={copy.outcomes.journeyStart}
        endLabel={copy.outcomes.journeyEnd}
        Icon={CAPABILITY_ICONS[service.icon] ?? FALLBACK_CAPABILITY_ICON}
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stack                                                                      */
/* -------------------------------------------------------------------------- */

/** What it's built in. Technologies as quiet running text, then the real brand
 *  marks — the same tiles the Solutions index and home page use. */
function Stack({ service }: { service: ServiceWithSlug }) {
  if (!service.technologies?.length && !service.tools?.length) return null;

  return (
    <Section muted id={IDS.stack} className="scroll-mt-32">
      <SectionHeading
        eyebrow={copy.stack.eyebrow}
        title={renderCopy(copy.stack.title)}
        description={
          copy.stack.description ? renderCopy(copy.stack.description) : undefined
        }
      />
      <OrbitDiagram
        tools={service.tools}
        technologies={service.technologies}
        label={`Tools used for ${service.name}`}
        Icon={CAPABILITY_ICONS[service.icon] ?? FALLBACK_CAPABILITY_ICON}
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Proof                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Real work behind this service — only where it genuinely exists. Where it
 * doesn't, a flagged gap renders outside production (docs/17) rather than a
 * stretched story.
 */
function Proof({
  service,
  stories,
  isProd,
}: {
  service: ServiceWithSlug;
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
      <div className="mx-auto mt-12 max-w-4xl">
        {stories.length ? (
          <div className="border-t border-line">
            {stories.map((s, i) => (
              <Link
                key={s.slug}
                href={`/impact/${s.slug}`}
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 60}
                className="group flex items-start gap-6 border-b border-line py-7 transition-colors hover:bg-mist"
              >
                <FlaskConical
                  size={20}
                  aria-hidden
                  className="mt-1 shrink-0 text-brand/40 transition-colors group-hover:text-brand"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-bold leading-snug text-ink md:text-xl">
                    {s.title}
                  </span>
                  <span className="mt-2 block leading-relaxed text-ink/65">
                    {s.summary}
                  </span>
                </span>
                <ArrowRight
                  size={18}
                  aria-hidden
                  className="mt-1.5 shrink-0 text-brand transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div
            data-placeholder="proof"
            className="rounded-xl border border-dashed border-amber-400/60 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900"
          >
            <span className="font-bold">[REAL PROOF NEEDED]</span> — no verified
            case study, metric, or attributed quote exists for {service.name}.
            Needed from the client: one numbered outcome + one quote with consent.
            Hidden in production; see docs/PROOF-GAPS.md.
          </div>
        )}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Why Sumago                                                                 */
/* -------------------------------------------------------------------------- */

/** The trust close — why this partner, not just this service. */
function WhySumago() {
  const trust = differentiators.slice(0, 3);

  return (
    <Section muted id={IDS.why} className="scroll-mt-32">
      <SectionHeading
        eyebrow={copy.whySumago.eyebrow}
        title={renderCopy(copy.whySumago.title)}
      />
      <div className="mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-3 md:gap-8">
        {trust.map((d, i) => {
          const Icon = TRUST_ICONS[d.icon] ?? FALLBACK_CAPABILITY_ICON;
          return (
            <div
              key={d.title}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 80}
              className="group"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-brand/15 bg-brand/[0.06] text-brand transition-colors duration-300 group-hover:border-transparent group-hover:bg-[linear-gradient(135deg,#d73438,#7a1519)] group-hover:text-white">
                <Icon size={22} aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-bold leading-snug text-ink">{d.title}</h3>
              <div className="mt-3 h-px w-10 bg-gradient-to-r from-brand to-transparent transition-[width] duration-500 group-hover:w-20" />
              <p className="mt-3 leading-relaxed text-ink/65">{d.description}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Related                                                                    */
/* -------------------------------------------------------------------------- */

/** Where next — sibling services as spokes off the one being read. */
function Related({
  service,
  related,
}: {
  service: ServiceWithSlug;
  related: ServiceWithSlug[];
}) {
  if (!related.length) return null;

  return (
    <Section id={IDS.related} className="scroll-mt-32">
      <SectionHeading
        eyebrow={copy.related.eyebrow}
        title={renderCopy(copy.related.title)}
      />
      <RelatedMap
        currentName={service.name}
        Icon={CAPABILITY_ICONS[service.icon] ?? FALLBACK_CAPABILITY_ICON}
        items={related.map((s) => ({
          slug: s.slug,
          name: s.name,
          blurb: s.blurb,
          icon: CAPABILITY_ICONS[s.icon] ?? FALLBACK_CAPABILITY_ICON,
        }))}
      />

      <div data-aos="fade-up" className="mt-10 text-center">
        <Button href="/solutions" variant="link">
          {copy.relatedCta}
        </Button>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export function ServiceDetail({
  service,
  related,
  stories,
  isProd,
}: {
  service: ServiceWithSlug;
  related: ServiceWithSlug[];
  stories: Story[];
  isProd: boolean;
}) {
  /* The rail lists only the chapters this service actually renders, in page
     order — so it can never point at a section that isn't there. */
  const chapters: Chapter[] = [
    { id: IDS.problem, label: copy.problem.navLabel, show: true },
    { id: IDS.whoFor, label: copy.whoFor.navLabel, show: Boolean(service.whoFor?.length) },
    {
      id: IDS.deliverables,
      label: copy.deliverables.navLabel,
      show: Boolean(service.deliverables?.length),
    },
    {
      id: IDS.outcomes,
      label: copy.outcomes.navLabel,
      show: Boolean(service.outcomes?.length),
    },
    {
      id: IDS.stack,
      label: copy.stack.navLabel,
      show: Boolean(service.technologies?.length || service.tools?.length),
    },
    { id: IDS.proof, label: copy.proof.navLabel, show: stories.length > 0 },
    { id: IDS.why, label: copy.whySumago.navLabel, show: true },
    { id: IDS.related, label: copy.related.navLabel, show: related.length > 0 },
  ]
    .filter((c) => c.show)
    .map(({ id, label }) => ({ id, label }));

  return (
    <>
      <ServiceHero service={service} />
      <ChapterNav chapters={chapters} />
      <ProblemApproach service={service} />
      <WhoFor service={service} isProd={isProd} />
      <Deliverables service={service} />
      <Outcomes service={service} />
      <Stack service={service} />
      <Proof service={service} stories={stories} isProd={isProd} />
      <WhySumago />
      <Related service={service} related={related} />
      {/* No CTA band here — the site footer already closes every page with the
          same "Let's build what your business needs next" call to action. */}
    </>
  );
}
