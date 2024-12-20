import React from "react";
import Image from "next/image";

import PortfolioCard2 from "./PortfolioCard";

const PortfolioCardContainer2 = () => {
  return (
    // <!-- Container-->
    <div class="max-w-[90%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      {/* <!-- Title --> */}
      <div class="max-w-2xl text-center mx-auto mb-10 lg:mb-14">
        <h2 class="text-2xl text-[#100b47] font-black md:text-4xl md:leading-tight">
          Recent projects
        </h2>
        <p class="text-xl mt-2 text-gray-600">
          A showcase of the quality you can expect in your own home.
        </p>
      </div>
      {/* <!-- End Title --> */}

      {/* <!-- Grid --> */}
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 lg:mb-14">
        {/* <!-- Card --> */}
        <PortfolioCard2
          imgURL="/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-room.webp"
          imgAlt="House extension London N19"
          title="Daniel's stunning home extension & renovation"
          tag="Extension"
        />
        <PortfolioCard2
          imgURL="/assets/img/bathroom/bathroom-photo.webp"
          imgAlt="House extension London N19"
          title="Daniel's stunning home extension & renovation"
          tag="Extension"
        />
        <PortfolioCard2
          imgURL="/assets/img/bathroom/industrial-bathroom.webp"
          imgAlt="House extension London N19"
          title="Daniel's stunning home extension & renovation"
          tag="Extension"
        />
        <PortfolioCard2
          imgURL="/assets/img/bathroom/contemporary-bathroom.webp"
          imgAlt="House extension London N19"
          title="Daniel's stunning home extension & renovation"
          tag="Extension"
        />

        {/* <!-- End Card --> */}
      </div>
      {/* <!-- End Grid --> */}

      {/* <!-- Card --> */}
      <div class="text-center">
        <div class="inline-block bg-white border shadow-sm rounded-full">
          <div class="py-3 px-4 flex items-center gap-x-2">
            <p class="text-gray-600">Want to see more?</p>
            <a
              class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium"
              href="../docs/index.html"
            >
              Go here
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
            </a>
          </div>
        </div>
      </div>
      {/* <!-- End Card --> */}
      {/* <!-- End Card Blog --> */}
    </div>
  );
};

export default PortfolioCardContainer2;
