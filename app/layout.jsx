
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://swiftinvoiceapp.com"),
  title: "Swift Invoice - Free Online GST & Tax Invoice Generator",
  description:
    "Generate and download clean, professional GST and business invoices instantly for free. No login required with fast PDF download.",
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
