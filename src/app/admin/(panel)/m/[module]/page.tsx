"use client";

/** Generic list screen — serves every module that has no dedicated view. */
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { DataTable, type RowAction } from "@/components/admin/data-table";
import { Button, ErrorState, Modal, Notice, Spinner } from "@/components/admin/ui";
import type { RecordValue } from "@/lib/admin/types";

export default function ModuleListPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleKey } = use(params);
  const router = useRouter();
  const { moduleByKey, loading } = useApp();
  const { notify } = useToast();

  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<RecordValue | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showTrash, setShowTrash] = useState(false);

  const module = moduleByKey(moduleKey);

  if (loading) return <Spinner />;
  if (!module) {
    return (
      <ErrorState message={`No module called "${moduleKey}", or your role cannot see it.`} />
    );
  }

  // Singletons (General Settings, Navigation) go straight to their editor.
  if (module.singleton) {
    router.replace(`/admin/m/${module.key}/edit`);
    return <Spinner />;
  }

  const base = `/admin/m/${module.key}`;
  // Captured so the async closures below keep the narrowed, non-undefined type.
  const active = module;

  async function confirmDelete() {
    if (!pendingDelete) return;
    setBusy(true);
    setDeleteError(null);
    try {
      await api.delete(`${active.endpoint}/${pendingDelete["id"]}`);
      notify(`${active.singular} moved to the Trash.`);
      setPendingDelete(null);
      setRefreshKey((key) => key + 1);
    } catch (caught) {
      // Blocked deletes explain what to do instead — keep the dialog open.
      setDeleteError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(row: RecordValue, next: boolean) {
    await api.post(`${active.endpoint}/${row["id"]}/active`, { isActive: next });
    notify(
      next
        ? `${String(row[active.identity] ?? active.singular)} is live again.`
        : `${String(row[active.identity] ?? active.singular)} is hidden from the website.`,
    );
  }

  async function restore(row: RecordValue) {
    setBusy(true);
    try {
      await api.post(`${active.endpoint}/${row["id"]}/restore`);
      notify(`${active.singular} restored.`);
      setRefreshKey((key) => key + 1);
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    } finally {
      setBusy(false);
    }
  }

  const rowActions: RowAction[] = showTrash
    ? [{ label: "Restore", onClick: (row) => void restore(row) }]
    : [{ label: "Edit", onClick: (row) => router.push(`${base}/${row["id"]}`) }];

  if (module.canDelete && !showTrash) {
    rowActions.push({
      label: "Delete",
      tone: "danger",
      onClick: (row) => {
        setDeleteError(null);
        setPendingDelete(row);
      },
    });
  }

  const bulkActions = module.canWrite && !showTrash
    ? [
        ...(module.hasStatus
          ? [
              { label: "Publish", action: "status", status: "published" },
              { label: "Move to draft", action: "status", status: "draft" },
            ]
          : []),
        ...(module.canDelete ? [{ label: "Delete", action: "delete", tone: "danger" as const }] : []),
      ]
    : undefined;

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-xl font-semibold text-content">{module.label}</h1>
          <span className="text-xs text-muted">PRD Module {module.prdModule}</span>
        </div>
        {module.description ? (
          <p className="mt-0.5 text-sm text-muted">{module.description}</p>
        ) : null}

        <div className="mt-3 flex gap-1 border-b border-line-soft">
          {[
            { id: false, label: module.label },
            { id: true, label: "Trash" },
          ].map((tab) => (
            <button
              key={String(tab.id)}
              type="button"
              onClick={() => setShowTrash(tab.id)}
              className={
                "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors " +
                (showTrash === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-content")
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {showTrash ? (
        <div className="mb-4">
          <Notice tone="info">
            Deleted records are kept, not destroyed. Restore one to bring it back exactly as it was,
            with its links and history intact.
          </Notice>
        </div>
      ) : null}

      <DataTable
        key={showTrash ? "trash" : "live"}
        module={module}
        refreshKey={refreshKey}
        trash={showTrash}
        rowHref={showTrash ? undefined : (row) => `${base}/${row["id"]}`}
        rowActions={rowActions}
        bulkActions={bulkActions && bulkActions.length > 0 ? bulkActions : undefined}
        onToggleActive={module.canWrite ? toggleActive : undefined}
        onCreate={module.canWrite && !showTrash ? () => router.push(`${base}/new`) : undefined}
      />

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title={`Move this ${module.singular.toLowerCase()} to the Trash?`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={busy} onClick={() => void confirmDelete()}>
              Move to Trash
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-content-soft">
            <span className="font-medium">
              {String(pendingDelete?.[module.identity] ?? "This record")}
            </span>{" "}
            will be hidden from the panel and the website. Nothing is destroyed —
            you can restore it from the Trash at any time.
          </p>
          {deleteError ? <Notice tone="danger" title="Cannot delete">{deleteError}</Notice> : null}
        </div>
      </Modal>
    </div>
  );
}
