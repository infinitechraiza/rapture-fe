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
      {/* Neon orbs — hero-only ambient glow.
          28 orbs across 8 color variants, each with its own scattered
          left/top position + size + animation timing set inline so
          they spread across the whole hero instead of stacking in
          the same few corners. */}
      <div className="hero-neon-orbs" aria-hidden="true">
        <div className="hero-orb ob1" style={{ left: "36.3%", top: "36.2%", width: 320, height: 320, animationDuration: "8.3s", animationDelay: "5.2s" }} />
        <div className="hero-orb op1" style={{ left: "77.1%", top: "8.1%", width: 260, height: 260, animationDuration: "12.0s", animationDelay: "3.4s" }} />
        <div className="hero-orb ob2" style={{ left: "22.7%", top: "82.5%", width: 520, height: 520, animationDuration: "12.5s", animationDelay: "2.2s" }} />
        <div className="hero-orb op2" style={{ left: "21.8%", top: "32.0%", width: 260, height: 260, animationDuration: "12.3s", animationDelay: "3.0s" }} />
        <div className="hero-orb ob3" style={{ left: "7.4%", top: "41.0%", width: 450, height: 450, animationDuration: "12.1s", animationDelay: "2.7s" }} />
        <div className="hero-orb op3" style={{ left: "77.1%", top: "91.2%", width: 600, height: 600, animationDuration: "13.5s", animationDelay: "0.5s" }} />
        <div className="hero-orb ob4" style={{ left: "5.7%", top: "62.4%", width: 380, height: 380, animationDuration: "13.1s", animationDelay: "1.7s" }} />
        <div className="hero-orb op4" style={{ left: "82.0%", top: "57.7%", width: 450, height: 450, animationDuration: "9.2s", animationDelay: "2.1s" }} />
        <div className="hero-orb ob1" style={{ left: "96.0%", top: "86.5%", width: 600, height: 600, animationDuration: "8.5s", animationDelay: "3.3s" }} />
        <div className="hero-orb op1" style={{ left: "52.1%", top: "91.5%", width: 380, height: 380, animationDuration: "12.9s", animationDelay: "3.6s" }} />
        <div className="hero-orb ob2" style={{ left: "93.4%", top: "37.0%", width: 680, height: 680, animationDuration: "8.7s", animationDelay: "1.6s" }} />
        <div className="hero-orb op2" style={{ left: "65.7%", top: "82.1%", width: 600, height: 600, animationDuration: "12.9s", animationDelay: "3.9s" }} />
        <div className="hero-orb ob3" style={{ left: "25.0%", top: "66.5%", width: 380, height: 380, animationDuration: "13.0s", animationDelay: "5.3s" }} />
        <div className="hero-orb op3" style={{ left: "6.1%", top: "93.0%", width: 380, height: 380, animationDuration: "9.2s", animationDelay: "0.7s" }} />
        <div className="hero-orb ob4" style={{ left: "4.0%", top: "15.9%", width: 320, height: 320, animationDuration: "13.2s", animationDelay: "2.4s" }} />
        <div className="hero-orb op4" style={{ left: "95.8%", top: "12.5%", width: 320, height: 320, animationDuration: "11.1s", animationDelay: "3.3s" }} />
        <div className="hero-orb ob1" style={{ left: "38.5%", top: "66.5%", width: 680, height: 680, animationDuration: "11.9s", animationDelay: "4.2s" }} />
        <div className="hero-orb op1" style={{ left: "39.2%", top: "89.8%", width: 450, height: 450, animationDuration: "14.7s", animationDelay: "0.9s" }} />
        <div className="hero-orb ob2" style={{ left: "62.0%", top: "59.1%", width: 320, height: 320, animationDuration: "8.1s", animationDelay: "5.0s" }} />
        <div className="hero-orb op2" style={{ left: "62.0%", top: "34.8%", width: 320, height: 320, animationDuration: "10.9s", animationDelay: "2.2s" }} />
        <div className="hero-orb ob3" style={{ left: "50.5%", top: "18.2%", width: 600, height: 600, animationDuration: "14.0s", animationDelay: "5.7s" }} />
        <div className="hero-orb op3" style={{ left: "51.1%", top: "65.5%", width: 450, height: 450, animationDuration: "14.3s", animationDelay: "4.7s" }} />
        <div className="hero-orb ob4" style={{ left: "38.4%", top: "16.2%", width: 450, height: 450, animationDuration: "10.8s", animationDelay: "2.4s" }} />
        <div className="hero-orb op4" style={{ left: "21.3%", top: "11.3%", width: 320, height: 320, animationDuration: "8.5s", animationDelay: "1.3s" }} />
        <div className="hero-orb ob1" style={{ left: "90.4%", top: "60.5%", width: 260, height: 260, animationDuration: "8.7s", animationDelay: "3.4s" }} />
        <div className="hero-orb op1" style={{ left: "78.8%", top: "43.1%", width: 520, height: 520, animationDuration: "8.2s", animationDelay: "5.2s" }} />
        <div className="hero-orb ob2" style={{ left: "65.1%", top: "8.1%", width: 380, height: 380, animationDuration: "14.7s", animationDelay: "3.6s" }} />
        <div className="hero-orb op2" style={{ left: "49.8%", top: "32.7%", width: 450, height: 450, animationDuration: "15.0s", animationDelay: "2.8s" }} />
      <div className="hero-orb ob1" style={{ left: "36.3%", top: "36.2%", width: 320, height: 320, animationDuration: "8.3s", animationDelay: "5.2s" }} />
        <div className="hero-orb op1" style={{ left: "77.1%", top: "8.1%", width: 260, height: 260, animationDuration: "12.0s", animationDelay: "3.4s" }} />
        <div className="hero-orb ob2" style={{ left: "22.7%", top: "82.5%", width: 520, height: 520, animationDuration: "12.5s", animationDelay: "2.2s" }} />
        <div className="hero-orb op2" style={{ left: "21.8%", top: "32.0%", width: 260, height: 260, animationDuration: "12.3s", animationDelay: "3.0s" }} />
        <div className="hero-orb ob3" style={{ left: "7.4%", top: "41.0%", width: 450, height: 450, animationDuration: "12.1s", animationDelay: "2.7s" }} />
        <div className="hero-orb op3" style={{ left: "77.1%", top: "91.2%", width: 600, height: 600, animationDuration: "13.5s", animationDelay: "0.5s" }} />
        <div className="hero-orb ob4" style={{ left: "5.7%", top: "62.4%", width: 380, height: 380, animationDuration: "13.1s", animationDelay: "1.7s" }} />
        <div className="hero-orb op4" style={{ left: "82.0%", top: "57.7%", width: 450, height: 450, animationDuration: "9.2s", animationDelay: "2.1s" }} />
        <div className="hero-orb ob1" style={{ left: "96.0%", top: "86.5%", width: 600, height: 600, animationDuration: "8.5s", animationDelay: "3.3s" }} />
        <div className="hero-orb op1" style={{ left: "52.1%", top: "91.5%", width: 380, height: 380, animationDuration: "12.9s", animationDelay: "3.6s" }} />
        <div className="hero-orb ob2" style={{ left: "93.4%", top: "37.0%", width: 680, height: 680, animationDuration: "8.7s", animationDelay: "1.6s" }} />
        <div className="hero-orb op2" style={{ left: "65.7%", top: "82.1%", width: 600, height: 600, animationDuration: "12.9s", animationDelay: "3.9s" }} />
        <div className="hero-orb ob3" style={{ left: "25.0%", top: "66.5%", width: 380, height: 380, animationDuration: "13.0s", animationDelay: "5.3s" }} />
        <div className="hero-orb op3" style={{ left: "6.1%", top: "93.0%", width: 380, height: 380, animationDuration: "9.2s", animationDelay: "0.7s" }} />
        <div className="hero-orb ob4" style={{ left: "4.0%", top: "15.9%", width: 320, height: 320, animationDuration: "13.2s", animationDelay: "2.4s" }} />
        <div className="hero-orb op4" style={{ left: "95.8%", top: "12.5%", width: 320, height: 320, animationDuration: "11.1s", animationDelay: "3.3s" }} />
        <div className="hero-orb ob1" style={{ left: "38.5%", top: "66.5%", width: 680, height: 680, animationDuration: "11.9s", animationDelay: "4.2s" }} />
        <div className="hero-orb op1" style={{ left: "39.2%", top: "89.8%", width: 450, height: 450, animationDuration: "14.7s", animationDelay: "0.9s" }} />
        <div className="hero-orb ob2" style={{ left: "62.0%", top: "59.1%", width: 320, height: 320, animationDuration: "8.1s", animationDelay: "5.0s" }} />
        <div className="hero-orb op2" style={{ left: "62.0%", top: "34.8%", width: 320, height: 320, animationDuration: "10.9s", animationDelay: "2.2s" }} />
        <div className="hero-orb ob3" style={{ left: "50.5%", top: "18.2%", width: 600, height: 600, animationDuration: "14.0s", animationDelay: "5.7s" }} />
        <div className="hero-orb op3" style={{ left: "51.1%", top: "65.5%", width: 450, height: 450, animationDuration: "14.3s", animationDelay: "4.7s" }} />
        <div className="hero-orb ob4" style={{ left: "38.4%", top: "16.2%", width: 450, height: 450, animationDuration: "10.8s", animationDelay: "2.4s" }} />
        <div className="hero-orb op4" style={{ left: "21.3%", top: "11.3%", width: 320, height: 320, animationDuration: "8.5s", animationDelay: "1.3s" }} />
        <div className="hero-orb ob1" style={{ left: "90.4%", top: "60.5%", width: 260, height: 260, animationDuration: "8.7s", animationDelay: "3.4s" }} />
        <div className="hero-orb op1" style={{ left: "78.8%", top: "43.1%", width: 520, height: 520, animationDuration: "8.2s", animationDelay: "5.2s" }} />
        <div className="hero-orb ob2" style={{ left: "65.1%", top: "8.1%", width: 380, height: 380, animationDuration: "14.7s", animationDelay: "3.6s" }} />
        <div className="hero-orb op2" style={{ left: "49.8%", top: "32.7%", width: 450, height: 450, animationDuration: "15.0s", animationDelay: "2.8s" }} />
      <div className="hero-orb ob1" style={{ left: "36.3%", top: "36.2%", width: 320, height: 320, animationDuration: "8.3s", animationDelay: "5.2s" }} />
        <div className="hero-orb op1" style={{ left: "77.1%", top: "8.1%", width: 260, height: 260, animationDuration: "12.0s", animationDelay: "3.4s" }} />
        <div className="hero-orb ob2" style={{ left: "22.7%", top: "82.5%", width: 520, height: 520, animationDuration: "12.5s", animationDelay: "2.2s" }} />
        <div className="hero-orb op2" style={{ left: "21.8%", top: "32.0%", width: 260, height: 260, animationDuration: "12.3s", animationDelay: "3.0s" }} />
        <div className="hero-orb ob3" style={{ left: "7.4%", top: "41.0%", width: 450, height: 450, animationDuration: "12.1s", animationDelay: "2.7s" }} />
        <div className="hero-orb op3" style={{ left: "77.1%", top: "91.2%", width: 600, height: 600, animationDuration: "13.5s", animationDelay: "0.5s" }} />
        <div className="hero-orb ob4" style={{ left: "5.7%", top: "62.4%", width: 380, height: 380, animationDuration: "13.1s", animationDelay: "1.7s" }} />
        <div className="hero-orb op4" style={{ left: "82.0%", top: "57.7%", width: 450, height: 450, animationDuration: "9.2s", animationDelay: "2.1s" }} />
        <div className="hero-orb ob1" style={{ left: "96.0%", top: "86.5%", width: 600, height: 600, animationDuration: "8.5s", animationDelay: "3.3s" }} />
        <div className="hero-orb op1" style={{ left: "52.1%", top: "91.5%", width: 380, height: 380, animationDuration: "12.9s", animationDelay: "3.6s" }} />
        <div className="hero-orb ob2" style={{ left: "93.4%", top: "37.0%", width: 680, height: 680, animationDuration: "8.7s", animationDelay: "1.6s" }} />
        <div className="hero-orb op2" style={{ left: "65.7%", top: "82.1%", width: 600, height: 600, animationDuration: "12.9s", animationDelay: "3.9s" }} />
        <div className="hero-orb ob3" style={{ left: "25.0%", top: "66.5%", width: 380, height: 380, animationDuration: "13.0s", animationDelay: "5.3s" }} />
        <div className="hero-orb op3" style={{ left: "6.1%", top: "93.0%", width: 380, height: 380, animationDuration: "9.2s", animationDelay: "0.7s" }} />
        <div className="hero-orb ob4" style={{ left: "4.0%", top: "15.9%", width: 320, height: 320, animationDuration: "13.2s", animationDelay: "2.4s" }} />
        <div className="hero-orb op4" style={{ left: "95.8%", top: "12.5%", width: 320, height: 320, animationDuration: "11.1s", animationDelay: "3.3s" }} />
        <div className="hero-orb ob1" style={{ left: "38.5%", top: "66.5%", width: 680, height: 680, animationDuration: "11.9s", animationDelay: "4.2s" }} />
        <div className="hero-orb op1" style={{ left: "39.2%", top: "89.8%", width: 450, height: 450, animationDuration: "14.7s", animationDelay: "0.9s" }} />
        <div className="hero-orb ob2" style={{ left: "62.0%", top: "59.1%", width: 320, height: 320, animationDuration: "8.1s", animationDelay: "5.0s" }} />
        <div className="hero-orb op2" style={{ left: "62.0%", top: "34.8%", width: 320, height: 320, animationDuration: "10.9s", animationDelay: "2.2s" }} />
        <div className="hero-orb ob3" style={{ left: "50.5%", top: "18.2%", width: 600, height: 600, animationDuration: "14.0s", animationDelay: "5.7s" }} />
        <div className="hero-orb op3" style={{ left: "51.1%", top: "65.5%", width: 450, height: 450, animationDuration: "14.3s", animationDelay: "4.7s" }} />
        <div className="hero-orb ob4" style={{ left: "38.4%", top: "16.2%", width: 450, height: 450, animationDuration: "10.8s", animationDelay: "2.4s" }} />
        <div className="hero-orb op4" style={{ left: "21.3%", top: "11.3%", width: 320, height: 320, animationDuration: "8.5s", animationDelay: "1.3s" }} />
        <div className="hero-orb ob1" style={{ left: "90.4%", top: "60.5%", width: 260, height: 260, animationDuration: "8.7s", animationDelay: "3.4s" }} />
        <div className="hero-orb op1" style={{ left: "78.8%", top: "43.1%", width: 520, height: 520, animationDuration: "8.2s", animationDelay: "5.2s" }} />
        <div className="hero-orb ob2" style={{ left: "65.1%", top: "8.1%", width: 380, height: 380, animationDuration: "14.7s", animationDelay: "3.6s" }} />
        <div className="hero-orb op2" style={{ left: "49.8%", top: "32.7%", width: 450, height: 450, animationDuration: "15.0s", animationDelay: "2.8s" }} />
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
                🌈
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