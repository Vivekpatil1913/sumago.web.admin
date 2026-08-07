"use client";

import { useId, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { capabilities, industries } from "@/lib/site";
import { HONEYPOT_FIELD, submitEnquiry } from "@/lib/cms/forms";
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
  mobile: string;
  email: string;
  industry: string;
  services: string[];
  message: string;
};

const EMPTY: FormState = {
  name: "",
  mobile: "",
  email: "",
  industry: "",
  services: [],
  message: "",
};

/** The honeypot input is uncontrolled; read it straight from the document. */
function honeypotValue(): string {
  if (typeof document === "undefined") return "";
  const field = document.getElementById(HONEYPOT_FIELD);
  return field instanceof HTMLInputElement ? field.value : "";
}

export function IntakeForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(EMPTY);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);
  const uid = useId();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggleService = (name: string) =>
    setData((d) => ({
      ...d,
      services: d.services.includes(name)
        ? d.services.filter((s) => s !== name)
        : [...d.services, name],
    }));

  /** Each step gates the next — the button stays disabled until it's answered. */
  const stepComplete = [
    data.name.trim().length > 1 &&
      /^[0-9+\-\s]{7,15}$/.test(data.mobile.trim()) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()),
    data.industry !== "",
    data.services.length > 0,
    data.message.trim().length > 0,
  ][step];

  const go = (next: number) => {
    setStep(next);
    // Move focus to the step title so screen readers and keyboard users land
    // on the new step instead of staying on a button that just moved.
    requestAnimationFrame(() => headingRef.current?.focus());
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
        <p className="mt-4 text-xs leading-relaxed text-ink/45">
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
        onSubmit={(e) => {
          e.preventDefault();
          if (step < STEPS.length - 1) {
            if (stepComplete) go(step + 1);
            return;
          }
          if (stepComplete && !sending) void send();
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
        </p>
        <p className="mt-1.5 text-sm text-ink/60">{STEPS[step].blurb}</p>

        <div className="mt-7">
          {step === 0 && (
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <label htmlFor={`${uid}-name`} className="text-sm font-medium text-ink/80">
                  Full name
                </label>
                <input
                  id={`${uid}-name`}
                  className={field}
                  placeholder="Your full name"
                  autoComplete="name"
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor={`${uid}-mobile`} className="text-sm font-medium text-ink/80">
                  Mobile number
                </label>
                <input
                  id={`${uid}-mobile`}
                  type="tel"
                  inputMode="tel"
                  className={field}
                  placeholder="+91 90000 00000"
                  autoComplete="tel"
                  value={data.mobile}
                  onChange={(e) => set("mobile", e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor={`${uid}-email`} className="text-sm font-medium text-ink/80">
                  Work email
                </label>
                <input
                  id={`${uid}-email`}
                  type="email"
                  className={field}
                  placeholder="you@company.com"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <fieldset>
              <legend className="sr-only">Select your industry</legend>
              <div className="flex flex-wrap gap-2.5">
                {industries.map((name) => (
                  <Choice
                    key={name}
                    type="radio"
                    name={`${uid}-industry`}
                    label={name}
                    checked={data.industry === name}
                    onChange={() => set("industry", name)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset>
              <legend className="sr-only">
                Select the services you&apos;re interested in — choose as many as apply
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {capabilities.map((name) => (
                  <Choice
                    key={name}
                    type="checkbox"
                    name={`${uid}-services`}
                    label={name}
                    checked={data.services.includes(name)}
                    onChange={() => toggleService(name)}
                  />
                ))}
              </div>
              <p className="mt-4 text-xs text-ink/50">
                Not sure yet? Pick the closest — we&apos;ll figure out the rest together.
              </p>
            </fieldset>
          )}

          {step === 3 && (
            <div className="grid gap-1.5">
              <label htmlFor={`${uid}-message`} className="text-sm font-medium text-ink/80">
                What business problem can we help you solve?
              </label>
              <textarea
                id={`${uid}-message`}
                className={field}
                rows={6}
                placeholder="Where you are today, where you want to be, and what's in the way."
                value={data.message}
                onChange={(e) => set("message", e.target.value)}
              />
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

          <Button type="submit" disabled={!stepComplete || sending}>
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
