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
    "House Extensions London | Rear, Side Return & Double Storey | Better Homes Studio",
  description:
    "House extensions in London with clear cost guidance, planning support and disciplined build delivery. Rear, side return, wraparound and double-storey extension projects.",
  canonicalUrlRelative: "/house-extension",
  openGraph: {
    title:
      "House Extensions London | Rear, Side Return & Double Storey | Better Homes Studio",
    description:
      "Create more space, more light and more long-term value with a London extension planned properly from first feasibility through handover.",
    url: `https://${config.domainName}/house-extension`,
  },
  keywords: [
    "house extensions London",
    "rear extension London",
    "side return extension London",
    "wraparound extension London",
    "double storey extension London",
  ],
});

const quickAnswerItems = [
  {
    label: "Typical budget",
    value: "£50,000 to £200,000+",
    detail: "Depends on extension type, specification, borough, and whether the project includes a new kitchen.",
  },
  {
    label: "Planning route",
    value: "Many simpler rear extensions avoid full planning",
    detail: "Wraparounds, side extensions and many larger schemes usually need more planning work.",
  },
  {
    label: "On-site build",
    value: "12 to 24 weeks",
    detail: "Single-storey is usually shorter. Wraparound and double-storey schemes take longer.",
  },
  {
    label: "Value upside",
    value: "Often 10% to 20%",
    detail: "The best-performing extensions improve daily use now and make the home more desirable later.",
  },
];

const heroProofPoints = [
  "£10M insured",
  "10-year workmanship guarantee",
  "Weekly updates during build",
];

const extensionTypes = [
  {
    title: "Single-storey rear extension",
    range: "£50,000 to £95,000",
    timeline: "12 to 16 weeks build",
    planning: "Often permitted development if kept within depth limits",
    description:
      "The classic route when you need a larger kitchen-diner, better garden connection and more light without changing the whole house.",
  },
  {
    title: "Side return extension",
    range: "£35,000 to £60,000",
    timeline: "8 to 12 weeks build",
    planning: "Often permitted development on suitable terraces",
    description:
      "A powerful option for Victorian and Edwardian homes where a narrow side passage is holding back what the ground floor could become.",
  },
  {
    title: "Wraparound extension",
    range: "£75,000 to £140,000",
    timeline: "14 to 20 weeks build",
    planning: "Usually full planning",
    description:
      "The strongest choice when you want a real transformation of the ground floor rather than a modest gain in square footage.",
  },
  {
    title: "Double-storey extension",
    range: "£100,000 to £200,000+",
    timeline: "16 to 24 weeks build",
    planning: "Often more planning-heavy than single-storey routes",
    description:
      "Best when one extra room is not enough and you want meaningful space both downstairs and upstairs in one project.",
  },
  {
    title: "Kitchen extension with fit-out",
    range: "£80,000 to £160,000 all-in",
    timeline: "12 to 20 weeks build",
    planning: "Depends on whether the structural route is rear, side return or wraparound",
    description:
      "Ideal when the real goal is not just an extension, but a large open-plan kitchen-living space that changes how the whole house works.",
  },
];

const whyExtend = [
  {
    title: "Stay in the area that already works for you",
    body:
      "For many London families, the real win is not just extra square metres. It is avoiding the cost, disruption and compromise of moving when the right street, school run or neighbourhood is already in place.",
  },
  {
    title: "Fix the ground floor that is wearing you down",
    body:
      "Most extensions are really about one thing: the kitchen feels cramped, the layout feels dark, or family life keeps colliding in the same few rooms. A good extension removes that pressure every day.",
  },
  {
    title: "Improve daily life and future value at the same time",
    body:
      "When the design improves light, flow and usability properly, the result is easier to enjoy now and easier to justify later if you ever sell. That makes the spend feel safer, not just bigger.",
  },
];

const hiddenCostPoints = [
  "Professional fees, structural design and approvals usually add 10% to 15% on top of the build cost, so the cheapest headline quote is rarely the true number.",
  "Party wall matters, scaffold licences, temporary parking suspensions and drainage surprises can shift the budget if they are not surfaced early.",
  "If the real goal is a kitchen-living transformation, the kitchen itself can add £15,000 to £60,000+ on top of the structural extension cost.",
];

const projectSpotlight = {
  title: "Rear extension and whole-home transformation in N19",
  summary:
    "This project captures what most homeowners are actually buying when they extend: not just extra space, but a calmer layout, better natural light, and the feeling that the whole home now works properly together.",
  projectType: "Rear extension + full renovation",
  location: "N19, North London",
  image:
    "/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp",
  imageAlt: "Rear extension and open-plan kitchen living space in N19",
  quote:
    "The team managed the project with clarity and delivered a finish that feels premium in every room.",
  author: "N19 Homeowner",
  href: "/portfolio/daniel-n19",
  bullets: [
    "Rear extension integrated cleanly into the existing house",
    "Brighter kitchen-living space with stronger day-to-day flow",
    "Weekly progress updates to keep decisions and expectations clear",
  ],
};

const supportingProjects = [
  {
    title: "Side return kitchen extension in E7",
    image: "/assets/portfolio/extension-ava-e7/side-return-extension-6.webp",
    imageAlt: "Side return kitchen extension in E7",
    summary:
      "A narrow galley layout became a brighter and more usable family kitchen with stronger connection to the garden.",
    quote:
      "The extension has transformed how we use the house day to day and the finish feels genuinely premium.",
    author: "E7 Homeowner",
    href: "/portfolio/ava-e7",
    badge: "Side return extension",
    outcome: "More light, better circulation",
  },
  {
    title: "Kitchen extension and renovation in N8",
    image: "/assets/portfolio/extension-james-n8/extension-james-1.webp",
    imageAlt: "Kitchen extension and renovation in N8",
    summary:
      "A structural extension project that created a larger and more sociable kitchen-living zone for modern family life.",
    quote:
      "The build was organised, communication was clear, and the transformation feels substantial.",
    author: "N8 Homeowner",
    href: "/portfolio/james-n8",
    badge: "Extension + renovation",
    outcome: "A more social family layout",
  },
];

const processSteps = [
  {
    title: "Feasibility and budget first",
    body:
      "Before drawings gather momentum, we pressure-test what makes sense for the house, the planning context and the level of spend you are genuinely comfortable with.",
  },
  {
    title: "Design the extension around real living",
    body:
      "The goal is not to bolt on square metres. It is to create better light, flow, storage and a ground floor that feels easier to live in every day.",
  },
  {
    title: "Approvals and pre-construction clarity",
    body:
      "Planning, building regulations, structural input and sequencing all need to line up before site starts. That is what reduces the nasty surprises clients usually fear.",
  },
  {
    title: "Build with weekly visibility",
    body:
      "You should know what is happening, what decisions are needed, and whether the programme is holding. Communication is part of the service, not a favour.",
  },
  {
    title: "Snagging and handover",
    body:
      "The job should finish with detail, not drift. We close out with quality checks, snagging discipline and a handover you can feel safe signing off.",
  },
];

const guideLinks = [
  {
    title: "House extensions London 2026: the complete guide",
    description:
      "The best starting point if you want the bigger picture on cost, planning, process, ROI and extension routes in London.",
    href: "/blog/house-extension-guide-2025",
  },
  {
    title: "House extension types compared",
    description:
      "Use this to compare rear, side return, wraparound, double-storey and kitchen-extension routes before you pick one too early.",
    href: "/blog/house-extension-types",
  },
  {
    title: "How much value a house extension adds in London",
    description:
      "Useful if you are trying to balance emotional motivation with resale logic and want a clearer sense of likely return.",
    href: "/blog/house-extension-value-london-guide",
  },
  {
    title: "How to finance an extension in London",
    description:
      "Covers remortgaging, further advances, budgeting realism and the financial case for improving versus moving.",
    href: "/blog/how-to-finance-house-extension-renovation-london-2026",
  },
  {
    title: "House extension mistakes London homeowners make",
    description:
      "Read this if you want to understand where budgets drift, planning assumptions go wrong, or a supposedly simple extension becomes stressful.",
    href: "/blog/house-extension-mistakes-london",
  },
];

const pageUrl = `${SITE_URL}/house-extension`;

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

function ExtensionTypeCard({ item }) {
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

export default function Page() {
  const faqs = getPageFaqs("extension");

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
            "House extension design and build services across London including rear, side return, wraparound and double-storey extension projects.",
        }),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "House Extensions London",
        isPartOf: getWebsiteReference(),
        about: {
          "@id": BUSINESS_IDS.localBusiness,
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        serviceType: "House Extensions London",
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
        title="Create the extra space your home is missing. "
        titleAccent="Without giving up the area that already works."
        subtitle="A well-planned extension can give you the bigger kitchen, brighter layout and calmer family space your current home is missing. We help London homeowners move from first idea to finished extension with clear guidance, realistic budgets and disciplined delivery."
        heroCTA="Book your extension consultation"
        heroImgUrl="/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp"
        ctaTallyFormLink="/contact"
        proofPoints={heroProofPoints}
      />

      <SocialProof />

      <section className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="overflow-hidden rounded-2xl border border-[#d8e4fb] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef5ff] p-6 shadow-sm md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Quick Answer"
                title="A good extension should solve daily friction, not just add metres"
                description="The strongest extension projects do more than make the house bigger. They make the space lighter, easier to use, and more supportive of how family life actually works now."
              />
              <div className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm">
                <p className="text-lg leading-8 text-[#2f3c52]">
                  <strong className="text-[#100b47]">Direct answer:</strong> most
                  London house extensions sit somewhere between{" "}
                  <strong className="text-[#100b47]">£50,000 and £200,000+</strong>,
                  depending on the route you choose. Simpler rear extensions can
                  often avoid full planning, while wraparound and double-storey
                  schemes usually need more approvals and a longer timeline. The
                  full journey is commonly{" "}
                  <strong className="text-[#100b47]">6 to 10 months</strong> from
                  feasibility to handover, and the right route depends as much on
                  your house and priorities as it does on budget.
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
          eyebrow="Why Extend"
          title="Why London homeowners choose extensions instead of moving"
          description="The best reason to extend is rarely just square metres. It is usually about keeping the life you already like while removing the part of the house that keeps frustrating you."
          centered
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {whyExtend.map((item) => (
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
          title="House extension costs by type in London"
          description="These planning-stage guide ranges help you sense-check affordability early, before you fall in love with the wrong extension route for your house or budget."
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
                {extensionTypes.map((item) => (
                  <tr key={item.title}>
                    <td className="px-5 py-4 font-bold text-[#100b47]">{item.title}</td>
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
          title="Which extension route fits your house?"
          description="The right answer depends on your plot, your property type, how much transformation you actually need, and whether your real goal is more light, a better kitchen-living layout, or significant extra space on more than one floor."
          centered
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {extensionTypes.map((item) => (
            <ExtensionTypeCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section
        id="testimonials"
        className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      >
        <div className="overflow-hidden rounded-2xl border border-[#d8e4fb] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef5ff] p-6 shadow-sm md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div>
              <SectionHeading
                eyebrow="Proof"
                title="Real extension projects that make the decision feel safer"
                description="The best proof is not generic praise. It is seeing projects where the layout improved, communication stayed clear, and the finished result felt worth the disruption."
              />

              <article className="rounded-2xl border border-[#d9e5fb] bg-white p-6 shadow-sm lg:p-8">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src={projectSpotlight.image}
                    alt={projectSpotlight.imageAlt}
                    width={1400}
                    height={900}
                    className="h-[320px] w-full object-cover"
                  />
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f5f9ff] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#266bf1]">
                    {projectSpotlight.projectType}
                  </span>
                  <span className="rounded-full border border-[#d9e5fb] px-3 py-1 text-xs font-semibold text-gray-600">
                    {projectSpotlight.location}
                  </span>
                </div>
                <h3 className="mt-5 text-3xl font-black text-[#100b47]">
                  {projectSpotlight.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-gray-700">
                  {projectSpotlight.summary}
                </p>
                <blockquote className="mt-6 rounded-2xl bg-[#f8fbff] p-6 text-xl leading-9 text-[#2f3c52]">
                  &ldquo;{projectSpotlight.quote}&rdquo;
                </blockquote>
                <ul className="mt-6 space-y-3">
                  {projectSpotlight.bullets.map((bullet) => (
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
                    <p className="font-bold text-[#100b47]">{projectSpotlight.author}</p>
                    <p className="text-sm text-gray-500">Client testimonial</p>
                  </div>
                  <Link
                    href={projectSpotlight.href}
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
                      {project.outcome}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#100b47]">{project.title}</h3>
                  <p className="mt-4 text-base leading-8 text-gray-700">
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
        <div className="overflow-hidden rounded-2xl bg-[#100b47] px-6 py-10 text-white md:px-10 lg:px-12 lg:py-14">
          <SectionHeading
            eyebrow="Process"
            title="How we keep extension projects under control"
            description="Extension projects usually become stressful when the budget is vague, the drawings are disconnected from build reality, or communication fades once work starts. This process is designed to prevent exactly that."
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
          title="The extension guides worth reading before you commit"
          description="If you are still comparing routes, budgets, planning risk or likely return, start with these. They will help you make a better decision before you speak to anyone."
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
              If extending feels like the right route, start with a realistic conversation
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-700">
              A useful first conversation should tell you whether the extension
              idea makes sense for your house, what the realistic budget range
              looks like, and whether planning, layout or structural constraints
              are likely to shape the route before you spend too much energy on
              the wrong plan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-[#266bf1] px-6 text-base font-bold text-white transition hover:bg-[#1449B0]"
              >
                Book your extension consultation
              </Link>
              <Link
                href="/blog/house-extension-guide-2025"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-[#bfd3f9] bg-white px-6 text-base font-bold text-[#266bf1] transition hover:border-[#266bf1]"
              >
                Read the full extension guide first
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
