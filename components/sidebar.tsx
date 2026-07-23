"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FileText, Mail, Settings, LogOut, ChevronUp, User as UserIcon } from "lucide-react";
import logo from "@/app/assets/logo1.png";
import SettingsModal from "@/components/SettingsModal";
import { DashboardTab, Theme } from ".././app/dashboard/dashboardMain";

interface SidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  theme: Theme;
}

export default function Sidebar({ activeTab, onSelectTab, theme }: SidebarProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isLight = theme === "light";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const firstName = session?.user?.firstName ?? "";
  const lastName = session?.user?.lastName ?? "";
  const profilePicture = session?.user?.profilePicture;

  return (
    <>
      <aside
        className={`flex h-screen w-70 shrink-0 flex-col px-4 py-5 ${
          isLight
            ? "border-r border-black/10 bg-[#dedede]"
            : "border-r border-white/10 bg-white/[0.02]"
        }`}
      >
        <div
          className={`flex items-center gap-2 border-b px-1 py-3 ${
            isLight ? "border-black/10" : "border-white/10"
          }`}
        >
          <img src={logo.src} alt="Logo" className="h-12 w-13 shrink-0" />
          <div className="min-w-0">
            <p className={`truncate text-sm font-semibold ${isLight ? "text-black" : "text-white"}`}>
              CV Optimizer
            </p>
            <p className={`truncate text-xs ${isLight ? "text-black/40" : "text-white/40"}`}>
              AI Resume Optimizer
            </p>
          </div>
        </div>

        {/* Workspace section */}
        <div className="mt-8">
          <p
            className={`px-1 text-xs font-medium uppercase tracking-widest ${
              isLight ? "text-black/40" : "text-white/35"
            }`}
          >
            Workspace
          </p>

          <div className="mt-3 flex flex-col gap-2">
            <button
              onClick={() => onSelectTab("cv")}
              className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition cursor-pointer ${
                activeTab === "cv"
                  ? "border-violet-500/50 bg-violet-500/10 " + (isLight ? "text-black" : "text-white")
                  : isLight
                  ? "border-black/10 bg-black/[0.03] text-black/75 hover:border-violet-500/40 hover:bg-black/[0.06] hover:text-black"
                  : "border-white/10 bg-white/[0.04] text-white/85 hover:border-violet-500/40 hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              <FileText className="h-4 w-4 shrink-0 text-violet-400" />
              Optimize my CV
            </button>
            <button
              onClick={() => onSelectTab("coverLetter")}
              className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition cursor-pointer ${
                activeTab === "coverLetter"
                  ? "border-violet-500/50 bg-violet-500/10 " + (isLight ? "text-black" : "text-white")
                  : isLight
                  ? "border-black/10 bg-black/[0.03] text-black/75 hover:border-violet-500/40 hover:bg-black/[0.06] hover:text-black"
                  : "border-white/10 bg-white/[0.04] text-white/85 hover:border-violet-500/40 hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              <Mail className="h-4 w-4 shrink-0 text-violet-400" />
              Optimize my Cover Letter
            </button>
          </div>
        </div>

        <div className="flex-1" />

        {/* User section */}
        <div ref={menuRef} className="relative pt-4">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`flex w-full items-center gap-2.5 rounded-xl px-1.5 py-1.5 text-left transition-transform duration-300 ease-out cursor-pointer ${
              menuOpen ? "-translate-y-[30px]" : "translate-y-0"
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border ${
                isLight ? "border-black/15 bg-black/5" : "border-white/15 bg-white/[0.06]"
              }`}
            >
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className={`h-4 w-4 ${isLight ? "text-black/40" : "text-white/40"}`} />
              )}
            </span>

            <span className="min-w-0 flex-1">
              <p className={`truncate text-sm font-medium ${isLight ? "text-black" : "text-white"}`}>
                {status === "loading" ? "…" : `${firstName} ${lastName}`.trim() || "Account"}
              </p>
            </span>

            <ChevronUp
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                isLight ? "text-black/40" : "text-white/40"
              } ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <div
              className={`-mt-[22px] flex flex-col gap-0.5 border-t pt-3 ${
                isLight ? "border-black/10" : "border-white/10"
              }`}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setSettingsOpen(true);
                }}
                style={{ animationDelay: "0ms" }}
                className={`flex items-center gap-2.5 rounded-xl px-1.5 py-2 text-left text-sm opacity-100 transition animate-stack-in cursor-pointer ${
                  isLight ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white"
                }`}
              >
                <Settings className={`h-4 w-4 ${isLight ? "text-black/40" : "text-white/40"}`} />
                Settings
              </button>
              <button
                onClick={handleLogout}
                style={{ animationDelay: "180ms" }}
                className="flex items-center gap-2.5 rounded-xl px-1.5 py-2 text-left text-sm text-red-400 opacity-100 transition hover:text-red-300 animate-stack-in cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}