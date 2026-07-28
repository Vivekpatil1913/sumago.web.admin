import Link from "next/link";
import {
  Star,
  User,
  Sparkles,
  FlaskConical,
  Cpu,
  LineChart,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Button } from "@/components/atoms/button";
import { MediaPlaceholder } from "@/components/molecules/media-placeholder";
import { MosaicGallery } from "@/components/organisms/gallery/mosaic-gallery";
import { Reveal } from "@/components/motion/reveal";
import { company } from "@/lib/site";
import { testimonials, faqs } from "@/lib/content";
import { previewImages, cultureGalleryImages } from "@/lib/preview-assets";

/** Initials for the avatar; falls back to a quote glyph while names are pending. */
function initialsOf(name: string): string | null {
  if (/pending/i.test(name)) return null;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

/**
 * A single testimonial card: the person (avatar + name + role) on top, a star
 * rating, then the review below.
 */
function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  const initials = initialsOf(t.name);
  return (
    <figure className="mx-3 flex w-[320px] shrink-0 flex-col self-start rounded-2xl border border-line bg-paper p-7 shadow-sm md:w-[380px]">
      {/* Person — name above */}
      <figcaption className="flex items-center gap-3">
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-semibold uppercase text-white"
          style={{ backgroundColor: t.accent }}
          aria-hidden={!initials}
        >
          {initials ?? <User size={18} />}
        </span>
        <span className="min-w-0">
          <span className="block font-semibold text-ink">{t.name}</span>
          <span className="block truncate text-sm text-ink/55">{t.role}</span>
        </span>
      </figcaption>

      {/* Rating */}
      <div className="mt-4 flex gap-0.5" aria-label={`${t.rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={15}
            aria-hidden
            className={
              i < t.rating ? "fill-amber-400 text-amber-400" : "fill-ink/10 text-ink/10"
            }
          />
        ))}
      </div>

      {/* Review below */}
      <blockquote className="mt-3 text-sm leading-relaxed text-ink/80">
        {t.quote}
      </blockquote>
    </figure>
  );
}

/** Overflow clip shared by both testimonial rows. `overflow-hidden` keeps the
 *  wide marquee track from causing page scroll; the vertical padding gives the
 *  cards room so their shadows aren't clipped at the top and bottom edges. */
const TESTIMONIAL_ROW = "relative overflow-hidden py-4";

/** Two rows so the marquee stays full without over-duplicating a short list. */
const rowA = testimonials.filter((_, i) => i % 2 === 0);
const rowB = testimonials.filter((_, i) => i % 2 === 1);

/** Client testimonials (sample copy, flagged) — two rows, opposite directions. */
export function Testimonials() {
  return (
    <section id="testimonials" className="bg-mist py-16 md:py-22">
      <div className="container-page">
        <SectionHeading
          wide
          eyebrow="In their words"
          title={
            <>
              Proven in the real world, and{" "}
              <span className="text-metal-red-shine">trusted by businesses everywhere.</span>
            </>
          }
          description="The enterprises, founders, and institutions we build for — in their own words."
        />
      </div>
      <div className="mt-10 flex flex-col gap-6">
        {/* Row 1 → scrolls left */}
        <div data-aos="fade-up" className={TESTIMONIAL_ROW}>
          <div className="flex w-max items-start will-change-transform animate-[marquee-x_55s_linear_infinite]">
            {[...rowA, ...rowA].map((t, i) => (
              <TestimonialCard key={`a-${i}`} t={t} />
            ))}
          </div>
        </div>
        {/* Row 2 → scrolls right */}
        <div data-aos="fade-up" data-aos-delay="120" className={TESTIMONIAL_ROW}>
          <div className="flex w-max items-start will-change-transform animate-[marquee-x_55s_linear_infinite_reverse]">
            {[...rowB, ...rowB].map((t, i) => (
              <TestimonialCard key={`b-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Two closing doors under the testimonials — keep reading, or come build here. */
const CLOSING_LINKS = [
  {
    title: "Stay up to date",
    description:
      "Engineering notes, playbooks, and perspective from the Sumago team — on AI, product engineering, and what's actually working.",
    cta: "Read our blog",
    href: "/blog",
  },
  {
    title: "Want to help build what's next?",
    description:
      "Sumago is looking for engineers, designers, and consultants who like solving real problems — with the room to own the outcome.",
    cta: "Join the Sumago team",
    href: "/careers",
  },
];

export function BlogAndCareers() {
  return (
    <Section>
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        {CLOSING_LINKS.map((item, i) => (
          <div key={item.href} data-aos="fade-up" data-aos-delay={i * 80}>
            <h2 className="text-2xl font-bold leading-snug text-ink md:text-3xl">
              {item.title}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink/65">
              {item.description}
            </p>
            <Link
              href={item.href}
              className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink transition-colors hover:text-brand-ink"
            >
              {item.cta}
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
}

/** Life-at-Sumago culture collage — auto-scrolling mosaic of team & workspace stills. */
const homeGalleryImages = cultureGalleryImages.map((src, i) => ({
  src,
  alt: `Sumago team, engineers, and workspace — culture still ${i + 1}`,
}));

export function CultureGallery() {
  return (
    <section id="life-at-sumago" className="py-16 md:py-22">
      <div className="container-page">
        <SectionHeading
          eyebrow="Life at Sumago"
          title={
            <>
              Great software starts with{" "}
              <span className="text-metal-red-shine">great people.</span>
            </>
          }
          description="A 70+ team of engineers, designers, and consultants who take real ownership, learn relentlessly, and genuinely enjoy the hard problems."
        />
      </div>
      <div data-aos="fade-up" className="mt-12">
        <MosaicGallery
          images={homeGalleryImages}
          label="Life at Sumago photo gallery"
        />
      </div>
      <div className="container-page">
        <div className="mt-10 flex justify-center">
          <Button href="/life-at-sumago" variant="outline">
            See life at Sumago <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}

/** Innovation & AI Lab highlight with imagery. */
export function InnovationHighlight() {
  const pillars = [
    { icon: Sparkles, t: "AI Lab", d: "Applied AI/ML, Small Language Models, intelligent automation." },
    { icon: FlaskConical, t: "Internal R&D", d: "Technology accelerators and modern engineering practices." },
    { icon: Cpu, t: "Emerging tech", d: "Cloud, IoT, blockchain, and data analytics." },
    { icon: LineChart, t: "Insights", d: "CEO insights, whitepapers, and product thinking." },
  ];
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <MediaPlaceholder src={previewImages.innovation} alt="Sumago innovation and AI lab" ratio="4/3" />
        </Reveal>
        <div>
          <SectionHeading
            eyebrow="Innovation & knowledge"
            title={<>Always exploring <span className="text-metal-red">what&apos;s next</span>.</>}
            description="Research, applied AI, and thought leadership that keep our clients ahead in a fast-moving world."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <div
                key={p.t}
                data-aos="fade-up"
                data-aos-delay={(i % 2) * 80}
                className="flex gap-3"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                  <p.icon size={20} />
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{p.t}</h3>
                  <p className="text-sm text-ink/65">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/innovation" variant="outline">Explore the Innovation Lab</Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/** Founder-led leadership band → Founder's Desk. */
export function LeadershipBand() {
  return (
    <Section muted>
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex gap-4">
          <MediaPlaceholder src={previewImages.founder} alt={`${company.leadership[0].name} — ${company.leadership[0].role}`} ratio="3/4" className="w-1/2" />
          <MediaPlaceholder src={previewImages.cofounder} alt={`${company.leadership[1].name} — ${company.leadership[1].role}`} ratio="3/4" className="mt-8 w-1/2" />
        </div>
        <div>
          <SectionHeading
            eyebrow="The Founder's Desk"
            title={<>Founder-led, since <span className="text-metal-red">2013</span>.</>}
            description="A direct word from the people behind Sumago — why we exist, our philosophy, and where we're going."
          />
          <ul className="mt-6 space-y-2">
            {company.leadership.map((l) => (
              <li key={l.name} className="text-ink/80">
                <span className="font-semibold text-ink">{l.name}</span> — {l.role}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href="/team">
              Meet the team <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/** FAQ — native accordion (accessible, no JS required). */
export function FaqSection() {
  return (
    <Section>
      <SectionHeading
        align="center"
        eyebrow="Questions"
        title={<>What you might be <span className="text-metal-red">wondering</span>.</>}
        className="mx-auto"
      />
      <div className="mx-auto mt-10 max-w-3xl divide-y divide-line rounded-xl border border-line">
        {faqs.map((f, i) => (
          <details
            key={f.q}
            data-aos="fade-up"
            data-aos-delay={(i % 4) * 60}
            className="group p-5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
              {f.q}
              <ChevronDown size={18} className="shrink-0 text-brand transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-ink/70">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
