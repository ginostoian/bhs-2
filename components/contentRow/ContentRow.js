import Image from "next/image";

import classes from "./ContentRow.module.css";
import Link from "next/link";

const ContentRow = ({
  title,
  subtitle,
  subtitleAccent,
  p1,
  p2,
  cta,
  imgSrc,
  order,
  slug,
  ctaTallyFormLink,
}) => {
  return (
    <div className={`${classes["service-wrapper"]} container`}>
      <div className={classes["service-wrapper-img"]}>
        <Image
          src={imgSrc}
          loading="lazy"
          alt="industrial bathroom renovation by better homes studio"
          width={800}
          height={350}
        />
      </div>
      <div
        className={`${classes["service-wrapper-desc"]} ${
          order === true ? classes["order-1"] : null
        }`}
      >
        <div className={classes["service-desc__header"]}>
          <h3 className={classes["desc__header-title"]}>{title}</h3>
          <p className={classes["desc__header-subtitle"]}>
            {subtitle} <span className="accent-word">{subtitleAccent}</span>
          </p>
        </div>

        <div className={classes["service-desc__body"]}>
          <p className={classes["desc__body-text"]}>{p1}</p>

          <p className={classes["desc__body-text"]}>{p2}</p>
        </div>
        <Link
          href={`${ctaTallyFormLink || slug} `}
          className="service__btn btn"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
};

export default ContentRow;
