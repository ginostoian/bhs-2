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

const heroProofPoints = [
  "Projects from £20,000",
  "Design, supply & install",
  "Installation-only also available",
];

const quickAnswerItems = [
  {
    label: "Typical budget",
    value: "£12,000 to £60,000+",
    detail:
      "Depends on kitchen size, cabinetry level, worktops, appliances and whether layout or structural changes are involved.",
  },
  {
    label: "Installation phase",
    value: "Typically 3 to 6 weeks",
    detail:
      "Straight installations move faster. Structural work, lead times and layout changes can extend the overall programme.",
  },
  {
    label: "Starting point",
    value: "From around £20,000",
    detail:
      "That is where many London kitchens start once you want a properly coordinated design, quality installation and a result that feels built to last.",
  },
  {
    label: "Delivery model",
    value: "Design-build or installation-only",
    detail:
      "We can manage the whole route or step in as the build team if your design and supply choices are already made.",
  },
];

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

const deliveryModels = [
  {
    title: "Full design, supply and install",
    body:
      "Best when you want one accountable team to coordinate the layout, technical planning, procurement input, installation and final finish. It reduces disconnects between what was drawn, what was ordered and what gets built.",
  },
  {
    title: "Installation-only",
    body:
      "Best when your kitchen has already been designed and sourced, but you still want an experienced team to install it properly, coordinate the trades and protect the finish quality on site.",
  },
];

const featuredProject = {
  title: "High-spec kitchen renovation and installation in E3",
  summary:
    "This project works as the lead proof block because it shows what serious kitchen clients care about: clean coordination, practical performance, finish quality and a process that feels controlled rather than chaotic.",
  image: "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-1.webp",
  imageAlt: "High-spec kitchen renovation and installation in E3",
  badge: "Kitchen renovation",
  location: "E3, East London",
  price: "Typical investment: £20,000 to £35,000",
  timeline: "Typical programme: 4 to 6 weeks",
  quote:
    "The process was very smooth for a detailed kitchen project and the quality is excellent.",
  author: "Lawrence, E3",
  href: "/portfolio/lawrence-e3",
  bullets: [
    "Layout optimisation and coordinated kitchen programme",
    "Cabinetry, worktops, appliances and finishing delivered as one scope",
    "Clear stage approvals to keep quality and expectations aligned",
  ],
};

const supportingProjects = [
  {
    title: "Modern kitchen renovation and installation in E4",
    image: "/assets/portfolio/kitchen-alice-e4/kitchen-renovation-e4-2.webp",
    imageAlt: "Modern kitchen renovation and installation in E4",
    badge: "Kitchen renovation",
    location: "E4, East London",
    price: "Typical investment: £20,000 to £35,000",
    timeline: "Typical programme: 4 to 5 weeks",
    quote:
      "The kitchen feels both beautiful and practical. The team delivered to a high standard and kept communication clear.",
    author: "Alice, E4",
    href: "/portfolio/alice-e4",
  },
  {
    title: "Kitchen renovation in E10",
    image: "/assets/portfolio/kitchen-phil-e10/phil-kitchen-e10-3.webp",
    imageAlt: "Kitchen renovation in E10",
    badge: "Kitchen renovation",
    location: "E10, East London",
    price: "Typical investment: £18,000 to £30,000",
    timeline: "Typical programme: 3 to 5 weeks",
    quote:
      "The work was executed to a very high standard and the end result exceeded expectations.",
    author: "Phil, E10",
    href: "/portfolio/phil-e10",
  },
];

const kitchenTestimonials = [
  {
    name: "Alice Buchanan",
    quote:
      "I had our kitchen redone and couldn’t be happier! Celino’s team were amazing from start to finish. They worked so incredibly hard to get everything completed within time and at a high standard.",
    sourceLabel: "Client review",
    sourceUrl: "/locations/hackney",
    outcome: "Kitchen completed on time and to a high standard",
  },
  {
    name: "Lawrence, E3",
    quote:
      "The process was very smooth for a detailed kitchen project and the quality is excellent.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/1789847/better-homes-studio-review",
    outcome: "Detailed kitchen project handled smoothly",
  },
  {
    name: "Alice, E4",
    quote:
      "The kitchen feels both beautiful and practical. The team delivered to a high standard and kept communication clear.",
    sourceLabel: "Client review",
    sourceUrl: "/portfolio/alice-e4",
    outcome: "Beauty and practicality delivered together",
  },
];

const processSteps = [
  {
    title: "Define the right kitchen brief",
    body:
      "We start by getting clear on how you cook, store, host and move through the room, so the design solves real frustrations rather than just changing the look.",
  },
  {
    title: "Plan the layout and technical scope",
    body:
      "Cabinetry, appliances, electrics, plumbing, extraction, lighting and finishes all need to work together before installation starts.",
  },
  {
    title: "Prepare the room properly",
    body:
      "Strip-out, making-good and first-fix work come before the visual transformation. This is what protects the quality of the install later.",
  },
  {
    title: "Install with controlled sequencing",
    body:
      "Units, worktops, appliances, tiling and decorating are sequenced carefully so tolerances stay tight and the finish quality does not drift.",
  },
  {
    title: "Snag and hand over properly",
    body:
      "A kitchen should be handed over feeling complete, aligned and ready to use, not waiting on a tail of small fixes.",
  },
];

const guideLinks = [
  {
    title: "Kitchen renovation guide for London homeowners",
    description:
      "The broad guide to layouts, budgets, material choices and planning a kitchen that works beyond the moodboard stage.",
    href: "/blog/kitchen-renovation-full-guide-2025",
  },
  {
    title: "Kitchen providers comparison guide",
    description:
      "Useful if you are comparing suppliers and want a clearer sense of what changes between design-led and price-led kitchen routes.",
    href: "/blog/kitchen-providers-comparison-guide",
  },
  {
    title: "Home renovation cost guide",
    description:
      "Helpful if your kitchen project may expand into wider refurbishment, service upgrades or layout changes elsewhere in the home.",
    href: "/blog/home-renovation-cost-london-2026",
  },
];

const pageUrl = `${SITE_URL}/kitchen-renovation`;

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
  const faqs = getPageFaqs("kitchen");

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
            "Kitchen renovation services across London including design, supply, installation, layout reconfiguration and final finishing.",
        }),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Kitchen Renovation London",
        isPartOf: getWebsiteReference(),
        about: {
          "@id": BUSINESS_IDS.localBusiness,
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        serviceType: "Kitchen Renovation London",
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
        title="Design and build a kitchen that works properly. "
        titleAccent="Without managing the moving parts yourself."
        subtitle="For London homeowners who want more than a simple swap-out, we manage kitchen design, supply, installation, services coordination and finishing under one accountable team. Kitchen renovation projects typically start from around £20,000."
        heroCTA="Book your kitchen consultation"
        heroImgUrl="/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-1.webp"
        ctaTallyFormLink="/kitchen-renovation-form"
        proofPoints={heroProofPoints}
      />

      <SocialProof />

      <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="overflow-hidden rounded-2xl border border-[#d8e4fb] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef5ff] p-6 shadow-sm md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Quick Answer"
                title="A good kitchen renovation improves how the room performs, not just how it photographs"
                description="The strongest kitchen projects fix layout frustration, storage pressure, lighting, flow and finishing quality together, so the room becomes easier to use every day."
              />
              <div className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm">
                <p className="text-lg leading-8 text-[#2f3c52]">
                  <strong className="text-[#100b47]">Direct answer:</strong> most
                  London kitchen renovations sit between{" "}
                  <strong className="text-[#100b47]">£12,000 and £60,000+</strong>,
                  with many serious design-led projects starting from around{" "}
                  <strong className="text-[#100b47]">£20,000</strong>. Installation
                  is typically 3 to 6 weeks, but the right route depends on
                  whether you are keeping the layout, redesigning the room, or
                  combining the kitchen with wider structural change.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-[#cfe0ff] bg-white p-6 shadow-sm">
                <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#266bf1]">
                  Conversion Tool
                </p>
                <h3 className="mt-3 text-2xl font-black text-[#100b47]">
                  Want a fast kitchen budget range before you enquire?
                </h3>
                <p className="mt-3 text-base leading-8 text-gray-700">
                  Use the kitchen cost calculator to get a realistic starting range
                  before you commit time to drawings, supplier visits or the wrong
                  design direction.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/kitchen-calculator"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#266bf1] px-6 text-sm font-bold text-white transition hover:bg-[#1449B0]"
                  >
                    Use kitchen cost calculator
                  </Link>
                  <Link
                    href="/kitchen-renovation-form"
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
          title="What is included in a kitchen renovation"
          description="This is the real work behind a finished kitchen. It is not just cabinets going in. It is coordination across services, layout, installation and finishing."
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
          title="Kitchen renovation cost ranges in London"
          description="Use these guide ranges to narrow down which type of kitchen project is actually realistic for your budget before you fall in love with the wrong scheme."
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

      <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <SectionHeading
          eyebrow="Delivery Model"
          title="Design and build versus installation-only"
          description="Both routes can work. The right choice depends on how much is already resolved before site starts and how much coordination you want to own yourself."
          centered
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {deliveryModels.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm"
            >
              <h3 className="text-3xl font-black text-[#100b47]">{item.title}</h3>
              <p className="mt-4 text-base leading-8 text-gray-700">{item.body}</p>
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
                title="Kitchen projects that show both finish quality and control"
                description="The best kitchen proof is specific. It should show that the room works better, the detailing is clean, and the installation did not unravel into stress."
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
          title="Kitchen-specific reviews, not generic praise"
          description="These are the kinds of comments that matter before you commit: timing, finish quality, practicality and whether the experience felt controlled."
          centered
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {kitchenTestimonials.map((testimonial) => {
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
            title="How we keep kitchen projects organised"
            description="Kitchen projects usually become stressful when the design, supplier choices and installation are not properly coordinated. This process is designed to stop that happening."
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
          title="The kitchen guides worth reading before you commit"
          description="If you are still comparing suppliers, budgets or whether the project may grow into wider renovation work, start here."
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
              If the kitchen is the room that keeps frustrating you, start with a realistic conversation
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-700">
              A useful first conversation should tell you what kind of kitchen
              project makes sense for the room, what budget band is realistic, and
              whether a simple installation or a more coordinated design-build route
              is the better fit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/kitchen-renovation-form"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-[#266bf1] px-6 text-base font-bold text-white transition hover:bg-[#1449B0]"
              >
                Book your kitchen consultation
              </Link>
              <Link
                href="/kitchen-calculator"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-[#bfd3f9] bg-white px-6 text-base font-bold text-[#266bf1] transition hover:border-[#266bf1]"
              >
                Use the kitchen calculator first
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
