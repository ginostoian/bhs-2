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
          className="lg:w-[245px]! mb-10 flex min-h-[64px] w-full cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-[#266bf1] px-[20px] text-[18px] font-bold capitalize text-white transition duration-200 hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] lg:min-h-[72px] lg:px-[24px]"
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
