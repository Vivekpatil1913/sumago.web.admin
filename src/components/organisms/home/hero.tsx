"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { HeroVisual } from "@/components/three/hero-visual";
import { company, primaryCta } from "@/lib/site";

/* Easing — a soft, confident "expo-out" used across the entrance. */
const EASE = [0.16, 1, 0.3, 1] as const;

/** Cinematic homepage hero — dark, immersive, outcome-first, trust-forward. */
export function HomeHero() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  // Headline reveal: each line slides up from behind a mask.
  const lineWrap: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
  };
  const line: Variants = {
    hidden: { y: reduce ? 0 : "115%" },
    show: { y: 0, transition: { duration: 0.85, ease: EASE } },
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#0a0708] text-white">
      <HeroVisual />

      {/* Neutral depth layers — subtle light glow + bottom vignette (no red). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5] bg-[radial-gradient(60%_50%_at_50%_35%,rgba(255,255,255,0.05),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-40 bg-gradient-to-t from-[#0a0708] to-transparent"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex min-h-[100svh] w-full max-w-[88rem] flex-col items-center justify-center gap-[clamp(0.75rem,2vh,1.75rem)] px-5 pt-[clamp(5.5rem,9vh,7.5rem)] pb-[clamp(3rem,6vh,5rem)] text-center md:px-8"
      >
        {/* Tagline chip */}
        <motion.span
          variants={item}
          className="chip border-white/15 bg-white/[0.07] text-white/90 backdrop-blur"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          {company.tagline}
        </motion.span>

        {/* Headline — line-by-line mask reveal */}
        <motion.h1
          variants={lineWrap}
          className="max-w-none font-bold leading-[1.04] tracking-[-0.03em] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl"
        >
          <span className="block overflow-hidden pb-[0.12em]">
            <motion.span variants={line} className="block">
              Helping businesses solve complex problems
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <motion.span variants={line} className="block">
              <span className="text-metal-red-shine">through technology.</span>
            </motion.span>
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={item}
          className="max-w-2xl leading-relaxed text-white/70 text-base sm:text-lg"
        >
          A strategic technology partner since {company.foundedYear} — turning
          digital transformation, product engineering, and AI into measurable
          business outcomes for enterprises, startups, and government.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={item}
          className="mt-[clamp(0.25rem,1.5vh,1.25rem)] flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href={primaryCta.href}
            className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-brand font-semibold text-white shadow-[0_0_0_0_rgba(215,52,56,0.5)] transition-all duration-300 hover:bg-brand-strong hover:shadow-[0_10px_40px_-8px_rgba(215,52,56,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0708] h-[clamp(2.75rem,min(4.2vw,6vh),3.75rem)] px-[clamp(1.5rem,min(3vw,4vh),2.75rem)] text-base"
          >
            {primaryCta.label}
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {/* Shine tagline */}
        <motion.span
          variants={item}
          className="mt-4 text-shine text-lg font-bold uppercase tracking-[0.22em] md:mt-8 md:text-2xl"
        >
          Technology · Development · Consulting
        </motion.span>
      </motion.div>

      {/* Animated scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40"
      >
        <div className="mx-auto flex h-9 w-5 justify-center rounded-full border border-white/30 p-1">
          <motion.span
            className="h-2 w-1 rounded-full bg-white/70"
            animate={reduce ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
