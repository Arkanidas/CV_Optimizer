import { AlertCircle, Check, Loader2 } from "lucide-react";
import type { SaveStatus } from "./useAutosave";

export default function AutosaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  const config = {
    saving: {
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
      label: "Saving...",
      className: "text-white/40",
    },
    saved: {
      icon: <Check className="h-3.5 w-3.5" />,
      label: "Saved",
      className: "text-emerald-400/80",
    },
    error: {
      icon: <AlertCircle className="h-3.5 w-3.5" />,
      label: "Not saved, retrying...",
      className: "text-amber-300",
    },
  }[status];

  return (
    <div
      role="status"
      aria-live="polite"
      title={config.label}
      className={`absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-xs ${config.className}`}
    >
      {config.icon}
      <span className="hidden xl:inline">{config.label}</span>
    </div>
  );
}