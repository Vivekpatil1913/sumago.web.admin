"use client";

/** Module 19 — the HR resume inbox. No delete; archive instead (PRD §4.6). */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Eye, FileDown } from "lucide-react";
import { api } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { DataTable, type RowAction } from "@/components/admin/data-table";
import { ErrorState, Notice, Spinner } from "@/components/admin/ui";
import type { RecordValue } from "@/lib/admin/types";

export default function ApplicationsPage() {
  const router = useRouter();
  const { moduleByKey, loading } = useApp();
  const { notify } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const module = moduleByKey("applications");

  if (loading) return <Spinner />;
  if (!module) {
    return <ErrorState message="Your role does not have access to Applications." />;
  }

  async function archive(row: RecordValue, archived: boolean) {
    if (!module) return;
    try {
      await api.post(`${module.endpoint}/${row["id"]}/${archived ? "archive" : "restore"}`);
      notify(archived ? "Application archived." : "Application restored.");
      setRefreshKey((key) => key + 1);
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    }
  }

  async function downloadResume(row: RecordValue) {
    if (!module) return;
    try {
      const response = await api.post<{ url: string; filename: string; expiresInMinutes: number }>(
        `${module.endpoint}/${row["id"]}/resume-link`,
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
    {
      label: "Archive",
      icon: Archive,
      onClick: (row) => void archive(row, true),
      visible: (row) => row["archived"] !== true,
    },
    {
      label: "Restore from archive",
      icon: ArchiveRestore,
      onClick: (row) => void archive(row, false),
      visible: (row) => row["archived"] === true,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-xl font-semibold text-content">Applications</h1>
          <span className="text-xs text-muted">PRD Module 19</span>
        </div>
        <p className="mt-0.5 text-sm text-muted">
          Every application from the website&rsquo;s apply form.
        </p>
      </header>

      <div className="mb-4">
        <Notice tone="info">
          Applications are received records and cannot be deleted. Archive hides one without destroying
          it; only an Admin may permanently erase a record, and only to honour a legal deletion request.
          Résumés are held in private storage — every download is recorded in the Activity Log.
        </Notice>
      </div>

      <DataTable
        module={module}
        refreshKey={refreshKey}
        rowHref={(row) => `/admin/applications/${row["id"]}`}
        rowActions={rowActions}
        bulkActions={
          module.canWrite
            ? [
                { label: "Mark reviewed", action: "status", status: "reviewed" },
                { label: "Shortlist", action: "status", status: "shortlisted" },
                { label: "Reject", action: "status", status: "rejected" },
                { label: "Archive", action: "archive" },
              ]
            : undefined
        }
      />
    </div>
  );
}
