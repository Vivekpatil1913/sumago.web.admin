"use client";

/**
 * Module 13 — General Settings.
 *
 * "This is the module Sumago will touch most often." Grouped into the five PRD
 * tabs rather than one long form, because the person changing a phone number
 * should not have to scroll past the navigation structure to find it.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, api } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { Field } from "@/components/admin/form-fields";
import { Button, ErrorState, Notice, Spinner, cn } from "@/components/admin/ui";
import type { RecordValue } from "@/lib/admin/types";

const TABS: { id: string; label: string; fields: string[] }[] = [
  {
    id: "company",
    label: "Company",
    fields: ["name", "shortName", "tagline", "positioning", "foundedYear", "logo"],
  },
  { id: "contact", label: "Contact details", fields: ["phones", "expertLine", "emails"] },
  { id: "offices", label: "Offices", fields: ["offices"] },
  { id: "social", label: "Social media", fields: ["social"] },
  {
    id: "metrics",
    label: "Metrics & certifications",
    fields: ["metrics", "certifications", "defaultOgImage"],
  },
];

export default function SettingsPage() {
  const { moduleByKey, loading } = useApp();
  const { notify } = useToast();

  const [values, setValues] = useState<RecordValue>({});
  const [initial, setInitial] = useState<RecordValue>({});
  const [activeTab, setActiveTab] = useState("company");
  const [busy, setBusy] = useState(false);
  const [loadingRecord, setLoadingRecord] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const module = moduleByKey("settings");

  const load = useCallback(async () => {
    if (!module) return;
    setLoadingRecord(true);
    try {
      const response = await api.get<RecordValue>(module.endpoint);
      setValues(response.data ?? {});
      setInitial(response.data ?? {});
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoadingRecord(false);
    }
  }, [module]);

  useEffect(() => {
    void load();
  }, [load]);

  const dirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initial),
    [values, initial],
  );

  // The dashboard flags these; the form should say so where they are edited.
  const placeholderSocial = useMemo(() => {
    const social = values["social"];
    if (!Array.isArray(social)) return 0;
    return social.filter(
      (entry) => !(entry as RecordValue)?.["href"] || (entry as RecordValue)["href"] === "#",
    ).length;
  }, [values]);

  if (loading || loadingRecord) return <Spinner label="Loading settings" />;
  if (!module) return <ErrorState message="Your role does not have access to General Settings." />;
  if (error) return <ErrorState message={error} onRetry={() => void load()} />;

  const tab = TABS.find((entry) => entry.id === activeTab) ?? TABS[0]!;
  const tabFields = tab.fields
    .map((name) => module.fields.find((field) => field.name === name))
    .filter((field): field is NonNullable<typeof field> => Boolean(field));

  async function save() {
    if (!module) return;
    setBusy(true);
    setError(null);
    setFieldErrors({});
    try {
      const response = await api.patch<RecordValue>(module.endpoint, values);
      setValues(response.data);
      setInitial(response.data);
      notify("Settings saved. The site picks these up within a minute.");
    } catch (caught) {
      if (caught instanceof ApiError) {
        setError(caught.message);
        setFieldErrors(caught.fieldErrors);

        // Jump to whichever tab holds the first problem.
        const firstField = Object.keys(caught.fieldErrors)[0];
        if (firstField) {
          const root = firstField.split("[")[0] ?? firstField;
          const target = TABS.find((entry) => entry.fields.includes(root));
          if (target) setActiveTab(target.id);
        }
      } else {
        setError(errorMessage(caught));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl pb-24">
      <header className="mb-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-xl font-semibold text-content">General Settings</h1>
          <span className="text-xs text-muted">PRD Module 13</span>
        </div>
        <p className="mt-0.5 text-sm text-muted">
          Contact numbers, email IDs, addresses, map links and social links. These affect the header,
          footer and Contact page across the whole site.
        </p>
      </header>

      {error ? (
        <div className="mb-4">
          <Notice tone="danger" title="This could not be saved">
            {error}
          </Notice>
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-1 border-b border-line-soft" role="tablist">
        {TABS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={activeTab === entry.id}
            onClick={() => setActiveTab(entry.id)}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              activeTab === entry.id
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-content",
            )}
          >
            {entry.label}
            {entry.id === "social" && placeholderSocial > 0 ? (
              <span className="ml-1.5 rounded-full bg-warn-soft px-1.5 text-xs text-warn">
                {placeholderSocial}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {activeTab === "social" && placeholderSocial > 0 ? (
        <div className="mb-4">
          <Notice tone="warn" title="Placeholder links">
            {placeholderSocial} social link{placeholderSocial === 1 ? " is" : "s are"} still set to
            &ldquo;#&rdquo; and point nowhere on the live site. Replace them with the real profile URLs.
          </Notice>
        </div>
      ) : null}

      <div role="tabpanel" className="space-y-5 admin-card p-5">
        {tabFields.map((field) => (
          <Field
            key={field.name}
            field={field}
            value={values[field.name]}
            error={fieldErrors[field.name] ?? nestedError(fieldErrors, field.name)}
            disabled={!module.canWrite}
            onChange={(value) => {
              setValues((current) => ({ ...current, [field.name]: value }));
              setFieldErrors((current) => {
                if (!current[field.name]) return current;
                const next = { ...current };
                delete next[field.name];
                return next;
              });
            }}
          />
        ))}
      </div>

      {module.canWrite ? (
        <div className="sticky bottom-0 z-30 -mx-4 mt-6 border-t border-line-soft sm:-mx-6 lg:-mx-8 bg-[color-mix(in_srgb,var(--a-surface)_92%,transparent)] px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl items-center justify-end gap-2">
            {dirty ? <span className="mr-auto text-xs text-warn">Unsaved changes</span> : null}
            <Button variant="ghost" disabled={busy || !dirty} onClick={() => setValues(initial)}>
              Discard
            </Button>
            <Button variant="primary" loading={busy} disabled={!dirty} onClick={() => void save()}>
              Save settings
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function nestedError(errors: Record<string, string>, name: string): string | undefined {
  const key = Object.keys(errors).find((entry) => entry.startsWith(`${name}[`));
  return key ? errors[key] : undefined;
}
