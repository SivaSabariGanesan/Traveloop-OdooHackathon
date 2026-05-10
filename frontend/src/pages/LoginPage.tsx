import React, { useState } from "react";
import { Link } from "react-router-dom";
import AvatarUpload from "../components/ui/AvatarUpload";

const LoginPage: React.FC = () => {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", form);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-white/40 bg-white/30 text-text placeholder-text/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition text-sm backdrop-blur-sm";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FAF6F0 0%, #E6D3B3 50%, #D4A373 100%)" }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ background: "#eba087ff" }} />
      <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "#e8c199ff" }} />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{ background: "#E6D3B3" }} />

      {/* Glass card */}
      <div className="relative w-full max-w-lg rounded-3xl px-10 py-10 z-10"
        style={{
          background: "rgba(250, 246, 240, 0.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 8px 32px rgba(198, 93, 58, 0.12), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <AvatarUpload size="lg" />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text tracking-tight">Welcome back</h1>
            <p className="text-text/55 text-sm mt-1">Sign in to your account</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-semibold text-text/80">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-text/80">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className={inputClass}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-white/40 my-1" />

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-base hover:bg-primary/90 active:scale-[0.99] transition focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
            style={{ boxShadow: "0 4px 15px rgba(198, 93, 58, 0.35)" }}
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-text/55 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
