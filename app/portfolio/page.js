import Link from "next/link";

import Approach from "@/components/Approach";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";

import Testimonials11 from "@/components/Testimonials11";
import Testimonials3 from "@/components/Testimonials3";
import WithWithout from "@/components/WithWithout";
import BlogHighlight from "@/components/blog/BlogHighlight";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import config from "@/config";
import { getPageFaqs } from "@/libs/pageFaqs";
import PortfolioPageContainer from "@/components/PortfolioPageContainer";
import Stats from "@/components/Stats";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Renovation Case Studies London | Better Homes Studio Portfolio",
  description:
    "Explore completed London renovation, kitchen, bathroom, extension and loft conversion projects with real outcomes, scope and client feedback.",
  canonicalUrlRelative: "/portfolio",
  openGraph: {
    title: "Renovation Case Studies London | Better Homes Studio Portfolio",
    description:
      "See real project outcomes from London renovations, extensions, kitchens, bathrooms and loft conversions.",
    url: `https://${config.domainName}/portfolio`,
  },
  keywords: [
    "renovation portfolio London",
    "house extension case studies London",
    "kitchen renovation projects London",
    "bathroom renovation portfolio London",
  ],
});

export default function Page() {
  const portfolioCopy = config.copy.portfolioPage;
  //   const whatWeDoCopy = portfolioCopy.whatWeDoSection;
  //   const whatWeDoArr = [
  //     whatWeDoCopy.fullHome,
  //     whatWeDoCopy.bathroomInstallation,
  //     whatWeDoCopy.kitchenInstallation,
  //     whatWeDoCopy.structuralWork,
  //     whatWeDoCopy.heating,
  //     whatWeDoCopy.flooringInstallation,
  //   ];
  const howWeDoItCopy = portfolioCopy.howWeDoItSection;
  const reviewsCtaCopy = config.copy.homepage.reviewsSection;
  const blogHighlightCopy = portfolioCopy.blogHighlights;

  const faqs = getPageFaqs("portfolio");

  return (
    <>
      <main>
        <Hero
          title={portfolioCopy.title}
          titleAccent={portfolioCopy.titleAccent}
          subtitle={portfolioCopy.subtitle}
          heroCTA={portfolioCopy.heroCTA}
          heroImgUrl={portfolioCopy.heroImgUrl}
          ctaTallyFormLink={portfolioCopy.ctaTallyFormLink}
        />
        <SocialProof />
        <PortfolioPageContainer />
        <Testimonials3 />
        <Features />
        <Stats />
        <SectionTitle />
        <Approach />
        <WithWithout />
        <SectionTitle
          title="Our build approach"
          subtitle="Simple, fast and streamlined process"
        />
        <TextGrid content={howWeDoItCopy} />
        <Testimonials11 />
        <TextBlockDark content={reviewsCtaCopy} />
        <FAQ content={faqs} />
        <SectionTitle
          title="The Knowledge Center"
          subtitle="Where you actually learn new things"
        />
        <BlogHighlight articles={blogHighlightCopy} />
      </main>
    </>
  );
}
