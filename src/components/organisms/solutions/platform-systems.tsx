import { Cloud, LayoutGrid, Link2, type LucideIcon } from "lucide-react";

import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { platformGroups } from "@/lib/content";

const ICONS: Record<string, LucideIcon> = { Cloud, LayoutGrid, Link2 };

/**
 * The systems layer — deliberately a ruled spec sheet, not another icon-card
 * grid.
 *
 * Three sections already run the card idiom (home `WhatWeDo`, about
 * `VisionMission`, innovation `IntelligentSystems`); a fourth would make the
 * site read as templated, and it would land on the one page whose language is
 * pointedly editorial rather than boxy. This borrows the `WhyPartner` ledger
 * below it instead — hairlines, no containers — so it reads as engineering
 * specification, which is the register that earns a CTO's trust. Uneven column
 * lengths look natural in a ruled layout where boxed cards would look broken.
 *
 * Hairlines come from `gap-px` over a tinted grid rather than per-cell borders,
 * so rules land correctly at 1 and 3 columns with no first-child casing. The
 * top border separates it from the final service chapter, which is also white
 * (`TONES` in service-chapters.tsx ends "light") — `muted` isn't available
 * because `WhyPartner` directly below already uses it.
 */
export function PlatformSystems() {
  return (
    <Section className="border-t border-line">
      <SectionHeading
        align="left"
        wide
        eyebrow="Scale & systems"
        title="Cloud, Platforms & Integration"
        description="The infrastructure and business systems that make digital services reliable, connected and ready to scale."
      />

      <div className="mt-11 grid grid-cols-1 gap-px bg-line md:grid-cols-3 lg:mt-14">
        {platformGroups.map((group, i) => {
          const Icon = ICONS[group.icon] ?? Cloud;
          return (
            <section
              key={group.title}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 60}
              className="bg-paper p-6 md:p-5 lg:p-8"
            >
              <h3 className="flex items-center gap-3 font-display text-lg font-bold leading-snug text-ink">
                <Icon size={18} strokeWidth={2.25} className="shrink-0 text-brand" aria-hidden />
                {group.title}
              </h3>

              <ul className="mt-5 border-t border-line">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-line py-3 text-[0.9375rem] leading-relaxed text-ink/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </Section>
  );
}
