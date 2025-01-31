import React from "react";
import Image from "next/image";

import PortfolioCard from "./PortfolioCard";

const PortfolioCardContainer2 = () => {
  return (
    // <!-- Container-->
    <div class="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* <!-- Title --> */}
      <div class="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
        <h2 class="text-4xl font-black text-[#100b47] md:text-6xl md:leading-tight">
          Recent projects
        </h2>
        <p class="mt-2 text-xl text-gray-600">
          A showcase of the quality you can expect in your own home.
        </p>
      </div>
      {/* <!-- End Title --> */}

      {/* <!-- Grid --> */}
      <div class="lg:grid-cols-2, mb-10 grid gap-6 sm:grid-cols-2 lg:mb-14 2xl:grid-cols-3">
        {/* <!-- Card --> */}
        <PortfolioCard
          imgURL="/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp"
          imgAlt="House extension London N19"
          title="Daniel's stunning home extension & renovation"
          tag="Extension"
          projectUrl="/portfolio/daniel-n19"
        />
        <PortfolioCard
          imgURL="/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-1.webp"
          imgAlt="House extension London N19"
          title="Lawrence's kitchen renovation and installation"
          tag="Kitchen"
          projectUrl="/portfolio/lawrence-e3"
        />
        <PortfolioCard
          imgURL="/assets/portfolio/kitchen-alice-e4/kitchen-renovation-e4-2.webp"
          imgAlt="Kitchen renovation and installation in E4"
          title="Alice's modern kitchen renovation and installation"
          tag="Kitchen"
          projectUrl="/portfolio/alice-e4"
        />
        <PortfolioCard
          imgURL="/assets/portfolio/kitchen-george-n16/kitchen-renovation-n16-3.webp"
          imgAlt="Kitchen renovation and installation in N16"
          title="George's kitchen renovation and installation"
          tag="Kitchen"
          projectUrl="/portfolio/george-n16"
        />

        {/* <!-- End Card --> */}
      </div>
      {/* <!-- End Grid --> */}

      {/* <!-- Card --> */}
      <div class="text-center">
        <div class="inline-block rounded-full border bg-white shadow-sm">
          <div class="flex items-center gap-x-2 px-4 py-3">
            <p class="text-gray-600">Want to see more?</p>
            <a
              class="inline-flex items-center gap-x-1.5 font-medium text-blue-600 decoration-2 hover:underline focus:underline focus:outline-none"
              href="/portfolio"
            >
              Go here
              <svg
                class="size-4 shrink-0"
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
