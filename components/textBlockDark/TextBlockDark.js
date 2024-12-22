/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

import classes from "./TextBlockDark.module.css";

const TextBlockDark = ({ content }) => {
  return (
    <div className={`${classes["textBlock__main"]} container bg-gray-900`}>
      <div className={classes["textBlock__header"]}>
        <h2 className={classes["textBlock__header-title"]}>
          {content.darkBgTextTitle}
        </h2>
        <p className={classes["textBlock__header-subtitle"]}>
          {content.darkBgTextSubtitle}
        </p>
        <Link
          href="/contact"
          className="w-max flex items-center justify-center mx-auto transition duration-200 cursor-pointer font-bold border-2 bg-[#266bf1] capitalize text-white border-transparent hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] text-[18px] px-[20px] min-h-[64px] lg:min-h-[64px] lg:px-[24px] lg:w-[245px]! rounded-full"
        >
          {content.darkBgTextBtn}
        </Link>
      </div>
    </div>
  );
};

export default TextBlockDark;
