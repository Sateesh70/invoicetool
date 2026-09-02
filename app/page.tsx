"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, Trash2, Download, Palette, Check, Upload, 
  Sparkles, ShieldCheck, FileText, CheckCircle2, 
  LayoutTemplate, X, PenTool, ArrowRight
} from "lucide-react";
import { Document, Page, Text, View, StyleSheet, Image as PDFImage, pdf } from "@react-pdf/renderer";

// 6 Canva-Grade Distinct Design Engines
const TEMPLATES = {
  tokyo: {
    id: "tokyo",
    name: "Tokyo Minimalist",
    category: "Agency / Design",
    primary: "#18181b",
    accent: "#71717a",
    background: "#fafafa",
    tableBg: "#f4f4f5",
    textColor: "#09090b",
    badgeBg: "#f4f4f5",
    badgeColor: "#18181b",
    fontFamily: "Helvetica",
    desc: "Asymmetrical, spacious editorial look with delicate lines.",
  },
  executive: {
    id: "executive",
    name: "Wall Street Executive",
    category: "Corporate / Legal",
    primary: "#0f172a",
    accent: "#1d4ed8",
    background: "#f8fafc",
    tableBg: "#0f172a",
    textColor: "#0f172a",
    badgeBg: "#dbeafe",
    badgeColor: "#1e40af",
    fontFamily: "Helvetica-Bold",
    desc: "Authoritative, heavy corporate dual-tone styling.",
  },
  nordic: {
    id: "nordic",
    name: "Nordic Emerald",
    category: "Tech / Modern",
    primary: "#064e3b",
    accent: "#059669",
    background: "#f0fdf4",
    tableBg: "#064e3b",
    textColor: "#022c22",
    badgeBg: "#d1fae5",
    badgeColor: "#065f46",
    fontFamily: "Helvetica",
    desc: "Clean Scandinavian aesthetic with calming green tones.",
  },
  luxury: {
    id: "luxury",
    name: "Bespoke Amber",
    category: "Luxury / Architecture",
    primary: "#451a03",
    accent: "#b45309",
    background: "#fffbeb",
    tableBg: "#78350f",
    textColor: "#291e0a",
    badgeBg: "#fef3c7",
    badgeColor: "#92400e",
    fontFamily: "Times-Roman",
    desc: "Sophisticated boutique consulting with warm earth tones.",
  },
  brutalist: {
    id: "brutalist",
    name: "Neo-Brutalist",
    category: "Startup / Web3",
    primary: "#000000",
    accent: "#4f46e5",
    background: "#ffffff",
    tableBg: "#000000",
    textColor: "#000000",
    badgeBg: "#000000",
    badgeColor: "#ffffff",
    fontFamily: "Courier",
    desc: "High-contrast, bold lines, monospaced tech vibe.",
  },
  swiss: {
    id: "swiss",
    name: "Swiss Editorial",
    category: "Creative / Studio",
    primary: "#dc2626",
    accent: "#991b1b",
    background: "#fef2f2",
    tableBg: "#dc2626",
    textColor: "#1c1917",
    badgeBg: "#fee2e2",
    badgeColor: "#991b1b",
    fontFamily: "Helvetica",
    desc: "Iconic Swiss grid style featuring high-energy vermilion.",
  },
};

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function StudioInvoiceApp() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof TEMPLATES>("tokyo");
  const [showGallery, setShowGallery] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [signatureText, setSignatureText] = useState("Authorized Signatory");
  
  // Header Meta
  const [senderName, setSenderName] = useState("Vanguard Studio Labs LLC");
  const [senderDetails, setSenderDetails] = useState("450 Lexington Ave, New York, NY 10017\ntax-id: US-9940210\nbilling@vanguardstudio.com");
  const [clientName, setClientName] = useState("Apex Global Technologies Inc.");
  const [clientDetails, setClientDetails] = useState("100 Montgomery St, Suite 2100\nSan Francisco, CA 94104\nAttn: Accounts Payable");
  
  // Document Controls
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-8801");
  const [status, setStatus] = useState<"PENDING" | "PAID" | "OVERDUE" | "DRAFT">("PENDING");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]);
  const [currency, setCurrency] = useState("$");
  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  
  // Terms
  const [paymentTerms, setPaymentTerms] = useState("Payment due within 14 days of issue via international wire transfer.\nBeneficiary: Vanguard Studio Labs LLC / Bank: JP Morgan Chase NYC");
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "Design System Architecture & Comprehensive Component Library", quantity: 1, rate: 4500 },
    { id: "2", description: "Production Next.js / TypeScript Web Application Implementation", quantity: 32, rate: 150 },
  ]);

  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const activeTheme = TEMPLATES[selectedTemplate];

  // Calculations
  const subtotal = items.reduce((acc, curr) => acc + (curr.quantity * curr.rate), 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * taxRate) / 100;
  const grandTotal = taxableAmount + taxAmount;

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, val: any) => {
    setItems(items.map((it) => it.id === id ? { ...it, [field]: val } : it));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // High-Resolution PDF Definition matching selected Canva Theme
  const PDFDocument = () => {
    const isBrutalist = selectedTemplate === "brutalist";
    const isTokyo = selectedTemplate === "tokyo";

    const pdfStyles = StyleSheet.create({
      page: { padding: 40, fontSize: 9, color: "#334155", fontFamily: "Helvetica" },
      accentStrip: { height: 6, backgroundColor: activeTheme.primary, marginBottom: 20 },
      topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
      logoBox: { width: 100, height: 42, objectFit: "contain" },
      invoiceTitle: { fontSize: 26, fontWeight: "bold", color: activeTheme.primary, letterSpacing: -0.5 },
      metaText: { fontSize: 9, color: "#64748b", marginTop: 2 },
      badge: {
        marginTop: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: isBrutalist ? 0 : 4,
        alignSelf: "flex-start",
        fontSize: 8,
        fontWeight: "bold",
        backgroundColor: activeTheme.badgeBg,
        color: activeTheme.badgeColor,
        borderWidth: isBrutalist ? 1 : 0,
        borderColor: "#000",
      },
      twoColGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
      entityBox: { width: "46%" },
      entityHeading: { fontSize: 8, textTransform: "uppercase", color: "#94a3b8", fontWeight: "bold", marginBottom: 4 },
      entityName: { fontSize: 11, fontWeight: "bold", color: "#0f172a", marginBottom: 3 },
      entitySub: { fontSize: 9, color: "#475569", lineHeight: 1.3 },
      tableHeader: {
        flexDirection: "row",
        backgroundColor: isTokyo ? "#f4f4f5" : activeTheme.primary,
        padding: 8,
        borderRadius: isBrutalist ? 0 : 4,
        color: isTokyo ? "#18181b" : "#ffffff",
        fontWeight: "bold",
        fontSize: 8,
        textTransform: "uppercase",
      },
      tableRow: {
        flexDirection: "row",
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
        alignItems: "center",
      },
      colDesc: { flex: 4 },
      colQty: { flex: 1, textAlign: "right" },
      colRate: { flex: 1.5, textAlign: "right" },
      colAmount: { flex: 1.5, textAlign: "right" },
      bottomArea: { flexDirection: "row", justifyContent: "space-between", marginTop: 24 },
      termsBox: { width: "50%", paddingRight: 10 },
      totalsBox: { width: "45%" },
      tRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2.5 },
      grandRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 2,
        borderTopColor: activeTheme.primary,
        paddingTop: 6,
        marginTop: 6,
      },
      signSection: { marginTop: 30, borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 8, width: 140 },
      signLabel: { fontSize: 8, color: "#64748b" },
      footer: {
        position: "absolute",
        bottom: 25,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: "#f1f5f9",
        paddingTop: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 7,
        color: "#94a3b8",
      }
    });

    return (
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.accentStrip} />
          
          <View style={pdfStyles.topRow}>
            <View>
              {logo ? (
                <PDFImage src={logo} style={pdfStyles.logoBox} />
              ) : (
                <Text style={pdfStyles.invoiceTitle}>{senderName.slice(0, 18)}</Text>
              )}
              <View style={pdfStyles.badge}>
                <Text>{status}</Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={pdfStyles.invoiceTitle}>INVOICE</Text>
              <Text style={pdfStyles.metaText}>#{invoiceNumber}</Text>
              <Text style={pdfStyles.metaText}>Issued: {issueDate}</Text>
              {dueDate ? <Text style={pdfStyles.metaText}>Due: {dueDate}</Text> : null}
            </View>
          </View>

          <View style={pdfStyles.twoColGrid}>
            <View style={pdfStyles.entityBox}>
              <Text style={pdfStyles.entityHeading}>From / Provider</Text>
              <Text style={pdfStyles.entityName}>{senderName}</Text>
              <Text style={pdfStyles.entitySub}>{senderDetails}</Text>
            </View>
            <View style={[pdfStyles.entityBox, { alignItems: "flex-end", textAlign: "right" }]}>
              <Text style={pdfStyles.entityHeading}>Billed To / Client</Text>
              <Text style={pdfStyles.entityName}>{clientName}</Text>
              <Text style={pdfStyles.entitySub}>{clientDetails}</Text>
            </View>
          </View>

          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.colDesc}>Description</Text>
            <Text style={pdfStyles.colQty}>Qty</Text>
            <Text style={pdfStyles.colRate}>Rate</Text>
            <Text style={pdfStyles.colAmount}>Amount</Text>
          </View>

          {items.map((it) => (
            <View key={it.id} style={pdfStyles.tableRow}>
              <Text style={pdfStyles.colDesc}>{it.description || "Service item"}</Text>
              <Text style={pdfStyles.colQty}>{it.quantity}</Text>
              <Text style={pdfStyles.colRate}>{currency}{it.rate.toFixed(2)}</Text>
              <Text style={pdfStyles.colAmount}>{currency}{(it.quantity * it.rate).toFixed(2)}</Text>
            </View>
          ))}

          <View style={pdfStyles.bottomArea}>
            <View style={pdfStyles.termsBox}>
              <Text style={pdfStyles.entityHeading}>Terms & Wire Coordinates</Text>
              <Text style={pdfStyles.entitySub}>{paymentTerms}</Text>
              
              <View style={pdfStyles.signSection}>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Oblique", color: "#0f172a" }}>{signatureText}</Text>
                <Text style={pdfStyles.signLabel}>Authorized Representative</Text>
              </View>
            </View>

            <View style={pdfStyles.totalsBox}>
              <View style={pdfStyles.tRow}>
                <Text style={{ color: "#64748b" }}>Subtotal:</Text>
                <Text>{currency}{subtotal.toFixed(2)}</Text>
              </View>
              {discount > 0 && (
                <View style={pdfStyles.tRow}>
                  <Text style={{ color: "#64748b" }}>Discount ({discount}%):</Text>
                  <Text>-{currency}{discountAmount.toFixed(2)}</Text>
                </View>
              )}
              <View style={pdfStyles.tRow}>
                <Text style={{ color: "#64748b" }}>Tax / GST ({taxRate}%):</Text>
                <Text>{currency}{taxAmount.toFixed(2)}</Text>
              </View>
              <View style={pdfStyles.grandRow}>
                <Text style={{ fontWeight: "bold", fontSize: 11, color: activeTheme.primary }}>Total Due:</Text>
                <Text style={{ fontWeight: "bold", fontSize: 11, color: activeTheme.primary }}>
                  {currency}{grandTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          <View style={pdfStyles.footer}>
            <Text>Zero-Knowledge Cryptographic Client Engine</Text>
            <Text>Created with DraftBill Studio</Text>
          </View>
        </Page>
      </Document>
    );
  };

  const downloadPDF = async () => {
    const blob = await pdf(<PDFDocument />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoiceNumber || "invoice"}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isClient) return null;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif; background-color: #0b0f19; color: #f8fafc; }
        .studio-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 24px 16px 80px; }
        
        /* Top App Bar */
        .top-brand-bar { width: 100%; max-width: 960px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .logo-mark { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 18px; color: #ffffff; letter-spacing: -0.5px; }
        .badge-market { background: rgba(37,99,235,0.2); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px; text-transform: uppercase; }

        /* Control Dock */
        .dock-bar { width: 100%; max-width: 960px; background: #151c2e; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .theme-pills { display: flex; gap: 8px; overflow-x: auto; max-width: 100%; }
        .pill { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid transparent; background: rgba(255,255,255,0.04); color: #94a3b8; transition: all 0.2s; white-space: nowrap; }
        .pill.active { background: #ffffff; color: #090d16; font-weight: 700; }
        .color-dot { width: 8px; height: 8px; border-radius: 50%; }

        /* Gallery Trigger */
        .btn-gallery { background: rgba(255,255,255,0.08); color: #ffffff; border: 1px solid rgba(255,255,255,0.12); padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
        .btn-gallery:hover { background: rgba(255,255,255,0.15); }

        /* Canvas Sheet */
        .invoice-canvas { width: 100%; max-width: 960px; background: #ffffff; color: #0f172a; border-radius: 14px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); overflow: hidden; }
        .theme-accent-bar { height: 8px; width: 100%; }
        .sheet-content { padding: 40px; }

        /* Form Head */
        .sheet-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; gap: 24px; flex-wrap: wrap; }
        .logo-uploader { width: 150px; height: 64px; border: 1.5px dashed #cbd5e1; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; background: #f8fafc; overflow: hidden; }
        .logo-uploader:hover { border-color: #3b82f6; background: #eff6ff; }
        .uploaded-logo { width: 100%; height: 100%; object-fit: contain; }

        .meta-fields { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
        .doc-title { font-size: 32px; font-weight: 900; letter-spacing: -1px; }
        
        .grid-addresses { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        .input-title { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .glass-input { width: 100%; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; font-size: 13px; outline: none; background: #ffffff; }
        .glass-input:focus { border-color: #0f172a; }
        .multiline-input { min-height: 60px; resize: none; font-family: inherit; }

        /* Items Section */
        .table-head { display: flex; gap: 10px; padding: 10px 14px; border-radius: 6px; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .item-line { display: flex; gap: 10px; align-items: center; margin-top: 8px; }
        .btn-trash { background: none; border: none; color: #cbd5e1; cursor: pointer; padding: 6px; }
        .btn-trash:hover { color: #ef4444; }
        .btn-add { background: none; border: none; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 4px; margin-top: 12px; }

        /* Bottom Section */
        .sheet-foot { display: flex; justify-content: space-between; gap: 30px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; flex-wrap: wrap; }
        .totals-card { width: 300px; display: flex; flex-direction: column; gap: 10px; font-size: 14px; }
        .tot-row { display: flex; justify-content: space-between; color: #64748b; }
        .tot-grand { display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; padding-top: 10px; border-top: 2px solid; margin-top: 4px; }

        /* Actions */
        .action-dock { display: flex; gap: 12px; }
        .btn-export { background: #2563eb; color: #ffffff; border: none; border-radius: 8px; padding: 10px 20px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: transform 0.1s; }
        .btn-export:active { transform: scale(0.98); }

        /* Modal Gallery */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 20px; }
        .modal-card { background: #151c2e; border: 1px solid rgba(255,255,255,0.1); width: 100%; max-width: 800px; border-radius: 16px; padding: 24px; max-height: 90vh; overflow-y: auto; }
        .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 14px; }
        .gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .gallery-item { background: #0f172a; border: 1.5px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px; cursor: pointer; transition: all 0.2s; position: relative; }
        .gallery-item:hover { border-color: #3b82f6; transform: translateY(-2px); }
        .gallery-item.selected { border-color: #3b82f6; background: rgba(59,130,246,0.08); }
        
        /* Pitch Footer */
        .pitch-grid { width: 100%; max-width: 960px; margin-top: 40px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .pitch-card { background: #151c2e; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; }
        .pitch-card h3 { font-size: 14px; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; color: #ffffff; }
        .pitch-card p { font-size: 12px; color: #94a3b8; line-height: 1.5; }
      `}</style>

      <div className="studio-container">
        
        {/* Brand Bar */}
        <header className="top-brand-bar">
          <div className="logo-mark">
            <Sparkles size={20} color="#3b82f6" />
            <span>DraftBill Studio</span>
            <span className="badge-market">Global Pro</span>
          </div>
          <div className="action-dock">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="glass-input"
              style={{ width: "95px", fontWeight: "700", background: "#1e293b", color: "#fff", borderColor: "#334155" }}
            >
              <option value="$">$ USD</option>
              <option value="₹">₹ INR</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
              <option value="A$">A$ AUD</option>
              <option value="C$">C$ CAD</option>
              <option value="¥">¥ JPY</option>
            </select>
            <button onClick={downloadPDF} className="btn-export">
              <Download size={16} /> Export Vector PDF
            </button>
          </div>
        </header>

        {/* Template Selector Bar */}
        <div className="dock-bar">
          <div className="theme-pills">
            {Object.values(TEMPLATES).map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTemplate(t.id as keyof typeof TEMPLATES)}
                className={`pill ${selectedTemplate === t.id ? "active" : ""}`}
              >
                <span className="color-dot" style={{ backgroundColor: t.primary }} />
                {t.name}
              </div>
            ))}
          </div>
          <button onClick={() => setShowGallery(true)} className="btn-gallery">
            <LayoutTemplate size={14} /> Gallery View
          </button>
        </div>

        {/* Studio Canvas Sheet */}
        <section className="invoice-canvas">
          <div className="theme-accent-bar" style={{ backgroundColor: activeTheme.primary }} />
          
          <div className="sheet-content">
            
            {/* Header / Logo / Invoice Meta */}
            <div className="sheet-top">
              <div>
                <div 
                  className="logo-uploader" 
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload brand logo"
                >
                  {logo ? (
                    <img src={logo} alt="Company Logo" className="uploaded-logo" />
                  ) : (
                    <>
                      <Upload size={16} color="#94a3b8" />
                      <span style={{ fontSize: "10px", color: "#64748b", marginTop: "4px", fontWeight: "600" }}>
                        Upload Brand Logo
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>
                
                {/* Stamp Badges */}
                <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
                  {(["PENDING", "PAID", "OVERDUE", "DRAFT"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      style={{
                        padding: "3px 8px",
                        fontSize: "10px",
                        fontWeight: "700",
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer",
                        background: status === s ? activeTheme.badgeBg : "#f1f5f9",
                        color: status === s ? activeTheme.badgeColor : "#64748b",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="meta-fields">
                <h1 className="doc-title" style={{ color: activeTheme.primary }}>INVOICE</h1>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="glass-input"
                  style={{ width: "160px", textAlign: "right", fontWeight: "700" }}
                  placeholder="INV-001"
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <div>
                    <div className="input-title" style={{ textAlign: "right" }}>Issue Date</div>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="glass-input"
                      style={{ width: "130px", fontSize: "12px" }}
                    />
                  </div>
                  <div>
                    <div className="input-title" style={{ textAlign: "right" }}>Due Date</div>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="glass-input"
                      style={{ width: "130px", fontSize: "12px" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Entity Address Grid */}
            <div className="grid-addresses">
              <div>
                <div className="input-title">From / Service Provider</div>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="glass-input"
                  style={{ fontWeight: "700", marginBottom: "6px" }}
                  placeholder="Your Business Name"
                />
                <textarea
                  rows={3}
                  value={senderDetails}
                  onChange={(e) => setSenderDetails(e.target.value)}
                  className="glass-input multiline-input"
                  placeholder="Address, Tax ID, City, Email"
                />
              </div>

              <div>
                <div className="input-title">Billed To / Client</div>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="glass-input"
                  style={{ fontWeight: "700", marginBottom: "6px" }}
                  placeholder="Client Business Name"
                />
                <textarea
                  rows={3}
                  value={clientDetails}
                  onChange={(e) => setClientDetails(e.target.value)}
                  className="glass-input multiline-input"
                  placeholder="Client Office Address, Tax ID, Billing Contact"
                />
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <div className="table-head" style={{ backgroundColor: activeTheme.primary }}>
                <span style={{ flex: 4 }}>Description</span>
                <span style={{ width: "70px", textAlign: "right" }}>Qty</span>
                <span style={{ width: "120px", textAlign: "right" }}>Rate ({currency})</span>
                <span style={{ width: "120px", textAlign: "right" }}>Total</span>
                <span style={{ width: "32px" }}></span>
              </div>

              {items.map((item) => (
                <div key={item.id} className="item-line">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="glass-input"
                    placeholder="Deliverable description or milestone"
                    style={{ flex: 4 }}
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                    className="glass-input"
                    style={{ width: "70px", textAlign: "right" }}
                  />
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                    className="glass-input"
                    style={{ width: "120px", textAlign: "right" }}
                  />
                  <div style={{ width: "120px", textAlign: "right", fontWeight: "700", fontSize: "14px" }}>
                    {currency}{(item.quantity * item.rate).toFixed(2)}
                  </div>
                  <button onClick={() => removeItem(item.id)} disabled={items.length === 1} className="btn-trash">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button onClick={addItem} className="btn-add" style={{ color: activeTheme.accent }}>
                <Plus size={16} /> Add Itemized Service
              </button>
            </div>

            {/* Settlement Foot & Math */}
            <div className="sheet-foot">
              <div style={{ flex: 1, maxWidth: "460px" }}>
                <div className="input-title">Settlement Terms & Coordinates</div>
                <textarea
                  rows={3}
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="glass-input multiline-input"
                  placeholder="Payment notes, IBAN, Swift code, UPI details..."
                />

                <div style={{ marginTop: "16px" }}>
                  <div className="input-title" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <PenTool size={12} /> Authorized Signature Stamp
                  </div>
                  <input
                    type="text"
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    className="glass-input"
                    style={{ width: "220px", fontStyle: "italic", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div className="totals-card">
                <div className="tot-row">
                  <span>Subtotal</span>
                  <span>{currency}{subtotal.toFixed(2)}</span>
                </div>
                <div className="tot-row" style={{ alignItems: "center" }}>
                  <span>Discount (%)</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="glass-input"
                    style={{ width: "65px", textAlign: "right", padding: "4px" }}
                  />
                </div>
                <div className="tot-row" style={{ alignItems: "center" }}>
                  <span>Tax / GST Rate (%)</span>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="glass-input"
                    style={{ width: "65px", textAlign: "right", padding: "4px" }}
                  />
                </div>
                <div className="tot-grand" style={{ borderColor: activeTheme.primary, color: activeTheme.primary }}>
                  <span>Grand Total Due</span>
                  <span>{currency}{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Canva-Style Template Gallery Modal */}
        {showGallery && (
          <div className="modal-overlay" onClick={() => setShowGallery(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#fff" }}>Select Designer Template</h2>
                  <p style={{ fontSize: "12px", color: "#94a3b8" }}>Pick from 6 Canva-grade layout styles tailored for your industry</p>
                </div>
                <button onClick={() => setShowGallery(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              <div className="gallery-grid">
                {Object.values(TEMPLATES).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplate(t.id as keyof typeof TEMPLATES);
                      setShowGallery(false);
                    }}
                    className={`gallery-item ${selectedTemplate === t.id ? "selected" : ""}`}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#60a5fa", textTransform: "uppercase" }}>{t.category}</span>
                      <span className="color-dot" style={{ backgroundColor: t.primary, width: "12px", height: "12px" }} />
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#ffffff", marginBottom: "4px" }}>{t.name}</h3>
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>{t.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#3b82f6", fontWeight: "600" }}>
                      Use Template <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Pitch Cards */}
        <div className="pitch-grid">
          <div className="pitch-card">
            <h3><ShieldCheck size={16} color="#34d399" /> True Zero-Knowledge</h3>
            <p>Every calculation and PDF compiles inside your browser memory. We never log or store client financials.</p>
          </div>
          <div className="pitch-card">
            <h3><FileText size={16} color="#60a5fa" /> Vector Print Engine</h3>
            <p>Export in native ISO A4 format with scalable typography compatible with all enterprise accounting suites.</p>
          </div>
          <div className="pitch-card">
            <h3><CheckCircle2 size={16} color="#fbbf24" /> International Ready</h3>
            <p>Built-in multicurrency support with customizable sales tax, VAT, and GST calculation engines.</p>
          </div>
        </div>

      </div>
    </>
  );
}
