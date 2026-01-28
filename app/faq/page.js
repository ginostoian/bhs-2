import Link from "next/link";
import Script from "next/script";

import Approach from "@/components/Approach";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import CustomCTA from "@/components/CustomCTA";
import Stats from "@/components/Stats";
import Testimonials11 from "@/components/Testimonials11";
import Guarantee from "@/components/Guarantee";
import PortfolioCardContainer from "@/components/PortfolioCardContainer";
import Testimonials3 from "@/components/Testimonials3";
import BlogHighlight from "@/components/blog/BlogHighlight";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import config from "@/config";

export default function Page() {
  const faqPageCopy = config.copy.faqPage;
  const howWeDoItCopy = faqPageCopy.howWeDoItSection;
  const reviewsCtaCopy = config.copy.homepage.reviewsSection;
  const faqCopy = faqPageCopy.faqs;
  const blogHighlightCopy = faqPageCopy.blogHighlights;

  const faqs = [
    {
      question: "Who is Better Homes Studio?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          We are a full-service renovation company. We manage everything from
          kitchen renovations to building extensions and converting lofts. We bet
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
          Yes, we have comprehensive insurance that covers all our projects.
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
    // New FAQ items for better SEO coverage
    {
      question: "How much does a house extension cost in London?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          House extension costs in London typically range from £2,500 to £4,500
          per square metre, depending on the complexity and finish level. A
          single-storey extension might cost £25,000-£45,000, while a
          double-storey extension could range from £45,000-£80,000. We offer
          free extension cost calculators on our website to help you estimate
          your project.
        </div>
      ),
    },
    {
      question: "What planning permission do I need for a loft conversion?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Most loft conversions fall under permitted development rights, meaning
          you won&apos;t need planning permission. However, if your property is
          listed, in a conservation area, or exceeds certain size limits,
          you&apos;ll need to apply. Our team can assess your specific situation
          and handle all planning applications on your behalf.
        </div>
      ),
    },
    {
      question: "How long does a kitchen renovation take?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          A typical kitchen renovation takes 3-6 weeks depending on the scope.
          Simple updates might take 2-3 weeks, while complete kitchen remodels
          with structural changes can take 6-8 weeks. We always provide detailed
          timelines during the planning phase and keep you updated throughout
          the process.
        </div>
      ),
    },
    {
      question: "Do you offer interior design services?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Yes, we provide comprehensive interior design services including space
          planning, colour schemes, furniture selection, and lighting design.
          Our interior designers work closely with our construction team to
          ensure your vision is perfectly executed. We can handle everything
          from concept to completion.
        </div>
      ),
    },
    {
      question: "What's included in a bathroom renovation package?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Our bathroom renovation packages include design consultation,
          demolition, plumbing and electrical work, tiling, installation of
          fixtures, painting, and final finishing. We also handle all necessary
          permits and inspections. Additional services like underfloor heating
          or smart technology can be added to any package.
        </div>
      ),
    },
    {
      question: "Can you help with structural work and building regulations?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Absolutely. Our team includes qualified structural engineers and
          we&apos;re fully compliant with all building regulations. We handle
          structural assessments, calculations, and ensure all work meets
          current building standards. This includes foundations, load-bearing
          walls, and structural modifications for extensions.
        </div>
      ),
    },
    {
      question: "Do you work with architects and surveyors?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Yes, we have established relationships with local architects,
          surveyors, and other professionals. For complex projects requiring
          architectural drawings or structural surveys, we can recommend trusted
          partners or work with your existing team. We coordinate all aspects to
          ensure smooth project delivery.
        </div>
      ),
    },
    {
      question: "What warranty do you provide on materials and installations?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          We provide comprehensive warranties: up to 10 years on workmanship,
          2-5 years on installations depending on the product, and manufacturer
          warranties on materials. All our work is guaranteed, and we&apos;re
          members of professional trade associations that provide additional
          consumer protection.
        </div>
      ),
    },
    {
      question: "How do you handle project management and communication?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Each project has a dedicated project manager who serves as your single
          point of contact. We provide regular updates, photos of progress, and
          are available via phone, email, or our project management app.
          You&apos;ll always know what&apos;s happening and when the next
          milestone is due.
        </div>
      ),
    },
    {
      question: "Do you offer financing options for large renovation projects?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Yes, we offer flexible payment plans and can work with various
          financing options. Ask us more about this by contacting us.
        </div>
      ),
    },
    {
      question:
        "What makes Better Homes Studio different from other contractors?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          We&apos;re a full-service company that handles everything from design
          to completion under one roof. Our team includes qualified
          tradespeople, designers, and project managers. We use premium
          materials, provide transparent pricing, and offer industry-leading
          warranties. Most importantly, we treat your home like our own and
          ensure every detail meets our high standards.
        </div>
      ),
    },
    {
      question: "Can you work around my schedule and minimize disruption?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Absolutely. We understand that renovations can be disruptive, so we
          work around your schedule and lifestyle. We can work in phases,
          schedule noisy work during specific hours, and always clean up
          thoroughly each day. For kitchen renovations, we can set up temporary
          cooking facilities to minimize inconvenience.
        </div>
      ),
    },
    {
      question:
        "Do you provide post-completion support and maintenance advice?",
      answer: (
        <div className="space-y-2 leading-relaxed">
          Yes, we provide comprehensive aftercare including maintenance guides,
          warranty information, and ongoing support. Our team is always
          available to answer questions about your new space. We also offer
          maintenance packages for ongoing care of your renovation, ensuring it
          stays beautiful for years to come.
        </div>
      ),
    },
  ];

  // Simple schema markup for FAQ page
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: "Answer provided by Better Homes Studio",
      },
    })),
  };

  // Simple local business schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Better Homes Studio",
    description: "Full service renovation company in London",
    url: "https://bhstudio.co.uk",
    areaServed: "London",
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <main>
        <Hero
          title={faqPageCopy.title}
          titleAccent={faqPageCopy.titleAccent}
          subtitle={faqPageCopy.subtitle}
          heroCTA={faqPageCopy.heroCTA}
          heroImgUrl={faqPageCopy.heroImgUrl}
          ctaTallyFormLink={faqPageCopy.ctaTallyFormLink}
        />
        <SocialProof />
        <FAQ content={faqs} />
        <SectionTitle
          title="Why choose us"
          subtitle="Our values are our promises to you"
        />
        <Features />
        <Testimonials3 />
        <Stats />
        <SectionTitle />
        <Approach />
        <SectionTitle
          title="Our build approach"
          subtitle="Simple, fast and streamlined process"
        />
        <TextGrid content={howWeDoItCopy} />
        <Testimonials11 />
        <PortfolioCardContainer />
        <Guarantee />
        <CustomCTA />
        <SectionTitle />
        <TextBlockDark content={reviewsCtaCopy} />
        <SectionTitle
          title="The Knowledge Center"
          subtitle="Where you actually learn new things"
        />
        <BlogHighlight articles={blogHighlightCopy} />
      </main>
    </>
  );
}
