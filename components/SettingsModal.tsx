"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { X, User as UserIcon, Lock, Camera, CheckCircle2 } from "lucide-react";

type Tab = "profile" | "security";

export default function SettingsModal({ onClose }: { onClose: () => void }) {

  const { data: session, update } = useSession();
  const [tab, setTab] = useState<Tab>("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile tab state 
  const [firstName, setFirstName] = useState(session?.user?.firstName ?? "");
  const [lastName, setLastName] = useState(session?.user?.lastName ?? "");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Security tab state 
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Close on Escape, lock body scroll while open
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handlePictureSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError("");
    setProfileLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      });
      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.message || "Something went wrong.");
        setProfileLoading(false);
        return;
      }

      await update({ firstName: data.firstName, lastName: data.lastName });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 2500);
    } catch (err) {
      console.error("Update error:", err);
      setProfileError("Something went wrong. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.message || "Something went wrong. Please try again later.");
        setPasswordLoading(false);
        return;
      }

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setPasswordSuccess(false), 2500);
    } catch {
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.06] py-3 px-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-violet-500/60 focus:bg-white/[0.08] focus:ring-1 focus:ring-violet-500/30 duration-300";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#17131f] shadow-[0_24px_80px_rgba(0,0,0,0.5)] animate-modal-pop"
      >
        {/* Sidebar */}
        <div className="w-48 shrink-0 border-r border-white/10 bg-white/[0.03] p-5 sm:w-56">
          <h2 className="text-lg font-semibold text-white">Account</h2>
          <p className="mt-1 text-xs text-white/40">Manage your account info.</p>

          <nav className="mt-6 flex flex-col gap-1">
            <button
              onClick={() => setTab("profile")}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                tab === "profile"
                  ? "bg-white/[0.08] text-white"
                  : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
              }`}
            >
              <UserIcon className="h-4 w-4" />
              Profile
            </button>
            <button
              onClick={() => setTab("security")}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                tab === "security"
                  ? "bg-white/[0.08] text-white"
                  : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
              }`}
            >
              <Lock className="h-4 w-4" />
              Security
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 sm:p-8">
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="absolute right-5 top-5 text-white/40 transition hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {tab === "profile" && (
            <>
              <h3 className="text-base font-semibold text-white">Profile details</h3>

              {profileError && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {profileError}
                </div>
              )}
              {profileSuccess && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Profile updated successfully.
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="mt-5 flex flex-col gap-5">
                {/* Picture */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/[0.06]"
                  >
                    {previewImage || session?.user?.profilePicture ? (
                      <img
                        src={previewImage ?? session?.user?.profilePicture ?? ""}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        <UserIcon className="h-6 w-6 text-white/40" />
                      </span>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                      <Camera className="h-5 w-5 text-white" />
                    </span>
                  </button>
                  <div>
                    <p className="text-sm text-white/70">Profile picture</p>
                    <p className="text-xs text-white/35">Upload coming soon — preview only for now</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePictureSelect}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/80">First name</label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/80">Last name</label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-xl cursor-pointer bg-white text-sm font-semibold text-[#17131f] transition hover:-translate-y-0.5 hover:bg-[#f7f4ff] disabled:opacity-60 sm:w-auto sm:px-6"
                >
                  {profileLoading ? "Saving..." : "Save changes"}
                </button>
              </form>
            </>
          )}

          {tab === "security" && (
            <>
              <h3 className="text-base font-semibold text-white">Change password</h3>

              {passwordError && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Password updated successfully.
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="mt-5 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-white/80">Current password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-white/80">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-white/80">Confirm new password</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <button
                  type="submit"
                  onClick={onClose}
                  disabled={passwordLoading}
                  className="mt-1 inline-flex h-11 cursor-pointer w-full items-center justify-center rounded-xl bg-white text-sm font-semibold text-[#17131f] transition hover:-translate-y-0.5 hover:bg-[#f7f4ff] disabled:opacity-60 sm:w-auto sm:px-6"
                >
                  {passwordLoading ? "Saving..." : "Update password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}