import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { ServiceChapters } from "@/components/organisms/solutions/service-chapters";
import { differentiators } from "@/lib/content";

/**
 * The full service catalog — four editorial chapters, one per lifecycle phase.
 * Not a grid of 15 cards (the home page already runs that), and not a split-view
 * console. The lifecycle phases ARE the chapters, so the old `LifecycleStrip`
 * card row is gone: it said the same thing as the delivery road below it.
 */
export function ServicesSection() {
  return (
    <>
      {/* Heading stays in the container; the chapter bands run edge to edge. */}
      <div className="pt-16 md:pt-22">
        <div className="container-page">
          <SectionHeading
            wide
            eyebrow="All services"
            title={
              <>
                Start with the problem —{" "}
                <span className="text-metal-red-shine">not the service list.</span>
              </>
            }
            description="Fifteen services across the full technology lifecycle, each framed by the problem it solves. Read the one that sounds like your week."
          />
        </div>
      </div>
      <ServiceChapters />
    </>
  );
}

/**
 * Why partner with Sumago — a ledger, not another card grid. Rows read as a
 * spec sheet: substance over marketing tiles, and deliberately different from
 * the explorer above it.
 */
export function WhyPartner() {
  return (
    <Section muted>
      <SectionHeading
        eyebrow="Why Sumago"
        title={
          <>
            A partner chosen for <span className="text-metal-red">judgment</span>,
            not just delivery.
          </>
        }
        description="What sets the work apart isn't a longer feature list — it's how engagements are run."
      />
      <ul className="mx-auto mt-12 max-w-5xl border-t border-line">
        {differentiators.map((d, i) => (
          <li
            key={d.title}
            data-aos="fade-up"
            data-aos-delay={(i % 3) * 60}
            className="group grid items-baseline gap-x-6 gap-y-1 border-b border-line py-6 transition-colors hover:bg-paper sm:grid-cols-[auto_minmax(0,15rem)_1fr] sm:py-7"
          >
            <span className="font-display text-2xl font-bold leading-none text-ink/15 transition-colors group-hover:text-brand/40 sm:text-3xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-lg font-bold leading-snug text-ink">{d.title}</h3>
            <p className="text-sm leading-relaxed text-ink/65 sm:text-base">
              {d.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
