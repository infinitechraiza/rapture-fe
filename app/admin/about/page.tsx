"use client";

import { Zap, Globe, Code2, Github, Twitter, Mail } from "lucide-react";

const team = [
  { name: "Mika Reyes", role: "CEO & Founder", initials: "MR", color: "#00d4ff" },
  { name: "Jules Santos", role: "CTO", initials: "JS", color: "#b94fff" },
  { name: "Lena Cruz", role: "Design Lead", initials: "LC", color: "#ff2d9b" },
  { name: "Theo Park", role: "Engineering", initials: "TP", color: "#f59e0b" },
];

const stats = [
  { label: "Founded", value: "2023" },
  { label: "Team Size", value: "12" },
  { label: "Customers", value: "2,340" },
  { label: "Uptime", value: "99.9%" },
];

export default function AboutPage() {
  return (
    <div className="space-y-6 flex-1 overflow-y-auto p-6 min-h-screen">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-bright)" }}>About</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Company information and team</p>
      </div>

      {/* Brand card */}
      <div className="card-neon p-6">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center logo-glow"
            style={{ background: "linear-gradient(135deg, var(--neon-blue), var(--neon-pink))" }}
          >
            <Zap size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold gradient-text" style={{ fontFamily: "var(--app-font-serif)" }}>
              NEXORA
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Admin Console v2.4.1</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>
          Nexora is a next-generation SaaS platform built for modern teams. We provide real-time analytics,
          reservation management, and customer insights — all in one seamless console.
        </p>
        <div className="flex items-center gap-3 mt-4">
          {[Globe, Code2, Github, Twitter, Mail].map((Icon, i) => (
            <button
              key={i}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{
                background: "var(--card-mid)",
                border: "1px solid rgba(0,212,255,0.15)",
                color: "var(--text-muted)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,212,255,0.4)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,212,255,0.15)")}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="stat-card p-4 text-center">
            <p className="text-2xl font-bold gradient-text">{s.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="card-neon p-5">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-bright)" }}>Core Team</h3>
        <div className="grid grid-cols-2 gap-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer"
              style={{ border: "1px solid rgba(0,212,255,0.1)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,212,255,0.3)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,212,255,0.1)")}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}99)` }}
              >
                {member.initials}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-bright)" }}>{member.name}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
