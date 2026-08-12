"use client";

import { useCallback, useEffect, useState } from "react";
import { AppProvider, useApp } from "@/lib/admin/app-context";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import { ErrorState, Spinner, cn } from "@/components/admin/ui";

const COLLAPSE_KEY = "sumago-admin-rail";

function Shell({ children }: { children: React.ReactNode }) {
  const { loading, error, user, refresh } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Remember the rail preference between visits.
  useEffect(() => {
    setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
  }, []);

  const toggleCollapse = useCallback(() => {
    setCollapsed((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // Private browsing — the preference just won't persist.
      }
      return next;
    });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Loading the panel" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorState message={error} onRetry={() => void refresh()} />
      </div>
    );
  }

  // The provider redirects to /admin/login when there is no session; this covers
  // the frame between that decision and the navigation completing.
  if (!user) return <div className="min-h-screen" />;

  return (
    <div className="min-h-screen">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "flex min-h-screen min-w-0 flex-col transition-[padding] duration-300 ease-[var(--ease-admin)]",
          collapsed ? "lg:pl-[var(--spacing-rail-tight)]" : "lg:pl-[var(--spacing-rail)]",
        )}
      >
        <Topbar
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          onOpenMobile={() => setMobileOpen(true)}
        />

        {/*
          `py-5`, not `py-7`: the topbar already separates the content from the
          top of the window, so a tall gap under it was doubling a job that was
          done. The horizontal padding stays — that one is holding the content
          off the rail.
        */}
        <main id="main" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-9">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <Shell>{children}</Shell>
    </AppProvider>
  );
}
