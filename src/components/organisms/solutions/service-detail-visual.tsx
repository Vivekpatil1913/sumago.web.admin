import Link from "next/link";
import { ArrowLeft, ArrowRight, FlaskConical } from "lucide-react";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Button } from "@/components/atoms/button";
import { MediaPlaceholder } from "@/components/molecules/media-placeholder";
import { ToolStrip } from "@/components/molecules/tool-strip";
import { HeroEffect } from "@/components/organisms/hero-effect";
import { HeroStars } from "@/components/three/hero-stars";
import { CAPABILITY_ICONS, FALLBACK_CAPABILITY_ICON } from "@/lib/capability-icons";
import { PHASES, type ServiceWithSlug } from "@/lib/services";
import { differentiators } from "@/lib/content";
import { serviceImages, type ServiceImage } from "@/lib/preview-assets";

/**
 * Service detail — version 2: the image-led variant.
 *
 * Same editorial thinking as `service-detail.tsx` (the type carries each block;
 * tilted brand plates, ghost numerals, red rules, light → mist → dark rhythm),
 * but photography is a structural material here rather than an illustration
 * dropped into a slot.
 *
 * The rule every image on this page follows: **no image gets a box**. Each one
 * either dissolves into the surface it sits on (gradient scrims in the exact
 * background colour, so there is no visible edge), sits under type as a
 * photographic ghost, or is tilted on a brand-gradient plate the way the team
 * page treats its portraits. A framed 16/9 tile in a bordered card is precisely
 * the template look this replaces.
 *
 * Photography is desaturated and brand-tinted so it reads as part of the brand
 * surface instead of competing with it — colour is spent on the red, not on
 * stock imagery.
 *
 * Every image slot is a `MediaPlaceholder`, so it carries `data-placeholder` and
 * the production launch gate still catches it (docs/17). The `alt` on each entry
 * in `serviceImages` is the brief for the real photograph.
 *
 * Server component: the only JS shipped is the hero's lazy 3D starfield.
 */

import type { SuccessStoryRecord } from "@/lib/cms/types";

// Success stories come from the admin panel (Module 3), so the card shape is
// the API record rather than the committed list this used to read.
type Story = SuccessStoryRecord;

/** Falls back to an empty set so a service with no imagery still renders. */
function imagesFor(slug: string): ServiceImage[] {
  return serviceImages[slug] ?? [];
}

/* -------------------------------------------------------------------------- */
/*  Hero — photography dissolving into the dark                                */
/* -------------------------------------------------------------------------- */

/**
 * The image occupies the right half and is dissolved into `#0a0708` by scrims in
 * that exact colour — left-to-right and bottom-up — so it has no edge and reads
 * as depth in the backdrop rather than a picture placed on top of it.
 */
function VisualHero({
  service,
  image,
}: {
  service: ServiceWithSlug;
  image?: ServiceImage;
}) {
  const Icon = CAPABILITY_ICONS[service.icon] ?? FALLBACK_CAPABILITY_ICON;
  const stage = PHASES.findIndex((p) => p.key === service.phase) + 1;
  const phase = PHASES.find((p) => p.key === service.phase);

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0a0708] text-white">
      {/* Photographic layer, furthest back. */}
      {image ? (
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 -z-20 w-full lg:w-[62%]">
          <MediaPlaceholder
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 62vw"
            /* Kept in colour, unusually: this still is already shot on black and
               its warm accent sits on the brand's own red — desaturating it
               would throw away the exact thing that makes it merge. */
            imageClassName="object-cover opacity-[0.85] [object-position:center]"
          />
          {/* Dissolve into the page colour — no edge, no frame. */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0708_0%,#0a0708_22%,rgba(10,7,8,0.55)_55%,rgba(10,7,8,0.25)_100%)] lg:bg-[linear-gradient(to_right,#0a0708_0%,#0a0708_18%,rgba(10,7,8,0.4)_65%,rgba(10,7,8,0.12)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,#0a0708_0%,rgba(10,7,8,0.5)_35%,transparent_70%)]" />
          {/* Brand tint so the photo belongs to the brand surface. */}
          <div className="absolute inset-0 bg-brand/10 mix-blend-overlay" />
        </div>
      ) : null}

      <HeroEffect variant="circuit" redOpacity={0.35} particles={false} />
      <HeroStars formation="pulse" />

      <div className="container-page relative z-10 flex min-h-[100svh] flex-col justify-center py-24 pt-[clamp(6rem,12vh,9rem)]">
        <Link
          href="/solutions"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft size={15} aria-hidden />
          All services
        </Link>

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

        <h1 className="mt-8 max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
          <span className="text-metal-red-shine">{service.name}</span>
        </h1>

        <div className="mt-8 h-px w-24 bg-gradient-to-r from-brand to-transparent" />

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
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
/*  Problem — the photographic ghost                                           */
/* -------------------------------------------------------------------------- */

/**
 * The visitor's problem as a pull-quote, with photography sunk *underneath* the
 * type — masked to a whisper and faded at every edge. It reads as texture in the
 * paper, the same job the oversized quote glyph does, so the words still carry
 * the block.
 */
function ProblemApproach({
  service,
  image,
}: {
  service: ServiceWithSlug;
  image?: ServiceImage;
}) {
  return (
    <section id="approach" className="relative isolate scroll-mt-24 overflow-hidden py-16 md:py-22">
      {image ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <MediaPlaceholder
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            imageClassName="object-cover grayscale opacity-[0.09] [object-position:center_35%]"
          />
          {/* Feather every edge into paper so there is no visible boundary. */}
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,transparent_10%,var(--color-paper,#fff)_78%)]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>
      ) : null}

      <div className="container-page">
        <div className="mx-auto max-w-4xl">
          <div data-aos="fade-up" className="relative">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand-ink">
              The problem
            </p>
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
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Who this is for — tilted plate + ledger                                    */
/* -------------------------------------------------------------------------- */

/**
 * Qualification, with the image on a tilted brand-gradient plate — the same
 * treatment the team page gives its leadership portraits, so the page stays in
 * one visual family. The plate sticks while the ledger scrolls past it.
 */
function WhoFor({
  service,
  image,
}: {
  service: ServiceWithSlug;
  image?: ServiceImage;
}) {
  if (!service.whoFor?.length) return null;

  return (
    <Section muted>
      <SectionHeading
        eyebrow="Who this is for"
        title={
          <>
            If any of this sounds like{" "}
            <span className="text-metal-red">your roadmap</span>.
          </>
        }
        description="Mobile App Engineering is usually the answer to one of these four conversations — not to a feature list."
      />

      <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,20rem)_1fr] lg:items-start lg:gap-16">
        {image ? (
          <div data-aos="fade-up" className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative mx-auto w-full max-w-[18rem] lg:mx-0 lg:max-w-none">
              <div
                aria-hidden
                className="absolute -inset-2.5 -z-10 -rotate-3 rounded-[2rem] bg-[linear-gradient(135deg,#d73438,#7a1519)]"
              />
              <MediaPlaceholder
                src={image.src}
                alt={image.alt}
                ratio="4/5"
                bare
                sizes="(max-width: 1024px) 18rem, 20rem"
                className="rounded-[1.75rem] ring-0"
                imageClassName="grayscale transition duration-500 hover:grayscale-0"
              />
            </div>
          </div>
        ) : null}

        <ul className="mt-12 border-t border-line lg:mt-0">
          {service.whoFor.map((w, i) => (
            <li
              key={w.title}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 60}
              className="group border-b border-line py-6 transition-colors hover:bg-paper sm:py-7"
            >
              <div className="flex items-baseline gap-5">
                <span className="font-display text-2xl font-bold leading-none text-ink/15 transition-colors group-hover:text-brand/40 sm:text-3xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-snug text-ink">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65 sm:text-base">
                    {w.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Deliverables                                                               */
/* -------------------------------------------------------------------------- */

/** What actually lands — Sumago's delivery artifacts, so no metrics. Kept
 *  deliberately image-free: it sits between two heavy visual beats. */
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
/*  Outcomes — full-bleed duotone band                                         */
/* -------------------------------------------------------------------------- */

/**
 * The cinematic beat: a full-bleed photograph pushed to near-duotone under a
 * brand-tinted scrim, carrying the outcomes as type. No container, no ratio —
 * the photograph *is* the band. This is what stops the outcomes reading as a
 * twin of the deliverables ledger above.
 */
function Outcomes({
  service,
  image,
}: {
  service: ServiceWithSlug;
  image?: ServiceImage;
}) {
  if (!service.outcomes?.length) return null;

  return (
    <section className="relative isolate overflow-hidden bg-ink py-16 text-white md:py-22">
      {image ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <MediaPlaceholder
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            imageClassName="object-cover opacity-[0.55] [object-position:center_45%]"
          />
          {/* Ink scrim + brand tint → duotone, welded to the band colour. The
              still is already dark, so the scrim can stay heavy enough to hold
              white text at full contrast without burying the devices. */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,7,8,0.9),rgba(10,7,8,0.66)_45%,rgba(10,7,8,0.92))]" />
          <div className="absolute inset-0 bg-brand/25 mix-blend-overlay" />
          <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_0%,rgba(215,52,56,0.22),transparent_70%)]" />
        </div>
      ) : null}

      <div className="container-page">
        <SectionHeading
          tone="dark"
          eyebrow="What changes"
          title={
            <>
              The difference this makes to{" "}
              <span className="text-metal-red-shine">the business</span>.
            </>
          }
          description="Not what gets built — what it's worth once it's in people's hands."
        />
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {service.outcomes.map((o, i) => (
            <div
              key={o}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 80}
              className="group relative"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -left-1 -top-10 select-none font-display text-[5.5rem] font-bold leading-none text-white/[0.08] transition-colors duration-500 group-hover:text-brand/25"
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
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stack                                                                      */
/* -------------------------------------------------------------------------- */

/** What it's built in — technologies as quiet running text, then real brand marks. */
function Stack({ service }: { service: ServiceWithSlug }) {
  if (!service.technologies?.length && !service.tools?.length) return null;

  return (
    <Section muted>
      <SectionHeading
        eyebrow="The stack"
        title={
          <>
            One codebase, <span className="text-metal-red">both stores</span>.
          </>
        }
        description="Cross-platform where it pays for itself, native where it genuinely matters — so reach never costs you two of every engineer."
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

/** Real work behind this service — only where it genuinely exists (docs/17). */
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

export function ServiceDetailVisual({
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
  /* Four slots: hero, ghost-under-quote, tilted plate, duotone band. Each falls
     back to undefined (section renders text-only) if imagery isn't supplied. */
  const [hero, ghost, plate, band] = imagesFor(service.slug);

  return (
    <>
      <VisualHero service={service} image={hero} />
      <ProblemApproach service={service} image={ghost} />
      <WhoFor service={service} image={plate} />
      <Deliverables service={service} />
      <Outcomes service={service} image={band ?? hero} />
      <Stack service={service} />
      <Proof service={service} stories={stories} isProd={isProd} />
      <WhySumago />
      <Related related={related} />
      {/* No CTA band here — the site footer already closes every page with the
          same "Let's build what your business needs next" call to action. */}
    </>
  );
}
