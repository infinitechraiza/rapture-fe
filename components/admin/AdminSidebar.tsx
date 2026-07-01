"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart2,
  Users,
  Info,
  CalendarCheck,
  Calendar,
  Settings,
  Zap,
} from "lucide-react";
import Image from "next/image";

import RaptureLogo from "../../app/rapture_logo.png";

const navSections = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: BarChart2,
        badge: "New",
      },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Comedians", href: "/admin/comedians", icon: Users },
      { label: "About", href: "/admin/about", icon: Info },
      { label: "Events", href: "/admin/events", icon: Calendar },
      {
        label: "Reservation",
        href: "/admin/reservation",
        icon: CalendarCheck,
        count: 12,
      },
    ],
  },
  {
    label: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={`flex flex-col shrink-0 h-full overflow-y-auto transition-all duration-200 ${
        collapsed ? "w-16" : "w-56"
      }`}
      style={{
        background: "var(--card-dark)",
        borderRight: "1px solid rgba(0,212,255,0.12)",
      }}
    >
      {/* Logo + collapse toggle */}
      <div
        className="px-4 py-5 flex items-center gap-2 shrink-0"
        style={{ borderBottom: "1px solid rgba(0,212,255,0.1)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center logo-glow shrink-0"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(0,212,255,0.12)",
            border: "1px solid rgba(0, 0, 0, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 0 30px rgba(0, 0, 0, 0.35), 0 0 50px rgba(30, 22, 26, 0.2)",
          }}
        >
          <Image
            src={RaptureLogo}
            alt="Rapture Logo"
            width={32}
            height={32}
          />
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p
              className="gradient-text font-bold text-sm tracking-widest truncate"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Rapture
            </p>
            <p
              className="text-xs tracking-widest uppercase truncate"
              style={{ color: "var(--text-muted)", fontSize: "8px" }}
            >
              Cafe & Bar
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 my-5 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1 px-5"
                style={{ color: "var(--text-muted)", fontSize: "10px" }}
              >
                {section.label}
              </p>
            )}
            <ul className="m-5 space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href} className="relative group">
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(item.href);
                      }}
                      className={`flex items-center gap-2.5 px-5 py-2 mx-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                        collapsed ? "justify-center" : ""
                      } ${isActive ? "nav-item-active" : ""}`}
                      style={{
                        color: isActive
                          ? "var(--neon-blue)"
                          : "var(--text-soft)",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (
                            e.currentTarget as HTMLAnchorElement
                          ).style.background = "rgba(0,212,255,0.06)";
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            "rgba(255,255,255,0.9)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (
                            e.currentTarget as HTMLAnchorElement
                          ).style.background = "";
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            "var(--text-soft)";
                        }
                      }}
                    >
                      <Icon
                        size={15}
                        style={{
                          color: isActive ? "var(--neon-blue)" : undefined,
                          flexShrink: 0,
                        }}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {"badge" in item && item.badge && (
                            <span className="badge-new">{item.badge}</span>
                          )}
                          {"count" in item && item.count && (
                            <span className="badge-count">{item.count}</span>
                          )}
                        </>
                      )}
                    </a>

                    {/* Tooltip shown only when collapsed, on hover */}
                    {collapsed && (
                      <span
                        className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 gap-2.5 px-5 py-2 mx-2 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50"
                        style={{
                          background: "var(--card-mid)",
                          color: "var(--text-bright)",
                          border: "1px solid rgba(0,212,255,0.2)",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                        }}
                      >
                        {item.label}
                        {"count" in item && item.count
                          ? ` (${item.count})`
                          : ""}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div
        className="px-3 py-3 shrink-0"
        style={{ borderTop: "1px solid rgba(0,212,255,0.1)" }}
      >
        <div
          className={`flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
            collapsed ? "justify-center" : ""
          }`}
          style={{ color: "var(--text-soft)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background =
              "rgba(0,212,255,0.06)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background = "")
          }
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{
              background:
                "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))",
            }}
          >
            MR
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: "var(--text-bright)" }}
              >
                Mika Reyes
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "var(--text-muted)" }}
              >
                Admin
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
