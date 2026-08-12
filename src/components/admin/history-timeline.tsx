/**
 * The audit trail on an inbox record (Modules 19, 21).
 *
 * Status changes and internal notes come back from `/:id/history` as one feed,
 * newest first, because that is how they are read: what was said about the lead
 * and what was done to it belong on the same line of time. Both kinds are
 * labelled — "Status" / "Note" — so a bare word like "New" cannot be mistaken
 * for someone's note, and the value sits under the label rather than beside the
 * timestamp, which is what made the two kinds look unrelated before.
 */
import { formatDateTime, humanise } from "@/lib/admin/format";

export interface HistoryEntry {
  kind: "status" | "note";
  fromStatus: string | null;
  toStatus: string | null;
  note: string | null;
  changedAt: string;
  changedByName: string | null;
}

export function HistoryTimeline({ entries }: { entries: HistoryEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted">No status changes or notes recorded yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {entries.map((entry, index) => (
        <li key={index} className="border-l-2 border-line-soft pl-3 text-sm">
          <p className="flex flex-wrap items-baseline gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
              {entry.kind === "note" ? "Note" : "Status"}
            </span>
            <span className="text-xs text-muted">
              {formatDateTime(entry.changedAt)}
              {entry.changedByName ? ` · ${entry.changedByName}` : ""}
            </span>
          </p>

          {entry.kind === "note" ? (
            <p className="mt-0.5 whitespace-pre-wrap text-content-soft">{entry.note}</p>
          ) : (
            <p className="mt-0.5 text-content-soft">
              {/* No previous status means this is where the record came in. */}
              {entry.fromStatus ? `${humanise(entry.fromStatus)} → ` : "Set to "}
              <span className="font-medium text-content">{humanise(entry.toStatus)}</span>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
