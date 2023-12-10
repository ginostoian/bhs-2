import Hero from "../../../components/hero/Hero";

const PortfolioPage = () => {
  return (
    <Hero
      title={"We're building this page"}
      titleAccent={"as we speak."}
      subtitle={
        "For a photos of our projects, please see our Houzz profile by clicking the button below."
      }
      heroCTA={"Take me to Houzz"}
      heroImgUrl={"misc/congrats.jpg"}
      ctaTallyFormLink={
        "https://www.houzz.co.uk/pro/betterhomesstudio/better-homes-studio-celli"
      }
    />
  );
};

export default PortfolioPage;
