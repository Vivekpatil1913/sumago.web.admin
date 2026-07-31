"use client";

/** Module 21 — one enquiry: pipeline status, assignment, notes, audit trail. */
import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import { api } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { formatDateTime, humanise, statusTone } from "@/lib/admin/format";
import { Badge, Button, ErrorState, Modal, Notice, Select, Spinner, Textarea } from "@/components/admin/ui";
import type { RecordValue, SelectOption } from "@/lib/admin/types";

interface HistoryEntry {
  fromStatus: string | null;
  toStatus: string;
  changedAt: string;
  changedByName: string | null;
}

const STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost", "archived"];

export default function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { moduleByKey, loading, user, loadOptions } = useApp();
  const { notify } = useToast();

  const [record, setRecord] = useState<RecordValue | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [users, setUsers] = useState<SelectOption[]>([]);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eraseOpen, setEraseOpen] = useState(false);
  const [eraseConfirm, setEraseConfirm] = useState("");
  const [eraseReason, setEraseReason] = useState("");

  const module = moduleByKey("enquiries");

  const load = useCallback(async () => {
    if (!module) return;
    try {
      const response = await api.get<RecordValue>(`${module.endpoint}/${id}`);
      setRecord(response.data);
      setNotes(String(response.data["notes"] ?? ""));
      const historyResponse = await api.get<HistoryEntry[]>(`${module.endpoint}/${id}/history`);
      setHistory(historyResponse.data ?? []);
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }, [module, id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void loadOptions("ref:users").then(setUsers);
  }, [loadOptions]);

  if (loading) return <Spinner />;
  if (!module) return <ErrorState message="Your role does not have access to Contact Enquiries." />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;
  if (!record) return <Spinner label="Loading enquiry" />;

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

  async function erase() {
    if (!module) return;
    setBusy(true);
    try {
      await api.post(`${module.endpoint}/${id}/erase`, { confirm: eraseConfirm, reason: eraseReason });
      notify("Record permanently erased and written to the Activity Log.");
      window.location.href = "/admin/enquiries";
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/enquiries"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-content"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Contact Enquiries
      </Link>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold text-content">{String(record["name"])}</h1>
        <Badge tone={statusTone(record["status"])}>{humanise(record["status"])}</Badge>
        {record["archived"] === true ? <Badge tone="neutral">Archived</Badge> : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="admin-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-content">Enquiry</h2>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Detail label="Company" value={String(record["company"] ?? "—")} />
              <Detail label="Received" value={formatDateTime(record["receivedAt"])} />
              <Detail
                label="Email"
                value={
                  <a href={`mailto:${String(record["email"])}`} className="inline-flex items-center gap-1 underline underline-offset-2">
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    {String(record["email"])}
                  </a>
                }
              />
              <Detail
                label="Phone"
                value={
                  record["phone"] ? (
                    <a href={`tel:${String(record["phone"])}`} className="inline-flex items-center gap-1 underline underline-offset-2">
                      <Phone className="h-3.5 w-3.5" aria-hidden />
                      {String(record["phone"])}
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
              <Detail label="Interested in" value={String(record["serviceInterest"] ?? "—")} />
              <Detail label="Budget" value={humanise(record["budget"] ?? "—")} />
              <Detail label="Source" value={String(record["source"] ?? "—")} />
              <Detail label="Consent given" value={record["consent"] ? "Yes" : "No"} />
            </dl>

            <div className="mt-4 border-t border-line-soft pt-4">
              <p className="mb-1 text-xs uppercase tracking-wide text-muted">Message</p>
              <p className="whitespace-pre-wrap text-sm text-content-soft">{String(record["message"])}</p>
            </div>

            <div className="mt-4 flex gap-2">
              <a
                href={`mailto:${String(record["email"])}?subject=${encodeURIComponent("Re: your enquiry to Sumago Infotech")}`}
                className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                Reply by email
              </a>
            </div>
          </section>

          <section className="admin-card p-5">
            <h2 className="mb-1 text-sm font-semibold text-content">Internal notes</h2>
            <p className="mb-2 text-xs text-muted">Only visible to the team.</p>
            <Textarea
              rows={4}
              value={notes}
              disabled={!module.canWrite}
              onChange={(event) => setNotes(event.target.value)}
            />
            {module.canWrite ? (
              <Button
                className="mt-2"
                size="sm"
                variant="secondary"
                loading={busy}
                onClick={() => void act(() => api.patch(`${module.endpoint}/${id}`, { notes }), "Notes saved.")}
              >
                Save notes
              </Button>
            ) : null}
          </section>

          <section className="admin-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-content">Status history</h2>
            {history.length === 0 ? (
              <p className="text-sm text-muted">No status changes recorded yet.</p>
            ) : (
              <ul className="space-y-2">
                {history.map((entry, index) => (
                  <li key={index} className="flex items-baseline gap-2 text-sm">
                    <span className="text-content-soft">
                      {entry.fromStatus ? `${humanise(entry.fromStatus)} → ` : ""}
                      <span className="font-medium">{humanise(entry.toStatus)}</span>
                    </span>
                    <span className="text-xs text-muted">
                      {formatDateTime(entry.changedAt)}
                      {entry.changedByName ? ` · ${entry.changedByName}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="admin-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-content">Pipeline</h2>

            <label className="block text-xs font-medium text-content-soft" htmlFor="status">
              Status
            </label>
            <Select
              id="status"
              className="mt-1"
              value={String(record["status"])}
              disabled={!module.canWrite || busy}
              onChange={(event) =>
                void act(
                  () => api.post(`${module.endpoint}/${id}/status`, { status: event.target.value }),
                  "Status updated.",
                )
              }
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {humanise(status)}
                </option>
              ))}
            </Select>

            <label className="mt-4 block text-xs font-medium text-content-soft" htmlFor="assigned">
              Assigned to
            </label>
            <Select
              id="assigned"
              className="mt-1"
              value={String(record["assignedTo"] ?? "")}
              disabled={!module.canWrite || busy}
              onChange={(event) =>
                void act(
                  () => api.post(`${module.endpoint}/${id}/assign`, { assignedTo: event.target.value || null }),
                  "Assignment updated.",
                )
              }
            >
              <option value="">Unassigned</option>
              {users.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            {module.canWrite ? (
              <Button
                className="mt-4 w-full"
                variant="secondary"
                size="sm"
                loading={busy}
                onClick={() =>
                  void act(
                    () => api.post(`${module.endpoint}/${id}/${record["archived"] ? "restore" : "archive"}`),
                    record["archived"] ? "Enquiry restored." : "Enquiry archived.",
                  )
                }
              >
                {record["archived"] ? "Restore from archive" : "Archive"}
              </Button>
            ) : null}
          </section>

          {user?.isAdmin ? (
            <section className="rounded-lg bg-surface p-5 ring-1 ring-bad/30">
              <h2 className="mb-1 text-sm font-semibold text-bad">Right to erasure</h2>
              <p className="mb-3 text-xs text-muted">
                Permanently destroys this lead. Only for honouring a legal deletion request.
              </p>
              <Button variant="danger" size="sm" className="w-full" onClick={() => setEraseOpen(true)}>
                Erase permanently
              </Button>
            </section>
          ) : null}
        </aside>
      </div>

      <Modal
        open={eraseOpen}
        onClose={() => setEraseOpen(false)}
        title="Permanently erase this enquiry?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEraseOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={busy}
              disabled={eraseConfirm !== String(record["name"]) || eraseReason.trim().length < 10}
              onClick={() => void erase()}
            >
              Erase permanently
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Notice tone="danger">This cannot be undone.</Notice>
          <div>
            <label className="block text-sm font-medium text-content-soft" htmlFor="erase-confirm">
              Type <span className="font-mono">{String(record["name"])}</span> to confirm
            </label>
            <input
              id="erase-confirm"
              value={eraseConfirm}
              onChange={(event) => setEraseConfirm(event.target.value)}
              className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-sm ring-1 ring-inset ring-line-soft focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-content-soft" htmlFor="erase-reason">
              Reason (recorded in the Activity Log)
            </label>
            <Textarea
              id="erase-reason"
              rows={3}
              value={eraseReason}
              onChange={(event) => setEraseReason(event.target.value)}
              className="mt-1"
            />
          </div>
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
