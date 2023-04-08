import Image from "next/image";

import classes from "./BlogPostHighlight.module.css";

const BlogPostHighlight = () => {
  return (
    <div class={classes["article-container"]}>
      <Image
        loading="lazy"
        src="/assets/img/general/living-room-1.jpeg"
        alt=""
        class={classes["article__img"]}
        width={250}
        height={250}
      />

      <div class={classes["article__body"]}>
        <p class={classes["article__body-date"]}>21 August 2022</p>
        <h3 class={classes["article__body-title"]}>
          Top 10 trends for renovating your home in 2022
        </h3>
        <a
          href="./pages/blogs/top-10-trends-for-renovating-your-home-in-2022.html"
          class={`${classes["article__body-btn"]} btn`}
        >
          Read more
        </a>
      </div>
    </div>
  );
};

export default BlogPostHighlight;
