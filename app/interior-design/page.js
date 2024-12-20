import Approach from "@/components/Approach";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import FeaturesListicle from "@/components/FeaturesListicle";
import Problem from "@/components/Problem";
import Testimonials11 from "@/components/Testimonials11";
import Testimonials3 from "@/components/Testimonials3";
import WithWithout from "@/components/WithWithout";
import BlogHighlight from "@/components/blog/BlogHighlight";
import ContentRow from "@/components/contentRow/ContentRow";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import config from "@/config";

export default function Page() {
  const interiorDesignCopy = config.copy.interiorDesignPage;
  const whatWeDoCopy = interiorDesignCopy.whatWeDoSection;
  const whatWeDoArr = [
    whatWeDoCopy.fullHome,
    whatWeDoCopy.bathroomInstallation,
    whatWeDoCopy.kitchenInstallation,
    whatWeDoCopy.structuralWork,
    whatWeDoCopy.heating,
    whatWeDoCopy.flooringInstallation,
  ];
  const howWeDoItCopy = interiorDesignCopy.howWeDoItSection;
  const reviewsCtaCopy = config.copy.homepage.reviewsSection;
  const faqCopy = interiorDesignCopy.faqs;
  const blogHighlightCopy = interiorDesignCopy.blogHighlights;

  return (
    <>
      <main>
        <Hero
          title={interiorDesignCopy.title}
          titleAccent={interiorDesignCopy.titleAccent}
          subtitle={interiorDesignCopy.subtitle}
          heroCTA={interiorDesignCopy.heroCTA}
          heroImgUrl={interiorDesignCopy.heroImgUrl}
          ctaTallyFormLink={interiorDesignCopy.ctaTallyFormLink}
        />
        <SocialProof />
        <Features />
        <Testimonials3 />
        <SectionTitle
          title="What we do"
          subtitle="Full service renovation company"
        />
        {/* {whatWeDoArr.map((item, i) => {
          return (
            <ContentRow
              key={i}
              title={item.title}
              subtitle={item.subtitle}
              subtitleAccent={item.subtitleAccent}
              p1={item.p1}
              p2={item.p2}
              cta={item.CTA}
              imgSrc={item.imgSrc}
              order={i % 2 === 0 ? false : true}
              slug={item.slug}
            />
          );
        })} */}
        <Approach />
        <WithWithout />
        <SectionTitle
          title="Our build approach"
          subtitle="Simple, fast and streamlined process"
        />
        <TextGrid content={howWeDoItCopy} />
        <Testimonials11 />
        <TextBlockDark content={reviewsCtaCopy} />
        <FAQ content={faqCopy} />
        <SectionTitle
          title="The Knowledge Center"
          subtitle="Where you actually learn new things"
        />
        <BlogHighlight articles={blogHighlightCopy} />
      </main>
    </>
  );
}
