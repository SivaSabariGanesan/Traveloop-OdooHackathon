import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ui/ThemeToggle";

interface Trip {
  id: string;
  name: string;
  destination: string;
  country: string;
  description: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  duration: string;
  budget: string;
  travelers: number;
  tripType: string;
  status: "ongoing" | "upcoming" | "completed" | "draft";
  progress: number;
  activitiesPlanned: number;
  placesSaved: number;
  expensesTracked: number;
  checklistCompletion: number;
  aiInsight?: string;
}

const TripsPage: React.FC = () => {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBy, setGroupBy] = useState("status");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recent");

  // Mock data
  const [trips] = useState<Trip[]>([
    {
      id: "1",
      name: "Summer in Paris",
      destination: "Paris",
      country: "France",
      description: "Exploring the city of lights",
      coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
      startDate: "2026-06-12",
      endDate: "2026-06-18",
      duration: "6 Days",
      budget: "₹45,000",
      travelers: 2,
      tripType: "Couple",
      status: "upcoming",
      progress: 65,
      activitiesPlanned: 12,
      placesSaved: 8,
      expensesTracked: 15,
      checklistCompletion: 70,
      aiInsight: "Best time to visit Eiffel Tower: 9 AM",
    },
    {
      id: "2",
      name: "Bali Adventure",
      destination: "Bali",
      country: "Indonesia",
      description: "Beach paradise and culture",
      coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
      startDate: "2026-05-01",
      endDate: "2026-05-10",
      duration: "10 Days",
      budget: "₹65,000",
      travelers: 4,
      tripType: "Family",
      status: "ongoing",
      progress: 45,
      activitiesPlanned: 18,
      placesSaved: 15,
      expensesTracked: 22,
      checklistCompletion: 50,
      aiInsight: "Rain expected tomorrow, plan indoor activities",
    },
    {
      id: "3",
      name: "Tokyo Experience",
      destination: "Tokyo",
      country: "Japan",
      description: "Modern meets traditional",
      coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
      startDate: "2025-11-15",
      endDate: "2025-11-25",
      duration: "10 Days",
      budget: "₹80,000",
      travelers: 2,
      tripType: "Couple",
      status: "completed",
      progress: 100,
      activitiesPlanned: 20,
      placesSaved: 12,
      expensesTracked: 35,
      checklistCompletion: 100,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "#4CAF50";
      case "upcoming":
        return "#2196F3";
      case "completed":
        return "#9E9E9E";
      case "draft":
        return "#FF9800";
      default:
        return "#C65D3A";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: dark ? "#1C1612" : "#FAF6F0" }}
    >
      {/* Background blobs */}
      <div
        className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#D4A373" }}
      />
      <div
        className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "#C65D3A" }}
      />

      {/* Top Navigation */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: dark ? "rgba(28,22,18,0.88)" : "rgba(250,246,240,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: dark
            ? "1px solid rgba(61,46,34,0.8)"
            : "1px solid rgba(230,211,179,0.6)",
          boxShadow: "0 2px 12px rgba(198,93,58,0.07)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/Traveloop.png" alt="Traveloop" className="h-9" />
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              {/* Notifications */}
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{
                  background: dark ? "rgba(42,33,26,0.9)" : "rgba(243,233,220,0.8)",
                  border: "1.5px solid rgba(198,93,58,0.3)",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="#C65D3A"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              {/* Profile */}
              <Link
                to="/profile"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{
                  background: dark ? "rgba(42,33,26,0.9)" : "rgba(243,233,220,0.8)",
                  border: "1.5px solid rgba(198,93,58,0.3)",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="#C65D3A"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
          >
            My Trips
          </h1>
          <p
            className="text-sm"
            style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}
          >
            Manage and track all your travel adventures
          </p>
        </div>

        {/* Search & Controls */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{
            background: dark ? "rgba(28,22,18,0.72)" : "rgba(250,246,240,0.55)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: dark
              ? "1px solid rgba(61,46,34,0.8)"
              : "1px solid rgba(255,255,255,0.5)",
            boxShadow: dark
              ? "0 8px 32px rgba(0,0,0,0.4)"
              : "0 8px 32px rgba(198,93,58,0.12)",
          }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search trips by destination, activity, country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                style={{
                  background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
                  border: dark
                    ? "1px solid rgba(61,46,34,0.9)"
                    : "1px solid rgba(255,255,255,0.45)",
                  color: dark ? "#F0E6D3" : "#3B2F2F",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                fill="none"
                stroke="#C65D3A"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>

            {/* Group By */}
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              style={{
                background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
                border: dark
                  ? "1px solid rgba(61,46,34,0.9)"
                  : "1px solid rgba(255,255,255,0.45)",
                color: dark ? "#F0E6D3" : "#3B2F2F",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <option value="status">Group by Status</option>
              <option value="month">Group by Month</option>
              <option value="country">Group by Country</option>
              <option value="budget">Group by Budget</option>
              <option value="type">Group by Trip Type</option>
            </select>

            {/* Filter */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80"
              style={{
                background: filterOpen ? "#C65D3A" : dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
                border: filterOpen ? "1px solid #C65D3A" : dark
                  ? "1px solid rgba(61,46,34,0.9)"
                  : "1px solid rgba(255,255,255,0.45)",
                color: filterOpen ? "white" : dark ? "#F0E6D3" : "#3B2F2F",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              Filter
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              style={{
                background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
                border: dark
                  ? "1px solid rgba(61,46,34,0.9)"
                  : "1px solid rgba(255,255,255,0.45)",
                color: dark ? "#F0E6D3" : "#3B2F2F",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <option value="recent">Recently Updated</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="budget">Budget</option>
              <option value="startDate">Start Date</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Trip Categories */}
        <div className="space-y-8">
          {/* Ongoing Trips */}
          <TripCategory
            title="Ongoing Trips"
            trips={trips.filter((t) => t.status === "ongoing")}
            dark={dark}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />

          {/* Upcoming Trips */}
          <TripCategory
            title="Upcoming Trips"
            trips={trips.filter((t) => t.status === "upcoming")}
            dark={dark}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />

          {/* Completed Trips */}
          <TripCategory
            title="Completed Trips"
            trips={trips.filter((t) => t.status === "completed")}
            dark={dark}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
        </div>
      </main>
    </div>
  );
};

// Trip Category Component
interface TripCategoryProps {
  title: string;
  trips: Trip[];
  dark: boolean;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

const TripCategory: React.FC<TripCategoryProps> = ({
  title,
  trips,
  dark,
  getStatusColor,
  getStatusLabel,
}) => {
  if (trips.length === 0) {
    return (
      <div>
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
        >
          {title}
        </h2>
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: dark ? "rgba(42,33,26,0.5)" : "rgba(255,255,255,0.4)",
            border: dark
              ? "1px solid rgba(61,46,34,0.8)"
              : "1px solid rgba(230,211,179,0.5)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <p
            className="text-lg mb-2"
            style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}
          >
            No {title.toLowerCase()} yet
          </p>
          <p
            className="text-sm"
            style={{ color: dark ? "rgba(240,230,211,0.4)" : "rgba(59,47,47,0.4)" }}
          >
            Start planning your next adventure!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2
        className="text-xl font-semibold mb-4"
        style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            dark={dark}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
        ))}
      </div>
    </div>
  );
};

// Trip Card Component
interface TripCardProps {
  trip: Trip;
  dark: boolean;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  dark,
  getStatusColor,
  getStatusLabel,
}) => {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-pointer flex flex-col"
      style={{
        background: dark ? "rgba(42,33,26,0.7)" : "rgba(255,255,255,0.6)",
        border: dark
          ? "1px solid rgba(61,46,34,0.8)"
          : "1px solid rgba(230,211,179,0.5)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: dark
          ? "0 4px 12px rgba(0,0,0,0.3)"
          : "0 4px 12px rgba(198,93,58,0.12)",
      }}
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(28,22,18,0.7) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title & Description */}
        <h3
          className="text-lg font-bold mb-1"
          style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
        >
          {trip.name}
        </h3>
        <p
          className="text-sm mb-1"
          style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}
        >
          {trip.destination}, {trip.country}
        </p>
        <p
          className="text-xs mb-4"
          style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}
        >
          {trip.description}
        </p>

        {/* Metadata */}
        <div
          className="text-xs mb-4 pb-4"
          style={{
            color: dark ? "rgba(240,230,211,0.7)" : "rgba(59,47,47,0.7)",
            borderBottom: dark
              ? "1px solid rgba(61,46,34,0.6)"
              : "1px solid rgba(230,211,179,0.4)",
          }}
        >
          {trip.startDate} – {trip.endDate} • {trip.duration} • {trip.budget} •{" "}
          {trip.travelers} Travelers
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div
            className="text-center py-2 rounded-lg"
            style={{
              background: dark ? "rgba(61,46,34,0.4)" : "rgba(255,255,255,0.5)",
            }}
          >
            <p
              className="text-lg font-bold"
              style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
            >
              {trip.activitiesPlanned}
            </p>
            <p
              className="text-xs"
              style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}
            >
              Activities
            </p>
          </div>
          <div
            className="text-center py-2 rounded-lg"
            style={{
              background: dark ? "rgba(61,46,34,0.4)" : "rgba(255,255,255,0.5)",
            }}
          >
            <p
              className="text-lg font-bold"
              style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
            >
              {trip.placesSaved}
            </p>
            <p
              className="text-xs"
              style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}
            >
              Places
            </p>
          </div>
        </div>

        {/* AI Insight */}
        {trip.aiInsight && (
          <div
            className="p-3 rounded-lg mb-4"
            style={{
              background: dark ? "rgba(198,93,58,0.15)" : "rgba(198,93,58,0.1)",
              border: "1px solid rgba(198,93,58,0.3)",
            }}
          >
            <p
              className="text-xs"
              style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
            >
              {trip.aiInsight}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
            style={{
              background: "#C65D3A",
              color: "white",
              boxShadow: "0 2px 8px rgba(198,93,58,0.3)",
            }}
          >
            View Trip
          </button>
          <button
            className="py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
            style={{
              background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.5)",
              color: dark ? "#F0E6D3" : "#3B2F2F",
            }}
          >
            Edit
          </button>
          <button
            className="py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
            style={{
              background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.5)",
              color: dark ? "#F0E6D3" : "#3B2F2F",
            }}
          >
            •••
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripsPage;
