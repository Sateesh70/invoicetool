"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Download } from "lucide-react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 11, color: "#333", fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: "bold", color: "#111" },
  label: { fontSize: 9, color: "#777", textTransform: "uppercase", marginBottom: 2 },
  boldText: { fontSize: 12, fontWeight: "bold" },
  tableHeader: { flexDirection: "row", backgroundColor: "#f4f4f5", padding: 6, fontWeight: "bold", borderBottomWidth: 1, borderBottomColor: "#ddd" },
  tableRow: { flexDirection: "row", padding: 6, borderBottomWidth: 1, borderBottomColor: "#eee" },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colRate: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  summaryRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 6, paddingRight: 6 },
  watermark: { marginTop: 30, textAlign: "center", fontSize: 8, color: "#aaa" },
});

interface Item {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceApp() {
  const [sender, setSender] = useState("Your Business Name");
  const [client, setClient] = useState("Client Name / Company");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [taxRate, setTaxRate] = useState(18);
  const [currency, setCurrency] = useState("₹");
  const [items, setItems] = useState<Item[]>([
    { id: "1", description: "Web Development Services", quantity: 1, rate: 5000 },
  ]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const InvoicePDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={{ color: "#666", marginTop: 4 }}>#{invoiceNumber}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.boldText}>{sender}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.label}>Billed To:</Text>
          <Text style={styles.boldText}>{client}</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Item Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colRate}>Rate</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>

        {items.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.colDesc}>{item.description || "Untitled Item"}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colRate}>{currency}{item.rate.toFixed(2)}</Text>
            <Text style={styles.colTotal}>{currency}{(item.quantity * item.rate).toFixed(2)}</Text>
          </View>
        ))}

        <View style={{ marginTop: 20 }}>
          <View style={styles.summaryRow}>
            <Text style={{ width: 100, color: "#666" }}>Subtotal:</Text>
            <Text style={{ width: 100, textAlign: "right" }}>{currency}{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={{ width: 100, color: "#666" }}>Tax ({taxRate}%):</Text>
            <Text style={{ width: 100, textAlign: "right" }}>{currency}{tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 8 }]}>
            <Text style={{ width: 100, fontWeight: "bold" }}>Total:</Text>
            <Text style={{ width: 100, textAlign: "right", fontWeight: "bold" }}>
              {currency}{total.toFixed(2)}
            </Text>
          </View>
        </View>

        <Text style={styles.watermark}>Generated with Quick Invoice Maker</Text>
      </Page>
    </Document>
  );

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
        body { font-family: system-ui, -apple-system, sans-serif; background-color: #f4f4f5; color: #18181b; }
        .page-wrapper { min-height: 100vh; padding: 32px 16px; display: flex; flex-direction: column; align-items: center; }
        .app-card { width: 100%; max-width: 800px; background: #ffffff; border-radius: 12px; border: 1px solid #e4e4e7; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .app-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e4e4e7; padding-bottom: 20px; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .app-title { font-size: 22px; font-weight: 700; color: #09090b; }
        .app-sub { font-size: 13px; color: #71717a; margin-top: 2px; }
        .header-actions { display: flex; gap: 10px; align-items: center; }
        .custom-select { border: 1px solid #d4d4d8; border-radius: 6px; padding: 8px 12px; font-size: 14px; background: #fafafa; }
        .download-btn { background-color: #18181b; color: #ffffff; padding: 9px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; }
        .download-btn:hover { background-color: #27272a; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        .form-full { grid-column: span 2; }
        .input-group label { display: block; font-size: 11px; font-weight: 600; color: #71717a; text-transform: uppercase; margin-bottom: 6px; }
        .custom-input { width: 100%; border: 1px solid #d4d4d8; border-radius: 6px; padding: 9px 12px; font-size: 14px; outline: none; }
        .custom-input:focus { border-color: #18181b; }
        .item-row { display: flex; gap: 8px; align-items: center; margin-bottom: 10px; }
        .btn-trash { background: transparent; border: none; color: #a1a1aa; cursor: pointer; padding: 6px; display: flex; }
        .btn-trash:hover { color: #ef4444; }
        .btn-add-item { background: transparent; border: none; color: #2563eb; font-weight: 600; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 4px; margin-top: 8px; }
        .totals-box { border-top: 1px solid #e4e4e7; padding-top: 20px; margin-top: 20px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; font-size: 14px; }
        .total-item { display: flex; justify-content: space-between; width: 240px; color: #52525b; }
        .grand-total { font-size: 16px; font-weight: 700; color: #09090b; border-top: 1px solid #e4e4e7; padding-top: 8px; margin-top: 4px; }
        .seo-box { width: 100%; max-width: 800px; background: #ffffff; border-radius: 12px; border: 1px solid #e4e4e7; padding: 24px; margin-top: 24px; font-size: 14px; color: #52525b; line-height: 1.6; }
      `}</style>

      <main className="page-wrapper">
        <div className="app-card">
          <div className="app-header">
            <div>
              <h1 className="app-title">Quick Invoice Maker</h1>
              <p className="app-sub">Free, instant browser-side PDF billing</p>
            </div>
            <div className="header-actions">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="custom-select"
              >
                <option value="₹">₹ INR</option>
                <option value="$">$ USD</option>
                <option value="€">€ EUR</option>
                <option value="£">£ GBP</option>
              </select>
              <button onClick={handleDownload} className="download-btn">
                <Download size={15} /> Download PDF
              </button>
            </div>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>Your Business (Sender)</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="custom-input"
              />
            </div>
            <div className="input-group">
              <label>Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="custom-input"
              />
            </div>
            <div className="input-group form-full">
              <label>Billed To (Client)</label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="custom-input"
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div className="input-group">
              <label>Line Items</label>
            </div>
            {items.map((item) => (
              <div key={item.id} className="item-row">
                <input
                  type="text"
                  placeholder="Item / Service description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  className="custom-input"
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                  className="custom-input"
                  style={{ width: "70px", textAlign: "center" }}
                />
                <input
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                  className="custom-input"
                  style={{ width: "110px", textAlign: "right" }}
                />
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="btn-trash"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button onClick={addItem} className="btn-add-item">
              <Plus size={15} /> Add Item
            </button>
          </div>

          <div className="totals-box">
            <div className="total-item">
              <span>Subtotal:</span>
              <span>{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="total-item" style={{ alignItems: "center" }}>
              <span>Tax Rate (%):</span>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="custom-input"
                style={{ width: "65px", textAlign: "right", padding: "4px 8px" }}
              />
            </div>
            <div className="total-item grand-total">
              <span>Grand Total:</span>
              <span>{currency}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <article className="seo-box">
          <h2 style={{ fontSize: "16px", color: "#09090b", marginBottom: "8px" }}>
            How to Issue a Professional Freelance Invoice
          </h2>
          <p>
            A compliant invoice contains clear sender details, client information, a sequential reference number, and an itemized breakdown of services with applicable tax deductions (such as GST or VAT).
          </p>
        </article>
      </main>
    </>
  );
}
