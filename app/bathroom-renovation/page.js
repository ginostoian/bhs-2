import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { getPageFaqs } from "@/libs/pageFaqs";
import ServicePage from "@/components/brand/ServicePage";
export const metadata = getSEOTags({
  title:
    "Bathroom Renovation London | Design, Supply & Install | Better Homes",
  description:
    "Bathroom renovation in London with one team managing design, supply, waterproofing, installation and finishing. Clear cost guidance, realistic timelines and bathroom-specific project proof.",
  canonicalUrlRelative: "/bathroom-renovation",
  openGraph: {
    title:
      "Bathroom Renovation London | Design, Supply & Install | Better Homes",
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
    title: "Basic refresh",
    price: "£6,000 to £10,000",
    timeline: "Around 2 to 3 weeks",
    description:
      "Best when the layout stays broadly similar and the goal is to improve dated finishes, fittings and overall presentation without a bigger redesign.",
  },
  {
    title: "Mid-range redesign",
    price: "£12,000 to £20,000",
    timeline: "Around 2 to 4 weeks",
    description:
      "The strongest fit for most London bathrooms where you want better layout use, stronger material choices and a room that feels noticeably calmer and more premium.",
  },
  {
    title: "High-end bathroom or wet room",
    price: "£20,000 to £35,000+",
    timeline: "Around 3 to 5+ weeks",
    description:
      "Used when the brief includes premium finishes, specialist waterproofing, bespoke joinery, underfloor heating or a more ambitious wet-room style design.",
  },
];
export default function Page(){return <ServicePage name="Bathroom renovations" path="/bathroom-renovation" title="A quieter start. A better finish to every day." intro="Standalone bathrooms, en-suites and wet rooms, carefully renovated by Better Homes in London. We coordinate preparation, waterproofing, services, fitting and finishing so the quality runs deeper than the tiles." image="/assets/portfolio/bathroom-melina-e7/melina-bathroom-e7-1.webp" range="From around \u00a312,000 for a full redesign" timeline="Usually 2 to 4 weeks on site" guarantee="2 years for bathroom workmanship" costs={costTiers} scope={inclusionItems} faqs={getPageFaqs("bathroom")} projects={["melina-e7", "daniel-n19"]}  />;}
