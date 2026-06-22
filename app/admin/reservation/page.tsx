"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Stethoscope,
  User,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* ───── Status config ───── */
const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  confirmed: {
    color: "var(--neon-blue)",
    bg: "rgba(0,212,255,0.12)",
    border: "rgba(0,212,255,0.3)",
  },
  approved: {
    color: "var(--neon-blue)",
    bg: "rgba(0,212,255,0.12)",
    border: "rgba(0,212,255,0.3)",
  },
  pending: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.3)",
  },
  new: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.3)",
  },
  cancelled: {
    color: "var(--neon-pink)",
    bg: "rgba(255,45,155,0.12)",
    border: "rgba(255,45,155,0.3)",
  },
  rejected: {
    color: "var(--neon-pink)",
    bg: "rgba(255,45,155,0.12)",
    border: "rgba(255,45,155,0.3)",
  },
};

interface Booking {
  id?: number | string;
  audience_name?: string;
  audience_email?: string;
  phone?: string;
  scheduled_at?: string | null;
  status?: string;
  notes?: string;
}

/* ───── Status Badge ───── */
function StatusBadge({ status }: { status?: string }) {
  const cfg = STATUS_CONFIG[status as string] || STATUS_CONFIG.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 50,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.color,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}

/* ───── Section Card ───── */
function SectionCard({
  title,
  icon,
  count,
  countColor,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count?: number;
  countColor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-neon" style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            margin: 0,
          }}
        >
          {icon}
          {title}
        </p>
        {count !== undefined && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 50,
              color: countColor || "var(--neon-blue)",
              background: countColor
                ? `${countColor}20`
                : "rgba(0,212,255,0.12)",
              border: `1px solid ${countColor || "rgba(0,212,255,0.3)"}`,
            }}
          >
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ───── Helpers ───── */
function parseDateTime(date: string, time?: string) {
  if (!time) return new Date(`${date}T00:00:00`);
  if (/^\d{2}:\d{2}/.test(time)) return new Date(`${date}T${time}`);
  const [t, mer] = (time || "").split(" ");
  let [h, m] = t.split(":").map(Number);
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  return new Date(
    `${date}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`,
  );
}

function formatDisplayDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/* ───── Slide-in Panel Shell ─────
   Shared right-docked, full-height drawer used by both modals.
   - Fixed overlay dims the page
   - Panel slides in from the right edge, spans full viewport height
   - Panel content scrolls internally if it overflows
*/
function SlidePanel({
  open,
  onClose,
  width = 440,
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
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
      }}
    >
      {/* Backdrop */}
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
      {/* Panel */}
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
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 24,
            boxSizing: "border-box",
          }}
        >
          {children}
        </div>
      </div>
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0.6; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ───── Action Modal ───── */
type ActionModalState = {
  open: boolean;
  type: string | null;
  booking: Booking | null;
  notes: string;
  submitting: boolean;
};

function ActionModal({
  modal,
  onClose,
  onSubmit,
  onChange,
}: {
  modal: ActionModalState;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (val: string) => void;
}) {
  if (!modal.open || !modal.booking) return null;
  const isApprove = modal.type === "approve";
  const accent = isApprove ? "var(--neon-blue)" : "var(--neon-pink)";
  const accentBg = isApprove ? "rgba(0,212,255,0.12)" : "rgba(255,45,155,0.12)";

  return (
    <SlidePanel
      open={modal.open}
      onClose={onClose}
      width={440}
      glowColor={isApprove ? "rgba(0,212,255,0.15)" : "rgba(255,45,155,0.15)"}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: accentBg,
              border: `1px solid ${accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isApprove ? (
              <CheckCircle size={16} style={{ color: accent }} />
            ) : (
              <XCircle size={16} style={{ color: accent }} />
            )}
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text-bright)",
            }}
          >
            {isApprove ? "Approve Booking" : "Reject Booking"}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "transparent",
            border: "1px solid rgba(0,212,255,0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
        >
          <XCircle size={14} />
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          background: "rgba(0,0,0,0.25)",
          border: "1px solid rgba(0,212,255,0.12)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {(
          [
            ["Name", modal.booking.audience_name],
            ["Email", modal.booking.audience_email],
            [
              "Date",
              modal.booking.scheduled_at
                ? new Date(modal.booking.scheduled_at).toLocaleDateString()
                : "—",
            ],
          ] as [string, string | undefined][]
        ).map(([label, val]) => (
          <div key={label}>
            <span
              style={{
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              {label}
            </span>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-bright)",
                fontWeight: 600,
                marginTop: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {val || "—"}
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: 8,
          }}
        >
          {isApprove ? "Message to Client" : "Reason for Rejection"}{" "}
          <span style={{ color: "var(--neon-pink)" }}>*</span>
        </label>
        <textarea
          rows={3}
          value={modal.notes}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            isApprove
              ? "We are pleased to confirm your appointment…"
              : "Unfortunately we are unable to accommodate your requested time…"
          }
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "rgba(0,0,0,0.3)",
            border: `1px solid ${accent}40`,
            borderRadius: 10,
            color: "var(--text-bright)",
            fontSize: 13,
            resize: "none",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "var(--app-font-sans)",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onClose}
          disabled={modal.submitting}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 10,
            cursor: "pointer",
            background: "transparent",
            border: "1px solid rgba(0,212,255,0.2)",
            color: "var(--text-soft)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={modal.submitting}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 10,
            cursor: "pointer",
            border: "none",
            background: `linear-gradient(135deg, ${isApprove ? "var(--neon-blue), var(--neon-purple)" : "var(--neon-pink), var(--neon-purple)"})`,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            boxShadow: `0 0 20px ${isApprove ? "rgba(0,212,255,0.3)" : "rgba(255,45,155,0.3)"}`,
            opacity: modal.submitting ? 0.5 : 1,
          }}
        >
          {modal.submitting
            ? "Processing…"
            : isApprove
              ? "Approve & Notify"
              : "Reject & Notify"}
        </button>
      </div>
    </SlidePanel>
  );
}

/* ───── New Booking Modal helpers (calendar grid, time formatting) ───── */
function buildAdminCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { date: Date; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({
      date: new Date(year, month - 1, daysInPrev - i),
      current: false,
    });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ date: new Date(year, month, d), current: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++)
    cells.push({ date: new Date(year, month + 1, d), current: false });
  return cells;
}

function isPastDay(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

function formatAdminDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const ADMIN_TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
];

function formatAdminTimeTo24(time: string) {
  const [tv, mod] = time.split(" ");
  let [h, m] = tv.split(":").map(Number);
  if (mod === "PM" && h < 12) h += 12;
  if (mod === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const adminSlideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

const ADMIN_BOOKING_STEPS = [
  { num: 1, label: "Date", icon: Calendar },
  { num: 2, label: "Time", icon: Clock },
  { num: 3, label: "Patient", icon: User },
  { num: 4, label: "Confirm", icon: Sparkles },
];

const ADMIN_MONTHS = MONTHS;
const ADMIN_DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ───── New Booking Modal ───── */
function NewBookingModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  type FormState = {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [done, setDone] = useState(false);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const calendarCells = buildAdminCalendarGrid(viewYear, viewMonth);

  if (!open) return null;

  function go(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(next);
    setError("");
  }
  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  const step1Valid = !!selectedDate;
  const step2Valid = !!selectedTime;
  const step3Valid = !!form.name && !!form.email && !!form.phone;
  const canProceed = [step1Valid, step2Valid, step3Valid, true][step - 1];

  const handleSubmit = async () => {
    if (!form.name || !form.email || !selectedDate || !selectedTime) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          audience_name: form.name,
          audience_email: form.email,
          phone: form.phone,
          date: formatAdminDate(selectedDate),
          time: formatAdminTimeTo24(selectedTime),
          notes: form.notes,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to create booking.");
      setDone(true);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!canProceed) return;
    if (step < 4) go(step + 1);
    else handleSubmit();
  };

  const handleClose = () => {
    setForm({ name: "", email: "", phone: "", notes: "" });
    setSelectedDate(null);
    setSelectedTime("");
    setStep(1);
    setDir(1);
    setError("");
    setDone(false);
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(0,212,255,0.2)",
    borderRadius: 10,
    color: "var(--text-bright)",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "var(--app-font-sans)",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: 6,
  };

  /* ── Success view (replaces the panel body once booking is created) ── */
  if (done) {
    return (
      <SlidePanel open={open} onClose={handleClose} width={460} glowColor="rgba(0,212,255,0.15)">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "16px 0",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(0,212,255,0.12)",
              border: "1px solid rgba(0,212,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              boxShadow: "0 0 30px rgba(0,212,255,0.25)",
            }}
          >
            <CheckCircle size={28} style={{ color: "var(--neon-blue)" }} />
          </div>
          <h4
            style={{
              margin: "0 0 8px",
              fontSize: 17,
              fontWeight: 700,
              color: "var(--text-bright)",
            }}
          >
            Booking Created!
          </h4>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--text-muted)" }}>
            Appointment scheduled for{" "}
            {selectedDate?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}{" "}
            at {selectedTime}
          </p>
          <div
            style={{
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(0,212,255,0.15)",
              borderRadius: 12,
              padding: 16,
              width: "100%",
              marginBottom: 20,
            }}
          >
            {[
              ["Patient", form.name],
              ["Email", form.email],
              ["Date", selectedDate ? formatAdminDate(selectedDate) : "—"],
              ["Time", selectedTime],
            ].map(([label, val]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                  }}
                >
                  {label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-bright)" }}>
                  {val}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={handleClose}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 10,
              background: "linear-gradient(135deg,var(--neon-blue),var(--neon-purple))",
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1,
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(0,212,255,0.3)",
            }}
          >
            Done
          </button>
        </div>
      </SlidePanel>
    );
  }

  /* ── Step 1: Date ── */
  const Step1 = (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "transparent",
            border: "1px solid rgba(0,212,255,0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
        >
          <ChevronLeft size={14} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-bright)" }}>
          {ADMIN_MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "transparent",
            border: "1px solid rgba(0,212,255,0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 4 }}>
        {ADMIN_DAYS_SHORT.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "var(--neon-pink)",
              opacity: 0.5,
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {calendarCells.map((cell, i) => {
          const past = cell.current ? isPastDay(cell.date) : true;
          const isSel = selectedDate?.toDateString() === cell.date.toDateString();
          const isToday = cell.date.toDateString() === today.toDateString();
          const disabled = !cell.current || past;
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => !disabled && setSelectedDate(cell.date)}
              style={{
                position: "relative",
                width: 34,
                height: 34,
                margin: "0 auto",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                opacity: !cell.current ? 0.15 : past ? 0.25 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                background: isSel
                  ? "linear-gradient(135deg,var(--neon-blue),var(--neon-purple))"
                  : "transparent",
                border: isSel
                  ? "none"
                  : isToday
                    ? "1px solid var(--neon-blue)"
                    : "1px solid transparent",
                color: isSel ? "#fff" : isToday ? "var(--neon-blue)" : "var(--text-soft)",
                fontWeight: isSel || isToday ? 700 : 400,
                boxShadow: isSel ? "0 0 14px rgba(0,212,255,0.4)" : "none",
              }}
            >
              {cell.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ── Step 2: Time ── */
  const Step2 = (
    <div>
      {selectedDate && (
        <div
          className="card-neon"
          style={{ marginBottom: 16, padding: "10px 14px", fontSize: 13 }}
        >
          <span style={{ color: "var(--text-muted)" }}>Selected: </span>
          <span style={{ color: "var(--text-bright)", fontWeight: 600 }}>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {ADMIN_TIME_SLOTS.map((t) => {
          const isSel = selectedTime === t;
          return (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              style={{
                padding: "10px 8px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: isSel ? 700 : 500,
                cursor: "pointer",
                background: isSel
                  ? "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))"
                  : "rgba(0,212,255,0.05)",
                border: isSel ? "none" : "1px solid rgba(0,212,255,0.15)",
                color: isSel ? "#fff" : "var(--text-soft)",
                boxShadow: isSel
                  ? "0 0 16px rgba(0,212,255,0.3), 0 0 30px rgba(255,45,155,0.15)"
                  : "none",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ── Step 3: Patient info ── */
  const Step3 = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Juan dela Cruz"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="juan@example.com"
            style={inputStyle}
          />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Phone *</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          placeholder="+63 912 345 6789"
          style={inputStyle}
        />
      </div>
      <div>
        <label style={labelStyle}>Notes</label>
        <textarea
          rows={2}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          placeholder="Any additional notes…"
          style={{ ...inputStyle, resize: "none" }}
        />
      </div>
    </div>
  );

  /* ── Step 4: Confirm ── */
  const Step4 = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 6px" }}>
        Review the appointment before creating it.
      </p>
      {[
        {
          label: "Date",
          value: selectedDate?.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          }),
        },
        { label: "Time", value: selectedTime },
        { label: "Name", value: form.name },
        { label: "Email", value: form.email },
        { label: "Phone", value: form.phone },
      ].map(({ label, value }) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(0,0,0,0.25)",
            border: "1px solid rgba(0,212,255,0.12)",
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-bright)",
              maxWidth: "60%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "right",
            }}
          >
            {value || "—"}
          </span>
        </div>
      ))}
    </div>
  );

  const stepBodies = [Step1, Step2, Step3, Step4];

  return (
    <SlidePanel open={open} onClose={handleClose} width={500} glowColor="rgba(0,212,255,0.12)">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Calendar size={17} style={{ color: "var(--neon-blue)" }} />
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-bright)" }}>
            New Booking
          </h3>
        </div>
        <button
          onClick={handleClose}
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "transparent",
            border: "1px solid rgba(0,212,255,0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
        >
          <XCircle size={14} />
        </button>
      </div>

      {/* Step indicators */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          margin: "18px 0 4px",
          flexWrap: "wrap",
        }}
      >
        {ADMIN_BOOKING_STEPS.map((s, idx) => {
          const isDone = step > s.num;
          const curr = step === s.num;
          const Icon = s.icon;
          return (
            <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => isDone && go(s.num)}
                disabled={!isDone && !curr}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  background: "transparent",
                  border: "none",
                  cursor: isDone ? "pointer" : "default",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: curr
                      ? "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))"
                      : isDone
                        ? "rgba(0,212,255,0.1)"
                        : "rgba(0,212,255,0.05)",
                    border: curr
                      ? "none"
                      : isDone
                        ? "1px solid var(--neon-blue)"
                        : "1px solid rgba(0,212,255,0.15)",
                    boxShadow: curr ? "0 0 16px rgba(0,212,255,0.35)" : "none",
                  }}
                >
                  {isDone ? (
                    <CheckCircle size={14} style={{ color: "var(--neon-blue)" }} />
                  ) : (
                    <Icon size={13} style={{ color: curr ? "#fff" : "var(--text-muted)" }} />
                  )}
                </div>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: curr
                      ? "var(--neon-pink)"
                      : isDone
                        ? "var(--neon-blue)"
                        : "var(--text-muted)",
                    opacity: !curr && !isDone ? 0.5 : 1,
                  }}
                >
                  {s.label}
                </span>
              </button>
              {idx < ADMIN_BOOKING_STEPS.length - 1 && (
                <div
                  style={{
                    width: 28,
                    height: 1,
                    margin: "0 2px",
                    marginBottom: 14,
                    background: isDone ? "var(--neon-blue)" : "rgba(0,212,255,0.15)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step body */}
      <div style={{ padding: "16px 0" }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={adminSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {stepBodies[step - 1]}
          </motion.div>
        </AnimatePresence>
      </div>

      {error && (
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 13,
            color: "var(--neon-pink)",
            background: "rgba(255,45,155,0.1)",
            border: "1px solid rgba(255,45,155,0.3)",
            borderRadius: 10,
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <AlertCircle size={13} /> {error}
        </p>
      )}

      {/* Nav footer */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => (step === 1 ? handleClose() : go(step - 1))}
          disabled={loading}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 10,
            background: "transparent",
            border: "1px solid rgba(0,212,255,0.2)",
            color: "var(--text-soft)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {step === 1 ? "Cancel" : "← Back"}
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed || loading}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 10,
            background:
              step === 4
                ? "linear-gradient(135deg,var(--neon-pink),var(--neon-blue))"
                : "linear-gradient(135deg,var(--neon-blue),var(--neon-purple))",
            border: "none",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            cursor: canProceed && !loading ? "pointer" : "not-allowed",
            opacity: canProceed ? (loading ? 0.5 : 1) : 0.4,
            boxShadow:
              step === 4 ? "0 0 20px rgba(255,45,155,0.3)" : "0 0 20px rgba(0,212,255,0.3)",
          }}
        >
          {step === 4
            ? loading
              ? "Creating…"
              : "Create Booking"
            : "Next →"}
        </button>
      </div>
    </SlidePanel>
  );
}
/* ───── MAIN COMPONENT ───── */
export default function AdminBooking() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0],
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [actionModal, setActionModal] = useState<ActionModalState>({
    open: false,
    type: null,
    booking: null,
    notes: "",
    submitting: false,
  });

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/booking?per_page=100`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({}));
      let list: Booking[] = [];
      if (data) {
        if (Array.isArray(data.data)) list = data.data;
        else if (Array.isArray(data)) list = data;
        else if (Array.isArray((data as any)?.data?.data))
          list = (data as any).data.data;
      }
      setBookings(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings, currentMonth, currentYear]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  const openActionModal = (type: string, booking: Booking) => {
    if (type === "approve") {
      const now = new Date();
      const bdt = parseDateTime(
        booking.scheduled_at ? booking.scheduled_at.split(" ")[0] : "",
        booking.scheduled_at ? booking.scheduled_at.split(" ")[1] : "",
      );
      if (bdt < now) {
        setActionModal({
          open: true,
          type: "reject",
          booking,
          notes:
            "Your requested time slot has already passed. Please rebook at a future time.",
          submitting: false,
        });
        return;
      }
    }
    setActionModal({ open: true, type, booking, notes: "", submitting: false });
  };

  const handleActionSubmit = async () => {
    const { type, booking, notes } = actionModal;
    if (!notes.trim()) {
      alert("Please add a note.");
      return;
    }
    setActionModal((p) => ({ ...p, submitting: true }));
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const status = type === "approve" ? "confirmed" : "cancelled";
      const res = await fetch(`${API_URL}/api/booking/${booking?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error("Failed to update booking.");
      setActionModal({
        open: false,
        type: null,
        booking: null,
        notes: "",
        submitting: false,
      });
      fetchBookings();
    } catch (err: any) {
      alert("Error: " + (err?.message || String(err)));
      setActionModal((p) => ({ ...p, submitting: false }));
    }
  };

  const now = new Date();
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const bookedDates = new Set(
    safeBookings.map((b) =>
      b.scheduled_at
        ? b.scheduled_at.split(" ")[0] || b.scheduled_at.split("T")[0]
        : undefined,
    ),
  );
  const todayBookings = safeBookings.filter((b) => {
    const d = b.scheduled_at
      ? b.scheduled_at.split("T")[0] || b.scheduled_at.split(" ")[0]
      : undefined;
    return d === selectedDate;
  });
  const pendingBookings = safeBookings.filter((b) => b.status === "pending");
  const upcomingBookings = safeBookings.filter((b) => {
    if (b.status !== "confirmed" && b.status !== "approved") return false;
    const d = b.scheduled_at ? new Date(b.scheduled_at) : null;
    if (!d) return false;
    return d >= now && d <= new Date(now.getTime() + 24 * 60 * 60 * 1000);
  });

  return (
    <div className="h-full space-y-6 flex-1 overflow-y-auto p-6 min-h-screen">
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "var(--text-bright)",
            }}
          >
            Appointment Booking
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            {safeBookings.length} total appointments
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 20px",
            background:
              "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
            border: "none",
            borderRadius: 50,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            cursor: "pointer",
            boxShadow: "0 0 20px rgba(0,212,255,0.35)",
          }}
        >
          <Plus size={14} /> New Booking
        </button>
      </div>

      {/* Clinic Banner */}
      <div
        className="card-neon"
        style={{
          padding: 20,
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background:
              "linear-gradient(135deg,var(--neon-blue),var(--neon-pink))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(0,212,255,0.4)",
          }}
        >
          <Stethoscope size={22} style={{ color: "#fff" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text-bright)",
            }}
          >
            Rapture Commedy Bar & Cafe
          </p>
          <p
            style={{
              margin: "3px 0 0",
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            Admin Dashboard · Manage patient appointments
          </p>
        </div>
        {/* Stats */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Pending", val: pendingBookings.length, color: "#f59e0b" },
            {
              label: "Today",
              val: todayBookings.length,
              color: "var(--neon-blue)",
            },
            {
              label: "Upcoming",
              val: upcomingBookings.length,
              color: "var(--neon-blue)",
            },
            {
              label: "Total",
              val: safeBookings.length,
              color: "var(--text-soft)",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="stat-card"
              style={{ padding: "13px 44px", textAlign: "center", minWidth: 64 }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: s.color,
                  lineHeight: 1,
                  fontFamily: "Playfair Display, serif",
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginTop: 3,
                  marginLeft: 3,
                  marginRight: 3,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "600px 1fr", gap: 20 }}
        className="lg:grid-cols-[280px,1fr]"
      >
        {/* ── Calendar ── */}
        <div>
          <div className="card-neon" style={{ height: "100%", padding: 20 }}>
            {/* Month nav */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <button
                onClick={prevMonth}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "transparent",
                  border: "1px solid rgba(0,212,255,0.15)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                }}
              >
                <ChevronLeft size={14} />
              </button>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-bright)",
                }}
              >
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <button
                onClick={nextMonth}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "transparent",
                  border: "1px solid rgba(0,212,255,0.15)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Day headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7,1fr)",
                marginBottom: 8,
              }}
            >
              {DAYS.map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    padding: "32px 5px",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7,1fr)",
                gap: 2,
              }}
            >
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const ds = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isSelected = ds === selectedDate;
                const hasBooking = bookedDates.has(ds);
                const isToday = ds === today.toISOString().split("T")[0];
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(ds)}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      margin: "0 auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      cursor: "pointer",
                      position: "relative",
                      background: isSelected
                        ? "linear-gradient(135deg,var(--neon-blue),var(--neon-purple))"
                        : "transparent",
                      border: isSelected
                        ? "none"
                        : isToday
                          ? "1px solid var(--neon-blue)"
                          : "1px solid transparent",
                      color: isSelected
                        ? "#fff"
                        : isToday
                          ? "var(--neon-blue)"
                          : "var(--text-soft)",
                      fontWeight: isSelected || isToday ? 700 : 400,
                      boxShadow: isSelected
                        ? "0 0 14px rgba(0,212,255,0.4)"
                        : "none",
                    }}
                  >
                    {day}
                    {hasBooking && !isSelected && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 3,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: "var(--neon-pink)",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Selected day */}
          <SectionCard
            title={formatDisplayDate(selectedDate)}
            icon={<Calendar size={12} />}
            count={todayBookings.length}
          >
            {isLoading ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: 64,
                      borderRadius: 10,
                      background: "rgba(0,212,255,0.06)",
                      animation: "pulse-glow 1.5s ease infinite",
                    }}
                  />
                ))}
              </div>
            ) : todayBookings.length === 0 ? (
              <div style={{ padding: "32px 0", textAlign: "center" }}>
                <Calendar
                  size={28}
                  style={{ color: "var(--text-muted)", margin: "0 auto 8px" }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--text-muted)",
                  }}
                >
                  No appointments for this day
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {todayBookings.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: 12,
                      background: "rgba(0,212,255,0.04)",
                      border: "1px solid rgba(0,212,255,0.12)",
                      borderRadius: 12,
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(0,212,255,0.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(0,212,255,0.12)")
                    }
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg,var(--neon-blue),var(--neon-purple))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {(b.audience_name ?? "?")[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: "var(--text-bright)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {b.audience_name}
                        </span>
                        <StatusBadge status={b.status} />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginTop: 3,
                          fontSize: 11,
                          color: "var(--text-muted)",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Clock size={10} />
                          {b.scheduled_at
                            ? new Date(b.scheduled_at).toLocaleTimeString(
                                "en-US",
                                { hour: "2-digit", minute: "2-digit" },
                              )
                            : "—"}
                        </span>
                        {b.audience_email && (
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {b.audience_email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Bottom grid */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {/* Upcoming */}
            <SectionCard
              title="Upcoming (24h)"
              icon={<Clock size={12} />}
              count={upcomingBookings.length}
              countColor="var(--neon-blue)"
            >
              {upcomingBookings.length === 0 ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--text-muted)",
                    textAlign: "center",
                    padding: "24px 0",
                  }}
                >
                  No upcoming appointments
                </p>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {upcomingBookings.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: 10,
                        background: "rgba(0,212,255,0.06)",
                        border: "1px solid rgba(0,212,255,0.15)",
                        borderRadius: 10,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: "var(--text-bright)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {b.audience_name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            marginTop: 2,
                          }}
                        >
                          {b.scheduled_at
                            ? new Date(b.scheduled_at).toLocaleString()
                            : "—"}
                        </div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Pending */}
            <SectionCard
              title="Pending Approval"
              icon={<AlertCircle size={12} />}
              count={pendingBookings.length}
              countColor="#f59e0b"
            >
              {pendingBookings.length === 0 ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--text-muted)",
                    textAlign: "center",
                    padding: "24px 0",
                  }}
                >
                  No pending bookings
                </p>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {pendingBookings.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: 15,
                        background: "rgba(245,158,11,0.06)",
                        border: "1px solid rgba(245,158,11,0.2)",
                        borderRadius: 10,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: "var(--text-bright)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {b.audience_name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            marginTop: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {b.audience_email}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            marginTop: 1,
                          }}
                        >
                          {b.scheduled_at
                            ? new Date(b.scheduled_at).toLocaleDateString()
                            : "—"}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <button
                          onClick={() => openActionModal("approve", b)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: "rgba(0,212,255,0.15)",
                            border: "1px solid rgba(0,212,255,0.35)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--neon-blue)",
                          }}
                        >
                          <CheckCircle size={13} />
                        </button>
                        <button
                          onClick={() => openActionModal("reject", b)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: "rgba(255,45,155,0.12)",
                            border: "1px solid rgba(255,45,155,0.3)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--neon-pink)",
                          }}
                        >
                          <XCircle size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>

      <NewBookingModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSuccess={fetchBookings}
      />
      <ActionModal
        modal={actionModal}
        onClose={() =>
          setActionModal({
            open: false,
            type: null,
            booking: null,
            notes: "",
            submitting: false,
          })
        }
        onSubmit={handleActionSubmit}
        onChange={(val) => setActionModal((p) => ({ ...p, notes: val }))}
      />
    </div>
  );
}