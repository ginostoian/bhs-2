import Approach from "@/components/Approach";
import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Testimonials11 from "@/components/Testimonials11";
import Stats from "@/components/Stats";
import Guarantee from "@/components/Guarantee";
import PortfolioCardContainer from "@/components/PortfolioCardContainer";
import Testimonials3 from "@/components/Testimonials3";
import WithWithout from "@/components/WithWithout";
import BlogHighlight from "@/components/blog/BlogHighlight";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import CustomCTA from "@/components/CustomCTA";
import config from "@/config";

export default function Page() {
  const contactPageCopy = config.copy.contactPage;
  //   const whatWeDoCopy = aboutPageCopy.whatWeDoSection;
  //   const whatWeDoArr = [
  //     whatWeDoCopy.fullHome,
  //     whatWeDoCopy.bathroomInstallation,
  //     whatWeDoCopy.kitchenInstallation,
  //     whatWeDoCopy.structuralWork,
  //     whatWeDoCopy.heating,
  //     whatWeDoCopy.flooringInstallation,
  //   ];
  const howWeDoItCopy = contactPageCopy.howWeDoItSection;
  const reviewsCtaCopy = config.copy.homepage.reviewsSection;
  const faqCopy = contactPageCopy.faqs;
  const blogHighlightCopy = contactPageCopy.blogHighlights;

  return (
    <>
      <main>
        <Hero
          title={contactPageCopy.title}
          titleAccent={contactPageCopy.titleAccent}
          subtitle={contactPageCopy.subtitle}
          heroCTA={contactPageCopy.heroCTA}
          heroImgUrl={contactPageCopy.heroImgUrl}
          ctaTallyFormLink={contactPageCopy.ctaTallyFormLink}
        />
        <SocialProof />
        <ContactForm />
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
