"use client";

/**
 * Generic edit screen, plus the Module 24 workflow controls: publish /
 * unpublish, preview, and version history with restore.
 */
import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ExternalLink, History } from "lucide-react";
import { api } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { formatDateTime } from "@/lib/admin/format";
import { RecordForm } from "@/components/admin/record-form";
import { Badge, Button, ErrorState, Modal, Spinner } from "@/components/admin/ui";
import type { RecordValue } from "@/lib/admin/types";

interface Version {
  id: string;
  version: number;
  createdAt: string;
  createdByName: string | null;
}

const SITE_ORIGIN = process.env["NEXT_PUBLIC_SITE_ORIGIN"] ?? "http://localhost:3000";

/** Public URL for a record that generates its own page. */
function publicPath(moduleKey: string, record: RecordValue): string | null {
  const slug = record["slug"];
  if (typeof slug !== "string" || !slug) return null;

  const routes: Record<string, string> = {
    services: "/solutions",
    industries: "/industries",
    "success-stories": "/impact",
    blog: "/blog",
    jobs: "/careers",
    "legal-pages": "",
  };
  const base = routes[moduleKey];
  return base === undefined ? null : `${SITE_ORIGIN}${base}/${slug}`;
}

export default function EditRecordPage({
  params,
}: {
  params: Promise<{ module: string; id: string }>;
}) {
  const { module: moduleKey, id } = use(params);
  const { moduleByKey, loading } = useApp();
  const { notify } = useToast();

  const [record, setRecord] = useState<RecordValue | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [showVersions, setShowVersions] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const module = moduleByKey(moduleKey);
  const isSingleton = id === "edit";

  const loadMeta = useCallback(async () => {
    if (!module || isSingleton) return;
    try {
      const response = await api.get<RecordValue>(`${module.endpoint}/${id}`);
      setRecord(response.data);
    } catch {
      // The form itself surfaces the load failure; this is only for the header.
    }
  }, [module, id, isSingleton]);

  useEffect(() => {
    void loadMeta();
  }, [loadMeta, reloadKey]);

  if (loading) return <Spinner />;
  if (!module) return <ErrorState message={`No module called "${moduleKey}".`} />;

  const listHref = `/admin/m/${module.key}`;
  const status = record?.["status"];

  async function setStatus(next: "publish" | "unpublish") {
    if (!module) return;
    setBusy(true);
    try {
      await api.post(`${module.endpoint}/${id}/${next}`);
      notify(next === "publish" ? `${module.singular} published.` : `${module.singular} moved to draft.`);
      setReloadKey((key) => key + 1);
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    } finally {
      setBusy(false);
    }
  }

  async function openVersions() {
    if (!module) return;
    setShowVersions(true);
    try {
      const response = await api.get<Version[]>(`${module.endpoint}/${id}/versions`);
      setVersions(response.data ?? []);
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    }
  }

  async function restore(version: number) {
    if (!module) return;
    if (!window.confirm(`Restore version ${version}? The current values are saved as a new version first.`)) {
      return;
    }
    setBusy(true);
    try {
      await api.post(`${module.endpoint}/${id}/restore/${version}`);
      notify(`Restored version ${version}.`);
      setShowVersions(false);
      setReloadKey((key) => key + 1);
      window.location.reload();
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    } finally {
      setBusy(false);
    }
  }

  const preview = record ? publicPath(module.key, record) : null;

  return (
    <div>
      <Link
        href={listHref}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-content"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        {module.label}
      </Link>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-content">
            {isSingleton
              ? module.label
              : String(record?.[module.identity] ?? `Edit ${module.singular.toLowerCase()}`)}
          </h1>
          {status ? (
            <Badge tone={status === "published" ? "ok" : "info"}>
              {status === "published" ? "Published" : "Draft"}
            </Badge>
          ) : null}
        </div>

        {!isSingleton ? (
          <div className="flex items-center gap-2">
            {preview && status === "published" ? (
              <a
                href={preview}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-surface px-3 py-2 text-sm text-content-soft ring-1 ring-line-soft hover:bg-canvas-subtle"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                View on site
              </a>
            ) : null}

            <Button
              variant="secondary"
              size="sm"
              icon={<History className="h-3.5 w-3.5" />}
              onClick={() => void openVersions()}
            >
              History
            </Button>

            {module.hasStatus && module.canWrite ? (
              status === "published" ? (
                <Button variant="secondary" size="sm" loading={busy} onClick={() => void setStatus("unpublish")}>
                  Unpublish
                </Button>
              ) : (
                <Button variant="primary" size="sm" loading={busy} onClick={() => void setStatus("publish")}>
                  Publish
                </Button>
              )
            ) : null}
          </div>
        ) : null}
      </div>

      <RecordForm
        key={reloadKey}
        module={module}
        recordId={isSingleton ? undefined : id}
        returnHref={isSingleton ? "/admin" : listHref}
        onSaved={(saved) => setRecord(saved)}
      />

      <Modal
        open={showVersions}
        onClose={() => setShowVersions(false)}
        title="Version history"
        width="max-w-xl"
      >
        {versions.length === 0 ? (
          <p className="text-sm text-muted">No earlier versions recorded yet.</p>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted">
              The last {versions.length} version{versions.length === 1 ? "" : "s"} of this record.
            </p>
            <ul className="divide-y divide-line-soft">
              {versions.map((version) => (
                <li key={version.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-content">Version {version.version}</p>
                    <p className="text-xs text-muted">
                      {formatDateTime(version.createdAt)}
                      {version.createdByName ? ` · ${version.createdByName}` : ""}
                    </p>
                  </div>
                  {module.canWrite ? (
                    <Button size="sm" variant="secondary" disabled={busy} onClick={() => void restore(version.version)}>
                      Restore
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal>
    </div>
  );
}
