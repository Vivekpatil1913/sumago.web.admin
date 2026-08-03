import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/page-hero";
import { IntelligentSystems } from "@/components/organisms/innovation/intelligent-systems";

export const metadata: Metadata = {
  title: "Innovation Lab",
  description:
    "Applied AI, automation and data intelligence — chatbots and assistants, voice and language AI, workflow automation, and analytics built into everyday decisions.",
};

export default function InnovationPage() {
  return (
    <>
      <PageHero
        variant="orbit"
        formation="orbit"
        eyebrow="Innovations"
        title={<>Where <span className="text-metal-red">Sumago</span> explores what&apos;s next.</>}
        description="Applied AI, active R&D, and hands-on experiments — how Sumago turns emerging technology into a practical, confident edge for the clients we serve."
      />
      <IntelligentSystems />
    </>
  );
}
