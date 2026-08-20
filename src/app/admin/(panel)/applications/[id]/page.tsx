"use client";

/** Module 19 — one application: workflow, rating, notes, résumé, audit trail. */
import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Download, Mail, Phone } from "lucide-react";
import { api } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { formatDateTime, humanise, sourceLabel, statusTone } from "@/lib/admin/format";
import {
  Badge,
  Button,
  ErrorState,
  InfoTip,
  Modal,
  Notice,
  Select,
  Spinner,
  Textarea,
} from "@/components/admin/ui";
import { HistoryTimeline, type HistoryEntry } from "@/components/admin/history-timeline";
import type { RecordValue } from "@/lib/admin/types";

/**
 * The hiring pipeline, in the order it is walked. An application moves forward
 * through these: once it is at Interviewing, the stages behind it are closed,
 * because "back to Reviewed" describes nothing that happens — the candidate was
 * reviewed, and saying otherwise leaves a history that contradicts itself.
 */
const PIPELINE = ["new", "reviewed", "shortlisted", "interviewing", "offered", "hired"];

/**
 * Outcomes rather than stages. They can be reached from anywhere — a candidate
 * may be rejected or paused at any point — and, because they sit outside the
 * order, an application resting on one can be sent back to any stage. That is
 * deliberate: On hold is the way to reopen something moved on too quickly.
 */
const OFF_PIPELINE = ["rejected", "on_hold"];

const STATUSES = [...PIPELINE, ...OFF_PIPELINE];

/** True when `status` sits behind `current` in the pipeline. */
function isBehind(status: string, current: string): boolean {
  const here = PIPELINE.indexOf(current);
  if (here === -1) return false; // Rejected / On hold — reopening is allowed.
  const target = PIPELINE.indexOf(status);
  return target !== -1 && target < here;
}

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { moduleByKey, loading } = useApp();
  const { notify } = useToast();

  const [record, setRecord] = useState<RecordValue | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** The stage picked in the dropdown, held until it is confirmed. */
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const module = moduleByKey("applications");

  const load = useCallback(async () => {
    if (!module) return;
    try {
      const response = await api.get<RecordValue>(`${module.endpoint}/${id}`);
      setRecord(response.data);
      // A composer, not a field — what was written already is on the timeline
      // below, so the box starts empty and empties again after each save.
      setNotes("");

      const historyResponse = await api.get<HistoryEntry[]>(`${module.endpoint}/${id}/history`);
      setHistory(historyResponse.data ?? []);
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }, [module, id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <Spinner />;
  if (!module) return <ErrorState message="Your role does not have access to Applications." />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;
  if (!record) return <Spinner label="Loading application" />;

  async function act<T>(operation: () => Promise<T>, successMessage: string) {
    setBusy(true);
    try {
      await operation();
      notify(successMessage);
      await load();
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    } finally {
      setBusy(false);
    }
  }

  async function confirmStatus() {
    if (!module || pendingStatus === null) return;
    const next = pendingStatus;
    setPendingStatus(null);
    await act(
      () => api.post(`${module.endpoint}/${id}/status`, { status: next }),
      `Status changed to ${humanise(next)}.`,
    );
  }

  const currentStatus = String(record["status"]);
  const behindCount = STATUSES.filter((status) => isBehind(status, currentStatus)).length;

  async function downloadResume() {
    if (!module) return;
    try {
      const response = await api.post<{ url: string }>(`${module.endpoint}/${id}/resume-link`);
      window.open(response.data.url, "_blank", "noopener");
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/jobs?tab=applications"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-content"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Applications
      </Link>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold text-content">{String(record["name"])}</h1>
          <InfoTip label="About this application">
            An application is a received record: it cannot be deleted, hidden or erased, and its
            status is what moves as you work through it. The résumé is held in private storage —
            every download is recorded in the Activity Log.
          </InfoTip>
          <Badge tone={statusTone(record["status"])}>{humanise(record["status"])}</Badge>
        </div>
        <Button variant="primary" size="sm" icon={<Download className="h-3.5 w-3.5" />} onClick={() => void downloadResume()}>
          Download résumé
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* ------------------------------------------------- Applicant */}
        <div className="space-y-5 lg:col-span-2">
          <section className="admin-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-content">Applicant</h2>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Detail label="Applied for" value={String(record["jobTitle"] ?? "Open application")} />
              <Detail label="Applied on" value={formatDateTime(record["appliedAt"])} />
              <Detail
                label="Email"
                value={
                  <a href={`mailto:${String(record["email"])}`} className="inline-flex items-center gap-1 text-content underline underline-offset-2">
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    {String(record["email"])}
                  </a>
                }
              />
              <Detail
                label="Mobile"
                value={
                  <a href={`tel:${String(record["mobile"])}`} className="inline-flex items-center gap-1 text-content underline underline-offset-2">
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                    {String(record["mobile"])}
                  </a>
                }
              />
              <Detail label="Experience" value={String(record["experience"] ?? "—")} />
              <Detail label="Current company" value={String(record["currentCompany"] ?? "—")} />
              <Detail
                label="LinkedIn"
                value={
                  record["linkedin"] ? (
                    <a href={String(record["linkedin"])} target="_blank" rel="noreferrer" className="text-content underline underline-offset-2">
                      View profile
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
              <Detail label="Résumé file" value={String(record["resumeFilename"] ?? "—")} />
              <Detail label="Source" value={sourceLabel(record["source"])} />
              {/* Consent is not shown in the panel any more. The apply form
                  still requires it and still records it against the row — the
                  legal record is intact, it is simply not displayed here. */}
            </dl>

            {record["coverNote"] ? (
              <div className="mt-4 border-t border-line-soft pt-4">
                <p className="mb-1 text-xs uppercase tracking-wide text-muted">Cover note</p>
                <p className="whitespace-pre-wrap text-sm text-content-soft">{String(record["coverNote"])}</p>
              </div>
            ) : null}
          </section>

          {/* ------------------------------------------------- Audit trail */}
          <section className="admin-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-content">Status history</h2>
            <HistoryTimeline entries={history} />
          </section>
        </div>

        {/* ---------------------------------------------------- Workflow */}
        <aside className="space-y-5">
          <section className="admin-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-content">Workflow</h2>

            <label className="block text-xs font-medium text-content-soft" htmlFor="status">
              Status
            </label>
            {/*
              A status change is asked about before it is made. The select is
              bound to the saved record, so choosing a stage only opens the
              dialog — cancelling leaves the dropdown showing what the record
              actually is, because nothing was written.
            */}
            <Select
              id="status"
              className="mt-1"
              value={currentStatus}
              disabled={!module.canWrite || busy}
              aria-describedby="status-help"
              onChange={(event) => setPendingStatus(event.target.value)}
            >
              {STATUSES.map((status) => {
                const passed = isBehind(status, currentStatus);
                return (
                  <option
                    key={status}
                    value={status}
                    disabled={passed}
                    /*
                     * Browsers vary on whether they show a tooltip over a
                     * disabled option, so the reason is in the label as well —
                     * the row has to explain itself even where the title never
                     * appears.
                     */
                    title={
                      passed
                        ? `Already passed — this application is at ${humanise(currentStatus)} and only moves forward.`
                        : undefined
                    }
                  >
                    {humanise(status)}
                    {passed ? " — passed" : ""}
                  </option>
                );
              })}
            </Select>
            <p id="status-help" className="mt-1.5 text-xs text-muted">
              {behindCount > 0 ? (
                <>
                  An application only moves forward, so the {behindCount}{" "}
                  {behindCount === 1 ? "stage" : "stages"} before{" "}
                  <span className="font-medium text-content-soft">{humanise(currentStatus)}</span>{" "}
                  cannot be chosen. Put it On hold to reopen the earlier ones.
                </>
              ) : PIPELINE.includes(currentStatus) ? (
                "An application only moves forward — a stage cannot be chosen again once it is passed."
              ) : (
                `Every stage is open while an application is ${humanise(currentStatus)}.`
              )}
            </p>

            <label className="mt-4 block text-xs font-medium text-content-soft" htmlFor="rating">
              Rating
            </label>
            <Select
              id="rating"
              className="mt-1"
              value={String(record["rating"] ?? "")}
              disabled={!module.canWrite || busy}
              onChange={(event) =>
                void act(
                  () =>
                    api.patch(`${module.endpoint}/${id}`, {
                      rating: event.target.value === "" ? null : Number(event.target.value),
                    }),
                  "Rating saved.",
                )
              }
            >
              <option value="">Not rated</option>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {"★".repeat(value)} ({value})
                </option>
              ))}
            </Select>
          </section>

          {/* --------------------------------------------- Internal notes */}
          <section className="admin-card p-5">
            <h2 className="mb-1 text-sm font-semibold text-content">Internal notes</h2>
            <p className="mb-2 text-xs text-muted">
              Never shown to the applicant. Each note is added to the history.
            </p>
            <Textarea
              rows={4}
              value={notes}
              placeholder="Write a note…"
              disabled={!module.canWrite}
              onChange={(event) => setNotes(event.target.value)}
            />
            {module.canWrite ? (
              <Button
                className="mt-2"
                size="sm"
                variant="secondary"
                loading={busy}
                disabled={notes.trim() === ""}
                onClick={() =>
                  void act(
                    () => api.post(`${module.endpoint}/${id}/notes`, { note: notes }),
                    "Notes saved.",
                  )
                }
              >
                Save notes
              </Button>
            ) : null}
          </section>
        </aside>
      </div>

      <Modal
        open={pendingStatus !== null}
        onClose={() => setPendingStatus(null)}
        title="Change this application's status?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingStatus(null)}>
              Cancel
            </Button>
            <Button variant="primary" loading={busy} onClick={() => void confirmStatus()}>
              Change status
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-content-soft">
            <span className="font-medium">{String(record["name"])}</span> moves from{" "}
            <span className="font-semibold text-content">{humanise(record["status"])}</span> to{" "}
            <span className="font-semibold text-content">{humanise(pendingStatus)}</span>.
          </p>
          <Notice tone="warn">
            The change is written to the status history below and stamped with your name and the
            time. Moving the application back afterwards does not remove that entry — the trail
            keeps both steps.
          </Notice>
        </div>
      </Modal>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-content">{value}</dd>
    </div>
  );
}
