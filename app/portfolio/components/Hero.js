import React from "react";

const Hero = ({ projectData }) => {
  return (
    <section className="mx-auto mb-16 mt-16 max-w-[85%] px-4 pb-4 sm:px-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 md:text-5xl">
          {projectData.title}
          <span className="text-[#266bf1]"> - Completed</span>
        </h1>
        <p className="mx-auto max-w-xl leading-relaxed text-gray-500">
          {projectData.description}
        </p>
      </div>
      <div className="mt-12 items-center justify-center space-y-3 sm:flex sm:space-x-6 sm:space-y-0">
        <a
          href="/contact"
          className="block w-full rounded-full bg-[#266bf1] px-10 py-3.5 text-center text-white shadow-md hover:text-black sm:w-auto"
        >
          Fill out the form
        </a>
        <a
          href="/portfolio"
          className="block w-full rounded-full border bg-white px-10 py-3.5 text-center text-gray-500 duration-300 hover:text-[#266bf1] hover:shadow sm:w-auto"
        >
          See other projects
        </a>
      </div>
    </section>
  );
};

export default Hero;
