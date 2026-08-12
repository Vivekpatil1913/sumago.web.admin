"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Building2,
  Users,
  Sparkles,
  Briefcase,
  LayoutGrid,
  Factory,
  Award,
  Lightbulb,
  Newspaper,
  Network,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/atoms/logo";
import { Button } from "@/components/atoms/button";
import type { NavGroup } from "@/lib/cms";
import { cn } from "@/lib/utils";


/** Icon per destination — keyed by href so nav data stays presentation-free. */
const ITEM_ICONS: Record<string, LucideIcon> = {
  "/about": Building2,
  "/how-we-deliver": Network,
  "/team": Users,
  "/life-at-sumago": Sparkles,
  "/careers": Briefcase,
  "/solutions": LayoutGrid,
  "/industries": Factory,
  "/impact": Award,
  "/innovation": Lightbulb,
  "/blog": Newspaper,
};

/** A block inside a pane. A `label` turns it into a titled group that stays in
 *  one column; without one, the links flow freely across the columns. */
export type PaneGroup = {
  label?: string;
  links: { label: string; href: string }[];
};

export type PaneEntry = {
  key: string;
  label: string;
  title: string;
  description: string;
  /** Destination for the pane's "Know more" link (also picks its icon). */
  href: string;
  groups: PaneGroup[];
};

/**
 * Two-pane "Our Services" mega-menu: Services / Industries on the left rail,
 * and hovering (or focusing) either reveals the whole list on the right — so the
 * full catalogue is one click away without dumping 25 links on screen at once.
 * Only this group uses the two-pane layout; the rest keep the icon-card grid.
 */
function ServicesMegaPanel({
  panes,
  pathname,
  onNavigate,
}: {
  panes: PaneEntry[];
  pathname: string;
  onNavigate: () => void;
}) {
  const [activeKey, setActiveKey] = useState(panes[0]?.key ?? "");
  const current = panes.find((p) => p.key === activeKey) ?? panes[0];
  if (!current) return null;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="grid overflow-hidden rounded-3xl border border-line bg-paper shadow-2xl shadow-ink/10 lg:grid-cols-[300px_1fr]">
      {/* Rail — icon + title + description cards; hover/focus swaps the pane */}
      <ul className="flex flex-col gap-2 bg-mist p-3">
        {panes.map((p) => {
          const RailIcon = ITEM_ICONS[p.href] ?? LayoutGrid;
          const on = p.key === current.key;
          return (
            <li key={p.key}>
              <button
                type="button"
                onMouseEnter={() => setActiveKey(p.key)}
                onFocus={() => setActiveKey(p.key)}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "w-full rounded-xl p-4 text-left transition-colors",
                  on ? "bg-paper shadow-sm" : "hover:bg-paper/60",
                )}
              >
                <RailIcon
                  size={24}
                  strokeWidth={1.75}
                  aria-hidden
                  className={cn("transition-colors", on ? "text-brand-ink" : "text-ink")}
                />
                <span
                  className={cn(
                    "mt-3 block text-sm font-bold transition-colors",
                    on ? "text-brand-ink" : "text-ink",
                  )}
                >
                  {p.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-ink/65">
                  {p.description}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Detail pane — the full list for the active rail entry. Balanced CSS
          columns keep it the same height as an ungrouped list. */}
      <div className="p-8 md:p-10">
        <div className="gap-x-8 sm:columns-2 lg:columns-3">
          {current.groups.map((g, gi) => (
            <div
              key={g.label ?? gi}
              className={cn("mb-4", g.label && "break-inside-avoid")}
            >
              {g.label ? (
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-ink">
                  {g.label}
                </p>
              ) : null}
              <ul className="space-y-1">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <NavLink
                      href={l.href}
                      onClick={onNavigate}
                      className={cn(
                        "block text-sm leading-snug text-ink/70 transition-colors hover:text-brand-ink",
                        isActive(l.href) && "font-semibold text-brand-ink",
                      )}
                    >
                      {l.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Link
          href={current.href}
          onClick={onNavigate}
          className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink underline decoration-brand-ink/40 underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
        >
          Know more
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

/** Is the current path one of the group's items (or a child route of one)? */
function useGroupActive() {
  const pathname = usePathname();
  return (group: NavGroup) =>
    group.items.some(
      (it) => pathname === it.href || pathname.startsWith(`${it.href}/`),
    );
}

/**
 * An internal route renders as a `Link` and an external URL as a plain anchor
 * that opens away from the site. The panel accepts either, and handing an
 * absolute URL to `Link` would try to route to it inside the app.
 */
function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/**
 * A navigation destination, routed correctly for what it is.
 *
 * Menu items come from the admin panel, where an editor may enter either an
 * internal route or a full URL. `Link` prefetches and routes client-side, which
 * is right for the former and wrong for the latter, so an absolute URL renders
 * as a plain anchor that opens in a new tab with `noopener`.
 */
function NavLink({
  href,
  children,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

export function SiteHeader({
  navigation,
  servicePanes,
}: {
  /** The published mega-menu: groups, their items, and the header CTA. */
  navigation: { groups: NavGroup[]; ctaLabel: string; ctaHref: string };
  servicePanes: PaneEntry[];
}) {
  const { groups: nav, ctaLabel, ctaHref } = navigation;
  const [open, setOpen] = useState(false); // mobile menu
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // desktop
  const [openGroup, setOpenGroup] = useState<string | null>(null); // mobile accordion
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const groupActive = useGroupActive();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close desktop dropdowns on outside click and on Escape.
  useEffect(() => {
    if (!openDropdown) return;
    const onClick = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpenDropdown(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openDropdown]);

  // Every page opens with a dark, full-bleed hero. The bar floats transparently
  // over it and turns solid once the user scrolls or opens a menu.
  const overHero = !scrolled && !open && !openDropdown;

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        overHero
          ? "border-b-0 bg-transparent"
          : "border-b border-line bg-paper/85 backdrop-blur",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Logo height={34} priority />

        {/* Desktop nav — triggers + one shared full-width mega-menu.
            The wrapper spans the full bar height so the pointer can travel from
            a trigger down into the panel without the hover closing. */}
        <div
          className="hidden h-16 items-center gap-1 lg:flex"
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <nav className="flex items-center gap-1" aria-label="Primary">
            {nav.map((group) => {
              const isOpen = openDropdown === group.label;
              const active = groupActive(group);
              return (
                <button
                  key={group.label}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  aria-controls="mega-panel"
                  onMouseEnter={() => setOpenDropdown(group.label)}
                  onClick={() =>
                    setOpenDropdown((cur) => (cur === group.label ? null : group.label))
                  }
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    overHero
                      ? "text-white/80 hover:text-white"
                      : "text-ink/75 hover:text-brand-ink",
                    (isOpen || active) && (overHero ? "text-white" : "text-brand-ink"),
                  )}
                >
                  {group.label}
                  <ChevronDown
                    size={15}
                    aria-hidden
                    className={cn(
                      "transition-transform duration-200 motion-reduce:transition-none",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
              );
            })}
          </nav>

          {/* Full-width mega-menu panel — spans the page like the reference.
              Kept mounted; `invisible` drops it from the tab order + a11y tree. */}
          <div
            id="mega-panel"
            className={cn(
              "absolute left-0 right-0 top-full transition-all duration-200 motion-reduce:transition-none",
              openDropdown
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-1 opacity-0",
            )}
          >
            <div className="container-page pt-3">
              {nav
                .filter((group) => group.label === openDropdown)
                .map((group) =>
                  /* Only Services uses the two-pane catalogue panel; every other
                     group keeps the original icon-card grid. */
                  group.label === "Our Services" ? (
                    <ServicesMegaPanel
                      key={group.label}
                      panes={servicePanes}
                      pathname={pathname}
                      onNavigate={() => setOpenDropdown(null)}
                    />
                  ) : (
                    <ul
                      key={group.label}
                      className="grid grid-cols-4 gap-x-8 gap-y-10 rounded-3xl border border-line bg-paper p-8 shadow-2xl shadow-ink/10 md:p-10"
                    >
                      {group.items.map((item) => {
                        const Icon = ITEM_ICONS[item.href] ?? LayoutGrid;
                        const itemActive =
                          pathname === item.href ||
                          pathname.startsWith(`${item.href}/`);
                        return (
                          <li key={item.href}>
                            <NavLink
                              href={item.href}
                              onClick={() => setOpenDropdown(null)}
                              className="group/mi block"
                            >
                              <Icon
                                size={26}
                                strokeWidth={1.75}
                                aria-hidden
                                className={cn(
                                  "text-ink transition-colors group-hover/mi:text-brand-ink",
                                  itemActive && "text-brand-ink",
                                )}
                              />
                              <div
                                className={cn(
                                  "mt-4 text-lg font-semibold text-ink transition-colors group-hover/mi:text-brand-ink",
                                  itemActive && "text-brand-ink",
                                )}
                              >
                                {item.label}
                              </div>
                              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                                {item.description}
                              </p>
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  ),
                )}
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <Button href={ctaHref} size="sm">
            {ctaLabel}
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className={cn(
            "rounded-md p-2 transition-colors lg:hidden",
            overHero ? "text-white" : "text-ink",
          )}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/*
        Mobile menu — accordion groups.

        `inert` while closed, and that is not decoration. The panel collapses
        with `max-h-0` + `overflow-hidden`, which hides it from sight but leaves
        every link inside it at full size in the accessibility tree — twelve
        destinations a keyboard user tabbed into one by one, invisibly, before
        reaching the page. `inert` takes the whole subtree out of the tab order
        and out of the a11y tree while it is shut, which `max-h-0` alone cannot
        do.
      */}
      <div
        inert={!open}
        className={cn(
          "overflow-hidden border-t border-line bg-paper lg:hidden",
          open ? "max-h-[85vh] overflow-y-auto" : "max-h-0 border-t-0",
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
          {nav.map((group) => {
            const groupOpen = openGroup === group.label;
            const sublistId = `m-nav-${group.label.replace(/\s+/g, "-").toLowerCase()}`;
            return (
              <div key={group.label} className="border-b border-line/60 last:border-b-0">
                <button
                  type="button"
                  aria-expanded={groupOpen}
                  aria-controls={sublistId}
                  onClick={() =>
                    setOpenGroup((cur) => (cur === group.label ? null : group.label))
                  }
                  className="flex w-full items-center justify-between rounded-md px-2 py-3 text-sm font-semibold text-ink"
                >
                  {group.label}
                  <ChevronDown
                    size={16}
                    aria-hidden
                    className={cn(
                      "text-ink/65 transition-transform duration-200 motion-reduce:transition-none",
                      groupOpen && "rotate-180",
                    )}
                  />
                </button>
                <ul
                  id={sublistId}
                  className={cn(
                    "overflow-hidden transition-all duration-200 motion-reduce:transition-none",
                    groupOpen ? "max-h-96 pb-2" : "max-h-0",
                  )}
                >
                  {group.items.map((item) => {
                    const Icon = ITEM_ICONS[item.href] ?? LayoutGrid;
                    const itemActive =
                      pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <li key={item.href}>
                        <NavLink
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="flex items-start gap-3 rounded-md px-3 py-2.5 hover:bg-mist"
                        >
                          <Icon
                            size={20}
                            strokeWidth={1.75}
                            aria-hidden
                            className={cn(
                              "mt-0.5 shrink-0",
                              itemActive ? "text-brand-ink" : "text-ink/60",
                            )}
                          />
                          <span className="min-w-0">
                            <span
                              className={cn(
                                "block text-sm font-semibold",
                                itemActive ? "text-brand-ink" : "text-ink",
                              )}
                            >
                              {item.label}
                            </span>
                            <span className="block text-xs leading-relaxed text-ink/65">
                              {item.description}
                            </span>
                          </span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          <Button
            href={ctaHref}
            className="mt-3 w-full"
            onClick={() => setOpen(false)}
          >
            {ctaLabel}
          </Button>
        </nav>
      </div>
    </header>
  );
}
