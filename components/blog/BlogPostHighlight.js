import Image from "next/image";
import Link from "next/link";

import classes from "./BlogPostHighlight.module.css";

const BlogPostHighlight = ({ article }) => {
  const { title, imgUrl, date, slug } = article;

  return (
    <div className={classes["article-container"]}>
      <Image
        loading="lazy"
        src={imgUrl}
        alt=""
        className={classes["article__img"]}
        width={550}
        height={250}
      />

      <div className={classes["article__body"]}>
        <p className={classes["article__body-date"]}>{date}</p>
        <h3 className={classes["article__body-title"]}>{title}</h3>
        <Link
          href={`/pages/blogs/${slug}`}
          className="w-max mb-4 mt-4 flex items-center justify-center transition duration-200 cursor-pointer font-bold border-2 bg-[#266bf1] capitalize text-white border-transparent hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] text-[18px] px-[20px] min-h-[60px] lg:min-h-[60px] lg:px-[24px] lg:w-[245px]! rounded-full"
        >
          Read more
        </Link>
      </div>
    </div>
  );
};

export default BlogPostHighlight;
