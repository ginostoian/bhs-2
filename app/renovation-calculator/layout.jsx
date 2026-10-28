import { getSEOTags } from "@/libs/seo";

const pageTitle = "Renovation & Refurbishment Cost Calculator UK 2026 | Better Homes";
const pageDescription =
  "Free 2026 house renovation and refurbishment cost calculator. Enter size, scope and finish to get a low, expected and high budget with VAT, fees and contingency.";

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
