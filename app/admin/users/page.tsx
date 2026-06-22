"use client";

import { Search, UserPlus, MoreHorizontal, Shield, ShieldCheck } from "lucide-react";
import { useState } from "react";

const users = [
  { id: 1, name: "Jules Santos", email: "jules@nexora.io", role: "Admin", status: "Active", joined: "Jan 12, 2025", initials: "JS", color: "#3b82f6" },
  { id: 2, name: "Lena Cruz", email: "lena@nexora.io", role: "Manager", status: "Active", joined: "Feb 03, 2025", initials: "LC", color: "#8b5cf6" },
  { id: 3, name: "Theo Park", email: "theo@nexora.io", role: "Viewer", status: "Inactive", joined: "Mar 18, 2025", initials: "TP", color: "#ec4899" },
  { id: 4, name: "Amara Diaz", email: "amara@nexora.io", role: "Manager", status: "Active", joined: "Apr 07, 2025", initials: "AD", color: "#10b981" },
  { id: 5, name: "Priya Nair", email: "priya@nexora.io", role: "Viewer", status: "Active", joined: "May 22, 2025", initials: "PN", color: "#f59e0b" },
  { id: 6, name: "Marcus Lee", email: "marcus@nexora.io", role: "Admin", status: "Active", joined: "Jun 01, 2025", initials: "ML", color: "#00d4ff" },
];

const roleColors: Record<string, { bg: string; color: string }> = {
  Admin: { bg: "rgba(0,212,255,0.12)", color: "var(--neon-blue)" },
  Manager: { bg: "rgba(185,79,255,0.12)", color: "var(--neon-purple)" },
  Viewer: { bg: "rgba(255,255,255,0.06)", color: "var(--text-soft)" },
};

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full space-y-6 flex-1 overflow-y-auto p-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-bright)" }}>Users</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{users.length} total members</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
            color: "white",
            boxShadow: "0 0 16px rgba(0,212,255,0.3)",
          }}
        >
          <UserPlus size={14} />
          Add User
        </button>
      </div>

      <div className="card-neon">
        {/* Search bar */}
        <div className="p-4 pb-3" style={{ borderBottom: "1px solid rgba(0,212,255,0.08)" }}>
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="search"
              placeholder="Search users..."
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

        {/* Table Header */}
        <div
          className="grid px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
          style={{
            color: "var(--text-muted)",
            borderBottom: "1px solid rgba(0,212,255,0.08)",
            gridTemplateColumns: "1fr 1fr 100px 90px 110px 40px",
          }}
        >
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Joined</span>
          <span />
        </div>

        {filtered.map((user, i) => (
          <div
            key={user.id}
            className="grid items-center px-5 py-3 transition-all duration-200 cursor-pointer"
            style={{
              gridTemplateColumns: "1fr 1fr 100px 90px 110px 40px",
              borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,212,255,0.06)" : "none",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "rgba(0,212,255,0.03)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "")}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: `linear-gradient(135deg, ${user.color}, ${user.color}99)` }}
              >
                {user.initials}
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-bright)" }}>{user.name}</span>
            </div>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>{user.email}</span>
            <div>
              <span
                className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md w-fit"
                style={roleColors[user.role]}
              >
                {user.role === "Admin" ? <ShieldCheck size={10} /> : <Shield size={10} />}
                {user.role}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: user.status === "Active" ? "var(--neon-blue)" : "var(--text-muted)" }}
              />
              <span className="text-sm" style={{ color: user.status === "Active" ? "var(--neon-blue)" : "var(--text-muted)" }}>
                {user.status}
              </span>
            </div>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>{user.joined}</span>
            <button
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{ color: "var(--text-muted)", background: "transparent" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(0,212,255,0.1)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
