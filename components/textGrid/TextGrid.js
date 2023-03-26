/* eslint-disable react/no-unescaped-entities */
import classes from "./TextGrid.module.css";

const TextGrid = ({ content }) => {
  return (
    <div className={`${classes["how-we-work"]} container`}>
      <div className={classes["how-we-work-container"]}>
        <div className={classes["how-we-work-text"]}>
          <h2 className={classes["how-we-work-title"]}>
            Easy, transparent and different
            {console.log(content)}
          </h2>
          <p className={classes["how-we-work-body"]}>
            From design to refurbishment you can rest assured that your
            experience with{" "}
            <span className="accent-word">Better Homes Studio</span> will be
            second to none.
          </p>
        </div>

        <div className={classes["how-we-work-steps"]}>
          <div className={classes["step"]}>
            <h3 className={classes["step-number"]}>1.</h3>
            <h4 className={classes["step-title"]}>Book an appointment</h4>
            <p className={classes["step-text"]}>
              Use our quick and easy online form to book a date which suits you
              best. One of our experienced operators will be in touch to
              finalise your appointment.
            </p>
          </div>

          <div className={classes["step"]}>
            <h3 className={classes["step-number"]}>2.</h3>
            <h4 className={classes["step-title"]}>
              Receive your free & transparent quote
            </h4>
            <p className={classes["step-text"]}>
              Based on your preferences discussed during the initial meeting,
              our team of expert estimators will craft a clear and transparent
              quote.{" "}
            </p>
          </div>

          <div className={classes["step"]}>
            <h3 className={classes["step-number"]}>3.</h3>
            <h4 className={classes["step-title"]}>We carry out the work</h4>
            <p className={classes["step-text"]}>
              Our friendly team of highly skilled professionals will
              effortlessly refurbish your home so you won't have to worry about
              a thing.
            </p>
          </div>

          <div className={classes["step"]}>
            <h3 className={classes["step-number"]}>4.</h3>
            <h4 className={classes["step-title"]}>
              Enjoy your new home + a 2 year guarantee*
            </h4>
            <p className={classes["step-text"]}>
              Now it's time to sit back, relax and marvel at how your vision
              became a reality. It really is that simple, so what are you
              waiting for?{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextGrid;
