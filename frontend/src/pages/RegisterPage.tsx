import React, { useState } from "react";
import { Link } from "react-router-dom";
import AvatarUpload from "../components/ui/AvatarUpload";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

interface RegisterForm {
  firstName: string; lastName: string;
  email: string; phone: string;
  city: string; country: string;
}

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState<RegisterForm>({
    firstName: "", lastName: "", email: "", phone: "", city: "", country: "",
  });
  const { dark } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register:", form);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition";

  const inputStyle = {
    background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
    border: dark ? "1px solid rgba(61,46,34,0.9)" : "1px solid rgba(255,255,255,0.45)",
    color: dark ? "#F0E6D3" : "#3B2F2F",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  };

  const labelStyle = { color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" };

  const fields: { id: keyof RegisterForm; label: string; type: string; placeholder: string; autoComplete: string }[] = [
    { id: "firstName",  label: "First Name",    type: "text",  placeholder: "e.g. John",           autoComplete: "given-name" },
    { id: "lastName",   label: "Last Name",     type: "text",  placeholder: "e.g. Doe",            autoComplete: "family-name" },
    { id: "email",      label: "Email Address", type: "email", placeholder: "john@example.com",    autoComplete: "email" },
    { id: "phone",      label: "Phone Number",  type: "tel",   placeholder: "+1 234 567 8900",     autoComplete: "tel" },
    { id: "city",       label: "City",          type: "text",  placeholder: "e.g. New York",       autoComplete: "address-level2" },
    { id: "country",    label: "Country",       type: "text",  placeholder: "e.g. United States",  autoComplete: "country-name" },
  ];

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
        <div className="flex flex-col items-center gap-3 mb-8">
          <AvatarUpload size="lg" />
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            {fields.slice(0, 2).map((f) => (
              <div key={f.id} className="flex flex-col gap-1.5">
                <label htmlFor={f.id} className="text-sm font-semibold" style={labelStyle}>{f.label}</label>
                <input id={f.id} name={f.id} type={f.type} placeholder={f.placeholder}
                  value={form[f.id]} onChange={handleChange} autoComplete={f.autoComplete}
                  required={f.id === "firstName" || f.id === "lastName" || f.id === "email"}
                  className={inputClass} style={inputStyle} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {fields.slice(2, 4).map((f) => (
              <div key={f.id} className="flex flex-col gap-1.5">
                <label htmlFor={f.id} className="text-sm font-semibold" style={labelStyle}>{f.label}</label>
                <input id={f.id} name={f.id} type={f.type} placeholder={f.placeholder}
                  value={form[f.id]} onChange={handleChange} autoComplete={f.autoComplete}
                  required={f.id === "email"}
                  className={inputClass} style={inputStyle} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {fields.slice(4, 6).map((f) => (
              <div key={f.id} className="flex flex-col gap-1.5">
                <label htmlFor={f.id} className="text-sm font-semibold" style={labelStyle}>{f.label}</label>
                <input id={f.id} name={f.id} type={f.type} placeholder={f.placeholder}
                  value={form[f.id]} onChange={handleChange} autoComplete={f.autoComplete}
                  className={inputClass} style={inputStyle} />
              </div>
            ))}
          </div>

          <div className="border-t my-1" style={{ borderColor: dark ? "rgba(61,46,34,0.8)" : "rgba(255,255,255,0.4)" }} />

          <button type="submit"
            className="w-full py-3.5 rounded-xl text-white font-semibold text-base hover:opacity-90 active:scale-[0.99] transition focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
            style={{ background: "#C65D3A", boxShadow: "0 4px 15px rgba(198,93,58,0.35)" }}>
            Register User
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
