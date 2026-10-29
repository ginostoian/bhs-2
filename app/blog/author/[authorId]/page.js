import {notFound} from "next/navigation";
import Link from "next/link";
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
    title: `${author.name}, ${author.job} of ${config.appName}`,
    description: author.description,
    canonicalUrlRelative: `/blog/author/${author.slug}`,
  });
}

export default function Author({ params }) {
  const author = authors.find((x) => x.slug === params.authorId);
  if (!author) notFound();
  const posts = articles.filter((x) => x.author.slug === author.slug);
  const siteUrl = `https://${config.domainName}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.job,
    description: author.description,
    url: `${siteUrl}/blog/author/${author.slug}`,
    worksFor: { "@id": `${siteUrl}/#organization` },
    knowsAbout: ["House extensions", "Loft conversions", "Basement conversions", "Home renovation"],
    sameAs: author.socials.filter((s) => s.name === "LinkedIn").map((s) => s.url),
  };

  return (
    <main className="bh-wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="bh-section">
        <p className="bh-eyebrow">The blog · Author</p>
        <h1 className="bh-title">{author.name}</h1>
        <p className="bh-lead" style={{ maxWidth: 760 }}>{author.job} of {config.appName}</p>
        <div className="bh-prose" style={{ maxWidth: 760, fontSize: 17, lineHeight: 1.65, marginTop: 20 }}>
          {(author.bio || [author.description]).map((para) => (
            <p key={para}>{para}</p>
          ))}
          <p>
            See the work: <Link href="/house-extension">house extensions</Link>,{" "}
            <Link href="/loft-conversion">loft conversions</Link>,{" "}
            <Link href="/basement-conversion">basements</Link> and{" "}
            <Link href="/portfolio">recent projects</Link>.
          </p>
        </div>
      </section>
      <section className="bh-project-grid" style={{ paddingBottom: 80 }}>
        {posts.map((x) => (
          <CardArticle key={x.slug} article={x} />
        ))}
      </section>
    </main>
  );
}
