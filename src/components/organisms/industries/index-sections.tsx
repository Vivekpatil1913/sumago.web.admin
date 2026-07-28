import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { IndustrySectors } from "@/components/organisms/industries/industry-sectors";
import { sectorPrinciples } from "@/lib/industries";

/**
 * The full industry catalog — four editorial bands, one per sector family.
 * Mirrors `solutions/index-sections.tsx` so Services and Industries read as two
 * views of the same catalogue rather than two different websites.
 */
export function IndustriesSection() {
  return (
    <>
      {/* Heading stays in the container; the sector bands run edge to edge. */}
      <div className="pt-16 md:pt-22">
        <div className="container-page">
          <SectionHeading
            wide
            eyebrow="All industries"
            title={
              <>
                Start with the operation —{" "}
                <span className="text-metal-red-shine">not the industry label.</span>
              </>
            }
            description="Ten sectors, each framed by the week it usually arrives with. Read the one that sounds like yours."
          />
        </div>
      </div>
      <IndustrySectors />
    </>
  );
}

/**
 * Why sector depth matters — a ledger, not another card grid, matching the
 * "Why Sumago" ledger on the services page. Rows read as a spec sheet: how
 * domain work is actually run, deliberately different from the bands above it.
 */
export function WhySectorDepth() {
  return (
    <Section muted>
      <SectionHeading
        eyebrow="How sector work is run"
        title={
          <>
            Industry knowledge that changes the{" "}
            <span className="text-metal-red">architecture</span>, not just the pitch.
          </>
        }
        description="Naming a sector is easy. What matters is how that understanding shows up in the decisions behind the build."
      />
      <ul className="mx-auto mt-12 max-w-5xl border-t border-line">
        {sectorPrinciples.map((p, i) => (
          <li
            key={p.title}
            data-aos="fade-up"
            data-aos-delay={(i % 3) * 60}
            className="group grid items-baseline gap-x-6 gap-y-1 border-b border-line py-6 transition-colors hover:bg-paper sm:grid-cols-[auto_minmax(0,15rem)_1fr] sm:py-7"
          >
            <span className="font-display text-2xl font-bold leading-none text-ink/15 transition-colors group-hover:text-brand/40 sm:text-3xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-lg font-bold leading-snug text-ink">{p.title}</h3>
            <p className="text-sm leading-relaxed text-ink/65 sm:text-base">
              {p.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
