import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import api from "../api/axios";

type Status = "loading" | "success" | "error";

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { dark } = useTheme();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }
    api
      .get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed. The link may have expired.");
      });
  }, [token]);

  const bg = dark
    ? "linear-gradient(135deg, #1C1612 0%, #2A211A 50%, #3D2E22 100%)"
    : "linear-gradient(135deg, #FAF6F0 0%, #E6D3B3 50%, #D4A373 100%)";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300"
      style={{ background: bg }}>
      <div className="absolute top-5 right-5 z-10"><ThemeToggle /></div>

      <div className="relative w-full max-w-md rounded-3xl px-10 py-10 z-10 text-center"
        style={{
          background: dark ? "rgba(28,22,18,0.72)" : "rgba(250,246,240,0.55)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          border: dark ? "1px solid rgba(61,46,34,0.8)" : "1px solid rgba(255,255,255,0.5)",
          boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(198,93,58,0.12)",
        }}>

        {status === "loading" && (
          <>
            <div className="w-12 h-12 rounded-full border-2 animate-spin mx-auto mb-6"
              style={{ borderColor: "#C65D3A", borderTopColor: "transparent" }} />
            <p className="text-sm" style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
              Verifying your email...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(100,180,100,0.15)" }}>
              <svg className="w-8 h-8" fill="none" stroke="#4caf50" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
              Email verified!
            </h1>
            <p className="text-sm mb-8" style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
              {message}
            </p>
            <Link to="/login"
              className="inline-block px-8 py-3 rounded-xl text-white font-semibold transition hover:opacity-85"
              style={{ background: "#C65D3A", boxShadow: "0 4px 15px rgba(198,93,58,0.35)" }}>
              Login now
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(220,85,85,0.12)" }}>
              <svg className="w-8 h-8" fill="none" stroke="#DC5555" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
              Verification failed
            </h1>
            <p className="text-sm mb-8" style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}>
              {message}
            </p>
            <Link to="/register"
              className="text-sm font-semibold hover:underline" style={{ color: "#C65D3A" }}>
              Back to register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
