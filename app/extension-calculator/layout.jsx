import { getSEOTags } from "@/libs/seo";

const pageTitle = "House Extension Cost Calculator UK | London | Better Homes";
const pageDescription =
  "Free house extension cost calculator. Get a low/expected/high budget for rear, side-return, wraparound, kitchen, double-storey, basement and loft projects with VAT, fees and contingency included.";

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
