import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";

import config from "@/config";
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

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${pageUrl}#article`,
        mainEntityOfPage: pageUrl,
        headline: article.title,
        name: article.title,
        description: article.description,
        image: [`${siteUrl}${article.image.urlRelative}`],
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        articleSection: article.categories.map((category) => category.title).join(", "),
        author: {
          "@type": "Person",
          name: article.author.name,
        },
        publisher: {
          "@type": "Organization",
          name: "Better Homes",
          url: siteUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Blog",
            item: `${siteUrl}/blog`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: article.title,
            item: pageUrl,
          },
        ],
      },
    ],
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
    title: article.title,
    description: article.description,
    canonicalUrlRelative: `/blog/${article.slug}`,
    openGraph: {
      title: article.title,
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
  const article = articles.find((item) => item.slug === params.articleId);

  if (!article) {
    notFound();
  }

  const categorySlugs = article.categories.map((category) => category.slug);
  const relatedArticles = articles
    .filter(
      (candidate) =>
        candidate.slug !== article.slug &&
        candidate.categories.some((category) => categorySlugs.includes(category.slug)),
    )
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 3);

  const trustSignals = [
    "Written for London homeowners planning serious renovation works",
    "Focused on budget protection, quality outcomes and practical delivery",
    "Aligned with extension, loft conversion and full-home renovation decisions",
  ];

  const articleSchema = buildArticleSchema(article);

  return (
    <>
      <Script
        type="application/ld+json"
        id={`json-ld-article-${article.slug}`}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="mx-auto mb-4 max-w-[92%]">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-base-content/70 transition-all duration-200 hover:bg-base-200/50 hover:text-base-content"
          title="Back to Blog"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back to all guides
        </Link>
      </div>

      <article className="mx-auto max-w-[92%]">
        <section className="relative overflow-hidden rounded-3xl border border-[#d4e1fb] bg-gradient-to-br from-[#100b47] via-[#153f9f] to-[#266bf1] px-8 py-12 md:px-12 md:py-14">
          <div className="pointer-events-none absolute -right-24 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-14 bottom-0 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative mx-auto max-w-5xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              {article.categories.map((category) => (
                <BadgeCategory category={category} key={category.slug} />
              ))}
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/85">
                Updated {formatDate(article.publishedAt)}
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl">
              {article.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/90 md:text-lg">
              {article.description}
            </p>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {trustSignals.map((signal) => (
                <article
                  key={signal}
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm leading-relaxed text-white/90 backdrop-blur-sm"
                >
                  {signal}
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-12">
          <section className="min-w-0 flex-1">
            <div className="rounded-2xl border border-[#dde8fb] bg-[#f9fbff] p-6 md:p-7">
              <h2 className="text-xl font-black text-[#100b47]">How to use this guide</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-700">
                <li>Read with your project scope and budget envelope in mind.</li>
                <li>Use it to brief designers and compare quotations more rigorously.</li>
                <li>
                  Raise any project-specific constraints with us before committing to a
                  contractor.
                </li>
              </ul>
            </div>

            <div className="prose prose-lg prose-headings:font-black prose-headings:tracking-tight prose-headings:text-[#100b47] prose-p:leading-relaxed prose-p:text-base-content/80 prose-a:text-[#266bf1] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#100b47] prose-strong:font-semibold prose-blockquote:rounded-r-lg prose-blockquote:border-l-4 prose-blockquote:border-[#266bf1] prose-blockquote:bg-base-200/50 prose-blockquote:py-4 prose-blockquote:pl-6 prose-ul:text-base-content/80 prose-ol:text-base-content/80 prose-li:text-base-content/80 mt-8 max-w-none">
              {article.content}
            </div>

            <div className="mt-10 rounded-2xl border border-[#dbe5fb] bg-gradient-to-r from-[#f3f7ff] to-[#eef3ff] p-7">
              <h2 className="text-2xl font-black text-[#100b47]">
                Want Advice for Your Own Home?
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-700 md:text-base">
                We can help you translate this guidance into a realistic scope and
                execution plan for your property, whether you&apos;re considering a
                house extension, loft conversion or a full renovation.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full bg-[#266bf1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1f56c5]"
                >
                  Book a consultation
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center rounded-full border border-[#bfd3f9] bg-white px-6 py-3 text-sm font-semibold text-[#266bf1] transition hover:bg-[#f5f8ff]"
                >
                  View case studies
                </Link>
              </div>
            </div>
          </section>

          <aside className="w-full shrink-0 space-y-6 lg:w-80">
            <section className="rounded-2xl border border-[#dde8fb] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#266bf1]">
                Written by
              </p>
              <div className="mt-4">
                <Avatar article={article} />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {article.author.description}
              </p>
            </section>

            <section className="rounded-2xl border border-[#dde8fb] bg-[#f9fbff] p-6">
              <h2 className="text-lg font-black text-[#100b47]">Trust indicators</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-700">
                <li>500+ London homeowners served across major renovations</li>
                <li>Up to 10 years workmanship guarantee on qualifying works</li>
                <li>Insurance cover up to £10M for project peace of mind</li>
                <li>Best of Houzz service recognition</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-[#dde8fb] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#100b47]">Social proof</h2>
              <div className="mt-4 space-y-4">
                {socialProofTestimonials.map((testimonial) => (
                  <article key={testimonial.name} className="rounded-xl bg-[#f9fbff] p-4">
                    <p className="text-sm leading-relaxed text-gray-700">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <p className="mt-3 text-sm font-semibold text-[#100b47]">
                      {testimonial.name}
                    </p>
                    <a
                      href={testimonial.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex text-xs font-semibold uppercase tracking-wide text-[#266bf1] hover:underline"
                    >
                      {testimonial.sourceLabel}
                    </a>
                  </article>
                ))}
              </div>
            </section>

            {relatedArticles.length > 0 && (
              <section className="rounded-2xl border border-[#dde8fb] bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black text-[#100b47]">Related guides</h2>
                <div className="mt-4 space-y-4">
                  {relatedArticles.map((relatedArticle) => (
                    <article key={relatedArticle.slug} className="group">
                      <Link
                        href={`/blog/${relatedArticle.slug}`}
                        className="block"
                        title={relatedArticle.title}
                        rel="bookmark"
                      >
                        <h3 className="text-sm font-semibold leading-tight text-[#100b47] transition-colors group-hover:text-[#266bf1]">
                          {relatedArticle.title}
                        </h3>
                        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-gray-600">
                          {relatedArticle.description}
                        </p>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-2xl border border-[#d8e5ff] bg-gradient-to-br from-[#edf3ff] to-[#f6f9ff] p-6">
              <h2 className="text-lg font-black text-[#100b47]">
                Discuss your project privately
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                We help homeowners define scope, feasibility and delivery strategy
                before they commit to major spend.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-[#266bf1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f56c5]"
              >
                Speak with our team
              </Link>
            </section>
          </aside>
        </div>
      </article>
    </>
  );
}
