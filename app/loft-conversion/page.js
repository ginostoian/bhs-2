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

const quickAnswerItems = [
  {
    label: "Typical budget",
    value: "£45,000 to £130,000+",
    detail: "Depends on conversion type, borough, access, and finish level.",
  },
  {
    label: "Planning route",
    value: "Often permitted development",
    detail: "Flats, maisonettes, conservation areas and mansards usually need more planning work.",
  },
  {
    label: "Build phase",
    value: "8 to 16 weeks on site",
    detail: "Total journey is usually 4 to 6 months once design and approvals are included.",
  },
  {
    label: "Value upside",
    value: "Often 15% to 25%",
    detail: "A well-designed loft can add a bedroom, improve layout, and strengthen resale value.",
  },
];

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

const whyThisWorks = [
  {
    title: "Stay in the area you chose on purpose",
    body:
      "A loft conversion often gives you the extra bedroom, office or guest suite you need without walking away from your street, your school catchment, or your routines.",
  },
  {
    title: "Gain space without sacrificing the garden",
    body:
      "For many London homes, the space above your head is the least disruptive way to add meaningful square footage and keep ground-floor life intact.",
  },
  {
    title: "Create a room that changes the whole house",
    body:
      "A strong loft conversion does more than add one room. It can free up bedrooms below, improve privacy, and make the entire layout feel calmer.",
  },
];

const hiddenCostPoints = [
  "Professional fees and structural input often add 10% to 15% on top of the build cost.",
  "Party wall matters can add £1,000 to £3,000 per neighbour where required.",
  "Inner London boroughs often carry a 15% to 25% cost premium versus outer areas.",
];

const projectSpotlight = {
  title: "North East London hip-to-gable loft conversion",
  summary:
    "What makes this review strong is that it answers the questions most homeowners ask before they commit: whether the company can be trusted, whether the promised timeline is real, and whether the extra space is delivered without drama.",
  proof:
    "After comparing loft conversion companies in North East London, we chose Better Homes. The team delivered our hip-to-gable loft in 9 weeks exactly as promised.",
  name: "George G",
  sourceLabel: "Houzz Review",
  sourceUrl: "https://www.houzz.co.uk/viewReview/2013769/better-homes-studio-review",
  bullets: [
    "Project type: hip-to-gable loft conversion",
    "Outcome: extra room created without moving",
    "Most important proof point: delivered in 9 weeks as promised",
  ],
};

const supportingTestimonials = [
  {
    name: "Perrine LeGoanvic",
    quote:
      "I came across Better Homes through Houzz as I needed to fully renovate my first flat and I could honestly not recommend them enough.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/1829290/better-homes-studio-review",
  },
  {
    name: "Lawrance and Kate",
    quote:
      "This was our first renovation project in our first home, so we were quite nervous about the process, but Gino and his team made it really smooth.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/1789847/better-homes-studio-review",
  },
  {
    name: "Louise Thorogood",
    quote:
      "The whole process was streamlined and efficient, with a detailed quote and a very high standard of work.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/1802745/better-homes-studio-review",
  },
];

const processSteps = [
  {
    title: "Feasibility first",
    body:
      "Before anyone gets excited about layouts, we check head height, stair position, roof shape, planning context, and whether the loft is genuinely worth pursuing.",
  },
  {
    title: "Budget and route selection",
    body:
      "We help you compare the realistic paths available to your house so you do not over-spec the project or chase the wrong conversion type.",
  },
  {
    title: "Design, approvals and pre-construction clarity",
    body:
      "The drawings, structural decisions, approvals and sequencing need to line up before site starts. That is what keeps the build calmer later.",
  },
  {
    title: "Build with weekly updates",
    body:
      "Once work starts, you should never wonder what is happening. We keep progress visible, decisions moving and disruption as controlled as possible.",
  },
  {
    title: "Snagging and handover",
    body:
      "A loft conversion should finish with detail, not fatigue. We close out the job with checks, snagging discipline and a handover you feel good about living with.",
  },
];

const guideLinks = [
  {
    title: "Loft conversions in London: the complete 2026 guide",
    description:
      "The big-picture guide covering types, costs, timelines, ROI and common planning constraints for London homeowners.",
    href: "/blog/loft-conversions-london-complete-guide-2026",
  },
  {
    title: "Planning permission for loft conversions in London",
    description:
      "Use this if you need clarity on permitted development, conservation areas, Article 4 and when full planning becomes necessary.",
    href: "/blog/planning-permission-loft-conversion-london",
  },
  {
    title: "How to finance an extension or loft conversion in London",
    description:
      "Useful if you are comparing remortgaging, further advances, savings and the real cost of moving instead of improving.",
    href: "/blog/how-to-finance-house-extension-renovation-london-2026",
  },
  {
    title: "Loft conversion vs house extension in London",
    description:
      "Read this if you are still deciding which route gives you better value, less disruption, or more suitable space.",
    href: "/blog/loft-conversion-vs-house-extension-london",
  },
];

const pageUrl = `${SITE_URL}/loft-conversion`;

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

function LoftTypeCard({ item }) {
  return (
    <article className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#f5f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
          {item.range}
        </span>
        <span className="rounded-full border border-[#d9e5fb] px-3 py-1 text-xs font-semibold text-gray-600">
          {item.timeline}
        </span>
      </div>
      <h3 className="text-2xl font-black text-[#100b47]">{item.title}</h3>
      <p className="mt-4 text-base leading-8 text-gray-700">{item.description}</p>
      <div className="mt-5 rounded-xl bg-[#f8fbff] p-4 text-sm leading-7 text-gray-700">
        <strong className="text-[#100b47]">Planning note:</strong> {item.planning}
      </div>
    </article>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  dark = false,
}) {
  return (
    <div className={centered ? "mx-auto mb-10 max-w-3xl text-center lg:mb-14" : "mb-10 max-w-3xl lg:mb-14"}>
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

export default function Page() {
  const faqs = getPageFaqs("loft");

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
            "Loft conversion design and build services across London including dormer, hip-to-gable, mansard and rooflight loft projects.",
        }),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Loft Conversions London",
        isPartOf: getWebsiteReference(),
        about: {
          "@id": BUSINESS_IDS.localBusiness,
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        serviceType: "Loft Conversions London",
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
        title="Create the extra room your life now needs. "
        titleAccent="Without leaving the home you already love."
        subtitle="A well-planned loft conversion can give you the bedroom, office or guest suite you are missing while protecting the feel and long-term value of your home. We help London homeowners move from idea to finished space with clear guidance, practical planning and disciplined delivery."
        heroCTA="Book your loft consultation"
        heroImgUrl="extension/loft-conversion.png"
        ctaTallyFormLink="/contact"
      />

      <SocialProof />

      <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="overflow-hidden rounded-2xl border border-[#d8e4fb] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef5ff] p-6 shadow-sm md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Quick Answer"
                title="Loft conversions in London are usually worth serious attention"
                description="If your house has the height and the right roof shape, a loft conversion is often the cleanest way to add an extra bedroom, office or en-suite without losing garden space or moving house."
              />
              <div className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm">
                <p className="text-lg leading-8 text-[#2f3c52]">
                  <strong className="text-[#100b47]">
                    Direct answer:
                  </strong>{" "}
                  most London loft conversions cost between{" "}
                  <strong className="text-[#100b47]">£45,000 and £130,000+</strong>,
                  many houses can convert under permitted development, and the
                  full process usually takes{" "}
                  <strong className="text-[#100b47]">4 to 6 months</strong> once
                  design, approvals and build are all counted properly.
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
          eyebrow="Why Loft"
          title="Why loft conversions work so well in London"
          description="The best reason to convert a loft is rarely just square footage. It is what that space lets the rest of your home become."
          centered
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {whyThisWorks.map((item) => (
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
          title="Loft conversion costs by type in London"
          description="Use these numbers to sense-check affordability early and to narrow down which conversion route is realistic for your house before you start detailed design."
        />

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
                    Build phase
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                    Planning route
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef3ff]">
                {conversionTypes.map((item) => (
                  <tr key={item.title}>
                    <td className="px-5 py-4 font-bold text-[#100b47]">
                      {item.title}
                    </td>
                    <td className="px-5 py-4 text-gray-700">{item.range}</td>
                    <td className="px-5 py-4 text-gray-700">{item.timeline}</td>
                    <td className="px-5 py-4 text-gray-700">{item.planning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {hiddenCostPoints.map((point) => (
            <div
              key={point}
              className="rounded-2xl border border-[#d9e5fb] bg-[#f8fbff] p-5 text-sm leading-7 text-gray-700"
            >
              {point}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <SectionHeading
          eyebrow="Types"
          title="Which loft conversion route fits your house?"
          description="The right answer depends on your roof shape, the amount of headroom you already have, your planning context, and how much usable floor area you actually need."
          centered
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {conversionTypes.map((item) => (
            <LoftTypeCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section id="testimonials" className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="overflow-hidden rounded-2xl border border-[#d8e4fb] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef5ff] p-6 shadow-sm md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div>
              <SectionHeading
                eyebrow="Proof"
                title="What real loft reviews tend to talk about"
                description="The strongest reviews are usually specific. They mention timing, calm communication, first-time nerves, or whether the finished loft actually made life easier."
              />

              <article className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm lg:p-8">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f5f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                    9-week delivery promise kept
                  </span>
                  <span className="rounded-full border border-[#d9e5fb] px-3 py-1 text-xs font-semibold text-gray-600">
                    {projectSpotlight.sourceLabel}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-[#100b47]">
                  {projectSpotlight.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-gray-700">
                  {projectSpotlight.summary}
                </p>
                <blockquote className="mt-6 rounded-2xl bg-[#f8fbff] p-6 text-xl leading-9 text-[#2f3c52]">
                  &ldquo;{projectSpotlight.proof}&rdquo;
                </blockquote>
                <ul className="mt-6 space-y-3">
                  {projectSpotlight.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm leading-7 text-gray-700">
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#266bf1]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#edf2fc] pt-5">
                  <div>
                    <p className="font-bold text-[#100b47]">{projectSpotlight.name}</p>
                    <p className="text-sm text-gray-500">{projectSpotlight.sourceLabel}</p>
                  </div>
                  <Link
                    href={projectSpotlight.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#266bf1] transition hover:text-[#1449B0]"
                  >
                    Read review
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
                  className="rounded-2xl border border-[#d9e5fb] bg-white p-5 shadow-sm"
                >
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
            title="How we keep loft projects under control"
            description="The aim is not to drown you in process. It is to remove the points where loft conversions usually drift: feasibility, approvals, sequencing, and communication."
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
          title="The loft guides worth reading before you commit"
          description="If you are still comparing routes, these are the pages that answer the questions most London homeowners ask before they spend serious money."
          centered
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
              If loft conversion is on your shortlist, start with clarity
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-700">
              A good first conversation should tell you whether your loft is
              viable, which route fits your house, and where the major cost and
              planning variables sit. That alone can save weeks of wasted time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-[#266bf1] px-6 text-base font-bold text-white transition hover:bg-[#1449B0]"
              >
                Book your loft consultation
              </Link>
              <Link
                href="/blog/loft-conversions-london-complete-guide-2026"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-[#bfd3f9] bg-white px-6 text-base font-bold text-[#266bf1] transition hover:border-[#266bf1]"
              >
                Read the full loft guide first
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
