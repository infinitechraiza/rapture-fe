"use client";

export function About() {
  return (
    <section id="about">
      <div className="about-inner">
        <div className="about-visual">
          <div className="about-img-placeholder">
            <div className="about-placeholder-icon"></div>
            <div className="about-placeholder-text">Since 2019</div>
            <div className="relative z-[1] text-[13px] text-[color:var(--text-muted)] tracking-[2px]">
              TOMAS MORATO, QC
            </div>
          </div>
          <div className="about-float-card">
            <div className="afc-num">5,000+</div>
            <div className="afc-label">Community Members</div>
          </div>
        </div>
        <div className="about-content">
          <div className="section-eyebrow">Our Story</div>
          <h2 className="section-title">
            A Safe Space
            <br />
            <span className="bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-blue)] bg-clip-text text-transparent">
              For All Colors
            </span>
          </h2>
          <p className="section-desc">
            PRISMA was born from a simple belief: everyone deserves a place
            where they can be fully, unapologetically themselves. We're more
            than a bar — we're a home for Quezon City's vibrant LGBTQ+
            community.
          </p>
          <p className="section-desc" style={{ marginTop: '16px' }}>
            From our drag performers who light up the stage to our baristas who
            craft your favorite morning brew — every person at PRISMA is family.
          </p>

          <div className="about-values">
            <div className="value-card">
              <div className="value-icon">🛡️</div>
              <div className="value-title">Safe Space Policy</div>
              <div className="value-desc">
                Zero tolerance for discrimination. Everyone is welcome and
                protected.
              </div>
            </div>
            <div className="value-card">
              <div className="value-icon">🎭</div>
              <div className="value-title">Live Entertainment</div>
              <div className="value-desc">
                Drag shows, DJ sets, comedy & live music every week.
              </div>
            </div>
            <div className="value-card">
              <div className="value-icon">☕</div>
              <div className="value-title">Café by Day</div>
              <div className="value-desc">
                Coffee, brunch & bites from 10AM for the daytime crowd.
              </div>
            </div>
            <div className="value-card">
              <div className="value-icon">🏳️‍🌈</div>
              <div className="value-title">Community First</div>
              <div className="value-desc">
                10% of profits go to LGBTQ+ advocacy organizations.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
