import Hero from "../components/hero/Hero";

const Custom404 = () => {
  return (
    <Hero
      title={"Oh no! We've got a"}
      titleAccent={"problem!"}
      subtitle={
        "The page you tried to access either does not exist or is still in the making. Sorry about that! There's still more to browse."
      }
      heroCTA={"Take me back!"}
      ctaTallyFormLink={"/"}
      heroImgUrl={"misc/404.jpg"}
    />
  );
};

export default Custom404;
