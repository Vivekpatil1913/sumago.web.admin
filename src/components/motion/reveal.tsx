"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  /** Stagger delay in seconds for sequenced reveals. */
  delay?: number;
  /** Animation duration in seconds. */
  duration?: number;
  className?: string;
  as?: "div" | "li" | "section";
};

/**
 * Fade + lift on scroll into view. Purposeful, subtle (docs/06).
 * Respects prefers-reduced-motion (renders instantly, no transform).
 */
export function Reveal({ children, delay = 0, duration = 3, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: [0, 0, 0.2, 1] },
    },
  };

  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </MotionTag>
  );
}
