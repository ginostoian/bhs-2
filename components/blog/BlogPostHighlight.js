import Image from "next/image";

import classes from "./BlogPostHighlight.module.css";

const BlogPostHighlight = () => {
  return (
    <div className={classes["article-container"]}>
      <Image
        loading="lazy"
        src="/assets/img/general/living-room-1.jpeg"
        alt=""
        className={classes["article__img"]}
        width={550}
        height={250}
      />

      <div className={classes["article__body"]}>
        <p className={classes["article__body-date"]}>21 August 2022</p>
        <h3 className={classes["article__body-title"]}>
          Top 10 trends for renovating your home in 2022
        </h3>
        <a
          href="./pages/blogs/top-10-trends-for-renovating-your-home-in-2022.html"
          className={`${classes["article__body-btn"]} btn`}
        >
          Read more
        </a>
      </div>
    </div>
  );
};

export default BlogPostHighlight;
