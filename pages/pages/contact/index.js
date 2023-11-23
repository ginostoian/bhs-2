import ContentRow from "../../../components/contentRow/ContentRow";
import Hero from "../../../components/hero/Hero";
import SocialProof from "../../../components/socialProof/SocialProof";
import TextBlockDark from "../../../components/textBlockDark/TextBlockDark";
import text from "../../../utils/text";

const ContactPage = () => {
  const { title, titleAccent, subtitle, heroCTA, heroImgUrl } =
    text.contactPage.heroSection;

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

      <iframe
        data-tally-src="https://tally.so/embed/wQEoXw?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        loading="lazy"
        width="100%"
        height="200"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        title="Contact us
"
      ></iframe>
    </main>
  );
};

export default ContactPage;
