/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ClipboardCheck,
  Droplets,
  FileCheck2,
  Hammer,
  HardHat,
  House,
  MessageCircle,
  MoveDown,
  Paintbrush,
  Phone,
  Pickaxe,
  Ruler,
  ShieldCheck,
  Sparkles,
  Sun,
  Wind,
} from "lucide-react";

import SocialProof from "@/components/socialProof/SocialProof";
import config from "@/config";
import { BOOKING_URL } from "@/libs/booking";
import { getSEOTags } from "@/libs/seo";
import {
  BUSINESS_IDS,
  SITE_URL,
  getLocalBusinessSchema,
  getWebsiteReference,
} from "@/libs/structuredData";

export const metadata = getSEOTags({
  title: "Basement Conversions London | Design & Build | Better Homes",
  description:
    "London basement conversions with feasibility, planning, structural works, waterproofing and fit-out managed by one team. Book a consultation.",
  canonicalUrlRelative: "/basement-conversion",
  openGraph: {
    title: "Basement Conversions London | Design & Build | Better Homes",
    description:
      "Create a dry, bright and properly engineered basement with one accountable London design-and-build team.",
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

const pageUrl = `${SITE_URL}/basement-conversion`;
const heroImage = "/assets/extension-calculator/basement-extension.jpg";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "£10M insured",
    detail: "Cover appropriate to major residential works",
  },
  {
    icon: BadgeCheck,
    title: "Up to 10-year guarantee",
    detail: "On qualifying work, confirmed in your contract",
  },
  {
    icon: House,
    title: "500+ projects delivered",
    detail: "Across London homes",
  },
  {
    icon: MessageCircle,
    title: "Weekly project updates",
    detail: "Clear progress, decisions and next steps",
  },
];

const conversionRoutes = [
  {
    icon: MoveDown,
    title: "Existing cellar conversion",
    body:
      "Turn an underused cellar or lower-ground floor into comfortable living space, with headroom, damp protection, insulation, services and finishes resolved together.",
    bestFor: "Homes that already have usable space below ground",
  },
  {
    icon: Pickaxe,
    title: "New basement excavation",
    body:
      "Create a new storey beneath the existing footprint. This is the most structurally involved route and needs careful feasibility, temporary works, logistics and approvals.",
    bestFor: "Homes with no existing basement but strong development potential",
  },
  {
    icon: Building2,
    title: "Basement extension",
    body:
      "Extend an existing lower-ground level beneath part of the house, rear garden or side area where planning policy, trees, drainage and site conditions allow.",
    bestFor: "Properties where existing below-ground space can be enlarged",
  },
  {
    icon: Paintbrush,
    title: "Shell, waterproofing and fit-out",
    body:
      "Take a basement from structural shell through waterproofing, mechanical and electrical services, joinery, bathrooms, flooring, decoration and final commissioning.",
    bestFor: "Clients who want one accountable team through to handover",
  },
];

const costRanges = [
  {
    label: "Existing cellar",
    value: "£2,000–£4,000+ /m²",
    summary:
      "A broad planning range for converting existing below-ground space where major excavation is limited.",
  },
  {
    label: "New basement excavation",
    value: "£4,000–£7,000+ /m²",
    summary:
      "A broad planning range for excavation, structural shell, waterproofing and core services before premium fit-out choices.",
  },
  {
    label: "Professional and statutory costs",
    value: "Allow separately",
    summary:
      "Surveys, architecture, engineering, planning, Building Control and Party Wall costs depend on the property and borough.",
  },
];

const costDrivers = [
  "Existing cellar versus entirely new excavation",
  "Required depth and finished ceiling height",
  "Ground conditions, groundwater and drainage strategy",
  "Party walls, underpinning and structural sequence",
  "Restricted access, spoil removal and street logistics",
  "Lightwells, glazed openings and external alterations",
  "Bathrooms, kitchens, AV, joinery and finish level",
  "Planning conditions and borough-specific requirements",
];

const includedItems = [
  {
    icon: ClipboardCheck,
    title: "Feasibility and scope definition",
    body:
      "We start with the property, access, existing structure, drainage, neighbours, likely approvals and your intended use. The aim is to identify costly assumptions before they become drawings or contracts.",
  },
  {
    icon: Ruler,
    title: "Design and consultant coordination",
    body:
      "Architectural design, structural input, waterproofing strategy and building-services planning are coordinated around one buildable scheme rather than developed in isolation.",
  },
  {
    icon: FileCheck2,
    title: "Planning and pre-construction",
    body:
      "We help coordinate the correct route for planning, Building Regulations, structural calculations, Party Wall matters and the information needed before site starts.",
  },
  {
    icon: HardHat,
    title: "Excavation and structural shell",
    body:
      "Temporary works, excavation, underpinning or alternative structural solutions are sequenced to the engineer's design, with access and spoil removal planned around the site.",
  },
  {
    icon: Droplets,
    title: "Waterproofing and drainage",
    body:
      "The waterproofing approach is designed for the ground conditions and intended use, with drainage routes, maintainable pump access and failure points considered at design stage.",
  },
  {
    icon: Sparkles,
    title: "Services, fit-out and handover",
    body:
      "Heating, ventilation, lighting, electrics, plumbing, walls, floors, joinery and decoration are brought together into a finished space, followed by snagging and a documented handover.",
  },
];

const processSteps = [
  {
    title: "Feasibility and survey",
    body:
      "We assess the existing building, access, likely ground risks, proposed use and a realistic budget before momentum builds around the wrong scheme.",
  },
  {
    title: "Design and cost plan",
    body:
      "Layout, light, headroom, structure, waterproofing and services are developed together, with cost assumptions made visible.",
  },
  {
    title: "Approvals and Party Wall",
    body:
      "The planning route, Building Control, engineering and neighbouring-owner process are coordinated before construction.",
  },
  {
    title: "Excavation and shell",
    body:
      "The site is protected and the structural sequence carried out in controlled stages, with logistics and safety actively managed.",
  },
  {
    title: "Waterproofing and services",
    body:
      "The below-ground envelope, drainage and pumps are installed alongside first-fix heating, ventilation, plumbing and electrics.",
  },
  {
    title: "Fit-out and handover",
    body:
      "The room is finished, commissioned and snagged, with relevant certificates, maintenance information and guarantee terms handed over.",
  },
];

const technicalDetails = [
  {
    icon: Hammer,
    title: "Structural design",
    body:
      "A basement changes how loads move through the building. The permanent structure, temporary works and excavation sequence must be designed for the actual house and ground conditions.",
  },
  {
    icon: Droplets,
    title: "Waterproofing strategy",
    body:
      "We coordinate the protection strategy around BS 8102 principles, the intended grade of use and the site's water risk. Maintainability matters as much as the membrane itself.",
  },
  {
    icon: Sun,
    title: "Natural light and ventilation",
    body:
      "Lightwells, rooflights, internal glazing and carefully planned artificial light can prevent a basement feeling subterranean. Ventilation and humidity control protect comfort and finishes.",
  },
  {
    icon: Wind,
    title: "Drainage and pump access",
    body:
      "Where pumps are part of the design, access, alarms, duty and standby arrangements, discharge routes and a realistic maintenance plan should be resolved before finishes conceal them.",
  },
  {
    icon: ShieldCheck,
    title: "Building Regulations and fire safety",
    body:
      "Habitable basements need a compliant strategy for structure, insulation, ventilation, drainage, electrical work, fire protection and means of escape—not just a planning approval.",
  },
];

const planningRows = [
  {
    situation: "Convert an existing cellar internally",
    guidance:
      "Planning permission is often not required if there is no material external change or change of use, but the property and local restrictions still need checking.",
  },
  {
    situation: "Excavate a new basement or increase its size",
    guidance:
      "Planning permission is commonly required. London boroughs may ask for specialist reports and apply basement-specific policies.",
  },
  {
    situation: "Add a lightwell, railings or visible windows",
    guidance:
      "External alterations can trigger planning permission and will be assessed for appearance, amenity, heritage and streetscape impact.",
  },
  {
    situation: "Work to a listed building or in a conservation area",
    guidance:
      "Additional consent or tighter local policy may apply. Early planning and heritage input is usually valuable.",
  },
  {
    situation: "Create a separate flat or business use",
    guidance:
      "A separate dwelling or material change of use normally requires planning review and can add daylight, access, amenity and fire-safety requirements.",
  },
];

const useIdeas = [
  "Kitchen and family room opening to a lightwell",
  "Guest suite with a properly designed bathroom",
  "Home office or quiet studio",
  "Gym and wellness room",
  "Cinema, games or music room",
  "Utility, storage and plant space",
];

const proofPoints = [
  {
    value: "500+",
    label: "Projects delivered across London homes",
  },
  {
    value: "5-star",
    label: "Reviews across Google, Houzz and MyBuilder",
  },
  {
    value: "Weekly",
    label: "Project reporting during the build",
  },
  {
    value: "£10M",
    label: "Insurance cover",
  },
];

const serviceAreaGroups = [
  {
    region: "Central and West London",
    description:
      "Complex period homes, conservation context and tightly managed urban sites.",
    areas: [
      ["Kensington", "kensington"],
      ["Chelsea", "chelsea"],
      ["Westminster", "westminster"],
      ["Mayfair", "mayfair"],
      ["Notting Hill", "notting-hill"],
      ["Marylebone", "marylebone"],
    ],
  },
  {
    region: "North and North West London",
    description:
      "Family houses and terraces where structure, neighbours and access need early coordination.",
    areas: [
      ["Camden", "camden-town"],
      ["Hampstead", "hampstead"],
      ["Islington", "islington"],
      ["Barnet", "barnet"],
      ["Finsbury Park", "finsbury-park"],
      ["Alexandra Park", "alexandra-park"],
    ],
  },
  {
    region: "East and North East London",
    description:
      "Our strongest local delivery patch across character homes and established neighbourhoods.",
    areas: [
      ["Hackney", "hackney"],
      ["Walthamstow", "walthamstow"],
      ["Leytonstone", "leytonstone"],
      ["Stratford", "stratford"],
      ["Woodford", "woodford"],
      ["South Woodford", "south-woodford"],
    ],
  },
];

const schemaServiceAreas = serviceAreaGroups.flatMap((group) =>
  group.areas.map(([name]) => ({
    "@type": "Place",
    name,
    containedInPlace: {
      "@type": "City",
      name: "London",
    },
  })),
);

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
      "There is no single comfortable height that suits every layout, but finished headroom has a major effect on whether the room feels like genuine living space. Floor build-up, services, structure and Building Control requirements all reduce the available height, so the finished dimension—not the current excavation height—should guide feasibility.",
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

function ArrowIcon() {
  return <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />;
}

function PrimaryButton({ children, href = BOOKING_URL }) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="inline-flex min-h-14 items-center justify-center gap-3 rounded-[2px] bg-[#266bf1] px-6 text-base font-bold text-white transition hover:bg-[#1449b0] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#266bf1]"
    >
      {children}
      <ArrowIcon />
    </Link>
  );
}

function TextLink({ children, href, dark = false }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 border-b pb-1 text-sm font-bold transition ${
        dark
          ? "border-[#6fa1ff] text-[#9ec1ff] hover:border-white hover:text-white"
          : "border-[#266bf1] text-[#266bf1] hover:border-[#100b47] hover:text-[#100b47]"
      }`}
    >
      {children}
      <ArrowIcon />
    </Link>
  );
}

function SectionHeading({
  title,
  children,
  label,
  dark = false,
  centered = false,
}) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {label ? (
        <p
          className={`mb-4 text-xs font-extrabold uppercase tracking-[0.2em] ${
            dark ? "text-[#9ec1ff]" : "text-[#266bf1]"
          }`}
        >
          {label}
        </p>
      ) : null}
      <h2
        className={`text-3xl font-black leading-[1.08] tracking-[-0.035em] md:text-5xl ${
          dark ? "text-white" : "text-[#100b47]"
        }`}
      >
        {title}
      </h2>
      {children ? (
        <p
          className={`mt-5 text-lg leading-8 ${
            dark ? "text-[#d6def6]" : "text-[#4c5770]"
          }`}
        >
          {children}
        </p>
      ) : null}
    </div>
  );
}

function BasementSectionDiagram() {
  return (
    <div className="relative overflow-hidden border border-[#d7e3f8] bg-white p-5 md:p-8">
      <svg
        viewBox="0 0 760 520"
        role="img"
        aria-labelledby="basement-diagram-title basement-diagram-description"
        className="h-auto w-full"
      >
        <title id="basement-diagram-title">
          Simplified technical section through a London home with a basement
        </title>
        <desc id="basement-diagram-description">
          A line drawing showing the house, basement structure, waterproofing,
          drainage pump and rear lightwell.
        </desc>
        <defs>
          <pattern
            id="ground-lines"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 10L10 0" stroke="#d9e5fb" strokeWidth="1" />
          </pattern>
        </defs>

        <path
          d="M178 221V129L334 45L491 129V221"
          fill="none"
          stroke="#100b47"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <path
          d="M213 202V137H455V202"
          fill="none"
          stroke="#8090b0"
          strokeWidth="2"
        />
        <path
          d="M213 202H455M334 137V202M265 137V202M402 137V202"
          fill="none"
          stroke="#bcc9dd"
          strokeWidth="2"
        />
        <path
          d="M126 221H600V263H126Z"
          fill="url(#ground-lines)"
          stroke="#8090b0"
          strokeWidth="2"
        />
        <path
          d="M185 263V458H522V263"
          fill="#f8fbff"
          stroke="#100b47"
          strokeWidth="5"
        />
        <path
          d="M200 278V441H506V278"
          fill="none"
          stroke="#266bf1"
          strokeDasharray="8 7"
          strokeWidth="4"
        />
        <path
          d="M522 316H596V458H522"
          fill="#ffffff"
          stroke="#100b47"
          strokeWidth="4"
        />
        <path
          d="M522 316L596 263"
          fill="none"
          stroke="#100b47"
          strokeWidth="4"
        />
        <path
          d="M546 411H587M546 379H587M546 347H587"
          fill="none"
          stroke="#266bf1"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <circle cx="242" cy="409" r="20" fill="#ffffff" stroke="#266bf1" strokeWidth="4" />
        <path
          d="M242 389V360M242 360H293"
          fill="none"
          stroke="#266bf1"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path
          d="M296 416H452M296 358H452M296 300H452"
          stroke="#d7e3f8"
          strokeWidth="2"
        />

        <path d="M185 302H126" stroke="#266bf1" strokeWidth="2" />
        <circle cx="185" cy="302" r="5" fill="#266bf1" />
        <text x="116" y="294" textAnchor="end" fill="#100b47" fontSize="16" fontWeight="700">
          Structure
        </text>

        <path d="M200 366H126" stroke="#266bf1" strokeWidth="2" />
        <circle cx="200" cy="366" r="5" fill="#266bf1" />
        <text x="116" y="350" textAnchor="end" fill="#100b47" fontSize="16" fontWeight="700">
          Waterproofing
        </text>
        <text x="116" y="371" textAnchor="end" fill="#52617d" fontSize="14">
          strategy
        </text>

        <path d="M242 409H126" stroke="#266bf1" strokeWidth="2" />
        <circle cx="242" cy="409" r="5" fill="#266bf1" />
        <text x="116" y="401" textAnchor="end" fill="#100b47" fontSize="16" fontWeight="700">
          Pump access
        </text>

        <path d="M596 347H620" stroke="#266bf1" strokeWidth="2" />
        <circle cx="596" cy="347" r="5" fill="#266bf1" />
        <text x="630" y="340" fill="#100b47" fontSize="16" fontWeight="700">
          Lightwell
        </text>
        <text x="630" y="361" fill="#52617d" fontSize="14">
          daylight + air
        </text>
      </svg>
      <p className="mt-4 border-t border-[#e6edf9] pt-4 text-sm leading-7 text-[#5e6980]">
        Illustrative section only. Your structural and waterproofing design must be
        developed for the actual property, ground and neighbouring conditions.
      </p>
    </div>
  );
}

export default function BasementConversionPage() {
  const serviceOffers = conversionRoutes.map((route) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: route.title,
      description: route.body,
    },
  }));

  const localBusinessSchema = getLocalBusinessSchema({
    description:
      "London design-and-build company delivering basement conversions, cellar conversions, basement excavation, waterproofing and interior fit-out.",
    areaServed: schemaServiceAreas,
    makesOffer: serviceOffers,
  });

  const serviceSchema = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Basement Conversions in London",
    alternateName: [
      "London Basement Conversion",
      "Cellar Conversion London",
      "Basement Design and Build London",
    ],
    serviceType: "Basement conversion design and build",
    description:
      "End-to-end basement conversion services across London, including feasibility, design coordination, planning support, structural works, excavation, waterproofing, services and fit-out.",
    url: pageUrl,
    provider: {
      "@id": BUSINESS_IDS.localBusiness,
    },
    areaServed: schemaServiceAreas,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Basement conversion services",
      itemListElement: serviceOffers,
    },
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Basement Conversions London",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq-schema`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const webpageSchema = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: "Basement Conversions London",
    description:
      "A detailed guide to Better Homes basement conversion design-and-build services across London.",
    isPartOf: getWebsiteReference(),
    about: {
      "@id": `${pageUrl}#service`,
    },
    breadcrumb: {
      "@id": `${pageUrl}#breadcrumb`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}${heroImage}`,
      width: 1000,
      height: 625,
      caption: "London basement conversion with a landscaped lightwell",
    },
  };

  return (
    <main className="bg-white text-[#100b47]">
      <section className="mx-auto grid max-w-[94rem] gap-10 px-5 pb-14 pt-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-12 lg:pb-6 lg:pt-12">
        <div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.05em] text-[#100b47] sm:text-6xl lg:text-[4.65rem]">
            Basement conversions in London,{" "}
            <span className="text-[#266bf1]">engineered for confidence.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4c5770] md:text-xl md:leading-9">
            One accountable design-and-build team for feasibility, planning,
            structure, excavation, waterproofing and fit-out—so the space below
            your home feels considered, comfortable and properly managed from the
            first survey to final handover.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <PrimaryButton>Book your basement consultation</PrimaryButton>
            <Link
              href="tel:07922391591"
              className="inline-flex min-h-14 items-center justify-center gap-2 border-b border-[#266bf1] px-2 text-base font-bold text-[#266bf1] transition hover:border-[#100b47] hover:text-[#100b47]"
            >
              <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
              Call 07922 391591
            </Link>
          </div>
          <p className="mt-5 text-sm leading-6 text-[#6b758c]">
            Start with an honest feasibility conversation. No pressure, no
            one-size-fits-all promises.
          </p>
        </div>

        <div className="relative min-h-[430px] overflow-hidden border border-[#cad8ef] bg-[#eef4ff] sm:min-h-[520px]">
          <Image
            src={heroImage}
            alt="London basement living space opening onto a planted lightwell"
            fill
            priority
            sizes="(max-width: 1024px) 94vw, 52vw"
            className="object-cover"
          />
        </div>
      </section>

      <section
        aria-label="Why London homeowners choose Better Homes"
        className="border-y border-[#d7e3f8] bg-white"
      >
        <div className="mx-auto grid max-w-[94rem] divide-y divide-[#d7e3f8] px-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-8 lg:grid-cols-4 lg:px-12">
          {trustPoints.map(({ icon: Icon, title, detail }) => (
            <div
              key={title}
              className="flex items-start gap-4 px-1 py-6 sm:px-5 lg:py-8"
            >
              <Icon
                aria-hidden="true"
                className="mt-0.5 h-8 w-8 shrink-0 text-[#266bf1]"
                strokeWidth={1.45}
              />
              <div>
                <h2 className="text-base font-bold text-[#100b47]">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-[#667189]">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <nav
        aria-label="On this page"
        className="border-b border-[#d7e3f8] bg-[#f8fbff]"
      >
        <div className="scrollbar-hide mx-auto flex max-w-[94rem] gap-7 overflow-x-auto px-5 py-4 text-sm font-bold text-[#52617d] sm:px-8 lg:px-12">
          {[
            ["Approaches", "#approaches"],
            ["Costs", "#costs"],
            ["What is included", "#included"],
            ["Process", "#process"],
            ["Planning", "#planning"],
            ["Technical", "#technical"],
            ["Areas", "#areas"],
            ["FAQ", "#faq"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap transition hover:text-[#266bf1]"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <SocialProof />

      <section
        id="approaches"
        className="mx-auto max-w-[94rem] scroll-mt-8 px-5 py-16 sm:px-8 lg:px-12 lg:py-24"
      >
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading title="Know what you’re building before you commit.">
            “Basement conversion” can mean anything from making an existing cellar
            habitable to creating a completely new lower-ground storey. The route
            changes the cost, planning risk, programme and structural method, so
            clarity should come before design excitement.
          </SectionHeading>
          <div className="relative min-h-[360px] overflow-hidden border border-[#d7e3f8]">
            <Image
              src="/assets/portfolio/extension-daniel-n19/daniel-home-extension-kitchen-front-view.webp"
              alt="Bright Better Homes kitchen and living space showing the finish standard applied across major residential projects"
              fill
              sizes="(max-width: 1024px) 90vw, 52vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-14 grid border-y border-[#d7e3f8] md:grid-cols-2 xl:grid-cols-4">
          {conversionRoutes.map(({ icon: Icon, title, body, bestFor }, index) => (
            <article
              key={title}
              className={`py-8 md:px-7 xl:min-h-[360px] ${
                index > 0 ? "border-[#d7e3f8] xl:border-l" : ""
              } ${index % 2 === 1 ? "md:border-l" : ""} ${
                index > 1 ? "border-t md:border-t" : ""
              } xl:border-t-0`}
            >
              <Icon
                aria-hidden="true"
                className="h-10 w-10 text-[#266bf1]"
                strokeWidth={1.35}
              />
              <h3 className="mt-6 text-2xl font-black leading-tight tracking-[-0.025em] text-[#100b47]">
                {title}
              </h3>
              <p className="mt-4 text-base leading-7 text-[#55617a]">{body}</p>
              <p className="mt-5 border-t border-[#e2eaf7] pt-4 text-sm leading-6 text-[#6b758c]">
                <strong className="text-[#100b47]">Best for:</strong> {bestFor}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="costs"
        className="scroll-mt-8 border-y border-[#d7e3f8] bg-[#f8fbff]"
      >
        <div className="mx-auto max-w-[94rem] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <SectionHeading
                label="Planning-stage guidance"
                title="What does a basement conversion cost in London?"
              >
                Basement costs are driven less by square footage alone than by how
                that space is created. Use these figures to understand the order of
                investment—not as a substitute for surveys, design and a
                site-specific scope.
              </SectionHeading>
              <div className="mt-7">
                <PrimaryButton>Get a site-specific feasibility view</PrimaryButton>
              </div>
            </div>

            <div className="grid border-y border-[#cddcf2] md:grid-cols-3">
              {costRanges.map((range, index) => (
                <article
                  key={range.label}
                  className={`py-7 md:px-7 ${
                    index > 0 ? "border-t border-[#cddcf2] md:border-l md:border-t-0" : ""
                  }`}
                >
                  <p className="text-sm font-bold text-[#100b47]">{range.label}</p>
                  <p className="mt-4 text-3xl font-black leading-tight tracking-[-0.035em] text-[#266bf1]">
                    {range.value}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#5c6880]">
                    {range.summary}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-12 border border-[#cddcf2] bg-white p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.58fr_1.42fr]">
              <div>
                <h3 className="text-2xl font-black text-[#100b47]">
                  What moves the final figure?
                </h3>
                <p className="mt-3 text-base leading-7 text-[#5c6880]">
                  A credible quote should make these assumptions explicit.
                </p>
              </div>
              <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {costDrivers.map((driver) => (
                  <li
                    key={driver}
                    className="flex items-start gap-3 border-t border-[#e3ebf8] pt-4 text-sm leading-6 text-[#4f5c74]"
                  >
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#266bf1]"
                      strokeWidth={2}
                    />
                    {driver}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-[#667189]">
            All figures are broad 2026 planning guidance and exclude VAT unless
            stated otherwise. A full proposal should set out inclusions,
            exclusions, provisional sums and professional or statutory costs.
          </p>
        </div>
      </section>

      <section
        id="included"
        className="mx-auto max-w-[94rem] scroll-mt-8 px-5 py-16 sm:px-8 lg:px-12 lg:py-24"
      >
        <div className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:gap-16">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <SectionHeading
              label="One accountable team"
              title="What a full basement design-and-build service includes"
            >
              The value is not simply having many disciplines available. It is
              making sure the structural engineer, waterproofing design, services,
              interior plan and site sequence all describe the same project.
            </SectionHeading>
            <div className="mt-7">
              <TextLink href="/our-guarantee">Read about our guarantees</TextLink>
            </div>
          </div>

          <div className="divide-y divide-[#d7e3f8] border-y border-[#d7e3f8]">
            {includedItems.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="grid gap-5 py-7 sm:grid-cols-[3rem_1fr] sm:py-8"
              >
                <Icon
                  aria-hidden="true"
                  className="h-9 w-9 text-[#266bf1]"
                  strokeWidth={1.35}
                />
                <div>
                  <h3 className="text-2xl font-black tracking-[-0.025em] text-[#100b47]">
                    {title}
                  </h3>
                  <p className="mt-3 text-base leading-8 text-[#55617a]">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="scroll-mt-8 bg-[#100b47] text-white">
        <div className="mx-auto max-w-[94rem] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <SectionHeading
            title="A managed route from ground survey to finished room"
            dark
          >
            Each stage should reduce uncertainty before the next one begins. That
            is how a technically complex basement becomes a legible project rather
            than a sequence of expensive surprises.
          </SectionHeading>

          <ol className="mt-12 grid gap-0 lg:grid-cols-6">
            {processSteps.map((step, index) => (
              <li
                key={step.title}
                className={`relative border-t border-[#3152a0] pb-8 pt-8 lg:border-l lg:border-t-0 lg:px-5 lg:pb-2 lg:pt-0 ${
                  index === 0 ? "lg:border-l-0 lg:pl-0" : ""
                }`}
              >
                <div className="mb-5 flex items-center gap-4 lg:block">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#4b83ef] text-lg font-black text-[#9ec1ff]">
                    {index + 1}
                  </span>
                  <span className="hidden h-px flex-1 bg-[#3152a0] lg:absolute lg:left-14 lg:top-[1.35rem] lg:block lg:w-[calc(100%-3.5rem)]" />
                </div>
                <h3 className="text-xl font-bold leading-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#c8d3ed]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="technical"
        className="mx-auto max-w-[94rem] scroll-mt-8 px-5 py-16 sm:px-8 lg:px-12 lg:py-24"
      >
        <SectionHeading
          title="The details that keep a basement dry, safe and comfortable"
          centered
        >
          A beautiful basement still fails if water risk, maintenance access,
          ventilation or fire strategy were treated as afterthoughts. These
          decisions belong at the centre of the design.
        </SectionHeading>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <BasementSectionDiagram />
          <div className="divide-y divide-[#d7e3f8] border-y border-[#d7e3f8]">
            {technicalDetails.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="grid gap-4 py-6 sm:grid-cols-[2.5rem_1fr]"
              >
                <Icon
                  aria-hidden="true"
                  className="h-8 w-8 text-[#266bf1]"
                  strokeWidth={1.35}
                />
                <div>
                  <h3 className="text-xl font-black text-[#100b47]">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#58647b]">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="planning"
        className="scroll-mt-8 border-y border-[#d7e3f8] bg-[#f8fbff]"
      >
        <div className="mx-auto max-w-[94rem] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:gap-16">
            <div>
              <SectionHeading
                label="London approvals"
                title="Planning, Building Regulations and Party Wall: three different questions"
              >
                Planning controls the development and external impact. Building
                Regulations address technical compliance. The Party Wall process
                protects the legal rights of building and adjoining owners. A
                basement may engage all three.
              </SectionHeading>
              <div className="mt-7 flex flex-col items-start gap-4">
                <Link
                  href="https://www.planningportal.co.uk/permission/common-projects/basements/planning-permission"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#266bf1] hover:underline"
                >
                  Read Planning Portal basement guidance
                  <ArrowIcon />
                </Link>
                <Link
                  href="https://www.gov.uk/government/publications/preventing-and-resolving-disputes-in-relation-to-party-walls/the-party-wall-etc-act-1996-explanatory-booklet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#266bf1] hover:underline"
                >
                  Read the government Party Wall guide
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="overflow-hidden border border-[#cddcf2] bg-white">
              <div className="grid grid-cols-[0.8fr_1.2fr] border-b border-[#d7e3f8] bg-[#edf4ff] px-5 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#266bf1]">
                <p>Project situation</p>
                <p>Early planning guidance</p>
              </div>
              {planningRows.map((row) => (
                <div
                  key={row.situation}
                  className="grid gap-3 border-b border-[#e4ebf7] px-5 py-5 last:border-b-0 md:grid-cols-[0.8fr_1.2fr] md:gap-8"
                >
                  <h3 className="font-bold leading-6 text-[#100b47]">
                    {row.situation}
                  </h3>
                  <p className="text-sm leading-7 text-[#59667e]">{row.guidance}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 border-l-4 border-[#266bf1] bg-white p-6 md:p-8">
            <h3 className="text-xl font-black text-[#100b47]">
              Why borough context matters
            </h3>
            <p className="mt-3 max-w-5xl text-base leading-8 text-[#55617a]">
              London boroughs can set their own basement policies and submission
              requirements. Conservation areas, listed buildings, trees, flood and
              groundwater conditions, construction management, highways access and
              neighbour amenity may all influence the application. We treat an
              address-specific planning check as an early feasibility task, not a
              box to tick after the design is finished.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[94rem] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div className="relative min-h-[440px] overflow-hidden border border-[#d7e3f8]">
            <Image
              src="/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-room.webp"
              alt="Completed Better Homes living room demonstrating interior fit-out quality"
              fill
              sizes="(max-width: 1024px) 90vw, 52vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              label="Design the life above the technical work"
              title="Make the new floor feel like part of the home"
            >
              The structure and waterproofing make the space possible. Layout,
              light, acoustics, storage, material choices and the connection to the
              floors above make it somewhere you actually want to use.
            </SectionHeading>
            <ul className="mt-8 grid gap-0 border-y border-[#d7e3f8] sm:grid-cols-2">
              {useIdeas.map((idea, index) => (
                <li
                  key={idea}
                  className={`flex min-h-20 items-center gap-3 py-4 text-sm font-bold leading-6 text-[#3f4d67] sm:px-4 ${
                    index % 2 === 1 ? "sm:border-l sm:border-[#d7e3f8]" : ""
                  } ${index > 1 ? "border-t border-[#d7e3f8]" : ""}`}
                >
                  <Check
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[#266bf1]"
                    strokeWidth={2}
                  />
                  {idea}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d7e3f8] bg-white">
        <div className="mx-auto max-w-[94rem] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-center lg:gap-16">
            <SectionHeading title="Confidence is built on visible work.">
              Our online portfolio currently shows the wider design, construction
              and finish standard we bring to major London home projects. We will
              never present an unrelated project as a basement case study; during
              consultation, ask us for the most relevant scope and delivery
              evidence available for your brief.
            </SectionHeading>
            <div className="relative min-h-[360px] overflow-hidden border border-[#d7e3f8]">
              <Image
                src="/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp"
                alt="Completed Better Homes extension and renovation in N19"
                fill
                sizes="(max-width: 1024px) 90vw, 58vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-12 grid border-y border-[#d7e3f8] sm:grid-cols-2 lg:grid-cols-4">
            {proofPoints.map((point, index) => (
              <div
                key={point.value}
                className={`py-7 sm:px-6 ${
                  index % 2 === 1 ? "sm:border-l sm:border-[#d7e3f8]" : ""
                } ${index > 1 ? "border-t border-[#d7e3f8] lg:border-t-0" : ""} ${
                  index > 0 ? "lg:border-l lg:border-[#d7e3f8]" : ""
                }`}
              >
                <p className="text-3xl font-black tracking-[-0.04em] text-[#266bf1]">
                  {point.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#55617a]">
                  {point.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <TextLink href="/portfolio">Explore our London project portfolio</TextLink>
          </div>
        </div>
      </section>

      <section
        id="areas"
        className="mx-auto max-w-[94rem] scroll-mt-8 px-5 py-16 sm:px-8 lg:px-12 lg:py-24"
      >
        <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16">
          <SectionHeading
            label="Local service"
            title="Basement conversion specialists across London"
          >
            Basements are intensely local projects. Borough policy, street access,
            neighbouring structures, conservation context and ground conditions
            can all influence the right route. We assess fit before promising a
            delivery plan.
          </SectionHeading>

          <div className="grid border-y border-[#d7e3f8] md:grid-cols-3">
            {serviceAreaGroups.map((group, index) => (
              <article
                key={group.region}
                className={`py-7 md:px-7 ${
                  index > 0 ? "border-t border-[#d7e3f8] md:border-l md:border-t-0" : ""
                }`}
              >
                <h3 className="text-xl font-black text-[#100b47]">{group.region}</h3>
                <p className="mt-3 text-sm leading-7 text-[#657087]">
                  {group.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {group.areas.map(([name, slug]) => (
                    <li key={slug}>
                      <Link
                        href={`/locations/${slug}`}
                        className="text-sm font-bold text-[#3f4d67] transition hover:text-[#266bf1]"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="scroll-mt-8 border-y border-[#d7e3f8] bg-[#f8fbff]"
      >
        <div className="mx-auto max-w-[94rem] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16">
            <div>
              <SectionHeading title="Basement conversion questions, answered clearly.">
                Straight answers about cost, planning, programme, waterproofing and
                living through the work. Your property still needs its own
                professional assessment.
              </SectionHeading>
              <div className="mt-7">
                <PrimaryButton>Discuss your basement project</PrimaryButton>
              </div>
            </div>

            <div className="divide-y divide-[#cddcf2] border-y border-[#cddcf2]">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-bold leading-7 text-[#100b47] marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#266bf1]">
                    {faq.question}
                    <span className="relative h-5 w-5 shrink-0" aria-hidden="true">
                      <span className="absolute left-0 top-[9px] h-[2px] w-5 bg-[#266bf1]" />
                      <span className="absolute left-[9px] top-0 h-5 w-[2px] bg-[#266bf1] transition group-open:rotate-90 group-open:opacity-0" />
                    </span>
                  </summary>
                  <p className="max-w-3xl pb-6 pr-8 text-base leading-8 text-[#55617a]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#100b47] text-white">
        <div className="mx-auto grid max-w-[94rem] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12 lg:py-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black leading-tight tracking-[-0.035em] text-white md:text-5xl">
              Start with feasibility, not guesswork.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#d6def6]">
              Tell us about your property, what you want the space to do and any
              drawings or surveys you already have. We will help you identify the
              most sensible next step.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <PrimaryButton>Book your basement consultation</PrimaryButton>
            <Link
              href="tel:07922391591"
              className="inline-flex min-h-14 items-center justify-center gap-2 border-b border-[#6fa1ff] px-2 font-bold text-[#9ec1ff] transition hover:border-white hover:text-white"
            >
              <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
              07922 391591
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              localBusinessSchema,
              serviceSchema,
              webpageSchema,
              breadcrumbSchema,
              faqSchema,
            ],
          }),
        }}
      />
    </main>
  );
}
