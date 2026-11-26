"use client";

import type { ReactNode } from "react";
import { Undo2, type LucideIcon } from "lucide-react";
import { AdditionalCardHeader } from "./AdditionalParts";
import { CARD } from "./cvBuilderTheme";

// Where the Edit button sits in the bottom row of each container:
// justify-end = on the right, justify-start = on the left
const EDIT_ALIGN = "justify-end";

interface ReviewSectionProps {
  icon: LucideIcon;
  title: string;
  // The summary line under the title, for example "2 positions"
  description: string;
  // Shown in an amber box when required information is missing
  warning?: string;
  onEdit: () => void;
  children: ReactNode;
}

export default function ReviewSection({
  icon,
  title,
  description,
  warning,
  onEdit,
  children,
}: ReviewSectionProps) {
  return (
    <section className={`rounded-3xl border p-6 sm:p-7 ${CARD}`}>
      <AdditionalCardHeader icon={icon} title={title} description={description} />

      {/* Light: amber-50 with amber-800 text */}
      {warning && (
        <p
          role="status"
          className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200 light:border-amber-300 light:bg-amber-50 light:text-amber-800"
        >
          {warning}
        </p>
      )}

      <div className="mt-6">{children}</div>

      {/* THE EDIT BUTTON. A hover: class beats a light: class, so the hover has
          its own light: version. Light: violet-50 with violet-800 text. */}
      <div
        className={`mt-6 flex border-t border-white/10 pt-5 light:border-stone-300 ${EDIT_ALIGN}`}
      >
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-violet-400/40 bg-violet-500/10 px-5 py-2.5 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 light:border-violet-300 light:bg-violet-50 light:text-violet-800 light:hover:bg-violet-100 light:hover:text-violet-900"
        >
          <Undo2 className="h-4 w-4" />
          Edit
        </button>
      </div>
    </section>
  );
}