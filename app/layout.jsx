import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
export const metadata = {
  metadataBase: new URL("https://swiftinvoiceapp.com"),
  title: {
    default: "Swift Invoice - Free Online GST & International Invoice Generator",
    template: "%s | Swift Invoice",
  },
  description:
    "Create and download professional GST and tax invoices instantly for free. No login required, multi-currency support, and clean PDF export.",
  keywords: [
    "invoice generator",
    "free invoice maker",
    "GST invoice online",
    "instant invoice PDF",
  ],
  openGraph: {
    title: "Swift Invoice - Free Online GST & International Invoice Generator",
    description:
      "Generate clean, professional invoices in seconds with instant PDF download.",
    url: "https://swiftinvoiceapp.com",
    siteName: "Swift Invoice",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


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
