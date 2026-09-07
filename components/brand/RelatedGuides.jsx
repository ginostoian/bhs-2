import Image from "next/image";
import Link from "next/link";
import { getKnowledgeCenterArticles } from "@/libs/knowledgeCenter";

export default function RelatedGuides({ context = "home" }) {
  const articles = getKnowledgeCenterArticles(context, 3);
  if (!articles.length) return null;
  return (
    <section id="related-guides" className="bh-wrap bh-section" aria-label="Related guides from our blog">
      <p className="bh-eyebrow">From the blog</p>
      <h2 className="bh-heading">A little guidance for your next step.</h2>
      <p className="bh-lead">Explore the costs, choices and practical details behind a project like yours.</p>
      <div className="bh-project-grid" style={{ marginTop: 32 }}>
        {articles.map((article) => (
          <article className="bh-project-card" key={article.slug}>
            <Link href={`/blog/${article.slug}`}>
              {article.imgUrl ? <Image src={article.imgUrl} alt="" width={800} height={500} sizes="(max-width: 700px) 100vw, 33vw" /> : null}
              <h3 style={{ fontSize: 24, lineHeight: 1.25, marginTop: 20 }}>{article.title}</h3>
              <p className="bh-text-link" style={{ marginTop: 16 }}>Read the guide →</p>
            </Link>
          </article>
        ))}
      </div>
      <p style={{ marginTop: 32 }}><Link href="/blog" className="bh-text-link">Explore all blog articles →</Link></p>
    </section>
  );
}
