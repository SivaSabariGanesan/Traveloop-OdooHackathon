import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import { itineraryApi, type Stop, type Activity } from "../api/itinerary";
import { tripsApi, type Trip } from "../api/trips";

const ItineraryBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");
  const { dark } = useTheme();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Add stop form state
  const [showAddStop, setShowAddStop] = useState(false);
  const [newStop, setNewStop] = useState({ city: "", country: "", arrivalDate: "", departureDate: "", notes: "" });
  const [addingStop, setAddingStop] = useState(false);

  // Add activity state: { [stopId]: { name, location, startTime, endTime, cost } }
  const [addingActivity, setAddingActivity] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState({ name: "", location: "", startTime: "", endTime: "", cost: "" });

  useEffect(() => {
    if (!tripId) { setError("No trip selected."); setIsLoading(false); return; }
    const load = async () => {
      try {
        const [tripRes, stopsRes] = await Promise.all([
          tripsApi.getById(tripId),
          itineraryApi.getStops(tripId),
        ]);
        setTrip(tripRes.data.data.trip);
        setStops(stopsRes.data.data);
      } catch {
        setError("Failed to load itinerary.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [tripId]);

  // ─── Stop handlers ────────────────────────────────────────────────────────

  const handleAddStop = async () => {
    if (!tripId || !newStop.city || !newStop.arrivalDate || !newStop.departureDate) return;
    setAddingStop(true);
    try {
      const res = await itineraryApi.createStop(tripId, {
        city: newStop.city,
        country: newStop.country || undefined,
        arrivalDate: newStop.arrivalDate,
        departureDate: newStop.departureDate,
        notes: newStop.notes || undefined,
        order: stops.length,
      });
      setStops((prev) => [...prev, res.data.data]);
      setNewStop({ city: "", country: "", arrivalDate: "", departureDate: "", notes: "" });
      setShowAddStop(false);
    } catch {
      // silently fail — could add toast here
    } finally {
      setAddingStop(false);
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    if (!tripId) return;
    try {
      await itineraryApi.deleteStop(tripId, stopId);
      setStops((prev) => prev.filter((s) => s.id !== stopId));
    } catch {}
  };

  // Drag reorder
  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = async (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || !tripId) return;
    const reordered = [...stops];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, moved);
    const withOrder = reordered.map((s, i) => ({ ...s, order: i }));
    setStops(withOrder);
    setDraggedIndex(index);
    try {
      await itineraryApi.reorderStops(tripId, withOrder.map((s) => ({ id: s.id, order: s.order })));
    } catch {}
  };

  const handleDragEnd = () => setDraggedIndex(null);

  // ─── Activity handlers ────────────────────────────────────────────────────

  const handleAddActivity = async (stopId: string) => {
    if (!tripId || !newActivity.name) return;
    try {
      const res = await itineraryApi.createActivity(tripId, stopId, {
        name: newActivity.name,
        location: newActivity.location || undefined,
        startTime: newActivity.startTime || undefined,
        endTime: newActivity.endTime || undefined,
        cost: newActivity.cost ? parseFloat(newActivity.cost) : undefined,
        order: stops.find((s) => s.id === stopId)?.activities.length ?? 0,
      });
      setStops((prev) =>
        prev.map((s) => s.id === stopId ? { ...s, activities: [...s.activities, res.data.data] } : s)
      );
      setNewActivity({ name: "", location: "", startTime: "", endTime: "", cost: "" });
      setAddingActivity(null);
    } catch {}
  };

  const handleDeleteActivity = async (stopId: string, activityId: string) => {
    if (!tripId) return;
    try {
      await itineraryApi.deleteActivity(tripId, stopId, activityId);
      setStops((prev) =>
        prev.map((s) => s.id === stopId ? { ...s, activities: s.activities.filter((a) => a.id !== activityId) } : s)
      );
    } catch {}
  };

  // ─── Styles ───────────────────────────────────────────────────────────────

  const inputStyle = {
    background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
    border: dark ? "1px solid rgba(61,46,34,0.9)" : "1px solid rgba(255,255,255,0.45)",
    color: dark ? "#F0E6D3" : "#3B2F2F",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  };

  const cardStyle = {
    background: dark ? "rgba(42,33,26,0.7)" : "rgba(255,255,255,0.6)",
    border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.5)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: dark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(198,93,58,0.1)",
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: dark ? "#1C1612" : "#FAF6F0" }}>
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#D4A373" }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "#C65D3A" }} />

      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{
        background: dark ? "rgba(28,22,18,0.88)" : "rgba(250,246,240,0.85)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.6)",
        boxShadow: "0 2px 12px rgba(198,93,58,0.07)",
      }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:opacity-70 transition" style={{ background: "rgba(198,93,58,0.1)" }}>
              <svg className="w-5 h-5" fill="none" stroke="#C65D3A" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium" style={{ color: "#C65D3A" }}>Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-xl font-semibold" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
                {trip ? trip.name : "Build Itinerary"}
              </h1>
              {trip?.destination && (
                <p className="text-xs" style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}>{trip.destination}</p>
              )}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "#C65D3A", borderTopColor: "transparent" }} />
          </div>
        ) : error ? (
          <div className="text-center py-20" style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}>{error}</div>
        ) : (
          <div className="space-y-4">
            {/* Stops */}
            {stops.map((stop, index) => (
              <div key={stop.id} draggable onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd}
                className="rounded-2xl p-5 transition-all duration-200"
                style={{ ...cardStyle, opacity: draggedIndex === index ? 0.5 : 1, cursor: "grab" }}>

                {/* Stop header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: "#C65D3A" }}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
                        {stop.city}{stop.country ? `, ${stop.country}` : ""}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}>
                        {new Date(stop.arrivalDate).toLocaleDateString()} → {new Date(stop.departureDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteStop(stop.id)} className="p-1.5 rounded-lg hover:opacity-70 transition"
                    style={{ background: "rgba(200,100,100,0.15)" }}>
                    <svg className="w-4 h-4" style={{ color: "#DC5555" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {stop.notes && (
                  <p className="text-sm mb-3 px-1" style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
                    {stop.notes}
                  </p>
                )}

                {/* Activities */}
                {stop.activities.length > 0 && (
                  <div className="space-y-2 mb-3 ml-11">
                    {stop.activities.map((activity) => (
                      <ActivityRow key={activity.id} activity={activity} dark={dark}
                        onDelete={() => handleDeleteActivity(stop.id, activity.id)} />
                    ))}
                  </div>
                )}

                {/* Add activity */}
                {addingActivity === stop.id ? (
                  <div className="ml-11 mt-3 rounded-xl p-4 space-y-3" style={{
                    background: dark ? "rgba(61,46,34,0.3)" : "rgba(255,255,255,0.4)",
                    border: dark ? "1px solid rgba(61,46,34,0.6)" : "1px solid rgba(255,255,255,0.5)",
                  }}>
                    <input placeholder="Activity name *" value={newActivity.name}
                      onChange={(e) => setNewActivity((p) => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none" style={inputStyle} />
                    <div className="grid grid-cols-2 gap-2">
                      <input placeholder="Location" value={newActivity.location}
                        onChange={(e) => setNewActivity((p) => ({ ...p, location: e.target.value }))}
                        className="px-3 py-2 rounded-lg text-sm focus:outline-none" style={inputStyle} />
                      <input placeholder="Cost ($)" type="number" value={newActivity.cost}
                        onChange={(e) => setNewActivity((p) => ({ ...p, cost: e.target.value }))}
                        className="px-3 py-2 rounded-lg text-sm focus:outline-none" style={inputStyle} />
                      <input type="datetime-local" value={newActivity.startTime}
                        onChange={(e) => setNewActivity((p) => ({ ...p, startTime: e.target.value }))}
                        className="px-3 py-2 rounded-lg text-sm focus:outline-none" style={inputStyle} />
                      <input type="datetime-local" value={newActivity.endTime}
                        onChange={(e) => setNewActivity((p) => ({ ...p, endTime: e.target.value }))}
                        className="px-3 py-2 rounded-lg text-sm focus:outline-none" style={inputStyle} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setAddingActivity(null); setNewActivity({ name: "", location: "", startTime: "", endTime: "", cost: "" }); }}
                        className="flex-1 py-2 rounded-lg text-sm font-medium hover:opacity-70 transition" style={inputStyle}>
                        Cancel
                      </button>
                      <button onClick={() => handleAddActivity(stop.id)} disabled={!newActivity.name}
                        className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-85"
                        style={{ background: "#C65D3A", opacity: newActivity.name ? 1 : 0.5 }}>
                        Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setAddingActivity(stop.id); setNewActivity({ name: "", location: "", startTime: "", endTime: "", cost: "" }); }}
                    className="ml-11 mt-2 flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition"
                    style={{ color: "#C65D3A" }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add activity
                  </button>
                )}
              </div>
            ))}

            {/* Add Stop form */}
            {showAddStop ? (
              <div className="rounded-2xl p-5" style={cardStyle}>
                <h3 className="font-semibold mb-4" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>New Stop</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="City *" value={newStop.city}
                      onChange={(e) => setNewStop((p) => ({ ...p, city: e.target.value }))}
                      className="px-3 py-2.5 rounded-xl text-sm focus:outline-none" style={inputStyle} />
                    <input placeholder="Country" value={newStop.country}
                      onChange={(e) => setNewStop((p) => ({ ...p, country: e.target.value }))}
                      className="px-3 py-2.5 rounded-xl text-sm focus:outline-none" style={inputStyle} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs mb-1" style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>Arrival *</label>
                      <input type="date" value={newStop.arrivalDate}
                        onChange={(e) => setNewStop((p) => ({ ...p, arrivalDate: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-xs mb-1" style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>Departure *</label>
                      <input type="date" value={newStop.departureDate}
                        onChange={(e) => setNewStop((p) => ({ ...p, departureDate: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none" style={inputStyle} />
                    </div>
                  </div>
                  <textarea placeholder="Notes (optional)" value={newStop.notes} rows={2}
                    onChange={(e) => setNewStop((p) => ({ ...p, notes: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none resize-none" style={inputStyle} />
                  <div className="flex gap-3">
                    <button onClick={() => setShowAddStop(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium hover:opacity-70 transition" style={inputStyle}>
                      Cancel
                    </button>
                    <button onClick={handleAddStop} disabled={addingStop || !newStop.city || !newStop.arrivalDate || !newStop.departureDate}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-85"
                      style={{ background: "#C65D3A", opacity: (addingStop || !newStop.city) ? 0.6 : 1 }}>
                      {addingStop ? "Adding..." : "Add Stop"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddStop(true)}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-medium transition hover:opacity-80"
                style={{
                  background: dark ? "rgba(61,46,34,0.3)" : "rgba(255,255,255,0.4)",
                  border: `2px dashed ${dark ? "rgba(61,46,34,0.8)" : "rgba(198,93,58,0.3)"}`,
                  color: dark ? "rgba(240,230,211,0.7)" : "rgba(59,47,47,0.7)",
                }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add a stop
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// ─── Activity Row ─────────────────────────────────────────────────────────────

const ActivityRow: React.FC<{ activity: Activity; dark: boolean; onDelete: () => void }> = ({ activity, dark, onDelete }) => (
  <div className="flex items-center justify-between px-3 py-2 rounded-lg"
    style={{
      background: dark ? "rgba(61,46,34,0.35)" : "rgba(255,255,255,0.5)",
      border: dark ? "1px solid rgba(61,46,34,0.5)" : "1px solid rgba(230,211,179,0.4)",
    }}>
    <div className="flex items-center gap-2 min-w-0">
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#C65D3A" }} />
      <div className="min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>{activity.name}</p>
        {(activity.location || activity.cost) && (
          <p className="text-xs truncate" style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}>
            {[activity.location, activity.cost ? `$${activity.cost}` : null].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </div>
    <button onClick={onDelete} className="ml-2 p-1 rounded hover:opacity-70 transition flex-shrink-0">
      <svg className="w-3.5 h-3.5" style={{ color: "#DC5555" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

export default ItineraryBuilderPage;
