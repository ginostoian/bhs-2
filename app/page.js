import RelatedGuides from "@/components/brand/RelatedGuides";
import ReferenceHome from "@/components/brand/ReferenceHome";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
export const metadata = getSEOTags({
  title: "Builders in London | Extensions, Lofts & Renovations | Better Homes",
  description:
    "London builders for house extensions, loft conversions and full renovations. 12+ years, hundreds of homes completed, 5-star reviews and up to a 10-year guarantee.",
  canonicalUrlRelative: "/",
  openGraph: {
    title: "Builders in London | Extensions, Lofts & Renovations | Better Homes",
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
