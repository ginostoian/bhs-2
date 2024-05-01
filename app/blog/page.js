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
      <section className="container text-center max-w-xl mx-auto mt-12 mb-24 md:mb-32">
        <h1 className="font-extrabold text-3xl lg:text-5xl tracking-tight mb-6 text-[#100b47]">
          The Knowledge Center
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          Learn how a renovation project works, how much it should cost and how
          to more efficiently manage it without ruining your sanity.
        </p>
      </section>

      <section className="container grid lg:grid-cols-2 mb-24 md:mb-32 gap-8">
        {articlesToDisplay.map((article, i) => (
          <CardArticle
            article={article}
            key={article.slug}
            isImagePriority={i <= 2}
          />
        ))}
      </section>

      <section className="container">
        <p className="text-[#100b47] font-bold text-2xl lg:text-4xl tracking-tight text-center mb-8 md:mb-12">
          Browse articles by category
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CardCategory
              key={category.slug}
              category={category}
              tag="div"
            />
          ))}
        </div>
      </section>
    </>
  );
}
