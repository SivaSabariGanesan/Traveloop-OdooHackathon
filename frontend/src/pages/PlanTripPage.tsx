import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import TripPlanningForm from "../components/trip/TripPlanningForm";
import SuggestionsPanel from "../components/trip/SuggestionsPanel";

const PlanTripPage: React.FC = () => {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [tripData, setTripData] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
    coverImage: null as File | null,
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", tripData);
    // TODO: Implement save draft functionality
  };

  const handleCreateTrip = () => {
    console.log("Creating trip:", tripData);
    // Navigate to itinerary builder
    navigate("/itinerary");
  };

  return (
    <div className={`min-h-screen ${dark ? "dark" : ""} transition-colors duration-300`}
      style={{ background: dark ? "#1C1612" : "#FAF6F0" }}>
      {/* Background blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#D4A373" }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "#C65D3A" }} />

      {/* Top Navigation */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: dark ? "rgba(28,22,18,0.88)" : "rgba(250,246,240,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.6)",
          boxShadow: "0 2px 12px rgba(198,93,58,0.07)",
        }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:opacity-70"
              style={{ background: "rgba(198,93,58,0.1)" }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="#C65D3A"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-medium" style={{ color: "#C65D3A" }}>Back</span>
            </button>

            {/* Page Title */}
            <h1 className="text-xl font-semibold" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
              Plan a Trip
            </h1>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Section - Trip Planning Form (42%) */}
          <div className="lg:col-span-5">
            <TripPlanningForm
              tripData={tripData}
              setTripData={setTripData}
              onSaveDraft={handleSaveDraft}
              onCreateTrip={handleCreateTrip}
            />
          </div>

          {/* Right Section - Suggestions Panel (58%) */}
          <div className="lg:col-span-7">
            <SuggestionsPanel destination={tripData.destination} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlanTripPage;
