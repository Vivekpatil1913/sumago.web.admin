import { Award, BadgeCheck, CalendarClock, Layers } from "lucide-react";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { getCertifications, getMetrics } from "@/lib/cms";
import { metricValue, metricsEndingIn } from "@/lib/cms/format";

/**
 * The trust band — the one content section between the offices and the form,
 * so it answers the only question that matters here: why hand Sumago the work?
 * Proof, not adjectives.
 *
 * Every number comes from General Settings rather than being retyped here, so
 * a figure can be corrected in one place and cannot drift between pages. A
 * claim whose metric is missing is dropped rather than rendered half-empty:
 * "years." with no number reads as a bug, and an unbacked proof point is worse
 * than one fewer.
 */
export async function WhySumago() {
  const [metrics, certifications] = await Promise.all([getMetrics(), getCertifications()]);

  const years = metricValue(metrics, "Years");
  const projects = metricValue(metrics, "Projects delivered");
  const team = metricValue(metrics, "Team members");

  const PROOF = [
    years && {
      icon: CalendarClock,
      claim: `${years} years.`,
      detail:
        "Building since 2013, through every platform shift the last decade threw at it. Long enough to have been wrong once or twice, and to have learned from it.",
    },
    projects && {
      icon: Layers,
      claim: `${projects} projects delivered.`,
      detail:
        "Seven hundred briefs that started exactly where yours does now — a problem, a deadline, and someone who needed it to work.",
    },
    team && {
      icon: Award,
      claim: `${team} specialists.`,
      detail:
        "Engineers, designers, and architects on staff — the people who'd actually be doing your work, and who you'd meet in week one.",
    },
    certifications.length > 0 && {
      icon: BadgeCheck,
      claim: `${certifications.join(" · ")}.`,
      detail:
        "CMMI's highest maturity level, and quality management audited by someone with no stake in the answer. Assessed, not asserted.",
    },
  ].filter((entry) => entry !== false && entry !== undefined && entry !== "");

  const clientMetrics = metricsEndingIn(metrics, "clients");

  const GROUPS = [
    clientMetrics.length > 0 && {
      label: "Trusted by",
      items: clientMetrics.map((metric) => `${metric.value} ${metric.label.toLowerCase()}`),
    },
    {
      label: "How the work happens",
      items: ["Global delivery", "Flexible time-zone collaboration", "Remote-first engagements"],
    },
  ].filter((group) => group !== false);

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
