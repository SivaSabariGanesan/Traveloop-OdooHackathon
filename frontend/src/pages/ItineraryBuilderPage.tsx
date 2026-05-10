import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import { itineraryApi, type Stop } from "../api/itinerary";
import { tripsApi, type Trip } from "../api/trips";

const ItineraryBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");
  const { dark } = useTheme();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [sections, setSections] = useState<Stop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // New section form state
  const [newSection, setNewSection] = useState({
    title: "", location: "", startDate: "", endDate: "", notes: "",
  });

  const [addError, setAddError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!tripId) { setIsLoading(false); return; }
    setIsLoading(true);
    Promise.all([tripsApi.getById(tripId), itineraryApi.getStops(tripId)])
      .then(([tripRes, stopsRes]) => {
        setTrip(tripRes.data.data.trip);
        setSections(stopsRes.data.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [tripId]);

  const addSection = async () => {
    if (!tripId || !newSection.location || !newSection.startDate || !newSection.endDate) return;
    setAddError(null);
    setIsAdding(true);
    try {
      const res = await itineraryApi.createStop(tripId, {
        city: newSection.location,
        arrivalDate: new Date(newSection.startDate).toISOString(),
        departureDate: new Date(newSection.endDate).toISOString(),
        notes: newSection.notes || undefined,
      });
      setSections((prev) => [...prev, res.data.data]);
      setNewSection({ title: "", location: "", startDate: "", endDate: "", notes: "" });
    } catch (err: any) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.[0]?.message
        || err.message
        || "Failed to add section.";
      setAddError(msg);
      console.error("Add section error:", err.response?.data || err);
    } finally {
      setIsAdding(false);
    }
  };

  const removeSection = async (id: string) => {
    if (!tripId || sections.length <= 1) return;
    try {
      await itineraryApi.deleteStop(tripId, id);
      setSections((prev) => prev.filter((s) => s.id !== id));
    } catch {}
  };

  const updateSectionLocal = (id: string, field: string, value: string) => {
    setSections((prev) =>
      prev.map((s) => s.id === id ? { ...s, [field]: value } : s)
    );
  };

  // Drag handlers
  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, moved);
    setSections(reordered);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    if (!tripId) return;
    try {
      await itineraryApi.reorderStops(
        tripId,
        sections.map((s, i) => ({ id: s.id, order: i }))
      );
    } catch {}
  };

  const handleSave = async () => {
    if (!tripId) return;
    setIsSaving(true);
    try {
      await Promise.all(
        sections.map((s) => {
          const payload: Record<string, unknown> = {};
          if (s.city) payload.city = s.city;
          if (s.arrivalDate) payload.arrivalDate = s.arrivalDate;
          if (s.departureDate) payload.departureDate = s.departureDate;
          if (s.notes) payload.notes = s.notes;
          return itineraryApi.updateStop(tripId, s.id, payload);
        })
      );
    } catch {}
    setIsSaving(false);
  };

  const handleComplete = async () => {
    await handleSave();
    navigate(-1);
  };

  const inputStyle = {
    background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
    border: dark ? "1px solid rgba(61,46,34,0.9)" : "1px solid rgba(255,255,255,0.45)",
    color: dark ? "#F0E6D3" : "#3B2F2F",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  };

  // Map Stop fields to the section display fields
  const getSectionDisplay = (s: Stop) => ({
    title: s.city,
    location: s.city + (s.country ? `, ${s.country}` : ""),
    startDate: s.arrivalDate ? s.arrivalDate.split("T")[0] : "",
    endDate: s.departureDate ? s.departureDate.split("T")[0] : "",
    notes: s.notes || "",
  });

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: dark ? "#1C1612" : "#FAF6F0" }}>
      {/* Background blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#D4A373" }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "#C65D3A" }} />

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50" style={{
        background: dark ? "rgba(28,22,18,0.88)" : "rgba(250,246,240,0.85)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.6)",
        boxShadow: "0 2px 12px rgba(198,93,58,0.07)",
      }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:opacity-70"
              style={{ background: "rgba(198,93,58,0.1)" }}>
              <svg className="w-5 h-5" fill="none" stroke="#C65D3A" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium" style={{ color: "#C65D3A" }}>Back</span>
            </button>
            <h1 className="text-xl font-semibold" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
              {trip ? trip.name : "Build Itinerary"}
            </h1>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl p-6 sm:p-8 transition-colors duration-300" style={{
          background: dark ? "rgba(28,22,18,0.72)" : "rgba(250,246,240,0.55)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(255,255,255,0.5)",
          boxShadow: dark
            ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "0 8px 32px rgba(198,93,58,0.12), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "#C65D3A", borderTopColor: "transparent" }} />
            </div>
          ) : (
            <>
              {/* Sections */}
              <div className="space-y-4">
                {sections.map((section, index) => {
                  const display = getSectionDisplay(section);
                  return (
                    <div key={section.id} draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className="rounded-2xl p-5 transition-all duration-200 cursor-move"
                      style={{
                        background: dark ? "rgba(42,33,26,0.7)" : "rgba(255,255,255,0.6)",
                        border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.5)",
                        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                        opacity: draggedIndex === index ? 0.5 : 1,
                        boxShadow: dark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(198,93,58,0.12)",
                      }}>

                      {/* Section Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="cursor-grab active:cursor-grabbing">
                            <svg className="w-6 h-6" style={{ color: dark ? "rgba(240,230,211,0.4)" : "rgba(59,47,47,0.4)" }}
                              fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                            </svg>
                          </div>
                          <h2 className="text-base font-semibold" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
                            Section {index + 1}
                          </h2>
                        </div>
                        {sections.length > 1 && (
                          <button onClick={() => removeSection(section.id)}
                            className="p-1.5 rounded-lg transition-all duration-200 hover:opacity-70"
                            style={{ background: "rgba(200,100,100,0.2)" }} aria-label="Remove section">
                            <svg className="w-4 h-4" style={{ color: "#DC5555" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Title (city) */}
                      <div className="mb-3">
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>
                          Title
                        </label>
                        <input type="text" value={display.title}
                          onChange={(e) => updateSectionLocal(section.id, "city", e.target.value)}
                          placeholder="e.g., Arrival in Paris, Eiffel Tower Visit"
                          className="w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                          style={inputStyle} />
                      </div>

                      {/* Location */}
                      <div className="mb-3">
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>
                          Location
                        </label>
                        <div className="relative">
                          <input type="text" value={display.location}
                            onChange={(e) => updateSectionLocal(section.id, "city", e.target.value)}
                            placeholder="e.g., Paris, France"
                            className="w-full pl-9 pr-3 py-2 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                            style={inputStyle} />
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: dark ? "rgba(240,230,211,0.4)" : "rgba(59,47,47,0.4)" }}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>

                      {/* Date Range */}
                      <div className="mb-3">
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>
                          Date Range
                        </label>
                        <div className="flex items-center gap-2">
                          <input type="date" value={display.startDate}
                            onChange={(e) => updateSectionLocal(section.id, "arrivalDate", e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                            style={inputStyle} />
                          <span className="text-xs font-medium" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>to</span>
                          <input type="date" value={display.endDate}
                            onChange={(e) => updateSectionLocal(section.id, "departureDate", e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                            style={inputStyle} />
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>
                          Notes
                        </label>
                        <textarea value={display.notes}
                          onChange={(e) => updateSectionLocal(section.id, "notes", e.target.value)}
                          placeholder="Add any additional notes, activities, or reminders..."
                          rows={2}
                          className="w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                          style={inputStyle} />
                      </div>
                    </div>
                  );
                })}

                {/* New section form — same card style */}
                {tripId && (
                  <div className="rounded-2xl p-5" style={{
                    background: dark ? "rgba(42,33,26,0.5)" : "rgba(255,255,255,0.4)",
                    border: `2px dashed ${dark ? "rgba(61,46,34,0.7)" : "rgba(198,93,58,0.25)"}`,
                    backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                  }}>
                    <h2 className="text-base font-semibold mb-3" style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
                      New Section
                    </h2>

                    <div className="mb-3">
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>Location *</label>
                      <div className="relative">
                        <input type="text" value={newSection.location}
                          onChange={(e) => setNewSection((p) => ({ ...p, location: e.target.value }))}
                          placeholder="e.g., Paris, France"
                          className="w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none" style={inputStyle} />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                          style={{ color: dark ? "rgba(240,230,211,0.4)" : "rgba(59,47,47,0.4)" }}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>Date Range *</label>
                      <div className="flex items-center gap-2">
                        <input type="date" value={newSection.startDate}
                          onChange={(e) => setNewSection((p) => ({ ...p, startDate: e.target.value }))}
                          className="flex-1 px-3 py-2 rounded-xl text-sm focus:outline-none" style={inputStyle} />
                        <span className="text-xs font-medium" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>to</span>
                        <input type="date" value={newSection.endDate}
                          onChange={(e) => setNewSection((p) => ({ ...p, endDate: e.target.value }))}
                          className="flex-1 px-3 py-2 rounded-xl text-sm focus:outline-none" style={inputStyle} />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>Notes</label>
                      <textarea value={newSection.notes}
                        onChange={(e) => setNewSection((p) => ({ ...p, notes: e.target.value }))}
                        placeholder="Add any additional notes, activities, or reminders..."
                        rows={2} className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none resize-none" style={inputStyle} />
                    </div>

                    <div className="flex justify-center">
                      {addError && (
                        <p className="text-xs text-center mb-3 w-full rounded-lg px-3 py-2"
                          style={{ background: "rgba(220,85,85,0.1)", color: "#DC5555", border: "1px solid rgba(220,85,85,0.2)" }}>
                          {addError}
                        </p>
                      )}
                      <button onClick={addSection}
                        disabled={isAdding || !newSection.location || !newSection.startDate || !newSection.endDate}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:opacity-90"
                        style={{
                          background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
                          border: dark ? "1px solid rgba(61,46,34,0.9)" : "1px solid rgba(255,255,255,0.45)",
                          color: dark ? "#F0E6D3" : "#3B2F2F",
                          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                          opacity: (isAdding || !newSection.location || !newSection.startDate || !newSection.endDate) ? 0.5 : 1,
                        }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        {isAdding ? "Adding..." : "Add another Section"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t" style={{ borderColor: dark ? "rgba(61,46,34,0.6)" : "rgba(255,255,255,0.35)" }}>
                <button onClick={handleSave} disabled={isSaving}
                  className="flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:opacity-80"
                  style={{
                    background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
                    border: dark ? "1px solid rgba(61,46,34,0.9)" : "1px solid rgba(255,255,255,0.45)",
                    color: dark ? "#F0E6D3" : "#3B2F2F",
                    backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                    opacity: isSaving ? 0.6 : 1,
                  }}>
                  {isSaving ? "Saving..." : "Save Draft"}
                </button>
                <button onClick={handleComplete} disabled={isSaving}
                  className="flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90"
                  style={{ background: "#C65D3A", boxShadow: "0 4px 15px rgba(198,93,58,0.35)", opacity: isSaving ? 0.7 : 1 }}>
                  Complete Itinerary
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ItineraryBuilderPage;
