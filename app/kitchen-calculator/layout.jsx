import config from "@/config";
import { getSEOTags } from "@/libs/seo";

const pageTitle = "Kitchen Renovation Cost Calculator UK 2026 | Free | Better Homes";
const pageDescription =
  "Estimate your fitted kitchen cost for 2026: units, worktops, appliances, plumbing, electrics and installation. Free London and UK calculator with a price range.";

export const metadata = getSEOTags({
  title: pageTitle,
  description: pageDescription,
  canonicalUrlRelative: "/kitchen-calculator",
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `https://${config.domainName}/kitchen-calculator`,
  },
  keywords: ["kitchen cost calculator", "kitchen renovation calculator", "kitchen cost calculator London", "new kitchen cost calculator"],
});

export default function CalculatorLayout({ children }) {
  return children;
}
