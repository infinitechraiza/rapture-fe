"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const events = [
  {
    id: 1,
    badge: "badge-tonight",
    badgeText: "Tonight",
    date: "Mon, June 15 · 9PM",
    title: "Drag Extravaganza Night",
    desc: "The Philippines' most fabulous drag queens take the stage for a night of glam, shade, and laughter.",
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
  },
  {
    id: 2,
    badge: "badge-weekly",
    badgeText: "Weekly",
    date: "Tue–Sat · 10PM–4AM",
    title: "DJ Night: Neon Dreams",
    desc: "House, dance pop, and BPM bangers curated by QC's top LGBTQ+ DJs. Dance floor opens at 10.",
    img: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
  },
  {
    id: 3,
    badge: "badge-weekly",
    badgeText: "Weekends",
    date: "Sat & Sun · 11AM–3PM",
    title: "Rainbow Brunch",
    desc: "Free-flowing mimosas, bottomless pancakes, and live acoustic sets every Saturday and Sunday morning.",
    img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&q=80",
  },
  {
    id: 4,
    badge: "badge-special",
    badgeText: "Special",
    date: "Sat, June 28 · All Day",
    title: "Pride Month Closing Party",
    desc: "A massive all-day celebration with local artists, pride parade viewing, and an electrifying night concert.",
    img: "https://images.unsplash.com/photo-1561489413-985b06da5bee?w=800&q=80",
  },
  {
    id: 5,
    badge: "badge-weekly",
    badgeText: "Weekly",
    date: "Every Wednesday · 8PM",
    title: "Karaoke Chaos Night",
    desc: "Sing your heart out — or watch others do it. Prizes for best performance and most dramatic exit.",
    img: "https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=800&q=80",
  },
  {
    id: 6,
    badge: "badge-special",
    badgeText: "Monthly",
    date: "Last Friday · 9:30PM",
    title: "Queer Comedy Night",
    desc: "Stand-up comedy by and for the community. Expect sharp wit, personal stories, and ugly crying (from laughter).",
    img: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80",
  },
  {
    id: 7,
    badge: "badge-soon",
    badgeText: "Coming Soon",
    date: "Fri, July 5 · 8PM",
    title: "Live Band Extravaganza",
    desc: "Local indie and pop bands perform live in an intimate setting. Perfect for discovering new artists.",
    img: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80",
  },
  {
    id: 8,
    badge: "badge-weekly",
    badgeText: "Weekly",
    date: "Mon & Thu · 7PM",
    title: "Makeup Artist Meet & Greet",
    desc: "Connect with professional makeup artists, get tips and tricks, and enjoy special discounts on beauty products.",
    img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80",
  },
  {
    id: 9,
    badge: "badge-weekly",
    badgeText: "Weekends",
    date: "Fri, Sat & Sun · 5PM–8PM",
    title: "Happy Hour Fiesta",
    desc: "50% off cocktails and appetizers during our golden hour. Perfect for after-work hangouts and celebrations.",
    img: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?w=800&q=80",
  },
  {
    id: 10,
    badge: "badge-special",
    badgeText: "Special",
    date: "Sun, July 12 · 6PM",
    title: "Theater Workshop & Showcase",
    desc: "Learn from local theater actors and performers, then watch showcase performances. Open to all levels.",
    img: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80",
  },
  {
    id: 11,
    badge: "badge-weekly",
    badgeText: "Weekly",
    date: "Tue & Fri · 9PM",
    title: "Battle of the Bands",
    desc: "Local bands compete on stage for prizes and bragging rights. Vote for your favorite performers.",
    img: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80",
  },
  {
    id: 12,
    badge: "badge-special",
    badgeText: "Special",
    date: "Sat, July 19 · 10PM",
    title: "Celebrity Guest Night",
    desc: "Special performances by international LGBTQ+ artists and influencers. Limited tickets available.",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
  },
];

const EVENTS_PER_PAGE = 6;

export function ShowPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const startIdx = (currentPage - 1) * EVENTS_PER_PAGE;
  const currentEvents = events.slice(startIdx, startIdx + EVENTS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="events">
      <style>{`
        /* ── Event card: full-bleed image + hover overlay ── */
        .show-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.07);
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
          height: 360px;
        }
        .show-card:hover {
          transform: translateY(-6px);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.6),
            0 0 40px rgba(255, 45, 155, 0.15);
          border-color: rgba(255, 45, 155, 0.35);
        }

        /* Full-bleed image */
        .show-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.45s ease;
        }
        .show-card:hover .show-card-img {
          transform: scale(1.07);
        }

        /* Badge — always visible, top-left */
        .show-card-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 3;
        }

        /* Overlay — fades in on hover */
        .show-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(6, 6, 20, 0.97) 0%,
            rgba(6, 6, 20, 0.75) 40%,
            rgba(6, 6, 20, 0.1) 70%,
            transparent 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          padding: 28px;
          gap: 5px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          border-radius: 20px;
          z-index: 2;
        }
        .show-card:hover .show-card-overlay {
          opacity: 1;
          transform: translateY(0);
        }

        .show-card-overlay .event-date {
          font-size: 11px;
          color: var(--neon-pink);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .show-card-overlay .event-title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          line-height: 1.25;
        }
        .show-card-overlay .event-desc {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* badge-soon variant (not in globals) */
        .badge-soon {
          background: rgba(255, 200, 0, 0.18);
          color: #ffc800;
          border: 1px solid rgba(255, 200, 0, 0.45);
          padding: 5px 12px;
          border-radius: 50px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
      `}</style>

      <div className="events-inner">
        <div className="events-header">
          <div>
            <div className="section-eyebrow">What's On</div>
            <h2 className="section-title">
              Upcoming<br />
              <span style={{
                background: "linear-gradient(90deg, var(--neon-pink), var(--neon-purple))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Events & Shows
              </span>
            </h2>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="events-grid">
          {currentEvents.map((event) => (
            <div key={event.id} className="show-card">
              {/* Always-visible badge */}
              <span className={`event-badge ${event.badge} show-card-badge`}>
                {event.badgeText}
              </span>

              {/* Full-bleed image */}
              <img
                className="show-card-img"
                src={event.img}
                alt={event.title}
                loading="lazy"
              />

              {/* Hover overlay */}
              <div className="show-card-overlay">
                <div className="event-date">{event.date}</div>
                <div className="event-title">{event.title}</div>
                <div className="event-desc">{event.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination-row">
          <button
            className="page-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-num${p === currentPage ? " active" : ""}`}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            className="page-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>

        <div className="page-info">
          Page {currentPage} of {totalPages} · Showing {startIdx + 1}–
          {Math.min(startIdx + EVENTS_PER_PAGE, events.length)} of {events.length} events
        </div>
      </div>
    </section>
  );
}

export default ShowPage;