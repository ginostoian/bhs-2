import React from "react";
import Image from "next/image";
import Link from "next/link";

const PortfolioCard2 = ({ imgURL, imgAlt, title, tag }) => {
  return (
    <Link
      class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md focus:outline-none focus:shadow-md transition"
      href="#"
    >
      <div class="aspect-w-16 aspect-h-9">
        <Image
          class="w-full max-h-[250px] object-cover rounded-t-xl"
          src={imgURL}
          alt={imgAlt}
          width={500}
          height={500}
        />
      </div>
      <div class="p-4 md:p-5">
        <p class="mt-2 text-xs uppercase text-gray-600">{tag}</p>
        <h3 class="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default PortfolioCard2;
