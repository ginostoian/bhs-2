import Image from "next/image";

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
        <a
          href={`/pages/blogs/${slug}`}
          className={`${classes["article__body-btn"]} btn`}
        >
          Read more
        </a>
      </div>
    </div>
  );
};

export default BlogPostHighlight;
