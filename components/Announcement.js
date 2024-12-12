import React from "react";
import Link from "next/link";

const Announcement = () => {
  return (
    <Link
      class="max-w-[100%] mx-auto group block bg-white hover:bg-gray-300 focus:outline-none focus:bg-gray-200 p-4 rounded-lg text-center transition duration-300"
      href="#"
    >
      <div class="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
        <p class="me-2 inline-block text-md text-gray-800">
          Start your project in January and get our design package worth £480
          for FREE
        </p>
        <span class="group-hover:underline group-focus:underline decoration-2 inline-flex justify-center items-center gap-x-2 font-semibold text-blue-600 text-sm">
          Book now
          <svg
            class="shrink-0 size-4"
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
