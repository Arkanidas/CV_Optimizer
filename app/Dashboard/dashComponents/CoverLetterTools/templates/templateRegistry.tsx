import type { ComponentType } from "react";
import type { LetterFormat } from "../letterFormat";
import BannerTemplate from "./BannerTemplate";
import HorizonTemplete from "../templates/HorizonTemplate";
import CompassTemplete from "./CompassTemplate";
import PlainLetterTemplate from "./PlainLetterTemplate";


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
  { id: "plain", name: "Plain", swatch: "#78716c", Component: PlainLetterTemplate },
  { id: "banner", name: "Banner", swatch: "#c4a574", Component: BannerTemplate },
  { id: "horizon", name: "Horizon", swatch: "#111827", Component: HorizonTemplete },
  { id: "compass", name: "Compass", swatch: "#6d28d9", Component: CompassTemplete },
];