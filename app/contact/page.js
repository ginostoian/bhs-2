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
import { getPageFaqs } from "@/libs/pageFaqs";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Contact Better Homes Studio | London Renovation Specialists",
  description:
    "Speak with Better Homes Studio about your London extension, loft conversion, kitchen, bathroom, or full renovation project. Free initial consultation.",
  canonicalUrlRelative: "/contact",
  openGraph: {
    title: "Contact Better Homes Studio",
    description:
      "Book a consultation for your London renovation, extension, loft, kitchen, or bathroom project.",
    url: `https://${config.domainName}/contact`,
  },
  keywords: [
    "contact renovation company London",
    "book renovation consultation London",
    "home extension consultation London",
  ],
});

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
  const blogHighlightCopy = contactPageCopy.blogHighlights;

  const faqs = getPageFaqs("contact");

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
