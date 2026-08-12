import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { CareersGrowth } from "@/components/organisms/careers-growth";
import type { IconItem } from "@/lib/careers-content";
import { getCultureValues, getGrowthOpportunities } from "@/lib/cms";
import { CmsIcon } from "@/lib/icon-registry";

/** Two-digit index used as the ghost numeral on both card styles. */
const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Principle card (light sections) — a numbered card with a spine that fills on
 * hover, so the six values read as a deliberate list rather than a flat grid.
 */
function PrincipleCard({ item, index }: { item: IconItem; index: number }) {
  // The icon arrives as a name — from the committed list or from the CMS.
  const { title, description } = item;
  return (
    <article
      data-aos="fade-up"
      data-aos-delay={(index % 3) * 70}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper p-6 pl-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_26px_50px_-28px_rgba(215,52,56,0.4)]"
    >
      {/* Spine — a hairline at rest, floods the full height on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[3px] origin-top scale-y-[0.18] bg-gradient-to-b from-brand to-brand/20 transition-transform duration-500 group-hover:scale-y-100"
      />
      {/* Ghost numeral */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-5 top-3 font-display text-5xl font-bold leading-none text-ink/[0.05] transition-colors duration-300 group-hover:text-brand/15"
      >
        {num(index)}
      </span>

      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-[#7a1519] text-white shadow-sm shadow-brand/25 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
        <CmsIcon name={item.icon} size={20} aria-hidden />
      </span>
      <h3 className="mt-4 text-base font-bold leading-snug text-ink transition-colors group-hover:text-brand-ink">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/60">{description}</p>
    </article>
  );
}

/**
 * Life-at-Sumago culture block for the Careers page: a mission statement, our
 * values, and growth opportunities — the latter as the interactive climb.
 * Sits between the hero and the open-roles board.
 */
export async function CareersCulture() {
  /*
   * Both lists are CMS-driven. `CareersGrowth` below is a client component,
   * so its opportunities are fetched here and handed down; the values render
   * in place.
   */
  const [cultureValues, growthOpportunities] = await Promise.all([
    getCultureValues(),
    getGrowthOpportunities(),
  ]);

  return (
    <>
      {/* Mission statement */}
      <Section>
        <div className="mx-auto max-w-4xl text-center" data-aos="fade-up">
          <Eyebrow className="mx-auto w-fit">Why Sumago</Eyebrow>
          <p className="text-2xl font-bold leading-tight tracking-[-0.02em] text-ink sm:text-3xl md:text-4xl">
            Join the team shaping the next big thing in{" "}
            <span className="text-metal-red">digital transformation</span> — building
            platforms and experiences that move real businesses forward.
          </p>
        </div>
      </Section>

      {/* How we think and work */}
      <Section muted>
        <SectionHeading
          eyebrow="How we think and work"
          title={
            <>
              The <span className="text-metal-red">values</span> behind every project.
            </>
          }
          description="The principles that shape how we build, collaborate, and grow."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cultureValues.map((item, i) => (
            <PrincipleCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </Section>

      {/* Growth opportunities — the climb: staircase + step list */}
      <Section>
        <SectionHeading
          eyebrow="Growth opportunities"
          title={
            <>
              Where a career here can <span className="text-metal-red">take you</span>.
            </>
          }
          description="Real pathways, rewards, and support to grow — and step into leadership."
        />
        <CareersGrowth opportunities={growthOpportunities} />
      </Section>
    </>
  );
}
