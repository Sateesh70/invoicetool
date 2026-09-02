import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Online Invoice Generator",
  description: "Create and download clean PDF invoices online for free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 font-sans">
        {children}
      </body>
    </html>
  );
}