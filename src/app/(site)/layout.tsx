/**
 * Public website layout — the header, footer and scroll-animation provider.
 *
 * `(site)` is a route group: it groups every public page so they can share this
 * chrome without appearing in any URL. /about is still /about.
 *
 * The admin panel sits outside this group (see `src/app/admin/`) precisely so it
 * never renders the site header or footer.
 */
import { SiteHeader } from "@/components/organisms/site-header";
import { SiteFooter } from "@/components/organisms/site-footer";
import { AosInit } from "@/components/providers/aos-init";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AosInit />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
