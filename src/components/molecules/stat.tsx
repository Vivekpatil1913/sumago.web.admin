"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type StatProps = {
  value: string; // e.g. "700+", "13+", "ISO"
  label: string;
  className?: string;
  /** Number treatment: brand red, brushed black metal, metallic gold, or brushed silver. */
  tone?: "brand" | "metal" | "gold" | "silver";
  /** Recolor the label for dark backgrounds (numeral tones already read on dark). */
  dark?: boolean;
};

/** Splits "700+" -> { num: 700, suffix: "+" }; non-numeric returns null num. */
function parse(value: string) {
  const m = value.match(/^(\d[\d,]*)(.*)$/);
  if (!m) return { num: null as number | null, prefix: value, suffix: "" };
  return { num: Number(m[1].replace(/,/g, "")), prefix: "", suffix: m[2] };
}

/** Trust metric with count-up on scroll (reduced-motion shows final value). */
export function Stat({ value, label, className, tone = "brand", dark = false }: StatProps) {
  const { num, suffix } = parse(value);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(num === null || reduce ? value : "0");

  useEffect(() => {
    if (num === null || reduce || !inView) return;
    let frame = 0;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * num).toLocaleString() + suffix);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, num, suffix, reduce]);

  return (
    <div ref={ref} className={cn("text-center", className)}>
      <div
        className={cn(
          "font-display text-4xl font-bold md:text-5xl",
          tone === "metal" && "text-metal-black",
          tone === "gold" && "text-metal-gold",
          tone === "silver" && "text-silver",
          tone === "brand" && "text-brand",
        )}
      >
        {display}
      </div>
      <div className={cn("mt-1 text-sm", dark ? "text-white/60" : "text-ink/60")}>{label}</div>
    </div>
  );
}
