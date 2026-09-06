"use client";

import React, { useState } from "react";

export default function HomePage() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [currency, setCurrency] = useState("₹");

  const [fromName, setFromName] = useState("");
  const [fromAddress, setFromAddress] = useState("");

  const [toName, setToName] = useState("");
  const [toAddress, setToAddress] = useState("");

  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, rate: 0 },
  ]);

  const [taxRate, setTaxRate] = useState(18);
  const [notes, setNotes] = useState("");

  // Line item handlers
  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), description: "", quantity: 1, rate: 0 },
    ]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
    0
  );
  const taxAmount = (subtotal * (Number(taxRate) || 0)) / 100;
  const grandTotal = subtotal + taxAmount;

  return (
    <main style={{ maxWidth: "850px", margin: "30px auto", padding: "24px", background: "#ffffff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Swift Invoice</h1>
          <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#64748b" }}>Instant online invoice generator</p>
        </div>
        <button
          onClick={() => window.print()}
          style={{ padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
        >
          Print / Save PDF
        </button>
      </div>

      {/* Invoice Meta Controls */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Invoice Number</label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>Currency Symbol</label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
          />
        </div>
      </div>

      {/* Bill From / Bill To */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>Billed From (Your Details)</h3>
          <input
            type="text"
            placeholder="Business / Your Name"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "8px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
          />
          <textarea
            placeholder="Address, GSTIN / Tax ID, Phone"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "4px", minHeight: "70px" }}
          />
        </div>
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>Billed To (Client Details)</h3>
          <input
            type="text"
            placeholder="Client / Company Name"
            value={toName}
            onChange={(e) => setToName(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "8px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
          />
          <textarea
            placeholder="Client Address, GSTIN / Tax ID"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "4px", minHeight: "70px" }}
          />
        </div>
      </div>

      {/* Items Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
        <thead>
          <tr style={{ background: "#f1f5f9", textAlign: "left", fontSize: "13px", color: "#334155" }}>
            <th style={{ padding: "10px" }}>Description</th>
            <th style={{ padding: "10px", width: "90px" }}>Qty</th>
            <th style={{ padding: "10px", width: "110px" }}>Rate</th>
            <th style={{ padding: "10px", width: "110px" }}>Amount</th>
            <th style={{ padding: "10px", width: "50px" }}></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "8px" }}>
                <input
                  type="text"
                  placeholder="Item description or service"
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                  style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                />
              </td>
              <td style={{ padding: "8px" }}>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                  style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                />
              </td>
              <td style={{ padding: "8px" }}>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => handleItemChange(item.id, "rate", e.target.value)}
                  style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                />
              </td>
              <td style={{ padding: "8px", fontWeight: "600" }}>
                {currency} {((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}
              </td>
              <td style={{ padding: "8px", textAlign: "center" }}>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{ background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "4px", padding: "6px 8px", cursor: "pointer" }}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addItem}
        style={{ padding: "8px 14px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer", fontWeight: "500", marginBottom: "24px" }}
      >
        + Add Row
      </button>

      {/* Summary Box */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
        <div style={{ width: "260px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#475569" }}>
            <span>Subtotal:</span>
            <span>{currency} {subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", color: "#475569" }}>
            <span>Tax (%):</span>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              style={{ width: "65px", padding: "4px", border: "1px solid #cbd5e1", borderRadius: "4px", textAlign: "right" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "16px", borderTop: "2px solid #e2e8f0", paddingTop: "8px" }}>
            <span>Total:</span>
            <span>{currency} {grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes / Payment Terms */}
      <div style={{ marginTop: "16px" }}>
        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>
          Payment Details / Terms
        </label>
        <textarea
          placeholder="Bank details, UPI ID, or payment terms..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ width: "100%", padding: "8px", border: "1px solid #cbd5e1", borderRadius: "4px", minHeight: "60px" }}
        />
      </div>
    </main>
  );
}
