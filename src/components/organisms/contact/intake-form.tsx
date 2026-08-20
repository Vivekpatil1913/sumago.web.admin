"use client";

import { useId, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { FieldMessage, FieldLabel } from "@/components/atoms/field-message";
import { capabilities, industries } from "@/lib/site";
import { HONEYPOT_FIELD, submitEnquiry } from "@/lib/cms/forms";
import {
  rejectionReason,
  sanitizeField,
  validateTextField,
  type TextFieldKind,
} from "@/lib/forms/field-rules";
import { useFieldMessages } from "@/lib/forms/use-field-messages";
import { Honeypot } from "@/components/atoms/honeypot";
import { cn } from "@/lib/utils";

/**
 * Four-step intake — the shortest path from "interested" to a conversation
 * Sumago can prepare for. One decision per screen keeps the ask light while
 * still capturing who they are, their industry, what they need, and the
 * problem in their own words.
 *
 * Submits to `POST /api/public/contact` (Module 21). The server commits the
 * lead before attempting any email, so the confirmation below is shown only
 * once the enquiry is genuinely stored — never optimistically.
 */

const STEPS = [
  { title: "About you", blurb: "So we know who we're talking to." },
  { title: "Your industry", blurb: "So we come in already speaking your language." },
  { title: "What you need", blurb: "Pick everything that's on the table." },
  { title: "The problem", blurb: "In your words — this is the part we read first." },
] as const;

const field =
  "w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";

type FormState = {
  name: string;
  company: string;
  mobile: string;
  email: string;
  industry: string;
  services: string[];
  message: string;
};

type FieldKey = keyof FormState;
type Errors = Partial<Record<FieldKey, string>>;

const EMPTY: FormState = {
  name: "",
  company: "",
  mobile: "",
  email: "",
  industry: "",
  services: [],
  message: "",
};

/**
 * Steps whose only control is a chip group have no visible field label, so the
 * required mark goes on the step title instead — the same red asterisk, just
 * on the nearest thing that names what is being asked for.
 */
const TITLE_IS_THE_LABEL = [false, true, true, false];

/** Which fields each step owns — drives validation, focus, and the error map. */
const STEP_FIELDS: FieldKey[][] = [
  ["name", "company", "mobile", "email"],
  ["industry"],
  ["services"],
  ["message"],
];

/* ---------------------------------------------------------------------------
 * Validation
 *
 * The character rules live in `@/lib/forms/field-rules`, shared with the job
 * application form. What stays here is what only this form knows: which of
 * its answers are text fields and which are choices.
 *
 * Rules fire on Continue, not while typing — a message that appears
 * mid-keystroke reads as failure before the person has finished their thought.
 * Once a field has been flagged it re-checks on every change, so the message
 * clears the moment it is fixed.
 * ------------------------------------------------------------------------ */

/** The four fields that filter and validate as text. The rest are choices. */
const TEXT_FIELDS: Record<string, TextFieldKind | undefined> = {
  name: "name",
  company: "company",
  mobile: "mobile",
  email: "email",
};

function validateField(key: FieldKey, data: FormState): string | null {
  const kind = TEXT_FIELDS[key];
  if (kind) return validateTextField(kind, String(data[key]));

  switch (key) {
    case "industry":
      return data.industry ? null : "Please pick the industry closest to yours.";
    case "services":
      return data.services.length ? null : "Please pick at least one — the closest is fine.";
    default:
      return data.message.trim() ? null : "Please tell us a little about the problem.";
  }
}

function validateStep(step: number, data: FormState): Errors {
  const found: Errors = {};
  for (const key of STEP_FIELDS[step]) {
    const message = validateField(key, data);
    if (message) found[key] = message;
  }
  return found;
}

/** The honeypot input is uncontrolled; read it straight from the document. */
function honeypotValue(): string {
  if (typeof document === "undefined") return "";
  const field = document.getElementById(HONEYPOT_FIELD);
  return field instanceof HTMLInputElement ? field.value : "";
}

export function IntakeForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(EMPTY);
  // Errors (standing) and notices (a refused keystroke, which retires itself),
  // merged into `shown` — one message per field, notice first.
  const { errors, shown, setErrors, setFieldError, flashNotice, clearNotices, clearAll } =
    useFieldMessages<FieldKey>();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);
  const uid = useId();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    const kind = TEXT_FIELDS[key];
    // Filter first: what can never be valid never enters state, so it never
    // renders back into the field.
    const clean = (
      kind && typeof value === "string" ? sanitizeField(kind, value) : value
    ) as FormState[K];
    // Something was refused — say why, rather than letting the key look dead.
    if (kind && typeof value === "string" && clean !== value) {
      flashNotice(key, rejectionReason(kind, value));
    }
    const next = { ...data, [key]: clean };
    setData(next);
    // Only a field that has already been flagged re-checks as it is typed.
    if (errors[key]) setFieldError(key, validateField(key, next));
  };

  /** On blur, flag only what someone actually filled in — never "required". */
  const checkOnBlur = (key: FieldKey) => {
    if (!String(data[key]).trim()) return;
    setFieldError(key, validateField(key, data));
  };

  const toggleService = (name: string) => {
    const next: FormState = {
      ...data,
      services: data.services.includes(name)
        ? data.services.filter((s) => s !== name)
        : [...data.services, name],
    };
    setData(next);
    if (errors.services) setFieldError("services", validateField("services", next));
  };

  const go = (next: number) => {
    setStep(next);
    // Each step starts clean — messages belong to the step that raised them.
    clearAll();
    // Move focus to the step title so screen readers and keyboard users land
    // on the new step instead of staying on a button that just moved.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  /** Land the caret on the first thing that needs fixing, not the last. */
  const focusFirstInvalid = (found: Errors) => {
    const key = STEP_FIELDS[step].find((k) => found[k]);
    if (!key) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(`${uid}-${key}`);
      if (el instanceof HTMLElement) el.focus();
    });
  };

  /**
   * Send the lead. The confirmation only appears once the server has stored
   * it — telling someone their enquiry is in when it is not is the one failure
   * mode this form cannot have.
   */
  async function send() {
    setSending(true);
    setError(null);

    const result = await submitEnquiry({
      name: data.name.trim(),
      // Its own column on the enquiry, so it reaches the panel's Company
      // field rather than being appended to the message.
      company: data.company.trim(),
      email: data.email.trim(),
      phone: data.mobile.trim(),
      // The industry is not a column of its own on an enquiry, so it goes into
      // the message where a salesperson will actually read it.
      message: `${data.message.trim()}\n\nIndustry: ${data.industry}\nServices of interest: ${data.services.join(", ")}`,
      serviceInterest: data.services[0],
      source: "contact:intake-form",
      // Read from the DOM rather than state: the field is never rendered to a
      // human, so there is nothing for React to control.
      honeypot: honeypotValue(),
    });

    setSending(false);
    if (result.ok) {
      setSent(true);
    } else {
      setError(result.message);
      requestAnimationFrame(() => headingRef.current?.focus());
    }
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-paper p-8 text-center sm:p-12">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/10 text-success">
          <Check size={26} strokeWidth={3} />
        </span>
        <p className="mt-5 font-display text-2xl font-semibold text-ink">
          Got it, {data.name.split(" ")[0]} — talk soon.
        </p>
        <p className="mt-3 text-base leading-relaxed text-ink/70">
          Your phone is about to ring. Someone from the team will call you back to find
          a time that suits you — no queue, no script, and nothing to prepare. Bring the
          problem; the conversation will take care of itself.
        </p>
        <p className="mt-4 text-xs leading-relaxed text-ink/65">
          Prefer email? Reach the team directly at{" "}
          <a
            href="mailto:info@sumagoinfotech.com"
            className="font-medium text-brand-ink underline underline-offset-4"
          >
            info@sumagoinfotech.com
          </a>
          .
        </p>
        <div className="mt-7">
          <Button
            variant="outline"
            onClick={() => {
              setData(EMPTY);
              clearAll();
              setStep(0);
              setSent(false);
              setError(null);
            }}
          >
            Send another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress — four segments that fill as the conversation takes shape. */}
      <ol className="flex items-center gap-2" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex-1">
            <span className="sr-only">
              {`Step ${i + 1} of ${STEPS.length}: ${s.title}`}
              {i === step ? " (current)" : i < step ? " (completed)" : ""}
            </span>
            <span
              aria-hidden
              className={cn(
                "block h-1 rounded-full transition-colors duration-500",
                i <= step ? "bg-brand" : "bg-line",
              )}
            />
          </li>
        ))}
      </ol>

      <form
        // Native browser bubbles would fire before — and duplicate — the
        // messages under each field, so validation here is entirely ours.
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          // The step's own verdict replaces any keystroke notice still up.
          clearNotices();
          const found = validateStep(step, data);
          setErrors(found);
          if (Object.keys(found).length > 0) {
            focusFirstInvalid(found);
            return;
          }
          if (step < STEPS.length - 1) {
            go(step + 1);
            return;
          }
          if (!sending) void send();
        }}
        className="relative mt-6 rounded-2xl border border-line bg-paper p-6 sm:p-8"
      >
        <Honeypot />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-ink">
          Step {step + 1} of {STEPS.length}
        </p>
        <p
          ref={headingRef}
          tabIndex={-1}
          aria-live="polite"
          className="mt-2 font-display text-xl font-semibold text-ink outline-none sm:text-2xl"
        >
          {STEPS[step].title}
          {TITLE_IS_THE_LABEL[step] && (
            // The legend below already says "(required)" to screen readers.
            <span className="ml-1 text-brand" aria-hidden>
              *
            </span>
          )}
        </p>
        <p className="mt-1.5 text-sm text-ink/60">{STEPS[step].blurb}</p>

        <div className="mt-7">
          {step === 0 && (
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <FieldLabel htmlFor={`${uid}-name`}>Full name</FieldLabel>
                <input
                  id={`${uid}-name`}
                  className={inputClass(shown.name)}
                  placeholder="Your full name"
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={shown.name ? true : undefined}
                  aria-describedby={shown.name ? `${uid}-name-error` : undefined}
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                  onBlur={() => checkOnBlur("name")}
                />
                <FieldMessage id={`${uid}-name-error`} message={shown.name} />
              </div>
              <div className="grid gap-1.5">
                <FieldLabel htmlFor={`${uid}-company`}>Company name</FieldLabel>
                <input
                  id={`${uid}-company`}
                  className={inputClass(shown.company)}
                  placeholder="Your company"
                  autoComplete="organization"
                  aria-required="true"
                  aria-invalid={shown.company ? true : undefined}
                  aria-describedby={shown.company ? `${uid}-company-error` : undefined}
                  value={data.company}
                  onChange={(e) => set("company", e.target.value)}
                  onBlur={() => checkOnBlur("company")}
                />
                <FieldMessage id={`${uid}-company-error`} message={shown.company} />
              </div>
              <div className="grid gap-1.5">
                <FieldLabel htmlFor={`${uid}-mobile`}>Mobile number</FieldLabel>
                <input
                  id={`${uid}-mobile`}
                  type="tel"
                  inputMode="numeric"
                  className={inputClass(shown.mobile)}
                  placeholder="9876543210"
                  autoComplete="tel-national"
                  aria-required="true"
                  aria-invalid={shown.mobile ? true : undefined}
                  aria-describedby={shown.mobile ? `${uid}-mobile-error` : undefined}
                  value={data.mobile}
                  onChange={(e) => set("mobile", e.target.value)}
                  onBlur={() => checkOnBlur("mobile")}
                />
                <FieldMessage id={`${uid}-mobile-error`} message={shown.mobile} />
              </div>
              <div className="grid gap-1.5">
                <FieldLabel htmlFor={`${uid}-email`}>Work email</FieldLabel>
                <input
                  id={`${uid}-email`}
                  type="email"
                  className={inputClass(shown.email)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={shown.email ? true : undefined}
                  aria-describedby={shown.email ? `${uid}-email-error` : undefined}
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={() => checkOnBlur("email")}
                />
                <FieldMessage id={`${uid}-email-error`} message={shown.email} />
              </div>
            </div>
          )}

          {step === 1 && (
            <fieldset id={`${uid}-industry`} tabIndex={-1} className="outline-none">
              <legend className="sr-only">Select your industry (required)</legend>
              <div className="flex flex-wrap gap-2.5">
                {industries.map((name) => (
                  <Choice
                    key={name}
                    type="radio"
                    name={`${uid}-industry-option`}
                    label={name}
                    checked={data.industry === name}
                    onChange={() => set("industry", name)}
                  />
                ))}
              </div>
              <FieldMessage
                id={`${uid}-industry-error`}
                message={shown.industry}
                className="mt-4 text-sm"
              />
            </fieldset>
          )}

          {step === 2 && (
            <fieldset id={`${uid}-services`} tabIndex={-1} className="outline-none">
              <legend className="sr-only">
                Select the services you&apos;re interested in — choose as many as apply
                (at least one required)
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {capabilities.map((name) => (
                  <Choice
                    key={name}
                    type="checkbox"
                    name={`${uid}-services-option`}
                    label={name}
                    checked={data.services.includes(name)}
                    onChange={() => toggleService(name)}
                  />
                ))}
              </div>
              <FieldMessage
                id={`${uid}-services-error`}
                message={shown.services}
                className="mt-4 text-sm"
              />
              <p className="mt-4 text-xs text-ink/65">
                Not sure yet? Pick the closest — we&apos;ll figure out the rest together.
              </p>
            </fieldset>
          )}

          {step === 3 && (
            <div className="grid gap-1.5">
              <FieldLabel htmlFor={`${uid}-message`}>
                What business problem can we help you solve?
              </FieldLabel>
              <textarea
                id={`${uid}-message`}
                className={inputClass(shown.message)}
                rows={6}
                placeholder="Where you are today, where you want to be, and what's in the way."
                aria-required="true"
                aria-invalid={shown.message ? true : undefined}
                aria-describedby={shown.message ? `${uid}-message-error` : undefined}
                value={data.message}
                onChange={(e) => set("message", e.target.value)}
                onBlur={() => checkOnBlur("message")}
              />
              <FieldMessage id={`${uid}-message-error`} message={shown.message} />
            </div>
          )}
        </div>

        {/* Submission failures are the server's own wording — it writes them
            for end users, and rephrasing them here would only lose detail. */}
        {error && (
          <p
            role="alert"
            className="mt-6 flex items-start gap-2.5 rounded-lg border border-brand/30 bg-brand/5 p-4 text-sm leading-relaxed text-ink/80"
          >
            <AlertCircle size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden />
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => go(step - 1)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-ink/60 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <ArrowLeft size={16} aria-hidden />
              Back
            </button>
          ) : (
            <span />
          )}

          {/* Live even when the step is incomplete — pressing it is how someone
              asks what is still missing, and a dead button never answers. */}
          <Button type="submit" disabled={sending}>
            {sending ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden />
                Sending…
              </>
            ) : (
              <>
                {step === STEPS.length - 1 ? "Request a call back" : "Continue"}
                {step < STEPS.length - 1 && <ArrowRight size={16} aria-hidden />}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

/** The red border appears only once a field has actually been flagged. */
function inputClass(invalid?: string) {
  return cn(field, invalid && "border-brand focus:border-brand");
}

/** Chip-styled radio/checkbox — the native input stays for keyboard + AT. */
function Choice({
  type,
  name,
  label,
  checked,
  onChange,
}: {
  type: "radio" | "checkbox";
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "cursor-pointer select-none rounded-full border px-4 py-2 text-sm transition-colors",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2",
        checked
          ? "border-brand bg-brand text-white"
          : "border-line bg-paper text-ink/75 hover:border-brand/40 hover:text-ink",
      )}
    >
      <input
        type={type}
        name={name}
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}
