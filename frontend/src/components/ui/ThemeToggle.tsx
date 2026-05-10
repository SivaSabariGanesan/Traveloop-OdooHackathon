import React from "react";
import { useTheme } from "../../context/ThemeContext";

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
    className="w-3 h-3">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
    className="w-3 h-3">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ThemeToggle: React.FC = () => {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
      style={{
        width: "48px",
        height: "26px",
        background: dark ? "#C65D3A" : "rgba(198,93,58,0.18)",
        border: "1.5px solid rgba(198,93,58,0.45)",
      }}
    >
      {/* Sun icon — visible in light mode */}
      <span
        className="absolute flex items-center justify-center transition-opacity duration-200"
        style={{
          left: "6px",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: dark ? 0 : 1,
          color: "#C65D3A",
        }}
      >
        <SunIcon />
      </span>

      {/* Moon icon — visible in dark mode */}
      <span
        className="absolute flex items-center justify-center transition-opacity duration-200"
        style={{
          right: "6px",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: dark ? 1 : 0,
          color: "#FAF6F0",
        }}
      >
        <MoonIcon />
      </span>

      {/* Sliding thumb */}
      <span
        className="absolute rounded-full shadow-md transition-all duration-300"
        style={{
          width: "20px",
          height: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          left: dark ? "24px" : "2px",
          background: dark ? "#FAF6F0" : "#C65D3A",
        }}
      />
    </button>
  );
};

export default ThemeToggle;
