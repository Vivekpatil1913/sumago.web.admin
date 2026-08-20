"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, UploadCloud, X, Check } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { FieldMessage, FieldLabel } from "@/components/atoms/field-message";
import {
  HONEYPOT_FIELD,
  RESUME_ACCEPT,
  RESUME_MAX_LABEL,
  submitApplication,
  validateResume,
} from "@/lib/cms/forms";
import {
  normalizeLinkedInUrl,
  rejectionReason,
  sanitizeField,
  validateTextField,
  type TextFieldKind,
} from "@/lib/forms/field-rules";
import { useFieldMessages } from "@/lib/forms/use-field-messages";
import { Honeypot } from "@/components/atoms/honeypot";
import { cn } from "@/lib/utils";

/**
 * Apply flow for a single role. The Apply button opens an accessible modal
 * (native <dialog> → built-in focus trap + Escape) with a short application
 * form: name, mobile, email, and resume/CV upload.
 *
 * Submits to `POST /api/public/apply` (Module 19). The résumé goes to private
 * storage — never a public URL — and HR reaches it through a signed link that
 * expires. The confirmation appears only after the server has stored both the
 * application and the file.
 *
 * Field rules are the contact form's, from `@/lib/forms/field-rules`: a name
 * means the same thing on either form, and so does a mobile number.
 *
 * `jobSlug` scopes the application to a role. Omit it and the server records an
 * open application, which is what the "send us your profile" route needs.
 */

type TextKey = "name" | "mobile" | "email" | "experience" | "currentCompany" | "linkedin";
type FieldKey = TextKey | "resume";

/** Every text field here maps straight onto a shared rule. */
const TEXT_KINDS: Record<TextKey, TextFieldKind> = {
  name: "name",
  mobile: "mobile",
  email: "email",
  experience: "experience",
  currentCompany: "company",
  linkedin: "linkedin",
};

/**
 * The one field a candidate may leave blank. Everything else on this form is
 * something the hiring team needs before it can act on the application; a
 * profile link is a nice-to-have, and plenty of good engineers have none.
 */
const OPTIONAL: FieldKey[] = ["linkedin"];

/** Asked in this order, so this is the order errors are answered in. */
const FIELD_ORDER: FieldKey[] = [
  "name",
  "mobile",
  "email",
  "experience",
  "currentCompany",
  "linkedin",
  "resume",
];

const EMPTY_VALUES: Record<TextKey, string> = {
  name: "",
  mobile: "",
  email: "",
  experience: "",
  currentCompany: "",
  linkedin: "",
};

export function ApplyPanel({ jobTitle, jobSlug }: { jobTitle: string; jobSlug?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<TextKey, string>>(EMPTY_VALUES);
  const [file, setFile] = useState<File | null>(null);
  const { errors, shown, setErrors, setFieldError, flashNotice, clearNotices, clearAll } =
    useFieldMessages<FieldKey>();

  /*
   * While the dialog is up, the page behind it does not scroll — and shows no
   * scrollbar of its own. Two scrollbars on screen at once is what makes a
   * modal feel like it is floating over a document rather than replacing it,
   * and a wheel gesture that moves the page underneath is worse.
   *
   * It has to be `html`, not `body`: the base stylesheet gives `html` an
   * `overflow-x: clip`, and a root with a non-visible overflow keeps the
   * viewport's scrolling for itself instead of taking it from `body`. Setting
   * `body { overflow: hidden }` on this site therefore does nothing at all.
   *
   * Only the Y axis is touched, so the root keeps the `clip` that stops one
   * stray wide element dragging the page sideways.
   *
   * Nothing shifts when the bar goes: `html` reserves its lane permanently
   * with `scrollbar-gutter: stable` (globals.css).
   *
   * Unlocking hangs off the dialog's own `close` event rather than the Cancel
   * handler, so Escape and a backdrop click release the page too.
   */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const unlock = () => {
      document.documentElement.style.overflowY = "";
    };
    dialog.addEventListener("close", unlock);
    return () => {
      dialog.removeEventListener("close", unlock);
      unlock();
    };
  }, []);

  const open = () => {
    setSent(false);
    setError(null);
    dialogRef.current?.showModal();
    document.documentElement.style.overflowY = "hidden";
  };
  const close = () => dialogRef.current?.close();

  /** An optional field left blank is fine; filled in, it is held to the rule. */
  const judge = (key: TextKey, value: string) =>
    OPTIONAL.includes(key) && !value.trim()
      ? null
      : validateTextField(TEXT_KINDS[key], value);

  const set = (key: TextKey, raw: string) => {
    const kind = TEXT_KINDS[key];
    // Filter first: what can never be valid never enters state, so it never
    // renders back into the field.
    const clean = sanitizeField(kind, raw);
    // Something was refused — say why, rather than letting the key look dead.
    if (clean !== raw) flashNotice(key, rejectionReason(kind, raw));
    setValues((current) => ({ ...current, [key]: clean }));
    // Only a field that has already been flagged re-checks as it is typed.
    if (errors[key]) setFieldError(key, judge(key, clean));
  };

  /** On blur, flag only what someone actually filled in — never "required". */
  const checkOnBlur = (key: TextKey) => {
    if (!values[key].trim()) return;
    setFieldError(key, judge(key, values[key]));
  };

  const chooseFile = (picked: File | null) => {
    setFile(picked);
    setError(null);
    // A file is picked, not typed: there is no half-finished state to protect,
    // so it is judged the moment it arrives.
    setFieldError("resume", picked ? validateResume(picked) : null);
  };

  function validateAll() {
    const found: Partial<Record<FieldKey, string>> = {};
    for (const key of Object.keys(TEXT_KINDS) as TextKey[]) {
      const message = judge(key, values[key]);
      if (message) found[key] = message;
    }
    const resumeProblem = validateResume(file);
    if (resumeProblem) found.resume = resumeProblem;
    return found;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    // The step's own verdict replaces any keystroke notice still up.
    clearNotices();
    const found = validateAll();
    setErrors(found);
    if (Object.keys(found).length > 0 || !file) {
      const first = FIELD_ORDER.find((key) => found[key]);
      if (first) {
        requestAnimationFrame(() => document.getElementById(`apply-${first}`)?.focus());
      }
      return;
    }

    setSending(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const result = await submitApplication({
      name: values.name.trim(),
      email: values.email.trim(),
      mobile: values.mobile.trim(),
      // Each has its own column on the application, so each reaches the field
      // of the same name in the panel rather than the cover note.
      experience: values.experience.trim(),
      currentCompany: values.currentCompany.trim(),
      // Omitted entirely when blank — an empty string would overwrite the
      // panel's "—" with nothing, which reads the same but stores worse.
      ...(values.linkedin.trim()
        ? { linkedin: normalizeLinkedInUrl(values.linkedin) }
        : {}),
      resume: file,
      honeypot: String(form.get(HONEYPOT_FIELD) ?? ""),
      ...(jobSlug ? { job: jobSlug } : {}),
    });

    setSending(false);
    if (result.ok) {
      setSent(true);
      setValues(EMPTY_VALUES);
      setFile(null);
      clearAll();
    } else {
      setError(result.message);
    }
  }

  const field =
    "w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";
  /** The red border appears only once a field has actually been flagged. */
  const inputClass = (invalid?: string) =>
    cn(field, invalid && "border-brand focus:border-brand");

  return (
    <>
      <Button size="lg" onClick={open}>
        Apply for this role
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="apply-title"
        // `overflow-hidden` is what keeps the corners round: the scroll lives
        // on the inner box, and the rounded parent clips its scrollbar to the
        // curve instead of letting it square off the corner.
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(46rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          // click on the backdrop (the dialog element itself) closes it
          if (e.target === dialogRef.current) close();
        }}
      >
        {/* Scrolls only when it has to — a short viewport, or a phone, or
            every field carrying a message at once. */}
        <div className="soft-scroll max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-ink">
                Apply
              </p>
              <h2 id="apply-title" className="mt-1 text-xl font-bold leading-snug">
                {jobTitle}
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink/65 transition-colors hover:bg-mist hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>

          {sent ? (
            <div className="mt-6 rounded-xl border border-line bg-mist p-8 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
                <Check size={22} strokeWidth={3} />
              </span>
              <p className="mt-4 font-display text-lg font-semibold">
                Application received.
              </p>
              <p className="mt-2 text-sm text-ink/70">
                Your CV is with the hiring team. You&apos;ll get a confirmation email
                shortly, and someone will be in touch about {jobTitle}.
              </p>
              <div className="mt-6">
                <Button variant="outline" onClick={close}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              // Native browser bubbles would fire before — and duplicate — the
              // messages under each field, so validation here is entirely ours.
              noValidate
              // Two columns on anything wider than a phone: seven fields in one
              // column made the dialog taller than the viewport, and a modal
              // that scrolls hides its own submit button.
              // `items-start` matters: without it a cell stretches to match a
              // taller neighbour, and an error message under one field would
              // pull its partner's input out of line.
              className="relative mt-6 grid items-start gap-x-5 gap-y-4 sm:grid-cols-2"
            >
              <Honeypot />
              <div className="grid gap-1.5">
                <FieldLabel htmlFor="apply-name">Full name</FieldLabel>
                <input
                  id="apply-name"
                  name="name"
                  className={inputClass(shown.name)}
                  placeholder="Your full name"
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={shown.name ? true : undefined}
                  aria-describedby={shown.name ? "apply-name-error" : undefined}
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  onBlur={() => checkOnBlur("name")}
                />
                <FieldMessage id="apply-name-error" message={shown.name} />
              </div>

              <div className="grid gap-1.5">
                <FieldLabel htmlFor="apply-mobile">Mobile number</FieldLabel>
                <input
                  id="apply-mobile"
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  className={inputClass(shown.mobile)}
                  placeholder="9876543210"
                  autoComplete="tel-national"
                  aria-required="true"
                  aria-invalid={shown.mobile ? true : undefined}
                  aria-describedby={shown.mobile ? "apply-mobile-error" : undefined}
                  value={values.mobile}
                  onChange={(e) => set("mobile", e.target.value)}
                  onBlur={() => checkOnBlur("mobile")}
                />
                <FieldMessage id="apply-mobile-error" message={shown.mobile} />
              </div>

              <div className="grid gap-1.5">
                <FieldLabel htmlFor="apply-email">Email</FieldLabel>
                <input
                  id="apply-email"
                  name="email"
                  type="email"
                  className={inputClass(shown.email)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={shown.email ? true : undefined}
                  aria-describedby={shown.email ? "apply-email-error" : undefined}
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={() => checkOnBlur("email")}
                />
                <FieldMessage id="apply-email-error" message={shown.email} />
              </div>

              <div className="grid gap-1.5">
                <FieldLabel htmlFor="apply-experience">Experience (years)</FieldLabel>
                <input
                  id="apply-experience"
                  name="experience"
                  inputMode="decimal"
                  className={inputClass(shown.experience)}
                  placeholder="4"
                  aria-required="true"
                  aria-invalid={shown.experience ? true : undefined}
                  aria-describedby={shown.experience ? "apply-experience-error" : undefined}
                  value={values.experience}
                  onChange={(e) => set("experience", e.target.value)}
                  onBlur={() => checkOnBlur("experience")}
                />
                <FieldMessage id="apply-experience-error" message={shown.experience} />
              </div>

              <div className="grid gap-1.5">
                <FieldLabel htmlFor="apply-currentCompany">Current company</FieldLabel>
                <input
                  id="apply-currentCompany"
                  name="currentCompany"
                  className={inputClass(shown.currentCompany)}
                  placeholder="Where you work now"
                  autoComplete="organization"
                  aria-required="true"
                  aria-invalid={shown.currentCompany ? true : undefined}
                  aria-describedby={
                    shown.currentCompany ? "apply-currentCompany-error" : undefined
                  }
                  value={values.currentCompany}
                  onChange={(e) => set("currentCompany", e.target.value)}
                  onBlur={() => checkOnBlur("currentCompany")}
                />
                <FieldMessage
                  id="apply-currentCompany-error"
                  message={shown.currentCompany}
                />
              </div>

              <div className="grid gap-1.5">
                <FieldLabel htmlFor="apply-linkedin" optional>
                  LinkedIn profile
                </FieldLabel>
                <input
                  id="apply-linkedin"
                  name="linkedin"
                  type="url"
                  inputMode="url"
                  className={inputClass(shown.linkedin)}
                  placeholder="linkedin.com/in/your-name"
                  aria-invalid={shown.linkedin ? true : undefined}
                  aria-describedby={shown.linkedin ? "apply-linkedin-error" : undefined}
                  value={values.linkedin}
                  onChange={(e) => set("linkedin", e.target.value)}
                  onBlur={() => checkOnBlur("linkedin")}
                />
                <FieldMessage id="apply-linkedin-error" message={shown.linkedin} />
              </div>

              <div className="grid gap-1.5 sm:col-span-2">
                <FieldLabel htmlFor="apply-resume">Resume / CV</FieldLabel>
                <label
                  htmlFor="apply-resume"
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-line bg-mist px-4 py-3 text-sm text-ink/70 transition-colors hover:border-brand/40 hover:bg-brand/[0.03]",
                    shown.resume && "border-brand",
                  )}
                >
                  <UploadCloud size={18} className="shrink-0 text-brand" />
                  <span className="truncate">
                    {file?.name ?? `Upload PDF, DOC, or DOCX (max ${RESUME_MAX_LABEL})`}
                  </span>
                  <input
                    id="apply-resume"
                    name="resume"
                    type="file"
                    accept={RESUME_ACCEPT}
                    className="sr-only"
                    aria-required="true"
                    aria-invalid={shown.resume ? true : undefined}
                    aria-describedby={shown.resume ? "apply-resume-error" : undefined}
                    onChange={(e) => chooseFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <FieldMessage id="apply-resume-error" message={shown.resume} />
              </div>

              {/* Consent is a legal precondition for storing a résumé, not a
                  nicety — the server rejects the upload without it, so the
                  candidate is told plainly what submitting means. */}
              <p className="text-xs leading-relaxed text-ink/65 sm:col-span-2">
                Submitting stores your details and CV so the hiring team can consider
                you for this and future roles. Ask us to delete them at any time.
              </p>

              {error && (
                <p
                  role="alert"
                  className="flex items-start gap-2.5 rounded-lg border border-brand/30 bg-brand/5 p-3 text-sm leading-relaxed text-ink/80 sm:col-span-2"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                  {error}
                </p>
              )}

              <div className="mt-2 flex items-center justify-end gap-3 sm:col-span-2">
                <Button type="button" variant="ghost" onClick={close} disabled={sending}>
                  Cancel
                </Button>
                {/* Live even when the form is incomplete — pressing it is how
                    someone asks what is still missing. */}
                <Button type="submit" disabled={sending}>
                  {sending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden />
                      Sending…
                    </>
                  ) : (
                    "Submit application"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
