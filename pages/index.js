import Head from "next/head";

import text from "../utils/text";
import Hero from "../components/hero/Hero";
import SocialProof from "../components/socialProof/SocialProof";
import SectionTitle from "../components/sectionTitle/SectionTitle";

const {
  title,
  titleAccent,
  subtitle,
  heroCTA,
  servicesSectionTitle,
  servicesSectionSubtitle,
} = text.homepage;

export default function Home() {
  return (
    <main>
      <Hero
        title={title}
        titleAccent={titleAccent}
        subtitle={subtitle}
        heroCTA={heroCTA}
      />
      <SocialProof />
      <SectionTitle
        title={servicesSectionTitle}
        subtitle={servicesSectionSubtitle}
      />
    </main>
  );
}
