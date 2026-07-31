"use client";

/**
 * Topbar — breadcrumbs, theme toggle, a link back to the live site, and the
 * account menu. Sticky and translucent so long tables scroll underneath it
 * without the header disappearing.
 */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  ExternalLink,
  LogOut,
  Menu,
  PanelLeft,
  PanelLeftClose,
  User,
} from "lucide-react";
import { useApp } from "@/lib/admin/app-context";
import { Avatar, Dropdown, MenuDivider, MenuItem } from "@/components/admin/ui";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { moduleHref } from "@/components/admin/sidebar";

const SITE_ORIGIN = process.env["NEXT_PUBLIC_SITE_ORIGIN"] ?? "";

export function Topbar({
  collapsed,
  onToggleCollapse,
  onOpenMobile,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, modules, signOut } = useApp();

  const crumbs = useCrumbs(pathname, modules);

  return (
    <header className="sticky top-0 z-30 flex h-[var(--spacing-topbar)] items-center justify-between gap-4 border-b border-line-soft bg-[color-mix(in_srgb,var(--a-surface)_88%,transparent)] px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-field)] text-content-soft transition-colors hover:bg-surface-hover lg:hidden"
        >
          <Menu className="h-[18px] w-[18px]" aria-hidden />
        </button>

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden h-9 w-9 items-center justify-center rounded-[var(--radius-field)] text-content-soft transition-colors hover:bg-surface-hover lg:inline-flex"
        >
          {collapsed ? (
            <PanelLeft className="h-[18px] w-[18px]" aria-hidden />
          ) : (
            <PanelLeftClose className="h-[18px] w-[18px]" aria-hidden />
          )}
        </button>

        <nav aria-label="Breadcrumb" className="hidden min-w-0 sm:block">
          <ol className="flex min-w-0 items-center gap-1 text-[13px]">
            {crumbs.map((crumb, index) => {
              const last = index === crumbs.length - 1;
              return (
                <li key={crumb.href} className="flex min-w-0 items-center gap-1">
                  {index > 0 ? (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                  ) : null}
                  {last ? (
                    <span className="truncate font-medium text-content" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="truncate text-muted transition-colors hover:text-content">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <a
          href={SITE_ORIGIN || "/"}
          target="_blank"
          rel="noreferrer"
          title="Open the public website"
          className="hidden h-9 items-center gap-1.5 rounded-[var(--radius-field)] px-2.5 text-[13px] text-content-soft transition-colors hover:bg-surface-hover hover:text-content sm:inline-flex"
        >
          <ExternalLink className="h-[15px] w-[15px]" aria-hidden />
          View site
        </a>

        <ThemeToggle />

        {user ? (
          <Dropdown
            trigger={
              <span className="flex h-9 items-center gap-2 rounded-[var(--radius-field)] pl-1 pr-2 transition-colors hover:bg-surface-hover">
                <Avatar name={user.name} size={28} />
                <span className="hidden min-w-0 text-left leading-tight sm:block">
                  <span className="block max-w-32 truncate text-[13px] font-medium text-content">
                    {user.name}
                  </span>
                  <span className="block max-w-32 truncate text-[11px] text-muted">
                    {user.roleName}
                  </span>
                </span>
              </span>
            }
          >
            <div className="border-b border-line-soft px-3 py-2">
              <p className="truncate text-[13px] font-medium text-content">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
            <MenuItem
              icon={<User className="h-4 w-4" aria-hidden />}
              onClick={() => router.push("/admin/account")}
            >
              Your account
            </MenuItem>
            <MenuDivider />
            <MenuItem
              tone="danger"
              icon={<LogOut className="h-4 w-4" aria-hidden />}
              onClick={() => void signOut()}
            >
              Sign out
            </MenuItem>
          </Dropdown>
        ) : null}
      </div>
    </header>
  );
}

interface Crumb {
  label: string;
  href: string;
}

/**
 * Breadcrumbs derived from the URL, with module keys resolved to their proper
 * labels so `/admin/m/success-stories` reads "Success Stories", not a slug.
 */
function useCrumbs(pathname: string, modules: { key: string; label: string }[]): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Dashboard", href: "/admin" }];
  const segments = pathname.split("/").filter(Boolean).slice(1); // drop "admin"
  if (segments.length === 0) return crumbs;

  const labelFor = (key: string) => modules.find((module) => module.key === key)?.label;

  if (segments[0] === "m" && segments[1]) {
    const key = segments[1];
    crumbs.push({ label: labelFor(key) ?? humanise(key), href: `/admin/m/${key}` });
    if (segments[2]) {
      crumbs.push({
        label: segments[2] === "new" ? "New" : segments[2] === "edit" ? "Edit" : "Details",
        href: pathname,
      });
    }
    return crumbs;
  }

  const DEDICATED: Record<string, string> = {
    applications: "Applications",
    enquiries: "Contact Enquiries",
    media: "Media Library",
    users: "Users",
    roles: "Roles & Permissions",
    activity: "Activity Log",
    settings: "General Settings",
    account: "Your account",
  };

  const first = segments[0]!;
  crumbs.push({ label: DEDICATED[first] ?? humanise(first), href: `/admin/${first}` });
  if (segments[1]) {
    crumbs.push({ label: segments[1] === "new" ? "New" : "Details", href: pathname });
  }
  return crumbs;
}

function humanise(value: string): string {
  return value.replace(/[-_]/g, " ").replace(/^./, (character) => character.toUpperCase());
}

export { moduleHref };
