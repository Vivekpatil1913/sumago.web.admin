"use client";

/**
 * The module × permission checkbox matrix.
 *
 * One row per module, three columns: View, Edit, Delete. The columns are
 * dependent rather than independent — you cannot edit what you cannot view, and
 * you cannot delete what you cannot edit — so ticking a stronger permission
 * fills in the weaker ones, and unticking a weaker one clears the stronger.
 * That removes a whole class of confusing half-granted states.
 *
 * Modules that cannot be written or deleted at all (the Activity Log is an
 * audit record; the two inboxes are never deletable) render those boxes
 * disabled with a reason, rather than silently ignoring them on save.
 */
import { useMemo } from "react";
import { Check } from "lucide-react";
import type { PermissionCatalogueEntry, PermissionMap } from "@/lib/admin/types";
import { Badge, cn } from "@/components/admin/ui";

const GROUP_LABELS: Record<PermissionCatalogueEntry["group"], string> = {
  content: "Content",
  hr: "HR & Recruitment",
  sales: "Sales",
  platform: "Platform",
};

const GROUP_ORDER: PermissionCatalogueEntry["group"][] = ["content", "hr", "sales", "platform"];

type Level = "read" | "write" | "delete";

interface Props {
  catalogue: PermissionCatalogueEntry[];
  value: PermissionMap;
  onChange: (next: PermissionMap) => void;
  /** An administrator role ignores the matrix entirely. */
  disabled?: boolean;
}

export function PermissionMatrix({ catalogue, value, onChange, disabled = false }: Props) {
  const grouped = useMemo(
    () =>
      GROUP_ORDER.map((group) => ({
        group,
        label: GROUP_LABELS[group],
        modules: catalogue.filter((entry) => entry.group === group),
      })).filter((entry) => entry.modules.length > 0),
    [catalogue],
  );

  const granted = (moduleKey: string, level: Level): boolean =>
    value[moduleKey]?.[level] === true;

  function setLevel(entry: PermissionCatalogueEntry, level: Level, checked: boolean) {
    const current = value[entry.key] ?? {};
    let read = current.read === true;
    let write = current.write === true;
    let remove = current.delete === true;

    if (level === "read") {
      read = checked;
      // Losing view access takes edit and delete with it.
      if (!checked) {
        write = false;
        remove = false;
      }
    } else if (level === "write") {
      write = checked;
      if (checked) read = true;
      else remove = false;
    } else {
      remove = checked;
      if (checked) {
        read = true;
        write = true;
      }
    }

    const next = { ...value };
    if (!read && !write && !remove) delete next[entry.key];
    else next[entry.key] = { read, write, delete: remove };

    onChange(next);
  }

  /** Bulk-select a whole group — faster than ticking fifteen rows by hand. */
  function setGroup(modules: PermissionCatalogueEntry[], level: Level, checked: boolean) {
    let next = { ...value };
    for (const entry of modules) {
      if (level === "write" && !entry.supportsWrite) continue;
      if (level === "delete" && !entry.supportsDelete) continue;

      const current = next[entry.key] ?? {};
      let read = current.read === true;
      let write = current.write === true;
      let remove = current.delete === true;

      if (level === "read") {
        read = checked;
        if (!checked) {
          write = false;
          remove = false;
        }
      } else if (level === "write") {
        write = checked;
        if (checked) read = true;
        else remove = false;
      } else {
        remove = checked;
        if (checked) {
          read = true;
          write = true;
        }
      }

      if (!read && !write && !remove) delete next[entry.key];
      else next = { ...next, [entry.key]: { read, write, delete: remove } };
    }
    onChange(next);
  }

  const totalGranted = Object.keys(value).length;

  if (disabled) {
    return (
      <div className="rounded-lg bg-ok-soft p-4 text-sm text-ok ring-1 ring-inset ring-ok/30">
        <p className="flex items-center gap-2 font-medium">
          <Check className="h-4 w-4" aria-hidden />
          Full access to all {catalogue.length} modules
        </p>
        <p className="mt-1 text-content-soft">
          This role has full administrator access, so the checkboxes below do not apply. Turn that
          off to choose modules individually.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        {totalGranted === 0
          ? "No modules selected — someone with this role would see an empty panel."
          : `${totalGranted} of ${catalogue.length} modules selected.`}
      </p>

      {grouped.map(({ group, label, modules }) => (
        <div key={group} className="overflow-hidden rounded-lg ring-1 ring-line-soft">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-soft bg-canvas-subtle px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-content-soft">
              {label}
            </span>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setGroup(modules, "read", true)}
                className="text-muted underline underline-offset-2 hover:text-content"
              >
                View all
              </button>
              <button
                type="button"
                onClick={() => setGroup(modules, "write", true)}
                className="text-muted underline underline-offset-2 hover:text-content"
              >
                Edit all
              </button>
              <button
                type="button"
                onClick={() => setGroup(modules, "read", false)}
                className="text-muted underline underline-offset-2 hover:text-content"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="table-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line-soft text-left">
                  <th scope="col" className="px-3 py-2 text-xs font-medium text-muted">
                    Module
                  </th>
                  {(["read", "write", "delete"] as Level[]).map((level) => (
                    <th
                      key={level}
                      scope="col"
                      className="w-20 px-3 py-2 text-center text-xs font-medium text-muted"
                    >
                      {level === "read" ? "View" : level === "write" ? "Edit" : "Delete"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {modules.map((entry) => (
                  <tr key={entry.key} className="hover:bg-canvas-subtle">
                    <td className="px-3 py-2">
                      <span className="text-content">{entry.label}</span>
                      {!entry.supportsWrite ? (
                        <span className="ml-2">
                          <Badge tone="neutral">Read-only</Badge>
                        </span>
                      ) : !entry.supportsDelete ? (
                        <span className="ml-2">
                          <Badge tone="neutral">Never deletable</Badge>
                        </span>
                      ) : null}
                    </td>

                    {(["read", "write", "delete"] as Level[]).map((level) => {
                      const unsupported =
                        (level === "write" && !entry.supportsWrite) ||
                        (level === "delete" && !entry.supportsDelete);

                      return (
                        <td key={level} className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={granted(entry.key, level)}
                            disabled={unsupported}
                            onChange={(event) => setLevel(entry, level, event.target.checked)}
                            aria-label={`${
                              level === "read" ? "View" : level === "write" ? "Edit" : "Delete"
                            } ${entry.label}`}
                            title={
                              unsupported
                                ? level === "write"
                                  ? `${entry.label} is an audit record and cannot be edited by anyone.`
                                  : `${entry.label} can never be deleted (PRD §4.6).`
                                : undefined
                            }
                            className={cn(
                              "h-4 w-4 rounded border-line-strong",
                              unsupported && "cursor-not-allowed opacity-30",
                            )}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
