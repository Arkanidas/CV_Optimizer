import type { LucideIcon } from "lucide-react";
import { INPUT_BASE, INPUT_ERROR, INPUT_OK, LABEL } from "./cvBuilderTheme";

interface CvTextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
  icon?: LucideIcon;
  placeholder?: string;
  maxLength: number;
  rows?: number;
  error?: string;
}

export default function CvTextArea({
  id,
  label,
  value,
  onChange,
  optional,
  icon: Icon,
  placeholder,
  maxLength,
  rows = 4,
  error,
}: CvTextAreaProps) {
  return (
    <div>
      <label htmlFor={id} className={`mb-2 block ${LABEL}`}>
        {label}
        {optional && (
          <span className="ml-1 font-normal text-white/50 light:text-stone-500">(optional)</span>
        )}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-white/45 light:text-stone-400" />
        )}
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={`${INPUT_BASE} resize-none pr-4 ${Icon ? "pl-11" : "pl-4"} ${
            error ? INPUT_ERROR : INPUT_OK
          }`}
        />
      </div>

      <div className="mt-1.5 flex justify-between gap-3 text-xs">
        <span className="text-red-400 light:text-red-600">{error}</span>
        <span className="text-white/45 light:text-stone-500">
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  );
}