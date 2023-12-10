import Hero from "../../../components/hero/Hero";

const BlogPage = () => {
  return (
    <Hero
      title={"We're building this page"}
      titleAccent={"as we speak."}
      subtitle={
        "This page will be our knowledge center. Stay tuned for detailed information on costs, trends and advice."
      }
      heroCTA={"Get in touch"}
      heroImgUrl={"misc/congrats.jpg"}
      ctaTallyFormLink={"/pages/contact"}
    />
  );
};

export default BlogPage;
