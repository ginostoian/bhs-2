import Link from "next/link";
import Image from "next/image";

// This is the author avatar that appears in the article page and in <CardArticle /> component
const Avatar = ({ article }) => {
  return (
    <Link
      href={`/blog/author/${article.author.slug}`}
      title={`Posts by ${article.author.name}`}
      className="group flex items-center gap-3 transition-all duration-200 hover:scale-105"
      rel="author"
    >
      <span itemProp="author">
        <Image
          src={article.author.avatar}
          // alt={`Avatar of ${article.author.name}`}
          alt=""
          className="h-12 w-12 rounded-full object-cover object-center ring-2 ring-base-content/10 transition-all duration-200 group-hover:ring-[#266bf1]/30"
          width={48}
          height={48}
        />
      </span>
      <div className="flex flex-col">
        <span className="font-semibold text-[#100b47] transition-colors duration-200 group-hover:text-[#266bf1]">
          {article.author.name}
        </span>
        <span className="text-xs text-base-content/60">Author</span>
      </div>
    </Link>
  );
};

export default Avatar;
