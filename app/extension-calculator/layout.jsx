import config from "@/config";
import { getSEOTags } from "@/libs/seo";

const pageTitle = "House Extension Cost Calculator UK 2026 | Free | Better Homes";
const pageDescription =
  "Free 2026 extension cost calculator for rear, side-return, wraparound, double-storey and basement projects. Low, expected and high budget with VAT and fees.";

export const metadata = getSEOTags({
  title: pageTitle,
  description: pageDescription,
  canonicalUrlRelative: "/extension-calculator",
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `https://${config.domainName}/extension-calculator`,
  },
  keywords: ["extension cost calculator", "house extension cost calculator", "extension cost calculator London", "rear extension cost calculator", "side return extension cost calculator"],
});

export default function CalculatorLayout({ children }) {
  return children;
}
