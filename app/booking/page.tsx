"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Users,
  X,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TIME_SLOTS = [
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

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STEPS = [
  { num: 1, label: "Date", icon: Calendar },
  { num: 2, label: "Information", icon: User },
  { num: 3, label: "Confirm", icon: Sparkles },
];

type Comedian = {
  id: number;
  name: string;
  tagline?: string | null;
  image?: string | null;
};

type DayEvent = {
  id: number;
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  color?: string | null;
  description?: string | null;
  comedians?: Comedian[];
};

const DEFAULT_EVENT_COLOR = "#00d4ff";
const BUSY_THRESHOLD = 3;
const FULL_THRESHOLD = 5;

function getDayAvailability(
  date: Date,
  eventCount: number,
): "available" | "partial" | "full" | "past" {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (d < today) return "past";
  if (eventCount >= FULL_THRESHOLD) return "full";
  if (eventCount >= BUSY_THRESHOLD) return "partial";
  return "available";
}

function buildCalendarGrid(year: number, month: number) {
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

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatTimeTo24(time: string) {
  const [tv, mod] = time.split(" ");
  let [h, m] = tv.split(":").map(Number);
  if (mod === "PM" && h < 12) h += 12;
  if (mod === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatTimeDisplay(t: string) {
  if (!t) return "";
  const [hStr, mStr] = t.split(":");
  const h = Number(hStr),
    m = Number(mStr);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function formatEventDateDisplay(dateStr: string) {
  if (!dateStr) return "";
  const datePart = dateStr.split("T")[0];
  const [y, m, d] = datePart.split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function timeStringToMinutes(t: string): number {
  const [hStr, mStr] = t.split(":");
  return Number(hStr) * 60 + Number(mStr || 0);
}

function nearestSlotAtOrAfter(endTime: string): string {
  const targetMinutes = timeStringToMinutes(endTime);
  let best: string | null = null;
  let bestDiff = Infinity;
  for (const slot of TIME_SLOTS) {
    const slotMinutes = timeStringToMinutes(formatTimeTo24(slot));
    const diff = slotMinutes - targetMinutes;
    if (diff >= 0 && diff < bestDiff) {
      bestDiff = diff;
      best = slot;
    }
  }
  return best ?? TIME_SLOTS[TIME_SLOTS.length - 1];
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

function CenteredModal({
  open,
  onClose,
  width = 440,
  children,
}: {
  open: boolean;
  onClose: () => void;
  width?: number;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(6,6,20,0.8)",
          backdropFilter: "blur(8px)",
          animation: "booking-fade-in 0.2s ease",
        }}
      />
      <div
        className="card-neon"
        role="dialog"
        aria-modal="true"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: width,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 70px rgba(0,212,255,0.18)",
          animation: "booking-pop-in 0.2s ease",
          borderRadius: 18,
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
        @keyframes booking-pop-in { from { transform: scale(0.96) translateY(6px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes booking-fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

function DayEventsModal({
  open,
  onClose,
  date,
  events,
  loading,
  loadError,
  selectedIds,
  setSelectedIds,
  onModalClose,
  allEventsByDay,
  viewYear,
  viewMonth,
}: {
  open: boolean;
  onClose: () => void;
  date: Date | null;
  events: DayEvent[];
  loading: boolean;
  loadError: string | null;
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  onModalClose?: (date: Date, allSelectedEvents: DayEvent[]) => void;
  allEventsByDay?: Record<number, DayEvent[]>;
  viewYear?: number;
  viewMonth?: number;
}) {
  const [viewingDate, setViewingDate] = useState<Date | null>(date);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (open && date) {
      setViewingDate(date);
      setCurrentPage(0);
    }
  }, [open, date]);

  const currentViewingEvents = useMemo(() => {
    if (!viewingDate || !allEventsByDay) return [];
    return allEventsByDay[viewingDate.getDate()] ?? [];
  }, [viewingDate, allEventsByDay]);

  const collectAllSelectedEvents = useCallback((): DayEvent[] => {
    if (!allEventsByDay) return [];
    const result: DayEvent[] = [];
    Object.values(allEventsByDay).forEach((dayEvs) => {
      dayEvs.forEach((ev) => {
        if (selectedIds.includes(ev.id)) result.push(ev);
      });
    });
    return result;
  }, [allEventsByDay, selectedIds]);

  const goToPrevDate = () => {
    if (!viewingDate) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const prevDate = new Date(viewingDate);
    prevDate.setDate(prevDate.getDate() - 1);
    prevDate.setHours(0, 0, 0, 0);
    if (prevDate >= today) {
      setViewingDate(prevDate);
      setCurrentPage(0);
    }
  };

  const goToNextDate = () => {
    if (!viewingDate) return;
    const nextDate = new Date(viewingDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setViewingDate(nextDate);
    setCurrentPage(0);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const prevDateTest = new Date(viewingDate || today);
  prevDateTest.setDate(prevDateTest.getDate() - 1);
  prevDateTest.setHours(0, 0, 0, 0);
  const canGoPrevDate = prevDateTest >= today;

  const eventsPerPage = 3;

  const toggleSelected = (id: number) => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    );
  };

  const label = viewingDate
    ? viewingDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  const sorted = currentViewingEvents
    .slice()
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
  const totalPages = Math.ceil(sorted.length / eventsPerPage);
  const paginatedEvents = sorted.slice(
    currentPage * eventsPerPage,
    (currentPage + 1) * eventsPerPage,
  );
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const handleClose = () => {
    if (onModalClose && viewingDate) {
      const allSelected = collectAllSelectedEvents();
      onModalClose(viewingDate, allSelected);
    }
    onClose();
  };

  return (
    <CenteredModal open={open} onClose={handleClose} width={440}>
      <div
        className="flex items-center justify-between gap-3"
        style={{ marginBottom: 16 }}
      >
        <button
          onClick={goToPrevDate}
          disabled={!canGoPrevDate}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            background: canGoPrevDate
              ? "rgba(0,212,255,0.1)"
              : "rgba(255,255,255,0.03)",
            border: canGoPrevDate
              ? "1px solid rgba(0,212,255,0.3)"
              : "1px solid rgba(255,255,255,0.06)",
            color: canGoPrevDate ? "var(--neon-blue)" : "var(--text-muted)",
            cursor: canGoPrevDate ? "pointer" : "not-allowed",
            opacity: canGoPrevDate ? 1 : 0.4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s ease",
          }}
        >
          <ChevronLeft size={14} />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text-bright)",
              textAlign: "center",
            }}
          >
            {label}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: "var(--text-muted)",
              textAlign: "center",
            }}
          >
            {loading
              ? "Checking the schedule…"
              : `${sorted.length} event${sorted.length !== 1 ? "s" : ""} booked`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToNextDate}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              background: "rgba(0,212,255,0.1)",
              border: "1px solid rgba(0,212,255,0.3)",
              color: "var(--neon-blue)",
              cursor: "pointer",
              opacity: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
            <ChevronRight size={14} />
          </button>

          <button
            onClick={handleClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "transparent",
              border: "1px solid var(--border-blue)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              flexShrink: 0,
            }}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {loading ? (
        <div
          style={{
            padding: "24px 12px",
            textAlign: "center",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Loading…
        </div>
      ) : loadError ? (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#ef4444",
            fontSize: 12,
          }}
        >
          {loadError}
        </div>
      ) : sorted.length === 0 ? (
        <div
          style={{
            padding: "26px 14px",
            borderRadius: 14,
            textAlign: "center",
            border: "1px dashed var(--border-blue)",
            background: "rgba(0,212,255,0.03)",
          }}
        >
          <Calendar
            size={20}
            style={{ color: "var(--text-muted)", marginBottom: 8 }}
          />
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-bright)",
            }}
          >
            Nothing booked yet
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            This day is wide open.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
              Tap an event to mark it — selections persist when you close this
              modal.
            </p>
            {totalPages > 1 && (
              <span
                style={{
                  fontSize: 9,
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                {currentPage + 1} / {totalPages}
              </span>
            )}
          </div>
          <div className="space-y-2.5">
            {paginatedEvents.map((ev) => {
              const color = ev.color || DEFAULT_EVENT_COLOR;
              const isSelected = selectedIds.includes(ev.id);
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => toggleSelected(ev.id)}
                  aria-pressed={isSelected}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: 14,
                    borderRadius: 12,
                    cursor: "pointer",
                    background: isSelected ? `${color}1f` : "rgba(0,0,0,0.25)",
                    borderTop: isSelected
                      ? `1px solid ${color}`
                      : `1px solid ${color}33`,
                    borderRight: isSelected
                      ? `1px solid ${color}`
                      : `1px solid ${color}33`,
                    borderBottom: isSelected
                      ? `1px solid ${color}`
                      : `1px solid ${color}33`,
                    borderLeft: `3px solid ${color}`,
                    boxShadow: isSelected ? `0 0 14px ${color}40` : "none",
                    transition:
                      "background 0.15s, box-shadow 0.15s, border-color 0.15s",
                    position: "relative",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text-bright)",
                      }}
                    >
                      {ev.title}
                    </p>
                    <span
                      aria-hidden
                      style={{
                        flexShrink: 0,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: isSelected
                          ? `1px solid ${color}`
                          : "1px solid var(--border-blue)",
                        background: isSelected ? color : "transparent",
                        boxShadow: isSelected ? `0 0 8px ${color}` : "none",
                        transition: "all 0.15s",
                      }}
                    >
                      {isSelected && (
                        <Check size={10} color="#0a0a14" strokeWidth={3} />
                      )}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "5px 0 0",
                      fontSize: 11,
                      color: "var(--text-soft)",
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
                            color: "var(--neon-blue)",
                            border: "1px solid rgba(0,212,255,0.2)",
                          }}
                        >
                          <Users size={9} /> {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div
              className="flex items-center justify-between gap-2 mt-4 pt-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={!canGoPrev}
                className="flex items-center gap-1.5"
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: canGoPrev
                    ? "rgba(0,212,255,0.1)"
                    : "rgba(255,255,255,0.03)",
                  border: canGoPrev
                    ? "1px solid rgba(0,212,255,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
                  color: canGoPrev ? "var(--neon-blue)" : "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: canGoPrev ? "pointer" : "not-allowed",
                  opacity: canGoPrev ? 1 : 0.4,
                  transition: "all 0.2s ease",
                }}
              >
                <ChevronLeft size={13} /> Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={!canGoNext}
                className="flex items-center gap-1.5"
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: canGoNext
                    ? "rgba(0,212,255,0.1)"
                    : "rgba(255,255,255,0.03)",
                  border: canGoNext
                    ? "1px solid rgba(0,212,255,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
                  color: canGoNext ? "var(--neon-blue)" : "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: canGoNext ? "pointer" : "not-allowed",
                  opacity: canGoNext ? 1 : 0.4,
                  transition: "all 0.2s ease",
                }}
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          )}
        </>
      )}
    </CenteredModal>
  );
}

const Step3Component = ({
  name,
  email,
  phone,
  error,
  handleNameChange,
  handleEmailChange,
  handlePhoneChange,
}: any) => (
  <div className="space-y-4">
    {[
      {
        key: "name",
        label: "Full Name",
        type: "text",
        icon: User,
        ph: "Your full name",
        val: name,
        set: handleNameChange,
      },
      {
        key: "email",
        label: "Email Address",
        type: "email",
        icon: Mail,
        ph: "you@example.com",
        val: email,
        set: handleEmailChange,
      },
      {
        key: "phone",
        label: "Phone Number",
        type: "tel",
        icon: Phone,
        ph: "+63 9XX XXX XXXX",
        val: phone,
        set: handlePhoneChange,
      },
    ].map(({ key, label, type, icon: Icon, ph, val, set }) => (
      <div key={key}>
        <label
          className="form-label flex items-center gap-1 mb-2"
          style={{
            color: "var(--neon-pink)",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          <Icon size={11} /> {label}
        </label>
        <input
          value={val}
          onChange={set}
          type={type}
          className="w-full px-4 py-3 rounded-lg"
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid var(--border-blue)",
            color: "var(--text-bright)",
            fontSize: "14px",
            outline: "none",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--neon-blue)";
            e.currentTarget.style.boxShadow = "0 0 10px rgba(0,212,255,0.2)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-blue)";
            e.currentTarget.style.boxShadow = "none";
          }}
          placeholder={ph}
          autoComplete="off"
        />
      </div>
    ))}
    {error && (
      <p
        style={{
          fontSize: 12,
          color: "#ef4444",
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 10,
          padding: "10px 14px",
        }}
      >
        {error}
      </p>
    )}
  </div>
);

const ConfirmationScreen = ({
  selectedDate,
  selectedTime,
  name,
  email,
  phone,
  selectedEvents,
  onBookAgain,
}: {
  selectedDate: Date | null;
  selectedTime: string;
  name: string;
  email: string;
  phone: string;
  selectedEvents: DayEvent[];
  onBookAgain?: () => void;
}) => (
  <div
    className="flex items-center justify-center px-6 py-20 min-h-screen"
    style={{
      background:
        "linear-gradient(180deg, rgba(15,23,42,0.4) 0%, rgba(30,41,59,0.2) 50%, rgba(15,23,42,0.4) 100%)",
      backdropFilter: "blur(10px)",
    }}
  >
    <div className="hero-neon-orbs" aria-hidden style={{ opacity: 0.25 }}>
      <div className="hero-orb hob1" />
      <div className="hero-orb hop1" />
      <div className="hero-orb hob2" />
      <div className="hero-orb hop2" />
    </div>
    <div className="hero-scanlines" aria-hidden style={{ opacity: 0.08 }} />
    <motion.div
      initial={{ scale: 0.92, opacity: 0, y: 24 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative z-10 w-full max-w-md"
    >
      <div
        className="card-neon"
        style={{ borderRadius: 24, padding: 0, overflow: "hidden" }}
      >
        <div
          style={{
            height: 4,
            background:
              "linear-gradient(90deg, var(--neon-blue), var(--neon-pink), var(--neon-blue))",
          }}
        />
        <div style={{ padding: "40px 36px 36px" }}>
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full flex items-center justify-center logo-glow"
              style={{
                background:
                  "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))",
                boxShadow:
                  "0 0 40px rgba(0,212,255,0.35), 0 0 80px rgba(255,45,155,0.2)",
              }}
            >
              <CheckCircle size={36} color="#fff" strokeWidth={2.5} />
            </motion.div>
          </div>

          <div className="text-center mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div
                className="hero-eyebrow inline-flex mx-auto mb-3"
                style={{ fontSize: 10 }}
              >
                <span
                  className="now-live-dot"
                  style={{ background: "#22c55e" }}
                />
                Booking Confirmed
              </div>
              <h2
                className="section-title"
                style={{ fontSize: 30, marginBottom: 6 }}
              >
                You're all set! 🎉
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                Your appointment has been received and is pending confirmation.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              marginBottom: 24,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: "var(--text-muted)",
              }}
            >
              Appointment Details
            </div>
            {[
              { icon: User, label: "Name", value: name },
              { icon: Mail, label: "Email", value: email },
              { icon: Phone, label: "Phone", value: phone },
            ].map(({ icon: Icon, label, value }, idx, arr) => (
              <div
                key={label}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderBottom:
                    idx < arr.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {selectedEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              style={{
                background: "rgba(0,212,255,0.05)",
                border: "1px solid rgba(0,212,255,0.15)",
                borderRadius: 16,
                padding: 14,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--neon-blue)",
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                🎭 Selected Events ({selectedEvents.length})
              </div>

              {Array.from(
                selectedEvents.reduce((acc, ev) => {
                  const dateKey = ev.event_date.split("T")[0];
                  if (!acc.has(dateKey)) acc.set(dateKey, []);
                  acc.get(dateKey)!.push(ev);
                  return acc;
                }, new Map<string, DayEvent[]>()),
              )
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([dateKey, eventsForDay]) => (
                  <div key={dateKey} style={{ marginBottom: 12 }}>
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--neon-blue)",
                        marginBottom: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        margin: 0,
                      }}
                    >
                      <Calendar size={10} /> {formatEventDateDisplay(dateKey)}
                    </p>

                    {eventsForDay
                      .slice()
                      .sort((a, b) => a.start_time.localeCompare(b.start_time))
                      .map((event) => (
                        <div
                          key={event.id}
                          style={{
                            borderRadius: 12,
                            background: "rgba(0,212,255,0.08)",
                            border: "1px solid rgba(0,212,255,0.2)",
                            padding: 12,
                            marginBottom: 8,
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: 700,
                              color: "var(--text-bright)",
                              marginBottom: 4,
                            }}
                          >
                            {event.title}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 11,
                              color: "var(--text-soft)",
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <Clock size={11} />{" "}
                            {formatTimeDisplay(event.start_time)} –{" "}
                            {formatTimeDisplay(event.end_time)}
                          </p>
                          {event.comedians && event.comedians.length > 0 && (
                            <div
                              style={{
                                marginTop: 10,
                                paddingTop: 10,
                                borderTop: "1px solid rgba(0,212,255,0.1)",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: 9,
                                  fontWeight: 700,
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                  color: "var(--text-muted)",
                                  margin: "0 0 8px 0",
                                }}
                              >
                                Performers
                              </p>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns:
                                    "repeat(auto-fit, minmax(60px, 1fr))",
                                  gap: 8,
                                }}
                              >
                                {event.comedians.map((comedian) => (
                                  <div
                                    key={comedian.id}
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      gap: 6,
                                    }}
                                  >
                                    {comedian.image ? (
                                      <img
                                        src={comedian.image}
                                        alt={comedian.name}
                                        style={{
                                          width: 50,
                                          height: 50,
                                          borderRadius: 8,
                                          objectFit: "cover",
                                          border:
                                            "1px solid rgba(0,212,255,0.3)",
                                        }}
                                      />
                                    ) : (
                                      <div
                                        style={{
                                          width: 50,
                                          height: 50,
                                          borderRadius: 8,
                                          background: "rgba(0,212,255,0.1)",
                                          border:
                                            "1px solid rgba(0,212,255,0.3)",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <Users
                                          size={20}
                                          color="var(--neon-blue)"
                                        />
                                      </div>
                                    )}
                                    <span
                                      style={{
                                        fontSize: 9,
                                        fontWeight: 600,
                                        color: "var(--text-soft)",
                                        textAlign: "center",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        maxWidth: "100%",
                                      }}
                                    >
                                      {comedian.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              background: "rgba(34,197,94,0.06)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 24,
              fontSize: 12,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.6,
            }}
          >
            <span style={{ color: "#22c55e", fontWeight: 700 }}>
              📧 Confirmation sent
            </span>{" "}
            to <span style={{ color: "var(--text-soft)" }}>{email}</span>. We'll
            contact you shortly to confirm your slot.
          </motion.div>

          {/* Book Again Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <button
              onClick={onBookAgain}
              style={{
                width: "100%",
                padding: "12px 24px",
                borderRadius: 12,
                background:
                  "linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,212,255,0.05))",
                border: "1px solid rgba(0,212,255,0.3)",
                color: "#00d4ff",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.5px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,212,255,0.08))";
                e.currentTarget.style.boxShadow =
                  "0 0 16px rgba(0,212,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,212,255,0.05))";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Sparkles size={16} />
              Book Again
            </button>
          </motion.div>
        </div>
      </div>
      <p
        className="text-center mt-4"
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <MapPin size={10} /> Rapture Comedy Bar & Cafe · Mon–Sat 9AM–7PM
      </p>
    </motion.div>
  </div>
);

export default function Book() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);

  const [selectedEvents, setSelectedEvents] = useState<DayEvent[]>([]);
  const [monthEvents, setMonthEvents] = useState<DayEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const [activeDate, setActiveDate] = useState<Date | null>(null);
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);

  const calendarCells = buildCalendarGrid(viewYear, viewMonth);

  const loadMonthEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError(null);
    try {
      const res = await fetch(
        `/api/event?year=${viewYear}&month=${viewMonth + 1}&per_page=200`,
        { cache: "no-store" },
      );
      const data = await res.json();
      if (!res.ok || data.success === false)
        throw new Error(data.message || "Failed to load the schedule.");
      const list: DayEvent[] = Array.isArray(data.data?.data)
        ? data.data.data
        : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
      setMonthEvents(list);
    } catch (err) {
      setEventsError(
        err instanceof Error ? err.message : "Failed to load the schedule.",
      );
      setMonthEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }, [viewYear, viewMonth]);

  useEffect(() => {
    loadMonthEvents();
  }, [loadMonthEvents]);

  useEffect(() => {
    if (selectedDate && !selectedTime) setSelectedTime(TIME_SLOTS[0]);
  }, [selectedDate, selectedTime]);

  const eventsByDay = useMemo(() => {
    const map: Record<number, DayEvent[]> = {};
    for (const ev of monthEvents) {
      if (!ev.event_date) continue;
      const parts = ev.event_date.split("T")[0].split("-").map(Number);
      const [evYear, evMonth, evDay] = parts;
      if (evYear === viewYear && evMonth === viewMonth + 1) {
        (map[evDay] ||= []).push(ev);
      }
    }
    return map;
  }, [monthEvents, viewYear, viewMonth]);

  const activeDateEvents = useMemo(() => {
    if (!activeDate) return [];
    return eventsByDay[activeDate.getDate()] ?? [];
  }, [activeDate, eventsByDay]);

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

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
    [],
  );
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    [],
  );
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value),
    [],
  );

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          booking_date: `${formatDate(selectedDate!)} ${formatTimeTo24(selectedTime)}:00`,
          event_ids: selectedEvents.map((ev) => ev.id),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save booking.");
      setSubmitted(true);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }
  // Add this reset function inside the Book component
  const resetBooking = () => {
    // Form inputs
    setSelectedDate(null);
    setSelectedTime("");
    setName("");
    setEmail("");
    setPhone("");

    // Submission state
    setSubmitted(false);
    setLoading(false);
    setError("");

    // Events state
    setSelectedEvents([]);
    setSelectedEventIds([]);
    setActiveDate(null);

    // Step navigation
    setStep(1);
    setDir(1);
  };

  // Then update the ConfirmationScreen component call to:
  if (submitted)
    return (
      <ConfirmationScreen
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        name={name}
        email={email}
        phone={phone}
        selectedEvents={selectedEvents}
        onBookAgain={resetBooking} // ← Add this
      />
    );

  const step1Valid = !!selectedDate;
  const nameValid = name.trim().length >= 1;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneValid = phone.replace(/\D/g, "").length >= 7;
  const step2Valid = nameValid && emailValid && phoneValid;
  const step3Valid = true;
  const canProceed =
    step === 1
      ? step1Valid
      : step === 2
        ? step2Valid
        : step === 3
          ? step3Valid
          : false;

  function Step1() {
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: "var(--card-dark)",
              border: "1px solid var(--border-blue)",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={15} />
          </button>
          <span
            className="gradient-text text-sm font-bold"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            {eventsLoading ? "Loading…" : `${MONTHS[viewMonth]} ${viewYear}`}
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: "var(--card-dark)",
              border: "1px solid var(--border-blue)",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {eventsError && (
          <div
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444",
              fontSize: 11,
              marginBottom: 12,
            }}
          >
            {eventsError}
          </div>
        )}

        <div className="grid grid-cols-7 mb-2">
          {DAYS_SHORT.map((d) => (
            <div
              key={d}
              className="text-center py-1"
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--neon-pink)",
                opacity: 0.5,
              }}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((cell, i) => {
            const dayEvents = cell.current
              ? (eventsByDay[cell.date.getDate()] ?? [])
              : [];
            const avail = cell.current
              ? getDayAvailability(cell.date, dayEvents.length)
              : "past";
            const isSel =
              selectedDate?.toDateString() === cell.date.toDateString();
            const isToday = cell.date.toDateString() === today.toDateString();
            const disabled = !cell.current || avail === "past";
            const fillPct = Math.min(
              100,
              (dayEvents.length / FULL_THRESHOLD) * 100,
            );
            const barColor =
              avail === "available"
                ? "#22c55e"
                : avail === "partial"
                  ? "#f59e0b"
                  : avail === "full"
                    ? "#ef4444"
                    : "transparent";

            return (
              <button
                key={i}
                disabled={disabled}
                onClick={() => {
                  if (!cell.current || avail === "past") return;
                  setSelectedDate(cell.date);
                  setActiveDate(cell.date);
                }}
                className="relative flex flex-col items-center justify-center rounded-lg transition-all duration-150"
                style={{
                  height: 50,
                  padding: 0,
                  overflow: "hidden",
                  opacity: !cell.current ? 0.12 : avail === "past" ? 0.18 : 1,
                  cursor: disabled ? "not-allowed" : "pointer",
                  background: isSel
                    ? "linear-gradient(160deg, rgba(0,212,255,0.16), rgba(255,45,155,0.1))"
                    : "rgba(255,255,255,0.015)",
                  border: isSel
                    ? "1px solid var(--neon-blue)"
                    : "1px solid rgba(255,255,255,0.05)",
                  boxShadow: isSel
                    ? "0 0 16px rgba(0,212,255,0.3), inset 0 0 16px rgba(0,212,255,0.06)"
                    : "none",
                }}
              >
                {isSel && (
                  <>
                    <span
                      className="absolute rounded-full"
                      style={{
                        width: 7,
                        height: 7,
                        left: -4,
                        top: "50%",
                        marginTop: -3.5,
                        background: "#0a0a14",
                        border: "1px solid var(--neon-blue)",
                      }}
                    />
                    <span
                      className="absolute rounded-full"
                      style={{
                        width: 7,
                        height: 7,
                        right: -4,
                        top: "50%",
                        marginTop: -3.5,
                        background: "#0a0a14",
                        border: "1px solid var(--neon-blue)",
                      }}
                    />
                  </>
                )}
                {isToday && cell.current && !isSel && (
                  <span
                    className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "var(--neon-blue)",
                      boxShadow: "0 0 6px var(--neon-blue)",
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: 14,
                    lineHeight: 1,
                    color: isSel
                      ? "#fff"
                      : cell.current
                        ? "var(--text-soft)"
                        : "var(--text-muted)",
                    fontWeight: isSel || isToday ? 700 : 400,
                  }}
                >
                  {cell.date.getDate()}
                </span>
                {cell.current && dayEvents.length > 0 && (
                  <span
                    style={{
                      fontSize: 8,
                      fontWeight: 700,
                      color: isSel ? "rgba(255,255,255,0.85)" : barColor,
                      marginTop: 1,
                    }}
                  >
                    {dayEvents.length} booked
                  </span>
                )}
                {cell.current && avail !== "past" && (
                  <span
                    className="absolute bottom-0 left-0"
                    style={{
                      height: 3,
                      width: "100%",
                      background: "rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        height: "100%",
                        width: `${Math.max(8, fillPct)}%`,
                        background: isSel ? "rgba(255,255,255,0.7)" : barColor,
                        boxShadow: isSel ? "none" : `0 0 6px ${barColor}`,
                        transition: "width 0.2s ease",
                      }}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div
          className="flex flex-wrap gap-4 mt-5 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {[
            ["#22c55e", "Open"],
            ["#f59e0b", "Filling up"],
            ["#ef4444", "Fully booked"],
            ["var(--neon-blue)", "Today"],
          ].map(([c, l]) => (
            <div key={String(l)} className="flex items-center gap-1.5">
              <span
                className="rounded-full"
                style={{ width: 10, height: 3, background: String(c) }}
              />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {l}
              </span>
            </div>
          ))}
        </div>
        <p
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            marginTop: 12,
            textAlign: "center",
          }}
        >
          Tap any day to see what's already booked.
        </p>
      </div>
    );
  }

  function Step3Confirm() {
    return (
      <div className="space-y-4">
        <p
          style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}
        >
          Review your appointment before confirming. Everything good? 🎤
        </p>
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--neon-pink)",
              marginBottom: 8,
            }}
          >
            Personal Information
          </p>
          {[
            { label: "Name", value: name },
            { label: "Email", value: email },
            { label: "Phone", value: phone },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between items-center px-4 py-3 rounded-xl mb-2"
              style={{
                background: "var(--card-dark)",
                border: "1px solid var(--border-blue)",
              }}
            >
              <span
                className="form-label"
                style={{ margin: 0, fontSize: 10, fontWeight: 600 }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-bright)",
                  maxWidth: "58%",
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

        {selectedEvents.length > 0 && (
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--neon-pink)",
                marginBottom: 8,
                marginTop: 16,
              }}
            >
              Selected Events ({selectedEvents.length})
            </p>

            {Array.from(
              selectedEvents.reduce((acc, ev) => {
                const dateKey = ev.event_date.split("T")[0];
                if (!acc.has(dateKey)) acc.set(dateKey, []);
                acc.get(dateKey)!.push(ev);
                return acc;
              }, new Map<string, DayEvent[]>()),
            )
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([dateKey, eventsForDay]) => (
                <div key={dateKey} style={{ marginBottom: 12 }}>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--neon-blue)",
                      marginBottom: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Calendar size={10} /> {formatEventDateDisplay(dateKey)}
                  </p>

                  {eventsForDay
                    .slice()
                    .sort((a, b) => a.start_time.localeCompare(b.start_time))
                    .map((event) => (
                      <div
                        key={event.id}
                        style={{
                          borderRadius: 12,
                          background: "rgba(0,212,255,0.05)",
                          border: "1px solid rgba(0,212,255,0.2)",
                          padding: 12,
                          marginBottom: 8,
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--text-bright)",
                            marginBottom: 4,
                          }}
                        >
                          {event.title}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 11,
                            color: "var(--text-soft)",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <Clock size={11} />{" "}
                          {formatTimeDisplay(event.start_time)} –{" "}
                          {formatTimeDisplay(event.end_time)}
                        </p>
                        {event.comedians && event.comedians.length > 0 && (
                          <div
                            style={{
                              marginTop: 10,
                              paddingTop: 10,
                              borderTop: "1px solid rgba(0,212,255,0.1)",
                            }}
                          >
                            <p
                              style={{
                                fontSize: 9,
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "var(--text-muted)",
                                margin: "0 0 8px 0",
                              }}
                            >
                              Performers
                            </p>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fit, minmax(60px, 1fr))",
                                gap: 8,
                              }}
                            >
                              {event.comedians.map((comedian) => (
                                <div
                                  key={comedian.id}
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 6,
                                  }}
                                >
                                  {comedian.image ? (
                                    <img
                                      src={comedian.image}
                                      alt={comedian.name}
                                      style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 8,
                                        objectFit: "cover",
                                        border: "1px solid rgba(0,212,255,0.3)",
                                      }}
                                    />
                                  ) : (
                                    <div
                                      style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 8,
                                        background: "rgba(0,212,255,0.1)",
                                        border: "1px solid rgba(0,212,255,0.3)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Users
                                        size={20}
                                        color="var(--neon-blue)"
                                      />
                                    </div>
                                  )}
                                  <span
                                    style={{
                                      fontSize: 9,
                                      fontWeight: 600,
                                      color: "var(--text-soft)",
                                      textAlign: "center",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      maxWidth: "100%",
                                    }}
                                  >
                                    {comedian.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        )}

        {error && (
          <p
            style={{
              fontSize: 12,
              color: "#ef4444",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 10,
              padding: "10px 14px",
              marginTop: 12,
            }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  const StepComponent = [Step1, Step3Component, Step3Confirm][step - 1];

  return (
    <div
      className="w-full"
      style={{
        background:
          "linear-gradient(180deg, rgba(15,23,42,0.4) 0%, rgba(30,41,59,0.2) 50%, rgba(15,23,42,0.4) 100%)",
        backdropFilter: "blur(10px)",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <div className="hero-neon-orbs" aria-hidden style={{ opacity: 0.25 }}>
        <div className="hero-orb hob1" />
        <div className="hero-orb hop1" />
        <div className="hero-orb hob2" />
        <div className="hero-orb hop2" />
      </div>
      <div className="hero-scanlines" aria-hidden style={{ opacity: 0.08 }} />

      <div
        className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12"
        style={{ zIndex: 2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="hero-eyebrow inline-flex mx-auto mb-3">
            <span
              className="now-live-dot"
              style={{ background: "var(--neon-pink)" }}
            />
            Reserve Your Appointment
          </div>
          <h1
            className="section-title"
            style={{ fontSize: "clamp(28px,5vw,44px)", marginBottom: 6 }}
          >
            Book Your Visit
          </h1>
          <p
            className="flex items-center justify-center gap-1.5"
            style={{ color: "var(--text-muted)", fontSize: 13 }}
          >
            <MapPin size={12} /> Rapture Comedy Bar & Cafe &nbsp;·&nbsp; Mon–Sat
            9AM–7PM
          </p>
        </motion.div>

        <div className="flex items-center justify-center mb-6 overflow-x-auto">
          {STEPS.map((s, idx) => {
            const done = step > s.num;
            const curr = step === s.num;
            const Icon = s.icon;
            return (
              <div key={s.num} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => done && go(s.num)}
                  disabled={!done && !curr}
                  className="flex flex-col items-center gap-1 transition-all"
                  style={{ cursor: done ? "pointer" : "default" }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: curr
                        ? "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))"
                        : done
                          ? "linear-gradient(135deg, rgba(0,212,255,0.12), rgba(255,45,155,0.08))"
                          : "var(--card-dark)",
                      border: curr
                        ? "none"
                        : done
                          ? "1px solid var(--neon-blue)"
                          : "1px solid var(--border-blue)",
                      boxShadow: curr
                        ? "0 0 20px rgba(0,212,255,0.35), 0 0 40px rgba(255,45,155,0.2)"
                        : "none",
                    }}
                  >
                    {done ? (
                      <CheckCircle
                        size={14}
                        style={{ color: "var(--neon-blue)" }}
                      />
                    ) : (
                      <Icon
                        size={13}
                        style={{ color: curr ? "#fff" : "var(--text-muted)" }}
                      />
                    )}
                  </div>
                  <span
                    className="hidden sm:block"
                    style={{
                      fontSize: 8,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: curr
                        ? "var(--neon-pink)"
                        : done
                          ? "var(--neon-blue)"
                          : "var(--text-muted)",
                      opacity: !curr && !done ? 0.4 : 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.label}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div
                    className="w-6 sm:w-10 h-px mx-0.5 flex-shrink-0"
                    style={{
                      marginBottom: 14,
                      background: done
                        ? "linear-gradient(90deg, var(--neon-blue), var(--neon-pink))"
                        : "var(--border-blue)",
                      transition: "background 0.4s",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="card-neon" style={{ padding: 0, borderRadius: 20 }}>
          <div
            className="flex items-center gap-3 px-5 pt-4 pb-3"
            style={{ borderBottom: "1px solid var(--border-blue)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 logo-glow"
              style={{
                background:
                  "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))",
              }}
            >
              {(() => {
                const Icon = STEPS[step - 1].icon;
                return <Icon size={14} color="#fff" />;
              })()}
            </div>
            <div>
              <p
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--neon-pink)",
                  opacity: 0.6,
                  margin: 0,
                }}
              >
                Step {step} of 3
              </p>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-bright)",
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                {STEPS[step - 1].label}
              </p>
            </div>
          </div>

          <div
            className="px-5 py-5 relative"
            style={{
              minHeight: "auto",
              maxHeight: "calc(100vh - 400px)",
              overflowY: step === 3 ? "auto" : "hidden",
              overflowX: "hidden",
            }}
          >
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {step === 2 ? (
                  <Step3Component
                    name={name}
                    email={email}
                    phone={phone}
                    error={error}
                    handleNameChange={handleNameChange}
                    handleEmailChange={handleEmailChange}
                    handlePhoneChange={handlePhoneChange}
                  />
                ) : (
                  <StepComponent />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="flex items-center justify-between gap-3 px-5 py-4"
            style={{ borderTop: "1px solid var(--border-blue)" }}
          >
            <button
              onClick={() => go(step - 1)}
              disabled={step === 1}
              className="btn-outline flex items-center gap-2 text-xs sm:text-sm"
              style={{
                padding: "8px 16px",
                opacity: step === 1 ? 0 : 1,
                pointerEvents: step === 1 ? "none" : "auto",
              }}
            >
              <ArrowLeft size={12} /> Back
            </button>
            {step < 3 ? (
              <button
                onClick={() => canProceed && go(step + 1)}
                className="btn-primary flex items-center gap-2 text-xs sm:text-sm"
                style={{
                  padding: "8px 20px",
                  opacity: canProceed ? 1 : 0.3,
                  cursor: canProceed ? "pointer" : "not-allowed",
                }}
              >
                Continue <ArrowRight size={12} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center gap-2 text-xs sm:text-sm"
                style={{
                  padding: "8px 20px",
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  "Confirming…"
                ) : (
                  <>
                    <Sparkles size={12} /> Confirm
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div
          className="mt-4 rounded-full overflow-hidden"
          style={{ height: 2, background: "var(--border-blue)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--neon-blue), var(--neon-pink))",
            }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          />
        </div>
        <p
          className="text-center mt-2"
          style={{
            fontSize: 9,
            color: "var(--text-muted)",
            letterSpacing: "0.1em",
          }}
        >
          Step {step} of 3
        </p>
      </div>

      <DayEventsModal
        open={activeDate !== null}
        onClose={() => setActiveDate(null)}
        date={activeDate}
        events={activeDateEvents}
        loading={eventsLoading}
        loadError={eventsError}
        selectedIds={selectedEventIds}
        setSelectedIds={setSelectedEventIds}
        allEventsByDay={eventsByDay}
        viewYear={viewYear}
        viewMonth={viewMonth}
        onModalClose={(date, allSelectedEventsFromModal) => {
          setSelectedDate(date);
          setSelectedEvents(allSelectedEventsFromModal);

          if (allSelectedEventsFromModal.length > 0) {
            const latestEndMinutes = Math.max(
              ...allSelectedEventsFromModal.map((ev) =>
                timeStringToMinutes(ev.end_time),
              ),
            );
            const latestEndEvent = allSelectedEventsFromModal.find(
              (ev) => timeStringToMinutes(ev.end_time) === latestEndMinutes,
            )!;
            setSelectedTime(nearestSlotAtOrAfter(latestEndEvent.end_time));
          } else if (activeDateEvents.length > 0) {
            const latestEndMinutes = Math.max(
              ...activeDateEvents.map((ev) => timeStringToMinutes(ev.end_time)),
            );
            const latestEndEvent = activeDateEvents.find(
              (ev) => timeStringToMinutes(ev.end_time) === latestEndMinutes,
            )!;
            setSelectedTime(nearestSlotAtOrAfter(latestEndEvent.end_time));
          } else {
            setSelectedTime(TIME_SLOTS[0]);
          }
        }}
      />
    </div>
  );
}
