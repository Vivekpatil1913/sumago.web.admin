import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";

export const metadata: Metadata = { title: "Innovation Lab" };

const pillars = [
  ["AI Lab", "Applied AI/ML, Small Language Models, intelligent automation."],
  ["Internal R&D", "Technology accelerators and modern engineering practices."],
  ["Emerging tech", "Cloud, IoT, blockchain, and data analytics."],
  ["Insights & playbooks", "CEO insights, whitepapers, and product thinking."],
];

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
      <Section>
        <SectionHeading
          eyebrow="What we explore"
          title={<>Innovation with <span className="text-metal-red">purpose</span>.</>}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {pillars.map(([t, d], i) => (
            <div
              key={t}
              data-aos="fade-up"
              data-aos-delay={(i % 2) * 80}
              className="rounded-xl border border-line p-6"
            >
              <h3 className="text-lg font-semibold text-ink">{t}</h3>
              <p className="mt-2 text-sm text-ink/70">{d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
