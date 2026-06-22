"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  { num: 2, label: "Time", icon: Clock },
  { num: 3, label: "Information", icon: User },
  { num: 4, label: "Confirm", icon: Sparkles },
];

function getDayAvailability(
  date: Date,
): "available" | "partial" | "full" | "past" {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (d < today) return "past";
  if (date.getDay() === 0) return "full";
  const seed = date.getDate() + date.getMonth() * 31;
  const r = ((seed * 1103515245 + 12345) & 0x7fffffff) % 10;
  if (r < 6) return "available";
  if (r < 8) return "partial";
  return "full";
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

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

// Step 3 extracted outside to prevent recreation
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
    {/* Personal info */}
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
          className="form-label flex items-center gap-1.5 mb-2"
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

export default function Book() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
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

  const calendarCells = buildCalendarGrid(viewYear, viewMonth);

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

  // Use useCallback to prevent re-renders
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
        // ← Next.js route, not Laravel directly
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          booking_date: `${formatDate(selectedDate!)} ${formatTimeTo24(selectedTime)}:00`,
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

  /* ── Success ── */
  /* ── Success ── */
  if (submitted)
    return (
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
          {/* Card */}
          <div
            className="card-neon"
            style={{
              borderRadius: 24,
              padding: 0,
              overflow: "hidden",
            }}
          >
            {/* Top neon bar */}
            <div
              style={{
                height: 4,
                background:
                  "linear-gradient(90deg, var(--neon-blue), var(--neon-pink), var(--neon-blue))",
              }}
            />

            <div style={{ padding: "40px 36px 36px" }}>
              {/* Icon */}
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

              {/* Heading */}
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
                    Your appointment has been received and is pending
                    confirmation.
                  </p>
                </motion.div>
              </div>

              {/* Details card */}
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
                  {
                    icon: Calendar,
                    label: "Date",
                    value: selectedDate?.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    }),
                  },
                  {
                    icon: Clock,
                    label: "Time",
                    value: selectedTime,
                    accent: true,
                  },
                  { icon: User, label: "Name", value: name },
                  { icon: Mail, label: "Email", value: email },
                  { icon: Phone, label: "Phone", value: phone },
                ].map(({ icon: Icon, label, value, accent }, idx, arr) => (
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
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: accent
                          ? "rgba(0,212,255,0.1)"
                          : "rgba(255,255,255,0.04)",
                        border: accent
                          ? "1px solid rgba(0,212,255,0.2)"
                          : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <Icon
                        size={12}
                        style={{
                          color: accent
                            ? "var(--neon-blue)"
                            : "var(--text-muted)",
                        }}
                      />
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
                          color: accent
                            ? "var(--neon-blue)"
                            : "var(--text-bright)",
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

              {/* Email notice */}
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
                to <span style={{ color: "var(--text-soft)" }}>{email}</span>.
                We'll contact you shortly to confirm your slot.
              </motion.div>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                onClick={() => {
                  setSubmitted(false);
                  setSelectedDate(null);
                  setSelectedTime("");
                  setName("");
                  setEmail("");
                  setPhone("");
                  setStep(1);
                  setError("");
                }}
                className="btn-primary w-full flex items-center justify-center gap-2"
                style={{ padding: "12px 24px", fontSize: 14 }}
              >
                <Calendar size={14} />
                Book Another Appointment
              </motion.button>
            </div>
          </div>

          {/* Bottom label */}
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
            <MapPin size={10} /> MDS Dental & Aesthetic Clinic · Mon–Sat 9AM–7PM
          </p>
        </motion.div>
      </div>
    );

  const step1Valid = !!selectedDate;
  const step2Valid = !!selectedTime;
  const step3Valid = !!name && !!email && !!phone;
  const canProceed = [step1Valid, step2Valid, step3Valid, true][step - 1];

  /* ── Step 1: Date only ── */
  function Step1() {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
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
            {MONTHS[viewMonth]} {viewYear}
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

        <div className="grid grid-cols-7 mb-1">
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

        <div className="grid grid-cols-7 gap-0.5">
          {calendarCells.map((cell, i) => {
            const avail = cell.current ? getDayAvailability(cell.date) : "past";
            const isSel =
              selectedDate?.toDateString() === cell.date.toDateString();
            const isToday = cell.date.toDateString() === today.toDateString();
            const disabled =
              !cell.current || avail === "past" || avail === "full";
            const dotColors: Record<string, string> = {
              available: "#22c55e",
              partial: "#f59e0b",
              full: "#ef4444",
              past: "transparent",
            };
            return (
              <button
                key={i}
                disabled={disabled}
                onClick={() => !disabled && setSelectedDate(cell.date)}
                className="relative flex flex-col items-center justify-center rounded-xl py-2 transition-all duration-150"
                style={{
                  opacity: !cell.current
                    ? 0.15
                    : avail === "past"
                      ? 0.2
                      : avail === "full"
                        ? 0.28
                        : 1,
                  cursor: disabled ? "not-allowed" : "pointer",
                  background: isSel
                    ? "linear-gradient(135deg, rgba(0,212,255,0.18), rgba(255,45,155,0.12))"
                    : "transparent",
                  border: isSel
                    ? "1px solid var(--neon-blue)"
                    : "1px solid transparent",
                  boxShadow: isSel ? "0 0 14px rgba(0,212,255,0.25)" : "none",
                }}
              >
                {isToday && cell.current && (
                  <span
                    className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "var(--neon-blue)",
                      boxShadow: "0 0 6px var(--neon-blue)",
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: 13,
                    lineHeight: 1,
                    marginBottom: 5,
                    color: isSel
                      ? "#fff"
                      : cell.current
                        ? "var(--text-soft)"
                        : "var(--text-muted)",
                    fontWeight: isSel ? 700 : 400,
                    textDecoration: avail === "full" ? "line-through" : "none",
                  }}
                >
                  {cell.date.getDate()}
                </span>
                {cell.current && avail !== "past" && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: isSel
                        ? "rgba(255,255,255,0.55)"
                        : dotColors[avail],
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div
          className="flex flex-wrap gap-4 mt-4 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {[
            ["#22c55e", "Available"],
            ["#f59e0b", "Few slots"],
            ["#ef4444", "Fully booked"],
            ["var(--neon-blue)", "Today"],
          ].map(([c, l]) => (
            <div key={String(l)} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: String(c) }}
              />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Step 2: Time ── */
  function Step2() {
    return (
      <div>
        {selectedDate && (
          <div
            className="mb-5 px-4 py-2.5 rounded-xl card-neon"
            style={{ fontSize: 13 }}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TIME_SLOTS.map((t) => {
            const isSel = selectedTime === t;
            return (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className="py-3 px-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: isSel
                    ? "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))"
                    : "var(--card-dark)",
                  border: isSel ? "none" : "1px solid var(--border-blue)",
                  color: isSel ? "#fff" : "var(--text-soft)",
                  fontWeight: isSel ? 700 : 500,
                  boxShadow: isSel
                    ? "0 0 20px rgba(0,212,255,0.3), 0 0 40px rgba(255,45,155,0.15)"
                    : "none",
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Step 4: Confirm ── */
  function Step4() {
    return (
      <div className="space-y-2.5 max-h-96 overflow-y-auto">
        <p
          style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}
        >
          Review your appointment before confirming. Everything good? 🎤
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
          { label: "Name", value: name },
          { label: "Email", value: email },
          { label: "Phone", value: phone },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between items-center px-4 py-3 rounded-xl"
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
  }

  const StepComponent = [Step1, Step2, Step3Component, Step4][step - 1];

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
        {/* Header */}
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
            <MapPin size={12} /> MDS Dental & Aesthetic Clinic &nbsp;·&nbsp;
            Mon–Sat 9AM–7PM
          </p>
        </motion.div>

        {/* Step indicators */}
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

        {/* Card */}
        <div className="card-neon" style={{ padding: 0, borderRadius: 20 }}>
          {/* Card header */}
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
                Step {step} of 4
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

          {/* Step body - with proper height management */}
          <div
            className="px-5 py-5 relative"
            style={{
              minHeight: "auto",
              maxHeight: "calc(100vh - 400px)",
              overflow: step === 4 ? "auto" : "hidden",
            }}
          >
            <AnimatePresence mode="wait" custom={step > step - 1 ? 1 : -1}>
              <motion.div
                key={step}
                custom={step > step - 1 ? 1 : -1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {step === 3 ? (
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

          {/* Nav footer */}
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

            {step < 4 ? (
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

        {/* Progress bar */}
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
            animate={{ width: `${(step / 4) * 100}%` }}
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
          Step {step} of 4
        </p>
      </div>
    </div>
  );
}
