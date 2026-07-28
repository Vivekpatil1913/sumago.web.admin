import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/page-hero";
import {
  ServicesSection,
  WhyPartner,
} from "@/components/organisms/solutions/index-sections";
import { ProcessSection } from "@/components/organisms/home/process-trust";

export const metadata: Metadata = {
  title: "What We Solve",
  description:
    "The full range of services across the technology lifecycle — from consulting and strategy to design, engineering, and long-term support.",
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        variant="blueprint"
        formation="torus"
        eyebrow="All Services"
        title={<>The problems <span className="text-metal-red">Sumago solves</span> for you.</>}
        description="From first consult to long-term support, Sumago's services span the full technology lifecycle — so nothing slips through the cracks between vendors."
      />
      <ServicesSection />
      <WhyPartner />
      <ProcessSection />
      {/* No CTA band here — the site footer already closes every page with the
          same "Let's build what your business needs next" call to action. */}
    </>
  );
}
