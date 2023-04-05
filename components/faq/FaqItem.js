import Image from "next/image";

import classes from "./Faq.module.css";

const FaqItem = () => {
  return (
    <div className={classes["faq"]}>
      <h3 className={classes["faq-title"]}>Do you offer any guarantees?</h3>
      <p className={classes["faq-answer"]}>
        We offer a workmanship guarantee, between 1 year and 2 years, on almost
        all of our projects. To read more about our guarantee and what is
        covered by it please <a href="./pages/our-guarantee.html">click here</a>
        .
      </p>
      <button className={classes["faq-toggle"]}>
        <Image
          className={classes["open-faq"]}
          src="./assets/icons/arrow-down.svg"
          alt="down arrow"
          width={24}
          height={24}
        />
        <Image
          className={classes["close-faq"]}
          src="./assets/icons/close-icon.svg"
          alt="close icon"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
};

export default FaqItem;
