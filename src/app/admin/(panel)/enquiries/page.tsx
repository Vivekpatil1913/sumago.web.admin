"use client";

/** Module 21 — the sales lead inbox. No delete; the status closes a lead. */
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { useApp } from "@/lib/admin/app-context";
import { DataTable, type RowAction } from "@/components/admin/data-table";
import { ErrorState, InfoTip, Spinner } from "@/components/admin/ui";

export default function EnquiriesPage() {
  const router = useRouter();
  const { moduleByKey, loading } = useApp();

  const module = moduleByKey("enquiries");

  if (loading) return <Spinner />;
  if (!module) {
    return <ErrorState message="Your role does not have access to Contact Enquiries." />;
  }

  const rowActions: RowAction[] = [
    {
      label: "View enquiry",
      icon: Eye,
      onClick: (row) => router.push(`/admin/enquiries/${row["id"]}`),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-xl font-semibold text-content">Contact Enquiries</h1>
          <InfoTip label="About Contact Enquiries">
            Enquiries are received records and cannot be deleted or hidden. Close one by setting its
            status to Won or Lost — it stays in the table and in reporting either way.
          </InfoTip>
          <span className="text-xs text-muted">PRD Module 21</span>
        </div>
        <p className="mt-0.5 text-sm text-muted">Every submission from the website contact form.</p>
      </header>

      <DataTable
        module={module}
        rowHref={(row) => `/admin/enquiries/${row["id"]}`}
        rowActions={rowActions}
        bulkActions={
          module.canWrite
            ? [
                { label: "Mark contacted", action: "status", status: "contacted" },
                { label: "Mark qualified", action: "status", status: "qualified" },
                { label: "Mark lost", action: "status", status: "lost" },
              ]
            : undefined
        }
      />
    </div>
  );
}
