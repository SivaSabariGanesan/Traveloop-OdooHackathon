import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ui/ThemeToggle";
import ProfileImageUpload from "../components/ui/ProfileImageUpload";
import logoSrc from "../../public/Traveloop (1).png";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import type { RegisterFormValues, ValidationErrors } from "../utils/validation";
import { validateRegisterField, validateRegisterForm } from "../utils/validation";

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState<RegisterFormValues>({
    firstName: "", lastName: "", email: "", phone: "", city: "", country: "", password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors<RegisterFormValues>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof RegisterFormValues, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { dark } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleFieldValidation = (name: keyof RegisterFormValues, value: string) => {
    const error = validateRegisterField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    handleFieldValidation(name as keyof RegisterFormValues, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    handleFieldValidation(name as keyof RegisterFormValues, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateRegisterForm(form);
    setErrors(formErrors);
    setTouched({ firstName: true, lastName: true, email: true, phone: true, city: true, country: true, password: true });

    if (Object.values(formErrors).some(Boolean)) return;

    setIsSubmitting(true);
    setApiError(null);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        city: form.city || undefined,
        country: form.country || undefined,
      });
      navigate("/", { replace: true });
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition";

  const getInputStyle = (field: keyof RegisterFormValues) => {
    const hasError = touched[field] && !!errors[field];
    const isValid = touched[field] && !errors[field] && form[field].trim().length > 0;

    const borderColor = hasError
      ? "rgba(200, 100, 100, 0.6)"
      : isValid
      ? "rgba(100, 180, 100, 0.5)"
      : dark
      ? "rgba(61,46,34,0.9)"
      : "rgba(255,255,255,0.45)";

    const ringColor = hasError
      ? "rgba(200, 100, 100, 0.3)"
      : isValid
      ? "rgba(100, 180, 100, 0.2)"
      : "var(--primary-color)";

    return {
      background: hasError
        ? dark
          ? "rgba(100, 50, 50, 0.2)"
          : "rgba(255, 200, 200, 0.15)"
        : dark
        ? "rgba(61,46,34,0.5)"
        : "rgba(255,255,255,0.35)",
      border: `1px solid ${borderColor}`,
      color: dark ? "#F0E6D3" : "#3B2F2F",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      boxShadow: `0 0 0 2px ${ringColor}`,
    };
  };

  const errorColor = "#DC5555";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden transition-colors duration-300"
      style={{
        background: dark
          ? "linear-gradient(135deg, #1C1612 0%, #2A211A 50%, #3D2E22 100%)"
          : "linear-gradient(135deg, #FAF6F0 0%, #E6D3B3 50%, #D4A373 100%)",
      }}
    >
      {/* Blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "#C65D3A" }} />
      <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#D4A373" }} />

      {/* Theme toggle */}
      <div className="absolute top-5 right-5 z-10">
        <ThemeToggle />
      </div>

      {/* Glass card */}
      <div
        className="relative w-full max-w-lg rounded-3xl px-10 py-10 z-10"
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
        <div className="flex flex-col items-center gap-4 mb-8">
          <img
            src={logoSrc}
            alt="Traveloop Logo"
            className="h-20 w-auto object-contain bg-transparent select-none"
            style={{ mixBlendMode: "multiply", filter: dark ? "invert(1) brightness(2)" : "none" }}
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}>
              Create an account
            </h1>
            <p className="text-sm mt-1" style={{ color: dark ? "rgba(240,230,211,0.55)" : "rgba(59,47,47,0.55)" }}>
              Fill in your details to get started
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {/* Profile photo upload */}
          <div className="flex justify-center mb-1">
            <ProfileImageUpload dark={dark} onChange={(file) => setProfileImage(file)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className="text-sm font-semibold" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>
                First Name
              </label>
              <input 
                id="firstName" 
                name="firstName" 
                type="text" 
                placeholder="e.g. John"
                value={form.firstName} 
                onChange={handleChange} 
                onBlur={handleBlur}
                autoComplete="given-name"
                aria-required="true"
                aria-invalid={Boolean(touched.firstName && errors.firstName)}
                aria-describedby={touched.firstName && errors.firstName ? "firstName-error" : undefined}
                className={inputClass} 
                style={getInputStyle("firstName")} 
              />
              {touched.firstName && errors.firstName ? (
                <p id="firstName-error" className="text-xs mt-1.5" style={{ color: errorColor }}>
                  {errors.firstName}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastName" className="text-sm font-semibold" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>
                Last Name
              </label>
              <input 
                id="lastName" 
                name="lastName" 
                type="text" 
                placeholder="e.g. Doe"
                value={form.lastName} 
                onChange={handleChange} 
                onBlur={handleBlur}
                autoComplete="family-name"
                aria-required="true"
                aria-invalid={Boolean(touched.lastName && errors.lastName)}
                aria-describedby={touched.lastName && errors.lastName ? "lastName-error" : undefined}
                className={inputClass} 
                style={getInputStyle("lastName")} 
              />
              {touched.lastName && errors.lastName ? (
                <p id="lastName-error" className="text-xs mt-1.5" style={{ color: errorColor }}>
                  {errors.lastName}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>
                Email Address
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="john@example.com"
                value={form.email} 
                onChange={handleChange} 
                onBlur={handleBlur}
                autoComplete="email"
                aria-required="true"
                aria-invalid={Boolean(touched.email && errors.email)}
                aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                className={inputClass} 
                style={getInputStyle("email")} 
              />
              {touched.email && errors.email ? (
                <p id="email-error" className="text-xs mt-1.5" style={{ color: errorColor }}>
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-semibold" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>
                Phone Number
              </label>
              <input 
                id="phone" 
                name="phone" 
                type="tel" 
                placeholder="+1 234 567 8900"
                value={form.phone} 
                onChange={handleChange} 
                onBlur={handleBlur}
                autoComplete="tel"
                aria-invalid={Boolean(touched.phone && errors.phone)}
                aria-describedby={touched.phone && errors.phone ? "phone-error" : undefined}
                className={inputClass} 
                style={getInputStyle("phone")} 
              />
              {touched.phone && errors.phone ? (
                <p id="phone-error" className="text-xs mt-1.5" style={{ color: errorColor }}>
                  {errors.phone}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="city" className="text-sm font-semibold" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>
                City
              </label>
              <input 
                id="city" 
                name="city" 
                type="text" 
                placeholder="e.g. New York"
                value={form.city} 
                onChange={handleChange} 
                onBlur={handleBlur}
                autoComplete="address-level2"
                aria-invalid={Boolean(touched.city && errors.city)}
                aria-describedby={touched.city && errors.city ? "city-error" : undefined}
                className={inputClass} 
                style={getInputStyle("city")} 
              />
              {touched.city && errors.city ? (
                <p id="city-error" className="text-xs mt-1.5" style={{ color: errorColor }}>
                  {errors.city}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="country" className="text-sm font-semibold" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>
                Country
              </label>
              <input 
                id="country" 
                name="country" 
                type="text" 
                placeholder="e.g. United States"
                value={form.country} 
                onChange={handleChange} 
                onBlur={handleBlur}
                autoComplete="country-name"
                aria-invalid={Boolean(touched.country && errors.country)}
                aria-describedby={touched.country && errors.country ? "country-error" : undefined}
                className={inputClass} 
                style={getInputStyle("country")} 
              />
              {touched.country && errors.country ? (
                <p id="country-error" className="text-xs mt-1.5" style={{ color: errorColor }}>
                  {errors.country}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold" style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}>
              Password
            </label>
            <div className="relative">
              <input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Create a strong password"
                value={form.password} 
                onChange={handleChange} 
                onBlur={handleBlur}
                autoComplete="new-password" 
                aria-required="true"
                aria-invalid={Boolean(touched.password && errors.password)}
                aria-describedby={touched.password && errors.password ? "password-error" : undefined}
                className={inputClass} 
                style={getInputStyle("password")} 
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 focus:outline-none transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.5)" }}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10 10 0 0 1 6.06 6.06M14.12 14.12a3 3 0 0 1-4.24-4.24" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {touched.password && errors.password ? (
              <p id="password-error" className="text-xs mt-1.5" style={{ color: errorColor }}>
                {errors.password}
              </p>
            ) : null}
          </div>

          <div className="border-t my-1" style={{ borderColor: dark ? "rgba(61,46,34,0.8)" : "rgba(255,255,255,0.4)" }} />

          {apiError && (
            <p className="text-sm text-center rounded-xl px-4 py-2.5"
              style={{ background: "rgba(220,85,85,0.1)", color: "#DC5555", border: "1px solid rgba(220,85,85,0.2)" }}>
              {apiError}
            </p>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-base transition focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
            style={{ 
              background: "#C65D3A", 
              boxShadow: "0 4px 15px rgba(198,93,58,0.35)",
              opacity: isSubmitting ? 0.8 : 1,
            }}>
            {isSubmitting ? "Creating account..." : "Register User"}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.55)" }}>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: "#C65D3A" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
