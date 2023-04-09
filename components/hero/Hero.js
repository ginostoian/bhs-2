/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

import classes from "./Hero.module.css";

const Hero = ({ title, titleAccent, subtitle, heroCTA, heroImgUrl }) => {
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
            <p className={classes["hero__info-title"]}>10+</p>
            <p className={classes["hero__info-subtitle"]}>Years Experience</p>
          </div>
          <div className={classes["hero__info-2"]}>
            <p className={classes["hero__info-title"]}>300+</p>
            <p className={classes["hero__info-subtitle"]}>Satisfied Clients</p>
          </div>
        </div>
        <a
          href="./pages/contact.html"
          className={`${classes["hero__btn"]} btn`}
        >
          {heroCTA}
        </a>
      </div>
      <div className={classes["hero__right"]}>
        <div className={classes["hero__right-img-fill"]}>
          <Image
            src={`/assets/img/${heroImgUrl}`}
            objectFit="cover"
            fill
            alt="bathroom"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
