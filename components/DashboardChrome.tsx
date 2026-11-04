"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";

export type Theme = "dark" | "light";

export default function DashboardChrome({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [collapsed, setCollapsed] = useState(false);
  const isLight = theme === "light";

  // Removed again when you leave the dashboard, so the landing page stays dark.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, [theme]);

  return (
    <div className={`flex h-screen h-dvh overflow-hidden ${isLight ? "bg-[#ededed]" : "bg-[#0d0b14]"}`}>
      <Sidebar
        theme={theme}
        onToggleTheme={() => setTheme(isLight ? "dark" : "light")}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
      />

      {/* flex-1 is what makes the page fill the space the sidebar gives up:
          its width follows the sidebar's animation frame by frame */}
      <main className="relative min-w-0 flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  );
}