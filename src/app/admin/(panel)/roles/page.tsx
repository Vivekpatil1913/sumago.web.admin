"use client";

/**
 * Module 22 — Roles & Permissions.
 *
 * Creating a role is: give it a name, then tick which modules it can view, edit
 * and delete. The module list comes from the API's catalogue endpoint, so it can
 * never drift from the registry — a new module appears here automatically.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, ShieldCheck, X } from "lucide-react";
import { api, queryString } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { formatDate } from "@/lib/admin/format";
import { ExportMenu } from "@/components/admin/export-menu";
import { Pager } from "@/components/admin/pager";
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  InfoTip,
  Input,
  Modal,
  Notice,
  Select,
  Spinner,
} from "@/components/admin/ui";
import type { RoleRecord } from "@/lib/admin/types";

const PAGE_SIZE = 25;

export default function RolesPage() {
  const { user, loading } = useApp();
  const { notify } = useToast();

  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<RoleRecord | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Search, filter and paging are all resolved by SQL — see /platform/roles.
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [access, setAccess] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const params = useMemo(() => {
    const query: Record<string, string> = {
      page: String(page),
      pageSize: String(PAGE_SIZE),
    };
    if (debouncedSearch) query["search"] = debouncedSearch;
    if (access) query["isAdmin"] = access;
    return query;
  }, [page, debouncedSearch, access]);

  const load = useCallback(async () => {
    setLoadingRoles(true);
    setError(null);
    try {
      const response = await api.get<RoleRecord[]>(`/platform/roles${queryString(params)}`);
      setRoles(response.data ?? []);
      setTotal(response.meta?.total ?? 0);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoadingRoles(false);
    }
  }, [params]);

  useEffect(() => {
    void load();
  }, [load]);

  const hasFilters = Boolean(debouncedSearch || access);

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
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-xl font-semibold text-content">Roles &amp; Permissions</h1>
            <InfoTip label="About Roles and Permissions">
              Changes take effect on the holder&rsquo;s next action — nobody has to sign out and back
              in. A role with <strong className="font-semibold text-content">full administrator
              access</strong> ignores the checkboxes and can manage users and roles, so grant it
              sparingly.
            </InfoTip>
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

      {/* --------------------------------------------------------- Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search roles…"
            aria-label="Search roles"
            className="pl-9"
          />
        </div>

        <Select
          value={access}
          onChange={(event) => {
            setAccess(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by access"
        >
          <option value="">Access: all</option>
          <option value="true">Full administrator</option>
          <option value="false">Module permissions</option>
        </Select>

        {hasFilters ? (
          <Button
            variant="ghost"
            size="sm"
            icon={<X className="h-3.5 w-3.5" />}
            onClick={() => {
              setSearch("");
              setAccess("");
              setPage(1);
            }}
          >
            Clear
          </Button>
        ) : null}

        <div className="ml-auto">
          <ExportMenu
            endpoint="/platform/roles"
            params={params}
            fileBase="roles"
            label="Roles"
            total={total}
          />
        </div>
      </div>

      <div className="overflow-hidden admin-card">
        {loadingRoles ? (
          <Spinner label="Loading roles" />
        ) : error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : roles.length === 0 ? (
          hasFilters ? (
            <EmptyState title="No roles match these filters" />
          ) : (
            <EmptyState title="No roles yet" description="Add your first role to get started." />
          )
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

      {!loadingRoles && !error ? (
        <Pager page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} noun="roles" />
      ) : null}

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
