"use client";

import { useId, useState } from "react";
import { UserPlus } from "lucide-react";

interface PhotoUploadProps {
  value: string;
  onChange: (dataUrl: string) => void;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024;
// The longest side of the saved photo, in px. Enough for a CV, and small
// enough to keep in the browser session.
const MAX_SIDE = 400;

// Shrinks the photo and turns it into a small JPEG. A big photo would not fit
// in the session storage.
async function toSmallDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported");

  // White behind the picture, since a JPEG can't be see-through
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", 0.85);
}

export default function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const inputId = useId();
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("The image is larger than 5 MB.");
      return;
    }

    try {
      onChange(await toSmallDataUrl(file));
    } catch {
      setError("Couldn't read that image. Try a JPG or PNG.");
    }
  }

  // PHOTO BOX COLORS. Light: violet-50 with a violet-200 dashed border.
  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-center light:border-violet-200 light:bg-violet-50/70">
      {value ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Your profile photo"
            className="h-28 w-28 rounded-full border-2 border-violet-400/60 object-cover light:border-violet-500"
          />
          <div className="flex items-center gap-4 text-sm font-medium">
            <label
              htmlFor={inputId}
              className="cursor-pointer text-violet-300 transition hover:text-violet-200 light:text-violet-700 light:hover:text-violet-900"
            >
              Change
            </label>
            <button
              type="button"
              onClick={() => onChange("")}
              className="cursor-pointer text-white/60 transition hover:text-white light:text-stone-600 light:hover:text-stone-900"
            >
              Remove
            </button>
          </div>
        </>
      ) : (
        <label
          htmlFor={inputId}
          className="flex cursor-pointer flex-col items-center gap-3 rounded-xl p-2 transition hover:opacity-90 focus-within:ring-2 focus-within:ring-violet-400"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/15 light:bg-violet-100">
            <UserPlus className="h-8 w-8 text-violet-300 light:text-violet-700" strokeWidth={1.5} />
          </span>
          <span className="text-base font-semibold text-white light:text-stone-900">
            Add a profile photo
          </span>
          <span className="-mt-2 text-sm text-white/60 light:text-stone-600">(Optional)</span>
          <span className="text-xs leading-relaxed text-white/50 light:text-stone-500">
            A professional photo can help create a stronger CV.
          </span>
        </label>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          // Lets the same file be chosen again after Remove
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-red-400 light:text-red-600">{error}</p>}
    </div>
  );
}