"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white/60 transition hover:bg-white/[0.10] hover:text-white"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}