"use client";

import React from "react";
import Link from "next/link";

const Announcement = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Link
      className="group mx-auto block max-w-[100%] rounded-lg bg-white p-4 text-center transition duration-300 hover:bg-gray-300 focus:bg-gray-200 focus:outline-none"
      href="https://cal.com/bhstudio/discovery"
      target="_blank"
    >
      <div className="mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8">
        <p className="text-md me-2 inline-block text-gray-800">
          Book a call now and unlock an up to{" "}
          <span className="text-base font-bold">£3,000 discount</span> in{" "}
          {months[new Date().getMonth()]}
        </p>
        <span className="inline-flex items-center justify-center gap-x-2 text-sm font-semibold text-blue-600 decoration-2 group-hover:underline group-focus:underline">
          Book now
          <svg
            className="size-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
      </div>
    </Link>
  );
};

export default Announcement;
