"use client";

/** Shared create/edit form for a role. */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ApiError, api } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { PermissionMatrix } from "@/components/admin/permission-matrix";
import {
  Button,
  FieldError,
  FieldHelp,
  Input,
  Label,
  Notice,
  Spinner,
  Textarea,
} from "@/components/admin/ui";
import type {
  PermissionCatalogueEntry,
  PermissionMap,
  RoleRecord,
} from "@/lib/admin/types";

export function RoleEditor({ roleId }: { roleId?: string }) {
  const router = useRouter();
  const { user, refresh } = useApp();
  const { notify } = useToast();

  const [catalogue, setCatalogue] = useState<PermissionCatalogueEntry[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSystem, setIsSystem] = useState(false);
  const [permissions, setPermissions] = useState<PermissionMap>({});
  const [userCount, setUserCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const cat = await api.get<PermissionCatalogueEntry[]>("/platform/roles/catalogue");
      setCatalogue(cat.data ?? []);

      if (roleId) {
        const response = await api.get<RoleRecord>(`/platform/roles/${roleId}`);
        const role = response.data;
        setName(role.name);
        setDescription(role.description ?? "");
        setIsAdmin(role.isAdmin);
        setIsSystem(role.isSystem);
        setPermissions(role.permissions ?? {});
        setUserCount(role.userCount ?? 0);
      }
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      const payload = { name, description, isAdmin, permissions };
      if (roleId) {
        await api.patch(`/platform/roles/${roleId}`, payload);
        notify(
          userCount > 0
            ? `Role saved. ${userCount} user${userCount === 1 ? "" : "s"} affected immediately.`
            : "Role saved.",
        );
        // The signed-in user may have just changed their own access.
        await refresh();
      } else {
        await api.post("/platform/roles", payload);
        notify("Role created.");
      }
      router.push("/admin/roles");
    } catch (caught) {
      if (caught instanceof ApiError) {
        setError(caught.message);
        setFieldErrors(caught.fieldErrors);
      } else {
        setError(errorMessage(caught));
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner label="Loading role" />;
  if (!user?.isAdmin) return null;

  const editingOwnRole = roleId && user.permissions && roleId === (user as unknown as { roleId?: string }).roleId;

  return (
    <div className="mx-auto max-w-4xl pb-24">
      <Link
        href="/admin/roles"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-content"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Roles &amp; Permissions
      </Link>

      <h1 className="mb-5 text-xl font-semibold text-content">
        {roleId ? `Edit ${name || "role"}` : "New role"}
      </h1>

      {error ? (
        <div className="mb-4">
          <Notice tone="danger" title="This could not be saved">
            {error}
          </Notice>
        </div>
      ) : null}

      {isSystem ? (
        <div className="mb-4">
          <Notice tone="info">
            This is a built-in role. You can rename it and change what it grants, but it cannot be
            deleted — a fresh install always needs something sensible to assign.
          </Notice>
        </div>
      ) : null}

      {roleId && userCount > 0 ? (
        <div className="mb-4">
          <Notice tone="warn">
            {userCount} user{userCount === 1 ? " holds" : "s hold"} this role. Changes apply to them
            on their next action — they do not need to sign out.
          </Notice>
        </div>
      ) : null}

      <div className="space-y-5 admin-card p-5">
        <div>
          <Label htmlFor="role-name" required>
            Role name
          </Label>
          <Input
            id="role-name"
            value={name}
            maxLength={60}
            invalid={Boolean(fieldErrors["name"])}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Content Editor"
            className="mt-1"
          />
          {fieldErrors["name"] ? <FieldError>{fieldErrors["name"]}</FieldError> : null}
        </div>

        <div>
          <Label htmlFor="role-description">Description</Label>
          <Textarea
            id="role-description"
            rows={2}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this role for?"
            className="mt-1"
          />
          <FieldHelp>Shown on the Roles list so the next administrator knows the intent.</FieldHelp>
        </div>

        <div>
          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(event) => setIsAdmin(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-line-strong"
            />
            <span>
              <span className="text-sm font-medium text-content-soft">
                Full administrator access
              </span>
              <FieldHelp>
                Grants every module plus user and role management, ignoring the checkboxes below.
              </FieldHelp>
            </span>
          </label>
          {isAdmin ? (
            <div className="mt-2">
              <Notice tone="warn">
                Anyone with this role can change everyone else&rsquo;s access, including yours.
              </Notice>
            </div>
          ) : null}
        </div>
      </div>

      <section className="mt-5">
        <h2 className="mb-1 text-sm font-semibold text-content">Module access</h2>
        <p className="mb-3 text-sm text-muted">
          View lets them open a module. Edit lets them create and change records. Delete is separate
          because it cannot be undone.
        </p>

        <PermissionMatrix
          catalogue={catalogue}
          value={permissions}
          onChange={setPermissions}
          disabled={isAdmin}
        />
      </section>

      <div className="sticky bottom-0 z-30 -mx-4 mt-6 border-t border-line-soft sm:-mx-6 lg:-mx-8 bg-[color-mix(in_srgb,var(--a-surface)_92%,transparent)] px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-2">
          {editingOwnRole ? (
            <span className="mr-auto text-xs text-warn">
              This is your own role — be careful not to lock yourself out.
            </span>
          ) : null}
          <Button variant="ghost" onClick={() => router.push("/admin/roles")} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={saving}
            disabled={!name.trim()}
            onClick={() => void save()}
          >
            {roleId ? "Save role" : "Create role"}
          </Button>
        </div>
      </div>
    </div>
  );
}
