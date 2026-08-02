"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import Sidebar from "@/components/sidebar";

export type Theme = "dark" | "light";

export default function DashboardChrome({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const isLight = theme === "light";

  return (
    <div className={`flex h-screen h-dvh overflow-hidden ${isLight ? "bg-[#ededed]" : "bg-[#0d0b14]"}`}>
      <Sidebar theme={theme} />

      <main className="relative flex-1 overflow-y-auto px-8 py-8">
        <button
          onClick={() => setTheme(isLight ? "dark" : "light")}
          aria-label="Toggle theme"
          className={`fixed right-6 top-6 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition ${
            isLight
              ? "border-black/10 bg-black/5 text-black/60 hover:bg-black/10 hover:text-black"
              : "border-white/15 bg-white/[0.06] text-white/60 hover:bg-white/[0.10] hover:text-white"
          }`}
        >
          {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {children}
      </main>
    </div>
  );
}