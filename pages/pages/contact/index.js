import Script from "next/script";
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
        ctaTallyFormLink="#contactForm"
      />
      <SocialProof />

      <iframe
        data-tally-src="https://tally.so/embed/wQEoXw?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        width="100%"
        height="300"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title="Contact us"
        className="contact-iframe"
        id="contactForm"
      ></iframe>
      <Script
        id="tally-js"
        src="https://tally.so/widgets/embed.js"
        onLoad={() => {
          Tally.loadEmbeds();
        }}
      />
    </main>
  );
};

export default ContactPage;
