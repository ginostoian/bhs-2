import classes from "./SectionTitle.module.css";

const SectionTitle = ({ title, subtitle }) => {
  return (
    <div class={`${classes["section__header"]} container`}>
      <h2 class={classes["section__header-title"]}>{title}</h2>
      <p class={classes["section__header-subtitle"]}>{subtitle}</p>
    </div>
  );
};

export default SectionTitle;
