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
  title: "Renovation FAQs London | Better Homes",
  description:
    "Answers to common questions about London home renovations, extensions, loft conversions, timelines, guarantees, planning, and costs.",
  canonicalUrlRelative: "/faq",
  openGraph: {
    title: "Renovation FAQs London | Better Homes",
    description:
      "Frequently asked questions for London homeowners planning renovation, extension, kitchen, bathroom and loft projects.",
    url: `https://${config.domainName}/faq`,
  },
  keywords: [
    "renovation FAQ London",
    "house extension questions London",
    "kitchen renovation FAQ",
    "bathroom renovation FAQ",
  ],
});
export default function Page(){const groups=[["Before we begin","faq"],["Loft conversions","loft"],["Whole-home renovations","renovation"],["Kitchens","kitchen"],["Bathrooms","bathroom"]];const seen=new Set();const all=groups.flatMap(([,key])=>getPageFaqs(key)).filter(x=>{if(seen.has(x.question))return false;seen.add(x.question);return true;});return <main><section className="bh-wrap bh-section"><p className="bh-eyebrow">Questions, answered</p><h1 className="bh-title">Plan with a clearer picture.</h1><p className="bh-lead">Practical answers about London building projects, budgets, drawings and life during the work. For a decision about your own property, we can review the details with you.</p></section><Faq items={all} title="Your project, from first conversation to aftercare"/><FaqSchema items={all} path="/faq"/><ProjectCTA/><RelatedGuides context="faq" /></main>;}