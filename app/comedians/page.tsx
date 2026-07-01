"use client";

import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { X, ChevronRight, Star, Mic } from 'lucide-react';

export const COMEDIANS = [
  { id: 1, name: "Alex Reyes", tagline: '"The Shade Queen"', category: "Observational & Political", description: "QC's sharpest tongue meets the most fabulous mind. Alex delivers truth bombs wrapped in glitter — political commentary that makes you laugh until you realize you agree with everything. A RAPTURE original.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face", tagColor: "#ff2d9b", featured: true },
  { id: 2, name: "Jamie Cruz", tagline: '"Kuya Divert"', category: "Self-Deprecating & Family", description: "Turning awkward family reunions into 20-minute sets. Somehow makes you call your nanay right after the show. Warm, relatable, and devastatingly funny.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", tagColor: "#00d4ff", featured: true },
  { id: 3, name: "Sam Dela Rosa", tagline: '"The Confessor"', category: "Coming-Out & Dating", description: "Every story Sam tells sounds unbelievable. Every single word of it is true. Bring tissue because the laughs hit hard and the feels hit harder.", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face", tagColor: "#b94fff", featured: false },
  { id: 4, name: "Nico Bautista", tagline: '"Señorita Chaos"', category: "Drag Comedy & Impressions", description: "Half stand-up, half drag performance, 100% chaos. Nico doesn't do shows — Nico throws events. Front row advised: wear something you don't mind getting rhinestones on.", img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop&crop=face", tagColor: "#ff2d9b", featured: false },
  { id: 5, name: "Pat Villanueva", tagline: '"The Good Vibes"', category: "Mental Health & Queer Life", description: "Comedy that makes you laugh until you realize you have a lot to unpack. Pat covers the entire queer experience with warmth, wit, and weaponized vulnerability.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face", tagColor: "#00d4ff", featured: false },
  { id: 6, name: "Rio Magno", tagline: '"Rio Tita"', category: "Pop Culture & OPM", description: "Knows every telenovela twist and every VMAs shade — and will perform all of it. Front row will be assigned characters. You have been warned.", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face", tagColor: "#b94fff", featured: false },
];


export default function Comedians() {
  const [selectedComedian, setSelectedComedian] = useState<typeof COMEDIANS[0] | null>(null);

  // Featured (large hero cards): first 2
  const featured = COMEDIANS.filter(c => c.featured);
  // All 6 in a secondary multi-card strip
  const allSix = COMEDIANS;

  return (
    <div className="w-full text-white" style={{ background: '#060614' }}>

      {/* ── SECTION 1: Featured Headliners ─────────────────── */}
      <section style={{ position: 'relative', padding: '80px 24px 64px', overflow: 'hidden' }}>
        {/* Background glows */}
        <div style={{ position: 'absolute', top: '10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,45,155,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '40%', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(185,79,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#ff2d9b', fontWeight: 700, display: 'block', marginBottom: 12 }}>Headlining RAPTURE</span>
            <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
              Featured <span className="text-gradient">Headliners</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 12, fontSize: 15 }}>QC's boldest voices — live on the RAPTURE stage</p>
          </motion.div>

          {/* Row 1: 2 large hero cards side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 24 }}>
            {featured.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                onClick={() => setSelectedComedian(c)}
                style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', cursor: 'pointer', border: `1px solid ${c.tagColor}50`, boxShadow: `0 0 50px ${c.tagColor}15, 0 8px 40px rgba(0,0,0,0.5)`, background: '#0d0d2b', transition: 'transform 0.3s, box-shadow 0.3s' }}
                whileHover={{ y: -6, boxShadow: `0 0 70px ${c.tagColor}30, 0 20px 60px rgba(0,0,0,0.6)` }}
              >
                {/* Star badge */}
                <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, background: c.tagColor, borderRadius: 50, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${c.tagColor}60` }}>
                  <Star size={14} fill="#fff" color="#fff" />
                </div>

                {/* Photo */}
                <div style={{ height: 340, position: 'relative', overflow: 'hidden' }}>
                  <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }} />
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, #0d0d2b 0%, rgba(13,13,43,0.5) 50%, transparent 100%)` }} />
                  {/* Category pill */}
                  <div style={{ position: 'absolute', top: 16, left: 16, background: `${c.tagColor}20`, border: `1px solid ${c.tagColor}60`, borderRadius: 50, padding: '4px 12px', fontSize: 10, fontWeight: 700, color: c.tagColor, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    {c.category}
                  </div>
                </div>

                {/* Text */}
                <div style={{ padding: '20px 24px 24px' }}>
                  <h2 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 4px', color: '#fff' }}>{c.name}</h2>
                  <p style={{ fontSize: 15, fontStyle: 'italic', color: c.tagColor, margin: '0 0 12px', fontWeight: 600 }}>{c.tagline}</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, margin: '0 0 18px' }}>{c.description}</p>
                  <Link
                    href="/shows"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${c.tagColor}15`, border: `1px solid ${c.tagColor}50`, color: c.tagColor, borderRadius: 50, padding: '9px 20px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none', transition: 'all 0.2s' }}
                    onClick={e => e.stopPropagation()}
                  >
                    Book for Next Show <ChevronRight size={13} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Row 2: Remaining 4 in a horizontal multi-card row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {allSix.filter(c => !c.featured).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                onClick={() => setSelectedComedian(c)}
                style={{ borderRadius: 18, overflow: 'hidden', cursor: 'pointer', background: 'linear-gradient(145deg, #131328, #0d0d2b)', border: `1px solid ${c.tagColor}30`, transition: 'all 0.3s', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
                whileHover={{ y: -4, borderColor: `${c.tagColor}70`, boxShadow: `0 0 30px ${c.tagColor}18` }}
              >
                {/* Photo */}
                <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                  <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0d0d2b 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
                    <div style={{ fontSize: 9, color: c.tagColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', background: `${c.tagColor}15`, border: `1px solid ${c.tagColor}40`, borderRadius: 50, padding: '2px 8px', display: 'inline-block', marginBottom: 4 }}>
                      {c.category}
                    </div>
                  </div>
                </div>
                {/* Text */}
                <div style={{ padding: '14px 16px 18px' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 900, margin: '0 0 3px', color: '#fff' }}>{c.name}</h3>
                  <p style={{ fontSize: 12, fontStyle: 'italic', color: c.tagColor, margin: '0 0 10px' }}>{c.tagline}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.description}
                  </p>
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedComedian(c); }}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8, padding: '8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s' }}
                  >
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Glowing Divider */}
      <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, #b94fff, #00d4ff, transparent)', opacity: 0.4, margin: '8px 0' }} />

      {/* ── SECTION 2: Full Roster ─────────────────────────── */}
      <section style={{ padding: '64px 24px 80px', background: 'linear-gradient(180deg, #060614 0%, #0b0720 50%, #060614 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <span style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#00d4ff', fontWeight: 700, display: 'block', marginBottom: 10 }}>The Full Roster</span>
            <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, margin: 0 }}>
              All <span className="text-gradient">Comedians</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {allSix.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                style={{ background: 'linear-gradient(145deg, #131328, #1a1035)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s' }}
                whileHover={{ y: -4, borderColor: `${c.tagColor}50`, boxShadow: `0 0 30px ${c.tagColor}15` }}
                onClick={() => setSelectedComedian(c)}
              >
                <div style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
                  <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.6s' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #060614 0%, rgba(6,6,20,0.4) 50%, transparent 100%)' }} />
                  {c.featured && (
                    <div style={{ position: 'absolute', top: 10, left: 10, background: '#ff2d9b', borderRadius: 6, padding: '3px 8px', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Star size={8} fill="#fff" color="#fff" /> Featured
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 2px', color: '#fff' }}>{c.name}</h3>
                    <p style={{ fontSize: 12, fontStyle: 'italic', color: c.tagColor, margin: 0 }}>{c.tagline}</p>
                  </div>
                </div>
                <div style={{ padding: '14px 18px 18px' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>{c.category}</span>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.description}
                  </p>
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedComedian(c); }}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8, padding: '10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', transition: 'background 0.2s' }}
                  >
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modal ──────────────────────────────────────────── */}
      {selectedComedian && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedComedian(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={e => e.stopPropagation()}
            style={{ background: '#0d0d2b', border: `1px solid ${selectedComedian.tagColor}40`, borderRadius: 24, maxWidth: 680, width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: `0 0 60px ${selectedComedian.tagColor}20, 0 24px 80px rgba(0,0,0,0.8)` }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {/* Photo */}
              <div style={{ height: 280, position: 'relative', flexShrink: 0 }}>
                <img src={selectedComedian.img} alt={selectedComedian.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0d0d2b 0%, rgba(13,13,43,0.3) 60%, transparent 100%)' }} />
                <button
                  onClick={() => setSelectedComedian(null)}
                  style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={15} />
                </button>
              </div>
              {/* Content */}
              <div style={{ padding: '24px 28px 32px' }}>
                <div style={{ display: 'inline-block', background: `${selectedComedian.tagColor}15`, border: `1px solid ${selectedComedian.tagColor}50`, borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: selectedComedian.tagColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                  {selectedComedian.category}
                </div>
                <h3 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 4px', color: '#fff' }}>{selectedComedian.name}</h3>
                <p style={{ fontSize: 16, fontStyle: 'italic', color: selectedComedian.tagColor, margin: '0 0 16px', fontWeight: 600 }}>{selectedComedian.tagline}</p>
                <div style={{ width: 40, height: 2, background: 'rgba(255,255,255,0.1)', marginBottom: 16 }} />
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 24 }}>{selectedComedian.description}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link
                    href="/shows"
                    onClick={() => setSelectedComedian(null)}
                    style={{ flex: 1, display: 'block', textAlign: 'center', background: `linear-gradient(135deg, ${selectedComedian.tagColor}, #b94fff)`, color: '#fff', borderRadius: 12, padding: '13px', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textDecoration: 'none', boxShadow: `0 0 20px ${selectedComedian.tagColor}30` }}
                  >
                    See Their Next Show
                  </Link>
                  <button
                    onClick={() => setSelectedComedian(null)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: '13px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Mic size={14} /> Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
