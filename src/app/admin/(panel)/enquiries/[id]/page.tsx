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
import { formatDateTime, humanise, sourceLabel, statusTone } from "@/lib/admin/format";
import {
  Badge,
  Button,
  ErrorState,
  InfoTip,
  Modal,
  Select,
  Spinner,
  Textarea,
} from "@/components/admin/ui";
import { HistoryTimeline, type HistoryEntry } from "@/components/admin/history-timeline";
import type { RecordValue } from "@/lib/admin/types";

/**
 * The pipeline stages, in order — and only those.
 *
 * The order is the rule: a lead moves forward through them and never back,
 * so this array is both the list and the sequence. It mirrors
 * `ENQUIRY_STATUSES` on the API.
 */
const STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"];

/** The two ways a lead ends. Neither has a stage after it. */
const CLOSED = ["won", "lost"];

/**
 * The contact form has no industry or multi-service column to write to, so it
 * appends both as labelled lines at the end of the message (see
 * `intake-form.tsx`). Lift them back out here: they are facts about the lead,
 * not part of what the visitor wrote, so they belong in the field list next to
 * Source rather than buried under the prose.
 *
 * Anything that does not match — an enquiry sent before the form appended
 * these, or one written by hand — is left in the message untouched.
 */
function splitAppendedFields(message: string) {
  const lines = message.split(/\r?\n/);
  let industry = "";
  let services = "";

  // Only trailing lines are considered, so a message whose own text happens to
  // mention "Industry:" partway through is not silently gutted.
  while (lines.length > 0) {
    const line = lines[lines.length - 1].trim();
    const industryMatch = /^Industry:\s*(.+)$/i.exec(line);
    const servicesMatch = /^Services of interest:\s*(.+)$/i.exec(line);

    if (servicesMatch && !services) services = servicesMatch[1].trim();
    else if (industryMatch && !industry) industry = industryMatch[1].trim();
    else if (line !== "") break;

    lines.pop();
  }

  return { message: lines.join("\n").trim(), industry, services };
}

export default function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { moduleByKey, loading } = useApp();
  const { notify } = useToast();

  const [record, setRecord] = useState<RecordValue | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  // The stage picked in the dropdown but not yet confirmed. A status change is
  // one-way, so it is never applied straight off the select.
  const [pending, setPending] = useState<string | null>(null);
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
  const stage = STATUSES.indexOf(status);
  const closed = CLOSED.includes(status);
  /*
   * A stage already passed is never offered again, and Won or Lost closes the
   * lead outright — nothing follows either of them, so the whole control goes
   * quiet. A record carrying some retired status the list no longer holds is
   * the one case left open: it has no place in the order, so every stage stays
   * selectable and it can be put back on the pipeline.
   */
  const isForward = (option: string) =>
    !closed && (stage < 0 || STATUSES.indexOf(option) > stage);
  const canAdvance = statusOptions.some(isForward);

  const enquiry = splitAppendedFields(String(record["message"] ?? ""));
  // The form only stores the first service in the column, so the parsed list is
  // the fuller answer whenever it is there.
  const interest = enquiry.services || String(record["serviceInterest"] ?? "—");

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
                {/* Picking a stage opens the confirmation; the select itself
                    keeps showing what the lead actually is until the change
                    has been agreed to and saved. */}
                <Select
                  id="status"
                  className="w-auto min-w-36"
                  value={status}
                  disabled={!module.canWrite || busy || !canAdvance}
                  onChange={(event) => setPending(event.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                      disabled={option !== status && !isForward(option)}
                    >
                      {humanise(option)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Said once, next to the control, rather than only inside the
                dialog that is already too late to be a warning. */}
            {module.canWrite ? (
              <p className="-mt-2 mb-4 text-xs text-muted">
                {closed
                  ? `This lead is closed as ${humanise(status)}. Its status cannot be changed again.`
                  : "A lead only moves forward — a stage it has passed cannot be set again."}
              </p>
            ) : null}

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
              <Detail label="Interested in" value={interest} />
              {/* Budget is not shown. The contact form never asks for one, so
                  the field only ever drew an em dash. */}
              <Detail label="Source" value={sourceLabel(record["source"])} />
              {enquiry.industry ? <Detail label="Industry" value={enquiry.industry} /> : null}
              {/* Consent is not shown in the panel any more. The contact form
                  still requires it and still records it against the row — the
                  legal record is intact, it is simply not displayed here. */}
            </dl>

            <div className="mt-4 border-t border-line-soft pt-4">
              <p className="mb-1 text-xs uppercase tracking-wide text-muted">Message</p>
              <p className="whitespace-pre-wrap text-sm text-content-soft">
                {enquiry.message || "—"}
              </p>
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

      {/* A status change cannot be undone from this screen, so it is asked
          about before it happens rather than reported after. The dialog names
          both ends of the move — a mis-click on a select is easy, and the
          stage being left is what makes the cost of one legible. */}
      <Modal
        open={pending !== null}
        onClose={() => setPending(null)}
        title="Change this status?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPending(null)} disabled={busy}>
              Cancel
            </Button>
            <Button
              loading={busy}
              onClick={() => {
                const next = pending;
                if (!next) return;
                setPending(null);
                void act(
                  () => api.post(`${module.endpoint}/${id}/status`, { status: next }),
                  "Status updated.",
                );
              }}
            >
              {pending ? `Set to ${humanise(pending)}` : "Confirm"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-content-soft">
          Moving <strong className="font-semibold text-content">{String(record["name"])}</strong>{" "}
          from <strong className="font-semibold text-content">{humanise(status)}</strong> to{" "}
          <strong className="font-semibold text-content">{humanise(pending ?? "")}</strong>.
        </p>
        <p className="mt-2 text-sm text-content-soft">
          {pending && CLOSED.includes(pending)
            ? "This closes the lead. Its status cannot be changed after this, and the change is recorded in the status history below."
            : "A lead only moves forward, so the stages before this one cannot be set again. The change is recorded in the status history below."}
        </p>
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
