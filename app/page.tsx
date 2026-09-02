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
    <main style={{ padding: "20px" }}>
      <div className="container">
        <div className="header">
          <div>
            <h1 className="title">Quick Invoice Maker</h1>
            <p className="subtitle">Free, fast client-side PDF billing tool</p>
          </div>
          <div className="actions">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="select"
            >
              <option value="₹">₹ INR</option>
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
            </select>
            <button onClick={handleDownload} className="btn-primary">
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Your Details (Sender)</label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>Invoice #</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="input"
            />
          </div>
          <div className="form-group full-width">
            <label>Bill To (Client)</label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div className="form-group">
            <label>Line Items</label>
          </div>
          {items.map((item) => (
            <div key={item.id} className="line-item-row">
              <input
                type="text"
                placeholder="Item / Service description"
                value={item.description}
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                className="input"
                style={{ flex: 1 }}
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                className="input"
                style={{ width: "70px", textAlign: "center" }}
              />
              <input
                type="number"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                className="input"
                style={{ width: "100px", textAlign: "right" }}
              />
              <button
                onClick={() => removeItem(item.id)}
                disabled={items.length === 1}
                className="btn-delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button onClick={addItem} className="btn-add">
            <Plus size={16} /> Add Item
          </button>
        </div>

        <div className="totals-section">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>{currency}{subtotal.toFixed(2)}</span>
          </div>
          <div className="total-row" style={{ alignItems: "center" }}>
            <span>Tax Rate (%):</span>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="input"
              style={{ width: "70px", textAlign: "right", padding: "4px 8px" }}
            />
          </div>
          <div className="total-row grand-total">
            <span>Grand Total:</span>
            <span>{currency}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="info-guide">
        <h2>How to Issue a Professional Freelance Invoice</h2>
        <p>
          A compliant invoice clearly states the seller&apos;s business details, client recipient, a sequential invoice tracking number, itemized rates, and regional tax deductions (such as GST or VAT).
        </p>
      </div>
    </main>
  );
}
