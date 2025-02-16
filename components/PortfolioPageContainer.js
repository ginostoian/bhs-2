import React from "react";
import Image from "next/image";

import PortfolioCard from "./PortfolioCard";

const PortfolioPageContainer = () => {
  const projects = [
    {
      imgURL:
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp",
      imgAlt: "House extension London N19",
      title: "Daniel's stunning home extension & renovation",
      tag: "Extension",
      projectUrl: "/portfolio/daniel-n19",
    },
    {
      imgURL:
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-1.webp",
      imgAlt: "House extension London N19",
      title: "Lawrence's kitchen renovation and installation",
      tag: "Kitchen",
      projectUrl: "/portfolio/lawrence-e3",
    },
    {
      imgURL: "/assets/portfolio/extension-ava-e7/side-return-extension-6.webp",
      imgAlt: "Kitchen side return extension in E7",
      title: "Ava's side return kitchen extension in E7",
      tag: "Extension",
      projectUrl: "/portfolio/ava-e7",
    },
    {
      imgURL: "/assets/portfolio/kitchen-alice-e4/kitchen-renovation-e4-2.webp",
      imgAlt: "Kitchen renovation and installation in E4",
      title: "Alice's modern kitchen renovation and installation",
      tag: "Kitchen",
      projectUrl: "/portfolio/alice-e4",
    },
    {
      imgURL:
        "/assets/portfolio/kitchen-george-n16/kitchen-renovation-n16-3.webp",
      imgAlt: "Kitchen renovation and installation in N16",
      title: "George's kitchen renovation and installation",
      tag: "Kitchen",
      projectUrl: "/portfolio/george-n16",
    },
    {
      imgURL: "/assets/portfolio/kitchen-phil-e10/phil-kitchen-e10-3.webp",
      imgAlt: "Kitchen renovation and installation in E10",
      title: "Phil's kitchen renovation and installation",
      tag: "Kitchen",
      projectUrl: "/portfolio/phil-e10",
    },
    {
      imgURL: "/assets/portfolio/bathroom-melina-e7/melina-bathroom-e7-1.webp",
      imgAlt: "Bathroom design & renovation in E7",
      title: "Melina's bathroom design and renovation",
      tag: "Bathroom",
      projectUrl: "/portfolio/melina-e7",
    },
    {
      imgURL: "/assets/portfolio/extension-james-n8/extension-james-1.webp",
      imgAlt: "Kitchen extension and renovation in N8",
      title: "James's kitchen extension and renovation",
      tag: "Extension",
      projectUrl: "/portfolio/james-n8",
    },
    {
      imgURL:
        "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-green-11.webp",
      imgAlt: "Two bathroom renovations in E9",
      title: "Karim's bathroom renovations",
      tag: "Bathroom",
      projectUrl: "/portfolio/karim-e9",
    },
  ];

  return (
    // <!-- Container-->
    <div className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* <!-- Title --> */}
      <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
        <h2 className="text-4xl font-black text-[#100b47] md:text-6xl md:leading-tight">
          Recent projects
        </h2>
        <p className="mt-2 text-xl text-gray-600">
          A showcase of the quality you can expect in your own home.
        </p>
      </div>
      {/* <!-- End Title --> */}

      {/* <!-- Grid --> */}
      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:mb-14 lg:grid-cols-2 2xl:grid-cols-3">
        {/* <!-- Card --> */}
        {projects.map((project, i) => {
          return (
            <PortfolioCard
              key={i}
              imgURL={project.imgURL}
              imgAlt={project.imgAlt}
              title={project.title}
              tag={project.tag}
              projectUrl={project.projectUrl}
            />
          );
        })}
        {/* <!-- End Card --> */}
      </div>
      {/* <!-- End Grid --> */}

      {/* <!-- Card --> */}
      <div className="text-center">
        <div className="inline-block rounded-full border bg-white shadow-sm">
          <div className="flex items-center gap-x-2 px-4 py-3">
            <p className="text-gray-600">Want to work with us?</p>
            <a
              className="inline-flex items-center gap-x-1.5 font-medium text-blue-600 decoration-2 hover:underline focus:underline focus:outline-none"
              href="/contact"
            >
              Go here
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
            </a>
          </div>
        </div>
      </div>
      {/* <!-- End Card --> */}
      {/* <!-- End Card Blog --> */}
    </div>
  );
};

export default PortfolioPageContainer;
