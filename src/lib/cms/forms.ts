/**
 * Client-side submission for the two public forms.
 *
 * These run in the browser and post to `/api/public/*` on the same origin —
 * Next rewrites that to the Express API (see next.config.ts), so there is no
 * CORS round trip and no API origin baked into the bundle.
 *
 * The server saves the record before it tries to send any email, so a failing
 * mail server can never lose an enquiry. That means a 2xx here is a genuine
 * "we have it", and the confirmation shown to the visitor is honest.
 */

export interface SubmitSuccess {
  ok: true;
  id: string;
}

export interface SubmitFailure {
  ok: false;
  /** Safe to show verbatim — the server writes these for end users. */
  message: string;
  /** Per-field messages, keyed by field name, for inline highlighting. */
  fieldErrors: Record<string, string>;
}

export type SubmitResult = SubmitSuccess | SubmitFailure;

const GENERIC_FAILURE =
  "Something went wrong sending that. Please try again, or email info@sumagoinfotech.com.";

/**
 * Give up after this long.
 *
 * A résumé upload on a slow connection legitimately takes a while, so this is
 * generous — but not unbounded: a request that never resolves leaves the button
 * spinning forever, and the visitor cannot tell whether their application was
 * received. Better to fail clearly and let them retry.
 */
const SUBMIT_TIMEOUT_MS = 30_000;

/**
 * The honeypot field name. Must stay one of the three the server's
 * `isHoneypotFilled` looks for (`website_url`, `_gotcha`, `company_website`) —
 * any other name and the trap is inert.
 *
 * A field a human never sees and never fills. Bots fill every input they find,
 * so a value here marks the submission as automated — the server then returns
 * a success response and saves nothing, because telling a bot it failed only
 * teaches it to try again differently.
 */
export const HONEYPOT_FIELD = "website_url";

interface ApiEnvelope {
  data?: { id?: string };
  error?: {
    message?: string;
    details?: { field: string; message: string }[];
  };
}

async function post(path: string, body: FormData | Record<string, unknown>): Promise<SubmitResult> {
  let response: Response;

  try {
    response = await fetch(path, {
      method: "POST",
      signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS),
      ...(body instanceof FormData
        ? { body }
        : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
    });
  } catch (error) {
    const failed = error as Error;
    if (failed.name === "TimeoutError" || failed.name === "AbortError") {
      return {
        ok: false,
        // Deliberately does not claim it failed to save: the request may have
        // reached the server. Suggesting a duplicate is better than implying
        // the enquiry was lost.
        message:
          "That took longer than expected. If you don't hear from us, please try again or email info@sumagoinfotech.com.",
        fieldErrors: {},
      };
    }
    // fetch only rejects on a network-level failure — offline, DNS, CORS.
    return {
      ok: false,
      message: "Could not reach the server. Check your connection and try again.",
      fieldErrors: {},
    };
  }

  let payload: ApiEnvelope = {};
  try {
    payload = (await response.json()) as ApiEnvelope;
  } catch {
    // A non-JSON body means something upstream failed; the status decides.
  }

  if (!response.ok) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of payload.error?.details ?? []) {
      if (issue?.field) fieldErrors[issue.field] = issue.message;
    }

    /*
     * 429 and 5xx carry no field-level detail, and the server's own wording is
     * already written for an end user — but a bare 5xx body may have none at
     * all, so those get a message that says what to do next.
     */
    const fallback =
      response.status >= 500
        ? "Our server had a problem saving that. Please try again in a moment, or email info@sumagoinfotech.com."
        : GENERIC_FAILURE;

    return {
      ok: false,
      message: payload.error?.message ?? fallback,
      fieldErrors,
    };
  }

  return { ok: true, id: payload.data?.id ?? "" };
}

export interface EnquiryInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  budget?: string;
  message: string;
  /** Which page the visitor submitted from. */
  source?: string;
  /** Honeypot value. Non-empty means a bot filled a field humans cannot see. */
  honeypot?: string;
}

/** Module 21 — the contact form. */
export async function submitEnquiry(input: EnquiryInput): Promise<SubmitResult> {
  const { honeypot, ...enquiry } = input;
  return post("/api/public/contact", {
    ...enquiry,
    [HONEYPOT_FIELD]: honeypot ?? "",
    // The server requires explicit consent before it will store a lead; the
    // form states this next to the submit button.
    consent: true,
  });
}

export interface ApplicationInput {
  name: string;
  email: string;
  mobile: string;
  resume: File;
  /** Job slug. Omit for an open application. */
  job?: string;
  coverNote?: string;
  experience?: string;
  currentCompany?: string;
  linkedin?: string;
  /** Honeypot value. Non-empty means a bot filled a field humans cannot see. */
  honeypot?: string;
}

/** Module 19 — the apply form. Multipart, because of the résumé. */
export async function submitApplication(input: ApplicationInput): Promise<SubmitResult> {
  const form = new FormData();
  form.set("name", input.name);
  form.set("email", input.email);
  form.set("mobile", input.mobile);
  form.set("resume", input.resume);
  form.set("consent", "true");
  form.set(HONEYPOT_FIELD, input.honeypot ?? "");
  if (input.job) form.set("job", input.job);
  if (input.coverNote) form.set("coverNote", input.coverNote);
  if (input.experience) form.set("experience", input.experience);
  if (input.currentCompany) form.set("currentCompany", input.currentCompany);
  if (input.linkedin) form.set("linkedin", input.linkedin);

  return post("/api/public/apply", form);
}

/**
 * Résumé rules (PRD §4.4).
 *
 * The size cap is deliberately tighter than the server's 5 MB: a CV that needs
 * more than two megabytes is a scan, not a document, and asking for a smaller
 * file up front beats a slow upload that the reader then struggles to open.
 * Being stricter than the server is safe; the server still has the last word.
 */
export const RESUME_ACCEPT = ".pdf,.doc,.docx";
export const RESUME_MAX_BYTES = 2 * 1024 * 1024;
/** The cap as people read it — keeps the label and the rule in step. */
export const RESUME_MAX_LABEL = "2 MB";

/**
 * Check a résumé before uploading it. The server re-checks everything — this
 * only saves the candidate a wasted round trip to be told no.
 */
export function validateResume(file: File | null | undefined): string | null {
  if (!file) return "Attach your CV as a PDF, DOC or DOCX.";
  if (!/\.(pdf|docx?)$/i.test(file.name)) return "Use a PDF, DOC or DOCX file.";
  if (file.size > RESUME_MAX_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return `That file is ${mb} MB — the limit is ${RESUME_MAX_LABEL}. Please attach a smaller one.`;
  }
  return null;
}
