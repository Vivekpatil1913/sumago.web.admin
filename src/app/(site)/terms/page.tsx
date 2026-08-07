import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { Button } from "@/components/atoms/button";
import { getSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that govern use of the Sumago Infotech website and services.",
};

/**
 * Terms & Conditions.
 * [REAL CONTENT NEEDED] Legal copy must be supplied/approved by the client's legal
 * team — never invent contractual terms (CLAUDE.md). This page exists so the
 * footer link resolves instead of 404ing; replace the placeholder before launch.
 */
export default async function TermsPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={
          <>
            Terms &amp; <span className="text-metal-red">Conditions</span>.
          </>
        }
        description="The terms that govern use of this website and Sumago's services."
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-line bg-mist p-8 md:p-10">
            <p className="text-lg leading-relaxed text-ink/75">
              Sumago&apos;s full Terms &amp; Conditions are being finalised with our
              legal team and will be published here.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink/75">
              In the meantime, for any question about how we work, our agreements, or
              an existing engagement, please reach out — we&apos;ll respond directly.
            </p>
            <div className="mt-8">
              <Button href="/contact">Get in touch</Button>
            </div>
          </div>
          <p className="mt-6 text-sm text-ink/50">
            {settings.name} · Nashik · Pune
          </p>
        </div>
      </Section>
    </>
  );
}
