"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import RaptureLogo from "../rapture_logo.png";

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

// ── Logo Icon ────────────────────────────────────────────────
function LogoIcon() {
  return (
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: "rgba(0,212,255,0.12)",
        border: "1px solid rgba(0, 0, 0, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 0 30px rgba(0, 0, 0, 0.35), 0 0 50px rgba(30, 22, 26, 0.2)",
      }}
    >
      <Image src={RaptureLogo} alt="Rapture Logo" width={64} height={64} />
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
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

      const role = data.data?.user?.user_role;

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
        .signin-btn:hover:not(:disabled) { box-shadow: 0 0 40px rgba(255,45,155,0.55), 0 0 60px rgba(0,212,255,0.25) !important; transform: translateY(-1px); }
        .signup-link { color: #00d4ff !important; transition: color 0.2s; }
        .signup-link:hover { color: #ff2d9b !important; }
        .forgot-link { transition: color 0.2s; }
        .forgot-link:hover { color: #ff2d9b !important; }
        .back-link:hover { color: rgba(255,255,255,0.5) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Lava lamp blobs — identical to hero section ── */}
      <div className="lava-lamp" aria-hidden="true">
        <div className="lava-blob lb1" />
        <div className="lava-blob lb2" />
        <div className="lava-blob lb3" />
        <div className="lava-blob lb4" />
      </div>

      {/* ── Floating orbs — same set/sizes/timings as hero, trimmed to 10 ── */}
      <div className="hero-neon-orbs" aria-hidden="true">
        <div
          className="hero-orb ob1"
          style={{
            left: "38%",
            top: "60%",
            width: 680,
            height: 680,
            animationDuration: "12s",
            animationDelay: "0s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "55%",
            top: "85%",
            width: 450,
            height: 450,
            animationDuration: "15s",
            animationDelay: "1s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "70%",
            top: "55%",
            width: 320,
            height: 320,
            animationDuration: "8s",
            animationDelay: "5s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "60%",
            top: "30%",
            width: 400,
            height: 400,
            animationDuration: "11s",
            animationDelay: "2s",
          }}
        />
        <div
          className="hero-orb ob3"
          style={{
            left: "48%",
            top: "15%",
            width: 600,
            height: 600,
            animationDuration: "14s",
            animationDelay: "6s",
          }}
        />
        <div
          className="hero-orb op3"
          style={{
            left: "20%",
            top: "65%",
            width: 380,
            height: 380,
            animationDuration: "13s",
            animationDelay: "4s",
          }}
        />
        <div
          className="hero-orb ob4"
          style={{
            left: "5%",
            top: "20%",
            width: 320,
            height: 320,
            animationDuration: "10s",
            animationDelay: "3s",
          }}
        />
        <div
          className="hero-orb op4"
          style={{
            left: "85%",
            top: "15%",
            width: 320,
            height: 320,
            animationDuration: "9s",
            animationDelay: "2s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "90%",
            top: "70%",
            width: 500,
            height: 500,
            animationDuration: "11s",
            animationDelay: "7s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "10%",
            top: "85%",
            width: 380,
            height: 380,
            animationDuration: "16s",
            animationDelay: "0s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "38%",
            top: "60%",
            width: 680,
            height: 680,
            animationDuration: "12s",
            animationDelay: "0s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "55%",
            top: "85%",
            width: 450,
            height: 450,
            animationDuration: "15s",
            animationDelay: "1s",
          }}
        />
        <div
          className="hero-orb ob2"
          style={{
            left: "70%",
            top: "55%",
            width: 320,
            height: 320,
            animationDuration: "8s",
            animationDelay: "5s",
          }}
        />
        <div
          className="hero-orb op2"
          style={{
            left: "60%",
            top: "30%",
            width: 400,
            height: 400,
            animationDuration: "11s",
            animationDelay: "2s",
          }}
        />
        <div
          className="hero-orb ob3"
          style={{
            left: "48%",
            top: "15%",
            width: 600,
            height: 600,
            animationDuration: "14s",
            animationDelay: "6s",
          }}
        />
        <div
          className="hero-orb op3"
          style={{
            left: "20%",
            top: "65%",
            width: 380,
            height: 380,
            animationDuration: "13s",
            animationDelay: "4s",
          }}
        />
        <div
          className="hero-orb ob4"
          style={{
            left: "5%",
            top: "20%",
            width: 320,
            height: 320,
            animationDuration: "10s",
            animationDelay: "3s",
          }}
        />
        <div
          className="hero-orb op4"
          style={{
            left: "85%",
            top: "15%",
            width: 320,
            height: 320,
            animationDuration: "9s",
            animationDelay: "2s",
          }}
        />
        <div
          className="hero-orb ob1"
          style={{
            left: "90%",
            top: "70%",
            width: 500,
            height: 500,
            animationDuration: "11s",
            animationDelay: "7s",
          }}
        />
        <div
          className="hero-orb op1"
          style={{
            left: "10%",
            top: "85%",
            width: 380,
            height: 380,
            animationDuration: "16s",
            animationDelay: "0s",
          }}
        />
      </div>

      {/* ── Dark veil so lava blobs show through, same as hero ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(6,6,20,0.35)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ── Grid background (kept, sits above veil at low opacity) ── */}
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
          zIndex: 0,
        }}
      />

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
          zIndex: 0,
        }}
      />

      {/* ── Card wrapper ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 420,
        }}
      >
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
    </div>
  );
}
