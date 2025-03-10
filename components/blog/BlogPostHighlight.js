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
          href={`/blog/${slug}`}
          className="lg:w-[245px]! mb-4 mt-4 flex min-h-[60px] w-max cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-[#266bf1] px-[20px] text-[18px] font-bold capitalize text-white transition duration-200 hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] lg:min-h-[60px] lg:px-[24px]"
        >
          Read more
        </Link>
      </div>
    </div>
  );
};

export default BlogPostHighlight;
