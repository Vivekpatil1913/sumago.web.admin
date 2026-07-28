"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { openPositions, jobDepartments, type JobDepartment } from "@/lib/careers";
import { JobCard } from "@/components/molecules/job-card";

type Filter = "All" | JobDepartment;

/**
 * The open-roles board — a filterable feed of job listings. Department chips
 * narrow the list client-side; the count updates live so the board never looks
 * empty or misleading. Mirrors the scannable job-feed pattern while staying in
 * Sumago's design language.
 */
export function OpenPositions() {
  const [filter, setFilter] = useState<Filter>("All");

  const filters: Filter[] = ["All", ...jobDepartments];
  const positions = useMemo(
    () =>
      filter === "All"
        ? openPositions
        : openPositions.filter((p) => p.department === filter),
    [filter],
  );

  return (
    <div>
      {/* filter chips */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="tablist"
        aria-label="Filter open roles by team"
        data-aos="fade-up"
      >
        {filters.map((f) => {
          const active = f === filter;
          const count =
            f === "All"
              ? openPositions.length
              : openPositions.filter((p) => p.department === f).length;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                active
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-white text-ink/70 hover:border-brand/40 hover:text-brand-ink",
              )}
            >
              {f}
              <span
                className={cn(
                  "grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs",
                  active ? "bg-white/20 text-white" : "bg-mist text-ink/60",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* result count */}
      <p className="mt-6 text-sm text-ink/50" aria-live="polite">
        Showing {positions.length} open{" "}
        {positions.length === 1 ? "role" : "roles"}
        {filter !== "All" ? ` in ${filter}` : ""}.
      </p>

      {/* listings — grid of small cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {positions.map((position, i) => (
          <div key={position.slug} data-aos="fade-up" data-aos-delay={(i % 3) * 60}>
            <JobCard position={position} />
          </div>
        ))}
      </div>
    </div>
  );
}
