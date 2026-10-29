import config from "@/config";
import { getSEOTags } from "@/libs/seo";

const pageTitle = "BTU Calculator UK | Free Radiator Size Calculator | Better Homes";
const pageDescription =
  "Work out the BTU and watts a room needs, how many radiators to fit and what size to buy, including sizing for heat pumps. Free UK radiator calculator.";

export const metadata = getSEOTags({
  title: pageTitle,
  description: pageDescription,
  canonicalUrlRelative: "/btu-calculator",
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `https://${config.domainName}/btu-calculator`,
  },
  keywords: ["BTU calculator", "radiator size calculator", "BTU calculator UK", "heat pump radiator size calculator"],
});

export default function CalculatorLayout({ children }) {
  return children;
}
