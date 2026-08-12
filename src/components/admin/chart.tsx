"use client";

/**
 * Dashboard trend charts.
 *
 * Hand-drawn SVG rather than a charting library, for three reasons that all
 * come back to the performance gate in docs/14: a library would add ~50kB to
 * the first admin screen anyone opens, it would need its own theming layer to
 * follow the panel's light/dark tokens, and none of these three charts is
 * complicated enough to need one.
 *
 * Everything here reads its colour from a CSS custom property, so a chart is
 * correct in both themes without a single JavaScript branch.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/components/admin/ui";

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ChartDelta {
  percent: number;
  direction: "up" | "down" | "flat";
  label: string;
}

/**
 * Both forms of the noun a series counts.
 *
 * Spelled out rather than derived, because the words that actually appear here
 * are the ones English does not pluralise by adding an "s" — an enquiry, five
 * enquiries.
 */
export interface ChartUnit {
  one: string;
  many: string;
}

/* ---------------------------------------------------------------- helpers */

const numbers = new Intl.NumberFormat();

/** "8 Aug" — the x-axis unit for both time series. */
function shortDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function pointLabel(point: ChartPoint, axis: "date" | "text"): string {
  return axis === "date" ? shortDate(point.label) : point.label;
}

/**
 * The chart's accessible name.
 *
 * A screen reader gets the same three facts a sighted reader takes from the
 * shape — the total, the span, and where the peak sits — rather than a table of
 * thirty numbers nobody would sit through.
 */
function summarise(
  points: ChartPoint[],
  axis: "date" | "text",
  unit: ChartUnit,
): string {
  if (points.length === 0) return `No ${unit.many} to chart.`;

  const total = points.reduce((sum, point) => sum + point.value, 0);
  const peak = points.reduce(
    (best, point) => (point.value > best.value ? point : best),
    points[0]!,
  );
  const span =
    axis === "date"
      ? `${shortDate(points[0]!.label)} to ${shortDate(points[points.length - 1]!.label)}`
      : `${points.length} categories`;

  if (total === 0) return `No ${unit.many} between ${span}.`;
  return `${numbers.format(total)} ${total === 1 ? unit.one : unit.many} across ${span}. Highest: ${numbers.format(peak.value)} at ${pointLabel(peak, axis)}.`;
}

/**
 * The container's real width, so the geometry is measured pixels rather than a
 * viewBox stretched to fit — which would distort every rounded corner and every
 * stroke by a different amount depending on how wide the panel happens to be.
 *
 * Zero until the first measurement: drawing at a guessed width and correcting a
 * frame later is a visible jolt on a card the eye is already resting on.
 */
function useMeasuredWidth(): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const measured = entries[0]?.contentRect.width ?? 0;
      if (measured > 0) setWidth(measured);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

/* ------------------------------------------------------------ time series */

const CHART_HEIGHT = 132;
/** Headroom above the tallest point, so a peak never touches the top edge. */
const TOP_PAD = 10;

/**
 * A daily series — filled area for traffic, columns for enquiries.
 *
 * Both share one hover model: the pointer picks the nearest day and the whole
 * chart reports it, so there is no need to hit a two-pixel column.
 */
export function TimeSeriesChart({
  points,
  kind,
  color,
  unit,
  axis = "date",
}: {
  points: ChartPoint[];
  kind: "area" | "column";
  /** A CSS custom property name, e.g. "--a-chart-1". */
  color: string;
  /** What the series counts, for the readout and the accessible summary. */
  unit: ChartUnit;
  axis?: "date" | "text";
}) {
  const [ref, width] = useMeasuredWidth();
  const [active, setActive] = useState<number | null>(null);

  const height = CHART_HEIGHT;
  const count = points.length;
  const peak = Math.max(1, ...points.map((point) => point.value));

  // A single point has no horizontal span; centre it rather than divide by zero.
  const xFor = useCallback(
    (index: number) => (count > 1 ? (index / (count - 1)) * width : width / 2),
    [count, width],
  );
  const yFor = useCallback(
    (value: number) => height - (value / peak) * (height - TOP_PAD),
    [height, peak],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (count === 0) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const ratio = (event.clientX - bounds.left) / (bounds.width || 1);
      const index = Math.round(ratio * (count - 1));
      setActive(Math.min(count - 1, Math.max(0, index)));
    },
    [count],
  );

  if (count === 0) return null;

  const gradientId = `chart-fill-${unit.many.replace(/\W+/g, "")}`;
  const hovered = active === null ? null : points[active];

  return (
    <div
      ref={ref}
      className="relative touch-none"
      onPointerMove={onPointerMove}
      onPointerLeave={() => setActive(null)}
    >
      {/* Before the first measurement there is no geometry to draw, only the
          space the chart is about to occupy — held open so the card does not
          jump when it arrives. */}
      {width === 0 ? <div style={{ height: CHART_HEIGHT }} /> : null}

      {width > 0 ? (
        <svg
          role="img"
          aria-label={summarise(points, axis, unit)}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="admin-chart-rise block overflow-visible"
        >
          {/* Baseline. Without it a run of zeroes reads as "chart failed to load". */}
          <line
            x1={0}
            y1={height}
            x2={width}
            y2={height}
            stroke="var(--a-chart-grid)"
            strokeWidth={1}
          />

          {kind === "area" ? (
            <>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={`var(${color})`}
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="100%"
                    stopColor={`var(${color})`}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <path
                d={`M 0 ${height} ${points.map((point, index) => `L ${xFor(index)} ${yFor(point.value)}`).join(" ")} L ${width} ${height} Z`}
                fill={`url(#${gradientId})`}
              />
              <path
                d={points
                  .map(
                    (point, index) =>
                      `${index === 0 ? "M" : "L"} ${xFor(index)} ${yFor(point.value)}`,
                  )
                  .join(" ")}
                fill="none"
                stroke={`var(${color})`}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            points.map((point, index) => {
              // Columns sit on a fixed pitch with a 30% gutter, so a 28-day month
              // and a 31-day one both fill the panel evenly.
              const pitch = width / count;
              const barWidth = Math.max(2, pitch * 0.7);
              const top = point.value === 0 ? height : yFor(point.value);
              return (
                <rect
                  key={point.label}
                  x={index * pitch + (pitch - barWidth) / 2}
                  y={top}
                  width={barWidth}
                  // A day with one enquiry still needs to be visible.
                  height={Math.max(point.value > 0 ? 2 : 0, height - top)}
                  rx={Math.min(3, barWidth / 2)}
                  fill={`var(${color})`}
                  opacity={active === null || active === index ? 1 : 0.4}
                />
              );
            })
          )}

          {hovered ? (
            <>
              <line
                x1={xFor(active!)}
                y1={0}
                x2={xFor(active!)}
                y2={height}
                stroke={`var(${color})`}
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.5}
              />
              {kind === "area" ? (
                <circle
                  cx={xFor(active!)}
                  cy={yFor(hovered.value)}
                  r={4}
                  fill="var(--a-surface)"
                  stroke={`var(${color})`}
                  strokeWidth={2}
                />
              ) : null}
            </>
          ) : null}
        </svg>
      ) : null}

      {/* The readout sits below the plot rather than floating over it: a tooltip
          that covers the very column being inspected is a familiar annoyance. */}
      <p className="mt-2 h-4 text-[11px] font-medium text-muted" aria-hidden>
        {hovered ? (
          <>
            <span className="text-content">
              {numbers.format(hovered.value)}
            </span>{" "}
            {hovered.value === 1 ? unit.one : unit.many} ·{" "}
            {pointLabel(hovered, axis)}
          </>
        ) : (
          <span className="flex justify-between">
            <span>{pointLabel(points[0]!, axis)}</span>
            <span>{pointLabel(points[count - 1]!, axis)}</span>
          </span>
        )}
      </p>
    </div>
  );
}

/* ------------------------------------------------------- category breakdown */

/**
 * A horizontal breakdown — open roles by department.
 *
 * Plain markup rather than SVG: the categories carry names that have to wrap and
 * stay selectable, and a list of labelled bars is something a screen reader
 * already knows how to read without any help from us.
 */
export function CategoryBars({
  points,
  color,
}: {
  points: ChartPoint[];
  color: string;
}) {
  const peak = Math.max(1, ...points.map((point) => point.value));

  return (
    <ul className="space-y-2.5">
      {points.map((point) => (
        <li
          key={point.label}
          className="grid grid-cols-[minmax(0,7.5rem)_1fr_2rem] items-center gap-3"
        >
          <span
            className="truncate text-[13px] text-content-soft"
            title={point.label}
          >
            {point.label}
          </span>
          <span className="h-2.5 overflow-hidden rounded-full bg-canvas-subtle">
            <span
              className="admin-chart-grow block h-full rounded-full"
              style={{
                width: `${Math.max(3, (point.value / peak) * 100)}%`,
                background: `var(${color})`,
              }}
            />
          </span>
          <span className="text-right text-[13px] font-bold tabular-nums text-content">
            {numbers.format(point.value)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* --------------------------------------------------------------- the panel */

const DELTA_TONE = {
  up: "text-ok",
  down: "text-bad",
  flat: "text-muted",
} as const;

const DELTA_ICON = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: ArrowRight,
} as const;

/**
 * The card a chart lives in: headline figure, its movement, then the shape.
 *
 * The figure comes first on purpose. Someone opening the panel between meetings
 * reads one number per card and leaves; the chart is there for the second look.
 */
export function TrendPanel({
  label,
  hint,
  value,
  valueLabel,
  delta,
  children,
}: {
  label: string;
  hint?: string;
  value: number;
  valueLabel: string;
  delta?: ChartDelta;
  children: ReactNode;
}) {
  const DeltaIcon = delta ? DELTA_ICON[delta.direction] : null;

  return (
    <figure className="admin-card flex h-full flex-col p-5 transition-shadow duration-200 group-hover:shadow-[var(--a-shadow-pop)]">
      <figcaption>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted">
          {label}
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="text-[2rem] font-bold leading-none tabular-nums tracking-tight text-content">
            {numbers.format(value)}
          </span>
          <span className="text-xs text-muted">{valueLabel}</span>

          {delta && DeltaIcon ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-semibold",
                DELTA_TONE[delta.direction],
              )}
            >
              <DeltaIcon className="h-3.5 w-3.5" aria-hidden />
              {delta.direction === "flat"
                ? "No change"
                : delta.percent > 0
                  ? `${delta.percent}%`
                  : "New"}
              <span className="sr-only"> {delta.label}</span>
            </span>
          ) : null}
        </div>

        {delta ? (
          <p className="mt-1 text-[11px] text-muted" aria-hidden>
            {delta.label}
          </p>
        ) : null}

        {hint ? <p className="mt-1 text-[11px] text-muted">{hint}</p> : null}
      </figcaption>

      <div className="mt-4 flex flex-1 items-end">
        <div className="w-full">{children}</div>
      </div>
    </figure>
  );
}
