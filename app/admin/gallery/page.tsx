"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  ImageOff,
  X,
  Pencil,
  AlertTriangle,
  Image as ImageIcon,
  AlignLeft,
  Tag,
  ChevronDown,
  Check,
  Eye,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type GalleryItem = {
  id: number;
  title: string;
  category: string | null;
  description: string | null;
  image: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

async function getErrorMessage(res: Response, fallback: string) {
  try {
    const json = await res.clone().json();
    return json?.error || json?.message || fallback;
  } catch {
    try {
      const text = await res.text();
      return text || fallback;
    } catch {
      return fallback;
    }
  }
}

// ── Shared style tokens ───────────────────────────────────────
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

// ── Slide-out panel ────────────────────────────────────────────
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

// ── On/off switch ───────────────────────────────────────────────
function ActiveToggle({
  active,
  onChange,
}: {
  active: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={() => onChange(!active)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        height: 24,
        width: 44,
        borderRadius: 999,
        flexShrink: 0,
        cursor: "pointer",
        border: "none",
        transition: "background 0.2s",
        background: active
          ? "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))"
          : "rgba(255,255,255,0.12)",
      }}
    >
      <span
        style={{
          height: 18,
          width: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "transform 0.2s",
          transform: active ? "translateX(23px)" : "translateX(3px)",
        }}
      />
    </button>
  );
}

// ── Shared image picker ──────────────────────────────────────────
function ImagePicker({
  preview,
  fileName,
  onPick,
  inputRef,
  onChange,
  label = "Choose file",
}: {
  preview: string | null;
  fileName: string | null;
  onPick: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        onClick={onPick}
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
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <ImageIcon size={22} style={{ color: "var(--text-muted)" }} />
        )}
      </div>
      <button
        type="button"
        onClick={onPick}
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
        {fileName || label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

// ── Category dropdown with "Add Category" ────────────────────────
function CategorySelect({
  value,
  onChange,
  categories,
  onAddCategory,
}: {
  value: string;
  onChange: (v: string) => void;
  categories: string[];
  onAddCategory: (c: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setAdding(false);
        setNewCategory("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(cat: string) {
    onChange(cat);
    setOpen(false);
    setAdding(false);
  }

  function handleConfirmAdd() {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    onAddCategory(trimmed);
    onChange(trimmed);
    setNewCategory("");
    setAdding(false);
    setOpen(false);
  }

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          ...inputBase,
          paddingLeft: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{ color: value ? "var(--text-bright)" : "var(--text-muted)" }}
        >
          {value || "Select a category"}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: "var(--text-muted)",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        />
      </button>
      <Tag
        size={13}
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          color: "var(--text-muted)",
        }}
      />

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 20,
            borderRadius: 10,
            background: "var(--card-dark)",
            border: "1px solid var(--border-blue)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
            overflow: "hidden",
          }}
        >
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {categories.length === 0 && !adding && (
              <div
                style={{
                  padding: "12px 14px",
                  fontSize: 12,
                  color: "var(--text-muted)",
                }}
              >
                No categories yet.
              </div>
            )}
            {categories.map((cat) => {
              const selected = cat === value;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelect(cat)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    padding: "9px 14px",
                    background: selected
                      ? "rgba(0,212,255,0.12)"
                      : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "var(--text-bright)",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!selected)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "var(--card-mid)";
                  }}
                  onMouseLeave={(e) => {
                    if (!selected)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                  }}
                >
                  {cat}
                  {selected && (
                    <Check size={13} style={{ color: "var(--neon-blue)" }} />
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ borderTop: "1px solid var(--border-blue)" }}>
            {adding ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: 8,
                }}
              >
                <input
                  autoFocus
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleConfirmAdd();
                    }
                    if (e.key === "Escape") {
                      setAdding(false);
                      setNewCategory("");
                    }
                  }}
                  placeholder="New category name"
                  style={{
                    flex: 1,
                    padding: "7px 10px",
                    borderRadius: 7,
                    background: "var(--card-mid)",
                    border: "1px solid var(--border-blue)",
                    color: "var(--text-bright)",
                    fontSize: 12,
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  style={{
                    padding: "7px 10px",
                    borderRadius: 7,
                    border: "none",
                    cursor: "pointer",
                    background:
                      "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--neon-blue)",
                }}
              >
                <Plus size={13} /> Add Category
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── View Image slide panel ────────────────────────────────────────
function ViewImagePanel({
  item,
  onClose,
  onEdit,
  onDelete,
}: {
  item: GalleryItem | null;
  onClose: () => void;
  onEdit: (item: GalleryItem) => void;
  onDelete: (item: GalleryItem) => void;
}) {
  return (
    <SlidePanel
      open={!!item}
      onClose={onClose}
      width={480}
      glowColor="rgba(0,212,255,0.15)"
    >
      {item && (
        <>
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
                <Eye size={16} style={{ color: "var(--neon-blue)" }} />
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
                  Image Details
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    color: "var(--text-muted)",
                  }}
                >
                  Full gallery entry
                </p>
              </div>
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
          <div
            style={{
              height: 1,
              background: "rgba(0,212,255,0.1)",
              marginBottom: 24,
            }}
          />

          {/* Full image */}
          <div
            style={{
              width: "100%",
              borderRadius: 14,
              overflow: "hidden",
              marginBottom: 20,
              border: "1px solid rgba(0,212,255,0.15)",
              background: "var(--card-mid)",
              position: "relative",
            }}
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                style={{
                  width: "100%",
                  maxHeight: 360,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 240,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ImageOff size={32} style={{ color: "var(--text-muted)" }} />
              </div>
            )}

            {/* Status badge overlaid on image */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                background: item.is_active
                  ? "rgba(0,212,255,0.2)"
                  : "rgba(255,255,255,0.15)",
                color: item.is_active ? "var(--neon-blue)" : "#ffffff",
                border: `1px solid ${item.is_active ? "rgba(0,212,255,0.5)" : "rgba(255,255,255,0.3)"}`,
                backdropFilter: "blur(6px)",
              }}
            >
              {item.is_active ? "Active" : "Inactive"}
            </div>
          </div>

          {/* Title */}
          <h2
            style={{
              margin: "0 0 6px",
              fontSize: 22,
              fontWeight: 800,
              color: "var(--text-bright)",
            }}
          >
            {item.title}
          </h2>

          {/* Category */}
          {item.category && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.25)",
                color: "var(--neon-blue)",
                marginBottom: 20,
              }}
            >
              <Tag size={11} />
              {item.category}
            </div>
          )}

          {/* Full description */}
          <div style={{ marginTop: item.category ? 0 : 12 }}>
            <label style={labelStyle}>Description</label>
            {item.description ? (
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "var(--text-soft)",
                  whiteSpace: "pre-wrap",
                  margin: 0,
                }}
              >
                {item.description}
              </p>
            ) : (
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                No description provided.
              </p>
            )}
          </div>

          {/* Actions */}
          <div style={{ marginTop: 32, display: "flex", gap: 10 }}>
            <button
              onClick={() => onEdit(item)}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: 10,
                cursor: "pointer",
                border: "none",
                background:
                  "linear-gradient(135deg, #b94fff, var(--neon-pink))",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 0.8,
                boxShadow: "0 0 20px rgba(185,79,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={() => onDelete(item)}
              style={{
                padding: "11px 20px",
                borderRadius: 10,
                cursor: "pointer",
                border: "1px solid rgba(255,45,155,0.4)",
                background: "rgba(255,45,155,0.1)",
                color: "var(--neon-pink)",
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </>
      )}
    </SlidePanel>
  );
}

// ── Add Image slide panel ────────────────────────────────────────
function AddImagePanel({
  open,
  onClose,
  onSubmit,
  submitting,
  categories,
  onAddCategory,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    form: {
      title: string;
      category: string;
      description: string;
      isActive: boolean;
    },
    file: File | null,
  ) => Promise<boolean>;
  submitting: boolean;
  categories: string[];
  onAddCategory: (c: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string; file?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setCategory("");
      setDescription("");
      setIsActive(true);
      setFile(null);
      setPreview(null);
      setErrors({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
    if (selected) setErrors((p) => ({ ...p, file: undefined }));
  }

  async function handleSubmit() {
    const e: typeof errors = {};
    if (!title.trim()) e.title = "Title is required.";
    if (!file) e.file = "An image is required.";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const ok = await onSubmit({ title, category, description, isActive }, file);
    if (ok) onClose();
  }

  return (
    <SlidePanel
      open={open}
      onClose={onClose}
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
            <ImageIcon size={16} style={{ color: "var(--neon-blue)" }} />
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
              New Image
            </h3>
            <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>
              Added to the public gallery
            </p>
          </div>
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
      <div
        style={{
          height: 1,
          background: "rgba(0,212,255,0.1)",
          marginBottom: 24,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label style={labelStyle}>
            Image <span style={{ color: "var(--neon-pink)" }}>*</span>
          </label>
          <ImagePicker
            preview={preview}
            fileName={file?.name ?? null}
            onPick={() => fileInputRef.current?.click()}
            inputRef={fileInputRef}
            onChange={handleFileChange}
          />
          {errors.file && <p style={errMsg}>{errors.file}</p>}
        </div>

        <div>
          <label style={labelStyle}>
            Title <span style={{ color: "var(--neon-pink)" }}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
            }}
            placeholder="e.g. Drag Extravaganza"
            style={errors.title ? inputErr : inputBase}
          />
          {errors.title && <p style={errMsg}>{errors.title}</p>}
        </div>

        <div>
          <label style={labelStyle}>
            Category{" "}
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
          <CategorySelect
            value={category}
            onChange={setCategory}
            categories={categories}
            onAddCategory={onAddCategory}
          />
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a short caption…"
              style={{
                ...inputBase,
                paddingLeft: 32,
                resize: "none",
                lineHeight: 1.6,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
            borderRadius: 10,
            background: "rgba(0,0,0,0.2)",
            border: "1px solid rgba(0,212,255,0.15)",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-bright)",
              }}
            >
              {isActive ? "Active" : "Inactive"}
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 11,
                color: "var(--text-muted)",
              }}
            >
              {isActive
                ? "Visible on the public gallery"
                : "Hidden from the public gallery"}
            </p>
          </div>
          <ActiveToggle active={isActive} onChange={setIsActive} />
        </div>
      </div>

      <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
        <button
          onClick={onClose}
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
              "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.8,
            boxShadow: "0 0 20px rgba(0,212,255,0.3)",
            opacity: submitting ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {submitting ? "Adding…" : "Add to Gallery"}
        </button>
      </div>
    </SlidePanel>
  );
}

// ── Edit Image slide panel ───────────────────────────────────────
function EditImagePanel({
  item,
  onClose,
  onSubmit,
  submitting,
  categories,
  onAddCategory,
}: {
  item: GalleryItem | null;
  onClose: () => void;
  onSubmit: (
    form: {
      title: string;
      category: string;
      description: string;
      isActive: boolean;
    },
    file: File | null,
  ) => Promise<boolean>;
  submitting: boolean;
  categories: string[];
  onAddCategory: (c: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setCategory(item.category ?? "");
      setDescription(item.description ?? "");
      setIsActive(item.is_active);
      setFile(null);
      setPreview(item.image_url ?? null);
      setErrors({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [item]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setPreview(
      selected ? URL.createObjectURL(selected) : (item?.image_url ?? null),
    );
  }

  async function handleSubmit() {
    if (!title.trim()) {
      setErrors({ title: "Title is required." });
      return;
    }
    const ok = await onSubmit({ title, category, description, isActive }, file);
    if (ok) onClose();
  }

  return (
    <SlidePanel
      open={!!item}
      onClose={onClose}
      width={460}
      glowColor="rgba(185,79,255,0.15)"
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
              background: "rgba(185,79,255,0.12)",
              border: "1px solid rgba(185,79,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pencil size={16} style={{ color: "#b94fff" }} />
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
              Edit Image
            </h3>
            <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>
              Update the gallery entry
            </p>
          </div>
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
      <div
        style={{
          height: 1,
          background: "rgba(0,212,255,0.1)",
          marginBottom: 24,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label style={labelStyle}>Image</label>
          <ImagePicker
            preview={preview}
            fileName={file?.name ?? null}
            onPick={() => fileInputRef.current?.click()}
            inputRef={fileInputRef}
            onChange={handleFileChange}
            label="Replace file"
          />
        </div>

        <div>
          <label style={labelStyle}>
            Title <span style={{ color: "var(--neon-pink)" }}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({});
            }}
            style={errors.title ? inputErr : inputBase}
          />
          {errors.title && <p style={errMsg}>{errors.title}</p>}
        </div>

        <div>
          <label style={labelStyle}>Category</label>
          <CategorySelect
            value={category}
            onChange={setCategory}
            categories={categories}
            onAddCategory={onAddCategory}
          />
        </div>

        <div>
          <label style={labelStyle}>Description</label>
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                ...inputBase,
                paddingLeft: 32,
                resize: "none",
                lineHeight: 1.6,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
            borderRadius: 10,
            background: "rgba(0,0,0,0.2)",
            border: "1px solid rgba(0,212,255,0.15)",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-bright)",
              }}
            >
              {isActive ? "Active" : "Inactive"}
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 11,
                color: "var(--text-muted)",
              }}
            >
              {isActive
                ? "Visible on the public gallery"
                : "Hidden from the public gallery"}
            </p>
          </div>
          <ActiveToggle active={isActive} onChange={setIsActive} />
        </div>
      </div>

      <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
        <button
          onClick={onClose}
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
            background: "linear-gradient(135deg, #b94fff, var(--neon-pink))",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.8,
            boxShadow: "0 0 20px rgba(185,79,255,0.3)",
            opacity: submitting ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {submitting ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </SlidePanel>
  );
}

// ── Category filter bar ───────────────────────────────────────────
function CategoryFilterBar({
  categories,
  active,
  onSelect,
}: {
  categories: string[];
  active: string;
  onSelect: (c: string) => void;
}) {
  const tabs = ["All", ...categories];
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            onClick={() => onSelect(tab)}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
              background: isActive
                ? "rgba(0,212,255,0.15)"
                : "rgba(255,255,255,0.04)",
              border: isActive
                ? "1px solid rgba(0,212,255,0.5)"
                : "1px solid rgba(255,255,255,0.1)",
              color: isActive ? "var(--neon-blue)" : "var(--text-muted)",
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────
export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  // Categories manually added via "Add Category" but not yet used by any item
  const [extraCategories, setExtraCategories] = useState<string[]>([]);

  const [viewingItem, setViewingItem] = useState<GalleryItem | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [confirmDeleteItem, setConfirmDeleteItem] =
    useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      if (!res.ok) {
        const message = await getErrorMessage(res, "Failed to load gallery");
        throw new Error(message);
      }
      const json = await res.json();
      setItems(json.data ?? []);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Couldn't load gallery",
        description: e.message ?? "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddImage(
    form: {
      title: string;
      category: string;
      description: string;
      isActive: boolean;
    },
    file: File | null,
  ): Promise<boolean> {
    setAddSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("is_active", form.isActive ? "1" : "0");
      if (file) formData.append("image", file);

      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const message = await getErrorMessage(res, "Failed to add image");
        throw new Error(message);
      }
      const json = await res.json();
      setItems((prev) => [json.data, ...prev]);
      toast({ title: "Added", description: "Image added to the gallery." });
      return true;
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Couldn't add image",
        description: e.message ?? "Something went wrong",
      });
      return false;
    } finally {
      setAddSubmitting(false);
    }
  }

  async function handleSaveEdit(
    form: {
      title: string;
      category: string;
      description: string;
      isActive: boolean;
    },
    file: File | null,
  ): Promise<boolean> {
    if (!editingItem) return false;
    setEditSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("is_active", form.isActive ? "1" : "0");
      if (file) formData.append("image", file);

      const res = await fetch(`/api/gallery/${editingItem.id}`, {
        method: "PUT",
        body: formData,
      });
      
      if (!res.ok) {
        const message = await getErrorMessage(res, "Failed to update image");
        throw new Error(message);
      }
      const json = await res.json();
      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? json.data : i)),
      );
      // Keep the view panel's data fresh if it was pointing at the item we just edited
      setViewingItem((prev) =>
        prev && prev.id === editingItem.id ? json.data : prev,
      );
      toast({ title: "Saved", description: "Gallery item updated." });
      return true;
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Couldn't save changes",
        description: e.message ?? "Something went wrong",
      });
      return false;
    } finally {
      setEditSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!confirmDeleteItem) return;
    const id = confirmDeleteItem.id;
    setConfirmDeleteItem(null);
    setDeletingId(id);
    const prevItems = items;
    setItems((prev) => prev.filter((i) => i.id !== id));
    // Close the view panel if it was showing the item being deleted
    setViewingItem((prev) => (prev && prev.id === id ? null : prev));

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const message = await getErrorMessage(res, "Failed to delete image");
        throw new Error(message);
      }
      toast({
        title: "Deleted",
        description: "Image removed from the gallery.",
      });
    } catch (e: any) {
      setItems(prevItems);
      toast({
        variant: "destructive",
        title: "Couldn't delete image",
        description: e.message ?? "Something went wrong",
      });
    } finally {
      setDeletingId(null);
    }
  }

  // Distinct categories from loaded items + any manually added ones, sorted alphabetically
  const categories = Array.from(
    new Set([
      ...items
        .map((i) => i.category)
        .filter((c): c is string => !!c && c.trim() !== ""),
      ...extraCategories,
    ]),
  ).sort();

  function handleAddCategory(cat: string) {
    setExtraCategories((prev) => (prev.includes(cat) ? prev : [...prev, cat]));
  }

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <div className="space-y-6 flex-1 overflow-y-auto p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--text-bright)" }}
          >
            Gallery
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Manage images shown on the public Gallery page
          </p>
        </div>
        <button
          onClick={() => setShowAddPanel(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            background:
              "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))",
            color: "#fff",
            boxShadow: "0 0 16px rgba(0,212,255,0.3)",
          }}
        >
          <Plus size={15} />
          Add Image
        </button>
      </div>

      {/* Category filters */}
      {!loading && items.length > 0 && (
        <CategoryFilterBar
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
        />
      )}

      {/* 5-column image grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2
            className="animate-spin"
            size={28}
            style={{ color: "var(--neon-blue)" }}
          />
        </div>
      ) : items.length === 0 ? (
        <div
          className="text-center py-16 text-sm rounded-lg"
          style={{
            color: "var(--text-muted)",
            border: "1px solid rgba(0,212,255,0.1)",
          }}
        >
          No images yet. Click "Add Image" to upload one.
        </div>
      ) : filteredItems.length === 0 ? (
        <div
          className="text-center py-16 text-sm rounded-lg"
          style={{
            color: "var(--text-muted)",
            border: "1px solid rgba(0,212,255,0.1)",
          }}
        >
          No images in this category.
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setViewingItem(item)}
              className="rounded-lg overflow-hidden group relative aspect-square"
              style={{
                border: "1px solid rgba(0,212,255,0.1)",
                cursor: "pointer",
              }}
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 w-full h-full flex items-center justify-center"
                  style={{ background: "var(--card-mid)" }}
                >
                  <ImageOff size={24} style={{ color: "var(--text-muted)" }} />
                </div>
              )}

              {/* Status badge */}
              <div
                className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
                style={{
                  background: item.is_active
                    ? "rgba(0,212,255,0.2)"
                    : "rgba(255,255,255,0.12)",
                  color: item.is_active
                    ? "var(--neon-blue)"
                    : "#fff",
                  border: `1px solid ${item.is_active ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.15)"}`,
                  backdropFilter: "blur(6px)",
                }}
              >
                {item.is_active ? "Active" : "Inactive"}
              </div>

              {/* Hover actions — purple edit, pink delete */}
              <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingItem(item);
                  }}
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{ background: "#b94fff", color: "#fff" }}
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteItem(item);
                  }}
                  disabled={deletingId === item.id}
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{
                    background: "var(--neon-pink, #ff2d9b)",
                    color: "#fff",
                  }}
                >
                  {deletingId === item.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                </button>
              </div>

              {/* Text overlay with gradient shadow */}
              <div
                className="absolute bottom-0 left-0 right-0 z-10 p-3 pt-10"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.25) 75%, transparent 100%)",
                }}
              >
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: "#fff" }}
                >
                  {item.title}
                </p>
                {item.category && (
                  <p
                    className="text-[11px] font-medium mb-1"
                    style={{ color: "var(--neon-blue)" }}
                  >
                    {item.category}
                  </p>
                )}
                {item.description && (
                  <p
                    className="text-[11px] leading-snug"
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View / Add / Edit slide panels */}
      <ViewImagePanel
        item={viewingItem}
        onClose={() => setViewingItem(null)}
        onEdit={(item) => {
          setViewingItem(null);
          setEditingItem(item);
        }}
        onDelete={(item) => {
          setViewingItem(null);
          setConfirmDeleteItem(item);
        }}
      />
      <AddImagePanel
        open={showAddPanel}
        onClose={() => setShowAddPanel(false)}
        onSubmit={handleAddImage}
        submitting={addSubmitting}
        categories={categories}
        onAddCategory={handleAddCategory}
      />
      <EditImagePanel
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSubmit={handleSaveEdit}
        submitting={editSubmitting}
        categories={categories}
        onAddCategory={handleAddCategory}
      />

      {/* Delete confirmation modal */}
      {confirmDeleteItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setConfirmDeleteItem(null)}
        >
          <div
            className="card-neon p-6 space-y-4 w-full max-w-sm"
            style={{ background: "var(--card-dark, #0d0d2b)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(255,45,155,0.15)",
                  color: "#ff2d9b",
                }}
              >
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-bright)" }}
                >
                  Delete this image?
                </h3>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  "{confirmDeleteItem.title}" will be permanently removed from
                  the gallery. This can't be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteItem(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "var(--text-muted)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "#ff2d9b", color: "#fff" }}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
