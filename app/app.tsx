import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://swiftinvoiceapp.com"),
  title: {
    default: "SwiftInvoice Studio – Free Private Client-Side Invoice Maker",
    template: "%s | SwiftInvoice Studio",
  },
  description:
    "Generate professional vector PDF invoices instantly. 100% private, zero-knowledge, and client-side with no sign-up or server tracking.",
  keywords: [
    "invoice generator",
    "free invoice maker",
    "freelance invoice template",
    "client-side invoice",
    "private pdf invoice",
    "zero knowledge billing",
  ],
  authors: [{ name: "SwiftInvoice Studio" }],
  creator: "SwiftInvoice Studio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://swiftinvoiceapp.com",
    siteName: "SwiftInvoice Studio",
    title: "SwiftInvoice Studio – Free Private Invoice Generator",
    description:
      "Generate clean vector PDF invoices straight from your browser. 100% private, zero database storage, instant export.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwiftInvoice Studio – Private Client-Side Invoice Generator",
    description:
      "Free, clean, vector PDF invoices generated directly in your browser with zero data tracking.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};