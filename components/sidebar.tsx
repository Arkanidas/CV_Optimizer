"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {FileText,
  Mail,
  Settings,
  LogOut,
  ChevronUp,
  User as UserIcon,
  Sun,
  Moon,
  ArrowUpCircle,
  type LucideIcon,
} from "lucide-react";
import logo from "@/app/assets/logo1.png";
import SettingsModal from "@/components/SettingsModal";
import ShinyText from "@/components/ShinyText";
import { lexend } from "@/app/fonts";
import type { SubscriptionTier } from "@/lib/AI/tiers";

interface SidebarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

const TIER_LABEL: Record<SubscriptionTier, string> = {
  free: "Free",
  standard: "Standard",
  pro: "Pro",
};

// ============================================================
// SIZES AND TIMING (TWEAK ZONE)
// ============================================================
const EXPANDED_WIDTH = 260; // px. Same as the old w-65
// Icons only. Keep this = 44 (the icon buttons) + 2 x 14 (the side padding),
// otherwise the icons stop being centered in the strip.
const COLLAPSED_WIDTH = 72;
// The arrow on the edge, in px. The Uiverse snippet used 50. 36 sits better on
// the edge of the sidebar.
const ARROW_SIZE = 36;

// How long the sidebar takes to open and close, and the arrow to turn, in ms.
const ANIMATION_MS = 400;
// The speed curve. This one starts gently, speeds up, then settles softly.
// For an even speed use "linear". For a quick start and a soft landing use "ease-out".
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

// The border around the round arrow button: black and 2px thick, as asked.
// On the dark theme black is almost invisible against the dark page. To see a
// border there too, use: "border-2 border-white/25 light:border-black"
const ARROW_BORDER = "border-2 border-black";

// Distance from the bottom of the sidebar to the bottom of the account menu
// that opens beside the avatar, in px. 26 lines its bottom edge up with the
// bottom of the avatar (20px sidebar padding + 6px button padding). Raise it
// to lift the menu, lower it to push it down.
const POPOVER_BOTTOM = 26;

// ============================================================
// UPGRADE BUTTON (TWEAK ZONE)
// ============================================================
// Where the button leads. Change this to the path of your pricing page.
const UPGRADE_HREF = "/pricing";
// The purple fade. 135deg runs from the top left to the bottom right. Swap
// the three colors for any others: first = darkest, last = lightest.
const UPGRADE_GRADIENT = "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 55%, #c084fc 100%)";
// The text color at rest, and the color of the shine that sweeps over it.
// Keep the resting color a bit darker than the shine, or the shine won't show.
const UPGRADE_TEXT_COLOR = "#e4d9ff";
const UPGRADE_SHINE_COLOR = "#ffffff";
// Seconds for one sweep of the shine. Lower = faster.
const UPGRADE_SHINE_SPEED = 2;

const NAV_ITEMS: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/dashboard/cv", label: "Optimize my CV", Icon: FileText },
  { href: "/dashboard/cover-letter", label: "Optimize my Cover Letter", Icon: Mail },
];

export default function Sidebar({
  theme,
  onToggleTheme,
  collapsed,
  onToggleCollapsed,
}: SidebarProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  // The account menu of the wide sidebar (unchanged)
  const [menuOpen, setMenuOpen] = useState(false);
  // The account menu that opens beside the avatar when the sidebar is collapsed
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // The shine on the upgrade button only runs while it's hovered or focused
  const [upgradeHover, setUpgradeHover] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isLight = theme === "light";
  const tier: SubscriptionTier = session?.user?.tier ?? "free";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // The collapsed-sidebar menu closes on any click outside it, and on Escape.
  // Clicks on the avatar itself are ignored here, because the avatar toggles
  // the menu. Otherwise a click would close it and then immediately reopen it.
  useEffect(() => {
    if (!popoverOpen) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (popoverRef.current?.contains(target) || avatarRef.current?.contains(target)) return;
      setPopoverOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPopoverOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [popoverOpen]);

  // Each account menu belongs to one sidebar state, so switching state
  // closes the other one.
  useEffect(() => {
    if (collapsed) setMenuOpen(false);
    else setPopoverOpen(false);
  }, [collapsed]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const firstName = session?.user?.firstName ?? "";
  const lastName = session?.user?.lastName ?? "";
  const fullName = `${firstName} ${lastName}`.trim();
  const profilePicture = session?.user?.profilePicture;

  // Text fades out before the sidebar gets narrow, and fades back in once it
  // has opened up a bit, so it never looks squeezed.
  // TWEAK: duration-150 = how fast it disappears when closing,
  // delay-200 = how long it waits before appearing when opening.
  const fade = collapsed ? "opacity-0 duration-150" : "opacity-100 duration-200 delay-200";

  // Shared look of the rows in the account menu beside the avatar
  const popoverItem = `flex w-full cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm transition ${
    isLight
      ? "text-black/70 hover:bg-black/5 hover:text-black"
      : "text-white/70 hover:bg-white/[0.06] hover:text-white"
  }`;
  const popoverIcon = isLight ? "text-black/40" : "text-white/40";

  return (
    <>
      {/* The wrapper animates the width. The aside inside clips its content,
          so the arrow button and the account menu can sit outside of it. The
          timing is set inline, so no class or OS setting can switch it off. */}
      <div
        className="relative h-screen h-dvh shrink-0"
        style={{
          width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
          transition: `width ${ANIMATION_MS}ms ${EASE}`,
        }}
      >
        {/* SIDEBAR LIGHT COLORS (tweak here)
            bg-[#f7f7f5]       snow white, slightly warm. Cooler: #f5f7f8. Brighter: #fafafa. Darker: #f0f0ee
            border-stone-300   the line between the sidebar and the page. Stronger: stone-400 */}
        <aside
          aria-label="Sidebar"
          className={`flex h-full w-full flex-col overflow-hidden px-3.5 py-5 ${
            isLight
              ? "border-r border-stone-300 bg-[#f7f7f5]"
              : "border-r border-white/10 bg-white/[0.02]"
          }`}
        >
          {/* Logo */}
          <div
            className={`flex items-center gap-2.5 border-b py-3 ${
              isLight ? "border-black/10" : "border-white/10"
            }`}
          >
            <Link href="/dashboard/" className="shrink-0">
              <img
                src={logo.src}
                alt="Logo"
                className="h-11 w-11 cursor-pointer border border-white/10"
              />
            </Link>
            <div className={`shrink-0 whitespace-nowrap transition-opacity ${fade}`}>
              <p className={`text-sm font-semibold ${isLight ? "text-black" : "text-white"}`}>
                CV Optimizer
              </p>
              <p className={`text-xs ${isLight ? "text-black/40" : "text-white/40"}`}>
                AI Resume Optimizer
              </p>
            </div>
          </div>

          {/* Workspace section */}
          <div className="mt-8">
            <p
              className={`whitespace-nowrap px-1 text-xs font-medium uppercase tracking-widest transition-opacity ${fade} ${
                isLight ? "text-black/40" : "text-white/35"
              }`}
            >
              Workspace
            </p>

            <div className="mt-3 flex flex-col gap-2">
              {NAV_ITEMS.map(({ href, label, Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    aria-label={label}
                    // Icon-only mode has no text, so the name shows on hover
                    title={collapsed ? label : undefined}
                    // px-3.5 puts the 16px icon exactly in the middle of the
                    // 44px wide button when the sidebar is collapsed
                    className={`flex h-11 items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-xl border px-3.5 text-left text-sm font-medium transition ${
                      active
                        ? "border-violet-500/50 bg-violet-500/10 " + (isLight ? "text-black" : "text-white")
                        : isLight
                        ? "border-black/10 bg-black/[0.03] text-black/75 hover:border-violet-500/40 hover:bg-black/[0.06] hover:text-black"
                        : "border-white/10 bg-white/[0.04] text-white/85 hover:border-violet-500/40 hover:bg-white/[0.07] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-violet-400" />
                    <span className={`transition-opacity ${fade}`}>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex-1" />

          {/* Upgrade button, just above the account row.
              - Wide sidebar: "Upgrade tier" with the arrow icon on the right.
              - Collapsed: the label fades and is clipped, leaving only the icon
                in a rounded square (the icon is absolutely placed 12px from
                the right edge, which is the exact middle of the 44px square).
              - mb-5 leaves room for the avatar, which slides up 30px when the
                account menu opens, so it never touches the button.
              The gradient is the same in dark and light mode. */}
              <p aria-hidden={collapsed} className={`mb-1.5 h-4 whitespace-nowrap text-center text-[11px] leading-4 tracking-wide transition-opacity ${fade} ${lexend.className} ${
                 isLight ? "text-black/40" : "text-white/35"}`}
>
  {status === "loading" ? "" : `Current Tier: ${TIER_LABEL[tier]}`}
</p>
          <Link
            href={UPGRADE_HREF}
            aria-label="Upgrade tier"
            title={collapsed ? "Upgrade tier" : undefined}
            onMouseEnter={() => setUpgradeHover(true)}
            onMouseLeave={() => setUpgradeHover(false)}
            onFocus={() => setUpgradeHover(true)}
            onBlur={() => setUpgradeHover(false)}
            style={{ backgroundImage: UPGRADE_GRADIENT }}
            className="relative mb-2 flex h-11 w-full shrink-0 items-center overflow-hidden whitespace-nowrap rounded-xl text-white shadow-[0_6px_18px_-6px_rgba(124,58,237,0.7)] transition-[filter,box-shadow] duration-200 hover:shadow-[0_8px_22px_-6px_rgba(124,58,237,0.9)] hover:brightness-110"
          >
            <span className={`pl-4 transition-opacity ${fade}`}>
              <ShinyText
                text="Upgrade tier"
                // The shine only runs while the mouse is over the button
                disabled={!upgradeHover || collapsed}
                speed={UPGRADE_SHINE_SPEED}
                color={UPGRADE_TEXT_COLOR}
                shineColor={UPGRADE_SHINE_COLOR}
                className="text-sm font-semibold"
              />
            </span>
            <ArrowUpCircle className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2" />
          </Link>

          {/* User section */}
          <div ref={menuRef} className="relative pt-4">
            <button
              ref={avatarRef}
              type="button"
              onClick={() => {
                if (collapsed) setPopoverOpen((v) => !v);
                else setMenuOpen((v) => !v);
              }}
              aria-haspopup="menu"
              aria-expanded={collapsed ? popoverOpen : menuOpen}
              // The name shows on hover, but not while the menu is open
              title={collapsed && !popoverOpen ? fullName || "Account" : undefined}
              className={`flex w-full cursor-pointer items-center gap-2.5 overflow-hidden rounded-xl px-1 py-1.5 text-left transition-transform duration-300 ease-out ${
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

              <span className={`min-w-0 flex-1 transition-opacity ${fade}`}>
                <p className={`truncate text-sm font-medium ${isLight ? "text-black" : "text-white"}`}>
                  {status === "loading" ? "…" : fullName || "Account"}
                </p>
              </span>

              {/* The fade sits on a wrapper, so its delay doesn't also delay
                  the chevron's own turn when the menu opens */}
              <span className={`shrink-0 transition-opacity ${fade}`}>
                <ChevronUp
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isLight ? "text-black/40" : "text-white/40"
                  } ${menuOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            {menuOpen && !collapsed && (
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
                  className={`flex animate-stack-in cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-xl px-1.5 py-2 text-left text-sm opacity-100 transition ${
                    isLight ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white"
                  }`}
                >
                  <Settings className={`h-4 w-4 ${isLight ? "text-black/40" : "text-white/40"}`} />
                  Settings
                </button>

                {/* Theme toggle: deliberately does not close the menu */}
                <button
                  onClick={onToggleTheme}
                  style={{ animationDelay: "100ms" }}
                  className={`flex animate-stack-in cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-xl px-1.5 py-2 text-left text-sm opacity-100 transition ${
                    isLight ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white"
                  }`}
                >
                  {isLight ? (
                    <Moon className="h-4 w-4 text-black/40" />
                  ) : (
                    <Sun className="h-4 w-4 text-white/40" />
                  )}
                  {isLight ? "Dark mode" : "Light mode"}
                </button>

                <button
                  onClick={handleLogout}
                  style={{ animationDelay: "200ms" }}
                  className="flex animate-stack-in cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-xl px-1.5 py-2 text-left text-sm text-red-400 opacity-100 transition hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Account menu beside the avatar, for the collapsed sidebar.
            It sits next to the aside, not inside it, because the aside clips
            everything that sticks out. left-full puts it just right of the
            strip. It slides and fades in from the avatar. */}
        <AnimatePresence>
          {collapsed && popoverOpen && (
            <motion.div
              ref={popoverRef}
              role="menu"
              aria-label="Account menu"
              initial={{ opacity: 0, x: -8, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{ bottom: POPOVER_BOTTOM, transformOrigin: "left bottom" }}
              // POPUP COLORS (tweak here)
              // light: white with a gray border. dark: the same surface as the
              // other dropdown menus in the app.
              className={`absolute left-full z-30 ml-2 w-52 rounded-2xl border p-1.5 ${
                isLight
                  ? "border-stone-300 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.15)]"
                  : "border-white/10 bg-[#17131f] shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
              }`}
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setPopoverOpen(false);
                  setSettingsOpen(true);
                }}
                className={popoverItem}
              >
                <Settings className={`h-4 w-4 ${popoverIcon}`} />
                Settings
              </button>

              {/* Theme toggle: deliberately does not close the menu */}
              <button type="button" role="menuitem" onClick={onToggleTheme} className={popoverItem}>
                {isLight ? (
                  <Moon className={`h-4 w-4 ${popoverIcon}`} />
                ) : (
                  <Sun className={`h-4 w-4 ${popoverIcon}`} />
                )}
                {isLight ? "Dark mode" : "Light mode"}
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className={`flex w-full cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm transition ${
                  isLight
                    ? "text-red-600 hover:bg-red-50"
                    : "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                }`}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The arrow, centered on the sidebar's right edge at vertical middle.
            It's your Uiverse button (same hover and press behaviour) with a
            round background in the page color, so the sidebar's border line
            doesn't run through it, plus the border from ARROW_BORDER above.
            The turn is set inline on the svg and uses the same ANIMATION_MS
            and EASE as the sidebar, so the two always move together. */}
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Open menu" : "Close menu"}
          className={`absolute right-0 top-1/2 z-20 flex -translate-y-1/2 translate-x-1/2 cursor-pointer items-center justify-center rounded-full duration-200 hover:scale-125 active:scale-100 ${ARROW_BORDER} ${
            isLight ? "bg-[#ededed]" : "bg-[#0d0b14]"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={ARROW_SIZE}
            height={ARROW_SIZE}
            viewBox="0 0 24 24"
            fill="none"
            // Arrow color: blue-300 in dark mode (as in your snippet), a
            // darker blue in light mode so it stays visible
            className="stroke-blue-300 light:stroke-blue-600"
            style={{
              transform: collapsed ? "rotate(180deg)" : "none",
              transition: `transform ${ANIMATION_MS}ms ${EASE}`,
            }}
          >
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="1.5"
              d="M11 6L5 12M5 12L11 18M5 12H19"
            />
          </svg>
        </button>
      </div>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}