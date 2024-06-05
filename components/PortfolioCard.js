import Image from "next/image";

const PortfolioCard = () => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <Image
          src="/assets/img/general/flooring-1.webp"
          alt="Shoes"
          width={500}
          height={500}
        />
      </figure>
      <div className="card-body gap-5">
        <div className="card-actions justify-start">
          <div className="badge badge-outline">Bathroom</div>
          <div className="badge badge-outline">Kitchen</div>
        </div>
        <h2 className="card-title">Shoes!</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>

        <div className="card-actions justify-start">
          <button className="btn btn-primary">Look inside</button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
