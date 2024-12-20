import Approach from "@/components/Approach";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import FeaturesListicle from "@/components/FeaturesListicle";
import Problem from "@/components/Problem";
import Testimonials11 from "@/components/Testimonials11";
import WithWithout from "@/components/WithWithout";
import BlogHighlight from "@/components/blog/BlogHighlight";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import config from "@/config";

export default function Page() {
  const faqPageCopy = config.copy.faqPage;
  //   const whatWeDoCopy = aboutPageCopy.whatWeDoSection;
  //   const whatWeDoArr = [
  //     whatWeDoCopy.fullHome,
  //     whatWeDoCopy.bathroomInstallation,
  //     whatWeDoCopy.kitchenInstallation,
  //     whatWeDoCopy.structuralWork,
  //     whatWeDoCopy.heating,
  //     whatWeDoCopy.flooringInstallation,
  //   ];
  const howWeDoItCopy = faqPageCopy.howWeDoItSection;
  const reviewsCtaCopy = config.copy.homepage.reviewsSection;
  const faqCopy = faqPageCopy.faqs;
  const blogHighlightCopy = faqPageCopy.blogHighlights;

  return (
    <>
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
        <FAQ content={faqCopy} />
        <Features />
        <Approach />
        <WithWithout />
        <SectionTitle
          title="Our build approach"
          subtitle="Simple, fast and streamlined process"
        />
        <TextGrid content={howWeDoItCopy} />
        <Testimonials11 />
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
