/**
 * Admin section layout.
 *
 * Sits outside the `(site)` route group, so nothing here renders the public
 * header or footer. It supplies the theme, the toast provider and the skip link.
 *
 * PRD Module 23: admin pages carry noindex. It is set here as metadata *and* as
 * a response header in next.config.ts — belt and braces, because this is the
 * surface that must never appear in search results.
 */
import type { Metadata } from "next";
import { ToastProvider } from "@/lib/admin/app-context";
import { ThemeProvider, themeBootScript } from "@/lib/admin/theme";

export const metadata: Metadata = {
  title: {
    default: "Sumago Admin",
    template: "%s — Sumago Admin",
  },
  description: "Content, recruitment and enquiry management for sumagoinfotech.com",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        Applies the saved theme before first paint. Without this the panel
        renders light for a frame and then snaps to dark, which looks broken.
      */}
      <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />

      <ThemeProvider>
        <div className="admin-root flex min-h-screen flex-1 flex-col">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[70] focus:rounded-[var(--radius-field)] focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:shadow-lg"
          >
            Skip to content
          </a>
          <ToastProvider>{children}</ToastProvider>
        </div>
      </ThemeProvider>
    </>
  );
}
