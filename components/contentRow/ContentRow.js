import Image from "next/image";
import Link from "next/link";

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
          className="h-[350px]"
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
            {subtitle} <span className="text-[#266bf1]">{subtitleAccent}</span>
          </p>
        </div>

        <div className={classes["service-desc__body"]}>
          <p className={classes["desc__body-text"]}>{p1}</p>

          <p className={classes["desc__body-text"]}>{p2}</p>
        </div>
        <Link
          href={`${ctaTallyFormLink || slug} `}
          className="w-max mb-10 flex items-center justify-center transition duration-200 cursor-pointer font-bold border-2 bg-[#266bf1] capitalize text-white border-transparent hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] text-[18px] mt-[4rem] px-[20px] min-h-[64px] lg:min-h-[72px] lg:px-[24px] lg:w-[245px]! rounded-[16px]"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
};

export default ContentRow;
