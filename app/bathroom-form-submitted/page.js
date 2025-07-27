import ButtonGradient from "@/components/ButtonGradient";
import FAQ from "@/components/FAQ";
import Testimonials11 from "@/components/Testimonials11";
import WithWithout from "@/components/WithWithout";
import BlogHighlight from "@/components/blog/BlogHighlight";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import config from "@/config";

export default function Page() {
  const contactPageCopy = config.copy.contactPage;
  const reviewsCtaCopy = config.copy.homepage.reviewsSection;
  const faqCopy = contactPageCopy.faqs;
  const blogHighlightCopy = contactPageCopy.blogHighlights;

  return (
    <>
      <main>
        <Hero
          title="Thank you for filling out the form"
          titleAccent="We'll be in touch"
          subtitle="We've received your bathroom renovation enquiry and will get back to you within 24 hours. You should also receive a confirmation email shortly."
          heroCTA="Go home"
          heroImgUrl={contactPageCopy.heroImgUrl}
          ctaTallyFormLink="/"
        />
        <SocialProof />
        <WithWithout />
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
