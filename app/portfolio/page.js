import RelatedGuides from "@/components/brand/RelatedGuides";
import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { getPageFaqs } from "@/libs/pageFaqs";
import Faq from "@/components/brand/Faq";
import { FaqSchema } from "@/components/brand/Schema";
import { ProjectCards, ProjectCTA } from "@/components/brand/ServicePage";
import { getPortfolioProjects } from "@/libs/portfolio-projects";
export const metadata = getSEOTags({
  title: "Renovation Case Studies London | Better Homes Portfolio",
  description:
    "Explore completed London renovation, kitchen, bathroom, extension and loft conversion projects with real outcomes, scope and client feedback.",
  canonicalUrlRelative: "/portfolio",
  openGraph: {
    title: "Renovation Case Studies London | Better Homes Portfolio",
    description:
      "See real project outcomes from London renovations, extensions, kitchens, bathrooms and loft conversions.",
    url: `https://${config.domainName}/portfolio`,
  },
  keywords: [
    "renovation portfolio London",
    "house extension case studies London",
    "kitchen renovation projects London",
    "bathroom renovation portfolio London",
  ],
});
export default function Page() {
  return (
    <main>
      <section className="bh-wrap bh-section">
        <p className="bh-eyebrow">Our work</p>
        <h1 className="bh-title">Real homes. Considered transformations.</h1>
        <p className="bh-lead">
          Explore completed London extensions, renovations, kitchens and
          bathrooms. Each case study sets out the brief, the work delivered and
          the details that needed careful management.
        </p>
      </section>
      <section className="bh-wrap" style={{ paddingBottom: 80 }}>
        <ProjectCards projects={getPortfolioProjects()} />
      </section>
      <ProjectCTA />
    <RelatedGuides context="portfolio" /></main>
  );
}
