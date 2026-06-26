"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import {Header} from "@/components/layout/header";           // public site navbar
import {Footer} from "@/components/layout/footer";     // public site footer
import { ThemeProvider, useTheme } from "@/components/admin/ThemeProvider";

/* ─────────────────────────────────────────────
   ADMIN SHELL
   Sidebar + top header, no public nav/footer
───────────────────────────────────────────── */
function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();

  return (
    <div
      className="flex h-screen overflow-hidden admin-shell"
      data-theme={theme}
      style={{ background: "var(--dark-navy)" }}
    >
      <AdminSidebar collapsed={collapsed} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
        <main className="flex-1 overflow-y-auto p-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PUBLIC SHELL
   Sticky nav on top, footer at the bottom
───────────────────────────────────────────── */
function PublicShell({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <div
      data-theme={theme}
      style={{ background: "var(--dark-navy)", minHeight: "100vh" }}
    >
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROUTE SWITCHER
   Anything under /admin → AdminShell
   Everything else    → PublicShell
───────────────────────────────────────────── */
function ShellRouter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return isAdmin ? (
    <AdminShell>{children}</AdminShell>
  ) : (
    <PublicShell>{children}</PublicShell>
  );
}

/* ─────────────────────────────────────────────
   ROOT LAYOUT EXPORT
   Wrap everything in ThemeProvider once so
   both shells share the same theme state.
───────────────────────────────────────────── */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ShellRouter>{children}</ShellRouter>
    </ThemeProvider>
  );
}