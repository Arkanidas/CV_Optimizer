
import {
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Merriweather,
  Montserrat,
  Poppins,
  Playfair_Display,
  Source_Sans_3,
  DM_Sans,
} from "next/font/google";

// 1. Initialize each font at module scope.
const inter = Inter({ subsets: ["latin"], display: "swap" });

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

// 2. Reference the initialized fonts in the testing array.
export const testFonts = [
  { id: "inter", label: "Inter", font: inter },
  { id: "roboto", label: "Roboto", font: roboto },
  { id: "open-sans", label: "Open Sans", font: openSans },
  { id: "lato", label: "Lato", font: lato },
  { id: "merriweather", label: "Merriweather", font: merriweather },
  { id: "montserrat", label: "Montserrat", font: montserrat },
  { id: "poppins", label: "Poppins", font: poppins },
  {
    id: "playfair-display",
    label: "Playfair Display",
    font: playfairDisplay,
  },
  { id: "source-sans-3", label: "Source Sans 3", font: sourceSans3 },
  { id: "dm-sans", label: "DM Sans", font: dmSans },
];
