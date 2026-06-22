// /verify-email/page.tsx

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

function LogoIcon() {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "rgba(255,45,155,0.12)",
        border: "1px solid rgba(255,255,255,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 0 30px rgba(255,45,155,0.35), 0 0 50px rgba(255,45,155,0.2)",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #ff2d9b, #c0157a)",
        }}
      />
    </div>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "approved" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }
    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`/api/auth/verify-email/${token}`, {
        method: "GET",
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setStatus("approved");
        setMessage(data.message || "Email verified successfully!");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setStatus("error");
        setMessage(data.message || "Verification failed. Please try again.");
        const hint =
          data.message?.includes("Invalid or expired") ||
          data.message?.includes("already verified")
            ? "If you already clicked this link, your email may be verified — try logging in. Otherwise, request a new verification email."
            : data.message || "The link may have expired or already been used.";
        setDebugInfo(hint);
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred during verification. Please try again.");
      setDebugInfo(error instanceof Error ? error.message : "Unknown error");
    }
  };

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        .verify-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .ghost-btn:hover { background: rgba(255,255,255,0.1) !important; }
      `}</style>

      {/* Grid background */}
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

      {/* Neon orbs */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <div className="absolute top-[8%] left-[15%] w-[20px] h-[20px] rounded-full bg-[#ff2d9b] opacity-40 blur-[12px]" />
        <div className="absolute top-[20%] right-[20%] w-[16px] h-[16px] rounded-full bg-[#ff2d9b] opacity-45 blur-[10px]" />
        <div className="absolute top-[60%] left-[10%] w-[24px] h-[24px] rounded-full bg-[#ff2d9b] opacity-35 blur-[14px]" />
        <div className="absolute top-[75%] right-[12%] w-[18px] h-[18px] rounded-full bg-[#ff2d9b] opacity-40 blur-[11px]" />
        <div className="absolute top-[45%] left-[50%] w-[14px] h-[14px] rounded-full bg-[#ff2d9b] opacity-30 blur-[8px]" />
      </div>

      {/* Scanline */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,45,155,0.06) 2px, rgba(255,45,155,0.06) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
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
            Rapture
          </span>
        </div>

        {/* Main card */}
        <div
          style={{
            background: "rgba(13,18,32,0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "2.5rem 2rem",
            backdropFilter: "blur(12px)",
            textAlign: "center",
          }}
        >
          {/* ── LOADING ── */}
          {status === "loading" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "rgba(255,45,155,0.1)",
                  border: "1px solid rgba(255,45,155,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Loader2
                  style={{
                    width: 32,
                    height: 32,
                    color: "#ff2d9b",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 8px",
                  }}
                >
                  Verifying your email
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.4)",
                    margin: 0,
                  }}
                >
                  Hang tight, this will only take a moment…
                </p>
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {status === "approved" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle
                  style={{ width: 36, height: 36, color: "#34d399" }}
                />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 8px",
                  }}
                >
                  You're in, darling! 🎉
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.5)",
                    margin: "0 0 6px",
                  }}
                >
                  {message}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.25)",
                    margin: 0,
                  }}
                >
                  Redirecting to login in 3 seconds…
                </p>
              </div>

              {/* Success banner */}
              <div
                style={{
                  width: "100%",
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  fontSize: 13,
                  color: "#34d399",
                }}
              >
                ✓ Your Rapture account is now active
              </div>

              <Link
                href="/login"
                className="verify-btn"
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #ff2d9b, #c0157a)",
                  color: "#fff",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "13px 36px",
                  border: "none",
                  borderRadius: 999,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  boxShadow: "0 0 20px rgba(255,45,155,0.35)",
                }}
              >
                Go to Login →
              </Link>
            </div>
          )}

          {/* ── ERROR ── */}
          {status === "error" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <XCircle style={{ width: 36, height: 36, color: "#f87171" }} />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 8px",
                  }}
                >
                  Verification Failed
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.5)",
                    margin: 0,
                  }}
                >
                  {message}
                </p>
              </div>

              {/* Error banner */}
              <div
                style={{
                  width: "100%",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  fontSize: 13,
                  color: "#f87171",
                  textAlign: "left",
                }}
              >
                {debugInfo || "The link may have expired or already been used."}
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10, width: "100%" }}>
                <Link
                  href="/verify-pending"
                  className="verify-btn"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    background: "linear-gradient(135deg, #ff2d9b, #c0157a)",
                    color: "#fff",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    padding: "13px 0",
                    borderRadius: 999,
                    textDecoration: "none",
                    transition: "all 0.2s",
                    boxShadow: "0 0 20px rgba(255,45,155,0.3)",
                  }}
                >
                  Resend Email
                </Link>
                <Link
                  href="/login"
                  className="ghost-btn"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.75)",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "13px 0",
                    borderRadius: 999,
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                >
                  Go to Login
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.25rem",
            fontSize: 13,
            color: "rgba(255,255,255,0.2)",
          }}
        >
          © {new Date().getFullYear()} Rapture Bar & Lounge · Quezon City
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#070b14",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader2
            style={{
              width: 48,
              height: 48,
              color: "#ff2d9b",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
