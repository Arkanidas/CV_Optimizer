"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LayoutDashboard, Settings, LogOut, User } from "lucide-react";

export default function ProfileMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status !== "authenticated" || !session?.user) {
    return null;
  }

  const { firstName, lastName, profilePicture, email } = session.user;

  return (
    <div ref={menuRef} className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open profile menu"
        className="flex h-11 w-11 items-center justify-center mr-2 cursor-pointer overflow-hidden rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl transition hover:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
      >
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-white/[0.08]">
            <User className="h-5 w-5 text-white/40" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#17131f]/95 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="truncate text-sm font-medium text-white">
              {firstName} {lastName}
            </p>
            <p className="truncate text-xs text-white/40">{email}</p>
          </div>

          <div className="flex flex-col p-1.5">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/[0.06] hover:text-white"
            >
              <LayoutDashboard className="h-4 w-4 text-white/50" />
              My Dashboard
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Settings className="h-4 w-4 text-white/50" />
              Settings
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-red-300/90 transition hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}