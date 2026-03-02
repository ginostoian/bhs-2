import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";

import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { categories, articles } from "../../_assets/content";
import CardArticle from "../../_assets/components/CardArticle";
import CardCategory from "../../_assets/components/CardCategory";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 86400;

const siteUrl = `https://${config.domainName}`;

const socialProofTestimonials = [
  {
    name: "Louise Thorogood",
    quote:
      "I could not recommend them more highly. The whole process was streamlined and efficient, with a detailed quote and a very high standard of work.",
    sourceLabel: "Houzz Review",
    sourceUrl:
      "https://www.houzz.co.uk/viewReview/1802745/better-homes-studio-review",
  },
  {
    name: "George G",
    quote:
      "After comparing loft conversion companies in North East London, we chose Better Homes Studio. The team delivered our hip-to-gable loft in 9 weeks exactly as promised.",
    sourceLabel: "Houzz Review",
    sourceUrl:
      "https://www.houzz.co.uk/viewReview/2013769/better-homes-studio-review",
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

const getCategoryArticles = (categorySlug) =>
  articles
    .filter((article) =>
      article.categories.some((articleCategory) => articleCategory.slug === categorySlug),
    )
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

const buildCategorySchema = (category, articlesInCategory) => {
  const pageUrl = `${siteUrl}/blog/category/${category.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${category.title} Guides | ${config.appName}`,
        description: category.description,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@type": "Thing",
          name: category.title,
          description: category.description,
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
            name: category.title,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: articlesInCategory.length,
        itemListElement: articlesInCategory.slice(0, 12).map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "BlogPosting",
            headline: article.title,
            url: `${siteUrl}/blog/${article.slug}`,
            datePublished: article.publishedAt,
            author: {
              "@type": "Person",
              name: article.author.name,
            },
          },
        })),
      },
    ],
  };
};

export function generateStaticParams() {
  return categories.map((category) => ({
    categoryId: category.slug,
  }));
}

export function generateMetadata({ params }) {
  const category = categories.find((item) => item.slug === params.categoryId);

  if (!category) {
    return getSEOTags({
      title: `${config.appName} Blog`,
      description:
        "Practical, London-focused guidance for homeowners planning extensions, loft conversions and full renovations.",
      canonicalUrlRelative: "/blog",
    });
  }

  return getSEOTags({
    title: `${category.title} Guides | ${config.appName} Knowledge Center`,
    description: category.description,
    canonicalUrlRelative: `/blog/category/${category.slug}`,
    openGraph: {
      title: `${category.title} Guides | ${config.appName} Knowledge Center`,
      description: category.description,
      url: `${siteUrl}/blog/category/${category.slug}`,
    },
    keywords: [
      `${category.title} London`,
      `${category.titleShort} renovation guide`,
      "London homeowner renovation advice",
      "house extension and loft conversion help",
    ],
  });
}

export default function CategoryPage({ params }) {
  const category = categories.find((item) => item.slug === params.categoryId);

  if (!category) {
    notFound();
  }

  const articlesInCategory = getCategoryArticles(category.slug);
  const featuredArticle = articlesInCategory[0];
  const remainingArticles = articlesInCategory.slice(1);

  const relatedCategories = categories
    .filter((item) => item.slug !== category.slug)
    .map((item) => ({
      ...item,
      count: getCategoryArticles(item.slug).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const trustSignals = [
    {
      title: "Written around London delivery reality",
      text: "Advice shaped by practical scope, budget and planning constraints seen in active residential projects.",
    },
    {
      title: "Decision-first, not trend-first",
      text: "Each guide is structured to help you avoid expensive missteps before work begins on site.",
    },
    {
      title: "Clear quality expectations",
      text: "Content explains what good looks like on drawings, quotations, material choices, and final finish.",
    },
    {
      title: "Aligned to premium homeowner priorities",
      text: "Built for clients who care about workmanship, programme reliability, and long-term value.",
    },
  ];

  const categorySchema = buildCategorySchema(category, articlesInCategory);

  return (
    <>
      <Script
        id={`json-ld-blog-category-${category.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />

      <section className="relative overflow-hidden rounded-3xl border border-[#d4e1fb] bg-gradient-to-br from-[#100b47] via-[#153f9f] to-[#266bf1] px-8 py-12 md:px-12 md:py-14">
        <div className="pointer-events-none absolute -right-24 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            <Link href="/blog" className="transition hover:text-white">
              Blog
            </Link>
            <span>/</span>
            <span>{category.title}</span>
          </div>

          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl">
            {category.title} Knowledge Path for London Homeowners
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/90 md:text-lg">
            {category.description} Built to help homeowners make better project
            decisions with greater clarity, confidence and control.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-white/70">
                Published guides
              </p>
              <p className="mt-1 text-lg font-bold text-white">
                {articlesInCategory.length}
              </p>
            </article>
            <article className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-white/70">
                Last updated
              </p>
              <p className="mt-1 text-lg font-bold text-white">
                {featuredArticle ? formatDate(featuredArticle.publishedAt) : "N/A"}
              </p>
            </article>
            <article className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-white/70">
                Best for
              </p>
              <p className="mt-1 text-lg font-bold text-white">Active project planning</p>
            </article>
          </div>
        </div>
      </section>

      {featuredArticle && (
        <section className="mt-8 rounded-3xl border border-[#dbe5fb] bg-white p-8 md:p-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#266bf1]">
                Featured Guide
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#100b47] md:text-4xl">
                Start Here Before You Commit Budget
              </h2>
            </div>
            <Link
              href={`/blog/${featuredArticle.slug}`}
              className="rounded-full border border-[#bfd3f9] px-5 py-2 text-sm font-semibold text-[#266bf1] transition hover:bg-[#266bf1] hover:text-white"
            >
              Read guide
            </Link>
          </div>
          <CardArticle article={featuredArticle} isImagePriority />
        </section>
      )}

      <section className="mt-8 rounded-3xl border border-[#dbe5fb] bg-white p-8 md:p-10">
        <h2 className="text-3xl font-black text-[#100b47] md:text-4xl">
          Why This Category Builds Trust
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {trustSignals.map((signal) => (
            <article
              key={signal.title}
              className="rounded-2xl border border-[#dde8fb] bg-[#f9fbff] p-5"
            >
              <h3 className="text-lg font-bold text-[#100b47]">{signal.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{signal.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-[#dbe5fb] bg-white p-8 md:p-10">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-[#100b47] md:text-4xl">
            Practical Guides in {category.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Review the full set to make informed design, planning and delivery
            decisions.
          </p>
        </div>

        {remainingArticles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {remainingArticles.map((article) => (
              <CardArticle key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#dde8fb] bg-[#f9fbff] p-6 text-sm text-gray-600">
            {featuredArticle
              ? "This category currently has one featured guide above. More practical articles are in progress."
              : "New guides are being prepared for this category. For project-specific advice now, use the consultation link below."}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-3xl border border-[#dbe5fb] bg-white p-8 md:p-10">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-[#100b47] md:text-4xl">
            Social Proof from London Homeowners
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Independent homeowner feedback on quality, delivery discipline and
            communication standards.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {socialProofTestimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-2xl border border-[#dde8fb] bg-[#f9fbff] p-5"
            >
              <p className="text-sm leading-relaxed text-gray-700">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="mt-4 text-sm font-semibold text-[#100b47]">
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

      {relatedCategories.length > 0 && (
        <section className="mt-8 rounded-3xl border border-[#dbe5fb] bg-white p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-[#100b47] md:text-4xl">
              Continue Your Learning Path
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
              Explore adjacent topics to de-risk your wider renovation decisions.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {relatedCategories.map((relatedCategory) => (
              <div key={relatedCategory.slug} className="space-y-2">
                <CardCategory category={relatedCategory} tag="h3" />
                <p className="text-center text-xs font-medium text-gray-500">
                  {relatedCategory.count} guide
                  {relatedCategory.count === 1 ? "" : "s"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 rounded-3xl border border-[#dbe5fb] bg-gradient-to-r from-[#f3f7ff] to-[#eef3ff] p-8 md:p-10">
        <h2 className="text-3xl font-black text-[#100b47] md:text-4xl">
          Need Advice Specific to Your Property?
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-700 md:text-base">
          If you&apos;re planning an extension, loft conversion, kitchen upgrade,
          or full renovation, we can help you define a realistic path before
          major spend starts.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
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
      </section>
    </>
  );
}
