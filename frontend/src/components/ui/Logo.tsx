import React from "react";

interface LogoProps {
  size?: "sm" | "lg" | "xl";
  dark?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = "lg", dark = false }) => {
  const isXl = size === "xl";
  const isLg = size === "lg";

  const fontSize = isXl ? "text-3xl" : isLg ? "text-2xl" : "text-lg";
  const spacing = isXl ? "gap-3" : isLg ? "gap-2" : "gap-1";
  const iconSize = isXl ? "w-9 h-9" : isLg ? "w-6 h-6" : "w-5 h-5";
  const padding = isXl ? "p-3" : isLg ? "p-2.5" : "p-1.5";

  return (
    <div className={`flex items-center justify-center ${spacing}`}>
      <div
        className={`rounded-xl ${padding} bg-transparent`}
        style={{
          background: dark ? "rgba(198,93,58,0.15)" : "rgba(198,93,58,0.18)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className={iconSize}
          fill="none"
          stroke="#C65D3A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6-6 6 6" />
          <path d="M12 15v-6" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </div>
      <span
        className={`${fontSize} font-bold tracking-tight select-none`}
        style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
      >
        Traveloop
      </span>
    </div>
  );
};

export default Logo;
