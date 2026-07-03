"use client";

import {
  Search,
  Bell,
  Sun,
  Moon,
  PanelLeftOpen,
  PanelLeftClose,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/admin/ThemeProvider";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Header({ collapsed, onToggle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
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

  const displayName = user?.name || "Admin";
  const displayEmail = user?.email || "";
  const initials = getInitials(user?.name);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setDropdownOpen(false);

    try {
      await logout();
      toast({
        variant: "success",
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to logout. Please try again.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header
      className="h-19 shrink-0 flex items-center justify-between px-6 gap-4"
      style={{
        background: "var(--sidebar-header-bg)",
        borderBottom: "1px solid rgba(0,212,255,0.1)",
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xs">
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
          style={btnStyle}
        >
          {collapsed ? (
            <PanelLeftOpen size={15} />
          ) : (
            <PanelLeftClose size={15} />
          )}
        </button>

        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg text-sm outline-none"
            style={{
              background: "var(--card-mid)",
              border: "1px solid rgba(0,212,255,0.15)",
              color: "var(--text-bright)",
              fontSize: "13px",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(0,212,255,0.4)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(0,212,255,0.15)")
            }
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
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
            style={{
              background: "var(--neon-pink)",
              boxShadow: "0 0 6px var(--neon-pink)",
            }}
          />
        </button>

        {/* Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer disabled:opacity-60"
            style={{
              background:
                "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))",
            }}
            aria-label="User menu"
            aria-expanded={dropdownOpen}
            disabled={loading}
          >
            {loading ? (
              <span
                className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"
                aria-label="Loading"
              />
            ) : (
              initials
            )}
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-2xl p-2 z-50"
              style={{
                background: "var(--card-dark)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(0,212,255,0.15)",
                boxShadow:
                  "0 20px 60px var(--dropdown-shadow, rgba(0,0,0,0.6))",
                top: "calc(100% + 8px)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "12px 12px 8px",
                  borderBottom: "1px solid rgba(0,212,255,0.08)",
                  marginBottom: "6px",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text-bright)",
                    margin: "0 0 2px",
                  }}
                  className="truncate"
                >
                  {displayName}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                  className="truncate"
                >
                  {displayEmail}
                </p>
              </div>

              {/* Links */}
              {[
                { icon: <User size={14} />, label: "Profile", href: "/profile" },
                { icon: <Settings size={14} />, label: "Settings", href: "/admin/settings" },
              ].map(({ icon, label, href }) => (
                <button
                  key={label}
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push(href);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
                  style={{
                    color: "var(--text-soft)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(0,212,255,0.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {icon}
                  {label}
                </button>
              ))}

              <div
                style={{
                  height: "1px",
                  background: "rgba(0,212,255,0.08)",
                  margin: "4px 0",
                }}
              />

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  color: "rgba(255,45,155,0.75)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (isLoggingOut) return;
                  e.currentTarget.style.background = "rgba(255,45,155,0.1)";
                  e.currentTarget.style.color = "var(--neon-pink)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,45,155,0.75)";
                }}
              >
                <LogOut size={14} />
                {isLoggingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}