import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import { tripsApi, type Trip } from "../api/trips";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "ongoing": return "#4CAF50";
    case "upcoming": return "#2196F3";
    case "completed": return "#9E9E9E";
    default: return "#C65D3A";
  }
};

const getDuration = (start: string, end: string) => {
  const days = Math.max(1, Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
  ));
  return `${days} Day${days !== 1 ? "s" : ""}`;
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const TripsPage: React.FC = () => {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBy, setGroupBy] = useState("status");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [trips, setTrips] = useState<{ ongoing: Trip[]; upcoming: Trip[]; completed: Trip[] }>({
    ongoing: [], upcoming: [], completed: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    tripsApi.getAll()
      .then((res) => setTrips(res.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filterTrips = (list: Trip[]) => {
    let result = [...list];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) =>
        t.name.toLowerCase().includes(q) ||
        (t.destination?.toLowerCase().includes(q) ?? false)
      );
    }
    if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt ?? b.startDate).getTime() - new Date(a.createdAt ?? a.startDate).getTime());
    if (sortBy === "oldest") result.sort((a, b) => new Date(a.createdAt ?? a.startDate).getTime() - new Date(b.createdAt ?? b.startDate).getTime());
    if (sortBy === "startDate") result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    if (sortBy === "alphabetical") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "budget") result.sort((a, b) => (b.budget ?? 0) - (a.budget ?? 0));
    return result;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this trip?")) return;
    try {
      await tripsApi.delete(id);
      setTrips((prev) => ({
        ongoing: prev.ongoing.filter((t) => t.id !== id),
        upcoming: prev.upcoming.filter((t) => t.id !== id),
        completed: prev.completed.filter((t) => t.id !== id),
      }));
    } catch {}
  };

  const inputStyle = {
    background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
    border: dark ? "1px solid rgba(61,46,34,0.9)" : "1px solid rgba(255,255,255,0.45)",
    color: dark ? "#F0E6D3" : "#3B2F2F",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
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
            <Link to="/"><img src="/Traveloop.png" alt="Traveloop" className="h-9" /></Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/profile" className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-70 transition"
                style={{ background: dark ? "rgba(42,33,26,0.9)" : "rgba(243,233,220,0.8)", border: "1.5px solid rgba(198,93,58,0.3)" }}>
                <svg className="w-5 h-5" fill="none" stroke="#C65D3A" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>My Trips</h1>
          <p className="text-sm" style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
            Manage and track all your travel adventures
          </p>
        </div>

        {/* Search & Controls */}
        <div className="rounded-2xl p-4 mb-6" style={{
          background: dark ? "rgba(28,22,18,0.72)" : "rgba(250,246,240,0.55)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(255,255,255,0.5)",
          boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(198,93,58,0.12)",
        }}>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <input type="text" placeholder="Search trips by destination, name..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                style={inputStyle} />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="#C65D3A" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none transition" style={inputStyle}>
              <option value="status">Group by Status</option>
              <option value="month">Group by Month</option>
            </select>
            <button onClick={() => setFilterOpen(!filterOpen)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-80 transition"
              style={{
                background: filterOpen ? "#C65D3A" : (dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)"),
                border: filterOpen ? "1px solid #C65D3A" : (dark ? "1px solid rgba(61,46,34,0.9)" : "1px solid rgba(255,255,255,0.45)"),
                color: filterOpen ? "white" : (dark ? "#F0E6D3" : "#3B2F2F"),
                backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              }}>
              Filter
            </button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none transition" style={inputStyle}>
              <option value="recent">Recently Updated</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="budget">Budget</option>
              <option value="startDate">Start Date</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "#C65D3A", borderTopColor: "transparent" }} />
          </div>
        ) : (
          <div className="space-y-8">
            {(["ongoing", "upcoming", "completed"] as const).map((status) => (
              <TripCategory
                key={status}
                title={`${status.charAt(0).toUpperCase() + status.slice(1)} Trips`}
                trips={filterTrips(trips[status])}
                dark={dark}
                onView={(id) => navigate(`/itinerary?tripId=${id}`)}
                onEdit={(id) => navigate(`/plan?editId=${id}`)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// ─── Trip Category ────────────────────────────────────────────────────────────

const TripCategory: React.FC<{
  title: string;
  trips: Trip[];
  dark: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ title, trips, dark, onView, onEdit, onDelete }) => {
  if (trips.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>{title}</h2>
        <div className="rounded-2xl p-12 text-center" style={{
          background: dark ? "rgba(42,33,26,0.5)" : "rgba(255,255,255,0.4)",
          border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.5)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        }}>
          <p className="text-lg mb-2" style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
            No {title.toLowerCase()} yet
          </p>
          <p className="text-sm" style={{ color: dark ? "rgba(240,230,211,0.4)" : "rgba(59,47,47,0.4)" }}>
            Start planning your next adventure!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} dark={dark}
            onView={() => onView(trip.id)} onEdit={() => onEdit(trip.id)} onDelete={() => onDelete(trip.id)} />
        ))}
      </div>
    </div>
  );
};

// ─── Trip Card ────────────────────────────────────────────────────────────────

const TripCard: React.FC<{
  trip: Trip;
  dark: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ trip, dark, onView, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const duration = getDuration(trip.startDate, trip.endDate);
  const imgSrc = trip.coverPhoto
    ? `http://localhost:5000${trip.coverPhoto}`
    : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80";

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-pointer flex flex-col"
      style={{
        background: dark ? "rgba(42,33,26,0.7)" : "rgba(255,255,255,0.6)",
        border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.5)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        boxShadow: dark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(198,93,58,0.12)",
      }}
      onClick={onView}>

      {/* Cover */}
      <div className="relative h-48 overflow-hidden">
        <img src={imgSrc} alt={trip.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(28,22,18,0.7) 0%, transparent 50%)" }} />
        {/* Status badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
          style={{ background: getStatusColor(trip.status) }}>
          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-1" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>{trip.name}</h3>
        {trip.destination && (
          <p className="text-sm mb-1" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>
            {trip.destination}
          </p>
        )}
        {trip.description && (
          <p className="text-xs mb-4 line-clamp-2" style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
            {trip.description}
          </p>
        )}

        {/* Metadata */}
        <div className="text-xs mb-4 pb-4"
          style={{
            color: dark ? "rgba(240,230,211,0.7)" : "rgba(59,47,47,0.7)",
            borderBottom: dark ? "1px solid rgba(61,46,34,0.6)" : "1px solid rgba(230,211,179,0.4)",
          }}>
          {formatDate(trip.startDate)} – {formatDate(trip.endDate)} • {duration}
          {trip.budget ? ` • $${trip.budget.toLocaleString()}` : ""}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-auto relative">
          <button onClick={(e) => { e.stopPropagation(); onView(); }}
            className="flex-1 py-2 px-3 rounded-lg text-xs font-medium hover:opacity-80 transition"
            style={{ background: "#C65D3A", color: "white", boxShadow: "0 2px 8px rgba(198,93,58,0.3)" }}>
            View Trip
          </button>
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="py-2 px-3 rounded-lg text-xs font-medium hover:opacity-80 transition"
            style={{ background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.5)", color: dark ? "#F0E6D3" : "#3B2F2F" }}>
            Edit
          </button>
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
              className="py-2 px-3 rounded-lg text-xs font-medium hover:opacity-80 transition"
              style={{ background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.5)", color: dark ? "#F0E6D3" : "#3B2F2F" }}>
              •••
            </button>
            {menuOpen && (
              <div className="absolute right-0 bottom-10 rounded-xl overflow-hidden z-10 min-w-[120px]"
                style={{
                  background: dark ? "rgba(28,22,18,0.95)" : "rgba(250,246,240,0.97)",
                  border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.6)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                }}>
                <button onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(); }}
                  className="w-full px-4 py-2.5 text-xs text-left hover:opacity-70 transition"
                  style={{ color: "#DC5555" }}>
                  Delete Trip
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripsPage;
