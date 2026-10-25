import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Special_Elite, Inter } from "next/font/google";
import "./globals.css";
import { site, plain } from "@/lib/content";
import { ORIGIN, robotsFor, IS_LIVE } from "@/lib/site";
import { businessSchema, personSchema, jsonLd } from "@/lib/schema";
import { cleanGaId } from "@/lib/track";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Motion from "@/components/Motion";
import Analytics from "@/components/Analytics";
import { JsonLd } from "@/components/Ui";

// The concept's three typefaces, self-hosted by Next (no request to Google at runtime).
const serif = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-bodoni", display: "swap" });
const type = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-elite", display: "swap", preload: false });
const ui = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const brand = plain(site.brandName);

export const metadata: Metadata = {
  metadataBase: new URL(ORIGIN),
  title: { default: brand, template: `%s | ${brand}` },
  description: plain(site.tagline),
  robots: robotsFor(true),
  applicationName: brand,
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#1c2438",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Before first paint: mark that JavaScript runs (so reveal animations may hide things until they
// scroll in) and honour reduced motion. If the page script never starts, the safety timer turns
// the animations off so nothing stays hidden. A link to a section (/#how) gets "jump": the browser
// lands on it at once instead of smooth-scrolling down the whole page, and that section shows
// without the fade.
const HEAD = `(function(){var r=document.documentElement;r.classList.add("js");if(location.hash)r.classList.add("jump");if(matchMedia("(prefers-reduced-motion: reduce)").matches)r.classList.add("rm");setTimeout(function(){if(!r.classList.contains("motion-ready"))r.classList.add("rm")},4000)})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaId = IS_LIVE ? cleanGaId(site.gaId) : "";
  return (
    <html lang="en" className={`${serif.variable} ${type.variable} ${ui.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <div className="grain" aria-hidden="true" />
        {!IS_LIVE && (
          <div className="preview-strip">
            Preview, not the live site<span className="more-info"> · placeholder photos · “example” = we wrote it, to be replaced · “to confirm” = your detail, waiting for your OK · not indexed by Google</span>
          </div>
        )}
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <div className="toast" role="status" aria-live="polite" />
        <JsonLd data={jsonLd(businessSchema(), personSchema())} />
        <Motion />
        <Analytics id={gaId} />
      </body>
    </html>
  );
}
