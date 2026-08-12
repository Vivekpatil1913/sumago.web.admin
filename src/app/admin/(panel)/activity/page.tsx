"use client";

/** Module 25 — Activity Log. Read-only, retained 12 months. */
import { useCallback, useEffect, useState } from "react";
import { useApp, errorMessage } from "@/lib/admin/app-context";
import { api, queryString } from "@/lib/admin/api";
import { formatDateTime, humanise } from "@/lib/admin/format";
import { DataTable } from "@/components/admin/data-table";
import { Pager } from "@/components/admin/pager";
import {
  Badge,
  Card,
  ErrorState,
  InfoTip,
  Skeleton,
  Spinner,
  cn,
} from "@/components/admin/ui";

export default function ActivityLogPage() {
  const { moduleByKey, loading } = useApp();
  const module = moduleByKey("activity-log");

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-xl font-semibold text-content">
            {module ? "Activity Log" : "Your activity"}
          </h1>
          <InfoTip label="About the Activity Log">
            {module ? (
              <>
                This log is read-only and cannot be edited or cleared. Entries are kept for 12
                months, then removed automatically. Résumé downloads are recorded here for privacy
                audits.
              </>
            ) : (
              <>
                Everything you have done in the admin panel, newest first. This log is read-only and
                kept for 12 months. Only an Admin can see other people&apos;s entries.
              </>
            )}
          </InfoTip>
          {module ? <span className="text-xs text-muted">PRD Module 25</span> : null}
        </div>
        <p className="mt-0.5 text-sm text-muted">
          {module
            ? "Every create, update, delete, publish and sign-in — plus every résumé download."
            : "Every create, update, delete, publish and sign-in recorded against your account."}
        </p>
      </header>

      {module ? <DataTable module={module} /> : <OwnActivity />}
    </div>
  );
}

interface ActivityEntry {
  id: string;
  userName: string | null;
  action: string;
  moduleKey: string | null;
  recordLabel: string | null;
  createdAt: string;
}

/** Actions that deserve a colour in the feed; everything else stays neutral. */
const ACTION_TONE: Record<string, "ok" | "danger" | "warn" | "accent"> = {
  create: "ok",
  publish: "ok",
  restore: "ok",
  activate: "ok",
  delete: "danger",
  erase: "danger",
  deactivate: "warn",
  archive: "warn",
  login_failed: "danger",
  download_resume: "accent",
};

const PAGE_SIZE = 50;

/**
 * The caller's own slice of the log, for roles without Module 25.
 *
 * Deliberately a plain list rather than the DataTable: there is nothing to
 * filter by "who" when every row is you, and nothing here is editable.
 */
function OwnActivity() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ActivityEntry[]>(
        `/dashboard/activity${queryString({ page })}`,
      );
      setEntries(response.data);
      setTotal(response.meta?.total ?? response.data.length);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) return <ErrorState message={error} onRetry={() => void load()} />;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <Card padded={false}>
        {loading ? (
          <div className="space-y-3 p-4">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Skeleton key={index} className="h-5" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">Nothing recorded yet.</p>
        ) : (
          <ul className="divide-y divide-line-soft">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-surface-hover"
              >
                <Badge tone={ACTION_TONE[entry.action] ?? "neutral"} dot>
                  {humanise(entry.action)}
                </Badge>

                <span className="min-w-0 flex-1 truncate text-content-soft">
                  {entry.recordLabel ? (
                    <span className="font-medium text-content">{entry.recordLabel}</span>
                  ) : null}
                  {entry.moduleKey ? (
                    <span className={cn(entry.recordLabel && "ml-1.5", "text-muted")}>
                      in {humanise(entry.moduleKey)}
                    </span>
                  ) : null}
                </span>

                <span className="w-44 shrink-0 text-right text-xs text-muted">
                  {formatDateTime(entry.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {!loading ? (
        <Pager page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} noun="entries" />
      ) : null}
    </>
  );
}
