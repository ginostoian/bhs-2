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

const ExtenstionPage = () => {
  const { title, titleAccent, subtitle, heroCTA, heroImgUrl } =
    text.houseExtensionPage.heroSection;

  const whyUsSection = text.houseExtensionPage.whyUsSection;

  const { title: whyUsTitle, subtitle: whyUsSubtitle } =
    text.houseExtensionPage.whyUsSectionHeader;

  const { title: whatWeDoSectionTitle, subtitle: whatWeDoSectionSubtitle } =
    text.houseExtensionPage.whatWeDoSection.header;

  const {
    title: singleStoreyExtensionTitle,
    subtitle: singleStoreyExtensionSubtitle,
    subtitleAccent: singleStoreyExtensionSubtitleAccent,
    p1: singleStoreyExtensionP1,
    p2: singleStoreyExtensionP2,
    CTA: singleStoreyExtensionCTA,
    imgSrc: singleStoreyExtensionImgSrc,
    slug: singleStoreyExtensionSlug,
  } = text.houseExtensionPage.whatWeDoSection.singleStoreyExtension;

  const {
    title: sideReturnExtensionTitle,
    subtitle: sideReturnExtensionSubtitle,
    subtitleAccent: sideReturnExtensionSubtitleAccent,
    p1: sideReturnExtensionP1,
    p2: sideReturnExtensionP2,
    CTA: sideReturnExtensionCTA,
    imgSrc: sideReturnExtensionImgSrc,
    slug: sideReturnExtensionSlug,
  } = text.houseExtensionPage.whatWeDoSection.sideReturnExtension;

  const {
    title: doubleStoreyExtensionTitle,
    subtitle: doubleStoreyExtensionSubtitle,
    subtitleAccent: doubleStoreyExtensionSubtitleAccent,
    p1: doubleStoreyExtensionP1,
    p2: doubleStoreyExtensionP2,
    CTA: doubleStoreyExtensionCTA,
    imgSrc: doubleStoreyExtensionImgSrc,
    slug: doubleStoreyExtensionSlug,
  } = text.houseExtensionPage.whatWeDoSection.doubleStoreyExtension;

  const {
    title: overStructureExtensionTitle,
    subtitle: overStructureExtensionSubtitle,
    subtitleAccent: overStructureExtensionSubtitleAccent,
    p1: overStructureExtensionP1,
    p2: overStructureExtensionP2,
    CTA: overStructureExtensionCTA,
    imgSrc: overStructureExtensionImgSrc,
    slug: overStructureExtensionSlug,
  } = text.houseExtensionPage.whatWeDoSection.overStructureExtension;

  const {
    title: basementExtensionTitle,
    subtitle: basementExtensionSubtitle,
    subtitleAccent: basementExtensionSubtitleAccent,
    p1: basementExtensionP1,
    p2: basementExtensionP2,
    CTA: basementExtensionCTA,
    imgSrc: basementExtensionImgSrc,
    slug: basementExtensionSlug,
  } = text.houseExtensionPage.whatWeDoSection.basementExtension;

  const {
    title: loftConversionTitle,
    subtitle: loftConversionSubtitle,
    subtitleAccent: loftConversionSubtitleAccent,
    p1: loftConversionP1,
    p2: loftConversionP2,
    CTA: loftConversionCTA,
    imgSrc: loftConversionImgSrc,
    slug: loftConversionSlug,
  } = text.houseExtensionPage.whatWeDoSection.loftConversion;

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
        title={singleStoreyExtensionTitle}
        subtitle={singleStoreyExtensionSubtitle}
        subtitleAccent={singleStoreyExtensionSubtitleAccent}
        p1={singleStoreyExtensionP1}
        p2={singleStoreyExtensionP2}
        cta={singleStoreyExtensionCTA}
        imgSrc={singleStoreyExtensionImgSrc}
        order={false}
        slug={singleStoreyExtensionSlug}
      />
      <ContentRow
        title={sideReturnExtensionTitle}
        subtitle={sideReturnExtensionSubtitle}
        subtitleAccent={sideReturnExtensionSubtitleAccent}
        p1={sideReturnExtensionP1}
        p2={sideReturnExtensionP2}
        cta={sideReturnExtensionCTA}
        imgSrc={sideReturnExtensionImgSrc}
        order={true}
        slug={sideReturnExtensionSlug}
      />
      <ContentRow
        title={doubleStoreyExtensionTitle}
        subtitle={doubleStoreyExtensionSubtitle}
        subtitleAccent={doubleStoreyExtensionSubtitleAccent}
        p1={doubleStoreyExtensionP1}
        p2={doubleStoreyExtensionP2}
        cta={doubleStoreyExtensionCTA}
        imgSrc={doubleStoreyExtensionImgSrc}
        order={false}
        slug={doubleStoreyExtensionSlug}
      />
      <ContentRow
        title={overStructureExtensionTitle}
        subtitle={overStructureExtensionSubtitle}
        subtitleAccent={overStructureExtensionSubtitleAccent}
        p1={overStructureExtensionP1}
        p2={overStructureExtensionP2}
        cta={overStructureExtensionCTA}
        imgSrc={overStructureExtensionImgSrc}
        order={true}
        slug={overStructureExtensionSlug}
      />
      <ContentRow
        title={basementExtensionTitle}
        subtitle={basementExtensionSubtitle}
        subtitleAccent={basementExtensionSubtitleAccent}
        p1={basementExtensionP1}
        p2={basementExtensionP2}
        cta={basementExtensionCTA}
        imgSrc={basementExtensionImgSrc}
        order={false}
        slug={basementExtensionSlug}
      />
      <ContentRow
        title={loftConversionTitle}
        subtitle={loftConversionSubtitle}
        subtitleAccent={loftConversionSubtitleAccent}
        p1={loftConversionP1}
        p2={loftConversionP2}
        cta={loftConversionCTA}
        imgSrc={loftConversionImgSrc}
        order={true}
        slug={loftConversionSlug}
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

export default ExtenstionPage;
