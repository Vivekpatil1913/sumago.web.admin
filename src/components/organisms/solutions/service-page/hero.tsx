import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { HeroEffect } from "@/components/organisms/hero-effect";
import { HeroStars } from "@/components/three/hero-stars";
import { CAPABILITY_ICONS, FALLBACK_CAPABILITY_ICON } from "@/lib/capability-icons";
import type { ServiceWithSlug } from "@/lib/services";
import type { ServicePageContent } from "@/lib/service-page";

/**
 * 01 · HERO
 *
 * The only place on the page where the brand is allowed to be loud: the dark
 * cinematic surface, the gradient plate, the 3D starfield. It is also the
 * surface every other page on the site opens with, so a service page reads as
 * part of the same site before anything else is understood.
 *
 * The composition is the home hero's: one centred column — chip, headline,
 * subtitle, CTAs — carried entirely by type over the dark surface, with no
 * illustration beneath it. A visitor landing here from a search result meets
 * the same shape they would have met on the front page, so the two read as one
 * site.
 *
 * The headline leads with a business outcome and closes on the service name in
 * the brand gradient, so the outcome sells and the name confirms where the
 * visitor landed — in that order.
 *
 * The device illustration (`DeviceComposition`, below) no longer rides in the
 * hero — it now appears once, in the Understanding section, for services whose
 * `heroVisual` is `devices`. It stays here because that section imports it.
 * Drawn, never stock (CLAUDE.md); pure CSS/SVG from system tokens, so it ships
 * no JS and no image request.
 */
export function ServiceHero({
  service,
  content,
}: {
  service: ServiceWithSlug;
  content: ServicePageContent;
}) {
  const { hero } = content;

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0a0708] text-white">
      {/* The bundle asked for a red-tinted circuit field. `HeroEffect` no
          longer takes one: brand red belongs to the content, not to a backdrop
          sitting behind the words (see its header). Geometry is unchanged. */}
      <HeroEffect variant="circuit" particles={false} />
      <HeroStars formation="torus" />

      <div className="container-page relative z-10 flex min-h-[100svh] flex-col items-center justify-center gap-[clamp(0.75rem,2vh,1.5rem)] pb-[clamp(3rem,6vh,5rem)] pt-[clamp(6rem,12vh,9rem)] text-center">
        <Link
          href="/solutions"
          /* `py-1 -my-1` lifts the target to the 24px WCAG 2.2 minimum without
             moving the link: a 20px-tall text link is a real miss on a phone. */
          className="-my-1 inline-flex w-fit items-center gap-1.5 py-1 text-sm font-medium text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft size={15} aria-hidden />
          All services
        </Link>

        {/* Lifecycle stage — the same chip the home hero opens with. */}
        <span className="chip border-white/15 bg-white/[0.07] text-xs font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span
              aria-hidden
              className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          {hero.eyebrow}
        </span>

        <h1 className="max-w-[20ch] text-balance text-[2.25rem] font-bold leading-[1.06] tracking-[-0.03em] sm:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem]">
          {hero.statement}
          <span className="mt-2 block text-metal-red-shine">{service.name}</span>
        </h1>

        <p className="max-w-2xl text-lg leading-[1.65] text-white/70 md:text-xl">
          {hero.subtitle}
        </p>

        <div className="mt-[clamp(0.25rem,1.5vh,1rem)] flex flex-wrap items-center justify-center gap-4">
          <Button href="/contact" size="lg">
            Book a consultation
          </Button>
          <Button
            href="#understanding"
            variant="outline"
            size="lg"
            className="border-white/25 text-white hover:bg-white/10"
          >
            {hero.cta}
            <ArrowRight size={16} aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Illustration — devices                                                     */
/* -------------------------------------------------------------------------- */

/**
 * A phone carrying an abstract app surface, with a notification and a metric
 * card floating beside it at different drift rates. Centred beneath the hero
 * copy, so the box is sized to the handset rather than to a column.
 *
 * Every element is a token already in the system — brand plate, hairline
 * border, mist-equivalent bars — so it reads as *our* product rather than as an
 * illustration bought to fill the space. The drift uses the existing
 * `tile-float` keyframe and is neutralised for `prefers-reduced-motion` by the
 * global rule in globals.css.
 */
export function DeviceComposition({ service }: { service: ServiceWithSlug }) {
  const Icon = CAPABILITY_ICONS[service.icon] ?? FALLBACK_CAPABILITY_ICON;

  return (
    <div
      aria-hidden
      className="relative mx-auto h-[28rem] w-full max-w-[26rem]"
    >
      <span className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(215,52,56,0.2),transparent_65%)]" />

      {/* The handset */}
      <div className="absolute left-1/2 top-1/2 h-[27rem] w-[13.5rem] -translate-x-1/2 -translate-y-1/2 animate-[tile-float_7s_ease-in-out_infinite] rounded-[2.25rem] border border-white/15 bg-[linear-gradient(160deg,#161113,#0b0809)] p-2.5 shadow-[0_50px_90px_-40px_rgba(0,0,0,0.9)]">
        <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-[#0f0b0d]">
          {/* notch */}
          <span className="absolute left-1/2 top-2.5 h-1.5 w-14 -translate-x-1/2 rounded-full bg-white/15" />

          {/* app header */}
          <div className="flex items-center gap-2.5 px-4 pt-9">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#d73438,#7a1519)]">
              <Icon size={15} strokeWidth={2} className="text-white" />
            </span>
            <span className="flex-1 space-y-1.5">
              <span className="block h-1.5 w-16 rounded-full bg-white/25" />
              <span className="block h-1.5 w-10 rounded-full bg-white/10" />
            </span>
          </div>

          {/* feature card */}
          <div className="mx-4 mt-4 rounded-2xl border border-white/10 bg-[linear-gradient(150deg,rgba(215,52,56,0.28),rgba(215,52,56,0.05))] p-3.5">
            <span className="block h-1.5 w-12 rounded-full bg-white/35" />
            <span className="mt-2.5 block h-4 w-24 rounded-md bg-white/70" />
            <span className="mt-3 inline-block h-5 w-16 rounded-full bg-white/85" />
          </div>

          {/* list rows */}
          <div className="mt-4 space-y-2.5 px-4">
            {[0, 1, 2].map((r) => (
              <div
                key={r}
                className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5"
              >
                <span className="h-6 w-6 shrink-0 rounded-lg bg-white/10" />
                <span className="flex-1 space-y-1.5">
                  <span className="block h-1.5 w-full rounded-full bg-white/20" />
                  <span className="block h-1.5 w-2/3 rounded-full bg-white/10" />
                </span>
              </div>
            ))}
          </div>

          {/* tab bar */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-white/10 bg-white/[0.04] px-4 py-3.5">
            <span className="h-1.5 w-6 rounded-full bg-brand" />
            {[0, 1, 2].map((t) => (
              <span key={t} className="h-1.5 w-6 rounded-full bg-white/15" />
            ))}
          </div>
        </div>
      </div>

      {/* Floating notification — dropped on the narrowest screens, where it
          would sit on top of the handset rather than beside it. */}
      <div className="absolute right-0 top-[14%] hidden w-[11.5rem] sm:block animate-[tile-float_6s_ease-in-out_infinite] rounded-2xl border border-white/12 bg-white/[0.07] p-3 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md [animation-delay:-2s]">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-brand shadow-[0_0_10px_rgba(215,52,56,0.9)]" />
          <span className="flex-1 space-y-1.5">
            <span className="block h-1.5 w-full rounded-full bg-white/35" />
            <span className="block h-1.5 w-1/2 rounded-full bg-white/15" />
          </span>
        </div>
      </div>

      {/* Floating metric card with a sparkline */}
      <div className="absolute bottom-[13%] left-0 hidden w-[10.5rem] sm:block animate-[tile-float_8s_ease-in-out_infinite] rounded-2xl border border-white/12 bg-white/[0.07] p-3.5 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md [animation-delay:-4s]">
        <span className="block h-1.5 w-10 rounded-full bg-white/25" />
        <svg viewBox="0 0 100 34" className="mt-3 h-9 w-full" fill="none">
          <polyline
            points="0,28 16,22 32,25 48,14 64,17 80,7 100,3"
            stroke="#ff5a5d"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="0,28 16,22 32,25 48,14 64,17 80,7 100,3 100,34 0,34"
            fill="rgba(215,52,56,0.16)"
          />
        </svg>
      </div>
    </div>
  );
}
