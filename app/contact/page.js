import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import FeaturesListicle from "@/components/FeaturesListicle";
import Problem from "@/components/Problem";
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
        <Testimonials3 />
        <Problem />
        <FeaturesListicle />
        <WithWithout />
        <SectionTitle
          title="How we do it"
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
