import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { Stat } from "@/components/molecules/stat";
import { MediaPlaceholder } from "@/components/molecules/media-placeholder";
import { MosaicGallery } from "@/components/organisms/gallery/mosaic-gallery";
import { company } from "@/lib/site";
import { getMetrics, getSettings } from "@/lib/cms";
import { cn, slugify } from "@/lib/utils";
import { previewImages, previewPortraits, teamMoments } from "@/lib/preview-assets";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Founder-led since 2013 — the leadership and 70+ specialists behind Sumago's work.",
};

const portraits = [previewImages.founder, previewImages.cofounder];

/** LinkedIn brand glyph (lucide v1 dropped brand logos — inline the path). */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/**
 * SEED CONTENT — extra leadership detail shown in the split cards.
 * Real name/role come from `company.leadership`; message and LinkedIn are
 * placeholders.
 * [REAL ASSET NEEDED] Replace with verified messages + LinkedIn URLs.
 * NOTE: keep messaging on Sumago's technology-partner story — never SCOPE
 * (training/education) copy; SCOPE is a separate business (see CLAUDE.md).
 */
const leadershipDetail = [
  {
    message:
      "Sumago began in 2013 with one conviction — technology should solve real problems, not create new ones. Thirteen years and 700+ projects later, that hasn't changed. Every engagement still starts by understanding the business first, then building only what moves it forward. That's what earns a client's trust — and what keeps it.",
    linkedin: "#",
  },
  {
    message:
      "Ambitious ideas only matter if they ship and hold up in the real world. Turning them into dependable products takes a team that owns the outcome rather than the task — engineers, designers, and delivery leads accountable end to end. Every project is treated as the start of a long-term partnership, because the honest measure of the work is whether clients come back.",
    linkedin: "#",
  },
];

/**
 * SEED CONTENT — department leadership. The roles and descriptions reflect the
 * real org structure (3 AVPs + 2 BDMs + Program Manager + HR); names, portraits,
 * and LinkedIn URLs are placeholders.
 * [REAL ASSET NEEDED] Replace names, portraits, and LinkedIn URLs before launch.
 */
type Leader = {
  name: string;
  role: string;
  dept: string;
  message: string;
  /** Seven short annotation labels — what they actually own, day to day.
   *  Rendered 4 arrowing in from the left, 3 from the right. */
  traits: string[];
  linkedin: string;
  portrait: string;
};

const departmentLeaders: Leader[] = [
  {
    name: "Nikhil Barve",
    role: "AVP — Technology",
    dept: "Technology",
    message:
      "Sets the engineering bar — architecture, delivery standards, and the technical calls that keep products dependable and secure at scale.",
    traits: [
      "Architecture calls",
      "Engineering standards",
      "Security by design",
      "Delivery quality",
      "Technology strategy",
      "Code review culture",
      "Built to scale",
    ],
    linkedin: "#",
    portrait: previewPortraits[3],
  },
  {
    name: "Prachi Deshpande",
    role: "AVP — Marketing",
    dept: "Marketing",
    message:
      "Shapes how the market understands Sumago — turning capability into demand through brand, story, and pipeline that can be measured, not guessed.",
    traits: [
      "Brand & story",
      "Market positioning",
      "Demand generation",
      "Measurable pipeline",
      "Content & campaigns",
      "Events & presence",
      "Analytics & ROI",
    ],
    linkedin: "#",
    portrait: previewPortraits[4],
  },
  {
    name: "Rajesh Kulkarni",
    role: "AVP — Business",
    dept: "Business",
    message:
      "Owns the business behind delivery — aligning every engagement to real outcomes, from partnerships and growth to the commercial decisions that keep work sustainable.",
    traits: [
      "Growth & partnerships",
      "Client relationships",
      "Commercial strategy",
      "Owns the P&L",
      "Account expansion",
      "Pricing & proposals",
      "Market opportunities",
    ],
    linkedin: "#",
    portrait: previewPortraits[2],
  },
  {
    name: "Omkar Jadhav",
    role: "Business Development Manager",
    dept: "Business Development",
    message:
      "First point of contact for new partners — understanding the problem before proposing the build, so scope starts honest and expectations stay clear.",
    traits: [
      "First conversations",
      "Honest scoping",
      "Solution fit",
      "Proposals",
      "Requirement discovery",
      "Client onboarding",
      "Clear expectations",
    ],
    linkedin: "#",
    portrait: previewPortraits[5],
  },
  {
    name: "Sana Shaikh",
    role: "Business Development Manager",
    dept: "Business Development",
    message:
      "Turns first conversations into long-term partnerships — matching client goals to the right teams, technology, and engagement model.",
    traits: [
      "Client discovery",
      "New partnerships",
      "Engagement models",
      "Long-term accounts",
      "Needs analysis",
      "Relationship building",
      "Renewals",
    ],
    linkedin: "#",
    portrait: previewPortraits[8],
  },
  {
    name: "Tejas Kale",
    role: "Program Manager",
    dept: "Delivery",
    message:
      "Keeps complex programs transparent and on time — owning milestones, risk, and the communication that removes surprises from delivery.",
    traits: [
      "Milestones & risk",
      "On-time delivery",
      "Cross-team sync",
      "Clear reporting",
      "Resource planning",
      "Escalation handling",
      "Stakeholder updates",
    ],
    linkedin: "#",
    portrait: previewPortraits[6],
  },
  {
    name: "Ritika Sharma",
    role: "Human Resources",
    dept: "People",
    message:
      "Builds the team behind the work — hiring, growing, and retaining the specialists clients ultimately rely on.",
    traits: [
      "Hiring & onboarding",
      "Growth paths",
      "Team culture",
      "Retention",
      "Learning & development",
      "Employee engagement",
      "Performance reviews",
    ],
    linkedin: "#",
    portrait: previewPortraits[7],
  },
];

export default async function TeamPage() {
  const [settings, metrics] = await Promise.all([getSettings(), getMetrics()]);

  return (
    <>
      <PageHero
        variant="aurora"
        formation="constellation"
        redOpacity={0.4}
        particles={false}
        eyebrow="Our team"
        title={
          <>
            The people behind every{" "}
            <span className="text-metal-red-shine">Sumago</span> build.
          </>
        }
        description={`Founder-led since ${settings.foundedYear}, Sumago's 70+ specialists span strategy, design, engineering, cloud, and AI — the range to solve real problems end to end.`}
      />

      {/* Leadership + personal message (merged from the retired Founder's Desk). */}
      <Section>
        <SectionHeading
          eyebrow="Leadership"
          title={<>Founder-led, <span className="text-metal-red">outcome-focused</span>.</>}
          description="A direct word from the people behind Sumago — why we exist, our philosophy, and where we're going."
        />
        {/* Editorial pull-quotes — no card chrome. The portrait sits on a tilted
            brand-gradient plate; the words carry the block. Alternating sides. */}
        <div className="mt-16 flex flex-col gap-20 md:gap-28">
          {company.leadership.map((leader, i) => {
            const detail = leadershipDetail[i];
            const flip = i % 2 === 1;
            return (
              <div
                key={leader.name}
                data-aos="fade-up"
                className={cn(
                  "grid items-center gap-12 lg:gap-16",
                  flip
                    ? "lg:grid-cols-[1fr_minmax(0,22rem)]"
                    : "lg:grid-cols-[minmax(0,22rem)_1fr]",
                )}
              >
                {/* Portrait on a tilted brand-gradient plate. */}
                <div
                  className={cn(
                    "relative mx-auto w-full max-w-[18rem] lg:mx-0 lg:max-w-none",
                    flip && "lg:order-2",
                  )}
                >
                  <div
                    aria-hidden
                    className={cn(
                      "absolute -inset-2.5 -z-10 rounded-[2rem] bg-[linear-gradient(135deg,#d73438,#7a1519)]",
                      flip ? "rotate-3" : "-rotate-3",
                    )}
                  />
                  <MediaPlaceholder
                    src={portraits[i]}
                    alt={`${leader.name} — ${leader.role}`}
                    ratio="4/5"
                    bare
                    sizes="(max-width: 1024px) 18rem, 22rem"
                    className="rounded-[1.75rem] ring-0"
                  />
                </div>

                {/* The quote carries the block. */}
                <div className={cn("relative", flip && "lg:order-1")}>
                  {/* Oversized quote glyph, tucked behind the text. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -left-2 -top-12 select-none font-display text-[9rem] leading-none text-brand/10"
                  >
                    &ldquo;
                  </span>

                  <p className="relative text-xl leading-[1.5] tracking-tight text-ink md:text-2xl lg:text-[1.75rem]">
                    {detail.message}
                  </p>

                  {/* Red gradient rule → signature block. */}
                  <div className="mt-8 h-px w-24 bg-gradient-to-r from-brand to-transparent" />

                  <div className="mt-6 flex items-center gap-5">
                    <div>
                      <h3 className="text-2xl font-bold md:text-3xl">
                        <span className="text-metal-red-shine">{leader.name}</span>
                      </h3>
                      <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
                        {leader.role}
                      </p>
                    </div>
                    <a
                      href={detail.linkedin}
                      aria-label={`${leader.name} on LinkedIn`}
                      className="shrink-0 text-[#0A66C2] transition-opacity hover:opacity-80"
                    >
                      <LinkedInIcon className="h-8 w-8" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* [REAL ASSET NEEDED] Founder welcome video (Cloudflare Stream). */}
      <Section muted>
        <SectionHeading
          eyebrow="A word from the founder"
          title={<>Why <span className="text-metal-red">Sumago</span> exists.</>}
        />
        <div
          data-aos="fade-up"
          className="relative mx-auto mt-10 aspect-video w-full max-w-2xl overflow-hidden rounded-2xl bg-ink"
        >
          <div className="absolute inset-0 grid place-items-center text-center text-white/70">
            <div>
              <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-brand">
                ▶
              </div>
              <p className="text-sm">Founder&apos;s welcome video</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Department leadership — the 7 leaders accountable for each function. */}
      <Section dark className="relative overflow-hidden">
        {/* Ambient brand glow so the dark band feels lit, not flat. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_45%_at_50%_0%,rgba(215,52,56,0.18),transparent_70%)]"
        />
        <SectionHeading
          tone="dark"
          eyebrow="Our leadership team"
          title={<>The leaders behind <span className="text-metal-red-shine">every engagement</span>.</>}
          description="Each function is owned end to end — the people accountable for your outcomes, from first conversation through delivery and beyond."
        />

        {/* One leader at a time — open on the section background, no cards.
            The lg stage carries its own breathing room, so the gap stays tight. */}
        <div className="mt-12 flex flex-col gap-10 md:gap-12 lg:gap-2">
          {departmentLeaders.map((leader) => (
            <LeaderSpotlight key={leader.name} leader={leader} />
          ))}
        </div>
      </Section>

      {/* The wider team — headline stats, closing the page. */}
      <Section>
        <SectionHeading
          eyebrow="The wider team"
          title={<>Seventy-plus specialists, <span className="text-metal-red">one standard</span>.</>}
          description="Engineers, designers, consultants, and delivery leads working as one partner across the technology lifecycle."
        />
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {metrics.slice(0, 4).map((m, i) => (
            <div key={m.label} data-aos="fade-up" data-aos-delay={(i % 4) * 60}>
              <Stat value={m.value} label={m.label} />
            </div>
          ))}
        </div>
      </Section>

      {/* Team-at-work carousel — office days, meetings, conferences, hackathons,
          offsites. Heading stays in the container; the strip runs edge to edge. */}
      <section className="bg-mist py-16 md:py-22">
        <div className="container-page">
          <SectionHeading
            eyebrow="Life at Sumago"
            title={<>A look inside <span className="text-metal-red-shine">how we work</span>.</>}
            description="Focused desk time, meetings and reviews, conferences, hackathons, and team-building offsites — the everyday moments behind the work."
          />
        </div>
        <div data-aos="fade-up">
          <MosaicGallery
            images={teamMoments}
            rows={2}
            speed={55}
            label="The Sumago team at work"
            className="mt-12"
          />
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Leadership spotlight geometry.
 *
 * Arrows and labels share ONE coordinate space (a 1200×700 viewBox on a
 * 12/7 stage), which is the only way the arrow tips actually land on the
 * labels. Change a label's position and you must move its arrow endpoint
 * to match — the pairs are index-aligned.
 *
 * The portrait sits centred, spanning roughly x 457→743, y 105→485, so
 * every arrow starts just off one of its vertical edges.
 * ------------------------------------------------------------------ */

/** Label anchors as % of the stage. `right` for left-hand labels (they grow
 *  leftward from the arrow tip); `left` for right-hand ones. */
const LEFT_LABELS = [
  { right: "72.5%", top: "15.7%", rotate: "-rotate-3" },
  { right: "75.4%", top: "32.1%", rotate: "rotate-2" },
  { right: "71.7%", top: "48.6%", rotate: "-rotate-2" },
  { right: "74.6%", top: "64.3%", rotate: "rotate-3" },
];
const RIGHT_LABELS = [
  { left: "72.5%", top: "18.6%", rotate: "rotate-3" },
  { left: "75.0%", top: "35.7%", rotate: "-rotate-2" },
  { left: "71.7%", top: "52.1%", rotate: "rotate-2" },
];

/**
 * Timing. Each of the 7 beats fires 250ms apart, alternating left→right so the
 * arrows fan out around the portrait rather than marching down one column. Per
 * beat: the arrow draws from the photo (300ms), then its head lands and the
 * label zooms in (400ms). Last beat starts at 1500ms → label settles at 2200ms.
 * AOS's throttled scroll trigger adds ~400ms in practice, so all seven land
 * around ~2.6s — inside the 3s budget. Verified in-browser; if you re-tune
 * these, re-measure rather than trusting the arithmetic.
 */
const ARROW_DRAW_MS = 300;
const ANNOTATION_DURATION = 400;
/** Label delays — beat index × 250ms, plus the arrow's 300ms draw. */
const LEFT_DELAY = [300, 800, 1300, 1800];
const RIGHT_DELAY = [550, 1050, 1550];

/**
 * Curves from the portrait edge out to each label tip — 4 left, then 3 right.
 * Index-aligned with LEFT_LABELS ++ RIGHT_LABELS.
 *
 * `hx/hy` is the tip and `a` the end-tangent angle, so the arrowhead chevron can
 * be placed and rotated to match its curve. (These replace an SVG <marker>: a
 * marker paints instantly at full opacity regardless of stroke-dash, so it would
 * have given the game away before its line finished drawing.)
 */
const ARROWS = [
  { d: "M455 175 C 418 168, 392 122, 350 127", hx: 350, hy: 127, a: 173, delay: 0 },
  { d: "M452 265 C 412 262, 372 232, 315 242", hx: 315, hy: 242, a: 170, delay: 500 },
  { d: "M455 355 C 425 358, 400 352, 360 357", hx: 360, hy: 357, a: 173, delay: 1000 },
  { d: "M458 440 C 420 448, 372 468, 325 467", hx: 325, hy: 467, a: 181, delay: 1500 },
  { d: "M745 185 C 782 178, 812 140, 850 147", hx: 850, hy: 147, a: 10, delay: 250 },
  { d: "M748 270 C 790 268, 838 254, 880 267", hx: 880, hy: 267, a: 17, delay: 750 },
  { d: "M745 360 C 780 364, 810 376, 840 382", hx: 840, hy: 382, a: 11, delay: 1250 },
];

/**
 * A single handwritten label, absolutely placed to meet its arrow tip.
 *
 * AOS owns `transform` on the outer node (zoom-in), so the tilt has to live on
 * an inner node — putting both on one element makes AOS clobber the rotation.
 */
function Annotation({
  label,
  circled = false,
  style,
  className,
  delay,
  anchor,
}: {
  label: string;
  /** Ring the label in a hand-drawn oval, like the circled word on the poster. */
  circled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  delay: number;
  anchor: string;
}) {
  return (
    <div
      style={style}
      className="absolute max-w-[24%]"
      data-aos="zoom-in"
      data-aos-delay={delay}
      data-aos-duration={ANNOTATION_DURATION}
      data-aos-anchor={anchor}
    >
      <div className={className}>
        <span className="relative inline-block">
          {circled ? (
            <svg
              aria-hidden
              viewBox="0 0 200 70"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -left-4 -top-2 -z-10 h-[calc(100%+1rem)] w-[calc(100%+2rem)] text-white/50"
            >
              <ellipse cx="100" cy="35" rx="97" ry="31" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          ) : null}
          <span className="text-silver font-hand text-3xl leading-tight">{label}</span>
        </span>
      </div>
    </div>
  );
}

/**
 * Leadership spotlight — one leader at a time, open on the section background
 * (no card). Handwritten annotations sit either side (4 left, 3 right) with
 * arrows running out from the portrait to each label. Name, role, and LinkedIn
 * sit beneath the image.
 */
function LeaderSpotlight({ leader }: { leader: Leader }) {
  // Id must be unique per instance — 7 spotlights share this document.
  const stageId = `leader-${slugify(leader.name)}`;
  const left = leader.traits.slice(0, 4);
  const right = leader.traits.slice(4, 7);

  return (
    <div id={stageId} data-aos="fade-up" className="relative lg:aspect-[12/7]">
      {/* Ambient glow behind the portrait — depth without a container. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(38%_46%_at_50%_45%,rgba(255,255,255,0.055),transparent_70%)]"
      />

      {/* Connectors. The viewBox matches the 12/7 stage exactly, so these
          coordinates map 1:1 onto the labels positioned below. Each line draws
          outward from the portrait; its head lands as the label zooms in. */}
      <svg
        aria-hidden
        viewBox="0 0 1200 700"
        className="pointer-events-none absolute inset-0 hidden h-full w-full text-white/65 lg:block"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {ARROWS.map((a) => (
            <g key={a.d}>
              <path
                className="leader-arrow-line"
                pathLength={1}
                d={a.d}
                style={{ animationDelay: `${a.delay}ms` }}
              />
              <path
                className="leader-arrow-head"
                d="M-10 -6 L0 0 L-10 6"
                transform={`translate(${a.hx} ${a.hy}) rotate(${a.a})`}
                style={{ animationDelay: `${a.delay + ARROW_DRAW_MS}ms` }}
              />
            </g>
          ))}
        </g>
      </svg>

      {/* Labels — only on lg, where the stage geometry applies. */}
      <div className="hidden lg:block">
        {left.map((t, i) => (
          <Annotation
            key={t}
            label={t}
            style={{ right: LEFT_LABELS[i].right, top: LEFT_LABELS[i].top }}
            className={cn("text-right", LEFT_LABELS[i].rotate)}
            delay={LEFT_DELAY[i]}
            anchor={`#${stageId}`}
          />
        ))}
        {right.map((t, i) => (
          <Annotation
            key={t}
            label={t}
            circled={i === 0}
            style={{ left: RIGHT_LABELS[i].left, top: RIGHT_LABELS[i].top }}
            className={RIGHT_LABELS[i].rotate}
            delay={RIGHT_DELAY[i]}
            anchor={`#${stageId}`}
          />
        ))}
      </div>

      {/* Portrait + identity — centred in the stage on lg, in flow below it. */}
      <div className="flex flex-col items-center lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        <span className="mb-4 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brand-bright backdrop-blur">
          {leader.dept}
        </span>

        <div className="w-[15rem] sm:w-[16rem] lg:w-[18rem]">
          <MediaPlaceholder
            src={leader.portrait}
            alt={`${leader.name} — ${leader.role}`}
            ratio="3/4"
            bare
            sizes="(max-width: 640px) 15rem, 18rem"
            className="rounded-2xl bg-transparent ring-0"
          />
        </div>

        {/* Name · position · LinkedIn — below the image. */}
        <div className="mt-5 text-center">
          <h3 className="text-2xl font-bold text-white md:text-3xl">{leader.name}</h3>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand-bright md:text-base">
            {leader.role}
          </p>
          <a
            href={leader.linkedin}
            aria-label={`${leader.name} on LinkedIn`}
            className="mt-3 inline-flex text-[#0A66C2] transition-opacity hover:opacity-80"
          >
            <LinkedInIcon className="h-7 w-7" />
          </a>
        </div>
      </div>

      {/* Below lg there's no room for the annotated stage — plain list instead. */}
      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 lg:hidden">
        {leader.traits.map((t, i) => (
          <div
            key={t}
            data-aos="zoom-in"
            data-aos-delay={i * 300}
            data-aos-duration={ANNOTATION_DURATION}
            data-aos-anchor={`#${stageId}`}
          >
            <span className="text-silver font-hand text-2xl leading-tight">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
