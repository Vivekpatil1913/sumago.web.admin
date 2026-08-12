import Link from "next/link";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import { getToolIcons } from "@/lib/tool-icons";
import { ToolTile } from "@/components/molecules/tool-strip";

/**
 * The diagrams behind the service detail page.
 *
 * Every section of that page carries its own visual form, so no two blocks read
 * alike: a shift plate for problem → approach, a crosshair for qualification, a
 * handover manifest for deliverables, numbered steps for outcomes, an orbit for
 * the stack, a branch map for where next. The old template stacked five
 * list-shaped sections in a row — which is exactly why it read as one long,
 * undifferentiated page.
 *
 * Rules these all follow:
 *  · Generated from the service's own arrays — nothing is authored per service,
 *    so they stay correct when the content moves to the CMS.
 *  · Geometry is computed from the item count, so 3 outcomes and 5 deliverables
 *    both lay out correctly.
 *  · Server components. Pure CSS/SVG, zero JS, so the ≥95 performance gate holds.
 *  · Decorative geometry is `aria-hidden`; the content itself stays real text in
 *    the DOM order a screen reader expects.
 *  · Motion is `motion-safe:` only.
 */

/* -------------------------------------------------------------------------- */
/*  1 · The shift — problem → approach                                         */
/* -------------------------------------------------------------------------- */

/** Descending (the problem) or ascending (the answer) trend line. Decorative. */
function TrendLine({ direction }: { direction: "down" | "up" }) {
  const down = direction === "down";
  return (
    <svg viewBox="0 0 120 40" className="h-10 w-28" aria-hidden>
      <path
        d={down ? "M4 8 L34 18 L64 16 L94 30 L116 36" : "M4 36 L34 26 L64 28 L94 12 L116 5"}
        fill="none"
        stroke={down ? "#9aa2b1" : "#d73438"}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={116}
        cy={down ? 36 : 5}
        r={4}
        fill={down ? "#9aa2b1" : "#d73438"}
      />
    </svg>
  );
}

/**
 * Two plates — where the business is today, and what changes the trajectory —
 * joined by a connector with a signal running along it. The whole argument of
 * the page in one frame.
 */
export function ShiftDiagram({
  problem,
  approach,
  approachHeading,
  problemLabel,
  Icon,
}: {
  problem: string;
  approach: string;
  approachHeading: string;
  problemLabel: string;
  Icon: LucideIcon;
}) {
  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
      {/* Today */}
      <div
        data-aos="fade-up"
        className="relative overflow-hidden rounded-3xl border border-line bg-mist p-7 sm:p-9"
      >
        <div className="flex items-start justify-between gap-6">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ink/65">
            {problemLabel}
          </p>
          <TrendLine direction="down" />
        </div>
        <p className="mt-6 text-lg leading-[1.55] text-ink/75 md:text-xl">{problem}</p>
      </div>

      {/* Connector — vertical between stacked plates, horizontal in the desktop
          gutter. A brand signal runs along it toward the answer. */}
      <div
        aria-hidden
        className="relative flex items-center justify-center py-2 lg:w-28 lg:py-0"
      >
        {/* Stacked (mobile / tablet) */}
        <svg viewBox="0 0 8 120" preserveAspectRatio="none" className="h-20 w-2 lg:hidden">
          <line
            x1="4" y1="0" x2="4" y2="120"
            stroke="var(--color-line)" strokeWidth="2"
            strokeDasharray="2 8" strokeLinecap="round"
          />
          <line
            x1="4" y1="0" x2="4" y2="120"
            stroke="#d73438" strokeWidth="2"
            strokeDasharray="10 54" strokeLinecap="round"
            className="motion-safe:animate-[svc-flow_2.4s_linear_infinite]"
          />
        </svg>

        {/* Side by side (desktop) */}
        <svg
          viewBox="0 0 120 8"
          preserveAspectRatio="none"
          className="hidden h-2 w-full lg:block"
        >
          <line
            x1="0" y1="4" x2="120" y2="4"
            stroke="var(--color-line)" strokeWidth="2"
            strokeDasharray="2 8" strokeLinecap="round"
          />
          <line
            x1="0" y1="4" x2="120" y2="4"
            stroke="#d73438" strokeWidth="2"
            strokeDasharray="10 54" strokeLinecap="round"
            className="motion-safe:animate-[svc-flow_2.4s_linear_infinite]"
          />
        </svg>

        <span className="absolute grid h-12 w-12 place-items-center rounded-2xl border border-brand/20 bg-paper shadow-[0_12px_28px_-14px_rgba(168,27,34,0.7)]">
          <Icon size={20} className="text-brand" />
        </span>
      </div>

      {/* The answer */}
      <div
        data-aos="fade-up"
        data-aos-delay={120}
        className="relative overflow-hidden rounded-3xl border border-brand/25 bg-paper p-7 shadow-[0_28px_60px_-38px_rgba(168,27,34,0.55)] sm:p-9"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-brand via-brand/40 to-transparent"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(215,52,56,0.14),transparent_70%)]"
        />
        <div className="relative flex items-start justify-between gap-6">
          <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-ink">
            {approachHeading}
          </h2>
          <TrendLine direction="up" />
        </div>
        <p className="relative mt-6 text-lg font-medium leading-[1.55] text-ink md:text-xl">
          {approach}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  2 · The crosshair — who this is for                                        */
/* -------------------------------------------------------------------------- */

/**
 * Qualification as a quadrant map: four situations around a centre node holding
 * the service. A buyer finds their own quarter in one pass instead of reading a
 * list top to bottom. Falls back to a plain responsive grid at any other count,
 * with the axes hidden — the diagram only means something at four.
 */
export function QuadrantDiagram({
  items,
  Icon,
}: {
  items: { title: string; description: string }[];
  Icon: LucideIcon;
}) {
  const isQuad = items.length === 4;

  return (
    <div className="relative mx-auto mt-12 max-w-5xl">
      {/* Axes + centre node — only drawn for the 2×2 reading, desktop only. */}
      {isQuad ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          <span className="absolute inset-y-8 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,transparent,var(--color-line)_18%,var(--color-line)_82%,transparent)]" />
          <span className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(to_right,transparent,var(--color-line)_18%,var(--color-line)_82%,transparent)]" />
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-brand/20 bg-paper shadow-[0_14px_34px_-18px_rgba(168,27,34,0.6)]">
            <Icon size={22} className="text-brand" />
          </span>
        </div>
      ) : null}

      <div
        className={
          isQuad
            ? "grid gap-4 lg:grid-cols-2 lg:gap-x-24 lg:gap-y-12"
            : "grid gap-4 sm:grid-cols-2"
        }
      >
        {items.map((w, i) => (
          <article
            key={w.title}
            data-aos="fade-up"
            data-aos-delay={(i % 2) * 80}
            className="group relative h-full overflow-hidden rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_26px_50px_-30px_rgba(215,52,56,0.4)]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 top-2 font-display text-5xl font-bold leading-none text-ink/[0.05] transition-colors duration-300 group-hover:text-brand/15"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="relative max-w-[85%] text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand-ink">
              {w.title}
            </h3>
            <div className="mt-4 h-px w-10 bg-gradient-to-r from-brand to-transparent transition-[width] duration-500 group-hover:w-20" />
            <p className="mt-4 text-sm leading-relaxed text-ink/65">{w.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  3 · The manifest — what you get                                            */
/* -------------------------------------------------------------------------- */

/**
 * Deliverables as a handover document: a ruled manifest, each artifact ticked,
 * closed by a perforated edge and a stamp. It reads as a tangible thing a client
 * receives — which is the point of the section — rather than as another list.
 */
export function ManifestDiagram({
  items,
  title,
  footnote,
}: {
  items: string[];
  title: string;
  footnote: string;
}) {
  return (
    <div
      data-aos="fade-up"
      className="relative mx-auto mt-12 max-w-3xl rounded-t-2xl border border-line bg-paper shadow-[0_34px_70px_-40px_rgba(0,0,0,0.45)]"
    >
      {/* Header band */}
      <div className="relative overflow-hidden rounded-t-2xl border-b border-line bg-mist px-6 py-5 sm:px-8">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_100%_at_100%_0%,rgba(215,52,56,0.10),transparent_70%)]"
        />
        <div className="relative flex items-center justify-between gap-4">
          <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-ink">
            {title}
          </p>
          <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.18em] text-ink/65">
            {String(items.length).padStart(2, "0")} items
          </p>
        </div>
      </div>

      {/* Ruled lines */}
      <ol className="relative px-6 sm:px-8">
        {items.map((d, i) => (
          <li
            key={d}
            data-aos="fade-up"
            data-aos-delay={(i % 4) * 60}
            className="group flex items-center gap-4 border-b border-dashed border-line py-5 last:border-b-0"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-brand/25 bg-brand/[0.07] text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
              <Check size={15} strokeWidth={3} aria-hidden />
            </span>
            <span className="font-display text-xs font-bold tabular-nums text-ink/65">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 text-base font-medium leading-snug text-ink transition-transform duration-300 group-hover:translate-x-1 sm:text-lg">
              {d}
            </span>
          </li>
        ))}
      </ol>

      {/* Stamp + perforated tear-off edge */}
      <div className="relative flex items-center justify-between gap-4 border-t border-line px-6 py-5 sm:px-8">
        <p className="text-xs leading-relaxed text-ink/65">{footnote}</p>
        <span
          aria-hidden
          className="hidden shrink-0 -rotate-6 rounded-md border-2 border-brand/25 px-3 py-1 font-display text-[0.65rem] font-bold uppercase tracking-[0.18em] text-brand/40 sm:block"
        >
          Handover
        </span>
      </div>
      <span
        aria-hidden
        className="block h-3 w-full [background:radial-gradient(circle_at_6px_0,transparent_5px,var(--color-paper)_5px)] [background-size:12px_12px]"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  4 · The steps — what changes                                               */
/* -------------------------------------------------------------------------- */

/**
 * Outcomes as a numbered progression across the dark band: start on the left,
 * where it lands on the right, and a rail running through the step badges to
 * tie them together.
 *
 * Deliberately still. An earlier version pinned the page and played the same
 * three outcomes as a scroll-driven journey — it read as effort rather than
 * substance, and left most of the frame empty while it waited for the scroll.
 * Three cards say the same thing in one glance, fill the width, and hold up on
 * a phone without a fallback layout.
 */
export function OutcomeSteps({
  items,
  startLabel,
  endLabel,
  Icon,
}: {
  items: string[];
  startLabel: string;
  endLabel: string;
  Icon: LucideIcon;
}) {
  return (
    <div className="mt-14">
      {/* Journey framing — start on the left, destination on the right. */}
      <div className="mb-6 flex items-center justify-between gap-4 text-[0.7rem] font-bold uppercase tracking-[0.18em]">
        <span className="text-white/70">{startLabel}</span>
        <span className="flex items-center gap-2 text-brand-bright">
          <Icon size={14} aria-hidden />
          {endLabel}
        </span>
      </div>

      <div className="relative">
        {/* Rail — passes through the step badges, behind the cards. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-[3.75rem] hidden h-px bg-[linear-gradient(to_right,rgba(255,255,255,0.06),rgba(255,90,93,0.55),rgba(255,255,255,0.06))] md:block"
        />

        <ol className="relative grid gap-5 md:grid-cols-3">
          {items.map((o, i) => (
            <li
              key={o}
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 90}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-bright/40 hover:bg-white/[0.06] hover:shadow-[0_30px_60px_-32px_rgba(255,90,93,0.5)]"
            >
              {/* Corner glow on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,90,93,0.3),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              {/* Numbered badge — the rail runs through its centre. */}
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#d73438,#7a1519)] font-display text-base font-bold text-white shadow-[0_16px_32px_-16px_rgba(255,90,93,0.9)] ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-105">
                {String(i + 1).padStart(2, "0")}
              </span>

              <p className="relative mt-7 text-xl font-bold leading-snug tracking-tight text-white xl:text-2xl">
                {o}
              </p>

              <span
                aria-hidden
                className="relative mt-6 block h-px w-12 bg-gradient-to-r from-brand-bright to-transparent transition-[width] duration-500 group-hover:w-24"
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  5 · The orbit — the stack                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The tools a service works in, orbiting the service itself. The ring rotates
 * and every tile counter-rotates at the same duration, so each logo stays
 * upright while the constellation turns.
 *
 * Renders the marks that resolve (`getToolIcons` drops unknown titles); with
 * none, the caller's technology line still stands on its own.
 */
export function OrbitDiagram({
  tools,
  label,
  Icon,
  technologies,
}: {
  tools: readonly string[];
  label: string;
  Icon: LucideIcon;
  technologies?: string[];
}) {
  const icons = getToolIcons(tools);

  if (!icons.length) {
    return technologies?.length ? (
      <p className="mx-auto mt-12 max-w-3xl text-center text-sm font-medium uppercase tracking-[0.1em] text-ink/65">
        {technologies.join("  ·  ")}
      </p>
    ) : null;
  }

  return (
    /*
      `overflow-x-clip` on the wrapper, and it is doing something the stage
      below cannot.

      The rotating carrier is a square, and the browser counts a rotated
      square's *bounding box* — √2 of its side — toward the document's
      scroll width, even though that box paints nothing. At 390px a 294px stage
      was reported as 416px wide, so the page grew a horizontal scrollbar off an
      element with no pixels in it.

      Clipping here rather than on the stage is what keeps it visually lossless:
      this wrapper spans the whole column and the tiles orbit well inside it (the
      stage is inset for exactly that reason), so the only thing clipped is the
      empty corner sweep. `clip` rather than `hidden` — `hidden` would make this
      a scroll container and break the sticky in-page nav above it.
    */
    <div className="mt-14 grid items-center gap-10 overflow-x-clip lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
      {/*
        Orbit.

        Narrower than its column below `sm`, and that is load-bearing rather
        than taste. Two things reach past this box: the rotating carrier is a
        square, and a rotating square's bounding box grows to √2 of its side —
        and the tool tiles sit on a ring at 46% of the radius, so a 62px tile
        centred at 3 o'clock puts its outer edge ~31px past the stage.

        On a laptop the column is far wider than the 420px cap, so both sweep
        harmlessly into empty space. At 320–390px the stage filled the column,
        the sweep left the viewport, and the whole page gained a horizontal
        scrollbar — measured at +118px on a 320 screen.

        Clipping was the wrong fix: `overflow-hidden` here would cut the tiles
        at the extremes, which are the part a visitor is meant to read. Giving
        the stage 28px of room on each side keeps every tile inside the page
        and the ring geometry untouched.
      */}
      <div
        data-aos="fade-up"
        className="relative mx-auto aspect-square w-[calc(100%-3.5rem)] max-w-[420px] sm:w-full"
        aria-hidden
      >
        {/* Rings */}
        <span className="absolute inset-[8%] rounded-full border border-dashed border-brand/20" />
        <span className="absolute inset-[24%] rounded-full border border-line" />
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(215,52,56,0.10),transparent_65%)]" />

        {/* Centre — the service */}
        <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl bg-[linear-gradient(135deg,#d73438,#7a1519)] shadow-[0_20px_44px_-20px_rgba(168,27,34,0.9)]">
          <Icon size={32} className="text-white" />
        </span>

        {/* Rotating carrier. Each mark is nested arm → seat → tile so the
            rotations cancel: carrier(t) + angle − angle − t = 0, which keeps
            every logo upright while the constellation turns. */}
        <div className="absolute inset-0 motion-safe:animate-[svc-orbit_44s_linear_infinite]">
          {icons.map((icon, i) => {
            const angle = (i * 360) / icons.length;
            return (
              /* Arm — spans the ring, so the seat lands on its edge. */
              <span
                key={icon.title}
                className="absolute inset-0"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                {/* Seat — parked on the ring, un-rotated back to upright. */}
                <span
                  className="absolute left-1/2 top-[4%] block"
                  style={{ transform: `translateX(-50%) rotate(${-angle}deg)` }}
                >
                  {/* Tile — cancels the carrier's own rotation. */}
                  <span className="block motion-safe:animate-[svc-orbit-rev_44s_linear_infinite]">
                    <ul className="contents">
                      <ToolTile icon={icon} />
                    </ul>
                  </span>
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* The written stack */}
      <div data-aos="fade-up" data-aos-delay={100}>
        <ul aria-label={label} className="border-t border-line">
          {icons.map((icon) => (
            <li
              key={icon.title}
              className="flex items-center gap-3 border-b border-line py-3.5"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: `#${icon.hex}` }}
              />
              <span className="text-sm font-semibold text-ink">{icon.title}</span>
            </li>
          ))}
        </ul>
        {technologies?.length ? (
          <p className="mt-6 text-sm font-medium uppercase leading-relaxed tracking-[0.1em] text-ink/65">
            {technologies.join("  ·  ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  6 · The map — where next                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Sibling services as spokes off the one being read: a rail pinned to "you are
 * here", branching to each related service. Keeps the journey moving without
 * repeating the card grid the Solutions index already owns.
 */
export function RelatedMap({
  currentName,
  items,
  Icon,
}: {
  currentName: string;
  items: { slug: string; name: string; blurb: string; icon: LucideIcon }[];
  Icon: LucideIcon;
}) {
  return (
    <div className="mx-auto mt-12 max-w-4xl">
      {/* You are here */}
      <div data-aos="fade-up" className="flex items-center gap-4">
        <span className="relative inline-grid h-12 w-12 shrink-0 place-items-center">
          <span
            aria-hidden
            className="absolute inset-0 -rotate-3 rounded-2xl bg-[linear-gradient(135deg,#d73438,#7a1519)]"
          />
          <Icon size={22} className="relative text-white" aria-hidden />
        </span>
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ink/65">
            You are here
          </p>
          <p className="mt-0.5 text-base font-bold text-ink">{currentName}</p>
        </div>
      </div>

      {/* Spokes */}
      <div className="relative mt-2 pl-6">
        {/* Trunk */}
        <span
          aria-hidden
          className="absolute bottom-8 left-6 top-0 w-px bg-[linear-gradient(to_bottom,var(--color-brand),var(--color-line))]"
        />
        {items.map((s, i) => (
          <Link
            key={s.slug}
            href={`/solutions/${s.slug}`}
            data-aos="fade-up"
            data-aos-delay={(i % 3) * 70}
            className="group relative flex items-center gap-4 py-4 pl-10"
          >
            {/* Branch */}
            <span
              aria-hidden
              className="absolute left-0 top-1/2 h-px w-9 bg-line transition-colors duration-300 group-hover:bg-brand/50"
            />
            <span
              aria-hidden
              className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-line bg-paper transition-colors duration-300 group-hover:border-brand"
            />
            <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-paper text-brand transition-all duration-300 group-hover:border-brand/30 group-hover:bg-brand group-hover:text-white">
              <s.icon size={19} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-bold leading-snug text-ink transition-colors group-hover:text-brand-ink">
                {s.name}
              </span>
              <span className="mt-0.5 block text-sm leading-relaxed text-ink/60">
                {s.blurb}
              </span>
            </span>
            <ArrowRight
              size={18}
              aria-hidden
              className="shrink-0 text-brand transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
