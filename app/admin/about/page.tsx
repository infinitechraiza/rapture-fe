"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Mic2,
  Coffee,
  Heart,
  Sparkles,
  Plus,
  Trash2,
  Save,
  Loader2,
  GripVertical,
} from "lucide-react";

// Map icon name (stored in DB) -> lucide component (rendered in UI)
const ICON_MAP: Record<string, any> = {
  ShieldCheck,
  Mic2,
  Coffee,
  Heart,
  Sparkles,
};
const ICON_OPTIONS = Object.keys(ICON_MAP);

type AboutValueCard = {
  id?: number;
  about_section_id?: number;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
  is_active?: boolean;
};

type AboutSectionData = {
  id?: number;
  title: string;
  title_highlight: string;
  description_primary: string;
  description_secondary: string;
  stat_label: string;
  values: AboutValueCard[];
};

const EMPTY_SECTION: AboutSectionData = {
  title: "",
  title_highlight: "",
  description_primary: "",
  description_secondary: "",
  stat_label: "",
  values: [],
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="text-xs font-medium mb-1.5 block"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--card-mid)",
  border: "1px solid rgba(0,212,255,0.15)",
  color: "var(--text-bright)",
};

export default function AboutPage() {
  const [data, setData] = useState<AboutSectionData>(EMPTY_SECTION);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  async function fetchAbout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/about");
      if (!res.ok) throw new Error("Failed to load About content");
      const json = await res.json();
      const section = json.data;

      if (!section) {
        setData(EMPTY_SECTION);
        return;
      }

      setData({
        ...EMPTY_SECTION,
        ...section,
        values: section.values ?? [],
      });
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function updateField<K extends keyof AboutSectionData>(
    key: K,
    value: AboutSectionData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateValueCard(index: number, patch: Partial<AboutValueCard>) {
    setData((prev) => {
      const values = [...prev.values];
      values[index] = { ...values[index], ...patch };
      return { ...prev, values };
    });
  }

  function addValueCard() {
    setData((prev) => {
      if (prev.values.length >= 4) return prev;
      return {
        ...prev,
        values: [
          ...prev.values,
          {
            icon: "Sparkles",
            title: "New Category",
            description: "",
            sort_order: prev.values.length,
          },
        ],
      };
    });
  }

  async function removeValueCard(index: number) {
    const card = data.values[index];
    setData((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
    // If it already exists in the DB, delete it there too
    if (card.id) {
      try {
        await fetch(`/api/about/values/${card.id}`, { method: "DELETE" });
      } catch {
        // non-fatal — local state is already updated; a full save will
        // reconcile on next load if this silently failed
      }
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const sectionPayload = {
        title: data.title,
        title_highlight: data.title_highlight,
        description_primary: data.description_primary,
        description_secondary: data.description_secondary,
        stat_label: data.stat_label,
      };

      let sectionId = data.id;

      if (sectionId) {
        const res = await fetch(`/api/about/${sectionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sectionPayload),
        });
        if (!res.ok) throw new Error("Failed to save section");
      } else {
        const res = await fetch(`/api/about`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sectionPayload),
        });
        if (!res.ok) throw new Error("Failed to create section");
        const json = await res.json();
        sectionId = json.data.id;
        updateField("id", sectionId);
      }

      // Save each value card (create or update), in order
      const savedValues: AboutValueCard[] = [];
      for (let i = 0; i < data.values.length; i++) {
        const card = data.values[i];
        const payload = {
          about_section_id: sectionId,
          icon: card.icon,
          title: card.title,
          description: card.description,
          sort_order: i,
        };

        if (card.id) {
          const res = await fetch(`/api/about/values/${card.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          
          if (!res.ok) throw new Error(`Failed to save "${card.title}"`);
          const json = await res.json();
          savedValues.push(json.data);
        } else {
          const res = await fetch(`/api/about/values`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) throw new Error(`Failed to create "${card.title}"`);
          const json = await res.json();
          savedValues.push(json.data);
        }
      }

      setData((prev) => ({ ...prev, values: savedValues }));
      setSavedAt(new Date());
    } catch (e: any) {
      setError(e.message ?? "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <Loader2
          className="animate-spin"
          size={28}
          style={{ color: "var(--neon-blue)" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 flex-1 overflow-y-auto p-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-bright)" }}>
            About
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Edit the "Our Story" section shown on the public About page
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && !saving && (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Saved {savedAt.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))",
              color: "#fff",
            }}
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div
          className="p-3 rounded-lg text-sm"
          style={{
            background: "rgba(255,45,80,0.1)",
            border: "1px solid rgba(255,45,80,0.3)",
            color: "#ff6b8a",
          }}
        >
          {error}
        </div>
      )}

      {/* Story content card */}
      <div className="card-neon p-6 space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))" }}
          >
            <Sparkles size={17} className="text-white" />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-bright)" }}>
            Our Story
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Title">
            <input
              value={data.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="A Safe Space"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={inputStyle}
            />
          </Field>
          <Field label="Title Highlight (gradient line)">
            <input
              value={data.title_highlight}
              onChange={(e) => updateField("title_highlight", e.target.value)}
              placeholder="For All Colors"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={inputStyle}
            />
          </Field>

          <Field label="Description (paragraph 1)">
            <textarea
              value={data.description_primary}
              onChange={(e) => updateField("description_primary", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={inputStyle}
            />
          </Field>
          <Field label="Description (paragraph 2)">
            <textarea
              value={data.description_secondary}
              onChange={(e) => updateField("description_secondary", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={inputStyle}
            />
          </Field>
        </div>

      </div>

      {/* Value cards */}
      <div className="card-neon p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-bright)" }}>
            Value Cards{" "}
            <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
              ({data.values.length}/4)
            </span>
          </h3>
          <button
            onClick={addValueCard}
            disabled={data.values.length >= 4}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--card-mid)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "var(--neon-blue)",
            }}
          >
            <Plus size={13} /> Add Card
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {data.values.map((card, i) => {
            const Icon = ICON_MAP[card.icon] ?? Sparkles;
            return (
              <div
                key={card.id ?? `new-${i}`}
                className="p-4 rounded-lg space-y-3"
                style={{ border: "1px solid rgba(0,212,255,0.1)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical size={14} style={{ color: "var(--text-muted)" }} />
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(185,79,255,0.12))",
                      }}
                    >
                      <Icon size={16} style={{ color: "var(--neon-blue)" }} />
                    </div>
                    <select
                      value={card.icon}
                      onChange={(e) => updateValueCard(i, { icon: e.target.value })}
                      className="px-2 py-1 rounded-md text-xs outline-none"
                      style={inputStyle}
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => removeValueCard(i)}
                    className="w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color = "#ff6b8a")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <input
                  value={card.title}
                  onChange={(e) => updateValueCard(i, { title: e.target.value })}
                  placeholder="Category title"
                  className="w-full px-3 py-2 rounded-lg text-sm font-medium outline-none"
                  style={inputStyle}
                />
                <textarea
                  value={card.description}
                  onChange={(e) => updateValueCard(i, { description: e.target.value })}
                  placeholder="Short description"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none"
                  style={inputStyle}
                />
              </div>
            );
          })}

          {data.values.length === 0 && (
            <div
              className="col-span-2 text-center py-8 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              No value cards yet. Click "Add Card" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}