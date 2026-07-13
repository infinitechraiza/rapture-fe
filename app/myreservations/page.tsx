"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Clock,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Loader,
  Loader2,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// ─── Types matching the Laravel Booking model ───────────────
type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

type ApiComedian = {
  id: number;
  name: string;
  image?: string | null;
};

type ApiBookingEvent = {
  id: number;
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  color?: string | null;
  comedians?: ApiComedian[];
};

type ApiBooking = {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  scheduled_at: string;
  status: BookingStatus;
  notes?: string | null;
  can_cancel?: boolean;
  events?: ApiBookingEvent[];
};

type StatusConfig = {
  [key in BookingStatus]: {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: typeof CheckCircle2;
  };
};

const STATUS_CONFIG: StatusConfig = {
  pending: {
    label: "Pending",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.35)",
    icon: Loader,
  },
  confirmed: {
    label: "Confirmed",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.35)",
    icon: CheckCircle2,
  },
  in_progress: {
    label: "In Progress",
    color: "#00d4ff",
    bg: "rgba(0,212,255,0.12)",
    border: "rgba(0,212,255,0.35)",
    icon: Loader,
  },
  completed: {
    label: "Completed",
    color: "#b94fff",
    bg: "rgba(185,79,255,0.12)",
    border: "rgba(185,79,255,0.35)",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.10)",
    border: "rgba(239,68,68,0.30)",
    icon: X,
  },
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
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

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { day: number; thisMonth: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, thisMonth: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, thisMonth: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, thisMonth: false });
  return cells;
}

function formatTimeDisplay(t: string) {
  if (!t) return "";
  const [hStr, mStr] = t.split(":");
  const h = Number(hStr),
    m = Number(mStr);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function formatScheduledTime(scheduledAt: string) {
  return new Date(scheduledAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function eventsSummary(events?: ApiBookingEvent[]) {
  if (!events || events.length === 0) return "No linked events";
  if (events.length === 1) return events[0].title;
  return `${events[0].title} +${events.length - 1} more`;
}

// ─── Modal ────────────────────────────────────────────────────
function ReservationModal({
  booking,
  onClose,
  onCancel,
  cancelling,
}: {
  booking: ApiBooking;
  onClose: () => void;
  onCancel: (id: number) => void;
  cancelling: boolean;
}) {
  const cfg = STATUS_CONFIG[booking.status];
  const StatusIcon = cfg.icon;
  const scheduled = new Date(booking.scheduled_at);
  const canCancel = booking.can_cancel ?? false;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          style={{
            background: "linear-gradient(145deg, #131328, #1a1035)",
            border: "1px solid rgba(185,79,255,0.3)",
            borderRadius: 24,
            width: "100%",
            maxWidth: 480,
            maxHeight: "85vh",
            overflowY: "auto",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.7), 0 0 60px rgba(185,79,255,0.15)",
          }}
        >
          <div
            style={{
              height: 4,
              background: "linear-gradient(90deg, #ff2d9b, #b94fff, #00d4ff)",
            }}
          />

          <div
            style={{
              padding: "22px 24px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#b94fff",
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                Booking Details
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.2,
                }}
              >
                {eventsSummary(booking.events)}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <X size={15} />
            </button>
          </div>

          <div style={{ padding: "0 24px 18px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: 50,
                padding: "6px 14px",
              }}
            >
              <StatusIcon size={14} style={{ color: cfg.color }} />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: cfg.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {cfg.label}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "0 24px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 18,
            }}
          >
            {[
              {
                icon: Calendar,
                label: "Date",
                value: scheduled.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                }),
                color: "#00d4ff",
              },
              {
                icon: Clock,
                label: "Time",
                value: formatScheduledTime(booking.scheduled_at),
                color: "#b94fff",
              },
              {
                icon: Tag,
                label: "Reference",
                value: `Booking #${booking.id}`,
                color: "#ff2d9b",
              },
              {
                icon: Users,
                label: "Contact",
                value: booking.phone || booking.email,
                color: "#00d4ff",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                style={{
                  background: "rgba(0,0,0,0.25)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 6,
                  }}
                >
                  <Icon size={13} style={{ color }} />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {label}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          {booking.events && booking.events.length > 0 && (
            <div style={{ margin: "0 24px 18px" }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#b94fff",
                  marginBottom: 10,
                }}
              >
                Events ({booking.events.length})
              </p>
              {booking.events.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    background: "rgba(0,212,255,0.06)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 8,
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {ev.title}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.6)",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Clock size={11} /> {formatTimeDisplay(ev.start_time)} –{" "}
                    {formatTimeDisplay(ev.end_time)}
                  </p>
                  {ev.comedians && ev.comedians.length > 0 && (
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 5,
                      }}
                    >
                      {ev.comedians.map((c) => (
                        <span
                          key={c.id}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "2px 8px",
                            borderRadius: 999,
                            fontSize: 10,
                            fontWeight: 600,
                            background: "rgba(0,212,255,0.1)",
                            color: "#00d4ff",
                            border: "1px solid rgba(0,212,255,0.2)",
                          }}
                        >
                          <Users size={9} /> {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {booking.notes && (
            <div
              style={{
                margin: "0 24px 18px",
                background: "rgba(185,79,255,0.08)",
                border: "1px solid rgba(185,79,255,0.2)",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 13,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.6,
              }}
            >
              <span style={{ fontWeight: 700, color: "#b94fff" }}>Note: </span>
              {booking.notes}
            </div>
          )}

          <div style={{ padding: "16px 24px 24px", display: "flex", gap: 10 }}>
            <Link
              href="/shows"
              onClick={onClose}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #ff2d9b, #b94fff)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                cursor: "pointer",
                textDecoration: "none",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(255,45,155,0.25)",
              }}
            >
              View Shows
            </Link>
            {booking.status !== "cancelled" && (
              <button
                onClick={() => onCancel(booking.id)}
                disabled={!canCancel || cancelling}
                style={{
                  flex: 1,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.35)",
                  color: "#ef4444",
                  borderRadius: 10,
                  padding: "12px",
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  cursor: canCancel && !cancelling ? "pointer" : "not-allowed",
                  opacity: canCancel && !cancelling ? 1 : 0.4,
                  fontFamily: "Space Grotesk, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                title={
                  !canCancel
                    ? "Cancellation is only allowed more than 24 hours before the show."
                    : undefined
                }
              >
                {cancelling ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <AlertTriangle size={14} />
                )}
                {cancelling ? "Cancelling…" : "Cancel"}
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
  const { user } = useAuth();
  const now = new Date();

  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ApiBooking | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/booking", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(json.message || "Failed to load your reservations.");
      }
      const list: ApiBooking[] = Array.isArray(json.data?.data)
        ? json.data.data
        : Array.isArray(json.data)
          ? json.data
          : Array.isArray(json)
            ? json
            : [];
      setBookings(list);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load your reservations.",
      );
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadBookings();
    else setLoading(false);
  }, [user, loadBookings]);

  const calendarDays = buildCalendarDays(viewYear, viewMonth);

  const bookingsByDay = useMemo(() => {
    const map: Record<number, ApiBooking[]> = {};
    for (const b of bookings) {
      const d = new Date(b.scheduled_at);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        (map[d.getDate()] ||= []).push(b);
      }
    }
    return map;
  }, [bookings, viewYear, viewMonth]);

  const todayBookings = useMemo(() => {
    return bookings.filter((b) => {
      const d = new Date(b.scheduled_at);
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    });
  }, [bookings]);

  const monthBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        const d = new Date(b.scheduled_at);
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
      })
      .sort(
        (a, b) =>
          new Date(a.scheduled_at).getTime() -
          new Date(b.scheduled_at).getTime(),
      );
  }, [bookings, viewYear, viewMonth]);

  const activeCount = monthBookings.filter(
    (b) => b.status !== "cancelled",
  ).length;

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const isToday = (day: number) =>
    viewYear === now.getFullYear() &&
    viewMonth === now.getMonth() &&
    day === now.getDate();

  const handleCancel = async (id: number) => {
    setCancellingId(id);
    setCancelError(null);
    try {
      const res = await fetch(`/api/booking/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to cancel this booking.");
      }
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: "cancelled", can_cancel: false } : b,
        ),
      );
      setSelected((prev) =>
        prev && prev.id === id
          ? { ...prev, status: "cancelled", can_cancel: false }
          : prev,
      );
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "Failed to cancel this booking.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  // ── Not logged in ──
  if (!user) {
    return (
      <div
        className="w-full text-white flex items-center justify-center"
        style={{ background: "#060614", minHeight: "60vh" }}
      >
        <div style={{ textAlign: "center", maxWidth: 360 }}>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              marginBottom: 16,
              fontSize: 15,
            }}
          >
            Log in to see your reservations and their status.
          </p>
          <Link
            href="/login"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #ff2d9b, #b94fff)",
              color: "#fff",
              borderRadius: 50,
              padding: "12px 32px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 0 24px rgba(255,45,155,0.35)",
            }}
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full text-white"
      style={{ background: "#060614", minHeight: "100vh" }}
    >
      {/* SECTION 1 — Banner */}
      <section
        style={{
          position: "relative",
          minHeight: "45vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid rgba(0,212,255,0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #1a0b2e 0%, #060614 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.08,
            backgroundImage:
              "linear-gradient(rgba(185,79,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(185,79,255,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(185,79,255,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "5%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "40px 24px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "#ff2d9b",
                fontWeight: 700,
                display: "block",
                marginBottom: 12,
              }}
            >
              Your RAPTURE Bookings
            </span>
            <h1
              style={{
                fontSize: "clamp(38px,6vw,58px)",
                fontWeight: 900,
                lineHeight: 1.1,
                margin: "0 0 14px",
              }}
            >
              My <span className="text-gradient">Reservations</span>
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.65)",
                maxWidth: 400,
                margin: "0 auto 28px",
              }}
            >
              Track and manage your upcoming bookings at RAPTURE.
            </p>
            <Link
              href="/booking"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #ff2d9b, #b94fff)",
                color: "#fff",
                borderRadius: 50,
                padding: "12px 32px",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 0 24px rgba(255,45,155,0.35)",
                fontFamily: "Space Grotesk, sans-serif",
                textDecoration: "none",
              }}
            >
              Book a New Table
            </Link>
          </motion.div>
        </div>
      </section>

      <section
        style={{ padding: "60px 24px 80px", maxWidth: 900, margin: "0 auto" }}
      >
        {error && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444",
              fontSize: 13,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span>{error}</span>
            <button
              onClick={loadBookings}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: "60px 0",
            }}
          >
            <Loader2
              size={28}
              className="animate-spin"
              style={{ color: "#ff2d9b" }}
            />
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
              Loading your reservations…
            </span>
          </div>
        ) : (
          <>
            {/* Today's Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: 32 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#ff2d9b",
                      boxShadow: "0 0 8px #ff2d9b",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    Today — {MONTH_NAMES[now.getMonth()]} {now.getDate()},{" "}
                    {now.getFullYear()}
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "rgba(255,255,255,0.07)",
                  }}
                />
              </div>

              {todayBookings.length === 0 ? (
                <div
                  style={{
                    background: "linear-gradient(145deg, #131328, #1a1035)",
                    border: "1px solid rgba(185,79,255,0.18)",
                    borderRadius: 20,
                    padding: "32px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    boxShadow: "0 4px 28px rgba(0,0,0,0.4)",
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 16,
                      background: "rgba(185,79,255,0.08)",
                      border: "1px solid rgba(185,79,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Calendar size={26} style={{ color: "#b94fff" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        margin: "0 0 4px",
                        fontSize: 17,
                        fontWeight: 800,
                        color: "#fff",
                      }}
                    >
                      No Bookings Today
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.5,
                      }}
                    >
                      You have no reservations for today. Check upcoming dates
                      below or book a new table.
                    </p>
                  </div>
                  <Link
                    href="/booking"
                    style={{
                      background: "linear-gradient(135deg, #ff2d9b, #b94fff)",
                      color: "#fff",
                      borderRadius: 12,
                      padding: "10px 20px",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                      fontFamily: "Space Grotesk, sans-serif",
                      whiteSpace: "nowrap",
                      boxShadow: "0 0 16px rgba(255,45,155,0.25)",
                      textDecoration: "none",
                    }}
                  >
                    Book a Table
                  </Link>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {todayBookings.map((b) => {
                    const cfg = STATUS_CONFIG[b.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelected(b)}
                        style={{
                          background:
                            "linear-gradient(145deg, #131328, #1a1035)",
                          border: `1px solid ${cfg.border}`,
                          borderRadius: 16,
                          padding: "16px 20px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          boxShadow: `0 0 20px ${cfg.color}15`,
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Calendar size={20} style={{ color: cfg.color }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: "#fff",
                              marginBottom: 3,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {eventsSummary(b.events)}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(255,255,255,0.4)",
                            }}
                          >
                            {formatScheduledTime(b.scheduled_at)} · Booking #
                            {b.id}
                          </div>
                        </div>
                        
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            borderRadius: 50,
                            padding: "5px 12px",
                            flexShrink: 0,
                          }}
                        >
                          <StatusIcon size={12} style={{ color: cfg.color }} />
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: cfg.color,
                            }}
                          >
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Calendar card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: "linear-gradient(145deg, #131328, #1a1035)",
                border: "1px solid rgba(185,79,255,0.25)",
                borderRadius: 24,
                overflow: "hidden",
                marginBottom: 48,
                boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  height: 4,
                  background:
                    "linear-gradient(90deg, #ff2d9b, #b94fff, #00d4ff)",
                }}
              />

              <div
                style={{
                  padding: "24px 28px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
                    {MONTH_NAMES[viewMonth]}{" "}
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>
                      {viewYear}
                    </span>
                  </h2>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {activeCount} active booking{activeCount !== 1 ? "s" : ""}{" "}
                    this month
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={prevMonth}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <button
                    onClick={nextMonth}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #ff2d9b, #b94fff)",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 14px rgba(255,45,155,0.3)",
                    }}
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>

              <div
                style={{
                  padding: "16px 28px 0",
                  display: "flex",
                  gap: 18,
                  flexWrap: "wrap",
                }}
              >
                {(Object.keys(STATUS_CONFIG) as BookingStatus[]).map((s) => {
                  const c = STATUS_CONFIG[s];
                  return (
                    <div
                      key={s}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: c.color,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.5)",
                          fontWeight: 600,
                        }}
                      >
                        {c.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  padding: "20px 20px 0",
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 4,
                }}
              >
                {DAYS_OF_WEEK.map((d) => (
                  <div
                    key={d}
                    style={{
                      textAlign: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.3)",
                      padding: "0 0 10px",
                      textTransform: "uppercase",
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: "0 20px 24px",
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 4,
                }}
              >
                {calendarDays.map(({ day, thisMonth }, idx) => {
                  const dayBookings = thisMonth ? bookingsByDay[day] || [] : [];
                  const today = thisMonth && isToday(day);
                  const hasBooking = dayBookings.length > 0;
                  const first = dayBookings[0];

                  return (
                    <motion.div
                      key={idx}
                      onClick={() => {
                        if (hasBooking) setSelected(dayBookings[0]);
                      }}
                      whileHover={hasBooking ? { scale: 1.06 } : {}}
                      style={{
                        minHeight: 64,
                        borderRadius: 10,
                        padding: "8px 6px",
                        cursor: hasBooking ? "pointer" : "default",
                        background: today
                          ? "rgba(255,45,155,0.12)"
                          : hasBooking
                            ? "rgba(185,79,255,0.08)"
                            : "transparent",
                        border: today
                          ? "1px solid rgba(255,45,155,0.5)"
                          : hasBooking
                            ? "1px solid rgba(185,79,255,0.2)"
                            : "1px solid transparent",
                        transition: "all 0.2s",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          lineHeight: 1,
                          color: !thisMonth
                            ? "rgba(255,255,255,0.18)"
                            : today
                              ? "#ff2d9b"
                              : hasBooking
                                ? "#fff"
                                : "rgba(255,255,255,0.55)",
                          fontWeight: today ? 900 : hasBooking ? 700 : 400,
                        }}
                      >
                        {day}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          gap: 2,
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        {dayBookings.map((b) => (
                          <div
                            key={b.id}
                            title={eventsSummary(b.events)}
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: STATUS_CONFIG[b.status].color,
                              boxShadow: `0 0 6px ${STATUS_CONFIG[b.status].color}`,
                            }}
                          />
                        ))}
                      </div>
                      {first && (
                        <span
                          style={{
                            fontSize: 9,
                            color: STATUS_CONFIG[first.status].color,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            textAlign: "center",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            maxWidth: "100%",
                          }}
                        >
                          {eventsSummary(first.events)}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Month list */}
            {monthBookings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{ marginBottom: 48 }}
              >
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    marginBottom: 16,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  {MONTH_NAMES[viewMonth]} Bookings
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {monthBookings.map((b) => {
                    const cfg = STATUS_CONFIG[b.status];
                    const StatusIcon = cfg.icon;
                    const d = new Date(b.scheduled_at);
                    return (
                      <motion.div
                        key={b.id}
                        whileHover={{ x: 4 }}
                        onClick={() => setSelected(b)}
                        style={{
                          background:
                            "linear-gradient(145deg, #131328, #1a1035)",
                          border: `1px solid ${cfg.border}`,
                          borderRadius: 14,
                          padding: "16px 20px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 18,
                              fontWeight: 900,
                              color: cfg.color,
                              lineHeight: 1,
                            }}
                          >
                            {d.getDate()}
                          </span>
                          <span
                            style={{
                              fontSize: 9,
                              color: cfg.color,
                              opacity: 0.8,
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                            }}
                          >
                            {MONTH_NAMES[d.getMonth()].slice(0, 3)}
                          </span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: "#fff",
                              marginBottom: 3,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {eventsSummary(b.events)}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(255,255,255,0.45)",
                              display: "flex",
                              gap: 12,
                            }}
                          >
                            <span>{formatScheduledTime(b.scheduled_at)}</span>
                            <span>·</span>
                            <span>Booking #{b.id}</span>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            borderRadius: 50,
                            padding: "5px 12px",
                            flexShrink: 0,
                          }}
                        >
                          <StatusIcon size={12} style={{ color: cfg.color }} />
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: cfg.color,
                            }}
                          >
                            {cfg.label}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {monthBookings.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 0 48px",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 14,
                }}
              >
                No bookings in {MONTH_NAMES[viewMonth]} {viewYear}.
              </div>
            )}
          </>
        )}
      </section>

      {selected && (
        <ReservationModal
          booking={selected}
          onClose={() => {
            setSelected(null);
            setCancelError(null);
          }}
          onCancel={handleCancel}
          cancelling={cancellingId === selected.id}
        />
      )}

      {cancelError && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.4)",
            color: "#ef4444",
            borderRadius: 12,
            padding: "12px 20px",
            fontSize: 13,
            zIndex: 1100,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {cancelError}
        </div>
      )}
    </div>
  );
}
