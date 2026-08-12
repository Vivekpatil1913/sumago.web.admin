import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/cms";
import { PageHero } from "@/components/organisms/page-hero";
import { IntelligentSystems } from "@/components/organisms/innovation/intelligent-systems";

/**
 * Metadata for /innovation, with the panel's SEO record layered on top.
 *
 * The base below is what the page ships with; anything published for this
 * path in SEO Metadata overrides it field by field. No record means the
 * base stands unchanged — never an empty title.
 */
export async function generateMetadata(): Promise<Metadata> {
  return withSeoOverrides("/innovation", {
    title: "Innovation Lab",
    description:
      "Applied AI, automation and data intelligence — chatbots and assistants, voice and language AI, workflow automation, and analytics built into everyday decisions.",
  });
}

export default function InnovationPage() {
  return (
    <>
      <PageHero
        variant="orbit"
        formation="orbit"
        eyebrow="Innovations"
        title={
          <>
            Where <span className="text-metal-red-shine">Sumago</span> explores
            what&apos;s next.
          </>
        }
        description="Applied AI, active R&D, and hands-on experiments — how Sumago turns emerging technology into a practical, confident edge for the clients we serve."
      />
      <IntelligentSystems />
    </>
  );
}
