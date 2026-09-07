import {Suspense} from "react";
import Link from "next/link";
import config from "@/config";
import {getSEOTags} from "@/libs/seo";
import {articles,categories} from "./_assets/content";
import BlogArchive from "./_assets/components/BlogArchive";
export const metadata = getSEOTags({
  title: `${config.appName} Knowledge Center | Learn Renovation the Right Way`,
  description:
    "Practical, London-focused renovation guidance on extensions, kitchens, bathrooms, planning and costs. Built to help homeowners make confident decisions.",
  canonicalUrlRelative: "/blog",
  openGraph: {
    title: `${config.appName} Knowledge Center | Learn Renovation the Right Way`,
    description:
      "A practical learning hub for London homeowners planning high-quality renovations, extensions and loft conversions.",
    url: `https://${config.domainName}/blog`,
  },
  keywords: [
    "London renovation guide",
    "house extension planning London",
    "kitchen renovation cost London",
    "bathroom renovation advice London",
    "homeowner renovation learning hub",
  ],
});
export const dynamic="force-static";
export const revalidate=86400;
export default function Page(){const archive=[...articles].sort((a,b)=>new Date(b.dateModified||b.publishedAt)-new Date(a.dateModified||a.publishedAt)).map(({slug,title,description,publishedAt,dateModified,image,categories,author})=>({slug,title,description,publishedAt,dateModified,image,categories,author}));return <main className="bh-wrap"><section className="bh-section"><p className="bh-eyebrow">The journal</p><h1 className="bh-title">Make a more informed next move.</h1><p className="bh-lead">Practical guidance for London homeowners on construction costs, drawings, permissions, materials and the decisions that shape a better home.</p><nav className="bh-actions" aria-label="Journal categories">{categories.map(c=><Link key={c.slug} href={`/blog/category/${c.slug}`} className="bh-button bh-button-outline">{c.titleShort||c.title}</Link>)}</nav></section><Suspense fallback={<p>Loading the journal…</p>}><BlogArchive articles={archive} postsPerPage={6}/></Suspense></main>;}
