import { Check, type LucideIcon } from "lucide-react";

// The top of each container: a glossy icon tile, the title and description,
// and the green "Recommended" pill. Light: violet-50 tile and emerald-100 pill.
export function AdditionalCardHeader({
  icon: Icon,
  title,
  description,
  recommended,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  recommended?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(139,92,246,0.3),rgba(49,26,100,0.45))] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] light:border-violet-200/70 light:bg-[linear-gradient(145deg,#f5f3ff,#ede9fe)] light:shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <Icon className="h-7 w-7 text-violet-200 light:text-violet-700" strokeWidth={1.5} />
      </span>

      <div className="min-w-0 flex-1 basis-48">
        <h2 className="text-xl font-semibold text-white light:text-stone-900">{title}</h2>
        <p className="mt-0.5 text-sm text-white/60 light:text-stone-600">{description}</p>
      </div>

      {recommended && (
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 light:border-emerald-300 light:bg-emerald-100 light:text-emerald-700">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
          Recommended
        </span>
      )}
    </div>
  );
}