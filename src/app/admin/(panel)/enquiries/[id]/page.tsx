"use client";

/**
 * Module 21 — one enquiry: pipeline status, notes, audit trail.
 *
 * Assignment, archiving and the right to erasure were all removed at the
 * client's request — panel and API alike, so there is no longer a route that
 * hides or destroys a received record. The status is what moves.
 */
import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import { api } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { formatDateTime, humanise, statusTone } from "@/lib/admin/format";
import {
  Badge,
  Button,
  ErrorState,
  InfoTip,
  Select,
  Spinner,
  Textarea,
} from "@/components/admin/ui";
import { HistoryTimeline, type HistoryEntry } from "@/components/admin/history-timeline";
import type { RecordValue } from "@/lib/admin/types";

/** The pipeline stages, and only those. */
const STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"];

export default function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { moduleByKey, loading } = useApp();
  const { notify } = useToast();

  const [record, setRecord] = useState<RecordValue | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const module = moduleByKey("enquiries");

  const load = useCallback(async () => {
    if (!module) return;
    try {
      const response = await api.get<RecordValue>(`${module.endpoint}/${id}`);
      setRecord(response.data);
      // The box is a composer, not a field: what has been written already is on
      // the timeline below, so it starts empty here and empties again on save
      // (every save reloads through this function).
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

  // A record written before a stage was retired keeps its own status in the
  // list, so the dropdown reads what it actually is rather than showing blank.
  const status = String(record["status"]);
  const statusOptions = STATUSES.includes(status) ? STATUSES : [...STATUSES, status];

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
        <InfoTip label="About this enquiry">
          An enquiry is a received record and cannot be deleted or hidden. Close it by setting its
          status to Won or Lost — it stays in the table and in reporting either way. Status changes
          and notes are recorded in the audit trail below.
        </InfoTip>
        <Badge tone={statusTone(record["status"])}>{humanise(record["status"])}</Badge>
      </div>

      {/* Enquiry and notes are one card split by a rule, not two.
          They are read together — you write a note *about* the message sitting
          next to it — and two bordered boxes implied two separate things to
          deal with. The rule keeps them distinguishable without that. */}
      <div className="space-y-5">
        <section className="admin-card grid lg:grid-cols-3">
          <div className="p-5 lg:col-span-2">
            {/* Status sits in the card header rather than in a panel of its
                own: it is the one field on this screen people come to change,
                and it belongs next to the record it describes. */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-bold tracking-tight text-content">Enquiry</h2>
              <div className="flex items-center gap-2">
                <label
                  className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted"
                  htmlFor="status"
                >
                  Status
                </label>
                <Select
                  id="status"
                  className="w-auto min-w-36"
                  value={status}
                  disabled={!module.canWrite || busy}
                  onChange={(event) =>
                    void act(
                      () => api.post(`${module.endpoint}/${id}/status`, { status: event.target.value }),
                      "Status updated.",
                    )
                  }
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option} disabled={!STATUSES.includes(option)}>
                      {humanise(option)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

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
              {/* Consent is not shown in the panel any more. The contact form
                  still requires it and still records it against the row — the
                  legal record is intact, it is simply not displayed here. */}
            </dl>

            <div className="mt-4 border-t border-line-soft pt-4">
              <p className="mb-1 text-xs uppercase tracking-wide text-muted">Message</p>
              <p className="whitespace-pre-wrap text-sm text-content-soft">{String(record["message"])}</p>
            </div>

            {/* Replying is the only action on this screen. */}
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={`mailto:${String(record["email"])}?subject=${encodeURIComponent("Re: your enquiry to Sumago Infotech")}`}
                className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-field)] bg-accent px-4 text-sm font-semibold text-white shadow-[0_2px_8px_var(--a-accent-ring)] transition-colors hover:bg-accent-hover"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                Reply by email
              </a>
            </div>
          </div>

          <div className="flex flex-col border-t border-line-soft p-5 lg:border-l lg:border-t-0">
            <h2 className="text-base font-bold tracking-tight text-content">Internal notes</h2>
            <p className="mb-3 mt-0.5 text-xs text-muted">
              Only visible to the team. Each note is added to the history below.
            </p>
            {/* Grows to whatever height the enquiry side ends up at, so the two
                halves of the card finish level however long the message is. */}
            <Textarea
              className="min-h-40 flex-1"
              value={notes}
              placeholder="Write a note…"
              disabled={!module.canWrite}
              onChange={(event) => setNotes(event.target.value)}
            />
            {module.canWrite ? (
              <Button
                className="mt-3 w-full"
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
          </div>
        </section>

        {/* One timeline, not two lists: what was said about the lead and what
            was done to it are read in the same pass. Notes carry their text so
            the trail survives the next save overwriting the box above. */}
        <section className="admin-card p-5">
          <h2 className="mb-3 text-base font-bold tracking-tight text-content">Status history</h2>
          <HistoryTimeline entries={history} />
        </section>
      </div>
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
