import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ui/ThemeToggle";

interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  profilePhoto: string | null;
}

interface Trip {
  id: string;
  destination: string;
  country: string;
  date: string;
  duration: string;
  img: string;
  status: "preplanned" | "previous";
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    profilePhoto: null,
  });

  // Mock trip data
  const [trips] = useState<Trip[]>([
    {
      id: "1",
      destination: "Paris",
      country: "France",
      date: "Jun 2026",
      duration: "7 days",
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80",
      status: "preplanned",
    },
    {
      id: "2",
      destination: "Bali",
      country: "Indonesia",
      date: "Aug 2026",
      duration: "10 days",
      img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80",
      status: "preplanned",
    },
    {
      id: "3",
      destination: "Santorini",
      country: "Greece",
      date: "Sep 2026",
      duration: "5 days",
      img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80",
      status: "preplanned",
    },
    {
      id: "4",
      destination: "Tokyo",
      country: "Japan",
      date: "Nov 2025",
      duration: "10 days",
      img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80",
      status: "previous",
    },
    {
      id: "5",
      destination: "New York",
      country: "USA",
      date: "Aug 2025",
      duration: "5 days",
      img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80",
      status: "previous",
    },
    {
      id: "6",
      destination: "Dubai",
      country: "UAE",
      date: "Mar 2025",
      duration: "6 days",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80",
      status: "previous",
    },
  ]);

  const preplannedTrips = trips.filter((t) => t.status === "preplanned");
  const previousTrips = trips.filter((t) => t.status === "previous");

  const handleBack = () => {
    navigate(-1);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profilePhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Save to backend
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
      className="min-h-screen transition-colors duration-300"
      style={{ background: dark ? "#1C1612" : "#FAF6F0" }}
    >
      {/* Background blobs */}
      <div
        className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#D4A373" }}
      />
      <div
        className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "#C65D3A" }}
      />

      {/* Top Navigation */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: dark ? "rgba(28,22,18,0.88)" : "rgba(250,246,240,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: dark
            ? "1px solid rgba(61,46,34,0.8)"
            : "1px solid rgba(230,211,179,0.6)",
          boxShadow: "0 2px 12px rgba(198,93,58,0.07)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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
              <span className="font-medium" style={{ color: "#C65D3A" }}>
                Back
              </span>
            </button>

            {/* Page Title */}
            <h1
              className="text-xl font-semibold"
              style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
            >
              Profile
            </h1>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Information Card */}
        <div
          className="rounded-3xl p-6 sm:p-8 mb-8 transition-colors duration-300"
          style={{
            background: dark ? "rgba(28,22,18,0.72)" : "rgba(250,246,240,0.55)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: dark
              ? "1px solid rgba(61,46,34,0.8)"
              : "1px solid rgba(255,255,255,0.5)",
            boxShadow: dark
              ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
              : "0 8px 32px rgba(198,93,58,0.12), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <div className="flex items-start justify-between mb-6">
            <h2
              className="text-lg font-semibold"
              style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
            >
              Profile Information
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:opacity-80"
                style={{
                  background: "#C65D3A",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(198,93,58,0.35)",
                }}
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:opacity-80"
                  style={inputStyle}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:opacity-80"
                  style={{
                    background: "#C65D3A",
                    color: "white",
                    boxShadow: "0 4px 15px rgba(198,93,58,0.35)",
                  }}
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Photo */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="relative w-32 h-32 rounded-full overflow-hidden"
                style={{
                  border: dark
                    ? "3px solid rgba(61,46,34,0.8)"
                    : "3px solid rgba(255,255,255,0.6)",
                  boxShadow: "0 4px 16px rgba(198,93,58,0.2)",
                }}
              >
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: dark ? "rgba(42,33,26,0.9)" : "rgba(243,233,220,0.8)",
                    }}
                  >
                    <svg
                      className="w-16 h-16"
                      fill="none"
                      stroke="#C65D3A"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {isEditing && (
                <label
                  className="px-4 py-2 rounded-xl font-medium text-sm cursor-pointer transition-all duration-200 hover:opacity-80"
                  style={{
                    background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
                    border: dark
                      ? "1px solid rgba(61,46,34,0.9)"
                      : "1px solid rgba(255,255,255,0.45)",
                    color: dark ? "#F0E6D3" : "#3B2F2F",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 space-y-4">
              {/* Full Name */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{
                    color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)",
                  }}
                >
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    style={inputStyle}
                  />
                ) : (
                  <p
                    className="px-4 py-3 rounded-xl"
                    style={{
                      ...inputStyle,
                      opacity: 0.9,
                    }}
                  >
                    {profile.fullName}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{
                    color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)",
                  }}
                >
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    style={inputStyle}
                  />
                ) : (
                  <p
                    className="px-4 py-3 rounded-xl"
                    style={{
                      ...inputStyle,
                      opacity: 0.9,
                    }}
                  >
                    @{profile.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{
                    color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)",
                  }}
                >
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    style={inputStyle}
                  />
                ) : (
                  <p
                    className="px-4 py-3 rounded-xl"
                    style={{
                      ...inputStyle,
                      opacity: 0.9,
                    }}
                  >
                    {profile.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preplanned Trips */}
        <div className="mb-8">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
          >
            Preplanned Trips
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {preplannedTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} dark={dark} />
            ))}
          </div>
        </div>

        {/* Previous Trips */}
        <div>
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
          >
            Previous Trips
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previousTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} dark={dark} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// Trip Card Component
const TripCard: React.FC<{ trip: Trip; dark: boolean }> = ({ trip, dark }) => {
  return (
    <div
      className="rounded-2xl overflow-hidden relative group cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
      style={{
        height: "240px",
        background: dark ? "rgba(42,33,26,0.7)" : "rgba(255,255,255,0.6)",
        border: dark
          ? "1px solid rgba(61,46,34,0.8)"
          : "1px solid rgba(230,211,179,0.5)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: dark
          ? "0 4px 12px rgba(0,0,0,0.3)"
          : "0 4px 12px rgba(198,93,58,0.12)",
      }}
    >
      {/* Trip Image */}
      <div className="relative h-2/3 overflow-hidden">
        <img
          src={trip.img}
          alt={trip.destination}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(28,22,18,0.6) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Trip Info */}
      <div className="p-4">
        <h3
          className="font-semibold text-base mb-1"
          style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
        >
          {trip.destination}
        </h3>
        <p
          className="text-sm mb-2"
          style={{ color: dark ? "rgba(240,230,211,0.7)" : "rgba(59,47,47,0.7)" }}
        >
          {trip.country}
        </p>
        <div className="flex items-center justify-between">
          <p
            className="text-xs"
            style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}
          >
            {trip.date} · {trip.duration}
          </p>
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
            style={{
              background: "#C65D3A",
              color: "white",
            }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
