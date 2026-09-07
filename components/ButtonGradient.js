"use client";

const ButtonGradient = ({ title = "Gradient Button", src }) => {
  return (
    <button
      className="flex min-h-[44px] w-max cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-[#4D5B4B] px-[24px] text-[18px] font-bold capitalize text-white transition duration-200 hover:bg-[#3E4A3C] hover:text-gray-50 active:bg-[#3E4A3C] disabled:bg-[#A5D2FF]"
      href={src}
    >
      {title}
    </button>
  );
};

export default ButtonGradient;
