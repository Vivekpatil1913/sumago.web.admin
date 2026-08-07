"use client";

/** Module 21 — the sales lead inbox. No delete; archive instead (PRD §4.6). */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Eye } from "lucide-react";
import { api } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { DataTable, type RowAction } from "@/components/admin/data-table";
import { ErrorState, Notice, Spinner } from "@/components/admin/ui";
import type { RecordValue } from "@/lib/admin/types";

export default function EnquiriesPage() {
  const router = useRouter();
  const { moduleByKey, loading } = useApp();
  const { notify } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const module = moduleByKey("enquiries");

  if (loading) return <Spinner />;
  if (!module) {
    return <ErrorState message="Your role does not have access to Contact Enquiries." />;
  }

  async function archive(row: RecordValue, archived: boolean) {
    if (!module) return;
    try {
      await api.post(`${module.endpoint}/${row["id"]}/${archived ? "archive" : "restore"}`);
      notify(archived ? "Enquiry archived." : "Enquiry restored.");
      setRefreshKey((key) => key + 1);
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    }
  }

  const rowActions: RowAction[] = [
    {
      label: "View enquiry",
      icon: Eye,
      onClick: (row) => router.push(`/admin/enquiries/${row["id"]}`),
    },
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
          <h1 className="text-xl font-semibold text-content">Contact Enquiries</h1>
          <span className="text-xs text-muted">PRD Module 21</span>
        </div>
        <p className="mt-0.5 text-sm text-muted">Every submission from the website contact form.</p>
      </header>

      <div className="mb-4">
        <Notice tone="info">
          Enquiries are received records and cannot be deleted. Close one by setting its status to Won
          or Lost — it stays in the table and in reporting. Archive is for spam and duplicates.
        </Notice>
      </div>

      <DataTable
        module={module}
        refreshKey={refreshKey}
        rowHref={(row) => `/admin/enquiries/${row["id"]}`}
        rowActions={rowActions}
        bulkActions={
          module.canWrite
            ? [
                { label: "Mark contacted", action: "status", status: "contacted" },
                { label: "Mark qualified", action: "status", status: "qualified" },
                { label: "Mark lost", action: "status", status: "lost" },
                { label: "Archive", action: "archive" },
              ]
            : undefined
        }
      />
    </div>
  );
}
