/* eslint-disable react/no-unescaped-entities */

import Image from "next/image";
import classes from "./Footer.module.css";

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
          <form
            name="subscribers"
            netlify
            className={classes["form"]}
          >
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              required
              className={`${classes["form-input"]} ${classes["form-input__email"]}`}
            />
            <input
              type="submit"
              className={`btn ${classes["form-input"]} ${classes["form-input__btn"]}`}
              value="Subscribe"
            />
          </form>
          <div className={classes["form-info"]}>
            <div>Never Spam</div>
            <div className="dot-divider"></div>
            <div>Unsubscribe anytime</div>
          </div>
        </div>
      </div>

      <div className={classes["footer__body"]}>
        <div className={classes["footer__body-half"]}>
          <Image
            className={classes["footer-icon-circle"]}
            src="./assets/icons/circle.svg"
            width={24}
            height={24}
            alt=""
          />
          <div className={classes["footer-logo-wrapper"]}>
            <Image
              className={classes["footer__logo"]}
              src="./assets/logo/bh-logo.svg"
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
            We are inspired by change. That is why we are trying to disrupt the
            way people renovate their homes. Our team takes care of your
            refurbishment project: home renovation, bathroom fitting, kitchen
            fitting and any aspect of general refurbishment you can think of.
          </p>

          <div className={classes["footer__body-social-wrapper"]}>
            <div className={classes["social-media"]}>
              <a
                href="http://twitter.com"
                target="_blank"
              >
                <Image
                  className={classes["social-icon"]}
                  src="./assets/icons/twitter-icon.svg"
                  alt="twitter"
                  width={24}
                  height={24}
                />
              </a>
            </div>

            <div className={classes["social-media"]}>
              <a
                href="http://instagram.com"
                target="_blank"
              >
                <Image
                  className={classes["social-icon"]}
                  src="./assets/icons/instagram-icon.svg"
                  alt="instagram"
                  width={24}
                  height={24}
                />
              </a>
            </div>

            <div className={classes["social-media"]}>
              <a
                href="http://facebook.com"
                target="_blank"
              >
                <Image
                  className={classes["social-icon"]}
                  src="./assets/icons/facebook-icon.svg"
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
              <a
                href="./pages/bathroom-renovation.html"
                className={classes["footer__quarter-link"]}
              >
                Bathrooms
              </a>
              <a
                href="./pages/kitchen-renovation.html"
                className={classes["footer__quarter-link"]}
              >
                Kitchens
              </a>
              <a
                href="./pages/general-renovation.html"
                className={classes["footer__quarter-link"]}
              >
                Renovation
              </a>
              <a
                href="./pages/about.html"
                className={classes["footer__quarter-link"]}
              >
                About us
              </a>
              <a
                href="./pages/blog.html"
                className={classes["footer__quarter-link"]}
              >
                Blog
              </a>
              <a
                href="./pages/faq.html"
                className={classes["footer__quarter-link"]}
              >
                FAQ
              </a>
              <a
                href="./pages/contact.html"
                className={classes["footer__quarter-link"]}
              >
                Contact
              </a>
              <a
                href="./pages/our-guarantee.html"
                className={classes["footer__quarter-link"]}
              >
                Guarantee
              </a>
            </div>
          </div>

          <div className={classes["footer__body-quarter"]}>
            <h3 className={classes["footer__quarter-title"]}>Reviews</h3>

            <div className={`${classes["footer__quarter-link-wrapper"]} mb-3`}>
              <a
                href="https://www.houzz.co.uk/pro/betterhomesstudio/better-homes-studio-celli"
                className={classes["footer__quarter-link"]}
                target="blank"
              >
                Houzz
              </a>
              <a
                href="https://g.page/r/CaGIVAg_unOVEBM/"
                className={classes["footer__quarter-link"]}
                target="blank"
              >
                Google
              </a>
              <a
                href="https://www.mybuilder.com/profile/view/celli/feedback"
                className={classes["footer__quarter-link"]}
                target="blank"
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
              <a
                href="privacy-policy.html"
                className={classes["footer__quarter-link"]}
              >
                Privacy policy
              </a>
              <a
                href="terms-and-conditions.html"
                className={classes["footer__quarter-link"]}
              >
                T's & C's
              </a>
            </div>
          </div>
        </div>

        <div className={classes["footer__body-copyright"]}>
          <div>&copy; 2023 - Better Homes Studio</div>
          <div className="dot-divider"></div>
          <div>
            Created with ❤️ by{" "}
            <a
              className={classes["footer__copyright-link"]}
              href="https://ginostoian.com"
              target="blank"
            >
              Gino Stoian
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
