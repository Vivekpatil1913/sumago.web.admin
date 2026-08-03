import {
  BarChart3,
  MessageSquare,
  Mic,
  Repeat,
  type LucideIcon,
} from "lucide-react";

import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { intelligentOutcomes, intelligentSystems } from "@/lib/content";

const ICONS: Record<string, LucideIcon> = { MessageSquare, Mic, Repeat, BarChart3 };

/**
 * Applied intelligence — four capabilities, then a dark strip stating what they
 * change in practice. Capability alone doesn't build trust; the strip is what
 * turns "we can do AI" into "here is what it does to your week".
 *
 * Lives on /innovation rather than the home page: `AiSdlc` there already speaks
 * about AI, but as engineering method (the toolchain Sumago builds *with*).
 * This is the offering — AI built *for* the client. Two different claims.
 *
 * The strip's hairlines come from `gap-px` over a tinted grid background rather
 * than per-cell borders, so the dividers land correctly at 1, 2 and 4 columns
 * without any first-child/row-start special casing.
 */
export function IntelligentSystems() {
  return (
    <Section>
      <SectionHeading
        align="left"
        wide
        eyebrow="Intelligent systems"
        title="AI, Automation & Data Intelligence"
        description="Intelligence embedded directly into operations — automating routine work and turning data into decisions."
      />

      <ul className="mt-11 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-14 lg:grid-cols-4">
        {intelligentSystems.map((item, i) => {
          const Icon = ICONS[item.icon] ?? MessageSquare;
          return (
            <li
              key={item.title}
              data-aos="fade-up"
              data-aos-delay={(i % 4) * 60}
              className="flex h-full flex-col rounded-2xl bg-mist p-6 lg:p-7"
            >
              <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-sm shadow-brand/30 sm:h-14 sm:w-14">
                <Icon size={24} strokeWidth={2} aria-hidden />
              </span>
              <h3 className="mt-6 font-display text-lg font-bold leading-snug text-ink">
                {item.title}
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink/65">
                {item.description}
              </p>
            </li>
          );
        })}
      </ul>

      <div
        data-aos="fade-up"
        className="mt-6 overflow-hidden rounded-2xl bg-white/10 sm:mt-8"
      >
        <dl className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {intelligentOutcomes.map((outcome) => (
            <div key={outcome.title} className="bg-ink p-6 sm:p-7">
              <dt className="font-display text-base font-bold leading-snug text-white sm:text-lg">
                {outcome.title}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-white/55">
                {outcome.note}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
