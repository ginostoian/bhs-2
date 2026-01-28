import Link from "next/link";

import Approach from "@/components/Approach";
import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Testimonials11 from "@/components/Testimonials11";
import Stats from "@/components/Stats";
import Guarantee from "@/components/Guarantee";
import PortfolioCardContainer from "@/components/PortfolioCardContainer";
import Testimonials3 from "@/components/Testimonials3";
import BlogHighlight from "@/components/blog/BlogHighlight";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import CustomCTA from "@/components/CustomCTA";
import config from "@/config";

export default function Page() {
  const contactPageCopy = config.copy.contactPage;
  //   const whatWeDoCopy = aboutPageCopy.whatWeDoSection;
  //   const whatWeDoArr = [
  //     whatWeDoCopy.fullHome,
  //     whatWeDoCopy.bathroomInstallation,
  //     whatWeDoCopy.kitchenInstallation,
  //     whatWeDoCopy.structuralWork,
  //     whatWeDoCopy.heating,
  //     whatWeDoCopy.flooringInstallation,
  //   ];
  const howWeDoItCopy = contactPageCopy.howWeDoItSection;
  const reviewsCtaCopy = config.copy.homepage.reviewsSection;
  const faqCopy = contactPageCopy.faqs;
  const blogHighlightCopy = contactPageCopy.blogHighlights;

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
  ];

  return (
    <>
      <main>
        <Hero
          title={contactPageCopy.title}
          titleAccent={contactPageCopy.titleAccent}
          subtitle={contactPageCopy.subtitle}
          heroCTA={'Scroll Down for more info'}
          heroImgUrl={contactPageCopy.heroImgUrl}
        />
        <SocialProof />

        <ContactForm />

        {/* Warranty/Ticket Section */}
        <section className="mx-auto max-w-[85%] py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8 md:p-12">
              <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                  Need Warranty Support?
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                  If you have a warranty claim or need support with your
                  project, we have a dedicated ticketing system to help you get
                  the assistance you need quickly and efficiently.
                </p>
              </div>

              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-gray-900">
                    Our Warranty Promise
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-6 w-6 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Industry-leading workmanship guarantee
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-6 w-6 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Dedicated support team
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-6 w-6 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Fast response times
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="mr-2 mt-0.5 h-6 w-6 flex-shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Track your ticket progress online
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <div className="rounded-2xl bg-white p-6 shadow-lg">
                    <div className="mb-4">
                      <svg
                        className="mx-auto h-12 w-12 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h4 className="mb-2 text-lg font-semibold text-gray-900">
                      Submit a Support Ticket
                    </h4>
                    <p className="mb-4 text-gray-600">
                      Log in to your account to submit warranty claims and
                      support requests through our ticketing system.
                    </p>
                    <Link
                      href="/auth/signin?callbackUrl=/dashboard/tickets/new"
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Create Support Ticket
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
        <FAQ content={faqs} />
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
