"use client";

/**
 * The generic list view — every PRD §4.2 element in one component.
 *
 * Search, date range, module filters, sortable columns, 25-row pagination,
 * bulk select, export, and per-row actions. Driven entirely by the module
 * schema, which is why all 25 modules behave identically without 25
 * implementations.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Plus, Search, X } from "lucide-react";
import { ApiError, api, downloadFile, queryString } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { formatDate, formatDateTime, humanise, statusTone, truncate } from "@/lib/admin/format";
import type { ColumnDef, ModuleSchema, RecordValue, SelectOption } from "@/lib/admin/types";
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  Input,
  Select,
  Spinner,
  Stars,
  Switch,
  cn,
} from "@/components/admin/ui";

const PAGE_SIZE = 25; // PRD §4.2

export interface RowAction {
  label: string;
  onClick: (row: RecordValue) => void;
  tone?: "default" | "danger";
  /** Hide the action for rows where it makes no sense. */
  visible?: (row: RecordValue) => boolean;
}

interface DataTableProps {
  module: ModuleSchema;
  /** Extra filters merged into every request (e.g. a fixed job id). */
  baseParams?: Record<string, string>;
  rowHref?: (row: RecordValue) => string;
  rowActions?: RowAction[];
  bulkActions?: { label: string; action: string; status?: string; tone?: "default" | "danger" }[];
  toolbarExtra?: React.ReactNode;
  onCreate?: () => void;
  /** Bumping this refetches — used after an action changes a row. */
  refreshKey?: number;
  /** Show the Trash (soft-deleted records) instead of the live list. */
  trash?: boolean;
  /** Called when the Active switch is flipped; the table re-fetches after. */
  onToggleActive?: (row: RecordValue, next: boolean) => Promise<void>;
}

interface DatePreset {
  label: string;
  days: number | null;
}

const DATE_PRESETS: DatePreset[] = [
  { label: "Any date", days: null },
  { label: "Today", days: 0 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "This year", days: -1 },
];

export function DataTable({
  module,
  baseParams,
  rowHref,
  rowActions = [],
  bulkActions,
  toolbarExtra,
  onCreate,
  refreshKey = 0,
  trash = false,
  onToggleActive,
}: DataTableProps) {
  const { loadOptions } = useApp();
  const { notify } = useToast();

  const [rows, setRows] = useState<RecordValue[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const [filterOptions, setFilterOptions] = useState<Record<string, SelectOption[]>>({});

  // Debounce the search box so typing does not fire a request per keystroke.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  // Resolve dynamic filter option lists once.
  useEffect(() => {
    let cancelled = false;
    const dynamic = module.filters.filter((filter) => filter.optionsSource || filter.ref);

    void Promise.all(
      dynamic.map(async (filter) => {
        const source = filter.optionsSource ?? `ref:${filter.ref}`;
        const options = await loadOptions(source);
        return [filter.name, options] as const;
      }),
    ).then((entries) => {
      if (cancelled) return;
      setFilterOptions(Object.fromEntries(entries));
    });

    return () => {
      cancelled = true;
    };
  }, [module, loadOptions]);

  const params = useMemo(() => {
    const query: Record<string, string> = { ...baseParams };
    query["page"] = String(page);
    query["pageSize"] = String(PAGE_SIZE);
    if (debouncedSearch) query["search"] = debouncedSearch;
    if (dateFrom) query["dateFrom"] = dateFrom;
    if (dateTo) query["dateTo"] = dateTo;
    if (sort) {
      query["sort"] = sort.column;
      query["direction"] = sort.direction;
    }
    for (const [key, value] of Object.entries(filters)) {
      if (value) query[key] = value;
    }
    return query;
  }, [baseParams, page, debouncedSearch, dateFrom, dateTo, sort, filters]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const path = trash ? `${module.endpoint}/trash` : module.endpoint;
      const response = await api.get<RecordValue[]>(`${path}${queryString(params)}`);
      setRows(response.data ?? []);
      setTotal(response.meta?.total ?? 0);
      setSelected(new Set());
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [module.endpoint, params, trash]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFiltersApplied =
    Boolean(debouncedSearch || dateFrom || dateTo) || Object.values(filters).some(Boolean);

  function applyDatePreset(preset: DatePreset) {
    if (preset.days === null) {
      setDateFrom("");
      setDateTo("");
    } else if (preset.days === -1) {
      setDateFrom(`${new Date().getFullYear()}-01-01`);
      setDateTo("");
    } else {
      const from = new Date();
      from.setDate(from.getDate() - preset.days);
      setDateFrom(from.toISOString().slice(0, 10));
      setDateTo("");
    }
    setPage(1);
  }

  function toggleSort(column: ColumnDef) {
    if (!column.sortable) return;
    setSort((current) =>
      current?.column === column.name
        ? { column: column.name, direction: current.direction === "asc" ? "desc" : "asc" }
        : { column: column.name, direction: "desc" },
    );
    setPage(1);
  }

  async function onExport() {
    try {
      const exportParams = { ...params };
      delete exportParams["page"];
      delete exportParams["pageSize"];
      await downloadFile(
        `/api${module.endpoint}/export${queryString(exportParams)}`,
        `${module.key}.csv`,
      );
      notify(`Exported ${total} row${total === 1 ? "" : "s"} of ${module.label}.`);
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    }
  }

  async function runBulk(action: string, status?: string) {
    if (selected.size === 0) return;
    setBusy(true);
    try {
      const response = await api.post<{ blocked?: { id: string; reason: string }[] }>(
        `${module.endpoint}/bulk`,
        { ids: [...selected], action, status },
      );

      const blocked = response.data?.blocked ?? [];
      if (blocked.length > 0) {
        // 207: partial success. Say exactly what did not go through and why.
        notify(
          `${selected.size - blocked.length} updated, ${blocked.length} could not be: ${blocked[0]?.reason ?? ""}`,
          "warn",
        );
      } else {
        notify(`${selected.size} record${selected.size === 1 ? "" : "s"} updated.`);
      }
      await load();
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {/* ------------------------------------------------------ Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${module.label.toLowerCase()}…`}
            aria-label={`Search ${module.label}`}
            className="pl-8"
          />
        </div>

        {module.filters.map((filter) => (
          <Select
            key={filter.name}
            value={filters[filter.name] ?? ""}
            aria-label={filter.label}
            onChange={(event) => {
              setFilters((current) => ({ ...current, [filter.name]: event.target.value }));
              setPage(1);
            }}
            className="w-auto min-w-32"
          >
            <option value="">{filter.label}: all</option>
            {filter.kind === "boolean" ? (
              <>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </>
            ) : (
              (filter.options ?? filterOptions[filter.name] ?? []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            )}
          </Select>
        ))}

        <Select
          aria-label="Date range"
          onChange={(event) => {
            const preset = DATE_PRESETS[Number(event.target.value)];
            if (preset) applyDatePreset(preset);
          }}
          className="w-auto"
          defaultValue="0"
        >
          {DATE_PRESETS.map((preset, index) => (
            <option key={preset.label} value={index}>
              {preset.label}
            </option>
          ))}
        </Select>

        {hasFiltersApplied ? (
          <Button
            variant="ghost"
            size="sm"
            icon={<X className="h-3.5 w-3.5" />}
            onClick={() => {
              setSearch("");
              setFilters({});
              setDateFrom("");
              setDateTo("");
              setPage(1);
            }}
          >
            Clear
          </Button>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          {toolbarExtra}
          <Button variant="secondary" size="sm" icon={<Download className="h-3.5 w-3.5" />} onClick={() => void onExport()}>
            Export
          </Button>
          {module.canWrite && onCreate ? (
            <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={onCreate}>
              Add new
            </Button>
          ) : null}
        </div>
      </div>

      {/* ------------------------------------------------- Bulk actions */}
      {bulkActions && selected.size > 0 ? (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-[var(--radius-card)] bg-accent-soft px-3 py-2 text-sm">
          <span className="font-medium text-accent">{selected.size} selected</span>
          {bulkActions.map((bulk) => (
            <Button
              key={bulk.label}
              size="sm"
              variant={bulk.tone === "danger" ? "danger" : "secondary"}
              disabled={busy}
              onClick={() => void runBulk(bulk.action, bulk.status)}
            >
              {bulk.label}
            </Button>
          ))}
          <button
            type="button"
            className="ml-auto text-xs text-muted underline underline-offset-2"
            onClick={() => setSelected(new Set())}
          >
            Clear selection
          </button>
        </div>
      ) : null}

      {/* ------------------------------------------------------- Table */}
      <div className="admin-card overflow-hidden">
        {loading ? (
          <Spinner label={`Loading ${module.label.toLowerCase()}`} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : rows.length === 0 ? (
          <EmptyState
            title={
              hasFiltersApplied
                ? `No ${module.label.toLowerCase()} match those filters`
                : `No ${module.label.toLowerCase()} yet`
            }
            description={
              hasFiltersApplied
                ? "Try clearing the search or date range."
                : module.canWrite
                  ? `Add your first ${module.singular.toLowerCase()} to get started.`
                  : undefined
            }
            action={
              !hasFiltersApplied && module.canWrite && onCreate ? (
                <Button variant="primary" size="sm" onClick={onCreate} icon={<Plus className="h-3.5 w-3.5" />}>
                  Add {module.singular.toLowerCase()}
                </Button>
              ) : null
            }
          />
        ) : (
          <div className="table-scroll">
            <table className="w-full text-sm">
              <thead className="border-b border-line-soft bg-canvas-subtle/60 text-left">
                <tr>
                  {bulkActions ? (
                    <th scope="col" className="w-10 px-3 py-2.5">
                      <input
                        type="checkbox"
                        aria-label="Select all rows on this page"
                        checked={selected.size === rows.length && rows.length > 0}
                        onChange={(event) =>
                          setSelected(
                            event.target.checked
                              ? new Set(rows.map((row) => String(row["id"])))
                              : new Set(),
                          )
                        }
                        className="h-4 w-4 cursor-pointer rounded border-line-strong accent-[var(--color-accent)]"
                      />
                    </th>
                  ) : null}

                  {module.hasActive && !trash ? (
                    <th
                      scope="col"
                      className="w-20 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted"
                    >
                      Active
                    </th>
                  ) : null}

                  {module.columns.map((column) => (
                    <th
                      key={column.name}
                      scope="col"
                      className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted"
                      aria-sort={
                        sort?.column === column.name
                          ? sort.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : undefined
                      }
                    >
                      {column.sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(column)}
                          className="inline-flex items-center gap-1 hover:text-content"
                        >
                          {column.label}
                          <span aria-hidden className="text-[10px]">
                            {sort?.column === column.name ? (sort.direction === "asc" ? "▲" : "▼") : "⇅"}
                          </span>
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  ))}

                  {rowActions.length > 0 ? (
                    <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                      Actions
                    </th>
                  ) : null}
                </tr>
              </thead>

              <tbody className="divide-y divide-line-soft">
                {rows.map((row) => {
                  const id = String(row["id"]);
                  return (
                    <tr key={id} className="hover:bg-canvas-subtle">
                      {bulkActions ? (
                        <td className="px-3 py-2.5">
                          <input
                            type="checkbox"
                            aria-label={`Select ${String(row[module.identity] ?? id)}`}
                            checked={selected.has(id)}
                            onChange={(event) =>
                              setSelected((current) => {
                                const next = new Set(current);
                                if (event.target.checked) next.add(id);
                                else next.delete(id);
                                return next;
                              })
                            }
                            className="h-4 w-4 cursor-pointer rounded border-line-strong accent-[var(--color-accent)]"
                          />
                        </td>
                      ) : null}

                      {module.hasActive && !trash ? (
                        <td className="px-3 py-2.5">
                          <ActiveCell
                            row={row}
                            module={module}
                            onToggleActive={onToggleActive}
                          />
                        </td>
                      ) : null}

                      {module.columns.map((column, index) => (
                        <td key={column.name} className="px-3 py-2.5 align-middle">
                          {index === 0 && rowHref ? (
                            <Link
                              href={rowHref(row)}
                              className="font-medium text-content underline-offset-2 transition-colors hover:text-accent hover:underline"
                            >
                              {renderCell(column, row)}
                            </Link>
                          ) : (
                            renderCell(column, row)
                          )}
                        </td>
                      ))}

                      {rowActions.length > 0 ? (
                        <td className="whitespace-nowrap px-3 py-2.5 text-right">
                          <div className="inline-flex gap-1">
                            {rowActions
                              .filter((action) => !action.visible || action.visible(row))
                              .map((action) => (
                                <button
                                  key={action.label}
                                  type="button"
                                  onClick={() => action.onClick(row)}
                                  className={cn(
                                    "rounded px-1.5 py-1 text-xs font-medium hover:bg-canvas-subtle",
                                    action.tone === "danger" ? "text-bad" : "text-content-soft",
                                  )}
                                >
                                  {action.label}
                                </button>
                              ))}
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* -------------------------------------------------- Pagination */}
      {!loading && !error && total > 0 ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <p>
            Showing{" "}
            <span className="font-medium text-content">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)}
            </span>{" "}
            of <span className="font-medium text-content">{total}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="tabular-nums">
              Page {page} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------- Cells */

function renderCell(column: ColumnDef, row: RecordValue): React.ReactNode {
  const value = row[column.name];

  switch (column.render) {
    case "boolean":
      return value ? (
        <span className="text-ok" aria-label="Yes">
          ✓
        </span>
      ) : (
        <span className="text-muted" aria-label="No">
          —
        </span>
      );

    case "status":
      return <Badge tone={statusTone(value)}>{humanise(value)}</Badge>;

    case "badge":
      return value ? <Badge tone={statusTone(value)}>{humanise(value)}</Badge> : <span className="text-muted">—</span>;

    case "date":
      return <span className="whitespace-nowrap text-content-soft">{formatDate(value)}</span>;

    case "datetime":
      return <span className="whitespace-nowrap text-content-soft">{formatDateTime(value)}</span>;

    case "number":
      return <span className="tabular-nums">{value === null || value === undefined ? "—" : String(value)}</span>;

    case "count":
      return (
        <span className="tabular-nums text-content-soft">{Number(value ?? 0)}</span>
      );

    case "stars":
      return <Stars value={value} />;

    case "image":
      return value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={String(value)}
          alt=""
          className="h-8 w-12 rounded border border-line-soft object-cover"
          loading="lazy"
        />
      ) : (
        <span className="text-muted">—</span>
      );

    case "reference":
      // The list query joins the referenced label as `<field>Name`.
      return <span>{String(row[`${column.name}Name`] ?? value ?? "—")}</span>;

    default:
      return <span className="text-content-soft">{truncate(value, 60)}</span>;
  }
}


/**
 * The Active on/off cell.
 *
 * Optimistic: the switch moves the moment it is clicked and reverts if the
 * request fails, because waiting on a round-trip for a toggle feels broken.
 */
function ActiveCell({
  row,
  module,
  onToggleActive,
}: {
  row: RecordValue;
  module: ModuleSchema;
  onToggleActive?: (row: RecordValue, next: boolean) => Promise<void>;
}) {
  const serverValue = row["isActive"] !== false;
  const [optimistic, setOptimistic] = useState(serverValue);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setOptimistic(serverValue);
  }, [serverValue]);

  return (
    <Switch
      checked={optimistic}
      disabled={!module.canWrite || !onToggleActive || busy}
      label={`${optimistic ? "Deactivate" : "Activate"} ${String(row[module.identity] ?? "record")}`}
      onChange={(next) => {
        if (!onToggleActive) return;
        setOptimistic(next);
        setBusy(true);
        void onToggleActive(row, next)
          .catch(() => setOptimistic(!next)) // put it back
          .finally(() => setBusy(false));
      }}
    />
  );
}
