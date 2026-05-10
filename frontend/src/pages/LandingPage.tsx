import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const regionalSelections = [
  {
    id: 1,
    name: "Bali",
    country: "Indonesia",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=80",
  },
  {
    id: 2,
    name: "Santorini",
    country: "Greece",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&q=80",
  },
  {
    id: 3,
    name: "Kyoto",
    country: "Japan",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&q=80",
  },
  {
    id: 4,
    name: "Machu Picchu",
    country: "Peru",
    img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=300&q=80",
  },
  {
    id: 5,
    name: "Amalfi",
    country: "Italy",
    img: "https://images.unsplash.com/photo-1533606688076-b6683a5f59f1?w=300&q=80",
  },
];

const previousTrips = [
  {
    id: 1,
    destination: "Paris",
    country: "France",
    date: "Mar 2024",
    duration: "7 days",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80",
  },
  {
    id: 2,
    destination: "Tokyo",
    country: "Japan",
    date: "Nov 2023",
    duration: "10 days",
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80",
  },
  {
    id: 3,
    destination: "New York",
    country: "USA",
    date: "Aug 2023",
    duration: "5 days",
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80",
  },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => (
  <nav
    className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
    style={{
      background: "rgba(250, 246, 240, 0.80)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(230, 211, 179, 0.6)",
      boxShadow: "0 2px 12px rgba(198,93,58,0.07)",
    }}
  >
    {/* Hamburger */}
    <button
      onClick={onMenuClick}
      className="w-9 h-9 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:opacity-70 transition focus:outline-none"
      style={{ background: "rgba(198,93,58,0.08)" }}
      aria-label="Open menu"
    >
      <span className="block w-4 h-0.5 rounded-full" style={{ background: "#C65D3A" }} />
      <span className="block w-4 h-0.5 rounded-full" style={{ background: "#C65D3A" }} />
      <span className="block w-3 h-0.5 rounded-full" style={{ background: "#C65D3A" }} />
    </button>

    <span className="text-2xl font-bold tracking-tight" style={{ color: "#C65D3A" }}>
      Traveloop
    </span>

    <Link
      to="/login"
      className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition"
      style={{
        background: "rgba(243, 233, 220, 0.8)",
        border: "1.5px solid rgba(198,93,58,0.3)",
        boxShadow: "0 2px 8px rgba(198,93,58,0.1)",
      }}
      aria-label="Profile"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="#C65D3A" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </Link>
  </nav>
);

// ─── Banner ───────────────────────────────────────────────────────────────────

const Banner: React.FC = () => (
  <div
    className="mx-4 mt-4 rounded-2xl overflow-hidden relative flex items-end"
    style={{
      height: "240px",
      boxShadow: "0 8px 32px rgba(198,93,58,0.2)",
    }}
  >
    <img
      src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=85"
      alt="Travel banner"
      className="absolute inset-0 w-full h-full object-cover"
    />
    {/* Gradient overlay */}
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(to top, rgba(59,47,47,0.75) 0%, rgba(198,93,58,0.25) 50%, transparent 100%)",
      }}
    />
    <div className="relative z-10 px-6 pb-6">
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-1"
        style={{ color: "#E6D3B3" }}
      >
        Discover the world
      </p>
      <h2 className="text-white text-3xl font-bold tracking-tight drop-shadow-md">
        Where will you go next?
      </h2>
    </div>
  </div>
);

// ─── Search Bar ───────────────────────────────────────────────────────────────

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="mx-4 mt-4 flex items-center gap-2">
      <div className="flex-1 relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="#C65D3A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search destinations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition"
          style={{
            background: "rgba(243, 233, 220, 0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(230, 211, 179, 0.8)",
            boxShadow: "0 2px 8px rgba(198,93,58,0.07)",
            color: "#3B2F2F",
          }}
        />
      </div>

      {["Group by", "Filter", "Sort by"].map((label) => (
        <button
          key={label}
          className="px-3 py-2.5 rounded-xl text-xs font-semibold transition whitespace-nowrap hover:opacity-80"
          style={{
            background: "rgba(243, 233, 220, 0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(230, 211, 179, 0.8)",
            boxShadow: "0 2px 8px rgba(198,93,58,0.06)",
            color: "#3B2F2F",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center gap-3 mx-4 mt-7 mb-3">
    <span className="text-base font-bold whitespace-nowrap" style={{ color: "#3B2F2F" }}>
      {title}
    </span>
    <div className="flex-1 h-px" style={{ background: "rgba(212, 163, 115, 0.5)" }} />
  </div>
);

// ─── Regional Card ────────────────────────────────────────────────────────────

const RegionalCard: React.FC<{ name: string; country: string; img: string }> = ({
  name, country, img,
}) => (
  <button
    className="flex-shrink-0 rounded-2xl overflow-hidden relative hover:scale-105 transition-transform focus:outline-none focus:ring-2"
    style={{
      width: "128px",
      height: "128px",
      boxShadow: "0 4px 16px rgba(59,47,47,0.15)",
      border: "1px solid rgba(255,255,255,0.4)",
    }}
  >
    <img src={img} alt={name} className="absolute inset-0 w-full h-full object-cover" />
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(to top, rgba(59,47,47,0.72) 0%, transparent 55%)",
      }}
    />
    <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 text-left">
      <p className="text-white text-xs font-bold leading-tight">{name}</p>
      <p className="text-xs" style={{ color: "#E6D3B3" }}>{country}</p>
    </div>
  </button>
);

// ─── Trip Card ────────────────────────────────────────────────────────────────

const TripCard: React.FC<{
  destination: string; country: string; date: string; duration: string; img: string;
}> = ({ destination, country, date, duration, img }) => (
  <div
    className="flex-shrink-0 rounded-2xl overflow-hidden relative hover:scale-[1.02] transition-transform cursor-pointer"
    style={{
      width: "160px",
      height: "200px",
      boxShadow: "0 6px 20px rgba(59,47,47,0.15)",
      border: "1px solid rgba(255,255,255,0.35)",
    }}
  >
    <img src={img} alt={destination} className="absolute inset-0 w-full h-full object-cover" />
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(to top, rgba(59,47,47,0.80) 0%, transparent 55%)",
      }}
    />
    <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
      <p className="text-white font-bold text-sm leading-tight">{destination}</p>
      <p className="text-xs" style={{ color: "#E6D3B3" }}>{country}</p>
      <p className="text-xs mt-1" style={{ color: "rgba(230,211,179,0.7)" }}>
        {date} · {duration}
      </p>
    </div>
  </div>
);

// ─── Landing Page ─────────────────────────────────────────────────────────────

const LandingPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="min-h-screen pb-28 relative"
      style={{ background: "#FAF6F0" }}
    >
      {/* Subtle background tint blobs */}
      <div
        className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#D4A373" }}
      />
      <div
        className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "#C65D3A" }}
      />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Banner />
      <SearchBar />

      {/* Top Regional Selections */}
      <SectionHeader title="Top Regional Selections" />
      <div className="flex gap-3 px-4 overflow-x-auto pb-1 scrollbar-hide">
        {regionalSelections.map((r) => (
          <RegionalCard key={r.id} name={r.name} country={r.country} img={r.img} />
        ))}
      </div>

      {/* Previous Trips */}
      <SectionHeader title="Previous Trips" />
      <div className="flex gap-4 px-4 overflow-x-auto pb-1 scrollbar-hide">
        {previousTrips.map((t) => (
          <TripCard
            key={t.id}
            destination={t.destination}
            country={t.country}
            date={t.date}
            duration={t.duration}
            img={t.img}
          />
        ))}
      </div>

      {/* Plan a Trip FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-semibold text-sm transition hover:opacity-90 active:scale-95"
          style={{
            background: "#C65D3A",
            boxShadow: "0 6px 20px rgba(198,93,58,0.4)",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Plan a trip
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
