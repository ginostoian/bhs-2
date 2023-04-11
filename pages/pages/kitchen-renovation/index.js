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

const KitchenRenovationPage = () => {
  const { title, titleAccent, subtitle, heroCTA, heroImgUrl } =
    text.kitchenPage.heroSection;

  const whyUsSection = text.kitchenPage.whyUsSection;

  const { title: whyUsTitle, subtitle: whyUsSubtitle } =
    text.kitchenPage.whyUsSectionHeader;

  const { title: whatWeDoSectionTitle, subtitle: whatWeDoSectionSubtitle } =
    text.kitchenPage.whatWeDoSection.header;

  const {
    title: kitchenDesignTitle,
    subtitle: kitchenDesignSubtitle,
    subtitleAccent: kitchenDesignSubtitleAccent,
    p1: kitchenDesignP1,
    p2: kitchenDesignP2,
    CTA: kitchenDesignCTA,
    imgSrc: kitchenDesignImgSrc,
    slug: kitchenDesignSlug,
  } = text.kitchenPage.whatWeDoSection.kitchenDesign;

  const {
    title: smallKitchenTitle,
    subtitle: smallKitchenSubtitle,
    subtitleAccent: smallKitchenSubtitleAccent,
    p1: smallKitchenP1,
    p2: smallKitchenP2,
    CTA: smallKitchenCTA,
    imgSrc: smallKitchenImgSrc,
    slug: smallKitchenSlug,
  } = text.kitchenPage.whatWeDoSection.smallKitchen;

  const {
    title: modernKitchenTitle,
    subtitle: modernKitchenSubtitle,
    subtitleAccent: modernKitchenSubtitleAccent,
    p1: modernKitchenP1,
    p2: modernKitchenP2,
    CTA: modernKitchenCTA,
    imgSrc: modernKitchenImgSrc,
    slug: modernKitchenSlug,
  } = text.kitchenPage.whatWeDoSection.modernKitchen;

  const {
    title: industrialKitchenTitle,
    subtitle: industrialKitchenSubtitle,
    subtitleAccent: industrialKitchenSubtitleAccent,
    p1: industrialKitchenP1,
    p2: industrialKitchenP2,
    CTA: industrialKitchenCTA,
    imgSrc: industrialKitchenImgSrc,
    slug: industrialKitchenSlug,
  } = text.kitchenPage.whatWeDoSection.industrialKitchen;

  const {
    title: openPlanKitchenTitle,
    subtitle: openPlanKitchenSubtitle,
    subtitleAccent: openPlanKitchenSubtitleAccent,
    p1: openPlanKitchenP1,
    p2: openPlanKitchenP2,
    CTA: openPlanKitchenCTA,
    imgSrc: openPlanKitchenImgSrc,
    slug: openPlanKitchenSlug,
  } = text.kitchenPage.whatWeDoSection.openPlanKitchen;

  const {
    title: kitchenInExtensionTitle,
    subtitle: kitchenInExtensionSubtitle,
    subtitleAccent: kitchenInExtensionSubtitleAccent,
    p1: kitchenInExtensionP1,
    p2: kitchenInExtensionP2,
    CTA: kitchenInExtensionCTA,
    imgSrc: kitchenInExtensionImgSrc,
    slug: kitchenInExtensionSlug,
  } = text.kitchenPage.whatWeDoSection.kitchenInExtension;

  const howWeDoItSection = text.homepage.howWeDoItSection;

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
        title={whatWeDoSectionTitle}
        subtitle={whatWeDoSectionSubtitle}
      />
      <ContentRow
        title={kitchenDesignTitle}
        subtitle={kitchenDesignSubtitle}
        subtitleAccent={kitchenDesignSubtitleAccent}
        p1={kitchenDesignP1}
        p2={kitchenDesignP2}
        cta={kitchenDesignCTA}
        imgSrc={kitchenDesignImgSrc}
        order={false}
        slug={kitchenDesignSlug}
      />
      <ContentRow
        title={smallKitchenTitle}
        subtitle={smallKitchenSubtitle}
        subtitleAccent={smallKitchenSubtitleAccent}
        p1={smallKitchenP1}
        p2={smallKitchenP2}
        cta={smallKitchenCTA}
        imgSrc={smallKitchenImgSrc}
        order={true}
        slug={smallKitchenSlug}
      />
      <ContentRow
        title={modernKitchenTitle}
        subtitle={modernKitchenSubtitle}
        subtitleAccent={modernKitchenSubtitleAccent}
        p1={modernKitchenP1}
        p2={modernKitchenP2}
        cta={modernKitchenCTA}
        imgSrc={modernKitchenImgSrc}
        order={false}
        slug={modernKitchenSlug}
      />
      <ContentRow
        title={industrialKitchenTitle}
        subtitle={industrialKitchenSubtitle}
        subtitleAccent={industrialKitchenSubtitleAccent}
        p1={industrialKitchenP1}
        p2={industrialKitchenP2}
        cta={industrialKitchenCTA}
        imgSrc={industrialKitchenImgSrc}
        order={true}
        slug={industrialKitchenSlug}
      />
      <ContentRow
        title={openPlanKitchenTitle}
        subtitle={openPlanKitchenSubtitle}
        subtitleAccent={openPlanKitchenSubtitleAccent}
        p1={openPlanKitchenP1}
        p2={openPlanKitchenP2}
        cta={openPlanKitchenCTA}
        imgSrc={openPlanKitchenImgSrc}
        order={false}
        slug={openPlanKitchenSlug}
      />
      <ContentRow
        title={kitchenInExtensionTitle}
        subtitle={kitchenInExtensionSubtitle}
        subtitleAccent={kitchenInExtensionSubtitleAccent}
        p1={kitchenInExtensionP1}
        p2={kitchenInExtensionP2}
        cta={kitchenInExtensionCTA}
        imgSrc={kitchenInExtensionImgSrc}
        order={true}
        slug={kitchenInExtensionSlug}
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
};

export default KitchenRenovationPage;
