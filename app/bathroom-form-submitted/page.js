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
import { getKnowledgeCenterArticles } from "@/libs/knowledgeCenter";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Bathroom Enquiry Submitted | Better Homes",
  description: "Your bathroom renovation enquiry has been submitted successfully.",
  canonicalUrlRelative: "/bathroom-form-submitted",
  extraTags: {
    robots: {
      index: false,
      follow: true,
    },
  },
});

export default function Page() {
  const contactPageCopy = config.copy.contactPage;
  const reviewsCtaCopy = config.copy.homepage.reviewsSection;
  const faqCopy = contactPageCopy.faqs;
  const knowledgeCenterArticles = getKnowledgeCenterArticles("bathroom");

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
        <BlogHighlight articles={knowledgeCenterArticles} />
      </main>
    </>
  );
}
