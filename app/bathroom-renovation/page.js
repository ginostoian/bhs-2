import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { getPageFaqs } from "@/libs/pageFaqs";
import ServicePage from "@/components/brand/ServicePage";
export const metadata = getSEOTags({
  title: "Bathroom Renovation & Fitters London | Better Homes",
  description:
    "Bathroom, en-suite and wet room renovations in London, fully waterproofed, tiled and installed by one team. Clear costs, 5-star reviews and a 2-year guarantee.",
  canonicalUrlRelative: "/bathroom-renovation",
  openGraph: {
    title: "Bathroom Renovation & Fitters London | Better Homes",
    description:
      "Design, supply and installation for high-quality bathroom renovations across London with real project proof and practical cost guidance.",
    url: `https://${config.domainName}/bathroom-renovation`,
  },
  keywords: [
    "bathroom renovation London",
    "bathroom fitting London",
    "bathroom design and install London",
    "bathroom refurbishment London",
  ],
});
const inclusionItems = [
  {
    title: "Strip-out and preparation",
    body:
      "Removing the old bathroom cleanly and preparing the room properly so the new installation is built on the right base rather than hidden compromise.",
  },
  {
    title: "Waterproofing and substrate work",
    body:
      "The moisture-critical prep that protects the bathroom long after the tiles and fittings go in.",
  },
  {
    title: "Plumbing and first-fix electrics",
    body:
      "Setting up the services correctly for the new layout, fixtures, lighting and extraction before the visible finishes are installed.",
  },
  {
    title: "Tiling and surface finishing",
    body:
      "The part everyone sees, but only after the underlying prep work is correct. This is where quality craftsmanship really shows.",
  },
  {
    title: "Sanitaryware and second-fix installation",
    body:
      "Fitting baths, showers, basins, brassware, WCs, towel rails and the details that shape how the room feels to use day to day.",
  },
  {
    title: "Decoration, snagging and final handover",
    body:
      "The closeout stage that makes the bathroom feel complete, precise and safe to live with rather than hurriedly finished.",
  },
];
const costTiers = [
  {
    title: "Same layout, your suite and tiles",
    price: "£7,500 to £9,000 + VAT",
    timeline: "About 2 weeks",
    description:
      "Strip-out, new pipework, waterproofing, full-height tiling round the bath or shower, fitting and decoration. Finsbury Park: £7,700 + VAT in 2 weeks.",
  },
  {
    title: "New layout, or two bathrooms at once",
    price: "£8,000 to £21,000 + VAT",
    timeline: "3 to 4 weeks",
    description:
      "Moving the toilet, shower or bath means new waste runs and more plumbing. A new layout in Walthamstow came to about £8,000; two bathrooms in Limehouse £21,100 in 3 weeks.",
  },
  {
    title: "Premium bathroom or wet room, products included",
    price: "£15,000 to £30,000+ including VAT",
    timeline: "3 to 5 weeks",
    description:
      "We source the suite, brassware and tiles with you. Wet rooms need a fully tanked floor, so allow more time.",
  },
];
export default function Page(){return <ServicePage heading="Bathroom renovation and fitting in London" name="Bathroom renovations" path="/bathroom-renovation" title="Strip-out to grout, in about two weeks." intro="Most bathrooms we renovate in London take 2 to 3 weeks. In Finsbury Park, keeping the layout with the client's own suite and tiles, the work came to £7,700 + VAT. Moving things around costs more: a new layout in Walthamstow was about £8,000 for the bathroom alone. We do the waterproofing, plumbing, electrics, tiling and the last coat of paint." image="/assets/portfolio/bathroom-melina-e7/melina-bathroom-e7-1.webp" range="About £7,500 to £12,000 + VAT for the work; you choose the suite and tiles" timeline="2 to 3 weeks; 4 for larger rooms" guarantee="2 years for bathroom installation" costs={costTiers} scope={inclusionItems} faqs={getPageFaqs("bathroom")} projects={["melina-e7", "daniel-n19"]}  />;}
