import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { getPageFaqs } from "@/libs/pageFaqs";
import ServicePage from "@/components/brand/ServicePage";
export const metadata = getSEOTags({
  title: "Basement Conversions London | Design & Build | Better Homes",
  description:
    "London basement conversions with feasibility, planning, structural works, waterproofing and fit-out managed by one team. Book a consultation.",
  canonicalUrlRelative: "/basement-conversion",
  openGraph: {
    title: "Basement Conversions London | Design & Build | Better Homes",
    description:
      "Create a dry, bright and properly engineered basement with managed construction and optional architect coordination in London.",
    url: `https://${config.domainName}/basement-conversion`,
    images: [
      {
        url: `https://${config.domainName}/assets/extension-calculator/basement-extension.jpg`,
        width: 1000,
        height: 625,
        alt: "London basement conversion with a landscaped lightwell",
      },
    ],
  },
  keywords: [
    "basement conversions London",
    "basement conversion company London",
    "basement builders London",
    "cellar conversion London",
    "basement excavation London",
    "basement waterproofing London",
    "basement design and build London",
    "basement conversion cost London",
  ],
});
const conversionRoutes = [
  {
    title: "Existing cellar conversion",
    body:
      "Turn an underused cellar or lower-ground floor into comfortable living space, with headroom, damp protection, insulation, services and finishes resolved together.",
    bestFor: "Homes that already have usable space below ground",
  },
  {
    title: "New basement excavation",
    body:
      "Create a new storey beneath the existing footprint. This is the most structurally involved route and needs careful feasibility, temporary works, logistics and approvals.",
    bestFor: "Homes with no existing basement but strong development potential",
  },
  {
    title: "Basement extension",
    body:
      "Extend an existing lower-ground level beneath part of the house, rear garden or side area where planning policy, trees, drainage and site conditions allow.",
    bestFor: "Properties where existing below-ground space can be enlarged",
  },
  {
    title: "Shell, waterproofing and fit-out",
    body:
      "Take a basement from structural shell through waterproofing, mechanical and electrical services, joinery, bathrooms, flooring, decoration and final commissioning.",
    bestFor: "Clients who want one accountable team through to handover",
  },
];
const includedItems = [
  {
    title: "Feasibility and scope definition",
    body:
      "We start with the property, access, existing structure, drainage, neighbours, likely approvals and your intended use. The aim is to identify costly assumptions before they become drawings or contracts.",
  },
  {
    title: "Design and consultant coordination",
    body:
      "Architectural design, structural input, waterproofing strategy and building-services planning are coordinated around one buildable scheme rather than developed in isolation.",
  },
  {
    title: "Planning and pre-construction",
    body:
      "We help coordinate the correct route for planning, Building Regulations, structural calculations, Party Wall matters and the information needed before site starts.",
  },
  {
    title: "Excavation and structural shell",
    body:
      "Temporary works, excavation, underpinning or alternative structural solutions are sequenced to the engineer's design, with access and spoil removal planned around the site.",
  },
  {
    title: "Waterproofing and drainage",
    body:
      "The waterproofing approach is designed for the ground conditions and intended use, with drainage routes, maintainable pump access and failure points considered at design stage.",
  },
  {
    title: "Services, fit-out and handover",
    body:
      "Heating, ventilation, lighting, electrics, plumbing, walls, floors, joinery and decoration are brought together into a finished space, followed by snagging and a documented handover.",
  },
];
const faqs = [
  {
    question: "Do I need planning permission for a basement conversion in London?",
    answer:
      "It depends on the work and the property. An internal conversion of an existing cellar may not need planning permission if there is no material external change or change of use. New excavation, enlarging a basement, adding a visible lightwell, creating a separate dwelling, or working on a listed building commonly changes the route. London boroughs can also apply their own basement policies, so the correct answer should be checked for your address.",
  },
  {
    question: "How much does a basement conversion cost in London?",
    answer:
      "For early planning, converting existing cellar space may fall around £2,000 to £4,000+ per square metre, while creating a new basement can start around £4,000 to £7,000+ per square metre before premium fit-out. Access, depth, groundwater, structural method, spoil removal, lightwells, bathrooms, joinery, professional fees and VAT can materially change the total. A site-specific feasibility and cost plan is more useful than relying on one generic rate.",
  },
  {
    question: "How long does a London basement project take?",
    answer:
      "A straightforward conversion of existing below-ground space may take several months on site. A new excavation is a larger structural project and the full journey often runs 6 to 12 months or more once surveys, design, planning, Party Wall matters, construction and fit-out are included. The programme should be built around the specific structural sequence and approvals rather than a generic promise.",
  },
  {
    question: "Can you convert a cellar without digging it deeper?",
    answer:
      "Sometimes. If the existing headroom, floor construction, damp condition, access and intended use all work, the project may focus on waterproofing, insulation, services and fit-out. Where finished headroom is inadequate or the floor build-up needs to change, excavation or structural lowering may be required.",
  },
  {
    question: "How do you prevent damp and water ingress?",
    answer:
      "The waterproofing strategy should be designed for the site's water risk and the intended use of the room. Depending on the property, that may involve a drained-cavity membrane, barrier protection, integral waterproof concrete, or a combined approach, with maintainable drainage and pump systems where required. The design should follow current professional guidance, including BS 8102 principles.",
  },
  {
    question: "Will I need a Party Wall agreement?",
    answer:
      "Basement work frequently falls within the Party Wall etc. Act because it may deepen a party wall or excavate below and near a neighbour's foundations. The exact notices depend on the design and distances involved. Party Wall matters should be addressed early, with the necessary drawings and engineering information, rather than left until the planned start date.",
  },
  {
    question: "Do basement conversions need Building Regulations approval?",
    answer:
      "Yes, habitable basement work needs Building Regulations approval. The review can cover structure, fire safety and escape, ventilation, thermal performance, damp protection, drainage, electrical work, stairs and guarding. Planning permission and Building Regulations are separate processes.",
  },
  {
    question: "Can we stay in the house during the basement works?",
    answer:
      "It can be possible, but it depends on the structural method, access route, utilities, dust and noise tolerance, and whether the house can be separated safely from the work. We discuss the practical reality during pre-construction so you can decide based on the actual programme rather than optimism.",
  },
  {
    question: "What ceiling height should a converted basement have?",
    answer:
      "There is no single comfortable height that suits every layout, but finished headroom has a major effect on whether the room feels like genuine living space. Floor build-up, services, structure and Building Control requirements all reduce the available height, so the finished dimension–not the current excavation height–should guide feasibility.",
  },
  {
    question: "Does a basement conversion add value to a London home?",
    answer:
      "It can, particularly where the space is bright, dry, useful and proportionate to the house. The commercial case is property-specific: build cost, local ceiling values, quality of natural light and how well the new floor connects to the rest of the home all matter. We recommend testing value with a local agent or valuer before committing to a major excavation.",
  },
  {
    question: "Which areas of London do you cover?",
    answer:
      "Better Homes works across Central, West, North, North West, East and North East London, including Kensington, Chelsea, Westminster, Camden, Hampstead, Islington, Hackney, Walthamstow, Leytonstone, Woodford and surrounding neighbourhoods. Project fit, access and scope are reviewed at enquiry stage.",
  },
  {
    question: "What happens at the first basement consultation?",
    answer:
      "We discuss your property, the space you want to create, any existing surveys or drawings, your budget, timing and likely constraints. From there we can recommend the right next step, which may be a site feasibility review, measured survey, planning advice or an outline scope and cost exercise.",
  },
];
export default function Page(){return <ServicePage name="Basement conversions" path="/basement-conversion" title="Make more of the space beneath your home." intro="A basement project starts with careful feasibility: structure, groundwater, access and daylight. Better Homes builds alongside your own or a recommended architect and appointed specialists. If you wish, we can manage discussions and follow up design questions, from an existing cellar upgrade to a more substantial below-ground scheme." image="/assets/extension-calculator/basement-extension.jpg" range="Existing cellars £2,000 to £4,000+ per m²; new basements £4,000 to £7,000+ per m²" timeline="A new basement journey can take 6 to 12 months or more" guarantee="10 years structural; 2 years kitchen and bathroom installation; 1 year decoration" costs={conversionRoutes} scope={includedItems} faqs={faqs} projects={[]}  />;}
