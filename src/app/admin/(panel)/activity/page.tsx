"use client";

/** Module 25 — Activity Log. Read-only, retained 12 months. */
import { useApp } from "@/lib/admin/app-context";
import { DataTable } from "@/components/admin/data-table";
import { ErrorState, Notice, Spinner } from "@/components/admin/ui";

export default function ActivityLogPage() {
  const { moduleByKey, loading } = useApp();
  const module = moduleByKey("activity-log");

  if (loading) return <Spinner />;
  if (!module) return <ErrorState message="Only an Admin can view the Activity Log." />;

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-xl font-semibold text-content">Activity Log</h1>
          <span className="text-xs text-muted">PRD Module 25</span>
        </div>
        <p className="mt-0.5 text-sm text-muted">
          Every create, update, delete, publish and sign-in — plus every résumé download.
        </p>
      </header>

      <div className="mb-4">
        <Notice tone="info">
          This log is read-only and cannot be edited or cleared. Entries are kept for 12 months, then
          removed automatically. Résumé downloads are recorded here for privacy audits.
        </Notice>
      </div>

      <DataTable module={module} />
    </div>
  );
}
