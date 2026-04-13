import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "BTU Calculator | Room Heating Estimator | Better Homes",
  description:
    "Calculate radiator BTU requirements for your room using dimensions, insulation level, and heating type with our free BTU calculator.",
  canonicalUrlRelative: "/btu-calculator",
  openGraph: {
    title: "BTU Calculator | Better Homes",
    description:
      "Free BTU calculator to estimate room heating requirements by size and insulation level.",
    url: "https://bhstudio.co.uk/btu-calculator",
  },
  keywords: [
    "BTU calculator",
    "radiator BTU calculator",
    "room heating calculator",
  ],
});

export default function BTUCalculatorLayout({ children }) {
  return children;
}
