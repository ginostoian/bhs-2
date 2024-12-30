import Approach from "@/components/Approach";
import CustomCTA from "@/components/CustomCTA";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Guarantee from "@/components/Guarantee";
import InfoPartner from "@/components/InfoPartner";
import PortfolioCardContainer from "@/components/PortfolioCardContainer";
import Stats from "@/components/Stats";
import Testimonials11 from "@/components/Testimonials11";
import Testimonials3 from "@/components/Testimonials3";
import WhoCanPartner from "@/components/WhoCanPartner";
import BlogHighlight from "@/components/blog/BlogHighlight";
import ContentRow from "@/components/contentRow/ContentRow";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import config from "@/config";

export default function Page() {
  const bathroomPageCopy = config.copy.bathroomPage;
  const whatWeDoCopy = bathroomPageCopy.whatWeDoSection;
  const whatWeDoArr = [
    whatWeDoCopy.bathroomDesign,
    whatWeDoCopy.modernBathroom,
    whatWeDoCopy.industrialBathroom,
    whatWeDoCopy.traditionalBathroom,
    whatWeDoCopy.smallBathroom,
    whatWeDoCopy.victorianBathroom,
  ];
  const howWeDoItCopy = bathroomPageCopy.howWeDoItSection;
  const reviewsCtaCopy = config.copy.homepage.reviewsSection;
  const faqCopy = bathroomPageCopy.faqs;
  const blogHighlightCopy = bathroomPageCopy.blogHighlights;

  return (
    <>
      <main>
        <Hero
          title="Tap into the Better Homes Studio Network."
          titleAccent="Unlock new revenue opportunities."
          subtitle="Refer your clients to our trusted renovation services, and we will reward you for every successful project—ensuring both you and your clients benefit from our expertise. It is a simple, rewarding partnership designed for mutual success."
          heroCTA="Start Application - Start earning more"
          heroImgUrl="professionals-hero.webp"
          ctaTallyFormLink="/contact"
        />
        <InfoPartner />
        <WhoCanPartner />
        <Features />

        <Stats />
        <SectionTitle />
        <Approach />
        <SectionTitle
          title="Our build approach"
          subtitle="Simple, fast and streamlined process"
        />
        <TextGrid content={howWeDoItCopy} />
        <Testimonials11 />
        <Guarantee />
        <FAQ content={faqCopy} />
      </main>
    </>
  );
}
