import { Cloud, CloudOff, Loader2 } from "lucide-react";
import type { SaveStatus } from "./useAutosave";

export default function AutosaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  const config = {
    saving: {
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
      label: "Saving...",
      className: "text-white/50",
    },
    saved: {
      icon: <Cloud className="h-3.5 w-3.5" />,
      label: "Saved",
      className: "text-emerald-400/80",
    },
    error: {
      icon: <CloudOff className="h-3.5 w-3.5" />,
      label: "Not saved, retrying...",
      className: "text-gray-400",
    },
  }[status];

  return (
    <div
      role="status"
      aria-live="polite"
      // Positioned like the Start over button next to it: fixed, with no
      // top/left, so it keeps its place in the top row. ml-[60px] puts it
      // just right of that button. TWEAK: change 60 to move it sideways.
      className={`fixed ml-[60px] flex items-center gap-1.5 text-xs ${config.className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}