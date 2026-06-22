"use client";

import { TrendingUp, Activity, ArrowUpRight } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 18400, users: 320 },
  { month: "Feb", revenue: 22100, users: 410 },
  { month: "Mar", revenue: 19800, users: 380 },
  { month: "Apr", revenue: 31200, users: 560 },
  { month: "May", revenue: 28700, users: 490 },
  { month: "Jun", revenue: 48200, users: 720 },
];

const channelData = [
  { name: "Organic", value: 42 },
  { name: "Paid", value: 28 },
  { name: "Referral", value: 18 },
  { name: "Social", value: 12 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg text-xs"
        style={{
          background: "var(--card-dark)",
          border: "1px solid rgba(0,212,255,0.25)",
          color: "var(--text-bright)",
        }}
      >
        <p className="font-semibold mb-1" style={{ color: "var(--neon-blue)" }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: "var(--text-soft)" }}>
            {p.name}: <span style={{ color: "var(--text-bright)" }}>{typeof p.value === "number" && p.value > 1000 ? `$${(p.value / 1000).toFixed(1)}K` : p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 flex-1 overflow-y-auto p-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-bright)" }}>Analytics</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Revenue and growth insights</p>
        </div>
        <span className="badge-new" style={{ fontSize: "10px", padding: "3px 10px" }}>New</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Revenue", value: "$168.4K", change: "+18.2%", color: "var(--neon-blue)" },
          { label: "Active Users", value: "2,880", change: "+9.4%", color: "var(--neon-purple)" },
          { label: "Avg. Order", value: "$184.70", change: "+3.1%", color: "var(--neon-pink)" },
        ].map((item) => (
          <div key={item.label} className="stat-card p-4">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
              {item.label}
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--text-bright)" }}>{item.value}</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight size={12} style={{ color: item.color }} />
              <span className="text-xs font-medium" style={{ color: item.color }}>{item.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="card-neon p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} style={{ color: "var(--neon-blue)" }} />
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-bright)" }}>Revenue over time</h2>
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Last 6 months</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.08)" />
            <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#00d4ff" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Channel Chart */}
      <div className="card-neon p-5">
        <div className="flex items-center gap-2 mb-5">
          <Activity size={16} style={{ color: "var(--neon-purple)" }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-bright)" }}>Traffic by channel</h2>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={channelData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="url(#barGrad)" radius={[0, 4, 4, 0]} name="Share">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#b94fff" />
                  <stop offset="100%" stopColor="#00d4ff" />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
