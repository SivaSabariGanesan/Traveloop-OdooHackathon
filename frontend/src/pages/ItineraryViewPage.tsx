import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Activity {
  id: number;
  title: string;
  time: string;
  category: string;
  expense: number;
  notes?: string;
}

interface Day {
  id: number;
  label: string;
  date: string;
  activities: Activity[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockItinerary: Day[] = [
  {
    id: 1,
    label: "Day 1",
    date: "Mon, 12 May",
    activities: [
      { id: 1, title: "Arrive at Ngurah Rai Airport", time: "09:00", category: "Transport", expense: 0, notes: "Pick up rental car" },
      { id: 2, title: "Check in — The Layar Villa", time: "13:00", category: "Stay", expense: 26560 },
      { id: 3, title: "Sunset at Tanah Lot Temple", time: "17:30", category: "Sightseeing", expense: 1245, notes: "Entry fee included" },
    ],
  },
  {
    id: 2,
    label: "Day 2",
    date: "Tue, 13 May",
    activities: [
      { id: 4, title: "Tegallalang Rice Terrace Trek", time: "07:30", category: "Adventure", expense: 2075 },
      { id: 5, title: "Lunch at Locavore", time: "12:30", category: "Food", expense: 4980, notes: "Reservation required" },
      { id: 6, title: "Ubud Monkey Forest", time: "15:00", category: "Sightseeing", expense: 830 },
    ],
  },
  {
    id: 3,
    label: "Day 3",
    date: "Wed, 14 May",
    activities: [
      { id: 7, title: "Sunrise Hike — Mount Batur", time: "03:30", category: "Adventure", expense: 6640, notes: "Guide included" },
      { id: 8, title: "Hot Springs at Toya Devasya", time: "10:00", category: "Wellness", expense: 2905 },
      { id: 9, title: "Seminyak Beach Club", time: "16:00", category: "Leisure", expense: 3735 },
    ],
  },
];

const BUDGET = 66400;

// category → simple icon path
const categoryIcon: Record<string, React.ReactNode> = {
  Transport: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  Stay: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Sightseeing: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  ),
  Adventure: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l4-8 4 4 4-6 4 10H3z"/>
    </svg>
  ),
  Food: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  Wellness: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Leisure: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  ),
};

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar: React.FC<{ onMenuClick: () => void; dark: boolean }> = ({ onMenuClick, dark }) => (
  <nav
    className="sticky top-0 z-50 flex items-center justify-between px-5 py-4"
    style={{
      background: dark ? "rgba(28,22,18,0.95)" : "rgba(250,246,240,0.95)",
      borderBottom: dark ? "1px solid rgba(61,46,34,0.6)" : "1px solid rgba(212,163,115,0.3)",
    }}
  >
    <button
      onClick={onMenuClick}
      className="w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-1.5 hover:opacity-70 transition focus:outline-none"
      style={{ background: "rgba(198,93,58,0.1)" }}
      aria-label="Open menu"
    >
      <span className="block w-4 h-0.5 rounded-full" style={{ background: "#C65D3A" }} />
      <span className="block w-4 h-0.5 rounded-full" style={{ background: "#C65D3A" }} />
      <span className="block w-3 h-0.5 rounded-full" style={{ background: "#C65D3A" }} />
    </button>

    <img src="/Traveloop.png" alt="Traveloop" className="h-9" />

    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Link
        to="/login"
        className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition"
        style={{
          background: dark ? "rgba(42,33,26,0.9)" : "rgba(243,233,220,0.9)",
          border: "1px solid rgba(198,93,58,0.25)",
        }}
        aria-label="Profile"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#C65D3A" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </Link>
    </div>
  </nav>
);

// ─── Search bar ───────────────────────────────────────────────────────────────

const SearchBar: React.FC<{ dark: boolean; query: string; onQuery: (v: string) => void }> = ({ dark, query, onQuery }) => {
  const base = {
    background: dark ? "rgba(42,33,26,0.7)" : "rgba(255,255,255,0.6)",
    border: dark ? "1px solid rgba(61,46,34,0.7)" : "1px solid rgba(212,163,115,0.35)",
    color: dark ? "#F0E6D3" : "#3B2F2F",
  };
  return (
    <div className="flex items-center gap-2 px-4 pt-3 pb-2">
      <div className="flex-1 relative">
        <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-40"
          fill="none" stroke={dark ? "#F0E6D3" : "#3B2F2F"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search activities..."
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg text-sm focus:outline-none transition"
          style={base}
        />
      </div>
      {["Group by", "Filter", "Sort by"].map((label) => (
        <button key={label}
          className="px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap hover:opacity-75"
          style={base}>
          {label}
        </button>
      ))}
    </div>
  );
};

// ─── Budget strip ─────────────────────────────────────────────────────────────

const BudgetStrip: React.FC<{ days: Day[]; dark: boolean }> = ({ days, dark }) => {
  const spent = days.flatMap((d) => d.activities).reduce((s, a) => s + a.expense, 0);
  const pct = Math.min((spent / BUDGET) * 100, 100);
  const over = spent > BUDGET;

  return (
    <div className="mx-4 mt-1 mb-4 px-4 py-3 rounded-xl flex items-center gap-4"
      style={{
        background: dark ? "rgba(42,33,26,0.5)" : "rgba(255,255,255,0.5)",
        border: dark ? "1px solid rgba(61,46,34,0.5)" : "1px solid rgba(212,163,115,0.3)",
      }}
    >
      {/* Amounts */}
      <div className="flex-shrink-0">
        <p className="text-xs" style={{ color: dark ? "rgba(240,230,211,0.45)" : "rgba(59,47,47,0.45)" }}>Spent</p>
        <p className="text-base font-bold leading-tight" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
          ₹{spent.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Bar */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: dark ? "rgba(61,46,34,0.8)" : "rgba(212,163,115,0.2)" }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: over ? "#DC5555" : "#C65D3A", transition: "width 0.6s ease" }} />
        </div>
        <div className="flex justify-between">
          <span className="text-xs" style={{ color: over ? "#DC5555" : "#C65D3A" }}>
            {over ? `₹${(spent - BUDGET).toLocaleString("en-IN")} over budget` : `₹${(BUDGET - spent).toLocaleString("en-IN")} remaining`}
          </span>
          <span className="text-xs" style={{ color: dark ? "rgba(240,230,211,0.35)" : "rgba(59,47,47,0.35)" }}>
            ₹{BUDGET.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Activity row ─────────────────────────────────────────────────────────────

const ActivityRow: React.FC<{ activity: Activity; dark: boolean; isLast: boolean }> = ({ activity, dark, isLast }) => {
  const [open, setOpen] = useState(false);
  const icon = categoryIcon[activity.category];

  const rowBg   = dark ? "rgba(42,33,26,0.45)" : "rgba(255,255,255,0.55)";
  const rowBorder = dark ? "rgba(61,46,34,0.5)" : "rgba(212,163,115,0.25)";
  const textMain  = dark ? "#F0E6D3" : "#3B2F2F";
  const textSub   = dark ? "rgba(240,230,211,0.45)" : "rgba(59,47,47,0.45)";

  return (
    <div className="flex gap-3">
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 32 }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: dark ? "rgba(198,93,58,0.15)" : "rgba(198,93,58,0.12)", color: "#C65D3A", border: "1px solid rgba(198,93,58,0.25)" }}>
          {icon}
        </div>
        {!isLast && (
          <div className="flex-1 w-px mt-1" style={{ background: dark ? "rgba(61,46,34,0.6)" : "rgba(212,163,115,0.35)", minHeight: 24 }} />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 mb-3">
        <button
          onClick={() => activity.notes && setOpen((p) => !p)}
          className="w-full text-left rounded-xl px-3.5 py-3 transition-colors duration-150 focus:outline-none"
          style={{
            background: rowBg,
            border: `1px solid ${rowBorder}`,
            cursor: activity.notes ? "pointer" : "default",
          }}
        >
          <div className="flex items-center justify-between gap-2">
            {/* Left: time + title */}
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-xs font-mono flex-shrink-0" style={{ color: "#C65D3A" }}>{activity.time}</span>
              <span className="text-sm font-medium truncate" style={{ color: textMain }}>{activity.title}</span>
            </div>

            {/* Right: expense */}
            <div className="flex-shrink-0 text-right">
              {activity.expense === 0 ? (
                <span className="text-xs font-medium" style={{ color: "#6B8F71" }}>Free</span>
              ) : (
                <span className="text-sm font-semibold" style={{ color: textMain }}>
                  ₹{activity.expense.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          {/* Category tag */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs" style={{ color: textSub }}>{activity.category}</span>
            {activity.notes && (
              <svg viewBox="0 0 24 24" className="w-3 h-3 transition-transform duration-150"
                style={{ color: textSub, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            )}
          </div>

          {/* Notes */}
          {open && activity.notes && (
            <p className="mt-2 text-xs leading-relaxed border-t pt-2"
              style={{ color: textSub, borderColor: rowBorder }}>
              {activity.notes}
            </p>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Day block ────────────────────────────────────────────────────────────────

const DayBlock: React.FC<{ day: Day; dark: boolean; query: string }> = ({ day, dark, query }) => {
  const filtered = day.activities.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );
  if (filtered.length === 0) return null;

  const dayTotal = filtered.reduce((s, a) => s + a.expense, 0);
  const textSub  = dark ? "rgba(240,230,211,0.45)" : "rgba(59,47,47,0.45)";

  return (
    <div className="mb-6">
      {/* Day header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: "#C65D3A" }}>{day.label}</span>
          <span className="text-xs" style={{ color: textSub }}>{day.date}</span>
        </div>
        <span className="text-xs font-medium" style={{ color: textSub }}>
          ₹{dayTotal.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Divider */}
      <div className="mb-3 h-px" style={{ background: dark ? "rgba(61,46,34,0.5)" : "rgba(212,163,115,0.3)" }} />

      {/* Activities */}
      {filtered.map((a, i) => (
        <ActivityRow key={a.id} activity={a} dark={dark} isLast={i === filtered.length - 1} />
      ))}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const ItineraryViewPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { dark } = useTheme();

  const allEmpty = mockItinerary.every((day) =>
    day.activities.every(
      (a) =>
        !a.title.toLowerCase().includes(query.toLowerCase()) &&
        !a.category.toLowerCase().includes(query.toLowerCase())
    )
  );

  const textMain = dark ? "#F0E6D3" : "#3B2F2F";
  const textSub  = dark ? "rgba(240,230,211,0.45)" : "rgba(59,47,47,0.45)";

  return (
    <div className="min-h-screen pb-24 transition-colors duration-300"
      style={{ background: dark ? "#1C1612" : "#FAF6F0" }}>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onMenuClick={() => setSidebarOpen(true)} dark={dark} />

      <SearchBar dark={dark} query={query} onQuery={setQuery} />

      {/* Page header */}
      <div className="px-4 pt-2 pb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Link to="/" className="text-xs hover:underline" style={{ color: textSub }}>Home</Link>
          <span className="text-xs" style={{ color: textSub }}>/</span>
          <span className="text-xs" style={{ color: textSub }}>Itinerary</span>
        </div>
        <h1 className="text-xl font-bold" style={{ color: textMain }}>
          Bali, Indonesia
        </h1>
        <p className="text-xs mt-0.5" style={{ color: textSub }}>
          {mockItinerary.length} days · {mockItinerary.flatMap((d) => d.activities).length} activities
        </p>
      </div>

      {/* Budget strip */}
      <BudgetStrip days={mockItinerary} dark={dark} />

      {/* Column labels */}
      <div className="flex items-center px-4 mb-2">
        <div style={{ width: 32 }} />
        <div className="flex-1 flex items-center justify-between px-3.5">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: textSub }}>Activity</span>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: textSub }}>Expense</span>
        </div>
      </div>

      {/* Day blocks */}
      <div className="px-4">
        {mockItinerary.map((day) => (
          <DayBlock key={day.id} day={day} dark={dark} query={query} />
        ))}

        {allEmpty && (
          <div className="flex flex-col items-center py-16 gap-2">
            <svg viewBox="0 0 24 24" className="w-8 h-8 opacity-25" fill="none"
              stroke={textMain} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <p className="text-sm" style={{ color: textSub }}>No results for "{query}"</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-5 z-50">
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:opacity-90 active:scale-95 focus:outline-none"
          style={{ background: "#C65D3A", boxShadow: "0 4px 16px rgba(198,93,58,0.35)" }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add Activity
        </button>
      </div>
    </div>
  );
};

export default ItineraryViewPage;
