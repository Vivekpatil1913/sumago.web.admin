"use client";

/**
 * Field renderers — one per PRD §4.1 type.
 *
 * Each receives the field definition from the schema and renders the right
 * control, its help text, its character counter, and any server-reported error.
 * Nothing here knows which module it belongs to.
 */
import { useEffect, useState } from "react";
import { GripVertical, Plus, Trash2, Upload } from "lucide-react";
import { api } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import type { FieldDef, RecordValue, SelectOption } from "@/lib/admin/types";
import {
  Button,
  CharCount,
  FieldError,
  FieldHelp,
  Input,
  Label,
  Notice,
  Select,
  Textarea,
  cn,
} from "@/components/admin/ui";

export interface FieldProps {
  field: FieldDef;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
  disabled?: boolean;
}

/* ------------------------------------------------------------ Dynamic list */

function useDynamicOptions(field: FieldDef): SelectOption[] {
  const { loadOptions } = useApp();
  const [options, setOptions] = useState<SelectOption[]>(field.options ?? []);

  useEffect(() => {
    if (field.options) {
      setOptions(field.options);
      return;
    }
    const source = field.optionsSource ?? (field.ref ? `ref:${field.ref}` : null);
    if (!source) return;

    let cancelled = false;
    void loadOptions(source).then((loaded) => {
      if (!cancelled) setOptions(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [field, loadOptions]);

  return options;
}

/* --------------------------------------------------------------- Wrapper */

function FieldShell({
  field,
  error,
  counter,
  children,
}: {
  field: FieldDef;
  error?: string;
  counter?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={field.name} required={field.required}>
          {field.label}
        </Label>
        {counter}
      </div>
      <div className="mt-1">{children}</div>
      {field.warn ? (
        <div className="mt-1.5">
          <Notice tone="warn">{field.warn}</Notice>
        </div>
      ) : null}
      {field.help ? <FieldHelp>{field.help}</FieldHelp> : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ Field */

export function Field({ field, value, error, onChange, disabled }: FieldProps) {
  const readOnly = disabled || field.readOnly;

  switch (field.type) {
    case "text":
    case "email":
    case "phone":
    case "url":
    case "slug":
    case "password":
      return (
        <FieldShell
          field={field}
          error={error}
          counter={field.max ? <CharCount value={String(value ?? "")} max={field.max} /> : undefined}
        >
          <Input
            id={field.name}
            type={
              field.type === "password"
                ? "password"
                : field.type === "email"
                  ? "email"
                  : field.type === "url"
                    ? "url"
                    : field.type === "phone"
                      ? "tel"
                      : "text"
            }
            value={String(value ?? "")}
            invalid={Boolean(error)}
            disabled={readOnly}
            required={field.required}
            onChange={(event) => onChange(event.target.value)}
            className={field.type === "slug" ? "font-mono text-xs" : undefined}
            autoComplete={field.type === "password" ? "new-password" : "off"}
          />
        </FieldShell>
      );

    case "longtext":
      return (
        <FieldShell
          field={field}
          error={error}
          counter={field.max ? <CharCount value={String(value ?? "")} max={field.max} /> : undefined}
        >
          <Textarea
            id={field.name}
            value={String(value ?? "")}
            invalid={Boolean(error)}
            disabled={readOnly}
            required={field.required}
            rows={4}
            onChange={(event) => onChange(event.target.value)}
          />
        </FieldShell>
      );

    case "richtext":
      return (
        <FieldShell field={field} error={error}>
          <Textarea
            id={field.name}
            value={String(value ?? "")}
            invalid={Boolean(error)}
            disabled={readOnly}
            required={field.required}
            rows={10}
            onChange={(event) => onChange(event.target.value)}
            className="font-mono text-xs leading-relaxed"
          />
          <FieldHelp>
            Markdown is supported: <code>**bold**</code>, <code>[link](url)</code>, <code>## heading</code>,
            <code> - list</code>.
          </FieldHelp>
        </FieldShell>
      );

    case "number":
      return (
        <FieldShell field={field} error={error}>
          <Input
            id={field.name}
            type="number"
            value={value === null || value === undefined ? "" : String(value)}
            invalid={Boolean(error)}
            disabled={readOnly}
            required={field.required}
            min={field.min}
            max={field.max}
            onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
            className="max-w-40"
          />
        </FieldShell>
      );

    case "date":
    case "datetime":
      return (
        <FieldShell field={field} error={error}>
          <Input
            id={field.name}
            type={field.type === "date" ? "date" : "datetime-local"}
            value={toInputDate(value, field.type)}
            invalid={Boolean(error)}
            disabled={readOnly}
            required={field.required}
            onChange={(event) => onChange(event.target.value || null)}
            className="max-w-56"
          />
        </FieldShell>
      );

    case "boolean":
      return (
        <div>
          <label className="flex items-start gap-2.5">
            <input
              id={field.name}
              type="checkbox"
              checked={value === true}
              disabled={readOnly}
              onChange={(event) => onChange(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-line-strong"
            />
            <span>
              <span className="text-sm font-medium text-content-soft">{field.label}</span>
              {field.help ? <FieldHelp>{field.help}</FieldHelp> : null}
            </span>
          </label>
          {field.warn ? (
            <div className="mt-1.5">
              <Notice tone="warn">{field.warn}</Notice>
            </div>
          ) : null}
          {error ? <FieldError>{error}</FieldError> : null}
        </div>
      );

    case "color":
      return (
        <FieldShell field={field} error={error}>
          <div className="flex items-center gap-2">
            <input
              id={field.name}
              type="color"
              value={String(value ?? "#e11d2e")}
              disabled={readOnly}
              onChange={(event) => onChange(event.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-line-soft bg-surface p-1"
            />
            <Input
              value={String(value ?? "")}
              disabled={readOnly}
              placeholder="#e11d2e"
              onChange={(event) => onChange(event.target.value)}
              className="max-w-32 font-mono text-xs"
            />
          </div>
        </FieldShell>
      );

    case "select":
    case "reference":
      return <SelectField field={field} value={value} error={error} onChange={onChange} disabled={readOnly} />;

    case "multiselect":
    case "referenceList":
      return <MultiSelectField field={field} value={value} error={error} onChange={onChange} disabled={readOnly} />;

    case "listOfText":
      return field.widget === "lines" ? (
        <LinesField field={field} value={value} error={error} onChange={onChange} disabled={readOnly} />
      ) : (
        <ListOfTextField field={field} value={value} error={error} onChange={onChange} disabled={readOnly} />
      );

    case "listOfObjects":
      return <ListOfObjectsField field={field} value={value} error={error} onChange={onChange} disabled={readOnly} />;

    case "image":
      return <ImageField field={field} value={value} error={error} onChange={onChange} disabled={readOnly} />;

    case "file":
      return (
        <FieldShell field={field} error={error}>
          <p className="text-sm text-content-soft">
            {value ? String(value) : "No file"}
          </p>
        </FieldShell>
      );

    default:
      return null;
  }
}

/* ------------------------------------------------------------ Select */

function SelectField({ field, value, error, onChange, disabled }: FieldProps) {
  const options = useDynamicOptions(field);

  return (
    <FieldShell field={field} error={error}>
      <Select
        id={field.name}
        value={String(value ?? "")}
        invalid={Boolean(error)}
        disabled={disabled}
        required={field.required}
        onChange={(event) => onChange(event.target.value || null)}
      >
        <option value="">{field.required ? "Choose…" : "None"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FieldShell>
  );
}

/* ------------------------------------------------------- Multi-select */

function MultiSelectField({ field, value, error, onChange, disabled }: FieldProps) {
  const options = useDynamicOptions(field);
  const selected = Array.isArray(value) ? value.map(String) : [];

  function toggle(optionValue: string) {
    onChange(
      selected.includes(optionValue)
        ? selected.filter((entry) => entry !== optionValue)
        : [...selected, optionValue],
    );
  }

  return (
    <FieldShell
      field={field}
      error={error}
      counter={
        <span className="text-xs text-muted">
          {selected.length} selected
          {field.maxItems ? ` (max ${field.maxItems})` : ""}
        </span>
      }
    >
      {options.length === 0 ? (
        <p className="rounded-md bg-canvas-subtle px-3 py-2 text-sm text-muted">
          No options available yet.
        </p>
      ) : (
        <div className="max-h-52 overflow-y-auto rounded-md ring-1 ring-inset ring-line-soft">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 border-b border-line-soft px-3 py-2 text-sm last:border-0 hover:bg-canvas-subtle"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                disabled={disabled}
                onChange={() => toggle(option.value)}
                className="h-4 w-4 rounded border-line-strong"
              />
              <span className="text-content-soft">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </FieldShell>
  );
}

/* ------------------------------------------------------ Lines (one box) */

/**
 * A `listOfText` written as one description box — one entry per line.
 *
 * The repeater below is right for short, fiddly lists you reorder. It is wrong
 * for the body of a job advert, where the editor is writing prose and wants to
 * type, not to press "Add item" eight times. The stored value is identical, so
 * the public page still gets its array.
 *
 * The textarea owns its own text while it is being typed in: a blank line the
 * editor has just opened with Enter, or a trailing space mid-word, would not
 * survive a round trip through the filtered array and the caret would jump.
 * Only a change from outside — the record loading, or a save replacing it —
 * overwrites what is on screen.
 */
function LinesField({ field, value, error, onChange, disabled }: FieldProps) {
  const items = Array.isArray(value) ? value.map(String) : [];
  const external = items.join("\n");

  const [text, setText] = useState(external);
  const [pushed, setPushed] = useState(external);
  if (external !== pushed) {
    setPushed(external);
    setText(external);
  }

  function handle(next: string) {
    const lines = next
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    setText(next);
    setPushed(lines.join("\n"));
    onChange(lines);
  }

  return (
    <FieldShell
      field={field}
      error={error}
      counter={
        <span className="text-xs text-muted">
          {items.length} point{items.length === 1 ? "" : "s"}
        </span>
      }
    >
      <Textarea
        id={field.name}
        value={text}
        invalid={Boolean(error)}
        disabled={disabled}
        required={field.required}
        rows={7}
        onChange={(event) => handle(event.target.value)}
      />
    </FieldShell>
  );
}

/* -------------------------------------------------------- List of text */

function ListOfTextField({ field, value, error, onChange, disabled }: FieldProps) {
  const items = Array.isArray(value) ? value.map(String) : [];
  const atMax = field.maxItems !== undefined && items.length >= field.maxItems;

  function update(index: number, next: string) {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved ?? "");
    onChange(copy);
  }

  return (
    <FieldShell
      field={field}
      error={error}
      counter={
        <span
          className={cn(
            "text-xs",
            field.minItems !== undefined && items.length < field.minItems
              ? "font-medium text-warn"
              : "text-muted",
          )}
        >
          {items.length}
          {field.minItems === field.maxItems && field.minItems !== undefined
            ? ` of ${field.minItems} required`
            : field.maxItems !== undefined
              ? ` of ${field.maxItems} max`
              : " items"}
        </span>
      }
    >
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted">{index + 1}.</span>
            <Input
              value={item}
              disabled={disabled}
              onChange={(event) => update(index, event.target.value)}
              aria-label={`${field.label} item ${index + 1}`}
            />
            <div className="flex shrink-0">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={disabled || index === 0}
                aria-label="Move up"
                className="rounded px-1 py-1 text-muted hover:bg-canvas-subtle hover:text-content-soft disabled:opacity-30"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={disabled || index === items.length - 1}
                aria-label="Move down"
                className="rounded px-1 py-1 text-muted hover:bg-canvas-subtle hover:text-content-soft disabled:opacity-30"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                disabled={disabled}
                aria-label={`Remove item ${index + 1}`}
                className="rounded px-1.5 py-1 text-muted hover:bg-bad-soft hover:text-bad"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          size="sm"
          variant="secondary"
          icon={<Plus className="h-3.5 w-3.5" />}
          disabled={disabled || atMax}
          onClick={() => onChange([...items, ""])}
        >
          {atMax ? `Maximum ${field.maxItems} reached` : "Add item"}
        </Button>
      </div>
    </FieldShell>
  );
}

/* ----------------------------------------------------- List of objects */

function ListOfObjectsField({ field, value, error, onChange, disabled }: FieldProps) {
  const rows = Array.isArray(value) ? (value as RecordValue[]) : [];
  const children = field.fields ?? [];
  const atMax = field.maxItems !== undefined && rows.length >= field.maxItems;

  function updateRow(index: number, childName: string, childValue: unknown) {
    const copy = rows.map((row, i) => (i === index ? { ...row, [childName]: childValue } : row));
    onChange(copy);
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const copy = [...rows];
    const [moved] = copy.splice(index, 1);
    if (moved) copy.splice(target, 0, moved);
    onChange(copy);
  }

  return (
    <FieldShell
      field={field}
      error={error}
      counter={<span className="text-xs text-muted">{rows.length} entries</span>}
    >
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={index} className="rounded-md bg-canvas-subtle p-3 ring-1 ring-inset ring-line-soft">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                <GripVertical className="h-3.5 w-3.5" aria-hidden />
                {field.label} {index + 1}
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={disabled || index === 0}
                  aria-label="Move up"
                  className="rounded px-1 py-0.5 text-muted hover:bg-surface disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={disabled || index === rows.length - 1}
                  aria-label="Move down"
                  className="rounded px-1 py-0.5 text-muted hover:bg-surface disabled:opacity-30"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => onChange(rows.filter((_, i) => i !== index))}
                  disabled={disabled}
                  aria-label={`Remove entry ${index + 1}`}
                  className="rounded px-1.5 py-0.5 text-muted hover:bg-bad-soft hover:text-bad"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {children.map((child) => (
                <Field
                  key={child.name}
                  field={{ ...child, name: `${field.name}[${index}].${child.name}` }}
                  value={row[child.name]}
                  disabled={disabled}
                  onChange={(childValue) => updateRow(index, child.name, childValue)}
                />
              ))}
            </div>
          </div>
        ))}

        <Button
          type="button"
          size="sm"
          variant="secondary"
          icon={<Plus className="h-3.5 w-3.5" />}
          disabled={disabled || atMax}
          onClick={() =>
            onChange([...rows, Object.fromEntries(children.map((child) => [child.name, defaultFor(child)]))])
          }
        >
          {atMax ? `Maximum ${field.maxItems} reached` : `Add ${field.label.toLowerCase()}`}
        </Button>
      </div>
    </FieldShell>
  );
}

/* -------------------------------------------------------------- Image */

function ImageField({ field, value, error, onChange, disabled }: FieldProps) {
  const { notify } = useToast();
  const [uploading, setUploading] = useState(false);
  const [alt, setAlt] = useState("");

  async function upload(file: File) {
    // PRD §4.4 — alt text is mandatory, so it is collected before the upload.
    if (!alt.trim()) {
      notify("Enter alt text first — every image needs it for accessibility and SEO.", "warn");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("alt", alt.trim());

      const response = await api.upload<{ url: string }>("/content/media/upload", form);
      onChange(response.data.url);
      notify("Image uploaded to the media library.");
      setAlt("");
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    } finally {
      setUploading(false);
    }
  }

  return (
    <FieldShell field={field} error={error}>
      <div className="space-y-2">
        {value ? (
          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={String(value)}
              alt=""
              className="h-20 w-28 rounded border border-line-soft object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-xs text-muted">{String(value)}</p>
              {!disabled ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="mt-1"
                  onClick={() => onChange(null)}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}

        {!disabled ? (
          <div className="space-y-2 rounded-md bg-canvas-subtle p-3 ring-1 ring-inset ring-line-soft">
            <Input
              value={alt}
              placeholder="Alt text (required) — describe the image"
              onChange={(event) => setAlt(event.target.value)}
              aria-label={`Alt text for ${field.label}`}
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-surface px-3 py-2 text-sm text-content-soft ring-1 ring-inset ring-line-soft hover:bg-canvas-subtle">
              <Upload className="h-3.5 w-3.5" aria-hidden />
              {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                className="sr-only"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void upload(file);
                  event.target.value = "";
                }}
              />
            </label>
            <p className="text-xs text-muted">
              JPG, PNG, WebP or SVG. Max 5 MB.
              {field.aspect ? ` Recommended ${field.aspect}.` : ""}
            </p>
          </div>
        ) : null}
      </div>
    </FieldShell>
  );
}

/* ------------------------------------------------------------ Helpers */

function defaultFor(field: FieldDef): unknown {
  if (field.defaultValue !== undefined) return field.defaultValue;
  switch (field.type) {
    case "boolean":
      return false;
    case "listOfText":
    case "listOfObjects":
    case "multiselect":
    case "referenceList":
      return [];
    case "number":
      return null;
    default:
      return "";
  }
}

function toInputDate(value: unknown, type: "date" | "datetime"): string {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value).slice(0, type === "date" ? 10 : 16);
  return type === "date" ? date.toISOString().slice(0, 10) : date.toISOString().slice(0, 16);
}

export { defaultFor };
