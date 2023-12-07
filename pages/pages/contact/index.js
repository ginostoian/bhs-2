import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import { useState } from "react";

import Hero from "../../../components/hero/Hero";
import SocialProof from "../../../components/socialProof/SocialProof";
import text from "../../../utils/text";

const ContactPage = () => {
  const { title, titleAccent, subtitle, heroCTA, heroImgUrl } =
    text.contactPage.heroSection;

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const scriptTag = document.createElement("script");

    scriptTag.src = "https://tally.so/widgets/embed.js";
    scriptTag.addEventListener("load", () => setLoaded(true));

    document.body.appendChild(scriptTag);
  }, []);

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
    </main>
  );
};

export default ContactPage;
