import { getSEOTags } from "@/libs/seo";

const pageTitle = "House Extension Cost Calculator UK 2026 | Free | Better Homes";
const pageDescription =
  "Free 2026 extension cost calculator for rear, side-return, wraparound, double-storey, loft and basement projects. Low, expected and high budget with VAT and fees.";

export const metadata = getSEOTags({
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "extension cost calculator",
    "house extension cost calculator",
    "extension calculator UK",
    "house extension calculator",
    "single storey extension cost calculator",
    "side return extension cost calculator",
    "wraparound extension cost calculator",
    "kitchen extension cost calculator",
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
