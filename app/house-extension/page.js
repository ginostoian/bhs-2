import Approach from "@/components/Approach";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Testimonials11 from "@/components/Testimonials11";
import Stats from "@/components/Stats";
import Testimonials3 from "@/components/Testimonials3";
import Guarantee from "@/components/Guarantee";
import CustomCTA from "@/components/CustomCTA";
import PortfolioCardContainer from "@/components/PortfolioCardContainer";
import BlogHighlight from "@/components/blog/BlogHighlight";
import ContentRow from "@/components/contentRow/ContentRow";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import config from "@/config";

export default function Page() {
  const extensionPageCopy = config.copy.extensionPage;
  const whatWeDoCopy = extensionPageCopy.whatWeDoSection;
  const whatWeDoArr = [
    whatWeDoCopy.singleStoreyExtension,
    whatWeDoCopy.doubleStoreyExtension,
    whatWeDoCopy.sideReturnExtension,
    whatWeDoCopy.overStructureExtension,
    whatWeDoCopy.loftConversion,
    whatWeDoCopy.basementExtension,
  ];
  const howWeDoItCopy = extensionPageCopy.howWeDoItSection;
  const reviewsCtaCopy = config.copy.homepage.reviewsSection;
  const faqCopy = extensionPageCopy.faqs;
  const blogHighlightCopy = extensionPageCopy.blogHighlights;

  return (
    <>
      <main>
        <Hero
          title={extensionPageCopy.title}
          titleAccent={extensionPageCopy.titleAccent}
          subtitle={extensionPageCopy.subtitle}
          heroCTA={extensionPageCopy.heroCTA}
          heroImgUrl={extensionPageCopy.heroImgUrl}
          ctaTallyFormLink={extensionPageCopy.ctaTallyFormLink}
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
        <FAQ content={faqCopy} />
        <TextBlockDark content={reviewsCtaCopy} />
        <SectionTitle
          title="The Knowledge Center"
          subtitle="Where you actually learn new things"
        />
        <BlogHighlight articles={blogHighlightCopy} />
      </main>
    </>
  );
}
