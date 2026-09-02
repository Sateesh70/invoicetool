import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://swiftinvoiceapp.com"),
  title: "SwiftInvoice Studio – Free Private Invoice Maker",
  description: "Generate professional vector PDF invoices instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6682141621893299"
     crossorigin="anonymous"></script>      </head>
      <body>{children}</body>
    </html>
  );
}
