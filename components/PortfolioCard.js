import Image from "next/image";
import Link from "next/link";

const PortfolioCard = ({
  imgURL,
  imgAlt,
  title,
  desc,
  tags = ["Renovation"],
  projectURL,
}) => {
  return (
    <div className="card max-h-[650px] lg:w-96 bg-base-100 shadow-xl">
      <figure>
        <Image
          src={imgURL}
          alt={imgAlt}
          width={500}
          height={500}
        />
      </figure>
      <div className="card-body gap-4">
        <div className="card-actions justify-start">
          {tags.map((tag, i) => {
            return (
              <div
                key={i}
                className="badge badge-outline"
              >
                {tag}
              </div>
            );
          })}
        </div>
        <h2 className="card-title text-black text-2xl">{title}</h2>
        <p>{desc}</p>

        <div className="card-actions justify-start">
          <Link href={projectURL || ""}>
            <button className="w-max mt-2 flex items-center justify-center transition duration-200 cursor-pointer font-bold border-2 bg-transparent capitalize text-[#266bf1] border-[#266bf1] hover:bg-[#1449B0] hover:text-gray-50 hover:border-transparent active:bg-[#0C5AC8] disabled:bg-[#A5D2FF] text-[16px] px-[20px] min-h-[46px] lg:min-h-[46px] lg:px-[24px] lg:w-[245px]! rounded-[20px]">
              See more
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
