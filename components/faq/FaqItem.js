import { useState } from "react";
import Image from "next/image";

import classes from "./Faq.module.css";

const FaqItem = ({ faq }) => {
  const [isClicked, setIsClicked] = useState(false);

  const { question, answer } = faq;
  return (
    <div className={`${classes["faq"]} ${isClicked ? classes.active : ""}`}>
      <h3 className={classes["faq-title"]}>{question}</h3>
      <p className={classes["faq-answer"]}>{answer}</p>
      <button className={classes["faq-toggle"]}>
        <Image
          className={classes["open-faq"]}
          src="./assets/icons/arrow-down.svg"
          alt="down arrow"
          width={24}
          height={24}
          onClick={() => setIsClicked(true)}
        />
        <Image
          className={classes["close-faq"]}
          src="./assets/icons/close-icon.svg"
          alt="close icon"
          width={24}
          height={24}
          onClick={() => setIsClicked(false)}
        />
      </button>
    </div>
  );
};

export default FaqItem;
