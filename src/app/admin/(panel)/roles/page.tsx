"use client";

/**
 * Module 22 — Roles & Permissions.
 *
 * Creating a role is: give it a name, then tick which modules it can view, edit
 * and delete. The module list comes from the API's catalogue endpoint, so it can
 * never drift from the registry — a new module appears here automatically.
 */
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ShieldCheck } from "lucide-react";
import { api } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { formatDate } from "@/lib/admin/format";
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  Modal,
  Notice,
  Spinner,
} from "@/components/admin/ui";
import type { RoleRecord } from "@/lib/admin/types";

export default function RolesPage() {
  const { user, loading } = useApp();
  const { notify } = useToast();

  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<RoleRecord | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoadingRoles(true);
    setError(null);
    try {
      const response = await api.get<RoleRecord[]>("/platform/roles?pageSize=100");
      setRoles(response.data ?? []);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <Spinner />;
  if (!user?.isAdmin) {
    return <ErrorState message="Only a role with full administrator access can manage roles." />;
  }

  async function remove() {
    if (!pendingDelete) return;
    setBusy(true);
    setDeleteError(null);
    try {
      await api.delete(`/platform/roles/${pendingDelete.id}`);
      notify("Role deleted.");
      setPendingDelete(null);
      await load();
    } catch (caught) {
      setDeleteError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-xl font-semibold text-content">Roles &amp; Permissions</h1>
            <span className="text-xs text-muted">PRD Module 22</span>
          </div>
          <p className="mt-0.5 text-sm text-muted">
            Create a role, then tick exactly which modules it can reach.
          </p>
        </div>
        <Link
          href="/admin/roles/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add role
        </Link>
      </header>

      <div className="mb-4">
        <Notice tone="info">
          Changes take effect on the holder&rsquo;s next action — nobody has to sign out and back in.
          A role with <strong>full administrator access</strong> ignores the checkboxes and can manage
          users and roles, so grant it sparingly.
        </Notice>
      </div>

      <div className="overflow-hidden admin-card">
        {loadingRoles ? (
          <Spinner label="Loading roles" />
        ) : error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : roles.length === 0 ? (
          <EmptyState title="No roles yet" description="Add your first role to get started." />
        ) : (
          <div className="table-scroll">
            <table className="w-full text-sm">
              <thead className="border-b border-line-soft bg-canvas-subtle text-left">
                <tr>
                  {["Role", "Description", "Modules", "Users", "Type", "Updated", ""].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-canvas-subtle">
                    <td className="px-3 py-2.5">
                      <Link
                        href={`/admin/roles/${role.id}`}
                        className="font-medium text-content underline-offset-2 hover:underline"
                      >
                        {role.name}
                      </Link>
                    </td>
                    <td className="max-w-xs truncate px-3 py-2.5 text-content-soft">
                      {role.description || "—"}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-content-soft">
                      {role.isAdmin ? (
                        <span className="inline-flex items-center gap-1 text-ok">
                          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                          All
                        </span>
                      ) : (
                        (role.moduleCount ?? 0)
                      )}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-content-soft">{role.userCount ?? 0}</td>
                    <td className="px-3 py-2.5">
                      {role.isSystem ? (
                        <Badge tone="info">Built-in</Badge>
                      ) : (
                        <Badge tone="neutral">Custom</Badge>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-content-soft">
                      {formatDate((role as unknown as Record<string, unknown>)["updatedAt"])}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right">
                      <Link
                        href={`/admin/roles/${role.id}`}
                        className="rounded px-1.5 py-1 text-xs font-medium text-content-soft hover:bg-canvas-subtle"
                      >
                        Edit
                      </Link>
                      {!role.isSystem ? (
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            setPendingDelete(role);
                          }}
                          className="rounded px-1.5 py-1 text-xs font-medium text-bad hover:bg-bad-soft"
                        >
                          Delete
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete this role?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={busy} onClick={() => void remove()}>
              Delete role
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-content-soft">
            <span className="font-medium">{pendingDelete?.name}</span> will be removed. Anyone still
            holding it must be moved to another role first.
          </p>
          {deleteError ? (
            <Notice tone="danger" title="Cannot delete">
              {deleteError}
            </Notice>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
