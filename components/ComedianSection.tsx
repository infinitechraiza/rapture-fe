"use client";

import { useState, useRef, useEffect } from "react";
import {Mic2, Ticket, X} from "lucide-react";

const COMEDIANS = [
  {
    name: "Alex Reyes",
    tagline: '"The Shade Queen"',
    category: "Observational & Political",
    description:
      "QC's sharpest tongue meets the most fabulous mind. Alex delivers truth bombs wrapped in...",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    tagColor: "#ff2d9b",
  },
  {
    name: "Jamie Cruz",
    tagline: '"Kuya Divert"',
    category: "Self-Deprecating & Family",
    description:
      "Turning awkward family reunions into 20-minute sets. Somehow makes you call your nanay r...",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    tagColor: "#00d4ff",
  },
  {
    name: "Sam Dela Rosa",
    tagline: '"The Confessor"',
    category: "Coming-Out & Dating",
    description:
      "Every story Sam tells sounds unbelievable. Every single word of it is true. Bring tissue.",
    img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face",
    tagColor: "#b94fff",
  },
  {
    name: "Nico Bautista",
    tagline: '"Señorita Chaos"',
    category: "Drag Comedy & Impressions",
    description:
      "Half stand-up, half drag performance, 100% chaos. Nico doesn't do shows — Nico throws ev...",
    img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=300&fit=crop&crop=face",
    tagColor: "#ff2d9b",
  },
  {
    name: "Pat Villanueva",
    tagline: '"The Good vibes"',
    category: "Mental Health & Queer Life",
    description:
      "Comedy that makes you laugh until you realize you have a lot to unpack. Pat covers the e...",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
    tagColor: "#00d4ff",
  },
  {
    name: "Rio Magno",
    tagline: '"Rio Tita"',
    category: "Pop Culture & OPM",
    description:
      "Knows every telenovela twist and every VMAs shade — and will perform all of it. Front ro...",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
    tagColor: "#b94fff",
  },
];

/* ─── Comedian Modal ─── */
function ComedianModal({
  comedian,
  onClose,
}: {
  comedian: (typeof COMEDIANS)[0];
  onClose: () => void;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <div
          style={{
            padding: "20px 20px 0",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: "16px 20px 24px", textAlign: "center" }}>
          <img
            src={comedian.img}
            alt={comedian.name}
            className="modal-avatar"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(185,79,255,0.5)",
              boxShadow: "0 0 40px rgba(185,79,255,0.3)",
              marginBottom: 20,
            }}
          />
          <h3
            className="modal-title"
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#fff",
              marginBottom: 6,
            }}
          >
            {comedian.name}
          </h3>
          <div
            className="modal-tagline"
            style={{
              fontSize: 16,
              fontStyle: "italic",
              color: comedian.tagColor,
              marginBottom: 12,
            }}
          >
            {comedian.tagline}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              padding: "4px 12px",
              borderRadius: 50,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.5)",
              marginBottom: 20,
            }}
          >
            <Mic2 size={11} />
            {comedian.category}
          </div>
          <p
            className="modal-description"
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.75,
              marginBottom: 24,
            }}
          >
            {comedian.description.replace(/\.\.\.$/, ".")} A beloved fixture of
            QC's LGBTQ+ comedy scene, bringing raw, hilarious and deeply
            personal storytelling to every single performance at RAPTURE.
          </p>
          <a
            href="#events"
            onClick={onClose}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 28px",
              borderRadius: 50,
              background: "linear-gradient(135deg,#b94fff,#ff2d9b)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.3s",
              boxShadow: "0 0 20px rgba(185,79,255,0.3)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = "0 0 30px rgba(185,79,255,0.5)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = "0 0 20px rgba(185,79,255,0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Ticket size={14} /> See Their Next Show
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Comedians Section ─── */
export function ComedianSection() {
  const [active, setActive] = useState<(typeof COMEDIANS)[0] | null>(null);

  return (
    <section
      id="comedians"
      className="section-glow-bg"
      style={{ padding: "60px 20px" }} // Mobile first
    >
      {active && (
        <ComedianModal comedian={active} onClose={() => setActive(null)} />
      )}
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          className="comedian-section-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 40,
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: 12,
              }}
            >
              Meet the Talent
            </div>
            <h2
              className="comedian-section-title"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "clamp(28px, 5vw, 52px)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#fff",
              }}
            >
              Featured
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg,#b94fff,#ff2d9b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Comedians
              </span>
            </h2>
          </div>
          <a
            className="comedian-section-link"
            href="comedian"
            style={{
              padding: "10px 22px",
              borderRadius: 50,
              border: "1px solid rgba(185,79,255,0.5)",
              color: "#b94fff",
              fontWeight: 600,
              fontSize: 13,
              textDecoration: "none",
              background: "rgba(185,79,255,0.07)",
              whiteSpace: "nowrap",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "rgba(185,79,255,0.8)";
              e.currentTarget.style.background = "rgba(185,79,255,0.12)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgba(185,79,255,0.5)";
              e.currentTarget.style.background = "rgba(185,79,255,0.07)";
            }}
          >
            View All Comedians →
          </a>
        </div>

        {/* Grid */}
        <div
          className="comedian-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
          }}
        >
          {COMEDIANS.map((c) => (
            <div
              key={c.name}
              className="comedian-card"
              onClick={() => setActive(c)}
              style={{
                cursor: "pointer",
              }}
            >
              <img src={c.img} alt={c.name} className="comedian-avatar" />
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 4,
                }}
              >
                {c.name}
              </h3>
              <div
                style={{
                  fontSize: 14,
                  fontStyle: "italic",
                  color: c.tagColor,
                  marginBottom: 10,
                }}
              >
                {c.tagline}
              </div>
              <div className="comedian-category">
                <Mic2 size={10} />
                {c.category}
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.65,
                  textAlign: "left",
                }}
              >
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}