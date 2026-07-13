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
  Mail,
} from "lucide-react";
import RaptureLogo from "@/app/rapture_logo.png";
import Image from 'next/image';

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
  full_name?: string;
  audience_name?: string;
  email?: string;
  audience_email?: string;
  phone?: string;
  scheduled_at?: string | null;
  status?: string;
  notes?: string;
}

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

  // Get email for the booking
  const clientEmail =
    modal.booking.email || modal.booking.audience_email || "N/A";

  return (
    <SlidePanel
      open={modal.open}
      onClose={onClose}
      width={440}
      glowColor={isApprove ? "rgba(0,212,255,0.15)" : "rgba(255,45,155,0.15)"}
    >
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

      {/* Booking Details */}
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
            ["Email", clientEmail],
            [
              "Date",
              modal.booking.scheduled_at
                ? new Date(modal.booking.scheduled_at).toLocaleDateString()
                : "—",
            ],
            [
              "Time",
              modal.booking.scheduled_at
                ? new Date(modal.booking.scheduled_at).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )
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
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {label === "Email" && <Mail size={10} />}
              {label}
            </span>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-bright)",
                fontWeight: 600,
                marginTop: 4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: label === "Email" ? "normal" : "nowrap",
                wordBreak: "break-all",
              }}
            >
              {val || "—"}
            </div>
          </div>
        ))}
      </div>

      {/* Notes / Message */}
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
          rows={6}
          value={modal.notes}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            background: "rgba(0,0,0,0.3)",
            border: `1px solid ${accent}40`,
            borderRadius: 10,
            color: "var(--text-bright)",
            fontSize: 13,
            resize: "none",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "var(--app-font-sans)",
            lineHeight: 1.5,
          }}
        />
        <div
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            marginTop: 6,
            textAlign: "right",
          }}
        >
          {modal.notes.length} characters
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onClose}
          disabled={modal.submitting}
          style={{
            flex: 1,
            padding: "12px 0",
            borderRadius: 10,
            cursor: modal.submitting ? "not-allowed" : "pointer",
            background: "transparent",
            border: "1px solid rgba(0,212,255,0.2)",
            color: "var(--text-soft)",
            fontSize: 13,
            fontWeight: 600,
            opacity: modal.submitting ? 0.5 : 1,
            transition: "all 0.2s",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={modal.submitting || !modal.notes.trim()}
          style={{
            flex: 1,
            padding: "12px 0",
            borderRadius: 10,
            cursor:
              modal.submitting || !modal.notes.trim()
                ? "not-allowed"
                : "pointer",
            border: "none",
            background: `linear-gradient(135deg, ${isApprove ? "var(--neon-blue), var(--neon-purple)" : "var(--neon-pink), var(--neon-purple)"})`,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            boxShadow: `0 0 20px ${isApprove ? "rgba(0,212,255,0.3)" : "rgba(255,45,155,0.3)"}`,
            opacity: modal.submitting || !modal.notes.trim() ? 0.5 : 1,
            transition: "all 0.2s",
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

export default function AdminBooking() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0],
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionModal, setActionModal] = useState<ActionModalState>({
    open: false,
    type: null,
    booking: null,
    notes: "",
    submitting: false,
  });

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Fetch bookings directly from Laravel API
  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // Fetch directly from Laravel API
      const res = await fetch(`${API_URL}/api/booking`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      let list: Booking[] = [];

      // Handle various response formats
      if (Array.isArray(data)) {
        list = data;
      } else if (data?.data) {
        if (Array.isArray(data.data)) {
          list = data.data;
        } else if (Array.isArray(data.data.data)) {
          list = data.data.data;
        }
      }

      // Normalize field names (full_name → audience_name for compatibility)
      list = list.map((booking) => ({
        ...booking,
        audience_name: booking.full_name || booking.audience_name,
        audience_email: booking.email || booking.audience_email,
      }));

      setBookings(list);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setBookings([]);
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

  const getDefaultMessage = (type: string, booking: Booking) => {
    const clientName = booking.full_name || booking.audience_name || "Guest";
    const clientEmail = booking.email || "-";

    if (type === "approve") {
      return `Hello ${clientName},\n\nWe are pleased to confirm your appointment booking.\n\nIf you have any questions, please reply to this email or contact us.\n\nThank you!`;
    } else {
      return `Hello ${clientName},\n\nUnfortunately, we are unable to accommodate your requested time slot.\n\nPlease reach out to us at your earliest convenience to reschedule.\n\nThank you for your understanding.`;
    }
  };

  const openActionModal = (type: string, booking: Booking) => {
    if (type === "approve") {
      const now = new Date();
      const bdt = booking.scheduled_at ? new Date(booking.scheduled_at) : null;
      if (bdt && bdt < now) {
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
    const defaultMsg = getDefaultMessage(type, booking);
    setActionModal({
      open: true,
      type,
      booking,
      notes: defaultMsg,
      submitting: false,
    });
  };

  const handleActionSubmit = async () => {
    const { type, booking, notes } = actionModal;
    if (!notes.trim()) {
      alert("Please add a note/message.");
      return;
    }
    setActionModal((p) => ({ ...p, submitting: true }));
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const status = type === "approve" ? "confirmed" : "cancelled";

      const res = await fetch(`${API_URL}/api/booking/${booking?.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status,
          notes,
          client_email: booking?.email || booking?.audience_email,
        }),
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
      b.scheduled_at ? b.scheduled_at.split("T")[0] : undefined,
    ),
  );
  const todayBookings = safeBookings.filter((b) => {
    const d = b.scheduled_at ? b.scheduled_at.split("T")[0] : undefined;
    return d === selectedDate;
  });
  const pendingBookings = safeBookings.filter(
    (b) => b.status === "pending" || b.status === "new",
  );
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
          <Image src={RaptureLogo} alt="Rapture Logo" width={32} height={32} />
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
            Rapture Cafe Bar
          </p>
          <p
            style={{
              margin: "3px 0 0",
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            Admin Dashboard · Manage appointments
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
              style={{
                padding: "13px 44px",
                textAlign: "center",
                minWidth: 64,
              }}
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
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(0,212,255,0.25)";
                            e.currentTarget.style.borderColor =
                              "rgba(0,212,255,0.5)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(0,212,255,0.15)";
                            e.currentTarget.style.borderColor =
                              "rgba(0,212,255,0.35)";
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
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,45,155,0.2)";
                            e.currentTarget.style.borderColor =
                              "rgba(255,45,155,0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,45,155,0.12)";
                            e.currentTarget.style.borderColor =
                              "rgba(255,45,155,0.3)";
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
