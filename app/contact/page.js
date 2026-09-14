import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { getPageFaqs } from "@/libs/pageFaqs";
import Faq from "@/components/brand/Faq";
import { FaqSchema } from "@/components/brand/Schema";
import { ProjectCards, ProjectCTA } from "@/components/brand/ServicePage";
import { getPortfolioProjects } from "@/libs/portfolio-projects";
import EnquiryForm from "@/components/brand/EnquiryForm";
export const metadata = getSEOTags({
  title: "Contact Better Homes | London Renovation Specialists",
  description:
    "Speak with Better Homes about your London extension, loft conversion, kitchen, bathroom, or full renovation project. Free initial consultation.",
  canonicalUrlRelative: "/contact",
  openGraph: {
    title: "Contact Better Homes",
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
export default function Page({ searchParams }) {
  const serviceNames = {
    Extensions: "Extension",
    Extension: "Extension",
    "Loft conversions": "Loft conversion",
    "Whole-home renovations": "Whole-home renovation",
    "Kitchen renovations": "Kitchen renovation",
    "Bathroom renovations": "Bathroom renovation",
    "Basement conversions": "Basement conversion",
  };
  const defaultService = serviceNames[searchParams?.service] || "Not sure yet";
  const faqs = getPageFaqs("contact");
  return (
    <main>
      <section className="bh-wrap bh-section bh-grid-two">
        <div>
          <p className="bh-eyebrow">Send us your brief</p>
          <h1 className="bh-title">
            Tell us what a better home looks like to you.
          </h1>
          <p className="bh-lead">
            Send a few details and we will reply personally, usually within one
            working day. Prefer to talk first? Choose a time for a 20-minute
            call.
          </p>
          <div className="bh-actions">
            <a href="https://cal.com/bhstudio/discovery" className="bh-button">
              Book a 20-minute call
            </a>
            <a href="tel:+447922391591" className="bh-text-link">
              07922 391591
            </a>
          </div>
          <div style={{ marginTop: 40 }}>
            <p className="bh-eyebrow">Where we work</p>
            <p>
              Central, North and East London, with selected projects in South
              London. Include your postcode so we can confirm coverage.
            </p>
          </div>
          <div style={{ marginTop: 32 }}>
            <p className="bh-eyebrow">Existing clients</p>
            <p>
              For project questions and aftercare,{" "}
              <Link className="bh-text-link" href="/dashboard/tickets">
                open a support request in your portal
              </Link>
              .
            </p>
          </div>
        </div>
        <div id="brief">
          <h2 className="bh-heading">Send us your brief</h2>
          <EnquiryForm defaultService={defaultService} />
        </div>
      </section>
      <Faq items={faqs} />
      <FaqSchema items={faqs} path="/contact" />
    </main>
  );
}
