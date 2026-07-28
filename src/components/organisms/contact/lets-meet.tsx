import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { visitableOffices } from "@/lib/site";

/**
 * "Let's meet" — the first step of the relationship, placed directly under the
 * hero. Frames the first conversation as a meeting rather than a pitch, then
 * hands over every way to actually reach a Sumago desk: address, hours, phone,
 * email, and a map link per walk-in office (see `visitableOffices` in lib/site).
 */
export function LetsMeet() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Let's meet"
        title={
          <>
            Every partnership starts with a{" "}
            <span className="text-metal-red">conversation</span>.
          </>
        }
        description="No forms to survive, no pitch to sit through — just an honest conversation about where your business is headed and whether Sumago is the right team to get you there. The door is open at three offices across Nashik and Pune."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visitableOffices.map((office, i) => (
          <article
            key={office.city}
            data-aos="fade-up"
            data-aos-delay={(i % 3) * 90}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-paper p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_18px_40px_-24px_rgba(215,52,56,0.45)]"
          >
            {/* Accent rail — draws in on hover, a quiet nod to the brand red. */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100"
            />

            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-ink">
              <MapPin size={14} strokeWidth={2.5} aria-hidden />
              Visit our office
            </p>

            <h3 className="mt-4 font-display text-lg font-semibold text-ink">
              {office.city}
            </h3>

            <p className="mt-2 flex items-center gap-2 text-sm text-ink/55">
              <Clock size={14} className="shrink-0" aria-hidden />
              {office.hours}
            </p>

            <address className="mt-5 not-italic text-sm leading-relaxed text-ink/70">
              {office.address}
            </address>

            <div className="mt-auto grid gap-2.5 pt-6 text-sm">
              <a
                href={`mailto:${office.email}`}
                className="flex items-center gap-2.5 text-ink/70 transition-colors hover:text-brand-ink"
              >
                <Mail size={14} className="shrink-0 text-ink/35" aria-hidden />
                {office.email}
              </a>
              <a
                href={`tel:${office.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2.5 text-ink/70 transition-colors hover:text-brand-ink"
              >
                <Phone size={14} className="shrink-0 text-ink/35" aria-hidden />
                {office.phone}
              </a>
            </div>

            <div className="mt-6 border-t border-line pt-6">
              <a
                href={office.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink underline-offset-4 hover:underline"
              >
                View on map
                <ArrowUpRight
                  size={15}
                  strokeWidth={2.5}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
                <span className="sr-only"> — {office.city} (opens in a new tab)</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
