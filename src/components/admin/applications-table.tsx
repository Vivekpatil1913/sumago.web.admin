"use client";

/**
 * Module 19 — the résumé inbox, as a table.
 *
 * Lives here rather than on a page because it is read from two places: the
 * Applications tab on the Jobs screen, and the same tab narrowed to a single
 * job by its Applications button. Both want identical row actions — view and
 * download — so they share one component and differ only in `baseParams`.
 */
import { useRouter } from "next/navigation";
import { Eye, FileDown } from "lucide-react";
import { api } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { DataTable, type RowAction } from "@/components/admin/data-table";
import { ErrorState, Spinner } from "@/components/admin/ui";
import type { RecordValue } from "@/lib/admin/types";

/**
 * The Résumé column is hidden: it only ever held a filename, and the file
 * itself is reached through the Download résumé action on the row — a signed,
 * expiring link that gets logged, which a filename in a cell cannot be.
 *
 * Delete this constant (and the `hideColumns` prop below) to bring it back.
 * Hoisted so the prop keeps one identity across renders.
 */
const HIDDEN_COLUMNS = ["resume"];

/**
 * Department is not how anyone looks for an application. The role already
 * narrows it further than a department can, and Job is the filter next to it.
 */
const HIDDEN_FILTERS = ["department"];

export function ApplicationsTable({
  baseParams,
  toolbarExtra,
}: {
  /** Extra filters fixed on every request — e.g. `{ jobId }` for one role. */
  baseParams?: Record<string, string>;
  toolbarExtra?: React.ReactNode;
}) {
  const router = useRouter();
  const { moduleByKey, loading } = useApp();
  const { notify } = useToast();

  // `schema`, not `module` — the latter shadows the CommonJS global and trips
  // @next/next/no-assign-module-variable.
  const schema = moduleByKey("applications");

  if (loading) return <Spinner />;
  if (!schema) {
    return <ErrorState message="Your role does not have access to Applications." />;
  }

  // Captured so the async closures below keep the narrowed, non-undefined type.
  const active = schema;

  async function downloadResume(row: RecordValue) {
    try {
      const response = await api.post<{ url: string; filename: string; expiresInMinutes: number }>(
        `${active.endpoint}/${row["id"]}/resume-link`,
      );
      // The link is short-lived and still requires the session — opening it in
      // a new tab is enough, and the download is logged for the privacy audit.
      window.open(response.data.url, "_blank", "noopener");
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    }
  }

  const rowActions: RowAction[] = [
    {
      label: "View application",
      icon: Eye,
      onClick: (row) => router.push(`/admin/applications/${row["id"]}`),
    },
    { label: "Download résumé", icon: FileDown, onClick: (row) => void downloadResume(row) },
  ];

  return (
    <DataTable
      // A change of job is a different list, not a filtered one — remounting
      // resets the page number so row 1 of the new job is what appears.
      key={baseParams?.["jobId"] ?? "all"}
      module={active}
      baseParams={baseParams}
      rowHref={(row) => `/admin/applications/${row["id"]}`}
      rowActions={rowActions}
      toolbarExtra={toolbarExtra}
      hideColumns={HIDDEN_COLUMNS}
      hideFilters={HIDDEN_FILTERS}
      // No `bulkActions` — that is what puts the select column on the table.
      // An application's status is set on the application itself, next to the
      // CV and the notes that justify the decision.
      //
      // To bring the checkboxes back, restore:
      //   bulkActions={
      //     active.canWrite
      //       ? [
      //           { label: "Mark reviewed", action: "status", status: "reviewed" },
      //           { label: "Shortlist", action: "status", status: "shortlisted" },
      //           { label: "Reject", action: "status", status: "rejected" },
      //         ]
      //       : undefined
      //   }
    />
  );
}
