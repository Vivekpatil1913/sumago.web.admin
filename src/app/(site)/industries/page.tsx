import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { IndustryGrid } from "@/components/organisms/industries/industry-grid";

export const metadata: Metadata = {
  title: "Industries We Power",
  description:
    "Domain expertise across ten industries — logistics, manufacturing, healthcare, banking, education, retail, government, hospitality, real estate, and professional services.",
};

/**
 * All Industries — every industry on one page, as cards. A visitor comes here to
 * find their own sector, so the whole list stays visible and comparable; each
 * card carries what the work looks like there and links to the detail page.
 */
export default function IndustriesPage() {
  return (
    <>
      <PageHero
        variant="mesh"
        formation="wave"
        eyebrow="All Industries"
        title={
          <>
            <span className="text-metal-red">Sumago expertise</span> across industries.
          </>
        }
        description="Sumago pairs deep, cross-industry expertise with proven best practices — tailored to the realities and regulations of every operation we serve."
      />
      <Section>
        <SectionHeading
          wide
          eyebrow="Ten industries"
          title={
            <>
              Find your sector —{" "}
              <span className="text-metal-red-shine">and what gets built there.</span>
            </>
          }
          description="Every industry Sumago works in, with the problems it typically arrives with and the platforms that solve them."
        />
        <IndustryGrid />
      </Section>
      {/* No CTA band here — the site footer already closes every page with the
          same "Let's build what your business needs next" call to action. */}
    </>
  );
}
