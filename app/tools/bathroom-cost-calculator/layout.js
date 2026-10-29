import config from "@/config";
import { getSEOTags } from "@/libs/seo";

const pageTitle = "Bathroom Cost Calculator UK 2026 | Renovation Estimator | Better Homes";
const pageDescription =
  "Free 2026 bathroom renovation cost estimator. Choose room, size, layout, tiling and products to see a realistic all-in price range for London and the UK.";

export const metadata = getSEOTags({
  title: pageTitle,
  description: pageDescription,
  canonicalUrlRelative: "/tools/bathroom-cost-calculator",
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `https://${config.domainName}/tools/bathroom-cost-calculator`,
  },
  keywords: ["bathroom cost calculator", "bathroom renovation cost estimator", "bathroom renovation calculator", "bathroom cost calculator London"],
});

export default function CalculatorLayout({ children }) {
  return children;
}
