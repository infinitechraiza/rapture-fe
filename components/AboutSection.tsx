"use client";

import { ShieldCheck, Mic2, Coffee, Heart } from "lucide-react";

const VALUES = [
  {
    Icon: ShieldCheck,
    title: "Safe Space Policy",
    desc: "Zero tolerance for discrimination. Everyone is welcome and protected.",
  },
  {
    Icon: Mic2,
    title: "Live Entertainment",
    desc: "Drag shows, DJ sets, comedy & live music every single week.",
  },
  {
    Icon: Coffee,
    title: "Café by Day",
    desc: "Coffee, brunch & bites from 10AM for the daytime crowd.",
  },
  {
    Icon: Heart,
    title: "Community First",
    desc: "10% of profits go to LGBTQ+ advocacy organizations.",
  },
];

export function AboutPage() {
  return (
    <section
      id="about"
      style={{
        padding: "100px 24px",
        background:
          "linear-gradient(180deg, transparent 0%, var(--purple-glow) 50%, transparent 100%)",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 72,
          alignItems: "center",
        }}
      >
        {/* LEFT: photo + floating graphic */}
        <div style={{ position: "relative" }}>
          {/* Photo container — explicit height so image always shows */}
          <div
            style={{
              borderRadius: 22,
              overflow: "hidden",
              height: 520,
              width: "100%",
              position: "relative",
              background: "var(--card-mid)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=700&q=80"
              alt="RAPTURE community night"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
            {/* gradient overlay from bottom */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(13,13,43,0.88) 0%, rgba(13,13,43,0.18) 55%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
            {/* text at bottom */}
            <div
              style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1,
                  textShadow: "0 2px 12px rgba(0,0,0,0.8)",
                }}
              >
                Since 2019
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginTop: 6,
                }}
              >
                Cubao, Quezon City
              </div>
            </div>
          </div>

          {/* Pride blob graphic */}
          <div
            style={{
              position: "absolute",
              top: -28,
              right: -32,
              width: 170,
              height: 170,
              borderRadius: "40% 60% 55% 45% / 45% 50% 60% 45%",
              background:
                "linear-gradient(135deg, var(--neon-purple) 0%, #ff2d9b 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              boxShadow:
                "0 0 48px rgba(185,79,255,0.45), 0 0 80px rgba(255,45,155,0.3)",
              animation: "prideFloat 6s ease-in-out infinite",
              zIndex: 2,
            }}
          >
            <div style={{ fontSize: 34 }}>🏳️‍🌈</div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "rgba(255,255,255,0.95)",
                letterSpacing: 2,
                textTransform: "uppercase",
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              PRIDE
              <br />
              ALWAYS
            </div>
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.65)",
                letterSpacing: 1,
              }}
            >
              Quezon City
            </div>
          </div>

          {/* Stats badge */}
          <div
            style={{
              position: "absolute",
              bottom: -20,
              right: -20,
              background: "var(--card-dark)",
              border: "1px solid rgba(0,212,255,0.3)",
              borderRadius: 16,
              padding: "18px 22px",
              zIndex: 2,
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: "var(--neon-blue)",
                lineHeight: 1,
              }}
            >
              5,000+
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                letterSpacing: 1,
                marginTop: 4,
              }}
            >
              Community Members
            </div>
          </div>
        </div>

        {/* RIGHT: text + value cards */}
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "var(--neon-blue)",
              marginBottom: 16,
            }}
          >
            Our Story
          </div>
          <h2
            style={{
              fontSize: "clamp(34px,4vw,52px)",
              fontWeight: 900,
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 20,
            }}
          >
            A Safe Space
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg,var(--neon-pink),var(--neon-blue))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              For All Colors
            </span>
          </h2>
          <p
            style={{
              color: "var(--text-soft)",
              lineHeight: 1.8,
              marginBottom: 16,
              fontSize: 15,
            }}
          >
            RAPTURE was born from a simple belief: everyone deserves a place
            where they can be fully, unapologetically themselves. We're more
            than a bar — we're a home for Quezon City's vibrant LGBTQ+
            community.
          </p>
          <p
            style={{
              color: "var(--text-soft)",
              lineHeight: 1.8,
              marginBottom: 40,
              fontSize: 15,
            }}
          >
            From our comedians who light up the stage to our baristas who craft
            your favorite morning brew — every person at RAPTURE is family.
          </p>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            {VALUES.map(({ Icon, title, desc }, i) => (
              <div
                key={i}
                style={{
                  background: "var(--card-mid)",
                  border: "1px solid rgba(0,212,255,0.1)",
                  borderRadius: 16,
                  padding: "22px 20px",
                  transition: "border-color .2s, box-shadow .2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(185,79,255,0.3)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 24px rgba(185,79,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(0,212,255,0.1)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background:
                      "linear-gradient(135deg,rgba(0,212,255,0.15),rgba(185,79,255,0.12))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  <Icon size={28} style={{ color: "var(--neon-blue)" }} />
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 7,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    lineHeight: 1.65,
                  }}
                >
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){#about>div{grid-template-columns:1fr !important;}}`}</style>
    </section>
  );
}
