import type { Metadata } from "next";
import { CalendarDays, Phone } from "lucide-react";
import { PageHero } from "@/components/organisms/page-hero";
import { buttonVariants } from "@/components/atoms/button";
import { LetsMeet } from "@/components/organisms/contact/lets-meet";
import { WhySumago } from "@/components/organisms/contact/why-sumago";
import { EngagementPath } from "@/components/organisms/contact/engagement-path";
import { ScheduleMeeting } from "@/components/organisms/contact/schedule-meeting";
import {
  getExpertLine,
  getOffices,
  getSettings,
  withSeoOverrides,
} from "@/lib/cms";
import { localBusinessSchema } from "@/lib/cms/schema-org";
import { JsonLd } from "@/components/atoms/json-ld";
import { cn } from "@/lib/utils";

/**
 * Metadata for /contact, with the panel's SEO record layered on top.
 *
 * The base below is what the page ships with; anything published for this
 * path in SEO Metadata overrides it field by field. No record means the
 * base stands unchanged — never an empty title.
 */
export async function generateMetadata(): Promise<Metadata> {
  return withSeoOverrides("/contact", {
    title: "Let's Connect",
    description:
      "Start a conversation with Sumago — talk to an expert or schedule a meeting. Offices across Nashik and Pune.",
  });
}

export default async function ContactPage() {
  const [expertLine, settings, offices] = await Promise.all([
    getExpertLine(),
    getSettings(),
    getOffices(),
  ]);

  return (
    <>
      {/* One LocalBusiness block per office — what a "IT company near me"
          search matches against, and the reason the address is stored in
          parts rather than as one string. */}
      {offices.map((office) => (
        <JsonLd
          key={office.id || office.slug}
          data={localBusinessSchema(office, settings)}
        />
      ))}

      <PageHero
        variant="rings"
        formation="pulse"
        eyebrow="Let's Connect"
        title={
          <>
            Let&apos;s build something with{" "}
            <span className="text-metal-red-shine">Sumago</span>.
          </>
        }
        description="Tell Sumago where your business wants to go — every engagement starts with understanding your goals and challenges, never a sales pitch. Reach us any time."
      >
        {/* Two ways in: call now, or let the team call you. The call button is
            dropped entirely if no number is published — a dead tel: link is
            worse than one fewer button. */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          {expertLine && (
            <a
              href={`tel:${expertLine.replace(/\s/g, "")}`}
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
            >
              <Phone size={17} strokeWidth={2.5} aria-hidden />
              Talk with an expert
            </a>
          )}
          <a
            href="#schedule"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full border-white/25 text-white backdrop-blur-sm hover:bg-white/10 sm:w-auto",
            )}
          >
            <CalendarDays size={17} strokeWidth={2.5} aria-hidden />
            Schedule a free consultation
          </a>
        </div>
      </PageHero>

      {/* First handshake — frames the conversation, then every way to reach a desk. */}
      <LetsMeet />

      {/* The trust band — proof, not adjectives. */}
      <WhySumago />

      {/* The runway into the form — what actually happens after it is sent.
          Light on purpose: it breaks the two dark bands either side of it, and
          keeps the reader's contrast budget for the form itself. */}
      <EngagementPath expertLine={expertLine} />

      {/* Primary conversion — the four-step intake the hero CTA jumps to. */}
      <ScheduleMeeting />
    </>
  );
}
