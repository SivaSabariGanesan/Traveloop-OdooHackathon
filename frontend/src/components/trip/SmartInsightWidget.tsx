import React from "react";
import { useTheme } from "../../context/ThemeContext";

interface SmartInsightWidgetProps {
  destination: string;
}

const SmartInsightWidget: React.FC<SmartInsightWidgetProps> = ({ destination }) => {
  const { dark } = useTheme();

  // Mock data - would be fetched from API based on destination
  const insights = {
    estimatedBudget: "$1,200 - $2,500",
    weather: "Sunny, 28°C",
    bestSeason: "April - October",
    tips: [
      "Book accommodations 2-3 months in advance",
      "Local currency is preferred for small purchases",
      "Respect local customs and dress modestly at temples",
    ],
  };

  const insightItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      label: "Estimated Budget",
      value: insights.estimatedBudget,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
      ),
      label: "Weather Forecast",
      value: insights.weather,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      label: "Best Season",
      value: insights.bestSeason,
    },
  ];

  if (!destination) {
    return null;
  }

  return (
    <div
      className="rounded-3xl p-6 transition-colors duration-300"
      style={{
        background: dark ? "rgba(28,22,18,0.72)" : "rgba(250,246,240,0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(255,255,255,0.5)",
        boxShadow: dark
          ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 8px 32px rgba(198,93,58,0.12), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      {/* Header with AI Badge */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: "linear-gradient(135deg, #C65D3A 0%, #D4A373 100%)" }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <div>
          <h3
            className="text-lg font-semibold"
            style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
          >
            Smart Insights
          </h3>
          <p
            className="text-xs"
            style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}
          >
            AI-powered recommendations for {destination}
          </p>
        </div>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {insightItems.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl"
            style={{
              background: dark ? "rgba(61,46,34,0.3)" : "rgba(255,255,255,0.25)",
              border: dark ? "1px solid rgba(61,46,34,0.6)" : "1px solid rgba(255,255,255,0.35)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <div
              className="flex items-center gap-2 mb-2"
              style={{ color: "#C65D3A" }}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </div>
            <p
              className="text-sm font-semibold"
              style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Travel Tips */}
      <div
        className="p-4 rounded-xl"
        style={{
          background: dark ? "rgba(61,46,34,0.3)" : "rgba(255,255,255,0.25)",
          border: dark ? "1px solid rgba(61,46,34,0.6)" : "1px solid rgba(255,255,255,0.35)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="w-5 h-5"
            style={{ color: "#C65D3A" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h4
            className="text-sm font-semibold"
            style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
          >
            Travel Tips
          </h4>
        </div>
        <ul className="space-y-2">
          {insights.tips.map((tip, index) => (
            <li
              key={index}
              className="text-sm flex items-start gap-2"
              style={{ color: dark ? "rgba(240,230,211,0.7)" : "rgba(59,47,47,0.7)" }}
            >
              <span style={{ color: "#C65D3A" }} className="mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Attribution */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#C65D3A" }} />
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#C65D3A", animationDelay: "0.2s" }}
          />
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#C65D3A", animationDelay: "0.4s" }}
          />
        </div>
        <span
          className="text-xs"
          style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}
        >
          Powered by AI
        </span>
      </div>
    </div>
  );
};

export default SmartInsightWidget;
