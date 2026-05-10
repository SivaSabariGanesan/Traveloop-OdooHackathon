import React, { useState } from "react";
import { Link } from "react-router-dom";
import AvatarUpload from "../components/ui/AvatarUpload";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register:", form);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-card rounded-3xl shadow-lg border border-secondary/60 px-10 py-10">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <AvatarUpload size="lg" />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text tracking-tight">Create an account</h1>
            <p className="text-text/55 text-sm mt-1">Fill in your details to get started</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className="text-sm font-semibold text-text/80">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="e.g. John"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                required
                className="w-full px-4 py-3 rounded-xl border border-secondary bg-background text-text placeholder-text/35 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastName" className="text-sm font-semibold text-text/80">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="e.g. Doe"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                required
                className="w-full px-4 py-3 rounded-xl border border-secondary bg-background text-text placeholder-text/35 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-text/80">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-secondary bg-background text-text placeholder-text/35 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-semibold text-text/80">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                className="w-full px-4 py-3 rounded-xl border border-secondary bg-background text-text placeholder-text/35 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="city" className="text-sm font-semibold text-text/80">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="e.g. New York"
                value={form.city}
                onChange={handleChange}
                autoComplete="address-level2"
                className="w-full px-4 py-3 rounded-xl border border-secondary bg-background text-text placeholder-text/35 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="country" className="text-sm font-semibold text-text/80">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                placeholder="e.g. United States"
                value={form.country}
                onChange={handleChange}
                autoComplete="country-name"
                className="w-full px-4 py-3 rounded-xl border border-secondary bg-background text-text placeholder-text/35 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-sm"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-secondary/50 my-1" />

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-base hover:bg-primary/90 active:scale-[0.99] transition focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
          >
            Register User
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-text/55 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
