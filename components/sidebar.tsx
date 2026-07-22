"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { FileText, Mail, Settings, LogOut, ChevronUp, User as UserIcon } from "lucide-react";
import logo from "@/app/assets/logo1.png";
import SettingsModal from "@/components/SettingsModal";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
      <aside className="flex h-screen w-70 shrink-0 flex-col border-r border-white/10 bg-white/[0.02] px-4 py-5">

        <div className="flex items-center gap-2 px-1 py-2 border-b-1 border-white/10">
          <img src={logo.src} alt="Logo" className="h-12 w-13 shrink-0" />
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
            <button className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-left text-sm font-medium text-white/85 transition hover:border-violet-500/40 hover:bg-white/[0.07] hover:text-white cursor-pointer">
              <FileText className="h-4 w-4 shrink-0 text-violet-400" />
              Optimize my CV
            </button>
            <button className="flex items-center gap-2.5 rounded-xl   px-3.5 py-3 text-left text-sm font-medium text-white/85 transition hover:border-violet-500/40 hover:bg-white/[0.07] hover:text-white cursor-pointer">
              <Mail className="h-4 w-4 shrink-0 text-violet-400" />
              Optimize my Cover Letter
            </button>
          </div>
        </div>

        <div className="flex-1 " />
           {/* User section */}
        <div ref={menuRef} className="relative pt-4 cursor-pointer">
    <button
    onClick={() => setMenuOpen((v) => !v)}
    className={`flex w-full items-center gap-2.5 rounded-xl px-1.5 py-1.5 text-left transition-transform duration-300 ease-out ${
      menuOpen ? "-translate-y-[30px]" : "translate-y-0"
    }`}
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
      className={`h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 cursor-pointer ${
        menuOpen ? "rotate-180" : ""
      }`}
    />
  </button>

  {menuOpen && (
    <div className="-mt-[22px] flex flex-col gap-0.5 border-t border-white/10 pt-3">
      <button
        onClick={() => {
          setMenuOpen(false);
          setSettingsOpen(true);
        }}
        style={{ animationDelay: "0ms" }}
        className="flex items-center gap-2.5 rounded-xl px-1.5 py-2 text-left text-sm text-white/70 opacity-100 transition hover:text-white animate-stack-in cursor-pointer"
      >
        <Settings className="h-4 w-4 text-white/40" />
        Settings
      </button>
      <button
        onClick={handleLogout}
        style={{ animationDelay: "180ms" }}
        className="flex items-center gap-2.5 rounded-xl px-1.5 py-2 text-left text-sm text-red-300/80 opacity-100 transition hover:text-red-300 animate-stack-in cursor-pointer"
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