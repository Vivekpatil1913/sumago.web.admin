"use client";

/**
 * The generic record form.
 *
 * Renders any module from its schema: main fields, a collapsible SEO section
 * (PRD §4.5), unsaved-changes warning (PRD §4.2), and Save / Save & Add Another
 * / Cancel. Server validation errors are mapped back onto the exact fields that
 * produced them, including nested paths like `whoFor[0].title`.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ApiError, api } from "@/lib/admin/api";
import { errorMessage, useToast } from "@/lib/admin/app-context";
import type { FieldDef, ModuleSchema, RecordValue } from "@/lib/admin/types";
import { Field, defaultFor } from "@/components/admin/form-fields";
import { Button, Modal, Notice, Spinner } from "@/components/admin/ui";

interface RecordFormProps {
  module: ModuleSchema;
  /** Existing record when editing; undefined when creating. */
  recordId?: string;
  onSaved?: (record: RecordValue) => void;
  /** Where Cancel and a successful save return to. */
  returnHref: string;
}

export function RecordForm({ module, recordId, onSaved, returnHref }: RecordFormProps) {
  const router = useRouter();
  const { notify } = useToast();

  const [values, setValues] = useState<RecordValue>({});
  const [initial, setInitial] = useState<RecordValue>({});
  const [loading, setLoading] = useState(Boolean(recordId) || Boolean(module.singleton));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [seoOpen, setSeoOpen] = useState(false);
  const [confirmPrompt, setConfirmPrompt] = useState<string | null>(null);
  const [resolvedId, setResolvedId] = useState<string | undefined>(recordId);

  const editable = useMemo(
    () => module.fields.filter((field) => !field.readOnly && !field.hidden),
    [module.fields],
  );
  const mainFields = editable.filter((field) => field.section !== "seo");
  const seoFields = editable.filter((field) => field.section === "seo");
  const readOnlyFields = module.fields.filter((field) => field.readOnly && !field.hidden);

  /* --------------------------------------------------------- Load */

  const load = useCallback(async () => {
    if (!recordId && !module.singleton) {
      const blank: RecordValue = {};
      for (const field of editable) blank[field.name] = defaultFor(field);
      setValues(blank);
      setInitial(blank);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const path = module.singleton ? module.endpoint : `${module.endpoint}/${recordId}`;
      const response = await api.get<RecordValue>(path);
      const record = response.data ?? {};
      setValues(record);
      setInitial(record);
      setResolvedId(String(record["id"] ?? recordId ?? ""));
    } catch (caught) {
      setFormError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [recordId, module.singleton, module.endpoint, editable]);

  useEffect(() => {
    void load();
  }, [load]);

  /* ----------------------------------- Unsaved changes warning (§4.2) */

  const dirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initial),
    [values, initial],
  );
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  /* --------------------------------------------------------- Save */

  function setValue(name: string, value: unknown) {
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function save(options: { confirm?: boolean; addAnother?: boolean } = {}) {
    setSaving(true);
    setFormError(null);
    setFieldErrors({});

    // Send only editable fields — read-only values are the server's business.
    const payload: RecordValue = {};
    for (const field of editable) {
      payload[field.name] = values[field.name];
    }
    if (options.confirm) payload["confirm"] = true;

    try {
      const isUpdate = Boolean(resolvedId) || module.singleton;
      const path = module.singleton
        ? module.endpoint
        : isUpdate
          ? `${module.endpoint}/${resolvedId}`
          : module.endpoint;

      const response = isUpdate
        ? await api.patch<RecordValue>(path, payload)
        : await api.post<RecordValue>(path, payload);

      const saved = response.data;
      notify(`${module.singular} saved.`);
      setInitial(saved);
      setValues(saved);
      onSaved?.(saved);

      if (options.addAnother) {
        const blank: RecordValue = {};
        for (const field of editable) blank[field.name] = defaultFor(field);
        setValues(blank);
        setInitial(blank);
        setResolvedId(undefined);
        router.push(`${returnHref}/new`);
      } else {
        router.push(returnHref);
      }
    } catch (caught) {
      if (caught instanceof ApiError) {
        // A slug change on a published record needs an explicit confirmation.
        if (caught.status === 409 && caught.code === "CONFLICT" && !options.confirm) {
          setConfirmPrompt(caught.message);
          return;
        }
        setFormError(caught.message);
        setFieldErrors(caught.fieldErrors);

        // Reveal the SEO section if that is where the problem is.
        if (seoFields.some((field) => caught.fieldErrors[field.name])) setSeoOpen(true);

        const firstField = Object.keys(caught.fieldErrors)[0];
        if (firstField) {
          document
            .getElementById(firstField)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        setFormError(errorMessage(caught));
      }
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    router.push(returnHref);
  }

  if (loading) return <Spinner label={`Loading ${module.singular.toLowerCase()}`} />;

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
        noValidate
        // No bottom padding: the save bar below is sticky, not fixed, so it
        // takes its own space in the flow. The padding it used to reserve only
        // ever showed as blank canvas under the buttons.
        className="mx-auto max-w-3xl space-y-5"
      >
        {formError ? <Notice tone="danger" title="This could not be saved">{formError}</Notice> : null}

        {!module.canWrite ? (
          <Notice tone="info">
            Your role has read-only access to {module.label}. Changes cannot be saved.
          </Notice>
        ) : null}

        {/* System-set values, above the form and open: they are the record's
            provenance — who last touched it, when it went live, what state it
            is in — and that is context you want before you start editing, not
            a footnote you have to go and unfold afterwards. */}
        {resolvedId && readOnlyFields.length > 0 ? (
          <details open className="admin-card">
            <summary className="cursor-pointer px-5 py-3.5 text-sm font-semibold text-content">
              Record details
            </summary>
            <dl className="grid gap-x-6 gap-y-2 border-t border-line-soft px-5 py-4 text-sm sm:grid-cols-2">
              {readOnlyFields.map((field) => (
                <div key={field.name}>
                  <dt className="text-xs uppercase tracking-wide text-muted">{field.label}</dt>
                  <dd className="text-content-soft">{displayValue(values[field.name])}</dd>
                </div>
              ))}
            </dl>
          </details>
        ) : null}

        <div className="space-y-5 admin-card p-5">
          {mainFields.map((field) => (
            <Field
              key={field.name}
              field={field}
              value={values[field.name]}
              error={fieldErrors[field.name] ?? nestedError(fieldErrors, field)}
              disabled={!module.canWrite}
              onChange={(value) => setValue(field.name, value)}
            />
          ))}
        </div>

        {/* PRD §4.5 — collapsible SEO section at the bottom */}
        {seoFields.length > 0 ? (
          <div className="admin-card">
            <button
              type="button"
              onClick={() => setSeoOpen((open) => !open)}
              aria-expanded={seoOpen}
              className="flex w-full items-center gap-2 px-5 py-3.5 text-left text-sm font-semibold text-content"
            >
              {seoOpen ? (
                <ChevronDown className="h-4 w-4" aria-hidden />
              ) : (
                <ChevronRight className="h-4 w-4" aria-hidden />
              )}
              SEO
              <span className="ml-1 font-normal text-muted">
                — optional; sensible fallbacks are used when left empty
              </span>
            </button>
            {seoOpen ? (
              <div className="space-y-5 border-t border-line-soft px-5 py-5">
                {seoFields.map((field) => (
                  <Field
                    key={field.name}
                    field={field}
                    value={values[field.name]}
                    error={fieldErrors[field.name]}
                    disabled={!module.canWrite}
                    onChange={(value) => setValue(field.name, value)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* --------------------------------------------- Save bar */}
        {module.canWrite ? (
          <div className="sticky bottom-0 z-30 -mx-4 mt-4 border-t border-line-soft sm:-mx-6 lg:-mx-8 bg-[color-mix(in_srgb,var(--a-surface)_92%,transparent)] px-4 py-3 backdrop-blur-md">
            <div className="mx-auto flex max-w-3xl items-center justify-end gap-2">
              {dirty ? (
                <span className="mr-auto text-xs text-warn">Unsaved changes</span>
              ) : null}
              <Button type="button" variant="ghost" onClick={cancel} disabled={saving}>
                Cancel
              </Button>
              {!module.singleton ? (
                <Button
                  type="button"
                  variant="secondary"
                  loading={saving}
                  onClick={() => void save({ addAnother: true })}
                >
                  Save &amp; add another
                </Button>
              ) : null}
              <Button type="submit" variant="primary" loading={saving}>
                Save
              </Button>
            </div>
          </div>
        ) : null}
      </form>

      <Modal
        open={Boolean(confirmPrompt)}
        onClose={() => setConfirmPrompt(null)}
        title="This change breaks existing links"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmPrompt(null)}>
              Go back
            </Button>
            <Button
              variant="danger"
              loading={saving}
              onClick={() => {
                setConfirmPrompt(null);
                void save({ confirm: true });
              }}
            >
              Save anyway
            </Button>
          </>
        }
      >
        <p className="text-sm text-content-soft">{confirmPrompt}</p>
      </Modal>
    </>
  );
}

/** Surface the first nested error (`whoFor[0].title`) on its parent field. */
function nestedError(errors: Record<string, string>, field: FieldDef): string | undefined {
  const prefix = `${field.name}[`;
  const key = Object.keys(errors).find((name) => name.startsWith(prefix));
  return key ? errors[key] : undefined;
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length === 0 ? "—" : value.map(String).join(", ");
  return String(value);
}
