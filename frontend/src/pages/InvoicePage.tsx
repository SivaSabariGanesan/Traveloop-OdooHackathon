import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { invoiceApi, type InvoiceData, type InvoiceItem } from "../api/invoice";
import { useTheme } from "../context/ThemeContext";

const InvoicePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ category: "Stay", description: "", quantity: 1, unitCost: 0 });
  const [budgetInput, setBudgetInput] = useState<string>("");

  useEffect(() => {
    if (!tripId) {
      setError("No trip selected.");
      setLoading(false);
      return;
    }
    fetchInvoice();
  }, [tripId]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const res = await invoiceApi.getInvoice(tripId!);
      setInvoice(res.data.data);
      setBudgetInput(res.data.data.totalBudget.toString());
    } catch (e) {
      setError("Failed to load invoice.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async () => {
    if (!tripId || !budgetInput) return;
    try {
      const res = await invoiceApi.setBudget(tripId, Number(budgetInput));
      setInvoice(res.data.data);
    } catch {
      alert("Failed to update budget");
    }
  };

  const handleAddItem = async () => {
    if (!tripId || !newItem.description || newItem.unitCost <= 0) return;
    try {
      await invoiceApi.addItem(tripId, newItem);
      setIsAdding(false);
      setNewItem({ category: "Stay", description: "", quantity: 1, unitCost: 0 });
      fetchInvoice();
    } catch {
      alert("Failed to add item");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!tripId) return;
    try {
      await invoiceApi.deleteItem(tripId, itemId);
      setInvoice(prev => prev ? { ...prev, items: prev.items.filter(i => i.id !== itemId) } : null);
    } catch {
      alert("Failed to delete item");
    }
  };

  const handleMarkPaid = async () => {
    if (!tripId) return;
    if (!window.confirm("Are you sure you want to mark this invoice as PAID? This action cannot be undone.")) return;
    try {
      const res = await invoiceApi.markPaid(tripId);
      setInvoice(res.data.data);
    } catch {
      alert("Failed to mark as paid");
    }
  };



  // Calculations
  const { totalSpent, subtotal, tax, grandTotal, days, avgPerDay } = useMemo(() => {
    if (!invoice) return { totalSpent: 0, subtotal: 0, tax: 0, grandTotal: 0, days: 1, avgPerDay: 0 };
    const spent = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const sTotal = spent;
    const t = sTotal * 0.05; // 5% tax
    const start = new Date(invoice.trip.startDate);
    const end = new Date(invoice.trip.endDate);
    const d = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return {
      totalSpent: spent,
      subtotal: sTotal,
      tax: t,
      grandTotal: sTotal + t,
      days: d,
      avgPerDay: spent / d
    };
  }, [invoice]);

  const remaining = (invoice?.totalBudget || 0) - grandTotal;
  const isOverBudget = remaining < 0;

  // Render SVG Pie Chart
  const renderPieChart = () => {
    if (!invoice || invoice.totalBudget === 0) return null;
    const spentPct = Math.min(100, Math.round((grandTotal / invoice.totalBudget) * 100));
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (spentPct / 100) * circumference;

    return (
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r={radius} fill="transparent" stroke={dark ? "rgba(230,211,179,0.2)" : "rgba(59,47,47,0.1)"} strokeWidth="8" />
          <circle cx="48" cy="48" r={radius} fill="transparent" stroke={isOverBudget ? "#ef4444" : "#C65D3A"} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={dashoffset} className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute text-center flex flex-col items-center">
          <span className="text-sm font-bold">{spentPct}%</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-bg flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-bg p-8 text-center text-text dark:text-dark-text">
        <h2 className="text-xl font-bold mb-4">{error}</h2>
        <button onClick={() => navigate("/trips")} className="px-4 py-2 bg-primary text-white rounded-lg">Back to Trips</button>
      </div>
    );
  }

  const cardClass = `rounded-xl p-5 border transition-colors ${dark
      ? "bg-dark-card border-dark-border"
      : "bg-white border-secondary/30"
    }`;

  return (
    <div className="min-h-screen pb-20 text-text dark:text-dark-text transition-colors duration-300" style={{ background: dark ? "#1C1612" : "#FAF6F0" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-secondary dark:border-dark-border px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Trip
        </button>
        <h1 className="text-lg font-bold">Expense Invoice</h1>
        <div className="w-20" /> {/* Spacer */}
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Alerts */}
        {isOverBudget && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <p className="font-semibold text-sm">Over Budget Alert</p>
              <p className="text-xs mt-0.5">You have exceeded your total budget by ${Math.abs(remaining).toFixed(2)}.</p>
            </div>
          </div>
        )}

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Trip Info Card */}
          <div className={cardClass}>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight mb-1">{invoice.trip.name}</h3>
                <p className="text-xs opacity-70 mb-3">
                  {new Date(invoice.trip.startDate).toLocaleDateString()} - {new Date(invoice.trip.endDate).toLocaleDateString()} ({days} days)
                </p>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <div>
                    <span className="opacity-50 block">Invoice ID</span>
                    <span className="font-medium">INV-{invoice.id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="opacity-50 block">Date Generated</span>
                    <span className="font-medium">{new Date(invoice.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="opacity-50 block">Payment Status</span>
                    <span className={`font-bold ${invoice.status === 'PAID' ? 'text-green-500' : 'text-orange-500'}`}>{invoice.status}</span>
                  </div>
                  <div>
                    <span className="opacity-50 block">Avg. Per Day</span>
                    <span className="font-medium">${avgPerDay.toFixed(2)}/day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Insights Card */}
          <div className={cardClass}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-base">Budget Insights</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={budgetInput}
                  onChange={e => setBudgetInput(e.target.value)}
                  className="w-20 px-2 py-1 text-xs rounded border bg-transparent dark:border-dark-border"
                  placeholder="Set limit"
                />
                <button onClick={handleUpdateBudget} className="text-xs bg-primary/20 text-primary px-2 py-1 rounded hover:bg-primary/30 transition">Save</button>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {renderPieChart()}
              <div className="flex-1 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-70">Total Budget</span>
                  <span className="font-bold">${invoice.totalBudget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Grand Total Spent</span>
                  <span className="font-bold">${grandTotal.toFixed(2)}</span>
                </div>
                <div className="h-px w-full bg-secondary dark:bg-dark-border" />
                <div className="flex justify-between">
                  <span className="opacity-70">Remaining</span>
                  <span className={`font-bold ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>${remaining.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Table Section */}
        <div className={`overflow-hidden ${cardClass} p-0`}>
          <div className="p-4 border-b border-secondary/30 dark:border-dark-border flex justify-between items-center bg-secondary/10 dark:bg-dark-border/10">
            <h3 className="font-bold text-base">Itemized Expenses</h3>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition"
            >
              + Add Expense
            </button>
          </div>

          {/* Add Item Form */}
          {isAdding && (
            <div className="p-4 border-b border-secondary/30 dark:border-dark-border bg-background/50 dark:bg-dark-bg/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <select
                  value={newItem.category}
                  onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                  className="px-3 py-2 text-sm rounded-lg border bg-transparent dark:border-dark-border"
                >
                  {["Transport", "Stay", "Activities", "Meals", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="text" placeholder="Description"
                  value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  className="px-3 py-2 text-sm rounded-lg border bg-transparent dark:border-dark-border md:col-span-2"
                />
                <input
                  type="number" placeholder="Qty" min="1"
                  value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  className="px-3 py-2 text-sm rounded-lg border bg-transparent dark:border-dark-border"
                />
                <input
                  type="number" placeholder="Unit Cost ($)" min="0" step="0.01"
                  value={newItem.unitCost} onChange={e => setNewItem({ ...newItem, unitCost: Number(e.target.value) })}
                  className="px-3 py-2 text-sm rounded-lg border bg-transparent dark:border-dark-border"
                />
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => setIsAdding(false)} className="text-xs px-4 py-2 rounded-lg hover:bg-secondary/20 dark:hover:bg-dark-border transition">Cancel</button>
                <button onClick={handleAddItem} className="text-xs px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition">Save Item</button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs uppercase tracking-wider opacity-60 bg-secondary/5 dark:bg-dark-border/5">
                <tr>
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold w-full">Description</th>
                  <th className="px-4 py-3 font-semibold text-right">Qty/Details</th>
                  <th className="px-4 py-3 font-semibold text-right">Unit Cost</th>
                  <th className="px-4 py-3 font-semibold text-right">Amount</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/20 dark:divide-dark-border/50">
                {invoice.items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center opacity-50">No expenses recorded yet.</td>
                  </tr>
                ) : (
                  invoice.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-secondary/5 dark:hover:bg-dark-border/10 transition-colors">
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">{item.description}</td>
                      <td className="px-4 py-3 text-right opacity-80">{item.quantity}</td>
                      <td className="px-4 py-3 text-right opacity-80">${item.unitCost.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-medium">${item.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDeleteItem(item.id)} className="text-red-400 hover:text-red-500 transition p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Footer */}
          {invoice.items.length > 0 && (
            <div className="bg-secondary/10 dark:bg-dark-border/10 border-t border-secondary/30 dark:border-dark-border p-4 flex flex-col items-end space-y-2">
              <div className="flex justify-between w-48 text-sm">
                <span className="opacity-70">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-48 text-sm">
                <span className="opacity-70">Tax (5%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-48 text-sm">
                <span className="opacity-70">Discount</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="w-48 h-px bg-secondary dark:bg-dark-border my-1" />
              <div className="flex justify-between w-48 text-base">
                <span className="font-bold text-primary">Grand Total</span>
                <span className="font-bold">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-secondary/30 dark:border-dark-border">
          <div className="flex gap-3">
          </div>
          {invoice.status !== 'PAID' && (
            <button
              onClick={handleMarkPaid}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:opacity-90 transition shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Mark as Paid
            </button>
          )}
        </div>

      </main>
    </div>
  );
};

export default InvoicePage;
