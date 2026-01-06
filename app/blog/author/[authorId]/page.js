import Image from "next/image";
import { authors, articles } from "../../_assets/content";
import CardArticle from "../../_assets/components/CardArticle";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export async function generateStaticParams() {
  return authors.map((author) => ({
    authorId: author.slug,
  }));
}

export async function generateMetadata({ params }) {
  const author = authors.find((author) => author.slug === params.authorId);

  return getSEOTags({
    title: `${author.name}, Author at ${config.appName}'s Blog`,
    description: `${author.name}, Author at ${config.appName}'s Blog`,
    canonicalUrlRelative: `/blog/author/${author.slug}`,
  });
}

export default async function Author({ params }) {
  const author = authors.find((author) => author.slug === params.authorId);
  const articlesByAuthor = articles
    .filter((article) => article.author.slug === author.slug)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return (
    <>
      <section className="container mx-auto mb-24 mt-12 flex max-w-3xl flex-col gap-8 md:mb-32 md:flex-row">
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-base-content/80">
            Authors
          </p>
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight lg:text-5xl">
            {author.name}
          </h1>
          <p className="mb-6 font-medium md:mb-10 md:text-lg">{author.job}</p>
          <p className="text-base-content/80 md:text-lg">
            {author.description}
          </p>
        </div>

        <div className="flex shrink-0 gap-4 max-md:order-first md:flex-col">
          <Image
            src={author.avatar}
            width={256}
            height={256}
            alt={author.name}
            priority={true}
            className="rounded-box w-[12rem] md:w-[16rem]"
          />

          {author.socials?.length > 0 && (
            <div className="flex flex-col gap-4 md:flex-row">
              {author.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="mx-auto items-center justify-center align-middle"
                  // Using a dark theme? -> className="btn btn-square btn-neutral"
                  title={`Go to ${author.name} profile on ${social.name}`}
                  target="_blank"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight md:mb-12 lg:text-4xl">
          Most recent articles by {author.name}
        </h2>

        <div className="grid gap-8 lg:grid-cols-2">
          {articlesByAuthor.map((article) => (
            <CardArticle key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}
