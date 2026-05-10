import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import SuggestionCard from "./SuggestionCard";
import SmartInsightWidget from "./SmartInsightWidget";
import { geminiApi, type ActivitySuggestion } from "../../api/gemini";
import { itineraryApi } from "../../api/itinerary";

interface SuggestionsPanelProps {
  destination: string;
  tripId?: string;
  stopId?: string;
  onActivityAdded?: () => void;
}

const CATEGORIES = ["All", "Adventure", "Nature", "Culture", "Food", "Beach", "History", "Shopping", "Nightlife", "Wellness", "Sports", "Sightseeing", "Entertainment"];

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ destination, tripId, stopId, onActivityAdded }) => {
  const { dark } = useTheme();
  const [suggestions, setSuggestions] = useState<ActivitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [addingId, setAddingId] = useState<number | null>(null);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!destination.trim()) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await geminiApi.getSuggestions(destination);
        setSuggestions(data);
      } catch (err: any) {
        console.error('Suggestions error:', err);
        setError(err.message || "Couldn't load suggestions.");
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [destination]);

  const filtered = suggestions
    .filter((s) => {
      const matchesSearch = !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "All" || s.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
      return 0;
    });

  const handleAdd = async (suggestion: ActivitySuggestion, index: number) => {
    if (!tripId || !stopId) return;
    setAddingId(index);
    try {
      await itineraryApi.createActivity(tripId, stopId, {
        name: suggestion.name,
        description: suggestion.description,
        location: destination,
        order: 0,
      });
      setAddedIds((prev) => new Set(prev).add(index));
      onActivityAdded?.();
    } catch (err) {
      console.error('Failed to add activity:', err);
    } finally {
      setAddingId(null);
    }
  };

  const inputStyle = {
    background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
    border: dark ? "1px solid rgba(61,46,34,0.9)" : "1px solid rgba(255,255,255,0.45)",
    color: dark ? "#F0E6D3" : "#3B2F2F",
    backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl p-6 sm:p-8 transition-colors duration-300" style={{
        background: dark ? "rgba(28,22,18,0.72)" : "rgba(250,246,240,0.55)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(255,255,255,0.5)",
        boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(198,93,58,0.12)",
      }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold mb-1" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
              Suggested Activities
            </h2>
            <p className="text-sm" style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
              {destination ? `AI-curated ideas for ${destination}` : "Enter a destination to get suggestions"}
            </p>
          </div>
          {suggestions.length > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(198,93,58,0.12)", color: "#C65D3A" }}>
              {filtered.length} ideas
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities..."
              className="w-full pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              style={inputStyle} />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40"
              fill="none" stroke={dark ? "#F0E6D3" : "#3B2F2F"} viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex gap-3">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl focus:outline-none transition" style={inputStyle}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl focus:outline-none transition" style={inputStyle}>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="alphabetical">A–Z</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: "#C65D3A", borderTopColor: "transparent" }} />
            <p className="text-sm" style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}>
              Generating suggestions for {destination}...
            </p>
          </div>
        ) : error ? (
          <p className="text-center py-10 text-sm" style={{ color: "#DC5555" }}>{error}</p>
        ) : !destination.trim() ? (
          <div className="text-center py-12">
            <svg className="w-14 h-14 mx-auto mb-4 opacity-20" fill="none" stroke="#C65D3A" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm" style={{ color: dark ? "rgba(240,230,211,0.4)" : "rgba(59,47,47,0.4)" }}>
              Enter a destination to see AI-powered suggestions
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-sm" style={{ color: dark ? "rgba(240,230,211,0.4)" : "rgba(59,47,47,0.4)" }}>
            No results for "{searchQuery}" in {filterCategory}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((s, i) => (
              <SuggestionCard key={i} {...s}
                isAdded={addedIds.has(i)}
                isAdding={addingId === i}
                canAdd={!!tripId && !!stopId}
                onAdd={() => handleAdd(s, i)} />
            ))}
          </div>
        )}
      </div>

      <SmartInsightWidget destination={destination} />
    </div>
  );
};

export default SuggestionsPanel;
