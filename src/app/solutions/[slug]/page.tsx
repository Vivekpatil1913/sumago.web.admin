import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, FlaskConical } from "lucide-react";
import { Section } from "@/components/atoms/section";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Button } from "@/components/atoms/button";
import { CapabilityCard } from "@/components/molecules/capability-card";
import { HeroEffect } from "@/components/organisms/hero-effect";
import { ServiceDetail } from "@/components/organisms/solutions/service-detail";
import { ServiceDetailVisual } from "@/components/organisms/solutions/service-detail-visual";
import { Reveal } from "@/components/motion/reveal";
import { capabilities, impactStories } from "@/lib/site";
import { services } from "@/lib/services";
import { capabilityDetails, capabilityMeta, differentiators } from "@/lib/content";
import { CAPABILITY_ICONS, FALLBACK_CAPABILITY_ICON } from "@/lib/capability-icons";
import { slugify } from "@/lib/utils";

export function generateStaticParams() {
  return capabilities.map((c) => ({ slug: slugify(c) }));
}

/**
 * Services already moved off the legacy layout, and which redesign each uses.
 *
 * Two candidate directions are live side by side so they can be compared on real
 * content before one is frozen and rolled out to all 15:
 *   `editorial` — type-led, no photography (components/…/service-detail.tsx)
 *   `visual`    — image-led, photography as structure (…/service-detail-visual.tsx)
 *
 * To move a service across: populate its `whoFor` copy in lib/services.ts (and,
 * for `visual`, its `serviceImages` entry in lib/preview-assets.ts), then add its
 * slug here. Once a direction is chosen, delete the other along with the legacy
 * layout below and this map.
 */
const REDESIGNED: Record<string, "editorial" | "visual"> = {
  "web-platform-engineering": "editorial",
  "mobile-app-engineering": "visual",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = capabilities.find((c) => slugify(c) === slug);
  const detail = capabilityDetails[slug];
  return { title: name ?? "Solution", description: detail?.summary };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = capabilities.find((c) => slugify(c) === slug);
  if (!name) notFound();

  const detail = capabilityDetails[slug];
  const meta = capabilityMeta[slug];
  const service = services.find((s) => s.slug === slug);
  const Icon = CAPABILITY_ICONS[meta?.icon ?? ""] ?? FALLBACK_CAPABILITY_ICON;

  /* Real stories that genuinely involved this service — only 3 of 15 have any.
     Where none exist, a flagged gap renders outside production (docs/17). */
  const relatedStories = (service?.stories ?? [])
    .map((s) => impactStories.find((st) => st.slug === s))
    .filter((s): s is (typeof impactStories)[number] => Boolean(s));
  const isProd = process.env.NODE_ENV === "production";

  // Three sibling capabilities to keep the journey moving.
  const related = capabilities.filter((c) => c !== name).slice(0, 3);
  // A short, rotating trust triplet for the aside.
  const trust = differentiators.slice(0, 3);

  /* The redesigned layouts — live for the reference builds only (see
     REDESIGNED). Everything below is the legacy layout. */
  const redesign = service ? REDESIGNED[slug] : undefined;
  if (service && redesign) {
    /* Prefer siblings from the same lifecycle phase — the services a visitor is
       most likely weighing at the same time — then top up from the rest. */
    const relatedServices = services
      .filter((s) => s.slug !== slug && s.phase === service.phase)
      .concat(services.filter((s) => s.slug !== slug && s.phase !== service.phase))
      .slice(0, 3);

    const Layout = redesign === "visual" ? ServiceDetailVisual : ServiceDetail;

    return (
      <Layout
        service={service}
        related={relatedServices}
        stories={relatedStories}
        isProd={isProd}
      />
    );
  }

  return (
    <>
      {/* Hero — dark cinematic with flowing circuit backdrop. */}
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0a0708] text-white">
        <HeroEffect variant="circuit" />
        <div className="container-page relative z-10 flex min-h-[100svh] flex-col justify-center py-24 pt-[clamp(6rem,12vh,9rem)]">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} />
            All solutions
          </Link>
          <div className="mt-8 flex items-start gap-5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-[#7a1519] text-white shadow-lg shadow-brand/30 md:h-16 md:w-16">
              <Icon size={28} />
            </span>
            <div>
              <span className="chip border-white/15 bg-white/[0.07] text-white/90 backdrop-blur">
                What we solve
              </span>
              <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl lg:text-5xl xl:text-6xl">
                {name}
              </h1>
            </div>
          </div>
          {detail?.summary ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              {detail.summary}
            </p>
          ) : null}
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Main column */}
          <div className="space-y-12">
            {/* Lead with the visitor's problem, not our capability (docs/08). */}
            {service?.problem ? (
              <Reveal>
                <Eyebrow>The problem</Eyebrow>
                <p className="border-l-2 border-brand/60 pl-5 text-xl leading-relaxed text-ink/85 sm:text-2xl">
                  {service.problem}
                </p>
              </Reveal>
            ) : null}

            <Reveal>
              <h2 className="text-2xl">How Sumago approaches it</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink/75">
                {detail?.approach ??
                  "Sumago starts from the business outcome, then works back to the right architecture, technology, and delivery plan — building in measurable milestones from day one."}
              </p>
            </Reveal>

            {service?.deliverables?.length ? (
              <Reveal>
                <h2 className="text-2xl">What you get</h2>
                <p className="mt-2 text-ink/60">
                  The tangible artifacts an engagement leaves behind.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {service.deliverables.map((d) => (
                    <div
                      key={d}
                      className="flex items-start gap-3 rounded-xl border border-line bg-paper p-5"
                    >
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                        <Check size={14} strokeWidth={3} />
                      </span>
                      <span className="font-medium text-ink/80">{d}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            ) : null}

            {detail?.outcomes?.length ? (
              <Reveal>
                <h2 className="text-2xl">What changes for the business</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {detail.outcomes.map((o) => (
                    <div
                      key={o}
                      className="flex items-start gap-3 rounded-xl border border-line bg-paper p-5"
                    >
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                        <Check size={14} strokeWidth={3} />
                      </span>
                      <span className="font-medium text-ink/80">{o}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            ) : null}

            {/* Real work behind this service — only where it genuinely exists. */}
            {relatedStories.length ? (
              <Reveal>
                <h2 className="text-2xl">Real work behind it</h2>
                <div className="mt-6 space-y-4">
                  {relatedStories.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/impact/${s.slug}`}
                      className="group flex items-start gap-4 rounded-xl border border-brand/20 bg-brand/[0.04] p-5 transition-colors hover:border-brand/40 hover:bg-brand/[0.07]"
                    >
                      <FlaskConical size={18} className="mt-0.5 shrink-0 text-brand" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-ink">{s.title}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-ink/65">
                          {s.summary}
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        className="mt-0.5 shrink-0 text-brand transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  ))}
                </div>
              </Reveal>
            ) : !isProd ? (
              <Reveal>
                <div
                  data-placeholder="proof"
                  className="rounded-xl border border-dashed border-amber-400/60 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900"
                >
                  <span className="font-bold">[REAL PROOF NEEDED]</span> — no
                  verified case study, metric, or attributed quote exists for{" "}
                  {name}. Needed from the client: one numbered outcome + one quote
                  with consent. Hidden in production; see docs/PROOF-GAPS.md.
                </div>
              </Reveal>
            ) : null}
          </div>

          {/* Sticky aside */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-mist p-6">
              {detail?.technologies?.length ? (
                <>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/60">
                    Technologies
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {detail.technologies.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-line bg-paper px-3 py-1.5 text-sm text-ink/75"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="my-6 h-px bg-line" />
                </>
              ) : null}

              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/60">
                Why teams choose Sumago
              </h3>
              <ul className="mt-4 space-y-3">
                {trust.map((d) => (
                  <li key={d.title} className="flex items-start gap-2.5 text-sm">
                    <Check size={16} className="mt-0.5 shrink-0 text-brand" strokeWidth={2.5} />
                    <span className="text-ink/70">
                      <span className="font-semibold text-ink">{d.title}.</span>{" "}
                      {d.description}
                    </span>
                  </li>
                ))}
              </ul>

              <Button href="/contact" className="mt-6 w-full">
                Get in touch
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      {/* Explore other capabilities */}
      <Section muted>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Keep exploring</Eyebrow>
            <h2 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">Related capabilities</h2>
          </div>
          <Button href="/solutions" variant="link">
            All solutions →
          </Button>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((c, i) => (
            <Reveal key={c} delay={(i % 3) * 0.06}>
              <CapabilityCard name={c} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* No CTA band here — the site footer already closes every page with the
          same "Let's build what your business needs next" call to action. */}
    </>
  );
}
