"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The narrative spine for a service page.
 *
 * A service page is a story told in eleven chapters, and without a horizon the
 * reader has no sense of being anywhere in it — sections just keep arriving.
 * This is the horizon: a scroll-progress hairline at the very top, and a chapter
 * bar that docks under the header once the hero is behind you, naming where you
 * are and letting you jump.
 *
 * It reads as a contents strip rather than a decorative rail: the labels are
 * always legible, so the reader can see the whole story at a glance instead of
 * hovering blind marks to discover it. That is the navigation ground under
 * docs/06 — it orients, and it shortens the path to any chapter.
 *
 * Unlike the old right-edge rail this works on every width. The strip scrolls
 * horizontally when the chapters outrun the viewport, and the active chapter is
 * kept centred in view, so a phone reader gets the same orientation a desktop
 * reader does — redesigned, not shrunk.
 */

/** Height of the fixed site header (h-16) the bar docks beneath. */
const HEADER_H = 64;
/** The bar's own height — sections carry `scroll-mt-28` to clear both. */
const BAR_H = 48;

export type Chapter = {
  /** Must match the section's `id`. */
  id: string;
  label: string;
};

export function StoryRail({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  /* The bar stays out of the hero — it only docks once the first chapter has
     reached the header, so the opening statement is never framed by chrome. */
  const [docked, setDocked] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const firstSection = useRef<HTMLElement | null>(null);
  const frame = useRef<number | null>(null);

  /* Active chapter: the band crossing the middle of the viewport. The rootMargin
     collapses the observation area to a thin line at 45% height, so exactly one
     section can be intersecting at a time and the callback needs no sorting. */
  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    firstSection.current = sections[0];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [chapters]);

  /* Read progress and dock state, from one rAF-coalesced layout read so a fast
     scroll can't queue more than a single measurement per frame. */
  useEffect(() => {
    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;

        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        setProgress(
          scrollable > 0
            ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
            : 0,
        );

        const first = firstSection.current;
        setDocked(
          first
            ? first.getBoundingClientRect().top <= HEADER_H + BAR_H
            : window.scrollY > window.innerHeight * 0.6,
        );
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  /* Keep the active chapter in view when the strip overflows — otherwise the
     reader is told where they are by a pill they can't see. Horizontal scroll on
     the strip only; `scrollIntoView` would move the page too. */
  const centreActive = useCallback(() => {
    const list = listRef.current;
    if (!list || !active) return;
    if (list.scrollWidth <= list.clientWidth) return;

    const pill = list.querySelector<HTMLElement>(`[data-chapter="${active}"]`);
    if (!pill) return;

    list.scrollTo({
      left: Math.max(0, pill.offsetLeft - (list.clientWidth - pill.offsetWidth) / 2),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [active]);

  useEffect(centreActive, [centreActive]);

  return (
    <>
      {/* Read progress — over the header, so it reads as the page's own edge. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
      >
        <div
          className="h-full origin-left bg-[linear-gradient(90deg,#7a1519,#d73438_55%,#ff5a5d)] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <nav
        aria-label="Chapters on this page"
        className={cn(
          /* Ink glass. The header above it is white once scrolled, so a dark
             strip reads as its own object — a contents band belonging to the
             page, not a second row of site chrome. */
          "fixed inset-x-0 top-16 z-40 border-b border-white/10 bg-[#0a0708]/90 backdrop-blur-xl",
          "transition-[opacity,transform] duration-300 ease-out",
          docked
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0",
        )}
      >
        <div className="container-page">
          <div
            ref={listRef}
            className="no-scrollbar flex items-center gap-0.5 overflow-x-auto py-1.5"
          >
            {chapters.map((c, i) => {
              const isActive = c.id === active;
              return (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  data-chapter={c.id}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5",
                    "transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright/60",
                    isActive ? "bg-brand/20" : "hover:bg-white/[0.07]",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "font-display text-[0.7rem] font-bold leading-none tabular-nums transition-colors duration-200",
                      isActive ? "text-brand-bright/70" : "text-white/30",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "whitespace-nowrap text-[0.8rem] font-semibold leading-none transition-colors duration-200",
                      /* brand-bright is the AA-safe red on near-black (docs/03);
                         brand itself would fail contrast here. */
                      isActive
                        ? "text-brand-bright"
                        : "text-white/55 group-hover:text-white",
                    )}
                  >
                    {c.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
