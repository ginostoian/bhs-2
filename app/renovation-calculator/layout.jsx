import config from "@/config";
import { getSEOTags } from "@/libs/seo";

const pageTitle = "Renovation & Refurbishment Cost Calculator UK 2026 | Better Homes";
const pageDescription =
  "Free 2026 house renovation and refurbishment cost calculator. Enter size, scope and finish to get a low, expected and high budget with VAT, fees and contingency.";

export const metadata = getSEOTags({
  title: pageTitle,
  description: pageDescription,
  canonicalUrlRelative: "/renovation-calculator",
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `https://${config.domainName}/renovation-calculator`,
  },
  keywords: ["renovation cost calculator", "refurbishment cost calculator", "house refurbishment cost calculator", "home renovation cost calculator London"],
});

export default function CalculatorLayout({ children }) {
  return children;
}
