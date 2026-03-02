import Image from "next/image";
import Link from "next/link";

const checkIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-[#266bf1]"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.415 0l-3-3a1 1 0 111.414-1.42l2.293 2.294 6.543-6.544a1 1 0 011.415 0z"
      clipRule="evenodd"
    />
  </svg>
);

const PortfolioCard = ({ project, compact = false }) => {
  const focusItems = (project.caseStudy?.scope || []).slice(0, compact ? 2 : 3);

  return (
    <Link
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#d5e0f8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:shadow-lg focus:outline-none"
      href={`/portfolio/${project.slug}`}
    >
      <div className="relative">
        <Image
          className="h-[240px] w-full object-cover"
          src={project.coverImage}
          alt={project.coverImageAlt}
          width={1200}
          height={800}
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#100b47]">
          Case Study
        </div>
      </div>

      <div className="flex h-full flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#266bf1]">
            {project.category}
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {project.location}
          </span>
        </div>

        <h3 className="text-xl font-bold leading-tight text-[#100b47] group-hover:text-[#266bf1]">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{project.teaser}</p>

        <ul className="mt-4 space-y-2">
          {focusItems.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-0.5">{checkIcon}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#266bf1]">
            Read full case study
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition group-hover:translate-x-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 15.707a1 1 0 010-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PortfolioCard;
