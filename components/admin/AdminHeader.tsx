"use client";

import {
  Search, Bell, Sun, Moon, MoreHorizontal,
  PanelLeftOpen, PanelLeftClose, User, Settings, LogOut,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/components/admin/ThemeProvider";

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Header({ collapsed, onToggle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const btnStyle = {
    background: "var(--card-mid)",
    border: "1px solid rgba(0,212,255,0.12)",
    color: "var(--text-muted)",
  };

  return (
    <header
      className="h-19 shrink-0 flex items-center justify-between px-6 gap-4"
      style={{ background: "var(--card-dark)", borderBottom: "1px solid rgba(0,212,255,0.1)" }}
    >
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xs">
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
          style={btnStyle}
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        </button>

        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg text-sm outline-none"
            style={{ background: "var(--card-mid)", border: "1px solid rgba(0,212,255,0.15)", color: "var(--text-bright)", fontSize: "13px" }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(0,212,255,0.4)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(0,212,255,0.15)")}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          style={btnStyle}
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center relative"
          style={btnStyle}
        >
          <Bell size={14} />
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--neon-pink)", boxShadow: "0 0 6px var(--neon-pink)" }}
          />
        </button>

        {/* Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer"
            style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))" }}
            aria-label="User menu"
            aria-expanded={dropdownOpen}
          >
            MR
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-2xl p-2 z-50"
              style={{
                background: "rgba(10,10,30,0.97)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(0,212,255,0.15)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                top: "calc(100% + 8px)",
              }}
            >
              {/* Header */}
              <div style={{ padding: "12px 12px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "6px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff", margin: "0 0 2px" }}>
                  MR Admin
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                  admin@example.com
                </p>
              </div>

              {/* Links */}
              {[
                { icon: <User size={14} />, label: "Profile" },
                { icon: <Settings size={14} />, label: "Settings" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
                  style={{ color: "var(--text-soft)", background: "transparent", border: "none", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {icon}
                  {label}
                </button>
              ))}

              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />

              <button
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
                style={{ color: "rgba(255,45,155,0.75)", background: "transparent", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,45,155,0.1)"; e.currentTarget.style.color = "var(--neon-pink)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,45,155,0.75)"; }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}