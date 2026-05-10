import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { geminiApi, type DestinationInsights } from "../../api/gemini";

interface SmartInsightWidgetProps {
  destination: string;
}

const SmartInsightWidget: React.FC<SmartInsightWidgetProps> = ({ destination }) => {
  const { dark } = useTheme();
  const [insights, setInsights] = useState<DestinationInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!destination.trim()) { setInsights(null); return; }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await geminiApi.getInsights(destination);
        setInsights(data);
      } catch {
        setError("Couldn't load insights. Check your Gemini API key.");
      } finally {
        setIsLoading(false);
      }
    }, 800); // debounce
    return () => clearTimeout(timer);
  }, [destination]);

  if (!destination.trim()) return null;

  const cardStyle = {
    background: dark ? "rgba(61,46,34,0.3)" : "rgba(255,255,255,0.25)",
    border: dark ? "1px solid rgba(61,46,34,0.6)" : "1px solid rgba(255,255,255,0.35)",
    backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
  };

  return (
    <div className="rounded-3xl p-6 transition-colors duration-300" style={{
      background: dark ? "rgba(28,22,18,0.72)" : "rgba(250,246,240,0.55)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(255,255,255,0.5)",
      boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(198,93,58,0.12)",
    }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #C65D3A 0%, #D4A373 100%)" }}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>Smart Insights</h3>
          <p className="text-xs" style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
            AI-powered recommendations for {destination}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10 gap-3">
          <div className="w-5 h-5 rounded-full border-2 animate-spin"
            style={{ borderColor: "#C65D3A", borderTopColor: "transparent" }} />
          <span className="text-sm" style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
            Generating insights...
          </span>
        </div>
      )}

      {error && (
        <p className="text-sm text-center py-6" style={{ color: "#DC5555" }}>{error}</p>
      )}

      {insights && !isLoading && (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {[
              { icon: "💰", label: "Budget", value: insights.estimatedBudget },
              { icon: "🌤️", label: "Weather", value: insights.weather },
              { icon: "📅", label: "Best Season", value: insights.bestSeason },
              { icon: "💱", label: "Currency", value: insights.currency },
              { icon: "🗣️", label: "Language", value: insights.language },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl" style={cardStyle}>
                <div className="text-xs mb-1" style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}>
                  {item.icon} {item.label}
                </div>
                <p className="text-sm font-semibold" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="p-4 rounded-xl" style={cardStyle}>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4" style={{ color: "#C65D3A" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-sm font-semibold" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>Travel Tips</h4>
            </div>
            <ul className="space-y-2">
              {insights.tips.map((tip, i) => (
                <li key={i} className="text-sm flex items-start gap-2"
                  style={{ color: dark ? "rgba(240,230,211,0.7)" : "rgba(59,47,47,0.7)" }}>
                  <span style={{ color: "#C65D3A" }} className="mt-0.5 flex-shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="flex items-center gap-1">
          {[0, 0.2, 0.4].map((delay) => (
            <div key={delay} className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#C65D3A", animationDelay: `${delay}s` }} />
          ))}
        </div>
        <span className="text-xs" style={{ color: dark ? "rgba(240,230,211,0.4)" : "rgba(59,47,47,0.4)" }}>
          Powered by Gemini AI
        </span>
      </div>
    </div>
  );
};

export default SmartInsightWidget;
