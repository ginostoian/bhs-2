import Image from "next/image";

import classes from "./SocialProof.module.css";

const SocialProof = () => {
  return (
    <section className="container">
      <p className="standout">
        <span className="accent-word">5 star</span> rated and{" "}
        <span className="accent-word">award</span>
        winning company
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
