import type { Metadata } from "next";
import { BadgeCheck, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Button } from "@/components/atoms/button";
import { Stat } from "@/components/molecules/stat";
import { MediaPlaceholder } from "@/components/molecules/media-placeholder";
import { MosaicGallery } from "@/components/organisms/gallery/mosaic-gallery";
import { CoreValuesRadial, type CoreValue } from "@/components/organisms/about/core-values";
import { StoryTimeline } from "@/components/organisms/about/story-timeline";
import { VisionMission } from "@/components/organisms/about/vision-mission";
import { TrustWall } from "@/components/organisms/about/trust-wall";
import { Recognition } from "@/components/organisms/about/recognition";
import { company } from "@/lib/site";
import { clientNames } from "@/lib/content";
import { previewImages, cultureGalleryImages } from "@/lib/preview-assets";

export const metadata: Metadata = {
  title: "Inside Sumago",
  description:
    "The story, mantra, values, recognition, and people behind Sumago — a strategic technology partner since 2013.",
};

/** Verified core values (COMPANY-PROFILE.md) — outcome-first framing. */
const coreValues: CoreValue[] = [
  {
    name: "Continuous Learning",
    description:
      "Staying ahead of technology so every solution reflects what's current — not what's comfortable.",
    icon: "GraduationCap",
  },
  {
    name: "Innovation",
    description:
      "Solving real problems with fresh thinking and purpose, never novelty for its own sake.",
    icon: "Lightbulb",
  },
  {
    name: "Constant Improvement",
    description:
      "Refining the work — and the way it's built — long after the first release ships.",
    icon: "TrendingUp",
  },
  {
    name: "Commitment",
    description:
      "Owning outcomes end to end, and standing behind them well past delivery.",
    icon: "HeartHandshake",
  },
];

/** SUMAGO name meaning (verified). */
const nameMeaning: [string, string][] = [
  ["Solutions", "Reliable, scalable IT solutions."],
  ["Unity", "Collaboration across teams and partners."],
  ["Modernization", "Adopting current and emerging technologies."],
  ["Agility", "Adapting quickly to changing demands."],
  ["Growth", "Continuous improvement and expansion."],
  ["Ownership", "Treating every project as our own."],
];

/** Team celebration collage — reuses the auto-scrolling mosaic pattern. */
const teamGalleryImages = cultureGalleryImages.map((src, i) => ({
  src,
  alt: `Sumago team member, engineer, or workspace — team still ${i + 1}`,
}));

/** Edge-fade + overflow clip shared by both client marquee strips (matches home). */
const CLIENT_STRIP_MASK =
  "relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]";

/** Split the roster into two strips so they scroll in opposite directions. */
const clientRowA = clientNames.filter((_, i) => i % 2 === 0);
const clientRowB = clientNames.filter((_, i) => i % 2 === 1);

/**
 * One client on the marquee — text chip today; drop a logo image in
 * `public/clients/` and render it here once display consent is confirmed.
 */
function ClientChip({ name }: { name: string }) {
  return (
    <span className="mx-2 inline-flex shrink-0 items-center rounded-lg border border-white/12 bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm">
      {name}
    </span>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        variant="aurora"
        formation="galaxy"
        redOpacity={0.08}
        eyebrow="About us"
        /* Long headline — kept at the home-hero type scale, widened so it breaks
           cleanly into three lines rather than shrinking. */
        titleClassName="max-w-5xl lg:text-5xl xl:text-6xl"
        title={
          <>
            Not just an IT software company
            <br />
            <span className="text-metal-red-shine">
              the technology partner businesses
              <br />
              build their future on.
            </span>
          </>
        }
        description={`Since ${company.foundedYear}, Sumago has turned technology into real business outcomes for enterprises, startups, and governments — built on trust, engineering rigor, and partnerships that outlast the project.`}
      />

      {/* 1 · About Sumago — centered image, justified story, milestone timeline. */}
      <Section>
        <SectionHeading
          eyebrow="Our story"
          title={
            <>
              It started with a belief in{" "}
              <span className="text-metal-red">technology for everyone</span>.
            </>
          }
        />

        {/* Centered hero still — brand glow + founding-year badge. */}
        <div className="relative mx-auto mt-12 max-w-3xl" data-aos="fade-up">
          <div
            aria-hidden
            className="absolute -inset-5 -z-10 rounded-[2rem] bg-brand/5 blur-2xl"
          />
          <MediaPlaceholder
            src={previewImages.heroOffice}
            alt="Sumago headquarters and team, Nashik"
            ratio="16/9"
            priority
            className="card-hover"
          />
          <div className="absolute -bottom-4 left-4 rounded-xl border border-line bg-paper/95 px-4 py-3 shadow-lg backdrop-blur">
            <p className="font-display text-2xl font-bold text-metal-red">2013</p>
            <p className="text-xs font-medium text-ink/60">Nashik → global</p>
          </div>
        </div>

        {/* Justified story — begins with the 2013 origin. */}
        <div
          data-aos="fade-up"
          className="mx-auto mt-12 max-w-3xl space-y-4 text-justify text-lg leading-relaxed text-ink/75"
        >
          <p>
            In {company.foundedYear}, Sumago began in Nashik as a small software team
            led by {company.leadership[0].name}, built around one stubborn belief — that
            great technology shouldn&apos;t belong only to the few who could afford it. The
            mission was simple to say and hard to do: make IT a tool for the masses as much
            as the classes.
          </p>
          <p>
            Clients came for code and left with something more valuable — a partner who
            understood their business first. That shift, from shipping software to shaping
            outcomes, is what turned a local studio into a strategic technology partner.
            Thirteen-plus years and 700+ projects later, that handful has grown into a 70+
            specialist team spanning strategy, design, engineering, cloud, and AI — with
            offices in Nashik and Pune, and led today by{" "}
            {company.leadership[1].name}, {company.leadership[1].role}. Through every stage,
            the conviction has stayed the same: understand the business before the
            technology, earn trust through outcomes, and stay long after launch.
          </p>
        </div>

      </Section>

      {/* Milestone timeline — pinned horizontal scroll through the years.
          Copy + verified-flags live in the component. */}
      <StoryTimeline />

      {/* Proof — verified metrics + certifications on a cinematic blueprint band. */}
      <Section dark className="relative isolate overflow-hidden bg-blueprint">
        <div className="relative z-10">
          <p className="text-center text-sm font-bold uppercase tracking-[0.22em] text-brand-bright">
            The proof, in numbers
          </p>

          {/* Glass proof panel — brushed-silver numerals, hairline column rules. */}
          <div className="mx-auto mt-10 max-w-6xl rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-10 backdrop-blur-sm sm:px-8">
            <div className="grid grid-cols-2 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
              {company.metrics.map((m, i) => (
                <div
                  key={m.label}
                  data-aos="fade-up"
                  data-aos-delay={(i % 6) * 60}
                  className="lg:border-l lg:border-white/10 lg:first:border-l-0"
                >
                  <Stat value={m.value} label={m.label} tone="silver" dark />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {company.certifications.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur"
              >
                <BadgeCheck size={16} className="text-success-bright" aria-hidden />
                {c}
              </span>
            ))}
          </div>

          {/* The numbers say what was delivered; /how-we-deliver says how, and
              from where — the due-diligence read for an evaluating buyer. */}
          <div className="mt-10 flex justify-center">
            <Button
              href="/how-we-deliver"
              variant="outline"
              className="border-white/25 text-white backdrop-blur-sm hover:bg-white/10"
            >
              See the capability behind it <ArrowRight size={16} aria-hidden />
            </Button>
          </div>
        </div>
      </Section>

      {/* 2 · Our mantra — vision & mission */}
      <Section muted>
        <SectionHeading align="left" eyebrow="Our purpose" title="Vision & Mission" />
        <VisionMission />
      </Section>

      {/* 3 · Core values */}
      <Section>
        <SectionHeading
          eyebrow="Core values"
          title={
            <>
              The principles we <span className="text-metal-red">refuse to trade</span>.
            </>
          }
          description="Under deadlines and pressure, these are the things that don't bend."
        />
        <CoreValuesRadial values={coreValues} />

        {/* What the name stands for — SUMAGO acronym (verified), metallic drop-caps. */}
        <div className="mt-16">
          <p className="text-center text-sm font-bold uppercase tracking-[0.22em] text-brand-ink">
            And what our name stands for
          </p>
          {/* The six words on one line — the bold initials spell SUMAGO. */}
          <p
            data-aos="fade-up"
            className="mx-auto mt-8 flex max-w-6xl flex-wrap items-baseline justify-center gap-x-5 gap-y-3 font-display"
          >
            {nameMeaning.map(([k, v]) => (
              <span key={k} title={v} className="whitespace-nowrap">
                <span className="text-4xl font-bold text-metal-red sm:text-5xl lg:text-6xl">
                  {k[0]}
                </span>
                <span className="text-xl font-medium text-ink/75 sm:text-2xl lg:text-3xl">
                  {k.slice(1)}
                </span>
              </span>
            ))}
          </p>
        </div>
      </Section>

      {/* 4 · Recognition — certifications, awards timeline, press, and the
          procurement ask. Lives in its own organism (see the file header for
          why it's built as a credential dossier rather than a badge grid). */}
      <Recognition />

      {/* 5 · Our client partners — two-row scrolling roster on a dark trust band
          (mirrors the home-page TrustIndicators treatment). */}
      <Section dark className="relative isolate overflow-hidden bg-blueprint">
        <div className="relative z-10">
          <SectionHeading
            tone="dark"
            eyebrow="Our client partners"
            title={
              <>
                The organizations that{" "}
                <span className="text-metal-red-shine">build with us.</span>
              </>
            }
            description="From global brands to government bodies — a partial list of the teams who trust Sumago with mission-critical work."
          />

          <div className="mt-12 flex flex-col gap-4">
            {/* Row 1 → scrolls left */}
            <div className={CLIENT_STRIP_MASK}>
              <div className="flex w-max animate-[marquee-x_45s_linear_infinite]">
                {[...clientRowA, ...clientRowA].map((name, i) => (
                  <ClientChip key={`a-${name}-${i}`} name={name} />
                ))}
              </div>
            </div>
            {/* Row 2 → scrolls right */}
            <div className={CLIENT_STRIP_MASK}>
              <div className="flex w-max animate-[marquee-x_45s_linear_infinite_reverse]">
                {[...clientRowB, ...clientRowB].map((name, i) => (
                  <ClientChip key={`b-${name}-${i}`} name={name} />
                ))}
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-sm font-medium uppercase tracking-wider text-white/45">
            50+ government · 500+ domestic · 60+ international clients and counting
          </p>
          <p className="mt-3 text-center text-xs text-white/35">
            Client names shown as text — logos displayed with permission.
          </p>
        </div>
      </Section>

      {/* 6 · What they say — scroll-driven wall of proof that resolves
          into the closing brand moment. Full-bleed: no Section wrapper. */}
      <TrustWall />

      {/* 7 · The team behind it all */}
      <Section>
        <SectionHeading
          eyebrow="Our people"
          title={
            <>
              All of this is possible because of{" "}
              <span className="text-metal-red-shine">our team</span>.
            </>
          }
          description="Seventy-plus engineers, designers, and consultants who take real ownership — the people you actually build with."
        />
        <div className="relative mt-12">
          <div
            aria-hidden
            className="absolute -inset-4 -z-10 rounded-[2rem] bg-brand/5 blur-2xl"
          />
          <MosaicGallery
            images={teamGalleryImages}
            label="The Sumago team"
            className="rounded-2xl ring-1 ring-line"
          />
          <div className="pointer-events-none absolute -top-4 right-4 z-10 rounded-xl border border-line bg-paper/95 px-4 py-3 shadow-lg backdrop-blur">
            <p className="font-display text-2xl font-bold text-metal-red">70+</p>
            <p className="text-xs font-medium text-ink/60">one standard</p>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <Button href="/team" variant="outline">
            Meet the team <ArrowRight size={16} />
          </Button>
        </div>
      </Section>
    </>
  );
}
