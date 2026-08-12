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
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as icons from "lucide-react";
import { LayoutDashboard, LogOut, Search, X } from "lucide-react";
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
  jobs: "/admin/jobs",
  applications: "/admin/applications",
  enquiries: "/admin/enquiries",
  media: "/admin/media",
  users: "/admin/users",
  roles: "/admin/roles",
  "activity-log": "/admin/activity",
};

/**
 * Paths that belong to a module without sitting under its href. Jobs are listed
 * on their own screen but still edited through the generic record form, and the
 * rail would otherwise unlight itself the moment someone opened a job.
 */
const ALSO_ACTIVE_UNDER: Record<string, string[]> = {
  jobs: ["/admin/m/jobs"],
};

export function moduleHref(module: ModuleSchema): string {
  return DEDICATED_ROUTES[module.key] ?? `/admin/m/${module.key}`;
}

/** Whether `pathname` is inside the given module's screens. */
function isModuleActive(module: ModuleSchema, pathname: string): boolean {
  const candidates = [moduleHref(module), ...(ALSO_ACTIVE_UNDER[module.key] ?? [])];
  return candidates.some((href) => pathname === href || pathname.startsWith(`${href}/`));
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
  const [filter, setFilter] = useState("");

  const query = filter.trim().toLowerCase();

  /**
   * Group → subgroup → modules, preserving registry order within each level.
   * Filtering flattens the subgroups: when someone is searching they want the
   * six matches, not six headings each holding one item.
   */
  const grouped = useMemo(() => {
    // A module reached from inside another one (Applications, from Jobs) has no
    // entry here — including under Jump-to, where a second route to the same
    // screen would only raise the question of how the two differ.
    const listed = modules.filter((entry) => !entry.hideInNav);
    const matches = query
      ? listed.filter(
          (entry) =>
            entry.label.toLowerCase().includes(query) ||
            entry.key.toLowerCase().includes(query),
        )
      : listed;

    return GROUP_ORDER.map((group) => {
      const items = matches.filter((entry) => entry.group === group);

      // Map preserves insertion order, so subgroups appear in registry order.
      // (`entry`, not `module` — the latter shadows the CommonJS global and
      // trips @next/next/no-assign-module-variable.)
      const sections = new Map<string, ModuleSchema[]>();
      const ungrouped: ModuleSchema[] = [];
      for (const entry of items) {
        const heading = query ? undefined : entry.subgroup;
        if (!heading) {
          ungrouped.push(entry);
          continue;
        }
        const existing = sections.get(heading);
        if (existing) existing.push(entry);
        else sections.set(heading, [entry]);
      }

      return {
        group,
        label: GROUP_LABELS[group],
        count: items.length,
        ungrouped,
        sections: [...sections.entries()],
      };
    }).filter((entry) => entry.count > 0);
  }, [modules, query]);

  const dashboardActive = pathname === "/admin";
  const noMatches = query !== "" && grouped.length === 0;

  /**
   * Which group holds the screen that is open. The rail marks that heading, so
   * the current location is readable one level up from the highlighted link —
   * useful once the list is long enough that the active item has scrolled out.
   */
  const currentGroup = useMemo(() => {
    const match = modules.find((entry) => isModuleActive(entry, pathname));
    return match?.group ?? null;
  }, [modules, pathname]);

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
          "admin-sidebar fixed inset-y-0 left-0 z-50 flex flex-col",
          "transition-[width,transform] duration-300 ease-[var(--ease-admin)] lg:translate-x-0",
          collapsed ? "w-[var(--spacing-rail-tight)]" : "w-[var(--spacing-rail)]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "relative flex shrink-0 items-center border-b border-[var(--a-nav-line)]",
            collapsed
              ? "h-[var(--spacing-topbar)] justify-center px-2"
              : "h-[var(--spacing-rail-brand)] justify-center px-4",
          )}
        >
          <Link href="/admin" onClick={onCloseMobile} className="min-w-0">
            <SumagoWordmark compact={collapsed} tone="light" stacked={!collapsed} />
          </Link>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="absolute right-3 top-3 rounded-md p-1 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {/* Navigation */}
        <nav className="admin-scroll flex-1 overflow-y-auto px-2 py-3">
          {/* Jump-to. Thirty-odd modules is more than anyone scans reliably;
              typing three letters beats reading the list. Hidden on the icon
              rail, where there is nowhere to put it. */}
          {!collapsed ? (
            <div className="relative mb-3">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/45"
                aria-hidden
              />
              <input
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Jump to…"
                aria-label="Filter modules"
                className="w-full rounded-[var(--radius-pill)] border border-white/12 bg-white/8 py-2 pl-9 pr-3 text-[13px] text-white placeholder:text-white/45 focus:border-white/30 focus:bg-white/12 focus:outline-none"
              />
            </div>
          ) : null}

          <NavLink
            href="/admin"
            label="Dashboard"
            icon={<LayoutDashboard className="h-[18px] w-[18px] shrink-0" aria-hidden />}
            active={dashboardActive}
            collapsed={collapsed}
            onNavigate={onCloseMobile}
          />

          {noMatches ? (
            <p className="px-2.5 py-6 text-center text-[13px] text-white/50">
              No module matches “{filter.trim()}”.
            </p>
          ) : null}

          {grouped.map((entry) => (
            <div key={entry.group} className="mt-4">
              {collapsed ? (
                <div className="mx-2 mb-2 h-px bg-[var(--a-nav-line)]" aria-hidden />
              ) : (
                <p
                  className={cn(
                    "admin-nav-group mb-1.5 flex items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em]",
                    entry.group === currentGroup && "admin-nav-group-current",
                  )}
                >
                  {entry.group === currentGroup ? (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/90" aria-hidden />
                  ) : null}
                  {entry.label}
                </p>
              )}

              <ModuleList
                modules={entry.ungrouped}
                pathname={pathname}
                collapsed={collapsed}
                onNavigate={onCloseMobile}
              />

              {entry.sections.map(([heading, items]) => (
                <div key={heading} className="mt-2.5">
                  {!collapsed ? (
                    <p className="px-3 pb-1 text-[11px] font-medium text-white/40">{heading}</p>
                  ) : null}
                  <ModuleList
                    modules={items}
                    pathname={pathname}
                    collapsed={collapsed}
                    onNavigate={onCloseMobile}
                  />
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* Account */}
        <div className="shrink-0 border-t border-[var(--a-nav-line)] p-2">
          {user ? (
            <Link
              href="/admin/account"
              onClick={onCloseMobile}
              title={collapsed ? user.name : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-[var(--radius-field)] p-2 transition-colors hover:bg-[var(--a-nav-hover)]",
                collapsed && "justify-center",
              )}
            >
              <Avatar name={user.name} size={30} tone="light" />
              {!collapsed ? (
                <span className="min-w-0 leading-tight">
                  <span className="block truncate text-[13px] font-semibold text-white">
                    {user.name}
                  </span>
                  <span className="block truncate text-[11px] text-white/50">{user.roleName}</span>
                </span>
              ) : null}
            </Link>
          ) : null}

          <button
            type="button"
            onClick={() => void signOut()}
            title={collapsed ? "Sign out" : undefined}
            className={cn(
              "mt-0.5 flex w-full items-center gap-2.5 rounded-[var(--radius-field)] px-2 py-2 text-[13px] text-white/55 transition-colors hover:bg-[var(--a-nav-hover)] hover:text-[var(--a-nav-mark)]",
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

/** One run of module links — used for both the ungrouped and headed sections. */
function ModuleList({
  modules,
  pathname,
  collapsed,
  onNavigate,
}: {
  modules: ModuleSchema[];
  pathname: string;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  if (modules.length === 0) return null;

  return (
    <ul className="space-y-0.5">
      {modules.map((module) => {
        const href = moduleHref(module);
        const active = isModuleActive(module, pathname);
        return (
          <li key={module.key}>
            <NavLink
              href={href}
              label={module.label}
              icon={<ModuleIcon name={module.icon} className="h-[18px] w-[18px] shrink-0" />}
              active={active}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          </li>
        );
      })}
    </ul>
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
        "group relative flex items-center gap-3 overflow-hidden rounded-[var(--radius-field)] px-3 py-2.5 text-[13px] font-medium transition-colors",
        collapsed && "justify-center",
        active
          ? "bg-[var(--a-nav-active)] font-semibold text-white"
          : "text-white/72 hover:bg-[var(--a-nav-hover)] hover:text-white",
      )}
    >
      {/* Active marker — a short brand bar rather than a full-width fill. */}
      {active ? (
        <span
          className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-[var(--a-nav-mark)]"
          aria-hidden
        />
      ) : null}
      <span className={cn("shrink-0", active ? "text-[var(--a-nav-mark)]" : "text-white/55")}>
        {icon}
      </span>
      {!collapsed ? <span className="truncate">{label}</span> : null}
    </Link>
  );
}
