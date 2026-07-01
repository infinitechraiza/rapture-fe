"use client";

import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect, ReactNode } from "react";

// ── Types ────────────────────────────────────────────────────

export type DataTableColumn<T> = {
  key: string;
  label: string;
  width: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
};

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterConfig = {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;

  loading?: boolean;
  error?: string | null;

  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  filters?: FilterConfig[];
  onFilterChange?: (key: string, value: string) => void;

  page: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;

  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => ReactNode;

  emptyLabel?: string;
};

// ── Filter dropdown ──────────────────────────────────────────

function FilterDropdown({
  config,
  onChange,
}: {
  config: FilterConfig;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeLabel =
    config.options.find((o) => o.value === config.value)?.label ?? config.label;
  const isActive = config.value !== "all" && config.value !== "";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 12px",
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          background: isActive ? "rgba(0,212,255,0.1)" : "var(--card-mid)",
          border: `1px solid ${isActive ? "rgba(0,212,255,0.35)" : "rgba(0,212,255,0.15)"}`,
          color: isActive ? "var(--neon-blue)" : "var(--text-soft)",
          whiteSpace: "nowrap",
        }}
      >
        <Filter size={12} />
        {isActive ? activeLabel : config.label}
        <ChevronDown size={12} style={{ opacity: 0.6 }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            minWidth: 160,
            zIndex: 20,
            borderRadius: 12,
            background: "var(--card-mid)",
            border: "1px solid rgba(0,212,255,0.2)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
            overflow: "hidden",
            padding: 4,
          }}
        >
          {config.options.map((opt) => {
            const selected = opt.value === config.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 10px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: selected ? 700 : 500,
                  cursor: "pointer",
                  background: selected ? "rgba(0,212,255,0.12)" : "transparent",
                  border: "none",
                  color: selected ? "var(--neon-blue)" : "var(--text-soft)",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  error = null,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onFilterChange,
  page,
  perPage,
  total,
  onPageChange,
  onRowClick,
  rowActions,
  emptyLabel = "No results found.",
}: DataTableProps<T>) {
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const from = total > 0 ? (page - 1) * perPage + 1 : 0;
  const to = Math.min(page * perPage, total);

  // ✅ all columns now use equal "1fr" tracks regardless of what's passed in,
  // so widths stay visually consistent even if a caller forgets to set "1fr"
  const gridTemplate =
    columns.map(() => "1fr").join(" ") + (rowActions ? " 40px" : "");

  const wrapStyle: React.CSSProperties = {
    whiteSpace: "normal",
    wordBreak: "break-word",
    minWidth: 0, // critical: lets grid items shrink and wrap instead of overflowing
  };

  return (
    <div className="card-neon">
      {/* ── Toolbar: search + filters ── */}
      <div
        className="p-4 pb-3 flex items-center gap-2.5 flex-wrap"
        style={{ borderBottom: "1px solid rgba(0,212,255,0.08)" }}
      >
        <div className="relative max-w-xs flex-1" style={{ minWidth: 200 }}>
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg text-sm outline-none"
            style={{
              background: "var(--card-mid)",
              border: "1px solid rgba(0,212,255,0.15)",
              color: "var(--text-bright)",
            }}
          />
        </div>

        {filters.map((f) => (
          <FilterDropdown
            key={f.key}
            config={f}
            onChange={(value) => onFilterChange?.(f.key, value)}
          />
        ))}
      </div>

      {/* ── Table header ── */}
      <div
        className="grid px-5 py-2.5 text-xs font-semibold uppercase tracking-widest"
        style={{
          color: "var(--text-muted)",
          borderBottom: "1px solid rgba(0,212,255,0.08)",
          gridTemplateColumns: gridTemplate,
        }}
      >
        {columns.map((c) => (
          <span key={c.key} style={wrapStyle}>
            {c.label}
          </span>
        ))}
        {rowActions && <span />}
      </div>

      {/* ── Body states ── */}
      {loading ? (
        <div
          className="px-5 py-10 text-center text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Loading…
        </div>
      ) : error ? (
        <div
          className="m-4 px-4 py-3 rounded-lg text-sm"
          style={{
            background: "rgba(255,45,155,0.1)",
            border: "1px solid rgba(255,45,155,0.3)",
            color: "var(--neon-pink)",
          }}
        >
          {error}
        </div>
      ) : rows.length === 0 ? (
        <div
          className="px-5 py-10 text-center text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          {emptyLabel}
        </div>
      ) : (
        rows.map((row, i) => (
          <div
            key={rowKey(row)}
            className="grid items-center px-5 py-3 transition-all duration-200 cursor-pointer"
            style={{
              gridTemplateColumns: gridTemplate,
              borderBottom:
                i < rows.length - 1 ? "1px solid rgba(0,212,255,0.06)" : "none",
            }}
            onClick={() => onRowClick?.(row)}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background =
                "rgba(0,212,255,0.03)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background = "")
            }
          >
            {columns.map((c) => (
              <div key={c.key} style={wrapStyle}>
                {c.render ? (
                  c.render(row)
                ) : (
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-muted)", ...wrapStyle }}
                  >
                    {String((row as Record<string, unknown>)[c.key] ?? "")}
                  </span>
                )}
              </div>
            ))}
            {rowActions && (
              <div onClick={(e) => e.stopPropagation()}>{rowActions(row)}</div>
            )}
          </div>
        ))
      )}

      {/* ── Pagination footer ── */}
      {!loading && !error && total > 0 && (
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: "1px solid rgba(0,212,255,0.08)" }}
        >
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Showing {from}–{to} of {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{
                background: "var(--card-mid)",
                border: "1px solid rgba(0,212,255,0.15)",
                color: page <= 1 ? "var(--text-muted)" : "var(--text-soft)",
                opacity: page <= 1 ? 0.4 : 1,
                cursor: page <= 1 ? "not-allowed" : "pointer",
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <span
              className="text-xs font-medium px-2"
              style={{ color: "var(--text-soft)" }}
            >
              Page {page} of {lastPage}
            </span>
            <button
              onClick={() => onPageChange(Math.min(lastPage, page + 1))}
              disabled={page >= lastPage}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{
                background: "var(--card-mid)",
                border: "1px solid rgba(0,212,255,0.15)",
                color: page >= lastPage ? "var(--text-muted)" : "var(--text-soft)",
                opacity: page >= lastPage ? 0.4 : 1,
                cursor: page >= lastPage ? "not-allowed" : "pointer",
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}