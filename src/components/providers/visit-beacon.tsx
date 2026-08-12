"use client";

/**
 * Page-view beacon — the source of the "Total visits on website" figure in the
 * admin dashboard.
 *
 * What it sends: the path, the referrer's host, and a random id that lives in
 * `sessionStorage` and therefore dies with the browser tab. What it does not
 * send, store, or derive: any cookie, any account, any fingerprint. The server
 * discards the IP address too (see `site_visits`). The point is to answer "is
 * the site being read" for the people running it — not to build a profile of
 * the person reading.
 *
 * It costs nothing the visitor can feel: one keepalive POST after paint,
 * fire-and-forget, no response parsed, and every failure swallowed. Nothing on
 * the page waits for it and nothing on the page breaks if the API is down.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "sumago.visitor";

/** An opaque per-tab id, so a reload is not counted as a new reader. */
function visitorId(): string | null {
  try {
    const existing = sessionStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    sessionStorage.setItem(VISITOR_KEY, fresh);
    return fresh;
  } catch {
    // Private mode, or storage disabled. The view still counts; it just cannot
    // be tied to the other views from the same tab.
    return null;
  }
}

/**
 * Both signals mean the same thing — "do not record me" — and both are cheap to
 * honour. A visit that opts out is simply never sent.
 */
function optedOut(): boolean {
  const nav = navigator as Navigator & {
    globalPrivacyControl?: boolean;
    msDoNotTrack?: string;
  };
  return (
    nav.globalPrivacyControl === true ||
    nav.doNotTrack === "1" ||
    nav.msDoNotTrack === "1"
  );
}

export function VisitBeacon() {
  const pathname = usePathname();
  // React runs effects twice in development's Strict Mode; without this the
  // dev-time figures would be exactly double the real ones.
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    if (optedOut()) return;

    const payload = JSON.stringify({
      path: pathname,
      visitor: visitorId(),
      referrer: document.referrer || null,
    });

    // Queued after the current frame so the beacon never competes with the
    // page's own first paint — the LCP budget in docs/14 comes first.
    const queued = window.setTimeout(() => {
      void fetch("/api/public/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // A counter is not worth a console error on a visitor's screen.
      });
    }, 0);

    return () => window.clearTimeout(queued);
  }, [pathname]);

  return null;
}
