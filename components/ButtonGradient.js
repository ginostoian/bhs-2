"use client";

const ButtonGradient = ({ title = "Gradient Button", src }) => {
  return (
    <button
      className="flex min-h-[44px] w-max cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-[#266bf1] px-[24px] text-[18px] font-bold capitalize text-white transition duration-200 hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF]"
      href={src}
    >
      {title}
    </button>
  );
};

export default ButtonGradient;
