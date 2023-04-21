import Head from "next/head";

import text from "../../../utils/text";
import Hero from "../../../components/hero/Hero";
import SocialProof from "../../../components/socialProof/SocialProof";
import SectionTitle from "../../../components/sectionTitle/SectionTitle";
import TextGrid from "../../../components/textGrid/TextGrid";
import ContentRow from "../../../components/contentRow/ContentRow";
import TextBlockDark from "../../../components/textBlockDark/TextBlockDark";
import Reviews from "../../../components/reviews/Reviews";
import Faq from "../../../components/faq/Faq";
import BlogHighlight from "../../../components/blog/BlogHighlight";

const AboutPage = () => {
  const { title, titleAccent, subtitle, heroCTA, heroImgUrl } =
    text.aboutPage.heroSection;

  const whyUsSection = text.aboutPage.whyUsSection;

  const { title: whyUsTitle, subtitle: whyUsSubtitle } =
    text.aboutPage.whyUsSectionHeader;

  const howWeDoItSection = text.aboutPage.howWeDoItSection;

  const reviewsSection = text.homepage.reviewsSection;

  const faqs = text.homepage.faqs;

  const blogHighlights = text.homepage.blogHighlights;

  return (
    <main>
      <Hero
        title={title}
        titleAccent={titleAccent}
        subtitle={subtitle}
        heroCTA={heroCTA}
        heroImgUrl={heroImgUrl}
      />
      <SocialProof />
      <SectionTitle
        title={whyUsTitle}
        subtitle={whyUsSubtitle}
      />
      <TextGrid content={whyUsSection} />
      <SectionTitle
        title={"How we do it"}
        subtitle={"Simple, fast and streamlined process"}
      />
      <TextGrid content={howWeDoItSection} />
      <SectionTitle
        title={"You are our priority."}
        subtitle={"Customer satisfaction is our goal."}
      />
      <TextBlockDark content={reviewsSection} />
      <Reviews />
      <SectionTitle
        title={"Frequent Questions"}
        subtitle={"Can't find an answer? Get in touch!"}
      />
      <Faq faqs={faqs} />
      <SectionTitle
        title={"The BH Studio Blog"}
        subtitle={"Inspiration, how-to, news and more!"}
      />
      <BlogHighlight articles={blogHighlights} />
    </main>
  );
};

export default AboutPage;
