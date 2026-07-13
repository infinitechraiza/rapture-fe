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
  Pencil,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Image as ImageIcon } from "lucide-react";
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
  comedians?: Comedian[];
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  color: string;
  image_url: string;
  description: string | null;
};

type Comedian = {
  id: number;
  name: string;
  tagline?: string | null;
  image?: string | null;
  image_url?: string | null;
  genre?: string | null;
  status: "active" | "inactive";
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatTime(time: string) {
  if (!time) return "";
  const [hours, minutes] = time
    .split(":")
    .map((element: string) => String(Number(element)));

  let h = parseInt(hours, 10);

  h = h % 12;
  h = h === 0 ? 12 : h;
  

 const period = h <= 12 ? "AM" : "PM";
 if(period === "PM" && h !== 12) {
  h += 12;
 }
   if (h === 24 && minutes === "00") {
    return "12:00:00";
  } else if (h === 24) {
    return `${24}:${minutes}`;
  }

  return `${h.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
}




// Native <input type="time"> only accepts strict 24-hour "HH:MM" (optionally
// ":SS") with no AM/PM text — anything else and the browser just renders it
// blank ("--:-- --"). Records saved before the backend time-format fix may
// still have a value like "00:00:00 AM" sitting in the database, so this
// normalizes whatever comes back from the API (24-hour OR legacy 12-hour with
// AM/PM) into the exact format the input needs.
function normalizeTimeForInput(raw: string | null | undefined): string {
  if (!raw) return "";
  const trimmed = raw.trim();

  // 12-hour with AM/PM, seconds optional: "12:00:00 AM", "1:05 PM"
  const twelveHour = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
  if (twelveHour) {
    let h = parseInt(twelveHour[1], 10);
    const m = twelveHour[2];
    const period = twelveHour[3].toUpperCase();
    if (period === "AM") {
      if (h === 12) h = 0;
    } else if (h !== 12) {
      h += 12;
    }
    return `${String(h).padStart(2, "0")}:${m}`;
  }

  // Already 24-hour, seconds optional: "00:00:00", "13:05"
  const twentyFourHour = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (twentyFourHour) {
    return `${twentyFourHour[1].padStart(2, "0")}:${twentyFourHour[2]}`;
  }

  return ""; // unrecognized format — leave blank rather than feed the input garbage
}
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Converts a native <input type="time"> value ("HH:MM", 24-hour, no seconds)
// into the "h:i:s A" format the backend's update() validator requires, e.g.
// "00:00" -> "12:00:00 AM", "13:05" -> "01:05:00 PM", "09:00" -> "09:00:00 AM".
// This is the payload conversion — formatTime() above is only for display.

function toApiTime(time24: string): string {
  if (!time24) return "";

  const [hours, minutes] = time24.split(":");

  let h = parseInt(hours, 10);

  h = h % 24;
  h = h === 0 ? 24 : h;

  if (hours === "24") {
    return `${(24).toString().padStart(2, "0")}:${minutes}:00`;
  }
  return `${h.toString().padStart(2, "0")}:${minutes}:00`;
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
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
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
  const allSelected =
    comedians.length > 0 && selectedIds.length === comedians.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < comedians.length;

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
              background:
                allSelected || someSelected
                  ? "rgba(0,212,255,0.15)"
                  : "rgba(0,0,0,0.2)",
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
                flexShrink: 0,
                background:
                  allSelected || someSelected
                    ? "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))"
                    : "transparent",
              }}
            >
              {(allSelected || someSelected) && (
                <Check size={12} style={{ color: "white" }} />
              )}
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
              const comedianImg = c.image_url || c.image;
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
                  {comedianImg ? (
                    <img
                      src={comedianImg}
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
                      border: checked
                        ? "none"
                        : "1px solid rgba(0,212,255,0.3)",
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
  mode = "create",
  initialEvent,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: EventForm, image: File | null) => Promise<boolean>;
  submitting: boolean;
  serverError: string | null;
  defaultDate?: string;
  mode?: "create" | "edit";
  initialEvent?: CalendarEvent | null;
}) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState<EventForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EventForm, string>>
  >({});
  const [comedians, setComedians] = useState<Comedian[]>([]);
  const [comediansLoading, setComediansLoading] = useState(false);
  const [comediansError, setComediansError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setImageFile(selected);
    setImagePreview(selected ? URL.createObjectURL(selected) : null);
  }

  useEffect(() => {
    if (open) {
      if (isEdit && initialEvent) {
        setForm({
          title: initialEvent.title,
          event_date: initialEvent.event_date?.split("T")[0] ?? "",
          start_time: normalizeTimeForInput(initialEvent.start_time),
          end_time: normalizeTimeForInput(initialEvent.end_time),
          color: initialEvent.color || DEFAULT_COLOR,
          description: initialEvent.description ?? "",
          comedian_ids: (initialEvent.comedians ?? []).map((c) => c.id),
        });
        setImagePreview(initialEvent.image_url || null);
      } else {
        setForm((p) => ({
          ...EMPTY_FORM,
          event_date: defaultDate ?? p.event_date,
        }));
        setImagePreview(null);
      }
      setErrors({});
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open, defaultDate, isEdit, initialEvent]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setComediansLoading(true);
      setComediansError(null);
      try {
        const res = await fetch("/api/comedians?status=active&per_page=200", {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok || data.success === false)
          throw new Error(data.message || "Failed to load comedians.");
        const list: Comedian[] = data.data?.data ?? data.data ?? [];
        if (!cancelled) setComedians(list);
      } catch (err) {
        if (!cancelled)
          setComediansError(
            err instanceof Error ? err.message : "Failed to load comedians.",
          );
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
        ? p.comedian_ids.filter((e) => e !== id)
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

  // FIXED: validate end_time is strictly AFTER start_time
  const validate = () => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.event_date) e.event_date = "Event date is required.";
    if (!form.start_time) e.start_time = "Start time is required.";
    if (!form.end_time) e.end_time = "End time is required.";
    if (form.comedian_ids.length === 0) {
      e.comedian_ids = "Select at least one comedian.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const ok = await onSubmit(form, imageFile);
    if (ok) {
      setForm(EMPTY_FORM);
      setErrors({});
      setImageFile(null);
      setImagePreview(null);
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
      glowColor={isEdit ? "rgba(185,79,255,0.15)" : "rgba(0,212,255,0.15)"}
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
              background: isEdit
                ? "rgba(185,79,255,0.12)"
                : "rgba(0,212,255,0.12)",
              border: isEdit
                ? "1px solid rgba(185,79,255,0.3)"
                : "1px solid rgba(0,212,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isEdit ? (
              <Pencil size={16} style={{ color: "#b94fff" }} />
            ) : (
              <Calendar size={16} style={{ color: "var(--neon-blue)" }} />
            )}
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
              {isEdit ? "Edit Event" : "New Event"}
            </h3>
            <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>
              {isEdit
                ? "Update this event's details"
                : "Saved directly to the database"}
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
            Event Image{" "}
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: 76,
                height: 76,
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.3)",
                border: "1px dashed rgba(0,212,255,0.3)",
                flexShrink: 0,
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <ImageIcon size={22} style={{ color: "var(--text-muted)" }} />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: "9px 14px",
                borderRadius: 9,
                cursor: "pointer",
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.2)",
                color: "var(--neon-blue)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {imageFile
                ? imageFile.name
                : isEdit
                  ? "Replace file"
                  : "Choose file"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>
            Title <span style={{ color: "var(--neon-pink)" }}>*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Comedy Night"
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
            Description{" "}
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
            background: isEdit
              ? "linear-gradient(135deg, #b94fff, var(--neon-pink))"
              : "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.8,
            boxShadow: isEdit
              ? "0 0 20px rgba(185,79,255,0.3)"
              : "0 0 20px rgba(0,212,255,0.3)",
            opacity: submitting ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Save Event"}
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
  onEdit,
}: {
  open: boolean;
  onClose: () => void;
  date: string;
  events: CalendarEvent[];
  onDelete: (id: number) => void;
  busyId: number | null;
  onAddForDay: () => void;
  onEdit: (event: CalendarEvent) => void;
}) {
  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      width={440}
      glowColor="rgba(168,85,247,0.15)"
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 22,
          paddingTop: 4,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-bright)",
              lineHeight: 1.3,
              wordBreak: "break-word",
            }}
          >
            {date}
          </h3>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
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
            flexShrink: 0,
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Add event button */}
      <button
        onClick={onAddForDay}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          width: "100%",
          padding: "11px 0",
          marginBottom: 22,
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

      {/* Event list */}
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
                className="group"
                style={{
                  position: "relative",
                  borderRadius: 14,
                  overflow: "hidden",
                  border: `1px solid ${color}33`,
                  borderLeft: `3px solid ${color}`,
                  height: 230,
                  background: ev.image_url ? "var(--card-mid)" : `${color}14`,
                }}
              >
                {/* Image sized to fill the entire card */}
                {ev.image_url ? (
                  <img
                    src={ev.image_url}
                    alt={ev.title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Calendar size={30} style={{ color, opacity: 0.35 }} />
                  </div>
                )}

                {/* Edit / Delete icon buttons — appear on hover */}
                <div
                  className="opacity-0 group-hover:opacity-100"
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "opacity 0.2s",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(ev);
                    }}
                    title="Edit event"
                    className="w-7 h-7 rounded-md flex items-center justify-center"
                    style={{
                      background: "#b94fff",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    disabled={busy}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(ev.id);
                    }}
                    title="Delete event"
                    className="w-7 h-7 rounded-md flex items-center justify-center"
                    style={{
                      background: "var(--neon-pink, #ff2d9b)",
                      color: "#fff",
                      border: "none",
                      cursor: busy ? "not-allowed" : "pointer",
                      opacity: busy ? 0.5 : 1,
                    }}
                  >
                    {busy ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>

                {/* Status/color chip, top-left */}
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    zIndex: 10,
                    padding: "3px 9px",
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    background: `${color}33`,
                    color,
                    border: `1px solid ${color}66`,
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {formatTime(ev.start_time)}
                </div>

                {/* Text overlay with gradient shadow background */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 5,
                    padding: "34px 14px 14px",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.35) 75%, transparent 100%)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#fff",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {ev.title}
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.8)",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Clock size={12} /> {formatTime(ev.start_time)} –{" "}
                    {formatTime(ev.end_time)}
                  </p>

                  {/* Comedians from event_comedian pivot */}
                  {ev.comedians && ev.comedians.length > 0 && (
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                      }}
                    >
                      {ev.comedians.map((c) => {
                        const comedianImg = c.image_url || c.image;
                        return (
                          <span
                            key={c.id}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "3px 10px 3px 3px",
                              borderRadius: 999,
                              fontSize: 11,
                              fontWeight: 600,
                              background: "rgba(0,212,255,0.15)",
                              color: "var(--neon-blue)",
                              border: "1px solid rgba(0,212,255,0.3)",
                            }}
                          >
                            {comedianImg ? (
                              <img
                                src={comedianImg}
                                alt={c.name}
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  flexShrink: 0,
                                }}
                              />
                            ) : (
                              <span
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background:
                                    "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                                  color: "white",
                                  fontSize: 8,
                                  fontWeight: 700,
                                }}
                              >
                                {getInitials(c.name)}
                              </span>
                            )}
                            {c.name}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {ev.description && (
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 11,
                        color: "rgba(255,255,255,0.7)",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {ev.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </SlidePanel>
  );
}

export default function CalendarPage() {
  const { toast } = useToast();
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
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
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
      if (!res.ok || data.success === false)
        throw new Error(data.message || "Failed to load events.");

      // Handles both paginated ({ data: { data: [...] } }) and flat ({ data: [...] }) shapes
      const list: CalendarEvent[] = Array.isArray(data.data?.data)
        ? data.data.data
        : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];

      setEvents(list);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to load events.";
      setFetchError(errorMsg);
      toast({
        title: "Error loading events",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [year, month, toast]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Timezone-safe date grouping — split the string, never use new Date()
  const eventsByDay: Record<number, CalendarEvent[]> = {};
  for (const ev of events) {
    if (!ev.event_date) continue;
    const dateParts = ev.event_date.split("T")[0]; // handles "2026-06-22" and "2026-06-22T00:00:00"
    const [evYear, evMonth, evDay] = dateParts.split("-").map(Number);
    if (evYear === year && evMonth === month + 1) {
      (eventsByDay[evDay] ||= []).push(ev);
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

  const openCreateModal = () => {
    setModalMode("create");
    setEditingEvent(null);
    setModalDefaultDate(undefined);
    setShowModal(true);
  };

  const openEditModal = (ev: CalendarEvent) => {
    setModalMode("edit");
    setEditingEvent(ev);
    setModalDefaultDate(undefined);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitError(null);
    setModalMode("create");
    setEditingEvent(null);
  };

  const handleSubmit = async (
    form: EventForm,
    imageFile: File | null,
  ): Promise<boolean> => {
    setSubmitting(true);
    setSubmitError(null);
    const isEdit = modalMode === "edit" && !!editingEvent;
    try {
      const formData = new FormData();
      form.comedian_ids.forEach((id) =>
        formData.append("comedian_ids[]", String(id)),
      );
      formData.append("title", form.title);
      formData.append("event_date", form.event_date);
      // store() still validates start/end time as native "H:i" (24-hour, no
      // seconds), but update() validates "h:i:s A" (12-hour, with seconds and
      // AM/PM) — so only convert the payload when this is an edit.
      formData.append(
        "start_time",
        isEdit ? toApiTime(form.start_time) : form.start_time,
      );
      formData.append(
        "end_time",
        isEdit ? toApiTime(form.end_time) : form.end_time,
      );
      formData.append("color", form.color || DEFAULT_COLOR);
      if (form.description) formData.append("description", form.description);
      if (imageFile) formData.append("image", imageFile);

      // Laravel/PHP only auto-parses multipart bodies for POST requests — a real
      // PUT with FormData leaves the backend unable to read the fields (and can
      // blow up trying to json_decode the raw multipart body instead). So for
      // edits we keep the request as POST and use Laravel's method-spoofing
      // field to route it to the update handler.
      const url = isEdit ? `/api/event/${editingEvent!.id}` : "/api/event";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method, // POST for new, PUT for edit
        body: formData, // no Content-Type header — browser sets the multipart boundary
      });

      let data: any;
      const rawText = await res.text();
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        throw new Error(
          `Server returned a non-JSON response (status ${res.status}). ${rawText.slice(0, 200)}`,
        );
      }
      if (!res.ok || data.success === false) {
        const msg = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : data.message || `Failed to ${isEdit ? "update" : "create"} event.`;
        throw new Error(msg);
      }
      toast({
        title: isEdit ? "Event updated!" : "Event created!",
        description: isEdit
          ? `${form.title} has been updated.`
          : `${form.title} has been added to your calendar.`,
      });
      await loadEvents();
      setShowModal(false);
      setModalMode("create");
      setEditingEvent(null);
      return true;
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : `Failed to ${isEdit ? "update" : "create"} event.`;
      setSubmitError(errorMsg);
      toast({
        title: `Failed to ${isEdit ? "update" : "create"} event`,
        description: errorMsg,
        variant: "destructive",
      });
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
      if (activeDay !== null) {
        const remaining = (eventsByDay[activeDay] ?? []).filter(
          (e) => e.id !== id,
        );
        if (remaining.length === 0) setActiveDay(null);
      }
      toast({
        title: "Event deleted",
        description: "The event has been removed from your calendar.",
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete event.";
      toast({
        title: "Failed to delete event",
        description: errorMsg,
        variant: "destructive",
      });
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
      <style>{`
        .event-pill { position: relative; }
        .event-pill .delete-btn { opacity: 0; transition: opacity 0.15s; }
        .event-pill:hover .delete-btn { opacity: 1; }
      `}</style>

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
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{
            background:
              "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
            color: "white",
            boxShadow: "0 0 16px rgba(0,212,255,0.3)",
          }}
        >
          <Plus size={14} /> New Event
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
                className={`min-h-[72px] p-1 rounded-lg transition-all duration-200 ${isValid ? "cursor-pointer" : ""}`}
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
                  if (dayEvents?.length) setActiveDay(day);
                  else {
                    setModalDefaultDate(isoDate(day));
                    setModalMode("create");
                    setEditingEvent(null);
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
                          const isBusy = busyId === ev.id;
                          return (
                            <div
                              key={ev.id}
                              className="event-pill"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                background: `${color}22`,
                                borderRadius: 4,
                                opacity: isBusy ? 0.4 : 1,
                                transition: "opacity 0.2s",
                              }}
                            >
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDay(day);
                                }}
                                style={{
                                  flex: 1,
                                  padding: "2px 4px",
                                  fontSize: "9px",
                                  color,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  cursor: "pointer",
                                  minWidth: 0,
                                }}
                              >
                                {ev.title}
                              </span>
                              <button
                                className="delete-btn"
                                disabled={isBusy}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(ev.id);
                                }}
                                style={{
                                  flexShrink: 0,
                                  width: 14,
                                  height: 14,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: "rgba(255,45,155,0.25)",
                                  border: "none",
                                  borderRadius: 3,
                                  cursor: "pointer",
                                  color: "#ff2d9b",
                                  fontSize: 10,
                                  fontWeight: 700,
                                  padding: 0,
                                  marginRight: 2,
                                }}
                                title="Delete event"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDay(day);
                            }}
                            style={{
                              fontSize: "9px",
                              color: "var(--text-muted)",
                              paddingLeft: 4,
                              cursor: "pointer",
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
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitting={submitting}
        serverError={submitError}
        defaultDate={modalDefaultDate}
        mode={modalMode}
        initialEvent={editingEvent}
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
          setModalMode("create");
          setEditingEvent(null);
          setActiveDay(null);
          setShowModal(true);
        }}
        onEdit={(ev) => {
          setActiveDay(null);
          openEditModal(ev);
        }}
      />
    </div>
  );
}
