"use client";

import { ChevronLeft, ChevronRight, Plus, X, Calendar, AlignLeft, Trash2, Users, Building2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "#00d4ff",
  confirmed: "#a855f7",
  completed: "#10b981",
  rejected: "#ff2d9b",
  cancelled: "#f59e0b",
};

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "rejected", "cancelled"] as const;

/* ─────────────────────────────────────────────
   Types — mirrored from EventBooking model
───────────────────────────────────────────── */
type Booking = {
  id: number;
  venue_id: number;
  venue?: { id: number; name: string };
  check_in_date: string;
  check_out_date: string;
  is_single_day: boolean;
  number_of_days: number;
  number_of_nights: number;
  expected_attendees: number;
  needs_accommodation: boolean;
  organization: string | null;
  event_name: string | null;
  contact_person: string;
  position: string | null;
  email: string;
  phone: string;
  details: string | null;
  venue_price_per_day: number;
  venue_total: number;
  rooms_total: number;
  grand_total: number;
  status: keyof typeof STATUS_COLORS;
  reference_number?: string;
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}
function daysBetween(start: string, end: string) {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  return Math.max(1, Math.round((e.getTime() - s.getTime()) / 86400000) + 1);
}

/* ─────────────────────────────────────────────
   Slide Panel Shell  (right-docked drawer)
───────────────────────────────────────────── */
function SlidePanel({
  open,
  onClose,
  width = 460,
  glowColor = "rgba(0,212,255,0.15)",
  children,
}: {
  open: boolean;
  onClose: () => void;
  width?: number;
  glowColor?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(6,6,20,0.8)",
          backdropFilter: "blur(8px)",
          animation: "fade-in 0.2s ease",
        }}
      />
      <div
        className="card-neon"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100vh",
          width: "100%",
          maxWidth: width,
          borderRadius: 0,
          borderTop: "none",
          borderRight: "none",
          borderBottom: "none",
          display: "flex",
          flexDirection: "column",
          boxShadow: `0 0 60px ${glowColor}`,
          animation: "slide-in-right 0.25s ease",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto", padding: 28, boxSizing: "border-box" }}>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0.6; }
          to   { transform: translateX(0);    opacity: 1;   }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* shared form styles */
const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(0,212,255,0.2)",
  borderRadius: 10,
  color: "var(--text-bright)",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
};
const inputErr: React.CSSProperties = { ...inputBase, border: "1px solid rgba(255,45,155,0.5)" };
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "var(--text-muted)",
  marginBottom: 6,
};
const errMsg: React.CSSProperties = { fontSize: 11, color: "var(--neon-pink)", marginTop: 4 };

/* ─────────────────────────────────────────────
   Add New Event Modal — fields match EventBookingController@store
───────────────────────────────────────────── */
type NewEventForm = {
  venue_id: string;
  event_name: string;
  organization: string;
  check_in_date: string;
  check_out_date: string;
  expected_attendees: string;
  contact_person: string;
  position: string;
  email: string;
  phone: string;
  details: string;
  venue_price_per_day: string;
};

const EMPTY_FORM: NewEventForm = {
  venue_id: "",
  event_name: "",
  organization: "",
  check_in_date: "",
  check_out_date: "",
  expected_attendees: "",
  contact_person: "",
  position: "",
  email: "",
  phone: "",
  details: "",
  venue_price_per_day: "",
};

function NewEventModal({
  open,
  onClose,
  onSubmit,
  submitting,
  serverError,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: NewEventForm) => Promise<boolean>;
  submitting: boolean;
  serverError: string | null;
}) {
  const [form, setForm] = useState<NewEventForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof NewEventForm, string>>>({});

  const set = (key: keyof NewEventForm, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.venue_id.trim()) e.venue_id = "Venue ID is required.";
    if (!form.check_in_date) e.check_in_date = "Check-in date is required.";
    if (!form.check_out_date) e.check_out_date = "Check-out date is required.";
    if (form.check_in_date && form.check_out_date && form.check_out_date < form.check_in_date)
      e.check_out_date = "Check-out can't be before check-in.";
    if (!form.expected_attendees.trim()) e.expected_attendees = "Expected attendees is required.";
    if (!form.contact_person.trim()) e.contact_person = "Contact person is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.phone.trim()) e.phone = "Phone is required.";
    if (!form.venue_price_per_day.trim()) e.venue_price_per_day = "Venue price/day is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const ok = await onSubmit(form);
    if (ok) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  return (
    <SlidePanel open={open} onClose={handleClose} width={480} glowColor="rgba(0,212,255,0.15)">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Calendar size={16} style={{ color: "var(--neon-blue)" }} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-bright)" }}>
              New Event Booking
            </h3>
            <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>
              Saved directly to the database
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          style={{
            width: 32, height: 32, borderRadius: 8, background: "transparent",
            border: "1px solid rgba(0,212,255,0.15)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)",
          }}
        >
          <X size={14} />
        </button>
      </div>

      <div style={{ height: 1, background: "rgba(0,212,255,0.1)", marginBottom: 24 }} />

      {serverError && (
        <div
          style={{
            marginBottom: 18, padding: "10px 14px", borderRadius: 10,
            background: "rgba(255,45,155,0.1)", border: "1px solid rgba(255,45,155,0.3)",
            color: "var(--neon-pink)", fontSize: 12,
          }}
        >
          {serverError}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Venue ID <span style={{ color: "var(--neon-pink)" }}>*</span></label>
            <input
              type="number"
              value={form.venue_id}
              onChange={(e) => set("venue_id", e.target.value)}
              placeholder="e.g. 1"
              style={errors.venue_id ? inputErr : inputBase}
            />
            {errors.venue_id && <p style={errMsg}>{errors.venue_id}</p>}
          </div>
          <div>
            <label style={labelStyle}>Venue Price / Day <span style={{ color: "var(--neon-pink)" }}>*</span></label>
            <input
              type="number"
              value={form.venue_price_per_day}
              onChange={(e) => set("venue_price_per_day", e.target.value)}
              placeholder="0.00"
              style={errors.venue_price_per_day ? inputErr : inputBase}
            />
            {errors.venue_price_per_day && <p style={errMsg}>{errors.venue_price_per_day}</p>}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Event Name</label>
          <input
            type="text"
            value={form.event_name}
            onChange={(e) => set("event_name", e.target.value)}
            placeholder="e.g. Annual Sales Conference"
            style={inputBase}
          />
        </div>

        <div>
          <label style={labelStyle}>Organization</label>
          <input
            type="text"
            value={form.organization}
            onChange={(e) => set("organization", e.target.value)}
            placeholder="e.g. Acme Corp"
            style={inputBase}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Check-in <span style={{ color: "var(--neon-pink)" }}>*</span></label>
            <input
              type="date"
              value={form.check_in_date}
              onChange={(e) => set("check_in_date", e.target.value)}
              style={{ ...(errors.check_in_date ? inputErr : inputBase), colorScheme: "dark" }}
            />
            {errors.check_in_date && <p style={errMsg}>{errors.check_in_date}</p>}
          </div>
          <div>
            <label style={labelStyle}>Check-out <span style={{ color: "var(--neon-pink)" }}>*</span></label>
            <input
              type="date"
              value={form.check_out_date}
              onChange={(e) => set("check_out_date", e.target.value)}
              style={{ ...(errors.check_out_date ? inputErr : inputBase), colorScheme: "dark" }}
            />
            {errors.check_out_date && <p style={errMsg}>{errors.check_out_date}</p>}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Expected Attendees <span style={{ color: "var(--neon-pink)" }}>*</span></label>
          <div style={{ position: "relative" }}>
            <Users size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="number"
              value={form.expected_attendees}
              onChange={(e) => set("expected_attendees", e.target.value)}
              placeholder="e.g. 80"
              style={{ ...(errors.expected_attendees ? inputErr : inputBase), paddingLeft: 32 }}
            />
          </div>
          {errors.expected_attendees && <p style={errMsg}>{errors.expected_attendees}</p>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Contact Person <span style={{ color: "var(--neon-pink)" }}>*</span></label>
            <input
              type="text"
              value={form.contact_person}
              onChange={(e) => set("contact_person", e.target.value)}
              style={errors.contact_person ? inputErr : inputBase}
            />
            {errors.contact_person && <p style={errMsg}>{errors.contact_person}</p>}
          </div>
          <div>
            <label style={labelStyle}>Position</label>
            <input
              type="text"
              value={form.position}
              onChange={(e) => set("position", e.target.value)}
              style={inputBase}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Email <span style={{ color: "var(--neon-pink)" }}>*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              style={errors.email ? inputErr : inputBase}
            />
            {errors.email && <p style={errMsg}>{errors.email}</p>}
          </div>
          <div>
            <label style={labelStyle}>Phone <span style={{ color: "var(--neon-pink)" }}>*</span></label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              style={errors.phone ? inputErr : inputBase}
            />
            {errors.phone && <p style={errMsg}>{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label style={labelStyle}>
            Details
            <span style={{ marginLeft: 6, color: "var(--text-muted)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
              — optional
            </span>
          </label>
          <div style={{ position: "relative" }}>
            <AlignLeft size={13} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-muted)" }} />
            <textarea
              rows={3}
              value={form.details}
              onChange={(e) => set("details", e.target.value)}
              placeholder="Add notes for this event…"
              style={{ ...inputBase, paddingLeft: 32, resize: "none", lineHeight: 1.6 }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
        <button
          onClick={handleClose}
          disabled={submitting}
          style={{
            flex: 1, padding: "11px 0", borderRadius: 10, cursor: "pointer",
            background: "transparent", border: "1px solid rgba(0,212,255,0.2)",
            color: "var(--text-soft)", fontSize: 13, fontWeight: 600,
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            flex: 1, padding: "11px 0", borderRadius: 10, cursor: "pointer", border: "none",
            background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
            color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: 0.8,
            boxShadow: "0 0 20px rgba(0,212,255,0.3)", opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? "Saving…" : "Save Event"}
        </button>
      </div>
    </SlidePanel>
  );
}

/* ─────────────────────────────────────────────
   Day Detail Panel — view / update status / delete
───────────────────────────────────────────── */
function DayDetailPanel({
  open,
  onClose,
  date,
  bookings,
  onDelete,
  onStatusChange,
  busyId,
}: {
  open: boolean;
  onClose: () => void;
  date: string;
  bookings: Booking[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
  busyId: number | null;
}) {
  return (
    <SlidePanel open={open} onClose={onClose} width={440} glowColor="rgba(168,85,247,0.15)">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-bright)" }}>
            {date}
          </h3>
          <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 32, height: 32, borderRadius: 8, background: "transparent",
            border: "1px solid rgba(0,212,255,0.15)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)",
          }}
        >
          <X size={14} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {bookings.map((b) => {
          const color = STATUS_COLORS[b.status] ?? "#00d4ff";
          const busy = busyId === b.id;
          return (
            <div
              key={b.id}
              style={{
                padding: 16, borderRadius: 14,
                background: "rgba(0,0,0,0.25)",
                border: `1px solid ${color}33`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--text-bright)" }}>
                    {b.event_name || b.organization || b.contact_person}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--text-muted)" }}>
                    {b.reference_number ?? `#${b.id}`} · {b.check_in_date} → {b.check_out_date}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 50,
                    background: `${color}22`, color, textTransform: "uppercase", letterSpacing: 0.5, flexShrink: 0,
                  }}
                >
                  {b.status}
                </span>
              </div>

              <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 11, color: "var(--text-soft)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Building2 size={12} /> Venue #{b.venue_id}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Users size={12} /> {b.expected_attendees}
                </span>
              </div>

              <p style={{ margin: "8px 0 0", fontSize: 11, color: "var(--text-muted)" }}>
                {b.contact_person} · {b.email} · {b.phone}
              </p>

              <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                <select
                  value={b.status}
                  disabled={busy}
                  onChange={(e) => onStatusChange(b.id, e.target.value)}
                  style={{
                    flex: 1, fontSize: 11, padding: "6px 8px", borderRadius: 8,
                    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text-soft)",
                  }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  disabled={busy}
                  onClick={() => onDelete(b.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600,
                    padding: "6px 10px", borderRadius: 8, cursor: "pointer",
                    background: "rgba(255,45,155,0.1)", border: "1px solid rgba(255,45,155,0.3)",
                    color: "var(--neon-pink)", opacity: busy ? 0.5 : 1,
                  }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </SlidePanel>
  );
}

/* ─────────────────────────────────────────────
   Calendar Page
───────────────────────────────────────────── */
export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  // ── Fetch bookings whenever the visible month changes ──
  const loadBookings = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/event?per_page=200`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to load events.");
      }
      const list: Booking[] = data.data?.data ?? data.data ?? [];
      setBookings(list);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings, year, month]);

  // ── Group bookings by day-of-month for the currently displayed month ──
  const eventsByDay: Record<number, Booking[]> = {};
  for (const b of bookings) {
    const start = new Date(b.check_in_date + "T00:00:00");
    const end = new Date(b.check_out_date + "T00:00:00");
    // Mark every day the booking spans that falls within the visible month
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        (eventsByDay[day] ||= []).push(b);
      }
    }
  }

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // ── CREATE ──
  const handleSubmit = async (form: NewEventForm): Promise<boolean> => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const days = daysBetween(form.check_in_date, form.check_out_date);
      const isSingleDay = form.check_in_date === form.check_out_date;
      const pricePerDay = parseFloat(form.venue_price_per_day) || 0;
      const venueTotal = pricePerDay * days;

      const payload = {
        venue_id: Number(form.venue_id),
        check_in_date: form.check_in_date,
        check_out_date: form.check_out_date,
        is_single_day: isSingleDay,
        number_of_days: days,
        number_of_nights: isSingleDay ? 0 : days - 1,
        expected_attendees: Number(form.expected_attendees),
        needs_accommodation: false,
        organization: form.organization || null,
        event_name: form.event_name || null,
        contact_person: form.contact_person,
        position: form.position || null,
        email: form.email,
        phone: form.phone,
        details: form.details || null,
        venue_price_per_day: pricePerDay,
        venue_total: venueTotal,
        rooms_total: 0,
        grand_total: venueTotal,
      };

      const res = await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        const msg =
          data.errors
            ? Object.values(data.errors).flat().join(" ")
            : data.message || "Failed to create event.";
        throw new Error(msg);
      }

      await loadBookings();
      setShowModal(false);
      return true;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create event.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // ── DELETE ──
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/event/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message || "Failed to delete.");
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete booking.");
    } finally {
      setBusyId(null);
    }
  };

  // ── UPDATE STATUS ──
  const handleStatusChange = async (id: number, status: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/event/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message || "Failed to update status.");
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: status as Booking["status"] } : b)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setBusyId(null);
    }
  };

  const activeDayEvents = activeDay ? eventsByDay[activeDay] ?? [] : [];
  const activeDayLabel = activeDay
    ? `${MONTHS[month]} ${activeDay}, ${year}`
    : "";

  return (
    <div className="space-y-6 flex-1 overflow-y-auto p-6 min-h-screen">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-bright)" }}>Calendar</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {loading ? "Loading events…" : "Schedule and upcoming events"}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
            color: "white",
            boxShadow: "0 0 16px rgba(0,212,255,0.3)",
          }}
        >
          <Plus size={14} />
          New Event
        </button>
      </div>

      {fetchError && (
        <div
          style={{
            padding: "10px 14px", borderRadius: 10,
            background: "rgba(255,45,155,0.1)", border: "1px solid rgba(255,45,155,0.3)",
            color: "var(--neon-pink)", fontSize: 12,
          }}
        >
          {fetchError}
        </div>
      )}

      {/* Calendar card */}
      <div className="card-neon p-5">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{ background: "var(--card-mid)", border: "1px solid rgba(0,212,255,0.15)", color: "var(--text-soft)" }}
          >
            <ChevronLeft size={14} />
          </button>
          <h2 className="text-sm font-semibold gradient-text">
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{ background: "var(--card-mid)", border: "1px solid rgba(0,212,255,0.15)", color: "var(--text-soft)" }}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-semibold py-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)", fontSize: "10px" }}>
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: totalCells }).map((_, i) => {
            const day = i - firstDay + 1;
            const isValid = day > 0 && day <= daysInMonth;
            const dayEvents = isValid ? eventsByDay[day] : undefined;
            return (
              <div
                key={i}
                className={`min-h-[60px] p-1 rounded-lg transition-all duration-200 ${isValid ? "cursor-pointer" : ""}`}
                style={{
                  background: isValid ? (isToday(day) ? "rgba(0,212,255,0.1)" : "transparent") : "transparent",
                  border: isToday(day) ? "1px solid rgba(0,212,255,0.4)" : "1px solid transparent",
                }}
                onClick={() => isValid && dayEvents?.length && setActiveDay(day)}
                onMouseEnter={(e) => {
                  if (isValid && !isToday(day)) (e.currentTarget as HTMLDivElement).style.background = "rgba(0,212,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (isValid && !isToday(day)) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }}
              >
                {isValid && (
                  <>
                    <p className="text-xs font-medium text-right" style={{ color: isToday(day) ? "var(--neon-blue)" : "var(--text-soft)" }}>
                      {day}
                    </p>
                    {dayEvents && dayEvents.length > 0 && (
                      <div className="mt-0.5 space-y-0.5">
                        {dayEvents.slice(0, 3).map((b) => {
                          const color = STATUS_COLORS[b.status] ?? "#00d4ff";
                          return (
                            <div
                              key={b.id}
                              className="text-xs px-1 py-0.5 rounded truncate"
                              style={{ background: `${color}22`, color, fontSize: "9px" }}
                            >
                              {b.event_name || b.organization || b.contact_person}
                            </div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <div className="text-xs px-1" style={{ fontSize: "9px", color: "var(--text-muted)" }}>
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <NewEventModal
        open={showModal}
        onClose={() => { setShowModal(false); setSubmitError(null); }}
        onSubmit={handleSubmit}
        submitting={submitting}
        serverError={submitError}
      />

      <DayDetailPanel
        open={activeDay !== null}
        onClose={() => setActiveDay(null)}
        date={activeDayLabel}
        bookings={activeDayEvents}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        busyId={busyId}
      />
    </div>
  );
}