import Image from "next/image";
import Link from "next/link";

import FAQ from "@/components/FAQ";
import Guarantee from "@/components/Guarantee";
import Hero from "@/components/hero/Hero";
import SocialProof from "@/components/socialProof/SocialProof";
import config from "@/config";
import { getPageFaqs } from "@/libs/pageFaqs";
import { getSEOTags } from "@/libs/seo";
import {
  BUSINESS_IDS,
  SITE_URL,
  getLocalBusinessSchema,
  getWebsiteReference,
} from "@/libs/structuredData";

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

const heroProofPoints = [
  "Projects from £12,000",
  "Design, supply & install",
  "Typical installations in 2 to 4 weeks",
];

const quickAnswerItems = [
  {
    label: "Typical budget",
    value: "£6,000 to £35,000+",
    detail:
      "Depends on bathroom size, layout changes, tiling scope, fixture level and whether the project is a standard bathroom, en-suite or wet room.",
  },
  {
    label: "Mid-range sweet spot",
    value: "£12,000 to £20,000",
    detail:
      "That is where many London homeowners land once they want a proper redesign, quality finishes and a bathroom that feels clearly better to use.",
  },
  {
    label: "Typical timeline",
    value: "Usually 2 to 4 weeks",
    detail:
      "More complex wet rooms, premium detailing or multi-bathroom projects can take longer, but most bathroom installations sit within that range.",
  },
  {
    label: "Starting point",
    value: "From around £12,000",
    detail:
      "That is the realistic entry point for many full bathroom renovations once design, installation quality and proper finishing matter.",
  },
];

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

const featuredProject = {
  title: "Bathroom design and renovation in E7",
  summary:
    "This project is the right lead proof for the page because it shows what a serious bathroom client actually wants: calm design, durable technical execution and a result that feels materially better every time the room is used.",
  image: "/assets/portfolio/bathroom-melina-e7/melina-bathroom-e7-1.webp",
  imageAlt: "Bathroom design and renovation in E7",
  badge: "Bathroom renovation",
  location: "E7, East London",
  price: "Typical investment: £20,000 to £35,000+",
  timeline: "Typical programme: 3 to 4 weeks",
  quote:
    "I couldn’t be happier with my kitchen and bathroom renovation. The better homes managed to bring my vision to life, I still can’t believe it is the same house.",
  author: "Melina",
  href: "/portfolio/melina-e7",
  bullets: [
    "Full strip-out, redesign and premium finish coordination",
    "Waterproofing, fixtures and finishes handled as one integrated scope",
    "Luxury feel delivered without sacrificing practical daily use",
  ],
};

const supportingProjects = [
  {
    title: "Two bathroom renovations in E9",
    image:
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-green-11.webp",
    imageAlt: "Two bathroom renovations in E9",
    badge: "Two bathroom renovations",
    location: "E9, East London",
    price: "Typical investment: £20,000 to £35,000+",
    timeline: "Typical programme: 4 to 6 weeks",
    quote:
      "The workmanship was excellent across both bathrooms and the team handled the complexity with confidence.",
    author: "E9 Homeowner",
    href: "/portfolio/karim-e9",
  },
  {
    title: "Premium bathroom finish in N19",
    image:
      "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-front-view.webp",
    imageAlt: "Premium bathroom finish in N19",
    badge: "Bathroom within full renovation",
    location: "N19, North London",
    price: "Typical investment: £12,000 to £20,000",
    timeline: "Typical programme: 2 to 4 weeks",
    quote:
      "The team managed the project with clarity and delivered a finish that feels premium in every room.",
    author: "N19 Homeowner",
    href: "/portfolio/daniel-n19",
  },
];

const bathroomTestimonials = [
  {
    name: "Melina",
    quote:
      "I couldn’t be happier with my kitchen and bathroom renovation. The better homes managed to bring my vision to life, I still can’t believe it is the same house.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/2008037/better-homes-studio-review",
    outcome: "Vision translated into a finished room",
  },
  {
    name: "Lawrance and Kate",
    quote:
      "We worked with Gino to make our dream bathroom into a reality. This was our first renovation project in our first home, so we were quite nervous about the process, but Gino and his team made it really smooth.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/1789847/better-homes-studio-review",
    outcome: "Made a first bathroom renovation feel smooth",
  },
  {
    name: "E9 Homeowner",
    quote:
      "The workmanship was excellent across both bathrooms and the team handled the complexity with confidence.",
    sourceLabel: "Client review",
    sourceUrl: "/portfolio/karim-e9",
    outcome: "Consistent quality across two bathrooms",
  },
];

const processSteps = [
  {
    title: "Define the right bathroom brief",
    body:
      "We start with how the room needs to function day to day, not just what style people like online. That shapes the right layout, fittings and finish level.",
  },
  {
    title: "Plan layout, services and materials",
    body:
      "Bathroom projects depend on good coordination between waterproofing, plumbing, electrics, tiling and fixture choices before work starts.",
  },
  {
    title: "Strip out and prep properly",
    body:
      "The hidden prep work is what determines long-term durability. This phase matters as much as the visible finish.",
  },
  {
    title: "Install with technical discipline",
    body:
      "The room is built back through first-fix, waterproofing, tiling, second-fix and final finishing in the right order to protect quality.",
  },
  {
    title: "Snag and hand over with confidence",
    body:
      "A bathroom should be handed over feeling watertight, precise and fully resolved, not left with the sort of little issues that become expensive later.",
  },
];

const guideLinks = [
  {
    title: "Bathroom renovation trends in London for 2026",
    description:
      "Useful if you want inspiration that still stays grounded in practical design, material choices and London renovation realities.",
    href: "/blog/bathroom-renovation-london-trends-2026",
  },
  {
    title: "Bathroom renovation cost guide",
    description:
      "The clearest starting point if you want more depth on realistic price bands, cost drivers and how to budget properly.",
    href: "/blog/bathroom-renovation-cost-2025",
  },
  {
    title: "How to choose your bathroom fitter",
    description:
      "Read this if you want to understand what separates a trustworthy installation partner from a quote that only looks attractive upfront.",
    href: "/blog/how-to-choose-a-bathroom-fitter",
  },
];

const pageUrl = `${SITE_URL}/bathroom-renovation`;

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  dark = false,
}) {
  return (
    <div
      className={
        centered
          ? "mx-auto mb-10 max-w-3xl text-center lg:mb-14"
          : "mb-10 max-w-3xl lg:mb-14"
      }
    >
      <p
        className={`mb-3 text-sm font-extrabold uppercase tracking-[0.24em] ${
          dark ? "text-[#9ec1ff]" : "text-[#266bf1]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`text-4xl font-black md:text-6xl md:leading-tight ${
          dark ? "text-white" : "text-[#100b47]"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-4 text-lg leading-relaxed md:text-xl ${
          dark ? "text-[#d6def6]" : "text-gray-600"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function AnswerCard({ label, value, detail }) {
  return (
    <article className="rounded-2xl border border-[#d9e5fb] bg-white p-5 shadow-sm">
      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#266bf1]">
        {label}
      </p>
      <h3 className="mt-3 text-2xl font-black leading-tight text-[#100b47]">
        {value}
      </h3>
      <p className="mt-3 text-sm leading-7 text-gray-600">{detail}</p>
    </article>
  );
}

export default function Page() {
  const faqs = getPageFaqs("bathroom");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...getLocalBusinessSchema({
          description:
            "Bathroom renovation services across London including design, supply, waterproofing, installation and finishing.",
        }),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Bathroom Renovation London",
        isPartOf: getWebsiteReference(),
        about: {
          "@id": BUSINESS_IDS.localBusiness,
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        serviceType: "Bathroom Renovation London",
        provider: {
          "@id": BUSINESS_IDS.localBusiness,
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "London",
          addressCountry: "GB",
        },
        url: pageUrl,
      },
      faqSchema,
    ],
  };

  return (
    <main>
      <Hero
        title="Build a bathroom that feels calmer, smarter and easier to live with. "
        titleAccent="Without cutting corners where it matters."
        subtitle="For London homeowners planning more than a simple cosmetic update, we manage bathroom design, supply, waterproofing, installation and final finishing under one accountable team. Full bathroom renovation projects typically start from around £12,000."
        heroCTA="Book your bathroom consultation"
        heroImgUrl="/assets/portfolio/bathroom-melina-e7/melina-bathroom-e7-1.webp"
        ctaTallyFormLink="/bathroom-renovation-form"
        proofPoints={heroProofPoints}
      />

      <SocialProof />

      <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="overflow-hidden rounded-2xl border border-[#d8e4fb] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef5ff] p-6 shadow-sm md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Quick Answer"
                title="A good bathroom renovation is about technical quality as much as style"
                description="The strongest bathroom projects feel calm and beautiful on the surface because the hidden work underneath has been handled properly: waterproofing, services, sequencing and finish discipline."
              />
              <div className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm">
                <p className="text-lg leading-8 text-[#2f3c52]">
                  <strong className="text-[#100b47]">Direct answer:</strong> most
                  London bathroom renovations sit between{" "}
                  <strong className="text-[#100b47]">£6,000 and £35,000+</strong>,
                  with many serious design-led bathrooms starting from around{" "}
                  <strong className="text-[#100b47]">£12,000</strong>. Most
                  installations take 2 to 4 weeks, but the right budget and timeline
                  depend on the size of the room, the amount of layout change and the
                  finish level you are aiming for.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-[#cfe0ff] bg-white p-6 shadow-sm">
                <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#266bf1]">
                  Conversion Tool
                </p>
                <h3 className="mt-3 text-2xl font-black text-[#100b47]">
                  Want a fast bathroom budget range before you enquire?
                </h3>
                <p className="mt-3 text-base leading-8 text-gray-700">
                  Use the bathroom cost calculator to get an early range before you
                  start comparing fixtures, layouts or fitting routes on guesswork.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/tools/bathroom-cost-calculator"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#266bf1] px-6 text-sm font-bold text-white transition hover:bg-[#1449B0]"
                  >
                    Use bathroom cost calculator
                  </Link>
                  <Link
                    href="/bathroom-renovation-form"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[#bfd3f9] bg-white px-6 text-sm font-bold text-[#266bf1] transition hover:border-[#266bf1]"
                  >
                    Or book a consultation
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {quickAnswerItems.map((item) => (
                <AnswerCard key={item.label} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <SectionHeading
          eyebrow="Included"
          title="What is included in a bathroom renovation"
          description="The work that makes a bathroom last is not just the visible finish. It is the full sequence from strip-out and waterproofing through to second-fix and closeout."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {inclusionItems.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm"
            >
              <h3 className="text-2xl font-black text-[#100b47]">{item.title}</h3>
              <p className="mt-4 text-base leading-8 text-gray-700">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <SectionHeading
          eyebrow="Costs"
          title="Bathroom renovation cost ranges in London"
          description="Use these guide ranges to sense-check whether you are planning a straightforward refresh, a fuller redesign or a more premium wet-room style project."
          centered
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {costTiers.map((tier) => (
            <article
              key={tier.title}
              className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#f5f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                  {tier.price}
                </span>
                <span className="rounded-full border border-[#d9e5fb] px-3 py-1 text-xs font-semibold text-gray-600">
                  {tier.timeline}
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#100b47]">{tier.title}</h3>
              <p className="mt-4 text-base leading-8 text-gray-700">{tier.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="testimonials"
        className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      >
        <div className="overflow-hidden rounded-2xl border border-[#d8e4fb] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef5ff] p-6 shadow-sm md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <div>
              <SectionHeading
                eyebrow="Proof"
                title="Real bathroom projects that show both design intent and build quality"
                description="Bathroom clients usually want reassurance on two things at once: that the room will look good, and that the hidden technical work will be done properly enough to trust."
              />

              <article className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm lg:p-8">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src={featuredProject.image}
                    alt={featuredProject.imageAlt}
                    width={1400}
                    height={900}
                    className="h-[320px] w-full object-cover"
                  />
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f5f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                    {featuredProject.badge}
                  </span>
                  <span className="rounded-full border border-[#d9e5fb] px-3 py-1 text-xs font-semibold text-gray-600">
                    {featuredProject.location}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#d9e5fb] px-3 py-1 text-xs font-semibold text-gray-600">
                    {featuredProject.price}
                  </span>
                  <span className="rounded-full border border-[#d9e5fb] px-3 py-1 text-xs font-semibold text-gray-600">
                    {featuredProject.timeline}
                  </span>
                </div>
                <h3 className="mt-5 text-3xl font-black text-[#100b47]">
                  {featuredProject.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-gray-700">
                  {featuredProject.summary}
                </p>
                <blockquote className="mt-6 rounded-2xl bg-[#f8fbff] p-6 text-xl leading-9 text-[#2f3c52]">
                  &ldquo;{featuredProject.quote}&rdquo;
                </blockquote>
                <ul className="mt-6 space-y-3">
                  {featuredProject.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 text-sm leading-7 text-gray-700"
                    >
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#266bf1]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#edf2fc] pt-5">
                  <div>
                    <p className="font-bold text-[#100b47]">{featuredProject.author}</p>
                    <p className="text-sm text-gray-500">Client testimonial</p>
                  </div>
                  <Link
                    href={featuredProject.href}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#266bf1] transition hover:text-[#1449B0]"
                  >
                    View case study
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 15.707a1 1 0 010-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            </div>

            <div className="grid gap-5">
              {supportingProjects.map((project) => (
                <article
                  key={project.title}
                  className="rounded-2xl border border-[#d9e5fb] bg-white p-5 shadow-sm"
                >
                  <div className="relative mb-5 overflow-hidden rounded-2xl">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      width={720}
                      height={460}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#f5f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                      {project.badge}
                    </span>
                    <span className="rounded-full border border-[#d9e5fb] px-3 py-1 text-xs font-semibold text-gray-600">
                      {project.location}
                    </span>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#d9e5fb] px-3 py-1 text-xs font-semibold text-gray-600">
                      {project.price}
                    </span>
                    <span className="rounded-full border border-[#d9e5fb] px-3 py-1 text-xs font-semibold text-gray-600">
                      {project.timeline}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#100b47]">{project.title}</h3>
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
                      View
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <SectionHeading
          eyebrow="Reviews"
          title="Bathroom-specific reviews, not generic compliments"
          description="These comments do real work because they talk about bathroom outcomes, first-time nerves and whether the team made the process feel manageable."
          centered
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {bathroomTestimonials.map((testimonial) => {
            const isExternal = testimonial.sourceUrl.startsWith("http");

            return (
              <article
                key={testimonial.name}
                className="relative overflow-hidden rounded-2xl border border-[#d5e0f8] bg-white p-5 shadow-sm"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#266bf1] via-[#6da2ff] to-[#bfd7ff]" />
                <div className="mb-4 flex flex-wrap items-center gap-2 pt-2">
                  <span className="rounded-full bg-[#f5f9ff] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                    {testimonial.outcome}
                  </span>
                </div>
                <blockquote className="text-base leading-8 text-gray-700">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#edf2fc] pt-4">
                  <div>
                    <p className="font-bold text-[#100b47]">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.sourceLabel}</p>
                  </div>
                  <Link
                    href={testimonial.sourceUrl}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="text-sm font-bold text-[#266bf1] transition hover:text-[#1449B0]"
                  >
                    Read
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="overflow-hidden rounded-2xl bg-[#100b47] px-6 py-10 text-white md:px-10 lg:px-12 lg:py-14">
          <SectionHeading
            eyebrow="Process"
            title="How we keep bathroom projects organised"
            description="Bathroom projects become stressful when the waterproofing, services and finishing trades are not properly coordinated. This process is designed to keep that under control."
            dark
          />
          <div className="grid gap-4 lg:grid-cols-5">
            {processSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
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

      <FAQ content={faqs} />

      <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <SectionHeading
          eyebrow="Useful Reading"
          title="The bathroom guides worth reading before you commit"
          description="If you are still working out costs, fitter choice or what kind of bathroom design direction really makes sense, start here."
          centered
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {guideLinks.map((guide) => (
            <article
              key={guide.href}
              className="flex h-full flex-col rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm"
            >
              <h3 className="text-2xl font-black text-[#100b47]">{guide.title}</h3>
              <p className="mt-4 flex-1 text-base leading-8 text-gray-700">
                {guide.description}
              </p>
              <div className="mt-6">
                <Link
                  href={guide.href}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#266bf1] transition hover:text-[#1449B0]"
                >
                  Read guide
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 15.707a1 1 0 010-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[88%] px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
        <div className="overflow-hidden rounded-2xl border border-[#cfe0ff] bg-gradient-to-br from-[#f2f7ff] via-white to-[#eaf2ff] p-8 shadow-sm md:p-10 lg:p-12">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.24em] text-[#266bf1]">
              Next Step
            </p>
            <h2 className="text-4xl font-black text-[#100b47] md:text-5xl md:leading-tight">
              If the bathroom needs more than a cosmetic uplift, start with a realistic conversation
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-700">
              A useful first conversation should tell you what type of bathroom
              project makes sense for the room, what budget band is realistic, and
              whether the brief is heading toward a simple refresh, a fuller redesign
              or a higher-spec wet-room style transformation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/bathroom-renovation-form"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-[#266bf1] px-6 text-base font-bold text-white transition hover:bg-[#1449B0]"
              >
                Book your bathroom consultation
              </Link>
              <Link
                href="/tools/bathroom-cost-calculator"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-[#bfd3f9] bg-white px-6 text-base font-bold text-[#266bf1] transition hover:border-[#266bf1]"
              >
                Use the bathroom calculator first
              </Link>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}
