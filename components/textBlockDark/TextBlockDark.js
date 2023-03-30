/* eslint-disable react/no-unescaped-entities */
import classes from "./TextBlockDark.module.css";

const TextBlockDark = () => {
  return (
    <div className={`${classes["textBlock__main"]} container`}>
      <div className={classes["textBlock__header"]}>
        <h2 className={classes["textBlock__header-title"]}>
          Take a look at what our clients say.
        </h2>
        <p className={classes["textBlock__header-subtitle"]}>
          We've built our business on the back of our clients satisfaction.{" "}
        </p>
        <a
          href="./pages/contact.html"
          className="service__btn btn"
        >
          Contact us
        </a>
      </div>
    </div>
  );
};

export default TextBlockDark;
