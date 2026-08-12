import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, MapPin, Briefcase, Clock } from "lucide-react";
import { Section } from "@/components/atoms/section";
import { Reveal } from "@/components/motion/reveal";
import { ApplyPanel } from "@/components/organisms/apply-panel";
import { canonicalFor, getJob, getJobs, getOffices, getSettings } from "@/lib/cms";
import { breadcrumbSchema, jobPostingSchema } from "@/lib/cms/schema-org";
import { JsonLd } from "@/components/atoms/json-ld";

export async function generateStaticParams() {
  return (await getJobs()).map((job) => ({ slug: job.slug }));
}

/*
 * A closed role stops being a page. `getJob` only returns published, active
 * jobs, so once HR closes one the URL 404s rather than collecting applications
 * nobody will read.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const position = await getJob(slug);
  return {
    title: position ? `${position.title} — Careers` : "Careers",
    description: position?.summary,
    // Derived from the route: Jobs carry no SEO group, and a role reached with
    // a tracking parameter should not index as a second vacancy.
    alternates: canonicalFor(`/careers/${slug}`),
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const position = await getJob(slug);
  if (!position) notFound();

  const {
    title,
    department,
    location,
    type,
    experience,
    summary,
    overview,
    responsibilities,
    requirements,
  } = position;

  const facts = [
    { icon: MapPin, label: "Location", value: location },
    { icon: Briefcase, label: "Employment", value: type },
    { icon: Clock, label: "Experience", value: experience },
  ];

  // A few other roles to keep the journey moving.
  const [related, settings, offices] = await Promise.all([
    getJobs().then((jobs) => jobs.filter((job) => job.slug !== slug).slice(0, 3)),
    getSettings(),
    getOffices(),
  ]);

  return (
    <>
      {/* JobPosting markup is what lists this role in Google Jobs. It carries
          `validThrough` from the closing date where HR set one, so a filled
          role stops being advertised instead of collecting applications. */}
      <JsonLd data={jobPostingSchema(position, { settings, offices })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Careers", path: "/careers" },
          { name: title, path: `/careers/${slug}` },
        ])}
      />

      {/* Hero — compact dark band (matches the site's article/hero language). */}
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0a0708] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_35%,rgba(255,255,255,0.05),transparent_70%)]" />
          <div className="fx-hero-aurora absolute inset-0" />
          <div className="fx-dots absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0708] to-transparent" />
        </div>
        <div className="container-page pb-16 pt-[clamp(6.5rem,15vh,9.5rem)]">
          <Link
            href="/careers"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} />
            All open roles
          </Link>
          <div className="mt-8 max-w-3xl">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-brand-bright">
              <span>{department}</span>
              <span className="text-white/70">·</span>
              <span className="text-white/50">{location}</span>
              <span className="text-white/70">·</span>
              <span className="text-white/50">{type}</span>
            </div>
            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-[-0.02em] md:text-5xl">
              {title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/70">{summary}</p>
            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-white/70">
              {facts.map((f) => (
                <li key={f.label} className="inline-flex items-center gap-2">
                  <f.icon size={16} className="text-brand-bright" aria-hidden />
                  {f.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          {/* Main column */}
          <div className="space-y-12">
            <Reveal>
              <h2 className="text-2xl">About the role</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink/75">{overview}</p>
            </Reveal>

            <Reveal>
              <h2 className="text-2xl">What you&apos;ll do</h2>
              <ul className="mt-6 space-y-3">
                {responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-ink/80">{r}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="text-2xl">What we&apos;re looking for</h2>
              <ul className="mt-6 space-y-3">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-ink/80">{r}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Sticky aside — apply + skills */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-mist p-6">
              <h3 className="text-lg font-bold">Ready to apply?</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                Tell us a little about you and share your CV. It takes a minute.
              </p>
              <div className="mt-5">
                <ApplyPanel jobTitle={title} jobSlug={slug} />
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* Related roles */}
      {related.length ? (
        <Section muted>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl md:text-3xl">Other open roles</h2>
            <Link
              href="/careers"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:underline"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/careers/${p.slug}`}
                className="group flex flex-col rounded-2xl border border-line bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_24px_48px_-24px_rgba(215,52,56,0.35)]"
              >
                <span className="chip !py-1 !px-2.5 self-start text-xs text-brand-ink">
                  {p.department}
                </span>
                <h3 className="mt-3 text-base font-bold leading-snug transition-colors group-hover:text-brand-ink">
                  {p.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink">
                  View role
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
