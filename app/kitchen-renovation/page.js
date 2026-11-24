import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { getPageFaqs } from "@/libs/pageFaqs";
import ServicePage from "@/components/brand/ServicePage";
export const metadata = getSEOTags({
  title: "Kitchen Renovation & Fitting London | Better Homes",
  description:
    "Kitchen renovations in London from strip-out to final fit-off: layout, plumbing, electrics, units, worktops and tiling by one team. 5-star reviews, 2-year guarantee.",
  canonicalUrlRelative: "/kitchen-renovation",
  openGraph: {
    title: "Kitchen Renovation & Fitting London | Better Homes",
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
    title: "Fitting the kitchen you have chosen",
    price: "£6,500 to £10,000 + VAT",
    timeline: "1 to 2 weeks",
    description:
      "You buy the units, worktops and appliances, and we help with the order. We strip out, re-plumb, rewire, fit, tile and lay the floor. Recent jobs: Woodford Green £6,500, Clapton £8,300, Bankside £9,800.",
  },
  {
    title: "A bigger kitchen: walls moved, rooms joined",
    price: "£13,000 to £32,000 + VAT",
    timeline: "3 to 5 weeks",
    description:
      "Steel beams, doorways blocked or opened, sometimes a bathroom moved to make room. In Stratford we enlarged the kitchen and moved the bathroom for £31,750 + VAT.",
  },
  {
    title: "Full supply and fit, mid-range to bespoke",
    price: "£20,000 to £60,000+ including units and VAT",
    timeline: "4 to 8 weeks, plus maker's lead time",
    description:
      "We source and fit the whole kitchen with you. Bespoke kitchens take 8 to 12 weeks to make before we start.",
  },
];
export default function Page(){return <ServicePage heading="Kitchen renovation and fitting in London" name="Kitchen renovations" path="/kitchen-renovation" title="From fitting the kitchen you chose to rebuilding the room around it." intro="Bought your kitchen from Howdens, Wren, Magnet or IKEA? We fit it, with the plumbing, electrics, tiling and flooring done properly. On recent London jobs that work came to £6,500 to £9,800 + VAT. If a wall needs to come down or the room needs to grow, we do the steels and the building work too." image="/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-1.webp" range="Fitting your kitchen: about £6,500 to £10,000 + VAT. With structural work: £13,000 to £32,000 + VAT" timeline="1 to 2 weeks to fit; 3 to 5 weeks with building work" guarantee="2 years for kitchen installation" costs={costTiers} scope={inclusionItems} faqs={getPageFaqs("kitchen")} projects={["lawrence-e3", "alice-e4", "daniel-n19"]}  />;}
