import RelatedGuides from "@/components/brand/RelatedGuides";
import ReferenceExtension from "@/components/brand/ReferenceExtension";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { ServiceSchema } from "@/components/brand/Schema";
export const metadata = getSEOTags({
  title: "House Extension Builders London | 10-Year Guarantee | Better Homes",
  description:
    "Rear, side-return, wraparound and double-storey extensions built across London. 12+ years, hundreds of homes, 5-star reviews and a 10-year structural guarantee.",
  canonicalUrlRelative: "/house-extension",
  openGraph: {
    title: "House Extension Builders London | 10-Year Guarantee | Better Homes",
    description:
      "London house extensions with your architect or one we recommend. Optional managed coordination, clear pricing and weekly updates.",
    url: `https://${config.domainName}/house-extension`,
  },
  keywords: [
    "house extension company London",
    "house extension builders London",
    "design and build extension London",
    "extension contractor London",
    "rear extension builders London",
  ],
});
export default function Page(){return <><ServiceSchema name="House extensions in London" path="/house-extension" /><ReferenceExtension relatedGuides={<RelatedGuides context="extension" />} /></>;}
