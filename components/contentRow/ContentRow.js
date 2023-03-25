import Image from "next/image";

import classes from "./ContentRow.module.css";

const ContentRow = ({
  title,
  subtitle,
  subtitleAccent,
  p1,
  p2,
  cta,
  imgSrc,
  order,
}) => {
  return (
    <div class={`${classes["service-wrapper"]} container`}>
      <div class={classes["service-wrapper-img"]}>
        <Image
          src={imgSrc}
          loading="lazy"
          alt="industrial bathroom renovation by better homes studio"
          width={800}
          height={350}
          maxHeight={600}
        />
      </div>
      <div
        class={`${classes["service-wrapper-desc"]} ${
          order === true ? classes["order-1"] : null
        }`}
      >
        <div class={classes["service-desc__header"]}>
          <h3 class={classes["desc__header-title"]}>{title}</h3>
          <p class={classes["desc__header-subtitle"]}>
            {subtitle} <span class="accent-word">{subtitleAccent}</span>
          </p>
        </div>

        <div class={classes["service-desc__body"]}>
          <p class={classes["desc__body-text"]}>{p1}</p>

          <p class={classes["desc__body-text"]}>{p2}</p>
        </div>
        <a
          href="./pages/bathroom-renovation.html"
          class="service__btn btn"
        >
          {cta}
        </a>
      </div>
    </div>
  );
};

export default ContentRow;
