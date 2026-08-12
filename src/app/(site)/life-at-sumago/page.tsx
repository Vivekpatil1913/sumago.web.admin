import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  BadgeCheck,
  Users,
  Gem,
  ArrowRight,
} from "lucide-react";
import { getEventGalleries, getJobs, withSeoOverrides } from "@/lib/cms";
import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Button } from "@/components/atoms/button";
import { MosaicGallery } from "@/components/organisms/gallery/mosaic-gallery";
import { EventGallery } from "@/components/organisms/gallery/event-gallery";
import { cultureGallery } from "@/lib/real-assets";

/**
 * Metadata for /life-at-sumago, with the panel's SEO record layered on top.
 *
 * The base below is what the page ships with; anything published for this
 * path in SEO Metadata overrides it field by field. No record means the
 * base stands unchanged — never an empty title.
 */
export async function generateMetadata(): Promise<Metadata> {
  return withSeoOverrides("/life-at-sumago", {
    title: "Life at Sumago",
    description:
      "The culture behind the work — continuous learning, real ownership, and a team that enjoys solving hard problems.",
  });
}

const culturePillars = [
  {
    icon: GraduationCap,
    title: "Continuous learning",
    desc: "New tools, techniques, and ideas are part of the everyday — never an afterthought.",
  },
  {
    icon: BadgeCheck,
    title: "Real ownership",
    desc: "Every person treats the work as their own, from first commit to long-term support.",
  },
  {
    icon: Users,
    title: "Collaboration over silos",
    desc: "Analysts, designers, and engineers solve problems together — not in handoffs.",
  },
  {
    icon: Gem,
    title: "Craft & standards",
    desc: "High engineering standards and real attention to detail, on every engagement.",
  },
];

export default async function LifeAtSumagoPage() {
  // `getJobs` is the same source /careers reads, so the two pages can never
  // disagree about how many roles are open.
  const [openPositions, galleries] = await Promise.all([
    getJobs(),
    getEventGalleries(),
  ]);

  /* Each gallery carries its own per-image alt text from the panel; the
     category name stands in only where an editor has not written one, so a
     photograph is never announced as nothing. */
  const eventCategories = galleries.map((gallery) => ({
    key: gallery.key,
    title: gallery.title,
    images: gallery.images.map((image, i) => ({
      src: image.url,
      alt: image.alt || `Sumago ${gallery.title} — photo ${i + 1}`,
    })),
  }));

  return (
    <>
      <PageHero
        variant="streaks"
        formation="embers"
        eyebrow="Life at Sumago"
        title={
          <>
            Life at Sumago:{" "}
            <span className="text-metal-red-shine">curiosity and craft</span>.
          </>
        }
        description="Inside Sumago, continuous learning and real ownership shape everything — the people, rituals, and everyday craft behind every project we ship."
      />

      <Section>
        <SectionHeading
          eyebrow="Our culture"
          title={
            <>
              Where great work and{" "}
              <span className="text-metal-red">good people</span> meet.
            </>
          }
          description="Continuous learning, real ownership, and a team that genuinely enjoys solving hard problems."
        />
        {/* Auto-scrolling culture collage. */}
        <MosaicGallery
          images={cultureGallery}
          label="Life at Sumago photo gallery"
          className="mt-12"
        />
      </Section>

      <Section muted>
        <SectionHeading
          eyebrow="What it's like"
          title={
            <>
              The things that shape{" "}
              <span className="text-metal-red">how we work</span>.
            </>
          }
          description="Four principles you feel on day one — and every day after."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {culturePillars.map((p, i) => (
            <div
              key={p.title}
              data-aos="fade-up"
              data-aos-delay={(i % 4) * 70}
              className="group relative overflow-hidden rounded-2xl border border-line bg-white/70 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_24px_48px_-24px_rgba(215,52,56,0.35)]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute right-5 top-3 text-5xl font-black leading-none text-ink/[0.05] transition-colors duration-300 group-hover:text-brand/10"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand to-[#7a1519] text-white shadow-sm shadow-brand/25 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
                <p.icon size={22} />
              </span>
              <h3 className="relative mt-5 text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand-ink">
                {p.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-ink/65">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Selectable event galleries — dark stage, three-row collage.

          The whole band is conditional, heading included: an editor who has
          unpublished every gallery should get no section, not a dark stage with
          a title and empty space under it. */}
      {eventCategories.length > 0 ? (
        <Section dark>
          <SectionHeading
            tone="dark"
            eyebrow="Moments & milestones"
            title={
              <>
                Life at Sumago,{" "}
                <span className="text-metal-red">off the clock too</span>.
              </>
            }
            description="Festivals, conferences, trips, and everything in between — pick a category to see the moments that bring the team together."
          />
          <div className="mt-12">
            <EventGallery categories={eventCategories} rows={3} tone="dark" />
          </div>
        </Section>
      ) : null}

      {/* Careers CTA — the live role count and real openings do the persuading. */}
      <Section>
        <div
          data-aos="fade-up"
          className="relative overflow-hidden rounded-3xl border border-line bg-white"
        >
          {/* Brand-red edge + soft corner glows. */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#7a1519,#d73438,#ff8f91,#d73438,#7a1519)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(215,52,56,0.14),transparent_65%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(215,52,56,0.09),transparent_65%)]"
          />

          <div className="relative grid items-center gap-10 p-8 sm:p-10 md:grid-cols-[1.15fr_1fr] md:p-14">
            {/* The pitch. */}
            <div>
              <span className="chip border-brand/25 bg-brand/5 text-brand-ink">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
                </span>
                {openPositions.length > 0
                  ? `${openPositions.length} open ${openPositions.length === 1 ? "role" : "roles"}`
                  : "Always hiring good people"}
              </span>

              <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Want to build{" "}
                <span className="text-metal-red-shine">with us?</span>
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink/65">
                Curiosity, ownership, and high standards count for more than a
                perfect CV here — engineers, designers, and delivery leads who
                want the work to matter tend to stay a long while.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href="/careers" size="lg">
                  Explore careers
                  <ArrowRight size={17} />
                </Button>
                <Button href="/team" variant="outline" size="lg">
                  Meet the team
                </Button>
              </div>
            </div>

            {/* Real openings — concrete beats a generic invitation. Dropped
                entirely when nothing is open, rather than shown empty. */}
            {openPositions.length > 0 ? (
              <div className="rounded-2xl border border-line bg-mist/60 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/65">
                  Open roles
                </p>
                <ul className="mt-4 space-y-2.5">
                  {openPositions.slice(0, 3).map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/careers/${p.slug}`}
                        className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-white px-4 py-3 transition-colors duration-200 hover:border-brand/40"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-ink">
                            {p.title}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-ink/65">
                            {p.department} · {p.location}
                          </span>
                        </span>
                        <ArrowRight
                          size={16}
                          className="shrink-0 text-ink/65 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/careers"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink underline-offset-4 hover:underline"
                >
                  View all {openPositions.length} roles
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </Section>
    </>
  );
}
