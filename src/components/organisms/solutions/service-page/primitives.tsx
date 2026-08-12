import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SERVICE PAGE DESIGN SYSTEM — PRIMITIVES
 * =======================================
 *
 * Every section of every service page is built from the pieces in this file.
 * Nothing in a section sets its own padding, surface or type scale; if a section
 * needs something these don't provide, the primitive changes and all fifteen
 * pages change with it.
 *
 * ── THE LANGUAGE IS EDITORIAL, NOT CARDS ────────────────────────────────────
 *
 * This is the correction that matters. The first build of this page ran eight
 * card grids back to back, which read as a documentation template — and it was
 * also not how the rest of this site is designed. The team page, the Solutions
 * index and the About story are all *card-free*: the type carries each block,
 * and depth comes from four devices used consistently.
 *
 *   1. TILTED BRAND PLATES  an icon on a -3° brand-gradient square that rotates
 *                           to +3° on hover. Used wherever an icon needs weight.
 *   2. GHOST NUMERALS       an oversized index set at 4–6% ink behind the type.
 *                           Gives a block depth without giving it a container.
 *   3. RED GRADIENT RULES   a hairline running brand → transparent. Separates,
 *                           and grows on hover to signal life.
 *   4. HAIRLINE STRUCTURE   1px dividers and gap-px matrices instead of borders
 *                           around boxes.
 *
 * A container is now the exception, and each one has to earn itself: the
 * technology marquee, the outcome comparison, and the proof rows are the only
 * places a boxed element survives.
 *
 * ── SURFACES ────────────────────────────────────────────────────────────────
 *   paper  #ffffff   the default reading surface
 *   mist   #f5f5f6   alternating band, separating one idea from the next
 *   ink    #0a0708   the page's three dark moments — the hero, the technology
 *                    band, and the close. Sparingly: a fourth would turn the
 *                    register into a pattern and stop reading as emphasis.
 *
 * ── SPACING (8px base) ──────────────────────────────────────────────────────
 *   section      96px → 128px at md      (py-24 md:py-32)
 *   intro → body 56px → 72px at md       (mt-14 md:mt-18)
 *   grid gutter  24px → 32px at md       (gap-6 md:gap-8)
 *   block rhythm 8 / 12 / 20 / 32 / 56
 *
 * ── GRID ────────────────────────────────────────────────────────────────────
 *   12 columns, 1280px max, 20/32px page gutter (`container-page`).
 *
 * ── TYPE ────────────────────────────────────────────────────────────────────
 *   eyebrow      12px / 700 / 0.18em uppercase / brand-ink
 *   section h2   32 → 40 → 48px / 700 / -0.02em / 1.1
 *   lead         18 → 20px / 400 / 1.65 / ink 60%
 *   block title  18 → 20px / 700 / 1.35
 *   body         15px / 400 / 1.65 / ink 60%
 *   micro        12px / 600 / 0.14em uppercase / ink 45%
 *
 * ── COLOUR ──────────────────────────────────────────────────────────────────
 *   Brand red on eyebrows, plates, numerals, rules, one word per headline and
 *   the primary CTA. Gradients are confined to plates, rules, the hero and the
 *   close — never as a surface fill on a reading band.
 *
 * ── MOTION ──────────────────────────────────────────────────────────────────
 *   Reveal: AOS `fade-up`, 60ms stagger capped at three steps. Hover: 200–500ms
 *   ease-out — plates rotate, rules grow, ghost numerals warm to brand.
 *   `prefers-reduced-motion` is neutralised globally in globals.css.
 */

/* -------------------------------------------------------------------------- */
/*  Section shell                                                              */
/* -------------------------------------------------------------------------- */

export type Surface = "paper" | "mist" | "ink";

/**
 * The outer frame of every section: surface, vertical rhythm, container, and
 * the anchor the chapter rail scrolls to.
 */
export function SectionShell({
  id,
  surface = "paper",
  className,
  children,
}: {
  id: string;
  surface?: Surface;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        /* scroll-mt-28 clears both the fixed header (h-16) and the docked
           chapter bar beneath it, so a jump never lands under the chrome. */
        "relative isolate scroll-mt-28 py-24 md:py-32",
        surface === "mist" && "bg-mist",
        surface === "ink" && "bg-[#0a0708] text-white",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section intro                                                              */
/* -------------------------------------------------------------------------- */

/** Eyebrow, headline, lead. Centred by default; left where a section opens as
 *  a two-column argument and the headline should hold the first column. */
export function SectionIntro({
  eyebrow,
  title,
  lead,
  align = "center",
  surface = "paper",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  surface?: Surface;
  className?: string;
}) {
  const dark = surface === "ink";
  return (
    <div
      data-aos="fade-up"
      className={cn(
        align === "center" && "mx-auto max-w-3xl text-center",
        align === "left" && "max-w-xl",
        className,
      )}
    >
      <p
        className={cn(
          "text-xs font-bold uppercase tracking-[0.18em]",
          dark ? "text-brand-bright" : "text-brand-ink",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-5 text-balance text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[2.5rem] lg:text-[3rem]",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "mt-5 text-lg leading-[1.65] md:text-xl",
            dark ? "text-white/65" : "text-ink/60",
            align === "center" && "mx-auto",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tilted brand plate                                                         */
/* -------------------------------------------------------------------------- */

/**
 * The site's signature icon treatment, carried over from the team page's
 * portraits and the Solutions index: a brand-gradient square tilted -3°, which
 * swings to +3° when its block is hovered. Replaces the flat tinted tile the
 * card build used — the tilt is what makes it read as Sumago rather than as a
 * generic feature icon.
 */
export function Plate({
  icon: Icon,
  size = "md",
  className,
}: {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box =
    size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const glyph = size === "lg" ? 24 : size === "sm" ? 16 : 20;
  const radius = size === "lg" ? "rounded-2xl" : "rounded-xl";

  return (
    <span
      aria-hidden
      className={cn("relative inline-grid shrink-0 place-items-center", box, className)}
    >
      <span
        className={cn(
          "absolute inset-0 -rotate-3 bg-[linear-gradient(135deg,#d73438,#7a1519)]",
          "shadow-[0_10px_24px_-12px_rgba(215,52,56,0.7)]",
          "transition-transform duration-500 ease-out group-hover:rotate-3",
          radius,
        )}
      />
      <Icon size={glyph} strokeWidth={1.75} className="relative text-white" />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Flat icon tile                                                             */
/* -------------------------------------------------------------------------- */

/** The quiet alternative to a plate, for places where a row of icons would be
 *  too loud in full brand gradient — the process nodes sitting on their line. */
export function IconTile({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-paper text-brand",
        "transition-colors duration-300 group-hover:border-brand/40 group-hover:bg-brand group-hover:text-white",
        className,
      )}
    >
      <Icon size={18} strokeWidth={1.75} />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ghost numeral                                                              */
/* -------------------------------------------------------------------------- */

/**
 * An oversized index set behind the type at 4–6% ink, warming to brand when its
 * block is hovered. This is how a block gets depth without getting a container.
 */
export function GhostNumeral({
  n,
  surface = "paper",
  className,
}: {
  n: number;
  surface?: Surface;
  className?: string;
}) {
  const dark = surface === "ink";
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none select-none font-display font-bold leading-none",
        "transition-colors duration-500",
        dark
          ? "text-white/[0.07] group-hover:text-brand/25"
          : "text-ink/[0.06] group-hover:text-brand/20",
        className,
      )}
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Micro label                                                                */
/* -------------------------------------------------------------------------- */

/** The small all-caps label above sub-blocks. */
export function MicroLabel({
  children,
  surface = "paper",
  className,
}: {
  children: React.ReactNode;
  surface?: Surface;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.14em]",
        surface === "ink" ? "text-white/45" : "text-ink/45",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** A red gradient hairline that grows on hover — the system's divider. */
export function Rule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block h-px w-12 bg-gradient-to-r from-brand to-transparent",
        "transition-all duration-500 ease-out group-hover:w-20",
        className,
      )}
    />
  );
}

/** Stagger helper — capped at three steps so long grids don't crawl in. */
export function stagger(i: number) {
  return (i % 3) * 60;
}
