"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react";

type ApiEvent = {
  id: number;
  title: string;
  event_date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:mm" or "HH:mm:ss"
  end_time: string;
  color: string;
  description: string | null;
  comedians?: { id: number; name: string }[];
};

type DisplayEvent = {
  id: number;
  img: string;
  badge: string;
  badgeColor: string;
  title: string;
  desc: string;
  date: string;
  time: string;
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=700&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80",
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=700&q=80",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=700&q=80",
  "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=700&q=80",
  "https://images.unsplash.com/photo-1496843916299-590492c751f4?w=700&q=80",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toDateParam(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Combine "YYYY-MM-DD" + "HH:mm[:ss]" into a real Date, treated as local time
// (matches the Event model's deliberate choice not to cast event_date/UTC-shift it).
function toLocalDateTime(dateStr: string, timeStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, min] = timeStr.split(":").map(Number);
  return new Date(y, m - 1, d, h, min);
}

function formatDisplayDate(d: Date, now: Date) {
  const isToday = d.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();

  if (isToday) return "Today";
  if (isTomorrow) return "Tomorrow";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatDisplayTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function badgeFor(d: Date, now: Date): { label: string; color: string } {
  const hoursAway = (d.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursAway <= 12)
    return {
      label: "Tonight",
      color: "linear-gradient(135deg,#ff2d9b,#b94fff)",
    };
  if (d.toDateString() === now.toDateString())
    return { label: "Today", color: "linear-gradient(135deg,#ff2d9b,#b94fff)" };
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (d.toDateString() === tomorrow.toDateString())
    return {
      label: "Tomorrow",
      color: "linear-gradient(135deg,#00d4ff,#7b2fff)",
    };
  return {
    label: "Upcoming",
    color: "linear-gradient(135deg,#00d4ff,#b94fff)",
  };
}

export function Show() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    fetchUpcoming();
  }, []);

  async function fetchUpcoming() {
    setLoading(true);
    try {
      const now = new Date();
      const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

      const params = new URLSearchParams({
        start_date: toDateParam(now),
        end_date: toDateParam(in48h),
        per_page: "50",
      });

      const res = await fetch(`/api/event?${params.toString()}`);
      if (!res.ok) return;

      const json = await res.json();
      // Laravel paginate() wraps results as data.data
      const list: ApiEvent[] = json?.data?.data ?? [];
      setEvents(list);
    } catch {
      // network error — leave list empty rather than break the page
    } finally {
      setLoading(false);
    }
  }

  // The date-range query is day-granular, so narrow further to the exact
  // 48-hour window and sort chronologically.
  const upcoming = useMemo<DisplayEvent[]>(() => {
    const now = new Date();
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    return events
      .map((ev) => {
        const start = toLocalDateTime(ev.event_date, ev.start_time);
        const end = toLocalDateTime(ev.event_date, ev.end_time);
        return { ev, start, end };
      })
      .filter(({ start }) => start >= now && start <= in48h)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .map(({ ev, start, end }, i) => {
        const badge = badgeFor(start, now);
        return {
          id: ev.id,
          img: FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
          badge: badge.label,
          badgeColor: badge.color,
          title: ev.title,
          desc:
            ev.description ??
            (ev.comedians?.map((c) => c.name).join(", ") || ""),
          date: formatDisplayDate(start, now),
          time: `${formatDisplayTime(start)} – ${formatDisplayTime(end)}`,
        };
      });
  }, [events]);

  const total = upcoming.length;
  const prev = () => setCur((c) => (c - 1 + total) % total);
  const next = () => setCur((c) => (c + 1) % total);
  const visible =
    total === 0
      ? []
      : [0, 1, 2]
          .filter((i) => i < total)
          .map((i) => upcoming[(cur + i) % total]);

  return (
    <section
      id="events"
      className="section-glow-bg show-section"
      style={{ padding: "100px 48px" }}
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

        {/* Loading / Empty / Grid */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "60px 0",
            }}
          >
            <Loader2
              className="animate-spin"
              size={28}
              style={{ color: "#b94fff" }}
            />
          </div>
        ) : total === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "rgba(255,255,255,0.4)",
              fontSize: 14,
            }}
          >
            No shows in the next 48 hours — check back soon.
          </div>
        ) : (
          <>
            <div
              className="show-grid grid xl:grid-col-3 md:grid-col-3 sm:grid-col-1"
              style={{ gap: 20, marginBottom: 32 }}
            >
              {visible.map((ev, i) => (
                <div key={`${ev.id}-${cur}-${i}`} className="event-card">
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
                    {ev.desc && (
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
                    )}
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
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Calendar size={11} />
                        {ev.date}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Clock size={11} />
                        {ev.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls - Navigation (only show if there's more than fits on screen) */}
            {total > 3 && (
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
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.25)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.15)";
                  }}
                  aria-label="Previous events"
                >
                  <ChevronLeft size={18} />
                </button>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {upcoming.map((_, i) => (
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
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Show;
