import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { getPageFaqs } from "@/libs/pageFaqs";
import ServicePage from "@/components/brand/ServicePage";
export const metadata = getSEOTags({
  title:
    "Loft Conversions London | Design, Planning & Build | Better Homes",
  description:
    "Loft conversions in London from feasibility and planning through build and handover. Dormer, hip-to-gable, mansard and rooflight loft projects with clear cost guidance and weekly updates.",
  canonicalUrlRelative: "/loft-conversion",
  openGraph: {
    title:
      "Loft Conversions London | Design, Planning & Build | Better Homes",
    description:
      "Create valuable extra living space with a London loft conversion planned properly from first feasibility through final finish.",
    url: `https://${config.domainName}/loft-conversion`,
  },
  keywords: [
    "loft conversions London",
    "loft conversion London cost",
    "dormer loft conversion London",
    "hip to gable loft conversion London",
    "mansard loft conversion London",
  ],
});
const conversionTypes = [
  {
    title: "Rooflight / Velux",
    range: "£25,000 to £45,000",
    timeline: "4 to 6 weeks build",
    planning: "Usually permitted development",
    description:
      "Best when your loft already has enough usable height and you want the simplest route to an extra room.",
  },
  {
    title: "Rear dormer",
    range: "£45,000 to £75,000",
    timeline: "8 to 12 weeks build",
    planning: "Often permitted development",
    description:
      "The most common London option when you need proper headroom, a practical stair, and a room that feels fully usable.",
  },
  {
    title: "Hip-to-gable",
    range: "£55,000 to £80,000",
    timeline: "9 to 13 weeks build",
    planning: "Usually permitted development on suitable houses",
    description:
      "Strong fit for semi-detached and end-of-terrace homes where the sloping side roof is limiting the space you can actually use.",
  },
  {
    title: "L-shaped dormer",
    range: "£60,000 to £90,000",
    timeline: "10 to 14 weeks build",
    planning: "Often planning-light, but property dependent",
    description:
      "A high-value route when you want to maximise floor area and create space for a larger bedroom plus bathroom or storage.",
  },
  {
    title: "Mansard",
    range: "£70,000 to £100,000+",
    timeline: "12 to 16 weeks build",
    planning: "Usually full planning",
    description:
      "The premium option when you want the biggest transformation and are prepared for a more planning-led process.",
  },
];
const hiddenCostPoints = [
  "Professional fees and structural input often add 10% to 15% on top of the build cost.",
  "Party wall matters can add £1,000 to £3,000 per neighbour where required.",
  "Inner London boroughs often carry a 15% to 25% cost premium versus outer areas.",
];
export default function Page(){return <ServicePage name="Loft conversions" path="/loft-conversion" title="Space above. A better home below." intro="Create an extra bedroom, a quiet workspace or a generous suite without giving up your garden. Better Homes manages the construction, structure and finishing of London loft conversions, working with your own architect or one we recommend. If you wish, we can manage the coordination and handle discussions on your behalf with your agreement." image="/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp" range="£45,000 to £130,000+ for larger conversions" timeline="8 to 16 weeks; rooflight projects 4 to 6 weeks" guarantee="10 years for loft workmanship" costs={conversionTypes} scope={["Structural floor and roof work to the engineer’s design", "Staircase installation and connection to the existing landing", "Insulation, rooflights or dormer windows and weatherproofing", "Heating, electrics, plumbing and bathroom fitting within the agreed scope", "Plastering, joinery, decoration and handover checks"]} notes={hiddenCostPoints} faqs={getPageFaqs("loft")} projects={["mannie-e17", "suzie-e10"]}  />;}
