import { getSEOTags } from "@/libs/seo";

export const metadata = {
  ...getSEOTags(),
  title: "Home Renovation Cost Calculator | Better Homes",
  description:
    "Get an accurate estimate for your home renovation project. Our calculator takes into account your property type, location, and specific renovation requirements.",
  keywords:
    "home renovation calculator, renovation cost estimate, house renovation, property renovation, London renovation",
  alternates: {
    canonical: "/renovation-calculator",
  },
  openGraph: {
    title: "Home Renovation Cost Calculator | Better Homes",
    description:
      "Free home renovation cost calculator for London homeowners planning full or partial refurbishments.",
    url: "https://bhstudio.co.uk/renovation-calculator",
  },
};

export default function RenovationCalculatorLayout({ children }) {
  return children;
}
