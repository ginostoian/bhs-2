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
    "Home Renovation London | Full Refurbishment & Fit-Out | Better Homes Studio",
  description:
    "Full home renovation and refurbishment in London with one team managing structural work, rewiring, plumbing, kitchens, bathrooms, finishes and handover.",
  canonicalUrlRelative: "/general-renovation",
  openGraph: {
    title:
      "Home Renovation London | Full Refurbishment & Fit-Out | Better Homes Studio",
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

const heroProofPoints = [
  "Projects typically from £80,000",
  "£10M insured",
  "10-year workmanship guarantee",
];

const quickAnswerItems = [
  {
    label: "Typical budget",
    value: "£80,000 to £250,000+",
    detail:
      "Depends on house size, property condition, specification level, and how much structural or systems work is involved.",
  },
  {
    label: "Cost per sqm",
    value: "£500 to £2,500+",
    detail:
      "Basic refreshes sit at the lower end. Proper full-scope renovations with systems, bathrooms, kitchen and structural work sit much higher.",
  },
  {
    label: "Typical timeline",
    value: "4 to 8 weeks on site",
    detail:
      "Typical on-site renovation duration depends on scope, access and specification. The full journey including planning and pre-construction is usually longer.",
  },
  {
    label: "Value upside",
    value: "Often 10% to 20%",
    detail:
      "A well-executed full renovation improves daily life now and can materially strengthen resale appeal later.",
  },
];

const renovationDrivers = [
  {
    title: "When room-by-room fixes stop making sense",
    body:
      "If the kitchen, bathrooms, wiring, plumbing and finishes all need attention, doing the work in separate bursts often costs more, drags on longer, and leaves the house feeling half-finished for years.",
  },
  {
    title: "When the house needs new bones, not cosmetic optimism",
    body:
      "A proper full renovation is often the right route when the real problems are hidden behind the walls: ageing electrics, tired plumbing, poor heating, awkward layout and uneven finishing standards.",
  },
  {
    title: "When you want one accountable team, not constant coordination",
    body:
      "The real value of full-scope delivery is not just convenience. It is reducing finger-pointing, missed details and the stress of managing multiple disconnected trades yourself.",
  },
];

const inclusionItems = [
  {
    title: "Structural changes and layout reworking",
    body:
      "Wall removals, openings, strengthening work and layout changes that make the house feel better organised and easier to live in.",
  },
  {
    title: "Rewiring, plumbing and heating upgrades",
    body:
      "The hidden backbone of the renovation: electrics, pipework, boilers, radiators, controls and the system upgrades older London homes often need.",
  },
  {
    title: "Kitchen and bathroom delivery",
    body:
      "Not as stand-alone projects bolted on afterwards, but as part of one joined-up renovation so the whole home feels coherent.",
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

const costNotes = [
  "Basic assumes lighter refurbishment work. It is not the right benchmark for a whole-home project that includes significant systems or structural upgrades.",
  "Mid-range is where most serious London full renovations sit once kitchens, bathrooms, rewiring, replumbing and quality finishes are included.",
  "High-end and structurally heavier projects rise quickly once bespoke joinery, premium materials, underfloor heating or major layout changes are involved.",
];

const featuredProject = {
  title: "Whole-home renovation and rear extension in N19",
  summary:
    "This is the right hero case study for the page because it shows what homeowners actually want from a serious renovation: one coordinated project, stronger flow, better light, a premium finish, and a home that feels fully resolved rather than partly upgraded.",
  image:
    "/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp",
  imageAlt: "Whole-home renovation and rear extension case study in N19",
  badge: "Full renovation + extension",
  location: "N19, North London",
  quote:
    "The team managed the project with clarity and delivered a finish that feels premium in every room.",
  author: "N19 Homeowner",
  href: "/portfolio/daniel-n19",
  bullets: [
    "Structural work and full internal renovation under one coordinated scope",
    "Kitchen, bathrooms, joinery and finishing delivered as one coherent project",
    "Weekly updates and quality-led closeout instead of fragmented trade management",
  ],
};

const supportingTestimonials = [
  {
    name: "Perrine LeGoanvic",
    quote:
      "I came across Better Homes Studio through Houzz as I needed to fully renovate my first flat and I could honestly not recommend them enough.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/1829290/better-homes-studio-review",
    outcome: "Trusted for a first-home renovation",
  },
  {
    name: "Lawrance and Kate",
    quote:
      "This was our first renovation project in our first home, so we were quite nervous about the process, but Gino and his team made it really smooth.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/1789847/better-homes-studio-review",
    outcome: "Made a first renovation feel manageable",
  },
  {
    name: "Louise Thorogood",
    quote:
      "I could not recommend them more highly. The whole process was streamlined and efficient, with a detailed quote and a very high standard of work.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/1802745/better-homes-studio-review",
    outcome: "Detailed quote and smooth delivery",
  },
];

const processSteps = [
  {
    title: "Define the real scope before work starts",
    body:
      "The fastest way to lose control of a renovation is to start before the true scope is understood. We front-load decisions on layout, systems, finishes and budget so the project has a stable base.",
  },
  {
    title: "Survey, design and technical coordination",
    body:
      "Structural changes, M&E upgrades, kitchens, bathrooms and finishes all need to work together on paper before they try to work together on site.",
  },
  {
    title: "Strip-out and backbone works",
    body:
      "The early phase is usually where the hidden truth of the house reveals itself. We deal with the essential systems and enabling works first so the visible finish is built on something sound.",
  },
  {
    title: "Build, fit-out and finishing",
    body:
      "Once the heavy work is under control, the project moves through kitchens, bathrooms, joinery, flooring, decoration and the detail work that shapes how the home ultimately feels.",
  },
  {
    title: "Snagging and handover",
    body:
      "A whole-home renovation should not end in fatigue. We close it out with proper snagging, clear communication and a handover you can feel confident living with.",
  },
];

const guideLinks = [
  {
    title: "Home renovation cost in London: the complete 2026 price guide",
    description:
      "The clearest starting point if you need to understand realistic London renovation budgets, hidden costs, timelines and scope levels.",
    href: "/blog/home-renovation-cost-london-2026",
  },
  {
    title: "How to finance a renovation in London",
    description:
      "Useful if you are weighing savings, remortgaging, further advances and the financial logic of improving versus moving.",
    href: "/blog/how-to-finance-house-extension-renovation-london-2026",
  },
  {
    title: "Property buying checklist for London in 2026",
    description:
      "Read this if you are still deciding whether to renovate your current home or buy a different property and improve that instead.",
    href: "/blog/property-buying-checklist-london-2026",
  },
];

const pageUrl = `${SITE_URL}/general-renovation`;

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
  const faqs = getPageFaqs("renovation");

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
            "Full home renovation and refurbishment services across London including structural work, rewiring, plumbing, kitchens, bathrooms and full interior finishing.",
        }),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Home Renovation London",
        isPartOf: getWebsiteReference(),
        about: {
          "@id": BUSINESS_IDS.localBusiness,
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        serviceType: "Full Home Renovation London",
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
        title="Renovate the whole home properly. "
        titleAccent="Without managing five different contractors."
        subtitle="For London homeowners planning a true full renovation, we manage structural work, rewiring, plumbing, kitchens, bathrooms, finishes and handover under one accountable team. Whole-home renovation projects typically start from around £80,000."
        heroCTA="Book your renovation consultation"
        heroImgUrl="/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-room.webp"
        ctaTallyFormLink="/general-renovation-form"
        proofPoints={heroProofPoints}
      />

      <SocialProof />

      <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="overflow-hidden rounded-2xl border border-[#d8e4fb] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef5ff] p-6 shadow-sm md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Quick Answer"
                title="A full renovation is about fixing the whole house, not decorating around the problems"
                description="The right whole-home renovation replaces patchwork with clarity. It deals with the layout, the systems, the finishes and the flow of the house together, so the result feels complete rather than partly improved."
              />
              <div className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm">
                <p className="text-lg leading-8 text-[#2f3c52]">
                  <strong className="text-[#100b47]">Direct answer:</strong> a
                  full home renovation in London typically costs between{" "}
                  <strong className="text-[#100b47]">£80,000 and £250,000+</strong>,
                  with light work sitting lower and high-spec or structurally
                  heavier projects going well beyond that. The most useful early
                  benchmark is cost per square metre, but the real number depends
                  on house size, systems condition, layout changes and finish level.
                </p>
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
          eyebrow="Why Full Renovation"
          title="Why homeowners choose a full renovation instead of endless piecemeal fixes"
          description="The real decision is not whether one room needs attention. It is whether the house as a whole now needs a more joined-up answer."
          centered
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {renovationDrivers.map((item) => (
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
          eyebrow="Included"
          title="What a true whole-home renovation actually includes"
          description="This page is not about a kitchen on its own or a bathroom on its own. It is about managing the full renovation scope so the home comes back together as one finished result."
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
          title="Whole-home renovation costs by house size and scope"
          description="Use these guide ranges to sense-check your budget early. They are planning-stage numbers designed to stop under-budgeting before the project starts building emotional momentum."
        />

        <div className="overflow-hidden rounded-2xl border border-[#d9e5fb] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#e9f0ff]">
              <thead className="bg-[#f8fbff]">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                    Home type
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                    Approx. size
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                    Basic
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                    Mid-range
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                    High-end
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef3ff]">
                {costRows.map((row) => (
                  <tr key={row.home}>
                    <td className="px-5 py-4 font-bold text-[#100b47]">{row.home}</td>
                    <td className="px-5 py-4 text-gray-700">{row.size}</td>
                    <td className="px-5 py-4 text-gray-700">{row.basic}</td>
                    <td className="px-5 py-4 text-gray-700">{row.mid}</td>
                    <td className="px-5 py-4 text-gray-700">{row.high}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {costNotes.map((note) => (
            <div
              key={note}
              className="rounded-2xl border border-[#d9e5fb] bg-[#f8fbff] p-5 text-sm leading-7 text-gray-700"
            >
              {note}
            </div>
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
                title="A renovation case study that shows what full-scope delivery looks like"
                description="The strongest renovation proof is not a vague promise of quality. It is a project where the structural work, interiors, systems and finishing all came together under one accountable process."
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
              {supportingTestimonials.map((testimonial) => (
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
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-[#266bf1] transition hover:text-[#1449B0]"
                    >
                      Read
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="overflow-hidden rounded-2xl bg-[#100b47] px-6 py-10 text-white md:px-10 lg:px-12 lg:py-14">
          <SectionHeading
            eyebrow="Process"
            title="How we keep full renovations organised"
            description="Full renovations become stressful when the scope is fuzzy, the systems work is underestimated, or every trade is solving only its own piece. This process is designed to stop that happening."
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
          title="The renovation guides worth reading before you commit"
          description="If you are still working out budget realism, financing or whether renovating beats moving, these are the pages most worth your time."
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
              If the house needs more than a cosmetic refresh, start with a realistic scope conversation
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-700">
              A useful first conversation should tell you whether a full renovation
              is the right route, what the realistic budget range looks like, and
              which parts of the scope need to be solved together rather than room by
              room.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/general-renovation-form"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-[#266bf1] px-6 text-base font-bold text-white transition hover:bg-[#1449B0]"
              >
                Book your renovation consultation
              </Link>
              <Link
                href="/blog/home-renovation-cost-london-2026"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-[#bfd3f9] bg-white px-6 text-base font-bold text-[#266bf1] transition hover:border-[#266bf1]"
              >
                Read the full renovation guide first
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
