import { Ban, Cloud, CloudOff, Loader2 } from "lucide-react";
import type { SaveStatus } from "./useAutosave";

export default function AutosaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  const config = {
    saving: {
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
      label: "Saving...",
      className: "text-white/50 light:text-stone-500",
    },
    saved: {
      icon: <Cloud className="h-3.5 w-3.5" />,
      label: "Saved",
      className: "text-emerald-400/80 light:text-emerald-700",
    },
    error: {
      icon: <CloudOff className="h-3.5 w-3.5" />,
      label: "Not saved, retrying...",
      className: "text-amber-300 light:text-amber-700",
    },
    limit: {
      icon: <Ban className="h-3.5 w-3.5" />,
      label: "Not saved, limit reached",
      className: "text-red-400 light:text-red-600",
    },
  }[status];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-1.5 text-xs ${config.className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}