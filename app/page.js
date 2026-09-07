import ReferenceHome from "@/components/brand/ReferenceHome";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
export const metadata = getSEOTags({
  title:
    "Extensions, Loft Conversions & Full-Home Renovations in London | Better Homes",
  description:
    "Design and build specialists for London home renovations, extensions, kitchens, bathrooms, and loft conversions with transparent pricing and weekly updates.",
  canonicalUrlRelative: "/",
  openGraph: {
    title:
      "Extensions, Loft Conversions & Full-Home Renovations in London | Better Homes",
    description:
      "Design and build specialists for London home renovations, extensions, kitchens, bathrooms, and loft conversions.",
    url: `https://${config.domainName}/`,
  },
  keywords: [
    "home renovation London",
    "house extensions London",
    "kitchen renovation London",
    "bathroom renovation London",
    "loft conversion London",
  ],
});
export default function Page(){ return <ReferenceHome />; }
