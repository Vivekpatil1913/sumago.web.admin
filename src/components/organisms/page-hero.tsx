"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { HeroEffect, type HeroVariant } from "@/components/organisms/hero-effect";
import { HeroStars, type StarFormation } from "@/components/three/hero-stars";
import { cn } from "@/lib/utils";

/* Soft, confident "expo-out" — matches the homepage hero entrance. */
const EASE = [0.16, 1, 0.3, 1] as const;

type PageHeroProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Per-page animated backdrop (each page gets its own). */
  variant?: HeroVariant;
  /** Optional 3D star formation layered over the backdrop (one per main page). */
  formation?: StarFormation;
  /** Scale the brand-red backdrop (1 = full; lower = subtler, near-neutral). */
  redOpacity?: number;
  /** Ambient drifting specks in the backdrop. Set false for a clean, dot-free hero. */
  particles?: boolean;
  /** Override the headline's width/size (tailwind-merge wins over the defaults) —
   *  use when a long headline needs to hold a specific number of lines. */
  titleClassName?: string;
  /** Optional CTA row or extra content rendered below the description. */
  children?: React.ReactNode;
};

/**
 * Immersive full-screen hero for inner pages — mirrors the homepage hero
 * (cinematic dark base, centered content, tagline chip, staggered entrance,
 * scroll cue) while each page supplies a different animated effect via
 * `variant`. Covers the viewport; the page content scrolls up beneath it.
 */
export function PageHero({ eyebrow, title, description, variant = "aurora", formation, redOpacity = 1, particles = true, titleClassName, children }: PageHeroProps) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };
  // Headline slides up from behind a mask — clean, modern, deliberate.
  const line: Variants = {
    hidden: { y: reduce ? 0 : "115%" },
    show: { y: 0, transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#0a0708] text-white">
      <HeroEffect variant={variant} redOpacity={redOpacity} particles={particles} />
      {formation ? <HeroStars formation={formation} /> : null}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-page relative z-10 flex min-h-[100svh] flex-col items-center justify-center gap-[clamp(0.75rem,2vh,1.5rem)] pt-[clamp(5.5rem,9vh,7.5rem)] pb-[clamp(3rem,6vh,5rem)] text-center"
      >
        {eyebrow ? (
          <motion.span
            variants={item}
            className="chip border-white/15 bg-white/[0.07] text-white/90 backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            {eyebrow}
          </motion.span>
        ) : null}

        <div className="overflow-hidden pb-[0.22em]">
          <motion.h1
            variants={line}
            className={cn(
              "mx-auto max-w-4xl text-balance text-4xl font-bold leading-[1.12] tracking-[-0.03em] sm:text-5xl lg:text-6xl",
              titleClassName,
            )}
          >
            {title}
          </motion.h1>
        </div>

        {description ? (
          <motion.p
            variants={item}
            className="max-w-2xl text-lg leading-relaxed text-white/70"
          >
            {description}
          </motion.p>
        ) : null}

        {children ? (
          <motion.div variants={item} className="mt-2">
            {children}
          </motion.div>
        ) : null}
      </motion.div>

      {/* Animated scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/40"
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
