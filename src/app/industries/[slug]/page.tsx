import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { Button } from "@/components/atoms/button";
import { Reveal } from "@/components/motion/reveal";
import { industries } from "@/lib/site";
import { industryDetails } from "@/lib/content";
import { slugify } from "@/lib/utils";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: slugify(i) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = industries.find((i) => slugify(i) === slug);
  return { title: title ?? "Industry" };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = industries.find((i) => slugify(i) === slug);
  if (!name) notFound();
  const detail = industryDetails[slug];

  const blocks: { heading: string; items: string[] }[] = [
    { heading: "Typical challenges", items: detail?.challenges ?? [] },
    { heading: "Our solutions", items: detail?.solutions ?? [] },
    { heading: "Outcomes", items: detail?.outcomes ?? [] },
  ];

  return (
    <>
      <PageHero
        variant="floor"
        eyebrow="Industries we power"
        title={name}
        description={`Helping ${name.toLowerCase()} organizations turn technology into measurable business outcomes.`}
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-3">
          {blocks.map((b) => (
            <Reveal key={b.heading}>
              <div className="h-full rounded-xl border border-line p-6">
                <h2 className="text-xl">{b.heading}</h2>
                <ul className="mt-4 space-y-2">
                  {b.items.map((it) => (
                    <li key={it} className="flex gap-2 text-sm text-ink/80">
                      <span className="text-brand">→</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Button href="/contact">Book a call</Button>
        </div>
      </Section>
    </>
  );
}
