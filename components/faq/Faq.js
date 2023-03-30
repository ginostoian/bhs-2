/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import classes from "./Faq.module.css";

const Faq = () => {
  return (
    <section className={`container ${classes["faq-section"]}`}>
      <div className={classes["faq-container"]}>
        <div className={`${classes.faq} ${classes.active}`}>
          <h3 className={classes["faq-title"]}>
            Who is <span className="accent-word">Better Homes Studio</span>?
          </h3>
          <p className={classes["faq-answer"]}>
            We are a construction and interior renovation and design company. We
            have been working in London for over 10 years and have established
            experience in the field.
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

        <div className={classes["faq"]}>
          <h3 className={classes["faq-title"]}>
            What type of projects do you undertake?
          </h3>
          <p className={classes["faq-answer"]}>
            Here is a list the projects we undertake, although it is not
            complete:
            <ul className={classes["faq-answer"]}>
              <li>Interior Design</li>
              <li>Bathroom renovation</li>
              <li>Kitchen renovation</li>
              <li>Full house refurbishment</li>
              <li>House extensions</li>
              <li>Loft conversions</li>
              <li>Boiler installations</li>
              <li>Electrical rewiring</li>
              <li>And more..</li>
            </ul>
          </p>
          <button className={classes["faq-toggle"]}>
            <Image
              className="open-faq"
              src="./assets/icons/arrow-down.svg"
              alt="down arrow"
              width={24}
              height={24}
            />
            <Image
              className="close-faq"
              src="./assets/icons/close-icon.svg"
              alt="close icon"
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className={classes["faq"]}>
          <h3 className={classes["faq-title"]}>Do you offer any guarantees?</h3>
          <p className={classes["faq-answer"]}>
            We offer a workmanship guarantee, between 1 year and 2 years, on
            almost all of our projects. To read more about our guarantee and
            what is covered by it please{" "}
            <a href="./pages/our-guarantee.html">click here</a>.
          </p>
          <button className={classes["faq-toggle"]}>
            <Image
              className="open-faq"
              src="./assets/icons/arrow-down.svg"
              alt="down arrow"
              width={24}
              height={24}
            />
            <Image
              className="close-faq"
              src="./assets/icons/close-icon.svg"
              alt="close icon"
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className={classes["faq"]}>
          <h3 className={classes["faq-title"]}>
            Do I have to pay for bathroom design if I already know what I want?
          </h3>
          <p className={classes["faq-answer"]}>
            No. Bathroom design is a separate service from the Bathroom
            renovation service and is optional.
          </p>
          <button className={classes["faq-toggle"]}>
            <Image
              className="open-faq"
              src="./assets/icons/arrow-down.svg"
              alt="down arrow"
              width={24}
              height={24}
            />
            <Image
              className="close-faq"
              src="./assets/icons/close-icon.svg"
              alt="close icon"
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className={classes["faq"]}>
          <h3 className={classes["faq-title"]}>Do you offer free quotes?</h3>
          <p className={classes["faq-answer"]}>
            Yes. Our quotes are free of charge and do not carry any obligation
            on your part.
          </p>
          <button className={classes["faq-toggle"]}>
            <Image
              className="open-faq"
              src="./assets/icons/arrow-down.svg"
              alt="down arrow"
              width={24}
              height={24}
            />
            <Image
              className="close-faq"
              src="./assets/icons/close-icon.svg"
              alt="close icon"
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className="faq">
          <h3 className="faq-title">How long will my project take?</h3>
          <p className="faq-answer">
            The time of completion is different from project to project
            depending on the type of project and the complexity of it. If you
            need a more specific answer, please contact us by clicking{" "}
            <a href="./pages/contact.html">here</a>.
          </p>
          <button className="faq-toggle">
            <img
              className="open-faq"
              src="./assets/icons/arrow-down.svg"
              alt="down arrow"
            />
            <img
              className="close-faq"
              src="./assets/icons/close-icon.svg"
              alt="close icon"
            />
          </button>
        </div>

        <div className="faq">
          <h3 className="faq-title">
            How are you going to quote for my project?
          </h3>
          <p className="faq-answer">
            Quoting is different and depends on the type of project. To quote
            for a full home renovation, one of our estimators will visit your
            home in order to collect all the info. If you're looking for a
            bathroom renovation, we can quote based on the form found{" "}
            <a href="./pages/bathroom-form.html">here</a>.
          </p>
          <button className="faq-toggle">
            <img
              className="open-faq"
              src="./assets/icons/arrow-down.svg"
              alt="down arrow"
            />
            <img
              className="close-faq"
              src="./assets/icons/close-icon.svg"
              alt="close icon"
            />
          </button>
        </div>

        <div className="faq">
          <h3 className="faq-title">
            Will I have to manage the project myself?
          </h3>
          <p className="faq-answer">
            No. We take care of every part of the project and you will be
            assigned a project manager that will manage the project.
          </p>
          <button className="faq-toggle">
            <img
              className="open-faq"
              src="./assets/icons/arrow-down.svg"
              alt="down arrow"
            />
            <img
              className="close-faq"
              src="./assets/icons/close-icon.svg"
              alt="close icon"
            />
          </button>
        </div>

        <div className="faq">
          <h3 className="faq-title">Do you offer refferal awards?</h3>
          <p className="faq-answer">
            Yes. For every client reffered by you that we end up working with,
            you will win a prize. Please contact us to find out more about this
            program.
          </p>
          <button className="faq-toggle">
            <img
              className="open-faq"
              src="./assets/icons/arrow-down.svg"
              alt="down arrow"
            />
            <img
              className="close-faq"
              src="./assets/icons/close-icon.svg"
              alt="close icon"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Faq;
