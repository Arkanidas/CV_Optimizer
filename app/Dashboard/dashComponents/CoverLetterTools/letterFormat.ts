export type ReviewPane = "templates" | "format" | "editor";
export type DownloadFileType = "pdf" | "docx";

export interface FontOption {
  id: string;
  label: string;
  css: string;
}

export const BODY_FONT_OPTIONS: FontOption[] = [
  { id: "georgia", label: "Georgia", css: 'Georgia, "Times New Roman", serif' },
  { id: "times", label: "Times New Roman", css: '"Times New Roman", Times, serif' },
  { id: "garamond", label: "Garamond", css: 'Garamond, Palatino, "Palatino Linotype", serif' },
  { id: "arial", label: "Arial", css: "Arial, Helvetica, sans-serif" },
  { id: "calibri", label: "Calibri", css: 'Calibri, "Segoe UI", sans-serif' },
];

export const DETAILS_FONT_OPTIONS: FontOption[] = [
  { id: "georgia", label: "Georgia", css: 'Georgia, "Times New Roman", serif' },
  { id: "times", label: "Times New Roman", css: '"Times New Roman", Times, serif' },
  { id: "arial", label: "Arial", css: "Arial, Helvetica, sans-serif" },
  { id: "helvetica", label: "Helvetica", css: 'Helvetica, Arial, sans-serif' },
  { id: "palatino", label: "Palatino", css: 'Palatino, "Palatino Linotype", serif' },
];

export const ACCENT_COLOR_OPTIONS: string[] = [
  "#1e1b4b", // indigo-950
  "#6d28d9", // violet-700
  "#0f766e", // teal-700
  "#9a3412", // orange-800
  "#374151", // gray-700
  "#991b1b", // red-800
];

export const FONT_SIZE_MIN = 11;
export const FONT_SIZE_MAX = 16;

export const DETAILS_FONT_SIZE_MIN = 9;
export const DETAILS_FONT_SIZE_MAX = 14;

export interface LetterFormat {
  fontSize: number;
  detailsFontSize: number;
  bodyFontId: string;
  detailsFontId: string;
  fileType: DownloadFileType;
  accentColor: string;
}

export const DEFAULT_LETTER_FORMAT: LetterFormat = {
  fontSize: 12,
  detailsFontSize: 10,
  bodyFontId: "georgia",
  detailsFontId: "georgia",
  fileType: "pdf",
  accentColor: ACCENT_COLOR_OPTIONS[0],
};

export function fontCss(options: FontOption[], id: string): string {
  return options.find((font) => font.id === id)?.css ?? options[0].css;
}