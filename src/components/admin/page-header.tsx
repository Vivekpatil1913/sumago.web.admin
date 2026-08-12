"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge, InfoTip } from "@/components/admin/ui";

/**
 * The standard heading block for a panel screen: title, optional PRD reference,
 * one line of description, and the screen's primary actions on the right.
 */
export function PageHeader({
  title,
  description,
  prdModule,
  badge,
  actions,
  backHref,
  backLabel,
  eyebrow,
  icon,
  info,
  infoLabel,
}: {
  title: ReactNode;
  description?: ReactNode;
  prdModule?: number;
  badge?: ReactNode;
  actions?: ReactNode;
  /** The screen's standing rules, behind the info glyph beside the title. */
  info?: ReactNode;
  /** Accessible name for that glyph; defaults to "About this screen". */
  infoLabel?: string;
  backHref?: string;
  backLabel?: string;
  /** A line of context above the title — a date, a parent record, a status. */
  eyebrow?: ReactNode;
  /** A glyph for the screen, shown in a tinted chip beside the title. */
  icon?: ReactNode;
}) {
  return (
    <header className="mb-6">
      {backHref ? (
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center gap-1 text-[13px] font-medium text-muted transition-colors hover:text-accent"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {backLabel ?? "Back"}
        </Link>
      ) : null}

      {eyebrow ? (
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          {eyebrow}
        </p>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3.5">
          {icon ? (
            <span
              aria-hidden
              className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-card)] bg-accent-soft text-accent"
            >
              {icon}
            </span>
          ) : null}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-content">
                {title}
              </h1>
              {info ? (
                <InfoTip label={infoLabel ?? "About this screen"}>{info}</InfoTip>
              ) : null}
              {badge}
              {prdModule ? (
                <span className="text-[11px] text-muted">PRD Module {prdModule}</span>
              ) : null}
            </div>
            {description ? (
              <p className="mt-1 max-w-2xl text-[13px] text-muted">{description}</p>
            ) : null}
          </div>
        </div>

        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}

/**
 * A metric tile for the dashboard.
 *
 * Each tile is a flat wash of one hue rather than another white card. A row of
 * five reads as five separate measurements at a glance, which is the only job
 * the strip has — the label is confirmation, not the way in.
 *
 * `tint` cycles by position so the row is stable and repeatable; a tile that
 * carries a warning overrides it and goes amber, because "needs attention" has
 * to beat "third card along".
 */
const TILE_TINTS = [
  "admin-tile-1",
  "admin-tile-2",
  "admin-tile-3",
  "admin-tile-4",
  "admin-tile-5",
] as const;

export function StatTile({
  label,
  value,
  hint,
  tone = "neutral",
  icon,
  tint = 0,
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: "neutral" | "warn";
  icon?: ReactNode;
  /** Position in the row; picks one of the five tints. */
  tint?: number;
}) {
  const warning = tone === "warn" && Number(value) > 0;
  const tintClass = warning
    ? "admin-tile-5"
    : (TILE_TINTS[tint % TILE_TINTS.length] ?? TILE_TINTS[0]);

  return (
    <div
      className={
        "admin-tile group h-full p-5 hover:-translate-y-0.5 hover:shadow-[var(--a-shadow-pop)] " +
        tintClass
      }
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.09em] opacity-80">{label}</p>
        {icon ? (
          <span className="admin-tile-chip flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-field)]">
            {icon}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-[2.25rem] font-bold leading-none tabular-nums tracking-tight">
        {value}
      </p>

      {hint ? <p className="mt-2.5 text-xs font-medium opacity-75">{hint}</p> : null}
    </div>
  );
}

export { Badge };
