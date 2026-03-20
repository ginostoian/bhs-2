import Link from "next/link";

const getPageHref = (basePath, page) =>
  page <= 1 ? basePath : `${basePath}?page=${page}`;

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
};

export default function BlogPagination({ basePath, currentPage, totalPages }) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);
  let previousPage = null;

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-3"
    >
      <Link
        href={getPageHref(basePath, currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
          currentPage === 1
            ? "pointer-events-none border border-gray-200 bg-gray-100 text-gray-400"
            : "border border-[#bfd3f9] bg-white text-[#266bf1] hover:bg-[#266bf1] hover:text-white"
        }`}
      >
        Previous
      </Link>

      {visiblePages.map((page) => {
        const showEllipsis = previousPage !== null && page - previousPage > 1;
        previousPage = page;

        return (
          <div key={page} className="flex items-center gap-3">
            {showEllipsis && (
              <span className="px-1 text-sm font-semibold text-gray-400">
                …
              </span>
            )}
            <Link
              href={getPageHref(basePath, page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition ${
                page === currentPage
                  ? "bg-[#100b47] text-white shadow-lg shadow-[#100b47]/20"
                  : "border border-[#bfd3f9] bg-white text-[#266bf1] hover:bg-[#266bf1] hover:text-white"
              }`}
            >
              {page}
            </Link>
          </div>
        );
      })}

      <Link
        href={getPageHref(basePath, currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
          currentPage === totalPages
            ? "pointer-events-none border border-gray-200 bg-gray-100 text-gray-400"
            : "border border-[#bfd3f9] bg-white text-[#266bf1] hover:bg-[#266bf1] hover:text-white"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
