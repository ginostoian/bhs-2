import Script from "next/script";

import Approach from "@/components/Approach";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import CustomCTA from "@/components/CustomCTA";
import Stats from "@/components/Stats";
import Testimonials11 from "@/components/Testimonials11";
import Guarantee from "@/components/Guarantee";
import PortfolioCardContainer from "@/components/PortfolioCardContainer";
import Testimonials3 from "@/components/Testimonials3";
import BlogHighlight from "@/components/blog/BlogHighlight";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import config from "@/config";
import { getKnowledgeCenterArticles } from "@/libs/knowledgeCenter";
import { getPageFaqs } from "@/libs/pageFaqs";
import { getSEOTags } from "@/libs/seo";
import { getLocalBusinessSchema } from "@/libs/structuredData";

export const metadata = getSEOTags({
  title: "Renovation FAQs London | Better Homes Studio",
  description:
    "Answers to common questions about London home renovations, extensions, loft conversions, timelines, guarantees, planning, and costs.",
  canonicalUrlRelative: "/faq",
  openGraph: {
    title: "Renovation FAQs London | Better Homes Studio",
    description:
      "Frequently asked questions for London homeowners planning renovation, extension, kitchen, bathroom and loft projects.",
    url: `https://${config.domainName}/faq`,
  },
  keywords: [
    "renovation FAQ London",
    "house extension questions London",
    "kitchen renovation FAQ",
    "bathroom renovation FAQ",
  ],
});

export default function Page() {
  const faqPageCopy = config.copy.faqPage;
  const howWeDoItCopy = faqPageCopy.howWeDoItSection;
  const reviewsCtaCopy = config.copy.homepage.reviewsSection;
  const knowledgeCenterArticles = getKnowledgeCenterArticles("faq");
  const faqs = getPageFaqs("faq");

  // Schema markup for FAQ page
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
  };

  const localBusinessSchema = getLocalBusinessSchema({
    description: "Full service renovation company in London",
    areaServed: "London",
  });

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            ...localBusinessSchema,
          }),
        }}
      />
      <main>
        <Hero
          title={faqPageCopy.title}
          titleAccent={faqPageCopy.titleAccent}
          subtitle={faqPageCopy.subtitle}
          heroCTA={faqPageCopy.heroCTA}
          heroImgUrl={faqPageCopy.heroImgUrl}
          ctaTallyFormLink={faqPageCopy.ctaTallyFormLink}
        />
        <SocialProof />
        <FAQ content={faqs} />
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
        <PortfolioCardContainer />
        <Guarantee />
        <CustomCTA />
        <SectionTitle />
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
