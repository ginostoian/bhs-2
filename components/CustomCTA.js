import React from "react";
import Link from "next/link";
import Image from "next/image";

const CustomCTA = () => {
  return (
    <section className="mx-auto flex max-w-[85%] flex-col justify-around gap-10 rounded-xl bg-white px-10 py-10 xl:flex-row xl:items-center 2xl:gap-32">
      <div className="">
        <h2 className="mb-8 max-w-2xl text-2xl font-extrabold text-[#100b47] md:text-4xl lg:mx-auto">
          Premium Renovations and Home Extensions: On Time, On Budget
        </h2>
        <div className="flex max-w-2xl flex-col rounded-xl bg-[#f0f0f0] px-10 py-14 md:flex-row md:items-center md:justify-between lg:mx-auto">
          <div>
            <h3 className="mb-4 text-xl text-[#100b47]">
              Ready to start your project?
            </h3>
            <div className="flex gap-4">
              <div className="mb-8">
                <p className="text-sm">Limited availability</p>
                <p className="text-xl text-[#266bf1]">Increase your home&apos;s value</p>
              </div>
              <div>
                <Image
                  src="/assets/illustrations/discount animation.png"
                  width={50}
                  height={50}
                  alt="Book a consultation with Better Homes Studio"
                />
              </div>
            </div>
          </div>
          <div>
            <Link
              href="https://cal.com/bhstudio/discovery"
              target="_blank"
              className="lg:w-[245px]! btn-shadow flex min-h-[64px] w-max cursor-pointer items-center justify-center rounded-full border-2 border-[#266bf1] bg-[#266bf1] px-[26px] text-[18px] font-bold leading-[140%] text-white transition duration-200 hover:border-transparent hover:bg-[#1449B0] hover:text-gray-50 active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] lg:min-h-[48px] lg:px-[24px]"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden xl:block">
        <Image
          src="/assets/img/cta-happy-family.webp"
          width={500}
          height={500}
          alt="Happy couple"
          className="mx-auto rounded-l-[72px] rounded-r-xl"
        />
      </div>
    </section>
  );
};

export default CustomCTA;
