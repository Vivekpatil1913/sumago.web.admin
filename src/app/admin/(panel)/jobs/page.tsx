"use client";

/**
 * Module 18 — Jobs, with Module 19 read against them.
 *
 * Hiring is one job: post a role, then read who applied for it. Split across
 * two menu entries it was two jobs, and the count in the Jobs table was a
 * number you could not act on — you read "3", went to Applications, and set the
 * Job filter by hand to find out who those three were. So the count is now the
 * way in, and the inbox lives on this screen as a second tab.
 *
 * The tab still shows every application when no job is chosen, which is not
 * only convenience: an open application carries no job at all, and filtering by
 * role is the one view that can never show it.
 */
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, RotateCcw, Trash2, Users, X } from "lucide-react";
import { api } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { ApplicationsTable } from "@/components/admin/applications-table";
import { DataTable, type RowAction } from "@/components/admin/data-table";
import { Button, ErrorState, InfoTip, Modal, Notice, Spinner, Tabs } from "@/components/admin/ui";
import type { RecordValue } from "@/lib/admin/types";

type TabId = "jobs" | "applications" | "trash";

export default function JobsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <JobsScreen />
    </Suspense>
  );
}

function JobsScreen() {
  const router = useRouter();
  const search = useSearchParams();
  const { moduleByKey, loading } = useApp();
  const { notify } = useToast();

  const [tab, setTab] = useState<TabId>(() =>
    search.get("tab") === "applications" ? "applications" : search.get("tab") === "trash" ? "trash" : "jobs",
  );
  /** Which role the Applications tab is narrowed to; null means all of them. */
  const [job, setJob] = useState<{ id: string; title: string } | null>(() => {
    const id = search.get("job");
    return id ? { id, title: "" } : null;
  });

  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<RecordValue | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // `jobs`, not `module` — the latter shadows the CommonJS global and trips
  // @next/next/no-assign-module-variable.
  const jobs = moduleByKey("jobs");
  const applications = moduleByKey("applications");

  /*
   * A job arriving in the URL has an id but no title — the label has to come
   * from somewhere, and asking for the one record is cheaper and more honest
   * than putting a title in the query string and trusting it.
   */
  useEffect(() => {
    if (!jobs || !job || job.title !== "") return;
    let cancelled = false;
    void api
      .get<RecordValue>(`${jobs.endpoint}/${job.id}`)
      .then((response) => {
        if (cancelled) return;
        setJob({ id: job.id, title: String(response.data?.["title"] ?? "this role") });
      })
      .catch(() => {
        if (!cancelled) setJob({ id: job.id, title: "this role" });
      });
    return () => {
      cancelled = true;
    };
  }, [jobs, job]);

  // Keep the address bar in step, so a reload or a shared link reopens the same
  // view. `replace` rather than `push`: switching tabs is not a page of history.
  useEffect(() => {
    const params = new URLSearchParams();
    if (tab !== "jobs") params.set("tab", tab);
    if (job) params.set("job", job.id);
    const query = params.toString();
    router.replace(query ? `/admin/jobs?${query}` : "/admin/jobs", { scroll: false });
  }, [router, tab, job]);

  if (loading) return <Spinner />;
  if (!jobs) return <ErrorState message="Your role does not have access to Jobs." />;

  const active = jobs;
  const base = `/admin/m/${active.key}`;

  function openApplications(row: RecordValue) {
    setJob({ id: String(row["id"]), title: String(row[active.identity] ?? "this role") });
    setTab("applications");
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setBusy(true);
    setDeleteError(null);
    try {
      await api.delete(`${active.endpoint}/${pendingDelete["id"]}`);
      notify(`${active.singular} moved to the Trash.`);
      setPendingDelete(null);
      setRefreshKey((key) => key + 1);
    } catch (caught) {
      // A job with applications cannot be deleted — keep the dialog open and
      // say why, because the answer is "Close it instead", not "try again".
      setDeleteError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(row: RecordValue, next: boolean) {
    await api.post(`${active.endpoint}/${row["id"]}/active`, { isActive: next });
    notify(
      next
        ? `${String(row[active.identity] ?? active.singular)} is live again.`
        : `${String(row[active.identity] ?? active.singular)} is hidden from the website.`,
    );
  }

  async function restore(row: RecordValue) {
    setBusy(true);
    try {
      await api.post(`${active.endpoint}/${row["id"]}/restore`);
      notify(`${active.singular} restored.`);
      setRefreshKey((key) => key + 1);
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    } finally {
      setBusy(false);
    }
  }

  const showTrash = tab === "trash";

  const rowActions: RowAction[] = showTrash
    ? [{ label: "Restore", icon: RotateCcw, onClick: (row) => void restore(row) }]
    : [{ label: "Edit", icon: Pencil, onClick: (row) => router.push(`${base}/${row["id"]}`) }];

  if (active.canDelete && !showTrash) {
    rowActions.push({
      label: "Delete",
      icon: Trash2,
      tone: "danger",
      onClick: (row) => {
        setDeleteError(null);
        setPendingDelete(row);
      },
    });
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-xl font-semibold text-content">{active.label}</h1>
          <InfoTip label="About Jobs and Applications">
            Saving publishes: a new job is on the careers page as soon as you save it, and the toggle
            in each row takes one back off without deleting it. The Applications button on a job
            opens only the applications sent for that role — the tab above shows every application,
            including open ones sent without naming a job. Applications are received records: they
            cannot be deleted or hidden, and every résumé download is recorded in the Activity Log.
          </InfoTip>
          <span className="text-xs text-muted">PRD Modules 18 &amp; 19</span>
        </div>
        <p className="mt-0.5 text-sm text-muted">
          Open positions and the applications received for them.
        </p>

        <div className="mt-3">
          {/* A Viewer can read Jobs but not Applications. Offering the tab and
              then refusing it would be the panel advertising a door it will not
              open, so the tab is simply absent for that role. */}
          <Tabs
            tabs={[
              { id: "jobs", label: "Jobs" },
              ...(applications ? [{ id: "applications", label: "Applications" }] : []),
              { id: "trash", label: "Trash" },
            ]}
            active={tab}
            onChange={(id) => setTab(id as TabId)}
          />
        </div>
      </header>

      {/* Same reasoning as the tab: a role without Applications that arrives on
          ?tab=applications gets the Jobs list, not a refusal. */}
      {tab === "applications" && applications ? (
        <>
          {job ? (
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-[var(--radius-field)] border border-line-soft bg-canvas-subtle px-3 py-2">
              <Users className="h-4 w-4 shrink-0 text-muted" aria-hidden />
              <span className="text-sm text-content-soft">
                Showing applications for{" "}
                <span className="font-semibold text-content">{job.title || "…"}</span>
              </span>
              <button
                type="button"
                onClick={() => setJob(null)}
                className="ml-auto inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-canvas hover:text-content"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Show all applications
              </button>
            </div>
          ) : null}

          <ApplicationsTable baseParams={job ? { jobId: job.id } : undefined} />
        </>
      ) : (
        <DataTable
          key={showTrash ? "trash" : "live"}
          module={active}
          refreshKey={refreshKey}
          trash={showTrash}
          rowHref={showTrash ? undefined : (row) => `${base}/${row["id"]}`}
          rowActions={rowActions}
          cellOverrides={
            showTrash || !applications
              ? undefined
              : {
                  applicationCount: (row) => (
                    <ApplicationsButton
                      count={Number(row["applicationCount"] ?? 0)}
                      onClick={() => openApplications(row)}
                    />
                  ),
                }
          }
          onToggleActive={active.canWrite ? toggleActive : undefined}
          onCreate={active.canWrite && !showTrash ? () => router.push(`${base}/new`) : undefined}
        />
      )}

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Move this job to the Trash?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={busy} onClick={() => void confirmDelete()}>
              Move to Trash
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-content-soft">
            <span className="font-medium">
              {String(pendingDelete?.[active.identity] ?? "This job")}
            </span>{" "}
            will be hidden from the panel and the careers page. Nothing is destroyed — you can
            restore it from the Trash at any time.
          </p>
          {deleteError ? <Notice tone="danger" title="Cannot delete">{deleteError}</Notice> : null}
        </div>
      </Modal>
    </div>
  );
}

/**
 * The Applications cell. A count with nothing behind it made you go and look
 * the answer up by hand; this is the same number, made the way through to it.
 *
 * Zero is not a button. There is nothing to open, and a control that looks
 * live but does nothing on click reads as a bug — so it keeps the shape of the
 * pill for the column to stay one straight line, and drops the border, the
 * hover and the pointer that promise a destination.
 */
function ApplicationsButton({ count, onClick }: { count: number; onClick: () => void }) {
  const label = `${count} ${count === 1 ? "application" : "applications"}`;

  if (count === 0) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 py-1 text-xs font-medium text-muted"
        title="No applications yet for this job"
      >
        <Users className="h-3.5 w-3.5" aria-hidden />
        <span className="tabular-nums">0</span>
        <span>applications</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-accent/30 bg-accent/8 px-2.5 py-1 text-xs font-semibold text-accent transition-colors hover:border-accent/60 hover:bg-accent/15"
      aria-label={`View ${label} for this job`}
    >
      <Users className="h-3.5 w-3.5" aria-hidden />
      <span className="tabular-nums">{count}</span>
      <span>{count === 1 ? "application" : "applications"}</span>
    </button>
  );
}
