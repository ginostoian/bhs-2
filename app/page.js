import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Approach from "@/components/Approach";
import PortfolioCardContainer from "@/components/PortfolioCardContainer";
import Testimonials11 from "@/components/Testimonials11";
import Testimonials3 from "@/components/Testimonials3";
import WithWithout from "@/components/WithWithout";
import BlogHighlight from "@/components/blog/BlogHighlight";
import ContentRow from "@/components/contentRow/ContentRow";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import config from "@/config";

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
  const faqCopy = config.copy.homepage.faqs;
  const blogHighlightCopy = config.copy.homepage.blogHighlights;

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
        <SectionTitle
          title="Why choose us"
          subtitle="Our values are our promises to you"
        />
        <Features />
        <Testimonials3 />
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
        <SectionTitle
          title="Recent projects"
          subtitle="Simple, fast and streamlined process"
        />
        <PortfolioCardContainer />
        <WithWithout />
        <SectionTitle
          title="Our build approach"
          subtitle="Simple, fast and streamlined process"
        />
        <TextGrid content={howWeDoItCopy} />
        <Testimonials11 />
        <TextBlockDark content={reviewsCtaCopy} />
        <FAQ content={faqCopy} />
        <SectionTitle
          title="The Knowledge Center"
          subtitle="Where you actually learn new things"
        />
        <BlogHighlight articles={blogHighlightCopy} />
      </main>
    </>
  );
}
