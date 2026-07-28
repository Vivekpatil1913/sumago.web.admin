"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

/**
 * Global AOS (Animate On Scroll) initializer — mounted once in the root layout.
 *
 * Complements the Framer Motion `Reveal` system: use `Reveal` for orchestrated,
 * reduced-motion-aware section reveals; use declarative `data-aos` attributes for
 * lightweight staggered card/CTA entrances. Don't apply both to the same element.
 *
 * Honors `prefers-reduced-motion` (a non-negotiable, CLAUDE.md / docs/06) by
 * disabling AOS entirely for those users, and refreshes on route change so
 * newly-rendered elements are registered.
 */
export function AosInit() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 1000, // animation length in ms
      easing: "ease-in-out",
      once: true, // animate only the first time into view
      offset: 80, // trigger 80px before the element enters viewport
      // Respect the user's motion preference — required, not optional.
      disable: () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);

  // Re-scan the DOM after client-side navigations so new elements animate.
  useEffect(() => {
    AOS.refresh();
  }, [pathname]);

  return null;
}
