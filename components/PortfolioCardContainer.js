import PortfolioCard from "./PortfolioCard";

const PortfolioCardContainer = () => {
  return (
    <div className="container flex flex-row flex-wrap gap-12 justify-center">
      <PortfolioCard
        imgURL="/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-room.webp"
        imgAlt="black and gold luxury bathroom"
        title="Daniel's home extension & renovation"
        desc="A stunning kitchen extension and full home renovation in N19"
      />
      <PortfolioCard
        imgURL="/assets/portfolio/extension-daniel-n19/daniel-home-extension-garden-view.webp"
        imgAlt="black and gold luxury bathroom"
        title="Rosa's bathroom renovation"
        desc="A stunning refurbishment of a bathroom in SW15. Bold colours for a bold personality"
      />
      <PortfolioCard
        imgURL="/assets/img/bathroom/bathroom-photo.webp"
        imgAlt="black and gold luxury bathroom"
        title="Rosa's bathroom renovation"
        desc="A stunning refurbishment of a bathroom in SW15. Bold colours for a bold personality"
      />
      <PortfolioCard
        imgURL="/assets/img/bathroom/industrial-bathroom.webp"
        imgAlt="black and gold luxury bathroom"
        title="Rosa's bathroom renovation"
        desc="A stunning refurbishment of a bathroom in SW15. Bold colours for a bold personality"
      />
      <PortfolioCard
        imgURL="/assets/img/bathroom/contemporary-bathroom.webp"
        imgAlt="black and gold luxury bathroom"
        title="Rosa's bathroom renovation"
        desc="A stunning refurbishment of a bathroom in SW15. Bold colours for a bold personality"
      />
    </div>
  );
};

export default PortfolioCardContainer;
