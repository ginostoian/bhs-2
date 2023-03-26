/* eslint-disable react/no-unescaped-entities */
import classes from "./TextGrid.module.css";

const TextGrid = ({ content }) => {
  return (
    <div className={`${classes["how-we-work"]} container`}>
      <div className={classes["how-we-work-container"]}>
        <div className={classes["how-we-work-text"]}>
          <h2 className={classes["how-we-work-title"]}>
            {content.bigGridTitle}
          </h2>
          <p className={classes["how-we-work-body"]}>{content.bigGridText}</p>
        </div>

        <div className={classes["how-we-work-steps"]}>
          <div className={classes["step"]}>
            <h3 className={classes["step-number"]}>{content.gridOneNum}</h3>
            <h4 className={classes["step-title"]}>{content.gridOneTitle}</h4>
            <p className={classes["step-text"]}>{content.gridOneText}</p>
          </div>

          <div className={classes["step"]}>
            <h3 className={classes["step-number"]}>{content.gridTwoNum}</h3>
            <h4 className={classes["step-title"]}>{content.gridTwoTitle}</h4>
            <p className={classes["step-text"]}>{content.gridTwoText}</p>
          </div>

          <div className={classes["step"]}>
            <h3 className={classes["step-number"]}>{content.gridThreeNum}</h3>
            <h4 className={classes["step-title"]}>{content.gridThreeTitle}</h4>
            <p className={classes["step-text"]}>{content.gridThreeText}</p>
          </div>

          <div className={classes["step"]}>
            <h3 className={classes["step-number"]}>{content.gridFourNum}</h3>
            <h4 className={classes["step-title"]}>{content.gridFourTitle}</h4>
            <p className={classes["step-text"]}>{content.gridFourText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextGrid;
