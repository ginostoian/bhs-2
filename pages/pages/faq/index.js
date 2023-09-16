import Hero from "../../../components/hero/Hero";
import text from "../../../utils/text";
import SocialProof from "../../../components/socialProof/SocialProof";
import SectionTitle from "../../../components/sectionTitle/SectionTitle";
import Faq from "../../../components/faq/Faq";

const FaqPage = () => {
  const { title, titleAccent, subtitle, heroCTA, heroImgUrl } =
    text.faqPage.heroSection;

  const faqs = text.homepage.faqs;

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
        title={"Frequent Questions"}
        subtitle={"Can't find an answer? Get in touch!"}
      />
      <Faq faqs={faqs} />
    </main>
  );
};

export default FaqPage;
