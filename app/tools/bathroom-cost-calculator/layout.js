import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Bathroom Renovation Cost Calculator | Better Homes Studio",
  description:
    "Estimate bathroom renovation costs in London with our free calculator including layout changes, tiling levels, fixtures and underfloor heating.",
  canonicalUrlRelative: "/tools/bathroom-cost-calculator",
  openGraph: {
    title: "Bathroom Renovation Cost Calculator | Better Homes Studio",
    description:
      "Free bathroom cost calculator for London homeowners planning a bathroom refurbishment.",
    url: "https://bhstudio.co.uk/tools/bathroom-cost-calculator",
  },
  keywords: [
    "bathroom renovation calculator",
    "bathroom cost calculator London",
    "bathroom refurbishment estimate",
  ],
});

export default function BathroomCostCalculatorLayout({ children }) {
  return children;
}
