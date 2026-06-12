import { getSEOTags } from "@/libs/seo";

const pageTitle = "Home Renovation Cost Calculator UK & London (2026) | Better Homes";
const pageDescription =
  "Free home renovation cost calculator. Get a low/expected/high budget for a full or partial refurbishment — fees, contingency and VAT included. London-first pricing.";

export const metadata = getSEOTags({
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "home renovation cost calculator",
    "renovation cost calculator",
    "house renovation cost calculator",
    "renovation calculator UK",
    "full house renovation cost calculator",
    "refurbishment cost calculator",
  ],
  canonicalUrlRelative: "/renovation-calculator",
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "https://bhstudio.co.uk/renovation-calculator",
  },
});

export default function RenovationCalculatorLayout({ children }) {
  return children;
}
