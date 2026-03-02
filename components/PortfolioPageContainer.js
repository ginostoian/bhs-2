import Link from "next/link";

import PortfolioCard from "./PortfolioCard";
import { getPortfolioProjects } from "@/libs/portfolio-projects";

const PortfolioPageContainer = () => {
  const projects = getPortfolioProjects();

  return (
    <div className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto mb-8 rounded-3xl border border-[#d5e0f8] bg-gradient-to-r from-white via-white to-blue-50 p-7 md:p-10">
        <h2 className="text-3xl font-black text-[#100b47] md:text-5xl">
          Real London Renovation Case Studies
        </h2>
        <p className="mt-3 max-w-4xl text-base leading-relaxed text-gray-600 md:text-lg">
          Each project below shows how we scope, manage and deliver work for
          homeowners who care about quality, reliability and long-term value.
          These are concise case studies, not gallery filler.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            "500+ homeowners served across London",
            "Up to 10 years workmanship guarantee",
            "Fully insured with transparent project communication",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-[#dbe6fb] bg-white px-4 py-3 text-sm font-semibold text-[#100b47]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:mb-14 lg:grid-cols-2 2xl:grid-cols-3">
        {projects.map((project) => (
          <PortfolioCard key={project.slug} project={project} />
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-[#266bf1] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#1e58cf] hover:text-white"
        >
          Start your project consultation
        </Link>
      </div>
    </div>
  );
};

export default PortfolioPageContainer;
