export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "system-ui, sans-serif", color: "#1e293b", lineHeight: "1.7" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px", color: "#0f172a" }}>Privacy Policy</h1>
      <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>Last updated: September 2026</p>

      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginTop: "20px", marginBottom: "8px" }}>1. Zero-Knowledge Data Processing</h2>
      <p>SwiftInvoiceApp operates entirely client-side. We do not transmit, record, or store any invoice metadata, client names, bank details, or uploaded logos onto external web servers. All calculations and PDF exports compile locally in your browser memory.</p>

      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginTop: "20px", marginBottom: "8px" }}>2. Cookies and Analytics</h2>
      <p>We may use minimal anonymous telemetry and standard HTTP cookies to understand aggregated traffic patterns and maintain platform reliability.</p>

      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginTop: "20px", marginBottom: "8px" }}>3. Contact</h2>
      <p>For inquiries regarding this privacy statement, please contact us at support@swiftinvoiceapp.com.</p>
    </main>
  );
}
