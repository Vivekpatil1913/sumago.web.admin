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
import { Plus, Search, X, type LucideIcon } from "lucide-react";
import { ApiError, api, queryString } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { formatDate, formatDateTime, humanise, statusTone, truncate } from "@/lib/admin/format";
import type { ColumnDef, ModuleSchema, RecordValue, SelectOption } from "@/lib/admin/types";
import { ExportMenu } from "@/components/admin/export-menu";
import { Pager } from "@/components/admin/pager";
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
  /**
   * Rendered instead of the label text, which becomes the button's accessible
   * name and its tooltip. Repeating "Edit / Delete" down every row is a lot of
   * text for two actions people recognise by shape — but an icon with no
   * accessible name is a button that screen readers announce as nothing, so
   * `label` stays required either way.
   */
  icon?: LucideIcon;
}

interface DataTableProps {
  module: ModuleSchema;
  /** Extra filters merged into every request (e.g. a fixed job id). */
  baseParams?: Record<string, string>;
  rowHref?: (row: RecordValue) => string;
  /**
   * Replace how one column draws its cell, keyed by column name. The column
   * still comes from the registry — this only changes what is rendered in it,
   * which is how the Jobs table turns its application count into a way in.
   */
  cellOverrides?: Record<string, (row: RecordValue) => React.ReactNode>;
  rowActions?: RowAction[];
  bulkActions?: { label: string; action: string; status?: string; tone?: "default" | "danger" }[];
  /**
   * Registry filters to leave out of the toolbar. The filter still exists
   * server-side — this only stops a module offering a dropdown nobody here
   * needs, or one its records never populate.
   */
  hideFilters?: string[];
  /**
   * Registry columns to leave out of the table. The data is still fetched and
   * the record still carries it — this hides a column, it does not remove a
   * field.
   */
  hideColumns?: string[];
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
  cellOverrides,
  rowActions = [],
  bulkActions,
  hideFilters,
  hideColumns,
  toolbarExtra,
  onCreate,
  refreshKey = 0,
  trash = false,
  onToggleActive,
}: DataTableProps) {
  const { loadOptions } = useApp();
  const { notify } = useToast();

  /*
   * The Active switch lives inside the Actions column, so that column has to
   * appear for a module that carries the switch even when it offers no row
   * actions — otherwise the toggle would have nowhere to render.
   *
   * Neither shows in the Trash: a deleted record's only meaningful action is
   * Restore, and flipping "active" on something nobody can see is noise.
   */
  const showActiveToggle = Boolean(module.hasActive) && !trash;
  const showActionsColumn = rowActions.length > 0 || showActiveToggle;

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

  /*
   * What the registry offers but this page has asked not to show. Both lists
   * match on the field name *or* the visible label, case-insensitively: a
   * column or filter is usually asked for by the heading someone can see
   * rather than the field name behind it.
   */
  const isHidden = (hide: string[] | undefined, name: string, label: string) => {
    if (!hide?.length) return false;
    const wanted = name.toLowerCase();
    const shown = label.toLowerCase();
    return hide.some((entry) => {
      const target = entry.toLowerCase();
      return target === wanted || target === shown;
    });
  };

  const toolbarFilters = module.filters.filter(
    (filter) => !isHidden(hideFilters, filter.name, filter.label),
  );
  const columns = module.columns.filter(
    (column) => !isHidden(hideColumns, column.name, column.label),
  );

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
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${module.label.toLowerCase()}…`}
            aria-label={`Search ${module.label}`}
            className="rounded-[var(--radius-pill)] pl-10"
          />
        </div>

        {toolbarFilters.map((filter) => (
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
          <ExportMenu
            endpoint={module.endpoint}
            params={params}
            fileBase={module.key}
            label={module.label}
            total={total}
          />
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
            {/* Row count, stated once above the head. Pagination at the foot
                says which slice you are looking at; this says how big the
                thing you are slicing is. */}
            <div className="flex items-center gap-2 px-4 pb-1 pt-4">
              <span className="rounded-[var(--radius-pill)] bg-canvas-subtle px-3 py-1 text-xs font-bold text-content-soft tabular-nums">
                {total} total
              </span>
            </div>

            <table className="w-full text-sm">
              <thead className="text-left">
                <tr>
                  {bulkActions ? (
                    <th scope="col" className="w-10 border-b border-line-soft px-4 py-3">
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

                  {/* Position in the list, not an identifier — it counts on
                      from the previous page rather than restarting at 1, so
                      "the fourth one down on page 2" is still row 29. */}
                  <th
                    scope="col"
                    className="w-12 border-b border-line-soft px-4 py-3 text-[11px] font-bold uppercase tracking-[0.07em] text-muted"
                  >
                    S. No.
                  </th>

                  {columns.map((column) => (
                    <th
                      key={column.name}
                      scope="col"
                      className="border-b border-line-soft px-4 py-3 text-[11px] font-bold uppercase tracking-[0.07em] text-muted"
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

                  {showActionsColumn ? (
                    <th
                      scope="col"
                      className="border-b border-line-soft px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.07em] text-muted"
                    >
                      Actions
                    </th>
                  ) : null}
                </tr>
              </thead>

              <tbody className="divide-y divide-line-soft">
                {rows.map((row, rowIndex) => {
                  const id = String(row["id"]);
                  const serial = (page - 1) * PAGE_SIZE + rowIndex + 1;
                  return (
                    <tr key={id} className="transition-colors hover:bg-canvas-subtle">
                      {bulkActions ? (
                        <td className="px-4 py-3.5">
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

                      <td className="px-4 py-3.5 align-middle tabular-nums text-muted">
                        {serial}
                      </td>

                      {columns.map((column, index) => {
                        const override = cellOverrides?.[column.name];
                        return (
                          <td key={column.name} className="px-4 py-3.5 align-middle">
                            {override ? (
                              // An overridden cell is never wrapped in the row
                              // link: it carries its own control, and a link
                              // inside a link is not valid markup.
                              override(row)
                            ) : index === 0 && rowHref ? (
                              <Link
                                href={rowHref(row)}
                                className="font-semibold text-content underline-offset-2 transition-colors hover:text-accent hover:underline"
                              >
                                {renderCell(column, row)}
                              </Link>
                            ) : (
                              renderCell(column, row)
                            )}
                          </td>
                        );
                      })}

                      {showActionsColumn ? (
                        <td className="whitespace-nowrap px-4 py-3.5 text-right">
                          <div className="inline-flex items-center gap-0.5">
                            {/* The Active switch sits at the head of the action
                                group rather than in a column of its own: it is
                                something you *do* to a row, not something the
                                row *is*, and grouping it here keeps every
                                control in one place at the end of the line. */}
                            {showActiveToggle ? (
                              <>
                                <ActiveCell
                                  row={row}
                                  module={module}
                                  onToggleActive={onToggleActive}
                                />
                                {rowActions.length > 0 ? (
                                  <span
                                    aria-hidden
                                    className="mx-1.5 h-5 w-px shrink-0 bg-line-soft"
                                  />
                                ) : null}
                              </>
                            ) : null}

                            {rowActions
                              .filter((action) => !action.visible || action.visible(row))
                              .map((action) => {
                                const Icon = action.icon;
                                return (
                                  <button
                                    key={action.label}
                                    type="button"
                                    onClick={() => action.onClick(row)}
                                    /* Both, deliberately: `title` gives sighted
                                       users the native tooltip that tells them
                                       what the glyph means, `aria-label` gives
                                       the button a name to announce. */
                                    {...(Icon ? { title: action.label, "aria-label": action.label } : {})}
                                    className={cn(
                                      "inline-flex items-center justify-center rounded-md font-medium transition-colors",
                                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-surface",
                                      // 32px square keeps the tap target usable
                                      // on touch without widening the column.
                                      Icon ? "h-8 w-8" : "px-1.5 py-1 text-xs",
                                      /* Colour, not grey: down a long list the
                                         glyph *is* the label, and a row of
                                         identical grey icons forces a hover on
                                         each one to tell them apart. Red stays
                                         reserved for the destructive one. */
                                      action.tone === "danger"
                                        ? "text-bad hover:bg-bad-soft"
                                        : "text-accent hover:bg-accent-soft",
                                    )}
                                  >
                                    {Icon ? (
                                      <Icon className="h-4 w-4" aria-hidden />
                                    ) : (
                                      action.label
                                    )}
                                  </button>
                                );
                              })}
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
      {!loading && !error ? (
        <Pager page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} />
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
