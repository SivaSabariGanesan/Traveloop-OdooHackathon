import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { notesApi, type Note } from "../api/notes";
import { tripsApi, type Trip } from "../api/trips";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import ThemeToggle from "../components/ui/ThemeToggle";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const NotesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId") ?? "";

  const [trip, setTrip] = useState<Trip | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "bookmarked">("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formBookmark, setFormBookmark] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!tripId) { setLoading(false); return; }
    Promise.all([
      tripsApi.getById(tripId).then(r => setTrip(r.data.data.trip)).catch(() => {}),
      notesApi.getAll(tripId).then(r => setNotes(r.data.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [tripId]);

  const openAdd = () => {
    setEditNote(null);
    setFormTitle(""); setFormBody(""); setFormBookmark(false);
    setShowForm(true);
    setTimeout(() => titleRef.current?.focus(), 80);
  };

  const openEdit = (n: Note) => {
    setEditNote(n);
    setFormTitle(n.title); setFormBody(n.body); setFormBookmark(n.bookmarked);
    setShowForm(true);
    setTimeout(() => titleRef.current?.focus(), 80);
  };

  const closeForm = () => { setShowForm(false); setEditNote(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formBody.trim()) return;
    setSaving(true);
    try {
      if (editNote) {
        const r = await notesApi.update(tripId, editNote.id, { title: formTitle.trim(), body: formBody.trim(), bookmarked: formBookmark });
        setNotes(prev => prev.map(n => n.id === editNote.id ? r.data.data : n));
      } else {
        const r = await notesApi.create(tripId, { title: formTitle.trim(), body: formBody.trim(), bookmarked: formBookmark });
        setNotes(prev => [r.data.data, ...prev]);
      }
      closeForm();
    } catch { /* handle silently */ }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    setDeleteId(id);
    try {
      await notesApi.delete(tripId, id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch { /* handle silently */ }
    finally { setDeleteId(null); }
  };

  const handleBookmark = async (n: Note) => {
    const r = await notesApi.toggleBookmark(tripId, n.id);
    setNotes(prev => prev.map(x => x.id === n.id ? r.data.data : x));
  };

  const visible = notes
    .filter(n => filter === "all" || n.bookmarked)
    .filter(n => !search.trim() || n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Group by date
  const grouped: Record<string, Note[]> = {};
  visible.forEach(n => {
    const key = formatDate(n.createdAt);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(n);
  });

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg text-text dark:text-dark-text transition-colors duration-300">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-secondary dark:border-dark-border bg-background/80 dark:bg-dark-bg/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              <span className="font-semibold tracking-wide uppercase text-xs">Trip Notes</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {trip ? trip.name : "Your Notes"}
            </h1>
            <p className="text-text/60 dark:text-dark-text/60 mt-2 text-sm max-w-lg">
              Jot down important details, hotel check-in info, or daily reflections for your trip.
            </p>
          </div>
          <Button onClick={openAdd} className="flex items-center gap-2 shadow-sm whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Note
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-8 border-b border-secondary dark:border-dark-border">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40 dark:text-dark-text/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md border border-secondary dark:border-dark-border bg-card dark:bg-dark-card text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
            />
          </div>
          <div className="flex bg-card dark:bg-dark-card p-1 rounded-md border border-secondary dark:border-dark-border self-start">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${filter === "all" ? "bg-background dark:bg-dark-bg shadow-sm text-text dark:text-dark-text" : "text-text/60 dark:text-dark-text/60 hover:text-text dark:hover:text-dark-text"}`}
            >
              All Notes
            </button>
            <button
              onClick={() => setFilter("bookmarked")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${filter === "bookmarked" ? "bg-background dark:bg-dark-bg shadow-sm text-primary" : "text-text/60 dark:text-dark-text/60 hover:text-text dark:hover:text-dark-text"}`}
            >
              Bookmarked
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : !tripId ? (
          <EmptyState message="No trip selected." hint="Open from your Trips page to view notes." />
        ) : visible.length === 0 ? (
          <EmptyState message={filter === "bookmarked" ? "No bookmarked notes." : "No notes yet."} hint="Click 'New Note' to start writing." onAdd={filter === "all" ? openAdd : undefined} />
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([date, dayNotes]) => (
              <div key={date}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-semibold text-text/80 dark:text-dark-text/80">{date}</span>
                  <div className="h-px flex-1 bg-secondary dark:bg-dark-border" />
                  <span className="text-xs text-text/50 dark:text-dark-text/50">{dayNotes.length} note{dayNotes.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayNotes.map(n => (
                    <NoteCard
                      key={n.id}
                      note={n}
                      deleting={deleteId === n.id}
                      onEdit={() => openEdit(n)}
                      onDelete={() => handleDelete(n.id)}
                      onBookmark={() => handleBookmark(n)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Sheet / Dialog Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center sm:p-4 bg-black/40 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) closeForm(); }}>
          <div className="w-full h-full sm:h-auto sm:max-w-lg bg-background dark:bg-dark-bg sm:rounded-xl sm:border border-secondary dark:border-dark-border shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-secondary dark:border-dark-border">
              <h2 className="text-lg font-semibold">{editNote ? "Edit Note" : "New Note"}</h2>
              <button onClick={closeForm} className="p-2 -mr-2 rounded-md hover:bg-secondary dark:hover:bg-dark-border text-text/60 dark:text-dark-text/60 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5">
              <Input
                label="Title"
                id="note-title"
                placeholder="e.g. Flight Details"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                maxLength={200}
                required
                autoFocus
              />
              <Textarea
                label="Note"
                id="note-body"
                placeholder="Write your note here..."
                value={formBody}
                onChange={e => setFormBody(e.target.value)}
                rows={6}
                required
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={formBookmark}
                  onClick={() => setFormBookmark(!formBookmark)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${formBookmark ? 'bg-primary' : 'bg-secondary dark:bg-dark-border'}`}
                >
                  <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${formBookmark ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <label className="text-sm cursor-pointer" onClick={() => setFormBookmark(!formBookmark)}>
                  Bookmark this note
                </label>
              </div>
            </form>
            <div className="p-4 sm:p-6 border-t border-secondary dark:border-dark-border flex justify-end gap-2 bg-card dark:bg-dark-card rounded-b-xl">
              <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
              <Button type="button" onClick={handleSave} disabled={saving || !formTitle.trim() || !formBody.trim()}>
                {saving ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Note Card Component ──────────────────────────────────────────────────────

const NoteCard: React.FC<{
  note: Note; deleting: boolean;
  onEdit: () => void; onDelete: () => void; onBookmark: () => void;
}> = ({ note, deleting, onEdit, onDelete, onBookmark }) => {
  return (
    <div className={`group relative flex flex-col bg-card dark:bg-dark-card border border-secondary dark:border-dark-border rounded-xl p-5 transition-all hover:shadow-md ${deleting ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-medium leading-tight text-base break-words line-clamp-2">
          {note.title}
        </h3>
        <button
          onClick={onBookmark}
          className={`flex-shrink-0 p-1 -m-1 rounded-full transition-colors ${note.bookmarked ? "text-primary" : "text-text/30 dark:text-dark-text/30 hover:text-text/50 dark:hover:text-dark-text/50"}`}
        >
          <svg className="w-5 h-5" fill={note.bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={note.bookmarked ? 1 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
      
      <p className="text-sm text-text/70 dark:text-dark-text/70 whitespace-pre-wrap line-clamp-4 mb-4 flex-1">
        {note.body}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-secondary/50 dark:border-dark-border/50">
        <span className="text-xs text-text/50 dark:text-dark-text/50 font-medium">
          {formatTime(note.createdAt)}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 rounded text-text/60 dark:text-dark-text/60 hover:bg-secondary dark:hover:bg-dark-border hover:text-primary transition-colors" title="Edit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          <button onClick={onDelete} className="p-1.5 rounded text-text/60 dark:text-dark-text/60 hover:bg-secondary dark:hover:bg-dark-border hover:text-red-500 transition-colors" title="Delete">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Empty State Component ────────────────────────────────────────────────────

const EmptyState: React.FC<{ message: string; hint: string; onAdd?: () => void }> = ({ message, hint, onAdd }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-secondary dark:border-dark-border rounded-xl bg-card/50 dark:bg-dark-card/50">
    <div className="w-12 h-12 bg-secondary/50 dark:bg-dark-border rounded-full flex items-center justify-center mb-4 text-text/50 dark:text-dark-text/50">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
    </div>
    <h3 className="text-base font-medium text-text dark:text-dark-text mb-1">{message}</h3>
    <p className="text-sm text-text/60 dark:text-dark-text/60 mb-6 max-w-sm">{hint}</p>
    {onAdd && (
      <Button variant="outline" onClick={onAdd}>Add Note</Button>
    )}
  </div>
);

export default NotesPage;
