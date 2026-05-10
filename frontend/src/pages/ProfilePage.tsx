import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import api from "../api/axios";
import { tripsApi, type Trip } from "../api/trips";

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileForm>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    country: user?.country || "",
  });
  const [trips, setTrips] = useState<{ ongoing: Trip[]; upcoming: Trip[]; completed: Trip[] }>({
    ongoing: [], upcoming: [], completed: [],
  });
  const [tripsLoading, setTripsLoading] = useState(true);

  useEffect(() => {
    tripsApi.getAll()
      .then((res) => setTrips(res.data.data))
      .catch(() => {})
      .finally(() => setTripsLoading(false));
  }, []);

  const upcomingTrips = [...trips.ongoing, ...trips.upcoming];
  const completedTrips = trips.completed;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await api.patch("/users/me", {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || undefined,
        city: profile.city || undefined,
        country: profile.country || undefined,
      });
      setIsEditing(false);
    } catch (err: any) {
      setSaveError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = {
    background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
    border: dark ? "1px solid rgba(61,46,34,0.9)" : "1px solid rgba(255,255,255,0.45)",
    color: dark ? "#F0E6D3" : "#3B2F2F",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: dark ? "#1C1612" : "#FAF6F0" }}>
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#D4A373" }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "#C65D3A" }} />

      <nav className="sticky top-0 z-50" style={{
        background: dark ? "rgba(28,22,18,0.88)" : "rgba(250,246,240,0.85)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.6)",
        boxShadow: "0 2px 12px rgba(198,93,58,0.07)",
      }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:opacity-70 transition"
              style={{ background: "rgba(198,93,58,0.1)" }}>
              <svg className="w-5 h-5" fill="none" stroke="#C65D3A" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium" style={{ color: "#C65D3A" }}>Back</span>
            </button>
            <h1 className="text-xl font-semibold" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>Profile</h1>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile card */}
        <div className="rounded-3xl p-6 sm:p-8 mb-8" style={{
          background: dark ? "rgba(28,22,18,0.72)" : "rgba(250,246,240,0.55)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(255,255,255,0.5)",
          boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(198,93,58,0.12)",
        }}>
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-lg font-semibold" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>Profile Information</h2>
            {!isEditing ? (
              <div className="flex flex-col gap-2">
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-xl font-medium text-white hover:opacity-80 transition"
                  style={{ background: "#C65D3A", boxShadow: "0 4px 15px rgba(198,93,58,0.35)" }}>
                  Edit Profile
                </button>
                {user?.role === "ADMIN" && (
                  <button onClick={() => navigate("/admin")} className="px-4 py-2 rounded-xl font-medium text-white hover:opacity-80 transition"
                    style={{ background: "#3B2F2F", boxShadow: "0 4px 15px rgba(59,47,47,0.35)" }}>
                    Admin Dashboard
                  </button>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { setIsEditing(false); setSaveError(null); }}
                  className="px-4 py-2 rounded-xl font-medium hover:opacity-80 transition" style={inputStyle}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving}
                  className="px-4 py-2 rounded-xl font-medium text-white hover:opacity-80 transition"
                  style={{ background: "#C65D3A", opacity: isSaving ? 0.7 : 1 }}>
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>

          {saveError && (
            <p className="text-sm rounded-xl px-4 py-2.5 mb-4"
              style={{ background: "rgba(220,85,85,0.1)", color: "#DC5555", border: "1px solid rgba(220,85,85,0.2)" }}>
              {saveError}
            </p>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                style={{ background: "#C65D3A", boxShadow: "0 4px 16px rgba(198,93,58,0.3)" }}>
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </div>
              <p className="text-sm font-medium" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
                {profile.firstName} {profile.lastName}
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                { label: "First Name", key: "firstName" as const },
                { label: "Last Name", key: "lastName" as const },
                { label: "Email", key: "email" as const, disabled: true },
                { label: "Phone", key: "phone" as const },
                { label: "City", key: "city" as const },
                { label: "Country", key: "country" as const },
              ] as { label: string; key: keyof ProfileForm; disabled?: boolean }[]).map(({ label, key, disabled }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold mb-1.5"
                    style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>
                    {label}
                  </label>
                  {isEditing && !disabled ? (
                    <input value={profile[key]}
                      onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl focus:outline-none transition"
                      style={inputStyle} />
                  ) : (
                    <p className="px-4 py-2.5 rounded-xl text-sm" style={{ ...inputStyle, opacity: 0.85 }}>
                      {profile[key] || "—"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming & Ongoing */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
            Upcoming & Ongoing Trips
          </h2>
          {tripsLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 rounded-full border-2 animate-spin"
                style={{ borderColor: "#C65D3A", borderTopColor: "transparent" }} />
            </div>
          ) : upcomingTrips.length === 0 ? (
            <p className="text-sm" style={{ color: dark ? "rgba(240,230,211,0.4)" : "rgba(59,47,47,0.4)" }}>
              No upcoming trips.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} dark={dark}
                  onClick={() => navigate(`/itinerary?tripId=${trip.id}`)} />
              ))}
            </div>
          )}
        </div>

        {/* Completed */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
            Completed Trips
          </h2>
          {!tripsLoading && completedTrips.length === 0 ? (
            <p className="text-sm" style={{ color: dark ? "rgba(240,230,211,0.4)" : "rgba(59,47,47,0.4)" }}>
              No completed trips yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} dark={dark}
                  onClick={() => navigate(`/itinerary?tripId=${trip.id}`)} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const TripCard: React.FC<{ trip: Trip; dark: boolean; onClick: () => void }> = ({ trip, dark, onClick }) => {
  const start = new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const end = new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div onClick={onClick} className="rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
      style={{
        background: dark ? "rgba(42,33,26,0.7)" : "rgba(255,255,255,0.6)",
        border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.5)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        boxShadow: dark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(198,93,58,0.1)",
      }}>
      <div className="h-32 relative overflow-hidden"
        style={{ background: dark ? "rgba(61,46,34,0.5)" : "rgba(212,163,115,0.2)" }}>
        {trip.coverPhoto ? (
          <img src={`http://localhost:5000${trip.coverPhoto}`} alt={trip.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 opacity-25" fill="none" stroke="#C65D3A" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" />
            </svg>
          </div>
        )}
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
          style={{ background: trip.status === "COMPLETED" ? "#6b7280" : trip.status === "ONGOING" ? "#22c55e" : "#C65D3A" }}>
          {trip.status}
        </span>
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm truncate" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>{trip.name}</p>
        {trip.destination && (
          <p className="text-xs truncate mt-0.5" style={{ color: dark ? "rgba(240,230,211,0.55)" : "rgba(59,47,47,0.55)" }}>
            {trip.destination}
          </p>
        )}
        <p className="text-xs mt-1" style={{ color: dark ? "rgba(240,230,211,0.4)" : "rgba(59,47,47,0.4)" }}>
          {start} – {end}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
