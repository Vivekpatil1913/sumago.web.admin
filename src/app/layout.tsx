import type { Metadata } from "next";
import { Lexend_Deca, Caveat } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/organisms/site-header";
import { SiteFooter } from "@/components/organisms/site-footer";
import { AosInit } from "@/components/providers/aos-init";
import { company } from "@/lib/site";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sumagoinfotech.com"),
  title: {
    default: `${company.name} — ${company.tagline}`,
    template: `%s — ${company.shortName}`,
  },
  description:
    "Sumago Infotech helps businesses solve complex problems through technology — digital transformation, product engineering, and AI. ISO 9001:2015 & CMMI Level 5 certified.",
  openGraph: {
    title: company.name,
    description: "Helping businesses solve complex problems through technology.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AosInit />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
