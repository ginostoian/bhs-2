import Head from "next/head";

import text from "../utils/text";
import Hero from "../components/hero/Hero";
import SocialProof from "../components/socialProof/SocialProof";
import SectionTitle from "../components/sectionTitle/SectionTitle";
import ContentRow from "../components/contentRow/ContentRow";

const {
  title,
  titleAccent,
  subtitle,
  heroCTA,
  servicesSectionTitle,
  servicesSectionSubtitle,
} = text.homepage;

const {
  title: bathroomTitle,
  subtitle: bathroomSubtitle,
  subtitleAccent: bathroomSubtitleAccent,
  p1: bathroomP1,
  p2: bathroomP2,
  CTA: bathroomCTA,
  imgSrc: bathroomImgSrc,
} = text.homepage.whatWeDoSection.bathroom;

const {
  title: kitchenTitle,
  subtitle: kitchenSubtitle,
  subtitleAccent: kitchenSubtitleAccent,
  p1: kitchenP1,
  p2: kitchenP2,
  CTA: kitchenCTA,
  imgSrc: kitchenImgSrc,
} = text.homepage.whatWeDoSection.kitchen;

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
      <ContentRow
        title={bathroomTitle}
        subtitle={bathroomSubtitle}
        subtitleAccent={bathroomSubtitleAccent}
        p1={bathroomP1}
        p2={bathroomP2}
        cta={bathroomCTA}
        imgSrc={bathroomImgSrc}
        order={false}
      />
      <ContentRow
        title={kitchenTitle}
        subtitle={kitchenSubtitle}
        subtitleAccent={kitchenSubtitleAccent}
        p1={kitchenP1}
        p2={kitchenP2}
        cta={kitchenCTA}
        imgSrc={kitchenImgSrc}
        order={true}
      />
    </main>
  );
}
