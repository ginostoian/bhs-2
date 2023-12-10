/* eslint-disable react/no-unescaped-entities */

import Image from "next/image";
import Link from "next/link";

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
            netlify="true"
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
            src="/assets/icons/circle.svg"
            width={24}
            height={24}
            alt=""
          />
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
              <a
                href="http://twitter.com"
                target="_blank"
              >
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
              <a
                href="https://www.facebook.com/bhomes.studio"
                target="_blank"
              >
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
                href="/pages/bathroom-renovation"
                className={classes["footer__quarter-link"]}
              >
                Bathrooms
              </Link>
              <Link
                href="/pages/kitchen-renovation"
                className={classes["footer__quarter-link"]}
              >
                Kitchens
              </Link>
              <Link
                href="/pages/general-renovation"
                className={classes["footer__quarter-link"]}
              >
                Renovation
              </Link>
              <Link
                href="/pages/about"
                className={classes["footer__quarter-link"]}
              >
                About us
              </Link>
              <Link
                href="/pages/blog"
                className={classes["footer__quarter-link"]}
              >
                Blog
              </Link>
              <Link
                href="/pages/faq"
                className={classes["footer__quarter-link"]}
              >
                FAQ
              </Link>
              <Link
                href="/pages/contact"
                className={classes["footer__quarter-link"]}
              >
                Contact
              </Link>
              <Link
                href="/pages/our-guarantee"
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
                href="/pages/privacy-policy"
                className={classes["footer__quarter-link"]}
              >
                Privacy policy
              </Link>
              <Link
                href="/pages/terms-and-conditions"
                className={classes["footer__quarter-link"]}
              >
                T's & C's
              </Link>
            </div>
          </div>
        </div>

        <div className={classes["footer__body-copyright"]}>
          <div>&copy; {new Date().getFullYear()} - Better Homes Studio</div>
          <div className="dot-divider"></div>
          <div>
            made by{" "}
            <a
              className={classes["footer__copyright-link"]}
              href="https://ginostoian.com"
              target="_blank"
            >
              gnst_o
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
