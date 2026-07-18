"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { FileText, Mail, Settings, LogOut, ChevronUp, User as UserIcon } from "lucide-react";
import logo from "@/app/assets/logo1.png";
import SettingsModal from "@/components/SettingsModal";

export default function Sidebar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const firstName = session?.user?.firstName ?? "";
  const lastName = session?.user?.lastName ?? "";
  const profilePicture = session?.user?.profilePicture;

  return (
    <>
      <aside className="flex h-screen w-70 shrink-0 flex-col border-r border-white/10 bg-white/[0.02] px-4 py-5">

  
        <div className="flex items-center gap-2 px-1 py-3 border border-bottom border-white/10">
          <img src={logo.src} alt="Logo" className="h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">CV Optimizer</p>
            <p className="truncate text-xs text-white/40">AI Resume Optimizer</p>
          </div>
        </div>

        {/* Workspace section */}
        <div className="mt-8">
          <p className="px-1 text-xs font-medium uppercase tracking-widest text-white/35">
            Workspace
          </p>

          <div className="mt-3 flex flex-col gap-2">
            <button className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-left text-sm font-medium text-white/85 transition hover:border-violet-500/40 hover:bg-white/[0.07] hover:text-white">
              <FileText className="h-4 w-4 shrink-0 text-violet-400" />
              Optimize my CV
            </button>
            <button className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-left text-sm font-medium text-white/85 transition hover:border-violet-500/40 hover:bg-white/[0.07] hover:text-white">
              <Mail className="h-4 w-4 shrink-0 text-violet-400" />
              Optimize my Cover Letter
            </button>
          </div>
        </div>

        <div className="flex-1" />

        <div ref={menuRef} className="relative border-t border-white/10 pt-4">
          {menuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-2xl border border-white/10 bg-[#17131f]/95 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-slide-up">
              <div className="flex flex-col p-1.5">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setSettingsOpen(true);
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-white/80 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <Settings className="h-4 w-4 text-white/50" />
                  Settings
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-red-300/90 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex w-full items-center gap-2.5 rounded-xl px-1.5 py-1.5 text-left transition hover:bg-white/[0.05]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.06]">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-4 w-4 text-white/40" />
              )}
            </span>

            <span className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {firstName} {lastName}
              </p>
            </span>

            <ChevronUp
              className={`h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </aside>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}