/** Display formatting shared across the table and detail screens. */

export function formatDate(value: unknown): string {
  if (!value) return "—";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(value: unknown): string {
  if (!value) return "—";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "3 minutes ago" — used in the activity feed where exact times add nothing. */
export function timeAgo(value: unknown): string {
  if (!value) return "—";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "—";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";

  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "minute"],
    [3600, "hour"],
    [86400, "day"],
    [604800, "week"],
    [2592000, "month"],
    [31536000, "year"],
  ];

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let previous = 1;
  for (const [threshold, unit] of units) {
    if (seconds < threshold * (unit === "minute" ? 60 : 1) || threshold === 31536000) {
      const value = Math.round(seconds / previous);
      if (seconds < threshold || threshold === 31536000) {
        return formatter.format(-value, unit);
      }
    }
    previous = threshold;
  }
  return formatter.format(-Math.round(seconds / 31536000), "year");
}

export function formatBytes(value: unknown): string {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** `on_hold` -> `On hold`; `success-stories` -> `Success stories`. */
export function humanise(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value)
    .replace(/[_-]/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

/**
 * Where a record came from, in words.
 *
 * The API records the page a form was submitted from, which arrives as a full
 * URL — `http://localhost:3100/careers/frontend-engineer`. That is a developer's
 * answer to the question: what someone reading an application wants to know is
 * that it came through the website, not which port it was served on. The path
 * is kept alongside, because *which* page is genuinely useful; the origin,
 * never.
 *
 * Anything that is not a URL is a source the code set deliberately
 * (`contact:intake-form`), so it is left readable as-is.
 */
export function sourceLabel(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  const text = String(value).trim();

  if (!/^https?:\/\//i.test(text)) return humanise(text);

  try {
    const { pathname } = new URL(text);
    const path = pathname.replace(/\/+$/, "");
    return path && path !== "/" ? `Website — ${path}` : "Website";
  } catch {
    // Malformed enough that URL() gave up; say the one thing still true.
    return "Website";
  }
}

export function truncate(value: unknown, length = 80): string {
  const text = value === null || value === undefined ? "" : String(value);
  if (text === "") return "—";
  return text.length > length ? `${text.slice(0, length - 1)}…` : text;
}

/** Colour for a status badge. Unknown statuses fall back to neutral. */
export function statusTone(status: unknown): "ok" | "warn" | "danger" | "info" | "neutral" {
  switch (String(status)) {
    case "published":
    case "hired":
    case "won":
    case "active":
      return "ok";
    case "draft":
    case "new":
      return "info";
    case "on_hold":
    case "proposal":
    case "interviewing":
    case "shortlisted":
    case "reviewed":
    case "contacted":
    case "qualified":
    case "offered":
      return "warn";
    case "rejected":
    case "lost":
    case "closed":
    case "suspended":
      return "danger";
    default:
      return "neutral";
  }
}
