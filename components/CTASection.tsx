"use client";

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  ExternalLink,
} from "lucide-react";

export function CTASection() {
  const contactInfo = [
    {
      Icon: MapPin,
      text: "123 Tomas Morato Ave., Quezon City, Metro Manila",
    },
    { Icon: Phone, text: "+63 917 RAPTURE" },
    { Icon: Mail, text: "hello@raptureqc.ph" },
    { Icon: Clock, text: "Open Daily · 6PM–4AM (Café from 10AM)" },
  ];

  return (
    <section
      id="contact"
      className="section-glow-bg cta-section"
      style={{ padding: "80px 48px" }} // Desktop first, overridden by media queries
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="cta-container"
          style={{
            borderRadius: 28,
            padding: "56px 60px",
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(185,79,255,0.25)",
            background: "linear-gradient(135deg,rgba(13,13,43,0.95),rgba(26,8,48,0.9))",
            boxShadow: "0 0 80px rgba(185,79,255,0.08)",
          }}
        >
          {/* Top border accent */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(90deg,transparent,#b94fff,#ff2d9b,#00d4ff,transparent)",
            }}
          />

          {/* Main grid */}
          <div
            className="cta-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 64,
              alignItems: "center",
            }}
          >
            {/* LEFT - Content */}
            <div className="cta-content">
              <div
                className="cta-label"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "#00d4ff",
                  marginBottom: 16,
                }}
              >
                Come Find Us
              </div>

              <h2
                className="cta-heading"
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: "clamp(24px,3.5vw,46px)",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  marginBottom: 16,
                  color: "#fff",
                }}
              >
                Ready for a Night
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg,#00d4ff,#b94fff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  You Won't Forget?
                </span>
              </h2>

              {/* Contact Info */}
              <div
                className="cta-info-list"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  marginBottom: 32,
                }}
              >
                {contactInfo.map(({ Icon, text }) => (
                  <div
                    key={text}
                    className="cta-info-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: 14,
                      color: "rgba(255,255,255,0.65)",
                      lineHeight: 1.5,
                    }}
                  >
                    <Icon
                      size={15}
                      color="#00d4ff"
                      strokeWidth={1.8}
                      style={{ flexShrink: 0 }}
                    />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <a
                href="mailto:hello@raptureqc.ph"
                className="cta-button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 32px",
                  borderRadius: 50,
                  background: "linear-gradient(135deg,#00d4ff,#7b2fff)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  boxShadow: "0 0 30px rgba(0,212,255,0.3)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 40px rgba(0,212,255,0.5)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(0,212,255,0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Contact Us →
              </a>
            </div>

            {/* RIGHT - Location Card */}
            <div
              className="cta-card"
              style={{
                minWidth: 240,
                background: "rgba(0,212,255,0.05)",
                border: "1px solid rgba(0,212,255,0.2)",
                borderRadius: 20,
                padding: "28px 24px",
                textAlign: "center",
              }}
            >
              {/* Icon */}
              <div
                className="cta-icon-box"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(0,212,255,0.12)",
                  border: "1px solid rgba(0,212,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Navigation
                  size={22}
                  color="#00d4ff"
                  strokeWidth={1.5}
                />
              </div>

              {/* Title */}
              <div
                className="cta-location-title"
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 4,
                }}
              >
                Tomas Morato Ave.
              </div>

              {/* Subtitle */}
              <div
                className="cta-location-subtitle"
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: 20,
                }}
              >
                Quezon City, Metro Manila
              </div>

              {/* Get Directions Button */}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-location-button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "9px 20px",
                  borderRadius: 50,
                  border: "1px solid rgba(0,212,255,0.4)",
                  color: "#00d4ff",
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,212,255,0.7)";
                  e.currentTarget.style.background =
                    "rgba(0,212,255,0.08)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <ExternalLink size={12} />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}