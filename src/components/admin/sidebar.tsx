"use client";

/**
 * Sidebar.
 *
 * The module list comes from the schema, which the server already filtered to
 * the caller's role — PRD §2: "HR logging in sees Jobs + Applications, nothing
 * else." Nothing is hidden with CSS; a module the role cannot read never
 * reaches the browser.
 *
 * It collapses to an icon rail on wide screens (the preference persists) and
 * becomes a drawer on small ones.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as icons from "lucide-react";
import { LayoutDashboard, LogOut, X } from "lucide-react";
import { useApp } from "@/lib/admin/app-context";
import { cn, Avatar } from "@/components/admin/ui";
import { SumagoWordmark } from "@/components/admin/brand";
import type { ModuleSchema } from "@/lib/admin/types";

const GROUP_LABELS: Record<ModuleSchema["group"], string> = {
  hr: "HR & Recruitment",
  sales: "Sales",
  content: "Website content",
  platform: "Platform",
};

const GROUP_ORDER: ModuleSchema["group"][] = ["hr", "sales", "content", "platform"];

/** Resolve a lucide icon by name, falling back to a neutral shape. */
function ModuleIcon({ name, className }: { name: string; className?: string }) {
  const Registry = icons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const Icon = Registry[name] ?? icons.Circle;
  return <Icon className={className} />;
}

/** Modules with a dedicated screen live outside the generic /m/[module] route. */
const DEDICATED_ROUTES: Record<string, string> = {
  applications: "/admin/applications",
  enquiries: "/admin/enquiries",
  media: "/admin/media",
  users: "/admin/users",
  roles: "/admin/roles",
  "activity-log": "/admin/activity",
  settings: "/admin/settings",
};

export function moduleHref(module: ModuleSchema): string {
  return DEDICATED_ROUTES[module.key] ?? `/admin/m/${module.key}`;
}

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const { user, modules, signOut } = useApp();

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    label: GROUP_LABELS[group],
    items: modules.filter((module) => module.group === group),
  })).filter((entry) => entry.items.length > 0);

  const dashboardActive = pathname === "/admin";

  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden
        />
      ) : null}

      <aside
        aria-label="Modules"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-line-soft bg-surface",
          "transition-[width,transform] duration-300 ease-[var(--ease-admin)] lg:translate-x-0",
          collapsed ? "w-[var(--spacing-rail-tight)]" : "w-[var(--spacing-rail)]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "flex h-[var(--spacing-topbar)] shrink-0 items-center border-b border-line-soft",
            collapsed ? "justify-center px-2" : "justify-between px-4",
          )}
        >
          <Link href="/admin" onClick={onCloseMobile} className="min-w-0">
            <SumagoWordmark compact={collapsed} />
          </Link>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="rounded-md p-1 text-muted hover:bg-surface-hover hover:text-content lg:hidden"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {/* Navigation */}
        <nav className="admin-scroll flex-1 overflow-y-auto px-2 py-3">
          <NavLink
            href="/admin"
            label="Dashboard"
            icon={<LayoutDashboard className="h-[18px] w-[18px] shrink-0" aria-hidden />}
            active={dashboardActive}
            collapsed={collapsed}
            onNavigate={onCloseMobile}
          />

          {grouped.map((entry) => (
            <div key={entry.group} className="mt-4">
              {collapsed ? (
                <div className="mx-2 mb-2 h-px bg-line-soft" aria-hidden />
              ) : (
                <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                  {entry.label}
                </p>
              )}

              <ul className="space-y-0.5">
                {entry.items.map((module) => {
                  const href = moduleHref(module);
                  const active = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <li key={module.key}>
                      <NavLink
                        href={href}
                        label={module.label}
                        icon={<ModuleIcon name={module.icon} className="h-[18px] w-[18px] shrink-0" />}
                        active={active}
                        collapsed={collapsed}
                        onNavigate={onCloseMobile}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Account */}
        <div className="shrink-0 border-t border-line-soft p-2">
          {user ? (
            <Link
              href="/admin/account"
              onClick={onCloseMobile}
              title={collapsed ? user.name : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-[var(--radius-field)] p-2 transition-colors hover:bg-surface-hover",
                collapsed && "justify-center",
              )}
            >
              <Avatar name={user.name} size={28} />
              {!collapsed ? (
                <span className="min-w-0 leading-tight">
                  <span className="block truncate text-[13px] font-medium text-content">
                    {user.name}
                  </span>
                  <span className="block truncate text-[11px] text-muted">{user.roleName}</span>
                </span>
              ) : null}
            </Link>
          ) : null}

          <button
            type="button"
            onClick={() => void signOut()}
            title={collapsed ? "Sign out" : undefined}
            className={cn(
              "mt-0.5 flex w-full items-center gap-2.5 rounded-[var(--radius-field)] px-2 py-2 text-[13px] text-muted transition-colors hover:bg-surface-hover hover:text-bad",
              collapsed && "justify-center",
            )}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden />
            {!collapsed ? "Sign out" : null}
          </button>
        </div>
      </aside>
    </>
  );
}

function NavLink({
  href,
  label,
  icon,
  active,
  collapsed,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-[var(--radius-field)] px-2.5 py-2 text-[13px] font-medium transition-colors",
        collapsed && "justify-center",
        active
          ? "bg-accent-soft text-accent"
          : "text-content-soft hover:bg-surface-hover hover:text-content",
      )}
    >
      {/* Active marker — a short brand bar rather than a full-width fill. */}
      {active ? (
        <span
          className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r bg-accent"
          aria-hidden
        />
      ) : null}
      {icon}
      {!collapsed ? <span className="truncate">{label}</span> : null}
    </Link>
  );
}
