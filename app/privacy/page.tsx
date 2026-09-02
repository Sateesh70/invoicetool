export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: "800px", margin: "40px auto", padding: "24px", fontFamily: "system-ui, -apple-system, sans-serif", color: "#1e293b", lineHeight: "1.7" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "12px", color: "#0f172a" }}>Privacy Policy</h1>
      <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>Last updated: 2026</p>

      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginTop: "20px", marginBottom: "8px" }}>1. Zero-Knowledge Processing</h2>
      <p>SwiftInvoiceApp operates client-side in your browser. We do not transmit, record, or store any of your invoice metadata, customer records, banking details, or logos onto remote servers. All calculations and PDF generation compile locally inside your browser memory.</p>

      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginTop: "20px", marginBottom: "8px" }}>2. Analytics & Cookies</h2>
      <p>We may use anonymous aggregated analytics to understand website reliability, page load performance, and platform usage without identifying individual users.</p>

      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginTop: "20px", marginBottom: "8px" }}>3. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, you may contact us at support@swiftinvoiceapp.com.</p>
    </main>
  );
}
