"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, Trash2, Download, Palette, Check, Upload, 
  Sparkles, ShieldCheck, FileText, CheckCircle2, 
  LayoutTemplate, X, PenTool, ArrowRight, Eye
} from "lucide-react";
import { Document, Page, Text, View, StyleSheet, Image as PDFImage, pdf } from "@react-pdf/renderer";

// 5 Distinct Architectural Invoice Styles
const TEMPLATES = {
  editorial: {
    id: "editorial",
    name: "Minimalist Editorial",
    category: "Design / Agency",
    primary: "#18181b",
    accent: "#71717a",
    background: "#ffffff",
    borderStyle: "1px solid #e4e4e7",
    tagline: "Ultra-clean whitespace, thin hairlines, pure studio aesthetic.",
    badgeBg: "#f4f4f5",
    badgeColor: "#18181b",
  },
  splitTone: {
    id: "splitTone",
    name: "Modern Split-Tone",
    category: "Tech / Startup",
    primary: "#0f172a",
    accent: "#2563eb",
    background: "#f8fafc",
    borderStyle: "1px solid #cbd5e1",
    tagline: "Solid dark accent block with high-contrast tech hierarchy.",
    badgeBg: "#dbeafe",
    badgeColor: "#1e40af",
  },
  corporate: {
    id: "corporate",
    name: "Classic Corporate",
    category: "Legal / Enterprise",
    primary: "#1e293b",
    accent: "#047857",
    background: "#fcfbf9",
    borderStyle: "2px solid #334155",
    tagline: "Traditional formal structure with structured address grids.",
    badgeBg: "#d1fae5",
    badgeColor: "#065f46",
  },
  brutalist: {
    id: "brutalist",
    name: "Neo-Brutalist",
    category: "Creative / Web3",
    primary: "#000000",
    accent: "#facc15",
    background: "#ffffff",
    borderStyle: "2.5px solid #000000",
    tagline: "Bold black outlines, high contrast, monospaced tech look.",
    badgeBg: "#fef08a",
    badgeColor: "#000000",
  },
  swiss: {
    id: "swiss",
    name: "Swiss Grid",
    category: "Studio / Publication",
    primary: "#e11d48",
    accent: "#881337",
    background: "#fff1f2",
    borderStyle: "1.5px solid #e11d48",
    tagline: "Mathematical alignment with iconic red typographic hierarchy.",
    badgeBg: "#ffe4e6",
    badgeColor: "#9f1239",
  },
};

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function StudioInvoiceApp() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof TEMPLATES>("editorial");
  const [showGallery, setShowGallery] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [signatureText, setSignatureText] = useState("Authorized Signatory");
  
  // Entity Info
  const [senderName, setSenderName] = useState("Vanguard Design Studio LLC");
  const [senderDetails, setSenderDetails] = useState("450 Lexington Ave, New York, NY 10017\ntax-id: US-9940210\nbilling@vanguardstudio.com");
  const [clientName, setClientName] = useState("Apex Global Technologies Inc.");
  const [clientDetails, setClientDetails] = useState("100 Montgomery St, Suite 2100\nSan Francisco, CA 94104\nAttn: Accounts Payable");
  
  // Document Meta
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-8801");
  const [status, setStatus] = useState<"PENDING" | "PAID" | "OVERDUE" | "DRAFT">("PENDING");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]);
  const [currency, setCurrency] = useState("$");
  const [taxRate, setTaxRate] = useState(10);
  const [discount, setDiscount] = useState(0);
  
  // Terms & Items
  const [paymentTerms, setPaymentTerms] = useState("Payment due within 14 days of invoice issue via direct bank transfer.\nAccount: **** 8829 | Routing: 021000021 | Swift: CHASUS33");
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "Design System Architecture & Component Tokens", quantity: 1, rate: 4500 },
    { id: "2", description: "Next.js Full-Stack Web Application Implementation", quantity: 30, rate: 160 },
  ]);

  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const theme = TEMPLATES[selectedTemplate];

  // Mathematical Calculations
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

  // PDF Generator Engine tailored for each design archetype
  const PDFDocument = () => {
    const isBrutalist = selectedTemplate === "brutalist";
    const isEditorial = selectedTemplate === "editorial";
    const isCorporate = selectedTemplate === "corporate";

    const pdfStyles = StyleSheet.create({
      page: { padding: 40, fontSize: 9, color: "#1e293b", fontFamily: "Helvetica" },
      accentBar: { height: isBrutalist ? 8 : 4, backgroundColor: theme.primary, marginBottom: 20 },
      topSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
      logoImage: { width: 110, height: 42, objectFit: "contain" },
      title: { 
        fontSize: 26, 
        fontWeight: "bold", 
        color: theme.primary, 
        letterSpacing: isBrutalist ? 1 : -0.5 
      },
      metaSmall: { fontSize: 8, color: "#64748b", marginTop: 3 },
      badge: {
        marginTop: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: isBrutalist ? 0 : 4,
        alignSelf: "flex-start",
        fontSize: 8,
        fontWeight: "bold",
        backgroundColor: theme.badgeBg,
        color: theme.badgeColor,
        borderWidth: isBrutalist ? 1.5 : 0,
        borderColor: "#000000",
      },
      entityRow: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginBottom: 24,
        padding: isCorporate ? 12 : 0,
        backgroundColor: isCorporate ? "#f8fafc" : "transparent",
        borderWidth: isCorporate ? 1 : 0,
        borderColor: "#e2e8f0"
      },
      entityCol: { width: "46%" },
      entityLabel: { fontSize: 8, textTransform: "uppercase", color: "#94a3b8", fontWeight: "bold", marginBottom: 4 },
      entityTitle: { fontSize: 11, fontWeight: "bold", color: "#0f172a", marginBottom: 3 },
      entityText: { fontSize: 9, color: "#475569", lineHeight: 1.3 },
      tableHeader: {
        flexDirection: "row",
        backgroundColor: isEditorial ? "#f4f4f5" : theme.primary,
        padding: 8,
        borderRadius: isBrutalist ? 0 : 3,
        color: isEditorial ? "#18181b" : "#ffffff",
        fontWeight: "bold",
        fontSize: 8,
        textTransform: "uppercase",
      },
      tableRow: {
        flexDirection: "row",
        padding: 8,
        borderBottomWidth: isBrutalist ? 1.5 : 1,
        borderBottomColor: isBrutalist ? "#000000" : "#f1f5f9",
        alignItems: "center",
      },
      colDesc: { flex: 4 },
      colQty: { flex: 1, textAlign: "right" },
      colRate: { flex: 1.5, textAlign: "right" },
      colAmount: { flex: 1.5, textAlign: "right" },
      bottomSection: { flexDirection: "row", justifyContent: "space-between", marginTop: 24 },
      notesCol: { width: "50%", paddingRight: 12 },
      totalsCol: { width: "45%" },
      totRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
      grandTotalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: isBrutalist ? 2 : 1.5,
        borderTopColor: theme.primary,
        paddingTop: 6,
        marginTop: 6,
      },
      signatureBox: { marginTop: 26, borderTopWidth: 1, borderTopColor: "#cbd5e1", width: 140, paddingTop: 6 },
      signatureText: { fontSize: 9, fontStyle: "italic", color: "#0f172a" },
      footer: {
        position: "absolute",
        bottom: 24,
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
          <View style={pdfStyles.accentBar} />
          
          <View style={pdfStyles.topSection}>
            <View>
              {logo ? (
                <PDFImage src={logo} style={pdfStyles.logoImage} />
              ) : (
                <Text style={pdfStyles.title}>{senderName.slice(0, 18)}</Text>
              )}
              <View style={pdfStyles.badge}>
                <Text>{status}</Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={pdfStyles.title}>INVOICE</Text>
              <Text style={pdfStyles.metaSmall}>#{invoiceNumber}</Text>
              <Text style={pdfStyles.metaSmall}>Issued: {issueDate}</Text>
              {dueDate ? <Text style={pdfStyles.metaSmall}>Due: {dueDate}</Text> : null}
            </View>
          </View>

          <View style={pdfStyles.entityRow}>
            <View style={pdfStyles.entityCol}>
              <Text style={pdfStyles.entityLabel}>From / Provider</Text>
              <Text style={pdfStyles.entityTitle}>{senderName}</Text>
              <Text style={pdfStyles.entityText}>{senderDetails}</Text>
            </View>
            <View style={[pdfStyles.entityCol, { alignItems: "flex-end", textAlign: "right" }]}>
              <Text style={pdfStyles.entityLabel}>Billed To / Client</Text>
              <Text style={pdfStyles.entityTitle}>{clientName}</Text>
              <Text style={pdfStyles.entityText}>{clientDetails}</Text>
            </View>
          </View>

          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.colDesc}>Scope / Deliverable</Text>
            <Text style={pdfStyles.colQty}>Qty</Text>
            <Text style={pdfStyles.colRate}>Rate</Text>
            <Text style={pdfStyles.colAmount}>Amount</Text>
          </View>

          {items.map((it) => (
            <View key={it.id} style={pdfStyles.tableRow}>
              <Text style={pdfStyles.colDesc}>{it.description || "Milestone description"}</Text>
              <Text style={pdfStyles.colQty}>{it.quantity}</Text>
              <Text style={pdfStyles.colRate}>{currency}{it.rate.toFixed(2)}</Text>
              <Text style={pdfStyles.colAmount}>{currency}{(it.quantity * it.rate).toFixed(2)}</Text>
            </View>
          ))}

          <View style={pdfStyles.bottomSection}>
            <View style={pdfStyles.notesCol}>
              <Text style={pdfStyles.entityLabel}>Settlement Details</Text>
              <Text style={pdfStyles.entityText}>{paymentTerms}</Text>
              
              <View style={pdfStyles.signatureBox}>
                <Text style={pdfStyles.signatureText}>{signatureText}</Text>
                <Text style={{ fontSize: 7, color: "#64748b", marginTop: 2 }}>Authorized Signatory</Text>
              </View>
            </View>

            <View style={pdfStyles.totalsCol}>
              <View style={pdfStyles.totRow}>
                <Text style={{ color: "#64748b" }}>Subtotal:</Text>
                <Text>{currency}{subtotal.toFixed(2)}</Text>
              </View>
              {discount > 0 && (
                <View style={pdfStyles.totRow}>
                  <Text style={{ color: "#64748b" }}>Discount ({discount}%):</Text>
                  <Text>-{currency}{discountAmount.toFixed(2)}</Text>
                </View>
              )}
              <View style={pdfStyles.totRow}>
                <Text style={{ color: "#64748b" }}>Tax Rate ({taxRate}%):</Text>
                <Text>{currency}{taxAmount.toFixed(2)}</Text>
              </View>
              <View style={pdfStyles.grandTotalRow}>
                <Text style={{ fontWeight: "bold", fontSize: 11, color: theme.primary }}>Total Due:</Text>
                <Text style={{ fontWeight: "bold", fontSize: 11, color: theme.primary }}>
                  {currency}{grandTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          <View style={pdfStyles.footer}>
            <Text>Verified Client-Side Cryptographic Export</Text>
            <Text>Crafted with DraftBill Studio</Text>
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
        body { font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif; background-color: #090d16; color: #f8fafc; }
        .studio-wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 24px 16px 80px; }
        
        .top-navbar { width: 100%; max-width: 980px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .studio-brand { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 18px; color: #ffffff; letter-spacing: -0.5px; }
        .market-badge { background: rgba(37,99,235,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px; }

        /* Template Switcher Bar */
        .template-dock { width: 100%; max-width: 980px; background: #131b2e; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .template-chips { display: flex; gap: 8px; overflow-x: auto; }
        .chip { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid transparent; background: rgba(255,255,255,0.04); color: #94a3b8; transition: all 0.2s; white-space: nowrap; }
        .chip.active { background: #ffffff; color: #090d16; font-weight: 700; }
        .color-dot { width: 8px; height: 8px; border-radius: 50%; }

        .btn-gallery-toggle { background: rgba(255,255,255,0.08); color: #ffffff; border: 1px solid rgba(255,255,255,0.12); padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }
        .btn-gallery-toggle:hover { background: rgba(255,255,255,0.15); }

        /* Invoice Sheet */
        .canvas-card { width: 100%; max-width: 980px; background: #ffffff; color: #0f172a; border-radius: 14px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); overflow: hidden; transition: all 0.2s; }
        .accent-strip { height: 8px; width: 100%; }
        .sheet-body { padding: 40px; }

        /* Neo-Brutalist Layout Mods */
        .style-brutalist { border: 3px solid #000000 !important; box-shadow: 8px 8px 0px #000000 !important; font-family: monospace; }
        .style-swiss .doc-title { color: #e11d48; font-size: 38px; }

        /* Header Form Controls */
        .header-grid { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; gap: 24px; flex-wrap: wrap; }
        .logo-box { width: 150px; height: 64px; border: 1.5px dashed #cbd5e1; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; background: #f8fafc; overflow: hidden; }
        .logo-box:hover { border-color: #3b82f6; background: #eff6ff; }
        .logo-preview { width: 100%; height: 100%; object-fit: contain; }

        .doc-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
        .doc-title { font-size: 32px; font-weight: 900; letter-spacing: -1px; }

        .entity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        .input-label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .input-control { width: 100%; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; font-size: 13px; outline: none; background: #ffffff; }
        .input-control:focus { border-color: #0f172a; }
        .area-control { min-height: 60px; resize: none; font-family: inherit; }

        /* Table UI */
        .table-bar { display: flex; gap: 10px; padding: 10px 14px; border-radius: 6px; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .item-row { display: flex; gap: 10px; align-items: center; margin-top: 8px; }
        .btn-trash { background: none; border: none; color: #cbd5e1; cursor: pointer; padding: 6px; }
        .btn-trash:hover { color: #ef4444; }
        .btn-add { background: none; border: none; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 4px; margin-top: 12px; }

        /* Settlement & Totals */
        .footer-grid { display: flex; justify-content: space-between; gap: 30px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; flex-wrap: wrap; }
        .totals-summary { width: 300px; display: flex; flex-direction: column; gap: 10px; font-size: 14px; }
        .t-row { display: flex; justify-content: space-between; color: #64748b; }
        .t-grand { display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; padding-top: 10px; border-top: 2px solid; margin-top: 4px; }

        /* Actions */
        .btn-primary-export { background: #2563eb; color: #ffffff; border: none; border-radius: 8px; padding: 10px 20px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .btn-primary-export:hover { background: #1d4ed8; }

        /* Gallery Modal */
        .modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 20px; }
        .modal-box { background: #131b2e; border: 1px solid rgba(255,255,255,0.1); width: 100%; max-width: 840px; border-radius: 16px; padding: 24px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 14px; }
        .gallery-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .gallery-card { background: #0b1120; border: 1.5px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.2s; }
        .gallery-card:hover { border-color: #3b82f6; transform: translateY(-2px); }
        .gallery-card.active { border-color: #3b82f6; background: rgba(59,130,246,0.08); }

        .trust-grid { width: 100%; max-width: 980px; margin-top: 40px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .trust-card { background: #131b2e; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; }
        .trust-card h3 { font-size: 14px; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; color: #ffffff; }
        .trust-card p { font-size: 12px; color: #94a3b8; line-height: 1.5; }
      `}</style>

      <div className="studio-wrap">
        
        {/* Navigation Bar */}
        <header className="top-navbar">
          <div className="studio-brand">
            <Sparkles size={20} color="#3b82f6" />
            <span>DraftBill Studio</span>
            <span className="market-badge">Flagship 2.0</span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input-control"
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
            <button onClick={downloadPDF} className="btn-primary-export">
              <Download size={16} /> Export Vector PDF
            </button>
          </div>
        </header>

        {/* Template Selector Dock */}
        <div className="template-dock">
          <div className="template-chips">
            {Object.values(TEMPLATES).map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTemplate(t.id as keyof typeof TEMPLATES)}
                className={`chip ${selectedTemplate === t.id ? "active" : ""}`}
              >
                <span className="color-dot" style={{ backgroundColor: t.primary }} />
                {t.name}
              </div>
            ))}
          </div>
          <button onClick={() => setShowGallery(true)} className="btn-gallery-toggle">
            <LayoutTemplate size={14} /> Browse Designs
          </button>
        </div>

        {/* Main Document Canvas */}
        <section className={`canvas-card ${selectedTemplate === "brutalist" ? "style-brutalist" : ""} ${selectedTemplate === "swiss" ? "style-swiss" : ""}`}>
          <div className="accent-strip" style={{ backgroundColor: theme.primary }} />
          
          <div className="sheet-body">
            
            {/* Header / Logo / Invoice Meta */}
            <div className="header-grid">
              <div>
                <div 
                  className="logo-box" 
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload Brand Logo"
                >
                  {logo ? (
                    <img src={logo} alt="Company Logo" className="logo-preview" />
                  ) : (
                    <>
                      <Upload size={16} color="#94a3b8" />
                      <span style={{ fontSize: "10px", color: "#64748b", marginTop: "4px", fontWeight: "600" }}>
                        Upload Logo
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
                
                {/* Status Pills */}
                <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
                  {(["PENDING", "PAID", "OVERDUE", "DRAFT"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      style={{
                        padding: "3px 8px",
                        fontSize: "10px",
                        fontWeight: "700",
                        borderRadius: selectedTemplate === "brutalist" ? 0 : "4px",
                        border: selectedTemplate === "brutalist" ? "1px solid #000" : "none",
                        cursor: "pointer",
                        background: status === s ? theme.badgeBg : "#f1f5f9",
                        color: status === s ? theme.badgeColor : "#64748b",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="doc-meta">
                <h1 className="doc-title" style={{ color: theme.primary }}>INVOICE</h1>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="input-control"
                  style={{ width: "160px", textAlign: "right", fontWeight: "700" }}
                  placeholder="INV-001"
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <div>
                    <div className="input-label" style={{ textAlign: "right" }}>Issue Date</div>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="input-control"
                      style={{ width: "130px", fontSize: "12px" }}
                    />
                  </div>
                  <div>
                    <div className="input-label" style={{ textAlign: "right" }}>Due Date</div>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="input-control"
                      style={{ width: "130px", fontSize: "12px" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Entity Address Blocks */}
            <div className="entity-grid">
              <div>
                <div className="input-label">From / Provider</div>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="input-control"
                  style={{ fontWeight: "700", marginBottom: "6px" }}
                  placeholder="Your Business Name"
                />
                <textarea
                  rows={3}
                  value={senderDetails}
                  onChange={(e) => setSenderDetails(e.target.value)}
                  className="input-control area-control"
                  placeholder="Street Address, City, Tax ID, Support Email"
                />
              </div>

              <div>
                <div className="input-label">Billed To / Recipient</div>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="input-control"
                  style={{ fontWeight: "700", marginBottom: "6px" }}
                  placeholder="Client Business Name"
                />
                <textarea
                  rows={3}
                  value={clientDetails}
                  onChange={(e) => setClientDetails(e.target.value)}
                  className="input-control area-control"
                  placeholder="Client Office Address, Tax ID, Accounts Contact"
                />
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <div className="table-bar" style={{ backgroundColor: selectedTemplate === "editorial" ? "#f4f4f5" : theme.primary, color: selectedTemplate === "editorial" ? "#18181b" : "#fff" }}>
                <span style={{ flex: 4 }}>Description</span>
                <span style={{ width: "70px", textAlign: "right" }}>Qty</span>
                <span style={{ width: "120px", textAlign: "right" }}>Rate ({currency})</span>
                <span style={{ width: "120px", textAlign: "right" }}>Total</span>
                <span style={{ width: "32px" }}></span>
              </div>

              {items.map((item) => (
                <div key={item.id} className="item-row">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="input-control"
                    placeholder="Deliverable description or milestone"
                    style={{ flex: 4 }}
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                    className="input-control"
                    style={{ width: "70px", textAlign: "right" }}
                  />
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                    className="input-control"
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

              <button onClick={addItem} className="btn-add" style={{ color: theme.accent }}>
                <Plus size={16} /> Add Line Item
              </button>
            </div>

            {/* Terms & Totals Breakdown */}
            <div className="footer-grid">
              <div style={{ flex: 1, maxWidth: "460px" }}>
                <div className="input-label">Payment Terms & Wire Coordinates</div>
                <textarea
                  rows={3}
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="input-control area-control"
                  placeholder="Add wire coordinates, SWIFT code, UPI ID, or Net 15 conditions."
                />

                <div style={{ marginTop: "16px" }}>
                  <div className="input-label" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <PenTool size={12} /> Digital Signature Authorization
                  </div>
                  <input
                    type="text"
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    className="input-control"
                    style={{ width: "220px", fontStyle: "italic", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div className="totals-summary">
                <div className="t-row">
                  <span>Subtotal</span>
                  <span>{currency}{subtotal.toFixed(2)}</span>
                </div>
                <div className="t-row" style={{ alignItems: "center" }}>
                  <span>Discount (%)</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="input-control"
                    style={{ width: "65px", textAlign: "right", padding: "4px" }}
                  />
                </div>
                <div className="t-row" style={{ alignItems: "center" }}>
                  <span>Tax / GST Rate (%)</span>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="input-control"
                    style={{ width: "65px", textAlign: "right", padding: "4px" }}
                  />
                </div>
                <div className="t-grand" style={{ borderColor: theme.primary, color: theme.primary }}>
                  <span>Grand Total Due</span>
                  <span>{currency}{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Gallery Modal */}
        {showGallery && (
          <div className="modal-mask" onClick={() => setShowGallery(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#fff" }}>Invoice Design Gallery</h2>
                  <p style={{ fontSize: "12px", color: "#94a3b8" }}>Select an architectural design layout for your invoice</p>
                </div>
                <button onClick={() => setShowGallery(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              <div className="gallery-container">
                {Object.values(TEMPLATES).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplate(t.id as keyof typeof TEMPLATES);
                      setShowGallery(false);
                    }}
                    className={`gallery-card ${selectedTemplate === t.id ? "active" : ""}`}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#60a5fa", textTransform: "uppercase" }}>{t.category}</span>
                      <span className="color-dot" style={{ backgroundColor: t.primary, width: "12px", height: "12px" }} />
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#ffffff", marginBottom: "4px" }}>{t.name}</h3>
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>{t.tagline}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#3b82f6", fontWeight: "600" }}>
                      Activate Layout <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Value Proposition Cards */}
        <div className="trust-grid">
          <div className="trust-card">
            <h3><ShieldCheck size={16} color="#34d399" /> 100% Zero-Knowledge</h3>
            <p>Runs entirely in browser memory. Client financial records are never transmitted or stored on external servers.</p>
          </div>
          <div className="trust-card">
            <h3><FileText size={16} color="#60a5fa" /> Vector Sharp Export</h3>
            <p>Outputs clean, scalable A4 PDF vectors with high typographic fidelity ready for accounting ERPs.</p>
          </div>
          <div className="trust-card">
            <h3><CheckCircle2 size={16} color="#fbbf24" /> International Tax Ready</h3>
            <p>Handles global currencies, custom VAT/GST deduction rules, and dynamic discount adjustments.</p>
          </div>
        </div>

      </div>
    </>
  );
}
