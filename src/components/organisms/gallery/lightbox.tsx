"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type LightboxImage = { src: string; alt: string };

type LightboxProps = {
  images: LightboxImage[];
  /** Index of the photo to open on. */
  startIndex?: number;
  onClose: () => void;
  /** Seconds each photo holds during slideshow playback. */
  slideshowInterval?: number;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;
/** Horizontal travel that counts as a swipe rather than a stray tap. */
const SWIPE_PX = 60;

/** Clamp a number into a range. */
function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/**
 * Toolbar / navigation control. One shape for every button in the overlay so the
 * chrome reads as a single toolbar rather than a row of ad-hoc icons.
 */
function Control({
  label,
  onClick,
  disabled,
  active,
  large,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  large?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn(
        "grid place-items-center rounded-full border border-white/15 bg-white/10 text-white/85 backdrop-blur transition-colors duration-200",
        "hover:border-white/30 hover:bg-white/20 hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "disabled:pointer-events-none disabled:opacity-30",
        active && "border-brand bg-brand text-white hover:bg-brand",
        large ? "h-12 w-12" : "h-10 w-10",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Full-screen photo viewer: zoom, pan, slideshow, native fullscreen, keyboard
 * navigation, and a thumbnail rail.
 *
 * Rendered through a portal on `document.body` — the galleries that open it sit
 * inside transformed, masked, `overflow-hidden` marquee tracks, and a fixed
 * overlay nested in one of those would be clipped to the strip.
 *
 * Zoom is a CSS transform on the frame rather than a larger request: the source
 * files are already full-resolution, so scaling stays on the compositor and
 * costs no extra bytes at the exact moment the visitor is looking closely.
 *
 * Keyboard: ←/→ navigate · +/− zoom · 0 resets · F fullscreen · Space plays or
 * pauses the slideshow · Esc leaves fullscreen, then closes.
 */
export function Lightbox({
  images,
  startIndex = 0,
  onClose,
  slideshowInterval = 4,
}: LightboxProps) {
  const [index, setIndex] = useState(() => clamp(startIndex, 0, images.length - 1));
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [playing, setPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [rail, setRail] = useState({ overflows: false, atStart: true, atEnd: false });

  const rootRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  /* Pointer position and offset captured at drag start, so panning is measured
     from where the grab began rather than accumulating rounding drift. */
  const dragFrom = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  const count = images.length;
  const current = images[index];

  const resetView = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + count) % count);
      resetView();
    },
    [count, resetView],
  );

  const jumpTo = useCallback(
    (i: number) => {
      setIndex(i);
      resetView();
    },
    [resetView],
  );

  /* Zooming out to 1 must also drop the pan offset, or the photo stays parked
     off-centre with no visible handle left to drag it back. */
  const zoomBy = useCallback((delta: number) => {
    setZoom((z) => {
      const next = clamp(Number((z + delta).toFixed(2)), MIN_ZOOM, MAX_ZOOM);
      if (next === MIN_ZOOM) setOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);

  /* Fullscreen targets the overlay element, not the document: the toolbar and
     the thumbnail rail have to come along, otherwise the controls vanish at the
     moment the visitor most wants them. */
  const toggleFullscreen = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.().catch(() => setIsFullscreen(false));
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  /* Slideshow. Restarts on every index change, so a manual arrow press gives the
     next photo its full turn instead of whatever was left of the last one. */
  useEffect(() => {
    if (!playing || count < 2) return;
    const id = window.setInterval(() => go(1), slideshowInterval * 1000);
    return () => window.clearInterval(id);
  }, [playing, count, index, go, slideshowInterval]);

  /* Lock the page behind the overlay and restore the trigger's focus on close —
     a visitor who opened the fourth tile lands back on the fourth tile.

     The lock has to reach <html>: globals.css makes the root a scroll container
     (`overflow-x: clip`), so `body { overflow: hidden }` alone left the page's
     vertical scrollbar sitting down the right edge of the viewer. Removing it
     reclaims its width, which would shift the page under the overlay — so the
     gutter is paid back as body padding while the viewer is open. */
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const prev = {
      root: root.style.overflow,
      body: document.body.style.overflow,
      pad: document.body.style.paddingRight,
    };
    const gutter = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    rootRef.current?.focus();
    return () => {
      root.style.overflow = prev.root;
      document.body.style.overflow = prev.body;
      document.body.style.paddingRight = prev.pad;
      opener?.focus?.();
    };
  }, []);

  /* Keep the active thumbnail in view as the slideshow advances. */
  useEffect(() => {
    const el = thumbsRef.current;
    const active = el?.querySelector<HTMLElement>('[data-active="true"]');
    if (!el || !active) return;
    el.scrollTo({
      left: active.offsetLeft - el.clientWidth / 2 + active.clientWidth / 2,
      behavior: "smooth",
    });
  }, [index]);

  /* Which way the thumbnail rail can still travel, so its arrows can grey out
     at each end rather than leaving the visitor pressing a dead control. */
  const measureRail = useCallback(() => {
    const el = thumbsRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setRail({
      overflows: max > 1,
      atStart: el.scrollLeft <= 1,
      atEnd: el.scrollLeft >= max - 1,
    });
  }, []);

  useEffect(() => {
    measureRail();
    window.addEventListener("resize", measureRail);
    return () => window.removeEventListener("resize", measureRail);
  }, [measureRail, count]);

  /* Roughly a screenful per press, less an overlap so the thumbnail that was at
     the edge stays visible and the eye keeps its place. */
  const scrollRail = (dir: 1 | -1) => {
    const el = thumbsRef.current;
    el?.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          /* In fullscreen the browser consumes Escape to exit; closing here too
             would drop the visitor out of the gallery entirely in one press. */
          if (!document.fullscreenElement) onClose();
          break;
        case "ArrowRight":
          go(1);
          break;
        case "ArrowLeft":
          go(-1);
          break;
        case "+":
        case "=":
          zoomBy(ZOOM_STEP);
          break;
        case "-":
        case "_":
          zoomBy(-ZOOM_STEP);
          break;
        case "0":
          resetView();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        case " ":
          e.preventDefault();
          setPlaying((p) => !p);
          break;
        case "Tab": {
          /* Trap focus: the page behind is inert and tabbing out of a modal
             viewer strands the keyboard on controls nobody can see. */
          const focusable = rootRef.current?.querySelectorAll<HTMLElement>(
            "button:not([disabled])",
          );
          if (!focusable?.length) break;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          break;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose, resetView, toggleFullscreen, zoomBy]);

  const onWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && Math.abs(e.deltaY) < 4) return;
    zoomBy(e.deltaY > 0 ? -ZOOM_STEP / 2 : ZOOM_STEP / 2);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragFrom.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    if (zoom === MIN_ZOOM) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setOffset({
      x: dragFrom.current.ox + (e.clientX - dragFrom.current.x),
      y: dragFrom.current.oy + (e.clientY - dragFrom.current.y),
    });
  };

  /* At 1× the same horizontal drag is a swipe — the only way to reach the next
     photo on a phone, where the arrow buttons are a thumb-stretch away. Above
     1× the gesture belongs to panning. */
  const onPointerUp = (e: React.PointerEvent) => {
    if (zoom === MIN_ZOOM && count > 1) {
      const dx = e.clientX - dragFrom.current.x;
      if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
    }
    setDragging(false);
  };

  const endDrag = () => setDragging(false);

  /* `document` is absent while a client component is prerendered on the server;
     the galleries only mount this after a click, but the guard keeps it safe to
     render from anywhere. */
  if (!current || typeof document === "undefined") return null;
  const zoomed = zoom > MIN_ZOOM;

  const overlay = (
    <div
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer, ${index + 1} of ${count}`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm focus:outline-none"
    >
      {/* Top bar: position on the left, controls on the right. */}
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <p className="text-sm font-semibold tabular-nums text-white/70">
          <span className="text-white">{index + 1}</span> / {count}
        </p>
        <div className="flex items-center gap-2">
          <Control label="Zoom in" onClick={() => zoomBy(ZOOM_STEP)} disabled={zoom >= MAX_ZOOM}>
            <ZoomIn className="h-5 w-5" aria-hidden />
          </Control>
          <Control label="Zoom out" onClick={() => zoomBy(-ZOOM_STEP)} disabled={zoom <= MIN_ZOOM}>
            <ZoomOut className="h-5 w-5" aria-hidden />
          </Control>
          <Control label="Reset zoom" onClick={resetView} disabled={!zoomed}>
            <RotateCcw className="h-5 w-5" aria-hidden />
          </Control>
          <Control
            label={playing ? "Pause slideshow" : "Play slideshow"}
            onClick={() => setPlaying((p) => !p)}
            active={playing}
            disabled={count < 2}
          >
            {playing ? (
              <Pause className="h-5 w-5" aria-hidden />
            ) : (
              <Play className="h-5 w-5" aria-hidden />
            )}
          </Control>
          <Control
            label={isFullscreen ? "Exit full screen" : "Full screen"}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" aria-hidden />
            ) : (
              <Maximize2 className="h-5 w-5" aria-hidden />
            )}
          </Control>
          <Control label="Close photo viewer" onClick={onClose}>
            <X className="h-5 w-5" aria-hidden />
          </Control>
        </div>
      </div>

      {/* Stage. */}
      <div className="relative flex-1 overflow-hidden">
        {/* Clicking the empty space around the photo closes, the way every
            viewer behaves — but only when not zoomed, where that same drag
            gesture is panning. */}
        <button
          type="button"
          aria-label="Close photo viewer"
          tabIndex={-1}
          onClick={onClose}
          className={cn("absolute inset-0 h-full w-full cursor-default", zoomed && "hidden")}
        />

        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center p-4 sm:p-8",
          )}
        >
          <div
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={endDrag}
            onDoubleClick={() => (zoomed ? resetView() : zoomBy(ZOOM_STEP * 2))}
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`,
            }}
            className={cn(
              /* touch-none: without it the browser claims the gesture for
                 scrolling and the swipe/pan never reaches the handlers. */
              "pointer-events-auto relative h-full w-full max-w-6xl touch-none will-change-transform",
              !dragging && "transition-transform duration-300 ease-out",
              zoomed ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in",
            )}
          >
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              unoptimized
              priority
              draggable={false}
              sizes="100vw"
              className="select-none object-contain"
            />
          </div>
        </div>

        {count > 1 ? (
          <>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 sm:left-6">
              <Control label="Previous photo" onClick={() => go(-1)} large>
                <ChevronLeft className="h-6 w-6" aria-hidden />
              </Control>
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 sm:right-6">
              <Control label="Next photo" onClick={() => go(1)} large>
                <ChevronRight className="h-6 w-6" aria-hidden />
              </Control>
            </div>
          </>
        ) : null}
      </div>

      {/* Caption + thumbnail rail. */}
      <div className="shrink-0 px-4 pb-4 pt-2 sm:px-6">
        <p className="mx-auto mb-3 max-w-3xl text-center text-sm text-white/70">{current.alt}</p>
        {count > 1 ? (
          /* The native horizontal bar sat as a thick grey slab under the rail —
             the one piece of system chrome in an otherwise black viewer. Hidden
             (`no-scrollbar`, globals.css) and driven by its own arrows instead,
             which is also the only way to move it on a trackpad-less desktop
             once the bar is gone.
             `w-fit` keeps a short rail centred while a long one starts at the
             left: `justify-center` on a scroll container pushes the overflow
             out both sides, and the first thumbnails become unreachable. */
          <div className="mx-auto flex w-fit max-w-full items-center gap-2">
            {rail.overflows ? (
              <Control
                label="Scroll thumbnails left"
                onClick={() => scrollRail(-1)}
                disabled={rail.atStart}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </Control>
            ) : null}

            <div
              ref={thumbsRef}
              onScroll={measureRail}
              className="no-scrollbar flex gap-2 overflow-x-auto py-1"
            >
              {images.map((img, i) => (
                <button
                  key={`${img.src}-${i}`}
                  type="button"
                  data-active={i === index}
                  onClick={() => jumpTo(i)}
                  aria-label={`Show photo ${i + 1}: ${img.alt}`}
                  aria-current={i === index}
                  className={cn(
                    "relative h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    i === index
                      ? "border-brand opacity-100"
                      : "border-transparent opacity-50 hover:opacity-90",
                  )}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {rail.overflows ? (
              <Control
                label="Scroll thumbnails right"
                onClick={() => scrollRail(1)}
                disabled={rail.atEnd}
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </Control>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
