"use client";


import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Calendar, Clock, Users, Tag, AlertTriangle, CheckCircle2, Loader } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
type Status = 'Confirmed' | 'Pending' | 'Cancelled';

interface Reservation {
  id: number;
  year: number;
  month: number; // 0-indexed
  day: number;
  event: string;
  time: string;
  party: number;
  status: Status;
  table: string;
  note?: string;
}

// ─── Mock Data (June & July 2026) ────────────────────────────
const INITIAL_RESERVATIONS: Reservation[] = [
  { id: 1, year: 2026, month: 5, day: 4,  event: 'Drag Extravaganza Night',   time: '9:00 PM', party: 4, status: 'Confirmed', table: 'Table 7 – Front Row',  note: 'Birthday celebration — extra confetti please!' },
  { id: 2, year: 2026, month: 5, day: 7,  event: 'DJ Night: Neon Dreams',     time: '10:00 PM', party: 2, status: 'Confirmed', table: 'Table 12 – Bar Area' },
  { id: 3, year: 2026, month: 5, day: 14, event: 'Rainbow Brunch',            time: '11:00 AM', party: 6, status: 'Pending',   table: 'Table 3 – Patio',     note: 'Vegan options needed for 2 guests.' },
  { id: 4, year: 2026, month: 5, day: 21, event: 'Queer Comedy Night',        time: '9:30 PM',  party: 3, status: 'Confirmed', table: 'Table 5 – Center Stage View' },
  { id: 5, year: 2026, month: 5, day: 28, event: 'Pride Month Closing Party', time: 'All Day',  party: 8, status: 'Pending',   table: 'VIP Booth 1',         note: 'Pride group package — please confirm parade viewing spot.' },
  { id: 6, year: 2026, month: 6, day: 5,  event: 'Live Band Extravaganza',    time: '8:00 PM',  party: 2, status: 'Confirmed', table: 'Table 9 – Side Stage' },
  { id: 7, year: 2026, month: 6, day: 12, event: 'Karaoke Chaos Night',       time: '8:00 PM',  party: 5, status: 'Pending',   table: 'Table 2 – Main Floor' },
  { id: 8, year: 2026, month: 6, day: 19, event: 'Celebrity Guest Night',     time: '10:00 PM', party: 2, status: 'Confirmed', table: 'Table 14 – VIP Lounge' },
];

const STATUS_CONFIG: Record<Status, { color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  Confirmed: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.35)', icon: CheckCircle2 },
  Pending:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', icon: Loader },
  Cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.30)', icon: X },
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ─── Helpers ─────────────────────────────────────────────────
function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { day: number; thisMonth: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, thisMonth: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, thisMonth: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, thisMonth: false });
  return cells;
}

// ─── Modal ────────────────────────────────────────────────────
function ReservationModal({ res, onClose, onCancel }: { res: Reservation; onClose: () => void; onCancel: (id: number) => void }) {
  const cfg = STATUS_CONFIG[res.status];
  const StatusIcon = cfg.icon;

  const handleCancel = () => {
    onCancel(res.id);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          style={{ background: 'linear-gradient(145deg, #131328, #1a1035)', border: '1px solid rgba(185,79,255,0.3)', borderRadius: 24, width: '100%', maxWidth: 480, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 60px rgba(185,79,255,0.15)' }}
        >
          {/* Rainbow bar */}
          <div style={{ height: 4, background: 'linear-gradient(90deg, #ff2d9b, #b94fff, #00d4ff)' }} />

          {/* Header */}
          <div style={{ padding: '22px 24px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#b94fff', fontWeight: 700, marginBottom: 6 }}>Booking Details</div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>{res.event}</h3>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
              <X size={15} />
            </button>
          </div>

          {/* Status badge */}
          <div style={{ padding: '0 24px 18px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 50, padding: '6px 14px' }}>
              <StatusIcon size={14} style={{ color: cfg.color }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{res.status}</span>
            </div>
          </div>

          {/* Details grid */}
          <div style={{ padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
            {[
              { icon: Calendar, label: 'Date', value: `${MONTH_NAMES[res.month]} ${res.day}, ${res.year}`, color: '#00d4ff' },
              { icon: Clock,    label: 'Time', value: res.time,                                            color: '#b94fff' },
              { icon: Users,    label: 'Party Size', value: `${res.party} guest${res.party > 1 ? 's' : ''}`, color: '#ff2d9b' },
              { icon: Tag,      label: 'Table',  value: res.table,                                         color: '#00d4ff' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Icon size={13} style={{ color }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Note */}
          {res.note && (
            <div style={{ margin: '0 24px 18px', background: 'rgba(185,79,255,0.08)', border: '1px solid rgba(185,79,255,0.2)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
              <span style={{ fontWeight: 700, color: '#b94fff' }}>Note: </span>{res.note}
            </div>
          )}

          {/* Actions */}
          <div style={{ padding: '16px 24px 24px', display: 'flex', gap: 10 }}>
            <Link href="/shows" onClick={onClose} style={{ flex: 1, background: 'linear-gradient(135deg, #ff2d9b, #b94fff)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(255,45,155,0.25)' }}>
              View Shows
            </Link>
            {res.status !== 'Cancelled' && (
              <button
                onClick={handleCancel}
                style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', color: '#ef4444', borderRadius: 10, padding: '12px', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)'; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; }}
              >
                <AlertTriangle size={14} /> Cancel
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function Reservations() {
  const now = new Date(2026, 5, 29); // Today: June 29 2026
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle');

  const calendarDays = buildCalendarDays(viewYear, viewMonth);

  const resByDay: Record<number, Reservation[]> = {};
  for (const r of reservations) {
    if (r.year === viewYear && r.month === viewMonth) {
      resByDay[r.day] = resByDay[r.day] ? [...resByDay[r.day], r] : [r];
    }
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleCancel = (id: number) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'Cancelled' as Status } : r));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('success');
  };

  const isToday = (day: number) => viewYear === now.getFullYear() && viewMonth === now.getMonth() && day === now.getDate();

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: '12px 16px',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'Space Grotesk, sans-serif',
    transition: 'border-color 0.2s',
  };

  // Count active (non-cancelled) bookings this month
  const activeCount = reservations.filter(r => r.year === viewYear && r.month === viewMonth && r.status !== 'Cancelled').length;

  return (
    <div className="w-full text-white" style={{ background: '#060614', minHeight: '100vh' }}>

      {/* SECTION 1 — Banner */}
      <section style={{ position: 'relative', minHeight: '45vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(0,212,255,0.1)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a0b2e 0%, #060614 100%)' }} />
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'linear-gradient(rgba(185,79,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(185,79,255,0.6) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '-20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(185,79,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '40px 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#ff2d9b', fontWeight: 700, display: 'block', marginBottom: 12 }}>Your RAPTURE Bookings</span>
            <h1 style={{ fontSize: 'clamp(38px,6vw,58px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 14px' }}>
              My <span className="text-gradient">Reservations</span>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 400, margin: '0 auto 28px' }}>
              Track, manage, and cancel your upcoming table bookings at RAPTURE.
            </p>
            <button
              onClick={"/booking" as any}
              style={{ background: 'linear-gradient(135deg, #ff2d9b, #b94fff)', color: '#fff', border: 'none', borderRadius: 50, padding: '12px 32px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 0 24px rgba(255,45,155,0.35)', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Book a New Table
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — Calendar + Form */}
      <section style={{ padding: '60px 24px 80px', maxWidth: 900, margin: '0 auto' }}>

        {/* ── Today's Bookings ── */}
        {(() => {
          const todayBookings = reservations.filter(
            r => r.year === now.getFullYear() && r.month === now.getMonth() && r.day === now.getDate()
          );
          return (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: 32 }}
            >
              {/* Today label row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff2d9b', boxShadow: '0 0 8px #ff2d9b' }} />
                  <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)' }}>
                    Today — {MONTH_NAMES[now.getMonth()]} {now.getDate()}, {now.getFullYear()}
                  </span>
                </div>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              </div>

              {todayBookings.length === 0 ? (
                /* Empty state */
                <div style={{ background: 'linear-gradient(145deg, #131328, #1a1035)', border: '1px solid rgba(185,79,255,0.18)', borderRadius: 20, padding: '32px 28px', display: 'flex', alignItems: 'center', gap: 24, boxShadow: '0 4px 28px rgba(0,0,0,0.4)' }}>
                  {/* Icon */}
                  <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(185,79,255,0.08)', border: '1px solid rgba(185,79,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Calendar size={26} style={{ color: '#b94fff' }} />
                  </div>
                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: '#fff' }}>No Bookings Today</h3>
                    <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                      You have no reservations for today. Check upcoming dates below or book a new table.
                    </p>
                  </div>
                  {/* CTA */}
                  <button
                    onClick={"/booking" as any}
                    style={{ background: 'linear-gradient(135deg, #ff2d9b, #b94fff)', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap', boxShadow: '0 0 16px rgba(255,45,155,0.25)' }}
                  >
                    Book a Table
                  </button>
                </div>
              ) : (
                /* Has bookings today */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {todayBookings.map(r => {
                    const cfg = STATUS_CONFIG[r.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelected(r)}
                        style={{ background: 'linear-gradient(145deg, #131328, #1a1035)', border: `1px solid ${cfg.border}`, borderRadius: 16, padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, boxShadow: `0 0 20px ${cfg.color}15` }}
                      >
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Calendar size={20} style={{ color: cfg.color }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{r.event}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{r.time} · {r.party} guests · {r.table}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 50, padding: '5px 12px' }}>
                          <StatusIcon size={12} style={{ color: cfg.color }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>{r.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          );
        })()}

        {/* Calendar card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ background: 'linear-gradient(145deg, #131328, #1a1035)', border: '1px solid rgba(185,79,255,0.25)', borderRadius: 24, overflow: 'hidden', marginBottom: 48, boxShadow: '0 8px 48px rgba(0,0,0,0.5)' }}
        >
          {/* Rainbow bar */}
          <div style={{ height: 4, background: 'linear-gradient(90deg, #ff2d9b, #b94fff, #00d4ff)' }} />

          {/* Calendar header */}
          <div style={{ padding: '24px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
                {MONTH_NAMES[viewMonth]} <span style={{ color: 'rgba(255,255,255,0.4)' }}>{viewYear}</span>
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                {activeCount} active booking{activeCount !== 1 ? 's' : ''} this month
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={prevMonth} style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                <ChevronLeft size={17} />
              </button>
              <button onClick={nextMonth} style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #ff2d9b, #b94fff)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(255,45,155,0.3)', transition: 'all 0.2s' }}>
                <ChevronRight size={17} />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div style={{ padding: '16px 28px 0', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {(['Confirmed', 'Pending', 'Cancelled'] as Status[]).map(s => {
              const c = STATUS_CONFIG[s];
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{s}</span>
                </div>
              );
            })}
          </div>

          {/* Day labels */}
          <div style={{ padding: '20px 20px 0', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {DAYS_OF_WEEK.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', padding: '0 0 10px', textTransform: 'uppercase' }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ padding: '0 20px 24px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {calendarDays.map(({ day, thisMonth }, idx) => {
              const bookings = thisMonth ? (resByDay[day] || []) : [];
              const today = thisMonth && isToday(day);
              const hasBooking = bookings.length > 0;

              return (
                <motion.div
                  key={idx}
                  onClick={() => {
                    if (hasBooking && bookings.length === 1) setSelected(bookings[0]);
                    else if (hasBooking && bookings.length > 1) setSelected(bookings[0]); // show first, could extend
                  }}
                  whileHover={hasBooking ? { scale: 1.06 } : {}}
                  style={{
                    minHeight: 64,
                    borderRadius: 10,
                    padding: '8px 6px',
                    cursor: hasBooking ? 'pointer' : 'default',
                    background: today
                      ? 'rgba(255,45,155,0.12)'
                      : hasBooking
                        ? 'rgba(185,79,255,0.08)'
                        : 'transparent',
                    border: today
                      ? '1px solid rgba(255,45,155,0.5)'
                      : hasBooking
                        ? '1px solid rgba(185,79,255,0.2)'
                        : '1px solid transparent',
                    transition: 'all 0.2s',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  onMouseOver={e => { if (hasBooking) (e.currentTarget as HTMLElement).style.borderColor = '#b94fff'; }}
                  onMouseOut={e => { if (hasBooking && !today) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(185,79,255,0.2)'; }}
                >
                  <span style={{
                    fontSize: 13,
                    fontWeight: today ? 900 : hasBooking ? 700 : 400,
                    color: !thisMonth ? 'rgba(255,255,255,0.18)' : today ? '#ff2d9b' : hasBooking ? '#fff' : 'rgba(255,255,255,0.55)',
                  }}>
                    {day}
                  </span>

                  {/* Booking dots */}
                  <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {bookings.map(b => (
                      <div
                        key={b.id}
                        title={b.event}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: STATUS_CONFIG[b.status].color,
                          boxShadow: `0 0 6px ${STATUS_CONFIG[b.status].color}`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Event name on larger cells */}
                  {bookings[0] && (
                    <span style={{ fontSize: 9, color: STATUS_CONFIG[bookings[0].status].color, fontWeight: 700, lineHeight: 1.2, textAlign: 'center', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', maxWidth: '100%' }}>
                      {bookings[0].event}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* All reservations list for this month */}
        {Object.keys(resByDay).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: 'rgba(255,255,255,0.8)' }}>
              {MONTH_NAMES[viewMonth]} Bookings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {reservations
                .filter(r => r.year === viewYear && r.month === viewMonth)
                .sort((a, b) => a.day - b.day)
                .map(r => {
                  const cfg = STATUS_CONFIG[r.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <motion.div
                      key={r.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelected(r)}
                      style={{ background: 'linear-gradient(145deg, #131328, #1a1035)', border: `1px solid ${cfg.border}`, borderRadius: 14, padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'box-shadow 0.2s', boxShadow: `0 0 0 rgba(0,0,0,0)` }}
                      onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${cfg.color}20`; }}
                      onMouseOut={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 rgba(0,0,0,0)'; }}
                    >
                      {/* Day badge */}
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 18, fontWeight: 900, color: cfg.color, lineHeight: 1 }}>{r.day}</span>
                        <span style={{ fontSize: 9, color: cfg.color, opacity: 0.8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{MONTH_NAMES[r.month].slice(0,3)}</span>
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.event}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', display: 'flex', gap: 12 }}>
                          <span>{r.time}</span>
                          <span>·</span>
                          <span>{r.party} guest{r.party > 1 ? 's' : ''}</span>
                          <span>·</span>
                          <span>{r.table}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 50, padding: '5px 12px', flexShrink: 0 }}>
                        <StatusIcon size={12} style={{ color: cfg.color }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>{r.status}</span>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        )}

        {/* Booking form */}
        <div id="booking-form">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>Reserve a Table</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {formStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: 'linear-gradient(145deg, #131328, #1a1035)', border: '1px solid rgba(255,45,155,0.4)', borderRadius: 24, padding: '48px 32px', textAlign: 'center', boxShadow: '0 0 40px rgba(255,45,155,0.15)' }}
            >
              <CheckCircle2 size={64} style={{ color: '#ff2d9b', margin: '0 auto 20px', display: 'block' }} />
              <h3 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Reservation Requested!</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 28, maxWidth: 380, margin: '0 auto 28px' }}>
                Our team will review availability and confirm your booking via email within 24 hours.
              </p>
              <button
                onClick={() => setFormStatus('idle')}
                style={{ background: 'transparent', border: '2px solid #ff2d9b', color: '#ff2d9b', borderRadius: 50, padding: '12px 32px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s' }}
              >
                Make Another Booking
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleFormSubmit}
              style={{ background: 'linear-gradient(145deg, #131328, #1a1035)', border: '1px solid rgba(185,79,255,0.25)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}
            >
              <div style={{ height: 4, background: 'linear-gradient(90deg, #b94fff, #00d4ff)' }} />
              <div style={{ padding: '32px' }}>
                <div style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: 'rgba(255,255,255,0.65)', display: 'flex', gap: 10 }}>
                  <Calendar size={16} style={{ color: '#00d4ff', flexShrink: 0, marginTop: 1 }} />
                  <span><strong style={{ color: '#fff' }}>Note:</strong> Weekend bookings require a ₱1,000 consumable deposit. Your reservation is confirmed once you receive an email.</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Full Name</label>
                    <input required type="text" style={inputStyle} placeholder="Alex Reyes" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Email Address</label>
                    <input required type="email" style={inputStyle} placeholder="alex@example.com" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Date</label>
                    <input required type="date" style={{ ...inputStyle, colorScheme: 'dark' } as React.CSSProperties} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Time</label>
                    <select required style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}>
                      <option value="" disabled>Select time</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                      <option value="21:00">9:00 PM</option>
                      <option value="22:00">10:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Party Size</label>
                    <input required type="number" min="1" max="20" style={inputStyle} placeholder="2" />
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Special Notes / Requests</label>
                  <textarea rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }} placeholder="Celebrating a birthday? Front row preference? Let us know." />
                </div>

                <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg, #00d4ff, #b94fff)', color: '#fff', border: 'none', borderRadius: 12, padding: '16px', fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 0 24px rgba(185,79,255,0.3)', fontFamily: 'Space Grotesk, sans-serif', transition: 'box-shadow 0.2s' }}>
                  Request Reservation
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <ReservationModal res={selected} onClose={() => setSelected(null)} onCancel={handleCancel} />
      )}
    </div>
  );
}
