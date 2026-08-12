import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CAPABILITY_ICONS, FALLBACK_CAPABILITY_ICON } from "@/lib/capability-icons";
import { ToolStrip } from "@/components/molecules/tool-strip";
import { getServicesByPhase, type ServiceRecord } from "@/lib/cms";
import { cn } from "@/lib/utils";

/**
 * Service stages — the full catalog as five editorial stages (one per lifecycle
 * phase), each a full-bleed band with a sticky header and its services set open
 * on the page.
 *
 * Deliberately card-free: the type carries the block, matching the team page's
 * editorial language (tilted brand-gradient plates, oversized ghost glyphs,
 * ambient glows). An earlier split-view read as an admin console — a sidebar
 * driving a bordered panel — which is exactly what a services page shouldn't be.
 *
 * Bands alternate light → mist so a long scroll keeps a pulse without a hard
 * tonal break.
 *
 * Server component: every effect here is CSS, so this ships zero JS — which is
 * what keeps the Lighthouse ≥95 gate (CLAUDE.md) intact on the site's longest page.
 */

type Tone = "light" | "mist";

/* -------------------------------------------------------------------------- */
/*  Service                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * One service, open on the page. The problem is set as a pull-quote — it's the
 * visitor's own voice, so it carries the block the way the leadership quotes do
 * on the team page.
 */
function ServiceBlock({ service, index }: { service: ServiceRecord; index: number }) {
  const Icon = CAPABILITY_ICONS[service.icon] ?? FALLBACK_CAPABILITY_ICON;

  return (
    // `data-aos` must NOT sit on the anchor target: AOS translates the element
    // before reveal, so the browser would resolve the jump against the shifted
    // position and the block would land under the sticky nav once AOS clears the
    // transform. Keeping the article untransformed keeps `scroll-mt-28` honest.
    <article
      id={service.slug}
      className="group relative scroll-mt-28 border-t border-line py-12 first:border-t-0 first:pt-0 md:py-14"
    >
      {/* Ghost watermark of the service icon — depth without a container. */}
      <Icon
        aria-hidden
        strokeWidth={0.5}
        className="pointer-events-none absolute -top-4 right-2 z-0 hidden h-56 w-56 text-brand/[0.07] transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-105 lg:block"
      />

      <div data-aos="fade-up" className="relative z-10">
        {/* Identity line — icon on a tilted brand plate, echoing the team portraits. */}
        <div className="flex items-center gap-4">
          <span className="relative inline-grid h-12 w-12 shrink-0 place-items-center">
            <span
              aria-hidden
              className="absolute inset-0 -rotate-3 rounded-xl bg-[linear-gradient(135deg,#d73438,#7a1519)] transition-transform duration-500 group-hover:rotate-3"
            />
            <Icon size={22} className="relative text-white" aria-hidden />
          </span>
          <div className="min-w-0">
            <span className="font-display text-xs font-bold tracking-[0.2em] text-ink/65">
              {String(index).padStart(2, "0")}
            </span>
            {/* h4: nested under the stage's h3, which sits under the section h2. */}
            <h4 className="text-2xl font-bold leading-tight tracking-tight text-ink md:text-[1.75rem]">
              {service.name}
            </h4>
          </div>
        </div>

        {/* The hook — the visitor's problem, as a pull-quote. */}
        <div className="relative mt-7 pl-1">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-2 -top-11 select-none font-display text-[6rem] leading-none text-brand/[0.09]"
          >
            &ldquo;
          </span>
          <p className="relative text-lg leading-[1.55] tracking-tight text-ink md:text-[1.35rem]">
            {service.problem}
          </p>
        </div>

        {/* Red gradient rule → the answer. */}
        <div className="mt-7 h-px w-20 bg-gradient-to-r from-brand to-transparent" />

        <p className="mt-5 max-w-2xl leading-relaxed text-ink/70">{service.approach}</p>

        {/* Stack, set quietly as running text — chips read as UI, not editorial.
            Deliverables deliberately live on the detail page: this page hooks
            with the problem, that page answers it. */}
        <p className="mt-6 text-xs font-medium uppercase tracking-[0.1em] text-ink/65">
          {service.technologies.join("  ·  ")}
        </p>

        <ToolStrip
          tools={service.tools}
          label={`Tools used for ${service.name}`}
          className="mt-7"
        />

        <Link
          href={`/solutions/${service.slug}`}
          className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-ink transition-colors hover:text-brand"
        >
          Explore {service.name}
          <ArrowRight
            size={15}
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stage                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * One lifecycle stage, as its own full-bleed band. The header sticks while its
 * services scroll past — and lists them, so the stage doubles as a contents
 * page you can jump from.
 */
function PhaseStage({
  phase,
  stage,
  startIndex,
  tone,
}: {
  phase: Awaited<ReturnType<typeof getServicesByPhase>>[number];
  stage: number;
  startIndex: number;
  tone: Tone;
}) {
  return (
    <section className={cn("relative py-16 md:py-24", tone === "mist" && "bg-mist")}>
      {/* Ambient brand glow so a band never reads as a flat document. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_35%_at_85%_0%,rgba(215,52,56,0.05),transparent_70%)]"
      />

      <div className="container-page">
        <div className="lg:grid lg:grid-cols-[minmax(0,17rem)_1fr] lg:items-start lg:gap-16">
          {/* Sticky stage panel — dark, so the stage reads as a fixed marker
              against the light service column on either band tone. */}
          <header className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-blueprint p-7 text-white shadow-[0_28px_60px_-30px_rgba(0,0,0,0.65)]">
              {/* Ambient brand glow inside the panel. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_55%_at_50%_0%,rgba(215,52,56,0.28),transparent_70%)]"
              />
              {/* Oversized ghost numeral, clipped by the panel's rounded edge. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-3 -top-7 select-none font-display text-[7rem] font-bold leading-none text-white/[0.06]"
              >
                {String(stage).padStart(2, "0")}
              </span>

              {/* Content scrolls inside the panel rather than the panel growing
                  past the fold — the tallest stage (7 services) needs ~600px, so
                  on a short viewport the contents list would otherwise be stuck
                  out of reach. The ghost numeral stays on the outer clip so its
                  bleed doesn't create a phantom scroll area. */}
              <div className="no-scrollbar relative lg:max-h-[calc(100svh-13rem)] lg:overflow-y-auto">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                  Stage {String(stage).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                  <span className="text-metal-red-shine">{phase.label}</span>
                </h3>

                <div className="mt-5 h-px w-16 bg-gradient-to-r from-brand to-transparent" />

                <p className="mt-5 text-base leading-relaxed text-white/60">
                  {phase.blurb}
                </p>

                {/* Contents — the stage's services, jumpable. */}
                <ul className="mt-6 space-y-2 border-t border-white/10 pt-5">
                  {phase.services.map((s, i) => (
                    <li key={s.slug}>
                      <a
                        href={`#${s.slug}`}
                        className="group/link flex items-baseline gap-2.5 text-sm text-white/60 transition-colors hover:text-white"
                      >
                        <span className="font-display text-[0.65rem] font-bold tabular-nums text-white/70 transition-colors group-hover/link:text-brand-bright">
                          {String(startIndex + i).padStart(2, "0")}
                        </span>
                        <span className="leading-snug">{s.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </header>

          {/* The stage's services */}
          <div className="mt-10 lg:mt-0">
            {phase.services.map((s, i) => (
              <ServiceBlock key={s.slug} service={s} index={startIndex + i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Band rhythm. Cycles rather than listing one tone per phase, so a phase with
 * nothing published in it — dropped by `getServicesByPhase` — cannot knock the
 * light/mist alternation out of step.
 */
const TONES: Tone[] = ["light", "mist"];

/**
 * The full catalog, as one editorial stage per lifecycle phase.
 *
 * Reads the published services rather than the committed catalog, so adding a
 * service, reordering the list or moving one to draft in the admin panel
 * changes this page. The stage numbering runs continuously across phases
 * (01…n), so the running offset is computed once here rather than mutated
 * during render.
 *
 * Still a server component shipping zero client JS — every effect on the page
 * is CSS — which is what keeps the Lighthouse budget intact on the site's
 * longest page (CLAUDE.md).
 */
export async function ServiceChapters() {
  const phases = await getServicesByPhase();

  const stages = phases.map((phase, i) => ({
    phase,
    stage: i + 1,
    tone: TONES[i % TONES.length] ?? "light",
    startIndex: phases.slice(0, i).reduce((n, p) => n + p.services.length, 0) + 1,
  }));

  return (
    <div id="service-chapters">
      {stages.map(({ phase, stage, tone, startIndex }) => (
        <PhaseStage
          key={phase.key}
          phase={phase}
          stage={stage}
          startIndex={startIndex}
          tone={tone}
        />
      ))}
    </div>
  );
}
