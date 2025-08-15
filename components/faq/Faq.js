/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

import classes from "./Faq.module.css";
import FaqItem from "./FaqItem";

const Faq = ({ faqs }) => {
  return (
    <section
      className={`container ${classes["faq-section"]}`}
      aria-labelledby="faq-heading"
    >
      <div className={classes["faq-container"]}>
        <h2 id="faq-heading" className="sr-only">
          Frequently Asked Questions
        </h2>
        {faqs.map((faq, index) => {
          return <FaqItem key={index} faq={faq} index={index} />;
        })}
      </div>
    </section>
  );
};

export default Faq;
