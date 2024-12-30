import React from "react";
import Image from "next/image";
import Link from "next/link";

const InfoPartner = () => {
  return (
    <section className="mx-auto my-20 flex max-w-[85%] flex-col gap-4 rounded-xl bg-white px-4 py-10 lg:flex-row lg:items-center lg:justify-around lg:gap-10">
      <div className="mb-3 flex flex-col items-center justify-center">
        <Image
          src="/assets/logo/bh-logo.svg"
          width={100}
          height={100}
          alt="Better Homes Studio Logo"
        />{" "}
        <p className="text-xl text-black">Better Homes Studio</p>
      </div>
      <div className="mb-3 lg:max-w-[60%]">
        <p className="mb-[12px] text-xs tracking-widest">
          ACCESS RENOVATION EXPERTS
        </p>
        <p className="max-w-2xl text-[17px] font-bold leading-normal tracking-wide text-black">
          We want to build a meaningful partnership with you. Need answers to
          your client&apos;s renovation questions? Ask our remodeling experts
          via chat or email at no charge! We&apos;re happy to educate you and
          your clients along the way.
        </p>
      </div>
      <div className="">
        <Link
          href="https://cal.com/bhstudio/discovery"
          target="_blank"
          className="lg:max-w-[245px]! btn-shadow flex min-h-[46px] w-full cursor-pointer items-center justify-center rounded-full border-2 border-[#266bf1] bg-[#266bf1] px-[26px] text-[17px] font-bold leading-[140%] text-white transition duration-200 hover:border-transparent hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] md:w-max lg:min-h-[48px] lg:px-[24px]"
        >
          Start your application
        </Link>
      </div>
    </section>
  );
};

export default InfoPartner;
