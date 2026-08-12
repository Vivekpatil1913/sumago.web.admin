"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Media, isStockAsset } from "@/components/molecules/media-placeholder";

export type ShowcaseItem = {
  slug: string;
  title: string;
  summary: string;
  src: string;
};

type ImpactShowcaseProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  /** Link + label for the "view all" button below the cards. */
  href: string;
  ctaLabel: string;
  items: ShowcaseItem[];
};

const GAP = 24; // matches gap-6

/**
 * Horizontal, snap-scrolling showcase of flagship work: a centered heading,
 * cards flanked by prev/next arrows (one each side), and a "view all" button
 * below. Each card carries only its image, title, and subtitle.
 */
export function ImpactShowcase({
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
  items,
}: ImpactShowcaseProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [reduced, setReduced] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    update();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const amount = card ? card.offsetWidth + GAP : el.clientWidth * 0.8;
    el.scrollBy({ left: amount * dir, behavior: reduced ? "auto" : "smooth" });
  };

  const arrowClass =
    "hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-line disabled:hover:text-ink sm:grid";

  return (
    <div>
      {/* Centered heading */}
      <div className="container-page">
        <div className="mx-auto max-w-5xl text-center" data-aos="fade-up">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">{title}</h2>
        {description ? (
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink/70">
            {description}
          </p>
        ) : null}
        </div>
      </div>

      {/* Full-bleed carousel — an arrow on each side of the cards */}
      <div className="mt-12 flex items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <button
          type="button"
          onClick={() => scroll(-1)}
          disabled={!canPrev}
          aria-label="Previous projects"
          className={arrowClass}
        >
          <ArrowLeft size={18} />
        </button>

        <div
          ref={trackRef}
          role="region"
          aria-label="Featured projects"
          className="no-scrollbar flex min-w-0 flex-1 snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
        >
          {items.map((item, i) => (
            <Link
              key={item.slug}
              href={`/impact/${item.slug}`}
              data-aos="fade-up"
              data-aos-delay={(i % 4) * 80}
              className="group flex w-[82%] shrink-0 snap-start flex-col sm:w-[420px]"
            >
              <div className="overflow-hidden rounded-2xl">
                <Media
                  src={item.src}
                  alt={item.title}
                  ratio="16/11"
                  sizes="(max-width: 640px) 82vw, 420px"
                  className="rounded-2xl transition-transform duration-500 group-hover:scale-[1.04]"
                  stock={isStockAsset(item.src)}
                />
              </div>
              <h3 className="mt-5 text-xl font-bold leading-snug text-ink transition-colors group-hover:text-brand-ink">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                {item.summary}
              </p>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll(1)}
          disabled={!canNext}
          aria-label="Next projects"
          className={arrowClass}
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* View-all button, below the cards */}
      <div className="container-page">
        <div className="mt-10 flex justify-center">
          <Link
            href={href}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/15 bg-paper px-5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            {ctaLabel}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
