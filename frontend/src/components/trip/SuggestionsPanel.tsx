import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import SuggestionCard from "./SuggestionCard";
import SmartInsightWidget from "./SmartInsightWidget";

interface SuggestionsPanelProps {
  destination: string;
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ destination }) => {
  const { dark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  // Mock suggestions data
  const suggestions = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      name: "Sunset Cruise",
      rating: 4.8,
      category: "Adventure",
      description: "Experience breathtaking sunset views on the water",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop",
      name: "Rice Terraces",
      rating: 4.9,
      category: "Nature",
      description: "Explore stunning terraced rice fields",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      name: "Beach Day",
      rating: 4.7,
      category: "Nature",
      description: "Relax on pristine white sand beaches",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=300&fit=crop",
      name: "Temple Hopping",
      rating: 4.9,
      category: "Culture",
      description: "Visit ancient temples and sacred sites",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
      name: "Hiking Trail",
      rating: 4.6,
      category: "Adventure",
      description: "Trek through lush mountain landscapes",
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      name: "Street Food Tour",
      rating: 4.8,
      category: "Food",
      description: "Taste authentic local cuisine and delicacies",
    },
  ];

  const handleAddSuggestion = (id: number) => {
    console.log("Adding suggestion:", id);
    // TODO: Implement add to itinerary functionality
  };

  return (
    <div className="space-y-6">
      {/* Main Suggestions Card */}
      <div
        className="rounded-3xl p-6 sm:p-8 transition-colors duration-300"
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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2
                className={`text-2xl font-semibold mb-1 ${
                  dark ? "text-dark-text" : "text-text"
                }`}
              >
                Suggested Places & Activities
              </h2>
              <p
                className={`text-sm ${
                  dark ? "text-dark-text/60" : "text-text/60"
                }`}
              >
                Handpicked ideas to inspire your journey
              </p>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: dark ? "rgba(198,93,58,0.2)" : "rgba(198,93,58,0.1)",
                color: "#C65D3A",
              }}
            >
              {suggestions.length} ideas
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities..."
              className="w-full pl-11 pr-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              style={{
                background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
                border: dark ? "1px solid rgba(61,46,34,0.9)" : "1px solid rgba(255,255,255,0.45)",
                color: dark ? "#F0E6D3" : "#3B2F2F",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            />
            <svg
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                dark ? "text-dark-text/40" : "text-text/40"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filter and Sort */}
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              style={{
                background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
                border: dark ? "1px solid rgba(61,46,34,0.9)" : "1px solid rgba(255,255,255,0.45)",
                color: dark ? "#F0E6D3" : "#3B2F2F",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <option value="all">All Categories</option>
              <option value="adventure">Adventure</option>
              <option value="nature">Nature</option>
              <option value="culture">Culture</option>
              <option value="food">Food</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              style={{
                background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
                border: dark ? "1px solid rgba(61,46,34,0.9)" : "1px solid rgba(255,255,255,0.45)",
                color: dark ? "#F0E6D3" : "#3B2F2F",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              {...suggestion}
              onAdd={() => handleAddSuggestion(suggestion.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {suggestions.length === 0 && (
          <div className="text-center py-12">
            <svg
              className={`w-16 h-16 mx-auto mb-4 ${
                dark ? "text-dark-text/20" : "text-text/20"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p
              className={`text-lg font-medium mb-1 ${
                dark ? "text-dark-text/60" : "text-text/60"
              }`}
            >
              No suggestions yet
            </p>
            <p
              className={`text-sm ${
                dark ? "text-dark-text/40" : "text-text/40"
              }`}
            >
              Enter a destination to see personalized recommendations
            </p>
          </div>
        )}
      </div>

      {/* Smart Insight Widget */}
      <SmartInsightWidget destination={destination} />
    </div>
  );
};

export default SuggestionsPanel;
