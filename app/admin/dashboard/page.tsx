"use client";

import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, BarChart2, Filter } from "lucide-react";
import { useState } from "react";

const stats = [
  {
    label: "Revenue",
    value: "$48.2K",
    change: "+12.4%",
    positive: true,
    icon: DollarSign,
    color: "var(--neon-blue)",
    glow: "rgba(0,212,255,0.15)",
  },
  {
    label: "Customers",
    value: "2,340",
    change: "+4.1%",
    positive: true,
    icon: Users,
    color: "var(--neon-purple)",
    glow: "rgba(185,79,255,0.15)",
  },
  {
    label: "Orders",
    value: "912",
    change: "-2.3%",
    positive: false,
    icon: ShoppingCart,
    color: "var(--neon-pink)",
    glow: "rgba(255,45,155,0.15)",
  },
  {
    label: "Conversion",
    value: "3.8%",
    change: "+0.6%",
    positive: true,
    icon: BarChart2,
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.15)",
  },
];

const orders = [
  { id: "#3921", customer: "Jules Santos", initials: "JS", color: "#3b82f6", date: "Jun 14", status: "Paid", amount: "$248.00" },
  { id: "#3920", customer: "Lena Cruz", initials: "LC", color: "#8b5cf6", date: "Jun 14", status: "Pending", amount: "$92.50" },
  { id: "#3919", customer: "Theo Park", initials: "TP", color: "#ec4899", date: "Jun 13", status: "Paid", amount: "$1,204.00" },
  { id: "#3918", customer: "Amara Diaz", initials: "AD", color: "#10b981", date: "Jun 13", status: "Refunded", amount: "$76.00" },
  { id: "#3916", customer: "Priya Nair", initials: "PN", color: "#f59e0b", date: "Jun 12", status: "Failed", amount: "$58.00" },
];

const statusColors: Record<string, string> = {
  Paid: "var(--neon-blue)",
  Pending: "#f59e0b",
  Refunded: "var(--neon-pink)",
  Failed: "#ef4444",
};

function StatCard({ stat }: { stat: typeof stats[0] }) {
  const Icon = stat.icon;
  return (
    <div className="stat-card p-4 flex flex-col gap-3" style={{ borderColor: `rgba(${stat.color === "var(--neon-blue)" ? "0,212,255" : stat.color === "var(--neon-purple)" ? "185,79,255" : stat.color === "var(--neon-pink)" ? "255,45,155" : "245,158,11"},0.2)` }}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          {stat.label}
        </p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: stat.glow, border: `1px solid ${stat.color}33` }}
        >
          <Icon size={14} style={{ color: stat.color }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: "var(--text-bright)" }}>
          {stat.value}
        </p>
        <div className="flex items-center gap-1 mt-1">
          {stat.positive ? (
            <TrendingUp size={12} style={{ color: "var(--neon-blue)" }} />
          ) : (
            <TrendingDown size={12} style={{ color: "var(--neon-pink)" }} />
          )}
          <span
            className="text-xs font-medium"
            style={{ color: stat.positive ? "var(--neon-blue)" : "var(--neon-pink)" }}
          >
            {stat.change}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="space-y-6 flex-1 overflow-y-auto p-6 min-h-screen">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-bright)" }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Welcome back, Mika. Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card-neon">
        <div className="flex items-center justify-between p-5 pb-4" style={{ borderBottom: "1px solid rgba(0,212,255,0.1)" }}>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-bright)" }}>Recent orders</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>6 total orders</p>
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: "var(--card-mid)",
              border: "1px solid rgba(0,212,255,0.18)",
              color: "var(--text-soft)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,212,255,0.4)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,212,255,0.18)")}
          >
            <Filter size={11} />
            Filter orders...
          </button>
        </div>

        {/* Table Header */}
        <div
          className="grid px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
          style={{
            color: "var(--text-muted)",
            borderBottom: "1px solid rgba(0,212,255,0.08)",
            gridTemplateColumns: "80px 1fr 90px 90px 90px",
          }}
        >
          <span>Order</span>
          <span>Customer</span>
          <span>Date</span>
          <span>Status</span>
          <span className="text-right">Amount</span>
        </div>

        {/* Table Rows */}
        {orders.map((order, i) => (
          <div
            key={order.id}
            className="grid items-center px-5 py-3 transition-all duration-200 cursor-pointer"
            style={{
              gridTemplateColumns: "80px 1fr 90px 90px 90px",
              borderBottom: i < orders.length - 1 ? "1px solid rgba(0,212,255,0.06)" : "none",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "rgba(0,212,255,0.03)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "")}
          >
            <span className="text-sm font-medium" style={{ color: "var(--neon-blue)" }}>
              {order.id}
            </span>
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: `linear-gradient(135deg, ${order.color}, ${order.color}bb)` }}
              >
                {order.initials}
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-bright)" }}>
                {order.customer}
              </span>
            </div>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>{order.date}</span>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: statusColors[order.status] }}
              />
              <span className="text-sm" style={{ color: statusColors[order.status] }}>
                {order.status}
              </span>
            </div>
            <span className="text-sm font-semibold text-right" style={{ color: "var(--text-bright)" }}>
              {order.amount}
            </span>
          </div>
        ))}

        {/* Pagination */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: "1px solid rgba(0,212,255,0.08)" }}
        >
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Showing 1–5 of 6 orders
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all duration-200"
              style={{
                background: "var(--card-mid)",
                border: "1px solid rgba(0,212,255,0.15)",
                color: "var(--text-muted)",
              }}
            >
              Previous
            </button>
            <button
              className="w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                color: "white",
              }}
            >
              {page}
            </button>
            <button
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all duration-200"
              style={{
                background: "var(--card-mid)",
                border: "1px solid rgba(0,212,255,0.15)",
                color: "var(--text-muted)",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
