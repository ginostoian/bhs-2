/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

import classes from "./Faq.module.css";
import FaqItem from "./FaqItem";

const Faq = ({ faqs }) => {
  return (
    <section className={`container ${classes["faq-section"]}`}>
      <div className={classes["faq-container"]}>
        {faqs.map((faq, index) => {
          return (
            <FaqItem
              key={index}
              faq={faq}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Faq;
