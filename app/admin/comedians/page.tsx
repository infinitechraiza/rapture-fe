"use client";

import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Upload,
  X,
  User,
  Eye,
  Calendar,
  Tag,
  Quote,
} from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface Comedian {
  id: number;
  name: string;
  tagline?: string | null;
  image_url: string;
  genre?: string | null;
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

// ── Stat pill (matches Users page header) ───────────────────

function HeaderStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: string;
}) {
  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: 12,
        background: "var(--card-mid)",
        border: "1px solid rgba(0,212,255,0.12)",
        minWidth: 96,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 800,
          color: accent,
          lineHeight: 1.1,
        }}
      >
        {value}
      </p>
      <p
        style={{
          margin: "2px 0 0",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </p>
    </div>
  );
}

// ── Row action icon button (matches Users page) ─────────────

function RowActionButton({
  icon,
  title,
  onClick,
  danger,
}: {
  icon: ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  const idleColor = danger ? "var(--neon-pink)" : "var(--text-muted)";
  const hoverBg = danger ? "rgba(255,45,155,0.12)" : "rgba(0,212,255,0.1)";
  const hoverColor = danger ? "var(--neon-pink)" : "var(--neon-blue)";
  return (
    <button
      title={title}
      onClick={onClick}
      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
      style={{ color: idleColor, background: "transparent" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
        (e.currentTarget as HTMLButtonElement).style.color = hoverColor;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        (e.currentTarget as HTMLButtonElement).style.color = idleColor;
      }}
    >
      {icon}
    </button>
  );
}

export default function ComediansPage() {
  const { toast } = useToast();
  const [comedians, setComedians] = useState<Comedian[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [viewingComedian, setViewingComedian] = useState<Comedian | null>(null);
  const [showViewDrawer, setShowViewDrawer] = useState(false);
  const [isViewClosing, setIsViewClosing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null); // add this state near your other useState calls


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

  // Lock body scroll while any drawer is open
  useEffect(() => {
    if (showModal || showViewDrawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal, showViewDrawer]);

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
    setImageFile(file); // keep the real File object, no encoding
    setImagePreview(URL.createObjectURL(file)); // local blob URL, just for the <img> preview
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 220);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const openViewDrawer = (comedian: Comedian) => {
    setViewingComedian(comedian);
    setShowViewDrawer(true);
  };

  const closeViewDrawer = () => {
    setIsViewClosing(true);
    setTimeout(() => {
      setShowViewDrawer(false);
      setIsViewClosing(false);
      setViewingComedian(null);
    }, 220);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId ? `/api/comedians/${editingId}` : `/api/comedians`;
      const method = editingId ? "PUT" : "POST";

      const formData = new FormData();
      formData.append("name", form.name);
      if (form.tagline) formData.append("tagline", form.tagline);
      if (form.genre) formData.append("genre", form.genre);
      if (form.bio) formData.append("bio", form.bio);
      formData.append("status", form.status);
      formData.append("image", form.image);
      if (imageFile) formData.append("image", imageFile); // the actual file, sent as binary

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        body: formData, // no Content-Type header — browser sets the multipart boundary itself
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: editingId ? "Comedian updated" : "Comedian added",
          description: `${form.name} was saved successfully.`,
        });
        closeModal();
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
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (comedian: Comedian) => {
    setForm({
      name: comedian.name,
      tagline: comedian.tagline || "",
      image:  "",
      genre: comedian.genre || "",
      bio: "",
      status: comedian.status,
    });
    setEditingId(comedian.id);
    setImagePreview(comedian.image_url || "");
    openModal();
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

  const activeCount = comedians.filter((c) => c.status === "active").length;
  const inactiveCount = comedians.filter((c) => c.status === "inactive").length;

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

  const gridCols = "1.3fr 1.3fr 0.8fr 0.9fr 0.9fr 120px";

  return (
    <div className="h-full space-y-6 flex-1 overflow-y-auto p-6 min-h-screen">
      {/* ── Header ── */}
      <div
        style={{
          position: "relative",
          borderRadius: 18,
          padding: "26px 28px",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(185,79,255,0.06) 60%, transparent)",
          border: "1px solid rgba(0,212,255,0.12)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -60,
            right: -40,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,212,255,0.18), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="flex items-center justify-between flex-wrap gap-4"
          style={{ position: "relative" }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "var(--neon-blue)",
              }}
            >
              Talent Management
            </p>
            <h1
              style={{
                margin: "4px 0 0",
                fontSize: 26,
                fontWeight: 800,
                color: "var(--text-bright)",
                letterSpacing: -0.5,
              }}
            >
              Comedians
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              Manage profiles, categories, and status across your roster.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <HeaderStat
              label="Total"
              value={comedians.length}
              accent="var(--neon-blue)"
            />
            <HeaderStat label="Active" value={activeCount} accent="#10b981" />
            <HeaderStat
              label="Inactive"
              value={inactiveCount}
              accent="var(--text-muted)"
            />

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
                openModal();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
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
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="card-neon">
        {/* Search + filters */}
        <div
          className="flex items-center justify-between gap-4 flex-wrap p-4"
          style={{ borderBottom: "1px solid rgba(0,212,255,0.08)" }}
        >
          <div className="relative max-w-xs flex-1 min-w-[200px]">
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

          <div className="flex gap-2">
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
        </div>

        {/* Table Header */}
        <div
          className="grid px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
          style={{
            color: "var(--text-muted)",
            borderBottom: "1px solid rgba(0,212,255,0.08)",
            gridTemplateColumns: gridCols,
          }}
        >
          <span>Name</span>
          <span>Tagline</span>
          <span>Genre</span>
          <span>Status</span>
          <span>Created</span>
          <span>Actions</span>
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
              onClick={() => openViewDrawer(comedian)}
              className="grid items-center px-5 py-3 transition-all duration-200 cursor-pointer"
              style={{
                gridTemplateColumns: gridCols,
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
                {comedian.image_url ? (
                  <img
                    src={comedian.image_url}
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
                  style={{
                    color: "var(--text-bright)",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {comedian.name}
                </span>
              </div>

              {/* Tagline */}
              <span
                className="text-sm"
                style={{
                  color: "var(--text-muted)",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
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
              <div
                className="flex items-center gap-2.5"
                onClick={(e) => e.stopPropagation()}
              >
                <RowActionButton
                  icon={<Eye size={14} />}
                  title="View"
                  onClick={() => openViewDrawer(comedian)}
                />
                <RowActionButton
                  icon={<Edit2 size={14} />}
                  title="Edit"
                  onClick={() => handleEdit(comedian)}
                />
                <RowActionButton
                  icon={<Trash2 size={14} />}
                  title="Delete"
                  danger
                  onClick={() => handleDelete(comedian.id)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Side Drawer */}
      {showModal && (
        <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div
            onClick={closeModal}
            className={
              isClosing
                ? "drawer-backdrop drawer-backdrop-out"
                : "drawer-backdrop drawer-backdrop-in"
            }
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(6,6,20,0.8)",
              backdropFilter: "blur(8px)",
            }}
          />

          {/* Panel */}
          <div
            className={
              (isClosing
                ? "drawer-panel drawer-panel-out"
                : "drawer-panel drawer-panel-in") + " card-neon"
            }
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              height: "100%",
              width: "min(440px, 100vw)",
              borderRadius: 0,
              borderTop: "none",
              borderRight: "none",
              borderBottom: "none",
              boxShadow: "0 0 60px rgba(0,212,255,0.15)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 shrink-0"
              style={{ borderBottom: "1px solid rgba(0,212,255,0.1)" }}
            >
              <div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "var(--neon-blue)" }}
                >
                  {editingId ? "Edit" : "New"}
                </p>
                <h2
                  className="text-lg font-bold"
                  style={{ color: "var(--text-bright)" }}
                >
                  {editingId ? "Edit comedian" : "Add comedian"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0"
                style={{
                  color: "var(--text-muted)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(0,212,255,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--text-bright)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--text-muted)";
                }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable body */}
            <form
              id="comedian-form"
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
            >
              {/* Photo */}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wide mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Photo
                </label>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                    style={{
                      background: imagePreview
                        ? "transparent"
                        : "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(154,69,255,0.15))",
                      border: "1px solid rgba(0,212,255,0.2)",
                    }}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={22} style={{ color: "var(--text-muted)" }} />
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all w-fit"
                      style={{
                        background: "rgba(0,212,255,0.1)",
                        color: "var(--neon-blue)",
                        border: "1px solid rgba(0,212,255,0.25)",
                      }}
                    >
                      <Upload size={13} />
                      {imagePreview ? "Replace photo" : "Upload photo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setImageFile(null);
                          setForm((prev) => ({ ...prev, image: "" }));
                        }}
                        className="text-xs font-medium text-left px-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="h-px w-full"
                style={{ background: "rgba(0,212,255,0.08)" }}
              />

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-input-neon w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: "var(--card-mid)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    color: "var(--text-bright)",
                  }}
                  placeholder="e.g., Jordan Marsh"
                />
              </div>

              {/* Tagline */}
              <div>
                <label
                  htmlFor="tagline"
                  className="block text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Tagline
                </label>
                <input
                  id="tagline"
                  type="text"
                  value={form.tagline}
                  onChange={(e) =>
                    setForm({ ...form, tagline: e.target.value })
                  }
                  className="form-input-neon w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: "var(--card-mid)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    color: "var(--text-bright)",
                  }}
                  placeholder="e.g., Comedy Legend"
                />
                <p
                  className="text-xs mt-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  A short line shown beneath their name on listings.
                </p>
              </div>

              {/* Genre */}
              <div>
                <label
                  htmlFor="genre"
                  className="block text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Category
                </label>
                <select
                  id="genre"
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  className="form-input-neon w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: "var(--card-mid)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    color: "var(--text-bright)",
                  }}
                >
                  <option value="">Select category</option>
                  <option value="featured-headliners">
                    Featured headliners
                  </option>
                  <option value="full-roaster">Full roster</option>
                  <option value="Dark Comedy">New upcomers</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Status
                </label>
                <div className="flex gap-2">
                  {(["active", "inactive"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, status: s })}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background:
                          form.status === s
                            ? s === "active"
                              ? "rgba(0,212,255,0.12)"
                              : "rgba(148,163,184,0.12)"
                            : "var(--card-mid)",
                        border:
                          form.status === s
                            ? `1px solid ${s === "active" ? "var(--neon-blue)" : "rgba(148,163,184,0.4)"}`
                            : "1px solid rgba(0,212,255,0.1)",
                        color:
                          form.status === s
                            ? s === "active"
                              ? "var(--neon-blue)"
                              : "var(--text-bright)"
                            : "var(--text-muted)",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            s === "active"
                              ? "var(--neon-blue)"
                              : "var(--text-muted)",
                        }}
                      />
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* Sticky footer */}
            <div
              className="flex items-center gap-2.5 px-6 py-4 shrink-0"
              style={{
                borderTop: "1px solid rgba(0,212,255,0.1)",
                background: "transparent",
              }}
            >
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: "rgba(0,212,255,0.08)",
                  color: "var(--text-soft)",
                  border: "1px solid rgba(0,212,255,0.15)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="comedian-form"
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: saving
                    ? "rgba(0,212,255,0.25)"
                    : "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                  color: "white",
                  opacity: saving ? 0.7 : 1,
                  cursor: saving ? "not-allowed" : "pointer",
                  boxShadow: saving ? "none" : "0 0 16px rgba(0,212,255,0.25)",
                }}
              >
                {saving
                  ? "Saving…"
                  : editingId
                    ? "Save changes"
                    : "Add comedian"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Drawer */}
      {showViewDrawer && viewingComedian && (
        <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div
            onClick={closeViewDrawer}
            className={
              isViewClosing
                ? "drawer-backdrop drawer-backdrop-out"
                : "drawer-backdrop drawer-backdrop-in"
            }
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(6,6,20,0.8)",
              backdropFilter: "blur(8px)",
            }}
          />

          {/* Panel */}
          <div
            className={
              (isViewClosing
                ? "drawer-panel drawer-panel-out"
                : "drawer-panel drawer-panel-in") + " card-neon"
            }
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              height: "100%",
              width: "min(440px, 100vw)",
              borderRadius: 0,
              borderTop: "none",
              borderRight: "none",
              borderBottom: "none",
              boxShadow: "0 0 60px rgba(0,212,255,0.15)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 shrink-0"
              style={{ borderBottom: "1px solid rgba(0,212,255,0.1)" }}
            >
              <div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "var(--neon-blue)" }}
                >
                  Details
                </p>
                <h2
                  className="text-lg font-bold"
                  style={{ color: "var(--text-bright)" }}
                >
                  Comedian profile
                </h2>
              </div>
              <button
                type="button"
                onClick={closeViewDrawer}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0"
                style={{
                  color: "var(--text-muted)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(0,212,255,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--text-bright)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--text-muted)";
                }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Avatar + name block */}
              <div className="flex flex-col items-center text-center mb-6">
                {viewingComedian.image_url ? (
                  <img
                    src={viewingComedian.image_url}
                    alt={viewingComedian.name}
                    className="w-20 h-20 rounded-full object-cover mb-3"
                    style={{ border: "1px solid rgba(0,212,255,0.25)" }}
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                    }}
                  >
                    {getInitials(viewingComedian.name)}
                  </div>
                )}
                <h3
                  className="text-lg font-bold"
                  style={{ color: "var(--text-bright)" }}
                >
                  {viewingComedian.name}
                </h3>
                {viewingComedian.tagline && (
                  <p
                    className="text-sm mt-1 flex items-center gap-1.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Quote size={12} />
                    {viewingComedian.tagline}
                  </p>
                )}

                <div className="flex items-center gap-1.5 mt-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background:
                        viewingComedian.status === "active"
                          ? "var(--neon-blue)"
                          : "var(--text-muted)",
                    }}
                  />
                  <span
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{
                      color:
                        viewingComedian.status === "active"
                          ? "var(--neon-blue)"
                          : "var(--text-muted)",
                    }}
                  >
                    {viewingComedian.status}
                  </span>
                </div>
              </div>

              <div
                className="h-px w-full mb-6"
                style={{ background: "rgba(0,212,255,0.08)" }}
              />

              {/* Detail rows */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(0,212,255,0.08)" }}
                  >
                    <Tag size={14} style={{ color: "var(--neon-blue)" }} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Category
                    </p>
                    <span
                      className="text-sm font-medium px-2 py-0.5 rounded-md inline-block"
                      style={{
                        color:
                          genreColors[viewingComedian.genre || "Default"] ||
                          genreColors.Default,
                        background: "rgba(0,212,255,0.08)",
                      }}
                    >
                      {viewingComedian.genre || "—"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(0,212,255,0.08)" }}
                  >
                    <Calendar size={14} style={{ color: "var(--neon-blue)" }} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Added on
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-bright)" }}
                    >
                      {formatDate(viewingComedian.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(0,212,255,0.08)" }}
                  >
                    <Calendar size={14} style={{ color: "var(--neon-blue)" }} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Last updated
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-bright)" }}
                    >
                      {formatDate(viewingComedian.updated_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(0,212,255,0.08)" }}
                  >
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: "var(--neon-blue)" }}
                    >
                      ID
                    </span>
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Comedian ID
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-bright)" }}
                    >
                      #{viewingComedian.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky footer */}
            <div
              className="flex items-center gap-2.5 px-6 py-4 shrink-0"
              style={{
                borderTop: "1px solid rgba(0,212,255,0.1)",
                background: "transparent",
              }}
            >
              <button
                type="button"
                onClick={closeViewDrawer}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: "rgba(0,212,255,0.08)",
                  color: "var(--text-soft)",
                  border: "1px solid rgba(0,212,255,0.15)",
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const comedian = viewingComedian;
                  closeViewDrawer();
                  if (comedian) {
                    setTimeout(() => handleEdit(comedian), 230);
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
                style={{
                  background:
                    "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                  color: "white",
                  boxShadow: "0 0 16px rgba(0,212,255,0.25)",
                }}
              >
                <Edit2 size={13} />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes drawerSlideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes drawerSlideOut {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }
        @keyframes backdropFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes backdropFadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        .drawer-panel-in {
          animation: drawerSlideIn 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .drawer-panel-out {
          animation: drawerSlideOut 200ms cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        .drawer-backdrop-in {
          animation: backdropFadeIn 240ms ease-out forwards;
        }
        .drawer-backdrop-out {
          animation: backdropFadeOut 200ms ease-in forwards;
        }
        .form-input-neon:focus {
          border-color: var(--neon-blue) !important;
          box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.12);
        }
        @media (prefers-reduced-motion: reduce) {
          .drawer-panel-in,
          .drawer-panel-out,
          .drawer-backdrop-in,
          .drawer-backdrop-out {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
