import type { Metadata, Viewport } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileContactBar } from "@/components/MobileContactBar";
import { Reveal } from "@/components/Reveal";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/lib/site";
import "./globals.css";

/* Self-hosted by next/font — no external requests, no layout-shifting FOUT. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "safety equipment Anjar",
    "PPE supplier Kachchh",
    "fire safety equipment Gujarat",
    "industrial safety helmets",
    "safety shoes supplier",
    "fall protection harness",
    "safety gloves supplier India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e141c",
};

/** LocalBusiness schema — helps the shop surface in local/map search. */
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.legalName,
  alternateName: site.name,
  description: site.description,
  url: site.url,
  email: site.email,
  telephone: site.phoneE164,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.postalCode,
    addressCountry: "IN",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:30",
    closes: "19:00",
  },
  areaServed: "IN",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${barlow.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

        <Header />

        {/* `footer-reveal-*`: the page slides up off a pinned footer at the
            end of a scroll. Both halves are inert below 760px of viewport
            height — see the note in globals.css. */}
        <main id="main" className="footer-reveal-main flex-1">
          {children}
        </main>

        {/* `mt-auto` moves to this wrapper — it is the flex child now. */}
        <div className="footer-reveal-footer mt-auto">
          <Footer />
        </div>

        {/* Fixed call / WhatsApp bar — mobile only. */}
        <MobileContactBar />

        <Reveal />
        <SmoothScroll />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  );
}
