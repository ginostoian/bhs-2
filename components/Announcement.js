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

  const nextMonthIndex = (new Date().getMonth() + 1) % 12;
  const nextMonth = months[nextMonthIndex];

  return (
    <div className="flex justify-center w-full px-4 pt-4 sm:pt-6">
      <Link
        className="group relative flex items-center gap-3 px-6 py-2.5 bg-[#0c1421]/95 backdrop-blur-md border border-[#c5a059]/20 rounded-full shadow-lg transition-all duration-300 hover:shadow-[#c5a059]/10 hover:border-[#c5a059]/40 hover:scale-[1.01] active:scale-[0.99] focus:outline-none"
        href="https://cal.com/bhstudio/discovery"
        target="_blank"
      >
        <span className="flex items-center gap-2.5 text-[#c5a059] text-[13px] sm:text-[14px] font-medium tracking-wide">
          <svg
            className="size-4 shrink-0 opacity-90 transition-transform duration-500 group-hover:rotate-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="flex items-center gap-1.5">
            <span className="hidden xs:inline">
              Limited {nextMonth} availability: 3 premium projects remaining
            </span>
            <span className="xs:hidden">
              Limited {nextMonth} availability
            </span>
            <span className="opacity-40 font-light mx-1">·</span>
            <span className="text-white/90 group-hover:text-white transition-colors">
              Secure Consultation
            </span>
          </span>
        </span>
        
        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      </Link>
    </div>
  );
};

export default Announcement;
