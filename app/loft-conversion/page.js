import Approach from "@/components/Approach";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Guarantee from "@/components/Guarantee";
import PortfolioCardContainer from "@/components/PortfolioCardContainer";
import Stats from "@/components/Stats";
import Testimonials11 from "@/components/Testimonials11";
import Testimonials3 from "@/components/Testimonials3";
import BlogHighlight from "@/components/blog/BlogHighlight";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import config from "@/config";
import { getPageFaqs } from "@/libs/pageFaqs";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Loft Conversion London | Design & Build | Better Homes Studio",
  description:
    "Design-led loft conversions in London for homeowners who need more space without the cost and disruption of moving. Dormer, hip-to-gable, mansard and rooflight loft projects delivered with clear planning and build management.",
  canonicalUrlRelative: "/loft-conversion",
  openGraph: {
    title: "Loft Conversion London | Better Homes Studio",
    description:
      "Create calm, valuable extra living space with a loft conversion planned properly from feasibility through finish.",
    url: `https://${config.domainName}/loft-conversion`,
  },
  keywords: [
    "loft conversion London",
    "loft conversion company London",
    "dormer loft conversion London",
    "hip to gable loft conversion London",
    "mansard loft conversion London",
  ],
});

const reassurancePoints = [
  {
    title: "Start with feasibility, not guesswork",
    body:
      "We assess roof shape, head height, stair position, planning constraints and your real day-to-day needs before steering you toward a solution. That clarity protects both budget and momentum.",
  },
  {
    title: "One accountable team from first conversation to finish",
    body:
      "Loft conversions involve structural decisions, approvals, sequencing and finishing detail. Keeping those moving parts connected makes the project calmer and reduces the usual handover gaps.",
  },
  {
    title: "A loft that feels like it always belonged there",
    body:
      "The goal is not just adding square footage. It is creating a room that feels warm, quiet, practical and fully integrated with the rest of your home.",
  },
];

const loftTypes = [
  {
    title: "Rooflight loft conversions",
    body:
      "Usually the simplest route when your loft already has enough usable height. Ideal when you want extra space with lighter structural change and a more controlled budget.",
    fit: "Best for: homes with strong existing roof volume and minimal external alteration needs.",
  },
  {
    title: "Dormer loft conversions",
    body:
      "A strong option when you need more headroom and a more comfortable floor layout. Dormers often unlock the bedroom, storage and circulation space that makes the loft truly usable.",
    fit: "Best for: homeowners who want a practical extra room rather than a compromise.",
  },
  {
    title: "Hip-to-gable loft conversions",
    body:
      "Well suited to end-of-terrace and semi-detached homes where extending the sloping side roof can create much better internal volume and layout flexibility.",
    fit: "Best for: properties where the existing roof shape is holding back usable floor area.",
  },
  {
    title: "Mansard loft conversions",
    body:
      "Usually the route for homeowners who want the most substantial transformation and are prepared for a more planning-led approach to get it.",
    fit: "Best for: homes where maximising space matters more than choosing the simplest build route.",
  },
];

const homeownerOutcomes = [
  {
    title: "A main bedroom that gives the whole house more breathing room",
    body:
      "Moving the primary bedroom upstairs often unlocks a calmer layout below, with better use of existing bedrooms and less pressure on shared family space.",
  },
  {
    title: "A quieter place to work, host or reset",
    body:
      "A loft can become the room that makes the rest of the house work better: a guest suite, office, studio or somewhere to close the door and concentrate.",
  },
  {
    title: "More usable space without leaving the area you chose on purpose",
    body:
      "For many London homeowners, the real value is staying close to schools, neighbours, parks and routines they already care about while making the home fit life better.",
  },
];

const loftDeliveryCopy = {
  bigGridTitle: "More confidence at each stage, fewer surprises later",
  bigGridText:
    "Loft conversions become stressful when feasibility, approvals and build planning are treated as separate conversations. We bring them together early, so your decisions stay grounded and the build stays more predictable.",
  gridOneNum: "1.",
  gridOneTitle: "Feasibility and budget alignment",
  gridOneText:
    "We start by understanding what you want the loft to do, then test that against structure, access, planning context and budget reality.",
  gridTwoNum: "2.",
  gridTwoTitle: "Design and approvals",
  gridTwoText:
    "Once the direction is clear, we help move the project through the right technical and approval steps so nothing important is left vague before site work begins.",
  gridThreeNum: "3.",
  gridThreeTitle: "Build with clear weekly visibility",
  gridThreeText:
    "During construction, communication matters as much as workmanship. We keep progress visible, decisions timely and disruption as controlled as possible.",
  gridFourNum: "4.",
  gridFourTitle: "Finish, snagging and handover",
  gridFourText:
    "The last part of the project should feel reassuring, not rushed. We focus on detail, quality checks and a handover you can feel good about living with.",
};

const consultationCtaCopy = {
  darkBgTextTitle:
    "If a loft conversion is on your shortlist, start with clarity",
  darkBgTextSubtitle:
    "A first conversation should help you understand whether your loft is worth pursuing, which route fits your home, and where the major planning and cost variables sit. No pressure. Just useful direction.",
  darkBgTextBtn: "Discuss your loft project",
};

const loftBlogHighlights = [
  {
    title: "Planning permission for loft conversions in London: complete 2026 guide",
    date: "11 March 2026",
    imgUrl:
      "/assets/blog/loft-planning/permitted-development-rules-loft-conversion.png",
    slug: "planning-permission-loft-conversion-london",
  },
  {
    title: "Loft conversions in London: the complete 2026 guide",
    date: "6 March 2026",
    imgUrl: "/assets/img/extension/diagram-of-popular-house-extensions.webp",
    slug: "loft-conversions-london-complete-guide-2026",
  },
  {
    title: "15 house extension mistakes London homeowners make",
    date: "3 March 2026",
    imgUrl: "/assets/img/extension/double-storey-extension.webp",
    slug: "house-extension-mistakes-london",
  },
];

function InsightCard({ title, body, eyebrow }) {
  return (
    <article className="rounded-3xl border border-base-content/10 bg-white p-8 shadow-[0_16px_50px_rgba(16,11,71,0.06)]">
      {eyebrow && (
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#266bf1]">
          {eyebrow}
        </p>
      )}
      <h3 className="mb-4 text-2xl font-semibold text-[#100b47]">{title}</h3>
      <p className="leading-7 text-base-content/75">{body}</p>
    </article>
  );
}

function LoftTypeCard({ title, body, fit }) {
  return (
    <article className="rounded-3xl border border-[#dbe7ff] bg-[#f8fbff] p-8">
      <h3 className="mb-4 text-2xl font-semibold text-[#100b47]">{title}</h3>
      <p className="mb-5 leading-7 text-base-content/75">{body}</p>
      <p className="text-sm font-medium leading-6 text-[#266bf1]">{fit}</p>
    </article>
  );
}

export default function Page() {
  const faqs = getPageFaqs("loft");

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

      <SectionTitle
        title="Why choose us"
        subtitle="Our values are our promises to you"
      />

      <Features />
      <Testimonials3 />
      <Stats />

      <SectionTitle
        title="Why homeowners choose a loft conversion"
        subtitle="The right project should solve a space problem and remove decision stress at the same time."
      />

      <section className="mx-auto max-w-[85%] py-4">
        <div className="grid gap-6 lg:grid-cols-3">
          {reassurancePoints.map((point, index) => (
            <InsightCard
              key={point.title}
              title={point.title}
              body={point.body}
              eyebrow={`Reason ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <SectionTitle
        title="What a good loft conversion changes"
        subtitle="Extra space matters most when it makes everyday life feel easier, calmer and more flexible."
      />

      <section className="mx-auto max-w-[85%] py-4">
        <div className="grid gap-6 lg:grid-cols-3">
          {homeownerOutcomes.map((outcome) => (
            <InsightCard
              key={outcome.title}
              title={outcome.title}
              body={outcome.body}
            />
          ))}
        </div>
      </section>

      <Approach />

      <SectionTitle
        title="Which loft conversion route fits your home?"
        subtitle="Not every loft should take the same path. The best answer depends on your roof, planning context, budget and what you want the new space to do."
      />

      <section className="mx-auto max-w-[85%] py-4">
        <div className="grid gap-6 md:grid-cols-2">
          {loftTypes.map((type) => (
            <LoftTypeCard
              key={type.title}
              title={type.title}
              body={type.body}
              fit={type.fit}
            />
          ))}
        </div>
      </section>

      <SectionTitle
        title="How we keep loft projects under control"
        subtitle="The build feels better when decisions are made in the right order and communication stays steady."
      />

      <TextGrid content={loftDeliveryCopy} />

      <SectionTitle
        title="What clients say after the dust settles"
        subtitle="The strongest proof is how the finished space feels to live in and how the process felt while it was happening."
      />

      <Testimonials11 />
      <PortfolioCardContainer />

      <Guarantee />

      <FAQ content={faqs} />

      <TextBlockDark content={consultationCtaCopy} />

      <SectionTitle
        title="The Knowledge Center"
        subtitle="Useful reading if you are still comparing loft options, planning routes or next steps."
      />

      <BlogHighlight articles={loftBlogHighlights} />
    </main>
  );
}
