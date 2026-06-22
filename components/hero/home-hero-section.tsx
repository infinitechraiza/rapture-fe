"use client";

const STATS = [
  { num: "6+",   label: "Shows weekly" },
  { num: "6PM",  label: "Open daily" },
  { num: "18+",  label: "Strictly adult" },
  { num: "100%", label: "Safe space" },
];

export function HeroSection() {
  return (
    <section id="home">
      {/* Neon orbs — hero-only ambient glow */}
      <div className="hero-neon-orbs" aria-hidden="true">
        <div className="hero-orb hob1" />
        <div className="hero-orb hop1" />
        <div className="hero-orb hob2" />
        <div className="hero-orb hop2" />
      </div>

      {/* Scanline texture overlay */}
      <div className="hero-scanlines" aria-hidden="true" />

      {/* Two-column grid */}
      <div className="hero-grid">

        {/* ── LEFT: copy ── */}
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span aria-hidden="true" />
            Quezon City · Tomas Morato
          </div>

          <h1 className="hero-title">
            <span className="line1">Where Every</span>
            <span className="line2">Rainbow</span>
            <span className="line1">Shines Bright</span>
          </h1>

          <p className="hero-sub">
            A vibrant sanctuary where the LGBTQ+ community eats, drinks, dances,
            and celebrates identity every single night. You belong here.
          </p>

          <div className="hero-actions">
            <a href="#reservation" className="btn-primary">
              Reserve a Table
            </a>
            <a href="#events" className="btn-outline">
              See Tonight&apos;s Show
            </a>
          </div>

          <div className="hero-stats">
            {STATS.map(({ num, label }) => (
              <div className="stat-item" key={label}>
                <div className="stat-num">{num}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: card ── */}
        <div className="hero-visual">
          <div className="hero-card">
            {/* Placeholder — swap for <Image> when you have a real photo */}
            <div className="about-img-placeholder" style={{ height: 480, borderRadius: 24 }}>
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 30% 40%, rgba(255,45,155,0.2) 0%, transparent 50%)," +
                    "radial-gradient(circle at 70% 60%, rgba(0,212,255,0.15) 0%, transparent 50%)",
                }}
              />
              <div
                style={{
                  fontSize: 100,
                  position: "relative",
                  zIndex: 1,
                  filter: "drop-shadow(0 0 30px rgba(255,45,155,0.6))",
                }}
              >
                
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 24,
                  fontWeight: 700,
                  background: "linear-gradient(90deg, var(--neon-pink), var(--neon-blue))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  position: "relative",
                  zIndex: 1,
                  marginTop: 8,
                  marginLeft: 15,
                }}
              >
                RAPTURE
              </div>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: 3,
                  color: "var(--text-muted)",
                  position: "relative",
                  zIndex: 1,
                  textTransform: "uppercase",
                  marginTop: 2,
                  marginLeft: 15,
                }}
              >
                Gay Bar &amp; Café
              </div>
            </div>

            <div className="hero-card-overlay" aria-hidden="true" />

            <div className="hero-card-info">
              <div className="now-live">
                <div className="now-live-dot" aria-hidden="true" />
                Live Tonight
              </div>
              <div className="hero-card-title">Drag Extravaganza Night</div>
              <div className="hero-card-sub">Doors open 8PM · 18+ Only · Limited seats</div>
            </div>
          </div>

          {/* Floating rating badge */}
          <div className="float-badge">
            <div className="badge-num">★</div>
            <div className="badge-label">4.9 Rating</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-ind" aria-hidden="true">
        <div className="scroll-line" />
        Scroll
      </div>
    </section>
  );
}