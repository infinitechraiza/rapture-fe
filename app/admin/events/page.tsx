"use client";

import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Calendar,
  AlignLeft,
  Trash2,
  Clock,
  Users,
  Check,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

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

const EVENT_COLORS = [
  { value: "#00d4ff", label: "Blue" },
  { value: "#a855f7", label: "Purple" },
  { value: "#10b981", label: "Green" },
  { value: "#ff2d9b", label: "Pink" },
  { value: "#f59e0b", label: "Amber" },
];
const DEFAULT_COLOR = EVENT_COLORS[0].value;

type CalendarEvent = {
  id: number;
  user_id?: number | null;
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  color: string;
  description: string | null;
  comedians?: Comedian[];
};

type Comedian = {
  id: number;
  name: string;
  tagline?: string | null;
  image?: string | null;
  genre?: string | null;
  status: "active" | "inactive";
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function formatTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

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
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 28,
            boxSizing: "border-box",
          }}
        >
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
const inputErr: React.CSSProperties = {
  ...inputBase,
  border: "1px solid rgba(255,45,155,0.5)",
};
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "var(--text-muted)",
  marginBottom: 6,
};
const errMsg: React.CSSProperties = {
  fontSize: 11,
  color: "var(--neon-pink)",
  marginTop: 4,
};

function ComedianMultiSelect({
  comedians,
  loading,
  loadError,
  selectedIds,
  onToggle,
  onSelectAll,
  error,
}: {
  comedians: Comedian[];
  loading: boolean;
  loadError: string | null;
  selectedIds: number[];
  onToggle: (id: number) => void;
  onSelectAll: (selectAll: boolean) => void;
  error?: string;
}) {
  const allSelected = comedians.length > 0 && selectedIds.length === comedians.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < comedians.length;

  return (
    <div>
      <label style={labelStyle}>
        Comedians <span style={{ color: "var(--neon-pink)" }}>*</span>
        {selectedIds.length > 0 && (
          <span
            style={{
              marginLeft: 6,
              color: "var(--neon-blue)",
              fontWeight: 600,
              textTransform: "none",
              letterSpacing: 0,
            }}
          >
            ({selectedIds.length} selected)
          </span>
        )}
      </label>

      {loading ? (
        <div
          style={{
            padding: "14px",
            borderRadius: 10,
            border: "1px solid rgba(0,212,255,0.15)",
            color: "var(--text-muted)",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          Loading comedians…
        </div>
      ) : loadError ? (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(255,45,155,0.1)",
            border: "1px solid rgba(255,45,155,0.3)",
            color: "var(--neon-pink)",
            fontSize: 12,
          }}
        >
          {loadError}
        </div>
      ) : comedians.length === 0 ? (
        <div
          style={{
            padding: "14px",
            borderRadius: 10,
            border: "1px dashed rgba(0,212,255,0.2)",
            color: "var(--text-muted)",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          No active comedians found.
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => onSelectAll(!allSelected)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 10px",
              marginBottom: 6,
              borderRadius: 9,
              cursor: "pointer",
              textAlign: "left",
              border: "1px solid rgba(0,212,255,0.3)",
              background: allSelected || someSelected ? "rgba(0,212,255,0.15)" : "rgba(0,0,0,0.2)",
              transition: "background 0.15s, border-color 0.15s",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(0,212,255,0.3)",
                background: allSelected || someSelected
                  ? "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))"
                  : "transparent",
                flexShrink: 0,
              }}
            >
              {(allSelected || someSelected) && <Check size={12} style={{ color: "white" }} />}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-bright)",
                flex: 1,
              }}
            >
              {allSelected ? "Deselect All" : "Select All"}
            </p>
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 220,
              overflowY: "auto",
              padding: 6,
              borderRadius: 12,
              border: `1px solid ${error ? "rgba(255,45,155,0.5)" : "rgba(0,212,255,0.15)"}`,
              background: "rgba(0,0,0,0.2)",
            }}
          >
            {comedians.map((c) => {
              const checked = selectedIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onToggle(c.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 9,
                    cursor: "pointer",
                    textAlign: "left",
                    border: checked
                      ? "1px solid rgba(0,212,255,0.4)"
                      : "1px solid transparent",
                    background: checked ? "rgba(0,212,255,0.1)" : "transparent",
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                >
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      {getInitials(c.name)}
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-bright)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {c.name}
                    </p>
                    {c.tagline && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: 11,
                          color: "var(--text-muted)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {c.tagline}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: checked ? "none" : "1px solid rgba(0,212,255,0.3)",
                      background: checked
                        ? "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))"
                        : "transparent",
                    }}
                  >
                    {checked && <Check size={12} style={{ color: "white" }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
      {error && <p style={errMsg}>{error}</p>}
    </div>
  );
}

type EventForm = {
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  color: string;
  description: string;
  comedian_ids: number[];
};

const EMPTY_FORM: EventForm = {
  title: "",
  event_date: "",
  start_time: "",
  end_time: "",
  color: DEFAULT_COLOR,
  description: "",
  comedian_ids: [],
};

function NewEventModal({
  open,
  onClose,
  onSubmit,
  submitting,
  serverError,
  defaultDate,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: EventForm) => Promise<boolean>;
  submitting: boolean;
  serverError: string | null;
  defaultDate?: string;
}) {
  const [form, setForm] = useState<EventForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EventForm, string>>
  >({});

  const [comedians, setComedians] = useState<Comedian[]>([]);
  const [comediansLoading, setComediansLoading] = useState(false);
  const [comediansError, setComediansError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm((p) => ({
        ...EMPTY_FORM,
        event_date: defaultDate ?? p.event_date,
      }));
      setErrors({});
    }
  }, [open, defaultDate]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      setComediansLoading(true);
      setComediansError(null);
      try {
        const res = await fetch("/api/comedians?status=active", {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok || data.success === false) {
          throw new Error(data.message || "Failed to load comedians.");
        }
        const list: Comedian[] = data.data?.data ?? data.data ?? [];
        if (!cancelled) setComedians(list);
      } catch (err) {
        if (!cancelled) {
          setComediansError(
            err instanceof Error ? err.message : "Failed to load comedians.",
          );
        }
      } finally {
        if (!cancelled) setComediansLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const set = (key: keyof EventForm, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const toggleComedian = (id: number) => {
    setForm((p) => ({
      ...p,
      comedian_ids: p.comedian_ids.includes(id)
        ? p.comedian_ids.filter((existing) => existing !== id)
        : [...p.comedian_ids, id],
    }));
    if (errors.comedian_ids)
      setErrors((p) => ({ ...p, comedian_ids: undefined }));
  };

  const handleSelectAll = (selectAll: boolean) => {
    setForm((p) => ({
      ...p,
      comedian_ids: selectAll ? comedians.map((c) => c.id) : [],
    }));
    if (errors.comedian_ids)
      setErrors((p) => ({ ...p, comedian_ids: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.event_date) e.event_date = "Event date is required.";
    if (!form.start_time) e.start_time = "Start time is required.";
    if (!form.end_time) e.end_time = "End time is required.";
    if (form.start_time && form.end_time && form.end_time <= form.start_time)
      e.end_time = "End time must be after start time.";
    if (form.comedian_ids.length === 0)
      e.comedian_ids = "Select at least one comedian.";
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
    <SlidePanel
      open={open}
      onClose={handleClose}
      width={460}
      glowColor="rgba(0,212,255,0.15)"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "rgba(0,212,255,0.12)",
              border: "1px solid rgba(0,212,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar size={16} style={{ color: "var(--neon-blue)" }} />
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text-bright)",
              }}
            >
              New Event
            </h3>
            <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>
              Saved directly to the database
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          style={{
            width: 32,
            height: 32,
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
          <X size={14} />
        </button>
      </div>

      <div
        style={{
          height: 1,
          background: "rgba(0,212,255,0.1)",
          marginBottom: 24,
        }}
      />

      {serverError && (
        <div
          style={{
            marginBottom: 18,
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(255,45,155,0.1)",
            border: "1px solid rgba(255,45,155,0.3)",
            color: "var(--neon-pink)",
            fontSize: 12,
          }}
        >
          {serverError}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label style={labelStyle}>
            Title <span style={{ color: "var(--neon-pink)" }}>*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Team standup"
            style={errors.title ? inputErr : inputBase}
          />
          {errors.title && <p style={errMsg}>{errors.title}</p>}
        </div>

        <div>
          <label style={labelStyle}>
            Date <span style={{ color: "var(--neon-pink)" }}>*</span>
          </label>
          <input
            type="date"
            value={form.event_date}
            onChange={(e) => set("event_date", e.target.value)}
            style={{
              ...(errors.event_date ? inputErr : inputBase),
              colorScheme: "dark",
            }}
          />
          {errors.event_date && <p style={errMsg}>{errors.event_date}</p>}
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label style={labelStyle}>
              Start Time <span style={{ color: "var(--neon-pink)" }}>*</span>
            </label>
            <input
              type="time"
              value={form.start_time}
              onChange={(e) => set("start_time", e.target.value)}
              style={{
                ...(errors.start_time ? inputErr : inputBase),
                colorScheme: "dark",
              }}
            />
            {errors.start_time && <p style={errMsg}>{errors.start_time}</p>}
          </div>
          <div>
            <label style={labelStyle}>
              End Time <span style={{ color: "var(--neon-pink)" }}>*</span>
            </label>
            <input
              type="time"
              value={form.end_time}
              onChange={(e) => set("end_time", e.target.value)}
              style={{
                ...(errors.end_time ? inputErr : inputBase),
                colorScheme: "dark",
              }}
            />
            {errors.end_time && <p style={errMsg}>{errors.end_time}</p>}
          </div>
        </div>

        <ComedianMultiSelect
          comedians={comedians}
          loading={comediansLoading}
          loadError={comediansError}
          selectedIds={form.comedian_ids}
          onToggle={toggleComedian}
          onSelectAll={handleSelectAll}
          error={errors.comedian_ids as string | undefined}
        />

        <div>
          <label style={labelStyle}>Color</label>
          <div style={{ display: "flex", gap: 10 }}>
            {EVENT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => set("color", c.value)}
                title={c.label}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  cursor: "pointer",
                  background: c.value,
                  border:
                    form.color === c.value
                      ? "2px solid var(--text-bright)"
                      : "2px solid transparent",
                  boxShadow:
                    form.color === c.value ? `0 0 10px ${c.value}` : "none",
                  outline: "none",
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>
            Description
            <span
              style={{
                marginLeft: 6,
                color: "var(--text-muted)",
                fontWeight: 400,
                textTransform: "none",
                letterSpacing: 0,
              }}
            >
              — optional
            </span>
          </label>
          <div style={{ position: "relative" }}>
            <AlignLeft
              size={13}
              style={{
                position: "absolute",
                left: 12,
                top: 12,
                color: "var(--text-muted)",
              }}
            />
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Add notes for this event…"
              style={{
                ...inputBase,
                paddingLeft: 32,
                resize: "none",
                lineHeight: 1.6,
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
        <button
          onClick={handleClose}
          disabled={submitting}
          style={{
            flex: 1,
            padding: "11px 0",
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
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            flex: 1,
            padding: "11px 0",
            borderRadius: 10,
            cursor: "pointer",
            border: "none",
            background:
              "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.8,
            boxShadow: "0 0 20px rgba(0,212,255,0.3)",
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? "Saving…" : "Save Event"}
        </button>
      </div>
    </SlidePanel>
  );
}

function DayDetailPanel({
  open,
  onClose,
  date,
  events,
  onDelete,
  busyId,
  onAddForDay,
}: {
  open: boolean;
  onClose: () => void;
  date: string;
  events: CalendarEvent[];
  onDelete: (id: number) => void;
  busyId: number | null;
  onAddForDay: () => void;
}) {
  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      width={440}
      glowColor="rgba(168,85,247,0.15)"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-bright)",
            }}
          >
            {date}
          </h3>
          <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>
            {events.length} event{events.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
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
          <X size={14} />
        </button>
      </div>

      <button
        onClick={onAddForDay}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          width: "100%",
          padding: "10px 0",
          marginBottom: 18,
          borderRadius: 10,
          cursor: "pointer",
          background: "rgba(0,212,255,0.1)",
          border: "1px solid rgba(0,212,255,0.25)",
          color: "var(--neon-blue)",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        <Plus size={13} /> Add event on this day
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {events
          .slice()
          .sort((a, b) => a.start_time.localeCompare(b.start_time))
          .map((ev) => {
            const color = ev.color || DEFAULT_COLOR;
            const busy = busyId === ev.id;
            return (
              <div
                key={ev.id}
                style={{
                  padding: 16,
                  borderRadius: 14,
                  background: "rgba(0,0,0,0.25)",
                  border: `1px solid ${color}33`,
                  borderLeft: `3px solid ${color}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text-bright)",
                    }}
                  >
                    {ev.title}
                  </p>
                  <button
                    disabled={busy}
                    onClick={() => onDelete(ev.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "5px 9px",
                      borderRadius: 8,
                      cursor: "pointer",
                      flexShrink: 0,
                      background: "rgba(255,45,155,0.1)",
                      border: "1px solid rgba(255,45,155,0.3)",
                      color: "var(--neon-pink)",
                      opacity: busy ? 0.5 : 1,
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 11,
                    color: "var(--text-soft)",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Clock size={12} /> {formatTime(ev.start_time)} –{" "}
                  {formatTime(ev.end_time)}
                </p>

                {ev.comedians && ev.comedians.length > 0 && (
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {ev.comedians.map((c) => (
                      <span
                        key={c.id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "3px 8px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 600,
                          background: "rgba(0,212,255,0.1)",
                          color: "var(--neon-blue)",
                          border: "1px solid rgba(0,212,255,0.2)",
                        }}
                      >
                        <Users size={10} />
                        {c.name}
                      </span>
                    ))}
                  </div>
                )}

                {ev.description && (
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: 12,
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {ev.description}
                  </p>
                )}
              </div>
            );
          })}
      </div>
    </SlidePanel>
  );
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [modalDefaultDate, setModalDefaultDate] = useState<string | undefined>(
    undefined,
  );

  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(
        `/api/event?year=${year}&month=${month + 1}&per_page=200`,
        { cache: "no-store" },
      );
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to load events.");
      }
      const list: CalendarEvent[] = data.data?.data ?? data.data ?? [];
      setEvents(list);
    } catch (err) {
      setFetchError(
        err instanceof Error ? err.message : "Failed to load events.",
      );
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const eventsByDay: Record<number, CalendarEvent[]> = {};
  for (const ev of events) {
    const d = new Date(ev.event_date + "T00:00:00");
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      (eventsByDay[day] ||= []).push(ev);
    }
  }

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const isoDate = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const handleSubmit = async (form: EventForm): Promise<boolean> => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        title: form.title,
        event_date: form.event_date,
        start_time: form.start_time,
        end_time: form.end_time,
        color: form.color || DEFAULT_COLOR,
        description: form.description || null,
        comedian_ids: form.comedian_ids,
      };

      const res = await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        const msg = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : data.message || "Failed to create event.";
        throw new Error(msg);
      }

      await loadEvents();
      setShowModal(false);
      return true;
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create event.",
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/event/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || data.success === false)
        throw new Error(data.message || "Failed to delete.");
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete event.");
    } finally {
      setBusyId(null);
    }
  };

  const activeDayEvents = activeDay ? (eventsByDay[activeDay] ?? []) : [];
  const activeDayLabel = activeDay
    ? `${MONTHS[month]} ${activeDay}, ${year}`
    : "";

  return (
    <div className="space-y-6 flex-1 overflow-y-auto p-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--text-bright)" }}
          >
            Calendar
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {loading ? "Loading events…" : "Schedule and upcoming events"}
          </p>
        </div>
        <button
          onClick={() => {
            setModalDefaultDate(undefined);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{
            background:
              "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
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
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(255,45,155,0.1)",
            border: "1px solid rgba(255,45,155,0.3)",
            color: "var(--neon-pink)",
            fontSize: 12,
          }}
        >
          {fetchError}
        </div>
      )}

      <div className="card-neon p-5">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background: "var(--card-mid)",
              border: "1px solid rgba(0,212,255,0.15)",
              color: "var(--text-soft)",
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <h2 className="text-sm font-semibold gradient-text">
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background: "var(--card-mid)",
              border: "1px solid rgba(0,212,255,0.15)",
              color: "var(--text-soft)",
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-semibold py-1.5 uppercase tracking-widest"
              style={{ color: "var(--text-muted)", fontSize: "10px" }}
            >
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
                  background: isValid
                    ? isToday(day)
                      ? "rgba(0,212,255,0.1)"
                      : "transparent"
                    : "transparent",
                  border: isToday(day)
                    ? "1px solid rgba(0,212,255,0.4)"
                    : "1px solid transparent",
                }}
                onClick={() => {
                  if (!isValid) return;
                  if (dayEvents?.length) {
                    setActiveDay(day);
                  } else {
                    setModalDefaultDate(isoDate(day));
                    setShowModal(true);
                  }
                }}
                onMouseEnter={(e) => {
                  if (isValid && !isToday(day))
                    (e.currentTarget as HTMLDivElement).style.background =
                      "rgba(0,212,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (isValid && !isToday(day))
                    (e.currentTarget as HTMLDivElement).style.background =
                      "transparent";
                }}
              >
                {isValid && (
                  <>
                    <p
                      className="text-xs font-medium text-right"
                      style={{
                        color: isToday(day)
                          ? "var(--neon-blue)"
                          : "var(--text-soft)",
                      }}
                    >
                      {day}
                    </p>
                    {dayEvents && dayEvents.length > 0 && (
                      <div className="mt-0.5 space-y-0.5">
                        {dayEvents.slice(0, 3).map((ev) => {
                          const color = ev.color || DEFAULT_COLOR;
                          return (
                            <div
                              key={ev.id}
                              className="text-xs px-1 py-0.5 rounded truncate"
                              style={{
                                background: `${color}22`,
                                color,
                                fontSize: "9px",
                              }}
                            >
                              {ev.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <div
                            className="text-xs px-1"
                            style={{
                              fontSize: "9px",
                              color: "var(--text-muted)",
                            }}
                          >
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
        onClose={() => {
          setShowModal(false);
          setSubmitError(null);
        }}
        onSubmit={handleSubmit}
        submitting={submitting}
        serverError={submitError}
        defaultDate={modalDefaultDate}
      />

      <DayDetailPanel
        open={activeDay !== null}
        onClose={() => setActiveDay(null)}
        date={activeDayLabel}
        events={activeDayEvents}
        onDelete={handleDelete}
        busyId={busyId}
        onAddForDay={() => {
          if (activeDay) setModalDefaultDate(isoDate(activeDay));
          setActiveDay(null);
          setShowModal(true);
        }}
      />
    </div>
  );
}