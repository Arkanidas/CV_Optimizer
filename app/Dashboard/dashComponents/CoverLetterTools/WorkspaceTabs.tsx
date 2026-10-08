"use client";

import { motion } from "motion/react";
import { LayoutTemplate, PencilLine, SlidersHorizontal } from "lucide-react";
import type { ReviewPane } from "./letterFormat";

interface WorkspaceTabsProps {
  active: ReviewPane;
  onChange: (pane: ReviewPane) => void;
}

const TABS: { id: ReviewPane; label: string; icon: typeof PencilLine }[] = [
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "format", label: "Format", icon: SlidersHorizontal },
  { id: "editor", label: "Editor", icon: PencilLine },
];

export default function WorkspaceTabs({ active, onChange }: WorkspaceTabsProps) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive ? "text-stone-900" : "text-white/55 hover:text-white/90"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="workspace-tab-pill"
                  className="absolute inset-0 rounded-full bg-white shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}