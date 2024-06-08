import PortfolioCard from "./PortfolioCard";

const PortfolioCardContainer = () => {
  return (
    <div className="container flex flex-row flex-wrap gap-12 justify-center">
      <PortfolioCard />
      <PortfolioCard />
      <PortfolioCard />
      <PortfolioCard />
      <PortfolioCard />
    </div>
  );
};

export default PortfolioCardContainer;
