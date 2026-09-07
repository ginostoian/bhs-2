import {notFound} from "next/navigation";
import Image from "next/image";
import { authors, articles } from "../../_assets/content";
import CardArticle from "../../_assets/components/CardArticle";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export async function generateStaticParams() {
  return authors.map((author) => ({
    authorId: author.slug,
  }));
}

export async function generateMetadata({ params }) {
  const author = authors.find((author) => author.slug === params.authorId);

  if(!author) notFound();
  return getSEOTags({
    title: `${author.name}, Author at ${config.appName}'s Blog`,
    description: `${author.name}, Author at ${config.appName}'s Blog`,
    canonicalUrlRelative: `/blog/author/${author.slug}`,
  });
}

export default function Author({params}){const author=authors.find(x=>x.slug===params.authorId);if(!author)notFound();const posts=articles.filter(x=>x.author.slug===author.slug);return <main className="bh-wrap"><section className="bh-section"><p className="bh-eyebrow">The journal · Author</p><h1 className="bh-title">{author.name}</h1><p className="bh-lead">{author.description}</p></section><section className="bh-project-grid" style={{paddingBottom:80}}>{posts.map(x=><CardArticle key={x.slug} article={x}/>)}</section></main>;}
