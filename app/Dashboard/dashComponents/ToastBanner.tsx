"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, X } from "lucide-react";

interface ToastBannerProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export default function ToastBanner({ open, title, message, onClose }: ToastBannerProps) {
  return (
    <AnimatePresence>
      {open && (
        // Outer wrapper only handles fixed positioning and centering. The
        // animated card sits inside it, so motion's transform never fights
        // a CSS centering transform.
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="pointer-events-auto flex w-full max-w-xl items-center gap-3 align-center rounded-lg border border-white/10 bg-[#17131f] px-5 py-3 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          >
            <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-500" />

            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm text-white/55">{message}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss"
              className="mt-0.5 shrink-0 cursor-pointer text-white/40 transition hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}