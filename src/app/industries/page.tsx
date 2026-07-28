import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { industries } from "@/lib/site";
import { slugify } from "@/lib/utils";

export const metadata: Metadata = { title: "Industries We Power" };

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        variant="mesh"
        formation="wave"
        eyebrow="Industries"
        title={<><span className="text-metal-red">Sumago expertise</span> across industries.</>}
        description="Sumago pairs deep, cross-industry expertise with proven best practices — tailored to the realities and regulations of every operation we serve."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((i, idx) => (
            <Link
              key={i}
              href={`/industries/${slugify(i)}`}
              data-aos="fade-up"
              data-aos-delay={(idx % 3) * 60}
              className="group flex items-center justify-between gap-3 rounded-xl border border-line p-6 transition-colors hover:border-brand/40"
            >
              <span className="font-medium text-ink group-hover:text-brand-ink">{i}</span>
              <ArrowRight size={18} className="shrink-0 text-brand/70" />
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
