"use client";

import { useRef, useState } from "react";
import { AlertCircle, Loader2, UploadCloud, X, Check } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { HONEYPOT_FIELD, RESUME_ACCEPT, submitApplication, validateResume } from "@/lib/cms/forms";
import { Honeypot } from "@/components/atoms/honeypot";

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
 * `jobSlug` scopes the application to a role. Omit it and the server records an
 * open application, which is what the "send us your profile" route needs.
 */
export function ApplyPanel({ jobTitle, jobSlug }: { jobTitle: string; jobSlug?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const open = () => {
    setSent(false);
    setError(null);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const form = new FormData(event.currentTarget);
    const resume = form.get("resume");
    const file = resume instanceof File && resume.size > 0 ? resume : null;

    // Checked here purely to save the candidate uploading megabytes only to be
    // rejected; the server enforces the same rules regardless.
    const resumeProblem = validateResume(file);
    if (resumeProblem || !file) {
      setError(resumeProblem ?? "Attach your CV as a PDF, DOC or DOCX.");
      return;
    }

    setSending(true);
    setError(null);

    const result = await submitApplication({
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      mobile: String(form.get("mobile") ?? "").trim(),
      resume: file,
      honeypot: String(form.get(HONEYPOT_FIELD) ?? ""),
      ...(jobSlug ? { job: jobSlug } : {}),
    });

    setSending(false);
    if (result.ok) {
      setSent(true);
    } else {
      setError(result.message);
    }
  }

  const field =
    "w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";

  return (
    <>
      <Button size="lg" onClick={open}>
        Apply for this role
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="apply-title"
        className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-2xl border border-line bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          // click on the backdrop (the dialog element itself) closes it
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="p-6 sm:p-8">
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
            <form onSubmit={handleSubmit} className="relative mt-6 grid gap-4">
              <Honeypot />
              <div className="grid gap-1.5">
                <label htmlFor="apply-name" className="text-sm font-medium text-ink/80">
                  Full name
                </label>
                <input
                  id="apply-name"
                  name="name"
                  className={field}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="apply-mobile" className="text-sm font-medium text-ink/80">
                  Mobile number
                </label>
                <input
                  id="apply-mobile"
                  name="mobile"
                  type="tel"
                  inputMode="tel"
                  pattern="[0-9+\-\s]{7,15}"
                  className={field}
                  placeholder="+91 90000 00000"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="apply-email" className="text-sm font-medium text-ink/80">
                  Email
                </label>
                <input
                  id="apply-email"
                  name="email"
                  type="email"
                  className={field}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="grid gap-1.5">
                <span className="text-sm font-medium text-ink/80">Resume / CV</span>
                <label
                  htmlFor="apply-resume"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-line bg-mist px-4 py-3 text-sm text-ink/70 transition-colors hover:border-brand/40 hover:bg-brand/[0.03]"
                >
                  <UploadCloud size={18} className="shrink-0 text-brand" />
                  <span className="truncate">
                    {fileName ?? "Upload PDF, DOC, or DOCX (max 5 MB)"}
                  </span>
                  <input
                    id="apply-resume"
                    name="resume"
                    type="file"
                    accept={RESUME_ACCEPT}
                    required
                    className="sr-only"
                    onChange={(e) => {
                      setFileName(e.target.files?.[0]?.name ?? null);
                      setError(null);
                    }}
                  />
                </label>
              </div>

              {/* Consent is a legal precondition for storing a résumé, not a
                  nicety — the server rejects the upload without it, so the
                  candidate is told plainly what submitting means. */}
              <p className="text-xs leading-relaxed text-ink/65">
                Submitting stores your details and CV so the hiring team can consider
                you for this and future roles. Ask us to delete them at any time.
              </p>

              {error && (
                <p
                  role="alert"
                  className="flex items-start gap-2.5 rounded-lg border border-brand/30 bg-brand/5 p-3 text-sm leading-relaxed text-ink/80"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                  {error}
                </p>
              )}

              <div className="mt-2 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" onClick={close} disabled={sending}>
                  Cancel
                </Button>
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
