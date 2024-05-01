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
          {title} <span className="accent-word">{titleAccent}</span>
        </h1>
        <p className={classes["hero__subtitle"]}>{subtitle}</p>
        <div className={classes["hero__left-info"]}>
          <div className={classes["hero__info-1"]}>
            <p className={classes["hero__info-title"]}>12+</p>
            <p className={classes["hero__info-subtitle"]}>Years Experience</p>
          </div>
          <div className={classes["hero__info-2"]}>
            <p className={classes["hero__info-title"]}>460+</p>
            <p className={classes["hero__info-subtitle"]}>Satisfied Clients</p>
          </div>
        </div>
        <Link
          href={ctaTallyFormLink || "/contact"}
          className={`${classes["hero__btn"]} btn`}
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
