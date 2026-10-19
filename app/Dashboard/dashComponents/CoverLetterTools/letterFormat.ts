import type { DisplayContact } from "./contactDetails";

export type ReviewPane = "templates" | "format" | "editor";
export type DownloadFileType = "pdf" | "docx";

export interface FontOption {
  id: string;
  label: string;
  css: string;
}


const GOOGLE_FONT_OPTIONS: FontOption[] = [
  { id: "poppins", label: "Poppins", css: '"Poppins", sans-serif' },
  { id: "ubuntu", label: "Ubuntu", css: '"Ubuntu", sans-serif' },
  { id: "jost", label: "Jost", css: '"Jost", sans-serif' },
  { id: "geist", label: "Geist", css: '"Geist", sans-serif' },
  { id: "lexend", label: "Lexend", css: '"Lexend", sans-serif' },
  { id: "epilogue", label: "Epilogue", css: '"Epilogue", sans-serif' },
  { id: "coda", label: "Coda", css: '"Coda", sans-serif' },
  {
    id: "wix-madefor-text",
    label: "Wix Madefor Text",
    css: '"Wix Madefor Text", sans-serif',
  },
  { id: "rem", label: "REM", css: '"REM", sans-serif' },
  { id: "tilt-warp", label: "Tilt Warp", css: '"Tilt Warp", sans-serif' },
  {
    id: "pathway-extreme",
    label: "Pathway Extreme",
    css: '"Pathway Extreme", sans-serif',
  },
  {
    id: "convergence",
    label: "Convergence",
    css: '"Convergence", sans-serif',
  },
  {
    id: "noto-sans-yi",
    label: "Noto Sans Yi",
    css: '"Noto Sans Yi", sans-serif',
  },
  { id: "magra", label: "Magra", css: '"Magra", sans-serif' },
  {
    id: "noto-sans-brahmi",
    label: "Noto Sans Brahmi",
    css: '"Noto Sans Brahmi", sans-serif',
  },
  { id: "suse", label: "SUSE", css: '"SUSE", sans-serif' },
  {
    id: "kanchenjunga",
    label: "Kanchenjunga",
    css: '"Kanchenjunga", sans-serif',
  },
  { id: "piazzolla", label: "Piazzolla", css: '"Piazzolla", serif' },
  { id: "marmelad", label: "Marmelad", css: '"Marmelad", sans-serif' },
  { id: "inder", label: "Inder", css: '"Inder", sans-serif' },
  { id: "fira-sans", label: "Fira Sans", css: '"Fira Sans", sans-serif' },
  {
    id: "cherry-swash",
    label: "Cherry Swash",
    css: '"Cherry Swash", cursive',
  },
  { id: "inter", label: "Inter", css: '"Inter", sans-serif' },
];

const SYSTEM_FONT_OPTIONS: FontOption[] = [
  { id: "georgia", label: "Georgia", css: 'Georgia, "Times New Roman", serif' },
  {
    id: "times",
    label: "Times New Roman",
    css: '"Times New Roman", Times, serif',
  },
  {
    id: "garamond",
    label: "Garamond",
    css: 'Garamond, Palatino, "Palatino Linotype", serif',
  },
  { id: "arial", label: "Arial", css: "Arial, Helvetica, sans-serif" },
  { id: "calibri", label: "Calibri", css: 'Calibri, "Segoe UI", sans-serif' },
  { id: "helvetica", label: "Helvetica", css: "Helvetica, Arial, sans-serif" },
  {
    id: "palatino",
    label: "Palatino",
    css: 'Palatino, "Palatino Linotype", serif',
  },
];

export const BODY_FONT_OPTIONS: FontOption[] = [
  ...SYSTEM_FONT_OPTIONS,
  ...GOOGLE_FONT_OPTIONS,
];

export const DETAILS_FONT_OPTIONS: FontOption[] = [
  ...SYSTEM_FONT_OPTIONS,
  ...GOOGLE_FONT_OPTIONS,
];


export const ACCENT_COLOR_OPTIONS: string[] = [
  "#1e1b4b", // indigo-950 (default, keep first)
  "#1d4ed8", // blue-700
  "#0f766e", // teal-700
  "#166534", // green-800
  "#6d28d9", // violet-700
  "#be185d", // pink-700
  "#991b1b", // red-800
  "#9a3412", // orange-800
  "#374151", // gray-700
];

export const FONT_SIZE_MIN = 11;
export const FONT_SIZE_MAX = 16;

export const DETAILS_FONT_SIZE_MIN = 9;
export const DETAILS_FONT_SIZE_MAX = 14;


export interface FormatSettings {
  fontSize: number;
  detailsFontSize: number;
  bodyFontId: string;
  detailsFontId: string;
  fileType: DownloadFileType;
  accentColor: string;
}


export interface LetterFormat extends FormatSettings {
  contact: DisplayContact;
}

export const DEFAULT_LETTER_FORMAT: FormatSettings = {
  fontSize: 12,
  detailsFontSize: 10,
  bodyFontId: "inter",
  detailsFontId: "inter",
  fileType: "pdf",
  accentColor: ACCENT_COLOR_OPTIONS[0],
};

export function fontCss(options: FontOption[], id: string): string {
  return options.find((font) => font.id === id)?.css ?? options[0].css;
}