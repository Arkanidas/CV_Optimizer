import type { ComponentType } from "react";
import type { LetterFormat } from "../letterFormat";
import BannerTemplate from "../BannerTemplate";
import ClassicTemplate from "../templates/ClassicTemplate";
import AccentHeaderTemplate from "../templates/AccentHeaderTemplate";
import SidebarAccentTemplate from "../templates/SidebarAccentTemplate";

export interface TemplateComponentProps {
  letter: string;
  format: LetterFormat;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  swatch: string;
  Component: ComponentType<TemplateComponentProps>;
}

export const LETTER_TEMPLATES: TemplateDefinition[] = [
  { id: "banner", name: "Banner", swatch: "#c4a574", Component: BannerTemplate },
  { id: "classic", name: "Classic", swatch: "#111827", Component: ClassicTemplate },
  { id: "accent-header", name: "Accent Header", swatch: "#6d28d9", Component: AccentHeaderTemplate },
  { id: "sidebar", name: "Sidebar Accent", swatch: "#0f766e", Component: SidebarAccentTemplate },
];