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

const BathroomRenovationPage = () => {
  const { title, titleAccent, subtitle, heroCTA, heroImgUrl } =
    text.bathroomPage.heroSection;

  const whyUsSection = text.bathroomPage.whyUsSection;

  const { title: whyUsTitle, subtitle: whyUsSubtitle } =
    text.bathroomPage.whyUsSectionHeader;

  const { title: whatWeDoSectionTitle, subtitle: whatWeDoSectionSubtitle } =
    text.bathroomPage.whatWeDoSection.header;

  const {
    title: bathroomDesignTitle,
    subtitle: bathroomDesignSubtitle,
    subtitleAccent: bathroomDesignSubtitleAccent,
    p1: bathroomDesignP1,
    p2: bathroomDesignP2,
    CTA: bathroomDesignCTA,
    imgSrc: bathroomDesignImgSrc,
    slug: bathroomDesignSlug,
  } = text.bathroomPage.whatWeDoSection.bathroomDesign;

  const {
    title: smallBathroomTitle,
    subtitle: smallBathroomSubtitle,
    subtitleAccent: smallBathroomSubtitleAccent,
    p1: smallBathroomP1,
    p2: smallBathroomP2,
    CTA: smallBathroomCTA,
    imgSrc: smallBathroomImgSrc,
    slug: smallBathroomSlug,
  } = text.bathroomPage.whatWeDoSection.smallBathroom;

  const {
    title: modernBathroomTitle,
    subtitle: modernBathroomSubtitle,
    subtitleAccent: modernBathroomSubtitleAccent,
    p1: modernBathroomP1,
    p2: modernBathroomP2,
    CTA: modernBathroomCTA,
    imgSrc: modernBathroomImgSrc,
    slug: modernBathroomSlug,
  } = text.bathroomPage.whatWeDoSection.modernBathroom;

  const {
    title: industrialBathroomTitle,
    subtitle: industrialBathroomSubtitle,
    subtitleAccent: industrialBathroomSubtitleAccent,
    p1: industrialBathroomP1,
    p2: industrialBathroomP2,
    CTA: industrialBathroomCTA,
    imgSrc: industrialBathroomImgSrc,
    slug: industrialBathroomSlug,
  } = text.bathroomPage.whatWeDoSection.industrialBathroom;

  const {
    title: traditionalBathroomTitle,
    subtitle: traditionalBathroomSubtitle,
    subtitleAccent: traditionalBathroomSubtitleAccent,
    p1: traditionalBathroomP1,
    p2: traditionalBathroomP2,
    CTA: traditionalBathroomCTA,
    imgSrc: traditionalBathroomImgSrc,
    slug: traditionalBathroomSlug,
  } = text.bathroomPage.whatWeDoSection.traditionalBathroom;

  const {
    title: victorianBathroomTitle,
    subtitle: victorianBathroomSubtitle,
    subtitleAccent: victorianBathroomSubtitleAccent,
    p1: victorianBathroomP1,
    p2: victorianBathroomP2,
    CTA: victorianBathroomCTA,
    imgSrc: victorianBathroomImgSrc,
    slug: victorianBathroomSlug,
  } = text.bathroomPage.whatWeDoSection.victorianBathroom;

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
        title={bathroomDesignTitle}
        subtitle={bathroomDesignSubtitle}
        subtitleAccent={bathroomDesignSubtitleAccent}
        p1={bathroomDesignP1}
        p2={bathroomDesignP2}
        cta={bathroomDesignCTA}
        imgSrc={bathroomDesignImgSrc}
        order={false}
        slug={bathroomDesignSlug}
      />
      <ContentRow
        title={smallBathroomTitle}
        subtitle={smallBathroomSubtitle}
        subtitleAccent={smallBathroomSubtitleAccent}
        p1={smallBathroomP1}
        p2={smallBathroomP2}
        cta={smallBathroomCTA}
        imgSrc={smallBathroomImgSrc}
        order={true}
        slug={smallBathroomSlug}
      />
      <ContentRow
        title={modernBathroomTitle}
        subtitle={modernBathroomSubtitle}
        subtitleAccent={modernBathroomSubtitleAccent}
        p1={modernBathroomP1}
        p2={modernBathroomP2}
        cta={modernBathroomCTA}
        imgSrc={modernBathroomImgSrc}
        order={false}
        slug={modernBathroomSlug}
      />
      <ContentRow
        title={industrialBathroomTitle}
        subtitle={industrialBathroomSubtitle}
        subtitleAccent={industrialBathroomSubtitleAccent}
        p1={industrialBathroomP1}
        p2={industrialBathroomP2}
        cta={industrialBathroomCTA}
        imgSrc={industrialBathroomImgSrc}
        order={true}
        slug={industrialBathroomSlug}
      />
      <ContentRow
        title={traditionalBathroomTitle}
        subtitle={traditionalBathroomSubtitle}
        subtitleAccent={traditionalBathroomSubtitleAccent}
        p1={traditionalBathroomP1}
        p2={traditionalBathroomP2}
        cta={traditionalBathroomCTA}
        imgSrc={traditionalBathroomImgSrc}
        order={false}
        slug={traditionalBathroomSlug}
      />
      <ContentRow
        title={victorianBathroomTitle}
        subtitle={victorianBathroomSubtitle}
        subtitleAccent={victorianBathroomSubtitleAccent}
        p1={victorianBathroomP1}
        p2={victorianBathroomP2}
        cta={victorianBathroomCTA}
        imgSrc={victorianBathroomImgSrc}
        order={true}
        slug={victorianBathroomSlug}
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

export default BathroomRenovationPage;
