// /register/page.tsx
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  Loader2,
  ArrowRight,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────
interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirm?: string;
  general?: string;
}

// ── Logo Icon ────────────────────────────────────────────────
function LogoIcon() {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "rgba(0,212,255,0.12)",
        border: "1px solid rgba(255,255,255,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 0 30px rgba(0,212,255,0.35), 0 0 50px rgba(255,45,155,0.2)",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #00d4ff, #ff2d9b)",
        }}
      />
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function SignUpPage() {
  const [form, setForm] = useState<SignUpForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── Validation ─────────────────────────────────────────────
  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!form.firstName.trim()) {
      next.firstName = "First name is required.";
    }

    if (!form.lastName.trim()) {
      next.lastName = "Last name is required.";
    }

    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      next.phone = "Phone number is required.";
    } else if (!/^[0-9]{11}$/.test(form.phone)) {
      next.phone = "Enter a valid phone number.";
    }

    if (!form.password) {
      next.password = "Password is required.";
    } else if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }

    if (form.password !== form.confirm) {
      next.confirm = "Passwords do not match.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ── Field change helper ────────────────────────────────────
  const handleChange =
    (field: keyof SignUpForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors({}); // ← add [field]: undefined
      if (success) setSuccess("");
    };

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    setSuccess("");

    try {
      //   await fetch("/sanctum/csrf-cookie", {
      //     method: "GET",
      //     credentials: "include",
      //   });

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          password_confirmation: form.confirm,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          setErrors({
            firstName: data.errors.first_name?.[0],
            lastName: data.errors.last_name?.[0],
            email: data.errors.email?.[0],
            password: data.errors.password?.[0],
          });
        } else {
          setErrors({
            general: data.message || "Something went wrong. Please try again.",
          });
        }
        return;
      }

      setSuccess("Account created! Please check your email to confirm.");
      window.HTMLLinkElement && setTimeout(() => window.location.href = "/login", 3000);
    } catch {
      setErrors({
        general: "Cannot connect to server. Please check your connection.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Shared input styles ────────────────────────────────────
  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "12px 14px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 14,
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const inputWithIcon: React.CSSProperties = { ...inputBase, paddingLeft: 42 };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070b14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem 1rem",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* ── Google Fonts + interaction states ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        input::placeholder { color: rgba(255,255,255,0.2) !important; }
        input:focus { border-color: rgba(228, 59, 118, 0.7) !important; box-shadow: 0 0 0 3px rgba(0,212,255,0.08) !important; }
        .signup-btn:hover:not(:disabled) { box-shadow: 0 0 40px rgba(255,45,155,0.55), 0 0 60px rgba(0,212,255,0.25) !important; transform: translateY(-1px); }
        .signin-link { color: #00d4ff !important; transition: color 0.2s; }
        .signin-link:hover { color: #ff2d9b !important; }
        .back-link:hover { color: rgba(255,255,255,0.5) !important; }
        .eye-toggle:hover { color: rgba(255,255,255,0.6) !important; }
      `}</style>

      {/* ── Grid background ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* ── Neon orbs — cyan + pink glow, hero-style ── */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <div className="relative w-full h-full">
          <div className="absolute top-[5%] left-[12%] w-[22px] h-[22px] rounded-full bg-[#00d4ff] opacity-50 blur-[13px] shadow-[0_0_33px_#00d4ff]" />
          <div className="absolute top-[18%] left-[42%] w-[14px] h-[14px] rounded-full bg-[#ff2d9b] opacity-45 blur-[8px] shadow-[0_0_21px_#ff2d9b]" />
          <div className="absolute top-[8%] right-[25%] w-[18px] h-[18px] rounded-full bg-[#00d4ff] opacity-40 blur-[11px] shadow-[0_0_27px_#00d4ff]" />
          <div className="absolute top-[28%] right-[10%] w-[26px] h-[26px] rounded-full bg-[#ff2d9b] opacity-50 blur-[16px] shadow-[0_0_39px_#ff2d9b]" />
          <div className="absolute top-[35%] left-[20%] w-[16px] h-[16px] rounded-full bg-[#ff2d9b] opacity-40 blur-[10px] shadow-[0_0_24px_#ff2d9b]" />
          <div className="absolute top-[50%] left-[55%] w-[12px] h-[12px] rounded-full bg-[#00d4ff] opacity-45 blur-[7px] shadow-[0_0_18px_#00d4ff]" />
          <div className="absolute top-[42%] right-[30%] w-[20px] h-[20px] rounded-full bg-[#00d4ff] opacity-40 blur-[12px] shadow-[0_0_30px_#00d4ff]" />
          <div className="absolute top-[65%] left-[8%] w-[18px] h-[18px] rounded-full bg-[#00d4ff] opacity-45 blur-[11px] shadow-[0_0_27px_#00d4ff]" />
          <div className="absolute top-[72%] left-[38%] w-[14px] h-[14px] rounded-full bg-[#ff2d9b] opacity-40 blur-[8px] shadow-[0_0_21px_#ff2d9b]" />
          <div className="absolute top-[80%] right-[15%] w-[24px] h-[24px] rounded-full bg-[#ff2d9b] opacity-45 blur-[14px] shadow-[0_0_36px_#ff2d9b]" />
          <div className="absolute top-[90%] left-[25%] w-[20px] h-[20px] rounded-full bg-[#ff2d9b] opacity-40 blur-[12px] shadow-[0_0_30px_#ff2d9b]" />
          <div className="absolute top-[95%] right-[5%] w-[16px] h-[16px] rounded-full bg-[#00d4ff] opacity-45 blur-[10px] shadow-[0_0_24px_#00d4ff]" />
        </div>
      </div>

      {/* ── Scanline texture overlay ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.06) 2px, rgba(0,212,255,0.06) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Card wrapper ── */}
      <div style={{ position: "relative", width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            marginBottom: "2rem",
          }}
        >
          <LogoIcon />
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.5px",
            }}
          >
            Rapture
          </span>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(13,18,32,0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "2rem",
            backdropFilter: "blur(12px)",
          }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 26,
              fontWeight: 700,
              color: "#fff",
              textAlign: "center",
              margin: "0 0 4px",
            }}
          >
            Create account
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              textAlign: "center",
              margin: "0 0 1.5rem",
            }}
          >
            Join Rapture and find your community
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* General error */}
            {errors.general && (
              <div
                role="alert"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#f87171",
                }}
              >
                {errors.general}
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                role="status"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "#34d399",
                }}
              >
                {success}
              </div>
            )}

            {/* Name row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange("firstName")}
                  placeholder="First name"
                  style={{
                    ...inputBase,
                    borderColor: errors.firstName
                      ? "rgba(239,68,68,0.6)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
                {errors.firstName && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "#f87171",
                      margin: "4px 0 0",
                    }}
                  >
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange("lastName")}
                  placeholder="Last name"
                  style={{
                    ...inputBase,
                    borderColor: errors.lastName
                      ? "rgba(239,68,68,0.6)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
                {errors.lastName && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "#f87171",
                      margin: "4px 0 0",
                    }}
                  >
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <div style={{ position: "relative" }}>
                <Mail
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 16,
                    height: 16,
                    color: "rgba(255,255,255,0.3)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="Email"
                  style={{
                    ...inputWithIcon,
                    borderColor: errors.email
                      ? "rgba(239,68,68,0.6)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
              </div>
              {errors.email && (
                <p
                  style={{ fontSize: 12, color: "#f87171", margin: "4px 0 0" }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              {" "}
              {/* ← add wrapper div */}
              <div style={{ position: "relative" }}>
                <Phone
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 16,
                    height: 16,
                    color: "rgba(255,255,255,0.3)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="09XXXXXXXXX"
                  style={{
                    ...inputWithIcon,
                    borderColor: errors.phone // ← add error border
                      ? "rgba(239,68,68,0.6)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
              </div>
              {errors.phone && ( // ← add error message
                <p
                  style={{ fontSize: 12, color: "#f87171", margin: "4px 0 0" }}
                >
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ position: "relative" }}>
                <Lock
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 16,
                    height: 16,
                    color: "rgba(255,255,255,0.3)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="Password"
                  style={{
                    ...inputWithIcon,
                    paddingRight: 44,
                    borderColor: errors.password
                      ? "rgba(239,68,68,0.6)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.3)",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: 16, height: 16 }} />
                  ) : (
                    <Eye style={{ width: 16, height: 16 }} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  style={{ fontSize: 12, color: "#f87171", margin: "4px 0 0" }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <div style={{ position: "relative" }}>
                <Lock
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 16,
                    height: 16,
                    color: "rgba(255,255,255,0.3)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="confirm"
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={handleChange("confirm")}
                  placeholder="Confirm password"
                  style={{
                    ...inputWithIcon,
                    paddingRight: 44,
                    borderColor: errors.confirm
                      ? "rgba(239,68,68,0.6)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.3)",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showConfirm ? (
                    <EyeOff style={{ width: 16, height: 16 }} />
                  ) : (
                    <Eye style={{ width: 16, height: 16 }} />
                  )}
                </button>
              </div>
              {errors.confirm && (
                <p
                  style={{ fontSize: 12, color: "#f87171", margin: "4px 0 0" }}
                >
                  {errors.confirm}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="signup-btn"
              disabled={isLoading}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #00d4ff, #ff2d9b)",
                color: "#fff",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 15,
                fontWeight: 700,
                padding: "14px 0",
                border: "none",
                borderRadius: 999,
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 6,
                boxShadow: "0 0 24px rgba(255,45,155,0.35)",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <Loader2
                    style={{
                      width: 16,
                      height: 16,
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Creating account…
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>

            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.35)",
                textAlign: "center",
              }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="signin-link"
                style={{ fontWeight: 600, textDecoration: "none" }}
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="back-link"
          style={{
            display: "block",
            fontSize: 13,
            color: "rgba(255,255,255,0.3)",
            textAlign: "center",
            marginTop: "1.25rem",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
        >
          ← Back to landing page
        </Link>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
