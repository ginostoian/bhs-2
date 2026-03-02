import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Kitchen Renovation Cost Calculator | Better Homes Studio",
  description:
    "Estimate kitchen renovation costs in London with our free calculator covering size, materials, electrical and plumbing requirements.",
  canonicalUrlRelative: "/kitchen-calculator",
  openGraph: {
    title: "Kitchen Renovation Cost Calculator | Better Homes Studio",
    description:
      "Free kitchen renovation calculator for London homeowners planning practical, high-quality kitchen upgrades.",
    url: "https://bhstudio.co.uk/kitchen-calculator",
  },
  keywords: [
    "kitchen renovation calculator",
    "kitchen cost calculator London",
    "kitchen refurbishment cost",
  ],
});

export default function KitchenCalculatorLayout({ children }) {
  return children;
}
