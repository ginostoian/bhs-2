import { getSEOTags } from "@/libs/seo";

export const metadata = {
  ...getSEOTags(),
  title: "Extension Cost Calculator | Better Homes Studio",
  description:
    "Calculate the cost of your house extension with our free online calculator. Get accurate estimates for single storey, double storey, and basement extensions.",
  keywords:
    "extension cost calculator, house extension cost, single storey extension, double storey extension, basement extension, London extensions",
};

export default function ExtensionCalculatorLayout({ children }) {
  return children;
}
