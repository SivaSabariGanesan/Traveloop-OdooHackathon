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
    "w-full px-4 py-3 rounded-xl border border-secondary bg-background text-text placeholder-text/35 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-card rounded-3xl shadow-lg border border-secondary/60 px-10 py-10">

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
          <div className="border-t border-secondary/50 my-1" />

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-base hover:bg-primary/90 active:scale-[0.99] transition focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
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
