import Image from "next/image";
import Faq from "@/components/brand/Faq";
import { JsonLd, FaqSchema } from "@/components/brand/Schema";
import { ProjectCTA } from "@/components/brand/ServicePage";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";

import config from "@/config";
import { BOOKING_URL } from "@/libs/booking";
import { getSEOTags } from "@/libs/seo";
import { articles } from "../_assets/content";
import BadgeCategory from "../_assets/components/BadgeCategory";
import Avatar from "../_assets/components/Avatar";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 86400;

const siteUrl = `https://${config.domainName}`;

const socialProofTestimonials = [
  {
    name: "Louise Thorogood",
    quote:
      "The whole process was streamlined and efficient, with a detailed quote and a very high standard of work.",
    sourceLabel: "Houzz Review",
    sourceUrl:
      "https://www.houzz.co.uk/viewReview/1802745/better-homes-studio-review",
  },
  {
    name: "Shyra Muthusamy",
    quote:
      "The quality of workmanship is extremely high and they translated loose ideas into reality with excellent attention to detail.",
    sourceLabel: "Houzz Review",
    sourceUrl:
      "https://www.houzz.co.uk/viewReview/1863607/better-homes-studio-review",
  },
];

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const buildArticleSchema = (article) => {
  const pageUrl = `${siteUrl}/blog/${article.slug}`;

  const graph = [
    {
      "@type": "BlogPosting",
      "@id": `${pageUrl}#article`,
      mainEntityOfPage: pageUrl,
      headline: article.title,
      name: article.title,
      description: article.description,
      image: [`${siteUrl}${article.image.urlRelative}`],
      datePublished: article.publishedAt,
      dateModified: article.dateModified || article.publishedAt,
      articleSection: article.categories
        .map((category) => category.title)
        .join(", "),
      author: {
        "@type": "Person",
        name: article.author.name,
        url: `${siteUrl}/blog/author/${article.author.slug}`,
      },
      publisher: {
        "@type": "Organization",
        name: "Better Homes",
        url: siteUrl,
      },
    },
  ];

  if (article.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: article.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
};

export function generateStaticParams() {
  return articles.map((article) => ({
    articleId: article.slug,
  }));
}

export function generateMetadata({ params }) {
  const article = articles.find((item) => item.slug === params.articleId);

  if (!article) {
    return getSEOTags({
      title: `${config.appName} Blog`,
      description:
        "Practical, London-focused guidance for homeowners planning extensions, loft conversions and full renovations.",
      canonicalUrlRelative: "/blog",
    });
  }

  return getSEOTags({
    title: article.seoTitle || article.title,
    description: article.description,
    canonicalUrlRelative: `/blog/${article.slug}`,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.description,
      url: `${siteUrl}/blog/${article.slug}`,
      images: [
        {
          url: article.image.urlRelative,
          width: 1200,
          height: 660,
        },
      ],
    },
    keywords: [
      article.title,
      "London house extension advice",
      "London loft conversion guide",
      "home renovation planning UK",
    ],
  });
}

export default function ArticlePage({ params }) {
  const article = articles.find((x) => x.slug === params.articleId);
  if (!article) notFound();
  const related = articles
    .filter(
      (x) =>
        x.slug !== article.slug &&
        x.categories.some((c) =>
          article.categories.some((a) => a.slug === c.slug),
        ),
    )
    .slice(0, 3);
  const faqs = [
    {
      question: "How can I apply this guidance to my property?",
      answer: `Use the guidance in “${article.title}” as a starting point for your brief. Your property, scope, design and site conditions need to be checked before you rely on an estimate or choose a construction route.`,
    },
    {
      question: "What should I bring to a conversation with Better Homes?",
      answer:
        "Bring your property postcode, a short brief, your target budget and any drawings or survey information you already have. We can build from existing drawings or manage your relationship with a trusted independent architect if design support is needed.",
    },
  ];
  return (
    <>
      <JsonLd data={buildArticleSchema({ ...article, faqs: [] })} />
      <article className="bh-wrap">
        <header className="bh-section">
          <p className="bh-eyebrow">
            {article.categories.map((c) => c.title).join(" · ")}
          </p>
          <h1 className="bh-title" style={{ maxWidth: 1000 }}>
            {article.title}
          </h1>
          <p className="bh-lead">{article.description}</p>
          <div className="bh-small" style={{ marginTop: 24 }}>
            By{" "}
            <Link href={`/blog/author/${article.author.slug}`}>
              {article.author.name}
            </Link>{" "}
            · Published{" "}
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            {article.dateModified ? (
              <>
                {" "}
                · Updated{" "}
                <time dateTime={article.dateModified}>
                  {formatDate(article.dateModified)}
                </time>
              </>
            ) : null}
          </div>
          <Image
            src={article.image.urlRelative}
            alt={article.image.alt || article.title}
            width={1200}
            height={660}
            priority
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: 580,
              objectFit: "cover",
              marginTop: 40,
              borderRadius: 0,
            }}
          />
        </header>
        <div className="bh-article-layout">
          <div className="prose">{article.content}</div>
          <aside>
            <p className="bh-eyebrow">Your project</p>
            <h2 className="bh-heading" style={{ fontSize: 28 }}>
              Put the guidance into practice.
            </h2>
            <p>
              Discuss your property, drawings and priorities with our London
              construction team.
            </p>
            <a
              className="bh-button"
              style={{ marginTop: 24 }}
              href={BOOKING_URL}
            >
              Discuss your project
            </a>
            <div style={{ marginTop: 40 }}>
              <p className="bh-eyebrow">Related reading</p>
              {related.map((x) => (
                <Link
                  key={x.slug}
                  href={`/blog/${x.slug}`}
                  className="bh-reading-link"
                >
                  {x.title} ↗
                </Link>
              ))}
            </div>
            <p className="bh-small" style={{ marginTop: 32 }}>
              Published figures are planning guidance. Your written quotation
              confirms the scope, allowances, VAT and agreed price.
            </p>
          </aside>
        </div>
      </article>
      <Faq items={faqs} title="Using this guide for your home" />
      <FaqSchema
        items={[...(article.faqs || []), ...faqs]}
        path={`/blog/${article.slug}`}
      />
      <ProjectCTA />
    </>
  );
}
