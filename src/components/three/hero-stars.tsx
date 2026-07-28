"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { StarFormation } from "./hero-stars-scene";

export type { StarFormation };

// Client-only, lazy-loaded 3D scene — kept out of the critical bundle (docs/07).
const HeroStarsScene = dynamic(() => import("./hero-stars-scene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Per-page 3D star formation, layered over each inner page's CSS backdrop.
 * Mirrors the homepage `HeroVisual`: renders only when motion is allowed and
 * WebGL exists, and parks its render loop when the hero scrolls off-screen so
 * the rest of the page stays at 60fps. Degrades to nothing (the CSS backdrop
 * beneath it carries the look) when WebGL/motion is unavailable.
 */
export function HeroStars({ formation }: { formation: StarFormation }) {
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

  // Park the render loop when the hero is off-screen (see HeroStarsScene).
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
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {enable ? <HeroStarsScene formation={formation} active={inView} /> : null}
    </div>
  );
}
