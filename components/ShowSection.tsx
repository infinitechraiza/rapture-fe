"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";

export function Show() {
  const FEATURED_SHOWS = [
    {
      img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&q=80",
      badge: "Tonight",
      badgeColor: "linear-gradient(135deg,#ff2d9b,#b94fff)",
      title: "Drag Extravaganza Night",
      desc: "The Philippines' most fabulous drag queens — one stage, one unforgettable night.",
      date: "Mon, June 15",
      time: "9:00 PM",
    },
    {
      img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80",
      badge: "This Saturday",
      badgeColor: "linear-gradient(135deg,#00d4ff,#7b2fff)",
      title: "Pride Month Closing Party",
      desc: "An all-day celebration — live acts, parade viewing & electrifying concert.",
      date: "Sat, June 28",
      time: "All Day",
    },
    {
      img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80",
      badge: "Weekly",
      badgeColor: "linear-gradient(135deg,#00d4ff,#b94fff)",
      title: "DJ Night: Neon Dreams",
      desc: "House, dance pop & BPM bangers from QC's top LGBTQ+ DJs.",
      date: "Tue–Sat",
      time: "10:00 PM – 4:00 AM",
    },
  ];

  const EVENTS = [
    {
      img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=700&q=80",
      badge: "Tonight",
      badgeColor: "linear-gradient(135deg,#ff2d9b,#b94fff)",
      title: "Drag Extravaganza Night",
      desc: "The Philippines' most fabulous drag queens — one stage, one unforgettable night.",
      date: "Mon, June 15",
      time: "9:00 PM",
    },
    {
      img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80",
      badge: "Weekly",
      badgeColor: "linear-gradient(135deg,#00d4ff,#7b2fff)",
      title: "DJ Night: Neon Dreams",
      desc: "House, dance pop & BPM bangers from QC's top LGBTQ+ DJs.",
      date: "Tue–Sat",
      time: "10:00 PM – 4:00 AM",
    },
    {
      img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=700&q=80",
      badge: "Weekends",
      badgeColor: "linear-gradient(135deg,#00d4ff,#7b2fff)",
      title: "Rainbow Brunch",
      desc: "Free-flowing mimosas, bottomless pancakes, and live acoustic sets.",
      date: "Sat & Sun",
      time: "11:00 AM – 3:00 PM",
    },
    {
      img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=700&q=80",
      badge: "Special",
      badgeColor: "linear-gradient(135deg,#ff9d00,#ff2d9b)",
      title: "Pride Month Closing Party",
      desc: "An all-day celebration — live acts, parade viewing & electrifying concert.",
      date: "Sat, June 28",
      time: "All Day",
    },
    {
      img: "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=700&q=80",
      badge: "Weekly",
      badgeColor: "linear-gradient(135deg,#00d4ff,#7b2fff)",
      title: "Karaoke Chaos Night",
      desc: "Sing your heart out — prizes for best performance and most dramatic exit.",
      date: "Every Wednesday",
      time: "8:00 PM",
    },
    {
      img: "https://images.unsplash.com/photo-1496843916299-590492c751f4?w=700&q=80",
      badge: "Monthly",
      badgeColor: "linear-gradient(135deg,#ff9d00,#ff2d9b)",
      title: "Queer Comedy Night",
      desc: "Stand-up comedy by and for the community. Expect sharp wit and ugly crying.",
      date: "Last Friday",
      time: "9:30 PM",
    },
  ];

  const [cur, setCur] = useState(0);
  const total = EVENTS.length;
  const prev = () => setCur((c) => (c - 1 + total) % total);
  const next = () => setCur((c) => (c + 1) % total);
  const visible = [0, 1, 2].map((i) => EVENTS[(cur + i) % total]);

  return (
    <section
      id="events"
      className="section-glow-bg show-section"
      style={{ padding: "100px 48px" }} // Desktop first, overridden by media queries
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          className="show-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 48,
            gap: 20,
          }}
        >
          <div>
            <div
              className="show-header-label"
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: 12,
              }}
            >
              What's On
            </div>
            <h2
              className="show-heading"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "clamp(24px,4vw,52px)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#fff",
              }}
            >
              Upcoming
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg,#ff2d9b,#b94fff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Events & Shows
              </span>
            </h2>
          </div>
          <a
            href="#events"
            className="show-header-link"
            style={{
              padding: "10px 22px",
              borderRadius: 50,
              border: "1px solid rgba(185,79,255,0.4)",
              color: "#b94fff",
              fontWeight: 600,
              fontSize: 13,
              textDecoration: "none",
              background: "rgba(185,79,255,0.07)",
              whiteSpace: "nowrap",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "rgba(185,79,255,0.7)";
              e.currentTarget.style.background = "rgba(185,79,255,0.12)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgba(185,79,255,0.4)";
              e.currentTarget.style.background = "rgba(185,79,255,0.07)";
            }}
          >
            View All Events →
          </a>
        </div>

        {/* Event Cards Grid */}
        <div
          className="show-grid grid xl:grid-col-3 md:grid-col-3 sm:grid-col-1"
          style={{
           
            gap: 20,
            marginBottom: 32,
          }}
        >
          {visible.map((ev, i) => (
            <div key={`${ev.title}-${cur}-${i}`} className="event-card">
              <img src={ev.img} alt={ev.title} className="event-card-img" />
              <div className="event-card-overlay" />
              <div
                className="event-badge"
                style={{ background: ev.badgeColor }}
              >
                {ev.badge}
              </div>
              <div className="event-card-content">
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: 6,
                  }}
                >
                  {ev.title}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.55,
                    marginBottom: 12,
                  }}
                >
                  {ev.desc}
                </p>
                <div
                  className="event-card-info"
                  style={{
                    display: "flex",
                    gap: 14,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Calendar size={11} />
                    {ev.date}
                  </span>
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Clock size={11} />
                    {ev.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls - Navigation */}
        <div
          className="show-controls"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {/* Previous Button */}
          <button
            onClick={prev}
            className="show-prev-btn"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            }}
            aria-label="Previous events"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dot Indicators */}
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {EVENTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCur(i)}
                className={`show-dot ${i === cur ? "active" : ""}`}
                style={{
                  width: i === cur ? 24 : 7,
                  height: 7,
                  borderRadius: 50,
                  border: "none",
                  background:
                    i === cur
                      ? "linear-gradient(90deg,#00d4ff,#b94fff)"
                      : "rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
                aria-label={`Go to event ${i + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={next}
            className="show-next-btn"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#ff2d9b,#b94fff)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(255,45,155,0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(255,45,155,0.5)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 20px rgba(255,45,155,0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            aria-label="Next events"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Show;