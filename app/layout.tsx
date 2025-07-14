import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import localFont from "next/font/local"
import HotjarScript from "./components/hotjar-script"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"

// Remove Google Fonts imports that are causing timeouts
// and replace with system fonts fallbacks
const systemSerif = localFont({
  src: "./fonts/Balboa-Bold.ttf", // We'll keep using the local font
  display: "swap",
  variable: "--font-playfair",
  weight: "700",
  fallback: ["Georgia", "Times New Roman", "serif"],
})

const systemSans = localFont({
  src: "./fonts/Balboa-Bold.ttf", // Using the same file but with sans-serif fallbacks
  display: "swap",
  variable: "--font-inter",
  weight: "700",
  fallback: ["Arial", "Helvetica", "sans-serif"],
})

const balboa = localFont({
  src: "./fonts/Balboa-Bold.ttf",
  display: "swap",
  variable: "--font-balboa",
  weight: "700",
  fallback: ["serif"],
})

export const metadata: Metadata = {
  title: {
    default: "Solar Boss Automations - Launch Your Remote Solar Business",
    template: "%s | Solar Boss Automations",
  },
  description:
    "Launch your remote solar business with Solar Boss Automations. We build everything for you - from lead generation to sales automation. Start earning 6-7 figures while working 2-3 hours per week.",
  keywords: [
    "solar business",
    "remote solar sales",
    "solar automation",
    "solar lead generation",
    "renewable energy business",
    "solar sales training",
    "done-for-you solar business",
    "solar entrepreneur",
    "passive income solar",
    "solar business opportunity",
  ],
  authors: [{ name: "Solar Boss Automations" }],
  creator: "Solar Boss Automations",
  publisher: "Solar Boss Automations",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://solarbossautomations.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://solarbossautomations.com",
    siteName: "Solar Boss Automations",
    title: "Solar Boss Automations - Launch Your Remote Solar Business",
    description:
      "Launch your remote solar business with Solar Boss Automations. We build everything for you - from lead generation to sales automation. Start earning 6-7 figures while working 2-3 hours per week.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Solar Boss Automations - Remote Solar Business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Boss Automations - Launch Your Remote Solar Business",
    description:
      "Launch your remote solar business with Solar Boss Automations. We build everything for you - from lead generation to sales automation.",
    images: ["/og-image.jpg"],
    creator: "@solarbossauto",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${systemSerif.variable} ${systemSans.variable} ${balboa.variable}`}>
      <head>
        {/* Preload critical fonts to prevent FOUT */}
        <link rel="preload" href="/fonts/Balboa-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fast.wistia.net" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//n8n.automatedsolarbiz.com" />

        <link rel="canonical" href="https://solarbossautomations.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#C7A052" />
        <meta name="msapplication-TileColor" content="#C7A052" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Solar Boss Automations",
              url: "https://solarbossautomations.com",
              logo: "https://solarbossautomations.com/logo.png",
              description:
                "Launch your remote solar business with Solar Boss Automations. We build everything for you - from lead generation to sales automation.",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-SOLAR-BOSS",
                contactType: "customer service",
                availableLanguage: "English",
              },
              sameAs: [
                "https://www.youtube.com/@TheSolarBoss",
                "https://www.facebook.com/solarbossautomations",
                "https://www.linkedin.com/company/solar-boss-automations",
              ],
              address: {
                "@type": "PostalAddress",
                addressCountry: "US",
              },
            }),
          }}
        />

        <HotjarScript />
      </head>
      <body
        className={`min-w-[320px] w-full overflow-x-hidden bg-[#0a0a0a] ${systemSans.variable} ${systemSerif.variable} ${balboa.variable}`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
