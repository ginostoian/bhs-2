import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import PortfolioCardContainer from "@/components/PortfolioCardContainer";
import Hero from "@/components/hero/Hero";
import SocialProof from "@/components/socialProof/SocialProof";
import Stats from "@/components/Stats";
import config from "@/config";
import { getPageFaqs } from "@/libs/pageFaqs";
import CustomCTA from "@/components/CustomCTA";
import Guarantee from "@/components/Guarantee";
import { getSEOTags } from "@/libs/seo";
import HomepageServiceGrid from "@/components/homepage/HomepageServiceGrid";
import HomepageTestimonialStrip from "@/components/homepage/HomepageTestimonialStrip";
import HomepageTimeline from "@/components/homepage/HomepageTimeline";
import { SITE_URL } from "@/libs/structuredData";

export const metadata = getSEOTags({
  title:
    "Extensions, Loft Conversions & Full-Home Renovations in London | Better Homes Studio",
  description:
    "Design and build specialists for London home renovations, extensions, kitchens, bathrooms, and loft conversions with transparent pricing and weekly updates.",
  canonicalUrlRelative: "/",
  openGraph: {
    title:
      "Extensions, Loft Conversions & Full-Home Renovations in London | Better Homes Studio",
    description:
      "Design and build specialists for London home renovations, extensions, kitchens, bathrooms, and loft conversions.",
    url: `https://${config.domainName}/`,
  },
  keywords: [
    "home renovation London",
    "house extensions London",
    "kitchen renovation London",
    "bathroom renovation London",
    "loft conversion London",
  ],
});

export default function Page() {
  const homepageCopy = config.copy.homepage;
  const faqs = getPageFaqs("home");
  const heroProofPoints = [
    "£10M insured",
    "10-year guarantee",
    "500+ projects delivered",
  ];
  const homepageServices = [
    {
      title: "House Extensions",
      description:
        "Rear, side-return and double-storey extensions that create more space, more light, and more value.",
      kicker: "Guide budgets from £80,000",
      price: "From £80,000",
      href: "/house-extension",
      image: "/assets/img/extension/single-storey-extension.webp",
      imageAlt: "House extension project by Better Homes Studio",
    },
    {
      title: "Loft Conversions",
      description:
        "Roof-light, dormer and hip-to-gable lofts that unlock serious extra living space without moving house.",
      kicker: "Guide budgets from £50,000",
      price: "From £50,000",
      href: "/loft-conversion",
      image: "/assets/img/extension/loft-conversion.png",
      imageAlt: "Loft conversion service by Better Homes Studio",
    },
    {
      title: "Full Home Renovations",
      description:
        "Whole-home refurbishments with structural work, finishes, kitchens and bathrooms managed by one accountable team.",
      kicker: "Guide budgets from £35,000",
      price: "From £35,000",
      href: "/general-renovation",
      image: "/assets/img/general/london-grey-living-room.webp",
      imageAlt: "Full home renovation by Better Homes Studio",
    },
    {
      title: "Kitchen Renovations",
      description:
        "Design-led kitchens that improve workflow, storage, finish quality, and the value of your home.",
      kicker: "Guide budgets from £20,000",
      price: "From £20,000",
      href: "/kitchen-renovation",
      image: "/assets/img/kitchen/modern-kitchen.webp",
      imageAlt: "Kitchen renovation by Better Homes Studio",
    },
    {
      title: "Bathroom Renovations",
      description:
        "Bathroom design, supply and installation done properly, with clean detailing and high everyday usability.",
      kicker: "Guide budgets from £12,000",
      price: "From £12,000",
      href: "/bathroom-renovation",
      image: "/assets/img/bathroom/modern-bathroom-v2.webp",
      imageAlt: "Bathroom renovation by Better Homes Studio",
    },
  ];
  const homepageTimeline = [
    {
      title: "Free consultation",
      description:
        "We listen first, understand the property, and tell you quickly whether the project direction is sensible.",
    },
    {
      title: "Detailed quote",
      description:
        "You get clear scope, transparent pricing, and a realistic view of the budget before momentum gets wasted.",
    },
    {
      title: "Design sign-off",
      description:
        "Drawings, approvals and technical details are aligned before site starts, so the build is not figuring itself out live.",
    },
    {
      title: "Build with weekly updates",
      description:
        "One team runs delivery, keeps decisions moving, and reports progress properly while the work is underway.",
    },
    {
      title: "Snagging and handover",
      description:
        "We close the job with quality checks, handover discipline, and workmanship cover that protects your investment.",
    },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
    mainEntityOfPage: `${SITE_URL}/`,
  };

  return (
    <>
      <main>
        <Hero
          title={homepageCopy.title}
          titleAccent={homepageCopy.titleAccent}
          subtitle={homepageCopy.subtitle}
          heroCTA={homepageCopy.heroCTA}
          heroImgUrl={homepageCopy.heroImgUrl}
          proofPoints={heroProofPoints}
        />
        <SocialProof />
        <Features />
        <Stats />
        <HomepageServiceGrid services={homepageServices} />
        <PortfolioCardContainer />
        <HomepageTestimonialStrip />
        <HomepageTimeline steps={homepageTimeline} />
        <Guarantee />
        <CustomCTA />
        <FAQ content={faqs} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      </main>
    </>
  );
}
