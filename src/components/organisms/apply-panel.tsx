"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Check } from "lucide-react";
import { Button } from "@/components/atoms/button";

/**
 * Apply flow for a single role. The Apply button opens an accessible modal
 * (native <dialog> → built-in focus trap + Escape) with a short application
 * form: name, mobile, email, and resume/CV upload.
 *
 * NOTE: not yet wired to a backend — submitting shows a local confirmation.
 * Phase 4 connects this to the NestJS `applications` API (see docs/10).
 */
export function ApplyPanel({ jobTitle }: { jobTitle: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [sent, setSent] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const open = () => {
    setSent(false);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

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
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink/50 transition-colors hover:bg-mist hover:text-ink"
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
                [SAMPLE] This form isn&apos;t connected yet — backend wiring comes
                in Phase 4. We&apos;ll be in touch about {jobTitle}.
              </p>
              <div className="mt-6">
                <Button variant="outline" onClick={close}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mt-6 grid gap-4"
            >
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
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    required
                    className="sr-only"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                  />
                </label>
              </div>

              <div className="mt-2 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit">Submit application</Button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
