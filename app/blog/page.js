import { categories, articles } from "./_assets/content";
import CardArticle from "./_assets/components/CardArticle";
import CardCategory from "./_assets/components/CardCategory";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: `${config.appName} Knowledge Center | Full service renovation company in London`,
  description:
    "Practical learnings on how to manage the process of renovating your home, bathroom, kitchen or building your extension. Breakdowns of prices and more.",
  canonicalUrlRelative: "/blog",
});

export default async function Blog() {
  const articlesToDisplay = articles
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 6);
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#100b47] via-[#266bf1] to-[#7421fc] py-24 md:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
            The Knowledge Center
          </h1>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white/90 md:text-2xl">
            Learn how a renovation project works, how much it should cost and
            how to more efficiently manage it without ruining your sanity.
          </p>
          <div className="mt-12 flex justify-center">
            <div className="h-1 w-24 rounded-full bg-white/30"></div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#100b47] md:text-4xl">
              Latest Articles
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-base-content/70">
              Stay updated with the latest insights on home renovation and
              design
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            {articlesToDisplay.map((article, i) => (
              <CardArticle
                article={article}
                key={article.slug}
                isImagePriority={i <= 2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-base-200/30 py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#100b47] md:text-4xl">
              Browse by Category
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-base-content/70">
              Find articles tailored to your specific renovation needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CardCategory key={category.slug} category={category} tag="div" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
