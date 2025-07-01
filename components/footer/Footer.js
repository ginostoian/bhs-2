/* eslint-disable react/no-unescaped-entities */

import Image from "next/image";
import Link from "next/link";

import classes from "./Footer.module.css";
import SubscribeForm from "./SubscribeForm";

const Footer = () => {
  return (
    <footer className="container">
      <div className={classes["footer__subscribe"]}>
        <div className={classes["footer__subscribe-left"]}>
          <p className={classes["subscribe-left__subtitle"]}>
            👍&nbsp;Join our mailing list and get inspired
          </p>
          <h3 className={classes["subscribe-left__title"]}>
            Subscribe to our Newsletter
          </h3>
        </div>

        <div className={classes["footer__subscribe-right"]}>
          <SubscribeForm />
          <div className={classes["form-info"]}>
            <div>Never Spam</div>
            <div className="dot-divider"></div>
            <div>Unsubscribe anytime</div>
          </div>
        </div>
      </div>

      <div className={classes["footer__body"]}>
        <div className={classes["footer__body-half"]}>
          {/* <Image
            className={classes["footer-icon-circle"]}
            src="/assets/icons/circle.svg"
            width={24}
            height={24}
            alt=""
          /> */}
          <div className={classes["footer-logo-wrapper"]}>
            <Image
              className={classes["footer__logo"]}
              src="/assets/logo/bh-logo.svg"
              alt="better homes studio logo"
              width={100}
              height={100}
            />
            <h3 className={classes["footer__logo-text"]}>
              Better Homes{" "}
              <span className={classes["main-nav__logo-text-accent"]}>
                Studio
              </span>
            </h3>
          </div>

          <p className={classes["footer__body-desc"]}>
            We are inspired by change. That is why we are trying to change the
            way people renovate their homes. Our team takes care of your
            refurbishment project: home renovation, bathroom fitting, kitchen
            fitting and any aspect of general refurbishment you can think of.
          </p>

          <div className={classes["footer__body-social-wrapper"]}>
            <div className={classes["social-media"]}>
              <a href="http://twitter.com" target="_blank">
                <Image
                  className={classes["social-icon"]}
                  src="/assets/icons/twitter-icon.svg"
                  alt="twitter"
                  width={24}
                  height={24}
                />
              </a>
            </div>

            <div className={classes["social-media"]}>
              <a
                href="https://www.instagram.com/better.homes.studio"
                target="_blank"
              >
                <Image
                  className={classes["social-icon"]}
                  src="/assets/icons/instagram-icon.svg"
                  alt="instagram"
                  width={24}
                  height={24}
                />
              </a>
            </div>

            <div className={classes["social-media"]}>
              <a href="https://www.facebook.com/bhomes.studio" target="_blank">
                <Image
                  className={classes["social-icon"]}
                  src="/assets/icons/facebook-icon.svg"
                  alt="facebook"
                  width={24}
                  height={24}
                />
              </a>
            </div>
          </div>
          <div className={classes.carbonNeutral}>
            <a
              href="https://carbonneutralwebsite.org/"
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="https://carbonneutralwebsite.org/api/banner/bhstudio.co.uk/30.89mg/dark.svg"
                width={300}
                height={150}
                alt="Carbon impact of this web page"
              />
            </a>
          </div>
        </div>

        <div className={classes["footer__quarter-wrapper"]}>
          <div className={classes["footer__body-quarter"]}>
            <h3 className={classes["footer__quarter-title"]}>Navigation</h3>

            <div className={classes["footer__quarter-link-wrapper"]}>
              <Link
                href="/bathroom-renovation"
                className={classes["footer__quarter-link"]}
              >
                Bathrooms
              </Link>
              <Link
                href="/kitchen-renovation"
                className={classes["footer__quarter-link"]}
              >
                Kitchens
              </Link>
              <Link
                href="/general-renovation"
                className={classes["footer__quarter-link"]}
              >
                Renovation
              </Link>
              <Link
                href="/partner-with-us"
                className={classes["footer__quarter-link"]}
              >
                Partner with us
              </Link>
              <Link href="/about" className={classes["footer__quarter-link"]}>
                About us
              </Link>
              <Link href="/blog" className={classes["footer__quarter-link"]}>
                Blog
              </Link>
              <Link href="/faq" className={classes["footer__quarter-link"]}>
                FAQ
              </Link>
              <Link href="/tools" className={classes["footer__quarter-link"]}>
                Free Tools
              </Link>
              <Link href="/contact" className={classes["footer__quarter-link"]}>
                Contact
              </Link>
              <Link
                href="/our-guarantee"
                className={classes["footer__quarter-link"]}
              >
                Guarantee
              </Link>
            </div>
          </div>

          <div className={classes["footer__body-quarter"]}>
            <h3 className={classes["footer__quarter-title"]}>Reviews</h3>

            <div className={`${classes["footer__quarter-link-wrapper"]} mb-3`}>
              <a
                href="https://www.houzz.co.uk/pro/betterhomesstudio/better-homes-studio-celli"
                className={classes["footer__quarter-link"]}
                target="_blank"
              >
                Houzz
              </a>
              <a
                href="https://g.page/r/CaGIVAg_unOVEBM/"
                className={classes["footer__quarter-link"]}
                target="_blank"
              >
                Google
              </a>
              <a
                href="https://www.mybuilder.com/profile/view/celli/feedback"
                className={classes["footer__quarter-link"]}
                target="_blank"
              >
                MyBuilder
              </a>
            </div>

            <h3 className={classes["footer__quarter-title"]}>
              Contact & Legal
            </h3>

            <div className={classes["footer__quarter-link-wrapper"]}>
              <a
                href="tel:07922391591"
                className={classes["footer__quarter-link"]}
              >
                Call us
              </a>
              <Link
                href="/privacy-policy"
                className={classes["footer__quarter-link"]}
              >
                Privacy policy
              </Link>
              <Link href="/tos" className={classes["footer__quarter-link"]}>
                T's & C's
              </Link>
            </div>
          </div>
        </div>

        <div className={classes["footer__body-copyright"]}>
          <div>
            Copyright &copy; {new Date().getFullYear()} - The Wisehome Group
            Limited
          </div>
          <div>Trading as Better Homes Studio</div>
          <div className="dot-divider"></div>
          <div>
            <a
              href="https://ginostoian.com"
              title="Go to Gino's website"
              target="_blank"
              className="inline-block cursor-pointer rounded bg-neutral px-2 py-1 text-sm text-neutral-content ring-1 ring-base-content/10 duration-200 hover:ring-neutral"
            >
              <div className="flex items-center gap-1">
                <span className="opacity-90">Built by</span>
                <span className="flex items-center gap-0.5 font-semibold tracking-tight">
                  <svg
                    className="size-5"
                    viewBox="0 0 375 509"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M233.962 11.7151L233.954 11.7229L186.393 57.3942L186.392 57.3948C116.335 124.657 57.1377 202.349 10.9069 287.707L10.8624 287.789L10.8164 287.87C10.5281 288.38 10.3791 288.954 10.383 289.537C10.387 290.12 10.5438 290.693 10.839 291.198C11.1342 291.704 11.5582 292.125 12.0701 292.419C12.5819 292.713 13.1633 292.868 13.756 292.869H129.042H139.042V302.869V494.875V494.888C139.042 495.535 139.229 496.17 139.584 496.715L131.361 502.072L139.584 496.715C139.939 497.26 140.447 497.692 141.048 497.957C141.648 498.222 142.314 498.308 142.963 498.202C143.613 498.096 144.215 497.804 144.698 497.365L144.7 497.363L165.966 477.999L165.97 477.996C239.677 410.959 302.226 332.637 351.272 245.969L351.274 245.966L364.435 222.73L364.44 222.721L364.445 222.712C364.735 222.203 364.885 221.627 364.882 221.043C364.879 220.459 364.723 219.886 364.427 219.379C364.132 218.872 363.707 218.45 363.194 218.156C362.681 217.862 362.099 217.707 361.505 217.707H361.5H249.685H239.685V207.707V14.1248C239.685 13.47 239.492 12.8285 239.129 12.28M233.962 11.7151L239.129 12.28M233.962 11.7151C234.438 11.2571 235.04 10.9473 235.694 10.8267C236.349 10.7061 237.024 10.7805 237.635 11.0399C238.246 11.2993 238.765 11.7314 239.129 12.28M233.962 11.7151L247.465 6.75675L239.129 12.28"
                      fill="#FFBE18"
                      stroke="black"
                      strokeWidth="20"
                    />
                  </svg>
                  Gino
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
