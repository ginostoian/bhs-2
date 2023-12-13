import Script from "next/script";

const Reviews = () => {
  return (
    <div className="container">
      <Script
        async
        type="text/javascript"
        src="https://testimonial.to/js/iframeResizer.min.js"
      ></Script>
      <iframe
        loading="lazy"
        id="testimonialto-carousel-all-better-homes-studio-light"
        src="https://embed-v2.testimonial.to/carousel/all/better-homes-studio?theme=light&autoplay=on&showmore=on&one-row=on&hideDate=on&same-height=off"
        frameBorder="0"
        scrolling="yes"
        width="100%"
        height={"600px"}
      ></iframe>
    </div>
  );
};

export default Reviews;
