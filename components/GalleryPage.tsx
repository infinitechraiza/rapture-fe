import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';


export const GALLERY_ITEMS = [
  { id: 1, tag: "Live Show", title: "Drag Extravaganza", desc: "Glam, shade & laughter every Monday.", img: "https://images.unsplash.com/photo-1571266028243-d220c9c3b31e?w=600&q=80", h: 280 },
  { id: 2, tag: "Weekly", title: "Neon Dreams DJ Set", desc: "House & dance pop till 4AM.", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80", h: 170 },
  { id: 3, tag: "Community", title: "Pride All Year", desc: "A flag for every guest.", img: "https://images.unsplash.com/photo-1561485132-59468cb2adee?w=600&q=80", h: 200 },
  { id: 4, tag: "Signature", title: "Neon Blue Lagoon", desc: "Our glow-in-the-dark cocktail.", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80", h: 300 },
  { id: 5, tag: "Wednesdays", title: "Karaoke Chaos Night", desc: "Sing your heart out, win prizes.", img: "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=600&q=80", h: 340 },
  { id: 6, tag: "Brunch", title: "Bottomless Mimosas", desc: "Weekend brunch with the squad.", img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80", h: 180 },
  { id: 7, tag: "Friday", title: "Dance Floor Energy", desc: "Where the night really comes alive.", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80", h: 220 },
  { id: 8, tag: "Safe Space", title: "Every Color Welcome", desc: "A home for the whole community.", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80", h: 280 },
  { id: 9, tag: "Special", title: "Pride Closing Party", desc: "An all-day celebration to remember.", img: "https://images.unsplash.com/photo-1496843916299-590492c751f4?w=600&q=80", h: 320 },
  { id: 10, tag: "Bar", title: "Pink Goddess", desc: "Pretty, powerful, just like you.", img: "https://images.unsplash.com/photo-1546171753-97d61d67f3f6?w=600&q=80", h: 200 },
  { id: 11, tag: "Vibe", title: "Late Night Moves", desc: "No judgment, just rhythm.", img: "https://images.unsplash.com/photo-1571935441005-15de8c5e3eba?w=600&q=80", h: 180 },
  { id: 12, tag: "Monthly", title: "Live Music Sessions", desc: "Acoustic sets that hit different.", img: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=600&q=80", h: 260 },
  { id: 13, tag: "Stage", title: "Queens Take Over", desc: "Fabulous, fierce, unforgettable.", img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80", h: 240 },
  { id: 14, tag: "Lounge", title: "VIP Lounge Vibes", desc: "Where regulars become family.", img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9d96?w=600&q=80", h: 200 },
  { id: 15, tag: "Tonight", title: "Center Stage", desc: "Every spotlight tells a story.", img: "https://images.unsplash.com/photo-1542406775-d4be12cb6019?w=600&q=80", h: 300 },
];
export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const tabs = ["All", "Live Show", "Bar", "Community", "Stage", "Brunch"];

  const filteredItems = filter === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.tag.toLowerCase().includes(filter.toLowerCase()) || filter.toLowerCase().includes(item.tag.toLowerCase()));

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const col1: typeof GALLERY_ITEMS = [];
  const col2: typeof GALLERY_ITEMS = [];
  const col3: typeof GALLERY_ITEMS = [];
  paginatedItems.forEach((item, i) => {
    if (i % 3 === 0) col1.push(item);
    else if (i % 3 === 1) col2.push(item);
    else col3.push(item);
  });

  return (
    <div className="w-full text-white" style={{ background: '#060614' }}>

      {/* ── SECTION 1: Hero Banner ──────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Split collage */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
          {[GALLERY_ITEMS[0], GALLERY_ITEMS[4], GALLERY_ITEMS[7]].map((item, i) => (
            <div key={i} style={{ flex: 1, position: 'relative', overflow: 'hidden', display: i > 0 ? undefined : undefined }}>
              <img src={item.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45, filter: 'blur(2px)', transform: 'scale(1.05)' }} />
            </div>
          ))}
        </div>
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,6,20,0.7) 0%, rgba(6,6,20,0.5) 40%, rgba(6,6,20,0.9) 100%)' }} />
        {/* Neon side glows */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '30%', background: 'linear-gradient(90deg, rgba(255,45,155,0.12) 0%, transparent 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '30%', background: 'linear-gradient(270deg, rgba(0,212,255,0.1) 0%, transparent 100%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '60px 24px', maxWidth: 800, margin: '0 auto' }}>
          <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#b94fff', fontWeight: 700, display: 'block', marginBottom: 14 }}>
            Every Night A Story
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: 'clamp(42px,8vw,80px)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 18px' }}>
            The Vibe at <span className="text-gradient">RAPTURE</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', marginBottom: 36, lineHeight: 1.6 }}>
            Drag, laughter, cocktails, and community — captured.
          </motion.p>

          {/* Filter tabs */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => { setFilter(tab); setPage(1); }}
                style={{
                  padding: '8px 18px',
                  borderRadius: 50,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif',
                  transition: 'all 0.2s',
                  background: filter === tab ? 'rgba(255,45,155,0.2)' : 'rgba(255,255,255,0.06)',
                  border: filter === tab ? '1px solid rgba(255,45,155,0.6)' : '1px solid rgba(255,255,255,0.12)',
                  color: filter === tab ? '#fff' : 'rgba(255,255,255,0.55)',
                  boxShadow: filter === tab ? '0 0 18px rgba(255,45,155,0.25)' : 'none',
                }}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Neon divider strip */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #ff2d9b 20%, #b94fff 50%, #00d4ff 80%, transparent)', opacity: 0.6 }} />

      {/* ── SECTION 2: Masonry Grid ─────────────────────────── */}
      <section style={{ position: 'relative', padding: '64px 24px 80px', minHeight: '60vh', background: 'linear-gradient(180deg, #0a0520 0%, #080316 30%, #0d0428 60%, #060614 100%)' }}>

        {/* Background decoration */}
        <div style={{ position: 'absolute', top: 80, left: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(185,79,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 200, right: '3%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 100, left: '40%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,45,155,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Subtle dot grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(185,79,255,0.25) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.2, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {paginatedItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.4)' }}>
              <p style={{ fontSize: 18, fontWeight: 700 }}>No photos for this category.</p>
              <button onClick={() => setFilter("All")} style={{ marginTop: 12, color: '#ff2d9b', background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                View all photos
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {col1.map(item => <GalleryCard key={item.id} item={item} />)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
                {col2.map(item => <GalleryCard key={item.id} item={item} />)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {col3.map(item => <GalleryCard key={item.id} item={item} />)}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 64 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              >
                <ArrowLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  style={{ width: 36, height: 36, borderRadius: 8, border: page === i + 1 ? '1px solid #ff2d9b' : '1px solid rgba(255,255,255,0.1)', background: page === i + 1 ? 'rgba(255,45,155,0.2)' : 'transparent', color: page === i + 1 ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', boxShadow: page === i + 1 ? '0 0 14px rgba(255,45,155,0.3)' : 'none', transition: 'all 0.2s' }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Strip ────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '72px 24px', borderTop: '1px solid rgba(185,79,255,0.2)', overflow: 'hidden', background: 'linear-gradient(135deg, #120630 0%, #060614 50%, #0a1a30 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(185,79,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(185,79,255,0.15) 1px, transparent 1px)', backgroundSize: '48px 48px', opacity: 0.12, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(185,79,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#b94fff', fontWeight: 700, marginBottom: 16 }}>Be Part of the Story</p>
          <h2 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 24px' }}>Ready to make your own memories?</h2>
          <Link
            href="/contact"
            style={{ display: 'inline-block', background: 'linear-gradient(135deg, #ff2d9b, #b94fff)', color: '#fff', borderRadius: 50, padding: '14px 36px', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none', boxShadow: '0 0 30px rgba(255,45,155,0.4)', transition: 'all 0.2s' }}
          >
            Experience It Live. Book A Table →
          </Link>
        </div>
      </section>
    </div>
  );
}

function GalleryCard({ item }: { item: typeof GALLERY_ITEMS[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        height: item.h,
        border: hovered ? '1px solid rgba(185,79,255,0.5)' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: hovered ? '0 0 30px rgba(185,79,255,0.2), 0 8px 32px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        background: '#0d0d2b',
      }}
    >
      <img
        src={item.img}
        alt={item.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.6s ease' }}
      />

      {/* Tag */}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, padding: '4px 10px', fontSize: 9, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
        {item.tag}
      </div>

      {/* Hover overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,6,20,0.96) 0%, rgba(6,6,20,0.4) 50%, transparent 100%)', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 18 }}>
        <div style={{ transform: hovered ? 'translateY(0)' : 'translateY(12px)', transition: 'transform 0.35s ease' }}>
          <div style={{ width: 24, height: 2, background: '#ff2d9b', marginBottom: 8, borderRadius: 2 }} />
          <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>{item.title}</h4>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}
