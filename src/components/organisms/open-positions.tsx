"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { JobRecord } from "@/lib/cms/types";
import { JobCard } from "@/components/molecules/job-card";

const ALL = "All";

/**
 * The open-roles board — a filterable feed of job listings. Department chips
 * narrow the list client-side; the count updates live so the board never looks
 * empty or misleading.
 *
 * Departments are derived from the roles actually open rather than from a fixed
 * list, so a chip is never shown with a count of zero, and HR adding a new
 * department in the admin panel needs no change here.
 *
 * Jobs arrive as a prop so the page stays a server component and only this
 * subtree ships to the client.
 */
export function OpenPositions({ jobs }: { jobs: JobRecord[] }) {
  const [filter, setFilter] = useState<string>(ALL);

  const filters = useMemo(
    () => [ALL, ...[...new Set(jobs.map((job) => job.department))].sort()],
    [jobs],
  );

  const positions = useMemo(
    () => (filter === ALL ? jobs : jobs.filter((job) => job.department === filter)),
    [jobs, filter],
  );

  /*
   * An empty board is a real state, not an error: every role may be filled, or
   * the API may be briefly unavailable (there is deliberately no stale-jobs
   * fallback — see `getJobs`). Either way the candidate gets a route forward
   * rather than a blank page.
   */
  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-mist p-10 text-center">
        <p className="font-display text-lg font-semibold text-ink">
          No roles are open right now.
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/60">
          Good people are worth hearing from regardless. Send an introduction and it
          will reach the team the moment something opens up.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-flex text-sm font-semibold text-brand-ink underline-offset-4 hover:underline"
        >
          Get in touch
        </Link>
      </div>
    );
  }

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
            f === ALL ? jobs.length : jobs.filter((job) => job.department === f).length;
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
        {filter !== ALL ? ` in ${filter}` : ""}.
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
