"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Download, Palette, Check } from "lucide-react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

// Template styling configurations
const TEMPLATES = {
  corporate: {
    id: "corporate",
    name: "Corporate Navy",
    primary: "#1e3a8a", // Navy
    secondary: "#f1f5f9",
    border: "#cbd5e1",
    accent: "#3b82f6",
  },
  modern: {
    id: "modern",
    name: "Modern Slate",
    primary: "#0f172a", // Charcoal
    secondary: "#f8fafc",
    border: "#e2e8f0",
    accent: "#64748b",
  },
  creative: {
    id: "creative",
    name: "Creative Emerald",
    primary: "#065f46", // Dark Emerald
    secondary: "#ecfdf5",
    border: "#a7f3d0",
    accent: "#059669",
  },
};

interface Item {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceApp() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof TEMPLATES>("corporate");
  const [sender, setSender] = useState("Acme Studio Design Inc.");
  const [client, setClient] = useState("Horizon Ventures Ltd.");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState(18);
  const [currency, setCurrency] = useState("₹");
  const [notes, setNotes] = useState("Thank you for your business. Payment is due within 15 days.");
  const [items, setItems] = useState<Item[]>([
    { id: "1", description: "UI/UX Design & Brand Strategy", quantity: 1, rate: 24000 },
    { id: "2", description: "Frontend Next.js Implementation", quantity: 1, rate: 36000 },
  ]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentTheme = TEMPLATES[selectedTemplate];

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof Item, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const subtotal = items.reduce((acc, curr) => acc + curr.quantity * curr.rate, 0);
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  // Dynamic PDF Generator with template styling
  const InvoicePDF = () => {
    const pdfStyles = StyleSheet.create({
      page: { padding: 40, fontSize: 10, color: "#334155", fontFamily: "Helvetica" },
      headerBar: {
        height: 6,
        backgroundColor: currentTheme.primary,
        marginBottom: 24,
      },
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
      },
      title: { fontSize: 26, fontWeight: "bold", color: currentTheme.primary, letterSpacing: 0.5 },
      metaText: { fontSize: 9, color: "#64748b", marginTop: 3 },
      senderSection: { textAlign: "right" },
      senderName: { fontSize: 13, fontWeight: "bold", color: "#0f172a" },
      infoGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 28,
        padding: 12,
        backgroundColor: currentTheme.secondary,
        borderRadius: 4,
      },
      label: { fontSize: 8, color: "#64748b", textTransform: "uppercase", marginBottom: 3, fontWeight: "bold" },
      boldValue: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
      tableHeader: {
        flexDirection: "row",
        backgroundColor: currentTheme.primary,
        padding: 8,
        borderRadius: 3,
        color: "#ffffff",
        fontWeight: "bold",
      },
      tableRow: {
        flexDirection: "row",
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
      },
      colDesc: { flex: 3 },
      colQty: { flex: 1, textAlign: "right" },
      colRate: { flex: 1, textAlign: "right" },
      colTotal: { flex: 1, textAlign: "right" },
      summarySection: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
      },
      notesBox: { width: 240, fontSize: 9, color: "#64748b", lineHeight: 1.4 },
      totalsBox: { width: 200 },
      summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 3,
      },
      grandTotalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 2,
        borderTopColor: currentTheme.primary,
        paddingTop: 6,
        marginTop: 6,
      },
      watermark: {
        marginTop: 40,
        textAlign: "center",
        fontSize: 8,
        color: "#94a3b8",
      },
    });

    return (
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.headerBar} />
          <View style={pdfStyles.header}>
            <View>
              <Text style={pdfStyles.title}>INVOICE</Text>
              <Text style={pdfStyles.metaText}>#{invoiceNumber}</Text>
            </View>
            <View style={pdfStyles.senderSection}>
              <Text style={pdfStyles.senderName}>{sender}</Text>
              <Text style={pdfStyles.metaText}>Date: {invoiceDate}</Text>
              {dueDate ? <Text style={pdfStyles.metaText}>Due: {dueDate}</Text> : null}
            </View>
          </View>

          <View style={pdfStyles.infoGrid}>
            <View>
              <Text style={pdfStyles.label}>Billed To:</Text>
              <Text style={pdfStyles.boldValue}>{client}</Text>
            </View>
            <View style={{ textAlign: "right" }}>
              <Text style={pdfStyles.label}>Total Amount Due:</Text>
              <Text style={[pdfStyles.boldValue, { fontSize: 13, color: currentTheme.primary }]}>
                {currency}{total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>

          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.colDesc}>Item Description</Text>
            <Text style={pdfStyles.colQty}>Qty</Text>
            <Text style={pdfStyles.colRate}>Rate</Text>
            <Text style={pdfStyles.colTotal}>Amount</Text>
          </View>

          {items.map((item) => (
            <View key={item.id} style={pdfStyles.tableRow}>
              <Text style={pdfStyles.colDesc}>{item.description || "Untitled Item"}</Text>
              <Text style={pdfStyles.colQty}>{item.quantity}</Text>
              <Text style={pdfStyles.colRate}>{currency}{item.rate.toFixed(2)}</Text>
              <Text style={pdfStyles.colTotal}>{currency}{(item.quantity * item.rate).toFixed(2)}</Text>
            </View>
          ))}

          <View style={pdfStyles.summarySection}>
            <View style={pdfStyles.notesBox}>
              <Text style={[pdfStyles.label, { marginBottom: 4 }]}>Notes & Terms</Text>
              <Text>{notes}</Text>
            </View>

            <View style={pdfStyles.totalsBox}>
              <View style={pdfStyles.summaryRow}>
                <Text style={{ color: "#64748b" }}>Subtotal:</Text>
                <Text>{currency}{subtotal.toFixed(2)}</Text>
              </View>
              <View style={pdfStyles.summaryRow}>
                <Text style={{ color: "#64748b" }}>Tax ({taxRate}%):</Text>
                <Text>{currency}{tax.toFixed(2)}</Text>
              </View>
              <View style={pdfStyles.grandTotalRow}>
                <Text style={{ fontWeight: "bold", fontSize: 12, color: currentTheme.primary }}>Total Due:</Text>
                <Text style={{ fontWeight: "bold", fontSize: 12, color: currentTheme.primary }}>
                  {currency}{total.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          <Text style={pdfStyles.watermark}>Crafted with Quick Invoice Pro</Text>
        </Page>
      </Document>
    );
  };

  const handleDownload = async () => {
    const blob = await pdf(<InvoicePDF />).toBlob();
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
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #f1f5f9; color: #0f172a; }
        .page-wrapper { min-height: 100vh; padding: 36px 16px; display: flex; flex-direction: column; align-items: center; }
        
        /* Canva-style Template Selector Bar */
        .template-bar { width: 100%; max-width: 860px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 14px 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .template-bar-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #475569; }
        .template-options { display: flex; gap: 10px; }
        .template-pill { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1.5px solid transparent; background: #f8fafc; color: #334155; transition: all 0.2s; }
        .template-pill:hover { background: #f1f5f9; }
        .template-pill.active { background: #ffffff; border-color: #0f172a; color: #0f172a; box-shadow: 0 2px 4px rgba(0,0,0,0.06); }
        .color-dot { width: 10px; height: 10px; border-radius: 50%; }

        /* Document Preview Card */
        .invoice-card { width: 100%; max-width: 860px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.06); position: relative; }
        .theme-top-banner { height: 8px; width: 100%; }
        .invoice-body { padding: 36px 40px; }

        /* Header Layout */
        .top-nav { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; gap: 20px; flex-wrap: wrap; }
        .brand-headline { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
        .brand-sub { font-size: 13px; color: #64748b; margin-top: 2px; }
        .btn-download { background: #0f172a; color: #ffffff; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: opacity 0.2s; }
        .btn-download:hover { opacity: 0.9; }

        /* Form Inputs */
        .grid-inputs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-bottom: 28px; }
        .full-span { grid-column: span 2; }
        .input-group label { display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px; }
        .clean-input { width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 9px 12px; font-size: 14px; outline: none; background: #ffffff; color: #0f172a; }
        .clean-input:focus { border-color: #0f172a; ring: 2px solid #0f172a; }

        /* Table Design */
        .items-header { display: flex; gap: 10px; padding: 8px 12px; border-radius: 6px; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        .item-row { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; }
        .btn-delete { background: transparent; border: none; color: #94a3b8; cursor: pointer; padding: 6px; display: flex; }
        .btn-delete:hover { color: #ef4444; }
        .btn-add-item { background: transparent; border: none; font-weight: 600; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 4px; margin-top: 10px; }

        /* Totals & Notes */
        .bottom-section { display: flex; justify-content: space-between; align-items: flex-start; gap: 30px; margin-top: 28px; padding-top: 24px; border-top: 1px solid #e2e8f0; flex-wrap: wrap; }
        .notes-area { flex: 1; min-width: 260px; }
        .totals-column { width: 280px; display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
        .totals-row { display: flex; justify-content: space-between; color: #64748b; }
        .grand-total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; padding-top: 10px; border-top: 2px solid; margin-top: 6px; }

        /* Showcase Banner */
        .showcase-footer { width: 100%; max-width: 860px; margin-top: 30px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .showcase-card { background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; padding: 16px; text-align: center; }
        .showcase-card h4 { font-size: 13px; font-weight: 700; margin-bottom: 4px; color: #0f172a; }
        .showcase-card p { font-size: 12px; color: #64748b; }
      `}</style>

      <main className="page-wrapper">
        
        {/* Template Switcher Bar */}
        <div className="template-bar">
          <div className="template-bar-label">
            <Palette size={16} /> Choose Design Template:
          </div>
          <div className="template-options">
            {Object.values(TEMPLATES).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id as keyof typeof TEMPLATES)}
                className={`template-pill ${selectedTemplate === t.id ? "active" : ""}`}
              >
                <span className="color-dot" style={{ backgroundColor: t.primary }} />
                {t.name}
                {selectedTemplate === t.id && <Check size={12} style={{ marginLeft: 2 }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Invoice Form & Live Preview */}
        <div className="invoice-card">
          <div className="theme-top-banner" style={{ backgroundColor: currentTheme.primary }} />
          
          <div className="invoice-body">
            <div className="top-nav">
              <div>
                <h1 className="brand-headline" style={{ color: currentTheme.primary }}>INVOICE</h1>
                <p className="brand-sub">Professional PDF billing template</p>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="clean-input"
                  style={{ width: "95px", fontWeight: "600" }}
                >
                  <option value="₹">₹ INR</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                </select>
                <button onClick={handleDownload} className="btn-download" style={{ backgroundColor: currentTheme.primary }}>
                  <Download size={15} /> Download PDF
                </button>
              </div>
            </div>

            <div className="grid-inputs">
              <div className="input-group">
                <label>Your Business (Sender)</label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="clean-input"
                />
              </div>
              <div className="input-group">
                <label>Invoice Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="clean-input"
                />
              </div>
              <div className="input-group">
                <label>Issue Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="clean-input"
                />
              </div>
              <div className="input-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="clean-input"
                />
              </div>
              <div className="input-group full-span">
                <label>Billed To (Client)</label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="clean-input"
                />
              </div>
            </div>

            {/* Line Items Table with Matching Header Accent */}
            <div style={{ marginBottom: "20px" }}>
              <div className="items-header" style={{ backgroundColor: currentTheme.primary }}>
                <span style={{ flex: 3 }}>Description</span>
                <span style={{ width: "70px", textAlign: "center" }}>Qty</span>
                <span style={{ width: "120px", textAlign: "right" }}>Rate ({currency})</span>
                <span style={{ width: "120px", textAlign: "right" }}>Amount</span>
                <span style={{ width: "32px" }}></span>
              </div>

              {items.map((item) => (
                <div key={item.id} className="item-row">
                  <input
                    type="text"
                    placeholder="Services or deliverables"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="clean-input"
                    style={{ flex: 3 }}
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                    className="clean-input"
                    style={{ width: "70px", textAlign: "center" }}
                  />
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                    className="clean-input"
                    style={{ width: "120px", textAlign: "right" }}
                  />
                  <div style={{ width: "120px", textAlign: "right", fontWeight: "600", fontSize: "14px" }}>
                    {currency}{(item.quantity * item.rate).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="btn-delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button onClick={addItem} className="btn-add-item" style={{ color: currentTheme.accent }}>
                <Plus size={15} /> Add Line Item
              </button>
            </div>

            {/* Bottom Section: Notes & Totals */}
            <div className="bottom-section">
              <div className="notes-area">
                <div className="input-group">
                  <label>Notes & Payment Instructions</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="clean-input"
                    style={{ resize: "none" }}
                  />
                </div>
              </div>

              <div className="totals-column">
                <div className="totals-row">
                  <span>Subtotal:</span>
                  <span>{currency}{subtotal.toFixed(2)}</span>
                </div>
                <div className="totals-row" style={{ alignItems: "center" }}>
                  <span>Tax Rate (%):</span>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="clean-input"
                    style={{ width: "65px", textAlign: "right", padding: "4px 8px" }}
                  />
                </div>
                <div className="totals-row">
                  <span>Tax Amount:</span>
                  <span>{currency}{tax.toFixed(2)}</span>
                </div>
                <div className="grand-total-row" style={{ borderColor: currentTheme.primary, color: currentTheme.primary }}>
                  <span>Total Due:</span>
                  <span>{currency}{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature showcase cards */}
        <div className="showcase-footer">
          <div className="showcase-card">
            <h4>100% Client-Side</h4>
            <p>Zero data leaves your browser. Safe, private, and instantaneous.</p>
          </div>
          <div className="showcase-card">
            <h4>Vector Sharp PDF</h4>
            <p>Export in pristine A4 resolution ready for print or digital dispatch.</p>
          </div>
          <div className="showcase-card">
            <h4>Global Currencies</h4>
            <p>Full support for INR, USD, EUR, and GBP with custom tax rates.</p>
          </div>
        </div>
      </main>
    </>
  );
}
