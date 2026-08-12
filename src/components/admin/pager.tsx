"use client";

/**
 * The pagination footer every list screen shares.
 *
 * Written once so "Showing 1–25 of 282" reads the same everywhere, and so a
 * screen cannot quietly ship without a pager and leave rows unreachable.
 */
import { Button } from "@/components/admin/ui";

interface PagerProps {
  page: number;
  pageSize: number;
  /** The server's count for the *filtered* set, not the rows on screen. */
  total: number;
  onPage: (page: number) => void;
  /** What the rows are, for the summary line — "assets", "users". */
  noun?: string;
}

export function Pager({ page, pageSize, total, onPage, noun = "records" }: PagerProps) {
  if (total === 0) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
      <p>
        Showing{" "}
        <span className="font-medium text-content">
          {first}–{last}
        </span>{" "}
        of <span className="font-medium text-content">{total}</span> {noun}
      </p>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Previous
        </Button>
        <span className="tabular-nums">
          Page {page} of {totalPages}
        </span>
        <Button
          size="sm"
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
