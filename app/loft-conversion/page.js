import Link from "next/link";

import Approach from "@/components/Approach";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Testimonials11 from "@/components/Testimonials11";
import WithWithout from "@/components/WithWithout";
import BlogHighlight from "@/components/blog/BlogHighlight";
import ContentRow from "@/components/contentRow/ContentRow";
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
    "Loft conversion services in London including dormer, hip-to-gable and mansard solutions designed and delivered by one experienced design and build team.",
  canonicalUrlRelative: "/loft-conversion",
  openGraph: {
    title: "Loft Conversion London | Better Homes Studio",
    description:
      "Create premium extra living space with expertly managed loft conversions across London.",
    url: `https://${config.domainName}/loft-conversion`,
  },
  keywords: [
    "loft conversion London",
    "dormer loft conversion London",
    "mansard loft conversion London",
    "hip to gable loft conversion London",
  ],
});

export default function Page() {
  const homepageCopy = config.copy.homepage;
  const whatWeDoCopy = config.copy.homepage.whatWeDoSection;
  const whatWeDoArr = [
    whatWeDoCopy.bathroom,
    whatWeDoCopy.kitchen,
    whatWeDoCopy.generalRenovation,
    whatWeDoCopy.interiorDesign,
    whatWeDoCopy.houseExtension,
    whatWeDoCopy.smartHome,
  ];
  const howWeDoItCopy = config.copy.homepage.howWeDoItSection;
  const reviewsCtaCopy = config.copy.homepage.reviewsSection;
  const blogHighlightCopy = config.copy.homepage.blogHighlights;

  const faqs = getPageFaqs("loft");

  return (
    <>
      <main>
        <Hero
          title={homepageCopy.title}
          titleAccent={homepageCopy.titleAccent}
          subtitle={homepageCopy.subtitle}
          heroCTA={homepageCopy.heroCTA}
          heroImgUrl={homepageCopy.heroImgUrl}
        />
        <SocialProof />
        <Features />
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
        <BlogHighlight articles={blogHighlightCopy} />
      </main>
    </>
  );
}
