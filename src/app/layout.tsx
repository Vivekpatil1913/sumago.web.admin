/**
 * Root layout — deliberately minimal.
 *
 * It owns only <html>/<body>, the fonts and the stylesheet, because two very
 * different surfaces sit underneath it:
 *
 *   (site)/  — the public website, with its header and footer
 *   admin/   — the admin panel, which must not render site chrome
 *
 * Site chrome therefore lives in `(site)/layout.tsx`, not here. `(site)` is a
 * route group, so it changes nothing about the public URLs.
 */
import type { Metadata } from "next";
import { Lexend_Deca, Caveat } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/cms";

const lexend = Lexend_Deca({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

/* Handwriting accent — used only for annotation labels (see the leadership
   spotlights on /team). Never for body copy or headings. */
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/**
 * Title, description, favicon and the social-share default all come from
 * General Settings, so renaming the company or swapping the share image is an
 * edit in the admin panel rather than a deploy.
 *
 * `generateMetadata` rather than a static export because it has to await the
 * settings read. It still resolves once per revalidation window, not per
 * request — `getSettings` shares the cached `/settings` bundle the footer uses.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const description =
    `${settings.positioning} ${settings.certifications.join(" & ")}${
      settings.certifications.length > 0 ? " certified." : ""
    }`.trim();

  return {
    metadataBase: new URL("https://www.sumagoinfotech.com"),
    title: {
      default: `${settings.name} — ${settings.tagline}`,
      template: `%s — ${settings.shortName}`,
    },
    description,
    openGraph: {
      siteName: settings.name,
      title: settings.name,
      description: settings.positioning,
      type: "website",
      // Per-page metadata overrides this; it is the fallback for pages that
      // set no share image of their own.
      ...(settings.defaultOgImage ? { images: [{ url: settings.defaultOgImage }] } : {}),
    },
    /* The icon set ships as static files in /public (generated as a package, so
       the .ico/.svg/.png variants stay in sync). A favicon set in General
       Settings takes precedence for the browser tab; the rest of the set —
       SVG, .ico fallback, apple-touch — always applies. */
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        ...(settings.favicon ? [{ url: settings.favicon }] : []),
        { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
