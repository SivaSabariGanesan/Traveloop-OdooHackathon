import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { checklistApi, type Checklist, type ChecklistItem } from "../api/checklist";
import { tripsApi, type Trip } from "../api/trips";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ThemeToggle from "../components/ui/ThemeToggle";

const DEFAULT_CATEGORIES = ["General", "Clothing", "Documents", "Electronics", "Toiletries", "Health"];

const ChecklistPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId") ?? "";

  const [trip, setTrip] = useState<Trip | null>(null);
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [loading, setLoading] = useState(true);

  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("General");
  const [isAdding, setIsAdding] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editCategory, setEditCategory] = useState("");

  useEffect(() => {
    if (!tripId) {
      setLoading(false);
      return;
    }
    Promise.all([
      tripsApi.getById(tripId).then(r => setTrip(r.data.data.trip)).catch(() => {}),
      checklistApi.getOrCreate(tripId).then(r => setChecklist(r.data.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [tripId]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemLabel.trim() || isAdding) return;
    setIsAdding(true);
    try {
      const r = await checklistApi.addItem(tripId, { label: newItemLabel.trim(), category: newItemCategory });
      setChecklist(prev => prev ? { ...prev, items: [...prev.items, r.data.data] } : null);
      setNewItemLabel("");
    } catch {
      // Handle silently
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggle = async (item: ChecklistItem) => {
    // Optimistic update
    const newStatus = !item.checked;
    setChecklist(prev => prev ? { ...prev, items: prev.items.map(i => i.id === item.id ? { ...i, checked: newStatus } : i) } : null);
    try {
      await checklistApi.toggleItem(tripId, item.id, newStatus);
    } catch {
      // Revert if failed
      setChecklist(prev => prev ? { ...prev, items: prev.items.map(i => i.id === item.id ? { ...i, checked: !newStatus } : i) } : null);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await checklistApi.deleteItem(tripId, itemId);
      setChecklist(prev => prev ? { ...prev, items: prev.items.filter(i => i.id !== itemId) } : null);
    } catch {
      // Handle silently
    }
  };

  const handleStartEdit = (item: ChecklistItem) => {
    setEditingId(item.id);
    setEditLabel(item.label);
    setEditCategory(item.category);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editLabel.trim()) return;
    try {
      const r = await checklistApi.updateItem(tripId, editingId, { label: editLabel.trim(), category: editCategory });
      setChecklist(prev => prev ? { ...prev, items: prev.items.map(i => i.id === editingId ? r.data.data : i) } : null);
      setEditingId(null);
    } catch {
      // Handle silently
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to uncheck all items?")) return;
    try {
      await checklistApi.resetAll(tripId);
      setChecklist(prev => prev ? { ...prev, items: prev.items.map(i => ({ ...i, checked: false })) } : null);
    } catch {
      // Handle silently
    }
  };

  const groupedItems = useMemo(() => {
    if (!checklist) return {};
    return checklist.items.reduce((acc, item) => {
      const cat = item.category || "General";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {} as Record<string, ChecklistItem[]>);
  }, [checklist]);

  const categories = Object.keys(groupedItems).sort();

  const totalItems = checklist?.items.length || 0;
  const completedItems = checklist?.items.filter(i => i.checked).length || 0;
  const progressPercent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg text-text dark:text-dark-text transition-colors duration-300">
      <nav className="sticky top-0 z-40 border-b border-secondary dark:border-dark-border bg-background/80 dark:bg-dark-bg/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/trips" className="text-text/70 dark:text-dark-text/70 hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <Link to="/"><img src="/Traveloop.png" alt="Traveloop" className="h-8 object-contain" /></Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/profile" className="w-9 h-9 rounded-full bg-secondary dark:bg-dark-border flex items-center justify-center hover:opacity-80 transition">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="font-semibold tracking-wide uppercase text-xs">Packing Checklist</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {trip ? trip.name : "Your Checklist"}
            </h1>
            <p className="text-text/60 dark:text-dark-text/60 mt-2 text-sm max-w-lg">
              Keep track of what you need to pack for your journey. Stay organized and forget nothing.
            </p>
          </div>
          {totalItems > 0 && (
            <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Reset All
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        {totalItems > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm mb-2 font-medium">
              <span>Packing Progress</span>
              <span className="text-primary">{completedItems} of {totalItems} items ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2.5 bg-secondary/50 dark:bg-dark-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        )}

        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="mb-10 bg-card dark:bg-dark-card p-4 rounded-xl border border-secondary dark:border-dark-border shadow-sm flex flex-col sm:flex-row gap-3">
          <Input 
            placeholder="What do you need to pack?" 
            value={newItemLabel}
            onChange={e => setNewItemLabel(e.target.value)}
            className="flex-1 bg-background dark:bg-dark-bg"
            required
          />
          <select
            value={newItemCategory}
            onChange={e => setNewItemCategory(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-secondary dark:border-dark-border bg-background dark:bg-dark-bg text-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition min-w-[140px]"
          >
            {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button type="submit" disabled={isAdding || !newItemLabel.trim()} className="whitespace-nowrap flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Item
          </Button>
        </form>

        {/* Checklist Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : !tripId ? (
          <EmptyState message="No trip selected." hint="Open from your Trips page to view your checklist." />
        ) : totalItems === 0 ? (
          <EmptyState message="Your checklist is empty." hint="Add your first item above to start packing!" />
        ) : (
          <div className="space-y-8">
            {categories.map(category => (
              <div key={category} className="bg-background dark:bg-dark-bg rounded-xl border border-secondary dark:border-dark-border overflow-hidden">
                <div className="bg-secondary/20 dark:bg-dark-border/20 px-4 py-3 border-b border-secondary dark:border-dark-border flex items-center justify-between">
                  <h3 className="font-medium text-sm text-text/80 dark:text-dark-text/80 uppercase tracking-wide">
                    {category}
                  </h3>
                  <span className="text-xs bg-secondary/50 dark:bg-dark-border px-2 py-0.5 rounded-full">
                    {groupedItems[category].filter(i => i.checked).length} / {groupedItems[category].length}
                  </span>
                </div>
                <div className="divide-y divide-secondary dark:divide-dark-border">
                  {groupedItems[category].map(item => (
                    <div key={item.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-colors hover:bg-secondary/10 dark:hover:bg-dark-border/10 group">
                      
                      {editingId === item.id ? (
                        <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
                          <Input 
                            value={editLabel}
                            onChange={e => setEditLabel(e.target.value)}
                            className="flex-1 py-1.5 h-auto text-sm"
                            autoFocus
                          />
                          <select
                            value={editCategory}
                            onChange={e => setEditCategory(e.target.value)}
                            className="px-3 py-1.5 text-sm rounded-lg border border-secondary dark:border-dark-border bg-background dark:bg-dark-bg focus:outline-none focus:ring-1 focus:ring-primary/40 min-w-[120px]"
                          >
                            {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <div className="flex gap-2 shrink-0">
                            <Button variant="primary" onClick={handleSaveEdit} className="py-1.5 px-3 h-auto text-xs">Save</Button>
                            <Button variant="outline" onClick={() => setEditingId(null)} className="py-1.5 px-3 h-auto text-xs">Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <label className="flex items-start sm:items-center gap-3 flex-1 cursor-pointer">
                            <div className="relative flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                              <input 
                                type="checkbox" 
                                checked={item.checked} 
                                onChange={() => handleToggle(item)}
                                className="peer appearance-none w-5 h-5 border-2 border-secondary dark:border-dark-border rounded cursor-pointer checked:bg-primary checked:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                              />
                              <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className={`text-base transition-all ${item.checked ? 'text-text/40 dark:text-dark-text/40 line-through' : 'text-text dark:text-dark-text'}`}>
                              {item.label}
                            </span>
                          </label>
                          <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-8 sm:ml-0">
                            <button onClick={() => handleStartEdit(item)} className="p-1.5 rounded text-text/50 hover:bg-secondary/50 dark:hover:bg-dark-border hover:text-primary transition" title="Edit">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded text-text/50 hover:bg-secondary/50 dark:hover:bg-dark-border hover:text-red-500 transition" title="Delete">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const EmptyState: React.FC<{ message: string; hint: string }> = ({ message, hint }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-secondary dark:border-dark-border rounded-xl bg-card/50 dark:bg-dark-card/50">
    <div className="w-12 h-12 bg-secondary/50 dark:bg-dark-border rounded-full flex items-center justify-center mb-4 text-text/50 dark:text-dark-text/50">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75M8.25 21v-8.25M12.75 12h.008v.008h-.008V12zm0 3h.008v.008h-.008V15zm0 3h.008v.008h-.008V18z" /></svg>
    </div>
    <h3 className="text-base font-medium text-text dark:text-dark-text mb-1">{message}</h3>
    <p className="text-sm text-text/60 dark:text-dark-text/60 max-w-sm">{hint}</p>
  </div>
);

export default ChecklistPage;
