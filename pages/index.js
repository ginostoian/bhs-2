import Head from "next/head";

import text from "../utils/text";
import Hero from "../components/hero/Hero";
import SocialProof from "../components/socialProof/SocialProof";
import SectionTitle from "../components/sectionTitle/SectionTitle";
import ContentRow from "../components/contentRow/ContentRow";
import TextGrid from "../components/textGrid/TextGrid";

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

const {
  title: generalRenovationTitle,
  subtitle: generalRenovationSubtitle,
  subtitleAccent: generalRenovationSubtitleAccent,
  p1: generalRenovationP1,
  p2: generalRenovationP2,
  CTA: generalRenovationCTA,
  imgSrc: generalRenovationImgSrc,
} = text.homepage.whatWeDoSection.generalRenovation;

const {
  title: interiorDesignTitle,
  subtitle: interiorDesignSubtitle,
  subtitleAccent: interiorDesignSubtitleAccent,
  p1: interiorDesignP1,
  p2: interiorDesignP2,
  CTA: interiorDesignCTA,
  imgSrc: interiorDesignImgSrc,
} = text.homepage.whatWeDoSection.interiorDesign;

const {
  title: houseExtensionTitle,
  subtitle: houseExtensionSubtitle,
  subtitleAccent: houseExtensionSubtitleAccent,
  p1: houseExtensionP1,
  p2: houseExtensionP2,
  CTA: houseExtensionCTA,
  imgSrc: houseExtensionImgSrc,
} = text.homepage.whatWeDoSection.houseExtension;

const {
  title: smartHomeTitle,
  subtitle: smartHomeSubtitle,
  subtitleAccent: smartHomeSubtitleAccent,
  p1: smartHomeP1,
  p2: smartHomeP2,
  CTA: smartHomeCTA,
  imgSrc: smartHomeImgSrc,
} = text.homepage.whatWeDoSection.smartHome;

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
      <ContentRow
        title={generalRenovationTitle}
        subtitle={generalRenovationSubtitle}
        subtitleAccent={generalRenovationSubtitleAccent}
        p1={generalRenovationP1}
        p2={generalRenovationP2}
        cta={generalRenovationCTA}
        imgSrc={generalRenovationImgSrc}
      />
      <ContentRow
        title={interiorDesignTitle}
        subtitle={interiorDesignSubtitle}
        subtitleAccent={interiorDesignSubtitleAccent}
        p1={interiorDesignP1}
        p2={interiorDesignP2}
        cta={interiorDesignCTA}
        imgSrc={interiorDesignImgSrc}
        order={true}
      />
      <ContentRow
        title={houseExtensionTitle}
        subtitle={houseExtensionSubtitle}
        subtitleAccent={houseExtensionSubtitleAccent}
        p1={houseExtensionP1}
        p2={houseExtensionP2}
        cta={houseExtensionCTA}
        imgSrc={houseExtensionImgSrc}
      />
      <ContentRow
        title={smartHomeTitle}
        subtitle={smartHomeSubtitle}
        subtitleAccent={smartHomeSubtitleAccent}
        p1={smartHomeP1}
        p2={smartHomeP2}
        cta={smartHomeCTA}
        imgSrc={smartHomeImgSrc}
        order={true}
      />
      <SectionTitle
        title={"How we do it"}
        subtitle={"Simple, fast and streamlined process"}
      />
      <TextGrid />
    </main>
  );
}
