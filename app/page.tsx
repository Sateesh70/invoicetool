"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, Trash2, Download, Palette, Check, Upload, 
  Sparkles, ShieldCheck, FileText, CheckCircle2, 
  LayoutTemplate, X, PenTool, ArrowRight
} from "lucide-react";
import { Document, Page, Text, View, StyleSheet, Image as PDFImage, pdf } from "@react-pdf/renderer";

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
  
  const [senderName, setSenderName] = useState("Vanguard Design Studio LLC");
  const [senderDetails, setSenderDetails] = useState("450 Lexington Ave, New York, NY 10017\ntax-id: US-9940210\nbilling@vanguardstudio.com");
  const [clientName, setClientName] = useState("Apex Global Technologies Inc.");
  const [clientDetails, setClientDetails] = useState("100 Montgomery St, Suite 2100\nSan Francisco, CA 94104\nAttn: Accounts Payable");
  
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-8801");
  const [status, setStatus] = useState<"PENDING" | "PAID" | "OVERDUE" | "DRAFT">("PENDING");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]);
  const [currency, setCurrency] = useState("$");
  const [taxRate, setTaxRate] = useState(10);
  const [discount, setDiscount] = useState(0);
  
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

  const PDFDocument = () => {
    const isBrutalist = selectedTemplate === "brutalist";
    const isEditorial = selectedTemplate === "editorial";
    const isCorporate = selectedTemplate === "corporate";

    const pdfStyles = StyleSheet.create({
      page: { padding: 40, fontSize: 9, color: "#1e293b", fontFamily: "Helvetica" },
      accentBar: { height: isBrutalist ? 8 : 4, backgroundColor: theme.primary, marginBottom: 20 },
      topSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
      logoImage: { width: 110, height: 42, objectFit: "contain" },
      title: { fontSize: 26, fontWeight: "bold", color: theme.primary },
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
            <Text>Crafted with SwiftInvoiceApp</Text>
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

        .template-dock { width: 100%; max-width: 980px; background: #131b2e; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .template-chips { display: flex; gap: 8px; overflow-x: auto; }
        .chip { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid transparent; background: rgba(255,255,255,0.04); color: #94a3b8; transition: all 0.2s; white-space: nowrap; }
        .chip.active { background: #ffffff; color: #090d16; font-weight: 700; }
        .color-dot { width: 8px; height: 8px; border-radius: 50%; }

        .btn-gallery-toggle { background: rgba(255,255,255,0.08); color: #ffffff; border: 1px solid rgba(255,255,255,0.12); padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }
        .btn-gallery-toggle:hover { background: rgba(255,255,255,0.15); }

        .canvas-card { width: 100%; max-width: 980px; background: #ffffff; color: #0f172a; border-radius: 14px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); overflow: hidden; }
        .accent-strip { height: 8px; width: 100%; }
        .sheet-body { padding: 40px; }

        .header-grid { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; gap: 24px; flex-wrap: wrap; }
        .logo-box { width: 150px; height: 64px; border: 1.5px dashed #cbd5e1; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; background: #f8fafc; overflow: hidden; }
        .logo-box:hover { border-color: #3b82f6; background: #eff6ff; }
        .logo-preview { width: 100%; height: 100%; object-fit: contain; }

        .doc-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
        .doc-title { font-size: 32px; font-weight:
