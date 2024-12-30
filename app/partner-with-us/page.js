import Approach from "@/components/Approach";
import CustomCTA from "@/components/CustomCTA";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Guarantee from "@/components/Guarantee";
import InfoPartner from "@/components/InfoPartner";
import PortfolioCardContainer from "@/components/PortfolioCardContainer";
import Stats from "@/components/Stats";
import Testimonials11 from "@/components/Testimonials11";
import Testimonials3 from "@/components/Testimonials3";
import WhoCanPartner from "@/components/WhoCanPartner";
import BlogHighlight from "@/components/blog/BlogHighlight";
import ContentRow from "@/components/contentRow/ContentRow";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import config from "@/config";
import Link from "next/link";

export default function Page() {
  const bathroomPageCopy = config.copy.bathroomPage;
  const whatWeDoCopy = bathroomPageCopy.whatWeDoSection;
  const whatWeDoArr = [
    whatWeDoCopy.bathroomDesign,
    whatWeDoCopy.modernBathroom,
    whatWeDoCopy.industrialBathroom,
    whatWeDoCopy.traditionalBathroom,
    whatWeDoCopy.smallBathroom,
    whatWeDoCopy.victorianBathroom,
  ];
  const howWeDoItCopy = bathroomPageCopy.howWeDoItSection;

  const faqs = [
    {
      question: "Who is Better Homes Studio?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          We are a full service renovation company. We manage everything from
          interior design to building extensions and converting lofts. We bet
          there is nothing you can throw at us that we can&apos;t do.
        </div>
      ),
    },
    {
      question: "Where does Better Homes Studio operate and serve clients?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          At this time, we offer our renovation services in London, specifically
          East, North and Central London. If the project is right, please
          contact us if you are located anywhere else in the London so we can
          see if we can work together.
        </div>
      ),
    },
    {
      question: "Is Better Homes Studio insured?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Yes, we have comprehensive insurance that covers all our project.
          Contact us if you&apos;d like to find out more.
        </div>
      ),
    },
    {
      question: "What if I find a lower price for my project?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          We are confident in our industry average pricing, while delivering
          more value than 95% of companies and exceptional customer support. If
          you find a comparable service at a lower price, we are more than happy
          to discuss pricing with you.
        </div>
      ),
    },
    {
      question: "What is the average cost of a bathroom or kitchen renovation?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          The average bathroom renovation in London ranges between £7K and £12K.
          For kitchen renovations, the average costs can be between £9K and
          £15K. At Better Homes Studio, we are confident in our value and
          industry-average pricing.
        </div>
      ),
    },
    {
      question: "What should I expect during the construction process?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Before any work begins, our renovation team protects all the door
          openings to prevent dust from spreading to other areas in your home.
          We also protect the floors, furniture and your belongings so they stay
          in mint condition during the remodeling. Once everything is protected,
          we begin with demolition including fixture removal and wall tearing.
          Rest assured, we will work with you to plan accordingly and minimize
          any inconvenience.
        </div>
      ),
    },
    {
      question: "How does payment work with Better Homes Studio?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          We will ask you to pay a deposit upon agreeing to work together. The
          deposit ranges between £300 and £1,000 depending on the size of the
          project. Before starting the project, we will divide the remaining
          total by the number of weeks we expect the project to take and invoice
          you at the end of each week. There will always be 5% - 10% left to be
          paid after completion and snagging for your peace of mind.
        </div>
      ),
    },
    {
      question: "Is there a workmanship guarantee?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Of course. We offer a industry leading workmanship guarantee of up to
          10 years depending on the project type. If you&apos;d like to find out
          more about it, please{" "}
          <Link href="/our-guarantee">read more here</Link>.
        </div>
      ),
    },
  ];

  return (
    <>
      <main>
        <Hero
          title="Tap into the Better Homes Studio Network."
          titleAccent="Unlock new revenue opportunities."
          subtitle="Refer your clients to our trusted renovation services, and we will reward you for every successful project—ensuring both you and your clients benefit from our expertise. It is a simple, rewarding partnership designed for mutual success."
          heroCTA="Start Application - Start earning more"
          heroImgUrl="professionals-hero.webp"
          ctaTallyFormLink="/contact"
        />
        <InfoPartner />
        <WhoCanPartner />
        <Features />

        <Stats />
        <SectionTitle />
        <Approach />
        <SectionTitle
          title="Our build approach"
          subtitle="Simple, fast and streamlined process"
        />
        <TextGrid content={howWeDoItCopy} />
        <Testimonials11 />
        <Guarantee />
        <FAQ content={faqs} />
      </main>
    </>
  );
}
