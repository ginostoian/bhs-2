import ReferenceExtension from "@/components/brand/ReferenceExtension";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { ServiceSchema } from "@/components/brand/Schema";
export const metadata = getSEOTags({
  title: "House Extension Company London | Design & Build | Better Homes",
  description:
    "London house extension company for rear, side return and double-storey builds. One accountable team, fixed scope, 10-year guarantee. Book a consultation.",
  canonicalUrlRelative: "/house-extension",
  openGraph: {
    title: "House Extension Company London | Design & Build | Better Homes",
    description:
      "Design-and-build house extensions across East, North and Central London. Transparent pricing, weekly updates, 5-star rated. Book your consultation.",
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
export default function Page(){return <><ServiceSchema name="House extensions in London" path="/house-extension" /><ReferenceExtension /></>;}
