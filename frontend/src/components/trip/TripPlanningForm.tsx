import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

interface TripData {
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage: File | null;
}

interface TripPlanningFormProps {
  tripData: TripData;
  setTripData: React.Dispatch<React.SetStateAction<TripData>>;
  onSaveDraft: () => void;
  onCreateTrip: () => void;
}

const TripPlanningForm: React.FC<TripPlanningFormProps> = ({
  tripData,
  setTripData,
  onSaveDraft,
  onCreateTrip,
}) => {
  const { dark } = useTheme();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (field: keyof TripData, value: any) => {
    setTripData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange("coverImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    handleInputChange("coverImage", null);
    setImagePreview(null);
  };

  const calculateDuration = () => {
    if (tripData.startDate && tripData.endDate) {
      const start = new Date(tripData.startDate);
      const end = new Date(tripData.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return days > 0 ? `${days} day${days > 1 ? "s" : ""}` : "Invalid dates";
    }
    return "Not set";
  };

  const inputStyle = {
    background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
    border: dark ? "1px solid rgba(61,46,34,0.9)" : "1px solid rgba(255,255,255,0.45)",
    color: dark ? "#F0E6D3" : "#3B2F2F",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  };

  return (
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
      <div className="mb-8">
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
        >
          Create Your Trip
        </h2>
        <p
          className="text-sm mt-1"
          style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}
        >
          Fill in the details to plan your next adventure
        </p>
      </div>

      <div className="space-y-6">
        {/* Trip Name */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}
          >
            Trip Name
          </label>
          <input
            type="text"
            value={tripData.tripName}
            onChange={(e) => handleInputChange("tripName", e.target.value)}
            placeholder="e.g., Summer Adventure in Bali"
            className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
            style={inputStyle}
          />
        </div>

        {/* Destination */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}
          >
            Destination
          </label>
          <div className="relative">
            <input
              type="text"
              value={tripData.destination}
              onChange={(e) => handleInputChange("destination", e.target.value)}
              placeholder="Where are you going?"
              className="w-full pl-11 pr-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              style={inputStyle}
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: dark ? "rgba(240,230,211,0.4)" : "rgba(59,47,47,0.4)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}
            >
              Start Date
            </label>
            <input
              type="date"
              value={tripData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}
            >
              End Date
            </label>
            <input
              type="date"
              value={tripData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}
          >
            Cover Image <span style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}>(Optional)</span>
          </label>
          
          {!imagePreview ? (
            <label
              className="block w-full cursor-pointer"
            >
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 hover:opacity-80"
                style={{
                  borderColor: dark ? "rgba(61,46,34,0.6)" : "rgba(255,255,255,0.6)",
                  background: dark ? "rgba(61,46,34,0.3)" : "rgba(255,255,255,0.25)",
                }}
              >
                <svg
                  className="w-12 h-12 mx-auto mb-3"
                  style={{ color: dark ? "rgba(240,230,211,0.4)" : "rgba(59,47,47,0.4)" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
                >
                  Click to upload cover image
                </p>
                <p
                  className="text-xs"
                  style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}
                >
                  PNG, JPG up to 10MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={imagePreview}
                alt="Cover preview"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-3 right-3 p-2 rounded-full transition-all duration-200 hover:opacity-80"
                style={{
                  background: "rgba(28,22,18,0.9)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: "#FFFFFF" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Trip Summary */}
        <div
          className="rounded-xl p-5"
          style={{
            background: dark ? "rgba(61,46,34,0.3)" : "rgba(255,255,255,0.25)",
            border: dark ? "1px solid rgba(61,46,34,0.6)" : "1px solid rgba(255,255,255,0.35)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
          >
            Trip Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
                Destination:
              </span>
              <span
                className="font-medium"
                style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
              >
                {tripData.destination || "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
                Dates:
              </span>
              <span
                className="font-medium"
                style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
              >
                {tripData.startDate && tripData.endDate
                  ? `${tripData.startDate} to ${tripData.endDate}`
                  : "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
                Duration:
              </span>
              <span
                className="font-medium"
                style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
              >
                {calculateDuration()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            onClick={onSaveDraft}
            className="flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:opacity-80"
            style={{
              background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
              border: dark ? "1px solid rgba(61,46,34,0.9)" : "1px solid rgba(255,255,255,0.45)",
              color: dark ? "#F0E6D3" : "#3B2F2F",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            Save Draft
          </button>
          <button
            onClick={onCreateTrip}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90"
            style={{
              background: "#C65D3A",
              boxShadow: "0 4px 15px rgba(198,93,58,0.35)",
            }}
          >
            Create Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripPlanningForm;
