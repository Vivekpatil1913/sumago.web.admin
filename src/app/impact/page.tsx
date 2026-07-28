import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { MediaPlaceholder } from "@/components/molecules/media-placeholder";
import { impactStories } from "@/lib/site";

export const metadata: Metadata = { title: "Proof of Impact" };

export default function ImpactPage() {
  return (
    <>
      <PageHero
        variant="spotlight"
        formation="burst"
        eyebrow="Proof of Work"
        title={<><span className="text-metal-red">Sumago impact</span>, measured in outcomes.</>}
        description="Real Sumago partnerships with enterprises, institutions, and governments — where success shows up as business results and lasting change, not screenshots."
      />
      <Section>
        <SectionHeading
          eyebrow="Selected work"
          title={<>Where the <span className="text-metal-red">work speaks</span> for itself.</>}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {impactStories.map((s, idx) => (
            <Link
              key={s.slug}
              href={`/impact/${s.slug}`}
              data-aos="fade-up"
              data-aos-delay={(idx % 2) * 80}
              className="group overflow-hidden rounded-xl border border-line transition-shadow hover:shadow-sm"
            >
              <MediaPlaceholder src={s.cover} alt={s.title} ratio="16/9" />
              <div className="p-6">
                <h2 className="text-xl font-semibold group-hover:text-brand-ink">
                  {s.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                  {s.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
