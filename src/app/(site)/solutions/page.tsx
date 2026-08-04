import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/page-hero";
import {
  ServicesSection,
  WhyPartner,
} from "@/components/organisms/solutions/index-sections";
import { ArchitectureBlueprint } from "@/components/organisms/solutions/architecture-blueprint";
import { SecurityAssurance } from "@/components/organisms/solutions/security-assurance";
import { DeliveryModels } from "@/components/organisms/solutions/delivery-models";
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
      {/* The architecture sits between the catalog and the pitch: the chapters
          say which problems get solved, this says how the systems that solve
          them are put together — the question that survives a technical
          evaluation. Drawn on drafting paper, so the components read as ink on
          a grid rather than as chips on a black wall. */}
      <ArchitectureBlueprint />
      {/* Security answers the question the blueprint provokes — "good stack, is
          it safe?" — and it is the gate a regulated buyer applies before any of
          the persuasion below lands. It carries the cross-cutting concerns the
          blueprint used to list in a rail beside the stack. */}
      <SecurityAssurance />
      <WhyPartner />
      <ProcessSection />
      {/* Methodology qualifies the journey above rather than repeating it: that
          section gives the six-step path, this gives the cadence it runs in.
          Deepest reader, most operational detail — and the answer to the
          "state your development methodology" line in every tender. */}
      <DeliveryModels />
      {/* No CTA band at the page foot — the site footer already closes every
          page with the same "Let's build what your business needs next" call to
          action. Note `SecurityAssurance` now carries its own consultation CTA;
          it sits mid-page, so if the two ever read as competing, that one moves
          rather than this comment changing again. */}
    </>
  );
}
