import Link from "next/link";
import Script from "next/script";
import { articles } from "../_assets/content";
import BadgeCategory from "../_assets/components/BadgeCategory";
import Avatar from "../_assets/components/Avatar";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export async function generateMetadata({ params }) {
  const article = articles.find((article) => article.slug === params.articleId);

  return getSEOTags({
    title: article.title,
    description: article.description,
    canonicalUrlRelative: `/blog/${article.slug}`,
    extraTags: {
      openGraph: {
        title: article.title,
        description: article.description,
        url: `/blog/${article.slug}`,
        images: [
          {
            url: article.image.urlRelative,
            width: 1200,
            height: 660,
          },
        ],
        locale: "en_GB",
        type: "website",
      },
    },
  });
}

export default async function Article({ params }) {
  const article = articles.find((article) => article.slug === params.articleId);
  const articlesRelated = articles
    .filter(
      (a) =>
        a.slug !== params.articleId &&
        a.categories.some((c) =>
          article.categories.map((c) => c.slug).includes(c.slug),
        ),
    )
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 3);

  return (
    <>
      {/* SCHEMA JSON-LD MARKUP FOR GOOGLE */}
      <Script
        type="application/ld+json"
        id={`json-ld-article-${article.slug}`}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://${config.domainName}/blog/${article.slug}`,
            },
            name: article.title,
            headline: article.title,
            description: article.description,
            image: `https://${config.domainName}${article.image.urlRelative}`,
            datePublished: article.publishedAt,
            dateModified: article.publishedAt,
            author: {
              "@type": "Person",
              name: article.author.name,
            },
          }),
        }}
      />

      {/* GO BACK LINK */}
      <div className="mx-auto mb-4 max-w-[90%]">
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
          Back to articles
        </Link>
      </div>

      <article className="mx-auto max-w-[90%]">
        {/* HEADER WITH CATEGORIES AND DATE AND TITLE */}
        <section className="relative my-16 max-w-[900px] md:my-24">
          {/* Background decoration */}
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#266bf1]/10 to-[#7421fc]/10 blur-3xl"></div>
          <div className="mb-8 flex flex-wrap items-center gap-4">
            {article.categories.map((category) => (
              <BadgeCategory
                category={category}
                key={category.slug}
                extraStyle="!badge-lg !px-4 !py-2 !text-sm !font-medium"
              />
            ))}
            <div className="flex items-center gap-2 text-base-content/70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium" itemProp="datePublished">
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <h1 className="mb-8 text-4xl font-extrabold leading-tight tracking-tight text-[#100b47] md:mb-10 md:text-5xl lg:text-6xl">
            {article.title}
          </h1>

          <div className="relative">
            <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-gradient-to-b from-[#266bf1] to-[#7421fc]"></div>
            <p className="ml-6 max-w-[750px] text-lg leading-relaxed text-base-content/80 md:text-xl">
              {article.description}
            </p>
          </div>
        </section>

        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* ARTICLE CONTENT */}
          <section className="flex-1 space-y-8 md:space-y-12">
            <div className="prose-lg prose-headings:text-[#100b47] prose-headings:font-extrabold prose-headings:tracking-tight prose-p:text-base-content/80 prose-p:leading-relaxed prose-a:text-[#266bf1] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#100b47] prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-[#266bf1] prose-blockquote:bg-base-200/50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-ul:text-base-content/80 prose-ol:text-base-content/80 prose-li:text-base-content/80 prose max-w-none">
              {article.content}
            </div>

            {/* Article Footer */}
            <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#266bf1]/5 to-[#7421fc]/5 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-[#100b47]">
                    Found this helpful?
                  </h3>
                  <p className="text-sm text-base-content/70">
                    Share this article with others who might benefit from it.
                  </p>
                </div>
                <div className="flex gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://${config.domainName}/blog/${article.slug}`)}&via=iamgino_s`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                    title="Share on X (Twitter)"
                  >
                    <svg
                      className="h-5 w-5 text-[#266bf1]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://${config.domainName}/blog/${article.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                    title="Share on Facebook"
                  >
                    <svg
                      className="h-5 w-5 text-[#266bf1]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* SIDEBAR WITH AUTHORS AND 3 RELATED ARTICLES */}
          <aside className="shrink-0 lg:w-80">
            <div className="sticky top-8 space-y-8">
              {/* Author Section */}
              <div className="rounded-xl border border-base-content/10 bg-base-100 p-6 shadow-sm">
                <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-base-content/60">
                  Posted by
                </p>
                <Avatar article={article} />
              </div>

              {/* Related Articles Section */}
              {articlesRelated.length > 0 && (
                <div className="rounded-xl border border-base-content/10 bg-base-100 p-6 shadow-sm">
                  <p className="mb-6 text-sm font-semibold uppercase tracking-wide text-base-content/60">
                    Related reading
                  </p>
                  <div className="space-y-6">
                    {articlesRelated.map((relatedArticle) => (
                      <article key={relatedArticle.slug} className="group">
                        <Link
                          href={`/blog/${relatedArticle.slug}`}
                          className="block"
                          title={relatedArticle.title}
                          rel="bookmark"
                        >
                          <h3 className="mb-2 text-sm font-semibold leading-tight text-[#100b47] transition-colors duration-200 group-hover:text-[#266bf1]">
                            {relatedArticle.title}
                          </h3>
                          <p className="line-clamp-3 text-xs leading-relaxed text-base-content/70">
                            {relatedArticle.description}
                          </p>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action Section */}
              <div className="rounded-xl border border-base-content/10 bg-gradient-to-br from-[#266bf1]/10 to-[#7421fc]/10 p-6 shadow-sm">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-[#266bf1] p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#100b47]">
                    Ready to Start Your Project?
                  </h3>
                  <p className="mb-4 text-sm text-base-content/70">
                    Get expert guidance for your London home renovation. From
                    design to planning approval, we&apos;re here to help.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-[#266bf1] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-[#1449B0] active:bg-[#0C5AC8]"
                  >
                    Get Free Consultation
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    articleId: article.slug,
  }));
}
