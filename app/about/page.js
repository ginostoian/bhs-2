import FAQ from "@/components/FAQ";
import Guarantee from "@/components/Guarantee";
import Stats from "@/components/Stats";
import PortfolioCardContainer from "@/components/PortfolioCardContainer";
import Features from "@/components/Features";
import CustomCTA from "@/components/CustomCTA";
import Approach from "@/components/Approach";
import Testimonials11 from "@/components/Testimonials11";
import Testimonials3 from "@/components/Testimonials3";
import BlogHighlight from "@/components/blog/BlogHighlight";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import config from "@/config";

export default function Page() {
  const aboutPageCopy = config.copy.aboutPage;
  //   const whatWeDoCopy = aboutPageCopy.whatWeDoSection;
  //   const whatWeDoArr = [
  //     whatWeDoCopy.fullHome,
  //     whatWeDoCopy.bathroomInstallation,
  //     whatWeDoCopy.kitchenInstallation,
  //     whatWeDoCopy.structuralWork,
  //     whatWeDoCopy.heating,
  //     whatWeDoCopy.flooringInstallation,
  //   ];
  const howWeDoItCopy = aboutPageCopy.howWeDoItSection;
  const reviewsCtaCopy = config.copy.homepage.reviewsSection;
  const faqCopy = aboutPageCopy.faqs;
  const blogHighlightCopy = aboutPageCopy.blogHighlights;

  return (
    <>
      <main>
        <Hero
          title={aboutPageCopy.title}
          titleAccent={aboutPageCopy.titleAccent}
          subtitle={aboutPageCopy.subtitle}
          heroCTA={aboutPageCopy.heroCTA}
          heroImgUrl={aboutPageCopy.heroImgUrl}
          ctaTallyFormLink={aboutPageCopy.ctaTallyFormLink}
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
