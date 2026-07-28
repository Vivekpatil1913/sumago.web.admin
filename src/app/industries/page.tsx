import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/page-hero";
import {
  IndustriesSection,
  WhySectorDepth,
} from "@/components/organisms/industries/index-sections";
import { ProcessSection } from "@/components/organisms/home/process-trust";

export const metadata: Metadata = {
  title: "Industries We Power",
  description:
    "Ten industries, each framed by the operating problem it arrives with — from logistics and manufacturing to healthcare, banking, government, and beyond.",
};

/**
 * All Industries — the sector-axis twin of `/solutions`. Same page architecture
 * (hero → catalog in editorial bands → ledger → the delivery process), so the
 * two pages read as one system: services grouped by lifecycle phase there,
 * industries grouped by sector family here.
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
      <IndustriesSection />
      <WhySectorDepth />
      <ProcessSection />
      {/* No CTA band here — the site footer already closes every page with the
          same "Let's build what your business needs next" call to action. */}
    </>
  );
}
