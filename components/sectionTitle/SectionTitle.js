import classes from "./SectionTitle.module.css";

const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className={`${classes["section__header"]} container`}>
      <h2 className={classes["section__header-title"]}>{title}</h2>
      <p className={classes["section__header-subtitle"]}>{subtitle}</p>
    </div>
  );
};

export default SectionTitle;
