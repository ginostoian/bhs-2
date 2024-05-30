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
          title="Thank you for getting filling out the form. "
          titleAccent="We'll be in touch"
          subtitle="One of our team members will be in touch via email or phone shortly to further discuss your project. If you'd like to give us more information, click on the button bellow to fill out a detailed form."
          heroCTA="Detailed quote form"
          heroImgUrl={contactPageCopy.heroImgUrl}
          ctaTallyFormLink="https://tally.so/r/3x6L5n"
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
