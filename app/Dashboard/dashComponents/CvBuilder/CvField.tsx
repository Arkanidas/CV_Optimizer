import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { INPUT_BASE, INPUT_ERROR, INPUT_OK, LABEL } from "./cvBuilderTheme";

interface CvFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  optional?: boolean;
  type?: "text" | "email" | "tel" | "url";
  placeholder?: string;
  icon?: LucideIcon;
  error?: string;
  maxLength?: number;
  autoComplete?: string;
  rightSlot?: ReactNode;
  className?: string;
}

export default function CvField({
  id,
  label,
  value,
  onChange,
  required,
  optional,
  type = "text",
  placeholder,
  icon: Icon,
  error,
  maxLength,
  autoComplete,
  rightSlot,
  className = "",
}: CvFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={`mb-2 block ${LABEL}`}>
        {label}
        {required && <span className="ml-1 text-violet-500 light:text-violet-600">*</span>}
        {optional && (
          <span className="ml-1 font-normal text-white/50 light:text-stone-500">(optional)</span>
        )}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45 light:text-stone-400" />
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${INPUT_BASE} ${Icon ? "pl-11" : "pl-4"} ${rightSlot ? "pr-28" : "pr-4"} ${
            error ? INPUT_ERROR : INPUT_OK
          }`}
        />
        {rightSlot && <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</div>}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400 light:text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}