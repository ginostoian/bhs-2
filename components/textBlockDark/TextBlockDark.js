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
        <p
          className={`${classes["textBlock__header-subtitle"]} mx-auto max-w-3xl`}
        >
          {content.darkBgTextSubtitle}
        </p>
        <Link
          href="/contact"
          className="lg:w-[245px]! mx-auto flex min-h-[64px] w-max cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-[#266bf1] px-[20px] text-[18px] font-bold capitalize text-white transition duration-200 hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] lg:min-h-[64px] lg:px-[24px]"
        >
          {content.darkBgTextBtn}
        </Link>
      </div>
    </div>
  );
};

export default TextBlockDark;
