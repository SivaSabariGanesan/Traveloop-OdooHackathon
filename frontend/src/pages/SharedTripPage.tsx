import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import { tripsApi, type Trip } from "../api/trips";
import { type Stop } from "../api/itinerary";

interface PublicTrip extends Trip {
  stops: Stop[];
  user: { firstName: string; lastName: string };
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const getDuration = (start: string, end: string) => {
  const days = Math.max(1, Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
  ));
  return `${days} day${days !== 1 ? "s" : ""}`;
};

const SharedTripPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [trip, setTrip] = useState<PublicTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyTripDone, setCopyTripDone] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setIsLoading(false); return; }
    tripsApi.getPublic(id)
      .then((res) => setTrip(res.data.data.trip as PublicTrip))
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  const shareUrl = window.location.href;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyTrip = () => {
    // Store trip data in sessionStorage so PlanTripPage can pre-fill it
    if (!trip) return;
    sessionStorage.setItem("copyTrip", JSON.stringify({
      name: `Copy of ${trip.name}`,
      destination: trip.destination,
      budget: trip.budget,
      description: trip.description,
      startDate: trip.startDate,
      endDate: trip.endDate,
    }));
    setCopyTripDone(true);
    setTimeout(() => navigate("/plan"), 800);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out this trip: ${trip?.name} 🌍`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Check out this trip: ${trip?.name} 🌍\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const cardStyle = {
    background: dark ? "rgba(42,33,26,0.7)" : "rgba(255,255,255,0.6)",
    border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.5)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: dark ? "#1C1612" : "#FAF6F0" }}>
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#D4A373" }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "#C65D3A" }} />

      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{
        background: dark ? "rgba(28,22,18,0.88)" : "rgba(250,246,240,0.85)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.6)",
        boxShadow: "0 2px 12px rgba(198,93,58,0.07)",
      }}>
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate("/")} className="flex items-center">
              <img src="/Traveloop.png" alt="Traveloop" className="h-9" />
            </button>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="flex justify-center py-32">
            <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "#C65D3A", borderTopColor: "transparent" }} />
          </div>
        ) : notFound ? (
          <div className="text-center py-32">
            <p className="text-2xl font-bold mb-2" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>Trip not found</p>
            <p className="text-sm mb-6" style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}>
              This link may be invalid or the trip was removed.
            </p>
            <button onClick={() => navigate("/")} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "#C65D3A" }}>
              Go Home
            </button>
          </div>
        ) : trip ? (
          <div className="space-y-6">

            {/* Hero */}
            <div className="rounded-3xl overflow-hidden" style={cardStyle}>
              <div className="relative h-56 sm:h-72">
                <img
                  src={trip.coverPhoto ? `http://localhost:5000${trip.coverPhoto}` : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80"}
                  alt={trip.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(28,22,18,0.75) 0%, transparent 55%)" }} />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-xs font-medium mb-1" style={{ color: "rgba(240,230,211,0.7)" }}>
                    Shared by {trip.user.firstName} {trip.user.lastName}
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{trip.name}</h1>
                  {trip.destination && (
                    <p className="text-sm mt-1" style={{ color: "rgba(240,230,211,0.85)" }}>
                      📍 {trip.destination}
                    </p>
                  )}
                </div>
              </div>

              {/* Meta strip */}
              <div className="px-6 py-4 flex flex-wrap gap-4 items-center justify-between"
                style={{ borderTop: dark ? "1px solid rgba(61,46,34,0.6)" : "1px solid rgba(230,211,179,0.4)" }}>
                <div className="flex flex-wrap gap-4 text-sm" style={{ color: dark ? "rgba(240,230,211,0.7)" : "rgba(59,47,47,0.7)" }}>
                  <span>🗓 {formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
                  <span>⏱ {getDuration(trip.startDate, trip.endDate)}</span>
                  {trip.budget && <span>💰 {trip.budget.toLocaleString()}</span>}
                  <span>📍 {trip.stops.length} stop{trip.stops.length !== 1 ? "s" : ""}</span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition hover:opacity-80"
                    style={{ background: dark ? "rgba(61,46,34,0.6)" : "rgba(255,255,255,0.6)", color: dark ? "#F0E6D3" : "#3B2F2F", border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(230,211,179,0.5)" }}>
                    {copied ? (
                      <><svg className="w-3.5 h-3.5" fill="none" stroke="#4CAF50" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Copied!</>
                    ) : (
                      <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy Link</>
                    )}
                  </button>
                  <button onClick={shareOnTwitter}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition hover:opacity-80"
                    style={{ background: "#1DA1F2", color: "white" }}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    Share
                  </button>
                  <button onClick={shareOnWhatsApp}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition hover:opacity-80"
                    style={{ background: "#25D366", color: "white" }}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Share
                  </button>
                  <button onClick={handleCopyTrip}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition hover:opacity-80"
                    style={{ background: "#C65D3A", color: "white", boxShadow: "0 2px 8px rgba(198,93,58,0.35)" }}>
                    {copyTripDone ? (
                      <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Redirecting...</>
                    ) : (
                      <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg> Copy Trip</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            {trip.description && (
              <div className="rounded-2xl px-6 py-4" style={cardStyle}>
                <p className="text-sm leading-relaxed" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>
                  {trip.description}
                </p>
              </div>
            )}

            {/* Itinerary */}
            {trip.stops.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
                  Itinerary
                </h2>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-5 top-6 bottom-6 w-px" style={{ background: dark ? "rgba(198,93,58,0.25)" : "rgba(198,93,58,0.2)" }} />

                  <div className="space-y-4">
                    {trip.stops.map((stop, idx) => (
                      <div key={stop.id} className="flex gap-4">
                        {/* Dot */}
                        <div className="flex-shrink-0 w-10 flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full mt-5 z-10 flex items-center justify-center"
                            style={{ background: "#C65D3A", boxShadow: "0 0 0 3px " + (dark ? "#1C1612" : "#FAF6F0") }}>
                            <span className="text-white" style={{ fontSize: "8px", fontWeight: 700 }}>{idx + 1}</span>
                          </div>
                        </div>

                        {/* Card */}
                        <div className="flex-1 rounded-2xl p-5 mb-1" style={cardStyle}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-base" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
                                {stop.city}{stop.country ? `, ${stop.country}` : ""}
                              </h3>
                              <p className="text-xs mt-0.5" style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}>
                                {formatDate(stop.arrivalDate)} – {formatDate(stop.departureDate)}
                              </p>
                            </div>
                          </div>

                          {stop.notes && (
                            <p className="text-xs mb-3 leading-relaxed" style={{ color: dark ? "rgba(240,230,211,0.65)" : "rgba(59,47,47,0.65)" }}>
                              {stop.notes}
                            </p>
                          )}

                          {stop.activities.length > 0 && (
                            <div className="space-y-2">
                              {stop.activities.map((act) => (
                                <div key={act.id} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
                                  style={{ background: dark ? "rgba(28,22,18,0.5)" : "rgba(250,246,240,0.7)", border: dark ? "1px solid rgba(61,46,34,0.4)" : "1px solid rgba(230,211,179,0.4)" }}>
                                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#C65D3A" }} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>{act.name}</p>
                                    {act.description && (
                                      <p className="text-xs mt-0.5" style={{ color: dark ? "rgba(240,230,211,0.55)" : "rgba(59,47,47,0.55)" }}>{act.description}</p>
                                    )}
                                    <div className="flex flex-wrap gap-3 mt-1">
                                      {act.location && (
                                        <span className="text-xs" style={{ color: dark ? "rgba(240,230,211,0.45)" : "rgba(59,47,47,0.45)" }}>
                                          📍 {act.location}
                                        </span>
                                      )}
                                      {act.cost != null && (
                                        <span className="text-xs" style={{ color: dark ? "rgba(240,230,211,0.45)" : "rgba(59,47,47,0.45)" }}>
                                          💰 {act.cost.toLocaleString()}
                                        </span>
                                      )}
                                      {act.startTime && (
                                        <span className="text-xs" style={{ color: dark ? "rgba(240,230,211,0.45)" : "rgba(59,47,47,0.45)" }}>
                                          🕐 {new Date(act.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-2xl p-6 text-center" style={cardStyle}>
              <p className="text-sm font-medium mb-3" style={{ color: dark ? "rgba(240,230,211,0.7)" : "rgba(59,47,47,0.7)" }}>
                Inspired? Plan your own trip on Traveloop.
              </p>
              <button onClick={() => navigate("/plan")}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-80"
                style={{ background: "#C65D3A", boxShadow: "0 2px 8px rgba(198,93,58,0.35)" }}>
                Start Planning
              </button>
            </div>

          </div>
        ) : null}
      </main>
    </div>
  );
};

export default SharedTripPage;
