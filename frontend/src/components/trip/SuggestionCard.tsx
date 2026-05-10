import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

interface SuggestionCardProps {
  image: string;
  name: string;
  rating: number;
  category: string;
  description: string;
  onAdd: () => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  image,
  name,
  rating,
  category,
  description,
  onAdd,
}) => {
  const { dark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        border: isHovered
          ? "1px solid rgba(198,93,58,0.5)"
          : dark
          ? "1px solid rgba(61,46,34,0.6)"
          : "1px solid rgba(255,255,255,0.35)",
        boxShadow: isHovered
          ? "0 6px 20px rgba(198,93,58,0.2)"
          : "0 4px 16px rgba(28,22,18,0.15)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        {!imageError ? (
          <img
            src={image}
            alt={name}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${
              dark ? "bg-dark-border" : "bg-gray-200"
            }`}
          >
            <svg
              className={`w-12 h-12 ${dark ? "text-dark-text/20" : "text-text/20"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: dark ? "rgba(28,22,18,0.9)" : "rgba(250,246,240,0.9)",
              color: dark ? "#F0E6D3" : "#3B2F2F",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {category}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full"
            style={{
              background: dark ? "rgba(28,22,18,0.9)" : "rgba(250,246,240,0.9)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <svg
              className="w-4 h-4 fill-current"
              style={{ color: "#D4A373" }}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span
              className="text-xs font-semibold"
              style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
            >
              {rating}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="p-4"
        style={{
          background: dark ? "rgba(28,22,18,0.6)" : "rgba(250,246,240,0.4)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <h3
          className="text-base font-semibold mb-1"
          style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
        >
          {name}
        </h3>
        <p
          className="text-sm mb-3 line-clamp-2"
          style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}
        >
          {description}
        </p>

        {/* Add Button */}
        <button
          onClick={onAdd}
          className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-90"
          style={{
            background: "#C65D3A",
            color: "#FFFFFF",
            boxShadow: "0 2px 8px rgba(198,93,58,0.25)",
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add to Trip
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;
