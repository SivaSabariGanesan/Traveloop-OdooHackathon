import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import api from "../api/axios";

interface Trip {
  id: string;
  name: string;
  destination?: string;
  startDate: string;
  endDate: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
  coverPhoto?: string;
  budget?: number;
}

interface TripsData {
  ongoing: Trip[];
  upcoming: Trip[];
  completed: Trip[];
}

const statusColors: Record<string, string> = {
  ONGOING: "#22c55e",
  UPCOMING: "#C65D3A",
  COMPLETED: "#6b7280",
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState<TripsData>({ ongoing: [], upcoming: [], completed: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get("/trips");
        setTrips(res.data.data);
      } catch {
        setError("Failed to load trips.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const allTrips = [...trips.ongoing, ...trips.upcoming, ...trips.completed];
  const totalBudget = allTrips.reduce((sum, t) => sum + (t.budget || 0), 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cardStyle = {
    background: dark ? "rgba(28,22,18,0.72)" : "rgba(250,246,240,0.7)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(255,255,255,0.5)",
    boxShadow: dark
      ? "0 4px 24px rgba(0,0,0,0.3)"
      : "0 4px 24px rgba(198,93,58,0.08)",
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: dark ? "#1C1612" : "#FAF6F0" }}
    >
      {/* Background blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#D4A373" }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "#C65D3A" }} />

      {/* Navbar */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: dark ? "rgba(28,22,18,0.88)" : "rgba(250,246,240,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.6)",
          boxShadow: "0 2px 12px rgba(198,93,58,0.07)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-xl font-bold" style={{ color: "#C65D3A" }}>
              Traveloop
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="text-sm font-medium transition hover:opacity-70"
                style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
              >
                {user?.firstName} {user?.lastName}
              </button>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-sm font-medium transition hover:opacity-80"
                style={{ background: "rgba(198,93,58,0.12)", color: "#C65D3A" }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
            Welcome back, {user?.firstName} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: dark ? "rgba(240,230,211,0.55)" : "rgba(59,47,47,0.55)" }}>
            Here's an overview of your trips
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Trips", value: allTrips.length },
            { label: "Ongoing", value: trips.ongoing.length },
            { label: "Upcoming", value: trips.upcoming.length },
            { label: "Total Budget", value: totalBudget ? `$${totalBudget.toLocaleString()}` : "—" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl p-5" style={cardStyle}>
              <p className="text-xs font-medium mb-1" style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}>
                {stat.label}
              </p>
              <p className="text-2xl font-bold" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* New trip CTA */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
            Your Trips
          </h2>
          <button
            onClick={() => navigate("/plan")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-85"
            style={{ background: "#C65D3A", boxShadow: "0 4px 15px rgba(198,93,58,0.35)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Trip
          </button>
        </div>

        {/* Trips content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "#C65D3A", borderTopColor: "transparent" }} />
          </div>
        ) : error ? (
          <div className="text-center py-20" style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}>
            {error}
          </div>
        ) : allTrips.length === 0 ? (
          <EmptyState dark={dark} onPlan={() => navigate("/plan")} />
        ) : (
          <div className="space-y-8">
            {(["ongoing", "upcoming", "completed"] as const).map((section) =>
              trips[section].length > 0 ? (
                <div key={section}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-3"
                    style={{ color: dark ? "rgba(240,230,211,0.45)" : "rgba(59,47,47,0.45)" }}>
                    {section}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trips[section].map((trip) => (
                      <TripCard key={trip.id} trip={trip} dark={dark} onView={() => navigate(`/itinerary?tripId=${trip.id}`)} />
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// ─── Trip Card ────────────────────────────────────────────────────────────────

const TripCard: React.FC<{ trip: Trip; dark: boolean; onView: () => void }> = ({ trip, dark, onView }) => {
  const start = new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const end = new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div
      className="rounded-2xl overflow-hidden group cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
      style={{
        background: dark ? "rgba(42,33,26,0.7)" : "rgba(255,255,255,0.6)",
        border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.5)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: dark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(198,93,58,0.1)",
      }}
      onClick={onView}
    >
      {/* Cover */}
      <div className="h-36 relative overflow-hidden"
        style={{ background: dark ? "rgba(61,46,34,0.5)" : "rgba(212,163,115,0.2)" }}>
        {trip.coverPhoto ? (
          <img src={`http://localhost:5000${trip.coverPhoto}`} alt={trip.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 opacity-30" fill="none" stroke="#C65D3A" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          </div>
        )}
        {/* Status badge */}
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
          style={{ background: statusColors[trip.status] ?? "#6b7280" }}>
          {trip.status}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-base truncate mb-0.5" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
          {trip.name}
        </h3>
        {trip.destination && (
          <p className="text-sm truncate mb-2" style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
            {trip.destination}
          </p>
        )}
        <p className="text-xs" style={{ color: dark ? "rgba(240,230,211,0.45)" : "rgba(59,47,47,0.45)" }}>
          {start} – {end}
        </p>
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ dark: boolean; onPlan: () => void }> = ({ dark, onPlan }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <svg className="w-16 h-16 opacity-25" fill="none" stroke="#C65D3A" strokeWidth={1.2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
    <p className="text-lg font-medium" style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}>
      No trips yet
    </p>
    <button
      onClick={onPlan}
      className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-85"
      style={{ background: "#C65D3A", boxShadow: "0 4px 15px rgba(198,93,58,0.35)" }}
    >
      Plan your first trip
    </button>
  </div>
);

export default DashboardPage;
