import Head from "next/head";

import text from "../utils/text";
import Hero from "../components/hero/Hero";
import SocialProof from "../components/socialProof/SocialProof";
import SectionTitle from "../components/sectionTitle/SectionTitle";
import ContentRow from "../components/contentRow/ContentRow";
import TextGrid from "../components/textGrid/TextGrid";
import Reviews from "../components/reviews/Reviews";
import TextBlockDark from "../components/textBlockDark/TextBlockDark";
import Faq from "../components/faq/Faq";
import BlogHighlight from "../components/blog/BlogHighlight";

const {
  title,
  titleAccent,
  subtitle,
  heroCTA,
  heroImgUrl,
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
  slug: bathroomSlug,
} = text.homepage.whatWeDoSection.bathroom;

const {
  title: kitchenTitle,
  subtitle: kitchenSubtitle,
  subtitleAccent: kitchenSubtitleAccent,
  p1: kitchenP1,
  p2: kitchenP2,
  CTA: kitchenCTA,
  imgSrc: kitchenImgSrc,
  slug: kitchenSlug,
} = text.homepage.whatWeDoSection.kitchen;

const {
  title: generalRenovationTitle,
  subtitle: generalRenovationSubtitle,
  subtitleAccent: generalRenovationSubtitleAccent,
  p1: generalRenovationP1,
  p2: generalRenovationP2,
  CTA: generalRenovationCTA,
  imgSrc: generalRenovationImgSrc,
  slug: generalRenovationSlug,
} = text.homepage.whatWeDoSection.generalRenovation;

const {
  title: interiorDesignTitle,
  subtitle: interiorDesignSubtitle,
  subtitleAccent: interiorDesignSubtitleAccent,
  p1: interiorDesignP1,
  p2: interiorDesignP2,
  CTA: interiorDesignCTA,
  imgSrc: interiorDesignImgSrc,
  slug: interiorDesignSlug,
} = text.homepage.whatWeDoSection.interiorDesign;

const {
  title: houseExtensionTitle,
  subtitle: houseExtensionSubtitle,
  subtitleAccent: houseExtensionSubtitleAccent,
  p1: houseExtensionP1,
  p2: houseExtensionP2,
  CTA: houseExtensionCTA,
  imgSrc: houseExtensionImgSrc,
  slug: houseExtensionSlug,
} = text.homepage.whatWeDoSection.houseExtension;

const {
  title: smartHomeTitle,
  subtitle: smartHomeSubtitle,
  subtitleAccent: smartHomeSubtitleAccent,
  p1: smartHomeP1,
  p2: smartHomeP2,
  CTA: smartHomeCTA,
  imgSrc: smartHomeImgSrc,
  slug: smartHomeSlug,
} = text.homepage.whatWeDoSection.smartHome;

const howWeDoItSection = text.homepage.howWeDoItSection;

const reviewsSection = text.homepage.reviewsSection;

const faqs = text.homepage.faqs;

const blogHighlights = text.homepage.blogHighlights;
export default function Home() {
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
        slug={bathroomSlug}
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
        slug={kitchenSlug}
      />
      <ContentRow
        title={generalRenovationTitle}
        subtitle={generalRenovationSubtitle}
        subtitleAccent={generalRenovationSubtitleAccent}
        p1={generalRenovationP1}
        p2={generalRenovationP2}
        cta={generalRenovationCTA}
        imgSrc={generalRenovationImgSrc}
        slug={generalRenovationSlug}
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
        slug={interiorDesignSlug}
      />
      <ContentRow
        title={houseExtensionTitle}
        subtitle={houseExtensionSubtitle}
        subtitleAccent={houseExtensionSubtitleAccent}
        p1={houseExtensionP1}
        p2={houseExtensionP2}
        cta={houseExtensionCTA}
        imgSrc={houseExtensionImgSrc}
        slug={houseExtensionSlug}
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
        slug={smartHomeSlug}
      />
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
}
