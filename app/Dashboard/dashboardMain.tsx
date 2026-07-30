"use client";

import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { useSession} from "next-auth/react";

export type DashboardTab = "cv" | "coverLetter" | "home" | null;
export type Theme = "dark" | "light";

export default function DashboardShell() {
  const [activeTab, setActiveTab] = useState<DashboardTab>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const isLight = theme === "light";
  const { data: session} = useSession();
  
  const firstName = session?.user?.firstName ?? "";
  const lastName = session?.user?.lastName ?? "";
 
  return (


    <div className={`flex min-h-screen min-h-dvh ${isLight ? "bg-[#ededed]" : "bg-[#0d0b14]"}`}>
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} theme={theme} />

      <main className="relative flex-1 px-8 py-8">
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

        {activeTab === "cv" && (
          <h1 className={`text-2xl font-semibold ${isLight ? "text-black" : "text-white"}`}>
            CV Optimization
          </h1>
        )}
        {activeTab === "coverLetter" && (
          <h1 className={`text-2xl font-semibold ${isLight ? "text-black" : "text-white"}`}>
            Cover Letter Optimization
          </h1>
        )}
        {activeTab === "home" && (
          <h1 className={`text-3xl font-semibold ${isLight ? "text-black" : "text-white"}`}>
            Welcome back {firstName} {lastName}
          </h1>
        )}
      </main>
    </div>
  );
}