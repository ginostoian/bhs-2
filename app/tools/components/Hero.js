import TestimonialRating from "@/components/TestimonialRating";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <section className="mx-auto mb-12 mt-12 max-w-[85%]">
      <h1 className="mb-4 text-center text-4xl font-bold text-gray-800 md:text-6xl">
        Bathroom renovation
        <span className="text-[#266bf1]"> cost calculator</span>
      </h1>
      <p className="mx-auto text-center text-lg leading-relaxed text-gray-500 md:text-xl">
        Stop guessing. Find out how much should you budget for your upcoming
        project.
      </p>

      <div className="mx-auto mt-12 flex max-w-[90%] items-center justify-center gap-4 rounded-xl bg-white px-6 py-8 text-center md:justify-between">
        <p className="hidden max-w-[25%] lg:block">
          BHS basically hold our hands through the whole process.” — Ben,
          Islington
        </p>
        <Link
          href="/contact"
          className="hidden max-w-[40%] font-black underline md:block"
        >
          Our portfolio
        </Link>
        <TestimonialRating className="max-w-[33%]" />
      </div>
    </section>
  );
};

export default Hero;
