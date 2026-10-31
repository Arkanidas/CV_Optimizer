"use client";

import { AnimatePresence, motion } from "motion/react";
import { Ban, CheckCircle2, X } from "lucide-react";

type ToastVariant = "success" | "danger";

interface ToastBannerProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  variant?: ToastVariant;
}

const VARIANTS: Record<
  ToastVariant,
  { card: string; icon: React.ReactNode; title: string; message: string; close: string }
> = {
  success: {
    card: "border-white/10 bg-[#17131f] light:border-black/10 light:bg-white",
    icon: <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />,
    title: "text-white light:text-stone-900",
    message: "text-white/55 light:text-stone-600",
    close: "text-white/40 hover:text-white light:text-stone-500 light:hover:text-stone-900",
  },
  danger: {
    card: "border-red-500/50 bg-red-950/90 light:border-red-300 light:bg-red-50",
    icon: <Ban className="mt-0.5 h-5 w-5 shrink-0 text-red-400 light:text-red-600" />,
    title: "text-red-100 light:text-red-900",
    message: "text-red-200/70 light:text-red-700",
    close: "text-red-200/60 hover:text-red-100 light:text-red-700/70 light:hover:text-red-900",
  },
};

export default function ToastBanner({
  open,
  title,
  message,
  onClose,
  variant = "success",
}: ToastBannerProps) {
  const style = VARIANTS[variant];

  return (
    <AnimatePresence>
      {open && (
        // Outer wrapper only handles fixed positioning and centering. The
        // animated card sits inside it, so motion's transform never fights
        // a CSS centering transform.
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
          <motion.div
            role={variant === "danger" ? "alert" : "status"}
            aria-live={variant === "danger" ? "assertive" : "polite"}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className={`pointer-events-auto flex w-full max-w-xl items-start gap-3 rounded-xl border px-5 py-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)] ${style.card}`}
          >
            {style.icon}

            <div className="min-w-0 flex-1">
              <p className={`text-base font-semibold ${style.title}`}>{title}</p>
              <p className={`mt-1 text-sm ${style.message}`}>{message}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss"
              className={`mt-0.5 shrink-0 cursor-pointer transition ${style.close}`}
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}