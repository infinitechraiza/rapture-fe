"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Loader2, ImageOff, X, Upload } from "lucide-react";
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

const inputStyle: React.CSSProperties = {
  background: "var(--card-mid)",
  border: "1px solid rgba(0,212,255,0.15)",
  color: "var(--text-bright)",
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

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  }

  function resetForm() {
    setTitle("");
    setCategory("");
    setDescription("");
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleAddImage() {
    if (!title.trim() || !file) {
      toast({
        variant: "destructive",
        title: "Missing info",
        description: "A title and an image file are required.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("image", file);

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
      resetForm();
      setShowForm(false);
      toast({ title: "Added", description: "Image added to the gallery." });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Couldn't add image",
        description: e.message ?? "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    const prevItems = items;
    setItems((prev) => prev.filter((i) => i.id !== id));

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
      setItems(prevItems); // roll back on failure
      toast({
        variant: "destructive",
        title: "Couldn't delete image",
        description: e.message ?? "Something went wrong",
      });
    } finally {
      setDeletingId(null);
    }
  }

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
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            background:
              "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))",
            color: "#fff",
          }}
        >
          <Plus size={15} />
          Add Image
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card-neon p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--text-bright)" }}
            >
              New Image
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              style={{ color: "var(--text-muted)" }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span
                className="text-xs font-medium mb-1.5 block"
                style={{ color: "var(--text-muted)" }}
              >
                Title
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sunset over the studio"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={inputStyle}
              />
            </label>
            <label className="block">
              <span
                className="text-xs font-medium mb-1.5 block"
                style={{ color: "var(--text-muted)" }}
              >
                Category
              </span>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Events"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={inputStyle}
              />
            </label>
          </div>

          <label className="block">
            <span
              className="text-xs font-medium mb-1.5 block"
              style={{ color: "var(--text-muted)" }}
            >
              Description
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={inputStyle}
            />
          </label>

          <label className="block">
            <span
              className="text-xs font-medium mb-1.5 block"
              style={{ color: "var(--text-muted)" }}
            >
              Image
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                style={inputStyle}
              >
                <Upload size={14} />
                {file ? file.name : "Choose file"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover"
                  style={{ border: "1px solid rgba(0,212,255,0.15)" }}
                />
              )}
            </div>
          </label>

          <div className="flex justify-end">
            <button
              onClick={handleAddImage}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
              style={{
                background:
                  "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))",
                color: "#fff",
              }}
            >
              {submitting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Plus size={15} />
              )}
              {submitting ? "Adding..." : "Add to Gallery"}
            </button>
          </div>
        </div>
      )}

      {/* 4-column image grid */}
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
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-lg overflow-hidden group relative"
              style={{ border: "1px solid rgba(0,212,255,0.1)" }}
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div
                  className="w-full aspect-square flex items-center justify-center"
                  style={{ background: "var(--card-mid)" }}
                >
                  <ImageOff size={24} style={{ color: "var(--text-muted)" }} />
                </div>
              )}

              <button
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="absolute top-2 right-2 w-7 h-7 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
              >
                {deletingId === item.id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
              </button>

              <div className="p-2.5 space-y-0.5">
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: "var(--text-bright)" }}
                >
                  {item.title}
                </p>
                {item.category && (
                  <p
                    className="text-[11px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.category}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
