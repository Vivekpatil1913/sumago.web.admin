"use client";

/**
 * Last-resort boundary, for errors thrown by the root layout itself.
 *
 * `(site)/error.tsx` cannot catch a throw from `(site)/layout.tsx` — a
 * segment's boundary wraps its children, not its own layout — and the layout is
 * where the header and the CMS-driven footer render. Without this, such a
 * failure would show the framework's default error screen.
 *
 * It replaces the entire document, so it has to supply its own <html> and
 * <body>, and it cannot rely on any provider, context, or component that the
 * broken layout was responsible for mounting. Everything below is deliberately
 * self-contained, down to the inline styles: if the stylesheet were the thing
 * that failed, Tailwind classes would render an unreadable page.
 */
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[site] root layout error", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          background: "#ffffff",
          color: "#1a1a1a",
        }}
      >
        <main style={{ maxWidth: "32rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            Sumago Infotech
          </h1>
          <p style={{ marginTop: "1rem", lineHeight: 1.7, color: "#555" }}>
            The site is temporarily unavailable. Our team has been notified.
          </p>
          <div
            style={{
              marginTop: "1.75rem",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                background: "#d73438",
                color: "#fff",
                border: 0,
                borderRadius: "0.5rem",
                padding: "0.75rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="mailto:info@sumagoinfotech.com"
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: "0.5rem",
                padding: "0.75rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#1a1a1a",
                textDecoration: "none",
              }}
            >
              Email us
            </a>
          </div>
          {error.digest ? (
            <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "#999" }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
