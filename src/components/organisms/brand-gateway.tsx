"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { HeroStars } from "@/components/three/hero-stars";
import { brands, GATEWAY_STORAGE_KEY, type Brand } from "@/lib/brands";
import { company, visitableOffices } from "@/lib/site";
import { cn } from "@/lib/utils";

/* The site's shared "expo-out" — same curve as the page and home heroes. */
const EASE = [0.16, 1, 0.3, 1] as const;

/* Static, like SiteFooter's — a live year would drift between server and client. */
const GATEWAY_YEAR = 2026;

/**
 * First-visit brand gateway — three full-height panels, one per Sumago business.
 *
 * Deliberately client-only and mounted *after* hydration: the homepage ships and
 * renders exactly as it always did, so `/` keeps its content, its SEO value, and
 * its LCP element. The gateway is a layer over a real page, never a replacement
 * for one. Shown once per visitor (localStorage); force it back with `?gateway`.
 *
 * Rendered as a native <dialog>, which buys the focus trap, the Escape handler,
 * background inertness, and top-layer stacking for free.
 */
export function BrandGateway() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion();

  // Deferred a frame (as HeroStars does) so the homepage paints first — the
  // gateway must never become the LCP element or delay it.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const forced = new URLSearchParams(window.location.search).has("gateway");
        if (forced || window.localStorage.getItem(GATEWAY_STORAGE_KEY) !== "1") {
          setMounted(true);
        }
      } catch {
        // Storage blocked (private mode, locked-down browser). Failing closed keeps
        // a visitor who *can't* be remembered from meeting the gateway every load.
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    dialogRef.current?.showModal();
    // showModal() focuses the first focusable child — which here is a whole
    // panel, so Infotech would arrive pre-selected and wearing a focus ring.
    // Park focus on the neutral shell instead: the choice starts genuinely open,
    // and Tab still walks the three panels in order.
    shellRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mounted]);

  const remember = useCallback(() => {
    try {
      window.localStorage.setItem(GATEWAY_STORAGE_KEY, "1");
    } catch {
      // Nothing to do — the visitor simply sees the gateway again next time.
    }
  }, []);

  /** Choosing Infotech (or pressing Escape) reveals the homepage underneath. */
  const dismiss = useCallback(() => {
    remember();
    setVisible(false);
  }, [remember]);

  return (
    <>
      {mounted ? (
        <dialog
          ref={dialogRef}
          aria-label="Choose a Sumago business"
          onCancel={(event) => {
            // Let the exit animation play before the dialog actually closes.
            event.preventDefault();
            dismiss();
          }}
          className="m-0 h-full max-h-none w-full max-w-none overflow-y-auto overflow-x-hidden bg-transparent p-0 text-white [&::backdrop]:bg-[#0a0708]/90 [&::backdrop]:backdrop-blur-sm"
        >
          <AnimatePresence
            onExitComplete={() => {
              dialogRef.current?.close();
              setMounted(false);
            }}
          >
            {visible ? (
              <motion.div
                key="gateway"
                ref={shellRef}
                tabIndex={-1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }}
                transition={{ duration: 0.5 }}
                className="relative isolate flex min-h-full flex-col bg-[#0a0708] outline-none"
              >
                {/* The choice owns the first screen; the offices sit below it, so
                    the gateway reads as a page rather than a trapped overlay. */}
                <div className="relative flex min-h-[100svh] flex-col overflow-hidden">
                  <HeroStars formation="constellation" />

                  <GatewayMasthead />

                  <div className="relative z-10 flex flex-1 flex-col md:flex-row">
                    {brands.map((brand, index) => (
                      <BrandPanel
                        key={brand.key}
                        brand={brand}
                        index={index}
                        active={active}
                        reduce={reduce}
                        onActivate={() => setActive(index)}
                        onDeactivate={() => setActive(null)}
                        onChoose={brand.external ? remember : dismiss}
                      />
                    ))}
                  </div>
                </div>

                <GatewayFooter />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </dialog>
      ) : null}
    </>
  );
}

/** The line that frames the choice — one group, three ways in. */
function GatewayMasthead() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
      className="relative z-10 shrink-0 px-6 pt-8 text-center md:px-10 md:pt-10"
    >
      <span className="chip border-white/15 bg-white/[0.07] text-white/90 backdrop-blur">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
        </span>
        Strive With Technology…!
      </span>
      <h1 className="mx-auto mt-4 max-w-3xl text-balance text-2xl font-bold leading-[1.15] tracking-[-0.03em] sm:text-3xl lg:text-4xl">
        One group.{" "}
        <span className="text-metal-red-shine">Three ways in.</span>
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/60">
        Building software, sharpening talent, and rehearsing the interview that
        changes everything. Pick where you&apos;re headed.
      </p>
    </motion.header>
  );
}

/**
 * Offices + copyright, closing the gateway page. Same dark palette as the
 * chooser above it rather than a separate footer treatment, so the whole page
 * reads as one surface. Driven off `visitableOffices` (lib/site.ts) — the walk-in
 * locations with their own line and hours — so addresses live in one place.
 */
function GatewayFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#0a0708] px-6 py-14 md:px-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold tracking-[-0.02em] md:text-3xl">
          Our <span className="text-metal-red-shine">offices</span>
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {visitableOffices.map((office) => (
            <div
              key={office.city}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-brand/40"
            >
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-white/90">
                {office.city}
              </p>

              <p className="mt-4 flex gap-3 text-sm leading-relaxed text-white/60">
                <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brand-bright" />
                {office.address}
              </p>

              <a
                href={`mailto:${office.email}`}
                className="mt-3 flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white"
              >
                <Mail aria-hidden className="h-4 w-4 shrink-0 text-brand-bright" />
                {office.email}
              </a>

              <a
                href={`tel:${office.phone.replace(/\s/g, "")}`}
                className="mt-2 flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white"
              >
                <Phone aria-hidden className="h-4 w-4 shrink-0 text-brand-bright" />
                {office.phone}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-white/45">
          © {GATEWAY_YEAR} All rights reserved by {company.name}
        </p>
      </div>
    </footer>
  );
}

type PanelProps = {
  brand: Brand;
  index: number;
  active: number | null;
  reduce: boolean | null;
  onActivate: () => void;
  onDeactivate: () => void;
  onChoose: () => void;
};

/**
 * One business, one panel. Hovering or focusing a panel widens it and eases the
 * other two back — the whole surface is a single control, so it's one tab stop
 * and one obvious target. Mobile drops the widening entirely and stacks three
 * full-bleed cards with everything already revealed (docs: mobile is redesigned,
 * not shrunk).
 */
function BrandPanel({
  brand,
  index,
  active,
  reduce,
  onActivate,
  onDeactivate,
  onChoose,
}: PanelProps) {
  const isActive = active === index;
  const isDimmed = active !== null && !isActive;

  const content: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE, delay: 0.3 + index * 0.12 },
    },
  };

  const shared = {
    onMouseEnter: onActivate,
    onMouseLeave: onDeactivate,
    onFocus: onActivate,
    onBlur: onDeactivate,
    onClick: onChoose,
    "aria-label": `${brand.name} — ${brand.cta}`,
    style: { ["--grow" as string]: isActive ? 1.7 : active === null ? 1 : 0.8 },
    className: cn(
      "group relative isolate flex min-h-[62svh] flex-1 flex-col justify-center overflow-hidden p-7 text-left md:min-h-0 md:p-9",
      // Only the wide layout re-weights; on mobile every panel stays equal.
      "md:[flex-grow:var(--grow)] md:transition-[flex-grow] md:duration-700 md:ease-[cubic-bezier(0.16,1,0.3,1)]",
      "border-white/10 [&:not(:last-child)]:border-b md:[&:not(:last-child)]:border-b-0 md:[&:not(:last-child)]:border-r",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70",
    ),
  };

  const body = (
    <>
      <PanelEffect brand={brand} isActive={isActive} />

      {/* Accent wash — lifts as the panel takes focus, so the colour follows attention. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700"
        style={{
          background: `radial-gradient(78% 58% at 50% 100%, ${brand.accent}59, transparent 72%)`,
          opacity: isActive ? 1 : 0.42,
        }}
      />
      {/* Everything else recedes rather than disappears — the choice stays visible. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[#0a0708] transition-opacity duration-700"
        style={{ opacity: isDimmed ? 0.55 : 0 }}
      />

      <motion.div variants={content} initial="hidden" animate="show" className="relative">
        <span
          className="text-xs font-bold tracking-[0.28em] transition-colors duration-500"
          style={{ color: isActive ? brand.accent : "rgba(255,255,255,0.35)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Two lines reserved: the descriptors wrap to two at rest but SCOPIO's
            fits on one, which would lift its whole panel out of line with the others. */}
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-white/50 md:min-h-10">
          {brand.descriptor}
        </p>

        <p className="mt-2 text-3xl font-bold leading-[1.05] tracking-[-0.03em] lg:text-4xl">
          <span className="text-white">{brand.wordmark.lead}</span>
          <span className="text-metal-red-shine">{brand.wordmark.accent}</span>
        </p>

        <p className="mt-4 max-w-sm text-base leading-relaxed text-white/70">
          {brand.promise}
        </p>

        {/* Proof arrives with intent on desktop; on mobile it's simply always there.
            The 0fr→1fr grid row collapses it entirely rather than just hiding it —
            merely fading it out would reserve its height, leaving each CTA stranded
            below an invisible block and knocking the three CTAs out of line. */}
        <div
          className={cn(
            "grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isActive ? "md:grid-rows-[1fr]" : "md:grid-rows-[0fr]",
          )}
        >
          <ul
            className={cn(
              "space-y-2 overflow-hidden transition-opacity duration-500",
              isActive ? "opacity-100" : "md:opacity-0",
            )}
          >
            {brand.points.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2.5 pt-2 text-sm text-white/60 first:pt-5"
              >
                <span
                  aria-hidden
                  className="h-1 w-1 shrink-0 rounded-full"
                  style={{ background: brand.accent }}
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <span
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors duration-300"
          style={{ color: isActive ? brand.accent : undefined }}
        >
          {brand.cta}
          {brand.external ? (
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </span>
      </motion.div>
    </>
  );

  // External businesses navigate away; Infotech is already here, so it just lifts
  // the overlay off the homepage rendered beneath it.
  return brand.external ? (
    <a href={brand.href} rel="noopener" {...shared}>
      {body}
    </a>
  ) : (
    <button type="button" {...shared}>
      {body}
    </button>
  );
}

/**
 * Per-panel signature backdrop, built from the same CSS vocabulary as the page
 * heroes (globals.css) — a precise grid for the engineering business, drifting
 * streaks for the training arm, orbit rings for the AI platform. All decorative,
 * all GPU-cheap: opacity and transform only.
 */
function PanelEffect({ brand, isActive }: { brand: Brand; isActive: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden transition-opacity duration-700"
      style={{ opacity: isActive ? 1 : 0.5 }}
    >
      {brand.effect === "blueprint" ? (
        <div className="fx-grid-static absolute inset-0" />
      ) : null}

      {brand.effect === "streaks" ? (
        <div className="fx-streaks absolute inset-0" />
      ) : null}

      {brand.effect === "orbit" ? (
        <div className="absolute inset-0 grid place-items-center">
          {/* Capped against the viewport: a fixed rem size overflows a narrow
              phone, and a rotated square's bounding box is √2× its side — enough
              to widen the document and zoom the whole page out. */}
          <div className="relative h-[min(26rem,60vw)] w-[min(26rem,60vw)] opacity-70">
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-[22%] rounded-full border border-white/10" />
            <div className="absolute inset-0 animate-[hero-spin_26s_linear_infinite]">
              <span
                className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full"
                style={{ background: brand.accent, boxShadow: `0 0 14px 3px ${brand.accent}99` }}
              />
            </div>
            <div className="absolute inset-[22%] animate-[hero-spin-rev_20s_linear_infinite]">
              <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/70" />
            </div>
          </div>
        </div>
      ) : null}

      {/* Grounds each panel in the same near-black the heroes resolve to. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0708] to-transparent" />
    </div>
  );
}
