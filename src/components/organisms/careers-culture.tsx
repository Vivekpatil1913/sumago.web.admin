import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Eyebrow } from "@/components/atoms/eyebrow";
import {
  cultureValues,
  growthOpportunities,
  type IconItem,
} from "@/lib/careers-content";

/** Icon tile + title + one-line description — the shared card for values,
 *  perks, and growth pathways. */
function IconCard({ item, index }: { item: IconItem; index: number }) {
  const { icon: Icon, title, description } = item;
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={(index % 3) * 60}
      className="group flex h-full flex-col rounded-2xl border border-line bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_24px_48px_-24px_rgba(215,52,56,0.35)]"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-[#7a1519] text-white shadow-sm shadow-brand/25 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
        <Icon size={20} />
      </span>
      <h3 className="mt-4 text-base font-bold leading-snug text-ink transition-colors group-hover:text-brand-ink">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/60">{description}</p>
    </div>
  );
}

/**
 * Life-at-Sumago culture block for the Careers page: a mission statement, our
 * values, and growth opportunities (pathways + perks). Sits between the hero
 * and the open-roles board.
 */
export function CareersCulture() {
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
          title="The values behind every project."
          description="The principles that shape how we build, collaborate, and grow."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cultureValues.map((item, i) => (
            <IconCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </Section>

      {/* Growth opportunities — pathways + perks combined */}
      <Section>
        <SectionHeading
          eyebrow="Growth opportunities"
          title="Where a career here can take you."
          description="Real pathways, rewards, and support to grow — and step into leadership."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {growthOpportunities.map((item, i) => (
            <IconCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </Section>
    </>
  );
}
