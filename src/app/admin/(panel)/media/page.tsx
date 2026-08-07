"use client";

/**
 * Module 14 — Media Library.
 *
 * Grid by default (you recognise an image faster than a filename), with the
 * table view kept for the audit columns. Alt text is required at upload; the
 * "missing alt" and "is stock" filters exist because both block launch.
 */
import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Grid3x3, Info, List, Search, Upload, X } from "lucide-react";
import { api, queryString } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { formatBytes, formatDate } from "@/lib/admin/format";
import { DataTable } from "@/components/admin/data-table";
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  Input,
  Label,
  Modal,
  Notice,
  Select,
  Spinner,
  Textarea,
  cn,
} from "@/components/admin/ui";
import type { RecordValue } from "@/lib/admin/types";

interface Usage {
  module: string;
  label: string;
  field: string;
}

export default function MediaPage() {
  const { moduleByKey, loading } = useApp();
  const { notify } = useToast();

  const [view, setView] = useState<"grid" | "table">("grid");
  const [assets, setAssets] = useState<RecordValue[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [detail, setDetail] = useState<RecordValue | null>(null);
  const [usage, setUsage] = useState<Usage[]>([]);
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const module = moduleByKey("media");

  const load = useCallback(async () => {
    if (!module || view !== "grid") return;
    setLoadingAssets(true);
    setError(null);
    try {
      const params: Record<string, string> = { pageSize: "60" };
      if (search) params["search"] = search;
      if (filter === "missingAlt") params["missingAlt"] = "true";
      if (filter === "isStock") params["isStock"] = "true";
      if (filter === "unused") params["unused"] = "true";
      if (filter === "image" || filter === "video") params["type"] = filter;

      const response = await api.get<RecordValue[]>(`${module.endpoint}${queryString(params)}`);
      setAssets(response.data ?? []);
      setTotal(response.meta?.total ?? 0);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoadingAssets(false);
    }
  }, [module, view, search, filter]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  if (loading) return <Spinner />;
  if (!module) return <ErrorState message="Your role does not have access to the Media Library." />;

  async function openDetail(asset: RecordValue) {
    setDetail(asset);
    setDeleteError(null);
    setUsage([]);
    try {
      const response = await api.get<Usage[]>(`${module!.endpoint}/${asset["id"]}/usage`);
      setUsage(response.data ?? []);
    } catch {
      // Usage is supplementary — the panel still works without it.
    }
  }

  async function remove() {
    if (!detail || !module) return;
    setBusy(true);
    setDeleteError(null);
    try {
      await api.delete(`${module.endpoint}/${detail["id"]}`);
      notify("Asset deleted.");
      setDetail(null);
      setRefreshKey((key) => key + 1);
    } catch (caught) {
      setDeleteError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-xl font-semibold text-content">Media Library</h1>
            <span className="text-xs text-muted">PRD Module 14</span>
          </div>
          <p className="mt-0.5 text-sm text-muted">Central store for every image and video.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-md ring-1 ring-line-soft">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={cn("rounded-l-md px-2 py-1.5", view === "grid" ? "bg-canvas-subtle text-content" : "text-muted")}
            >
              <Grid3x3 className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setView("table")}
              aria-label="Table view"
              aria-pressed={view === "table"}
              className={cn("rounded-r-md px-2 py-1.5", view === "table" ? "bg-canvas-subtle text-content" : "text-muted")}
            >
              <List className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {module.canWrite ? (
            <Button variant="primary" size="sm" icon={<Upload className="h-3.5 w-3.5" />} onClick={() => setUploadOpen(true)}>
              Upload
            </Button>
          ) : null}
        </div>
      </header>

      {view === "table" ? (
        <DataTable
          module={module}
          refreshKey={refreshKey}
          rowActions={[
            { label: "Asset details", icon: Info, onClick: (row) => void openDetail(row) },
          ]}
        />
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="relative min-w-48 flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search filename, alt or caption…"
                aria-label="Search media"
                className="pl-8"
              />
            </div>
            <Select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter" className="w-auto">
              <option value="">All assets</option>
              <option value="image">Images</option>
              <option value="video">Video</option>
              <option value="missingAlt">Missing alt text</option>
              <option value="unused">Unused</option>
              <option value="isStock">Stock (blocks launch)</option>
            </Select>
            <span className="ml-auto text-sm text-muted">{total} asset{total === 1 ? "" : "s"}</span>
          </div>

          {loadingAssets ? (
            <Spinner label="Loading media" />
          ) : error ? (
            <ErrorState message={error} onRetry={() => void load()} />
          ) : assets.length === 0 ? (
            <div className="admin-card">
              <EmptyState
                title="No assets yet"
                description="Upload the first image to start the library."
                action={
                  module.canWrite ? (
                    <Button variant="primary" size="sm" onClick={() => setUploadOpen(true)}>
                      Upload image
                    </Button>
                  ) : null
                }
              />
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {assets.map((asset) => {
                const missingAlt = !String(asset["alt"] ?? "").trim();
                return (
                  <li key={String(asset["id"])}>
                    <button
                      type="button"
                      onClick={() => void openDetail(asset)}
                      className="group w-full overflow-hidden rounded-lg bg-surface text-left ring-1 ring-line-soft transition-shadow hover:shadow-sm"
                    >
                      <div className="relative aspect-4/3 bg-canvas-subtle">
                        {String(asset["type"]) === "video" ? (
                          <div className="flex h-full items-center justify-center text-xs text-muted">Video</div>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={String(asset["url"])}
                            alt={String(asset["alt"] ?? "")}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        )}
                        {missingAlt ? (
                          <span className="absolute left-1.5 top-1.5 rounded bg-warn-soft0 p-1 text-white" title="Missing alt text">
                            <AlertTriangle className="h-3 w-3" aria-hidden />
                          </span>
                        ) : null}
                        {asset["isStock"] === true ? (
                          <span className="absolute right-1.5 top-1.5 rounded bg-bad-soft0 px-1.5 py-0.5 text-[10px] font-medium text-white">
                            Stock
                          </span>
                        ) : null}
                      </div>
                      <div className="p-2">
                        <p className="truncate text-xs font-medium text-content">{String(asset["filename"])}</p>
                        <p className="truncate text-[11px] text-muted">
                          {formatBytes(asset["size"])}
                          {asset["width"] ? ` · ${asset["width"]}×${asset["height"]}` : ""}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        endpoint={module.endpoint}
        onUploaded={() => {
          setUploadOpen(false);
          setRefreshKey((key) => key + 1);
        }}
      />

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={String(detail?.["filename"] ?? "Asset")}
        width="max-w-2xl"
        footer={
          module.canWrite ? (
            <>
              <Button variant="ghost" onClick={() => setDetail(null)}>
                Close
              </Button>
              <Button variant="danger" loading={busy} onClick={() => void remove()}>
                Delete asset
              </Button>
            </>
          ) : null
        }
      >
        {detail ? (
          <div className="space-y-4">
            {String(detail["type"]) !== "video" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={String(detail["url"])}
                alt={String(detail["alt"] ?? "")}
                className="max-h-64 w-full rounded border border-line-soft object-contain"
              />
            ) : null}

            {deleteError ? <Notice tone="danger" title="Cannot delete">{deleteError}</Notice> : null}

            {!String(detail["alt"] ?? "").trim() ? (
              <Notice tone="warn">
                This asset has no alt text. The site fails its accessibility audit while that is true.
              </Notice>
            ) : null}

            <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <Row label="Alt text" value={String(detail["alt"] ?? "—")} />
              <Row label="Type" value={String(detail["type"])} />
              <Row label="Size" value={formatBytes(detail["size"])} />
              <Row
                label="Dimensions"
                value={detail["width"] ? `${detail["width"]}×${detail["height"]}` : "—"}
              />
              <Row label="Uploaded" value={formatDate(detail["createdAt"])} />
              <Row label="Uploaded by" value={String(detail["uploadedByName"] ?? "—")} />
              <Row label="URL" value={String(detail["url"])} />
              <Row label="Stock" value={detail["isStock"] ? "Yes — blocks launch" : "No"} />
            </dl>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                Used in {usage.length} place{usage.length === 1 ? "" : "s"}
              </p>
              {usage.length === 0 ? (
                <p className="text-sm text-muted">Not referenced by any record — safe to delete.</p>
              ) : (
                <ul className="flex flex-wrap gap-1.5">
                  {usage.map((entry, index) => (
                    <li key={index}>
                      <Badge tone="info">
                        {entry.module}: {entry.label} ({entry.field})
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="truncate text-content">{value}</dd>
    </div>
  );
}

function UploadModal({
  open,
  onClose,
  endpoint,
  onUploaded,
}: {
  open: boolean;
  onClose: () => void;
  endpoint: string;
  onUploaded: () => void;
}) {
  const { notify } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [isStock, setIsStock] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setFile(null);
    setAlt("");
    setCaption("");
    setIsStock(false);
    setError(null);
  }

  async function submit() {
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }
    if (!alt.trim()) {
      setError("Alt text is required for every image — the site fails its audit without it.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("alt", alt.trim());
      if (caption) form.append("caption", caption);
      form.append("isStock", String(isStock));

      await api.upload(`${endpoint}/upload`, form);
      notify("Asset uploaded.");
      reset();
      onUploaded();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Upload to the media library"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" loading={busy} onClick={() => void submit()}>
            Upload
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {error ? <Notice tone="danger">{error}</Notice> : null}

        <div>
          <Label required>File</Label>
          {file ? (
            <div className="mt-1 flex items-center justify-between gap-2 rounded-md bg-canvas-subtle px-3 py-2 text-sm ring-1 ring-inset ring-line-soft">
              <span className="truncate">
                {file.name} <span className="text-muted">({formatBytes(file.size)})</span>
              </span>
              <button type="button" onClick={() => setFile(null)} aria-label="Remove file" className="text-muted hover:text-content-soft">
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ) : (
            <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-line-soft px-4 py-6 text-sm text-muted hover:border-line-strong hover:bg-canvas-subtle">
              <Upload className="h-4 w-4" aria-hidden />
              Choose an image or video
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml,video/mp4,video/webm"
                className="sr-only"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </label>
          )}
          <p className="mt-1 text-xs text-muted">
            JPG, PNG, WebP, SVG up to 5 MB. MP4 or WebM up to 200 MB.
          </p>
        </div>

        <div>
          <Label htmlFor="alt" required>
            Alt text
          </Label>
          <Input
            id="alt"
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            placeholder="Describe the image in a few words"
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted">
            Mandatory on every image — required for accessibility and SEO.
          </p>
        </div>

        <div>
          <Label htmlFor="caption">Caption</Label>
          <Textarea id="caption" rows={2} value={caption} onChange={(event) => setCaption(event.target.value)} className="mt-1" />
        </div>

        <label className="flex items-start gap-2.5">
          <input
            type="checkbox"
            checked={isStock}
            onChange={(event) => setIsStock(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-line-strong"
          />
          <span className="text-sm">
            <span className="font-medium text-content-soft">This is stock imagery</span>
            <span className="block text-xs text-muted">
              Preview only. The launch check fails while any stock asset is live.
            </span>
          </span>
        </label>
      </div>
    </Modal>
  );
}
