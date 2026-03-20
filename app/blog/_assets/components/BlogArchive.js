"use client";

import { useSearchParams } from "next/navigation";

import CardArticle from "./CardArticle";
import BlogPagination from "./BlogPagination";

export default function BlogArchive({ articles, postsPerPage = 6 }) {
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(articles.length / postsPerPage));
  const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isNaN(parsedPage)
    ? 1
    : Math.min(Math.max(parsedPage, 1), totalPages);
  const archiveStartIndex = (currentPage - 1) * postsPerPage;
  const archiveEndIndex = archiveStartIndex + postsPerPage;
  const paginatedArticles = articles.slice(archiveStartIndex, archiveEndIndex);
  const archiveRangeStart = articles.length === 0 ? 0 : archiveStartIndex + 1;
  const archiveRangeEnd = Math.min(archiveEndIndex, articles.length);

  return (
    <section className="mt-8 rounded-3xl border border-[#dbe5fb] bg-white p-8 md:p-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#100b47] md:text-4xl">
            All Guides
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
            Browse every published article, regardless of category, with proper
            pagination.
          </p>
        </div>
        <div className="rounded-full bg-[#eef4ff] px-4 py-2 text-sm font-semibold text-[#266bf1]">
          Showing {archiveRangeStart}-{archiveRangeEnd} of {articles.length}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {paginatedArticles.map((article, index) => (
          <CardArticle
            article={article}
            key={article.slug}
            isImagePriority={currentPage === 1 && index < 2}
          />
        ))}
      </div>

      <BlogPagination
        basePath="/blog"
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
