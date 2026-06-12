import Image from "next/image";
import Link from "next/link";

import Guarantee from "@/components/Guarantee";
import SocialProof from "@/components/socialProof/SocialProof";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { SITE_URL } from "@/libs/structuredData";

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

const pageUrl = `${SITE_URL}/house-extension`;

const trustPoints = [
  "£10M insured",
  "10-year workmanship guarantee",
  "500+ projects delivered",
  "5-star rated on Google, Houzz and MyBuilder",
  "Best of Houzz winner",
];

const valueProps = [
  {
    title: "One team, one point of responsibility",
    body:
      "We handle design, planning, structural input and construction under one roof. No gap between architect and builder for problems to fall into, and no being passed back and forth when something needs a decision.",
  },
  {
    title: "Pricing you can actually trust",
    body:
      "Clear, detailed quotes before we start, with the scope written down so everyone knows what is included. Any change is priced and agreed with you first.",
  },
  {
    title: "Weekly updates, start to finish",
    body:
      "You will always know what happened last week, what is happening next, and where the budget stands. Most extension stress comes from silence on site, so visibility is built into the process.",
  },
  {
    title: "Built to last, and guaranteed",
    body:
      "Up to a 10-year workmanship guarantee and £10M insurance cover on every project. If something is not right, we come back and put it right.",
  },
  {
    title: "Proven across London",
    body:
      "500+ completed projects, 12+ years improving London homes, a 5-star-only record across Google, Houzz and MyBuilder, and Best of Houzz recognition.",
  },
  {
    title: "Local specialists",
    body:
      "We work across East, North and Central London and understand the planning quirks, conservation areas and party-wall realities that shape local extension projects.",
  },
];

const extensionTypes = [
  {
    title: "Rear extensions",
    body:
      "We create brighter kitchen-dining and family spaces that connect the back of the house properly to the garden.",
  },
  {
    title: "Side return extensions",
    body:
      "A strong option for Victorian and Edwardian terraces where a narrow side passage can become valuable living space.",
  },
  {
    title: "Wraparound extensions",
    body:
      "For homeowners who want a larger ground-floor transformation with more width, better flow and a more generous kitchen-living space.",
  },
  {
    title: "Double-storey extensions",
    body:
      "A practical route when the brief needs meaningful extra space upstairs and downstairs, not just a bigger kitchen.",
  },
  {
    title: "Kitchen extensions",
    body:
      "Designed around the way you cook, host and live, with the structure, services and finish planned together from the start.",
  },
];

const investmentRanges = [
  {
    type: "Side return extension",
    budget: "£35,000 to £60,000",
    note: "Compact terrace route with meaningful ground-floor impact.",
  },
  {
    type: "Single-storey rear extension",
    budget: "£50,000 to £95,000",
    note: "Common kitchen-dining and garden-connection project.",
  },
  {
    type: "Wraparound extension",
    budget: "£75,000 to £140,000",
    note: "Larger ground-floor transformation with more structural work.",
  },
  {
    type: "Kitchen extension with fit-out",
    budget: "£80,000 to £160,000",
    note: "Extension plus kitchen, services and finishing scope.",
  },
  {
    type: "Double-storey extension",
    budget: "£100,000 to £200,000+",
    note: "More involved project adding space across two floors.",
  },
];

const projects = [
  {
    title: "Rear extension and whole-home transformation in N19",
    location: "N19, North London",
    type: "Rear extension + full renovation",
    image:
      "/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp",
    imageAlt: "Rear extension and open-plan kitchen living space in N19",
    summary:
      "A calmer layout, better natural light and a connected kitchen-living space that made the whole home work properly together.",
    quote:
      "The team managed the project with clarity and delivered a finish that feels premium in every room.",
    author: "N19 Homeowner",
    href: "/portfolio/daniel-n19",
  },
  {
    title: "Side return kitchen extension in E7",
    location: "E7, East London",
    type: "Side return extension",
    image: "/assets/portfolio/extension-ava-e7/side-return-extension-6.webp",
    imageAlt: "Side return kitchen extension in E7",
    summary:
      "A narrow galley layout became a brighter, more usable family kitchen with a stronger connection to the garden.",
    quote:
      "The extension has transformed how we use the house day to day and the finish feels genuinely premium.",
    author: "E7 Homeowner",
    href: "/portfolio/ava-e7",
  },
  {
    title: "Kitchen extension and renovation in N8",
    location: "N8, North London",
    type: "Extension + renovation",
    image: "/assets/portfolio/extension-james-n8/extension-james-1.webp",
    imageAlt: "Kitchen extension and renovation in N8",
    summary:
      "A structural extension project that created a larger, brighter and more sociable kitchen-living zone.",
    quote:
      "The build was organised, communication was clear, and the transformation feels substantial.",
    author: "N8 Homeowner",
    href: "/portfolio/james-n8",
  },
];

const processSteps = [
  {
    title: "Feasibility",
    body:
      "We pressure-test the property, planning route, likely constraints and budget before drawings gather momentum.",
  },
  {
    title: "Design",
    body:
      "The extension is planned around light, flow, storage, structure and how you actually want to live in the space.",
  },
  {
    title: "Approvals",
    body:
      "Planning, permitted development, building regulations, structural input and party-wall steps are coordinated before site starts.",
  },
  {
    title: "Build with visibility",
    body:
      "Once work begins, you get weekly updates on progress, decisions, programme and budget so the project stays legible.",
  },
];

const serviceAreaGroups = [
  {
    region: "Central and selected West London",
    description:
      "For larger design-and-build projects in central boroughs and established prime neighbourhoods.",
    areas: [
      "Central London",
      "Westminster",
      "Marylebone",
      "Mayfair",
      "Fitzrovia",
      "Bloomsbury",
      "Primrose Hill",
      "St John's Wood",
      "Maida Vale",
      "Notting Hill",
      "Kensington",
    ],
  },
  {
    region: "North and North West London",
    description:
      "Period homes, family houses and premium extension projects across the north London corridor.",
    areas: [
      "Camden",
      "Hampstead",
      "Highgate",
      "Crouch End",
      "Muswell Hill",
      "Finchley",
      "East Finchley",
      "Barnet",
      "Golders Green",
      "Islington",
      "Canonbury",
      "N8",
      "N16",
      "N19",
    ],
  },
  {
    region: "North East and East London",
    description:
      "Our strongest local patch, with deep experience in terraces, side returns and family-home extensions.",
    areas: [
      "Hackney",
      "Stoke Newington",
      "Clapton",
      "Dalston",
      "Walthamstow",
      "Leytonstone",
      "Wanstead",
      "Woodford",
      "South Woodford",
      "Chingford",
      "Loughton",
      "Chigwell",
      "E4",
      "E7",
      "E17",
    ],
  },
];

const serviceAreas = [...new Set(serviceAreaGroups.flatMap((group) => group.areas))];

const servicePostcodes = ["E4", "E7", "E17", "N8", "N16", "N19", "NW1", "NW3", "NW8", "W1", "W2", "W9"];

const schemaServiceAreas = [...new Set([...serviceAreas, ...servicePostcodes])];

const faqs = [
  {
    question: "How do I choose a house extension company in London?",
    answerText:
      "Look for a single accountable team that covers design, planning and build, so responsibility never falls between an architect and a separate contractor. Ask for a written, itemised scope and quote rather than a rough estimate, check that workmanship is genuinely guaranteed and the company is properly insured, and look at verified reviews and real completed projects in your area. At Better Homes you get all of that as standard: design-and-build delivery, transparent fixed-scope pricing, a 10-year workmanship guarantee, £10M insurance, and a 5-star-only review record across Google, Houzz and MyBuilder.",
  },
  {
    question: "Do you handle the design and planning, or only the building?",
    answerText:
      "Both. We take your project from the first feasibility conversation through concept design, planning or permitted-development applications, structural engineering and building regulations, and then the build itself, all managed by one team. That means you do not have to coordinate a separate architect, engineer and builder, and there is no finger-pointing if something needs resolving.",
  },
  {
    question: "How much does it cost to hire a design-and-build extension company in London?",
    answerText:
      "Most London extensions fall between roughly £35,000 for a side return and £200,000+ for a large double-storey project, depending on type, specification and borough. Because we include design within the overall project rather than charging a separate architect fee, the all-in number is often more competitive than it first looks. For a full breakdown, see our complete House Extension Cost Guide for London 2026.",
    link: {
      href: "/blog/house-extension-guide-2025#extension-costs",
      label: "complete House Extension Cost Guide for London 2026",
    },
  },
  {
    question: "Will my extension need planning permission?",
    answerText:
      "Many single-storey rear and side return extensions qualify for permitted development and do not need a full planning application, while wraparound, double-storey and larger schemes usually do, and conservation areas or Article 4 directions change the picture. We assess this for your specific property at the feasibility stage so there are no surprises. Our 2026 House Extension Guide explains the rules in full.",
    link: {
      href: "/blog/house-extension-guide-2025#planning-permission",
      label: "2026 House Extension Guide",
    },
  },
  {
    question: "Are you insured and is the work guaranteed?",
    answerText:
      "Yes. Every project carries up to £10M insurance cover and a workmanship guarantee of up to 10 years. If a covered issue appears after completion, we come back and fix it. You will also receive the documentation, building control sign-off and certificates, that you need if you ever sell.",
  },
  {
    question: "Which areas of London do you cover?",
    answerText:
      "We work across Central London, Westminster, Camden, North London, North East London and selected nearby West London neighbourhoods, including Marylebone, Mayfair, Hampstead, Highgate, Crouch End, Muswell Hill, Finchley, Islington, Hackney, Walthamstow, Woodford, South Woodford, Chingford, Loughton and Chigwell. If you are nearby with the right project, get in touch and we will let you know if we can help.",
  },
  {
    question: "How long does an extension take from first call to finished?",
    answerText:
      "Construction itself is typically 8 to 24 weeks depending on the type: a side return is at the shorter end, a double-storey extension at the longer. Add design, approvals and any planning period before that, and most projects run around 5 to 10 months end to end. We give you a realistic timeline up front and weekly updates throughout, so you always know where things stand.",
  },
];

function SectionHeading({ eyebrow, title, children, centered = false, dark = false }) {
  return (
    <div className={centered ? "mx-auto mb-10 max-w-3xl text-center" : "mb-10 max-w-3xl"}>
      <p
        className={`mb-3 text-sm font-extrabold uppercase tracking-[0.24em] ${
          dark ? "text-[#9ec1ff]" : "text-[#266bf1]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`text-3xl font-black leading-tight md:text-5xl ${
          dark ? "text-white" : "text-[#100b47]"
        }`}
      >
        {title}
      </h2>
      {children ? (
        <p
          className={`mt-4 text-base leading-8 md:text-lg ${
            dark ? "text-[#d6def6]" : "text-gray-700"
          }`}
        >
          {children}
        </p>
      ) : null}
    </div>
  );
}

function PrimaryButton({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-[#266bf1] px-6 text-base font-bold text-white transition hover:bg-[#1449B0]"
    >
      {children}
    </Link>
  );
}

function SecondaryButton({ href, children, dark = false }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-[56px] items-center justify-center rounded-full px-6 text-base font-bold transition ${
        dark
          ? "border border-white/25 bg-white/10 text-white hover:bg-white/15"
          : "border border-[#bfd3f9] bg-white text-[#266bf1] hover:border-[#266bf1]"
      }`}
    >
      {children}
    </Link>
  );
}

function LinkedFaqAnswer({ faq }) {
  if (!faq.link) {
    return <>{faq.answerText}</>;
  }

  const [before, after = ""] = faq.answerText.split(faq.link.label);

  return (
    <>
      {before}
      <Link className="font-semibold text-[#266bf1] hover:underline" href={faq.link.href}>
        {faq.link.label}
      </Link>
      {after}
    </>
  );
}

export default function Page() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    serviceType: "House extension design and build",
    provider: {
      "@type": ["GeneralContractor", "LocalBusiness"],
      "@id": `${SITE_URL}/#generalcontractor`,
      name: "Better Homes Studio",
      image: `${SITE_URL}/assets/logo/bh-logo.svg`,
      url: pageUrl,
      telephone: "+447922391591",
      priceRange: "£35,000-£200,000+",
      areaServed: schemaServiceAreas.map((area) => ({
        "@type": "Place",
        name: area,
      })),
      address: {
        "@type": "PostalAddress",
        addressLocality: "London",
        addressRegion: "Greater London",
        addressCountry: "GB",
      },
    },
    areaServed: "London, UK",
    description:
      "Design-and-build house extension company serving East, North and Central London. Rear, side return, wraparound and double-storey extensions managed end to end.",
    url: pageUrl,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answerText,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
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
        name: "House Extensions",
        item: pageUrl,
      },
    ],
  };

  return (
    <main>
      <section className="mx-auto grid max-w-[92%] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-20">
        <div>
          <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.24em] text-[#266bf1]">
            Design and build extensions
          </p>
          <h1 className="text-4xl font-black leading-tight text-[#100b47] md:text-6xl">
            House Extension Company London - Design &amp; Build
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-700">
            One accountable team from first sketch to final handover. We design,
            plan and build rear, side return, wraparound and double-storey
            extensions across East, North and Central London with clear scope,
            transparent pricing and weekly updates so the project never runs away
            from you.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {trustPoints.map((point) => (
              <span
                key={point}
                className="rounded-full border border-[#d9e5fb] bg-[#f8fbff] px-4 py-2 text-sm font-bold text-[#100b47]"
              >
                {point}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton href="/contact">Book your extension consultation</PrimaryButton>
            <SecondaryButton href="callto:07922391591">Call us</SecondaryButton>
          </div>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl">
          <Image
            src="/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp"
            alt="Better Homes Studio rear house extension in North London"
            fill
            priority
            sizes="(max-width: 1024px) 92vw, 44vw"
            className="object-cover"
          />
        </div>
      </section>

      <SocialProof />

      <section className="mx-auto max-w-[88%] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Why choose Better Homes"
          title="Why London homeowners choose us to build their extension"
          centered
        >
          Extending your home is one of the biggest investments you will make in
          it. The company you choose decides whether that feels like a smooth,
          well-managed project or a stressful one.
        </SectionHeading>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {valueProps.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-[#100b47]">{item.title}</h3>
              <p className="mt-4 text-base leading-8 text-gray-700">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-[#d9e5fb] bg-[#f8fbff] p-6">
          <p className="text-base leading-8 text-gray-700">
            Want to know if your extension is feasible and what it should
            realistically cost? Book a consultation and we will talk it through.
          </p>
          <div className="mt-5">
            <PrimaryButton href="/contact">Book your consultation</PrimaryButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88%] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Extension types"
          title="Extension types we build"
          centered
        >
          These are the common extension routes we deliver for London homes. For
          detailed cost, planning and design guidance, use the full guide linked
          from each route.
        </SectionHeading>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {extensionTypes.map((item) => (
            <article key={item.title} className="flex h-full flex-col rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-black text-[#100b47]">{item.title}</h3>
              <p className="mt-4 flex-1 text-base leading-8 text-gray-700">
                {item.body}
              </p>
              <Link
                href="/blog/house-extension-guide-2025"
                className="mt-5 text-sm font-bold text-[#266bf1] hover:underline"
              >
                See full costs, planning and design detail in our complete 2026
                House Extension Guide
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[88%] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeading eyebrow="Indicative investment" title="Planning-stage budget ranges">
          These are indicative planning-stage ranges only. They help you sense-check
          the order of investment before we assess your property, specification,
          access, approvals and finish level.
        </SectionHeading>
        <div className="overflow-hidden rounded-2xl border border-[#d9e5fb] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#e9f0ff]">
              <thead className="bg-[#f8fbff]">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                    Type
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                    Typical budget
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                    Planning note
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef3ff]">
                {investmentRanges.map((item) => (
                  <tr key={item.type}>
                    <td className="px-5 py-4 font-bold text-[#100b47]">{item.type}</td>
                    <td className="px-5 py-4 text-gray-700">{item.budget}</td>
                    <td className="px-5 py-4 text-gray-700">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-5 text-base leading-8 text-gray-700">
          For the full cost breakdown, per-square-metre rates, hidden costs and
          VAT, read our{" "}
          <Link
            href="/blog/house-extension-guide-2025#extension-costs"
            className="font-semibold text-[#266bf1] hover:underline"
          >
            House Extension Cost Guide for London 2026
          </Link>
          .
        </p>
      </section>

      <section className="mx-auto max-w-[88%] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeading eyebrow="Proof" title="Real extension projects">
          The best reassurance is seeing finished work in real London homes: the
          layout, the finish, the communication and the kind of problems a strong
          team knows how to prevent.
        </SectionHeading>
        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.href} className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#d9e5fb] bg-white shadow-sm">
              <div className="relative h-64">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 88vw, 29vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#f5f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                    {project.type}
                  </span>
                  <span className="rounded-full border border-[#d9e5fb] px-3 py-1 text-xs font-semibold text-gray-600">
                    {project.location}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-[#100b47]">{project.title}</h3>
                <p className="mt-4 flex-1 text-base leading-8 text-gray-700">
                  {project.summary}
                </p>
                <blockquote className="mt-5 rounded-2xl bg-[#f8fbff] p-5 text-base leading-8 text-[#2f3c52]">
                  &ldquo;{project.quote}&rdquo;
                </blockquote>
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#edf2fc] pt-4">
                  <div>
                    <p className="font-bold text-[#100b47]">{project.author}</p>
                    <p className="text-sm text-gray-500">Client testimonial</p>
                  </div>
                  <Link
                    href={project.href}
                    className="text-sm font-bold text-[#266bf1] transition hover:text-[#1449B0]"
                  >
                    View case study
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[88%] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="overflow-hidden rounded-2xl bg-[#100b47] px-6 py-10 text-white md:px-10 lg:px-12 lg:py-14">
          <SectionHeading
            eyebrow="Our process"
            title="A managed route from feasibility to handover"
            dark
          >
            We keep the commercial risks visible: scope, planning, structure,
            sequencing, budget and communication. That is what stops an extension
            becoming a stressful guessing game.
          </SectionHeading>
          <div className="grid gap-4 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#9ec1ff]">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#d6def6]">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Guarantee />

      <section className="mx-auto max-w-[88%] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Areas we serve"
          title="Extension builders across Central, North, North East and selected West London"
        >
          We focus on established London neighbourhoods where space, planning
          context, party-wall matters and access logistics need proper early
          handling. Our core patch runs from Central London and Westminster
          through Camden, Islington and North London, across to North East London
          and selected nearby west London areas for the right project.
        </SectionHeading>
        <div className="grid gap-5 lg:grid-cols-3">
          {serviceAreaGroups.map((group) => (
            <article
              key={group.region}
              className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#266bf1]">
                {group.region}
              </p>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                {group.description}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
                {group.areas.map((area) => (
                  <div key={area} className="border-t border-[#edf2fc] pt-3">
                    <p className="text-sm font-bold text-[#100b47]">{area}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-[#d9e5fb] bg-[#f8fbff] p-6">
          <div className="grid gap-4 lg:grid-cols-[0.45fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#266bf1]">
                Common postcodes
              </p>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                A quick guide to areas we regularly assess for extension work.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {servicePostcodes.map((postcode) => (
                <span
                  key={postcode}
                  className="flex min-h-11 items-center justify-center rounded-xl border border-[#d9e5fb] bg-white px-3 text-sm font-black text-[#100b47]"
                >
                  {postcode}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-[88%] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeading eyebrow="FAQ" title="House extension company questions">
          Practical answers for homeowners choosing who to hire, what is included
          and how the process works.
        </SectionHeading>
        <div className="divide-y divide-[#d9e5fb] rounded-2xl border border-[#d9e5fb] bg-white">
          {faqs.map((faq) => (
            <article key={faq.question} className="p-6 md:p-7">
              <h3 className="text-xl font-black text-[#100b47]">{faq.question}</h3>
              <p className="mt-3 text-base leading-8 text-gray-700">
                <LinkedFaqAnswer faq={faq} />
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[88%] px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="overflow-hidden rounded-2xl bg-[#100b47] p-8 text-white md:p-10 lg:p-12">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.24em] text-[#9ec1ff]">
              Ready to talk about your extension?
            </p>
            <h2 className="text-3xl font-black leading-tight md:text-5xl">
              Get an honest view on what is feasible, what it may cost and the
              best route to get there
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#d6def6]">
              Tell us about your home and what you are hoping to achieve. We will
              give you a realistic view of the scope, budget and next steps with
              no pressure and no jargon.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryButton href="/contact">Book your consultation</PrimaryButton>
              <SecondaryButton href="callto:07922391591" dark>
                Call us
              </SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
}
