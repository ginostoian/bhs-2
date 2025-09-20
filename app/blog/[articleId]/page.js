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
                  <button className="rounded-full bg-white p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md">
                    <svg
                      className="h-5 w-5 text-[#266bf1]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                  <button className="rounded-full bg-white p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md">
                    <svg
                      className="h-5 w-5 text-[#266bf1]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15.6 5.2c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5zM12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 22c-5.5 0-10-4.5-10-10S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" />
                    </svg>
                  </button>
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
