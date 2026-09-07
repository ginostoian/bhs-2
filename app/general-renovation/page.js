import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { getPageFaqs } from "@/libs/pageFaqs";
import ServicePage from "@/components/brand/ServicePage";
export const metadata = getSEOTags({
  title:
    "Home Renovation London | Full Refurbishment & Fit-Out | Better Homes",
  description:
    "Full home renovation and refurbishment in London with one team managing structural work, rewiring, plumbing, kitchens, bathrooms, finishes and handover.",
  canonicalUrlRelative: "/general-renovation",
  openGraph: {
    title:
      "Home Renovation London | Full Refurbishment & Fit-Out | Better Homes",
    description:
      "Whole-home renovation in London with one accountable team managing the full scope from structural work and M&E through kitchens, bathrooms and finishes.",
    url: `https://${config.domainName}/general-renovation`,
  },
  keywords: [
    "home renovation London",
    "house refurbishment London",
    "full home renovation London",
    "full house refurbishment London",
  ],
});
const inclusionItems = [
  {
    title: "Structural changes and layout reworking",
    body:
      "Wall removals, openings, strengthening work and layout changes that make the house feel better organised and easier to live in. If the wider scope includes a house extension or loft conversion, we coordinate that as part of one joined-up plan.",
    links: [
      { label: "house extension", href: "/house-extension" },
      { label: "loft conversion", href: "/loft-conversion" },
    ],
  },
  {
    title: "Rewiring, plumbing and heating upgrades",
    body:
      "The hidden backbone of the renovation: electrics, pipework, boilers, radiators, controls and the system upgrades older London homes often need.",
  },
  {
    title: "Kitchen and bathroom delivery",
    body:
      "Not as stand-alone projects bolted on afterwards, but as part of one joined-up renovation. If you need a kitchen renovation or bathroom renovation, those decisions are coordinated with the rest of the home so the result feels coherent.",
    links: [
      { label: "kitchen renovation", href: "/kitchen-renovation" },
      { label: "bathroom renovation", href: "/bathroom-renovation" },
    ],
  },
  {
    title: "Plastering, flooring and joinery",
    body:
      "The surfaces and details that make the difference between a house that merely looks newer and one that feels properly finished.",
  },
  {
    title: "Decoration and final finishing",
    body:
      "Painting, trim, hardware, final fit-off and the detail work that determines whether the result feels premium or rushed.",
  },
  {
    title: "Programme control and quality management",
    body:
      "Scope reviews, sequencing, milestone checks, weekly updates, snagging and one team owning the result through handover.",
  },
];
const costRows = [
  {
    home: "2-bed flat or small house",
    size: "60 m²",
    basic: "£30,000 to £48,000",
    mid: "£48,000 to £84,000",
    high: "£84,000 to £150,000+",
  },
  {
    home: "Typical London terrace",
    size: "90 m²",
    basic: "£45,000 to £72,000",
    mid: "£72,000 to £126,000",
    high: "£126,000 to £225,000+",
  },
  {
    home: "3-bed family home",
    size: "110 m²",
    basic: "£55,000 to £88,000",
    mid: "£88,000 to £154,000",
    high: "£154,000 to £275,000+",
  },
  {
    home: "4-bed larger house",
    size: "140 m²",
    basic: "£70,000 to £112,000",
    mid: "£112,000 to £196,000",
    high: "£196,000 to £350,000+",
  },
];
export default function Page(){return <ServicePage name="Whole-home renovations" path="/general-renovation" title="A home that works beautifully, room to room." intro="Bring layout, services, kitchens, bathrooms and finishes together in one carefully managed renovation. We help London homeowners make the substantial changes that improve everyday life, with clear responsibilities and an itemised construction scope." image="/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp" range="\u00a380,000 to \u00a3250,000+ for a substantial whole-home project" timeline="Agreed against scope and structural works" guarantee="Cover confirmed by work package" costs={[]} scope={inclusionItems} faqs={getPageFaqs("renovation")} projects={["daniel-n19", "james-n8", "ava-e7"]} costRows={costRows} />;}
