import Link from "next/link";
import { ArrowLeft, ArrowRight, FlaskConical } from "lucide-react";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Button } from "@/components/atoms/button";
import { ToolStrip } from "@/components/molecules/tool-strip";
import { HeroEffect } from "@/components/organisms/hero-effect";
import { HeroStars } from "@/components/three/hero-stars";
import { CAPABILITY_ICONS, FALLBACK_CAPABILITY_ICON } from "@/lib/capability-icons";
import { PHASES, type ServiceWithSlug } from "@/lib/services";
import { differentiators } from "@/lib/content";
import type { impactStories } from "@/lib/site";

/**
 * The redesigned service detail page — editorial, card-free, and written for the
 * enterprise decision-maker (CEO/CTO/CIO/Founder).
 *
 * Design thought is carried over from the team page and the Solutions index:
 * the type carries each block, not card chrome. Tilted brand-gradient plates,
 * oversized ghost glyphs and numerals, red gradient rules, ambient brand glows,
 * and a light → mist → dark band rhythm. The old layout's sticky sidebar and
 * repeated bordered-tile grids are gone — they read as a documentation template,
 * which is exactly what a page selling judgment shouldn't be.
 *
 * Narrative order mirrors how the decision actually gets made (docs/08 —
 * problem first, capability second):
 *   hook (their problem) → do I qualify → the answer → what lands → what changes
 *   → what it's built in → proof → why Sumago → where next
 *
 * Server component: every effect is CSS, so the only JS shipped is the hero's
 * lazy 3D starfield — which keeps the Lighthouse ≥95 gate (CLAUDE.md) intact.
 */

type Story = (typeof impactStories)[number];

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

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
          All services
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
            <p className="mt-1 text-sm font-medium text-white/55">
              {service.blurb}
            </p>
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
          <Button href="/contact">Start a conversation</Button>
          <a
            href="#approach"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-white/70 transition-colors hover:text-white"
          >
            See how it works
            <ArrowRight size={15} aria-hidden />
          </a>
        </div>
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
 * rule turns it into Sumago's answer.
 */
function ProblemApproach({ service }: { service: ServiceWithSlug }) {
  return (
    <Section id="approach" className="scroll-mt-24">
      <div className="mx-auto max-w-4xl">
        <div data-aos="fade-up" className="relative">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand-ink">
            The problem
          </p>

          {/* Oversized quote glyph, tucked behind the text. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -left-3 -top-10 select-none font-display text-[9rem] leading-none text-brand/10"
          >
            &ldquo;
          </span>

          <p className="relative text-xl leading-[1.5] tracking-tight text-ink md:text-2xl lg:text-[1.75rem]">
            {service.problem}
          </p>
        </div>

        {/* Red gradient rule → the answer. */}
        <div className="mt-10 h-px w-24 bg-gradient-to-r from-brand to-transparent" />

        <div data-aos="fade-up" className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
            How Sumago approaches it
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">
            {service.approach}
          </p>
        </div>
      </div>
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
 */
function WhoFor({ service }: { service: ServiceWithSlug }) {
  if (!service.whoFor?.length) return null;

  return (
    <Section muted>
      <SectionHeading
        eyebrow="Who this is for"
        title={
          <>
            If any of this sounds like{" "}
            <span className="text-metal-red">your quarter</span>.
          </>
        }
        description="Web Platform Engineering is usually the answer to one of these four conversations — not to a feature list."
      />
      <ul className="mx-auto mt-12 max-w-5xl border-t border-line">
        {service.whoFor.map((w, i) => (
          <li
            key={w.title}
            data-aos="fade-up"
            data-aos-delay={(i % 3) * 60}
            className="group grid items-baseline gap-x-6 gap-y-1 border-b border-line py-6 transition-colors hover:bg-paper sm:grid-cols-[auto_minmax(0,18rem)_1fr] sm:py-7"
          >
            <span className="font-display text-2xl font-bold leading-none text-ink/15 transition-colors group-hover:text-brand/40 sm:text-3xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-lg font-bold leading-snug text-ink">{w.title}</h3>
            <p className="text-sm leading-relaxed text-ink/65 sm:text-base">
              {w.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Deliverables                                                               */
/* -------------------------------------------------------------------------- */

/**
 * What actually lands. These are Sumago's delivery artifacts — not client
 * results — so they carry no metrics. Set open on the page as a numbered ledger
 * rather than the old grid of bordered tick-boxes.
 */
function Deliverables({ service }: { service: ServiceWithSlug }) {
  if (!service.deliverables?.length) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow="What you get"
        title={
          <>
            The artifacts an engagement{" "}
            <span className="text-metal-red">leaves behind</span>.
          </>
        }
        description="Tangible things your team owns at the end — not a slide deck describing them."
      />
      <ul className="mx-auto mt-12 max-w-4xl">
        {service.deliverables.map((d, i) => (
          <li
            key={d}
            data-aos="fade-up"
            data-aos-delay={(i % 3) * 60}
            className="group flex items-baseline gap-6 border-b border-line py-7 first:border-t"
          >
            <span className="font-display text-2xl font-bold leading-none text-ink/15 transition-colors group-hover:text-brand/40 sm:text-3xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-lg font-medium leading-snug text-ink md:text-xl">
              {d}
            </span>
          </li>
        ))}
      </ul>
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
    <Section dark className="relative overflow-hidden">
      {/* Ambient brand glow so the dark band feels lit, not flat. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_45%_at_50%_0%,rgba(215,52,56,0.18),transparent_70%)]"
      />
      <SectionHeading
        tone="dark"
        eyebrow="What changes"
        title={
          <>
            The difference this makes to{" "}
            <span className="text-metal-red-shine">the business</span>.
          </>
        }
        description="Not what gets built — what it's worth once it's running."
      />
      <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {service.outcomes.map((o, i) => (
          <div
            key={o}
            data-aos="fade-up"
            data-aos-delay={(i % 3) * 80}
            className="group relative"
          >
            {/* Oversized ghost numeral — depth without a container. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -left-1 -top-10 select-none font-display text-[5.5rem] font-bold leading-none text-white/[0.06] transition-colors duration-500 group-hover:text-brand/20"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="relative text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
              {o}
            </p>
            <div className="mt-5 h-px w-14 bg-gradient-to-r from-brand to-transparent" />
          </div>
        ))}
      </div>
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
    <Section muted>
      <SectionHeading
        eyebrow="The stack"
        title={
          <>
            Built on what your team can{" "}
            <span className="text-metal-red">actually hire for</span>.
          </>
        }
        description="Mainstream, well-supported technology — chosen so the platform stays maintainable long after launch, by people who aren't us."
      />
      <div data-aos="fade-up" className="mx-auto mt-12 max-w-4xl">
        {service.technologies?.length ? (
          <p className="text-sm font-medium uppercase tracking-[0.1em] text-ink/40">
            {service.technologies.join("  ·  ")}
          </p>
        ) : null}
        <ToolStrip
          tools={service.tools}
          label={`Tools used for ${service.name}`}
          className="mt-8"
        />
      </div>
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
    <Section>
      <SectionHeading
        eyebrow="Proof of work"
        title={
          <>
            The <span className="text-metal-red">real work</span> behind it.
          </>
        }
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
                className="group flex items-start gap-6 border-b border-line py-7 transition-colors hover:bg-paper"
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
    <Section muted>
      <SectionHeading
        eyebrow="Why Sumago"
        title={
          <>
            Chosen for <span className="text-metal-red">judgment</span>, not just
            delivery.
          </>
        }
      />
      <div className="mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-3 md:gap-8">
        {trust.map((d, i) => (
          <div key={d.title} data-aos="fade-up" data-aos-delay={(i % 3) * 80}>
            <div className="h-px w-12 bg-gradient-to-r from-brand to-transparent" />
            <h3 className="mt-5 text-lg font-bold leading-snug text-ink">
              {d.title}
            </h3>
            <p className="mt-3 leading-relaxed text-ink/65">{d.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Related                                                                    */
/* -------------------------------------------------------------------------- */

/** Where next — sibling services, set open on the page rather than as cards. */
function Related({ related }: { related: ServiceWithSlug[] }) {
  if (!related.length) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow="Keep exploring"
        title={
          <>
            Problems that usually{" "}
            <span className="text-metal-red">travel with this one</span>.
          </>
        }
      />
      <div className="mx-auto mt-12 max-w-4xl border-t border-line">
        {related.map((s, i) => {
          const Icon = CAPABILITY_ICONS[s.icon] ?? FALLBACK_CAPABILITY_ICON;
          return (
            <Link
              key={s.slug}
              href={`/solutions/${s.slug}`}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 60}
              className="group flex items-center gap-5 border-b border-line py-7 transition-colors hover:bg-paper"
            >
              <span className="relative inline-grid h-11 w-11 shrink-0 place-items-center">
                <span
                  aria-hidden
                  className="absolute inset-0 -rotate-3 rounded-xl bg-[linear-gradient(135deg,#d73438,#7a1519)] transition-transform duration-500 group-hover:rotate-3"
                />
                <Icon size={20} className="relative text-white" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold leading-snug text-ink">
                  {s.name}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-ink/65">
                  {s.blurb}
                </span>
              </span>
              <ArrowRight
                size={18}
                aria-hidden
                className="shrink-0 text-brand transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          );
        })}
      </div>

      <div data-aos="fade-up" className="mt-10 text-center">
        <Button href="/solutions" variant="link">
          All services →
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
  return (
    <>
      <ServiceHero service={service} />
      <ProblemApproach service={service} />
      <WhoFor service={service} />
      <Deliverables service={service} />
      <Outcomes service={service} />
      <Stack service={service} />
      <Proof service={service} stories={stories} isProd={isProd} />
      <WhySumago />
      <Related related={related} />
      {/* No CTA band here — the site footer already closes every page with the
          same "Let's build what your business needs next" call to action. */}
    </>
  );
}
