import RelatedGuides from "@/components/brand/RelatedGuides";
import ReferenceExtension from "@/components/brand/ReferenceExtension";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { ServiceSchema } from "@/components/brand/Schema";
export const metadata = getSEOTags({
  title: "House Extension Company London | Design & Build | Better Homes",
  description:
    "London house extension company for rear, side return and double-storey builds. Your architect or ours, optional coordination support and a 10-year workmanship guarantee.",
  canonicalUrlRelative: "/house-extension",
  openGraph: {
    title: "House Extension Company London | Design & Build | Better Homes",
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
