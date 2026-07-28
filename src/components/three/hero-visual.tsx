"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Client-only, lazy-loaded 3D scene — kept out of the critical bundle (docs/07).
const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => null,
});

/* Deterministic PRNG so the starfield is identical on server and client. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Build a scattered field of ~70 white star dots once. */
const STAR_BG = (() => {
  const rand = mulberry32(20130419);
  const dots: string[] = [];
  for (let i = 0; i < 70; i++) {
    const x = (rand() * 100).toFixed(2);
    const y = (rand() * 100).toFixed(2);
    const s = (rand() * 1.6 + 0.6).toFixed(2);
    const a = (0.5 + rand() * 0.45).toFixed(2);
    const color = `rgba(255,255,255,${a})`; // white
    dots.push(`radial-gradient(${s}px ${s}px at ${x}% ${y}%, ${color}, transparent)`);
  }
  return dots.join(",");
})();

/** Always-visible CSS starfield (works with no WebGL / reduced motion). */
function Starfield() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 animate-[star-twinkle_6s_ease-in-out_infinite]"
      style={{ backgroundImage: STAR_BG, backgroundRepeat: "no-repeat" }}
    />
  );
}

/**
 * Decorative hero backdrop. A CSS starfield is always shown; the animated 3D
 * twinkle scene is layered on top only when motion is allowed and WebGL exists.
 */
export function HeroVisual() {
  const [enable, setEnable] = useState(false);
  const [inView, setInView] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let webgl = false;
      try {
        const c = document.createElement("canvas");
        webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        webgl = false;
      }
      setEnable(!reduced && webgl);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Park the 3D render loop when the hero scrolls off-screen so it stops
  // burning GPU/CPU — that constant cost is what makes the rest of the page
  // stutter during scroll. Resumes automatically when the hero returns.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <Starfield />
      {enable ? <HeroScene active={inView} /> : null}
    </div>
  );
}
