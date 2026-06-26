// AdminLayout.tsx
"use client";

import { ReactNode, useState } from "react";
import { ThemeProvider, useTheme } from "@/components/admin/ThemeProvider";

function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme(); // ✅ now inside ThemeProvider

  return (
    <div
      className="flex h-screen overflow-hidden admin-shell"
      data-theme={theme} // ✅ also set on the shell for scoped CSS
      style={{ background: "var(--dark-navy)" }}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AdminShell>{children}</AdminShell>
    </ThemeProvider>
  );
}