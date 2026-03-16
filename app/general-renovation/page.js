import Link from "next/link";

import Approach from "@/components/Approach";
import CustomCTA from "@/components/CustomCTA";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Guarantee from "@/components/Guarantee";
import PortfolioCardContainer from "@/components/PortfolioCardContainer";
import Stats from "@/components/Stats";
import Testimonials11 from "@/components/Testimonials11";
import Testimonials3 from "@/components/Testimonials3";
import BlogHighlight from "@/components/blog/BlogHighlight";
import ContentRow from "@/components/contentRow/ContentRow";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import config from "@/config";
import { getKnowledgeCenterArticles } from "@/libs/knowledgeCenter";
import { getPageFaqs } from "@/libs/pageFaqs";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Home Renovation London | Full Refurbishment Experts | Better Homes Studio",
  description:
    "Full home renovation and refurbishment services in London, including structural works, flooring, heating and complete interior upgrades.",
  canonicalUrlRelative: "/general-renovation",
  openGraph: {
    title: "Home Renovation London | Better Homes Studio",
    description:
      "Full-service home renovation projects in London with clear scope, quality control and reliable delivery.",
    url: `https://${config.domainName}/general-renovation`,
  },
  keywords: [
    "home renovation London",
    "house refurbishment London",
    "full home renovation London",
    "general renovation London",
  ],
});

export default function Page() {
  const renovationPageCopy = config.copy.renovationPage;
  const whatWeDoCopy = renovationPageCopy.whatWeDoSection;
  const whatWeDoArr = [
    whatWeDoCopy.fullHome,
    whatWeDoCopy.bathroomInstallation,
    whatWeDoCopy.kitchenInstallation,
    whatWeDoCopy.structuralWork,
    whatWeDoCopy.heating,
    whatWeDoCopy.flooringInstallation,
  ];
  const howWeDoItCopy = renovationPageCopy.howWeDoItSection;
  const reviewsCtaCopy = config.copy.homepage.reviewsSection;
  const knowledgeCenterArticles = getKnowledgeCenterArticles("renovation");

  const faqs = getPageFaqs("renovation");

  return (
    <>
      <main>
        <Hero
          title={renovationPageCopy.title}
          titleAccent={renovationPageCopy.titleAccent}
          subtitle={renovationPageCopy.subtitle}
          heroCTA={renovationPageCopy.heroCTA}
          heroImgUrl={renovationPageCopy.heroImgUrl}
          ctaTallyFormLink={renovationPageCopy.ctaTallyFormLink}
        />
        <SocialProof />
        <SectionTitle
          title="Why choose us"
          subtitle="Our values are our promises to you"
        />
        <Features />
        <Testimonials3 />
        <Stats />
        <SectionTitle />
        <Approach />
        <SectionTitle
          title="Our build approach"
          subtitle="Simple, fast and streamlined process"
        />
        <TextGrid content={howWeDoItCopy} />
        <Testimonials11 />
        <SectionTitle
          title="What we do"
          subtitle="Full service renovation company"
        />
        {whatWeDoArr.map((item, i) => {
          return (
            <ContentRow
              key={i}
              title={item.title}
              subtitle={item.subtitle}
              subtitleAccent={item.subtitleAccent}
              p1={item.p1}
              p2={item.p2}
              cta={item.CTA}
              imgSrc={item.imgSrc}
              order={i % 2 === 0 ? false : true}
              slug={item.slug}
            />
          );
        })}
        <PortfolioCardContainer />
        <Guarantee />
        <CustomCTA />
        <FAQ content={faqs} />
        <TextBlockDark content={reviewsCtaCopy} />
        <SectionTitle
          title="The Knowledge Center"
          subtitle="Where you actually learn new things"
        />
        <BlogHighlight articles={knowledgeCenterArticles} />
      </main>
    </>
  );
}
