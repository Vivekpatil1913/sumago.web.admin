"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/** How long each frame holds before the next one crosses in. */
const HOLD_MS = 5000;
/** Crossfade duration. Long enough to read as a dissolve, short enough that
 *  two photographs are never both half-visible for a noticeable beat. */
const FADE_MS = 900;

export type Slide = {
  src: string;
  alt: string;
  /** Short label for the dot's accessible name — "the office floor", not a
   *  second copy of the alt text. */
  label: string;
  /**
   * How the photograph meets the frame. `cover` (the default) fills it and
   * crops whatever does not fit — right for anything near the frame's own
   * proportions.
   *
   * `contain` fits the whole photograph inside instead, and is for frames far
   * wider or taller than the slot: a 2.9:1 panorama cropped to 16/9 loses a
   * sixth off each end, which on a photograph of the team means losing people.
   * The gap that leaves is filled with a blurred, over-scaled copy of the same
   * image, so the frame still reads as one photograph rather than a picture
   * sitting between two empty bars.
   */
  fit?: "cover" | "contain";
};

/**
 * The /about story image, as a three-frame dissolve.
 *
 * **Why a slideshow at all.** The section opens the founding story, and one
 * still could only say one thing about it. Three say the whole sentence: the
 * team on the floor today, and the two founders on a stage — the company and
 * the people who built it, in the space a single frame used to hold.
 *
 * **Why it is safe to autoplay.** Autoplay is normally a trust cost: motion the
 * reader did not ask for, competing with the copy beside it. Three rules keep
 * this one honest —
 *
 *   1. It stops on hover and on keyboard focus, so it never moves under someone
 *      reading or operating it.
 *   2. It stops when scrolled out of view (`IntersectionObserver`), so it is not
 *      burning frames off-screen while the reader is four sections down.
 *   3. Under `prefers-reduced-motion` it does not run at all: the first frame
 *      renders, the dots still work, and nothing dissolves (docs/06).
 *
 * **Cost.** Every frame is in the DOM from the start, stacked and cross-faded on
 * `opacity` alone — compositor-only, no layout, no paint (docs/14). Only the
 * first frame is `priority`; the other two load lazily, so the LCP image is the
 * one that is actually visible on arrival.
 *
 * **The scrim.** A bottom-weighted wash of near-black over the photograph. It is
 * there to seat the dots — white controls on an unpredictable photograph are
 * illegible half the time — and to stop the frame's bright top edge from
 * competing with the heading above it. It is deliberately light: at 45% over the
 * lower edge and clear by the middle, it darkens the corner the controls sit in
 * without dimming the faces.
 */
export function StorySlideshow({
  slides,
  className,
}: {
  slides: Slide[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  /* Two independent reasons to hold: the pointer/focus is inside, or the
     component is off-screen. Kept apart so leaving the frame while it is still
     scrolled away does not restart it. */
  const [engaged, setEngaged] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const advance = useCallback(() => {
    setIndex((current) => (current + 1) % slides.length);
  }, [slides.length]);

  /* Only observe visibility — the timer below reads the result. A 25% threshold
     rather than 0: a frame one pixel into the viewport is not being looked at. */
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || engaged || !onScreen || slides.length < 2) return;
    const timer = window.setInterval(advance, HOLD_MS);
    return () => window.clearInterval(timer);
    /* `index` is a dependency on purpose: choosing a dot restarts the hold, so
       a frame the reader just picked gets its full time rather than whatever
       was left on the previous frame's clock. */
  }, [advance, engaged, index, onScreen, reduce, slides.length]);

  return (
    <div
      ref={frameRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Sumago's story in pictures"
      onPointerEnter={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
      onFocusCapture={() => setEngaged(true)}
      onBlurCapture={() => setEngaged(false)}
      /* Same frame the single `Media` still used, so swapping it in changed no
         geometry: 16/9, rounded, hairline ring. */
      className={cn(
        "relative aspect-[16/9] overflow-hidden rounded-xl bg-mist ring-1 ring-line",
        className,
      )}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          /* `aria-hidden` on the frames that are not showing, so a screen
             reader is not read three photographs where a sighted reader sees
             one. */
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity ease-standard motion-reduce:transition-none",
            i === index ? "opacity-100" : "opacity-0",
          )}
          style={{ transitionDuration: `${FADE_MS}ms` }}
        >
          {/* Blurred fill behind a contained photograph. Deliberately requested
              at a tiny width — it is scaled up and blurred past recognition, so
              a full-size second copy would be bytes spent on something nobody
              can resolve. */}
          {slide.fit === "contain" ? (
            <Image
              src={slide.src}
              alt=""
              aria-hidden
              fill
              sizes="64px"
              className="scale-125 object-cover opacity-70 blur-2xl"
            />
          ) : null}

          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority={i === 0}
            className={cn(
              "relative",
              slide.fit === "contain" ? "object-contain" : "object-cover",
            )}
          />
        </div>
      ))}

      {/* Scrim — see the component note. Sits above the frames, below the
          controls, and never intercepts a pointer. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/10 to-transparent"
      />

      {/* Dots. Real buttons, not decorative spans: this is the only way to
          reach a specific frame without waiting for it to come round. */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 sm:bottom-4 sm:right-4">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${slide.label}`}
            aria-current={i === index}
            className={cn(
              "h-2.5 rounded-full ring-1 ring-inset ring-white/50 transition-all duration-300 ease-standard",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
              i === index
                ? "w-6 bg-white"
                : "w-2.5 bg-white/45 hover:bg-white/75",
            )}
          />
        ))}
      </div>
    </div>
  );
}
