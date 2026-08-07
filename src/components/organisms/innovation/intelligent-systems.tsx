import { MessageSquare } from "lucide-react";

import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { resolveIcon } from "@/lib/icon-registry";
import { getInnovationItems, getInnovationOutcomes } from "@/lib/cms";

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
export async function IntelligentSystems() {
  const [items, outcomes] = await Promise.all([
    getInnovationItems(),
    getInnovationOutcomes(),
  ]);

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
        {items.map((item, i) => {
          const Icon = resolveIcon(item.icon, MessageSquare);
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

              {item.highlights.length > 0 && (
                <ul className="mt-4 space-y-1.5 text-sm text-ink/60">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}

              {item.linkUrl && (
                <a
                  href={item.linkUrl}
                  className="mt-5 inline-flex text-sm font-semibold text-brand-ink underline-offset-4 hover:underline"
                >
                  {item.linkLabel ?? "Learn more"}
                  <span className="sr-only"> about {item.title}</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>

      {/* The strip only earns its space when there is something in it — an
          empty dark band reads as a rendering fault. */}
      {outcomes.length > 0 && (
        <div
          data-aos="fade-up"
          className="mt-6 overflow-hidden rounded-2xl bg-white/10 sm:mt-8"
        >
          <dl className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {outcomes.map((outcome) => (
              <div key={outcome.id || outcome.title} className="bg-ink p-6 sm:p-7">
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
      )}
    </Section>
  );
}
