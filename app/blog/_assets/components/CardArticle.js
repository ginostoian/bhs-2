import Link from "next/link";
import Image from "next/image";
import BadgeCategory from "./BadgeCategory";
import Avatar from "./Avatar";

// This is the article card that appears in the home page, in the category page, and in the author's page
const CardArticle = ({
  article,
  tag = "h2",
  showCategory = true,
  isImagePriority = false,
}) => {
  const TitleTag = tag;

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {article.image?.src && (
        <Link
          href={`/blog/${article.slug}`}
          className="block overflow-hidden"
          title={article.title}
          rel="bookmark"
        >
          <figure className="relative overflow-hidden">
            <Image
              src={article.image.src}
              alt={article.image.alt}
              width={600}
              height={338}
              priority={isImagePriority}
              placeholder="blur"
              className="aspect-video object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </figure>
        </Link>
      )}

      <div className="p-8">
        {/* CATEGORIES */}
        {showCategory && (
          <div className="mb-6 flex flex-wrap gap-2">
            {article.categories.map((category) => (
              <BadgeCategory category={category} key={category.slug} />
            ))}
          </div>
        )}

        {/* TITLE */}
        <TitleTag className="mb-4 text-xl font-bold leading-tight text-[#100b47] transition-colors duration-200 group-hover:text-[#266bf1]">
          <Link
            href={`/blog/${article.slug}`}
            className="block"
            title={article.title}
            rel="bookmark"
          >
            {article.title}
          </Link>
        </TitleTag>

        {/* DESCRIPTION */}
        <p className="mb-8 line-clamp-3 leading-relaxed text-base-content/70">
          {article.description}
        </p>

        {/* AUTHOR & DATE */}
        <div className="flex items-center justify-between border-t border-base-content/10 pt-6">
          <Avatar article={article} />

          <div className="flex items-center gap-2 text-sm text-base-content/60">
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
            <span itemProp="datePublished">
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CardArticle;
