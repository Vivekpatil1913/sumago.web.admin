"use client";

/**
 * The Export control, shared by every list screen (PRD §4.2).
 *
 * Two formats and no third: Excel for the data — every field, native dates and
 * numbers — and PDF for the version someone prints or forwards. The server
 * builds both from the *currently filtered* set, so the file matches the screen
 * rather than the page you happen to be on.
 */
import { useState } from "react";
import { ChevronDown, Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { downloadFile, queryString } from "@/lib/admin/api";
import { errorMessage, useToast } from "@/lib/admin/app-context";
import { Dropdown, MenuItem, cn } from "@/components/admin/ui";

export type ExportFormat = "xlsx" | "pdf";

interface ExportMenuProps {
  /** The module's API path — `/hr/applications`. `/export` is appended. */
  endpoint: string;
  /** The active list query: search, filters, sort, dates. Paging is dropped. */
  params?: Record<string, string>;
  /** Used for the fallback filename when the server sends no disposition. */
  fileBase: string;
  /** "Applications" — for the confirmation toast. */
  label: string;
  /** How many rows the current view holds, for the toast. */
  total?: number;
  disabled?: boolean;
}

export function ExportMenu({
  endpoint,
  params = {},
  fileBase,
  label,
  total,
  disabled,
}: ExportMenuProps) {
  const { notify } = useToast();
  const [busy, setBusy] = useState<ExportFormat | null>(null);

  async function run(format: ExportFormat) {
    if (busy || disabled) return;
    setBusy(format);
    try {
      // Paging never applies to an export — the whole filtered set comes down.
      const query: Record<string, string> = { ...params, format };
      delete query["page"];
      delete query["pageSize"];

      await downloadFile(
        `/api${endpoint}/export${queryString(query)}`,
        `${fileBase}.${format}`,
      );
      notify(
        total === undefined
          ? `Exported ${label} as ${format === "pdf" ? "PDF" : "Excel"}.`
          : `Exported ${total} row${total === 1 ? "" : "s"} of ${label} as ${format === "pdf" ? "PDF" : "Excel"}.`,
      );
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Dropdown
      trigger={
        /*
          The chevron is not decoration: without it this reads as a button that
          exports *something*, and the whole point is that the person chooses
          the format. Sized to match the Add-new button beside it.
        */
        <span
          className={cn(
            "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[var(--radius-field)] bg-surface px-3 text-xs font-semibold text-content-soft ring-1 ring-inset ring-line-strong transition-all",
            disabled || busy
              ? "cursor-not-allowed opacity-60"
              : "hover:bg-surface-hover hover:text-content hover:ring-accent/40",
          )}
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <Download className="h-3.5 w-3.5" aria-hidden />
          )}
          Export
          <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
        </span>
      }
    >
      <p className="px-3 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
        Download as
      </p>
      <MenuItem
        icon={<FileSpreadsheet className="h-4 w-4 text-ok" aria-hidden />}
        onClick={() => void run("xlsx")}
      >
        <span>
          Excel
          <span className="ml-1.5 text-xs text-muted">.xlsx</span>
        </span>
      </MenuItem>
      <MenuItem
        icon={<FileText className="h-4 w-4 text-bad" aria-hidden />}
        onClick={() => void run("pdf")}
      >
        <span>
          PDF
          <span className="ml-1.5 text-xs text-muted">.pdf</span>
        </span>
      </MenuItem>
    </Dropdown>
  );
}
