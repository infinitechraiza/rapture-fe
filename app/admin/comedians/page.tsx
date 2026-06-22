"use client";

import { Search, Plus, Trash2, Edit2, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Comedian {
  id: number;
  name: string;
  tagline?: string;
  image?: string;
  genre?: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

const genreColors: Record<string, string> = {
  "Stand-up": "var(--neon-blue)",
  Impressionist: "var(--neon-purple)",
  "Dark Comedy": "var(--neon-pink)",
  Observational: "#10b981",
  Satire: "#f59e0b",
  Sarcasm: "#06b6d4",
  Default: "var(--text-soft)",
};

export default function ComediansPage() {
  const { toast } = useToast();
  const [comedians, setComedians] = useState<Comedian[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    image: "",
    genre: "",
    bio: "",
    status: "active",
  });

  useEffect(() => {
    fetchComedians();
  }, [status, search]);

  const fetchComedians = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status !== "all") params.append("status", status);

      const res = await fetch(`/api/comedians?${params}`);
      const data = await res.json();

      if (data.success) {
        setComedians(data.data.data);
      } else {
        toast({
          title: "Failed to load comedians",
          description: data.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Failed to fetch comedians:", err);
      toast({
        title: "Failed to load comedians",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm((prev) => ({ ...prev, image: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/comedians/${editingId}` : `/api/comedians`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: editingId ? "Comedian updated" : "Comedian added",
          description: `${form.name} was saved successfully.`,
        });
        setShowModal(false);
        setForm({
          name: "",
          tagline: "",
          image: "",
          genre: "",
          bio: "",
          status: "active",
        });
        setEditingId(null);
        setImagePreview("");
        fetchComedians();
      } else {
        toast({
          title: "Failed to save comedian",
          description: data.message || "Please check the form and try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error saving comedian:", err);
      toast({
        title: "Failed to save comedian",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (comedian: Comedian) => {
    setForm({
      name: comedian.name,
      tagline: comedian.tagline || "",
      image: comedian.image || "",
      genre: comedian.genre || "",
      bio: "",
      status: comedian.status,
    });
    setEditingId(comedian.id);
    setImagePreview(comedian.image || "");
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch(`/api/comedians/${id}`, { method: "DELETE" });

      if (res.status === 204) {
        toast({ title: "Comedian deleted" });
        fetchComedians();
        return;
      }

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        console.warn("No JSON body returned");
      }

      if (data.success) {
        toast({ title: "Comedian deleted" });
        fetchComedians();
      } else {
        toast({
          title: "Failed to delete comedian",
          description: data.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error deleting comedian:", err);
      toast({
        title: "Failed to delete comedian",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filtered = comedians.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.tagline?.toLowerCase().includes(search.toLowerCase()) ||
      false,
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="h-full space-y-6 flex-1 overflow-y-auto p-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--text-bright)" }}
          >
            Comedians
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {comedians.length} total comedians
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              name: "",
              tagline: "",
              image: "",
              genre: "",
              bio: "",
              status: "active",
            });
            setImagePreview("");
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
          Add Comedian
        </button>
      </div>

      <div className="card-neon">
        {/* Search bar */}
        <div
          className="p-4 pb-3"
          style={{ borderBottom: "1px solid rgba(0,212,255,0.08)" }}
        >
          <div className="relative max-w-xs">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="search"
              placeholder="Search comedians..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg text-sm outline-none"
              style={{
                background: "var(--card-mid)",
                border: "1px solid rgba(0,212,255,0.15)",
                color: "var(--text-bright)",
              }}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div
          className="flex gap-2 px-5 py-3"
          style={{ borderBottom: "1px solid rgba(0,212,255,0.08)" }}
        >
          {["all", "active", "inactive"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
              style={{
                background:
                  status === s ? "var(--neon-blue)" : "rgba(0,212,255,0.1)",
                color: status === s ? "white" : "var(--text-soft)",
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Table Header */}
        <div
          className="grid px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
          style={{
            color: "var(--text-muted)",
            borderBottom: "1px solid rgba(0,212,255,0.08)",
            gridTemplateColumns: "1fr 1fr 120px 110px 110px 60px",
          }}
        >
          <span>Name</span>
          <span>Tagline</span>
          <span>Genre</span>
          <span>Status</span>
          <span>Created</span>
          <span />
        </div>

        {loading ? (
          <div
            className="text-center py-8"
            style={{ color: "var(--text-muted)" }}
          >
            Loading comedians...
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-8"
            style={{ color: "var(--text-muted)" }}
          >
            No comedians found
          </div>
        ) : (
          filtered.map((comedian, i) => (
            <div
              key={comedian.id}
              className="grid items-center px-5 py-3 transition-all duration-200 cursor-pointer"
              style={{
                gridTemplateColumns: "1fr 1fr 120px 110px 110px 60px",
                borderBottom:
                  i < filtered.length - 1
                    ? "1px solid rgba(0,212,255,0.06)"
                    : "none",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background =
                  "rgba(0,212,255,0.03)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background = "")
              }
            >
              {/* Name with Avatar */}
              <div className="flex items-center gap-2.5">
                {comedian.image ? (
                  <img
                    src={comedian.image}
                    alt={comedian.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{
                      background: `linear-gradient(135deg, var(--neon-blue), var(--neon-purple))`,
                    }}
                  >
                    {getInitials(comedian.name)}
                  </div>
                )}
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-bright)" }}
                >
                  {comedian.name}
                </span>
              </div>

              {/* Tagline */}
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {comedian.tagline || "—"}
              </span>

              {/* Genre */}
              <span
                className="text-xs font-medium px-2 py-1 rounded-md w-fit"
                style={{
                  color:
                    genreColors[comedian.genre || "Default"] ||
                    genreColors.Default,
                  background: "rgba(0,212,255,0.08)",
                }}
              >
                {comedian.genre || "—"}
              </span>

              {/* Status */}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background:
                      comedian.status === "active"
                        ? "var(--neon-blue)"
                        : "var(--text-muted)",
                  }}
                />
                <span
                  className="text-sm"
                  style={{
                    color:
                      comedian.status === "active"
                        ? "var(--neon-blue)"
                        : "var(--text-muted)",
                  }}
                >
                  {comedian.status.charAt(0).toUpperCase() +
                    comedian.status.slice(1)}
                </span>
              </div>

              {/* Created Date */}
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {formatDate(comedian.created_at)}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(comedian)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    color: "var(--text-muted)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(0,212,255,0.1)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background =
                      "transparent")
                  }
                  title="Edit"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(comedian.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    color: "var(--neon-pink)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,45,155,0.1)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background =
                      "transparent")
                  }
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="card-neon rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: "rgba(0,212,255,0.3)" }}
          >
            <h2
              className="text-lg font-bold mb-4"
              style={{ color: "var(--text-bright)" }}
            >
              {editingId ? "Edit Comedian" : "Add Comedian"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    background: "var(--card-mid)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    color: "var(--text-bright)",
                  }}
                  placeholder="Name"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Tagline
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) =>
                    setForm({ ...form, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    background: "var(--card-mid)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    color: "var(--text-bright)",
                  }}
                  placeholder="e.g., Comedy Legend"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Genre
                </label>
                <select
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    background: "var(--card-mid)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    color: "var(--text-bright)",
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="featured-headliners">
                    Featured Headliners
                  </option>
                  <option value="full-roaster">Full Roaster</option>
                  <option value="Dark Comedy">New Upcommers</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Image
                </label>

                {imagePreview && (
                  <div className="mb-2 flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                      style={{ border: "2px solid rgba(0,212,255,0.3)" }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setForm((prev) => ({ ...prev, image: "" }));
                      }}
                      className="text-xs font-semibold"
                      style={{ color: "var(--neon-pink)" }}
                    >
                      Remove
                    </button>
                  </div>
                )}

                <label
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm cursor-pointer transition-all"
                  style={{
                    background: "var(--card-mid)",
                    border: "1px dashed rgba(0,212,255,0.3)",
                    color: "var(--text-muted)",
                  }}
                >
                  <Upload size={14} />
                  {imagePreview ? "Change image..." : "Upload image..."}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    background: "var(--card-mid)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    color: "var(--text-bright)",
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: "rgba(0,212,255,0.1)",
                    color: "var(--neon-blue)",
                    border: "1px solid rgba(0,212,255,0.2)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                    color: "white",
                  }}
                >
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}