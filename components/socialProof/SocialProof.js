import Image from "next/image";

const SocialProof = () => {
  return (
    <section className="mx-auto max-w-[90%]">
      <p className="standout">
        <span className="text-[#266bf1]">5 star</span> rated and{" "}
        <span className="text-[#266bf1]">award </span>
        winning renovation company
      </p>

      <div className="logo-wrapper">
        <Image
          src="/assets/img/social/google-reviews.png"
          alt="better homes studio on google"
          className="logo-wrapper__brand brand-google"
          width={100}
          height={100}
        />
        <Image
          src="/assets/img/social/houzz-award.png"
          alt="better homes studio on houzz"
          className="logo-wrapper__brand"
          width={100}
          height={100}
        />
        <Image
          src="/assets/img/social/houzz-award-2023.png"
          alt="better homes studio on houzz"
          className="logo-wrapper__brand"
          width={100}
          height={100}
        />
        <Image
          src="/assets/img/social/mybuilder-reviews.png"
          alt="better homes studio on mybuilder"
          className="logo-wrapper__brand"
          width={100}
          height={100}
        />
        <Image
          src="/assets/img/social/houzz-reviews.png"
          alt="better homes studio on houzz"
          className="logo-wrapper__brand"
          width={100}
          height={100}
        />
      </div>
    </section>
  );
};

export default SocialProof;
