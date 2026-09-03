import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swift Invoice | Free Online Invoice Generator",
  description:
    "Create and download professional invoices, estimates, and receipts in seconds. Simple, fast, and completely free online invoicing tool.",
  keywords: [
    "invoice generator",
    "free invoice maker",
    "create invoice online",
    "swift invoice",
    "receipt maker",
  ],
  openGraph: {
    title: "Swift Invoice | Free Online Invoice Generator",
    description:
      "Create and download professional invoices in seconds with Swift Invoice.",
    url: "https://swiftinvoiceapp.com",
    siteName: "Swift Invoice",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CSS CDN script */}
        <script src="https://cdn.tailwindcss.com"></script>

        {/* Google AdSense script */}
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
