import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  {
    label: "Home",
    to: "/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Explore",
    to: "/explore",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
  {
    label: "My Trips",
    to: "/trips",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    label: "Plan a Trip",
    to: "/plan",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    label: "Saved Places",
    to: "/saved",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    to: "/settings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(59,47,47,0.35)",
          backdropFilter: open ? "blur(2px)" : "none",
          WebkitBackdropFilter: open ? "blur(2px)" : "none",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Sidebar panel */}
      <aside
        className="fixed top-0 left-0 h-full z-50 flex flex-col"
        style={{
          width: "260px",
          background: "rgba(250, 246, 240, 0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(230, 211, 179, 0.7)",
          boxShadow: open ? "4px 0 32px rgba(198,93,58,0.15)" : "none",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-5"
          style={{ borderBottom: "1px solid rgba(230,211,179,0.5)" }}
        >
          <span className="text-xl font-bold tracking-tight" style={{ color: "#C65D3A" }}>
            Traveloop
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-70 transition"
            style={{ background: "rgba(198,93,58,0.1)" }}
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="#C65D3A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* User profile snippet */}
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid rgba(230,211,179,0.5)" }}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(198,93,58,0.15)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="#C65D3A" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
              className="w-5 h-5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#3B2F2F" }}>Traveller</p>
            <Link
              to="/login"
              onClick={onClose}
              className="text-xs hover:underline"
              style={{ color: "#C65D3A" }}
            >
              Sign in / Register
            </Link>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  color: active ? "#C65D3A" : "#3B2F2F",
                  background: active
                    ? "rgba(198,93,58,0.12)"
                    : "transparent",
                  borderLeft: active ? "3px solid #C65D3A" : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(212,163,115,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                <span style={{ color: active ? "#C65D3A" : "#D4A373" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-5 py-4"
          style={{ borderTop: "1px solid rgba(230,211,179,0.5)" }}
        >
          <p className="text-xs" style={{ color: "rgba(59,47,47,0.4)" }}>
            © 2026 Traveloop
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
