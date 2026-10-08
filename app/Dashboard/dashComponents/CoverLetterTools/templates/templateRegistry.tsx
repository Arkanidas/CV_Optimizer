import type { ComponentType } from "react";
import type { LetterFormat } from "../letterFormat";
import BannerTemplate from "./BannerTemplate";
import HorizonTemplete from "../templates/HorizonTemplate";
import CompassTemplete from "./CompassTemplate";
import PlainLetterTemplate from "./PlainLetterTemplate";
import BubbleHeaderTemplate from "./Bubbles";
import MonogramTemplate from "./Monogram";
import UnderlineTemplate from "./Underline";
import DiagonalRibbonTemplate from "./Ribbon";
import DottedGridTemplate from "./DottedGrid";

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
  { id: "bubbles", name: "Bubbles", swatch: "#2563eb", Component: BubbleHeaderTemplate },
  { id: "monogram", name: "Monogram", swatch: "#b45309", Component: MonogramTemplate },
  { id: "underline", name: "Underline", swatch: "#dc2626", Component: UnderlineTemplate },
  { id: "ribbon", name: "Ribbon", swatch: "#7c3aed", Component: DiagonalRibbonTemplate },
  { id: "dotted-grid", name: "Dotted Grid", swatch: "#0891b2", Component: DottedGridTemplate },
];