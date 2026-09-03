import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://swiftinvoiceapp.com"),
  title: {
    default: "Swift Invoice | Free Online Invoice Generator",
    template: "%s | Swift Invoice",
  },
  description:
    "Create and download professional invoices, estimates, and receipts in seconds. Simple, fast, and completely free online invoicing tool.",
  keywords: [
    "invoice generator",
    "free invoice maker",
    "create invoice online",
    "swift invoice",
    "receipt maker",
    "download invoice pdf",
  ],
  alternates: {
    canonical: "https://swiftinvoiceapp.com",
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
  openGraph: {
    title: "Swift Invoice | Free Online Invoice Generator",
    description:
      "Create and download professional invoices in seconds with Swift Invoice.",
    url: "https://swiftinvoiceapp.com",
    siteName: "Swift Invoice",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swift Invoice | Free Online Invoice Generator",
    description:
      "Create and download professional invoices in seconds with Swift Invoice.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Swift Invoice",
    url: "https://swiftinvoiceapp.com",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free online invoice generator to create, preview, and download professional PDF invoices instantly.",
  };

  return (
    <html lang="en">
      <head>
        {/* Tailwind CSS CDN */}
        <script src="https://cdn.tailwindcss.com"></script>

        {/* Structured Data (JSON-LD) for Google Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6682141621893299"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
