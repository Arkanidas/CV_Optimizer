"use client";

import { useId } from "react";
import FontSelect from "./FontSelect";
import FontSizeSlider from "./FontSizeSlider";
import {
  BODY_FONT_OPTIONS,
  DETAILS_FONT_OPTIONS,
  DETAILS_FONT_SIZE_MAX,
  DETAILS_FONT_SIZE_MIN,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type DownloadFileType,
  type FormatSettings,
} from "./letterFormat";
import type { ContactDetails } from "@/lib/AI/schemas";

interface FormatPanelProps {
  format: FormatSettings;
  onChange: (format: FormatSettings) => void;
  contact: ContactDetails;
  onContactChange: (contact: ContactDetails) => void;
  contactLoading?: boolean;
}

const FILE_TYPES: { id: DownloadFileType; label: string }[] = [
  { id: "pdf", label: "PDF" },
  { id: "docx", label: "DOCX" },
];

interface DetailFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  type?: "text" | "email" | "tel";
  disabled?: boolean;
}

function DetailField({ label, value, onChange, maxLength, type = "text", disabled }: DetailFieldProps) {
  const id = useId();

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-white/70">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={`Add ${label.toLowerCase()}`}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-white/90 transition placeholder:text-white/25 focus:border-violet-400/50 focus:outline-none focus:ring-1 focus:ring-violet-400/30 disabled:cursor-wait disabled:opacity-50"
      />
    </div>
  );
}

export default function FormatPanel({
  format,
  onChange,
  contact,
  onContactChange,
  contactLoading = false,
}: FormatPanelProps) {
  function update(patch: Partial<FormatSettings>) {
    onChange({ ...format, ...patch });
  }

  function updateContact(patch: Partial<ContactDetails>) {
    onContactChange({ ...contact, ...patch });
  }

  return (
    <div className="flex max-h-[calc(100vh-9rem)] flex-col gap-6 overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.03] p-5 [scrollbar-color:rgba(255,255,255,0.2)_transparent] [scrollbar-width:thin]">
      <section className="flex flex-col gap-5">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-widest text-violet-300">Text</h3>
          <hr className="mt-2 border-white/10" />
        </div>

        <FontSizeSlider
          label="Body font size"
          value={format.fontSize}
          min={FONT_SIZE_MIN}
          max={FONT_SIZE_MAX}
          onChange={(value) => update({ fontSize: value })}
        />

        <FontSizeSlider
          label="Personal details font size"
          value={format.detailsFontSize}
          min={DETAILS_FONT_SIZE_MIN}
          max={DETAILS_FONT_SIZE_MAX}
          onChange={(value) => update({ detailsFontSize: value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <FontSelect
            label="Main text font"
            options={BODY_FONT_OPTIONS}
            value={format.bodyFontId}
            onChange={(id) => update({ bodyFontId: id })}
          />
          <FontSelect
            label="Personal details font"
            options={DETAILS_FONT_OPTIONS}
            value={format.detailsFontId}
            onChange={(id) => update({ detailsFontId: id })}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-widest text-violet-300">
            Personal details
          </h3>
          <hr className="mt-2 border-white/10" />
          {contactLoading && (
            <p className="mt-2 text-xs text-white/40">Reading your details from your CV...</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DetailField
            label="First name"
            value={contact.firstName}
            maxLength={40}
            disabled={contactLoading}
            onChange={(value) => updateContact({ firstName: value })}
          />
          <DetailField
            label="Last name"
            value={contact.lastName}
            maxLength={40}
            disabled={contactLoading}
            onChange={(value) => updateContact({ lastName: value })}
          />
          <DetailField
            label="Email"
            type="email"
            value={contact.email}
            maxLength={80}
            disabled={contactLoading}
            onChange={(value) => updateContact({ email: value })}
          />
          <DetailField
            label="Phone"
            type="tel"
            value={contact.phone}
            maxLength={25}
            disabled={contactLoading}
            onChange={(value) => updateContact({ phone: value })}
          />
          <div className="col-span-2">
            <DetailField
              label="Location"
              value={contact.location}
              maxLength={60}
              disabled={contactLoading}
              onChange={(value) => updateContact({ location: value })}
            />
          </div>
        </div>
      </section>

      <hr className="border-white/10" />

      <section className="flex flex-col gap-2">
        <h4 className="text-sm font-medium text-white">File type</h4>
        <p className="text-xs text-white/40">
          Download will use this format. Nothing is exported yet.
        </p>
        <div className="mt-1 grid grid-cols-2 gap-3">
          {FILE_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => update({ fileType: type.id })}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                format.fileType === type.id
                  ? "border-violet-400/60 bg-violet-500/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white/90"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}