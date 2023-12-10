import Hero from "../../components/hero/Hero";

const ContactFormSubmittedPage = () => {
  return (
    <Hero
      title={"Thank you for submitting"}
      titleAccent={"our form."}
      subtitle={
        "We'll start working our magic and we'll get back to you with either a quote or a call as soon as possible."
      }
      heroCTA={"Take me home!"}
      heroImgUrl={"misc/congrats.jpg"}
      ctaTallyFormLink={"/"}
    />
  );
};

export default ContactFormSubmittedPage;
