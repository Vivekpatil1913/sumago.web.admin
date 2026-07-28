"use client";

import { useEffect, useRef, useState } from "react";

export type Chapter = { id: string; label: string };

/**
 * Sticky chapter rail for the service detail page.
 *
 * The page runs long by design (problem → qualify → answer → artifacts →
 * outcomes → stack → proof → trust), so a reader needs to know where they are
 * and how much is left. The rail spies on the sections actually rendered — it
 * is handed only the chapters that exist for this service, so a service without
 * `whoFor` or without proof simply gets a shorter rail, never a dead link.
 *
 * Sits directly under the fixed 64px header. Below `lg` it scrolls
 * horizontally rather than wrapping, so it never eats vertical space on a
 * phone. The progress bar underneath tracks reading position through the
 * chapters, which is the one piece of motion here that earns its place
 * (docs/06) — it aids navigation.
 */
export function ServiceNav({ chapters }: { chapters: Chapter[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    /* The topmost section whose start has passed the rail wins — simple, and it
       never flickers between two sections that are both on screen. */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-128px 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [chapters]);

  /* Keep the active chip in view on narrow screens. */
  useEffect(() => {
    const list = listRef.current;
    const chip = list?.querySelector<HTMLElement>(`[data-chapter="${activeId}"]`);
    if (!list || !chip) return;
    const overflowsLeft = chip.offsetLeft < list.scrollLeft;
    const overflowsRight =
      chip.offsetLeft + chip.offsetWidth > list.scrollLeft + list.clientWidth;
    if (overflowsLeft || overflowsRight) {
      list.scrollTo({
        left: chip.offsetLeft - 16,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }
  }, [activeId]);

  const index = Math.max(
    0,
    chapters.findIndex((c) => c.id === activeId),
  );
  const progress = chapters.length > 1 ? (index / (chapters.length - 1)) * 100 : 100;

  if (chapters.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-16 z-40 border-b border-line/80 bg-paper/85 backdrop-blur-md"
    >
      <div className="container-page">
        <ul
          ref={listRef}
          className="-mx-1 flex items-center gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {chapters.map((c, i) => {
            const isActive = c.id === activeId;
            return (
              <li key={c.id} className="shrink-0">
                <a
                  href={`#${c.id}`}
                  data-chapter={c.id}
                  aria-current={isActive ? "true" : undefined}
                  className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  style={{
                    background: isActive ? "rgba(215,52,56,0.08)" : "transparent",
                    color: isActive ? "var(--color-brand-ink)" : "rgba(26,26,26,0.5)",
                  }}
                >
                  <span
                    aria-hidden
                    className="font-display tabular-nums transition-colors duration-300"
                    style={{
                      color: isActive ? "var(--color-brand)" : "rgba(26,26,26,0.25)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {c.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Reading progress through the chapters */}
      <div aria-hidden className="h-px w-full bg-line">
        <div
          className="h-px bg-gradient-to-r from-brand to-brand/40 transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </nav>
  );
}
