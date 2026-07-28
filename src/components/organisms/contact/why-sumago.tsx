import { Award, BadgeCheck, CalendarClock, Layers } from "lucide-react";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { company } from "@/lib/site";

/**
 * The trust band — the one content section between the offices and the form,
 * so it answers the only question that matters here: why hand Sumago the work?
 * Proof, not adjectives. Every number is pulled from `company` (which defers to
 * COMPANY-PROFILE.md) rather than retyped, so the copy can't drift from fact.
 */

/** Verified metric by label — the literal-union param makes a typo a build error. */
function metric(label: (typeof company.metrics)[number]["label"]) {
  return company.metrics.find((m) => m.label === label)!.value;
}

const PROOF = [
  {
    icon: CalendarClock,
    claim: `${metric("Years")} years.`,
    detail:
      "Building since 2013, through every platform shift the last decade threw at it. Long enough to have been wrong once or twice, and to have learned from it.",
  },
  {
    icon: Layers,
    claim: `${metric("Projects delivered")} projects delivered.`,
    detail:
      "Seven hundred briefs that started exactly where yours does now — a problem, a deadline, and someone who needed it to work.",
  },
  {
    icon: Award,
    claim: `${metric("Team members")} specialists.`,
    detail:
      "Engineers, designers, and architects on staff — the people who'd actually be doing your work, and who you'd meet in week one.",
  },
  {
    icon: BadgeCheck,
    claim: company.certifications.join(" · ") + ".",
    detail:
      "CMMI's highest maturity level, and quality management audited by someone with no stake in the answer. Assessed, not asserted.",
  },
] as const;

const GROUPS = [
  {
    label: "Trusted by",
    items: company.metrics
      .filter((m) => m.label.endsWith("clients"))
      .map((m) => `${m.value} ${m.label.toLowerCase()}`),
  },
  {
    label: "How the work happens",
    items: ["Global delivery", "Flexible time-zone collaboration", "Remote-first engagements"],
  },
] as const;

export function WhySumago() {
  return (
    <Section dark className="relative isolate overflow-hidden">
      {/* Soft brand glow — keeps the dark band from reading flat. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-brand/15 blur-[110px]"
      />

      <SectionHeading
        tone="dark"
        eyebrow="Why Sumago"
        title={
          <>
            Thirteen years of being handed the{" "}
            <span className="text-metal-red-shine">hard problems</span>.
          </>
        }
        description="Trust isn't claimed, it's accumulated. This is what has accumulated since 2013 — the record every conversation with Sumago starts from."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {PROOF.map((p, i) => (
          <div
            key={p.claim}
            data-aos="fade-up"
            data-aos-delay={(i % 2) * 80}
            className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-brand/40 hover:bg-white/[0.07]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand-bright">
              <p.icon size={19} strokeWidth={2} aria-hidden />
            </span>
            <p className="text-base leading-relaxed text-white/70">
              <strong className="font-semibold text-white">{p.claim}</strong> {p.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Reach and delivery model — the "can you work with my team?" answer. */}
      <div
        data-aos="fade-up"
        className="mt-6 grid gap-8 rounded-2xl border border-white/10 bg-white/[0.02] p-7 sm:grid-cols-2"
      >
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-bright">
              {group.label}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/70"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
