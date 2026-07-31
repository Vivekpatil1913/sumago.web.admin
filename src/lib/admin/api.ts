/**
 * API client.
 *
 * Every call returns either data or throws an `ApiError` carrying the code,
 * message and field-level details the server produced. Nothing in the UI
 * invents its own error text — the message shown to the user is the one the
 * server decided on, which is what keeps validation messages consistent.
 */

export interface FieldIssue {
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: FieldIssue[] | Record<string, unknown>;
  readonly requestId?: string;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: FieldIssue[] | Record<string, unknown>,
    requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }

  /** Field issues keyed by field name, for highlighting inputs. */
  get fieldErrors(): Record<string, string> {
    const map: Record<string, string> = {};
    if (Array.isArray(this.details)) {
      for (const issue of this.details) {
        if (issue && typeof issue.field === "string") map[issue.field] = issue.message;
      }
    }
    return map;
  }

  get isAuthError(): boolean {
    return this.status === 401 || this.code === "SESSION_EXPIRED";
  }
}

export interface ListMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: ListMeta & Record<string, unknown>;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** Sent as multipart instead of JSON. */
  formData?: FormData;
  signal?: AbortSignal;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const url = path.startsWith("/api") ? path : `/api${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      credentials: "include",
      headers: options.formData ? undefined : { "Content-Type": "application/json" },
      body: options.formData ?? (options.body === undefined ? undefined : JSON.stringify(options.body)),
      signal: options.signal,
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    // fetch only rejects on a network-level failure.
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Cannot reach the server. Check that the API is running, then try again.",
    );
  }

  if (response.status === 204) return { data: undefined as T };

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    if (response.ok) return { data: undefined as T };
    throw new ApiError(
      response.status,
      "INTERNAL_ERROR",
      `The server returned an unexpected response (${response.status}).`,
    );
  }

  const payload = (await response.json()) as {
    data?: T;
    meta?: ListMeta & Record<string, unknown>;
    error?: { code: string; message: string; details?: FieldIssue[]; requestId?: string };
  };

  if (!response.ok || payload.error) {
    const error = payload.error;
    throw new ApiError(
      response.status,
      error?.code ?? "INTERNAL_ERROR",
      error?.message ?? "Something went wrong.",
      error?.details,
      error?.requestId,
    );
  }

  return { data: payload.data as T, meta: payload.meta };
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) => request<T>(path, { method: "POST", formData }),
};

/** Build a query string, dropping empty values so URLs stay readable. */
export function queryString(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "" || value === "all") continue;
    search.set(key, String(value));
  }
  const result = search.toString();
  return result ? `?${result}` : "";
}

/** Trigger a browser download for an authenticated endpoint. */
export async function downloadFile(path: string, fallbackName: string): Promise<void> {
  const url = path.startsWith("/api") ? path : `/api${path}`;
  const response = await fetch(url, { credentials: "include" });

  if (!response.ok) {
    let message = `The export failed (${response.status}).`;
    try {
      const payload = (await response.json()) as { error?: { message?: string } };
      if (payload.error?.message) message = payload.error.message;
    } catch {
      // Non-JSON error body — the status-based message stands.
    }
    throw new ApiError(response.status, "INTERNAL_ERROR", message);
  }

  const disposition = response.headers.get("content-disposition") ?? "";
  const match = /filename="?([^"]+)"?/.exec(disposition);
  const filename = match?.[1] ?? fallbackName;

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
