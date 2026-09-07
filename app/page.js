import RelatedGuides from "@/components/brand/RelatedGuides";
import ReferenceHome from "@/components/brand/ReferenceHome";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
export const metadata = getSEOTags({
  title:
    "Extensions, Loft Conversions & Full-Home Renovations in London | Better Homes",
  description:
    "London extensions, loft conversions and renovations with clear pricing. Your architect or one we recommend, with optional managed coordination.",
  canonicalUrlRelative: "/",
  openGraph: {
    title:
      "Extensions, Loft Conversions & Full-Home Renovations in London | Better Homes",
    description:
      "Managed London renovations and extensions. Your choice of architect, with optional coordination support from Better Homes.",
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
export default function Page(){ return <ReferenceHome relatedGuides={<RelatedGuides context="home" />} />; }
