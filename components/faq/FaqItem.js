import { useState } from "react";
import Image from "next/image";

import classes from "./Faq.module.css";

const FaqItem = ({ faq, index }) => {
  const [isClicked, setIsClicked] = useState(false);

  const { question, answer } = faq;
  const uniqueId = `faq-${index}`;
  const contentId = `faq-content-${index}`;

  return (
    <div className={`${classes["faq"]} ${isClicked ? classes.active : ""}`}>
      <h3 className={classes["faq-title"]}>
        <button
          className={classes["faq-toggle"]}
          aria-expanded={isClicked}
          aria-controls={contentId}
          id={uniqueId}
          onClick={() => setIsClicked(!isClicked)}
        >
          {question}
          <Image
            className={classes["open-faq"]}
            src="/assets/icons/arrow-down.svg"
            alt="Expand answer"
            width={24}
            height={24}
          />
          <Image
            className={classes["close-faq"]}
            src="/assets/icons/close-icon.svg"
            alt="Collapse answer"
            width={24}
            height={24}
          />
        </button>
      </h3>
      <div
        id={contentId}
        role="region"
        aria-labelledby={uniqueId}
        className={classes["faq-answer"]}
        style={{ display: isClicked ? "block" : "none" }}
      >
        {answer}
      </div>
    </div>
  );
};

export default FaqItem;
