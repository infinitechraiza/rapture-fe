"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const events = [
  { id: 1,  badge: "badge-tonight", badgeText: "Tonight",     date: "Mon, June 15 · 9PM",       title: "Drag Extravaganza Night",     desc: "The Philippines' most fabulous drag queens take the stage for a night of glam, shade, and laughter.",          img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80", h: 500 },
  { id: 2,  badge: "badge-weekly",  badgeText: "Weekly",      date: "Tue–Sat · 10PM–4AM",        title: "DJ Night: Neon Dreams",       desc: "House, dance pop, and BPM bangers curated by QC's top LGBTQ+ DJs. Dance floor opens at 10.",                   img: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&q=80", h: 240 },
  { id: 3,  badge: "badge-weekly",  badgeText: "Weekends",    date: "Sat & Sun · 11AM–3PM",      title: "Rainbow Brunch",              desc: "Free-flowing mimosas, bottomless pancakes, and live acoustic sets every Saturday and Sunday morning.",            img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600&q=80", h: 290 },
  { id: 4,  badge: "badge-special", badgeText: "Special",     date: "Sat, June 28 · All Day",    title: "Pride Month Closing Party",   desc: "A massive all-day celebration with local artists, pride parade viewing, and an electrifying night concert.",      img: "https://images.unsplash.com/photo-1561489413-985b06da5bee?w=600&q=80", h: 260 },
  { id: 5,  badge: "badge-weekly",  badgeText: "Weekly",      date: "Every Wednesday · 8PM",     title: "Karaoke Chaos Night",         desc: "Sing your heart out — or watch others do it. Prizes for best performance and most dramatic exit.",                img: "https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=600&q=80", h: 240 },
  { id: 6,  badge: "badge-special", badgeText: "Monthly",     date: "Last Friday · 9:30PM",      title: "Queer Comedy Night",          desc: "Stand-up comedy by and for the community. Expect sharp wit, personal stories, and ugly crying (from laughter).",  img: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&q=80", h: 310 },
  { id: 7,  badge: "badge-soon",    badgeText: "Coming Soon", date: "Fri, July 5 · 8PM",         title: "Live Band Extravaganza",      desc: "Local indie and pop bands perform live in an intimate setting. Perfect for discovering new artists.",              img: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=600&q=80", h: 280 },
  { id: 8,  badge: "badge-weekly",  badgeText: "Weekly",      date: "Mon & Thu · 7PM",           title: "Makeup Artist Meet & Greet",  desc: "Connect with professional makeup artists, get tips and tricks, and enjoy special discounts on beauty products.",   img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80", h: 340 },
  { id: 9,  badge: "badge-weekly",  badgeText: "Weekends",    date: "Fri, Sat & Sun · 5PM–8PM",  title: "Happy Hour Fiesta",           desc: "50% off cocktails and appetizers during our golden hour. Perfect for after-work hangouts and celebrations.",       img: "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?w=600&q=80", h: 250 },
  { id: 10, badge: "badge-special", badgeText: "Special",     date: "Sun, July 12 · 6PM",        title: "Theater Workshop & Showcase", desc: "Learn from local theater actors and performers, then watch showcase performances. Open to all levels.",            img: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&q=80", h: 260 },
  { id: 11, badge: "badge-weekly",  badgeText: "Weekly",      date: "Tue & Fri · 9PM",           title: "Battle of the Bands",         desc: "Local bands compete on stage for prizes and bragging rights. Vote for your favorite performers.",                 img: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&q=80", h: 290 },
  { id: 12, badge: "badge-special", badgeText: "Special",     date: "Sat, July 19 · 10PM",       title: "Celebrity Guest Night",       desc: "Special performances by international LGBTQ+ artists and influencers. Limited tickets available.",                img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80", h: 250 },
];

const GALLERY_FILTERS = ["All", "Tonight", "Weekly", "Special", "Monthly"];
const GALLERY_PER_PAGE = 9;

export function Gallery() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered =
    activeFilter === "All" ? events :
    activeFilter === "Weekly" ? events.filter((e) => e.badge === "badge-weekly") :
    events.filter((e) => e.badgeText === activeFilter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / GALLERY_PER_PAGE));
  const start = (currentPage - 1) * GALLERY_PER_PAGE;
  const slice = filtered.slice(start, start + GALLERY_PER_PAGE);

  const handleFilter = (f: string) => { setActiveFilter(f); setCurrentPage(1); };
  const goPage = (p: number) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <section id="gallery">
      <style>{`
        /* ── Masonry card: full-bleed image, hover text ── */
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1rem;
          cursor: pointer;
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255,255,255,0.07);
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
        }
        .masonry-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.6);
          border-color: rgba(255,45,155,0.35);
        }

        /* Image fills the card completely, fixed height via inline style */
        .masonry-item .card-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.45s ease;
        }
        .masonry-item:hover .card-photo {
          transform: scale(1.06);
        }

        /* Overlay: hidden by default, slides in on hover */
        .masonry-item .card-overlay {
          position: absolute;
          inset: 0;
          /* gradient: transparent top → dark bottom */
          background: linear-gradient(
            to top,
            rgba(6,6,20,0.97) 0%,
            rgba(6,6,20,0.72) 38%,
            rgba(6,6,20,0.15) 65%,
            transparent 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          padding: 1.5rem;
          gap: 4px;
          /* Text starts slightly below, fades in */
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          border-radius: 14px;
        }
        .masonry-item:hover .card-overlay {
          opacity: 1;
          transform: translateY(0);
        }

        /* Badge always visible (subtle, top-left) */
        .masonry-item .card-badge-static {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
          opacity: 0.9;
        }

        .card-overlay .event-date {
          font-size: 11px;
          color: var(--neon-pink);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .card-overlay .event-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          line-height: 1.25;
          margin-bottom: 4px;
        }
        .card-overlay .event-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="gallery-inner">
        <div className="gallery-header">
          <div>
            <div className="section-eyebrow">What's On</div>
            <h2 className="section-title">
              Here Our<br />
              <span style={{ background: "linear-gradient(90deg, var(--neon-pink), var(--neon-purple))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Gallery
              </span>
            </h2>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="gallery-filters">
          {GALLERY_FILTERS.map((f) => (
            <button key={f} onClick={() => handleFilter(f)} className={`gallery-filter-tab${activeFilter === f ? " active" : ""}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="masonry-grid">
          {slice.map((event) => (
            <div key={event.id} className="masonry-item" style={{ height: event.h }}>
              {/* Always-visible badge */}
              <span className={`event-badge ${event.badge} card-badge-static`}>{event.badgeText}</span>

              {/* Full-bleed image */}
              <img
                className="card-photo"
                src={event.img}
                alt={event.title}
                style={{ height: event.h }}
                loading="lazy"
              />

              {/* Hover overlay with text */}
              <div className="card-overlay">
                <div className="event-date">{event.date}</div>
                <div className="event-title">{event.title}</div>
                <div className="event-desc">{event.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination-row">
          <button className="page-btn" onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-num${p === currentPage ? " active" : ""}`} onClick={() => goPage(p)}>{p}</button>
            ))}
          </div>
          <button className="page-btn" onClick={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next <ChevronRight size={16} />
          </button>
        </div>
        <div className="page-info">
          Page {currentPage} of {totalPages} · Showing {start + 1}–{Math.min(start + GALLERY_PER_PAGE, filtered.length)} of {filtered.length} events
        </div>
      </div>
    </section>
  );
}

export default Gallery;