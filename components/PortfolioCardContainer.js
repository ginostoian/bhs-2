import Link from "next/link";

import PortfolioCard from "./PortfolioCard";
import { getFeaturedPortfolioProjects } from "@/libs/portfolio-projects";

const PortfolioCardContainer2 = () => {
  const projects = getFeaturedPortfolioProjects(4);

  return (
    <div className="mx-auto max-w-[88%] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-14">
        <h2 className="text-4xl font-black text-[#100b47] md:text-6xl md:leading-tight">
          Recent Case Studies
        </h2>
        <p className="mt-2 text-lg leading-relaxed text-gray-600 md:text-xl">
          A quick look at how we deliver trusted outcomes for London
          homeowners.
        </p>
      </div>

      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:mb-14">
        {projects.map((project) => (
          <PortfolioCard key={project.slug} project={project} compact />
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 rounded-full border border-[#bfd3f9] bg-white px-6 py-3 text-sm font-semibold text-[#266bf1] transition hover:bg-[#266bf1] hover:text-white"
        >
          View all case studies
        </Link>
      </div>
    </div>
  );
};

export default PortfolioCardContainer2;
