
import {
  Poppins,
  Ubuntu,
  Jost,
  Geist,
  Lexend,
  Epilogue,
  Coda,
  Wix_Madefor_Text,
  REM,
  Tilt_Warp,
  Pathway_Extreme,
  Convergence,
  Magra,
  SUSE,
  Piazzolla,
  Marmelad,
  Inder,
  Fira_Sans,
  Cherry_Swash,
  Inter,
} from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

export const ubuntu = Ubuntu({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ubuntu",
   weight: ["400", "500"],
});

export const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});

export const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
});

export const epilogue = Epilogue({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-epilogue",
});

export const coda = Coda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-coda",
   weight: ["400"],
});

export const wixMadeforText = Wix_Madefor_Text({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-wix-madefor-text",
});

export const rem = REM({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rem",
});

export const tiltWarp = Tilt_Warp({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-tilt-warp",
});

export const pathwayExtreme = Pathway_Extreme({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pathway-extreme",
});

export const convergence = Convergence({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-convergence",
  weight: ["400"],
});

export const magra = Magra({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-magra",
   weight: ["400", "700"],
});

export const suse = SUSE({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-suse",
});

export const piazzolla = Piazzolla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-piazzolla",
});

export const marmelad = Marmelad({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-marmelad",
   weight: ["400"],
});

export const inder = Inder({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inder",
   weight: ["400"],
});

export const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-fira-sans",
});

export const cherrySwash = Cherry_Swash({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-cherry-swash",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const fontVariables = [
  poppins.variable,
  ubuntu.variable,
  jost.variable,
  geist.variable,
  lexend.variable,
  epilogue.variable,
  coda.variable,
  wixMadeforText.variable,
  rem.variable,
  tiltWarp.variable,
  pathwayExtreme.variable,
  convergence.variable,
  magra.variable,
  suse.variable,
  piazzolla.variable,
  marmelad.variable,
  inder.variable,
  firaSans.variable,
  cherrySwash.variable,
  inter.variable,
].join(" ");
