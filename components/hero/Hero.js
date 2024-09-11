/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

import classes from "./Hero.module.css";
import Link from "next/link";
import TestimonialsAvatars from "../TestimonialsAvatars";

const Hero = ({
  title,
  titleAccent,
  subtitle,
  heroCTA,
  heroImgUrl,
  ctaTallyFormLink,
}) => {
  return (
    <section className={`${classes["hero"]} container`}>
      <Image
        className={classes["bg-icon-circle"]}
        src="/assets/icons/circle.svg"
        alt=""
        width={50}
        height={50}
      />
      <div className={classes["hero__left"]}>
        <h1 className={classes["hero__title"]}>
          {title} <span className="text-[#266bf1]">{titleAccent}</span>
        </h1>
        <p className={classes["hero__subtitle"]}>{subtitle}</p>
        <div className={classes["hero__left-info"]}>
          <div className={classes["hero__info-1"]}>
            <p className={classes["hero__info-title"]}>12+</p>
            <p className={classes["hero__info-subtitle"]}>Years Experience</p>
          </div>
          <div className={classes["hero__info-2"]}>
            <p className={classes["hero__info-title"]}>500+</p>
            <p className={classes["hero__info-subtitle"]}>Satisfied Clients</p>
          </div>
        </div>
        <Link
          href={ctaTallyFormLink || "/contact"}
          // className={`${classes["hero__btn"]}`}
          className="w-full mb-10 flex items-center justify-center transition duration-200 cursor-pointer font-bold border-2 bg-[#266bf1] capitalize text-white border-transparent hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] text-[18px] px-[20px] min-h-[64px] lg:min-h-[72px] lg:px-[24px] lg:w-[245px]! rounded-[16px]"
        >
          {heroCTA}
        </Link>
        <TestimonialsAvatars />
      </div>
      <div className={classes["hero__right"]}>
        <div className={classes["hero__right-img-fill"]}>
          <Image
            src={`/assets/img/${heroImgUrl}`}
            objectFit="cover"
            fill
            alt="cover photos"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
