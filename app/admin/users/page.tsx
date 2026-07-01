"use client";

import {
  UserPlus,
  Shield,
  ShieldCheck,
  Eye,
  Pencil,
  History,
  X,
  Mail,
  Phone,
  Calendar,
  Check,
  Loader2,
  Lock,
} from "lucide-react";
import {
  useState,
  useEffect,
  useCallback,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  DataTable,
  DataTableColumn,
  FilterConfig,
} from "@/components/admin/DataTable";
import { toast } from "@/hooks/use-toast";

// ── Types ────────────────────────────────────────────────────

type ApiUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  profile_url: string | null;
  user_role: "user" | "admin";
  status: "pending" | "approved";
  created_at: string;
};

type ActivityLog = {
  id: number;
  action: string;
  description: string | null;
  changes: Record<string, { old: string; new: string }> | null;
  created_at: string;
  actor: { id: number; name: string; email: string } | null;
};

type PanelMode = "create" | "edit" | "view" | "activity";

const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
];

const roleStyle: Record<string, { bg: string; color: string }> = {
  admin: { bg: "rgba(0,212,255,0.12)", color: "var(--neon-blue)" },
  user: { bg: "rgba(255,255,255,0.06)", color: "var(--text-soft)" },
};

const statusDot: Record<string, string> = {
  approved: "var(--neon-blue)",
  pending: "#f59e0b",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function formatDateTime(d: string) {
  try {
    return new Date(d).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return d;
  }
}

// ── Stat pill ────────────────────────────────────────────────

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

// ── Row action icons (view / edit / activity) ───────────────

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

function DetailRow({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "rgba(0,212,255,0.08)", color: "var(--neon-blue)" }}
      >
        {icon}
      </div>
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </p>
        <div className="text-sm" style={{ color: "var(--text-bright)" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function RolePill({ role }: { role: string }) {
  const style = roleStyle[role] ?? roleStyle.user;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md" style={style}>
      {role === "admin" ? <ShieldCheck size={10} /> : <Shield size={10} />}
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = statusDot[status] ?? "var(--text-muted)";
  return (
    <span className="inline-flex items-center gap-1.5 text-sm" style={{ color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ── Shared form fields type ──────────────────────────────────

type FormFields = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

const EMPTY_FORM: FormFields = { name: "", email: "", phone: "", password: "" };

// ── User drawer: create / edit / view / activity ─────────────

function UserDrawer({
  open,
  isClosing,
  onClose,
  user,
  mode,
  onSaved,
  onModeChange,
}: {
  open: boolean;
  isClosing: boolean;
  onClose: () => void;
  user: ApiUser | null;
  mode: PanelMode;
  onSaved: (updated: ApiUser) => void;
  onModeChange: (mode: PanelMode) => void;
}) {
  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isView = mode === "view";
  const isActivity = mode === "activity";

  const [form, setForm] = useState<FormFields>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (isCreate) {
      setForm(EMPTY_FORM);
    } else if (user) {
      setForm({
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        password: "",
      });
    }
    setSaveError(null);
  }, [open, isCreate, user]);

  const loadActivity = useCallback(async () => {
    if (!user) return;
    setLogsLoading(true);
    setLogsError(null);
    try {
      const res = await fetch(`/api/users/${user.id}/activity`, {
        cache: "no-store",
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          `Activity endpoint returned ${res.status} ${res.statusText} (not JSON). Check that /api/users/[id]/activity/route.ts exists.`,
        );
      }

      const data = await res.json();
      if (!res.ok || data.success === false)
        throw new Error(data.message || "Failed to load activity.");
      setLogs(data.data?.data ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load activity.";
      setLogsError(message);

      toast({
        variant: "destructive",
        title: "Couldn't load activity",
        description: message,
      });
    } finally {
      setLogsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (open && isActivity) loadActivity();
  }, [open, isActivity, loadActivity]);

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const url = isCreate ? "/api/users" : `/api/users/${user!.id}`;
      const method = isCreate ? "POST" : "PUT";

      const body: Record<string, unknown> = {
        name: form.name,
        email: form.email,
        phone: form.phone,
      };
      if (isCreate) body.password = form.password;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        const msg = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : data.message || "Failed to save user.";
        throw new Error(msg);
      }
      onSaved(data.data);

      toast({
        title: isCreate ? "User created" : "User updated",
        description: isCreate
          ? `${data.data.name} was added and is pending approval.`
          : `${data.data.name}'s details were saved.`,
      });

      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save user.";
      setSaveError(message);
      toast({
        variant: "destructive",
        title: isCreate ? "Couldn't create user" : "Couldn't update user",
        description: message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  // Nothing to show if edit/view/activity were requested without a target user
  if (!isCreate && !user) return null;

  const eyebrow = isCreate
    ? "New"
    : isEdit
      ? "Edit"
      : isActivity
        ? "Activity"
        : "Details";

  const title = isCreate
    ? "Add user"
    : isEdit
      ? "Edit user"
      : isActivity
        ? "Activity log"
        : "User profile";

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={isClosing ? "drawer-backdrop drawer-backdrop-out" : "drawer-backdrop drawer-backdrop-in"}
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
          (isClosing ? "drawer-panel drawer-panel-out" : "drawer-panel drawer-panel-in") + " card-neon"
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
          <div className="flex items-center gap-3 min-w-0">
            {!isCreate && user && (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                }}
              >
                {getInitials(user.name)}
              </div>
            )}
            <div className="min-w-0">
              <p
                className="text-[11px] font-semibold uppercase tracking-widest mb-1"
                style={{ color: "var(--neon-blue)" }}
              >
                {eyebrow}
              </p>
              <h2
                className="text-lg font-bold truncate"
                style={{ color: "var(--text-bright)" }}
              >
                {isCreate ? title : user?.name}
              </h2>
              {!isCreate && user && (
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0"
            style={{ color: "var(--text-muted)", background: "transparent" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,212,255,0.1)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-bright)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
            }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {saveError && (
            <div
              className="mb-4 px-3.5 py-2.5 rounded-lg text-xs"
              style={{
                background: "rgba(255,45,155,0.1)",
                border: "1px solid rgba(255,45,155,0.3)",
                color: "var(--neon-pink)",
              }}
            >
              {saveError}
            </div>
          )}

          {/* ── VIEW MODE ── */}
          {isView && user && (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3"
                  style={{
                    background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                  }}
                >
                  {getInitials(user.name)}
                </div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-bright)" }}>
                  {user.name}
                </h3>
                <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
                  <RolePill role={user.user_role} />
                  <StatusDot status={user.status} />
                </div>
              </div>

              <div
                className="h-px w-full"
                style={{ background: "rgba(0,212,255,0.08)" }}
              />

              <div className="space-y-4">
                <DetailRow icon={<Mail size={14} />} label="Email" value={user.email} />
                <DetailRow icon={<Phone size={14} />} label="Phone" value={user.phone || "—"} />
                <DetailRow icon={<Calendar size={14} />} label="Joined" value={formatDate(user.created_at)} />
                <DetailRow icon={<ShieldCheck size={14} />} label="User ID" value={`#${user.id}`} />
              </div>
            </div>
          )}

          {/* ── ACTIVITY MODE ── */}
          {isActivity && (
            <div className="space-y-3">
              {logsLoading ? (
                <div className="space-y-2.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: 64,
                        borderRadius: 12,
                        background:
                          "linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.4s ease-in-out infinite",
                      }}
                    />
                  ))}
                </div>
              ) : logsError ? (
                <div
                  className="px-3.5 py-2.5 rounded-lg text-xs"
                  style={{
                    background: "rgba(255,45,155,0.1)",
                    border: "1px solid rgba(255,45,155,0.3)",
                    color: "var(--neon-pink)",
                  }}
                >
                  {logsError}
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-10 text-xs" style={{ color: "var(--text-muted)" }}>
                  <History size={22} style={{ margin: "0 auto 10px", opacity: 0.3, display: "block" }} />
                  No activity recorded for this user yet.
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl"
                    style={{
                      background: "rgba(0,0,0,0.25)",
                      border: "1px solid rgba(0,212,255,0.12)",
                      borderLeft: "3px solid var(--neon-blue)",
                    }}
                  >
                    <p className="text-xs font-bold" style={{ color: "var(--text-bright)" }}>
                      {log.description || log.action}
                    </p>

                    {log.changes && Object.keys(log.changes).length > 0 && (
                      <div className="mt-2 space-y-1">
                        {Object.entries(log.changes).map(([field, diff]) => (
                          <div
                            key={field}
                            className="text-[11px] flex gap-1.5 flex-wrap"
                            style={{ color: "var(--text-muted)" }}
                          >
                            <span className="font-semibold" style={{ color: "var(--text-soft)" }}>
                              {field}:
                            </span>
                            <span style={{ textDecoration: "line-through", opacity: 0.6 }}>
                              {diff.old ?? "—"}
                            </span>
                            <span>→</span>
                            <span style={{ color: "var(--neon-blue)" }}>{diff.new ?? "—"}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="mt-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {log.actor ? `by ${log.actor.name}` : "by system"} · {formatDateTime(log.created_at)}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── CREATE / EDIT MODE: form ── */}
          {(isCreate || isEdit) && (
            <form id="user-form" onSubmit={handleSave} className="space-y-6">
              <div>
                <label
                  htmlFor="user-name"
                  className="block text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Name
                </label>
                <input
                  id="user-name"
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
                  placeholder="Full name"
                />
              </div>

              <div>
                <label
                  htmlFor="user-email"
                  className="block text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Email
                </label>
                <input
                  id="user-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="form-input-neon w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: "var(--card-mid)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    color: "var(--text-bright)",
                  }}
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="user-phone"
                  className="block text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Phone
                </label>
                <input
                  id="user-phone"
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="form-input-neon w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: "var(--card-mid)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    color: "var(--text-bright)",
                  }}
                  placeholder="Optional"
                />
              </div>

              {isCreate && (
                <div>
                  <label
                    htmlFor="user-password"
                    className="block text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Lock size={11} /> Password
                    </span>
                  </label>
                  <input
                    id="user-password"
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="form-input-neon w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all"
                    style={{
                      background: "var(--card-mid)",
                      border: "1px solid rgba(0,212,255,0.15)",
                      color: "var(--text-bright)",
                    }}
                    placeholder="Min 8 characters"
                  />
                </div>
              )}
            </form>
          )}
        </div>

        {/* Sticky footer */}
        <div
          className="flex items-center gap-2.5 px-6 py-4 shrink-0"
          style={{
            borderTop: "1px solid rgba(0,212,255,0.1)",
            background: "transparent",
          }}
        >
          {isView && user && (
            <>
              <button
                type="button"
                onClick={() => onModeChange("activity")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: "rgba(0,212,255,0.08)",
                  color: "var(--text-soft)",
                  border: "1px solid rgba(0,212,255,0.15)",
                }}
              >
                <History size={13} />
                Activity
              </button>
              <button
                type="button"
                onClick={() => onModeChange("edit")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                  color: "white",
                  boxShadow: "0 0 16px rgba(0,212,255,0.25)",
                }}
              >
                <Pencil size={13} />
                Edit
              </button>
            </>
          )}

          {isActivity && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: "rgba(0,212,255,0.08)",
                color: "var(--text-soft)",
                border: "1px solid rgba(0,212,255,0.15)",
              }}
            >
              Close
            </button>
          )}

          {(isCreate || isEdit) && (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
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
                form="user-form"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
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
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                {saving ? "Saving…" : isCreate ? "Add user" : "Save changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>("create");

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = panelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [panelOpen]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
        search,
        role,
        status,
      });
      const res = await fetch(`/api/users?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message || "Failed to load users.");
      setUsers(data.data?.data ?? []);
      setTotal(data.data?.total ?? 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load users.";
      setError(message);
      toast({ variant: "destructive", title: "Couldn't load users", description: message });
    } finally {
      setLoading(false);
    }
  }, [page, search, role, status]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setPage(1);
  }, [search, role, status]);

  const approvedCount = users.filter((u) => u.status === "approved").length;
  const pendingCount = users.filter((u) => u.status === "pending").length;

  const openPanel = (mode: PanelMode, user: ApiUser | null) => {
    setSelectedUser(user);
    setPanelMode(mode);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setPanelOpen(false);
      setIsClosing(false);
    }, 220);
  };

  const columns: DataTableColumn<ApiUser>[] = [
    {
      key: "name",
      label: "User",
      width: "1.3fr",
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))" }}
          >
            {getInitials(u.name)}
          </div>
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-bright)", whiteSpace: "normal", wordBreak: "break-word" }}
          >
            {u.name}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      width: "1.3fr",
      render: (u) => (
        <span className="text-sm" style={{ color: "var(--text-muted)", whiteSpace: "normal", wordBreak: "break-word" }}>
          {u.email}
        </span>
      ),
    },
    { key: "user_role", label: "Role", width: "0.8fr", render: (u) => <RolePill role={u.user_role} /> },
    { key: "status", label: "Status", width: "0.9fr", render: (u) => <StatusDot status={u.status} /> },
    {
      key: "created_at",
      label: "Joined",
      width: "0.9fr",
      render: (u) => <span className="text-sm" style={{ color: "var(--text-muted)" }}>{formatDate(u.created_at)}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      width: "120px",
      render: (u) => (
        <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
          <RowActionButton icon={<Eye size={14} />} title="View" onClick={() => openPanel("view", u)} />
          <RowActionButton icon={<Pencil size={14} />} title="Edit" onClick={() => openPanel("edit", u)} />
          <RowActionButton
            icon={<History size={14} />}
            title="Activity log"
            onClick={() => openPanel("activity", u)}
          />
        </div>
      ),
    },
  ];

  const filters: FilterConfig[] = [
    { key: "role", label: "Role", options: ROLE_OPTIONS, value: role },
    { key: "status", label: "Status", options: STATUS_FILTER_OPTIONS, value: status },
  ];

  return (
    <div className="space-y-6 flex-1 overflow-y-auto p-6 min-h-screen">
      {/* ── Header ── */}
      <div
        style={{
          position: "relative",
          borderRadius: 18,
          padding: "26px 28px",
          overflow: "hidden",
          background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(185,79,255,0.06) 60%, transparent)",
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
            background: "radial-gradient(circle, rgba(0,212,255,0.18), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="flex items-center justify-between flex-wrap gap-4" style={{ position: "relative" }}>
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
              Team Management
            </p>
            <h1 style={{ margin: "4px 0 0", fontSize: 26, fontWeight: 800, color: "var(--text-bright)", letterSpacing: -0.5 }}>
              Users
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
              Manage accounts, roles, and access across your organization.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <HeaderStat label="Total" value={total} accent="var(--neon-blue)" />
            <HeaderStat label="Approved" value={approvedCount} accent="#10b981" />
            <HeaderStat label="Pending" value={pendingCount} accent="#f59e0b" />

            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                color: "white",
                boxShadow: "0 0 16px rgba(0,212,255,0.3)",
              }}
              onClick={() => openPanel("create", null)}
            >
              <UserPlus size={14} />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* ── DataTable ── */}
      <DataTable
        columns={columns}
        rows={users}
        rowKey={(u) => u.id}
        loading={loading}
        error={error}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users..."
        filters={filters}
        onFilterChange={(key, value) => {
          if (key === "role") setRole(value);
          if (key === "status") setStatus(value);
        }}
        page={page}
        perPage={perPage}
        total={total}
        onPageChange={setPage}
        onRowClick={(u) => openPanel("view", u)}
      />

      {/* ── Slide-out drawer: create / view / edit / activity ── */}
      {panelOpen && (
        <UserDrawer
          open={panelOpen}
          isClosing={isClosing}
          onClose={closePanel}
          user={selectedUser}
          mode={panelMode}
          onModeChange={(m) => setPanelMode(m)}
          onSaved={(updated) => {
            setUsers((prev) => {
              const exists = prev.some((u) => u.id === updated.id);
              return exists ? prev.map((u) => (u.id === updated.id ? updated : u)) : [updated, ...prev];
            });
            setSelectedUser(updated);
          }}
        />
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
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
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