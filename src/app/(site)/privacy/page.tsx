import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { Button } from "@/components/atoms/button";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Sumago Infotech handles the information you share through this website.",
};

/**
 * Privacy Policy.
 * [REAL CONTENT NEEDED] Privacy copy must be supplied/approved by the client's legal
 * team — never invent data-handling claims (CLAUDE.md). This page exists so the
 * footer link resolves instead of 404ing; replace the placeholder before launch.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={
          <>
            Privacy <span className="text-metal-red">Policy</span>.
          </>
        }
        description="How Sumago handles the information you share through this website."
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-line bg-mist p-8 md:p-10">
            <p className="text-lg leading-relaxed text-ink/75">
              Sumago&apos;s full Privacy Policy is being finalised with our legal team
              and will be published here.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink/75">
              If you have a question about the information you&apos;ve shared with us, or
              would like it removed, please get in touch and we&apos;ll respond directly.
            </p>
            <div className="mt-8">
              <Button href="/contact">Get in touch</Button>
            </div>
          </div>
          <p className="mt-6 text-sm text-ink/50">
            {company.name} · {company.emails[0]}
          </p>
        </div>
      </Section>
    </>
  );
}
