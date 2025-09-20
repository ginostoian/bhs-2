import Link from "next/link";

// This is the category card that appears in the home page and in the category page
const CardCategory = ({ category, tag = "h2" }) => {
  const TitleTag = tag;

  return (
    <Link
      className="group relative overflow-hidden rounded-2xl bg-white p-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      href={`/blog/category/${category.slug}`}
      title={category.title}
      rel="tag"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#266bf1]/5 to-[#7421fc]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="relative">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#266bf1] to-[#7421fc] text-white shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-7 w-7"
          >
            <path
              fillRule="evenodd"
              d="M9.664 1.319a.75.75 0 01.672 0 41.432 41.432 0 008.198 5.424.75.75 0 01-.254 1.285 31.497 31.497 0 01-7.86 2.5.75.75 0 01-.61-.64 30.5 30.5 0 01-1.5-6.5.75.75 0 01.254-1.285zM15 10.5a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75zM5 10.5a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <TitleTag className="mb-4 text-lg font-bold text-[#100b47] transition-colors duration-200 group-hover:text-[#266bf1]">
          {category?.titleShort || category.title}
        </TitleTag>

        <p className="text-sm leading-relaxed text-base-content/70">
          {category?.descriptionShort || category.description}
        </p>
      </div>
    </Link>
  );
};

export default CardCategory;
