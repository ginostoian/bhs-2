import Link from "next/link";

// This is the category badge that appears in the article page and in <CardArticle /> component
const Category = ({ category, extraStyle }) => {
  return (
    <Link
      href={`/blog/category/${category.slug}`}
      className={`inline-flex items-center rounded-full bg-gradient-to-r from-[#266bf1] to-[#7421fc] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md ${
        extraStyle ? extraStyle : ""
      }`}
      title={`Posts in ${category.title}`}
      rel="tag"
    >
      {category.titleShort}
    </Link>
  );
};

export default Category;
