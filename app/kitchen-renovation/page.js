import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { getPageFaqs } from "@/libs/pageFaqs";
import ServicePage from "@/components/brand/ServicePage";
export const metadata = getSEOTags({
  title:
    "Kitchen Renovation London | Design, Supply & Install | Better Homes",
  description:
    "Kitchen renovation in London with one team managing design, supply, installation and finishing. Clear cost guidance, realistic timelines and kitchen-specific project proof.",
  canonicalUrlRelative: "/kitchen-renovation",
  openGraph: {
    title:
      "Kitchen Renovation London | Design, Supply & Install | Better Homes",
    description:
      "Design-led kitchen renovations across London with clear scope, realistic budgets and one accountable team from first plan through final fit-off.",
    url: `https://${config.domainName}/kitchen-renovation`,
  },
  keywords: [
    "kitchen renovation London",
    "kitchen fitting London",
    "kitchen refurbishment London",
    "kitchen design and build London",
  ],
});
const inclusionItems = [
  {
    title: "Strip-out and preparation",
    body:
      "Removing the existing kitchen cleanly, preparing the room properly and dealing with the practical realities that affect the new install.",
  },
  {
    title: "Plumbing and electrics",
    body:
      "First-fix and service changes for new layouts, appliance positions, lighting, extraction and the day-to-day functionality of the room.",
  },
  {
    title: "Units, worktops and cabinetry fitting",
    body:
      "The core installation work that determines how the kitchen looks, feels and performs long after the handover.",
  },
  {
    title: "Tiling, decorating and finishing",
    body:
      "The surfaces, trims and final detailing that make the difference between a kitchen that is merely new and one that feels properly finished.",
  },
  {
    title: "Appliance fitting and final connections",
    body:
      "Integrating appliances cleanly and safely so the kitchen works as a complete room rather than a collection of separate parts.",
  },
  {
    title: "Snagging and closeout",
    body:
      "The final pass where tolerances, finishes and usability are checked so the result feels premium, not rushed over the line.",
  },
];
const costTiers = [
  {
    title: "Basic refresh",
    price: "£12,000 to £18,000",
    timeline: "Around 3 to 4 weeks",
    description:
      "Best when the layout broadly works and the goal is to replace tired cabinetry, surfaces and finishes without major reconfiguration.",
  },
  {
    title: "Mid-range redesign",
    price: "£20,000 to £35,000",
    timeline: "Around 4 to 6 weeks",
    description:
      "The strongest fit for most London kitchens where you want a better layout, stronger storage, upgraded finishes and a more resolved design.",
  },
  {
    title: "High-end or structural kitchen project",
    price: "£35,000 to £60,000+",
    timeline: "Often 5 to 8+ weeks",
    description:
      "Used when the project includes structural openings, premium cabinetry, higher-spec appliances, bespoke detailing or a more ambitious design brief.",
  },
];
export default function Page(){return <ServicePage name="Kitchen renovations" path="/kitchen-renovation" title="A kitchen made for the way you live." intro="Better Homes delivers standalone kitchen renovations across London, as well as kitchens within larger projects. From services and storage to careful installation, we coordinate the details that make the room a pleasure to use." image="/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-1.webp" range="From around £20,000 for a full redesign" timeline="Typically 3 to 6 weeks on site" guarantee="2 years for kitchen workmanship" costs={costTiers} scope={inclusionItems} faqs={getPageFaqs("kitchen")} projects={["lawrence-e3", "alice-e4", "daniel-n19"]}  />;}
