import { getSEOTags } from "@/libs/seo";

const pageTitle = "Extension Cost Calculator UK & London (2026) | Better Homes";
const pageDescription =
  "Free house extension cost calculator. Get a low/expected/high budget for single & double storey extensions — VAT, fees and contingency included. London-first pricing.";

export const metadata = getSEOTags({
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "extension cost calculator",
    "house extension cost calculator",
    "extension calculator UK",
    "house extension calculator",
    "single storey extension cost calculator",
  ],
  canonicalUrlRelative: "/extension-calculator",
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "https://bhstudio.co.uk/extension-calculator",
  },
});

export default function ExtensionCalculatorLayout({ children }) {
  return children;
}
