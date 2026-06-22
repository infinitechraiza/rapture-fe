"use client";

import { Bell, Lock, Palette, Globe, Database, Shield, Save } from "lucide-react";
import { useState } from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-10 h-5 rounded-full transition-all duration-300 shrink-0"
      style={{
        background: checked
          ? "linear-gradient(90deg, var(--neon-blue), var(--neon-purple))"
          : "rgba(255,255,255,0.1)",
        boxShadow: checked ? "0 0 10px rgba(0,212,255,0.4)" : "none",
      }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300"
        style={{ left: checked ? "calc(100% - 18px)" : "2px" }}
      />
    </button>
  );
}

const sections = [
  {
    icon: Bell,
    label: "Notifications",
    color: "var(--neon-blue)",
    settings: [
      { key: "email_notif", label: "Email notifications", desc: "Receive email alerts for key events" },
      { key: "push_notif", label: "Push notifications", desc: "Browser push notifications" },
      { key: "weekly_digest", label: "Weekly digest", desc: "Summary email every Monday" },
    ],
  },
  {
    icon: Shield,
    label: "Security",
    color: "var(--neon-purple)",
    settings: [
      { key: "two_factor", label: "Two-factor authentication", desc: "Require 2FA for all admin logins" },
      { key: "session_timeout", label: "Auto session timeout", desc: "Log out inactive sessions after 30 min" },
      { key: "audit_log", label: "Audit log", desc: "Track all admin actions" },
    ],
  },
  {
    icon: Palette,
    label: "Appearance",
    color: "var(--neon-pink)",
    settings: [
      { key: "dark_mode", label: "Dark mode", desc: "Use the dark neon theme" },
      { key: "compact_mode", label: "Compact sidebar", desc: "Collapse sidebar to icons only" },
      { key: "animations", label: "Animations", desc: "Enable UI transitions and effects" },
    ],
  },
];

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    email_notif: true,
    push_notif: false,
    weekly_digest: true,
    two_factor: true,
    session_timeout: true,
    audit_log: false,
    dark_mode: true,
    compact_mode: false,
    animations: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="h-full space-y-6 flex-1 overflow-y-auto p-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-bright)" }}>Settings</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Manage your admin preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
          style={{
            background: saved
              ? "linear-gradient(135deg, #10b981, #059669)"
              : "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
            color: "white",
            boxShadow: saved ? "0 0 16px rgba(16,185,129,0.4)" : "0 0 16px rgba(0,212,255,0.3)",
          }}
        >
          <Save size={14} />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <div key={section.label} className="card-neon p-5">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${section.color}22`, border: `1px solid ${section.color}44` }}
              >
                <Icon size={13} style={{ color: section.color }} />
              </div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-bright)" }}>{section.label}</h2>
            </div>
            <div className="space-y-3">
              {section.settings.map((setting, i) => (
                <div
                  key={setting.key}
                  className="flex items-center justify-between py-2.5"
                  style={{
                    borderBottom: i < section.settings.length - 1 ? "1px solid rgba(0,212,255,0.06)" : "none",
                  }}
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-medium" style={{ color: "var(--text-bright)" }}>{setting.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{setting.desc}</p>
                  </div>
                  <Toggle
                    checked={toggles[setting.key] ?? false}
                    onChange={(v) => setToggles((prev) => ({ ...prev, [setting.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Danger zone */}
      <div className="card-neon p-5" style={{ borderColor: "rgba(255,45,155,0.2)" }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,45,155,0.12)", border: "1px solid rgba(255,45,155,0.3)" }}>
            <Lock size={13} style={{ color: "var(--neon-pink)" }} />
          </div>
          <h2 className="text-sm font-semibold" style={{ color: "var(--neon-pink)" }}>Danger Zone</h2>
        </div>
        <div className="space-y-2">
          {[
            { label: "Export all data", desc: "Download a full backup of your account" },
            { label: "Reset to defaults", desc: "Restore all settings to factory defaults" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-bright)" }}>{item.label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              </div>
              <button
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: "rgba(255,45,155,0.1)",
                  border: "1px solid rgba(255,45,155,0.25)",
                  color: "var(--neon-pink)",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,45,155,0.2)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,45,155,0.1)")}
              >
                {item.label.split(" ")[0]}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
