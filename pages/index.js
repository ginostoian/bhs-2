import Head from "next/head";

import text from "../utils/text";
import Hero from "../components/hero/Hero";
import SocialProof from "../components/socialProof/SocialProof";

const { title, titleAccent, subtitle, heroCTA } = text.homepage;

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
    </main>
  );
}
