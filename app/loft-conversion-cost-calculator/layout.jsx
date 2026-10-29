import config from "@/config";
import { getSEOTags } from "@/libs/seo";

const pageTitle = "Loft Conversion Cost Calculator UK 2026 | Free | Better Homes";
const pageDescription =
  "Free 2026 loft conversion cost calculator for Velux, dormer, L-shaped, hip-to-gable and mansard lofts. London and UK prices with fees, VAT and build time.";

export const metadata = getSEOTags({
  title: pageTitle,
  description: pageDescription,
  canonicalUrlRelative: "/loft-conversion-cost-calculator",
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `https://${config.domainName}/loft-conversion-cost-calculator`,
  },
  keywords: ["loft conversion cost calculator", "loft conversion calculator", "loft conversion cost calculator London", "dormer loft conversion cost calculator"],
});

export default function CalculatorLayout({ children }) {
  return children;
}
