/* eslint-disable react/no-unescaped-entities */
import classes from "./TextBlockDark.module.css";

const TextBlockDark = ({ content }) => {
  return (
    <div className={`${classes["textBlock__main"]} container`}>
      <div className={classes["textBlock__header"]}>
        <h2 className={classes["textBlock__header-title"]}>
          {content.darkBgTextTitle}
        </h2>
        <p className={classes["textBlock__header-subtitle"]}>
          {content.darkBgTextSubtitle}
        </p>
        <a
          href="./pages/contact.html"
          className="service__btn btn"
        >
          {content.darkBgTextBtn}
        </a>
      </div>
    </div>
  );
};

export default TextBlockDark;
