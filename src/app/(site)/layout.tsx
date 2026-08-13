/**
 * Public website layout — the header, footer and scroll-animation provider.
 *
 * `(site)` is a route group: it groups every public page so they can share this
 * chrome without appearing in any URL. /about is still /about.
 *
 * The admin panel sits outside this group (see `src/app/admin/`) precisely so it
 * never renders the site header or footer.
 */
import { SiteHeader, type PaneEntry } from "@/components/organisms/site-header";
import { SiteFooter } from "@/components/organisms/site-footer";
import { AosInit } from "@/components/providers/aos-init";
import { VisitBeacon } from "@/components/providers/visit-beacon";
import { getIndustries, getServicesByPhase, getSite, type NavGroup } from "@/lib/cms";
import { nav as committedNav, navCta } from "@/lib/site";

/**
 * The header menu, from the Navigation module.
 *
 * The committed structure is the fallback, for the same reason every other
 * accessor has one: the header renders on every page, and a header that
 * collapses to nothing because the API blinked is worse than a header showing
 * last-known-good routes. A published record with no groups in it is treated as
 * no answer rather than as an instruction to empty the menu — an editor who
 * clears the field should not be able to delete the site's navigation.
 */
/**
 * Menu entries hidden in code, keyed by group label → item hrefs.
 *
 * The live menu is the Navigation record in the admin panel, so deleting an
 * entry there is the real fix; this exists to hide one without waiting on that,
 * and applies to the committed fallback too so the item cannot reappear when
 * the API is unreachable. Scoped by group on purpose: /innovation is also
 * listed under Our Services as "AI & Automation", and that link stays.
 *
 * Delete the "Our Work" line to restore Innovations to the menu.
 */
const HIDDEN_NAV_ITEMS: Record<string, readonly string[]> = {
  "Our Work": ["/innovation"],
};

function withoutHiddenItems(groups: NavGroup[]): NavGroup[] {
  return groups
    .map((group) => {
      const hidden = HIDDEN_NAV_ITEMS[group.label];
      if (!hidden) return group;
      return { ...group, items: group.items.filter((item) => !hidden.includes(item.href)) };
    })
    .filter((group) => group.items.length > 0);
}

async function getNavigation(): Promise<{
  groups: NavGroup[];
  ctaLabel: string;
  ctaHref: string;
}> {
  const { navigation } = await getSite();

  const groups = navigation?.groups.filter((group) => group.items.length > 0) ?? [];
  if (groups.length === 0) {
    return {
      groups: withoutHiddenItems(
        committedNav.map((group) => ({
          label: group.label,
          items: group.items.map((item) => ({ ...item })),
        })),
      ),
      ctaLabel: navCta.label,
      ctaHref: navCta.href,
    };
  }

  return {
    groups: withoutHiddenItems(groups),
    ctaLabel: navigation?.ctaLabel || navCta.label,
    ctaHref: navigation?.ctaHref || navCta.href,
  };
}

/**
 * The header is a Client Component — it owns the dropdown state, the scroll
 * listener and the mobile accordion — so it cannot read the CMS itself. Its two
 * catalogue menus are built here instead and handed down as data.
 *
 * That keeps the API read on the server where `ADMIN_API_ORIGIN` exists, and it
 * means publishing a service or an industry changes the navigation on every
 * page. Both reads are `cache()`d and shared with the footer's own columns, so
 * the whole layout costs one request each rather than four.
 */
async function buildServicePanes(): Promise<PaneEntry[]> {
  const [phases, industries] = await Promise.all([getServicesByPhase(), getIndustries()]);

  return [
    {
      key: "services",
      label: "Services",
      title: "All Services",
      description: "The full suite of capabilities, end to end.",
      href: "/solutions",
      // Grouped by lifecycle stage (Consulting → Support). `getServicesByPhase`
      // has already dropped any stage with nothing published in it.
      groups: phases.map((phase) => ({
        label: phase.label,
        links: phase.services.map((service) => ({
          label: service.name,
          href: `/solutions/${service.slug}`,
        })),
      })),
    },
    {
      key: "industries",
      label: "Industries",
      title: "Industries",
      description: "Deep domain expertise across every sector we build for.",
      href: "/industries",
      groups: [
        {
          links: industries.map((industry) => ({
            label: industry.name,
            href: `/industries/${industry.slug}`,
          })),
        },
      ],
    },
  ];
}

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [servicePanes, navigation] = await Promise.all([
    buildServicePanes(),
    getNavigation(),
  ]);

  return (
    <>
      <AosInit />
      <VisitBeacon />
      <SiteHeader navigation={navigation} servicePanes={servicePanes} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
