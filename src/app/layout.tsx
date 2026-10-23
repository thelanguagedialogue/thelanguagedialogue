import type { Metadata } from "next";
import { Special_Elite, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { site, plain } from "@/lib/content";
import { ORIGIN, robotsFor, IS_LIVE } from "@/lib/site";
import { businessSchema, jsonLd } from "@/lib/schema";
import { cleanGaId } from "@/lib/track";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";

const display = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = IBM_Plex_Sans({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-body", display: "swap" });

const brand = plain(site.brandName);

export const metadata: Metadata = {
  metadataBase: new URL(ORIGIN),
  title: { default: `${brand} | ${plain(site.tagline)}`, template: `%s | ${brand}` },
  description: plain(site.tagline),
  robots: robotsFor(true),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaId = IS_LIVE ? cleanGaId(site.gaId) : "";
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:text-paper focus:px-4 focus:py-2">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(businessSchema()) }} />
        {!IS_LIVE && (
          <div className="bg-navy text-paper text-center text-xs py-1.5 px-3">
            Preview. Text, photos and prices with a yellow EXAMPLE tag are placeholders for you to replace.
          </div>
        )}
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Analytics id={gaId} />
      </body>
    </html>
  );
}
