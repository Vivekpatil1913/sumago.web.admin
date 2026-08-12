"use client";

/** Module 22 — Users & Roles. Admin only; the server enforces that too. */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { ApiError, api, queryString } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { formatDateTime, humanise, statusTone } from "@/lib/admin/format";
import { ExportMenu } from "@/components/admin/export-menu";
import { Pager } from "@/components/admin/pager";
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  FieldError,
  InfoTip,
  Input,
  Label,
  Modal,
  Notice,
  Select,
  Spinner,
} from "@/components/admin/ui";
import type { RecordValue, RoleRecord, SelectOption } from "@/lib/admin/types";

const PAGE_SIZE = 25;

export default function UsersPage() {
  const { user: currentUser, loading, loadOptions } = useApp();
  const { notify } = useToast();

  const [users, setUsers] = useState<RecordValue[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<RecordValue | null>(null);
  const [creating, setCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<RecordValue | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Search, filters and paging are all resolved by SQL — see /platform/users.
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleId, setRoleId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [roleOptions, setRoleOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    void loadOptions("ref:roles").then((options) => {
      if (!cancelled) setRoleOptions(options);
    });
    return () => {
      cancelled = true;
    };
  }, [loadOptions]);

  const params = useMemo(() => {
    const query: Record<string, string> = {
      page: String(page),
      pageSize: String(PAGE_SIZE),
    };
    if (debouncedSearch) query["search"] = debouncedSearch;
    if (roleId) query["roleId"] = roleId;
    if (status) query["status"] = status;
    return query;
  }, [page, debouncedSearch, roleId, status]);

  const load = useCallback(async () => {
    setLoadingUsers(true);
    setError(null);
    try {
      const response = await api.get<RecordValue[]>(`/platform/users${queryString(params)}`);
      setUsers(response.data ?? []);
      setTotal(response.meta?.total ?? 0);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoadingUsers(false);
    }
  }, [params]);

  useEffect(() => {
    void load();
  }, [load]);

  const hasFilters = Boolean(debouncedSearch || roleId || status);

  if (loading) return <Spinner />;
  if (!currentUser?.isAdmin) {
    return <ErrorState message="Only an Admin can manage users." />;
  }

  async function remove() {
    if (!pendingDelete) return;
    setBusy(true);
    setDeleteError(null);
    try {
      await api.delete(`/platform/users/${pendingDelete["id"]}`);
      notify("User deleted.");
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
            <h1 className="text-xl font-semibold text-content">Users &amp; Roles</h1>
            <InfoTip label="About Users and Roles">
              Admin and HR accounts must use two-factor authentication because they can see personal
              data. A user cannot change their own role, and the last Admin cannot be deleted or
              suspended.
            </InfoTip>
            <span className="text-xs text-muted">PRD Module 22</span>
          </div>
          <p className="mt-0.5 text-sm text-muted">
            A user only sees the modules their role permits.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setCreating(true)}>
          Add user
        </Button>
      </header>

      {/* --------------------------------------------------------- Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or email…"
            aria-label="Search users"
            className="pl-9"
          />
        </div>

        <Select
          value={roleId}
          onChange={(event) => {
            setRoleId(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by role"
        >
          <option value="">Role: all</option>
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by status"
        >
          <option value="">Status: all</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </Select>

        {hasFilters ? (
          <Button
            variant="ghost"
            size="sm"
            icon={<X className="h-3.5 w-3.5" />}
            onClick={() => {
              setSearch("");
              setRoleId("");
              setStatus("");
              setPage(1);
            }}
          >
            Clear
          </Button>
        ) : null}

        <div className="ml-auto">
          <ExportMenu
            endpoint="/platform/users"
            params={params}
            fileBase="users"
            label="Users"
            total={total}
          />
        </div>
      </div>

      <div className="overflow-hidden admin-card">
        {loadingUsers ? (
          <Spinner label="Loading users" />
        ) : error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : users.length === 0 ? (
          <EmptyState title={hasFilters ? "No users match these filters" : "No users yet"} />
        ) : (
          <div className="table-scroll">
            <table className="w-full text-sm">
              <thead className="border-b border-line-soft bg-canvas-subtle text-left">
                <tr>
                  {["Name", "Email", "Role", "Last login", "Status", ""].map((heading) => (
                    <th key={heading} scope="col" className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {users.map((row) => {
                  const isSelf = row["id"] === currentUser.id;
                  return (
                    <tr key={String(row["id"])} className="hover:bg-canvas-subtle">
                      <td className="px-3 py-2.5 font-medium text-content">
                        {String(row["name"])}
                        {isSelf ? <span className="ml-1.5 text-xs text-muted">(you)</span> : null}
                      </td>
                      <td className="px-3 py-2.5 text-content-soft">{String(row["email"])}</td>
                      <td className="px-3 py-2.5">
                        <Badge tone="info">{String(row["roleName"] ?? "—")}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-content-soft">
                        {row["lastLogin"] ? formatDateTime(row["lastLogin"]) : "Never"}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge tone={statusTone(row["status"])}>{humanise(row["status"])}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => setEditing(row)}
                          className="rounded px-1.5 py-1 text-xs font-medium text-content-soft hover:bg-canvas-subtle"
                        >
                          Edit
                        </button>
                        {!isSelf ? (
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError(null);
                              setPendingDelete(row);
                            }}
                            className="rounded px-1.5 py-1 text-xs font-medium text-bad hover:bg-bad-soft"
                          >
                            Delete
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loadingUsers && !error ? (
        <Pager page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} noun="users" />
      ) : null}

      <UserModal
        open={creating || Boolean(editing)}
        user={editing}
        isSelf={editing?.["id"] === currentUser.id}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSaved={() => {
          setCreating(false);
          setEditing(null);
          void load();
        }}
      />

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete this user?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={busy} onClick={() => void remove()}>
              Delete user
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-content-soft">
            <span className="font-medium">{String(pendingDelete?.["name"] ?? "")}</span> will lose access
            immediately. Records they created are kept.
          </p>
          {deleteError ? <Notice tone="danger" title="Cannot delete">{deleteError}</Notice> : null}
        </div>
      </Modal>
    </div>
  );
}

function UserModal({
  open,
  user,
  isSelf,
  onClose,
  onSaved,
}: {
  open: boolean;
  user: RecordValue | null;
  isSelf: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { notify } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [status, setStatus] = useState("active");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setName(String(user?.["name"] ?? ""));
    setEmail(String(user?.["email"] ?? ""));
    setRoleId(String(user?.["roleId"] ?? ""));
    setStatus(String(user?.["status"] ?? "active"));
    setPassword("");
    setError(null);
    setFieldErrors({});

    void api
      .get<RoleRecord[]>("/platform/roles?pageSize=100")
      .then((response) => setRoles(response.data ?? []))
      .catch(() => setRoles([]));
  }, [open, user]);

  async function submit() {
    setBusy(true);
    setError(null);
    setFieldErrors({});
    try {
      const payload: Record<string, unknown> = { name, email, roleId, status };
      if (password) payload["password"] = password;

      if (user) {
        await api.patch(`/platform/users/${user["id"]}`, payload);
        notify("User updated.");
      } else {
        await api.post("/platform/users", payload);
        notify("User created.");
      }
      onSaved();
    } catch (caught) {
      if (caught instanceof ApiError) {
        setError(caught.message);
        setFieldErrors(caught.fieldErrors);
      } else {
        setError(errorMessage(caught));
      }
    } finally {
      setBusy(false);
    }
  }

  const selectedRole = roles.find((entry) => entry.id === roleId);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={user ? `Edit ${String(user["name"])}` : "Add a user"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={busy} onClick={() => void submit()}>
            {user ? "Save changes" : "Create user"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error ? <Notice tone="danger">{error}</Notice> : null}

        <div>
          <Label htmlFor="user-name" required>
            Name
          </Label>
          <Input id="user-name" value={name} onChange={(event) => setName(event.target.value)} className="mt-1" />
          {fieldErrors["name"] ? <FieldError>{fieldErrors["name"]}</FieldError> : null}
        </div>

        <div>
          <Label htmlFor="user-email" required>
            Email
          </Label>
          <Input
            id="user-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted">This is the login.</p>
          {fieldErrors["email"] ? <FieldError>{fieldErrors["email"]}</FieldError> : null}
        </div>

        <div>
          <Label htmlFor="user-role" required>
            Role
          </Label>
          <Select
            id="user-role"
            value={roleId}
            disabled={isSelf}
            onChange={(event) => setRoleId(event.target.value)}
            className="mt-1"
          >
            <option value="">Choose a role…</option>
            {roles.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
                {entry.isAdmin ? " (full access)" : ""}
              </option>
            ))}
          </Select>
          <p className="mt-1 text-xs text-muted">
            {isSelf
              ? "You cannot change your own role."
              : (selectedRole?.description ??
                "Determines exactly which modules this person can reach.")}
          </p>
          {fieldErrors["role"] ? <FieldError>{fieldErrors["role"]}</FieldError> : null}
        </div>

        <div>
          <Label htmlFor="user-status" required>
            Status
          </Label>
          <Select id="user-status" value={status} onChange={(event) => setStatus(event.target.value)} className="mt-1">
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </Select>
          <p className="mt-1 text-xs text-muted">
            Suspending a user ends their sessions immediately.
          </p>
        </div>

        <div>
          <Label htmlFor="user-password" required={!user}>
            Password
          </Label>
          <Input
            id="user-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1"
            placeholder={user ? "Leave blank to keep the current password" : ""}
          />
          <p className="mt-1 text-xs text-muted">At least 12 characters.</p>
          {fieldErrors["password"] ? <FieldError>{fieldErrors["password"]}</FieldError> : null}
        </div>

        {selectedRole?.isAdmin ? (
          <Notice tone="warn">
            This role has full administrator access — the user will be able to manage everyone
            else's access, including yours. Two-factor authentication is required and they set it up
            on first sign-in.
          </Notice>
        ) : null}
      </div>
    </Modal>
  );
}
