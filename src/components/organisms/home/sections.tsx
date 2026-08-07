import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Button } from "@/components/atoms/button";
import { Stat } from "@/components/molecules/stat";
import { CapabilityCard } from "@/components/molecules/capability-card";
import { ChallengesCinematic } from "@/components/organisms/home/challenges-cinematic";
import { ImpactShowcase } from "@/components/organisms/home/impact-showcase";
import { industries, primaryCta } from "@/lib/site";
import { getMetrics, getSuccessStories } from "@/lib/cms";
import { featuredServices } from "@/lib/services";
import { industryImages } from "@/lib/preview-assets";
import { INDUSTRY_ICONS, FALLBACK_INDUSTRY_ICON } from "@/lib/industry-meta";
import { slugify } from "@/lib/utils";

/** Trust bar — real metrics. */
export async function TrustBar() {
  const metrics = await getMetrics();

  return (
    <Section muted className="py-14 md:py-16">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m, i) => (
          <div key={m.label} data-aos="fade-up" data-aos-delay={(i % 6) * 60}>
            <Stat value={m.value} label={m.label} />
          </div>
        ))}
      </div>
    </Section>
  );
}

/** About Sumago — narrative + the metrics counter + a few verified proof points. */
export async function AboutSection() {
  const metrics = await getMetrics();

  const highlights: { label: string; text: string }[] = [
    {
      label: "ISO 9001:2015 · CMMI Level 5",
      text: "Independently certified for quality and process maturity.",
    },
    {
      label: "Nashik · Pune",
      text: "Three offices across Maharashtra, close to every client.",
    },
    {
      label: "Founder-led",
      text: "Guided by Sudhir & Sonali Gorade since day one.",
    },
  ];
  return (
    <Section id="about">
      <SectionHeading
        eyebrow="About Sumago"
        title={
          <>
            A software team that grew into{" "}
            <span className="text-metal-red-shine">a strategic technology partner.</span>
          </>
        }
        description="Since 2013, Sumago Infotech has helped enterprises, startups, and governments turn ambitious ideas into dependable software — bringing consulting, digital transformation, and product engineering together under one roof."
      />

      {/* Proof highlights — centered, no icons (above) */}
      <div className="mt-12 grid gap-8 text-center sm:grid-cols-3">
        {highlights.map((h, i) => (
          <div key={h.label} data-aos="fade-up" data-aos-delay={(i % 3) * 60}>
            <div className="text-lg font-bold text-ink">{h.label}</div>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{h.text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto my-10 h-px max-w-4xl bg-line" />

      {/* Metrics counter — numbers in metallic gold, no container (below) */}
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m, i) => (
          <div key={m.label} data-aos="fade-up" data-aos-delay={(i % 6) * 60}>
            <Stat value={m.value} label={m.label} tone="metal" />
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button href="/about" variant="outline" size="lg">
          More about Sumago
          <ArrowRight size={16} />
        </Button>
      </div>
    </Section>
  );
}

/** Challenges we solve — cinematic problem→solution sequence (client component). */
export function ChallengesWeSolve() {
  return <ChallengesCinematic />;
}

/** Our services — six flagship service cards + "Explore all services". */
export function CapabilitiesSection() {
  return (
    <section className="relative overflow-hidden bg-blueprint py-16 text-white md:py-22">
      {/* Ambient brand glows drifting over the dark blueprint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-8 z-0 h-72 w-72 animate-[blob-float_11s_ease-in-out_infinite] rounded-full bg-brand/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-8 z-0 h-80 w-80 animate-[blob-float_14s_ease-in-out_infinite_reverse] rounded-full bg-[#7a1519]/20 blur-3xl"
      />

      <div className="container-page relative z-10">
        <SectionHeading
          tone="dark"
          wide
          eyebrow="Our services"
          title={
            <>
              <span className="block leading-tight xl:whitespace-nowrap">
                What does your business actually need?
              </span>
              <span className="block leading-tight text-metal-red-shine xl:whitespace-nowrap">
                We build exactly that.
              </span>
            </>
          }
          description="The tech world keeps changing, and one-size-fits-all can't keep up. Each service below is tailored from the ground up — engineered for how you actually operate, not the other way around."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((s, i) => (
            <div key={s.slug} data-aos="fade-up" data-aos-delay={(i % 3) * 60}>
              <CapabilityCard name={s.name} tone="dark" />
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button
            href="/solutions"
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Explore all services
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}

/**
 * A single industry image card used inside the marquee rows. Sized narrower
 * than the viewport on phones — at `w-96` a card is wider than a 375px screen,
 * so both its edges sit off-screen and the row stops reading as cards.
 */
function IndustryPill({ name }: { name: string }) {
  const slug = slugify(name);
  const Icon = INDUSTRY_ICONS[slug] ?? FALLBACK_INDUSTRY_ICON;
  return (
    <Link
      href={`/industries/${slug}`}
      data-placeholder="stock"
      className="group/card relative mr-3 block h-40 w-64 shrink-0 overflow-hidden rounded-2xl shadow-sm ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:mr-4 sm:h-52 sm:w-96"
    >
      <Image
        src={industryImages[slug]}
        alt={name}
        fill
        sizes="(min-width: 640px) 384px, 256px"
        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
      />
      {/* light-black shade rising from the bottom-left */}
      <span className="absolute inset-0 bg-gradient-to-tr from-ink/90 via-ink/45 to-transparent" />
      {/* hover arrow */}
      <ArrowUpRight
        size={18}
        className="absolute right-4 top-4 text-white/80 opacity-0 transition-all duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:opacity-100"
      />
      {/* icon + text over the shade */}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-[#7a1519] text-white shadow-sm shadow-brand/30">
          <Icon size={20} />
        </span>
        <span className="font-display text-base font-semibold leading-tight text-white">
          {name}
        </span>
      </div>
    </Link>
  );
}

/** Industries — two rows of pills auto-scrolling in opposite directions. */
export function IndustriesSection() {
  const row1 = industries.slice(0, 5);
  const row2 = industries.slice(5);
  const edgeFade =
    "group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]";
  return (
    <section className="py-16 md:py-22">
      <div className="container-page">
        <SectionHeading
          wide
          eyebrow="Industries we power"
          title={
            <>
              Domain-driven engineering, tuned to the realities of{" "}
              <span className="text-metal-red-shine">every industry we serve.</span>
            </>
          }
          description="Thirteen years and 700+ projects across sectors mean the patterns, the pitfalls, and the regulations are already familiar — so your build starts with a head start, not a learning curve."
        />
      </div>
      <div className="mt-12 flex flex-col gap-4">
        {/* Row 1 → scrolls left */}
        <div className={edgeFade}>
          <div className="flex w-max animate-[marquee-x_40s_linear_infinite] group-hover:[animation-play-state:paused]">
            {[...row1, ...row1].map((name, i) => (
              <IndustryPill key={`r1-${name}-${i}`} name={name} />
            ))}
          </div>
        </div>
        {/* Row 2 → scrolls right */}
        <div className={edgeFade}>
          <div className="flex w-max animate-[marquee-x_40s_linear_infinite_reverse] group-hover:[animation-play-state:paused]">
            {[...row2, ...row2].map((name, i) => (
              <IndustryPill key={`r2-${name}-${i}`} name={name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Impact stories preview — flagship work in a horizontal showcase carousel.
 *
 * CMS-driven, and featured-first: the API returns featured stories at the head
 * of the list, so marketing controls what leads the home page without touching
 * the manual sort order used on /impact.
 */
export async function ImpactPreview() {
  const stories = await getSuccessStories();
  const items = stories.map((story) => ({
    slug: story.slug,
    title: story.title,
    summary: story.summary,
    src: story.coverImage,
  }));

  // The carousel needs something to scroll; an empty band reads as broken.
  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-22">
      <ImpactShowcase
        eyebrow="Proof of impact"
        title={
          <>
            Production-grade systems that deliver{" "}
            <span className="text-metal-red-shine">measurable business outcomes.</span>
          </>
        }
        description="Real partnerships with enterprises, governments, and institutions — the kind of work measured in outcomes that move the business, not impressions."
        href="/impact"
        ctaLabel="All stories"
        items={items}
      />
    </section>
  );
}

/** Closing conversion CTA. */
export function StartYourJourneyCta() {
  return (
    <section className="relative overflow-hidden bg-cinematic text-white">
      <div className="container-page py-24 text-center md:py-32">
        <h2 className="mx-auto max-w-3xl text-3xl sm:text-4xl lg:text-5xl">
          Let&apos;s build what your business <span className="text-gradient">needs next.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
          Every project is the beginning of a long-term partnership. Tell us where you want to go.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button href={primaryCta.href} size="lg">{primaryCta.label}</Button>
          <Button href="/contact" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
            Let&apos;s talk
          </Button>
        </div>
      </div>
    </section>
  );
}
