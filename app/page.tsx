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
    <main className="min-h-screen bg-zinc-50 p-6 md:p-12 text-zinc-800">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quick Invoice Maker</h1>
            <p className="text-sm text-zinc-500">Free, fast client-side PDF billing</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm bg-zinc-50 font-medium"
            >
              <option value="₹">₹ INR</option>
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
            </select>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-lg hover:bg-zinc-800 transition font-medium text-sm shadow-sm"
            >
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Your Details (Sender)</label>
            <input type="text" value={sender} onChange={(e) => setSender(e.target.value)} className="w-full border rounded-md p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Invoice #</label>
            <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full border rounded-md p-2 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Bill To (Client)</label>
            <input type="text" value={client} onChange={(e) => setClient(e.target.value)} className="w-full border rounded-md p-2 text-sm" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Line Items</label>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Item / Service description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  className="flex-1 border rounded-md p-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                  className="w-20 border rounded-md p-2 text-sm text-center"
                />
                <input
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                  className="w-28 border rounded-md p-2 text-sm text-right"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="p-2 text-zinc-400 hover:text-red-500 disabled:opacity-30"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addItem}
            className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>

        <div className="border-t pt-6 flex flex-col items-end gap-2 text-sm">
          <div className="flex justify-between w-64 text-zinc-600">
            <span>Subtotal:</span>
            <span>{currency}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center w-64 text-zinc-600">
            <span>Tax Rate (%):</span>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-16 border rounded p-1 text-right text-sm"
            />
          </div>
          <div className="flex justify-between w-64 text-base font-bold text-zinc-900 border-t pt-2 mt-1">
            <span>Grand Total:</span>
            <span>{currency}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}