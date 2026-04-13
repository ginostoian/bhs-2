import Link from "next/link";

import config from "@/config";
import { articles, categories } from "./_assets/content";
import CardArticle from "./_assets/components/CardArticle";
import BlogArchive from "./_assets/components/BlogArchive";
import { getSEOTags } from "@/libs/seo";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

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

export const dynamic = "force-static";
export const revalidate = 86400;
const POSTS_PER_PAGE = 6;

export default function Blog() {
  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
  );
  const featuredArticle = sortedArticles[0];
  const latestArticles = sortedArticles.slice(1, 7);
  const archiveArticles = sortedArticles.map((article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    publishedAt: article.publishedAt,
    image: article.image,
    categories: article.categories.map((category) => ({
      slug: category.slug,
      title: category.title,
      titleShort: category.titleShort,
    })),
    author: {
      slug: article.author.slug,
      name: article.author.name,
      avatar: article.author.avatar,
    },
  }));
  const trustedStats = [
    { label: "In-depth guides", value: `${articles.length}+` },
    { label: "Learning tracks", value: `${categories.length}` },
    {
      label: "Most recent update",
      value: sortedArticles[0]
        ? formatDate(sortedArticles[0].publishedAt)
        : "N/A",
    },
  ];

  const categoryPaths = categories
    .map((category) => {
      const matching = sortedArticles.filter((article) =>
        article.categories.some((c) => c.slug === category.slug),
      );

      return {
        ...category,
        count: matching.length,
        latestArticle: matching[0],
      };
    })
    .filter((category) => category.count > 0);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${config.appName} Knowledge Center`,
    description:
      "Practical, London-focused guidance for homeowners planning extensions, loft conversions and full renovations.",
    url: `https://${config.domainName}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Better Homes",
      url: `https://${config.domainName}`,
    },
    blogPost: sortedArticles.slice(0, 10).map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: `https://${config.domainName}/blog/${article.slug}`,
      datePublished: article.publishedAt,
      author: {
        "@type": "Person",
        name: article.author.name,
      },
    })),
  };

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl border border-[#d4e1fb] bg-gradient-to-br from-[#100b47] via-[#153f9f] to-[#266bf1] px-8 py-14 md:px-12 md:py-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
            Knowledge Center
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl">
            Renovation Guidance You Can Actually Use
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/90 md:text-lg">
            This is built for serious London homeowners planning extensions,
            loft conversions, kitchens, bathrooms, and full renovations. We
            focus on clarity, realistic cost context, planning awareness, and
            practical delivery insights.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {trustedStats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-wide text-white/70">
                  {stat.label}
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {stat.value}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {featuredArticle && (
              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#100b47] transition hover:bg-[#dce8ff]"
              >
                Start with the latest guide
              </Link>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/40 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 hover:text-white"
            >
              Ask for project-specific advice
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-[#dbe5fb] bg-white p-8 md:p-10">
        <h2 className="text-3xl font-black text-[#100b47] md:text-4xl">
          Why Homeowners Trust This Content
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Built from real project delivery",
              text: "Our guidance reflects actual London renovation work, not generic theory copied from other markets.",
            },
            {
              title: "Focused on decision quality",
              text: "Each article is written to reduce risk, improve planning confidence, and help you make better choices early.",
            },
            {
              title: "Clear on costs and constraints",
              text: "We explain practical budget drivers, trade-offs and common failure points so expectations stay realistic.",
            },
            {
              title: "Structured for learning, not noise",
              text: "Content is organised by topic paths so you can move from basic understanding to informed project planning.",
            },
          ].map((point) => (
            <article
              key={point.title}
              className="rounded-2xl border border-[#dde8fb] bg-[#f9fbff] p-5"
            >
              <h3 className="text-lg font-bold text-[#100b47]">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {point.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {featuredArticle && (
        <section className="mt-8 rounded-3xl border border-[#dbe5fb] bg-white p-8 md:p-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#266bf1]">
                Recommended First Read
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#100b47] md:text-4xl">
                Start Here
              </h2>
            </div>
            <Link
              href={`/blog/${featuredArticle.slug}`}
              className="rounded-full border border-[#bfd3f9] px-5 py-2 text-sm font-semibold text-[#266bf1] transition hover:bg-[#266bf1] hover:text-white"
            >
              Open guide
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <CardArticle article={featuredArticle} isImagePriority />
            <div className="space-y-4">
              <article className="rounded-2xl border border-[#dde8fb] bg-[#f9fbff] p-5">
                <h3 className="text-lg font-bold text-[#100b47]">
                  What You&apos;ll Learn First
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-700">
                  <li>How to frame scope before asking for quotes</li>
                  <li>Where budgets usually break in London projects</li>
                  <li>How to choose the right delivery model for your home</li>
                </ul>
              </article>

              <article className="rounded-2xl border border-[#dde8fb] bg-[#f9fbff] p-5">
                <h3 className="text-lg font-bold text-[#100b47]">
                  Knowledge Quality Signals
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  Every guide includes a clear context, practical
                  recommendations and actionable next steps rather than generic
                  “inspiration” content.
                </p>
              </article>
            </div>
          </div>
        </section>
      )}

      <section className="mt-8 rounded-3xl border border-[#dbe5fb] bg-white p-8 md:p-10">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-[#100b47] md:text-4xl">
            Latest Practical Guides
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            New and recently updated articles for homeowners actively preparing
            a project.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {latestArticles.map((article, i) => (
            <CardArticle
              article={article}
              key={article.slug}
              isImagePriority={i < 2}
            />
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-[#dbe5fb] bg-white p-8 md:p-10">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-[#100b47] md:text-4xl">
            Learn by Topic Path
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Follow a focused category path to build confidence faster.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {categoryPaths.map((category) => (
            <article
              key={category.slug}
              className="rounded-2xl border border-[#dde8fb] bg-[#f9fbff] p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-[#100b47]">
                  {category.titleShort || category.title}
                </h3>
                <span className="rounded-full bg-[#e8f0ff] px-2.5 py-1 text-xs font-semibold text-[#266bf1]">
                  {category.count} guides
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {category.descriptionShort || category.description}
              </p>
              {category.latestArticle && (
                <Link
                  href={`/blog/${category.latestArticle.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-[#266bf1] hover:underline"
                >
                  Latest: {category.latestArticle.title}
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <BlogArchive articles={archiveArticles} postsPerPage={POSTS_PER_PAGE} />

      <section className="mt-8 rounded-3xl border border-[#d7e4fb] bg-gradient-to-r from-[#f5f9ff] to-white p-8 text-center md:p-10">
        <h2 className="text-2xl font-black text-[#100b47] md:text-3xl">
          Planning a Real Project, Not Just Browsing?
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
          If you want direct guidance on extensions, loft conversions, or full
          renovations, we can help you define scope and avoid costly early-stage
          mistakes.
        </p>
        <div className="mt-6">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-[#266bf1] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#1f58c8] hover:text-white"
          >
            Book a Consultation
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </>
  );
}
