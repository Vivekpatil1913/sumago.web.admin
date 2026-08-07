import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Button } from "@/components/atoms/button";
import { OpenPositions } from "@/components/organisms/open-positions";
import { CareersCulture } from "@/components/organisms/careers-culture";
import { getEmailFor, getJobs } from "@/lib/cms";

export const metadata: Metadata = { title: "Life at Sumago" };

export default async function CareersPage() {
  const [jobs, careersEmail] = await Promise.all([getJobs(), getEmailFor("careers")]);

  return (
    <>
      <PageHero
        variant="grid"
        formation="helix"
        eyebrow="Careers"
        title={<>Build a standout career inside <span className="text-metal-red">Sumago</span>.</>}
        description="Join Sumago's 70+ multidisciplinary team — learn constantly, take real ownership, and ship work that makes a measurable business difference."
      />
      <CareersCulture />
      <Section muted>
        <SectionHeading
          eyebrow="Open roles"
          title={<>Find <span className="text-metal-red">where you fit</span>.</>}
          description="Explore current openings across our teams. Filter by team, then apply in a click."
        />
        <div className="mt-12">
          <OpenPositions jobs={jobs} />
        </div>
        <div
          data-aos="fade-up"
          className="relative mt-14 overflow-hidden rounded-2xl border border-line bg-white px-6 py-14 text-center shadow-[0_24px_50px_-30px_rgba(0,0,0,0.25)] sm:px-12"
        >
          {/* faint grey diagonal hatch texture */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(135deg,rgba(26,26,26,0.05)_0,rgba(26,26,26,0.05)_1px,transparent_1px,transparent_11px)]"
          />
          {/* soft grey depth from the base */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_120%,rgba(26,26,26,0.06),transparent_70%)]"
          />

          <div className="relative">
            <Quote
              aria-hidden
              className="mx-auto mb-5 h-8 w-8 fill-ink/10 text-ink/10"
            />
            <h3 className="text-2xl font-bold leading-tight tracking-[-0.01em] text-ink md:text-3xl">
              Don&apos;t see your role?
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink/60">
              Great people rarely fit a job description exactly. If you can help
              businesses solve real problems with technology, we want to hear
              from you.
            </p>
            <div className="mt-7 flex justify-center">
              <Button
                href={
                  careersEmail
                    ? `mailto:${careersEmail}?subject=General%20Application`
                    : "/contact"
                }
              >
                Send us your profile
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
