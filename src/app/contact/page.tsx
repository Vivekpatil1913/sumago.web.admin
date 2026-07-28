import type { Metadata } from "next";
import { CalendarDays, Phone } from "lucide-react";
import { PageHero } from "@/components/organisms/page-hero";
import { buttonVariants } from "@/components/atoms/button";
import { LetsMeet } from "@/components/organisms/contact/lets-meet";
import { WhySumago } from "@/components/organisms/contact/why-sumago";
import { ScheduleMeeting } from "@/components/organisms/contact/schedule-meeting";
import { company } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Let's Connect",
  description:
    "Start a conversation with Sumago — talk to an expert or schedule a meeting. Offices across Nashik and Pune.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        variant="rings"
        formation="pulse"
        eyebrow="Let's Connect"
        title={<>Let&apos;s build something with <span className="text-metal-red">Sumago</span>.</>}
        description="Tell Sumago where your business wants to go — every engagement starts with understanding your goals and challenges, never a sales pitch. Reach us any time."
      >
        {/* Two ways in: call now, or let the team call you. */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={`tel:${company.expertLine.replace(/\s/g, "")}`}
            className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
          >
            <Phone size={17} strokeWidth={2.5} aria-hidden />
            Talk with an expert
          </a>
          <a
            href="#schedule"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full border-white/25 text-white backdrop-blur-sm hover:bg-white/10 sm:w-auto",
            )}
          >
            <CalendarDays size={17} strokeWidth={2.5} aria-hidden />
            Schedule a meeting
          </a>
        </div>
      </PageHero>

      {/* First handshake — frames the conversation, then every way to reach a desk. */}
      <LetsMeet />

      {/* The trust band — proof, not adjectives. */}
      <WhySumago />

      {/* Primary conversion — the four-step intake the hero CTA jumps to. */}
      <ScheduleMeeting />
    </>
  );
}
