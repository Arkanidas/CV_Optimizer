import type { ComponentType } from "react";
import type { ParsedLetter } from "../letterParser";
import type { LetterFormat } from "../letterFormat";
import ClassicTemplate from "../templates/ClassicTemplate";
import AccentHeaderTemplate from "../templates/AccentHeaderTemplate";
import SidebarAccentTemplate from "../templates/SidebarAccentTemplate";

export interface TemplateDefinition {
  id: string;
  name: string;
  swatch: string; // hex shown as a little color dot in the gallery
  Component: ComponentType<{ parsed: ParsedLetter; format: LetterFormat }>;
}

export const LETTER_TEMPLATES: TemplateDefinition[] = [
  { id: "classic", name: "Classic", swatch: "#111827", Component: ClassicTemplate },
  { id: "accent-header", name: "Accent Header", swatch: "#6d28d9", Component: AccentHeaderTemplate },
  { id: "sidebar", name: "Sidebar Accent", swatch: "#0f766e", Component: SidebarAccentTemplate },
  // Clone one of the templates above, tweak its layout/colors, and add
  // a new entry here to add template #4 through #9 — nothing else in
  // the app needs to change.
];