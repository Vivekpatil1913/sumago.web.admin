import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { MediaPlaceholder } from "@/components/molecules/media-placeholder";
import { getSuccessStories } from "@/lib/cms";

export const metadata: Metadata = { title: "Proof of Impact" };

export default async function ImpactPage() {
  // Featured stories first, then manual order — set by the API.
  const stories = await getSuccessStories();

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
          {stories.map((story, idx) => (
            <Link
              key={story.slug}
              href={`/impact/${story.slug}`}
              data-aos="fade-up"
              data-aos-delay={(idx % 2) * 80}
              className="group overflow-hidden rounded-xl border border-line transition-shadow hover:shadow-sm"
            >
              <MediaPlaceholder src={story.coverImage} alt={story.title} ratio="16/9" />
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-ink/80">
                  <span>{story.industry}</span>
                  <span className="text-ink/30">·</span>
                  <span className="text-ink/50">{story.region}</span>
                </div>
                <h2 className="mt-2 text-xl font-semibold group-hover:text-brand-ink">
                  {story.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                  {story.summary}
                </p>

                {/* Measured results, when the client has approved figures. */}
                {story.results.length > 0 && (
                  <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                    {story.results.map((result) => (
                      <div key={result.label}>
                        <dt className="sr-only">{result.label}</dt>
                        <dd>
                          <span className="font-display text-lg font-bold text-brand-ink">
                            {result.value}
                          </span>{" "}
                          <span className="text-xs text-ink/55">{result.label}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </Link>
          ))}
        </div>

        {stories.length === 0 && (
          <p className="mt-12 text-center text-sm text-ink/55">
            Case studies are being prepared.{" "}
            <Link href="/contact" className="font-semibold text-brand-ink underline-offset-4 hover:underline">
              Ask us about work in your sector
            </Link>
            .
          </p>
        )}
      </Section>
    </>
  );
}
