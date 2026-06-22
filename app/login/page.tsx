"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

// ── Types ────────────────────────────────────────────────────
interface LoginForm {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

type DemoRole = "admin" | "user" | null;

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
export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState<DemoRole>(null);

  // ── Validation ─────────────────────────────────────────────
  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.password) {
      next.password = "Password is required.";
    } else if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ── Demo fill ──────────────────────────────────────────────
  const handleDemoClick = (type: "admin" | "user") => {
    setActiveDemo(type);
    setErrors({});
    if (type === "admin") {
      setForm({ email: "admin@rapture.ph", password: "admin1234" });
    } else {
      setForm({ email: "user@rapture.ph", password: "user1234" });
    }
  };

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Laravel Sanctum: first get CSRF cookie, then login
      // await fetch("/sanctum/csrf-cookie", {
      //   method: "GET",
      //   credentials: "include",
      // });

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          setErrors({
            email: data.errors.email?.[0],
            password: data.errors.password?.[0],
          });
        } else {
          setErrors({
            general: data.message || "Invalid credentials. Please try again.",
          });
        }
        return;
      }

      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      const role = data.data?.user?.user_role; // adjust path once confirmed

      if (role) {
        localStorage.setItem("auth_role", role);
      }

      if (role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }

      
    } catch {
      setErrors({
        general: "Cannot connect to server. Please check your connection.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Field change helper ────────────────────────────────────
  const handleChange =
    (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
      if (errors.general)
        setErrors((prev) => ({ ...prev, general: undefined }));
    };

  // ── Shared input styles ────────────────────────────────────
  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "12px 14px 12px 42px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 14,
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070b14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        input::placeholder { color: rgba(255,255,255,0.2) !important; }
        input:focus { border-color: rgba(0,212,255,0.5) !important; box-shadow: 0 0 0 3px rgba(0,212,255,0.08) !important; }
        .demo-btn-admin:hover { border-color: #00d4ff !important; color: #00d4ff !important; background: rgba(0,212,255,0.1) !important; }
        .demo-btn-user:hover  { border-color: rgba(255,255,255,0.4) !important; color: #fff !important; background: rgba(255,255,255,0.07) !important; }
        .signin-btn:hover:not(:disabled) { box-shadow: 0 0 40px rgba(255,45,155,0.55), 0 0 60px rgba(0,212,255,0.25) !important; transform: translateY(-1px); }
        .signup-link { color: #00d4ff !important; transition: color 0.2s; }
        .signup-link:hover { color: #ff2d9b !important; }
        .forgot-link { transition: color 0.2s; }
        .forgot-link:hover { color: #ff2d9b !important; }
        .back-link:hover { color: rgba(255,255,255,0.5) !important; }
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
        <div className="absolute h-[60px] w-[60px] rounded-full top-[3%] left-[8%] w-[22px] h-[22px] bg-[#00d4ff] opacity-50 blur-[13px] shadow-[0_0_33px_#00d4ff]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[6%] left-[32%] w-[14px] h-[14px] bg-[#ff2d9b] opacity-45 blur-[8px] shadow-[0_0_21px_#ff2d9b]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[4%] right-[20%] w-[18px] h-[18px] bg-[#00d4ff] opacity-40 blur-[11px] shadow-[0_0_27px_#00d4ff]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[9%] right-[5%] w-[26px] h-[26px] bg-[#ff2d9b] opacity-50 blur-[16px] shadow-[0_0_39px_#ff2d9b]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[14%] left-[16%] w-[16px] h-[16px] bg-[#ff2d9b] opacity-40 blur-[10px] shadow-[0_0_24px_#ff2d9b]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[17%] left-[48%] w-[12px] h-[12px] bg-[#00d4ff] opacity-45 blur-[7px] shadow-[0_0_18px_#00d4ff]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[13%] right-[32%] w-[20px] h-[20px] bg-[#00d4ff] opacity-40 blur-[12px] shadow-[0_0_30px_#00d4ff]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[22%] left-[4%] w-[18px] h-[18px] bg-[#00d4ff] opacity-45 blur-[11px] shadow-[0_0_27px_#00d4ff]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[26%] left-[6%] w-[14px] h-[14px] bg-[#ff2d9b] opacity-40 blur-[8px] shadow-[0_0_21px_#ff2d9b]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[21%] right-[12%] w-[24px] h-[24px] bg-[#ff2d9b] opacity-45 blur-[14px] shadow-[0_0_36px_#ff2d9b]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[33%] left-[12%] w-[20px] h-[20px] bg-[#ff2d9b] opacity-40 blur-[12px] shadow-[0_0_30px_#ff2d9b]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[36%] left-[40%] w-[16px] h-[16px] bg-[#00d4ff] opacity-45 blur-[10px] shadow-[0_0_24px_#00d4ff]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[31%] right-[6%] w-[14px] h-[14px] bg-[#00d4ff] opacity-40 blur-[8px] shadow-[0_0_21px_#00d4ff]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[48%] left-[6%] w-[24px] h-[24px] bg-[#00d4ff] opacity-45 blur-[14px] shadow-[0_0_36px_#00d4ff]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[55%] right-[10%] w-[20px] h-[20px] bg-[#00d4ff] opacity-45 blur-[12px] shadow-[0_0_30px_#00d4ff]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[62%] left-[44%] w-[18px] h-[18px] bg-[#ff2d9b] opacity-40 blur-[11px] shadow-[0_0_27px_#ff2d9b]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[66%] right-[5%] w-[22px] h-[22px] bg-[#ff2d9b] opacity-40 blur-[13px] shadow-[0_0_33px_#ff2d9b]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[74%] right-[18%] w-[20px] h-[20px] bg-[#00d4ff] opacity-40 blur-[12px] shadow-[0_0_30px_#00d4ff]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[86%] right-[4%] w-[24px] h-[24px] bg-[#ff2d9b] opacity-45 blur-[14px] shadow-[0_0_36px_#ff2d9b]" />
        <div className="absolute h-[60px] w-[60px] rounded-full top-[92%] left-[12%] w-[18px] h-[18px] bg-[#00d4ff] opacity-45 blur-[11px] shadow-[0_0_27px_#00d4ff]" />
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
      <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
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
            RAPTURE
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
            Welcome back
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              textAlign: "center",
              margin: "0 0 1.5rem",
            }}
          >
            Sign in to access your dashboard
          </p>

          {/* ── Demo buttons ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: "1.5rem",
            }}
          >
            <button
              type="button"
              className="demo-btn-admin"
              onClick={() => handleDemoClick("admin")}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                padding: "10px 0",
                borderRadius: 999,
                border: "1px solid",
                cursor: "pointer",
                transition: "all 0.2s",
                background:
                  activeDemo === "admin"
                    ? "rgba(0,212,255,0.1)"
                    : "transparent",
                borderColor:
                  activeDemo === "admin" ? "#00d4ff" : "rgba(0,212,255,0.4)",
                color:
                  activeDemo === "admin" ? "#00d4ff" : "rgba(0,212,255,0.75)",
              }}
            >
              Admin Demo
            </button>
            <button
              type="button"
              className="demo-btn-user"
              onClick={() => handleDemoClick("user")}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                padding: "10px 0",
                borderRadius: 999,
                border: "1px solid",
                cursor: "pointer",
                transition: "all 0.2s",
                background:
                  activeDemo === "user"
                    ? "rgba(255,255,255,0.07)"
                    : "transparent",
                borderColor:
                  activeDemo === "user"
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(255,255,255,0.15)",
                color: activeDemo === "user" ? "#fff" : "rgba(255,255,255,0.5)",
              }}
            >
              User Demo
            </button>
          </div>

          {/* ── Form ── */}
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

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Email
              </label>
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
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="you@rapture.ph"
                  style={{
                    ...inputBase,
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

            {/* Password */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <label
                  htmlFor="password"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="forgot-link"
                  style={{
                    fontSize: 12,
                    color: "#00d4ff",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </Link>
              </div>
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
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="••••••••"
                  style={{
                    ...inputBase,
                    paddingRight: 44,
                    borderColor: errors.password
                      ? "rgba(239,68,68,0.6)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
                <button
                  type="button"
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

            {/* Submit */}
            <button
              type="submit"
              className="signin-btn"
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
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>

            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
                textAlign: "center",
              }}
            >
              Use the demo buttons above to explore without credentials.
            </p>

            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.35)",
                textAlign: "center",
              }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="signup-link"
                style={{ fontWeight: 600, textDecoration: "none" }}
              >
                Sign up
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
