"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/admin/ui";

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
}: {
  title: ReactNode;
  description?: ReactNode;
  prdModule?: number;
  badge?: ReactNode;
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="mb-5">
      {backHref ? (
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-content"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {backLabel ?? "Back"}
        </Link>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-xl font-bold tracking-tight text-content">{title}</h1>
            {badge}
            {prdModule ? (
              <span className="text-[11px] text-muted">PRD Module {prdModule}</span>
            ) : null}
          </div>
          {description ? (
            <p className="mt-1 max-w-2xl text-[13px] text-muted">{description}</p>
          ) : null}
        </div>

        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}

/** A compact metric tile for the dashboard. */
export function StatTile({
  label,
  value,
  hint,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: "neutral" | "warn";
  icon?: ReactNode;
}) {
  const warning = tone === "warn" && Number(value) > 0;

  return (
    <div
      className={
        "admin-card group h-full p-4 transition-shadow hover:shadow-[var(--a-shadow-pop)] " +
        (warning ? "ring-1 ring-warn/30" : "")
      }
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] text-muted">{label}</p>
        {icon ? (
          <span
            className={
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-field)] " +
              (warning ? "bg-warn-soft text-warn" : "bg-accent-soft text-accent")
            }
          >
            {icon}
          </span>
        ) : null}
      </div>

      <p
        className={
          "mt-2 text-2xl font-bold tabular-nums tracking-tight " +
          (warning ? "text-warn" : "text-content")
        }
      >
        {value}
      </p>

      {hint ? (
        <p className="mt-1.5 text-xs text-warn">{hint}</p>
      ) : null}
    </div>
  );
}

export { Badge };
