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

const GeneralRenovationPage = () => {
  const { title, titleAccent, subtitle, heroCTA, heroImgUrl } =
    text.generalRenovationPage.heroSection;

  const whyUsSection = text.generalRenovationPage.whyUsSection;

  const { title: whyUsTitle, subtitle: whyUsSubtitle } =
    text.generalRenovationPage.whyUsSectionHeader;

  const { title: whatWeDoSectionTitle, subtitle: whatWeDoSectionSubtitle } =
    text.generalRenovationPage.whatWeDoSection.header;

  const {
    title: fullHomeTitle,
    subtitle: fullHomeSubtitle,
    subtitleAccent: fullHomeSubtitleAccent,
    p1: fullHomeP1,
    p2: fullHomeP2,
    CTA: fullHomeCTA,
    imgSrc: fullHomeImgSrc,
    slug: fullHomeSlug,
  } = text.generalRenovationPage.whatWeDoSection.fullHome;

  const {
    title: kitchenInstallationTitle,
    subtitle: kitchenInstallationSubtitle,
    subtitleAccent: kitchenInstallationSubtitleAccent,
    p1: kitchenInstallationP1,
    p2: kitchenInstallationP2,
    CTA: kitchenInstallationCTA,
    imgSrc: kitchenInstallationImgSrc,
    slug: kitchenInstallationSlug,
  } = text.generalRenovationPage.whatWeDoSection.kitchenInstallation;

  const {
    title: bathroomInstallationTitle,
    subtitle: bathroomInstallationSubtitle,
    subtitleAccent: bathroomInstallationSubtitleAccent,
    p1: bathroomInstallationP1,
    p2: bathroomInstallationP2,
    CTA: bathroomInstallationCTA,
    imgSrc: bathroomInstallationImgSrc,
    slug: bathroomInstallationSlug,
  } = text.generalRenovationPage.whatWeDoSection.bathroomInstallation;

  const {
    title: flooringInstallationTitle,
    subtitle: flooringInstallationSubtitle,
    subtitleAccent: flooringInstallationSubtitleAccent,
    p1: flooringInstallationP1,
    p2: flooringInstallationP2,
    CTA: flooringInstallationCTA,
    imgSrc: flooringInstallationImgSrc,
    slug: flooringInstallationSlug,
  } = text.generalRenovationPage.whatWeDoSection.flooringInstallation;

  const {
    title: structuralWorkTitle,
    subtitle: structuralWorkSubtitle,
    subtitleAccent: structuralWorkSubtitleAccent,
    p1: structuralWorkP1,
    p2: structuralWorkP2,
    CTA: structuralWorkCTA,
    imgSrc: structuralWorkImgSrc,
    slug: structuralWorkSlug,
  } = text.generalRenovationPage.whatWeDoSection.structuralWork;

  const {
    title: heatingTitle,
    subtitle: heatingSubtitle,
    subtitleAccent: heatingSubtitleAccent,
    p1: heatingP1,
    p2: heatingP2,
    CTA: heatingCTA,
    imgSrc: heatingImgSrc,
    slug: heatingSlug,
  } = text.generalRenovationPage.whatWeDoSection.heating;

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
        title={fullHomeTitle}
        subtitle={fullHomeSubtitle}
        subtitleAccent={fullHomeSubtitleAccent}
        p1={fullHomeP1}
        p2={fullHomeP2}
        cta={fullHomeCTA}
        imgSrc={fullHomeImgSrc}
        order={false}
        slug={fullHomeSlug}
      />
      <ContentRow
        title={kitchenInstallationTitle}
        subtitle={kitchenInstallationSubtitle}
        subtitleAccent={kitchenInstallationSubtitleAccent}
        p1={kitchenInstallationP1}
        p2={kitchenInstallationP2}
        cta={kitchenInstallationCTA}
        imgSrc={kitchenInstallationImgSrc}
        order={true}
        slug={kitchenInstallationSlug}
      />
      <ContentRow
        title={bathroomInstallationTitle}
        subtitle={bathroomInstallationSubtitle}
        subtitleAccent={bathroomInstallationSubtitleAccent}
        p1={bathroomInstallationP1}
        p2={bathroomInstallationP2}
        cta={bathroomInstallationCTA}
        imgSrc={bathroomInstallationImgSrc}
        order={false}
        slug={bathroomInstallationSlug}
      />
      <ContentRow
        title={flooringInstallationTitle}
        subtitle={flooringInstallationSubtitle}
        subtitleAccent={flooringInstallationSubtitleAccent}
        p1={flooringInstallationP1}
        p2={flooringInstallationP2}
        cta={flooringInstallationCTA}
        imgSrc={flooringInstallationImgSrc}
        order={true}
        slug={flooringInstallationSlug}
      />
      <ContentRow
        title={structuralWorkTitle}
        subtitle={structuralWorkSubtitle}
        subtitleAccent={structuralWorkSubtitleAccent}
        p1={structuralWorkP1}
        p2={structuralWorkP2}
        cta={structuralWorkCTA}
        imgSrc={structuralWorkImgSrc}
        order={false}
        slug={structuralWorkSlug}
      />
      <ContentRow
        title={heatingTitle}
        subtitle={heatingSubtitle}
        subtitleAccent={heatingSubtitleAccent}
        p1={heatingP1}
        p2={heatingP2}
        cta={heatingCTA}
        imgSrc={heatingImgSrc}
        order={true}
        slug={heatingSlug}
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

export default GeneralRenovationPage;
