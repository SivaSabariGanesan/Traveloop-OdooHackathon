import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import TripPlanningForm from "../components/trip/TripPlanningForm";
import { tripsApi } from "../api/trips";

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
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleBack = () => navigate(-1);

  const handleSaveDraft = () => {
    // Draft = create trip and stay on dashboard
    handleCreateTrip(true);
  };

  const handleCreateTrip = async (isDraft = false) => {
    if (!tripData.tripName || !tripData.startDate || !tripData.endDate) {
      setCreateError("Trip name, start date and end date are required.");
      return;
    }
    setCreateError(null);
    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", tripData.tripName);
      formData.append("startDate", tripData.startDate);
      formData.append("endDate", tripData.endDate);
      if (tripData.destination) formData.append("destination", tripData.destination);
      if (tripData.coverImage) formData.append("coverPhoto", tripData.coverImage);

      const res = await tripsApi.create(formData);
      const trip = res.data.data.trip;

      if (isDraft) {
        navigate("/dashboard");
      } else {
        navigate(`/itinerary?tripId=${trip.id}`);
      }
    } catch (err: any) {
      setCreateError(err.response?.data?.message || "Failed to create trip.");
    } finally {
      setIsCreating(false);
    }
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
      <main className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TripPlanningForm
          tripData={tripData}
          setTripData={setTripData}
          onSaveDraft={handleSaveDraft}
          onCreateTrip={() => handleCreateTrip(false)}
          isCreating={isCreating}
          error={createError}
        />
      </main>
    </div>
  );
};

export default PlanTripPage;
